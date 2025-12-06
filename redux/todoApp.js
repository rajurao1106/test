import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todoapp",
  initialState: {
    value: []
  },
  reducers: {
    addTasks: (state, action) => {
      state.value.push({
        id: action.payload.id,
        task: action.payload.newTask,
        subTasks: []   // 👈 New field added
      });
    },

    addSubTask: (state, action) => {
      const { taskId, subTask } = action.payload;

      const task = state.value.find(item => item.id === taskId);
      if (task) {
        task.subTasks.push({
          id: Date.now(),
          title: subTask
        })
      }
    }
  }
});

export const { addTasks, addSubTask } = todoSlice.actions;
export default todoSlice.reducer;

