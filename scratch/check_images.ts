import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.findUnique({
    where: { slug: 'mikel' },
    include: {
      products: {
        select: {
          name: true,
          images: true
        }
      }
    }
  });

  if (!store) {
    console.log("Store not found");
    return;
  }

  console.log(JSON.stringify(store.products, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
