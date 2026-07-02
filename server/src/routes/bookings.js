import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, phone, roomId, checkIn, checkOut, guests, requests } = req.body;

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !roomId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ error: "Missing required booking fields." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (name, email, phone, room_id, check_in, check_out, guests, requests)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name.trim(), email.trim(), phone.trim(), roomId, checkIn, checkOut, guests, requests ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create booking:", err);
    res.status(500).json({ error: "Failed to create booking." });
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
