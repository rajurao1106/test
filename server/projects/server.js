import express from "express"
import cors from "cors"
import { connectDB } from "./db/mongoDB"

const app = express()

connectDB()

