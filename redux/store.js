import { configureStore } from "@reduxjs/toolkit";
import addFoodSlice from "./addFoodSlice"

export const store = configureStore({
  reducer:{
    foodManagement : addFoodSlice
  }
}) 