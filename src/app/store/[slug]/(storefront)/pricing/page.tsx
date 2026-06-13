import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import IronPeakTemplate from "@/components/templates/IronPeakTemplate";

export const dynamic = 'force-dynamic';

export default async function PricingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store || store.template !== 'ironpeak') notFound();

  const settings = { ...store.settings, storeName: store.name };
  const banners = (store.banners || []).filter((b: any) => b && b.isActive).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  const props = { store, slug, banners, settings, products: store.products || [], categories: store.categories };
  return <IronPeakTemplate {...props} />;
}
