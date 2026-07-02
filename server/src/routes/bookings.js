import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, phone, roomId, checkIn, checkOut, guests, requests } = req.body;

  if (!name?.trim() || !phone?.trim() || !roomId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ error: "Missing required booking fields." });
  }

  try {
    const overlap = await pool.query(
      `SELECT 1 FROM bookings WHERE room_id = $1 AND check_in < $3 AND check_out > $2 LIMIT 1`,
      [roomId, checkIn, checkOut]
    );
    if (overlap.rowCount > 0) {
      return res.status(409).json({ error: "Those dates are already booked for this room. Please choose different dates." });
    }

    const result = await pool.query(
      `INSERT INTO bookings (name, phone, room_id, check_in, check_out, guests, requests)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name.trim(), phone.trim(), roomId, checkIn, checkOut, guests, requests ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create booking:", err);
    res.status(500).json({ error: "Failed to create booking." });
  }
});

router.get("/availability", async (req, res) => {
  const { roomId } = req.query;
  if (!roomId) return res.status(400).json({ error: "roomId is required." });

  try {
    const result = await pool.query(
      "SELECT check_in, check_out FROM bookings WHERE room_id = $1 ORDER BY check_in",
      [roomId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch availability:", err);
    res.status(500).json({ error: "Failed to fetch availability." });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

export default router;
