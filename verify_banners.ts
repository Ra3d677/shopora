import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkBanners() {
  const store = await prisma.store.findUnique({ 
    where: { slug: 'moro' },
    include: { banners: true }
  });
  
  if (!store) {
    console.log("Store 'moro' not found");
    return;
  }

  console.log(`Banners for store 'moro':`);
  store.banners.forEach(b => {
    console.log(`- ID: ${b.id} | Title: ${b.title} | Position: ${b.position} | Active: ${b.isActive}`);
  });
}

checkBanners()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
