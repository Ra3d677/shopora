import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const store = await p.store.findUnique({
    where: { slug: 'moro' },
    include: { banners: true }
  });
  if (!store) { console.log('store not found'); return; }
  console.log('store:', store.name, 'template:', store.template);
  console.log('settings template:', JSON.parse(store.settings || '{}').template);
  console.log('banners:');
  for (const b of store.banners) {
    console.log(' -', b.title, '| position:', b.position, '| active:', b.isActive, '| order:', b.order);
  }
}
main().catch(console.error).finally(() => p.$disconnect());
