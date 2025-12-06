import express from "express";
import cors from "cors";
import schemaStudentDetails from "./models/schemaStudentDetails.js";
import { connectDB } from "./db/mongoDB.js";

connectDB();
const app = express();
const port = 1337;

app.use(express.json());
app.use(cors());


app.post("/send-data", async (req, res) => {
  try {
    const { name, age, address } = req.body;
    const studentData = new schemaStudentDetails({ name, age, address });
    await studentData.save();
    res.status(201).json({ studentData });
  } catch (error) {
    console.error(error);
  }
});

app.get("/get-data", async (req, res) => {
  try {
    const studentData = await schemaStudentDetails.find();
    res.status(200).json({ studentData });
  } catch (error) {
    console.error(error);
  }
});

app.delete("/delete-data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const studentData = await schemaStudentDetails.findByIdAndDelete(id);
    res.status(200).json({ studentData });
  } catch (error) {
    console.error(error);
  }
});

app.put("/update-data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const studentData = await schemaStudentDetails.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({ studentData });
  } catch (error) {
    console.error(error);
  }
});

app.listen(
  port,
  console.log(`server running on http://localhost:${port}/get-data`)
);
