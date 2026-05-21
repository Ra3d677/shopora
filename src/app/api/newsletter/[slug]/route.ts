import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { email } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { storeId_email: { storeId: store.id, email } }
  });
  if (existing) return NextResponse.json({ message: "Already subscribed" });

  await prisma.newsletterSubscriber.create({ data: { email, storeId: store.id } });
  return NextResponse.json({ success: true });
}
