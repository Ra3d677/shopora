import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addTestBanner() {
  const store = await prisma.store.findUnique({ where: { slug: 'moro' } });
  if (!store) {
    console.error("Store 'moro' not found");
    return;
  }

  await prisma.banner.create({
    data: {
      title: "Test Middle Banner",
      subtitle: "This banner is placed in the middle of the page",
      imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=80",
      position: "middle",
      isActive: true,
      order: 0,
      storeId: store.id
    }
  });

  console.log("Test middle banner added to 'moro' store.");
}

addTestBanner()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
