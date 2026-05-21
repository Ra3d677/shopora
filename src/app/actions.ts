"use server";

import { cookies } from "next/headers";
import { createStore } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function setLanguageCookie(lang: 'en' | 'ar') {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', lang, { path: '/' });
  revalidatePath("/", "layout");
}

export async function setMarketingLanguageCookie(lang: 'en' | 'ar') {
  const cookieStore = await cookies();
  cookieStore.set('SHOPORA_MARKETING_LOCALE', lang, { path: '/' });
  cookieStore.set('NEXT_LOCALE', lang, { path: '/' });
  revalidatePath("/", "layout");
}

export async function createStoreAction(data: { name: string; slug: string; template: string; type: string }) {
  const user = await getSession();
  
  if (!user) {
    throw new Error("You must be logged in to create a store.");
  }

  const ownerId = user.id;

  try {
    const newStore = await createStore({
      ...data,
      ownerId: ownerId
    });

    revalidatePath("/", "layout");
    
    return { success: true, store: newStore };
  } catch (error: any) {
    console.error("Create Store Error:", error);
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint failed')) {
      return { success: false, error: "This Store URL (Slug) is already taken. Please choose another one." };
    }
    return { success: false, error: "Failed to create store. Please try again." };
  }
}

export async function recordVisit(slug: string) {
  try {
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) return;

    await prisma.visit.create({
      data: {
        storeId: store.id
      }
    });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.dailyMetric.upsert({
      where: {
        storeId_date: {
          storeId: store.id,
          date: today
        }
      },
      update: {
        visits: { increment: 1 }
      },
      create: {
        storeId: store.id,
        date: today,
        visits: 1
      }
    });

    // Fire-and-forget probabilistic pruning of old raw logs (older than 7 days)
    pruneOldAnalytics();
  } catch (error) {
    console.error("Failed to record visit:", error);
  }
}

export async function recordCartAdd(slug: string, productId: string) {
  try {
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) return;

    await prisma.cartAdd.create({
      data: {
        storeId: store.id,
        productId
      }
    });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.dailyMetric.upsert({
      where: {
        storeId_date: {
          storeId: store.id,
          date: today
        }
      },
      update: {
        cartAdds: { increment: 1 }
      },
      create: {
        storeId: store.id,
        date: today,
        cartAdds: 1
      }
    });

    // Fire-and-forget probabilistic pruning of old raw logs (older than 7 days)
    pruneOldAnalytics();
  } catch (error) {
    console.error("Failed to record cart add:", error);
  }
}

async function pruneOldAnalytics() {
  // 5% chance of triggering auto-pruning to save database CPU
  if (Math.random() < 0.05) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      await prisma.visit.deleteMany({
        where: {
          createdAt: { lt: sevenDaysAgo }
        }
      });
      
      await prisma.cartAdd.deleteMany({
        where: {
          createdAt: { lt: sevenDaysAgo }
        }
      });
    } catch (e) {
      console.error("Probabilistic pruning failed:", e);
    }
  }
}

export async function seedTourismDemoData(storeId: string) {
  try {
    // Delete existing products, categories, and banners to clear clothing themes completely
    await prisma.product.deleteMany({ where: { storeId } });
    await prisma.category.deleteMany({ where: { storeId } });
    await prisma.banner.deleteMany({ where: { storeId } });

    // Create a breathtaking premium travel banner for the home screen
    await prisma.banner.create({
      data: {
        title: "Pristine Luxury Escapes",
        subtitle: "Embark on bespoke private villa getaways and custom curated alpine tours.",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
        buttonText: "Explore Packages",
        buttonLink: "#destinations",
        showButton: true,
        isActive: true,
        position: "top",
        targetPage: "home",
        storeId
      }
    });

    // Create 3 beautiful Travel & Adventure categories
    const cat1 = await prisma.category.create({
      data: {
        name: "Tropical Beaches & Island Escapes",
        description: "Breathtaking private island resorts, overwater villas, and crystal-clear waters.",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80",
        storeId
      }
    });

    const cat2 = await prisma.category.create({
      data: {
        name: "Alpine Peaks & Snowy Wonders",
        description: "Luxury ski chalets, sweeping glacier views, and crisp mountain air adventure.",
        image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=500&q=80",
        storeId
      }
    });

    const cat3 = await prisma.category.create({
      data: {
        name: "Historic Capitals & Cultural Paths",
        description: "Private guided historical excursions, heritage temples, and architectural marvels.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80",
        storeId
      }
    });

    // Create 6 premium travel packages with actual beautiful high-res travel imagery
    await prisma.product.create({
      data: {
        name: "Maldives Overwater Luxury Escape",
        description: "Relax in your private overwater pavilion with a direct plunge pool, curated Michelin-star dining plans, and a dedicated 24/7 butler service. Packages include scenic seaplane transfers, private coral reef snorkeling expeditions, and couple luxury spa treatments.",
        price: 2450.00,
        images: JSON.stringify(["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&q=80"]),
        sizes: JSON.stringify(["7 Days"]),
        colors: JSON.stringify(["Max 12 Guests"]),
        category_id: cat1.id,
        storeId,
        stock_quantity: 999,
        status: "active"
      }
    });

    await prisma.product.create({
      data: {
        name: "Swiss Alps Winter Chalet Wonderland",
        description: "Experience ultimate luxury in Zermatt. Access private ski lounges, custom dynamic snowboard rentals, and premium heated pools under the snowy Matterhorn. Enjoy gourmet fondue dinners, fireside champagne, and morning helicopter tours.",
        price: 1890.00,
        images: JSON.stringify(["https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1000&q=80"]),
        sizes: JSON.stringify(["5 Days"]),
        colors: JSON.stringify(["Max 8 Guests"]),
        category_id: cat2.id,
        storeId,
        stock_quantity: 999,
        status: "active"
      }
    });

    await prisma.product.create({
      data: {
        name: "Santorini Sunset Caldera Yacht Cruise",
        description: "Sail past red and white beaches on a private luxury catamaran. Indulge in Greek seafood barbecue prepared on-board by your private chef, enjoy unlimited premium volcanic wines, and witness the legendary Oia sunset from the finest vintage spot.",
        price: 1250.00,
        images: JSON.stringify(["https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&q=80"]),
        sizes: JSON.stringify(["4 Days"]),
        colors: JSON.stringify(["Max 15 Guests"]),
        category_id: cat1.id,
        storeId,
        stock_quantity: 999,
        status: "active"
      }
    });

    await prisma.product.create({
      data: {
        name: "Giza Pyramids & Cairo Private Expedition",
        description: "Access the majestic Sphinx and Pyramids through private, crowd-free VIP corridors. Includes a dedicated professional Egyptologist guide, five-star heritage hotel stays overlooking the Nile, private transfers, and a grand cruise dinner experience.",
        price: 850.00,
        images: JSON.stringify(["https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1000&q=80"]),
        sizes: JSON.stringify(["3 Days"]),
        colors: JSON.stringify(["Max 6 Guests"]),
        category_id: cat3.id,
        storeId,
        stock_quantity: 999,
        status: "active"
      }
    });

    await prisma.product.create({
      data: {
        name: "Kyoto Shrines & Tokyo Lights cultural Voyage",
        description: "Walk the historic Torii gates of Kyoto, attend a private high-grade tea ceremony, and witness the dazzling neon streets of Tokyo Shinjuku. Package includes luxury Shinkansen bullet train tickets, traditional ryokan stays, and Michelin sushi tours.",
        price: 2950.00,
        images: JSON.stringify(["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=80"]),
        sizes: JSON.stringify(["8 Days"]),
        colors: JSON.stringify(["Max 10 Guests"]),
        category_id: cat3.id,
        storeId,
        stock_quantity: 999,
        status: "active"
      }
    });

    await prisma.product.create({
      data: {
        name: "Amalfi Coast Scenic Luxury Private Yacht Journey",
        description: "Explore Positano, Amalfi, and Ravello from the deck of a custom Riva yacht. Cruise past high cliffs and picturesque sea caves. Package includes cliffside villa lodging with private infinity pools, high-end organic dining, and lemon groves trekking.",
        price: 3400.00,
        images: JSON.stringify(["https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&q=80"]),
        sizes: JSON.stringify(["6 Days"]),
        colors: JSON.stringify(["Max 14 Guests"]),
        category_id: cat1.id,
        storeId,
        stock_quantity: 999,
        status: "active"
      }
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Tourism Seed Error:", error);
    return { success: false, error: "Failed to seed travel demo packages." };
  }
}
