import { createSlice } from "@reduxjs/toolkit";

const addFoodSlice = createSlice({
  name: "foodManagement",
  initialState: { value: [] },
  reducers: {
    addFood: (state, action) => {
      state.value.push(action.payload);
    },
    removeFood: (state, action) => {
      state.value = state.value.filter((val) => val.id !== action.payload);
    },
  },
});

export const {addFood,removeFood} = addFoodSlice.actions
export default addFoodSlice.reducer;
