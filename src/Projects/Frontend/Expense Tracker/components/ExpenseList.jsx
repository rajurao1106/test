export default function ExpenseList({ expenses, dispatch }) {
  return (
    <div className="space-y-2">
      {expenses.length === 0 && (
        <p className="text-gray-500">No expenses yet.</p>
      )}

      {expenses.map((e) => (
        <div
          key={e.id}
          className="flex justify-between items-center bg-gray-100 p-3 rounded"
        >
          <div>
            <p className="font-medium">{e.title}</p>
            <p className="text-sm text-gray-600">${e.amount}</p>
          </div>

          <button
            onClick={() =>
              dispatch({ type: "DELETE_EXPENSE", payload: e.id })
            }
            className="text-red-600"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
