const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.store.count();
  const stores = await prisma.store.findMany({ select: { name: true, slug: true } });
  console.log(`TOTAL STORES: ${count}`);
  console.log('STORES LIST:', JSON.stringify(stores, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
