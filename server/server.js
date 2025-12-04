// server/server.js
import 'dotenv/config'; // ensures env loaded early
import express from "express";
import cors from "cors";
import itemsRoutes from "./routes/itemsRoutes.js";
import pool from './db.js';

const app = express();
app.use(cors({ origin: true })); // allow all origins for dev
app.use(express.json({ limit: '10mb' })); // accommodate JSON payloads
app.use("/api", itemsRoutes);
app.get('/_health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    res.json({ ok: true, db: !!rows });
  } catch (err) {
    console.error('DB health check failed:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));