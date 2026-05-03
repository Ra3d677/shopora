const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const store = await prisma.store.findUnique({ where: { slug: 'moro' } });
  if (store) {
    console.log('STORE_TEMPLATE:' + store.template);
  } else {
    console.log('STORE_NOT_FOUND');
  }
}

check().finally(() => prisma.$disconnect());
