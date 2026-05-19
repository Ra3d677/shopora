import { getStoreBySlug } from "@/lib/data";
import BuilderManager from "./BuilderManager";

export const dynamic = 'force-dynamic';

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  
  return <BuilderManager initialSettings={JSON.parse(JSON.stringify(store?.settings || {}))} slug={slug} storeType={store?.type || 'ECOMMERCE'} />;
}
