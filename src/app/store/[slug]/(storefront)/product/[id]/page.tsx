import { getStoreBySlug } from "@/lib/data";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string, id: string } }) {
  const { slug, id } = await params;
  
  const store = await getStoreBySlug(slug);
  if (!store) {
    notFound();
  }
  
  const product = store.products.find(p => p.id === id);
  
  if (!product) {
    notFound();
  }

  return (
    <div 
      className="min-h-screen py-12 transition-colors duration-500"
      data-page="product"
      style={{ background: 'var(--color-bg-product)', color: 'var(--color-text-product)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailClient product={product} store={store} />
      </div>
    </div>
  );
}
