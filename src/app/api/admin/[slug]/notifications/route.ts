import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ notifications: [] });
  }

  const recentOrders = await prisma.order.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      customerName: true,
      status: true,
      createdAt: true,
    },
  });

  const lowStockProducts = await prisma.product.findMany({
    where: { storeId: store.id, stock_quantity: { gt: 0, lt: 5 } },
    select: { id: true, name: true, stock_quantity: true },
  });

  const notifications: {
    id: string;
    type: "order" | "low_stock";
    message: string;
    time: string;
    href: string;
  }[] = [];

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  recentOrders.forEach((order) => {
    if (order.createdAt > oneDayAgo) {
      const minsAgo = Math.floor(
        (now.getTime() - order.createdAt.getTime()) / 60000
      );
      const timeLabel =
        minsAgo < 60
          ? `${minsAgo}m ago`
          : `${Math.floor(minsAgo / 60)}h ago`;
      notifications.push({
        id: `order-${order.id}`,
        type: "order",
        message: `New order from ${order.customerName}`,
        time: timeLabel,
        href: `/store/${slug}/admin/orders`,
      });
    }
  });

  lowStockProducts.forEach((p) => {
    notifications.push({
      id: `stock-${p.id}`,
      type: "low_stock",
      message: `${p.name} — only ${p.stock_quantity} left`,
      time: "Low Stock",
      href: `/store/${slug}/admin/products`,
    });
  });

  return NextResponse.json({
    notifications: notifications.slice(0, 10),
  });
}
