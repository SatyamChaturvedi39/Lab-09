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
  connectTimeout: 15000,    // 15s connect timeout
  acquireTimeout: 20000,
  // If DB_CA is provided (PEM string in env), use it for SSL
  ...(process.env.DB_CA ? { ssl: { ca: process.env.DB_CA } } : {})
});

export default pool;
