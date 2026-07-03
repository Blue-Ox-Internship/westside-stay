import { Router } from "express";
import cloudinary from "../cloudinary.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

// Issues a short-lived signature so the browser can upload a video
// straight to Cloudinary without the API secret ever reaching the client.
// Admin-only so random visitors can't mint upload credentials for our account.
router.get("/signature", requireAdmin, (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = req.query.folder === "exterior" ? "westside-stay/exterior" : "westside-stay/rooms";
  const paramsToSign = { timestamp, folder };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: paramsToSign.folder,
  });
});

export default router;
