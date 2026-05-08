"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Plus } from "lucide-react";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import SaleSection from "@/components/ui/SaleSection";
import { motion, AnimatePresence } from "framer-motion";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function AmazonTemplate({ banners, settings, products, slug, categories = [] }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const featuredProducts = products.slice(0, 10);
  const amzSettings = settings.amazonSettings || {};
  
  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');
  
  const categories = products.reduce((acc: any[], p: any) => {
    if (!acc.find(c => c.id === p.category_id)) {
      acc.push({ id: p.category_id, name: p.category_id });
    }
    return acc;
  }, []).slice(0, 4);
  
  const homepageLayout = settings.homepageLayout || [
    { id: 'default-hero', type: 'hero' },
    { id: 'default-categories', type: 'categories' },
    { id: 'default-deals', type: 'featured_products', config: { title: "Today's Deals" } },
    { id: 'default-recommended', type: 'featured_products', config: { title: "Recommended for you" } }
  ];

  return (
    <div className="flex flex-col w-full font-sans antialiased min-h-screen bg-[#EAEDED]">
      {homepageLayout.map((section: any, index: number) => {
        if (section.type === 'hero') {
          const heroStyle = section.style || 'luxury';

          if (topBanners.length > 1) {
            return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
          }

          if (heroStyle === 'split') {
            return (
              <section key={section.id} className="relative bg-[#232F3E] overflow-hidden">
                <div className="flex flex-col md:flex-row min-h-[400px]">
                  <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                      <EditableText content={topBanners[0]?.title || amzSettings.heroTitle || settings.storeName} slug={slug} settingsKey="amazonSettings.heroTitle" />
                    </h1>
                    <p className="text-lg text-slate-300 mb-10">
                      <EditableText content={topBanners[0]?.subtitle || amzSettings.heroSubtitle || "The marketplace at your fingertips."} slug={slug} settingsKey="amazonSettings.heroSubtitle" />
                    </p>
                    <Link href={`/store/${slug}/products`} className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-10 py-3 rounded-lg font-bold transition-all w-fit">
                      SHOP THE COLLECTION
                    </Link>
                  </div>
                  <div className="w-full md:w-1/2 relative h-[300px] md:h-auto">
                    <SmartImage src={topBanners[0]?.imageUrl || amzSettings.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
                  </div>
                </div>
              </section>
            );
          }

          if (heroStyle === 'centered') {
            return (
              <section key={section.id} className="relative h-[450px] bg-[#EAEDED] overflow-hidden">
                <div className="absolute inset-0">
                  <SmartImage src={topBanners[0]?.imageUrl || amzSettings.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"} className="w-full h-full object-cover" alt="Hero Background" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#EAEDED] via-transparent to-transparent" />
                <div className="relative z-10 h-full flex flex-col items-center justify-end pb-24 text-center px-6">
                  <h1 className="text-4xl md:text-7xl font-black text-[#232F3E] mb-8 tracking-tighter">
                    <EditableText content={topBanners[0]?.title || amzSettings.heroTitle || settings.storeName} slug={slug} settingsKey="amazonSettings.heroTitle" />
                  </h1>
                  <EditableButton label="VIEW ALL DEALS" link={`/store/${slug}/products`} slug={slug} settingsKey="amazonSettings.heroButton" className="bg-[#FFD814] text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl" />
                </div>
              </section>
            );
          }

          if (heroStyle === 'minimal') {
            return (
              <section key={section.id} className="relative h-[250px] w-full bg-white flex items-center justify-between px-12 border-b border-slate-200">
                <div className="max-w-xl">
                  <h1 className="text-4xl font-black text-[#232F3E] mb-4">
                    <EditableText content={topBanners[0]?.title || amzSettings.heroTitle || settings.storeName} slug={slug} settingsKey="amazonSettings.heroTitle" />
                  </h1>
                  <Link href={`/store/${slug}/products`} className="text-[#007185] font-bold hover:text-[#C7511F] transition-all">
                    Browse all departments <ArrowRight className="inline ml-1" size={16} />
                  </Link>
                </div>
                <div className="hidden md:block h-32 w-32 rounded-xl bg-slate-100 p-4">
                  <SmartImage src={topBanners[0]?.imageUrl || amzSettings.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=80"} className="w-full h-full object-contain" alt="Icon" />
                </div>
              </section>
            );
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-[#131921] flex flex-col md:flex-row overflow-hidden">
                 <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}>
                       <div className="bg-[#FFD814] text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest w-fit mb-8 rounded-sm">SUPER SAVER EVENT</div>
                       <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-10 uppercase">
                          <EditableText content={topBanners[0]?.title || amzSettings.heroTitle || "PRIME."} slug={slug} settingsKey="amazonSettings.heroTitle" />
                       </h1>
                       <div className="flex gap-4">
                          <EditableButton label="SHOP DEALS" link={`/store/${slug}/products`} slug={slug} settingsKey="amazonSettings.heroButton" className="bg-[#FFD814] text-black px-12 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-[#F7CA00] transition-all" />
                       </div>
                    </motion.div>
                 </div>
                 <div className="w-full md:w-1/2 relative">
                    <SmartImage src={topBanners[0]?.imageUrl || amzSettings.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"} className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 hover:grayscale-0 transition-all duration-[2s]" alt="Campaign" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#131921] via-transparent to-transparent" />
                 </div>
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-[#EAEDED] flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                     <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
                        <h1 className="text-6xl md:text-[12rem] font-black text-white leading-none tracking-tighter mb-12 uppercase mix-blend-difference opacity-80">
                           <EditableText content={topBanners[0]?.title || amzSettings.heroTitle || settings.storeName} slug={slug} settingsKey="amazonSettings.heroTitle" />
                        </h1>
                       <div className="relative group">
                          <div className="w-full aspect-video bg-white p-6 shadow-2xl rounded-3xl overflow-hidden transform -rotate-2 group-hover:rotate-0 transition-transform duration-700">
                             <SmartImage src={topBanners[0]?.imageUrl || amzSettings.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"} className="w-full h-full object-cover rounded-2xl" alt="Abstract" />
                          </div>
                          <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#FFD814] rounded-full flex flex-col items-center justify-center text-black font-black text-xs uppercase tracking-widest shadow-2xl border-8 border-[#EAEDED]">
                             <span>GLOBAL</span>
                             <span className="text-3xl">FAST</span>
                          </div>
                       </div>
                    </motion.div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
               <section key={section.id} className="relative h-[80vh] w-full bg-[#131921] overflow-hidden flex items-center">
                  <div className="absolute inset-0">
                     <SmartImage src={topBanners[0]?.imageUrl || amzSettings.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"} className="w-full h-full object-cover opacity-60 scale-110" alt="Immersive" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#131921] via-transparent to-[#131921]/40" />
                  </div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                       <span className="text-[10px] font-black uppercase tracking-[1em] text-[#FFD814] mb-12 block">EXPERIENCE EVERYTHING</span>
                       <h1 className="text-7xl md:text-[18rem] font-black text-white leading-none tracking-[-0.05em] mb-16 uppercase italic">
                          <EditableText content={topBanners[0]?.title || amzSettings.heroTitle || settings.storeName} slug={slug} settingsKey="amazonSettings.heroTitle" />
                       </h1>
                       <div className="flex flex-col items-center gap-12">
                          <EditableButton label="DISCOVER ALL" link={`/store/${slug}/products`} slug={slug} settingsKey="amazonSettings.heroButton" className="px-20 py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-[10px] rounded-full hover:bg-[#FFD814] transition-all shadow-2xl" />
                          <div className="flex items-center gap-4 text-white/40">
                             <Star className="text-[#FFD814]" />
                             <span className="text-xs font-bold uppercase tracking-widest">4.9/5 Average Rating</span>
                          </div>
                       </div>
                    </motion.div>
                 </div>
              </section>
            );
          }

          // Default: Luxury (The standard Amazon layout)
          return (
            <section key={section.id} className="relative bg-[#232F3E]">
              {topBanners.length > 0 ? (
                <HeroSlider banners={topBanners} slug={slug} settings={{ ...settings.bannerSettings, transition: 'fade' }} />
              ) : (
                <div className="relative h-[400px] w-full flex items-center bg-gradient-to-r from-[#232F3E] to-[#131921] overflow-hidden">
                  <div className="container mx-auto px-6 relative z-10 text-left">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 text-white">
                      <EditableText 
                        content={amzSettings.heroTitle || `Welcome to ${settings.storeName}`} 
                        slug={slug} 
                        settingsKey="amazonSettings.heroTitle" 
                        className="text-5xl md:text-7xl font-black tracking-tighter leading-none" 
                      />
                    </h1>
                    <p className="text-xl md:text-2xl font-medium mb-10 max-w-2xl text-slate-100">
                      <EditableText 
                        content={amzSettings.heroSubtitle || "Discover the Global Marketplace."} 
                        slug={slug} 
                        settingsKey="amazonSettings.heroSubtitle" 
                        className="text-xl md:text-2xl font-medium" 
                      />
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                       <EditableButton 
                         label="Shop Now"
                         link={`/store/${slug}/products`} 
                         slug={slug}
                         settingsKey="amazonSettings.heroButton"
                         className="inline-flex items-center gap-2 bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-3 rounded-md font-medium transition-colors"
                       />
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-50 md:opacity-100">
                     <EditableImage 
                       src={amzSettings.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80"} 
                       alt="Hero" 
                       slug={slug}
                       settingsKey="amazonSettings.heroImage"
                       className="object-cover h-[400px] w-[500px]" 
                     />
                  </div>
                </div>
              )}
            </section>
          );
        }

        const isFirstAfterHero = index === 1 && homepageLayout[0].type === 'hero';

        if (section.type === 'categories') {
          return (
            <div key={section.id} className={`container mx-auto px-4 relative z-20 ${isFirstAfterHero ? '-mt-20' : 'mt-8'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="bg-white p-5 shadow-sm h-[420px] flex flex-col rounded-sm">
                    <h2 className="text-xl font-bold mb-4 capitalize text-left">{cat.name}</h2>
                    <div className="flex-grow relative mb-4">
                      <SmartImage 
                        src={cat.image || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`} 
                        alt={cat.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <Link href={`/store/${slug}/products?category=${cat.id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm font-medium text-left">
                      Shop now
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          const isDeals = section.config?.title?.toLowerCase().includes('deal');
          return (
            <div key={section.id} className={`container mx-auto px-4 mt-8 relative z-20 ${isFirstAfterHero ? '-mt-20' : ''}`}>
              <div className="bg-white p-5 shadow-sm rounded-sm text-left">
                <div className="flex items-end gap-4 mb-4">
                  <h2 className="text-xl font-bold">
                    <EditableText 
                      content={section.config?.title || "Featured Products"} 
                      slug={slug} 
                      settingsKey={`section-${section.id}-title`}
                      className="text-xl font-bold" 
                    />
                  </h2>
                  <Link href={`/store/${slug}/products`} className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm font-medium">
                    See all
                  </Link>
                </div>
                
                <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                  {products.slice(0, 10).map((product) => (
                    <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="min-w-[200px] w-[200px] group flex flex-col">
                      <div className="aspect-square bg-[#F7F7F7] p-2 mb-2 relative flex items-center justify-center">
                        <SmartImage 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-contain mix-blend-multiply" 
                        />
                      </div>
                      {isDeals && product.discount_price && (
                        <div className="mb-1">
                          <span className="bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded-sm mr-2">
                            {Math.round((1 - product.discount_price / product.price) * 100)}% off
                          </span>
                          <span className="text-[#CC0C39] text-xs font-bold uppercase">Deal</span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl font-medium">${product.discount_price || product.price}</span>
                        {product.discount_price && (
                          <span className="text-xs text-[#565959] line-through">List: ${product.price}</span>
                        )}
                      </div>
                      <h3 className="text-sm text-[#0F1111] line-clamp-2 mt-1 group-hover:text-[#C7511F]">{product.name}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          return (
            <div key={section.id} className="container mx-auto px-4 mt-8 relative z-20">
              <div className="space-y-6">
                {bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="bg-white shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-[350px] rounded-sm">
                    <div className="w-full md:w-2/3 relative aspect-[4/5] md:aspect-auto h-auto md:h-full">
                      <SmartImage 
                        src={banner.imageUrl} 
                        alt={banner.title} 
                        className="hidden md:block absolute inset-0 w-full h-full object-cover" 
                      />
                      <SmartImage 
                        src={banner.mobileImageUrl || banner.imageUrl} 
                        alt={banner.title} 
                        className="md:hidden absolute inset-0 w-full h-full object-cover" 
                      />
                    </div>
                    <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-center text-left">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">{banner.title}</h3>
                      <p className="text-gray-600 mb-8">{banner.subtitle}</p>
                      {banner.buttonText && (
                        <Link 
                          href={banner.buttonLink || `/store/${slug}/products`}
                          className="w-full md:w-fit bg-[#FFD814] hover:bg-[#F7CA00] text-black px-8 py-3 rounded-md font-medium text-center transition-colors shadow-sm"
                        >
                          {banner.buttonText}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="amazon" />;
        }

        return null;
      })}

      {/* Bottom Banners Section */}
      {bottomBanners.length > 0 && (
        <div className="container mx-auto px-4 mt-8 relative z-20">
          <div className="space-y-6">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="bg-white shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-[350px] rounded-sm">
                <div className="w-full md:w-2/3 relative aspect-[4/5] md:aspect-auto h-auto md:h-full">
                  <SmartImage 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="hidden md:block absolute inset-0 w-full h-full object-cover" 
                  />
                  <SmartImage 
                    src={banner.mobileImageUrl || banner.imageUrl} 
                    alt={banner.title} 
                    className="md:hidden absolute inset-0 w-full h-full object-cover" 
                  />
                </div>
                <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-center text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{banner.title}</h3>
                  <p className="text-gray-600 mb-8">{banner.subtitle}</p>
                  {banner.buttonText && (
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="w-full md:w-fit bg-[#FFD814] hover:bg-[#F7CA00] text-black px-8 py-3 rounded-md font-medium text-center transition-colors shadow-sm"
                    >
                      {banner.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pb-12" />
    </div>
  );
}
