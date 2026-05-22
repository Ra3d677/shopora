import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ received: true });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ received: true });

  const stripe = new Stripe(secretKey);
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const storeId = pi.metadata?.storeId;
    const plan = pi.metadata?.plan;

    if (storeId) {
      const now = new Date();
      const subscriptionEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      await prisma.store.update({
        where: { id: storeId },
        data: {
          status: "active",
          plan: plan || "starter",
          subscriptionEndsAt,
          trialEndsAt: null,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
