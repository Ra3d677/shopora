"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartImage from "../ui/SmartImage";
import EditableText from "../editor/EditableText";
import VideoSection from "../ui/VideoSection";
import ProductCard from "../products/ProductCard";
import EditableButton from "../editor/EditableButton";
import BannerButton from "../editor/BannerButton";
import Link from "next/link";
import SectionDivider from "../ui/SectionDivider";
import MarqueeSection from "../ui/MarqueeSection";
import TestimonialSection from "../ui/TestimonialSection";
import HeroSlider from "../ui/HeroSlider";
import CategoriesSection from "../ui/CategoriesSection";
import SaleSection from "../ui/SaleSection";

interface ZenithTemplateProps {
  store: any;
  slug: string;
}

export default function ZenithTemplate({ store, slug }: ZenithTemplateProps) {
  const settings = store.settings || {};
  const homepageLayout = settings.homepageLayout || [];
  const topBanners = store.banners?.filter((b: any) => b.placement === 'top') || [];
  const products = store.products || [];

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        const heroStyle = section.style || 'split';
        
        if (heroStyle === 'slider') {
          return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
        }

        if (heroStyle === 'split') {
          return (
            <section key={section.id} className="relative h-screen w-full flex flex-col md:flex-row bg-transparent overflow-hidden -mt-24">
              <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-24">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a368] mb-8 block font-black">THE ZENITH COLLECTION</span>
                  <h1 className="text-6xl md:text-[8rem] font-light text-zinc-900 leading-[0.85] tracking-tighter mb-12 italic uppercase">
                    <span className="gradient-text-support">
                      <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="storeName" />
                    </span>
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
                <h1 className="text-7xl md:text-[12rem] font-light text-zinc-900 leading-none tracking-tighter mb-16 italic uppercase mix-blend-multiply">
                  <span className="gradient-text-support">
                    <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="storeName" />
                  </span>
                </h1>
                <Link href={`/store/${slug}/products`} className="inline-block px-12 py-5 border border-zinc-900 text-zinc-900 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-900 hover:text-white transition-all">
                  EXPLORE ARCHIVE
                </Link>
              </motion.div>
            </section>
          );
        }

        if (heroStyle === 'minimal') {
          return (
            <section key={section.id} className="relative h-[60vh] w-full bg-transparent flex items-center justify-center px-6 -mt-24">
              <div className="text-center max-w-4xl border-y border-zinc-100 py-24">
                <h1 className="text-6xl md:text-[10rem] font-light text-zinc-900 leading-none tracking-tighter mb-12 italic uppercase">
                  <span className="gradient-text-support">
                    <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="storeName" />
                  </span>
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
            <section key={section.id} className="relative h-screen w-full flex flex-col md:flex-row items-center bg-transparent overflow-hidden -mt-24">
              <div className="w-full md:w-[45%] h-full flex flex-col justify-center px-12 md:px-24">
                <div className="max-w-md">
                  <div className="text-[10px] font-black tracking-[0.5em] text-zinc-300 mb-12 flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-zinc-200" />
                    CAMPAIGN NO. 1
                  </div>
                  <h1 className="text-7xl md:text-[7rem] font-light text-zinc-900 leading-[0.9] tracking-tighter mb-12 italic uppercase">
                    <span className="gradient-text-support">
                      <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="heroTitle" />
                    </span>
                  </h1>
                  <p className="text-zinc-500 max-w-md text-lg mb-12 font-sans font-light">
                    <EditableText content={topBanners[0]?.subtitle || "Redefining the essence of modern luxury through curated pieces."} slug={slug} settingsKey="heroSubtitle" />
                  </p>
                  <EditableButton label="EXPLORE COLLECTION" link={`/store/${slug}/products`} slug={slug} settingsKey="heroBtn" className="px-12 py-5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#c5a368] transition-all rounded" />
                  <BannerButton banner={topBanners[0]} slug={slug} />
                </div>
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
            <section key={section.id} className="relative h-screen w-full flex flex-col md:flex-row bg-transparent overflow-hidden -mt-24">
              <div className="w-full md:w-1/2 flex items-center justify-center p-12 order-2 md:order-1">
                 <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                    <span className="text-[#c5a368] text-[10px] uppercase tracking-[0.8em] font-black mb-6 block">ABSTRACT ESSENCE</span>
                    <h1 className="text-6xl md:text-[9rem] font-light text-zinc-900 leading-[0.85] tracking-tighter mb-10 italic uppercase">
                      <span className="gradient-text-support">
                        <EditableText content={topBanners[0]?.title || settings.storeName || "PURE"} slug={slug} settingsKey="heroTitle" />
                      </span>
                    </h1>
                    <div className="flex gap-12 items-center">
                       <div className="w-24 h-[1px] bg-zinc-900" />
                       <BannerButton banner={topBanners[0]} slug={slug} />
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
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 1 }}
                  className="max-w-6xl"
                >
                  <h1 className="text-[5rem] md:text-[15rem] font-light text-white leading-none tracking-[-0.05em] uppercase mb-16 italic mix-blend-difference">
                    <span className="gradient-text-support">
                      <EditableText content={topBanners[0]?.title || settings.storeName || "CINEMATIC"} slug={slug} settingsKey="heroTitle" />
                    </span>
                  </h1>
                  <div className="flex flex-col items-center gap-12">
                     <motion.div 
                        animate={{ y: [0, 10, 0] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-[1px] h-32 bg-white/40"
                     />
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Scroll to begin</span>
                  </div>
                </motion.div>
              </div>
            </section>
          );
        }

        // Split is the default for Zenith
        return (
          <section key={section.id} className="relative h-screen w-full flex flex-col md:flex-row bg-transparent overflow-hidden -mt-24">
            <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-24">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#c5a368] mb-8 block font-black">THE ZENITH COLLECTION</span>
                <h1 className="text-6xl md:text-[8rem] font-light text-zinc-900 leading-[0.85] tracking-tighter mb-12 italic uppercase">
                  <span className="gradient-text-support">
                    <EditableText content={topBanners[0]?.title || settings.storeName || "ZENITH"} slug={slug} settingsKey="storeName" />
                  </span>
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

      case 'marquee':
        return <MarqueeSection key={section.id} section={section} slug={slug} />;

      case 'categories':
        return <CategoriesSection key={section.id} section={section} categories={store.categories} slug={slug} template="zenith" />;

      case 'products':
        const displayProducts = section.config?.limit ? products.slice(0, section.config.limit) : products.slice(0, 8);
        return (
          <section key={section.id} className="py-40 container mx-auto px-8 bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
               <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.8em] text-[#c5a368] mb-8 block">CURATED SERIES</div>
                  <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase italic leading-none">
                     <EditableText content={section.config?.title || "Signature Objects"} settingsKey={`sec-${section.id}-title`} slug={slug} />
                  </h2>
               </div>
               <Link href={`/store/${slug}/products`} className="text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-zinc-100 pb-2 hover:border-[#c5a368] transition-all">
                  VIEW CATALOG
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
               {displayProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} slug={slug} template="zenith" />
               ))}
            </div>
          </section>
        );

      case 'sale':
        return <SaleSection key={section.id} section={section} products={products} slug={slug} template="zenith" />;

      case 'testimonials':
        return <TestimonialSection key={section.id} section={section} slug={slug} template="zenith" />;

      case 'text_block':
      case 'intro':
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

      default:
        return (
          <section key={section.id} className="py-20 text-center text-zinc-400 font-mono text-[10px] uppercase tracking-widest bg-transparent">
             Missing Component: {section.type}
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen font-serif selection:bg-[#c5a368] selection:text-white transition-all duration-700 bg-transparent">
      {homepageLayout.map((section: any) => {
        const divider = section.showDivider !== false && (
          <SectionDivider 
            style={settings.dividerStyle || 'line'} 
            color={settings.dividerColor || settings.colorSystem?.brand?.primary || '#c5a368'} 
          />
        );

        return (
          <React.Fragment key={section.id}>
            {renderSection(section)}
            {divider}
          </React.Fragment>
        );
      })}
      
      {homepageLayout.length === 0 && (
         <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center -mt-24">
            <div className="w-32 h-[1px] bg-zinc-200 mb-12" />
            <h1 className="text-5xl font-light italic tracking-tighter uppercase mb-12 text-zinc-300">ZENITH / VOID</h1>
            <p className="text-zinc-400 font-sans text-xs uppercase tracking-[0.5em] mb-12">No sections deployed to home matrix.</p>
            <div className="w-[1px] h-32 bg-zinc-100" />
         </div>
      )}
    </div>
  );
}
