import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.findUnique({
    where: { slug: 'mikel' },
    include: { products: true, categories: true }
  });

  if (!store) {
    console.log("Store 'mikel' not found");
    return;
  }

  console.log("Updating images for store 'mikel'...");

  // High quality Unsplash images that are definitely working
  const images = {
    "Executive Wool Suit": ["https://images.unsplash.com/photo-1594932224491-993c837542d9?w=800&q=80"],
    "Silk Evening Gown": ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"],
    "Cashmere Overcoat": ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80"],
    "Tailored Oxford Shirt": ["https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800&q=80"],
    "Heritage Gold Watch": ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80"],
    "Full-Grain Leather Briefcase": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
    "Aviator Titanium Shades": ["https://images.unsplash.com/photo-1511499767390-a739175f5ac2?w=800&q=80"],
    "Sterling Silver Cufflinks": ["https://images.unsplash.com/photo-1588359410707-3703c00057ec?w=800&q=80"],
    "Midnight Oud Extrait": ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"],
    "Azure Coast EDP": ["https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80"],
    "Velvet Amber": ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80"],
    "Wild Flora Mist": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    "Sculptural Marble Vase": ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80"],
    "Mid-Century Lounge Chair": ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"],
    "Crystal Decanter Set": ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"],
    "Embroidered Silk Throw": ["https://images.unsplash.com/photo-1584144124613-20b1bf133f93?w=800&q=80"],
    "Studio Pro Headphones": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    "Titanium Laptop Stand": ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"],
    "Smart Watch Elite": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    "Obsidian Wireless Speaker": ["https://images.unsplash.com/photo-1543512214-318bd775f523?w=800&q=80"]
  };

  for (const product of store.products) {
    const newImages = images[product.name as keyof typeof images];
    if (newImages) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: JSON.stringify(newImages) }
      });
      console.log(`Updated images for: ${product.name}`);
    }
  }

  // Update categories images too
  const catImages = {
    "Elite Accessories": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "Signature Scents": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    "Artisan Home": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
    "Tech Luxe": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    "Timeless Apparel": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
  };

  for (const cat of store.categories) {
    const newImg = catImages[cat.name as keyof typeof catImages];
    if (newImg) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: newImg }
      });
      console.log(`Updated image for category: ${cat.name}`);
    }
  }

  console.log("Done!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
