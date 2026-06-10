import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import IronPeakDashboard from "./IronPeakDashboard";

export const dynamic = 'force-dynamic';

export default async function IronPeakAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) notFound();
  if (store.template !== 'ironpeak') notFound();

  return (
    <IronPeakDashboard
      slug={slug}
      initialSettings={JSON.parse(JSON.stringify(store.settings || {}))}
      storeName={store.name}
    />
  );
}
