import mongoose from "mongoose";

const schemaStudentDetails = new mongoose.Schema(
  {
    name: { type: String },
    age: { type: Number },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("validations", schemaStudentDetails);
