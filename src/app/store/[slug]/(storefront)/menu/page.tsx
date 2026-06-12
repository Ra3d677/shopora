import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import KitchenTemplate from "@/components/templates/KitchenTemplate";

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store || store.template !== 'kitchen') {
    notFound();
  }

  const props = { store, slug, categories: store.categories };

  return <KitchenTemplate {...props} />;
}
