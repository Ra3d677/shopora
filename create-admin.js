const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'ksh128395@gmail.com';
  const plainPassword = 'MultoAdmin2026@#';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'superadmin',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'superadmin',
    },
  });
  
  console.log('Super admin successfully created/updated:');
  console.log('Email:', user.email);
  console.log('Role:', user.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
