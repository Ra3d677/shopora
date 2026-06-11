import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({ path: 'E:/multo2/.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const BASE = 'https://html.templatio.com/fitgym/img';
const FOLDER = 'gym';
const IMAGES = [
  'favicon.png', 'logo.png',
  'gym1.jpg', 'gym2.jpg', 'gym3.jpg', 'gym4.jpg', 'gym5.png', 'gym6.jpg', 'gym7.jpg',
  'g1.jpg', 'g2.jpg', 'g3.jpg', 'g4.jpg', 'g5.jpg', 'g6.jpg',
  'testimonial-1.jpg', 'testimonial-2.jpg', 'testimonial-3.jpg',
  'trainer1.jpg', 'trainer2.jpg', 'trainer3.jpg',
];

async function run() {
  const results = {};
  const uploads = IMAGES.map(async (path) => {
    const id = path.replace(/\.\w+$/, '');
    try {
      const r = await cloudinary.uploader.upload(BASE + '/' + path, {
        folder: FOLDER, public_id: id, resource_type: 'image',
        transformation: [{ width: 2500, height: 2500, crop: 'limit', fetch_format: 'auto', quality: 'auto' }],
      });
      results[id] = r.secure_url;
      console.log('OK', id);
    } catch (e) {
      console.log('FAIL', id, e.message);
    }
  });
  await Promise.all(uploads);
  console.log('\n--- GYMImages.ts ---');
  console.log(JSON.stringify(results, null, 2));
}
run();
