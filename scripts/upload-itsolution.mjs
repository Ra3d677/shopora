import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({ path: 'E:/multo2/.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const BASE = 'https://multiit-demo-bfa45.web.app';
const FOLDER = 'itsolution';
const IMAGES = [
  'assets/images/logo-transparent-01.png',
  'assets/images/ico-01.png',
  'assets/images/backgrounds/hand-ia-bgremove.png',
  'assets/images/backgrounds/computer-code.png',
  'assets/images/backgrounds/process.jpg',
  'assets/images/backgrounds/geometry-tech.png',
  'assets/images/backgrounds/line-tech.png',
  'assets/images/portfolio/project-1.png',
  'assets/images/portfolio/project-2.png',
  'assets/images/portfolio/project-3.png',
  'assets/images/portfolio/project-4.png',
  'assets/images/portfolio/project-5.png',
  'assets/images/portfolio/project-6.png',
  'assets/images/companies/company-01.png',
  'assets/images/companies/company-02.png',
  'assets/images/companies/company-03.png',
  'assets/images/companies/company-04.png',
  'assets/images/companies/company-05.png',
  'assets/images/companies/company-06.png',
  'assets/images/testimonials/face-01.png',
  'assets/images/testimonials/face-02.png',
  'assets/images/testimonials/face-03.png',
  'assets/images/testimonials/face-04.png',
];

async function run() {
  const results = {};
  const uploads = IMAGES.map(async (path) => {
    const id = path.replace('assets/images/', '').replace(/\//g, '-').replace(/\.\w+$/, '');
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
  console.log('\n--- output ---');
  console.log(JSON.stringify(results, null, 2));
}
run();
