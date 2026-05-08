"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(slug: string, productId: string) {
  await prisma.product.delete({
    where: { id: productId }
  });
  revalidatePath("/", "layout");
}

export async function addProduct(slug: string, productData: any) {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return;

  await prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      discount_price: productData.discount_price ? parseFloat(productData.discount_price) : null,
      images: JSON.stringify(productData.images || []),
      sizes: JSON.stringify(productData.sizes || []),
      colors: JSON.stringify(productData.colors || []),
      category_id: productData.category_id,
      storeId: store.id,
      status: 'active',
      stock_quantity: parseInt(productData.stock_quantity) || 0
    }
  });
  
  revalidatePath("/", "layout");
}

export async function updateProduct(slug: string, productId: string, updates: any) {
  await prisma.product.update({
    where: { id: productId },
    data: {
      ...updates,
      price: updates.price ? parseFloat(updates.price) : undefined,
      discount_price: updates.discount_price !== undefined ? (updates.discount_price ? parseFloat(updates.discount_price) : null) : undefined,
      images: updates.images ? JSON.stringify(updates.images) : undefined,
      sizes: updates.sizes ? JSON.stringify(updates.sizes) : undefined,
      colors: updates.colors ? JSON.stringify(updates.colors) : undefined,
    }
  });
  revalidatePath("/", "layout");
}

export async function deleteCategory(slug: string, categoryId: string) {
  await prisma.category.delete({
    where: { id: categoryId }
  });
  revalidatePath("/", "layout");
}

export async function addCategory(slug: string, categoryData: any) {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return;

  await prisma.category.create({
    data: {
      name: categoryData.name,
      description: categoryData.description,
      image: categoryData.image,
      storeId: store.id
    }
  });
  
  revalidatePath("/", "layout");
}

export async function updateCategory(slug: string, categoryId: string, updates: any) {
  await prisma.category.update({
    where: { id: categoryId },
    data: updates
  });
  revalidatePath("/", "layout");
}

export async function updateActiveTemplateAction(slug: string, template: string) {
  await prisma.store.update({
    where: { slug },
    data: { template }
  });
  revalidatePath("/", "layout");
}

export const toggleStoreStatus = async (storeId: string, currentStatus: boolean) => {
  try {
    await prisma.store.update({
      where: { id: storeId },
      data: { isActive: !currentStatus }
    });
    revalidatePath(`/`, "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update store status" };
  }
};

export const deleteStorePlatformAction = async (storeId: string) => {
  try {
    // Delete all related data first (cascading in prisma or manually)
    await prisma.store.delete({
      where: { id: storeId }
    });
    revalidatePath(`/`, "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete store" };
  }
};

export const changeTemplatePlatformAction = async (storeId: string, template: string) => {
  try {
    await prisma.store.update({
      where: { id: storeId },
      data: { template }
    });
    revalidatePath(`/`, "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update template" };
  }
};

export async function saveStoreSettings(slug: string, settings: any) {
  try {
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) return { success: false, error: "Store not found" };

    const currentSettings = store.settings ? JSON.parse(store.settings) : {};
    
    // Extract storeName and pixel IDs to update them at the root model level
    const { 
      storeName, 
      facebookPixelId, 
      tiktokPixelId, 
      snapchatPixelId, 
      googleAnalyticsId, 
      ...otherSettings 
    } = settings;
    
    const updatedSettings = { ...currentSettings, ...otherSettings };
    
    await prisma.store.update({
      where: { slug },
      data: {
        name: storeName || store.name,
        facebookPixelId: facebookPixelId ?? store.facebookPixelId,
        tiktokPixelId: tiktokPixelId ?? store.tiktokPixelId,
        snapchatPixelId: snapchatPixelId ?? store.snapchatPixelId,
        googleAnalyticsId: googleAnalyticsId ?? store.googleAnalyticsId,
        settings: JSON.stringify(updatedSettings)
      }
    });
    revalidatePath(`/store/${slug}`, 'page');
    revalidatePath(`/store/${slug}/admin/colors`);
    revalidatePath(`/`, 'layout');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save store settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}

export async function saveBanners(slug: string, banners: any[]) {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return { success: false, error: "Store not found" };

  try {
    // Delete existing banners for this store
    await prisma.banner.deleteMany({
      where: { storeId: store.id }
    });

    // Create new banners (Using a loop because SQLite doesn't support createMany)
    if (banners && Array.isArray(banners) && banners.length > 0) {
      for (const banner of banners) {
        if (!banner) continue;
        await prisma.banner.create({
          data: {
            imageUrl: banner.imageUrl || "",
            mobileImageUrl: banner.mobileImageUrl || null,
            title: banner.title || "",
            subtitle: banner.subtitle || "",
            buttonText: banner.buttonText || "",
            buttonLink: banner.buttonLink || "",
            isActive: banner.isActive !== false,
            order: typeof banner.order === 'number' ? banner.order : 0,
            position: banner.position || "top",
            targetPage: banner.targetPage || "home",
            storeId: store.id
          }
        });
      }
    }

    revalidatePath(`/store/${slug}`, 'layout');
    revalidatePath(`/store/${slug}/admin/banners`);
    revalidatePath(`/store/${slug}/(storefront)`, 'layout');
    revalidatePath(`/`, 'layout');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save banners:", error);
    return { success: false, error: "Failed to save banners: " + (error.message || "Unknown error") };
  }
}

export async function addMedia(slug: string, mediaData: { url: string, name: string, type: string }) {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return { success: false, error: "Store not found" };

  await prisma.media.create({
    data: {
      ...mediaData,
      storeId: store.id
    }
  });

  revalidatePath(`/store/${slug}/admin/media`);
  return { success: true };
}

export async function deleteMedia(slug: string, mediaId: string) {
  await prisma.media.delete({
    where: { id: mediaId }
  });

  revalidatePath(`/store/${slug}/admin/media`);
  return { success: true };
}

export async function updateStoreSettingByKey(slug: string, keyPath: string, value: any) {
  return updateStoreSettings(slug, { [keyPath]: value });
}

export async function updateStoreSettings(slug: string, updates: Record<string, any>) {
  try {
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) return { success: false, error: "Store not found" };

    let settings = store.settings ? JSON.parse(store.settings) : {};

    for (const [keyPath, value] of Object.entries(updates)) {
      // Special case for root store name
      if (keyPath === 'storeName') {
        await prisma.store.update({
          where: { slug },
          data: { name: value }
        });
        continue;
      }

      const keys = keyPath.split('.');
      let current = settings;
      for (let i = 0; i < keys.length - 1; i++) {
        // Root Cause Fix: If it exists but isn't an object, force it to be an object
        if (!current[keys[i]] || typeof current[keys[i]] !== 'object' || Array.isArray(current[keys[i]])) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    }

    await prisma.store.update({
      where: { slug },
      data: {
        settings: JSON.stringify(settings)
      }
    });
    revalidatePath(`/store/${slug}`, 'page');
    revalidatePath(`/`, 'layout');
    return { success: true };
  } catch (error) {
    console.error("Failed to update store settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function getStoreMedia(slug: string) {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: { media: { orderBy: { createdAt: 'desc' } } }
  });
  return store?.media || [];
}

export async function deleteTemplateAction(templateId: string) {
  // Check if any store is using this template
  const storesUsing = await prisma.store.findMany({
    where: { template: templateId }
  });

  if (storesUsing.length > 0) {
    return { 
      success: false, 
      error: `Cannot delete: ${storesUsing.length} stores are currently using this template.` 
    };
  }

  await prisma.template.delete({
    where: { id: templateId }
  });

  revalidatePath("/", "layout");
  return { success: true };
}

export async function toggleTemplateStatusAction(templateId: string, currentStatus: boolean) {
  await prisma.template.update({
    where: { id: templateId },
    data: { isActive: !currentStatus }
  });
  revalidatePath("/", "layout");
  return { success: true };
}

