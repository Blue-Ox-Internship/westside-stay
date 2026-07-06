import { pool } from "../src/db.js";

await pool.query(
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
   CHECK (status IN ('pending', 'approved', 'rejected'))`
);

// Reviews that already existed before moderation was added are already public
// on the site -- grandfather them in as approved instead of hiding them.
const result = await pool.query(
  `UPDATE reviews SET status = 'approved' WHERE status = 'pending' RETURNING id, name`
);
console.log("Grandfathered existing reviews as approved:", result.rows.map((r) => r.name));

console.log("Migrated: reviews.status added.");
await pool.end();
