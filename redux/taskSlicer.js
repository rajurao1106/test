import { createSlice } from "@reduxjs/toolkit"

const taskSlice = createSlice({
  name: "taskManager",
  initialState: {value:[]},
  reducers:{
    addTask:(state, action)=>{
      state.value.push(action.payload)
    },
    removeTask: (state, action)=>{
      state.value = state.value.filter((val)=>val.id !== action.payload)
    }
  }
})

export const {addTask, removeTask} = taskSlice.actions
export default taskSlice.reducer