import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const body = await req.json();
  if (!body.name || !body.quote) {
    return NextResponse.json({ error: "Missing required fields (name, quote)" }, { status: 400 });
  }

  const initials = body.name
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const currentSettings = store.settings ? JSON.parse(store.settings) : {};
  const ip = currentSettings.ironpeakSettings || {};
  const t = ip.testimonials || {};
  const customerItems = t.customerItems || [];

  customerItems.push({
    quote: body.quote,
    author: body.name,
    meta: body.meta || "",
    initials,
    createdAt: new Date().toISOString(),
  });

  await prisma.store.update({
    where: { slug },
    data: {
      settings: JSON.stringify({
        ...currentSettings,
        ironpeakSettings: {
          ...ip,
          testimonials: { ...t, customerItems },
        },
      }),
    },
  });

  try { revalidateTag(`settings-${slug}`, 'max'); revalidateTag(`store-${slug}`, 'max'); } catch {}

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const { index } = await req.json();
  if (index === undefined || index === null) {
    return NextResponse.json({ error: "index required" }, { status: 400 });
  }

  const currentSettings = store.settings ? JSON.parse(store.settings) : {};
  const ip = currentSettings.ironpeakSettings || {};
  const t = ip.testimonials || {};
  const customerItems = t.customerItems || [];

  if (index < 0 || index >= customerItems.length) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
  }

  customerItems.splice(index, 1);

  await prisma.store.update({
    where: { slug },
    data: {
      settings: JSON.stringify({
        ...currentSettings,
        ironpeakSettings: {
          ...ip,
          testimonials: { ...t, customerItems },
        },
      }),
    },
  });

  try { revalidateTag(`settings-${slug}`, 'max'); revalidateTag(`store-${slug}`, 'max'); } catch {}

  // Revalidate the storefront page
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/store/${slug}/testimonials`, 'page');
  } catch {}

  return NextResponse.json({ success: true });
}
