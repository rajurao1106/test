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
      const body = {
        prompt:
          "You will help me practice a script. Only speak the lines of your assigned character. Do not add anything.",
        temperature: 0,
        max_output_tokens: 256,
      };

      const resp = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      const output =
        data?.candidates?.[0]?.content?.[0]?.text ||
        JSON.stringify(data);

      addLog("Gemini says: " + output);
      speakText(output);

      setInitialized(true);
    } catch (e) {
      addLog("Init error: " + e.message);
    }
  }

  function speakText(text, callback) {
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.onend = () => {
      if (callback) callback();
      if (waitingForUserRef.current) startListening();
    };
    synthRef.current.speak(u);
  }

  function parseScript(script) {
    const arr = script
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const m = l.match(/^([^:]+):\s*(.*)$/);
        if (!m) return null;
        return { speaker: m[1], text: m[2] };
      })
      .filter(Boolean);

    setLines(arr);
    return arr;
  }

  function startSession() {
    const parsed = parseScript(scriptText);
    setIdx(0);
    setTimeout(() => handleTurn(parsed, 0), 500);
  }

  // ---------------------------------------------------
  // 🔥 MAIN FIX — CORRECT CONVERSATION FLOW
  // ---------------------------------------------------
  function handleTurn(parsed, i) {
    if (i >= parsed.length) {
      speakText("Scene complete.");
      waitingForUserRef.current = false;
      return;
    }

    const line = parsed[i];
    setIdx(i);
    addLog(`${line.speaker}: ${line.text}`);

    // ---------------------------------------------------
    // AI TURN (assistant)
    // ---------------------------------------------------
    if (line.speaker === role) {
      waitingForUserRef.current = true;

      speakText(line.text, () => {
        // Wait for user's line (i+1 must be user line)
        startListening((spoken) => {
          const expected = parsed[i + 1]?.text || "";

          if (normalize(spoken) === normalize(expected)) {
            addLog("User correct.");
            handleTurn(parsed, i + 2); // jump to next AI line
          } else {
            addLog("Mismatch: " + spoken);
            speakText(
              `You said: ${spoken}. The correct line is: ${expected}. Please repeat.`,
              () => {
                startListening((retry) => {
                  if (normalize(retry) === normalize(expected)) {
                    addLog("Correct after retry.");
                    handleTurn(parsed, i + 2);
                  } else {
                    addLog("Still incorrect. Skipping forward.");
                    handleTurn(parsed, i + 2);
                  }
                });
              }
            );
          }
        });
      });

      return;
    }

    // ---------------------------------------------------
    // USER TURN
    // ---------------------------------------------------
    waitingForUserRef.current = false;

    startListening((spoken) => {
      if (normalize(spoken) === normalize(line.text)) {
        addLog("User correct line.");
        handleTurn(parsed, i + 1);
      } else {
        addLog("User mismatch: " + spoken);
        speakText(
          `I heard ${spoken}. The correct line is: ${line.text}. Please repeat.`,
          () => {
            startListening((retry) => {
              if (normalize(retry) === normalize(line.text)) {
                addLog("Correct after retry.");
                handleTurn(parsed, i + 1);
              } else {
                addLog("Still incorrect. Moving on.");
                handleTurn(parsed, i + 1);
              }
            });
          }
        );
      }
    });
  }

  // ---------------------------------------------------
  // SPEECH RECOGNITION
  // ---------------------------------------------------
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

    rec.onend = () => setListening(false);

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

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Script Practice (Fully Fixed)</h1>

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
        <label className="font-medium">Role to play (AI will speak this role):</label>
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

      <div className="bg-black text-white p-3 mt-4 h-64 overflow-auto rounded">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
