import { NextResponse } from "next/server";
import * as fitness from "@/lib/fitness-data";

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const result = await fitness.syncFromSettings(slug);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
