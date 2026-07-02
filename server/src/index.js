import express from "express";
import cors from "cors";
import "dotenv/config";

import bookingsRouter from "./routes/bookings.js";
import reviewsRouter from "./routes/reviews.js";
import cloudinaryRouter from "./routes/cloudinary.js";

const app = express();

// Accept any localhost/127.0.0.1 origin in dev, since the Vite dev server's port can vary.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true);
      }
      if (origin === process.env.CLIENT_ORIGIN) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/bookings", bookingsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/cloudinary", cloudinaryRouter);

const port = process.env.PORT ?? 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
