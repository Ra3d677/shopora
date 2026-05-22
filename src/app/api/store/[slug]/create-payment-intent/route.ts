import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { amount } = await req.json();

    const store = await prisma.store.findUnique({
      where: { slug },
      select: { settings: true }
    });

    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const settings = typeof store.settings === "string" ? JSON.parse(store.settings) : store.settings;
    const stripeSecretKey = settings?.businessSettings?.paymentKeys?.stripe?.secretKey;

    if (!stripeSecretKey) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json({ error: error.message || "Failed to create payment intent" }, { status: 500 });
  }
}
