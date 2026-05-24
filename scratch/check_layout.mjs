import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const stores = await p.store.findMany({ select: { slug: true, name: true, template: true, settings: true } });
for (const s of stores) {
  console.log('=== Store:', s.slug, '| Template:', s.template);
  const sets = typeof s.settings === 'string' ? JSON.parse(s.settings) : s.settings;
  if (sets.homepageLayout) {
    console.log('  Sections:');
    for (const sec of sets.homepageLayout) {
      console.log('    -', sec.id, 'type:', sec.type, 'style:', sec.style || '(none)', 'config:', JSON.stringify(sec.config || {}).slice(0, 200));
    }
  } else {
    console.log('  NO homepageLayout');
  }
}
await p.$disconnect();
