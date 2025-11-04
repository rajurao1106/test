import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "taskManager",
  initialState: { value: [] },
  reducers: {
    addSubject: (state, action) => {
      state.value.push({ id: Date.now(), subject: action.payload });
    },
    removeSubject: (state, action) => {
      state.value = state.value.filter((val) => val.id !== action.payload);
    },
  },
});

export const { addSubject, removeSubject } = taskSlice.actions;
export default taskSlice.reducer;
