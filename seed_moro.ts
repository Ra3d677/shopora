import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const storeSlug = "moro";
  
  let store = await prisma.store.findUnique({
    where: { slug: storeSlug }
  });

  if (!store) {
    console.log("Store 'moro' not found! Creating one...");
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error("No users found to own the store");
        return;
    }
    store = await prisma.store.create({
        data: {
            name: "Moro",
            slug: storeSlug,
            ownerId: user.id
        }
    });
  }

  // Clear existing data in correct order to respect foreign key constraints
  await prisma.orderItem.deleteMany({ where: { order: { storeId: store.id } } });
  await prisma.order.deleteMany({ where: { storeId: store.id } });
  await prisma.product.deleteMany({ where: { storeId: store.id } });
  await prisma.category.deleteMany({ where: { storeId: store.id } });

  const categoriesData = [
    {
      name: "Outerwear",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      products: [
        { name: "Classic Trench Coat", price: 299, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80" },
        { name: "Leather Biker Jacket", price: 349, image: "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80" },
        { name: "Wool Blend Overcoat", price: 399, image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80" },
        { name: "Quilted Puffer Jacket", price: 249, image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80" },
        { name: "Denim Trucker Jacket", price: 129, image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=80" },
        { name: "Lightweight Windbreaker", price: 149, image: "https://images.unsplash.com/photo-1509539662397-116cb90542f1?w=800&q=80" }
      ]
    },
    {
      name: "Essentials",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      products: [
        { name: "Premium Cotton T-Shirt", price: 45, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
        { name: "Heavyweight Hoodie", price: 85, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80" },
        { name: "Slim Fit Chinos", price: 75, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80" },
        { name: "Classic Oxford Shirt", price: 95, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80" },
        { name: "Relaxed Fit Jeans", price: 110, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" },
        { name: "Crewneck Sweatshirt", price: 70, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80" }
      ]
    },
    {
      name: "Footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      products: [
        { name: "Minimalist Sneakers", price: 130, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
        { name: "Leather Chelsea Boots", price: 199, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80" },
        { name: "Suede Loafers", price: 150, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80" },
        { name: "Running Trainers", price: 140, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80" },
        { name: "Derby Dress Shoes", price: 210, image: "https://images.unsplash.com/photo-1614252339474-dd1dfb34006c?w=800&q=80" },
        { name: "Canvas High-Tops", price: 85, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80" }
      ]
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80",
      products: [
        { name: "Classic Chronograph Watch", price: 250, image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80" },
        { name: "Polarized Sunglasses", price: 120, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80" },
        { name: "Italian Silk Tie", price: 65, image: "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80" },
        { name: "Minimalist Leather Wallet", price: 55, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80" },
        { name: "Woven Belt", price: 45, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80" },
        { name: "Silver Cufflinks", price: 80, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80" }
      ]
    },
    {
      name: "Knitwear",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
      products: [
        { name: "Cashmere Turtleneck", price: 195, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80" },
        { name: "Chunky Cable Knit", price: 150, image: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=800&q=80" },
        { name: "Merino Wool V-Neck", price: 110, image: "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=800&q=80" },
        { name: "Ribbed Cardigan", price: 135, image: "https://images.unsplash.com/photo-1434389670869-c8c0305b5ce6?w=800&q=80" },
        { name: "Cotton Blend Pullover", price: 85, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80" },
        { name: "Half-Zip Sweater", price: 125, image: "https://images.unsplash.com/photo-1516826957135-700ede19c6ce?w=800&q=80" }
      ]
    },
    {
      name: "Bags & Luggage",
      image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80",
      products: [
        { name: "Leather Duffle Bag", price: 295, image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80" },
        { name: "Canvas Backpack", price: 115, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80" },
        { name: "Commuter Briefcase", price: 185, image: "https://images.unsplash.com/photo-1554342872-034a06541bad?w=800&q=80" },
        { name: "Waxed Canvas Tote", price: 95, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80" },
        { name: "Travel Weekender", price: 225, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80" },
        { name: "Crossbody Pouch", price: 65, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80" }
      ]
    },
    {
      name: "Grooming",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
      products: [
        { name: "Signature Eau de Parfum", price: 145, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80" },
        { name: "Hydrating Face Cream", price: 45, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80" },
        { name: "Purifying Clay Mask", price: 35, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80" },
        { name: "Beard Oil Extract", price: 28, image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80" },
        { name: "Exfoliating Scrub", price: 32, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80" },
        { name: "Shaving Kit Setup", price: 85, image: "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=800&q=80" }
      ]
    }
  ];

  for (const catData of categoriesData) {
    const category = await prisma.category.create({
      data: {
        name: catData.name,
        image: catData.image,
        storeId: store.id
      }
    });

    for (const prodData of catData.products) {
      await prisma.product.create({
        data: {
          name: prodData.name,
          price: prodData.price,
          images: JSON.stringify([prodData.image]),
          storeId: store.id,
          category_id: category.id,
          stock_quantity: 100,
          status: "active"
        }
      });
    }
  }

  console.log("Successfully populated 7 categories with 6 products each for store 'moro'.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
