import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT key, value FROM site_content");
    const content = Object.fromEntries(result.rows.map((r) => [r.key, r.value]));
    res.json(content);
  } catch (err) {
    console.error("Failed to fetch content:", err);
    res.status(500).json({ error: "Failed to fetch content." });
  }
});

router.put("/", requireAdmin, async (req, res) => {
  const entries = Object.entries(req.body ?? {});
  if (entries.length === 0) return res.status(400).json({ error: "No content keys provided." });

  try {
    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO site_content (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2`,
        [key, JSON.stringify(value)]
      );
    }
    const result = await pool.query("SELECT key, value FROM site_content");
    const content = Object.fromEntries(result.rows.map((r) => [r.key, r.value]));
    res.json(content);
  } catch (err) {
    console.error("Failed to update content:", err);
    res.status(500).json({ error: "Failed to update content." });
  }
});

export default router;
