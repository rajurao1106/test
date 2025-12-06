import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String },
    age: { type: Number },
    address: { type: String },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("validations", studentSchema);
