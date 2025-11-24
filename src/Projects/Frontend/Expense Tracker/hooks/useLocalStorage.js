import { useEffect, useReducer } from "react";
import { expenseReducer, initialState } from "./reducer/expenseReducer";

export default function App() {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load saved expenses on first render
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("expenses"));
    if (data) {
      dispatch({ type: "LOAD", payload: data });
    }
  }, []);

  // Save to LocalStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(state.expenses));
  }, [state.expenses]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

      <AddExpenseForm dispatch={dispatch} />
      <ExpenseList expenses={state.expenses} dispatch={dispatch} />
      <ExpenseChart expenses={state.expenses} />
    </div>
  );
}
