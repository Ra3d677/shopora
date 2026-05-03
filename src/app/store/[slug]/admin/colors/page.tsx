import { getStoreBySlug } from "@/lib/data";
import ColorsManager from "./ColorsManager";

export const dynamic = 'force-dynamic';

export default async function AdminColorsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  
  if (!store) return null;

  const storeSettings = (store.settings as any) || {};

  return <ColorsManager slug={slug} initialSettings={storeSettings} />;
}
