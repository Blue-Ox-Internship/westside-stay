import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, rating, text } = req.body;

  if (!name?.trim() || !rating || rating < 1 || rating > 5 || !text || text.trim().length < 8) {
    return res.status(400).json({ error: "Missing or invalid review fields." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reviews (name, rating, text) VALUES ($1, $2, $3) RETURNING *`,
      [name.trim(), rating, text.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create review:", err);
    res.status(500).json({ error: "Failed to create review." });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

router.get("/admin", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  try {
    const result = await pool.query("UPDATE reviews SET status = $1 WHERE id = $2 RETURNING *", [
      status,
      req.params.id,
    ]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Review not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update review status:", err);
    res.status(500).json({ error: "Failed to update review status." });
  }
});

export default router;
