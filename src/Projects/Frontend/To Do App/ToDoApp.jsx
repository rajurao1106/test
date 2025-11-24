import { Inbox, Plus, Pencil, Trash2, Sun, Moon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { ThemeUser } from "./ThemeContext";

export default function ToDoApp() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const { themeHandel, theme } = useContext(ThemeUser);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, input.trim()]);
    setInput("");
  };

  const updateTask = () => {
    if (editingIndex === null || !input.trim()) return;
    const updated = [...tasks];
    updated[editingIndex] = input.trim();
    setTasks(updated);
    setInput("");
    setEditingIndex(null);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const selectTaskForEdit = (index) => {
    setEditingIndex(index);
    setInput(tasks[index]);
  };

  return (
    <div
      className={`${
        theme ? "bg-white text-gray-900" : "bg-gray-900 text-gray-100"
      } min-h-screen p-6 transition-colors duration-300 flex justify-center`}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 py-2 bg-opacity-80 backdrop-blur-sm">
          <h1 className="text-3xl font-bold">Task Manager</h1>

          <button
            onClick={themeHandel}
            className="p-2 rounded-full hover:scale-110 transition"
          >
            {theme ? <Moon size={22} /> : <Sun size={22} />}
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            className={`flex-1 px-4 py-2 rounded-xl border ${
              theme
                ? "bg-gray-100 border-gray-300"
                : "bg-gray-800 border-gray-700"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {editingIndex !== null ? (
            <button
              onClick={updateTask}
              className="px-4 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1 transition-all shadow"
            >
              <Pencil size={16} />
              Save
            </button>
          ) : (
            <button
              onClick={addTask}
              className="px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 transition-all shadow"
            >
              <Plus size={16} />
              Add
            </button>
          )}
        </div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 opacity-80 animate-pulse">
            <Inbox size={60} className="mx-auto mb-4 opacity-60" />
            <p className="text-gray-400">No tasks yet — add your first one!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-4 rounded-xl shadow-sm border ${
                  theme
                    ? "bg-gray-50 hover:bg-gray-100 border-gray-200"
                    : "bg-gray-800 hover:bg-gray-700 border-gray-700"
                } transition`}
              >
                <span className="font-medium">{task}</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => selectTaskForEdit(index)}
                    className="p-2 rounded-lg hover:bg-yellow-200/40 transition"
                  >
                    <Pencil size={18} className="text-yellow-500" />
                  </button>

                  <button
                    onClick={() => removeTask(index)}
                    className="p-2 rounded-lg hover:bg-red-200/40 transition"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
