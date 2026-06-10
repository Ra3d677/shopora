import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const BASE = "https://277f9a7a.itagency-37p.pages.dev";
const FOLDER = "11g";

const IMAGES = [
  // Logos & icons
  { path: "assets/images/logo-transparent-01.png", id: "logo" },
  { path: "assets/images/ico-01.png", id: "favicon" },

  // Backgrounds
  { path: "assets/images/backgrounds/hand-ia-bgremove.png", id: "bg-hand-ia" },
  { path: "assets/images/backgrounds/computer-code.png", id: "about-computer" },
  { path: "assets/images/backgrounds/process.jpg", id: "process-center" },
  { path: "assets/images/backgrounds/geometry-tech.png", id: "bg-geometry" },
  { path: "assets/images/backgrounds/line-tech.png", id: "bg-line" },
  { path: "assets/images/backgrounds/hero-bg-2.jpg", id: "hero-bg-2" },
  { path: "assets/images/backgrounds/hero-bg-3.jpg", id: "hero-bg-3" },
  { path: "assets/images/backgrounds/hero-bg-4.jpg", id: "hero-bg-4" },
  { path: "assets/images/backgrounds/hero-edge-bg.jpg", id: "hero-edge-bg" },
  { path: "assets/images/backgrounds/map.png", id: "map" },

  // Portfolio
  { path: "assets/images/portfolio/project-1.png", id: "portfolio-1" },
  { path: "assets/images/portfolio/project-2.png", id: "portfolio-2" },
  { path: "assets/images/portfolio/project-3.png", id: "portfolio-3" },
  { path: "assets/images/portfolio/project-4.png", id: "portfolio-4" },
  { path: "assets/images/portfolio/project-5.png", id: "portfolio-5" },
  { path: "assets/images/portfolio/project-6.png", id: "portfolio-6" },

  // Company logos
  { path: "assets/images/companies/company-01.png", id: "company-1" },
  { path: "assets/images/companies/company-02.png", id: "company-2" },
  { path: "assets/images/companies/company-03.png", id: "company-3" },
  { path: "assets/images/companies/company-04.png", id: "company-4" },
  { path: "assets/images/companies/company-05.png", id: "company-5" },
  { path: "assets/images/companies/company-06.png", id: "company-6" },

  // Testimonials
  { path: "assets/images/testimonials/face-01.png", id: "testimonial-1" },
  { path: "assets/images/testimonials/face-02.png", id: "testimonial-2" },
  { path: "assets/images/testimonials/face-03.png", id: "testimonial-3" },
  { path: "assets/images/testimonials/face-04.png", id: "testimonial-4" },
  { path: "assets/images/testimonials/face-05.png", id: "testimonial-5" },
  { path: "assets/images/testimonials/face-06.png", id: "testimonial-6" },
  { path: "assets/images/testimonials/face-07.png", id: "testimonial-7" },
  { path: "assets/images/testimonials/face-08.png", id: "testimonial-8" },

  // Blog
  { path: "assets/images/blog/blog-01.jpg", id: "blog-1" },
  { path: "assets/images/blog/blog-02.jpg", id: "blog-2" },
  { path: "assets/images/blog/blog-03.jpg", id: "blog-3" },

  // Team
  { path: "assets/images/team/team-01.jpg", id: "team-1" },
  { path: "assets/images/team/team-02.jpg", id: "team-2" },
  { path: "assets/images/team/team-03.jpg", id: "team-3" },
  { path: "assets/images/team/team-04.jpg", id: "team-4" },
  { path: "assets/images/team/team-05.jpg", id: "team-5" },
  { path: "assets/images/team/team-06.jpg", id: "team-6" },
  { path: "assets/images/team/team-07.jpg", id: "team-7" },
  { path: "assets/images/team/team-08.jpg", id: "team-8" },

  // Services / icons
  { path: "assets/images/services/web-dev.jpg", id: "service-web" },
  { path: "assets/images/services/mobile.jpg", id: "service-mobile" },
  { path: "assets/images/services/cloud.jpg", id: "service-cloud" },
  { path: "assets/images/services/marketing.jpg", id: "service-marketing" },
  { path: "assets/images/services/ux.jpg", id: "service-ux" },
  { path: "assets/images/services/analytics.jpg", id: "service-analytics" },
];

async function uploadImage(url, publicId) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: FOLDER,
      public_id: publicId,
      resource_type: "image",
      transformation: [{ width: 2500, height: 2500, crop: "limit", fetch_format: "auto", quality: "auto" }],
    });
    console.log(`  ✅ ${publicId} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`  ❌ ${publicId}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`Uploading ${IMAGES.length} images to Cloudinary folder "${FOLDER}"...\n`);

  const results = {};
  for (const img of IMAGES) {
    const url = `${BASE}/${img.path}`;
    console.log(`Uploading: ${img.path}`);
    const cdnUrl = await uploadImage(url, img.id);
    if (cdnUrl) {
      results[img.id] = cdnUrl;
    }
  }

  // Generate TS file with all URLs
  const tsContent = `// Auto-generated Cloudinary URLs for the 11G template
export const IMG = ${JSON.stringify(results, null, 2)};
`;

  const outPath = path.resolve(__dirname, "../src/components/templates/11GImages.ts");
  fs.writeFileSync(outPath, tsContent, "utf-8");
  console.log(`\n✅ Written to ${outPath}`);
}

main().catch(console.error);
