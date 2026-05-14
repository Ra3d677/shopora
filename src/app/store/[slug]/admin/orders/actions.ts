'use server';

import { prisma } from "@/lib/prisma";
import { CartItem } from "@/lib/types";
import { revalidatePath } from "next/cache";

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
}) {
  try {
    // 0. Preliminary Stock Check
    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.product.id } });
      if (!product) throw new Error(`Product ${item.product.name} no longer exists.`);
      
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

    const order = await prisma.order.create({
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
        userId: data.userId
      },
      include: {
        items: true
      }
    });

    revalidatePath(`/store/[slug]/admin/orders`, 'page');

    // Update stock for each variant
    try {
      for (const item of data.items) {
        const product = await prisma.product.findUnique({ where: { id: item.product.id } });
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
            }
          });
        }
      }
    } catch (stockError) {
      console.error('Failed to update stock:', stockError);
      // We don't fail the order if stock update fails, but we log it
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Failed to create order' };
  }
}

export async function getStoreOrders(storeId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath(`/store/[slug]/admin/orders`, 'page');
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
