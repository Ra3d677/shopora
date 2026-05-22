import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Platform payment not configured" }, { status: 400 });
    }

    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, plan } = await req.json();
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store || store.ownerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prices: Record<string, number> = { starter: 900, business: 2500, plus: 3900 };
    const amount = prices[plan] || 2500;

    const stripe = new Stripe(secretKey);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { storeId: store.id, plan, userId: user.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    });
  } catch (error: any) {
    console.error("Subscription intent error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
