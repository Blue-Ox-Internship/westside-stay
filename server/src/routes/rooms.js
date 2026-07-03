import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms ORDER BY sort_order");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms." });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const {
    id,
    name,
    description,
    longDescription,
    maxGuests,
    bed,
    size,
    price,
    images,
    videos,
    amenities,
    sortOrder,
  } = req.body;

  if (!id?.trim() || !name?.trim() || price == null) {
    return res.status(400).json({ error: "id, name, and price are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO rooms (id, name, description, long_description, max_guests, bed, size, price, images, videos, amenities, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        id.trim(),
        name.trim(),
        description ?? "",
        longDescription ?? "",
        maxGuests ?? 1,
        bed ?? "",
        size ?? 0,
        price,
        JSON.stringify(images ?? []),
        JSON.stringify(videos ?? []),
        JSON.stringify(amenities ?? []),
        sortOrder ?? 0,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create room:", err);
    res.status(500).json({ error: "Failed to create room." });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  const {
    name,
    description,
    longDescription,
    maxGuests,
    bed,
    size,
    price,
    images,
    videos,
    amenities,
    sortOrder,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE rooms SET
        name = $1, description = $2, long_description = $3, max_guests = $4, bed = $5,
        size = $6, price = $7, images = $8, videos = $9, amenities = $10, sort_order = $11
       WHERE id = $12
       RETURNING *`,
      [
        name,
        description,
        longDescription,
        maxGuests,
        bed,
        size,
        price,
        JSON.stringify(images ?? []),
        JSON.stringify(videos ?? []),
        JSON.stringify(amenities ?? []),
        sortOrder ?? 0,
        req.params.id,
      ]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Room not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update room:", err);
    res.status(500).json({ error: "Failed to update room." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM rooms WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Room not found." });
    res.status(204).end();
  } catch (err) {
    console.error("Failed to delete room:", err);
    res.status(500).json({ error: "Failed to delete room." });
  }
});

export default router;
