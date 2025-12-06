// import express from "express";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import bodyParser from "body-parser";

// const app = express();
// const port = 5000;

// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// const users = [];
// const SECRET_KEY = "secret_key";

// app.use("/signup", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(404).json({ message: "fields are required" });
//   }

//   const exists = users.find((u) => u.username === username);
//   if (exists) {
//     return res.status(404).json({ message: "username exists" });
//   }
//   const hashed = await bcrypt.hash(password, 10);
//   users.push({ username, password: hashed });
//   res.status(201).json({ message: "User registered successfully" });
// });

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((u) => u.username === username);
//   if (!user) {
//     return res.status(404).json({ message: "user not available" });
//   }

//   const matched = await bcrypt.compare(password, user.password);
//   if (!matched) {
//     return res.status(404).json({ message: "login failed" });
//   }
//   const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
//   return res.status(200).json({ message: "login successfully", token });
// });

// const athentication = (req, res, next) => {
//   const authHeadres = req.headers["authorization"];
//   const token = authHeadres && authHeadres.split(" ")[1];

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) {
//       return res.json({ message: "error" });
//     }

//     req.user = user;
//     next();
//   });
// };

// app.get("/protected", athentication, (req, res) => {
//   return res.json({ message: req.user.username });
// });

// app.listen(port, () => {
//   console.log("server is running");
// });
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

const users = []
const SECRET_KEY = "secret_key"

app.post("/signup", async(req, res)=>{
  const {username, password} = req.body
  if(!username || !password){
    return res.status(201).json({message: "field require"})
  }

  const exist = users.find(u=>u.username === username)
  if(exist){
    return res.status(201).json({message: "username already exist"})
  }

  const hashed = await bcrypt.hash(password, 10)
  users.push({username, password: hashed})
  res.status(201).json({message: "signup successfully"})
})

app.post("/login", async(req, res)=>{
const {username, password} = req.body
const user = users.find(u=>u.username === username)
  if(!user){
    return res.status(201).json({message: "username not exist"})
  }

  const matched = await bcrypt.compare(password, user.password)
  if(!matched){
    return res.status(201).json({message: "password not mathed"})
  }

  const token = jwt.sign({username}, SECRET_KEY, {expiresIn: "1h"})
  res.status(200).json({message: "login successfully", token})
})

const authentication = async(req, res, next) => {
  const authHeaders = req.headers["authorization"]
  const token = authHeaders && authHeaders.split(" ")[1] 

  jwt.verify(token, SECRET_KEY, (err, user)=>{
    if(err){
      return res.json({message: "error"})
    }

    req.user = user
    next()
  })
}

app.get("/protected", authentication, (req, res)=>{
 res.json({message:req.user.username})
})

app.listen(port, console.log(`server running on http://localhost:${port}`))