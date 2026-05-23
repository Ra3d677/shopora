import { NextRequest, NextResponse } from "next/server";
import * as fitness from "@/lib/fitness-data";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const data = await fitness.getAllData(slug);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json();
  const { resource, action, data, id } = body;

  try {
    let result;
    switch (resource) {
      case "hero":
        result = await fitness.upsertHero(slug, data);
        break;
      case "services":
        if (action === "create") result = await fitness.createService(slug, data);
        else if (action === "update") result = await fitness.updateService(id, data);
        else if (action === "delete") result = await fitness.deleteService(id);
        else if (action === "reorder") result = await fitness.reorderServices(slug, data.ids);
        else return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        break;
      case "plans":
        if (action === "create") result = await fitness.createPlan(slug, data);
        else if (action === "update") result = await fitness.updatePlan(id, data);
        else if (action === "delete") result = await fitness.deletePlan(id);
        else if (action === "reorder") result = await fitness.reorderPlans(slug, data.ids);
        else return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        break;
      case "transformations":
        if (action === "create") result = await fitness.createTransformation(slug, data);
        else if (action === "update") result = await fitness.updateTransformation(id, data);
        else if (action === "delete") result = await fitness.deleteTransformation(id);
        else if (action === "reorder") result = await fitness.reorderTransformations(slug, data.ids);
        else return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        break;
      case "testimonials":
        if (action === "create") result = await fitness.createTestimonial(slug, data);
        else if (action === "update") result = await fitness.updateTestimonial(id, data);
        else if (action === "delete") result = await fitness.deleteTestimonial(id);
        else if (action === "reorder") result = await fitness.reorderTestimonials(slug, data.ids);
        else return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        break;
      case "footer":
        result = await fitness.upsertFooter(slug, data);
        break;
      case "sync":
        result = await fitness.syncFromSettings(slug);
        break;
      default:
        return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
