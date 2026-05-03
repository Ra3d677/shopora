const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImages() {
  const slug = 'mikel';
  const store = await prisma.store.findUnique({ 
    where: { slug },
    include: { products: true, categories: true }
  });
  
  if (!store) {
    console.error('Store not found');
    return;
  }

  // Reliable Unsplash IDs
  const catImages = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80", // Fashion
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80", // Accessories
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80", // Scent
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80", // Home
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"  // Tech
  ];

  // Update Categories
  for (let i = 0; i < store.categories.length; i++) {
    await prisma.category.update({
      where: { id: store.categories[i].id },
      data: { image: catImages[i % catImages.length] }
    });
  }

  // Update Products with diverse, working images
  const prodImages = [
    "https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1539533377285-32df3dd3500d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1610492497915-4670989f6d7c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1611186871348-b1ec696e5239?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544117518-30df57809ca7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1608156639585-342c718e39c1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"
  ];

  for (let i = 0; i < store.products.length; i++) {
    await prisma.product.update({
      where: { id: store.products[i].id },
      data: { images: JSON.stringify([prodImages[i % prodImages.length]]) }
    });
  }

  console.log('Fixed all broken images for mikel store.');
}

fixImages()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
