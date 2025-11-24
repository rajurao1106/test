import { useState } from "react";
import { evaluate } from "mathjs";

export default function Calculator() {
  const [expression, setExpression] = useState("");

  const handleCalculate = () => {
    setExpression(String(evaluate(expression)));
  };

  return (
    <div className="max-w-xs mx-auto mt-10 p-4 bg-gray-900 text-white rounded-xl shadow-lg">
      {/* Display */}
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        className="w-full p-3 mb-4 text-right text-xl bg-gray-800 rounded focus:outline-none"
      />

      {/* Buttons Grid */}
<div className="grid grid-cols-4 text-center">
  {
  ["7","8","9","+","4","5","6","-","1","2","3","*","0",".","/","="].map((item, index)=>(
    <p key={index} onClick={()=>setExpression((val)=>val + item)}>{item}</p>
  ))
}
</div>
      <button
        onClick={handleCalculate}
        className="p-4 bg-gray-700 rounded hover:bg-gray-600 text-lg"
      >
        =
      </button>
    </div>
  );
}
