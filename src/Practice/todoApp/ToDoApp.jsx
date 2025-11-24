import React, { useEffect, useState } from "react";

export default function ToDoApp() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = input;
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, input]);
    }
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">📝 To-Do List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Write a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className={`px-4 py-2 rounded-lg font-medium text-white transition 
              ${input.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {editingIndex !== null ? "Update" : "Add"}
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border"
            >
              <span>{task}</span>
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-500"
                  onClick={() => {
                    setEditingIndex(i);
                    setInput(task);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-gray-500 text-center mt-3">No tasks yet.</p>
        )}
      </div>
    </div>
  );
}
