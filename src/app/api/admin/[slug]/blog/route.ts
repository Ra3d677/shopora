import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

async function verifyOwner(slug: string) {
  const session = await getSession();
  if (!session) return null;
  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true, ownerId: true } });
  if (!store || (store.ownerId !== session.id && session.role !== 'superadmin')) return null;
  return store;
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = await params;
  const store = await verifyOwner(slug);
  if (!store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await prisma.blogPost.findMany({ where: { storeId: store.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = await params;
  const store = await verifyOwner(slug);
  if (!store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content: body.content || "",
      excerpt: body.excerpt || null,
      image: body.image || null,
      author: body.author || "Admin",
      published: true,
      storeId: store.id,
    },
  });
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = await params;
  const store = await verifyOwner(slug);
  if (!store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await prisma.blogPost.update({ where: { id: body.postId }, data: { published: body.published } });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = await params;
  const store = await verifyOwner(slug);
  if (!store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await prisma.blogPost.delete({ where: { id: body.postId } });
  return NextResponse.json({ success: true });
}
