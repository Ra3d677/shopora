import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stores = await prisma.store.findMany();
  console.log("Stores found:", stores.length);
  console.log("Slugs:");
  stores.forEach(s => console.log("- " + s.slug));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
