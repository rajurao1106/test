import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "rajurao@1337",
  database: "users",
  port: 3307,
});

export default pool;
