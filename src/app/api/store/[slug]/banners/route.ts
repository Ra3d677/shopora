import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { banners, sliderSettings } = body;

    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) {
      return NextResponse.json({ success: false, error: "Store not found" }, { status: 404 });
    }

    await prisma.banner.deleteMany({ where: { storeId: store.id } });

    if (banners && Array.isArray(banners) && banners.length > 0) {
      const bannerData = banners.filter(Boolean).map((banner: any, i: number) => ({
        imageUrl: banner.imageUrl || "",
        mobileImageUrl: banner.mobileImageUrl || null,
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        buttonText: banner.buttonText || "",
        buttonLink: banner.buttonLink || "",
        showButton: banner.showButton !== false,
        buttonPosition: banner.buttonPosition || "center",
        buttonShape: banner.buttonShape || "rounded",
        buttonColor: banner.buttonColor || "primary",
        isActive: banner.isActive !== false,
        order: typeof banner.order === "number" ? banner.order : i,
        position: banner.position || "top",
        targetPage: banner.targetPage || "home",
        storeId: store.id,
      }));
      await prisma.banner.createMany({ data: bannerData });
    }

    if (sliderSettings) {
      let settings = store.settings ? JSON.parse(store.settings) : {};
      settings.bannerSettings = sliderSettings;
      await prisma.store.update({
        where: { slug },
        data: { settings: JSON.stringify(settings) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Banner save API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
