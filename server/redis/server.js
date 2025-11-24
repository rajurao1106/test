import express from "express";
import { client } from "./client.js";

const app = express();

app.get("/", async (req, res) => {
  const cacheValue = await client.get("todos");
  if (cacheValue) return res.json(JSON.parse(cacheValue));
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await response.json();
  await client.set("todos", JSON.stringify(data));
  return res.json(data);
});

app.listen(9000, () => {
  console.log("server running on 9000");
});
