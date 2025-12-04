// server/db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // 20s
  // If DB_CA (PEM) is provided, use it for ssl
  ...(process.env.DB_CA ? { ssl: { ca: process.env.DB_CA } } : {})
});

export default pool;