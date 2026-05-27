import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  try {
    await p.$queryRawUnsafe('SELECT 1');
    console.log('DB connected OK');
    const stores = await p.store.findMany({ select: { slug: true } });
    console.log('stores:', stores.map((s: any) => s.slug).join(', '));
  } catch(e: any) {
    console.log('DB error:', e.message);
  }
}
main().catch(console.error).finally(() => p.$disconnect());
