import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { userId, firstName, lastName, email, currentPassword, newPassword, gender, birthday } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (currentPassword) {
      const valid = user.password ? await bcrypt.compare(currentPassword, user.password) : false;
      if (!valid) {
        return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 });
      }
    }

    const data: any = {};

    if (firstName !== undefined || lastName !== undefined) {
      const newFirst = firstName !== undefined ? firstName : user.name?.split(" ")[0] || "";
      const newLast = lastName !== undefined ? lastName : user.name?.split(" ").slice(1).join(" ") || "";
      data.name = `${newFirst} ${newLast}`.trim();
    }

    if (email !== undefined && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== userId) {
        return NextResponse.json({ success: false, error: "Email already in use" }, { status: 400 });
      }
      data.email = email;
    }

    if (newPassword) {
      data.password = await bcrypt.hash(newPassword, 10);
    }

    if (gender !== undefined) data.gender = gender || null;
    if (birthday !== undefined) data.birthday = birthday || null;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({
      success: true,
      user: { id: updated.id, name: updated.name, email: updated.email, gender: updated.gender, birthday: updated.birthday },
    });
  } catch (error: any) {
    console.error("Account update API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
