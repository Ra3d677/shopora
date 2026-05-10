"use client";

import React, { useState } from 'react';
import BannerButton from "@/components/ui/BannerButton";
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, ArrowRight, Eye, Plus, ShoppingCart, Tag } from 'lucide-react';
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import { motion } from "framer-motion";
import SaleSection from "@/components/ui/SaleSection";
import StoreMarquee from "@/components/ui/StoreMarquee";

interface TemplateProps {
  store: any;
  banners: any[];
  settings: any;
  products: any[];
  categories: any[];
  slug: string;
}

export default function HybridDarkCommerceTemplate({ store, banners = [], settings, products, categories, slug }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const hybSettings = settings.hybridSettings || {};
  const accentColor = settings?.colors?.hybrid?.primaryAccent || '#ffffff';

  const discountedProducts = products.filter(p => p.discount_price || p.price < 500).slice(0, 3);
  const featuredProducts = products.slice(0, 8);

  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');

  const homepageLayout = settings.homepageLayout || [
    { id: 'default-hero', type: 'hero' },
    { id: 'default-offers', type: 'text_block', config: { title: "Special Offers" } },
    { id: 'default-products', type: 'featured_products' },
    { id: 'default-categories', type: 'categories' }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-transparent selection:text-black bg-transparent text-white">
      {homepageLayout.map((section: any) => {
        if (section.type === 'hero') {
          const heroStyle = section.style || 'luxury';

          if (topBanners.length > 1) {
            return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
          }

          if (heroStyle === 'split') {
            return (
              <section key={section.id} className="relative h-[80vh] w-full flex flex-col md:flex-row bg-transparent overflow-hidden border-b border-white/5">
                <div className="w-full md:w-1/2 relative h-full">
                  <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Hero" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-12 md:p-24 text-left">
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
                    <span className="text-xs uppercase tracking-[0.5em] text-white/40 mb-8 block font-bold">HYBRID SERIES</span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10 uppercase italic">
                      <EditableText content={topBanners[0]?.title || hybSettings.heroTitle || "FUTURE."} slug={slug} settingsKey="hybridSettings.heroTitle" />
                    </h1>
                    <div className="flex gap-6">
                      <Link href={`/store/${slug}/products`} className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all">
                        EXPLORE NOW
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </section>
            );
          }

          if (heroStyle === 'centered') {
            return (
              <section key={section.id} className="relative h-screen w-full flex flex-col items-center justify-center bg-transparent overflow-hidden text-center px-6">
                <div className="absolute inset-0 opacity-20">
                  <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover" alt="Hero Bg" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="max-w-5xl z-10">
                  <span className="text-xs uppercase tracking-[0.8em] text-white/30 mb-12 block">THE HYBRID ERA</span>
                  <h1 className="text-7xl md:text-[10rem] font-black text-white leading-none tracking-tighter mb-16 uppercase italic">
                    <EditableText content={topBanners[0]?.title || settings.storeName || "HYBRID"} slug={slug} settingsKey="storeName" />
                  </h1>
                  <EditableButton label="VIEW COLLECTION" link={`/store/${slug}/products`} slug={slug} settingsKey="hybridSettings.heroButton" className="px-16 py-6 border border-white text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all" />
                </motion.div>
              </section>
            );
          }

          if (heroStyle === 'minimal') {
            return (
              <section key={section.id} className="relative h-[400px] w-full bg-transparent flex items-center justify-center px-6 border-y border-white/5">
                <div className="text-center max-w-4xl">
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase italic">
                    <EditableText content={topBanners[0]?.title || settings.storeName || "HYBRID"} slug={slug} settingsKey="storeName" />
                  </h1>
                  <Link href={`/store/${slug}/products`} className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px] border-b border-white/40 pb-1 hover:text-white hover:border-white transition-all">
                    START SHOPPING
                  </Link>
                </div>
              </section>
            );
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden flex flex-col md:flex-row border-b border-white/5">
                 <div className="w-full md:w-2/3 relative h-full">
                    <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Campaign" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
                    <div className="absolute bottom-20 left-20">
                       <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}>
                          <div className="text-[10rem] font-black text-white/5 select-none leading-none tracking-tighter uppercase italic">SYSTEM</div>
                       </motion.div>
                    </div>
                 </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                     <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
                        <h1 className="text-6xl md:text-[12rem] font-black text-white leading-none tracking-tighter mb-12 uppercase mix-blend-difference opacity-80">
                           <EditableText content={topBanners[0]?.title || settings.storeName} slug={slug} settingsKey="heroTitle" />
                        </h1>
                       <EditableButton label="INITIALIZE" link={`/store/${slug}/products`} slug={slug} settingsKey="hybridSettings.heroButton" className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-full hover:bg-zinc-200 transition-all text-center" />
                    </motion.div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-white opacity-5 rounded-full blur-[150px] animate-pulse" />
                 </div>
                 <div className="text-center z-10 px-6 max-w-7xl">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}>
                       <div className="relative mb-20 group">
                          <div className="w-full aspect-video rounded-[4rem] overflow-hidden border border-white/10 p-2 bg-white/5">
                             <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-all duration-1000" alt="Abstract" />
                          </div>
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white text-black rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest -rotate-12 border-8 border-black">NEW ERA</div>
                       </div>
                       <h1 className="text-7xl md:text-[14rem] font-black text-white leading-none tracking-tighter mb-16 uppercase italic mix-blend-difference">
                          <EditableText content={topBanners[0]?.title || settings.storeName} slug={slug} settingsKey="heroTitle" />
                       </h1>
                       <EditableButton label="ACCESS" link={`/store/${slug}/products`} slug={slug} settingsKey="hybridSettings.heroButton" className="px-20 py-8 border-2 border-white text-white font-black uppercase tracking-[0.6em] text-[10px] hover:bg-white hover:text-black transition-all" />
                    </motion.div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
               <section key={section.id} className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-transparent">
                  <div className="absolute inset-0">
                     <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover opacity-60 scale-110 grayscale" alt="Immersive" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                  </div>
                 <div className="absolute inset-0 flex flex-col items-center justify-end pb-40 text-center px-6">
                    <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: "easeOut" }}>
                       <span className="text-[10px] font-black uppercase tracking-[1em] text-white/30 mb-12 block">TRANSCEND COMMERCE</span>
                       <h1 className="text-8xl md:text-[20rem] font-black text-white leading-none tracking-[-0.05em] mb-20 uppercase italic">
                          <EditableText content={topBanners[0]?.title || settings.storeName} slug={slug} settingsKey="heroTitle" />
                       </h1>
                       <div className="flex flex-col items-center gap-12">
                          <div className="w-px h-24 bg-white/20" />
                          <EditableButton label="ENTER THE HYBRID" link={`/store/${slug}/products`} slug={slug} settingsKey="hybridSettings.heroButton" className="text-white font-black uppercase tracking-[0.8em] text-[10px] hover:tracking-[1em] transition-all" />
                       </div>
                    </motion.div>
                 </div>
              </section>
            );
          }

          return (
            <div key={section.id}>
              {topBanners.length > 1 ? (
                <HeroSlider banners={topBanners} slug={slug} settings={settings.bannerSettings} />
              ) : (
                <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <SmartImage 
                      src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} 
                      alt="Hero Background Desktop" 
                      className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-40 scale-105" 
                    />
                    <SmartImage 
                      src={topBanners[0]?.mobileImageUrl || topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} 
                      alt="Hero Background Mobile" 
                      className="md:hidden absolute inset-0 w-full h-full object-cover opacity-40 scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/20 via-transparent to-[#0f0f0f]"></div>
                  </div>

                  <div className="relative z-10 text-center px-6 max-w-4xl">
                    <div className="text-xs uppercase tracking-[0.5em] text-white/60 mb-6 block font-bold text-center">
                      <EditableText 
                        content={hybSettings.heroBadge || "New Collection 2026"} 
                        slug={slug} 
                        settingsKey="hybridSettings.heroBadge" 
                        className="text-white/60 text-xs uppercase tracking-[0.5em] font-bold" 
                      />
                    </div>
                    <div className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10 uppercase italic text-center">
                      <EditableText 
                        content={topBanners[0]?.title || "Future Commerce."} 
                        slug={slug} 
                        settingsKey="hybridSettings.heroTitle" 
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic" 
                      />
                    </div>
                    <div className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium text-center">
                      <EditableText 
                        content={topBanners[0]?.subtitle || "The ultimate destination for premium products."} 
                        slug={slug} 
                        settingsKey="hybridSettings.heroSubtitle" 
                        className="text-lg md:text-xl text-white/50 max-w-2xl" 
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                       <EditableButton 
                         label="Shop Now"
                         link={`/store/${slug}/products`} 
                         slug={slug}
                         settingsKey="hybridSettings.heroButton"
                         className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:bg-white/90"
                       />
                    </div>
                  </div>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <div className="w-[1px] h-12 bg-white mx-auto"></div>
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

        if (section.type === 'text_block' || section.type === 'offers') {
          return (
            <section key={section.id} className="py-24 px-6 md:px-12 bg-[#151515] text-left">
              <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 bg-gradient-to-r from-white/5 to-transparent p-8 md:p-16 rounded-[2rem] border border-white/5">
                  <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-white/80">
                      <Tag size={14} className="text-white" /> Limited Time Only
                    </div>
                    <div className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                       <EditableText 
                         content={section.config?.title || "Special Offers"} 
                         slug={slug} 
                         settingsKey={`section-${section.id}-title`}
                         className="text-4xl md:text-6xl font-black uppercase tracking-tighter" 
                       />
                    </div>
                    <div className="text-3xl md:text-4xl font-light italic text-white/50">
                       <EditableText 
                         content={section.config?.text || "Up to 50% OFF on selected items"} 
                         slug={slug} 
                         settingsKey={`section-${section.id}-subtitle`}
                         className="text-3xl md:text-4xl font-light italic text-white/50" 
                       />
                    </div>
                    <Link href={`/store/${slug}/products?sale=true`} className="inline-block border-b-2 border-white pb-2 font-bold uppercase tracking-widest text-sm hover:text-white/60 transition-colors">
                      View All Deals
                    </Link>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    {products.filter(p => p.discount_price).slice(0, 4).map((product) => (
                      <div key={product.id} className="relative aspect-square bg-[#0f0f0f] rounded-2xl overflow-hidden group">
                         <SmartImage 
                           src={product.images[0]} 
                           alt={product.name} 
                           className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" 
                         />
                         <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Sale</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <section key={section.id} className="py-32 px-6 md:px-12 bg-transparent text-left">
              <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                  <div>
                    <div className="text-5xl font-black uppercase tracking-tighter mb-4">
                       <EditableText 
                         content={section.config?.title || "The Collection"} 
                         slug={slug} 
                         settingsKey={`section-${section.id}-title`}
                         className="text-5xl font-black uppercase tracking-tighter" 
                       />
                    </div>
                    <div className="w-20 h-1.5 bg-white"></div>
                  </div>
                  <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold">Scroll to Explore ({products.length} Items)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                  {products.slice(0, 12).map((product) => (
                    <div key={product.id} className="group flex flex-col">
                      <div className="relative aspect-[3/4] bg-[#1a1a1a] rounded-[2rem] overflow-hidden mb-6 group">
                        <SmartImage 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-500 translate-y-10 group-hover:translate-y-0">
                           <button className="w-48 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                             <Plus size={16} /> Add to Cart
                           </button>
                           <Link 
                             href={`/store/${slug}/product/${product.id}`}
                             className="w-48 py-4 border border-white/20 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                           >
                             <Eye size={16} /> View Product
                           </Link>
                        </div>
                      </div>
                      <div className="px-2">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-lg font-bold uppercase tracking-tight max-w-[70%] leading-tight group-hover:text-white/60 transition-colors">
                            {product.name}
                           </h3>
                           <span className="text-lg font-medium text-white/50">${product.price}</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">{product.category_id || 'Premium'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          return (
            <section key={section.id} className="py-1  md: bg-transparent text-left">
              <div className="max-w-screen-2xl mx-auto space-y-1">
                {bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-[4/5] md:aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden group">
                      <SmartImage 
                        src={banner.imageUrl} 
                        alt={banner.title} 
                        className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                      />
                      <SmartImage 
                        src={banner.mobileImageUrl || banner.imageUrl} 
                        alt={banner.title} 
                        className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                      />
                    </div>
                    <div className="space-y-6 md:space-y-8">
                      <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">{banner.title}</h2>
                      <p className="text-lg md:text-xl text-white/40 font-medium leading-relaxed">{banner.subtitle}</p>
                      <BannerButton banner={banner} slug={slug} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'categories') {
          return (
            <section key={section.id} className="py-32 px-6 md:px-12 border-t border-white/5 bg-transparent text-left">
              <div className="max-w-screen-2xl mx-auto">
                  <div className="text-3xl font-black tracking-tighter uppercase italic mb-8">
                    <EditableText 
                      content={section.config?.title || "Shop By Department"} 
                      slug={slug} 
                      settingsKey={`section-${section.id}-title`}
                      className="text-3xl font-black tracking-tighter uppercase italic" 
                    />
                  </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.slice(0, 4).map((cat) => (
                    <Link 
                      href={`/store/${slug}/products?category=${cat.id}`} 
                      key={cat.id}
                      className="group relative h-80 rounded-[2rem] overflow-hidden"
                    >
                      <SmartImage 
                        src={cat.image || 'https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=800&q=80'} 
                        alt={cat.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute bottom-8 left-8">
                         <h3 className="text-2xl font-black uppercase tracking-tighter translate-y-4 group-hover:translate-y-0 transition-transform">{cat.name}</h3>
                         <div className="w-0 group-hover:w-full h-1 bg-white mt-2 transition-all duration-500"></div>
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
            <section key={section.id} className="py-1  md: bg-transparent border-y border-white/5">
              <div className="max-w-screen-2xl mx-auto space-y-1">
                {bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-[4/5] md:aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden group border border-white/5">
                      <SmartImage 
                        src={banner.imageUrl} 
                        alt={banner.title} 
                        className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale hover:grayscale-0" 
                      />
                      <SmartImage 
                        src={banner.mobileImageUrl || banner.imageUrl} 
                        alt={banner.title} 
                        className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale hover:grayscale-0" 
                      />
                    </div>
                    <div className="space-y-6 md:space-y-8">
                      <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">{banner.title}</h2>
                      <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-xl">{banner.subtitle}</p>
                      <BannerButton banner={banner} slug={slug} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="hybrid" />;
        }

        if (section.type === 'testimonials') {
          return (
            <section key={section.id} className="py-32 px-6 md:px-12 border-t border-white/5 bg-transparent">
               <div className="max-w-screen-2xl mx-auto">
                  <div className="text-center mb-24">
                     <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic mb-6">
                        <EditableText content={section.config?.title || "HYBRID FEEDBACK"} settingsKey={`section-${section.id}-title`} slug={slug} />
                     </h2>
                     <div className="text-white/30 tracking-[0.5em] text-xs font-bold uppercase">COMMUNITY INTEL</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="p-12 rounded-[3rem] bg-white/5 border border-white/5 backdrop-blur-3xl group relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8">
                              <div className="text-6xl font-black text-white/5 select-none tracking-tighter italic">0{i}</div>
                           </div>
                           <div className="flex gap-1 mb-8 text-white">
                              {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                           </div>
                           <p className="text-xl text-white/70 italic leading-relaxed mb-12">
                              "The integration of futuristic design with high-performance utility is unparalleled. HYBRID has set a new standard for modern commerce."
                           </p>
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10" />
                              <div>
                                 <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">MARCUS REED</h4>
                                 <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">SYSTEM ARCHITECT</p>
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
        <section className="py-1  md: bg-transparent border-t border-white/5">
          <div className="max-w-screen-2xl mx-auto space-y-1">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[4/5] md:aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden group border border-white/5">
                  <SmartImage 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale hover:grayscale-0" 
                  />
                  <SmartImage 
                    src={banner.mobileImageUrl || banner.imageUrl} 
                    alt={banner.title} 
                    className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale hover:grayscale-0" 
                  />
                </div>
                <div className="space-y-6 md:space-y-8">
                  <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">{banner.title}</h2>
                  <p className="text-lg md:text-xl text-white/40 font-medium leading-relaxed">{banner.subtitle}</p>
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
