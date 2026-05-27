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

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  const slug = 'moro';
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) {
    console.error("Store not found!");
    return;
  }
  
  // Clear any current banners for Moro
  await prisma.banner.deleteMany({
    where: { storeId: store.id }
  });
  
  const originalBanners = [
    {
      title: "New Collection",
      subtitle: "Discover the latest trends and styles.",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
      isActive: true,
      order: 0,
      position: "top",
      buttonText: "Shop Now",
      buttonLink: "/store/moro/products",
      showButton: true
    },
    {
      title: "50% off Women's Clothes!",
      subtitle: "Use code: #Hurry",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      isActive: true,
      order: 1,
      position: "middle",
      buttonText: "Shop now",
      buttonLink: "/store/moro/products?category=women",
      showButton: true
    },
    {
      title: "Summer Sale",
      subtitle: "Get ready for the summer with our top picks.",
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
      isActive: true,
      order: 2,
      position: "middle",
      buttonText: "Shop the Sale",
      buttonLink: "/store/moro/products",
      showButton: true
    },
    {
      title: "Women Collection",
      subtitle: "Elegant & modern designs.",
      imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
      isActive: true,
      order: 3,
      position: "top",
      buttonText: "Shop now",
      buttonLink: "/store/moro/products?category=women",
      showButton: true
    },
    {
      title: "Men Collection",
      subtitle: "Classic menswear essentials.",
      imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80",
      isActive: true,
      order: 4,
      position: "top",
      buttonText: "Shop now",
      buttonLink: "/store/moro/products?category=men",
      showButton: true
    },
    {
      title: "Accessories",
      subtitle: "Complete your look with our curated details.",
      imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1600&q=80",
      isActive: true,
      order: 5,
      position: "top",
      buttonText: "Shop now",
      buttonLink: "/store/moro/products",
      showButton: true
    },
    {
      title: "Flash Sale",
      subtitle: "Limited time offer. Don't miss out!",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80",
      isActive: true,
      order: 6,
      position: "top",
      buttonText: "Shop Now",
      buttonLink: "/store/moro/products",
      showButton: true
    }
  ];

  for (const b of originalBanners) {
    await prisma.banner.create({
      data: {
        ...b,
        storeId: store.id
      }
    });
  }
  
  console.log("Successfully restored 7 banners for store 'moro'.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
