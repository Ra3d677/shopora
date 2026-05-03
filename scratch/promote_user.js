const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'DJ@Gmail.com'; // Adjust this if needed
  const user = await prisma.user.update({
    where: { email: email },
    data: { role: 'superadmin' }
  });
  console.log(`User ${user.email} promoted to superadmin!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
