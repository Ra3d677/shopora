import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function SearchPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string },
  searchParams: Promise<{ q?: string }> 
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const query = q?.toLowerCase() || "";

  const store = await getStoreBySlug(slug);
  if (!store) {
    notFound();
  }

  const displayedProducts = store.products.filter((product) =>
    product.name.toLowerCase().includes(query) ||
    (product.description && product.description.toLowerCase().includes(query)) ||
    product.category_id.toLowerCase().includes(query)
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh]">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4">Search Results</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {query ? `Showing results for "${query}"` : "Please enter a search term"}
        </p>
      </div>

      {!query ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Search our store</h2>
          <p className="text-muted-foreground mb-6">Enter a keyword to find products.</p>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find any products matching "{query}".</p>
          <Link href={`/store/${slug}/products`} className="bg-slate-950 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16">
          {displayedProducts.map((product) => (
            <Link href={`/store/${slug}/products/${product.id}`} key={product.id} className="group flex flex-col cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100 mb-5 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                {product.discount_price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    SALE
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-center py-3 rounded-xl font-medium w-full">
                    View Details
                  </div>
                </div>
              </div>
              <div className="flex flex-col px-1">
                <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{product.description}</p>
                <div className="flex items-center gap-3 mt-auto">
                  {product.discount_price ? (
                    <>
                      <span className="text-red-500 font-extrabold text-lg">${product.discount_price}</span>
                      <span className="text-muted-foreground line-through text-sm font-medium">${product.price}</span>
                    </>
                  ) : (
                    <span className="text-primary font-extrabold text-lg">${product.price}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
