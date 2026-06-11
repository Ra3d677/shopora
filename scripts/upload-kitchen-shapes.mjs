import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { resolve, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "..", ".env.local") });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const files = [
  ["C:\\Users\\Admin\\AppData\\Local\\Temp\\kitchen_images\\assets\\media\\shape\\set-left.png", "kitchen/shape/set-left"],
  ["C:\\Users\\Admin\\AppData\\Local\\Temp\\kitchen_images\\assets\\media\\shape\\set-right.png", "kitchen/shape/set-right"],
  ["C:\\Users\\Admin\\AppData\\Local\\Temp\\kitchen_images\\assets\\media\\shape\\object-left.png", "kitchen/shape/object-left"],
  ["C:\\Users\\Admin\\AppData\\Local\\Temp\\kitchen_images\\assets\\media\\shape\\object-right.png", "kitchen/shape/object-right"],
  ["C:\\Users\\Admin\\AppData\\Local\\Temp\\kitchen_images\\assets\\media\\shape\\quote.png", "kitchen/shape/quote"],
  ["C:\\Users\\Admin\\AppData\\Local\\Temp\\kitchen_images\\assets\\media\\banner\\bg.png", "kitchen/banner/bg"],
  ["C:\\Users\\Admin\\AppData\\Local\\Temp\\kitchen_images\\assets\\media\\banner\\banner.png", "kitchen/banner/banner"],
];

for (const [file, publicId] of files) {
  try {
    const result = await cloudinary.uploader.upload(file, { public_id: publicId, overwrite: true });
    console.log(`OK  ${publicId} -> ${result.secure_url}`);
  } catch (err) {
    console.error(`ERR ${publicId}: ${err.message}`);
  }
}
console.log("Done");
