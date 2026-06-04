import { getStoreBySlug } from "@/lib/data";
import FeaturesBarManager from "./FeaturesBarManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminFeaturesBarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  
  if (store.template !== '2m') {
    notFound();
  }

  const initialContent = store.settings?.twoMFeatures || null;
  return <FeaturesBarManager slug={slug} initialContent={initialContent} />;
}
