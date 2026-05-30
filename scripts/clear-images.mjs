// clear-images.mjs
// يمسح جميع الصور من قاعدة البيانات:
// - يحذف كل صفوف Media
// - يفضي حقول الصور في Banner, Product, Category, OrderItem

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearImages() {
  console.log("🗑️  بدء مسح الصور من قاعدة البيانات...\n");

  // 1. حذف كل صفوف Media
  const deletedMedia = await prisma.media.deleteMany({});
  console.log(`✅ Media: تم حذف ${deletedMedia.count} صف`);

  // 2. مسح imageUrl و mobileImageUrl من Banner
  const clearedBanners = await prisma.banner.updateMany({
    data: {
      imageUrl: "",
      mobileImageUrl: null,
    },
  });
  console.log(`✅ Banner: تم تفريغ الصور في ${clearedBanners.count} banner`);

  // 3. مسح images من Product (إرجاعها لـ [])
  const clearedProducts = await prisma.product.updateMany({
    data: {
      images: "[]",
    },
  });
  console.log(`✅ Product: تم تفريغ الصور في ${clearedProducts.count} منتج`);

  // 4. مسح image من Category
  const clearedCategories = await prisma.category.updateMany({
    data: {
      image: null,
    },
  });
  console.log(`✅ Category: تم تفريغ الصور في ${clearedCategories.count} تصنيف`);

  // 5. مسح image من OrderItem
  const clearedOrderItems = await prisma.orderItem.updateMany({
    data: {
      image: null,
    },
  });
  console.log(`✅ OrderItem: تم تفريغ الصور في ${clearedOrderItems.count} عنصر`);

  // 6. مسح backgroundImage, runnerImage, lightningImage من HeroSection
  const clearedHero = await prisma.heroSection.updateMany({
    data: {
      backgroundImage: null,
      runnerImage: null,
      lightningImage: null,
      avatars: [],
    },
  });
  console.log(`✅ HeroSection: تم تفريغ الصور في ${clearedHero.count} section`);

  // 7. مسح beforeImage و afterImage من Transformation
  const clearedTransformations = await prisma.transformation.updateMany({
    data: {
      beforeImage: "",
      afterImage: "",
    },
  });
  console.log(`✅ Transformation: تم تفريغ الصور في ${clearedTransformations.count} transformation`);

  // 8. مسح logo من FooterConfig
  const clearedFooter = await prisma.footerConfig.updateMany({
    data: {
      logo: null,
    },
  });
  console.log(`✅ FooterConfig: تم تفريغ اللوجو في ${clearedFooter.count} footer`);

  console.log("\n✅ تم مسح جميع الصور من قاعدة البيانات بنجاح!");
  console.log("💡 الآن يمكنك رفع صور جديدة على Cloudinary وإضافتها يدوياً.");

  await prisma.$disconnect();
}

clearImages().catch((e) => {
  console.error("❌ حصل خطأ:", e);
  prisma.$disconnect();
  process.exit(1);
});
