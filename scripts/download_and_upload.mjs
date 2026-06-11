import { readFileSync, writeFileSync, mkdirSync, existsSync, createWriteStream, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "https://uiparadox.co.uk/templates/lux_hotel/assets/media";
const OUT = join(__dirname, "..", "temp_images");
const CLOUD_FOLDER = "hotel2";
const htmlFile = "C:\\Users\\Admin\\AppData\\Local\\Temp\\full_hotel1.html";
const cssFile = "C:\\Users\\Admin\\AppData\\Local\\Temp\\hotel1_app.css";
const pagesDir = "C:\\Users\\Admin\\AppData\\Local\\Temp\\hotel_pages";

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const html = readFileSync(htmlFile, "utf8");
const css = readFileSync(cssFile, "utf8");
const paths = new Set();

// Extract from HTML <img>
let imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
let m;
while ((m = imgRegex.exec(html)) !== null) {
  let p = m[1].replace(/^\.\//, "");
  if (p.startsWith("assets/media/")) paths.add(p.slice("assets/media/".length));
}

// Extract from HTML inline background
let bgRegex = /background[^;]*url\(["']?([^"')]+)["']?\)/gi;
while ((m = bgRegex.exec(html)) !== null) {
  let p = m[1].replace(/^\.\//, "");
  if (p.startsWith("assets/media/")) paths.add(p.slice("assets/media/".length));
}

// Extract from CSS url()
let cssUrlRegex = /url\(["']?([^"')]+)["']?\)/gi;
while ((m = cssUrlRegex.exec(css)) !== null) {
  let p = m[1];
  if (p.startsWith("../media/")) paths.add(p.slice("../media/".length));
  else if (p.startsWith("media/")) paths.add(p.slice("media/".length));
  else if (p.startsWith("../")) paths.add(p.slice("../".length));
}

// Extract from other HTML pages
if (existsSync(pagesDir)) {
  for (const f of readdirSync(pagesDir)) {
    if (!f.endsWith(".html")) continue;
    const content = readFileSync(join(pagesDir, f), "utf8");
    let imgRegex2 = /<img[^>]+src=["']([^"']+)["']/gi;
    let m2;
    while ((m2 = imgRegex2.exec(content)) !== null) {
      let p = m2[1].replace(/^\.\//, "");
      if (p.startsWith("assets/media/")) paths.add(p.slice("assets/media/".length));
    }
    let bgRegex2 = /background[^;]*url\(["']?([^"')]+)["']?\)/gi;
    while ((m2 = bgRegex2.exec(content)) !== null) {
      let p = m2[1].replace(/^\.\//, "");
      if (p.startsWith("assets/media/")) paths.add(p.slice("assets/media/".length));
    }
  }
}

// Extract video paths
const videoPaths = new Set();
let vidSrcRegex = /<video[^>]+src=["']([^"']+)["']/gi;
while ((m = vidSrcRegex.exec(html)) !== null) {
  let p = m[1].replace(/^\.\//, "");
  if (p.startsWith("assets/media/")) videoPaths.add(p.slice("assets/media/".length));
}
let vidSourceRegex = /<source[^>]+src=["']([^"']+)["']/gi;
while ((m = vidSourceRegex.exec(html)) !== null) {
  let p = m[1].replace(/^\.\//, "");
  if (p.startsWith("assets/media/")) videoPaths.add(p.slice("assets/media/".length));
}

console.log(`Found ${paths.size} image paths, ${videoPaths.size} video paths`);

// Download with concurrency
async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, { timeout: 20000 }, (res) => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject).on("timeout", () => { file.destroy(); reject(new Error("timeout")); });
  });
}

const allPaths = [...paths, ...videoPaths];
let completed = 0;
const errors = [];
const CONCURRENCY = 10;

async function downloadBatch(batch) {
  return Promise.allSettled(batch.map(async (p) => {
    const url = `${BASE}/${p}`;
    const dir = join(OUT, dirname(p));
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const dest = join(OUT, p);
    if (existsSync(dest)) { completed++; return; }
    try {
      await download(url, dest);
      completed++;
      if (completed % 20 === 0 || completed === allPaths.length) console.log(`Downloaded ${completed}/${allPaths.length}`);
    } catch (e) {
      errors.push({ path: p, error: e.message });
    }
  }));
}

for (let i = 0; i < allPaths.length; i += CONCURRENCY) {
  await downloadBatch(allPaths.slice(i, i + CONCURRENCY));
}

console.log(`\nDownload complete: ${completed} files`);
if (errors.length > 0) {
  console.log(`Errors: ${errors.length}`);
  for (const e of errors.slice(0, 10)) console.log(`  ${e.path}: ${e.error}`);
}

// Generate upload commands
let uploadCmds = [];
for (const p of paths) {
  const localPath = join(OUT, p).replace(/\\/g, "/");
  const publicId = `${CLOUD_FOLDER}/${p.replace(/\\/g, "/").replace(/\.[^.]+$/, "")}`;
  uploadCmds.push(`cloudinary upload "${localPath}" --public_id "${publicId}" --overwrite`);
}
for (const v of videoPaths) {
  const localPath = join(OUT, v).replace(/\\/g, "/");
  const publicId = `${CLOUD_FOLDER}/${v.replace(/\\/g, "/").replace(/\.[^.]+$/, "")}`;
  uploadCmds.push(`cloudinary upload "${localPath}" --public_id "${publicId}" --resource_type video --overwrite`);
}
const uploadScript = join(OUT, "..", "upload_all.bat");
writeFileSync(uploadScript, uploadCmds.join("\n"), "utf8");
console.log(`\nUpload script: ${uploadScript} (${uploadCmds.length} commands)`);
