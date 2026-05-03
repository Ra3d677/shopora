const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedMikelStore() {
  const slug = 'mikel';
  const store = await prisma.store.findUnique({ where: { slug } });
  
  if (!store) {
    console.error('Store mikel not found');
    return;
  }

  // Clear existing products and categories for this store to have a clean slate
  await prisma.product.deleteMany({ where: { storeId: store.id } });
  await prisma.category.deleteMany({ where: { storeId: store.id } });

  const categoriesData = [
    {
      name: "Timeless Apparel",
      description: "Sophisticated garments crafted from the finest materials for a lasting impression.",
      image: "https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?w=800&q=80",
      products: [
        { name: "Executive Wool Suit", price: 1200, discount_price: 999, description: "A precision-cut suit made from 100% Italian virgin wool.", image: "https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?w=800&q=80" },
        { name: "Silk Evening Gown", price: 850, discount_price: null, description: "Elegant floor-length gown in midnight blue pure silk.", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80" },
        { name: "Cashmere Overcoat", price: 1500, discount_price: 1350, description: "Luxuriously soft overcoat designed for ultimate warmth and style.", image: "https://images.unsplash.com/photo-1539533377285-32df3dd3500d?w=800&q=80" },
        { name: "Tailored Oxford Shirt", price: 180, discount_price: null, description: "A crisp, classic white shirt with a contemporary fit.", image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800&q=80" }
      ]
    },
    {
      name: "Elite Accessories",
      description: "The final touch to your ensemble, where craftsmanship meets elegance.",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      products: [
        { name: "Heritage Gold Watch", price: 4500, discount_price: null, description: "Automatic movement encased in 18k yellow gold.", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80" },
        { name: "Full-Grain Leather Briefcase", price: 750, discount_price: 600, description: "Hand-stitched leather briefcase with brass hardware.", image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80" },
        { name: "Aviator Titanium Shades", price: 350, discount_price: null, description: "Ultra-lightweight frames with polarized Zeiss lenses.", image: "https://images.unsplash.com/photo-1511499767390-a7335958beba?w=800&q=80" },
        { name: "Sterling Silver Cufflinks", price: 220, discount_price: 180, description: "Minimalist geometric design in high-polish silver.", image: "https://images.unsplash.com/photo-1610492497915-4670989f6d7c?w=800&q=80" }
      ]
    },
    {
      name: "Signature Scents",
      description: "Olfactory masterpieces that leave an unforgettable trail.",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
      products: [
        { name: "Midnight Oud Extrait", price: 420, discount_price: null, description: "A deep, smoky blend of rare oud and Bulgarian rose.", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" },
        { name: "Azure Coast EDP", price: 280, discount_price: 240, description: "Fresh marine notes with a heart of neroli and bergamot.", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80" },
        { name: "Velvet Amber", price: 310, discount_price: null, description: "Warm and inviting amber with hints of vanilla and tobacco.", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80" },
        { name: "Wild Flora Mist", price: 190, discount_price: 150, description: "A delicate bouquet of jasmine, lily, and green stems.", image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80" }
      ]
    },
    {
      name: "Artisan Home",
      description: "Elevating your living space with pieces of functional art.",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
      products: [
        { name: "Sculptural Marble Vase", price: 480, discount_price: null, description: "Carved from a single block of Carrara marble.", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80" },
        { name: "Mid-Century Lounge Chair", price: 2200, discount_price: 1950, description: "Iconic design in walnut and premium black leather.", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80" },
        { name: "Crystal Decanter Set", price: 320, discount_price: null, description: "Hand-blown lead-free crystal with gold detailing.", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80" },
        { name: "Embroidered Silk Throw", price: 260, discount_price: 210, description: "Fine silk with intricate hand-stitched patterns.", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80" }
      ]
    },
    {
      name: "Tech Luxe",
      description: "Where cutting-edge technology meets premium aesthetics.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      products: [
        { name: "Studio Pro Headphones", price: 550, discount_price: null, description: "Noise-canceling headphones with lambskin leather earcups.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
        { name: "Titanium Laptop Stand", price: 150, discount_price: 120, description: "Minimalist stand forged from aerospace-grade titanium.", image: "https://images.unsplash.com/photo-1611186871348-b1ec696e5239?w=800&q=80" },
        { name: "Smart Watch Elite", price: 890, discount_price: null, description: "Sapphire glass and ceramic casing with designer bands.", image: "https://images.unsplash.com/photo-1544117518-30df57809ca7?w=800&q=80" },
        { name: "Obsidian Wireless Speaker", price: 1100, discount_price: 950, description: "High-fidelity audio in a stunning basalt rock housing.", image: "https://images.unsplash.com/photo-1608156639585-342c718e39c1?w=800&q=80" }
      ]
    }
  ];

  for (const catData of categoriesData) {
    const { products, ...categoryInfo } = catData;
    const category = await prisma.category.create({
      data: {
        ...categoryInfo,
        storeId: store.id
      }
    });

    for (const prodData of products) {
      await prisma.product.create({
        data: {
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          discount_price: prodData.discount_price,
          images: JSON.stringify([prodData.image]),
          category_id: category.id,
          storeId: store.id,
          status: 'active',
          stock_quantity: 15
        }
      });
    }
  }

  console.log('Successfully seeded 5 categories and 20 products for mikel store.');
}

seedMikelStore()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
