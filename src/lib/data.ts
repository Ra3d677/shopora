import { Product as PrismaProduct, Category as PrismaCategory, Banner as PrismaBanner, Store as PrismaStore } from "@prisma/client";
import prisma from "./prisma";
import { StoreSettings } from "./types";

// Re-export types from Prisma with our own extensions if needed
export type Product = PrismaProduct;
export type Category = PrismaCategory;
export type Banner = PrismaBanner;
export interface Store extends Omit<PrismaStore, 'settings'> {
  settings: StoreSettings;
  products: Product[];
  categories: Category[];
  banners: Banner[];
}

export const getAllStores = async () => {
  try {
    // Fetch stores without include and without order to avoid validation errors
    const stores = await prisma.store.findMany();

    // Fetch owners separately
    const ownerIds = [...new Set(stores.map(s => s.ownerId))];
    const owners = await prisma.user.findMany({
      where: {
        id: { in: ownerIds }
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    // Merge them
    return stores.map(store => ({
      ...store,
      owner: owners.find(o => o.id === store.ownerId)
    }));
  } catch (error) {
    console.error("SAFE FETCH ERROR:", error);
    return [];
  }
};

export const getStoreBySlug = async (slug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      products: true,
      categories: true,
      banners: true,
    },
  });
  
  if (store) {
    let settings = {};
    try {
      settings = typeof store.settings === 'string' ? JSON.parse(store.settings) : (store.settings || {});
    } catch (e) {
      console.error("Settings Parse Error:", e);
    }

    const products = store.products.map(p => {
      let images = [], colors = [], sizes = [];
      try {
        images = typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images || [];
        colors = typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : p.colors || [];
        sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : p.sizes || [];
      } catch (e) {
        console.error("Product Data Parse Error:", e);
      }
      return { ...p, images, colors, sizes };
    });

    return {
      ...store,
      settings,
      products
    } as unknown as Store;
  }
  return null;
};

export const getStoreById = async (id: string) => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      products: true,
      categories: true,
      banners: true,
    },
  });

  if (store) {
    return {
      ...store,
      settings: typeof store.settings === 'string' ? JSON.parse(store.settings) : store.settings,
      products: store.products.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images || [],
        colors: typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : p.colors || [],
        sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : p.sizes || []
      }))
    } as unknown as Store;
  }
  return null;
};

export const getStoreProducts = async (slug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: { products: true },
  });
  return store?.products.map(p => ({ 
    ...p, 
    images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images || [],
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : p.colors || [],
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : p.sizes || []
  })) || [];
};

export const getStoreCategories = async (slug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: { categories: true },
  });
  return store?.categories || [];
};

export const getStoreBannersBySlug = async (slug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: { banners: true },
  });
  return store?.banners || [];
};

export const getStoreMedia = async (slug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: { media: true },
  });
  return store?.media || [];
};

export const getStoreSettingsBySlug = async (slug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug },
  });
  if (!store) return {};
  const settings = JSON.parse(store.settings);
  return { 
    ...settings, 
    storeName: store.name,
    facebookPixelId: store.facebookPixelId,
    tiktokPixelId: store.tiktokPixelId,
    snapchatPixelId: store.snapchatPixelId,
    googleAnalyticsId: store.googleAnalyticsId
  };
};

export const getStoreTemplate = async (slug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug },
    select: { template: true },
  });
  return store?.template || 'modern';
};

export const createStore = async (storeData: { name: string; slug: string; ownerId: string; template: string }) => {
  const user = await prisma.user.findUnique({ where: { id: storeData.ownerId } });
  if (!user) {
    throw new Error("User not found.");
  }

  const newStore = await prisma.store.create({
    data: {
      name: storeData.name,
      slug: storeData.slug,
      ownerId: user.id,
      template: storeData.template,
      settings: JSON.stringify({
        categoriesLayout: 'grid',
        productsLayout: 'static',
        bannerSettings: { autoPlay: true, interval: 5000, transition: 'slide', showArrows: true, showDots: true },
        marqueeSettings: { enabled: true, speed: 30, backgroundColor: "#f3f4f6", textColor: "#1f2937", items: [{ id: "m1", text: `WELCOME TO ${storeData.name.toUpperCase()}` }] }
      }),
      categories: {
        create: [
          { name: "New Arrivals", description: "The latest additions to our store" },
          { name: "Best Sellers", description: "Our most popular items" }
        ]
      },
      banners: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80",
            title: `Welcome to ${storeData.name}`,
            subtitle: "Experience premium quality and style.",
            buttonText: "Browse Collection",
            buttonLink: `/store/${storeData.slug}/products`,
            isActive: true,
            order: 0,
            position: "top"
          }
        ]
      }
    },
    include: {
      categories: true,
      banners: true,
    }
  });

  // Now create a default product connected to the first created category
  if (newStore.categories && newStore.categories.length > 0) {
    await prisma.product.create({
      data: {
        name: "Signature Item",
        description: "A premium product to get you started. You can edit this product to manage sizes and color variants.",
        price: 99.99,
        discount_price: 79.99,
        images: JSON.stringify(["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"]),
        sizes: JSON.stringify(["S", "M", "L", "XL"]),
        colors: JSON.stringify(["#000000", "#ffffff", "#3b82f6"]),
        status: "active",
        stock_quantity: 50,
        category_id: newStore.categories[0].id,
        storeId: newStore.id
      }
    });
  }

  // Fetch the fully populated store
  const completeStore = await prisma.store.findUnique({
    where: { id: newStore.id },
    include: {
      products: true,
      categories: true,
      banners: true,
    }
  });

  return {
    ...completeStore,
    settings: JSON.parse(completeStore!.settings)
  };
};

export const updateStoreProducts = async (slug: string, products: any[]) => {
  // This is a bulk update, usually not done this way in Prisma but for compatibility:
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return;

  // In a real app, we'd update individual products. 
  // Here we'll just implement the specific update logic used in actions.
};

export const updateStoreTemplate = async (slug: string, template: string) => {
  return await prisma.store.update({
    where: { slug },
    data: { template }
  });
};

export const updateStoreSettingsBySlug = async (slug: string, settings: any) => {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return;
  
  const currentSettings = JSON.parse(store.settings);
  return await prisma.store.update({
    where: { slug },
    data: {
      settings: JSON.stringify({ ...currentSettings, ...settings })
    }
  });
};

export const getOrderById = async (orderId: string) => {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
};
