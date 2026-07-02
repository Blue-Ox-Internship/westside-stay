import { Router } from "express";
import cloudinary from "../cloudinary.js";

const router = Router();

// Issues a short-lived signature so the browser can upload a video
// straight to Cloudinary without the API secret ever reaching the client.
router.get("/signature", (_req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: "westside-stay/rooms" };

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
