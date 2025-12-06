import { configureStore } from "@reduxjs/toolkit";
import addFoodSlice from "./addFoodSlice"
import todoSlice from "./todoApp"

export const store = configureStore({
  reducer:{
    foodManagement : addFoodSlice,
    todoapp : todoSlice
  }
}) 