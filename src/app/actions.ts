"use server";

import { cookies } from "next/headers";
import { createStore } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function setLanguageCookie(lang: 'en' | 'ar') {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', lang, { path: '/' });
}

export async function createStoreAction(data: { name: string; slug: string; template: string }) {
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
  } catch (error) {
    console.error("Failed to record cart add:", error);
  }
}
