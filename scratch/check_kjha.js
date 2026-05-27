const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const s = await prisma.store.findUnique({
    where: { slug: 'kjha' },
    include: { categories: true, products: true }
  });
  console.log('Store:', s?.name, '| Template:', s?.template);
  console.log('Categories:', s?.categories.length);
  console.log('Products:', s?.products.length);
  s?.categories.forEach(c =>
    console.log('  -', c.name, ':', s.products.filter(p => p.category_id === c.id).length, 'products')
  );
  await prisma.$disconnect();
})();
