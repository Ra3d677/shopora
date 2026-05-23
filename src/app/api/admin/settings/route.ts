import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    let setting = await prisma.appSetting.findUnique({ where: { key: "usd_rate" } });
    if (!setting) {
      setting = await prisma.appSetting.create({ data: { key: "usd_rate", value: "48" } });
    }
    return NextResponse.json({ rate: parseFloat(setting.value) || 48 });
  } catch {
    return NextResponse.json({ rate: 48 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const isSuperAdmin = session?.role === "superadmin" || session?.email === "ksh128395@gmail.com";
    if (!isSuperAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rate } = await req.json();
    const num = parseFloat(rate);
    if (isNaN(num) || num <= 0) return NextResponse.json({ error: "Invalid rate" }, { status: 400 });

    await prisma.appSetting.upsert({
      where: { key: "usd_rate" },
      update: { value: num.toString() },
      create: { key: "usd_rate", value: num.toString() },
    });

    return NextResponse.json({ success: true, rate: num });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
