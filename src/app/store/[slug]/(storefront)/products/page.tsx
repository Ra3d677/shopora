import Link from "next/link";
import Image from "next/image";
import { getStoreBySlug } from "@/lib/data";
import SortDropdown from "./SortDropdown";
import SmartImage from "@/components/ui/SmartImage";
import { notFound } from "next/navigation";
import { getPremiumBackgroundStyle, getThemeByPath } from "@/lib/utils";

import StorefrontFilterSidebar from "@/components/ui/premium/StorefrontFilterSidebar";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string },
  searchParams: Promise<{ category?: string, sort?: string, min?: string, max?: string, colors?: string }> 
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

  // Calculate available colors and max price for the sidebar based on category-filtered products
  const availableColorsMap = new Map<string, string>();
  let maxPossiblePrice = 0;

  displayedProducts.forEach(p => {
    const price = p.discount_price || p.price;
    if (price > maxPossiblePrice) maxPossiblePrice = price;
    
    p.colors?.forEach((c: any) => {
      if (c.name && c.value) availableColorsMap.set(c.name, c.value);
    });
  });

  const availableColors = Array.from(availableColorsMap.entries()).map(([name, value]) => ({ name, value }));
  maxPossiblePrice = Math.ceil(maxPossiblePrice / 100) * 100;
  if (maxPossiblePrice === 0) maxPossiblePrice = 1000;

  // Apply Price & Color Filters
  const { min, max, colors } = await searchParams;
  
  if (min) displayedProducts = displayedProducts.filter(p => (p.discount_price || p.price) >= Number(min));
  if (max) displayedProducts = displayedProducts.filter(p => (p.discount_price || p.price) <= Number(max));
  if (colors) {
    const selectedColors = colors.split(',');
    displayedProducts = displayedProducts.filter(p => {
       const pColors = p.colors?.map((c: any) => c.name) || [];
       return pColors.some((c: string) => selectedColors.includes(c));
    });
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
        availableColors={availableColors}
        maxPossiblePrice={maxPossiblePrice}
      />
    );
  }

  const currentThemeId = getThemeByPath(storeSettings.pageThemes || [], `/store/${slug}/products`);
  const premiumStyle = getPremiumBackgroundStyle(currentThemeId);
  const isPremiumBg = currentThemeId !== 'default';

  return (
    <div 
      className={`store-container min-h-screen pb-16 transition-all duration-700`} 
      data-page={category ? "categories" : "shop"}
      style={isPremiumBg ? premiumStyle : { 
        background: category ? 'var(--color-bg-categories)' : 'var(--color-bg-shop)', 
        color: category ? 'var(--color-text-categories)' : 'var(--color-text-shop)' 
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 capitalize">
           <span className="gradient-text-support">{pageTitle}</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">{pageDescription}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start relative w-full">
        {/* World-Class Filter Sidebar */}
        <StorefrontFilterSidebar 
          categories={store.categories}
          availableColors={availableColors}
          maxPossiblePrice={maxPossiblePrice}
        />

        {/* Main Product Area */}
        <div className="flex-1 w-full">
           <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-6 hidden lg:flex">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{displayedProducts.length} Items</span>
              <div className="flex items-center gap-4">
                 <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sort by</span>
                 <SortDropdown />
              </div>
           </div>

           {/* Mobile Sort (Visible only on small screens when Sidebar is a drawer) */}
           <div className="flex lg:hidden justify-between items-center mb-8 border-b border-border/50 pb-6 w-full">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{displayedProducts.length} Items</span>
              <SortDropdown />
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
    </div>
  );
}

function SennoProducts({ slug, store, products, category, pageTitle, pageDescription, availableColors, maxPossiblePrice }: any) {
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

       <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-start w-full">
            {/* World-Class Filter Sidebar */}
            <StorefrontFilterSidebar 
              categories={store.categories}
              availableColors={availableColors}
              maxPossiblePrice={maxPossiblePrice}
            />

            {/* Main Product Area */}
            <div className="flex-1 w-full">
               <div className="flex justify-between items-center mb-10 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 hidden lg:flex">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{products.length} Items</span>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort by</span>
                     <SortDropdown />
                  </div>
               </div>

               {/* Mobile Sort */}
               <div className="flex lg:hidden justify-between items-center mb-10 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 w-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{products.length} Items</span>
                  <SortDropdown />
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
