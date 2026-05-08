const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log("Checking prisma.template...");
  if (prisma.template) {
    console.log("prisma.template EXISTS");
    try {
      const count = await prisma.template.count();
      console.log("Templates count:", count);
    } catch (e) {
      console.error("Error calling findMany:", e.message);
    }
  } else {
    console.log("prisma.template is UNDEFINED");
    console.log("Available models:", Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
  }
}

check();
