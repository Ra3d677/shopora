import { getStoreBySlug } from "@/lib/data";
import BuilderManager from "./BuilderManager";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (store?.template === '1m' || store?.template === '2m') {
    redirect(`/store/${slug}/admin/dashboard`);
  }
  
  return <BuilderManager initialSettings={JSON.parse(JSON.stringify(store?.settings || {}))} slug={slug} storeType={store?.type || 'ECOMMERCE'} />;
}
