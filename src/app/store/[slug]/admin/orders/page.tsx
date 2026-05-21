import { prisma } from "@/lib/prisma";
import OrdersManager from "./OrdersManager";
import { getTranslation } from "@/lib/i18n";

export default async function OrdersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslation();

  const store = await prisma.store.findUnique({
    where: { slug },
    select: { id: true }
  });

   if (!store) {
     return <div>{t('storeNotFound')}</div>;
   }

  // Get first page (10 items) and total count to avoid SELECT * without limit
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
    take: 10
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
