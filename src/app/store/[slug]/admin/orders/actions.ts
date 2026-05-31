'use server';

import { prisma } from "@/lib/prisma";
import { CartItem } from "@/lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { sendOrderConfirmation, sendNewOrderNotification, sendStatusUpdate } from "@/lib/email";

export async function createOrder(data: {
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string;
  totalAmount: number;
  items: CartItem[];
  userId?: string;
  couponCode?: string;
  paymentMethod?: string;
  transactionId?: string;
}) {
  let order: { id: string } = { id: "" };
  try {
    // 0. Preliminary Stock Check
    for (const item of data.items) {
      const product = await prisma.product.findUnique({ 
        where: { id: item.product.id },
        select: { name: true, colors: true, stock_quantity: true }
      });
      if (!product) throw new Error(`Product ${item.product?.name || 'Unknown'} no longer exists.`);
      
      const colors = typeof product.colors === 'string' ? JSON.parse(product.colors || '[]') : (product.colors || []);
      const colorObj = colors.find((c: any) => (c.name === item.selectedColor || c.value === item.selectedColor));
      const currentStock = colorObj?.stock ?? product.stock_quantity;
      
      if (currentStock < item.quantity) {
        return { 
          success: false, 
          error: `Sorry, only ${currentStock} units of ${product.name} (${item.selectedColor}) are left in stock.` 
        };
      }
    }

    order = await prisma.order.create({
      data: {
        storeId: data.storeId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        totalAmount: data.totalAmount,
        status: 'pending',
        items: {
          create: data.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.discount_price || item.product.price,
            size: item.selectedSize,
            color: item.selectedColor,
            image: item.selectedImage
          }))
        },
        userId: data.userId,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId
      },
      select: {
        id: true
      }
    });

    if (data.couponCode) {
      await prisma.coupon.update({
        where: { storeId_code: { storeId: data.storeId, code: data.couponCode.toUpperCase() } },
        data: { usedCount: { increment: 1 } }
      });
    }

    revalidatePath(`/store/[slug]/admin/orders`, 'page');



    // Record order metric in DailyMetric table (egress optimized)
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      await prisma.dailyMetric.upsert({
        where: {
          storeId_date: {
            storeId: data.storeId,
            date: today
          }
        },
        update: {
          orders: { increment: 1 },
          revenue: { increment: data.totalAmount }
        },
        create: {
          storeId: data.storeId,
          date: today,
          orders: 1,
          revenue: data.totalAmount
        },
        select: { id: true }
      });
    } catch (e) {
      console.error("Failed to record order metric:", e);
    }

    // Update stock for each variant
    try {
      for (const item of data.items) {
        const product = await prisma.product.findUnique({ 
          where: { id: item.product.id },
          select: { id: true, colors: true }
        });
        if (product) {
          const colors = typeof product.colors === 'string' ? JSON.parse(product.colors || '[]') : (product.colors || []);
          const updatedColors = colors.map((c: any) => {
            if (c.name === item.selectedColor || c.value === item.selectedColor) {
              const currentStock = typeof c.stock === 'number' ? c.stock : 10;
              return { ...c, stock: Math.max(0, currentStock - item.quantity) };
            }
            return c;
          });
          
          await prisma.product.update({
            where: { id: item.product.id },
            data: { 
              colors: JSON.stringify(updatedColors),
              stock_quantity: { decrement: item.quantity }
            },
            select: { id: true }
          });
        }
      }
    } catch (stockError) {
      console.error('Failed to update stock:', stockError);
      // We don't fail the order if stock update fails, but we log it
    }

    // Trigger on-demand cache revalidation for the storefront to update stock levels instantly
    try {
      const storeSlugInfo = await prisma.store.findUnique({
        where: { id: data.storeId },
        select: { slug: true }
      });
      if (storeSlugInfo?.slug) {
        revalidateTag(`store-${storeSlugInfo.slug}`, 'max');
      }
    } catch (revalError) {
      console.error("Failed to revalidate store cache on checkout:", revalError);
    }

    // Send email notifications (fire-and-forget, non-blocking)
    try {
      const storeInfo = await prisma.store.findUnique({
        where: { id: data.storeId },
        select: { name: true, owner: { select: { email: true } } }
      });

      const emailItems = data.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.discount_price || item.product.price,
        image: item.selectedImage,
        color: item.selectedColor,
        size: item.selectedSize,
      }));

      await sendOrderConfirmation(data.customerEmail, data.customerName, order.id, emailItems, data.totalAmount);

      if (storeInfo?.owner?.email) {
        await sendNewOrderNotification(storeInfo.owner.email, data.customerName, order.id, data.totalAmount, data.customerEmail, data.customerPhone);
      }
    } catch (e) {
      console.error("[Email] Failed to send order emails:", e);
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Failed to create order' };
  }
}

export async function getStoreOrders(storeId: string) {
  try {
    // Limit to 10 to prevent SELECT * without limit
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        items: {
          select: {
            id: true,
            orderId: true,
            productId: true,
            quantity: true,
            price: true,
            size: true,
            color: true,
            image: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getStoreOrdersPaginated({
  storeId,
  page = 1,
  limit = 10,
  search = '',
  status = ''
}: {
  storeId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  try {
    const where: any = { storeId };
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          select: {
            id: true,
            orderId: true,
            productId: true,
            quantity: true,
            price: true,
            size: true,
            color: true,
            image: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });
    
    const totalCount = await prisma.order.count({ where });
    
    return {
      success: true,
      orders,
      hasMore: skip + orders.length < totalCount,
      totalCount
    };
  } catch (error: any) {
    console.error('Error fetching paginated orders:', error);
    return { success: false, orders: [], hasMore: false, totalCount: 0, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath(`/store/[slug]/admin/orders`, 'page');

    try {
      const orderInfo = await prisma.order.findUnique({
        where: { id: orderId },
        select: { customerEmail: true, customerName: true }
      });
      if (orderInfo) {
        await sendStatusUpdate(orderInfo.customerEmail, orderInfo.customerName, orderId, status);
      }
    } catch (e) {
      console.error("[Email] Failed to send status update:", e);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: string, transactionId?: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus,
        ...(transactionId ? { transactionId } : {})
      }
    });
    revalidatePath(`/store/[slug]/admin/orders`, 'page');
    return { success: true };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}
