import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import DDDYOUDashboard from "./DDDYOUDashboard";

export const dynamic = 'force-dynamic';

export default async function DDDYOUAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) notFound();
  if (store.template !== 'dddyou') notFound();

  return (
    <DDDYOUDashboard
      slug={slug}
      initialSettings={JSON.parse(JSON.stringify(store.settings || {}))}
      storeName={store.name}
    />
  );
}