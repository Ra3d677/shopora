import { getStoreCategories, getStoreBySlug } from "@/lib/data";
import CategoriesManager from "./CategoriesManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  const categories = await getStoreCategories(slug);
  
  if (!store) notFound();
  
  return (
    <CategoriesManager 
      slug={slug} 
      initialCategories={JSON.parse(JSON.stringify(categories))} 
      settings={store.settings || {}}
    />
  );
}
