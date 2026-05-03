const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: {
      email: {
        in: ['DJ@Gmail.com', 'AJ@Gmail.com', 'KJ@Gmail.com']
      }
    },
    data: { role: 'superadmin' }
  });
  console.log('Promoted all potential admin accounts to superadmin!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
