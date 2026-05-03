import { prisma } from "@/lib/prisma";
import OrdersManager from "./OrdersManager";

export default async function OrdersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (!store) {
    return <div>Store not found</div>;
  }

  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
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

  return <OrdersManager initialOrders={orders} slug={slug} />;
}
