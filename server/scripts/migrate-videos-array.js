import { pool } from "../src/db.js";

await pool.query(`ALTER TABLE rooms ADD COLUMN IF NOT EXISTS videos JSONB NOT NULL DEFAULT '[]'`);

await pool.query(`
  UPDATE rooms
  SET videos = jsonb_build_array(video)
  WHERE video IS NOT NULL AND videos = '[]'::jsonb
`);

await pool.query(`ALTER TABLE rooms DROP COLUMN IF EXISTS video`);

console.log("Migrated rooms.video -> rooms.videos.");
await pool.end();
