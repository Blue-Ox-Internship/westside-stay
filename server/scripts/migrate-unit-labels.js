import { pool } from "../src/db.js";

await pool.query(`ALTER TABLE rooms ADD COLUMN IF NOT EXISTS units JSONB NOT NULL DEFAULT '[]'`);
await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS unit_label TEXT`);

// Backfill room numbers for rooms that don't have any yet, based on their
// existing unit_count, so the count-based and label-based views agree.
const rooms = await pool.query(`SELECT id, name, unit_count, units FROM rooms`);
for (const room of rooms.rows) {
  if (Array.isArray(room.units) && room.units.length > 0) continue;
  const labels = Array.from({ length: room.unit_count }, (_, i) => `${room.name} ${i + 1}`);
  await pool.query(`UPDATE rooms SET units = $1 WHERE id = $2`, [JSON.stringify(labels), room.id]);
  console.log(room.id, "-> seeded units:", labels);
}

console.log("Migrated: rooms.units and bookings.unit_label added.");
await pool.end();
