const { saveBanners } = require('./src/app/store/[slug]/admin/actions');

async function test() {
  const banners = [
    {
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
      title: "Test Banner From Script",
      subtitle: "Testing saveBanners function",
      buttonText: "Shop Now",
      buttonLink: "/store/mostore/products",
      isActive: true,
      order: 0,
      position: "top",
      targetPage: "home"
    }
  ];

  try {
    console.log("Calling saveBanners...");
    const result = await saveBanners('mostore', banners);
    console.log("Result:", result);
  } catch (e) {
    console.error("CRASH:", e.message);
  }
}

test();
