import Link from "next/link";
import Image from "next/image";
import { getStoreBySlug } from "@/lib/data";
import SortDropdown from "./SortDropdown";
import SmartImage from "@/components/ui/SmartImage";
import { notFound } from "next/navigation";
import { getPremiumBackgroundStyle, getThemeByPath } from "@/lib/utils";

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
      // Recursive function to get all subcategory IDs
      const getAllSubCategoryIds = (cats: any[], pId: string): string[] => {
        const children = cats.filter(c => c.parentId === pId);
        let ids = children.map(c => c.id);
        for (const child of children) {
          ids = [...ids, ...getAllSubCategoryIds(cats, child.id)];
        }
        return ids;
      };

      const allCategoryIds = [category, ...getAllSubCategoryIds(store.categories, category)];
      displayedProducts = displayedProducts.filter(p => allCategoryIds.includes(p.category_id));
      
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


  if (store.template === 'senno') {
    return (
      <SennoProducts 
        slug={slug} 
        store={store} 
        products={displayedProducts} 
        category={category} 
        pageTitle={pageTitle} 
        pageDescription={pageDescription} 
      />
    );
  }

  const currentThemeId = getThemeByPath(storeSettings.pageThemes || [], `/store/${slug}/products`);
  const premiumStyle = getPremiumBackgroundStyle(currentThemeId);
  const isPremiumBg = currentThemeId !== 'default';

  return (
    <div 
      className={`min-h-screen pb-16 transition-colors duration-500`} 
      style={isPremiumBg ? premiumStyle : { 
        background: category ? 'var(--color-bg-categories)' : 'var(--color-bg-shop)', 
        color: category ? 'var(--color-text-categories)' : 'var(--color-text-shop)' 
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4 capitalize">{pageTitle}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">{pageDescription}</p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-border gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full hide-scrollbar">
            <Link href={`/store/${slug}/products`} className={`px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${!category ? 'bg-slate-950 text-white shadow-md' : 'border border-border text-foreground hover:border-slate-400'}`}>All</Link>
            {store.categories.filter(c => !c.parentId).map((cat: any) => (
              <Link 
                key={cat.id}
                href={`/store/${slug}/products?category=${cat.id}`} 
                className={`px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${category === cat.id || store.categories.find(c => c.id === category)?.parentId === cat.id ? 'bg-slate-950 text-white shadow-md' : 'border border-border text-foreground hover:border-slate-400'}`}
              >
                {cat.name}
              </Link>
            ))}
            <Link href={`/store/${slug}/products?category=sale`} className={`px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${category === 'sale' ? 'bg-red-500 text-white shadow-md' : 'border border-border text-red-500 hover:border-red-500'}`}>Sale</Link>
          </div>

          {category && store.categories.some(c => c.parentId === category || (store.categories.find(curr => curr.id === category)?.parentId === c.parentId && c.parentId)) && (
            <div className="flex gap-2 overflow-x-auto pb-2 w-full hide-scrollbar border-t border-slate-100 pt-4">
              {(store.categories.find(c => c.id === category)?.parentId 
                ? store.categories.filter(c => c.parentId === store.categories.find(curr => curr.id === category)?.parentId)
                : store.categories.filter(c => c.parentId === category)
              ).map((sub: any) => (
                <Link 
                  key={sub.id}
                  href={`/store/${slug}/products?category=${sub.id}`} 
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full whitespace-nowrap transition-all ${category === sub.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
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

function SennoProducts({ slug, store, products, category, pageTitle, pageDescription }: any) {
  const pink = "#f06292";

  return (
    <div className="min-h-screen bg-white pb-32">
       {/* Header */}
       <div className="bg-[#fcf2f4] py-24 px-6">
          <div className="container mx-auto">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                <Link href={`/store/${slug}`} className="hover:text-[#f06292]">Home</Link>
                <span>/</span>
                <span className="text-slate-900">{pageTitle}</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter uppercase">{pageTitle}</h1>
             <p className="text-slate-500 max-w-xl text-lg font-medium italic leading-relaxed">{pageDescription}</p>
          </div>
       </div>

       <div className="container mx-auto px-6 md:px-12 -mt-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 mb-20 flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-100">
             <div className="flex gap-4 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
                <Link 
                  href={`/store/${slug}/products`} 
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!category ? 'bg-[#f06292] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  All Items
                </Link>
                {store.categories.map((cat: any) => (
                  <Link 
                    key={cat.id}
                    href={`/store/${slug}/products?category=${cat.id}`} 
                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat.id ? 'bg-[#f06292] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
             </div>
             <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort by</span>
                <SortDropdown />
             </div>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
             <div className="text-center py-32">
                <h3 className="text-3xl font-black text-slate-900 mb-4">Empty Collection</h3>
                <p className="text-slate-400 mb-8 italic">We couldn't find any products in this selection.</p>
                <Link href={`/store/${slug}/products`} className="inline-block px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-full">Explore All</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product: any) => (
                <div key={product.id} className="group flex flex-col">
                   <Link href={`/store/${slug}/product/${product.id}`} className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#f5f5f5] mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                      <SmartImage src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
                      {product.discount_price && (
                        <div className="absolute top-4 left-4 bg-[#f06292] text-white text-[9px] font-black px-3 py-1 rounded shadow-md">SALE</div>
                      )}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-6 group-hover:translate-y-0 duration-500">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#f06292] hover:text-white transition-all"><Search size={18} /></div>
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#f06292] hover:text-white transition-all"><ShoppingBag size={18} /></div>
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#f06292] hover:text-white transition-all"><Heart size={18} /></div>
                      </div>
                   </Link>

                   <div className="text-center">
                      <Link href={`/store/${slug}/product/${product.id}`}>
                        <h3 className="text-sm font-black uppercase tracking-tight mb-2 hover:text-[#f06292] transition-colors">{product.name}</h3>
                      </Link>
                      <div className="flex items-center justify-center gap-1 mb-2">
                         {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-[#f06292] text-[#f06292]" />)}
                      </div>
                      <div className="flex items-center justify-center gap-3">
                         {product.discount_price ? (
                           <>
                             <span className="text-[#f06292] font-black text-lg">${product.discount_price}</span>
                             <span className="text-slate-300 line-through text-sm font-medium">${product.price}</span>
                           </>
                         ) : (
                           <span className="text-slate-900 font-black text-lg">${product.price}</span>
                         )}
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
       </div>
    </div>
  );
}

function Star({ className }: any) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

import { ShoppingBag, Search, Heart } from "lucide-react";
