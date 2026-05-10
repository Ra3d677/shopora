"use client";

import Link from "next/link";
import BannerButton from "@/components/ui/BannerButton";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import StoreMarquee from "@/components/ui/StoreMarquee";
import { motion } from "framer-motion";
import SaleSection from "@/components/ui/SaleSection";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function MinimalTemplate({ banners, settings, products, slug, categories }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const featuredProducts = products.slice(0, 6);
  const displayCategories = categories.slice(0, 3);
  const minSettings = settings.minimalSettings || {};
  
  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');
  
  const homepageLayout = settings.homepageLayout || [
    { id: 'default-hero', type: 'hero' },
    { id: 'default-marquee', type: 'marquee' },
    { id: 'default-categories', type: 'categories' },
    { id: 'default-products', type: 'featured_products' }
  ];

  return (
    <div className="flex flex-col w-full font-light antialiased bg-white">
      {homepageLayout.map((section: any) => {
        if (section.type === 'hero') {
          const heroStyle = section.style || 'luxury';

          if (topBanners.length > 1) {
            return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
          }

          if (heroStyle === 'split') {
            return (
              <section key={section.id} className="relative h-[80vh] w-full flex flex-col md:flex-row bg-white overflow-hidden border-b">
                <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-12 md:p-24 text-left">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-xl">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-zinc-900 mb-8 leading-[0.85] uppercase">
                      <EditableText content={topBanners[0]?.title || minSettings.heroTitle || settings.storeName} slug={slug} settingsKey="minimalSettings.heroTitle" />
                    </h1>
                    <p className="text-xl text-zinc-500 mb-12 max-w-sm italic">
                      <EditableText content={topBanners[0]?.subtitle || minSettings.heroSubtitle || "Functional beauty in every detail."} slug={slug} settingsKey="minimalSettings.heroSubtitle" />
                    </p>
                    <Link href={`/store/${slug}/products`} className="inline-block px-12 py-5 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all">
                      SHOP NOW
                    </Link>
                  </motion.div>
                </div>
                <div className="w-full md:w-1/2 relative h-full bg-zinc-50">
                  <SmartImage src={topBanners[0]?.imageUrl || minSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="absolute inset-0 w-full h-full object-cover grayscale" alt="Hero" />
                </div>
              </section>
            );
          }

          if (heroStyle === 'centered') {
            return (
              <section key={section.id} className="relative h-[80vh] w-full flex flex-col items-center justify-center bg-zinc-50 overflow-hidden text-center px-6">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="max-w-5xl z-10">
                  <h1 className="text-7xl md:text-[12rem] font-bold text-black leading-none tracking-tighter mb-10 uppercase">
                    <EditableText content={topBanners[0]?.title || minSettings.heroTitle || settings.storeName} slug={slug} settingsKey="minimalSettings.heroTitle" />
                  </h1>
                  <p className="text-2xl text-zinc-400 font-medium mb-12 italic">
                    <EditableText content={topBanners[0]?.subtitle || minSettings.heroSubtitle || "Less, but better."} slug={slug} settingsKey="minimalSettings.heroSubtitle" />
                  </p>
                  <Link href={`/store/${slug}/products`} className="inline-block px-16 py-6 border-2 border-black text-black font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all">
                    EXPLORE
                  </Link>
                </motion.div>
              </section>
            );
          }

          if (heroStyle === 'minimal') {
            return (
              <section key={section.id} className="relative h-[50vh] w-full bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-2xl border-x border-zinc-100 px-12 py-12">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6 uppercase">
                    <EditableText content={topBanners[0]?.title || minSettings.heroTitle || settings.storeName} slug={slug} settingsKey="minimalSettings.heroTitle" />
                  </h1>
                  <p className="text-lg text-zinc-500 mb-10 italic">
                    <EditableText content={topBanners[0]?.subtitle || minSettings.heroSubtitle || "Simple. Functional. Honest."} slug={slug} settingsKey="minimalSettings.heroSubtitle" />
                  </p>
                  <Link href={`/store/${slug}/products`} className="text-black font-bold uppercase tracking-[0.3em] text-[10px] border-b border-black pb-1 hover:opacity-50 transition-opacity">
                    ENTER SHOP
                  </Link>
                </div>
              </section>
            );
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-white flex flex-col md:flex-row border-b border-zinc-100 mt-2">
                 <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
                       <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400 mb-10 block">EDITION № 01</span>
                       <h1 className="text-7xl md:text-[12rem] font-bold text-black leading-[0.8] tracking-tighter mb-12 uppercase">
                          <EditableText content={topBanners[0]?.title || minSettings.heroTitle || "OBJECT."} slug={slug} settingsKey="minimalSettings.heroTitle" />
                       </h1>
                       <div className="flex gap-10 items-center">
                          <EditableButton label="VIEW ALL" link={`/store/${slug}/products`} slug={slug} settingsKey="minimalSettings.heroButton" className="text-black font-bold uppercase tracking-widest text-[10px] border-b-2 border-black pb-1" />
                          <span className="text-[10px] font-medium text-zinc-400 italic">Form follows function.</span>
                       </div>
                    </motion.div>
                 </div>
                  <div className="w-full md:w-1/2 relative bg-zinc-50">
                    <SmartImage src={topBanners[0]?.imageUrl || minSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="absolute inset-0 w-full h-full object-cover grayscale" alt="Campaign" />
                    <div className="absolute top-0 right-0 p-12 text-[10px] font-black uppercase tracking-widest text-black/20 vertical-rl uppercase">Antigravity Design</div>
                  </div>
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-zinc-50 flex items-center justify-center overflow-hidden">
                 <div className="text-center z-10 px-6">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}>
                       <div className="relative mb-20 group">
                           <div className="w-64 md:w-[32rem] aspect-square mx-auto bg-white p-4 shadow-sm group-hover:shadow-2xl transition-all duration-1000 overflow-hidden">
                             <SmartImage src={topBanners[0]?.imageUrl || minSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-[3s]" alt="Abstract" />
                           </div>
                          <div className="absolute top-1/2 left-0 w-full text-center pointer-events-none">
                             <h1 className="text-[10rem] md:text-[20rem] font-bold text-black/10 tracking-tighter uppercase leading-none">
                                <EditableText content={topBanners[0]?.title || settings.storeName} slug={slug} settingsKey="minimalSettings.heroTitle" />
                             </h1>
                          </div>
                       </div>
                       <EditableButton label="DISCOVER COLLECTION" link={`/store/${slug}/products`} slug={slug} settingsKey="minimalSettings.heroButton" className="px-16 py-6 bg-black text-white font-bold uppercase tracking-[0.5em] text-[10px] hover:bg-zinc-800 transition-all" />
                    </motion.div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
               <section key={section.id} className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-white">
                  <div className="absolute inset-0">
                     <SmartImage src={topBanners[0]?.imageUrl || minSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover opacity-60 scale-110 grayscale" alt="Immersive" />
                     <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                     <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
                        <h1 className="text-6xl md:text-[12rem] font-bold text-black leading-none tracking-tighter mb-12 uppercase mix-blend-multiply opacity-80">
                           <EditableText content={topBanners[0]?.title || minSettings.heroTitle || settings.storeName} slug={slug} settingsKey="minimalSettings.heroTitle" />
                        </h1>
                       <div className="w-px h-32 bg-black/10 mb-12 mx-auto" />
                       <EditableButton label="START EXPERIENCE" link={`/store/${slug}/products`} slug={slug} settingsKey="minimalSettings.heroButton" className="text-black font-bold uppercase tracking-[1em] text-[10px] hover:tracking-[1.2em] transition-all" />
                    </motion.div>
                 </div>
              </section>
            );
          }

          // Default: Luxury (The original design)
          return (
            <div key={section.id}>
              {topBanners.length > 1 ? (
                <HeroSlider banners={topBanners} slug={slug} settings={settings.bannerSettings} />
              ) : (
                <section className="py-16 md:py-32 px-6 md:px-12 border-b border-zinc-100 overflow-hidden">
                  <div className="max-w-screen-2xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-12 text-left">
                      <div className="max-w-2xl">
                        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-6 md:mb-8 block">
                          <EditableText 
                            content={minSettings.heroBadge || "Collection Nº 01"} 
                            slug={slug} 
                            settingsKey="minimalSettings.heroBadge" 
                            className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]" 
                          />
                        </div>
                        <div className="text-6xl md:text-[10vw] font-bold leading-[0.85] tracking-tighter uppercase mb-8 md:mb-12">
                          <EditableText 
                            content={minSettings.heroTitle || "Pure Form."} 
                            slug={slug} 
                            settingsKey="minimalSettings.heroTitle" 
                            className="text-7xl md:text-[10vw] font-bold leading-[0.85] tracking-tighter uppercase" 
                          />
                        </div>
                        <div className="text-lg md:text-2xl text-zinc-500 leading-relaxed italic max-w-lg">
                          <EditableText 
                            content={minSettings.heroSubtitle || "“Design is not just what it looks like and feels like. Design is how it works.”"} 
                            slug={slug} 
                            settingsKey="minimalSettings.heroSubtitle" 
                            className="text-xl md:text-2xl text-zinc-500 leading-relaxed italic" 
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full lg:w-auto justify-center lg:justify-end mt-8 lg:mt-0">
                         {Array.isArray(minSettings.heroButtons) && minSettings.heroButtons.map((btn: any, index: number) => (
                           <EditableButton 
                             key={btn.id || index}
                             label={btn.label}
                             link={btn.link}
                             slug={slug}
                             settingsKey={`minimalSettings.heroButtons.${index}`}
                             style={btn.style}
                             className="w-48 h-48 rounded-full border border-zinc-200 flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-500"
                           />
                         ))}

                         {isEditMode && (
                           <button 
                             onClick={async () => {
                               const currentButtons = Array.isArray(minSettings.heroButtons) ? minSettings.heroButtons : [];
                               const newButton = {
                                 id: Math.random().toString(36).substr(2, 9),
                                 label: "SHOP NOW",
                                 link: "#",
                                 style: { backgroundColor: "#ffffff", textColor: "#000000" }
                               };
                               await updateStoreSettingByKey(slug, "minimalSettings.heroButtons", [...currentButtons, newButton]);
                             }}
                             className="w-48 h-48 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-300 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-500 transition-all"
                           >
                             <Plus size={32} />
                           </button>
                         )}
                      </div>
                    </div>
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

        if (section.type === 'categories') {
          return (
            <section key={section.id} className="py-16 md:py-24 px-6 md:px-12 bg-zinc-50">
              <div className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                  {categories.slice(0, 3).map((cat: any) => (
                    <Link href={`/store/${slug}/products?category=${cat.id}`} key={cat.id} className="group relative aspect-[3/4] bg-white overflow-hidden border border-zinc-100">
                      <SmartImage 
                        src={cat.image || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80`} 
                        alt={cat.name} 
                        className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
                      <div className="absolute bottom-10 left-10 text-left">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white mb-2 block opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">View Series</span>
                         <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">{cat.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          
          return (
            <section key={section.id} className="py-16 md:py-24 px-6 md:px-12 bg-white border-y border-zinc-100">
              <div className="max-w-screen-2xl mx-auto space-y-12">
                {bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9] overflow-hidden group">
                    <SmartImage 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105" 
                    />
                    <SmartImage 
                      src={banner.mobileImageUrl || banner.imageUrl} 
                      alt={banner.title} 
                      className="md:hidden absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 md:p-12 text-white">
                      <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">{banner.title}</h2>
                      <p className="text-lg md:text-xl font-light italic opacity-80 mb-8">{banner.subtitle}</p>
                      <BannerButton banner={banner} slug={slug} />
                    </div>
                  </div>
                ))}
                {bannersToShow.length === 0 && (
                  <div className="text-center py-20 text-zinc-400 font-bold uppercase tracking-widest border border-dashed border-zinc-200 rounded-3xl">
                    Add banners to display them here.
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <section key={section.id} className="py-20 md:py-32 px-6 md:px-12 bg-white">
              <div className="max-w-screen-2xl mx-auto text-left">
                <div className="flex items-baseline justify-between mb-20 border-b border-zinc-200 pb-12">
                   <div className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">
                     <EditableText 
                       content={minSettings.productsTitle || section.config?.title || "The Archive"} 
                       slug={slug} 
                       settingsKey="minimalSettings.productsTitle" 
                       initialStyles={minSettings.productsTitle_styles}
                       className="text-4xl md:text-5xl font-bold uppercase tracking-tighter" 
                     />
                  </div>
                  <p className="text-zinc-400 uppercase tracking-[0.3em] text-[10px] font-bold">Scroll to Explore ({products.length} Items)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                  {products.slice(0, 6).map((product: any) => (
                    <div key={product.id} className="group flex flex-col">
                      <Link href={`/store/${slug}/product/${product.id}`} className="block">
                        <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden mb-6">
                          <SmartImage 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                          />
                        </div>
                      </Link>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <h3 className="text-lg font-bold uppercase tracking-tight mb-1">{product.name}</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{product.category_id}</p>
                        </div>
                        <span className="font-mono text-sm">${product.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="minimal" />;
        }

        if (section.type === 'text_block') {
          return (
            <section key={section.id} className="py-24 bg-zinc-50 border-y border-zinc-100">
              <div className="container mx-auto px-8 max-w-4xl text-center">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.85] mb-10 uppercase">
                  {section.config?.title || "Simplicity is the ultimate sophistication."}
                </h2>
                <p className="text-xl text-zinc-500 leading-relaxed italic">
                  {section.config?.text || "Our philosophy is rooted in the belief that true luxury lies in the details that most people ignore."}
                </p>
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* Bottom Banners Section */}
      {bottomBanners.length > 0 && (
        <section className="py-24 px-6 md:px-12 bg-white border-t border-zinc-100">
          <div className="max-w-screen-2xl mx-auto space-y-24">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9] overflow-hidden group border border-zinc-100">
                <SmartImage 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-[3s] group-hover:scale-105" 
                />
                <SmartImage 
                  src={banner.mobileImageUrl || banner.imageUrl} 
                  alt={banner.title} 
                  className="md:hidden absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-[3s] group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/0 transition-colors duration-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-16 text-black">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  >
                    <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 uppercase">{banner.title}</h2>
                    <p className="text-xl md:text-2xl font-light text-zinc-500 max-w-2xl mb-10 tracking-tight italic">{banner.subtitle}</p>
                    <BannerButton banner={banner} slug={slug} />
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
