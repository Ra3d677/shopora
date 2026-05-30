// restore-db.mjs
// يقرأ ملفات الباك أب JSON ويرجع كل الداتا للداتابيز بالترتيب الصح
//
// الاستخدام:
//   node scripts/restore-db.mjs backup_2026-05-30T12-10-05
//
// ملاحظة: لازم تحدد اسم فولدر الباك أب كـ argument

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// ===== تحديد فولدر الباك أب =====
const backupFolderArg = process.argv[2];

if (!backupFolderArg) {
  console.error("❌ لازم تحدد اسم فولدر الباك أب");
  console.error("   مثال: node scripts/restore-db.mjs backup_2026-05-30T12-10-05");
  process.exit(1);
}

const BACKUP_DIR = path.isAbsolute(backupFolderArg)
  ? backupFolderArg
  : path.join(process.cwd(), backupFolderArg);

if (!fs.existsSync(BACKUP_DIR)) {
  console.error(`❌ الفولدر مش موجود: ${BACKUP_DIR}`);
  process.exit(1);
}

// ===== دالة قراءة ملف JSON =====
function readJson(name) {
  const filePath = path.join(BACKUP_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  ملف مش موجود: ${name}.json — هيتخطى`);
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ===== دالة الاسترجاع =====
async function restoreTable(name, createFn, data) {
  if (!data || data.length === 0) {
    console.log(`  ⏭️  ${name}: فاضي — اتخطى`);
    return;
  }
  try {
    const result = await createFn(data);
    console.log(`  ✅ ${name}: ${data.length} rows`);
  } catch (err) {
    console.error(`  ❌ ${name}: ${err.message}`);
  }
}

// ===== الاسترجاع الرئيسي =====
async function restore() {
  console.log("🚀 بدء الاسترجاع من الباك أب...");
  console.log(`📁 الفولدر: ${BACKUP_DIR}\n`);

  // 1. User
  await restoreTable("User", (data) =>
    prisma.user.createMany({ data, skipDuplicates: true }),
    readJson("User")
  );

  // 2. Store
  await restoreTable("Store", (data) =>
    prisma.store.createMany({ data, skipDuplicates: true }),
    readJson("Store")
  );

  // 3. Template (مستقل)
  await restoreTable("Template", (data) =>
    prisma.template.createMany({ data, skipDuplicates: true }),
    readJson("Template")
  );

  // 4. AppSetting (مستقل)
  await restoreTable("AppSetting", (data) =>
    prisma.appSetting.createMany({ data, skipDuplicates: true }),
    readJson("AppSetting")
  );

  // 5. Category (بيعتمد على Store)
  await restoreTable("Category", async (data) => {
    // أول ما نحط الـ parents (parentId = null)
    const parents = data.filter((c) => !c.parentId);
    const children = data.filter((c) => c.parentId);
    await prisma.category.createMany({ data: parents, skipDuplicates: true });
    await prisma.category.createMany({ data: children, skipDuplicates: true });
  }, readJson("Category"));

  // 6. Product (بيعتمد على Store + Category)
  await restoreTable("Product", (data) =>
    prisma.product.createMany({ data, skipDuplicates: true }),
    readJson("Product")
  );

  // 7. Banner (بيعتمد على Store)
  await restoreTable("Banner", (data) =>
    prisma.banner.createMany({ data, skipDuplicates: true }),
    readJson("Banner")
  );

  // 8. Media (بيعتمد على Store)
  await restoreTable("Media", (data) =>
    prisma.media.createMany({ data, skipDuplicates: true }),
    readJson("Media")
  );

  // 9. Order (بيعتمد على Store + User)
  await restoreTable("Order", (data) =>
    prisma.order.createMany({ data, skipDuplicates: true }),
    readJson("Order")
  );

  // 10. OrderItem (بيعتمد على Order + Product)
  await restoreTable("OrderItem", (data) =>
    prisma.orderItem.createMany({ data, skipDuplicates: true }),
    readJson("OrderItem")
  );

  // 11. Visit
  await restoreTable("Visit", (data) =>
    prisma.visit.createMany({ data, skipDuplicates: true }),
    readJson("Visit")
  );

  // 12. CartAdd
  await restoreTable("CartAdd", (data) =>
    prisma.cartAdd.createMany({ data, skipDuplicates: true }),
    readJson("CartAdd")
  );

  // 13. DailyMetric
  await restoreTable("DailyMetric", (data) =>
    prisma.dailyMetric.createMany({ data, skipDuplicates: true }),
    readJson("DailyMetric")
  );

  // 14. Review
  await restoreTable("Review", (data) =>
    prisma.review.createMany({ data, skipDuplicates: true }),
    readJson("Review")
  );

  // 15. WishlistItem
  await restoreTable("WishlistItem", (data) =>
    prisma.wishlistItem.createMany({ data, skipDuplicates: true }),
    readJson("WishlistItem")
  );

  // 16. Coupon
  await restoreTable("Coupon", (data) =>
    prisma.coupon.createMany({ data, skipDuplicates: true }),
    readJson("Coupon")
  );

  // 17. NewsletterSubscriber
  await restoreTable("NewsletterSubscriber", (data) =>
    prisma.newsletterSubscriber.createMany({ data, skipDuplicates: true }),
    readJson("NewsletterSubscriber")
  );

  // 18. ReactivationRequest
  await restoreTable("ReactivationRequest", (data) =>
    prisma.reactivationRequest.createMany({ data, skipDuplicates: true }),
    readJson("ReactivationRequest")
  );

  // 19. Notification
  await restoreTable("Notification", (data) =>
    prisma.notification.createMany({ data, skipDuplicates: true }),
    readJson("Notification")
  );

  // 20. HeroSection
  await restoreTable("HeroSection", (data) =>
    prisma.heroSection.createMany({ data, skipDuplicates: true }),
    readJson("HeroSection")
  );

  // 21. Service
  await restoreTable("Service", (data) =>
    prisma.service.createMany({ data, skipDuplicates: true }),
    readJson("Service")
  );

  // 22. Transformation
  await restoreTable("Transformation", (data) =>
    prisma.transformation.createMany({ data, skipDuplicates: true }),
    readJson("Transformation")
  );

  // 23. PricingPlan
  await restoreTable("PricingPlan", (data) =>
    prisma.pricingPlan.createMany({ data, skipDuplicates: true }),
    readJson("PricingPlan")
  );

  // 24. Testimonial
  await restoreTable("Testimonial", (data) =>
    prisma.testimonial.createMany({ data, skipDuplicates: true }),
    readJson("Testimonial")
  );

  // 25. FooterConfig
  await restoreTable("FooterConfig", (data) =>
    prisma.footerConfig.createMany({ data, skipDuplicates: true }),
    readJson("FooterConfig")
  );

  console.log("\n✅ الاسترجاع خلص بنجاح!");
  await prisma.$disconnect();
}

restore().catch((e) => {
  console.error("\n❌ حصل خطأ أثناء الاسترجاع:");
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
