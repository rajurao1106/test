import React, { useState, useRef } from "react";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAwEIU2DDhJn-UBkgHuhv8W8AOmkvlZQUA";

export default function EnglishLearner() {
  const [log, setLog] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const [scriptText, setScriptText] = useState(
`Person A: Hey, good morning! How’s everything going today?
Person B: Morning! Not too bad. Just getting started with work. You?
Person A: Same here. I’ve got a busy day ahead, but I’m trying to ease into it.
Person B: I feel that. Anything interesting on your schedule?
Person A: A couple of meetings and a deadline. Hoping everything runs smoothly.
Person B: Fingers crossed! Let me know if you need a break later — we can grab a coffee.
Person A: That actually sounds great. I’ll message you when I’m free.
Person B: Perfect. Talk soon!`
  );

  const [role, setRole] = useState("Person A");
  const [lines, setLines] = useState([]);
  const [idx, setIdx] = useState(0);

  const recognitionRef = useRef(null);
  const waitingForUserRef = useRef(false);
  const [listening, setListening] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  function addLog(text) {
    setLog((l) => [...l, text]);
  }

  function normalize(s) {
    return (s || "").trim().toLowerCase().replace(/[^a-z0-9 ]/g, "");
  }

  async function initializeGemini() {
    addLog("Initializing Gemini...");
    try {
      const prompt = `You are helping me practice a scripted two-person conversation. Only speak your assigned character's exact lines and wait for my spoken line after.`;

      const body = {
        prompt,
        temperature: 0,
        max_output_tokens: 256,
      };

      const resp = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await resp.json();
      const text =
        data?.candidates?.[0]?.content?.[0]?.text ||
        JSON.stringify(data);

      addLog("Gemini says: " + text);
      speakText(text);

      setInitialized(true);
    } catch (e) {
      addLog("Error: " + e.message);
    }
  }

  function speakText(text, cb) {
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";

    u.onend = () => {
      if (cb) cb();
      if (waitingForUserRef.current) startListening();
    };

    synthRef.current.speak(u);
  }

  function parseScript(text) {
    const arr = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const m = l.match(/^([^:]+):\s*(.*)$/);
        return m ? { speaker: m[1], text: m[2] } : null;
      })
      .filter(Boolean);

    setLines(arr);
    return arr;
  }

  function startSession() {
    const parsed = parseScript(scriptText);
    setIdx(0);

    setTimeout(() => handleTurn(parsed, 0), 300);
  }

  function handleTurn(parsed, i) {
    if (i >= parsed.length) {
      speakText("Scene complete.");
      waitingForUserRef.current = false;
      return;
    }

    const line = parsed[i];
    setIdx(i);

    addLog(`${line.speaker}: ${line.text}`);

    if (line.speaker === role) {
      // assistant turn
      waitingForUserRef.current = true;
      speakText(line.text);
    } else {
      // user turn
      waitingForUserRef.current = false;

      startListening((spoken) => {
        if (normalize(spoken) === normalize(line.text)) {
          addLog("Correct.");
          handleTurn(parsed, i + 1);
        } else {
          addLog("Mismatch: " + spoken);
          speakText(
            `You said: ${spoken}. The correct line is: ${line.text}. Please repeat.`,
            () => {
              startListening((retry) => {
                if (normalize(retry) === normalize(line.text)) {
                  addLog("Correct after retry.");
                  handleTurn(parsed, i + 1);
                } else {
                  addLog("Still incorrect, moving on.");
                  handleTurn(parsed, i + 1);
                }
              });
            }
          );
        }
      });
    }
  }

  function startListening(onResult, onNoSpeech) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addLog("SpeechRecognition unsupported.");
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
      setListening(false);
      const text = e.results[0][0].transcript;
      addLog("Heard: " + text);
      if (onResult) onResult(text);
    };

    rec.onerror = () => {
      setListening(false);
      if (onNoSpeech) onNoSpeech();
    };

    rec.start();
    recognitionRef.current = rec;

    addLog("Listening...");
  }

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
      {/* UI remains mostly unchanged */}

      <h1 className="text-2xl font-bold mb-2">
        Script Practice (Fixed Version)
      </h1>

      <button
        className="px-3 py-2 bg-blue-600 text-white"
        onClick={initializeGemini}
      >
        Initialize Gemini
      </button>

      <button
        className="px-3 py-2 bg-gray-600 text-white ml-2"
        onClick={resetAll}
      >
        Reset
      </button>

      <div className="mt-3">
        <label>Role to play</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full"
        >
          <option>Person A</option>
          <option>Person B</option>
        </select>
      </div>

      <textarea
        className="w-full border p-2 mt-3 h-48"
        value={scriptText}
        onChange={(e) => setScriptText(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-green-600 text-white mt-3"
        onClick={startSession}
      >
        Start Practice
      </button>

      <div className="bg-black text-white p-3 mt-4 h-64 overflow-auto">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
