import prisma from "@/lib/prisma";
import { getStoreBySlug } from "@/lib/data";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CouponManager from "./CouponManager";

export default async function AdminCouponsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  const store = await getStoreBySlug(slug);

  if (!session || !store || (session.role !== 'superadmin' && store.ownerId !== session.id)) {
    redirect("/auth/login");
  }

  const coupons = await prisma.coupon.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <CouponManager slug={slug} storeId={store.id} initialCoupons={coupons} />
  );
}