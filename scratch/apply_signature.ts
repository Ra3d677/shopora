import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.store.update({
    where: { slug: 'mikel' },
    data: { template: 'signature' }
  });
  console.log("Store 'mikel' updated to use 'signature' template.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
