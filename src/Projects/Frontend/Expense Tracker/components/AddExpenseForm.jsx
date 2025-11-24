import { useState } from "react";

export default function AddExpenseForm({ dispatch }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    dispatch({
      type: "ADD_EXPENSE",
      payload: {
        id: Date.now(),
        title,
        amount: Number(amount)
      }
    });

    setTitle("");
    setAmount("");
  };

  return (
    <form onSubmit={handleAdd} className="space-y-3 mb-6">
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full p-2 border rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Expense
      </button>
    </form>
  );
}
