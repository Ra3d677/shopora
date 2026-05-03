const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany({
    include: { stores: true }
  });
  
  const superAdmin = users.find(u => u.role === 'superadmin');
  const userCount = users.length;
  const adminCount = users.filter(u => u.role === 'superadmin').length;

  console.log('--- USER SUMMARY ---');
  console.log(`Total Users: ${userCount}`);
  console.log(`Super Admins: ${adminCount}`);
  if (superAdmin) {
    console.log(`ACTIVE SUPER ADMIN: ${superAdmin.email}`);
  } else {
    console.log('NO SUPER ADMIN FOUND!');
  }
  
  console.log('\n--- DETAILED USER LIST ---');
  users.forEach(u => {
    console.log(`[${u.role.toUpperCase()}] Email: ${u.email} | Stores: ${u.stores.map(s => s.slug).join(', ') || 'None'}`);
  });
}

run().finally(() => prisma.$disconnect());
