import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const body = await req.json();
  if (!body.productId || !body.customerName || !body.rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      rating: Math.min(5, Math.max(1, body.rating)),
      comment: body.comment || null,
      customerName: body.customerName,
      customerEmail: body.customerEmail || null,
      productId: body.productId,
      storeId: store.id,
    },
  });
  return NextResponse.json({ review });
}
