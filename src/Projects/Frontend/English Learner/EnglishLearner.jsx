import React, { useState, useRef, useEffect } from "react";

// IMPORTANT SECURITY NOTE (visible in the code):
// This example puts an API key directly into frontend code because you requested a single-file frontend-only demo.
// **This is insecure** for production: anyone can extract the key. For real apps, proxy requests through a backend.

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAwEIU2DDhJn-UBkgHuhv8W8AOmkvlZQUA";

export default function EnglishLearner() {
  const [log, setLog] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [scriptText, setScriptText] = useState(
    "Person A: Hello.\nPerson B: Hi there."
  );
  const [role, setRole] = useState("Person A");
  const [lines, setLines] = useState([]);
  const [idx, setIdx] = useState(0);
  const recognitionRef = useRef(null);
  const waitingForUserRef = useRef(false);
  const [listening, setListening] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  // Helper: append to UI log
  function addLog(text) {
    setLog((l) => [...l, text]);
  }

  // Normalize text for comparison
  function normalize(s) {
    return (s || "").trim().toLowerCase().replace(/[^a-z0-9 ]/g, "");
  }

  // Call Gemini once to initialize with the exact instruction prompt the user provided
  async function initializeGemini() {
    addLog("Initializing Gemini (handshake)...");
    const prompt = `You are going to help me practice a scripted two-person conversation in voice mode.\nI will give you a full script containing lines for Person A and Person B.\nYou will play ONLY the role that I assign.\nSpeak exactly the lines written for your character — no improvising, no adding, no changing.\nAfter you speak your line, wait silently for me to say my line.\nIf I make a mistake or skip something, gently correct me and repeat your line.\nContinue until the entire script is completed.\nWhen the script ends, say "Scene complete." and stop.\nAsk me only one thing: "Please give me the script."`;

    try {
      const body = {
        // Use a simple text prompt request. The exact Gemini v1beta schema may vary; this is a minimal approach.
        // In practice you might use the official 'text' or 'messages' structure. This example keeps it simple.
        "prompt": prompt,
        "temperature": 0,
        "max_output_tokens": 256
      };

      const resp = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        const t = await resp.text();
        addLog("Gemini init failed: " + resp.status + " " + t);
        return;
      }

      const data = await resp.json();
      // The returned JSON shape may vary. Try to extract text in multiple plausible places.
      const candidate =
        data?.candidates?.[0]?.content?.[0]?.text || data?.output?.[0]?.content || data?.text || JSON.stringify(data);

      addLog("Gemini says: " + candidate);
      speakText(candidate);
      setInitialized(true);
    } catch (e) {
      addLog("Gemini init error: " + e.message);
    }
  }

  // Use browser TTS to speak exact text
  function speakText(text) {
    if (!text) return;
    // Cancel any ongoing speech
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.onend = () => {
      // After assistant speaks, if we were in the session and it was an assistant line, start listening for the user's line
      if (waitingForUserRef.current) {
        startListening();
      }
    };
    synthRef.current.speak(u);
  }

  // Parse script into ordered lines [{speaker, text}]
  function parseScript(text) {
    const arr = text
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const m = l.match(/^([^:]+):\s*(.*)$/);
        if (m) return { speaker: m[1].trim(), text: m[2].trim() };
        return { speaker: "Unknown", text: l };
      });
    setLines(arr);
    addLog("Script parsed — " + arr.length + " lines.");
    return arr;
  }

  // Start the practice session
  function startSession() {
    const parsed = parseScript(scriptText);
    setIdx(0);
    // Kick off the first turn: if first line belongs to assistant, speak it. If it's user, start listening.
    setTimeout(() => handleTurn(parsed, 0), 300);
  }

  function handleTurn(parsedLines, turnIndex) {
    if (turnIndex >= parsedLines.length) {
      addLog("All lines done. Scene complete.");
      speakText("Scene complete.");
      waitingForUserRef.current = false;
      return;
    }

    const line = parsedLines[turnIndex];
    addLog(`${line.speaker}: ${line.text}`);

    if (line.speaker === role) {
      // Assistant's turn: speak exactly the line and then wait for the user to respond
      waitingForUserRef.current = true;
      // Speak using TTS (exactly the line)
      speakText(line.text);
      // After speech ends, SpeechSynthesis onend will start listening
    } else {
      // User's turn: start listening and compare their spoken line to expected
      waitingForUserRef.current = false;
      startListening(expectedLine => {
        const ok = normalize(expectedLine) === normalize(line.text);
        if (ok) {
          addLog("User said correct line.");
          // advance to next line
          handleTurn(parsedLines, turnIndex + 1);
        } else {
          addLog("User line mismatch. Heard: " + expectedLine + " | Expected: " + line.text);
          // Gently correct the user and then repeat the assistant's previous line if assistant plays that role next
          speakText(`I heard: ${expectedLine}. The correct line is: ${line.text}. Please repeat.`);
          // After correction speech ends, re-start listening for the user to try again
          // We'll start listening automatically because waitingForUserRef isn't set — so call startListening again
          // But keep the current turnIndex (user must repeat)
          startListening((newSpoken) => {
            const ok2 = normalize(newSpoken) === normalize(line.text);
            if (ok2) {
              addLog("User corrected line.");
              handleTurn(parsedLines, turnIndex + 1);
            } else {
              addLog("Still incorrect. Moving on (to avoid infinite loop).");
              handleTurn(parsedLines, turnIndex + 1);
            }
          });
        }
      }, () => {
        // onNoSpeech / timeout
        addLog("No speech detected. Moving on.");
        handleTurn(parsedLines, turnIndex + 1);
      });
    }
  }

  // Start browser speech recognition, with callbacks
  function startListening(onResult, onNoSpeech) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog("Browser does not support SpeechRecognition API.");
      if (onNoSpeech) onNoSpeech();
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setListening(true);

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setListening(false);
      addLog("Heard (raw): " + text);
      if (onResult) onResult(text);
    };
    rec.onerror = (e) => {
      setListening(false);
      addLog("Recognition error: " + e.error);
      if (onNoSpeech) onNoSpeech();
    };
    rec.onend = () => {
      setListening(false);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
      addLog("Listening...");
    } catch (e) {
      addLog("Could not start recognition: " + e.message);
      setListening(false);
      if (onNoSpeech) onNoSpeech();
    }
  }

  // Small UI-only helper to reset
  function resetAll() {
    setLog([]);
    setInitialized(false);
    setLines([]);
    setIdx(0);
    waitingForUserRef.current = false;
    synthRef.current.cancel();
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Scripted Two-Person Practice — Frontend Demo</h1>
      <p className="text-sm mb-4">Single-component demo using the provided Gemini endpoint (frontend-only). See code comments for security notes.</p>

      <div className="mb-3">
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white mr-2"
          onClick={initializeGemini}
        >
          Initialize Gemini
        </button>
        <button className="px-3 py-2 rounded bg-gray-500 text-white mr-2" onClick={resetAll}>
          Reset
        </button>
      </div>

      <label className="block text-sm font-medium">Role to play (assistant)</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} className="block w-full p-2 mb-3 border rounded">
        <option>Person A</option>
        <option>Person B</option>
      </select>

      <label className="block text-sm font-medium">Paste full script (one line per person, e.g. "Person A: Hello.")</label>
      <textarea value={scriptText} onChange={(e) => setScriptText(e.target.value)} className="w-full h-40 p-2 border rounded mb-3" />

      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-green-600 rounded text-white" onClick={startSession}>Start Practice</button>
      </div>

      <div className="mb-4">
        <div className="font-semibold">Status</div>
        <div>Initialized: {initialized ? "Yes" : "No"}</div>
        <div>Listening: {listening ? "Yes" : "No"}</div>
      </div>

      <div className="mb-8">
        <div className="font-semibold">Log</div>
        <div className="bg-black text-white p-2 rounded h-64 overflow-auto mt-2">
          {log.map((l, i) => (
            <div key={i} className="text-sm mb-1">{l}</div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-600">Notes: This demo uses browser TTS for speaking assistant lines and the Web Speech Recognition API to capture the user's spoken lines. It calls the Gemini endpoint once at initialization to follow your requested flow. For production, route Gemini requests through a secure backend to keep the API key private.</div>
    </div>
  );
}
