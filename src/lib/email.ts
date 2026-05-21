import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@shopora.store";

let resend: Resend | null = null;
if (RESEND_API_KEY) {
  try {
    resend = new Resend(RESEND_API_KEY);
  } catch {
    console.warn("[Email] Failed to initialize Resend");
  }
}

function wrapTemplate(title: string, body: string) {
  return `<!DOCTYPE html>
<html dir="ltr" lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f6f9;color:#1e293b}
  .container{max-width:560px;margin:0 auto;padding:24px 16px}
  .card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)}
  .header{background:linear-gradient(135deg,#06b6d4,#2563eb);padding:32px;text-align:center}
  .header h1{color:#fff;font-size:22px;font-weight:800;letter-spacing:-.5px;margin:0}
  .header p{color:rgba(255,255,255,.8);font-size:13px;margin-top:6px}
  .content{padding:32px}
  .content h2{font-size:18px;font-weight:700;margin-bottom:16px}
  .content p{font-size:14px;line-height:1.7;color:#475569;margin-bottom:12px}
  .btn{display:inline-block;padding:12px 28px;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;text-align:center;background:linear-gradient(135deg,#06b6d4,#2563eb);color:#fff;margin:16px 0}
  table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
  th{background:#f8fafc;color:#64748b;font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.5px;padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0}
  td{padding:10px 12px;border-bottom:1px solid #f1f5f9}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase}
  .badge-pending{background:#fef3c7;color:#d97706}
  .badge-processing{background:#dbeafe;color:#2563eb}
  .badge-shipped{background:#e0f2fe;color:#0891b2}
  .badge-delivered{background:#d1fae5;color:#059669}
  .badge-cancelled{background:#fee2e2;color:#dc2626}
  .footer{text-align:center;padding:24px 32px;font-size:12px;color:#94a3b8;border-top:1px solid #f1f5f9}
</style></head><body>
<div class="container">
  <div class="card">
    <div class="header"><h1>${title}</h1></div>
    <div class="content">${body}</div>
    <div class="footer"><p>Shopora — Built for scale</p></div>
  </div>
</div></body></html>`;
}

function welcomeEmail(name: string) {
  return wrapTemplate("Welcome Aboard! 🎉",
    `<h2>Welcome to Shopora, ${name}!</h2>
<p>We're thrilled to have you on board. Your account has been created successfully and you're now ready to explore everything we have to offer.</p>
<table><tr><td>🛍️</td><td><strong>Explore stores</strong><br><span style="color:#64748b;font-size:13px">Browse amazing products from our merchants</span></td></tr>
<tr><td>📦</td><td><strong>Track orders</strong><br><span style="color:#64748b;font-size:13px">Keep an eye on your purchases</span></td></tr>
<tr><td>💬</td><td><strong>Contact support</strong><br><span style="color:#64748b;font-size:13px">We're here to help</span></td></tr></table>
<p style="margin-top:20px">If you have any questions, just reply to this email.</p>
<p style="margin-top:24px;font-weight:600">The Shopora Team</p>`);
}

function orderConfirmationEmail(
  customerName: string, orderId: string,
  items: { name: string; quantity: number; price: number; image?: string; color?: string; size?: string }[],
  total: number
) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:12px">
        <div style="display:flex;align-items:center;gap:12px">
          ${item.image ? `<img src="${item.image}" alt="" style="width:44px;height:44px;border-radius:8px;object-fit:cover" />` : ""}
          <div><strong>${item.name}</strong>${item.color ? `<br><span style="color:#64748b;font-size:12px">${item.color}${item.size ? ` / ${item.size}` : ""}</span>` : ""}</div>
        </div>
      </td>
      <td style="text-align:center">x${item.quantity}</td>
      <td style="text-align:right;font-weight:600">$${(item.price * item.quantity).toFixed(0)}</td>
    </tr>`).join("");

  return wrapTemplate("Order Confirmed 🛍️",
    `<h2>Thank you for your order, ${customerName}!</h2>
<p>Your order has been placed successfully and is now being processed.</p>
<p style="background:#f8fafc;padding:10px 14px;border-radius:10px;font-size:13px">
  <strong>Order ID:</strong> <span style="color:#06b6d4">#${orderId.slice(0, 8)}</span><br>
  <strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
</p>
<table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Total</th></tr></thead><tbody>${itemsHtml}</tbody></table>
<div style="background:#f8fafc;padding:16px;border-radius:12px;margin-top:12px;text-align:right">
  <strong style="font-size:18px">Total: $${total.toFixed(0)}</strong>
</div>
<p style="margin-top:20px">We'll send you an update when your order ships.</p>
<p style="margin-top:24px;font-weight:600">The Shopora Team</p>`);
}

function newOrderNotificationEmail(customerName: string, orderId: string, total: number, customerEmail: string, customerPhone: string) {
  return wrapTemplate("New Order! 📦",
    `<h2>New Order Received!</h2>
<p>A new order has been placed on your store.</p>
<p style="background:#f8fafc;padding:10px 14px;border-radius:10px;font-size:13px">
  <strong>Order ID:</strong> <span style="color:#06b6d4">#${orderId.slice(0, 8)}</span><br>
  <strong>Customer:</strong> ${customerName}<br>
  <strong>Email:</strong> ${customerEmail}<br>
  <strong>Phone:</strong> ${customerPhone}<br>
  <strong>Total:</strong> <span style="font-size:16px;font-weight:700">$${total.toFixed(0)}</span>
</p>
<p style="margin-top:20px;font-weight:600">Shopora</p>`);
}

function statusUpdateEmail(customerName: string, orderId: string, status: string) {
  const labels: Record<string, string> = { pending: "Pending", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };
  const msgs: Record<string, string> = {
    processing: "Your order is now being prepared. Our team is working hard to get it ready for shipping.",
    shipped: "Great news! Your order has been shipped and is on its way to you.",
    delivered: "Your order has been delivered. We hope you love it!",
    cancelled: "Your order has been cancelled. If you believe this was a mistake, please contact our support team.",
  };
  return wrapTemplate("Order Update 📬",
    `<h2>Order Update, ${customerName}</h2>
<p>Your order status has been updated to <span class="badge badge-${status}">${labels[status] || status}</span>.</p>
<p>${msgs[status] || `Your order status has changed to "${labels[status] || status}".`}</p>
<p style="background:#f8fafc;padding:10px 14px;border-radius:10px;font-size:13px">
  <strong>Order ID:</strong> <span style="color:#06b6d4">#${orderId.slice(0, 8)}</span>
</p>
<p style="margin-top:20px;font-weight:600">The Shopora Team</p>`);
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) { console.log(`[Email] Would send welcome to ${email}`); return; }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject: `Welcome to Shopora, ${name}!`, html: welcomeEmail(name) });
    console.log(`[Email] Welcome sent to ${email}`);
  } catch (e) { console.error("[Email] Failed send welcome:", e); }
}

export async function sendOrderConfirmation(
  email: string, customerName: string, orderId: string,
  items: { name: string; quantity: number; price: number; image?: string; color?: string; size?: string }[],
  total: number
) {
  if (!resend) { console.log(`[Email] Would send order confirmation to ${email}`); return; }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject: `Order Confirmed! #${orderId.slice(0, 8)}`, html: orderConfirmationEmail(customerName, orderId, items, total) });
    console.log(`[Email] Order confirmation sent to ${email}`);
  } catch (e) { console.error("[Email] Failed send order confirmation:", e); }
}

export async function sendNewOrderNotification(ownerEmail: string, customerName: string, orderId: string, total: number, customerEmail: string, customerPhone: string) {
  if (!resend) { console.log(`[Email] Would send new order notification to ${ownerEmail}`); return; }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to: ownerEmail, subject: `New Order! #${orderId.slice(0, 8)}`, html: newOrderNotificationEmail(customerName, orderId, total, customerEmail, customerPhone) });
    console.log(`[Email] New order notification sent to ${ownerEmail}`);
  } catch (e) { console.error("[Email] Failed send new order notification:", e); }
}

export async function sendStatusUpdate(email: string, customerName: string, orderId: string, status: string) {
  if (!resend) { console.log(`[Email] Would send status update to ${email}`); return; }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject: `Order ${status}: #${orderId.slice(0, 8)}`, html: statusUpdateEmail(customerName, orderId, status) });
    console.log(`[Email] Status update sent to ${email}`);
  } catch (e) { console.error("[Email] Failed send status update:", e); }
}

// ─── OTP Verification ──────────────────────────────────────────────

function otpEmail(name: string, otp: string) {
  return wrapTemplate("Verify Your Email 🔐",
    `<h2>Hi ${name},</h2>
<p>Your verification code is:</p>
<div style="background:#f8fafc;border-radius:16px;padding:24px;text-align:center;margin:24px 0;border:2px dashed #e2e8f0">
  <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#06b6d4;font-family:monospace">${otp}</span>
</div>
<p>Enter this code to verify your email address. It expires in <strong>10 minutes</strong>.</p>
<p style="color:#94a3b8;font-size:13px">If you didn't request this, please ignore this email.</p>
<p style="margin-top:24px;font-weight:600">The Shopora Team</p>`);
}

export async function sendVerificationOtp(email: string, name: string, otp: string) {
  if (!resend) { console.log(`[Email] Would send OTP to ${email}`); return; }
  const { data, error } = await resend.emails.send({ from: FROM_EMAIL, to: email, subject: `Your verification code: ${otp}`, html: otpEmail(name, otp) });
  if (error) {
    console.error("[Email] Resend error:", error);
    throw new Error(error.message);
  }
  console.log(`[Email] OTP sent to ${email}`);
}

// ─── Password Reset ──────────────────────────────────────────────────

function passwordResetEmail(name: string, link: string) {
  return wrapTemplate("Reset Your Password 🔑",
    `<h2>Hi ${name},</h2>
<p>We received a request to reset your password. Click the button below to set a new one.</p>
<a href="${link}" class="btn">Reset Password</a>
<p style="margin-top:16px;color:#94a3b8;font-size:13px">This link expires in <strong>1 hour</strong>. If you didn't request this, please ignore this email.</p>
<p style="margin-top:24px;font-weight:600">The Shopora Team</p>`);
}

export async function sendPasswordReset(email: string, name: string, token: string) {
  if (!resend) { console.log(`[Email] Would send password reset to ${email}`); return; }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shopora.store";
  const link = `${baseUrl}/auth/reset-password?token=${token}`;
  const { data, error } = await resend.emails.send({ from: FROM_EMAIL, to: email, subject: "Reset your password", html: passwordResetEmail(name, link) });
  if (error) {
    console.error("[Email] Resend error:", error);
    throw new Error(error.message);
  }
  console.log(`[Email] Password reset sent to ${email}`);
}
