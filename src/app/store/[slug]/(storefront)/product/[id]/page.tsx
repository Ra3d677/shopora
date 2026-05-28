import { getStoreBySlug } from "@/lib/data";
import ProductDetailClient from "./ProductDetailClient";
import OneMProductDetail from "./OneMProductDetail";
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

  if (store.template === '1m' || store.template === '2m') {
    const font = store.template === '2m' ? 'Lato' : 'Poppins';
    const maxW = store.template === '2m' ? '1200px' : '1170px';
    return (
      <div className={`min-h-screen py-8 font-['${font}',sans-serif]`} style={{ backgroundColor: "#ffffff", color: "#333333" }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: maxW }}>
          <OneMProductDetail product={product} store={store} />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="store-container min-h-screen py-12 transition-all duration-700"
      data-page="product"
      style={{ background: 'var(--color-bg-product)', color: 'var(--color-text-product)' }}
    >
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description || "",
            "image": product.images?.[0] || "",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": product.discount_price || product.price,
              "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailClient product={product} store={store} />
      </div>
    </div>
  );
}
