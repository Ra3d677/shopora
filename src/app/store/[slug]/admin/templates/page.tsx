import { getStoreTemplate } from "@/lib/data";
import TemplatesManager from "./TemplatesManager";

export const dynamic = 'force-dynamic';

export default async function AdminTemplatesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activeTemplate = await getStoreTemplate(slug);
  
  return <TemplatesManager slug={slug} initialTemplate={activeTemplate} />;
}
