import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.role === "superadmin" || session?.email === "ksh128395@gmail.com";
    if (!isSuperAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { requestId, action } = await req.json();
    if (!requestId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const request = await prisma.reactivationRequest.findUnique({
      where: { id: requestId },
      include: { store: true },
    });
    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    if (action === "approve") {
      const now = new Date();
      const durationMs = (request.durationDays || 30) * 24 * 60 * 60 * 1000;
      const subscriptionEndsAt = new Date(now.getTime() + durationMs);

      await prisma.store.update({
        where: { id: request.storeId },
        data: {
          status: "active",
          plan: request.plan,
          subscriptionEndsAt,
          trialEndsAt: null,
        },
      });
    }

    await prisma.reactivationRequest.update({
      where: { id: requestId },
      data: {
        status: action === "approve" ? "approved" : "rejected",
        reviewedBy: session.id,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin request action error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
