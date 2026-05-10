"use client";

import React, { useState, useEffect } from 'react';
import BannerButton from "@/components/ui/BannerButton";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Search, Heart, Star
} from 'lucide-react';
import EditableText from "@/components/editor/EditableText";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import SaleSection from "@/components/ui/SaleSection";
import VideoSection from "@/components/ui/VideoSection";
import SectionDivider from "@/components/ui/SectionDivider";

import EditableImage from "@/components/editor/EditableImage";

interface TemplateProps {
  store: any;
  banners: any[];
  settings: any;
  products: any[];
  categories: any[];
  slug: string;
}

export default function SennoTemplate({ store, banners = [], settings, products, categories, slug }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const senSettings = settings.sennoSettings || {};
  const pink = "#f06292"; // Precise Tiano Pink

  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');

  const homepageLayout = settings.homepageLayout || [
    { id: 'default-hero', type: 'hero', style: 'luxury' },
    { id: 'default-products', type: 'featured_products', style: 'grid' },
    { id: 'default-hotspots', type: 'hotspots', style: 'default' }
  ];

  return (
    <div className="min-h-screen bg-transparent font-sans text-slate-800 selection:bg-[#f06292] selection:text-white">
      {homepageLayout.map((section: any, index: number) => {
        const divider = index > 0 && settings.dividerStyle && settings.dividerStyle !== 'none' ? (
          <SectionDivider 
            style={settings.dividerStyle} 
            color={settings.dividerColor || settings.colorSystem?.brand?.primary || '#f06292'} 
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
              <section key={section.id} className="relative h-[600px] md:h-[800px] bg-transparent overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 relative h-full">
                   <EditableImage src={senSettings.heroImage || "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=1600&q=80"} slug={slug} settingsKey="sennoSettings.heroImage" className="w-full h-full object-cover" alt="Hero" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-12 md:p-24 bg-[#fcf2f4]">
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
                    <span className="text-sm font-bold text-[#f06292] mb-4 block uppercase tracking-widest">
                      <EditableText content={senSettings.heroBadge || "NEW COLLECTION"} slug={slug} settingsKey="sennoSettings.heroBadge" />
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-800 leading-tight mb-8">
                      <EditableText content={topBanners[0]?.title || senSettings.heroTitle || "Organic care."} slug={slug} settingsKey="sennoSettings.heroTitle" />
                    </h1>
                    <div className="flex gap-4">
                      <EditableButton label="DISCOVER" link={`/store/${slug}/products`} slug={slug} settingsKey="sennoSettings.heroButton" className="px-10 py-4 bg-[#f06292] text-white font-black uppercase tracking-widest text-[10px] rounded shadow-lg" />
                    </div>
                  </motion.div>
                </div>
              </section>
            );
          }

          if (heroStyle === 'centered') {
            return (
              <section key={section.id} className="relative h-[600px] md:h-[800px] bg-[#fcf2f4] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-20 left-20 w-64 h-64 bg-[#f06292] rounded-full blur-3xl" />
                  <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#f06292] rounded-full blur-3xl" />
                </div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-4xl z-10">
                  <span className="text-sm font-bold text-[#f06292] mb-6 block uppercase tracking-[0.4em]">
                    <EditableText content={senSettings.heroBadge || "LUXURY ORGANIC CARE"} slug={slug} settingsKey="sennoSettings.heroBadge" />
                  </span>
                  <h1 className="text-6xl md:text-[8rem] font-black text-slate-800 leading-none mb-12 tracking-tighter">
                    <EditableText content={topBanners[0]?.title || senSettings.heroTitle || settings.storeName} slug={slug} settingsKey="sennoSettings.heroTitle" />
                  </h1>
                  <EditableButton label="SHOP COLLECTION" link={`/store/${slug}/products`} slug={slug} settingsKey="sennoSettings.heroButton" className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#f06292] transition-all shadow-xl" />
                </motion.div>
              </section>
            );
          }

          if (heroStyle === 'minimal') {
            return (
              <section key={section.id} className="relative h-[400px] md:h-[500px] bg-transparent flex items-center justify-center px-6 border-b border-[#fcf2f4]">
                <div className="text-center max-w-2xl">
                  <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 uppercase">
                    <EditableText content={topBanners[0]?.title || senSettings.heroTitle || settings.storeName} slug={slug} settingsKey="sennoSettings.heroTitle" />
                  </h1>
                  <p className="text-lg text-slate-400 mb-10 font-medium">
                    <EditableText content={topBanners[0]?.subtitle || senSettings.heroSubtitle || "Pure ingredients. Real results."} slug={slug} settingsKey="sennoSettings.heroSubtitle" />
                  </p>
                  <Link href={`/store/${slug}/products`} className="text-[#f06292] font-black uppercase tracking-[0.3em] text-[10px] border-b-2 border-[#f06292] pb-1 hover:text-slate-900 hover:border-slate-900 transition-all">
                    START SHOPPING
                  </Link>
                </div>
              </section>
            );
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-[#fcf2f4] overflow-hidden flex items-center">
                 <div className="container mx-auto px-6 md:px-24 flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10">
                    <div className="w-full md:w-1/2">
                       <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                          <div className="inline-block px-4 py-1 rounded-full bg-[#f06292] text-white text-[10px] font-black uppercase tracking-widest mb-8">EXCLUSIVE DROP</div>
                          <h1 className="text-7xl md:text-[9rem] font-black text-slate-900 leading-none tracking-tighter mb-10">
                             <EditableText content={topBanners[0]?.title || senSettings.heroTitle || "FLORAL"} slug={slug} settingsKey="sennoSettings.heroTitle" />
                          </h1>
                          <p className="text-slate-500 text-xl mb-12 max-w-sm">Discover the power of nature with our new seasonal collection.</p>
                          <EditableButton label="VIEW COLLECTION" link={`/store/${slug}/products`} slug={slug} settingsKey="sennoSettings.heroButton" className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded shadow-2xl hover:bg-[#f06292] transition-all" />
                       </motion.div>
                    </div>
                    <div className="w-full md:w-1/2 relative">
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }} 
                         whileInView={{ opacity: 1, scale: 1 }} 
                         className="aspect-square w-full max-w-md mx-auto relative"
                       >
                          <div className="absolute inset-0 bg-[#f06292] rounded-[4rem] rotate-6 opacity-10" />
                          <div className="relative h-full w-full rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl">
                             <SmartImage src={topBanners[0]?.imageUrl || senSettings.heroImage || "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=1600&q=80"} className="w-full h-full object-cover" alt="Campaign" />
                          </div>
                       </motion.div>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-1/3 h-full bg-white hidden lg:block" />
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden flex items-center justify-center">
                 <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#f06292] rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-200 rounded-full blur-[150px]" />
                 </div>
                 <div className="text-center z-10 max-w-6xl px-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
                       <span className="text-[#f06292] text-xs font-black uppercase tracking-[1em] mb-12 block">SENNO ORGANICS</span>
                       <div className="relative mb-20">
                          <h1 className="text-[6rem] md:text-[18rem] font-black text-slate-900 leading-none tracking-tighter uppercase italic select-none">
                             <EditableText content={topBanners[0]?.title || senSettings.heroTitle || "GLOW"} slug={slug} settingsKey="sennoSettings.heroTitle" />
                          </h1>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-96 aspect-square rounded-full overflow-hidden border-[20px] border-white shadow-2xl scale-125 md:scale-150 rotate-12">
                             <SmartImage src={topBanners[0]?.imageUrl || senSettings.heroImage || "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=1200&q=80"} className="w-full h-full object-cover" alt="Abstract Center" />
                          </div>
                       </div>
                       <EditableButton label="SHOP NOW" link={`/store/${slug}/products`} slug={slug} settingsKey="sennoSettings.heroButton" className="px-16 py-6 bg-[#f06292] text-white font-black uppercase tracking-[0.5em] text-[10px] rounded-full shadow-xl hover:scale-105 transition-transform" />
                    </motion.div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-slate-900 overflow-hidden">
                 <div className="relative h-full w-full">
                    <SmartImage src={topBanners[0]?.imageUrl || senSettings.heroImage || "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=1600&q=80"} className="w-full h-full object-cover" alt="Hero Image" />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
                       <h1 className="text-6xl md:text-[12rem] font-black text-slate-900 leading-none tracking-tighter mb-12 uppercase mix-blend-multiply opacity-80">
                          <EditableText content={topBanners[0]?.title || senSettings.heroTitle || settings.storeName} slug={slug} settingsKey="sennoSettings.heroTitle" />
                       </h1>
                       <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                          <EditableButton label="EXPERIENCE" link={`/store/${slug}/products`} slug={slug} settingsKey="sennoSettings.heroButton" className="px-16 py-8 bg-white text-slate-900 font-black uppercase tracking-[0.4em] text-[10px] rounded-full shadow-2xl hover:bg-[#f06292] hover:text-white transition-all" />
                          <div className="flex items-center gap-4 text-white/60">
                             <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><Star className="w-4 h-4" /></div>
                             <span className="text-[10px] font-black uppercase tracking-widest">Award Winning Care</span>
                          </div>
                       </div>
                    </motion.div>
                 </div>
              </section>
            );
          }

          // Default: Luxury (Original Design)
          return (
            <section key={section.id} className="relative h-[600px] md:h-[800px] bg-[#fcf2f4] overflow-hidden">
               {/* Background Elements */}
               <div className="absolute top-20 left-20 w-32 h-32 bg-[#fde9ed] rounded-full blur-3xl opacity-60" />
               <div className="absolute bottom-40 right-20 w-64 h-64 bg-[#f06292]/10 rounded-full blur-3xl opacity-40" />
               
               <div className="container mx-auto h-full px-6 md:px-12 relative z-10 flex items-center">
                  <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0 md:z-auto">
                     <EditableImage 
                       src={senSettings.heroImage || "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=1600&q=80"} 
                       slug={slug}
                       settingsKey="sennoSettings.heroImage"
                       className="w-full h-full object-cover object-center" 
                       alt="Hero"
                     />
                     <div className="absolute bottom-20 left-10 md:left-20 w-24 h-24 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center animate-spin-slow">
                        <span className="text-[8px] font-black text-center uppercase tracking-widest text-slate-400">Natural Organic Best Store</span>
                     </div>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col items-start md:pl-16 lg:pl-32 z-10 text-left bg-white/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-8 md:p-0 rounded-3xl md:rounded-none m-4 md:m-0">
                     <motion.div
                       initial={{ opacity: 0, x: 50 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8 }}
                     >
                       <span className="text-sm md:text-base font-bold text-[#f06292] mb-4 block">
                         <EditableText 
                           content={senSettings.heroBadge || "New cosmetic collection 2024"} 
                           slug={slug} 
                           settingsKey="sennoSettings.heroBadge" 
                         />
                       </span>
                       <h1 className="text-5xl md:text-8xl font-black text-slate-800 leading-[1] mb-8 tracking-tight">
                         <EditableText 
                           content={senSettings.heroTitle || "Organic care the best skin"} 
                           slug={slug} 
                           settingsKey="sennoSettings.heroTitle" 
                         />
                       </h1>
                       <div className="text-lg md:text-xl text-slate-600 mb-10 flex flex-wrap items-center gap-3">
                         <EditableText 
                           content={senSettings.heroHelplineLabel || "Helpline number : "} 
                           slug={slug} 
                           settingsKey="sennoSettings.heroHelplineLabel" 
                         />
                         <span className="font-bold border-b-2 border-slate-300">
                           <EditableText 
                             content={senSettings.heroHelplineNumber || "(+06) 059 030 095"} 
                             slug={slug} 
                             settingsKey="sennoSettings.heroHelplineNumber" 
                           />
                         </span>
                       </div>
                       <div className="flex gap-4">
                         <EditableButton 
                           label="SHOP COLLECTION" 
                           link={`/store/${slug}/products`} 
                           slug={slug}
                           settingsKey="sennoSettings.heroButton"
                           className="px-12 py-5 bg-[#f06292] text-white font-black uppercase tracking-widest text-xs hover:bg-[#1c1c1b] transition-all rounded shadow-lg"
                         />
                       </div>
                     </motion.div>
                  </div>
               </div>
            </section>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <section key={section.id} className="py-24 px-6 md:px-12 bg-transparent">
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <div>
                     <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
                       <EditableText 
                         content={senSettings.productsTitle || section.config?.title || "Our Best Picks"} 
                         slug={slug} 
                         settingsKey="sennoSettings.productsTitle" 
                       />
                     </h2>
                     <p className="text-slate-500 font-medium italic">
                       <EditableText 
                         content={senSettings.productsSubtitle || "Premium beauty care for your daily routine."} 
                         slug={slug} 
                         settingsKey="sennoSettings.productsSubtitle" 
                       />
                     </p>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                     {['All', 'New Arrivals', 'Best Sellers', 'Skin Care'].map(tab => (
                       <button key={tab} className="flex-shrink-0 px-6 py-2.5 rounded-full border border-slate-200 text-xs font-black uppercase tracking-widest hover:border-[#f06292] hover:text-[#f06292] transition-all">
                          {tab}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.slice(0, 8).map((product: any) => (
                    <ProductCard key={product.id} product={product} slug={slug} />
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'hotspots' || section.type === 'testimonials') {
          return (
            <section key={section.id} className="py-20 px-6 bg-[#fcf2f4]">
              <div className="container mx-auto flex flex-col lg:flex-row items-center gap-20">
                 <div className="w-full lg:w-1/2 relative group rounded-[3rem] overflow-hidden shadow-2xl min-h-[400px]">
                    <EditableImage 
                       src={senSettings.hotspotImage || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&q=80"} 
                       slug={slug}
                       settingsKey="sennoSettings.hotspotImage"
                       className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" 
                       alt="Hotspots" 
                    />
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform group/dot">
                          <div className="w-3 h-3 bg-[#f06292] rounded-full animate-ping" />
                          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-2xl w-40 opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                             <p className="text-[10px] font-black uppercase mb-1">
                               <EditableText content={senSettings.hotspotLabel || "Night Recovery Serum"} slug={slug} settingsKey="sennoSettings.hotspotLabel" />
                             </p>
                             <p className="text-[#f06292] font-black text-xs">
                               <EditableText content={senSettings.hotspotPrice || "$39.00"} slug={slug} settingsKey="sennoSettings.hotspotPrice" />
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="w-full lg:w-1/2">
                    <h2 className="text-5xl md:text-7xl font-black text-slate-800 leading-tight mb-8">
                       <EditableText content={senSettings.featureTitle || section.config?.title || "Crafted for your glowing skin."} slug={slug} settingsKey="sennoSettings.featureTitle" />
                    </h2>
                    <p className="text-slate-500 text-lg mb-12 leading-relaxed">
                       <EditableText content={senSettings.featureDesc || "Our products are made from organic ingredients, carefully selected to provide the best care for your skin without any harsh chemicals."} slug={slug} settingsKey="sennoSettings.featureDesc" />
                    </p>
                    <div className="grid grid-cols-2 gap-8 mb-12">
                       <div className="border-l-4 border-[#f06292] pl-6">
                          <h4 className="text-2xl font-black">
                             <EditableText content={senSettings.stat1Val || "99%"} slug={slug} settingsKey="sennoSettings.stat1Val" />
                          </h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                             <EditableText content={senSettings.stat1Label || "Natural Extraction"} slug={slug} settingsKey="sennoSettings.stat1Label" />
                          </p>
                       </div>
                       <div className="border-l-4 border-slate-900 pl-6">
                          <h4 className="text-2xl font-black">
                             <EditableText content={senSettings.stat2Val || "100%"} slug={slug} settingsKey="sennoSettings.stat2Val" />
                          </h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                             <EditableText content={senSettings.stat2Label || "Vegan Formula"} slug={slug} settingsKey="sennoSettings.stat2Label" />
                          </p>
                       </div>
                    </div>
                    <button className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#f06292] transition-all rounded shadow-xl">DISCOVER MORE</button>
                 </div>
              </div>
            </section>
          );
        }

        if (section.type === 'categories') {
          return (
            <section key={section.id} className="py-20 px-6 bg-transparent">
              <div className="container mx-auto">
                 <h2 className="text-3xl font-black mb-12 uppercase tracking-tighter">
                   {section.config?.title || "Shop by Category"}
                 </h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {categories.map((cat: any) => (
                      <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="flex flex-col items-center gap-4 group">
                         <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-[#f06292] transition-all duration-500">
                            <SmartImage src={cat.image || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#f06292] transition-colors">{cat.name}</span>
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
            <div key={section.id}>
              <section className="py-1 bg-transparent">
                <div className="w-full ">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bannersToShow.length > 0 ? bannersToShow.slice(0, 2).map((banner: any) => (
                      <div key={banner.id} className="relative aspect-[4/5]  overflow-hidden group">
                         <SmartImage src={banner.imageUrl} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt={banner.title} />
                         <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 text-white">
                            <h3 className="text-2xl font-black mb-2">{banner.title}</h3>
                            <Link href={banner.buttonLink || "#"} className="text-xs font-black uppercase tracking-widest border-b-2 border-white w-fit pb-1 hover:text-[#f06292] hover:border-[#f06292] transition-all">
                               {banner.buttonText || "Shop Now"}
                            </Link>
                         </div>
                      </div>
                    )) : (
                      <div className="col-span-2 text-center py-12 text-slate-400 font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-3xl">
                         Add banners in the admin dashboard.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="senno" />;
        }

        if (section.type === 'text_block') {
          return (
            <section key={section.id} className="py-20 px-6 bg-transparent border-y border-slate-50">
               <div className="container mx-auto max-w-4xl text-center">
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                    {section.config?.title || "Luxury Beauty Experience"}
                  </h2>
                  <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
                    {section.config?.text || "Discover a new era of cosmetic excellence where nature meets science. Our premium formulas are designed to enhance your natural beauty while protecting your skin."}
                  </p>
               </div>
            </section>
          );
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
        <section className="py-1  bg-[#fff5f8] border-t border-[#f8e1e7]">
          <div className="w-full space-y-1">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9]  overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-700">
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
                <div className="absolute inset-0 bg-[#f06292]/10 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-16 text-white">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="backdrop-blur-md bg-black/20 p-12 rounded-[3rem] border border-white/20"
                  >
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 uppercase">{banner.title}</h2>
                    <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mb-10 tracking-tight">{banner.subtitle}</p>
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

function ProductCard({ product, slug }: any) {
  return (
    <div className="group flex flex-col">
       <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f5f5f5] mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700">
          <SmartImage src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
          
          <div className="absolute top-4 left-4 bg-white text-slate-900 text-[9px] font-black px-3 py-1 rounded shadow-md">NEW</div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-6 group-hover:translate-y-0 duration-500">
             <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#f06292] hover:text-white transition-all"><Search size={18} /></button>
             <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#f06292] hover:text-white transition-all"><ShoppingBag size={18} /></button>
             <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#f06292] hover:text-white transition-all"><Heart size={18} /></button>
          </div>
       </div>

       <div className="text-center">
          <Link href={`/store/${slug}/product/${product.id}`}>
            <h3 className="text-sm font-black uppercase tracking-tight mb-2 hover:text-[#f06292] transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center justify-center gap-1 mb-2">
             {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-[#f06292] text-[#f06292]" />)}
          </div>
          <p className="text-[#f06292] font-black text-lg">${product.price}</p>
       </div>
    </div>
  );
}
