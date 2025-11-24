export const initialState = {
  expenses: []
};

export function expenseReducer(state, action) {
  switch (action.type) {
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.payload] };

    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload)
      };

    case "LOAD":
      return { ...state, expenses: action.payload };

    default:
      return state;
  }
}
