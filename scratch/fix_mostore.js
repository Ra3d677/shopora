const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  try {
    const store = await prisma.store.findUnique({ where: { slug: 'mostore' } });
    if (!store) return;

    console.log("Adding test banner for mostore...");
    await prisma.banner.create({
      data: {
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
        title: "Test Banner",
        subtitle: "Testing database persistence",
        buttonText: "Shop Now",
        buttonLink: "/store/mostore/products",
        isActive: true,
        order: 0,
        position: "top",
        targetPage: "home",
        storeId: store.id
      }
    });
    console.log("Banner added successfully!");
  } catch (e) {
    console.error("FIX ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
