const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: 'mostore' },
      include: { banners: true }
    });
    console.log("Store:", store.name);
    console.log("Banners in DB:", store.banners.map(b => ({ id: b.id, title: b.title, targetPage: b.targetPage })));
  } catch (e) {
    console.error("PRISMA ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
