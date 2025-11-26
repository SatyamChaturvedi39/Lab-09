// server/controllers/itemsController.js
import pool from "../db.js";

export async function listItems(req, res) {
  const [rows] = await pool.query("SELECT id, title, mode, price, created_at FROM shipments ORDER BY created_at DESC");
  res.json({ items: rows });
}

export async function getItem(req, res) {
  const id = Number(req.params.id);
  const [rows] = await pool.query("SELECT id, title, description, mode, price, created_at FROM shipments WHERE id = ?", [id]);
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
}

// serve image as image/* (inline)
export async function getImage(req, res) {
  const id = Number(req.params.id);
  const [rows] = await pool.query("SELECT image, image_type FROM shipments WHERE id = ?", [id]);
  if (!rows.length || !rows[0].image) return res.status(404).end();
  res.setHeader("Content-Type", rows[0].image_type || "application/octet-stream");
  res.send(rows[0].image);
}

// download image (as attachment)
export async function downloadImage(req, res) {
  const id = Number(req.params.id);
  const [rows] = await pool.query("SELECT image, image_type, title FROM shipments WHERE id = ?", [id]);
  if (!rows.length || !rows[0].image) return res.status(404).end();
  res.setHeader("Content-Type", rows[0].image_type || "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${rows[0].title || 'image'}.bin"`);
  res.send(rows[0].image);
}

export async function createItem(req, res) {
  const { title, description, mode, price } = req.body;
  let image = null, image_type = null;
  if (req.file) { image = req.file.buffer; image_type = req.file.mimetype; }
  const [result] = await pool.query(
    "INSERT INTO shipments (title, description, mode, price, image, image_type) VALUES (?,?,?,?,?,?)",
    [title, description, mode, price || 0, image, image_type]
  );
  res.json({ id: result.insertId });
}

export async function updateItem(req, res) {
  const id = Number(req.params.id);
  const { title, description, mode, price } = req.body;
  if (req.file) {
    await pool.query("UPDATE shipments SET title=?, description=?, mode=?, price=?, image=?, image_type=? WHERE id=?",
      [title, description, mode, price || 0, req.file.buffer, req.file.mimetype, id]);
  } else {
    await pool.query("UPDATE shipments SET title=?, description=?, mode=?, price=? WHERE id=?",
      [title, description, mode, price || 0, id]);
  }
  res.json({ ok: true });
}

export async function deleteItem(req, res) {
  const id = Number(req.params.id);
  await pool.query("DELETE FROM shipments WHERE id = ?", [id]);
  res.json({ ok: true });
}