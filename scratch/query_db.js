const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.banner.findMany();
  console.log("DB BANNERS:", banners);
  
  const stores = await prisma.store.findMany({
    select: { id: true, name: true, slug: true, template: true }
  });
  console.log("STORES:", stores);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
