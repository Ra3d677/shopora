import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import FitnessDashboard from "./FitnessDashboard";

export const dynamic = 'force-dynamic';

export default async function FitnessAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) notFound();
  if (store.template !== 'fitness') notFound();

  return (
    <FitnessDashboard
      slug={slug}
      initialSettings={JSON.parse(JSON.stringify(store.settings || {}))}
      storeName={store.name}
    />
  );
}
