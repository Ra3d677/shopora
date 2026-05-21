import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({
    where: { storeId_code: { storeId: store.id, code: code.toUpperCase() } }
  });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ valid: false, error: "Invalid or expired coupon code" });
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ valid: false, error: "This coupon has expired" });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return NextResponse.json({ valid: false, error: `Minimum order of $${coupon.minOrder} required` });
  }

  let discount = coupon.discountType === 'percentage'
    ? (subtotal * coupon.discountValue) / 100
    : coupon.discountValue;

  discount = Math.min(discount, subtotal);

  return NextResponse.json({
    valid: true,
    discount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    code: coupon.code,
  });
}
