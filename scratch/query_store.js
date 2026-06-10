const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.findFirst({
    where: { slug: 'nio' },
    include: { banners: true }
  });
  console.log("STORE DETAILS FOR nio:", JSON.stringify(store, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
