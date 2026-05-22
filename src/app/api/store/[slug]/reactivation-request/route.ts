import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { plan, customerPhone, receiptImage, notes } = await req.json();
    const user = await getSession();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store || store.ownerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!customerPhone || customerPhone.length < 10) {
      return NextResponse.json({ error: "رقم الهاتف مطلوب" }, { status: 400 });
    }

    // Create the reactivation request
    const newRequest = await prisma.reactivationRequest.create({
      data: {
        storeId: store.id,
        plan: plan || "business",
        customerPhone,
        receiptImage: receiptImage || null,
        notes: notes || null,
        status: "pending",
      },
    });

    // Notify super admins (non-blocking)
    try {
      const superAdmins = await prisma.user.findMany({ where: { role: "superadmin" } });
      for (const admin of superAdmins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "طلب تفعيل متجر جديد",
            message: `${store.name} طلب تفعيل باقة ${plan || "business"} عبر فودافون كاش`,
            link: `/admin/stores/requests`,
            type: "reactivation_request",
          },
        });
      }
    } catch (e) {
      console.error("Notification creation failed (non-blocking):", e);
    }

    return NextResponse.json({ success: true, requestId: newRequest.id });
  } catch (error: any) {
    console.error("Reactivation request error:", error);
    return NextResponse.json({ error: error.message || "فشل إرسال الطلب" }, { status: 500 });
  }
}
