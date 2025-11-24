import mongoose from "mongoose";

const todoappSchema = new mongoose.Schema({
    task: {type:String}
})