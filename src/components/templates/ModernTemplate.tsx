"use client";
import React from 'react';

import Link from "next/link";
import BannerButton from "@/components/ui/BannerButton";
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
import VideoSection from "@/components/ui/VideoSection";
import SectionDivider from "@/components/ui/SectionDivider";
import { motion, AnimatePresence } from "framer-motion";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function ModernTemplate({ banners, settings, products, slug, categories = [] }: TemplateProps) {
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
    <div className="flex flex-col w-full font-sans bg-transparent">
      {homepageLayout.map((section: any, index: number) => {
        const divider = index > 0 && settings.dividerStyle && settings.dividerStyle !== 'none' ? (
          <SectionDivider 
            style={settings.dividerStyle} 
            color={settings.dividerColor || settings.colorSystem?.brand?.primary || '#3b82f6'} 
          />
        ) : null;

        const renderSection = () => {
          if (section.type === 'hero') {
            const heroStyle = section.style || 'luxury';

            if (topBanners.length > 1) {
              return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
            }
            
            if (heroStyle === 'split') {
              return (
                <section key={section.id} className="relative h-[80vh] w-full flex flex-col md:flex-row bg-transparent overflow-hidden">
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
                <section key={section.id} className="relative h-[60vh] w-full bg-transparent flex items-center justify-center px-6">
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
                          {Array.isArray(modSettings.heroButtons) && modSettings.heroButtons.map((btn: any, btnIndex: number) => (
                            <EditableButton key={btn.id || btnIndex} label={btn.label} link={btn.link} slug={slug} settingsKey={`modernSettings.heroButtons.${btnIndex}`} style={btn.style} className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all rounded-2xl shadow-xl" />
                          ))}
                       </div>
                    </motion.div>
                  </div>
                </section>
              );
            }

            // Default: Luxury (The original design)
            return (
              <section key={section.id} className="relative h-[80vh] w-full flex items-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                  <SmartImage 
                    src={topBanners[0]?.imageUrl || modSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} 
                    alt="Hero Background" 
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
                      />
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
                      <EditableText 
                        content={topBanners[0]?.title || modSettings.heroTitle || "THE FUTURE OF STYLE."} 
                        slug={slug} 
                        settingsKey="modernSettings.heroTitle" 
                      />
                    </h1>
                    <p className="text-xl text-slate-300 max-w-xl mb-10 leading-relaxed">
                      <EditableText 
                        content={topBanners[0]?.subtitle || modSettings.heroSubtitle || "Elevate your wardrobe with our latest collection of premium essentials."} 
                        slug={slug} 
                        settingsKey="modernSettings.heroSubtitle" 
                      />
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      {Array.isArray(modSettings.heroButtons) && modSettings.heroButtons.map((btn: any, btnIndex: number) => (
                        <EditableButton 
                          key={btn.id || btnIndex}
                          label={btn.label}
                          link={btn.link}
                          slug={slug}
                          settingsKey={`modernSettings.heroButtons.${btnIndex}`}
                          style={btn.style}
                          className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          if (section.type === 'marquee') {
            return <StoreMarquee key={section.id} settings={settings.marqueeSettings} />;
          }

          if (section.type === 'categories') {
            return (
              <section key={section.id} className="py-24 bg-transparent px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {categories.map((cat, i) => (
                      <Link key={cat.id} href={`/store/${slug}/category/${cat.id}`} className="group relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-100">
                         <SmartImage src={cat.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
                         <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-black text-lg md:text-xl uppercase tracking-widest">{cat.name}</span>
                         </div>
                      </Link>
                   ))}
                </div>
              </section>
            );
          }

          if (section.type === 'featured_products') {
            return (
              <section key={section.id} className="py-32 bg-transparent">
                <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                     <div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6 uppercase italic">
                           <EditableText content={modSettings.productsTitle || "THE DROP"} slug={slug} settingsKey="modernSettings.productsTitle" />
                        </h2>
                        <div className="flex items-center gap-4">
                           <span className="w-12 h-1 bg-blue-600 rounded-full" />
                           <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">LATEST ARRIVALS</p>
                        </div>
                     </div>
                     <Link href={`/store/${slug}/products`} className="group flex items-center gap-6 text-slate-900 font-black uppercase tracking-widest text-xs hover:text-blue-600 transition-colors">
                        VIEW ALL PRODUCTS <div className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Plus size={16} /></div>
                     </Link>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
                    {featuredProducts.map((product: any) => (
                      <motion.div 
                        key={product.id} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group"
                      >
                        <Link href={`/store/${slug}/product/${product.id}`}>
                          <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-slate-50 mb-8">
                             <SmartImage 
                               src={product.images?.[0] || product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"} 
                               alt={product.name} 
                               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                             />
                             <div className="absolute top-6 left-6">
                                <span className="px-5 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">In Stock</span>
                             </div>
                             <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-blue-600 hover:text-white">
                                   <ShoppingBag size={20} />
                                </button>
                             </div>
                          </div>
                          <div className="px-2">
                             <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
                             <p className="text-slate-400 font-bold text-xs mb-3">{product.category?.name || "Premium Category"}</p>
                             <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-slate-900">${product.price}</span>
                                <div className="flex gap-1">
                                   {[...Array(5)].map((_, i) => (
                                     <div key={i} className="w-1 h-1 bg-slate-200 rounded-full" />
                                   ))}
                                </div>
                             </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (section.type === 'sale') {
            return <SaleSection key={section.id} products={products} slug={slug} settings={settings} />;
          }

          if (section.type === 'video') {
            return <VideoSection key={section.id} section={section} slug={slug} />;
          }

          return null;
        };

        return (
          <React.Fragment key={section.id}>
            {divider}
            {renderSection()}
          </React.Fragment>
        );
      })}

      {/* Bottom Banners Section */}
      {bottomBanners.length > 0 && (
        <section className="py-1  bg-slate-50 border-t border-slate-100">
          <div className="w-full space-y-1">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9]  md: overflow-hidden shadow-2xl group">
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
                  <BannerButton banner={banner} slug={slug} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
