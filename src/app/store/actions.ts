"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

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

  redirect(`/store/${slug}`);
}

export async function logoutCustomer(slug: string) {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect(`/store/${slug}`);
}

export async function submitClientReview(slug: string, name: string, role: string, content: string) {
  if (!name || !content) {
    return { error: "Please enter your name and review message." };
  }

  try {
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) {
      return { error: "Store not found." };
    }

    const settings = store.settings ? JSON.parse(store.settings) : {};
    if (!settings.signatureSettings) {
      settings.signatureSettings = {};
    }
    if (!settings.signatureSettings.testimonials) {
      settings.signatureSettings.testimonials = [];
    }

    settings.signatureSettings.testimonials.push({
      name,
      role: role || "",
      content
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
