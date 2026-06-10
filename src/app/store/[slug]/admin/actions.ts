"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary";

function revalidateStoreCache(slug: string) {
  try {
    revalidateTag(`store-${slug}`, 'max');
    revalidateTag(`products-${slug}`, 'max');
    revalidateTag(`categories-${slug}`, 'max');
    revalidateTag(`banners-${slug}`, 'max');
    revalidateTag(`settings-${slug}`, 'max');
    revalidateTag(`template-${slug}`, 'max');
  } catch (e) {
    console.error("Cache Revalidation Error:", e);
  }
}

export async function deleteProduct(slug: string, productId: string) {
  await prisma.product.delete({
    where: { id: productId }
  });
  revalidateStoreCache(slug);
  revalidatePath("/", "layout");
}

export async function addProduct(slug: string, productData: any) {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return;

  let finalImages = [];
  if (productData.images && Array.isArray(productData.images)) {
    for (const img of productData.images) {
      if (img.startsWith('data:')) {
        const uploadResult = await uploadToCloudinary(img, `shopora/${slug}/products`);
        if (uploadResult.success) finalImages.push(uploadResult.url);
      } else {
        finalImages.push(img);
      }
    }
  }

  await prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      discount_price: productData.discount_price ? parseFloat(productData.discount_price) : null,
      images: JSON.stringify(finalImages),
      sizes: JSON.stringify(productData.sizes || []),
      colors: JSON.stringify(productData.colors || []),
      category_id: productData.category_id,
      storeId: store.id,
      status: 'active',
      stock_quantity: parseInt(productData.stock_quantity) || 0
    }
  });
  
  revalidateStoreCache(slug);
  revalidatePath("/", "layout");
}

export async function updateProduct(slug: string, productId: string, updates: any) {
  let finalImages = updates.images;
  if (updates.images && Array.isArray(updates.images)) {
    finalImages = [];
    for (const img of updates.images) {
      if (img.startsWith('data:')) {
        const uploadResult = await uploadToCloudinary(img, `shopora/${slug}/products`);
        if (uploadResult.success) finalImages.push(uploadResult.url);
      } else {
        finalImages.push(img);
      }
    }
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...updates,
      price: updates.price ? parseFloat(updates.price) : undefined,
      discount_price: updates.discount_price !== undefined ? (updates.discount_price ? parseFloat(updates.discount_price) : null) : undefined,
      images: finalImages ? JSON.stringify(finalImages) : undefined,
      sizes: updates.sizes ? JSON.stringify(updates.sizes) : undefined,
      colors: updates.colors ? JSON.stringify(updates.colors) : undefined,
    }
  });
  revalidateStoreCache(slug);
  revalidatePath("/", "layout");
}

export async function deleteCategory(slug: string, categoryId: string) {
  await prisma.category.delete({
    where: { id: categoryId }
  });
  revalidateStoreCache(slug);
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
      parentId: categoryData.parentId || null,
      storeId: store.id
    }
  });
  
  revalidateStoreCache(slug);
  revalidatePath("/", "layout");
}

export async function updateCategory(slug: string, categoryId: string, updates: any) {
  const { parentId, ...rest } = updates;
  await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...rest,
      parentId: parentId === "" ? null : parentId
    }
  });
  revalidateStoreCache(slug);
  revalidatePath("/", "layout");
}

export async function updateActiveTemplateAction(slug: string, template: string) {
  await prisma.store.update({
    where: { slug },
    data: { template }
  });
  revalidateStoreCache(slug);
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
    revalidateStoreCache(slug);
    revalidatePath(`/store/${slug}`, 'page');
    revalidatePath(`/store/${slug}/admin/colors`);
    revalidatePath(`/`, 'layout');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save store settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}

export async function saveBanners(slug: string, banners: any[], sliderSettings?: any) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/store/${slug}/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banners, sliderSettings }),
    });
    const result = await res.json();
    if (result.success) {
      revalidateStoreCache(slug);
      revalidatePath(`/store/${slug}/admin/banners`);
      revalidatePath(`/store/${slug}`);
      revalidatePath(`/`, 'layout');
    }
    return result;
  } catch (error: any) {
    console.error("Failed to save banners:", error);
    return { success: false, error: error.message || "Failed to save banners" };
  }
}

export async function addMedia(slug: string, mediaData: { url: string, name: string, type: string }) {
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return { success: false, error: "Store not found" };

  let finalUrl = mediaData.url;
  if (mediaData.url.startsWith("data:")) {
    const uploadResult = await uploadToCloudinary(mediaData.url, `shopora/${slug}`);
    if (!uploadResult.success) {
      return { success: false, error: "Failed to upload to Cloudinary: " + uploadResult.error };
    }
    finalUrl = uploadResult.url!;
  }

  const media = await prisma.media.create({
    data: {
      ...mediaData,
      url: finalUrl,
      storeId: store.id
    }
  });

  revalidatePath(`/store/${slug}/admin/media`);
  return { success: true, media };
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
    revalidateStoreCache(slug);
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

const SEED_TEMPLATES = [
  { id: "2h", name: "2H Theme", description: "Fitness Center – نموذج متكامل لمراكز اللياقة البدنية مع سلايدر، معرض صور، فئات تدريب، تسعير، مدربين، مدونة وقسم فيديو", preview: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { id: "ironpeak", name: "Iron Peak Fitness", description: "Iron Peak – Health, Gym & Fitness Center - Personal Trainer HTML5 Template", preview: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { id: "2m", name: "2M", description: "إلكترونيات - تصميم عصري بألوان صفراء وردية مناسب لمتاجر الإلكترونيات والتكنولوجيا.", preview: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80" },
];

export async function seedMissingTemplatesAction() {
  let count = 0;
  for (const t of SEED_TEMPLATES) {
    const existing = await prisma.template.findUnique({ where: { id: t.id } });
    if (!existing) {
      await prisma.template.create({ data: t });
      count++;
    }
  }
  revalidatePath("/", "layout");
  return { success: true, count };
}

