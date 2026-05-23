import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Update existing fitness template to be named "برعي"
await prisma.template.upsert({
  where: { id: 'fitness' },
  update: {
    name: 'برعي',
    description: 'قالب احترافي لمدربي اللياقة - هيرو، خدمات، تحولات، خطط أسعار، آراء عملاء',
  },
  create: {
    id: 'fitness',
    name: 'برعي',
    description: 'قالب احترافي لمدربي اللياقة - هيرو، خدمات، تحولات، خطط أسعار، آراء عملاء',
    preview: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    isActive: true,
  },
});
console.log('✅ Template "برعي" (id: fitness) added/updated');

await prisma.$disconnect();
