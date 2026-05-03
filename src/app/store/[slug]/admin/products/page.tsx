import { getStoreProducts, getStoreCategories } from "@/lib/data";
import ProductsManager from "./ProductsManager";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getStoreProducts(slug);
  const categories = await getStoreCategories(slug);
  
  return <ProductsManager slug={slug} initialProducts={JSON.parse(JSON.stringify(products))} categories={JSON.parse(JSON.stringify(categories))} />;
}
