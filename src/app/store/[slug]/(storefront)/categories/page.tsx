import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SmartImage from "@/components/ui/SmartImage";
import { ArrowRight } from "lucide-react";
import HeroSlider from "@/components/ui/HeroSlider";
import { getPremiumBackgroundClass, getThemeByPath } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function CollectionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  
  if (!store) {
    notFound();
  }

  const collectionsBanners = store.banners
    .filter(b => b.isActive && b.targetPage === 'collections')
    .sort((a, b) => a.order - b.order);

  const COLLECTIONS = store.categories
    .filter(cat => !cat.parentId)
    .map(cat => {
    // Count products for this category
    const count = cat.id === 'sale' 
      ? store.products.filter(p => p.discount_price !== null).length 
      : store.products.filter(p => p.category_id === cat.id).length;
      
    return {
      ...cat,
      itemCount: count
    };
  });

  if (store.template === 'senno') {
    return (
      <SennoCategories slug={slug} collections={COLLECTIONS} banners={collectionsBanners} settings={store.settings} />
    );
  }

  const currentThemeId = getThemeByPath(store.settings?.pageThemes || [], `/store/${slug}/categories`);
  const bgClass = getPremiumBackgroundClass(currentThemeId);
  const isPremiumBg = currentThemeId !== 'default';

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-500 ${bgClass}`} style={!isPremiumBg ? { backgroundColor: 'var(--color-bg-categories)', color: 'var(--color-text-primary)' } : {}}>
      {/* Header / Banner */}
      {collectionsBanners.length > 0 ? (
        <HeroSlider 
          banners={collectionsBanners} 
          slug={slug} 
          settings={store.settings?.bannerSettings || { autoPlay: true, interval: 5000, transition: 'fade' }} 
        />
      ) : (
        <div className="bg-slate-950 py-24 text-center">
          <h1 className="text-5xl font-extrabold tracking-widest text-white uppercase">Collections</h1>
        </div>
      )}

      {/* Dynamic Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-24">
        {(!store.settings?.categoryLayout?.collections || store.settings.categoryLayout.collections === 'grid') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COLLECTIONS.map((collection, index) => (
              <Link 
                href={`/store/${slug}/products?category=${collection.id}`} 
                key={collection.id}
                className={`group relative overflow-hidden rounded-2xl shadow-xl bg-slate-900 ${index === 0 || index === 3 ? 'md:col-span-2 lg:col-span-2 aspect-[21/9]' : 'aspect-square md:aspect-[4/3] lg:aspect-square'}`}
              >
                <Image 
                  src={collection.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"} 
                  alt={collection.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-end justify-between mb-2">
                    <h2 className="text-3xl font-bold text-white tracking-wide">{collection.name}</h2>
                    <span className="text-accent bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold border border-white/20">
                      {collection.itemCount} Items
                    </span>
                  </div>
                  <p className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {store.settings?.categoryLayout?.collections === 'bento' && (
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px]">
             {COLLECTIONS.slice(0, 4).map((cat, idx) => (
               <Link 
                 href={`/store/${slug}/products?category=${cat.id}`} 
                 key={cat.id}
                 className={`group relative overflow-hidden rounded-3xl ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''} ${idx === 1 ? 'md:col-span-2' : ''}`}
               >
                  <SmartImage src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={cat.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{cat.name}</h3>
                    <p className="text-white/60 text-[10px] tracking-widest uppercase mt-2">{cat.itemCount} Items</p>
                  </div>
               </Link>
             ))}
          </div>
        )}

        {store.settings?.categoryLayout?.collections === 'scroll' && (
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {COLLECTIONS.map((cat) => (
              <Link 
                href={`/store/${slug}/products?category=${cat.id}`} 
                key={cat.id}
                className="min-w-[450px] aspect-[16/10] rounded-3xl overflow-hidden relative group"
              >
                <SmartImage src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={cat.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{cat.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{cat.itemCount} Items</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {store.settings?.categoryLayout?.collections === 'list' && (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-xl space-y-4">
            {COLLECTIONS.map((cat) => (
              <Link 
                href={`/store/${slug}/products?category=${cat.id}`} 
                key={cat.id}
                className="flex items-center justify-between py-12 border-b border-slate-100 group hover:px-8 transition-all duration-500"
              >
                <div>
                  <h3 className="text-6xl font-black uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                  <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">{cat.itemCount} Items available</p>
                </div>
                <div className="w-32 h-32 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-0 group-hover:scale-100">
                  <SmartImage src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                </div>
                <ArrowRight size={48} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        )}

        {store.settings?.categoryLayout?.collections === 'circles' && (
          <div className="flex flex-wrap justify-center gap-16 py-20">
            {COLLECTIONS.map((cat) => (
              <Link 
                href={`/store/${slug}/products?category=${cat.id}`} 
                key={cat.id}
                className="flex flex-col items-center group"
              >
                <div className="w-56 h-56 rounded-full p-2 border-2 border-slate-200 group-hover:border-blue-600 transition-all duration-500 mb-8 bg-white shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <SmartImage src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                  </div>
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">{cat.name}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">{cat.itemCount} Items</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SennoCategories({ slug, collections, banners, settings }: any) {
  return (
    <div className="min-h-screen bg-white pb-32">
       {/* Header / Banner */}
       {banners && banners.length > 0 ? (
         <HeroSlider 
           banners={banners} 
           slug={slug} 
           settings={settings?.bannerSettings || { autoPlay: true, interval: 5000, transition: 'fade' }} 
         />
       ) : (
         <div className="bg-[#fcf2f4] py-32 px-6">
            <div className="container mx-auto text-center">
               <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                  <Link href={`/store/${slug}`} className="hover:text-[#f06292]">Home</Link>
                  <span>/</span>
                  <span className="text-slate-900">Collections</span>
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter uppercase">Our Collections</h1>
            </div>
         </div>
       )}

       <div className="container mx-auto px-6 md:px-12 -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
             {collections.map((cat: any) => (
               <Link 
                 href={`/store/${slug}/products?category=${cat.id}`} 
                 key={cat.id}
                 className="flex flex-col items-center group"
               >
                 <div className="relative w-full aspect-square rounded-full p-3 border border-slate-100 group-hover:border-[#f06292] transition-all duration-700 mb-10 bg-white shadow-2xl group-hover:shadow-[#f06292]/20">
                   <div className="w-full h-full rounded-full overflow-hidden relative">
                     <SmartImage src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={cat.name} />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 shadow-xl">
                           <ArrowRight className="text-[#f06292] w-6 h-6" />
                        </div>
                     </div>
                   </div>
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 group-hover:text-[#f06292] transition-colors">{cat.name}</h3>
                 <div className="flex items-center gap-2 mt-3">
                    <div className="w-8 h-[1px] bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.itemCount} Products</span>
                    <div className="w-8 h-[1px] bg-slate-200" />
                 </div>
               </Link>
             ))}
          </div>
       </div>
    </div>
  );
}
