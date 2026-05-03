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
            color: item.selectedColor
          }))
        },
        userId: data.userId
      },
      include: {
        items: true
      }
    });

    revalidatePath(`/store/[slug]/admin/orders`, 'page');
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
