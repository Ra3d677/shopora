import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({ path: 'E:/multo2/.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const BASE = 'https://uiparadox.co.uk/templates/lux_hotel/assets/media';
const FOLDER = 'hotel1';
const IMAGES = [
  'favicon.png', 'logo.png', 'mobile-logo.png', 'footer-logo.png',
  'background/banner-bg.png', 'background/banner-bg-2.png', 'background/banner-bg-3.png',
  'background/mobile-banner.png', 'background/mobile-banner-2.png', 'background/mobile-banner-3.png',
  'bg-shape/footer-bg-shape.png', 'bg-shape/right-corner-shape.png',
  'card-image/image-1.png', 'card-image/image-2.png', 'card-image/image-3.png', 'card-image/image-4.png',
  'card-image/image-8.png', 'card-image/image-9.png', 'card-image/image-10.png', 'card-image/image-11.png',
  'card-image/image-12.png', 'card-image/image-13.png', 'card-image/image-14.png', 'card-image/image-15.png',
  'card-image/image-16.png', 'card-image/image-17.png', 'card-image/image-18.png', 'card-image/image-19.png',
  'card-image/couple-room.png', 'card-image/family-room.png', 'card-image/deluxe-room.png',
  'card-image/double-room.png', 'card-image/single-room.png',
  'icon/arrow-dark.png', 'icon/double-bed-icon.png', 'icon/food-icon.png', 'icon/tv-icon.png',
  'icon/parking.png', 'icon/pets.png', 'icon/sea.png', 'icon/washing-machine.png', 'icon/washroom.png', 'icon/wiFi.png',
  'icon/breakfast.png', 'icon/internet-wifi.png', 'icon/king-bed.png', 'icon/led-tv.png', 'icon/swimming-pool.png', 'icon/washing-machine-2.png',
  'user/1.png', 'user/2.png', 'user/3.png', 'user/4.png',
  'user/user-5.png', 'user/user-6.png', 'user/user-8.png', 'user/user-9.png', 'user/user-10.png',
  'vector-shape/bottom-shape.png', 'vector-shape/right-top.png', 'vector-shape/right-bottom.png',
  'vector-shape/luxury-room-vec.png', 'vector-shape/mobile-room.png',
  'vector-shape/activities-vec.png', 'vector-shape/bottom-left.png', 'vector-shape/bottom-right.png',
  'vector-shape/center-shape.png', 'vector-shape/top-left.png', 'vector-shape/top-right.png',
  'vector-shape/blog-detail-vec.png',
  'blog/blog-detail.png', 'blog/blog-detail-1.png', 'blog/blog-detail-2.png',
  'gallery/1.png', 'gallery/2.png', 'gallery/3.png', 'gallery/4.png', 'gallery/5.png', 'gallery/6.png', 'gallery/7.png',
  'gallery/side-image-1.png', 'gallery/side-image-2.png', 'gallery/side-image-3.png',
];

async function run() {
  const results = {};
  const uploads = IMAGES.map(async (path) => {
    const id = path.replace(/\.\w+$/, '').replace(/\//g, '_');
    const url = BASE + '/' + path;
    try {
      const r = await cloudinary.uploader.upload(url, {
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
  console.log('\n--- Hotel1Images.ts ---');
  console.log(JSON.stringify(results, null, 2));
}
run();
