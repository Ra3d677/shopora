"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCoupon(data: {
  storeId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder?: number;
  expiresAt?: Date | null;
  usageLimit?: number | null;
}) {
  return await prisma.coupon.create({
    data: {
      ...data,
    }
  });
}

export async function deleteCoupon(couponId: string, storeId: string) {
  await prisma.coupon.delete({
    where: { id: couponId }
  });
  revalidatePath(`/store/${storeId}/admin/coupons`);
}