import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, removeTask } from "../../../redux/taskSlicer";

export default function Redux() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const tasks = useSelector((state) => state.taskManager.value);
  const dispatch = useDispatch();

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={() => {
          dispatch(
            addTask({
              id: Date.now(),
              task: input,
              image: image,
            })
          );
          setInput("");
          setImage(null);
        }}
      >
        ADD TASK
      </button>
      {tasks.map((item) => (
        <ul key={item.id}>
          <li>
            <img src={URL.createObjectURL(item.image)} alt="task" width="50" />
            {item.task}
            <button onClick={() => dispatch(removeTask(item.id))}>
              DELETE
            </button>
          </li>
        </ul>
      ))}
    </div>
  );
}


