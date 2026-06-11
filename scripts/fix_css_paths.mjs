import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const cssPath = "E:\\multo2\\src\\components\\templates\\Hotel2Styles.css";
let css = readFileSync(cssPath, "utf8");

const CLOUD = "https://res.cloudinary.com/dno6yitvw/image/upload";
const V = "v178119";

// Map of CSS paths to Cloudinary public IDs (without version)
const pathMap = {
  "../media/icon/down-arrow.png": `${CLOUD}/${V}0781/hotel2/icon/down-arrow.png`,
  "../media/vector/attached.png": `${CLOUD}/${V}0792/hotel2/vector-shape/menu-vec.png`,
  "../media/bg-shape/top-left-corner-shape.png": `${CLOUD}/${V}0654/hotel2/bg-shape/top-left-corner-shape.png`,
  "../media/bg-shape/top-right-corner-shape.png": `${CLOUD}/${V}0654/hotel2/bg-shape/top-right-corner-shape.png`,
  "../media/bg-shape/heading-mobile-shape.png": `${CLOUD}/${V}0652/hotel2/bg-shape/heading-mobile-shape.png`,
  "../media/bg-shape/heading-mobile-shape-2.png": `${CLOUD}/${V}0652/hotel2/bg-shape/heading-mobile-shape-2.png`,
  "../media/bg-shape/footer-bgShape.png": `${CLOUD}/${V}0652/hotel2/bg-shape/footer-bgShape.png`,
  "../media/bg-shape/booking-bg-shape.png": `${CLOUD}/${V}0641/hotel2/bg-shape/booking-bg-shape.png`,
  "../media/bg-shape/booking-shape.png": `${CLOUD}/${V}0651/hotel2/bg-shape/booking-shape.png`,
  "../media/bg-shape/right-corner-shape.png": `${CLOUD}/${V}0654/hotel2/bg-shape/right-corner-shape.png`,
  "../media/bg-shape/footer-bg-shape.png": `${CLOUD}/${V}0651/hotel2/bg-shape/footer-bg-shape.png`,
  "../media/vector-shape/testimonial-top-vec.png": `${CLOUD}/${V}0794/hotel2/vector-shape/testimonial-top-vec.png`,
  "../media/vector-shape/banner-bottom-shape.png": `${CLOUD}/${V}0789/hotel2/vector-shape/banner-bottom-shape.png`,
  "../media/vector-shape/mobile-booking-outer.png": `${CLOUD}/${V}0792/hotel2/vector-shape/mobile-booking-outer.png`,
  "../media/vector-shape/mobile-booking-vec.png": `${CLOUD}/${V}0792/hotel2/vector-shape/mobile-booking-vec.png`,
  "../media/vector-shape/top-shape.png": `${CLOUD}/${V}0795/hotel2/vector-shape/top-shape.png`,
  "../media/vector-shape/body-right.png": `${CLOUD}/${V}0790/hotel2/vector-shape/body-right.png`,
  "../media/vector-shape/body-left.png": `${CLOUD}/${V}0789/hotel2/vector-shape/body-left.png`,
  "../media/vector-shape/room-gallery.png": `${CLOUD}/${V}0793/hotel2/vector-shape/room-gallery.png`,
  "../media/vector-shape/header-outset.png": `${CLOUD}/${V}0791/hotel2/vector-shape/header-outset.png`,
  "../media/vector-shape/header-inset.png": `${CLOUD}/${V}0791/hotel2/vector-shape/header-inset.png`,
  "../media/vector-shape/team-cornor.png": `${CLOUD}/${V}0794/hotel2/vector-shape/team-cornor.png`,
  "../media/vector-shape/restaurant-vec.png": `${CLOUD}/${V}0792/hotel2/vector-shape/restaurant-vec.png`,
  "../media/vector/form-texture.png": `${CLOUD}/${V}0792/hotel2/vector-shape/menu-vec.png`,
  "../media/background/title-banner.png": `${CLOUD}/${V}0650/hotel2/background/title-banner.png`,
  "../media/background/title-banner-2.png": `${CLOUD}/${V}0641/hotel2/background/title-banner-2.png`,
  "../media/background/title-banner-3.png": `${CLOUD}/${V}0639/hotel2/background/title-banner-3.png`,
  "../media/background/title-banner-4.png": `${CLOUD}/${V}0649/hotel2/background/title-banner-4.png`,
  "../media/background/contact-image.png": `${CLOUD}/${V}0633/hotel2/background/contact-image.png`,
  "../media/icon/calender.png": `${CLOUD}/${V}0780/hotel2/icon/calender.png`,
  "../media/bg-shape/about-page-right.png": `${CLOUD}/${V}0788/hotel2/vector-shape/about-right.png`,
};

for (const [key, value] of Object.entries(pathMap)) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
  css = css.replace(new RegExp(escaped, "g"), value);
  // Also try with single quotes
  css = css.replace(new RegExp(escaped.replace(/"/g, "'"), "g"), value);
}

writeFileSync(cssPath, css, "utf8");
console.log("Done! Replaced", Object.keys(pathMap).length, "image paths");
