import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { resolve, dirname, relative } from "path";
import { fileURLToPath } from "url";
import { readdirSync, statSync, createReadStream } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "..", ".env.local") });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMG_DIR = "C:\\Users\\Admin\\AppData\\Local\\Temp\\kitchen_images\\assets\\media";
const FOLDER = "kitchen";

function getAllFiles(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = resolve(dir, e.name);
    if (e.isDirectory()) {
      results.push(...getAllFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

async function uploadAll() {
  const files = getAllFiles(IMG_DIR);
  console.log(`Uploading ${files.length} files to Cloudinary folder "${FOLDER}"...`);

  for (const file of files) {
    const rel = relative(IMG_DIR, file).replace(/\\/g, "/");
    const publicId = `${FOLDER}/${rel.replace(/\.\w+$/, "")}`;
    try {
      const result = await cloudinary.uploader.upload(file, {
        public_id: publicId,
        folder: "",
        overwrite: true,
      });
      console.log(`OK  ${rel} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`ERR ${rel}: ${err.message}`);
    }
  }
  console.log("Done");
}

uploadAll();
