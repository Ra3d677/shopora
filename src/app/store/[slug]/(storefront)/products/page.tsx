import Link from "next/link";
import Image from "next/image";
import { getStoreBySlug } from "@/lib/data";
import SortDropdown from "./SortDropdown";
import SmartImage from "@/components/ui/SmartImage";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string },
  searchParams: Promise<{ category?: string, sort?: string }> 
}) {
  const { slug } = await params;
  const { category, sort } = await searchParams;
  
  const store = await getStoreBySlug(slug);
  if (!store) {
    notFound();
  }
  
  const storeSettings = store.settings;

  // Filter products based on URL parameter
  let displayedProducts = [...store.products];
  let pageTitle = "All Collections";
  let pageDescription = "Explore our full range of premium essentials.";

  if (category) {
    if (category === 'sale') {
      displayedProducts = displayedProducts.filter(p => p.discount_price !== null);
      pageTitle = "Sale";
      pageDescription = "Premium items at exceptional value.";
    } else {
      displayedProducts = displayedProducts.filter(p => p.category_id === category);
      const foundCategory = store.categories.find(c => c.id === category);
      pageTitle = foundCategory?.name || "Collection";
      pageDescription = foundCategory?.description || `Discover the latest in our ${pageTitle.toLowerCase()}.`;
    }
  }

  // Apply Sorting
  if (sort) {
    if (sort === 'price_asc') {
      displayedProducts.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (sort === 'price_desc') {
      displayedProducts.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (sort === 'newest') {
      displayedProducts.reverse();
    }
  }


  return (
    <div className="min-h-screen pb-16 transition-colors duration-500" style={{ backgroundColor: 'var(--color-bg-shop)', color: 'var(--color-text-primary)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4 capitalize">{pageTitle}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">{pageDescription}</p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-border gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto sm:pb-0 hide-scrollbar">
          <Link href={`/store/${slug}/products`} className={`px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${!category ? 'bg-slate-950 text-white shadow-md' : 'border border-border text-foreground hover:border-slate-400'}`}>All</Link>
          {store.categories.map((cat: any) => (
            <Link 
              key={cat.id}
              href={`/store/${slug}/products?category=${cat.id}`} 
              className={`px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${category === cat.id ? 'bg-slate-950 text-white shadow-md' : 'border border-border text-foreground hover:border-slate-400'}`}
            >
              {cat.name}
            </Link>
          ))}
          <Link href={`/store/${slug}/products?category=sale`} className={`px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${category === 'sale' ? 'bg-red-500 text-white shadow-md' : 'border border-border text-red-500 hover:border-red-500'}`}>Sale</Link>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
          <SortDropdown />
        </div>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find any products in this collection.</p>
          <Link href={`/store/${slug}/products`} className="bg-slate-950 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors">
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className={storeSettings.categoriesLayout === 'list' ? 'flex flex-col gap-8' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16'}>
          {displayedProducts.map((product) => (
            <Link 
              href={`/store/${slug}/product/${product.id}`} 
              key={product.id} 
              className={`group flex cursor-pointer ${storeSettings.categoriesLayout === 'list' ? 'flex-row items-center gap-8 bg-card rounded-2xl border border-border/50 p-4 hover:shadow-lg transition-all' : 'flex-col'}`}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500 ${storeSettings.categoriesLayout === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-[3/4] w-full mb-5'}`}>
                <SmartImage
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                {product.discount_price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    SALE
                  </div>
                )}
                {storeSettings.categoriesLayout !== 'list' && (
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-center py-3 rounded-xl font-medium w-full">
                      View Details
                    </div>
                  </div>
                )}
              </div>
              <div className={`flex flex-col px-1 ${storeSettings.categoriesLayout === 'list' ? 'flex-1' : ''}`}>
                <h3 className={`font-bold text-primary mb-1 group-hover:text-accent transition-colors ${storeSettings.categoriesLayout === 'list' ? 'text-2xl' : 'text-lg'}`}>{product.name}</h3>
                <p className={`text-muted-foreground ${storeSettings.categoriesLayout === 'list' ? 'text-base mb-6' : 'text-sm line-clamp-1 mb-3'}`}>{product.description}</p>
                <div className={`flex items-center gap-3 ${storeSettings.categoriesLayout === 'list' ? '' : 'mt-auto'}`}>
                  {product.discount_price ? (
                    <>
                      <span className="font-extrabold text-lg" style={{ color: 'var(--color-sale-price)' }}>${product.discount_price}</span>
                      <span className="text-muted-foreground line-through text-sm font-medium">${product.price}</span>
                    </>
                  ) : (
                    <span className="font-extrabold text-lg" style={{ color: 'var(--color-price)' }}>${product.price}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
