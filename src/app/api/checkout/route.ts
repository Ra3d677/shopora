import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, customer, items, total, storeId } = body;

    // Simulate WhatsApp API integration (e.g., Twilio or WhatsApp Cloud API)
    const message = `
*New Order Received!* 🛍️
Order ID: ${orderId}
Store ID: ${storeId}

*Customer Details:*
Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
Notes: ${customer.notes || 'None'}

*Items:*
${items.map((item: any) => `- ${item.quantity}x ${item.product.name} (${item.selectedSize}, ${item.selectedColor}) - $${(item.product.discount_price || item.product.price) * item.quantity}`).join('\n')}

*Total:* $${total.toFixed(2)}
    `.trim();

    console.log("=== WHATSAPP AUTOMATION TRIGGERED ===");
    console.log("Sending message to admin number...");
    console.log(message);
    console.log("=====================================");

    // In a real app:
    // await twilioClient.messages.create({
    //   body: message,
    //   from: 'whatsapp:+14155238886',
    //   to: 'whatsapp:' + process.env.ADMIN_WHATSAPP_NUMBER
    // });

    return NextResponse.json({ success: true, message: "Order processed and notification sent." });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 });
  }
}
