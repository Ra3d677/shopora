const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const envRaw = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf-8");
function env(key) {
  const m = envRaw.match(new RegExp(`^${key}\\s*=\\s*"?([^"\\r\\n]+)"?`, "m"));
  return m ? m[1].trim() : "";
}

cloudinary.config({
  cloud_name: env("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
  api_key: env("CLOUDINARY_API_KEY"),
  api_secret: env("CLOUDINARY_API_SECRET"),
  secure: true,
});

const images = [
  ["barbell", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&q=80"],
  ["hero-bg", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"],
  ["about", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"],
  ["trainer1", "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80"],
  ["trainer2", "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80"],
  ["trainer3", "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80"],
  ["trainer4", "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&q=80"],
  ["blog1", "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80"],
  ["blog2", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"],
  ["blog3", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"],
  ["pattern", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=50&q=80"],
];

async function upload() {
  for (const [name, url] of images) {
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder: "shopora/ironpeak",
        public_id: name,
        resource_type: "image",
      });
      console.log(`${name}: ${result.secure_url}`);
    } catch (e) {
      console.error(`${name}: FAILED - ${e.message}`);
    }
  }
}
upload().then(() => console.log("DONE"));
