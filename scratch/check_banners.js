const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBanners() {
  const s = await prisma.store.findUnique({ 
    where: { slug: 'mikel' }, 
    include: { banners: true } 
  });
  console.log(JSON.stringify(s.banners, null, 2));
}

checkBanners()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
