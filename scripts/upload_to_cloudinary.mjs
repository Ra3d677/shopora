import { readdirSync, existsSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "dno6yitvw",
  api_key: "117497368837319",
  api_secret: "NVkfvTH2O9-dierpktdfT0YE1FA",
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = join(__dirname, "..", "temp_images");
const CLOUD_FOLDER = "hotel2";

function getAllFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...getAllFiles(full));
    else if (statSync(full).size > 0) files.push(full);
  }
  return files;
}

async function uploadFile(localPath) {
  const relative = localPath.replace(IMG_DIR + "\\", "").replace(IMG_DIR + "/", "");
  
  // Determine resource type
  const isVideo = /\.(mp4|webm|ogg)$/i.test(relative);
  const resourceType = isVideo ? "video" : "image";

  // Public ID without extension
  const publicId = `${CLOUD_FOLDER}/${relative.replace(/\\/g, "/").replace(/\.[^.]+$/, "")}`;

  try {
    const result = await cloudinary.v2.uploader.upload(localPath, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: false,
    });
    console.log(`OK: ${publicId} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`ERR: ${publicId}: ${err.message}`);
    return null;
  }
}

const files = getAllFiles(IMG_DIR);
console.log(`Found ${files.length} files to upload to ${CLOUD_FOLDER}/...`);

const CONCURRENCY = 5;
let completed = 0;
const results = [];

for (let i = 0; i < files.length; i += CONCURRENCY) {
  const batch = files.slice(i, i + CONCURRENCY);
  const batchResults = await Promise.all(batch.map(uploadFile));
  completed += batch.filter(Boolean).length;
  results.push(...batchResults.filter(Boolean));
  if (completed % 30 === 0 || completed === files.length) console.log(`Progress: ${completed}/${files.length}`);
}

console.log(`\nUpload complete: ${results.length} files uploaded`);
