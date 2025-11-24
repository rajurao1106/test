import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseChart from "./components/ExpenseChart";

import { useReducer, useEffect } from "react";
import { expenseReducer, initialState } from "./reducer/expenseReducer";

export default function ExpenseTracker() {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expenses"));
    if (saved) dispatch({ type: "LOAD", payload: saved });
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(state.expenses));
  }, [state.expenses]);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>

      {/* ✅ Add components here */}
      <AddExpenseForm dispatch={dispatch} />
      <ExpenseList expenses={state.expenses} dispatch={dispatch} />
      <ExpenseChart expenses={state.expenses} />
    </div>
  );
}
