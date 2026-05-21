"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendVerificationOtp, sendPasswordReset } from "@/lib/email";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return { error: "Invalid email or password." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid email or password." };
    }

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, { 
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return { error: "Database connection error. Please check your Supabase settings." };
  }

  redirect("/dashboard");
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Please fill in all fields." };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, { 
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30
    });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationOtp: otp, verificationOtpExpiry: expiry }
    });

    try { await sendVerificationOtp(user.email, user.name || "User", otp); } catch (e) { console.error("[Email] Failed send OTP:", e); }
    try { await sendWelcomeEmail(user.email, user.name || "User"); } catch (e) { console.error("[Email] Failed send welcome:", e); }
  } catch (error: any) {
    console.error("Registration Error:", error);
    return { error: "Database connection error. Please check your Vercel Environment Variables for DATABASE_URL." };
  }

  redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/auth/login");
}

// ─── Helpers ─────────────────────────────────────────────────────────

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── OTP Verification ────────────────────────────────────────────────

export async function verifyOtp(email: string, otp: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "User not found." };
    if (user.emailVerified) return { success: true, message: "Email already verified." };
    if (!user.verificationOtp || !user.verificationOtpExpiry) return { error: "No verification code sent. Please register again." };
    if (user.verificationOtp !== otp) return { error: "Invalid verification code." };
    if (new Date() > user.verificationOtpExpiry) return { error: "Verification code expired. Request a new one." };

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationOtp: null, verificationOtpExpiry: null }
    });

    return { success: true, message: "Email verified successfully!" };
  } catch (e: any) {
    console.error("Verify OTP Error:", e);
    return { error: "Something went wrong." };
  }
}

export async function resendOtp(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "User not found." };
    if (user.emailVerified) return { success: true, message: "Email already verified." };

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationOtp: otp, verificationOtpExpiry: expiry }
    });

    try { 
      await sendVerificationOtp(user.email, user.name || "User", otp); 
    } catch (e: any) { 
      console.error("[Email] Failed send OTP:", e); 
      return { error: `Email Error: ${e.message}` };
    }
    return { success: true, message: "New code sent!" };
  } catch (e: any) {
    console.error("Resend OTP Error:", e);
    return { error: "Something went wrong." };
  }
}

// ─── Password Reset ──────────────────────────────────────────────────

export async function forgotPassword(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: true, message: "If that email exists, a reset link has been sent." };

    const token = crypto.randomUUID();
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry }
    });

    try { 
      await sendPasswordReset(user.email, user.name || "User", token); 
    } catch (e: any) { 
      console.error("[Email] Failed send password reset:", e); 
      return { error: `Email Error: ${e.message}` };
    }
    return { success: true, message: "If that email exists, a reset link has been sent." };
  } catch (e: any) {
    console.error("Forgot Password Error:", e);
    return { error: "Something went wrong." };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  if (!newPassword || newPassword.length < 6) return { error: "Password must be at least 6 characters." };

  try {
    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gte: new Date() } }
    });
    if (!user) return { error: "Invalid or expired reset link." };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
    });

    return { success: true, message: "Password reset successfully! You can now login." };
  } catch (e: any) {
    console.error("Reset Password Error:", e);
    return { error: "Something went wrong." };
  }
}
