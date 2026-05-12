"use client";

import React, { useState, useEffect } from 'react';
import BannerButton from "@/components/ui/BannerButton";
import VideoSection from "@/components/ui/VideoSection";
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Menu, X, ChevronRight, Play } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import { motion, AnimatePresence } from 'framer-motion';
import EditableText from '@/components/editor/EditableText';
import EditableButton from '@/components/editor/EditableButton';
import StoreMarquee from '@/components/ui/StoreMarquee';
import HeroSlider from '@/components/ui/HeroSlider';
import SaleSection from '@/components/ui/SaleSection';
import SectionDivider from '@/components/ui/SectionDivider';

export default function ZenithTemplate({ 
  banners, 
  settings, 
  products, 
  slug,
  categories = [] 
}: any) {
  const [activeBanner, setActiveBanner] = useState(0);

  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');

  const featuredProducts = products.slice(0, 4);
  const currentBanner = topBanners[activeBanner] || {
    title: "Zenith Collections",
    subtitle: "The pinnacle of minimalist luxury.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    buttonText: "Discover More"
  };

  const homepageLayout = settings.homepageLayout || [
    { id: 'default-hero', type: 'hero' },
    { id: 'default-marquee', type: 'marquee' },
    { id: 'default-intro', type: 'text_block' },
    { id: 'default-categories', type: 'categories' },
    { id: 'default-products', type: 'featured_products' }
  ];

  return (
    <div className="min-h-screen font-serif selection:bg-[#c5a368] selection:text-white bg-transparent text-[#1a1a1a]">
      {homepageLayout.map((section: any, index: number) => {
        const divider = section.showDivider !== false && (
          <SectionDivider 
            style={settings.dividerStyle || 'line'} 
            color={settings.dividerColor || settings.colorSystem?.brand?.primary || '#c5a368'} 
          />
        );

        const renderSection = () => {
          if (section.type === 'hero') {
          const heroStyle = section.style || 'luxury';

            if (heroStyle === 'slider') {
            return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
          }

          if (heroStyle === 'split') {
            return (
              <section key={section.id} className="relative h-screen w-full flex flex-col md:flex-row bg-transparent overflow-hidden -mt-24">
                <div className="w-full md:w-1/2 flex flex-col items-start justify-center p-12 md:p-24 text-left bg-zinc-50">
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a368] mb-8 block font-black">THE ZENITH COLLECTION</span>
                    <h1 className="text-6xl md:text-[8rem] font-light text-zinc-900 leading-[0.85] tracking-tighter mb-12 italic uppercase">
                      <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="storeName" />
                    </h1>
                    <Link href={`/store/${slug}/products`} className="inline-block px-12 py-5 bg-[#c5a368] text-white text-[10px] font-black uppercase tracking-[0.4em] rounded shadow-xl">
                      VIEW SERIES
                    </Link>
                  </motion.div>
                </div>
                <div className="w-full md:w-1/2 relative h-full">
                  <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
                </div>
              </section>
            );
          }

          if (heroStyle === 'centered') {
            return (
              <section key={section.id} className="relative h-screen w-full flex flex-col items-center justify-center bg-transparent overflow-hidden text-center px-6 -mt-24">
                <div className="absolute inset-0 opacity-40">
                  <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover" alt="Hero Bg" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="max-w-5xl z-10">
                  <span className="text-[10px] uppercase tracking-[1em] text-white/40 mb-12 block font-black">BEYOND LUXURY</span>
                  <h1 className="text-7xl md:text-[12rem] font-light text-white leading-none tracking-tighter mb-16 italic uppercase mix-blend-difference">
                    <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="storeName" />
                  </h1>
                  <EditableButton label="DISCOVER MORE" link={`/store/${slug}/products`} slug={slug} settingsKey="zenithBtn" className="px-16 py-6 border border-[#c5a368] text-[#c5a368] text-[10px] font-black uppercase tracking-[0.6em] hover:bg-[#c5a368] hover:text-white transition-all rounded" />
                </motion.div>
              </section>
            );
          }

          if (heroStyle === 'minimal') {
            return (
              <section key={section.id} className="relative h-[60vh] w-full bg-transparent flex items-center justify-center px-6 -mt-24">
                <div className="text-center max-w-4xl border-y border-zinc-100 py-24">
                  <h1 className="text-6xl md:text-[10rem] font-light text-zinc-900 leading-none tracking-tighter mb-12 italic uppercase">
                    <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="storeName" />
                  </h1>
                  <Link href={`/store/${slug}/products`} className="text-[#c5a368] font-black uppercase tracking-[0.4em] text-[10px] border-b-2 border-[#c5a368] pb-1 hover:text-zinc-900 hover:border-zinc-900 transition-all">
                    START DISCOVERY
                  </Link>
                </div>
              </section>
            );
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden -mt-24 flex flex-col md:flex-row">
                <div className="absolute top-32 right-12 hidden lg:block">
                  <div className="[writing-mode:vertical-lr] text-[10rem] font-light text-zinc-100 select-none uppercase tracking-tighter leading-none">
                    {new Date().getFullYear()}
                  </div>
                </div>
                <div className="w-full md:w-[45%] h-full flex flex-col justify-end p-12 md:p-24 z-10">
                  <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}>
                    <div className="bg-[#c5a368] text-white px-4 py-1 text-[8px] font-black tracking-[0.5em] uppercase inline-block mb-8">
                      CAMPAIGN NO. 1
                    </div>
                    <h1 className="text-7xl md:text-[7rem] font-light text-zinc-900 leading-[0.9] tracking-tighter mb-12 italic uppercase">
                      <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="heroTitle" />
                    </h1>
                    <p className="text-zinc-500 max-w-md text-lg mb-12 font-sans font-light">
                      <EditableText content={topBanners[0]?.subtitle || "Redefining the essence of modern luxury through curated pieces."} slug={slug} settingsKey="heroSubtitle" />
                    </p>
                    <EditableButton label="EXPLORE COLLECTION" link={`/store/${slug}/products`} slug={slug} settingsKey="heroBtn" className="px-12 py-5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#c5a368] transition-all rounded" />
                  </motion.div>
                </div>
                <div className="w-full md:w-[55%] h-full relative">
                  <div className="absolute inset-12 border border-zinc-100 z-10 pointer-events-none" />
                  <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover" alt="Campaign" />
                </div>
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-[#fdfcfb] overflow-hidden -mt-24 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                   <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c5a368] rounded-full blur-[150px]" />
                   <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-200 rounded-full blur-[150px]" />
                </div>
                <div className="container mx-auto px-12 flex flex-col md:flex-row items-center gap-16 z-10">
                  <div className="w-full md:w-1/2 order-2 md:order-1">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                       <span className="text-[#c5a368] text-[10px] uppercase tracking-[0.8em] font-black mb-6 block">ABSTRACT ESSENCE</span>
                       <h1 className="text-6xl md:text-[9rem] font-light text-zinc-900 leading-[0.85] tracking-tighter mb-10 italic uppercase">
                         <EditableText content={topBanners[0]?.title || settings.storeName || "PURE"} slug={slug} settingsKey="heroTitle" />
                       </h1>
                       <div className="flex gap-12 items-center">
                          <div className="w-24 h-[1px] bg-zinc-900" />
                          <EditableButton label="DISCOVER" link={`/store/${slug}/products`} slug={slug} settingsKey="heroBtn" className="text-[10px] font-black uppercase tracking-[0.6em] hover:text-[#c5a368] transition-colors" />
                       </div>
                    </motion.div>
                  </div>
                  <div className="w-full md:w-1/2 order-1 md:order-2">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }} 
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }} 
                      transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                      className="aspect-[4/5] w-full max-w-lg mx-auto rounded-[20rem] overflow-hidden shadow-2xl border-[16px] border-white"
                    >
                      <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover scale-110" alt="Abstract" />
                    </motion.div>
                  </div>
                </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden -mt-24">
                <div className="absolute inset-0">
                  <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} className="w-full h-full object-cover opacity-60 scale-105" alt="Immersive" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 100 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
                    className="max-w-6xl"
                  >
                    <h1 className="text-[5rem] md:text-[15rem] font-light text-white leading-none tracking-[-0.05em] uppercase mb-16 italic mix-blend-difference">
                      <EditableText content={topBanners[0]?.title || settings.storeName || "CINEMATIC"} slug={slug} settingsKey="heroTitle" />
                    </h1>
                    <div className="flex flex-col items-center gap-12">
                       <motion.div 
                         initial={{ scaleX: 0 }} 
                         whileInView={{ scaleX: 1 }} 
                         transition={{ delay: 1, duration: 1.5 }}
                         className="w-full max-w-md h-[1px] bg-white/20" 
                       />
                       <EditableButton 
                         label="ENTER EXPERIENCE" 
                         link={`/store/${slug}/products`} 
                         slug={slug} 
                         settingsKey="heroBtn" 
                         className="px-20 py-8 border border-white/30 text-white text-[10px] font-black uppercase tracking-[1em] hover:bg-white hover:text-black transition-all backdrop-blur-md rounded-full" 
                       />
                    </div>
                  </motion.div>
                </div>
                <div className="absolute bottom-12 right-12">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40">
                         <Play size={16} fill="currentColor" />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">Watch Film</span>
                   </div>
                </div>
              </section>
            );
          }

          return (
            <div key={section.id}>
              {heroStyle === 'slider' ? (
                <HeroSlider banners={topBanners} slug={slug} settings={settings.bannerSettings} />
              ) : (
                <section className="relative h-screen w-full overflow-hidden bg-transparent -mt-24">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeBanner}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                      className="absolute inset-0"
                    >
                      <SmartImage 
                        src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} 
                        alt={topBanners[0]?.title || "Zenith"}
                        className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                      <SmartImage 
                        src={topBanners[0]?.mobileImageUrl || topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} 
                        alt={topBanners[0]?.title || "Zenith Mobile"}
                        className="md:hidden absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      <div className="text-white/60 text-[10px] uppercase tracking-[0.6em] mb-6 block font-sans font-black text-center">
                        <EditableText 
                          content={settings?.establishedText || "Established 2026"} 
                          settingsKey="establishedText" 
                          slug={slug} 
                        />
                      </div>
                      <div className="text-5xl md:text-8xl font-light text-white mb-8 tracking-tighter leading-tight max-w-4xl italic uppercase">
                        <EditableText 
                          content={topBanners[0]?.title || "Zenith Collection"} 
                          settingsKey="heroTitle" 
                          slug={slug} 
                        />
                      </div>
                      <div className="text-white/80 text-lg md:text-xl font-sans font-light tracking-wide mb-12 max-w-2xl mx-auto leading-relaxed">
                        <EditableText 
                          content={topBanners[0]?.subtitle || "The pinnacle of minimalist luxury."} 
                          settingsKey="heroSubtitle" 
                          slug={slug} 
                        />
                      </div>
                      <div className="flex gap-8 items-center justify-center">
                        <EditableButton 
                          label={topBanners[0]?.buttonText || "Discover Now"}
                          link={topBanners[0]?.buttonLink || `/store/${slug}/products`}
                          settingsKey="heroBtn"
                          slug={slug}
                          className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#c5a368] hover:text-white transition-all rounded shadow-2xl"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Scroll Indicator */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                     <div className="w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent" />
                     <span className="text-white/40 text-[8px] uppercase tracking-[0.4em] font-sans font-black">Scroll</span>
                  </div>
                </section>
              )}
            </div>
          );
        }

        if (section.type === 'marquee') {
          return section.config?.enabled !== false && (
            <StoreMarquee key={section.id} settings={section.config as any} />
          );
        }

        if (section.type === 'text_block' || section.type === 'intro') {
          return (
            <section key={section.id} className="py-32 container mx-auto px-8 md:px-16 text-center bg-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <div className="text-3xl md:text-4xl font-light mb-12 leading-relaxed italic">
                  <EditableText 
                    content={settings?.introQuote || section.config?.text || "\"We believe in the beauty of the essential.\""} 
                    settingsKey="introQuote" 
                    slug={slug} 
                  />
                </div>
                <div className="w-12 h-[1px] bg-[#c5a368] mx-auto mb-12" />
                <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#c5a368] font-bold">
                  <EditableText 
                    content={settings?.introTagline || section.config?.title || "The Zenith Philosophy"} 
                    settingsKey="introTagline" 
                    slug={slug} 
                  />
                </div>
              </motion.div>
            </section>
          );
        }

        if (section.type === 'categories') {
          return (
            <section key={section.id} className="pb-32 px-4 md:px-8 bg-transparent">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.slice(0, 2).map((cat: any) => (
                  <Link 
                    key={cat.id}
                    href={`/store/${slug}/products?category=${cat.id}`}
                    className="relative aspect-[4/5] overflow-hidden group rounded-sm"
                  >
                    <SmartImage 
                      src={cat.image || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <span className="text-[10px] uppercase tracking-[0.4em] mb-4 font-black">Discover</span>
                      <h3 className="text-4xl font-light italic">{cat.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <section key={section.id} className="py-32 bg-transparent">
              <div className="container mx-auto px-8 md:px-16 text-left">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                  <div className="max-w-xl">
                    <div className="text-[#c5a368] text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">
                      <EditableText 
                        content={settings?.productsTagline || section.config?.tagline || "Curated Essentials"} 
                        settingsKey="productsTagline" 
                        slug={slug} 
                      />
                    </div>
                    <div className="text-4xl md:text-5xl font-light tracking-tight italic">
                      <EditableText 
                        content={settings?.productsTitle || section.config?.title || "Timeless Pieces"} 
                        settingsKey="productsTitle" 
                        slug={slug} 
                      />
                    </div>
                  </div>
                  <Link href={`/store/${slug}/products`} className="text-[10px] uppercase tracking-[0.4em] font-black border-b border-black pb-2 hover:text-[#c5a368] hover:border-[#c5a368] transition-all">
                    Explore All
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                  {products.slice(0, 4).map((product: any) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group cursor-pointer"
                    >
                      <Link href={`/store/${slug}/product/${product.id}`}>
                        <div className="aspect-[3/4] overflow-hidden mb-6 bg-[#f9f9f8] relative">
                          <SmartImage 
                            src={product.images[0]} 
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                        </div>
                        <div className="space-y-2 text-center">
                          <h3 className="text-sm font-light tracking-wider group-hover:text-[#c5a368] transition-colors">{product.name}</h3>
                          <p className="text-xs font-sans font-bold tracking-widest text-[#999]">
                            ${product.price}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          return (
            <section key={section.id} className="py-1  bg-[#f9f9f8]">
              <div className="w-full space-y-1">
                {bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="relative min-h-[400px] md:h-[500px] overflow-hidden group shadow-2xl ">
                    <SmartImage 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                    />
                    <SmartImage 
                      src={banner.mobileImageUrl || banner.imageUrl} 
                      alt={banner.title} 
                      className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 md:p-12">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                      >
                        <h2 className="text-4xl md:text-7xl font-light italic mb-6 tracking-tight">{banner.title}</h2>
                        <p className="text-lg md:text-xl font-sans font-light tracking-widest opacity-80 mb-10 max-w-2xl">{banner.subtitle}</p>
                        <BannerButton banner={banner} slug={slug} />
                      </motion.div>
                    </div>
                  </div>
                ))}
                {bannersToShow.length === 0 && (
                  <div className="text-center py-20 bg-white border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-light italic uppercase tracking-[0.4em] text-xs px-6">
                      Assign banners to the "Middle" position in the dashboard to display them here.
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="zenith" />;
        }

        if (section.type === 'callout') {
          return (
            <section key={section.id} className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-transparent text-white">
              <SmartImage 
                src="https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1600&q=80" 
                alt="Parallax"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.8]"
              />
              <div className="relative text-center px-6">
                <div className="text-4xl md:text-6xl font-light mb-8 italic tracking-tight">
                  <EditableText 
                    content={settings?.calloutText || section.config?.text || "Elegance is not being noticed, it's being remembered."} 
                    settingsKey="calloutText" 
                    slug={slug} 
                  />
                </div>
                <Link 
                  href={`/store/${slug}/about`}
                  className="inline-block px-10 py-4 border border-white text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-black transition-all"
                >
                  The Zenith Legacy
                </Link>
              </div>
            </section>
          );
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
        <section className="py-1  bg-transparent border-t border-zinc-100">
          <div className="w-full space-y-1">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative min-h-[400px] md:h-[500px] overflow-hidden group shadow-2xl ">
                <SmartImage 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                />
                <SmartImage 
                  src={banner.mobileImageUrl || banner.imageUrl} 
                  alt={banner.title} 
                  className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  >
                    <h2 className="text-4xl md:text-7xl font-light italic mb-6 tracking-tight">{banner.title}</h2>
                    <p className="text-lg md:text-xl font-sans font-light tracking-widest opacity-80 mb-10 max-w-2xl">{banner.subtitle}</p>
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
