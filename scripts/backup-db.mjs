// backup-db.mjs
// يسحب كل الداتا من Supabase ويحفظها في فولدر backup

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const BACKUP_DIR = path.join(process.cwd(), "backup_" + new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19));

async function backup() {
  console.log("🚀 بدء الباك أب...");
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const tables = [
    { name: "User",                  fn: () => prisma.user.findMany() },
    { name: "Store",                 fn: () => prisma.store.findMany() },
    { name: "Template",             fn: () => prisma.template.findMany() },
    { name: "Media",                fn: () => prisma.media.findMany() },
    { name: "Product",              fn: () => prisma.product.findMany() },
    { name: "Category",             fn: () => prisma.category.findMany() },
    { name: "Banner",               fn: () => prisma.banner.findMany() },
    { name: "Order",                fn: () => prisma.order.findMany() },
    { name: "OrderItem",            fn: () => prisma.orderItem.findMany() },
    { name: "Visit",                fn: () => prisma.visit.findMany() },
    { name: "CartAdd",              fn: () => prisma.cartAdd.findMany() },
    { name: "DailyMetric",          fn: () => prisma.dailyMetric.findMany() },
    { name: "Review",               fn: () => prisma.review.findMany() },
    { name: "WishlistItem",         fn: () => prisma.wishlistItem.findMany() },
    { name: "Coupon",               fn: () => prisma.coupon.findMany() },
    { name: "NewsletterSubscriber", fn: () => prisma.newsletterSubscriber.findMany() },
    { name: "ReactivationRequest",  fn: () => prisma.reactivationRequest.findMany() },
    { name: "Notification",         fn: () => prisma.notification.findMany() },
    { name: "AppSetting",           fn: () => prisma.appSetting.findMany() },
    { name: "HeroSection",          fn: () => prisma.heroSection.findMany() },
    { name: "Service",              fn: () => prisma.service.findMany() },
    { name: "Transformation",       fn: () => prisma.transformation.findMany() },
    { name: "PricingPlan",          fn: () => prisma.pricingPlan.findMany() },
    { name: "Testimonial",          fn: () => prisma.testimonial.findMany() },
    { name: "FooterConfig",         fn: () => prisma.footerConfig.findMany() },
  ];

  let totalRows = 0;

  for (const table of tables) {
    try {
      const data = await table.fn();
      const filePath = path.join(BACKUP_DIR, `${table.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      console.log(`  ✅ ${table.name}: ${data.length} rows`);
      totalRows += data.length;
    } catch (err) {
      console.error(`  ❌ ${table.name}: ${err.message}`);
    }
  }

  console.log(`\n✅ الباك أب خلص!`);
  console.log(`📁 الفولدر: ${BACKUP_DIR}`);
  console.log(`📊 إجمالي الصفوف: ${totalRows}`);

  await prisma.$disconnect();
}

backup().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
