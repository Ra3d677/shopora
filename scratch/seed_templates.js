const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TEMPLATES = [
  {
    id: "signature",
    name: "Signature Brand",
    description: "A high-end, typography-focused template for luxury brands and signature collections.",
    preview: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
  },
  {
    id: "minimal",
    name: "Pure Minimal",
    description: "Stripped back to the essentials. High contrast, mono-tonal, and bold typography for high-end brands.",
    preview: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
  },
  {
    id: "apple",
    name: "Premium Tech",
    description: "Sleek, product-focused design with vast whitespace, clean sans-serif typography, and polished aesthetic.",
    preview: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80"
  },
  {
    id: "hybrid",
    name: "Hybrid Dark",
    description: "A perfect blend of luxury branding and high-conversion e-commerce elements.",
    preview: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
  },
  {
    id: "zenith",
    name: "Zenith Luxury",
    description: "The pinnacle of minimalist luxury. Features cinematic transitions, elegant serif typography, and a sophisticated cream palette.",
    preview: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
  },
  {
    id: "obsidian",
    name: "Obsidian Brutalist",
    description: "High-impact, modern brutalist design. Features asymmetrical layouts, dark mode aesthetics, and bold typography for boundary-pushing brands.",
    preview: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80"
  },
  {
    id: "modern",
    name: "Modern Commerce",
    description: "A clean, modern layout with a focus on usability and large product imagery.",
    preview: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
  },
  {
    id: "modern1",
    name: "Modern 1",
    description: "Bold dark aesthetic, glass UI, and premium motion. Designed for modern brands that want a high-impact storefront.",
    preview: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
  },
  {
    id: "amazon",
    name: "Amazon Marketplace",
    description: "High-efficiency, conversion-optimized layout inspired by major marketplaces.",
    preview: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
  },
  {
    id: "dddyou",
    name: "DDDYOU Parfumerie",
    description: "عطور فاخرة تجمع بين أصالة الشرق ورقي الغرب. قالب داكن فاخر مع لمسات ذهبية، مثالي لمتاجر العطور والمنتجات الفاخرة.",
    preview: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80"
  },
  {
    id: "senno",
    name: "Senno Multipurpose",
    description: "A high-end, minimalist ecommerce template with a peach-pink aesthetic, serif typography, and interactive hotspots. Perfect for beauty and boutique brands.",
    preview: "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=800&q=80"
  },
  {
    id: "momo",
    name: "MOMO",
    description: "A modern and minimalist template designed for small businesses selling handcrafted goods, artisanal food, or unique products with storytelling and visual appeal.",
    preview: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
  },
  {
    id: "1m",
    name: "1M",
    description: "أنيق وعصري مستوحى من تصاميم الأناقة العصرية - مثالي لمتاجر الأزياء والمنتجات الفاخرة.",
    preview: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
  },
  {
    id: "3m",
    name: "3M Netro",
    description: "مستوحى من متجر Netro العصري - تصميم نظيف مع لمسات برتقالية، مثالي لمتاجر الأزياء والملابس.",
    preview: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
  },
  {
    id: "2m",
    name: "2M",
    description: "إلكترونيات - تصميم عصري بألوان صفراء وردية مناسب لمتاجر الإلكترونيات والتكنولوجيا.",
    preview: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80"
  },
  {
    id: "ironpeak",
    name: "Iron Peak Fitness",
    description: "Iron Peak – Health, Gym & Fitness Center - Personal Trainer HTML5 Template",
    preview: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
  }
];

async function seed() {
  console.log("Seeding templates to Supabase...");
  for (const t of TEMPLATES) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
    console.log(`- Seeded template: ${t.id}`);
  }
  console.log("Done!");
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
