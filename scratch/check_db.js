const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const banners = await prisma.banner.findMany({ take: 1 });
    console.log("Banners found:", banners.length);
    // Try to create a dummy banner with targetPage
    console.log("Testing create with targetPage...");
    await prisma.banner.create({
      data: {
        imageUrl: "test",
        title: "test",
        targetPage: "home",
        storeId: "dummy" // This might fail if no store exists, but we'll see the error type
      }
    });
  } catch (e) {
    console.error("Error during check:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
