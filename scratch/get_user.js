const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to database...");
  const user = await prisma.user.findUnique({
    where: { email: 'sideb9445@gmail.com' }
  });
  
  if (user) {
    console.log("\n✅ User found!");
    console.log("ID:", user.id);
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Password Hash:", user.password);
  } else {
    console.log("\n❌ User NOT found in this database!");
    
    // List some other users to see who exists
    const users = await prisma.user.findMany({ take: 10 });
    console.log("\nExisting users in this database:");
    users.forEach(u => {
      console.log(`- ${u.email} (${u.name || 'No Name'})`);
    });
  }
}

main()
  .catch(e => {
    console.error("Error querying database:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
