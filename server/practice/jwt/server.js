import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import studentSchema from "./studentSchema.js";
import { connectDB } from "./connectDB.js";

connectDB();

const app = express();
const port = 1337;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post("/send-data", async (req, res) => {
  try {
    const { name, age, address } = req.body;
    const studentData = new studentSchema({ name, age, address });
    await studentData.save();
    res.status(201).json({ message: "data sant successfully", studentData });
  } catch (error) {
    console.error(error);
  }
});

app.get("/get-data", async (req, res) => {
  try {
    const studentData = await studentSchema.find();
    res.status(200).json({ message: "data get successfully", studentData });
  } catch (error) {
    console.error(error);
  }
});

app.delete("/delete-data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const studentData = await studentSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "data deleted successfully", studentData });
  } catch (error) {
    console.error(error);
  }
});

app.put("/update-data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const studentData = await studentSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "data updated successfully", studentData });
  } catch (error) {
    console.error(error);
  }
});

const SECRET_KEY = "secret_key";

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check if user exists
    const exists = await studentSchema.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const newUser = new studentSchema({ username, password: hashed });
    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await studentSchema.findOne({ username });
    if (!exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const matched = await bcrypt.compare(password, exists.password);
    if (!matched) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


const authenticate = async (req, res, next) => {
  try {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.json({ message: "error" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error(error);
  }
};

app.get("/protected", authenticate, (req, res) => {
  return res.status(200).json({ message: req.user.username });
});

app.listen(port, () => console.log(`http://localhost:${port}/get-data`));
