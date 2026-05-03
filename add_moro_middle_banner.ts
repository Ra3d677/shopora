import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addSaleBanner() {
  const store = await prisma.store.findUnique({ where: { slug: 'moro' } });
  if (!store) {
    console.error("Store 'moro' not found");
    return;
  }

  await prisma.banner.create({
    data: {
      title: "SUMMER SALE - UP TO 50% OFF",
      subtitle: "Discover our exclusive collection of premium items at unbeatable prices.",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80",
      position: "middle",
      buttonText: "Shop the Sale",
      buttonLink: `/store/moro/products`,
      isActive: true,
      order: 1,
      storeId: store.id
    }
  });

  console.log("Summer sale banner added to 'moro' store in middle position.");
}

addSaleBanner()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
