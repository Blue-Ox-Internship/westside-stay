import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, phone, roomId, checkIn, checkOut, guests, requests } = req.body;

  if (!name?.trim() || !phone?.trim() || !roomId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ error: "Missing required booking fields." });
  }

  try {
    const roomResult = await pool.query("SELECT unit_count FROM rooms WHERE id = $1", [roomId]);
    if (roomResult.rowCount === 0) {
      return res.status(400).json({ error: "Unknown room." });
    }
    const unitCount = roomResult.rows[0].unit_count;

    const overlap = await pool.query(
      `SELECT COUNT(*) FROM bookings WHERE room_id = $1 AND status = 'confirmed' AND check_in < $3 AND check_out > $2`,
      [roomId, checkIn, checkOut]
    );
    if (Number(overlap.rows[0].count) >= unitCount) {
      return res
        .status(409)
        .json({ error: "All units of this room are already booked for those dates. Please choose different dates." });
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
      "SELECT check_in, check_out FROM bookings WHERE room_id = $1 AND status = 'confirmed' ORDER BY check_in",
      [roomId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch availability:", err);
    res.status(500).json({ error: "Failed to fetch availability." });
  }
});

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  const { status, unitLabel } = req.body;
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  try {
    if (status !== "confirmed") {
      const result = await pool.query(
        "UPDATE bookings SET status = $1, unit_label = NULL WHERE id = $2 RETURNING *",
        [status, req.params.id]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: "Booking not found." });
      return res.json(result.rows[0]);
    }

    const bookingResult = await pool.query("SELECT * FROM bookings WHERE id = $1", [req.params.id]);
    if (bookingResult.rowCount === 0) return res.status(404).json({ error: "Booking not found." });
    const booking = bookingResult.rows[0];

    if (!unitLabel) {
      return res.status(400).json({ error: "A room number must be assigned to confirm this booking." });
    }

    const roomResult = await pool.query("SELECT units FROM rooms WHERE id = $1", [booking.room_id]);
    if (roomResult.rowCount === 0 || !roomResult.rows[0].units.includes(unitLabel)) {
      return res.status(400).json({ error: "That room number does not belong to this room type." });
    }

    const conflict = await pool.query(
      `SELECT 1 FROM bookings
       WHERE room_id = $1 AND status = 'confirmed' AND unit_label = $2 AND id != $3
         AND check_in < $5 AND check_out > $4
       LIMIT 1`,
      [booking.room_id, unitLabel, booking.id, booking.check_in, booking.check_out]
    );
    if (conflict.rowCount > 0) {
      return res.status(409).json({ error: `${unitLabel} is already booked for those dates.` });
    }

    const result = await pool.query(
      "UPDATE bookings SET status = 'confirmed', unit_label = $1 WHERE id = $2 RETURNING *",
      [unitLabel, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update booking status:", err);
    res.status(500).json({ error: "Failed to update booking status." });
  }
});

export default router;
