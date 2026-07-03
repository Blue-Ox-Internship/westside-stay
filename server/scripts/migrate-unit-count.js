import { pool } from "../src/db.js";

await pool.query(`ALTER TABLE rooms ADD COLUMN IF NOT EXISTS unit_count INTEGER NOT NULL DEFAULT 1`);

console.log("Migrated: rooms.unit_count added (defaulted to 1 for existing rooms).");
await pool.end();
