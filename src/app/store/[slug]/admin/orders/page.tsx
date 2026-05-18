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

  // Get first page (20 items) and total count to avoid SELECT * without limit
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
    },
    take: 20
  });

  const totalCount = await prisma.order.count({
    where: { storeId: store.id }
  });

  return (
    <OrdersManager 
      initialOrders={orders} 
      slug={slug} 
      storeId={store.id} 
      initialHasMore={orders.length < totalCount}
    />
  );
}
