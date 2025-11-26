// server/server.js
import 'dotenv/config'; // ensures env loaded early
import express from "express";
import cors from "cors";
import itemsRoutes from "./routes/itemsRoutes.js";

const app = express();
app.use(cors({ origin: true })); // allow all origins for dev
app.use(express.json({ limit: '10mb' })); // accommodate JSON payloads
app.use("/api", itemsRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));