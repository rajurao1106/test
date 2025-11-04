import express from "express"
import cors from "cors"
import schemaStudentDetails from "./models/schemaStudentDetails.js"
import { connectDB } from "./db/mongoDB.js"

const app = express()
const port = 1337

app.use(express.json())
app.use(cors())

connectDB()

app.post("/post", async(req,res)=>{
try {
  const {name, age, address,} = req.body
  const student = new schemaStudentDetails({name, age, address})
  await student.save()
  res.status(201).json({message: "data sent successfully", data:student})
} catch (error) {
  console.error(error)
}
})

app.get("/get", async(req,res)=>{
try {
  const student = await schemaStudentDetails.find()
   res.status(201).json({message: "data get successfully", data:student})
} catch (error) {
  console.error(error)
}
})

app.listen(port,()=>console.log(`server running on http://localhost:${port}/get`))