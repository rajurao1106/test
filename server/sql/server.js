// server.js
import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();
const app = express();

app.use(express.json());

// ✅ GET /users - Fetch all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM studentSchema');
    res.json(rows);  
  } catch (err) {  
    console.error(err);
    res.status(500).send('Server Error');
  }  
}); 

// ✅ POST /users - Add new user 
app.post('/users', async (req, res) => {
  const { name, email } = req.body; 
  try {
    const [result] = await pool.query(  
      'INSERT INTO studentSchema (name, email) VALUES (?, ?)', 
      [name, email] 
    ); 
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) { 
    console.error(err);
    res.status(500).send('Server Error');
  }
});
 
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
