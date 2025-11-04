import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSubject, removeSubject } from "../../../redux/taskSlicer";

export default function Redux() {
  const [subject, setSubject] = useState("");
  const subjectSelector = useSelector((state) => state.taskManager.value);
  const dispatch = useDispatch();

  return (
    <div className="flex ">
     <div className="bg-blue-500">
       <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <button onClick={() => dispatch(addSubject(subject))}>ADD SUBJECT</button>
      {subjectSelector.map((item, index) => (
        <ul>
          <li key={index}>{item.subject}</li>
          <button onClick={() => dispatch(removeSubject(item.id))}>
            Delete
          </button>
        </ul>
      ))}
     </div>
      <div className="bg-red-500">
      
      </div>
    </div>
  );
}
