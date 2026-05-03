const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLogo() {
  const slug = 'mikel'; // Target store
  const store = await prisma.store.findUnique({ where: { slug } });
  
  if (!store) {
    console.error('Store not found');
    return;
  }

  let settings = JSON.parse(store.settings || '{}');
  settings.logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg';
  settings.storeName = 'Mikel Premium';
  
  await prisma.store.update({
    where: { slug },
    data: {
      settings: JSON.stringify(settings)
    }
  });

  console.log('Logo updated successfully for store:', slug);
}

updateLogo()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
