import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public")); // serves index.html, client.js, etc.

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("chat message", msg => {
    io.emit("chat message", msg); // send to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});