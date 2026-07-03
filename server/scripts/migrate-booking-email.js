import { pool } from "../src/db.js";

await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email TEXT`);

console.log("Migrated: bookings.email added.");
await pool.end();
