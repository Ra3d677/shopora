const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Read .env file manually
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
    if (match) {
      let key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

// Use DIRECT_URL for direct connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  console.log("Connecting using DIRECT_URL:", process.env.DIRECT_URL ? "URL loaded" : "No URL");
  const stores = await prisma.store.findMany({
    include: {
      banners: true,
    }
  });
  console.log("STORES COUNT:", stores.length);
  for (const s of stores) {
    console.log(`Store: ${s.name} (slug: ${s.slug}), Banners: ${s.banners.length}`);
    for (const b of s.banners) {
      console.log(`  - Banner: id=${b.id}, title="${b.title}", imageUrl="${b.imageUrl}"`);
    }
  }
}

main()
  .catch(e => {
    console.error("Connection failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
