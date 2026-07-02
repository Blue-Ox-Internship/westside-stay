import { Router } from "express";
import { pool } from "../db.js";

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
    const result = await pool.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

export default router;
