import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const media = await prisma.media.findMany({
    where: { store: { slug } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true, ownerId: true } });
  if (!store || (store.ownerId !== session?.id && session?.role !== 'superadmin')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let finalUrl = body.url;
  if (body.url.startsWith("data:")) {
    const uploadResult = await uploadToCloudinary(body.url, `shopora/${slug}`);
    if (!uploadResult.success) {
      return NextResponse.json({ error: "Failed to upload to Cloudinary: " + uploadResult.error }, { status: 500 });
    }
    finalUrl = uploadResult.url!;
  }

  const media = await prisma.media.create({
    data: {
      url: finalUrl,
      name: body.name || "Untitled",
      type: body.type || "image",
      storeId: store.id,
    },
  });
  return NextResponse.json(media);
}
