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
  const slug = 'moro';
  const store = await prisma.store.findUnique({ where: { slug }, include: { banners: true } });
  if (!store) {
    console.log("Store not found!");
    return;
  }
  
  console.log(`Initial banners count for ${slug}:`, store.banners.length);
  
  // Let's mimic saveBanners:
  // Create a new banner list
  const testBanners = [
    {
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
      title: "Test Banner " + Date.now(),
      subtitle: "Subtitle " + Date.now(),
      isActive: true,
      order: 0,
      position: "top",
      targetPage: "home"
    }
  ];
  
  console.log("Saving banners...");
  // 1. Delete many
  const deleteResult = await prisma.banner.deleteMany({
    where: { storeId: store.id }
  });
  console.log("Deleted count:", deleteResult.count);
  
  // 2. Create one
  const createResult = await prisma.banner.create({
    data: {
      imageUrl: testBanners[0].imageUrl,
      title: testBanners[0].title,
      subtitle: testBanners[0].subtitle,
      isActive: testBanners[0].isActive,
      order: testBanners[0].order,
      position: testBanners[0].position,
      targetPage: testBanners[0].targetPage,
      storeId: store.id
    }
  });
  console.log("Created banner ID:", createResult.id);
  
  // 3. Query back
  const storeAfter = await prisma.store.findUnique({ where: { slug }, include: { banners: true } });
  console.log(`Banners count after save for ${slug}:`, storeAfter.banners.length);
  console.log(`Banner title in database: "${storeAfter.banners[0]?.title}"`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
