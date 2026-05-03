import { getStoreSettingsBySlug, getStoreTemplate } from "@/lib/data";
import SettingsManager from "./SettingsManager";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentSettings = await getStoreSettingsBySlug(slug);
  const activeTemplate = await getStoreTemplate(slug);
  
  return <SettingsManager initialSettings={JSON.parse(JSON.stringify(currentSettings))} activeTemplate={activeTemplate} slug={slug} />;
}
