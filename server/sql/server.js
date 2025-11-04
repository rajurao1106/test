import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ API working without dotenv!");
});

// ✅ GET Users
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students");
    res.json(rows);
  } catch (err) {
    console.error("❌ GET /users DB Error:", err.message);
    res.status(500).json({ error: err.message }); // ✅ Show actual error
  }
});


// ✅ POST Users
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  console.log("Received:", req.body);

  try {
    const [result] = await pool.query(
      "INSERT INTO students (name, email) VALUES (?, ?)",
      [name, email]
    );

    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.log("DB INSERT Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Static port or Render compatible fallback
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running port ${PORT}`));
