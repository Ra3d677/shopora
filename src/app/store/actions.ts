"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { sendWelcomeEmail, sendVerificationOtp } from "@/lib/email";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function loginCustomer(slug: string, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

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
    maxAge: 60 * 60 * 24 * 30 
  });

  redirect(`/store/${slug}`);
}

export async function registerCustomer(slug: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Please fill in all fields." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: "User with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "user"
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

  try { await sendVerificationOtp(user.email, user.name || "Customer", otp); } catch (e) { console.error("[Email] Failed send OTP:", e); }
  try { await sendWelcomeEmail(user.email, user.name || "Customer"); } catch (e) { console.error("[Email] Failed send welcome:", e); }

  redirect(`/store/${slug}/verify?email=${encodeURIComponent(email)}`);
}

export async function verifyCustomerOtp(slug: string, email: string, otp: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "User not found." };
    if (user.emailVerified) return { success: true, message: "Email already verified." };
    if (!user.verificationOtp || !user.verificationOtpExpiry) return { error: "No verification code sent." };
    if (user.verificationOtp !== otp) return { error: "Invalid verification code." };
    if (new Date() > user.verificationOtpExpiry) return { error: "Code expired. Request a new one." };

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationOtp: null, verificationOtpExpiry: null }
    });

    return { success: true };
  } catch (e: any) {
    console.error("Verify Customer OTP Error:", e);
    return { error: "Something went wrong." };
  }
}

export async function logoutCustomer(slug: string) {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect(`/store/${slug}`);
}

export async function submitClientReview(slug: string, name: string, role: string, content: string, rating: number = 5, imageUrl?: string) {
  if (!name || !content) {
    return { error: "Please enter your name and review message." };
  }

  try {
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) {
      return { error: "Store not found." };
    }

    // Upload image if provided
    let avatarUrl = '';
    if (imageUrl) {
      try {
        const media = await prisma.media.create({
          data: {
            url: imageUrl,
            name: `review-${Date.now()}`,
            type: "image",
            storeId: store.id,
          },
        });
        avatarUrl = media.url;
      } catch {
        // Silently fail image upload
      }
    }

    const settings = store.settings ? JSON.parse(store.settings) : {};
    if (!settings.signatureSettings) {
      settings.signatureSettings = {};
    }
    if (!settings.signatureSettings.testimonials) {
      settings.signatureSettings.testimonials = [];
    }

    settings.signatureSettings.testimonials.push({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      role: role || "",
      content,
      rating,
      avatar: avatarUrl || undefined
    });

    await prisma.store.update({
      where: { slug },
      data: {
        settings: JSON.stringify(settings)
      }
    });

    revalidatePath(`/store/${slug}`);
    revalidatePath(`/store/${slug}`, 'layout');
    revalidatePath(`/`, 'layout');

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return { error: "Failed to submit review. Please try again." };
  }
}
