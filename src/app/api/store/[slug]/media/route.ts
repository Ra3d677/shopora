import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    const store = await prisma.store.findUnique({
      where: { slug },
      include: { media: true }
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(store.media);
  } catch (error) {
    console.error("API MEDIA ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    const store = await prisma.store.findUnique({
      where: { slug }
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const { url, name, type } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let finalUrl = url;
    if (url.startsWith("data:")) {
      const uploadResult = await uploadToCloudinary(url, `shopora/${slug}`);
      if (!uploadResult.success) {
        return NextResponse.json({ error: "Failed to upload to Cloudinary: " + uploadResult.error }, { status: 500 });
      }
      finalUrl = uploadResult.url!;
    }

    const media = await prisma.media.create({
      data: {
        url: finalUrl,
        name: name || "Uploaded Image",
        type: type || "image",
        storeId: store.id
      }
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("API MEDIA POST ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
