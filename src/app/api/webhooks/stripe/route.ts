import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") || "";

    const event = JSON.parse(body);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const transactionId = paymentIntent.id;

      const order = await prisma.order.findFirst({
        where: { transactionId }
      });

      if (order && order.paymentStatus !== "paid") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "paid",
            paymentDetails: JSON.stringify({
              receiptUrl: paymentIntent.receipt_url || paymentIntent.latest_charge,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              paidAt: new Date().toISOString()
            })
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
