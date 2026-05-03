const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspectProducts() {
  const slug = 'mikel';
  const store = await prisma.store.findUnique({ 
    where: { slug },
    include: { products: true }
  });
  
  if (!store) {
    console.error('Store not found');
    return;
  }

  console.log('Total products:', store.products.length);
  store.products.slice(0, 3).forEach(p => {
    console.log(`Product: ${p.name}, Images type: ${typeof p.images}, Content: ${p.images}`);
  });
}

inspectProducts()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
