import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlicer";

export const store = configureStore({
  reducer: {
    taskManager: taskReducer,
  },
});
