import { getStoreBySlug, getStoreTemplate } from "@/lib/data";
import SettingsManager from "./SettingsManager";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  const activeTemplate = await getStoreTemplate(slug);
  
  return (
    <SettingsManager 
      initialSettings={JSON.parse(JSON.stringify(store?.settings || {}))} 
      activeTemplate={activeTemplate} 
      slug={slug} 
      storeType={store?.type || 'ECOMMERCE'} 
    />
  );
}
