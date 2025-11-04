import mongoose from "mongoose";

const schemaStudentDetails = new mongoose.Schema({
    name: {type: String},
    age: {type: String},
    address: {type: String},
})

export default mongoose.model("validations", schemaStudentDetails)