"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Plus } from "lucide-react";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import StoreMarquee from "@/components/ui/StoreMarquee";
import SaleSection from "@/components/ui/SaleSection";
import { motion, AnimatePresence } from "framer-motion";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
}

export default function ModernTemplate({ banners, settings, products, slug }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const featuredProducts = products.slice(0, 8);
  const modSettings = settings.modernSettings || {};
  
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
    <div className="flex flex-col w-full font-sans bg-white">
      {homepageLayout.map((section: any) => {
        if (section.type === 'hero') {
          const heroStyle = section.style || 'luxury';

          if (topBanners.length > 1) {
            return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
          }
          
          if (heroStyle === 'split') {
            return (
              <section key={section.id} className="relative h-[80vh] w-full flex flex-col md:flex-row bg-white overflow-hidden">
                <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-12 md:p-24 text-left bg-slate-50">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                  >
                    <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                      <EditableText content={modSettings.heroBadge || "NEW ERA"} slug={slug} settingsKey="modernSettings.heroBadge" />
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 italic">
                      <EditableText content={topBanners[0]?.title || modSettings.heroTitle || "STYLE."} slug={slug} settingsKey="modernSettings.heroTitle" />
                    </h1>
                    <p className="text-xl text-slate-500 max-w-md mb-12">
                      <EditableText content={topBanners[0]?.subtitle || modSettings.heroSubtitle || "Innovation meets design in our latest drop."} slug={slug} settingsKey="modernSettings.heroSubtitle" />
                    </p>
                    <Link href={`/store/${slug}/products`} className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl">
                      EXPLORE NOW <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                </div>
                <div className="w-full md:w-1/2 relative h-full">
                  <SmartImage src={topBanners[0]?.imageUrl || modSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
                </div>
              </section>
            );
          }

          if (heroStyle === 'centered') {
            return (
              <section key={section.id} className="relative h-[80vh] w-full flex flex-col items-center justify-center bg-slate-900 overflow-hidden text-center px-6">
                <div className="absolute inset-0 opacity-40">
                  <SmartImage src={topBanners[0]?.imageUrl || modSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="w-full h-full object-cover" alt="Hero Bg" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="max-w-5xl z-10">
                  <h1 className="text-7xl md:text-[10rem] font-black text-white leading-none tracking-tighter mb-10 uppercase">
                    <EditableText content={topBanners[0]?.title || modSettings.heroTitle || settings.storeName} slug={slug} settingsKey="modernSettings.heroTitle" />
                  </h1>
                  <p className="text-2xl md:text-3xl text-slate-300 font-medium max-w-3xl mx-auto mb-12 italic">
                    <EditableText content={topBanners[0]?.subtitle || modSettings.heroSubtitle || "The pinnacle of craftsmanship."} slug={slug} settingsKey="modernSettings.heroSubtitle" />
                  </p>
                  <Link href={`/store/${slug}/products`} className="inline-block px-16 py-6 bg-blue-600 text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-slate-900 transition-all rounded-full shadow-2xl">
                    DISCOVER MORE
                  </Link>
                </motion.div>
              </section>
            );
          }

          if (heroStyle === 'minimal') {
            return (
              <section key={section.id} className="relative h-[60vh] w-full bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-3xl">
                  <div className="w-12 h-12 border-2 border-slate-900 mx-auto mb-8 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-600" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 uppercase leading-none">
                    <EditableText content={topBanners[0]?.title || modSettings.heroTitle || settings.storeName} slug={slug} settingsKey="modernSettings.heroTitle" />
                  </h1>
                  <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                    <EditableText content={topBanners[0]?.subtitle || modSettings.heroSubtitle || "Less is more. Quality is everything."} slug={slug} settingsKey="modernSettings.heroSubtitle" />
                  </p>
                  <Link href={`/store/${slug}/products`} className="text-blue-600 font-black uppercase tracking-widest text-sm hover:tracking-[0.2em] transition-all">
                    VIEW PRODUCTS
                  </Link>
                </div>
              </section>
            );
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-slate-900 overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 relative h-full">
                    <SmartImage src={topBanners[0]?.imageUrl || modSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="absolute inset-0 w-full h-full object-cover" alt="Campaign" />
                    <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
                  </div>
                 <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 bg-white">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
                       <div className="flex items-center gap-4 mb-8">
                          <span className="w-12 h-0.5 bg-blue-600" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">COLLECTION 2026</span>
                       </div>
                       <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 leading-[0.8] tracking-tighter mb-12 uppercase italic">
                          <EditableText content={topBanners[0]?.title || modSettings.heroTitle || "URBAN."} slug={slug} settingsKey="modernSettings.heroTitle" />
                       </h1>
                       <div className="flex gap-4">
                          {Array.isArray(modSettings.heroButtons) && modSettings.heroButtons.map((btn: any, index: number) => (
                            <EditableButton key={btn.id || index} label={btn.label} link={btn.link} slug={slug} settingsKey={`modernSettings.heroButtons.${index}`} style={btn.style} className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all rounded-2xl shadow-xl" />
                          ))}
                       </div>
                    </motion.div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-white overflow-hidden flex items-center justify-center p-12">
                 <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-200 rounded-full blur-[120px]" />
                 </div>
                 <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center z-10">
                     <div className="relative group">
                        <div className="aspect-square bg-slate-100 rounded-[5rem] overflow-hidden shadow-2xl relative rotate-3 group-hover:rotate-0 transition-transform duration-1000">
                           <SmartImage src={topBanners[0]?.imageUrl || modSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="w-full h-full object-cover" alt="Abstract" />
                        </div>
                       <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                          <span className="text-white font-black text-xs uppercase tracking-widest text-center">New<br/>Arrival</span>
                       </div>
                    </div>
                    <div>
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}>
                          <h1 className="text-8xl md:text-[12rem] font-black text-slate-900 leading-none tracking-tighter mb-12 uppercase">
                             <EditableText content={topBanners[0]?.title || modSettings.heroTitle || settings.storeName} slug={slug} settingsKey="modernSettings.heroTitle" />
                          </h1>
                          <p className="text-2xl text-slate-500 font-medium mb-12 italic">"Design is the silent ambassador of your brand."</p>
                          <EditableButton label="DISCOVER" link={`/store/${slug}/products`} slug={slug} settingsKey="modernSettings.heroButton" className="inline-flex items-center gap-4 bg-slate-900 text-white px-16 py-6 rounded-full font-black text-sm hover:bg-blue-600 transition-all shadow-xl" />
                       </motion.div>
                    </div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
               <section key={section.id} className="relative h-screen w-full bg-slate-950 overflow-hidden">
                  <div className="absolute inset-0">
                     <SmartImage src={topBanners[0]?.imageUrl || modSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-[3s]" alt="Immersive" />
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
                  </div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      whileInView={{ opacity: 1, scale: 1 }} 
                      transition={{ duration: 1.5 }}
                    >
                        <h1 className="text-6xl md:text-[15rem] font-black text-white leading-none tracking-[-0.08em] mb-16 uppercase italic">
                           <EditableText content={topBanners[0]?.title || modSettings.heroTitle || settings.storeName} slug={slug} settingsKey="modernSettings.heroTitle" />
                        </h1>
                       <div className="flex flex-col items-center gap-12">
                          <div className="w-24 h-1 bg-blue-600 rounded-full" />
                          <EditableButton label="START EXPERIENCE" link={`/store/${slug}/products`} slug={slug} settingsKey="modernSettings.heroButton" className="px-20 py-8 bg-white text-slate-900 font-black uppercase tracking-[0.5em] text-[10px] rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl" />
                       </div>
                    </motion.div>
                 </div>
              </section>
            );
          }

          // Default: Luxury (The original design)
          return (
            <div key={section.id}>
              {topBanners.length > 0 ? (
                <HeroSlider banners={topBanners} slug={slug} settings={settings.bannerSettings} />
              ) : (
                <section className="relative h-[80vh] w-full flex items-center bg-slate-900 overflow-hidden">
                  <div className="absolute inset-0 opacity-40">
                    <EditableImage 
                      src={topBanners[0]?.imageUrl || modSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} 
                      alt="Hero Background" 
                      slug={slug}
                      settingsKey="modernSettings.heroImage"
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  </div>
                  <div className="container mx-auto px-8 relative z-10">
                    <div className="max-w-3xl text-left">
                      <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full mb-6">
                        <EditableText 
                          content={modSettings.heroBadge || "New Arrival 2026"} 
                          slug={slug} 
                          settingsKey="modernSettings.heroBadge" 
                          className="text-white text-xs font-black uppercase tracking-widest" 
                        />
                      </span>
                      <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
                        <EditableText 
                          content={topBanners[0]?.title || modSettings.heroTitle || "THE FUTURE OF STYLE."} 
                          slug={slug} 
                          settingsKey="modernSettings.heroTitle" 
                          className="text-white text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter" 
                        />
                      </h1>
                      <p className="text-xl text-slate-300 max-w-xl mb-10 leading-relaxed">
                        <EditableText 
                          content={topBanners[0]?.subtitle || modSettings.heroSubtitle || "Elevate your wardrobe with our latest collection of premium essentials. Crafted for those who demand excellence in every detail."} 
                          slug={slug} 
                          settingsKey="modernSettings.heroSubtitle" 
                          className="text-xl text-slate-300 max-w-xl leading-relaxed" 
                        />
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-6">
                        {Array.isArray(modSettings.heroButtons) && modSettings.heroButtons.map((btn: any, index: number) => (
                          <EditableButton 
                            key={btn.id || index}
                            label={btn.label}
                            link={btn.link}
                            slug={slug}
                            settingsKey={`modernSettings.heroButtons.${index}`}
                            style={btn.style}
                            className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl"
                          />
                        ))}

                        {isEditMode && (
                          <button 
                            onClick={async () => {
                              const currentButtons = Array.isArray(modSettings.heroButtons) ? modSettings.heroButtons : [];
                              const newButton = {
                                id: Math.random().toString(36).substr(2, 9),
                                label: "SHOP NOW",
                                link: "#",
                                style: { backgroundColor: "#ffffff", textColor: "#0f172a" }
                              };
                              await updateStoreSettingByKey(slug, "modernSettings.heroButtons", [...currentButtons, newButton]);
                            }}
                            className="w-14 h-14 rounded-2xl border-2 border-dashed border-white/30 flex items-center justify-center text-white hover:bg-white/10"
                          >
                            <Plus size={24} />
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
            <section key={section.id} className="py-24 bg-white">
              <div className="container mx-auto px-8">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                      <EditableText 
                        content={modSettings.categoryTitle || section.config?.title || "Shop by Category"} 
                        slug={slug} 
                        settingsKey="modernSettings.categoryTitle" 
                        initialStyles={modSettings.categoryTitle_styles}
                        className="text-4xl font-black text-slate-900 tracking-tighter uppercase" 
                      />
                    </h2>
                    <p className="text-slate-500 mt-2">
                      <EditableText 
                        content={modSettings.categorySubtitle || "Explore our curated collections for every occasion."} 
                        slug={slug} 
                        settingsKey="modernSettings.categorySubtitle" 
                        initialStyles={modSettings.categorySubtitle_styles}
                        className="text-slate-500 mt-2" 
                      />
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.length > 0 ? categories.map((cat: any) => (
                    <Link href={`/store/${slug}/products?category=${cat.id}`} key={cat.id} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all">
                      <SmartImage 
                        src={`https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80`} 
                        alt={cat.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-8 left-8">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{cat.name}</h3>
                        <span className="text-blue-400 text-sm font-bold flex items-center gap-2 mt-2">
                          EXPLORE <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  )) : (
                     <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                       <p className="text-slate-400 font-medium">No categories added yet.</p>
                     </div>
                  )}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <section key={section.id} className="py-24 bg-slate-50 border-t border-slate-100">
              <div className="container mx-auto px-8">
                <div className="flex justify-between items-center mb-16">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                    <EditableText 
                      content={modSettings.productsTitle || section.config?.title || "Trending Now"} 
                      slug={slug} 
                      settingsKey="modernSettings.productsTitle" 
                      initialStyles={modSettings.productsTitle_styles}
                      className="text-4xl font-black text-slate-900 tracking-tighter uppercase" 
                    />
                  </h2>
                  <Link href={`/store/${slug}/products`} className="text-blue-600 font-black flex items-center gap-2 group">
                    VIEW ALL <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {products.slice(0, 8).map((product) => (
                    <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col">
                      <div className="aspect-[3/4] bg-slate-200 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
                        <SmartImage 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl">
                            <ShoppingBag size={20} />
                          </div>
                        </div>
                      </div>
                      <div className="px-2 text-left">
                        <h3 className="text-xl font-bold text-slate-900 truncate mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-slate-900">${product.price}</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-900" />
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'text_block') {
          return (
            <section key={section.id} className="py-24 bg-white border-y border-slate-100">
              <div className="container mx-auto px-8 max-w-4xl text-center">
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-10 italic">
                  {section.config?.title || "EXCELLENCE IN EVERY DETAIL."}
                </h2>
                <p className="text-xl text-slate-500 leading-relaxed italic">
                  {section.config?.text || "We believe that quality is never an accident. It is always the result of high intention, sincere effort, intelligent direction and skillful execution."}
                </p>
              </div>
            </section>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          return (
            <section key={section.id} className="py-24 px-8 bg-white border-y border-slate-100">
              <div className="container mx-auto space-y-24">
                {bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group">
                    <SmartImage 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                    />
                    <SmartImage 
                      src={banner.mobileImageUrl || banner.imageUrl} 
                      alt={banner.title} 
                      className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 text-white">
                      <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-none mb-6 italic">{banner.title}</h2>
                      <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mb-10">{banner.subtitle}</p>
                      {banner.buttonText && (
                        <Link 
                          href={banner.buttonLink || `/store/${slug}/products`}
                          className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl"
                        >
                          {banner.buttonText}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
                {bannersToShow.length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm px-6">
                      Select "Middle Page" position for your banners in the dashboard to display them here.
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="modern" />;
        }

        if (section.type === 'testimonials') {
          return (
            <section key={section.id} className="py-24 bg-white border-y border-slate-100">
               <div className="container mx-auto px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">
                        <EditableText content={section.config?.title || "Voices of Excellence"} settingsKey={`section-${section.id}-title`} slug={slug} />
                     </h2>
                     <div className="w-24 h-1 bg-blue-600 mx-auto" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                           <div className="flex gap-1 mb-6 text-blue-600">
                              {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                           </div>
                           <p className="text-xl text-slate-600 italic leading-relaxed mb-8">
                              "The quality of the products exceeded my expectations. The attention to detail in the packaging and the speed of delivery made for a truly premium experience."
                           </p>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-slate-200" />
                              <div>
                                 <h4 className="font-black text-slate-900 uppercase tracking-tighter">Alex Johnson</h4>
                                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verified Collector</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
          );
        }

        return null;
      })}

      {/* Bottom Banners Section */}
      {bottomBanners.length > 0 && (
        <section className="py-24 px-8 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto space-y-24">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group">
                <SmartImage 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                />
                <SmartImage 
                  src={banner.mobileImageUrl || banner.imageUrl} 
                  alt={banner.title} 
                  className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 text-white">
                  <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-none mb-6 italic">{banner.title}</h2>
                  <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mb-10">{banner.subtitle}</p>
                  {banner.buttonText && (
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl"
                    >
                      {banner.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
