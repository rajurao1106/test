import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTasks, addSubTask } from "../../../../redux/todoApp";

export default function EnglishLearner() {
  const [input, setInput] = useState("");
  const [subInput, setSubInput] = useState({});

  const task = useSelector((state) => state.todoapp.value);
  const dispatch = useDispatch();

  const taskHandle = () => {
    if (!input.trim()) return;
    dispatch(addTasks({ id: Date.now(), newTask: input }));
    setInput("");
  };

  const handleSubTask = (taskId) => {
    if (!subInput[taskId]?.trim()) return;
    dispatch(addSubTask({ taskId, subTask: subInput[taskId] }));
    setSubInput((prev) => ({ ...prev, [taskId]: "" }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        placeholder="Enter Task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={taskHandle}>ADD TASK</button>

      {task.map((item) => (
        <div key={item.id} style={{ marginTop: "20px" }}>
          <h3>📌 {item.task}</h3>

          <input
            type="text"
            placeholder="Add Sub-task"
            value={subInput[item.id] || ""}
            onChange={(e) =>
              setSubInput((prev) => ({ ...prev, [item.id]: e.target.value }))
            }
          />
          <button onClick={() => handleSubTask(item.id)}>Add Subtask</button>

          <ul style={{ marginLeft: "20px" }}>
            {item.subTasks.map((sub) => (
              <li key={sub.id}>➡️ {sub.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
