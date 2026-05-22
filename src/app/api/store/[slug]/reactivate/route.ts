import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Stripe from "stripe";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { plan, demo, paymentIntentId } = await req.json();
    const user = await getSession();

    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });
    if (!user || store.ownerId !== user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Production: verify payment intent
    if (!demo) {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!paymentIntentId || !secretKey) {
        return NextResponse.json({ error: "Payment required" }, { status: 400 });
      }
      const stripe = new Stripe(secretKey);
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== "succeeded") {
        return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
      }
    }

    const now = new Date();
    const subscriptionEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.store.update({
      where: { id: store.id },
      data: {
        status: "active",
        plan: plan || "starter",
        subscriptionEndsAt,
        trialEndsAt: null,
      }
    });

    return NextResponse.json({ success: true, subscriptionEndsAt: subscriptionEndsAt.toISOString() });
  } catch (error: any) {
    console.error("Reactivate error:", error);
    return NextResponse.json({ error: error.message || "Failed to reactivate" }, { status: 500 });
  }
}
