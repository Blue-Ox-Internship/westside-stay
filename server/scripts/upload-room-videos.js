import { fileURLToPath } from "node:url";
import path from "node:path";
import cloudinary from "../src/cloudinary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../../public");

const uploads = [
  { file: "studio room.mov", public_id: "westside-stay/rooms/studio-room" },
  { file: "1bd room.mov", public_id: "westside-stay/rooms/one-bedroom" },
];

for (const { file, public_id } of uploads) {
  const result = await cloudinary.uploader.upload(path.join(publicDir, file), {
    resource_type: "video",
    public_id,
    overwrite: true,
  });
  console.log(public_id, "->", result.secure_url);
}
