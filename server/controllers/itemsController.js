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

function extFromMime(mime) {
  if (!mime) return '.bin';
  const map = {
    'image/jpeg': '.jpg',
    'image/jpg':  '.jpg',
    'image/png':  '.png',
    'image/gif':  '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg'
  };
  return map[mime.toLowerCase()] || '';
}

export async function downloadImage(req, res) {
  const id = Number(req.params.id || 0);
  if (!id) return res.status(400).send('Invalid id');

  try {
    const [rows] = await pool.query('SELECT title, image, image_type FROM shipments WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).send('Not found');

    const row = rows[0];
    const mime = row.image_type || 'application/octet-stream';
    let buffer = row.image;

    // If you stored base64 text by mistake, convert:
    if (typeof buffer === 'string') {
      // detect base64: very cautious check
      if (/^[A-Za-z0-9+/=\r\n]+$/.test(buffer.trim())) {
        buffer = Buffer.from(buffer, 'base64');
      } else {
        // fallback: send string as text
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.send(buffer);
      }
    }

    if (!Buffer.isBuffer(buffer)) {
      return res.status(500).send('Image data not a buffer');
    }

    const filenameSafe = (row.title || `item-${id}`).replace(/[^a-z0-9_\-\.]/ig, '_');
    const ext = extFromMime(mime) || '.bin';
    const filename = `${filenameSafe}${ext}`;

    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('downloadItemImage error:', err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
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