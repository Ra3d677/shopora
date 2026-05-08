"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Plus } from "lucide-react";
import StoreMarquee from "@/components/ui/StoreMarquee";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import { motion } from "framer-motion";
import SaleSection from "@/components/ui/SaleSection";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function AppleTemplate({ banners, settings, products, slug, categories = [] }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const featuredProducts = products.slice(0, 4);
  const secondaryProducts = products.slice(4, 10);
  const appleSettings = settings.appleSettings || {};
  
  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');
  
  const homepageLayout = settings.homepageLayout || [
    { id: 'default-hero', type: 'hero' },
    { id: 'default-products', type: 'featured_products' },
    { id: 'default-categories', type: 'categories' }
  ];

  return (
    <div className="flex flex-col w-full font-sans text-[#1d1d1f] antialiased bg-[#f5f5f7]">
      {/* 1. Marquee / Ribbon (Fixed at top or based on settings) */}
      <div className="bg-[#1d1d1f] text-white text-sm text-center py-3">
        <div className="flex items-center justify-center">
          <EditableText 
            content={appleSettings.ribbonText || `Get $200–$600 in credit toward the new ${settings.storeName} products.`}
            slug={slug} 
            settingsKey="appleSettings.ribbonText" 
            initialStyles={appleSettings.ribbonText_styles}
            className="text-white text-sm" 
          />
          <Link href={`/store/${slug}/products`} className="text-[#2997ff] hover:underline ml-1">Shop now {'>'}</Link>
        </div>
      </div>

      {homepageLayout.map((section: any) => {
        if (section.type === 'hero') {
          const heroStyle = section.style || 'luxury';

          if (topBanners.length > 1) {
            return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative w-full h-screen bg-[#fafafa] flex flex-col md:flex-row overflow-hidden border-b border-zinc-100 mt-2">
                 <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0071e3] mb-6 block">PRO SERIES</span>
                       <h1 className="text-6xl md:text-8xl font-semibold text-[#1d1d1f] tracking-tight mb-8">
                          <EditableText content={topBanners[0]?.title || appleSettings.heroTitle || settings.storeName || "PRODUCT"} slug={slug} settingsKey="appleSettings.heroTitle" />
                       </h1>
                       <div className="flex gap-4">
                          {Array.isArray(appleSettings.heroButtons) && appleSettings.heroButtons.map((btn: any, index: number) => (
                            <EditableButton key={btn.id || index} label={btn.label} link={btn.link} slug={slug} settingsKey={`appleSettings.heroButtons.${index}`} style={btn.style} className="bg-[#1d1d1f] text-white px-8 py-3 rounded-full text-base font-normal" />
                          ))}
                       </div>
                    </motion.div>
                 </div>
                 <div className="w-full md:w-1/2 relative">
                    <SmartImage src={topBanners[0]?.imageUrl || appleSettings.heroImage || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80"} className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Campaign" />
                 </div>
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative w-full h-screen bg-white flex items-center justify-center overflow-hidden mt-2">
                 <div className="text-center z-10 px-6">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}>
                       <h1 className="text-7xl md:text-[12rem] font-semibold text-[#1d1d1f] tracking-tighter mb-12 uppercase leading-none italic">
                          <EditableText content={topBanners[0]?.title || appleSettings.heroTitle || settings.storeName} slug={slug} settingsKey="appleSettings.heroTitle" />
                       </h1>
                       <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                          <SmartImage src={topBanners[0]?.imageUrl || appleSettings.heroImage || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80"} className="w-full h-full object-cover scale-110" alt="Abstract Center" />
                       </div>
                       <div className="mt-12">
                          <EditableButton label="SHOP COLLECTION" link={`/store/${slug}/products`} slug={slug} settingsKey="appleSettings.heroButton" className="text-[#0071e3] text-xl font-normal hover:underline" />
                       </div>
                    </motion.div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
              <section key={section.id} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center text-center mt-2">
                 <div className="absolute inset-0">
                    <SmartImage src={topBanners[0]?.imageUrl || appleSettings.heroImage || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80"} className="w-full h-full object-cover opacity-60" alt="Immersive" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                 </div>
                 <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="z-10 px-6 max-w-5xl">
                    <h1 className="text-7xl md:text-[15rem] font-semibold text-white tracking-tighter mb-16 leading-none italic mix-blend-difference">
                       <EditableText content={topBanners[0]?.title || appleSettings.heroTitle || settings.storeName} slug={slug} settingsKey="appleSettings.heroTitle" />
                    </h1>
                    <div className="flex flex-col items-center gap-8">
                       <EditableButton label="BUY NOW" link={`/store/${slug}/products`} slug={slug} settingsKey="appleSettings.heroButton" className="bg-white text-black px-16 py-4 rounded-full text-lg font-semibold hover:bg-[#fafafa] transition-colors" />
                       <span className="text-[#86868b] text-base font-normal">Available today. Free shipping.</span>
                    </div>
                 </motion.div>
              </section>
            );
          }

          return (
            <div key={section.id}>
              {topBanners.length > 1 ? (
                <HeroSlider banners={topBanners} slug={slug} settings={settings.bannerSettings} />
              ) : (
                <section className="relative w-full h-[600px] md:h-[700px] flex flex-col items-center pt-16 overflow-hidden bg-white mt-2">
                  <div className="text-center z-10 px-4">
                    <div className="text-3xl md:text-5xl font-semibold tracking-tight mb-2">
                       <EditableText 
                         content={topBanners[0]?.title || appleSettings.heroTitle || "Product."} 
                         slug={slug} 
                         settingsKey="appleSettings.heroTitle" 
                         initialStyles={appleSettings.heroTitle_styles}
                         className="text-3xl md:text-5xl font-semibold tracking-tight" 
                       />
                    </div>
                    <div className="text-xl md:text-2xl font-normal text-[#86868b] tracking-tight mb-6">
                       <EditableText 
                         content={topBanners[0]?.subtitle || appleSettings.heroSubtitle || "Powerful. Beautiful."} 
                         slug={slug} 
                         settingsKey="appleSettings.heroSubtitle" 
                         initialStyles={appleSettings.heroSubtitle_styles}
                         className="text-xl md:text-2xl font-normal text-[#86868b] tracking-tight" 
                       />
                    </div>
                    <div className="flex items-center justify-center gap-6">
                       {Array.isArray(appleSettings.heroButtons) && appleSettings.heroButtons.map((btn: any, index: number) => (
                         <EditableButton 
                           key={btn.id || index}
                           label={btn.label}
                           link={btn.link}
                           slug={slug}
                           settingsKey={`appleSettings.heroButtons.${index}`}
                           style={btn.style}
                           onDelete={async () => {
                             const buttons = Array.isArray(appleSettings.heroButtons) ? appleSettings.heroButtons : [];
                             const updated = buttons.filter((_: any, i: number) => i !== index);
                             await updateStoreSettingByKey(slug, "appleSettings.heroButtons", updated);
                           }}
                           className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-6 py-2.5 rounded-full text-base font-normal transition-colors"
                         />
                       ))}

                       {isEditMode && (
                         <button 
                           onClick={async () => {
                             const currentButtons = Array.isArray(appleSettings.heroButtons) ? appleSettings.heroButtons : [];
                             const newButton = {
                               id: Math.random().toString(36).substr(2, 9),
                               label: "Learn more",
                               link: "#",
                               style: { backgroundColor: "#0071e3", textColor: "#ffffff" }
                             };
                             await updateStoreSettingByKey(slug, "appleSettings.heroButtons", [...currentButtons, newButton]);
                           }}
                           className="w-10 h-10 rounded-full border border-dashed border-[#0071e3] flex items-center justify-center text-[#0071e3] hover:bg-[#0071e3]/10"
                         >
                           <Plus size={20} />
                         </button>
                       )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 w-full max-w-5xl h-[400px] md:h-[500px]">
                    <SmartImage 
                      src={topBanners[0]?.imageUrl || appleSettings.heroImage || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80"} 
                      alt="Hero Product" 
                      className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] md:h-[500px] object-cover object-top"
                    />
                    <SmartImage 
                      src={topBanners[0]?.mobileImageUrl || topBanners[0]?.imageUrl || appleSettings.heroImage || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80"} 
                      alt="Hero Product Mobile" 
                      className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] md:h-[500px] object-cover object-top"
                    />
                  </div>
                </section>
              )}
            </div>
          );
        }

        if (section.type === 'marquee') {
          return settings.marqueeSettings?.enabled && (
            <StoreMarquee key={section.id} settings={settings.marqueeSettings} />
          );
        }

        if (section.type === 'text_block' || section.type === 'secondary_hero') {
          return (
            <section key={section.id} className="relative w-full h-[600px] md:h-[700px] flex flex-col items-center pt-16 overflow-hidden bg-black mt-3 text-white">
              <div className="text-center z-10 px-4">
                <div className="text-3xl md:text-5xl font-semibold tracking-tight mb-2">
                   <EditableText 
                     content={appleSettings.secHeroTitle || section.config?.title || `${settings.storeName} Air`} 
                     slug={slug} 
                     settingsKey="appleSettings.secHeroTitle" 
                     initialStyles={appleSettings.secHeroTitle_styles}
                     className="text-3xl md:text-5xl font-semibold tracking-tight" 
                   />
                </div>
                <div className="text-xl md:text-2xl font-normal text-[#86868b] tracking-tight mb-6">
                   <EditableText 
                     content={appleSettings.secHeroSubtitle || section.config?.text || "Supercharged by Antigravity."} 
                     slug={slug} 
                     settingsKey="appleSettings.secHeroSubtitle" 
                     initialStyles={appleSettings.secHeroSubtitle_styles}
                     className="text-xl md:text-2xl font-normal text-[#86868b] tracking-tight" 
                   />
                </div>
                <div className="flex items-center justify-center gap-6">
                  <Link href={`/store/${slug}/products`} className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-6 py-2.5 rounded-full text-base font-normal transition-colors">
                    Learn more
                  </Link>
                  <Link href={`/store/${slug}/products`} className="text-[#2997ff] hover:text-[#0077ED] text-base font-normal flex items-center group">
                    Buy <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="absolute bottom-0 w-full max-w-4xl h-[400px]">
                <EditableImage 
                  src={appleSettings.secHeroImage || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80"} 
                  alt="Secondary Hero Product" 
                  slug={slug}
                  settingsKey="appleSettings.secHeroImage"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] object-contain object-bottom"
                />
              </div>
            </section>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <section key={section.id} className="max-w-[2560px] mx-auto w-full px-3 py-3 grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#f5f5f7]">
              {products.slice(0, 6).map((product, idx) => (
                <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className={`relative h-[500px] md:h-[580px] overflow-hidden flex flex-col items-center pt-12 text-center group ${idx % 3 === 0 ? 'bg-black text-white' : 'bg-white text-[#1d1d1f]'}`}>
                  <h4 className="text-3xl font-semibold tracking-tight mb-2">{product.name}</h4>
                  <p className={`text-lg font-normal mb-4 px-4 ${idx % 3 === 0 ? 'text-[#86868b]' : 'text-[#86868b]'}`}>{product.description?.substring(0, 60)}...</p>
                  <div className="flex items-center justify-center gap-4 text-base font-normal">
                    <span className="text-[#2997ff] group-hover:underline">Learn more {'>'}</span>
                    <span className="text-[#2997ff] group-hover:underline">Buy {'>'}</span>
                  </div>
                  <div className="absolute bottom-0 w-full h-[60%] p-8">
                     <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                        <SmartImage 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-contain object-bottom"
                        />
                     </div>
                  </div>
                </Link>
              ))}
            </section>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          return (
            <section key={section.id} className="w-full px-3 py-3 grid grid-cols-1 gap-3">
              {bannersToShow.map((banner: any) => (
                <div key={banner.id} className="relative aspect-[4/5] md:h-[500px] md:aspect-auto bg-[#f5f5f7] rounded-[2rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 group">
                  <SmartImage 
                    src={banner.imageUrl} 
                    className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                    alt={banner.title}
                  />
                  <SmartImage 
                    src={banner.mobileImageUrl || banner.imageUrl} 
                    className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                    alt={banner.title}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="relative z-10 text-white text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{banner.title}</h2>
                    <p className="text-xl md:text-2xl font-light mb-8 opacity-90">{banner.subtitle}</p>
                    {banner.buttonText && (
                      <Link 
                        href={banner.buttonLink || `/store/${slug}/products`}
                        className="bg-white text-black px-8 py-3 rounded-full text-lg font-medium hover:bg-slate-100 transition-all inline-block"
                      >
                        {banner.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {bannersToShow.length === 0 && (
                <div className="text-center py-20 text-[#86868b] font-bold uppercase tracking-widest border border-dashed border-zinc-200 rounded-3xl bg-white">
                  Add banners in the admin dashboard.
                </div>
              )}
            </section>
          );
        }

        if (section.type === 'categories' || section.type === 'carousel') {
          return (
            <section key={section.id} className="bg-white py-16">
               <div className="max-w-[1400px] mx-auto px-6 text-left">
                  <div className="text-3xl font-semibold tracking-tight mb-8">
                    <EditableText 
                      content={appleSettings.carouselTitle || section.config?.title || `More from ${settings.storeName}.`} 
                      slug={slug} 
                      settingsKey="appleSettings.carouselTitle" 
                      initialStyles={appleSettings.carouselTitle_styles}
                      className="text-3xl font-semibold tracking-tight" 
                    />
                  </div>
                  <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x">
                     {products.slice(4, 12).map((product) => (
                        <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="min-w-[300px] w-[300px] bg-[#f5f5f7] rounded-2xl p-6 flex flex-col snap-center hover:shadow-lg transition-shadow">
                           <div className="relative w-full h-[200px] mb-6">
                              <SmartImage src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-contain" />
                           </div>
                           <div className="mt-auto">
                              <h4 className="text-xl font-semibold mb-1">{product.name}</h4>
                              <p className="text-[#1d1d1f] font-normal mb-4">${product.discount_price || product.price}</p>
                              <span className="text-[#0071e3] font-normal text-sm group-hover:underline">Shop {'>'}</span>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </section>
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="apple" />;
        }

        return null;
      })}

      {/* Bottom Banners Section */}
      {bottomBanners.length > 0 && (
        <section className="py-20 px-4 bg-white border-t border-zinc-100">
          <div className="max-w-7xl mx-auto space-y-12">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9] rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-700">
                <SmartImage 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
                />
                <SmartImage 
                  src={banner.mobileImageUrl || banner.imageUrl} 
                  alt={banner.title} 
                  className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-16 text-[#1d1d1f]">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  >
                    <h2 className="text-4xl md:text-7xl font-semibold tracking-tight mb-6">{banner.title}</h2>
                    <p className="text-xl md:text-2xl font-normal text-[#86868b] max-w-2xl mb-10 tracking-tight">{banner.subtitle}</p>
                    {banner.buttonText && (
                      <Link 
                        href={banner.buttonLink || `/store/${slug}/products`}
                        className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-10 py-4 rounded-full text-lg font-normal transition-colors"
                      >
                        {banner.buttonText}
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
