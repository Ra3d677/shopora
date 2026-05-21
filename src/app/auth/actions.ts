"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

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

    sendWelcomeEmail(user.email, user.name || "User");
  } catch (error: any) {
    console.error("Registration Error:", error);
    return { error: "Database connection error. Please check your Vercel Environment Variables for DATABASE_URL." };
  }

  redirect("/dashboard");
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/auth/login");
}
