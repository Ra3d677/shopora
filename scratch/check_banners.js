const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const stores = await prisma.store.findMany({
    include: {
      banners: true,
    }
  });
  console.log("STORES COUNT:", stores.length);
  for (const s of stores) {
    console.log(`Store: ${s.name} (slug: ${s.slug}), Banners: ${s.banners.length}`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
