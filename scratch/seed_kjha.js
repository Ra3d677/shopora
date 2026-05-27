const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedKjha() {
  const slug = 'kjha';
  let store = await prisma.store.findUnique({ where: { slug } });

  if (store) {
    await prisma.product.deleteMany({ where: { storeId: store.id } });
    await prisma.category.deleteMany({ where: { storeId: store.id } });
    console.log('Existing store kjha found. Cleaned products & categories.');
  } else {
    const owner = await prisma.user.findFirst();
    if (!owner) { console.error('No user found'); return; }
    store = await prisma.store.create({
      data: {
        name: 'Kjha',
        slug: 'kjha',
        type: 'STORE',
        template: '1m',
        primaryColor: '#e1205e',
        ownerId: owner.id,
        isActive: true,
        status: 'active',
        plan: 'free',
        settings: JSON.stringify({})
      }
    });
    console.log('Created store kjha');
  }

  const categoriesData = [
    {
      name: "Women's Clothing",
      description: "Trendy and elegant fashion for women",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      products: [
        { name: "Floral Summer Dress", price: 89.99, discount_price: 69.99, description: "A lightweight floral dress perfect for summer days.", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80" },
        { name: "Classic Blazer", price: 129.99, discount_price: null, description: "Tailored blazer for a sophisticated look.", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80" },
        { name: "High-Waist Jeans", price: 69.99, discount_price: 54.99, description: "Comfortable high-waist jeans with stretch denim.", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80" },
        { name: "Cashmere Sweater", price: 149.99, discount_price: null, description: "Luxuriously soft cashmere crew neck sweater.", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80" }
      ]
    },
    {
      name: "Men's Clothing",
      description: "Modern styles for the modern man",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      products: [
        { name: "Slim Fit Chinos", price: 59.99, discount_price: null, description: "Stretch cotton chinos in versatile khaki.", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80" },
        { name: "Oxford Button-Down", price: 79.99, discount_price: 64.99, description: "Classic oxford shirt in premium cotton.", image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800&q=80" },
        { name: "Bomber Jacket", price: 189.99, discount_price: null, description: "Nylon bomber jacket with ribbed cuffs.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80" },
        { name: "Cargo Joggers", price: 49.99, discount_price: 39.99, description: "Casual joggers with utility pockets.", image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80" }
      ]
    },
    {
      name: "Shoes",
      description: "Step out in style",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      products: [
        { name: "White Sneakers", price: 99.99, discount_price: null, description: "Minimalist leather sneakers for everyday wear.", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80" },
        { name: "Leather Loafers", price: 159.99, discount_price: 129.99, description: "Handcrafted loafers in genuine calf leather.", image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80" },
        { name: "Running Shoes", price: 119.99, discount_price: null, description: "Lightweight performance running shoes with cushion sole.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" }
      ]
    },
    {
      name: "Accessories",
      description: "Complete your look",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      products: [
        { name: "Leather Belt", price: 39.99, discount_price: null, description: "Italian leather belt with brushed buckle.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80" },
        { name: "Aviator Sunglasses", price: 89.99, discount_price: 74.99, description: "Polarized aviator sunglasses with gold frame.", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80" },
        { name: "Wool Scarf", price: 44.99, discount_price: null, description: "Soft merino wool scarf in herringbone pattern.", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80" }
      ]
    },
    {
      name: "Bags",
      description: "Carry everything in style",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      products: [
        { name: "Tote Bag", price: 79.99, discount_price: null, description: "Spacious canvas tote with leather handles.", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80" },
        { name: "Crossbody Bag", price: 64.99, discount_price: 54.99, description: "Compact crossbody bag with adjustable strap.", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80" },
        { name: "Backpack", price: 94.99, discount_price: null, description: "Minimalist backpack with padded laptop compartment.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80" }
      ]
    },
    {
      name: "Sale",
      description: "Best deals and discounts",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      products: [
        { name: "Denim Jacket", price: 109.99, discount_price: 69.99, description: "Classic denim jacket, now at a great price.", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80" },
        { name: "Striped Tee Pack", price: 44.99, discount_price: 29.99, description: "Pack of 3 striped tees in assorted colors.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
        { name: "Knit Cardigan", price: 89.99, discount_price: 59.99, description: "Oversized knit cardigan with patch pockets.", image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a20?w=800&q=80" }
      ]
    }
  ];

  for (const catData of categoriesData) {
    const { products, ...categoryInfo } = catData;
    const category = await prisma.category.create({
      data: { ...categoryInfo, storeId: store.id }
    });
    for (const prodData of products) {
      await prisma.product.create({
        data: {
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          discount_price: prodData.discount_price,
          images: JSON.stringify([prodData.image]),
          sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
          colors: JSON.stringify([
            { name: "Black", value: "#000000", imageUrl: null },
            { name: "White", value: "#ffffff", imageUrl: null }
          ]),
          category_id: category.id,
          storeId: store.id,
          status: 'active',
          stock_quantity: 25
        }
      });
    }
  }

  console.log('Done! 6 categories and 20 products seeded for kjha.');
}

seedKjha()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
