const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Manually load .env.local variables
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("Testing Cloudinary credentials...");
console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Loaded (15 digits)" : "MISSING!");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded (27 chars)" : "MISSING!");

const testBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

cloudinary.uploader.upload(testBase64, { folder: "test_shopora" })
  .then(result => {
    console.log("\n✅ SUCCESS! Cloudinary is working perfectly.");
    console.log("Uploaded URL:", result.secure_url);
    process.exit(0);
  })
  .catch(error => {
    console.error("\n❌ FAILED! Cloudinary error details:");
    console.error(error);
    process.exit(1);
  });
