import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const stores = await prisma.store.findMany({ select: { slug: true, name: true }, take: 10 });
console.log(JSON.stringify(stores, null, 2));
await prisma.$disconnect();
