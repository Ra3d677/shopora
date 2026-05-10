"use client";

import React, { useState } from 'react';
import BannerButton from "@/components/ui/BannerButton";
import VideoSection from "@/components/ui/VideoSection";
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Play, Search, Menu, Plus } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import HeroSlider from '@/components/ui/HeroSlider';
import { motion, useScroll, useTransform } from 'framer-motion';
import EditableText from '@/components/editor/EditableText';
import EditableButton from '@/components/editor/EditableButton';
import EditableImage from '@/components/editor/EditableImage';
import SaleSection from '@/components/ui/SaleSection';
import StoreMarquee from '@/components/ui/StoreMarquee';
import SectionDivider from '@/components/ui/SectionDivider';

export default function ObsidianTemplate({ 
  banners, 
  settings, 
  products, 
  slug,
  categories = [] 
}: any) {
  const featuredProducts = products.slice(0, 6);
  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');

  const homepageLayout = settings.homepageLayout || [
    { id: 'default-hero', type: 'hero' },
    { id: 'default-products', type: 'featured_products' },
    { id: 'default-story', type: 'text_block' },
    { id: 'default-newsletter', type: 'newsletter' }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-transparent selection:text-black bg-transparent text-white">
      {homepageLayout.map((section: any, index: number) => {
        const divider = index > 0 && settings.dividerStyle && settings.dividerStyle !== 'none' ? (
          <SectionDivider 
            style={settings.dividerStyle} 
            color={settings.colorSystem?.brand?.primary || '#ffffff'} 
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
              <section key={section.id} className="relative min-h-[80vh] flex flex-col lg:flex-row bg-transparent border-b border-white/5">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 z-10">
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8 block">THE OBSIDIAN SERIES</span>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-12 uppercase italic">
                      <EditableText content={topBanners[0]?.title || settings.storeName?.toUpperCase() || "OBSIDIAN"} slug={slug} settingsKey="storeName" />
                    </h1>
                    <div className="flex gap-6">
                       <EditableButton label="DISCOVER" link={`/store/${slug}/products`} slug={slug} settingsKey="obsidianBtn" className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full" />
                    </div>
                  </motion.div>
                </div>
                <div className="w-full lg:w-1/2 relative h-full">
                  <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1600&q=80"} className="absolute inset-0 w-full h-full object-cover grayscale" alt="Hero" />
                </div>
              </section>
            );
          }

          if (heroStyle === 'centered') {
            return (
              <section key={section.id} className="relative h-screen w-full flex items-center bg-transparent overflow-hidden">
                  <div className="absolute inset-0 opacity-40 grayscale">
                    <EditableImage 
                      src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1600&q=80"} 
                      alt="Hero Background" 
                      slug={slug}
                      settingsKey="heroImage"
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  </div>
                  <div className="container mx-auto px-8 relative z-10 text-center">
                    <h1 className="text-[12vw] font-black text-white leading-none tracking-tighter mb-12 uppercase italic mix-blend-difference">
                      <EditableText content={topBanners[0]?.title || settings.storeName?.toUpperCase() || "OBSIDIAN"} slug={slug} settingsKey="storeName" />
                    </h1>
                    <div className="flex gap-6 justify-center">
                       <EditableButton label="DISCOVER" link={`/store/${slug}/products`} slug={slug} settingsKey="obsidianBtn" className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full" />
                    </div>
                  </div>
              </section>
            );
          }

          if (heroStyle === 'minimal') {
            return (
              <section key={section.id} className="relative min-h-[50vh] w-full bg-transparent flex items-center justify-center px-6">
                <div className="text-center max-w-4xl border border-white/10 p-20">
                  <h1 className="text-5xl md:text-[8rem] font-black text-white leading-none tracking-tighter mb-12 uppercase italic">
                    <EditableText content={topBanners[0]?.title || settings.storeName?.toUpperCase() || "OBSIDIAN"} slug={slug} settingsKey="storeName" />
                  </h1>
                  <Link href={`/store/${slug}/products`} className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px] hover:text-white transition-all">
                    [ ENTER STORE ]
                  </Link>
                </div>
              </section>
            );
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden flex flex-col md:flex-row border-b border-white/5">
                 <div className="w-full md:w-1/3 flex flex-col justify-center p-12 md:p-20 z-10">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
                       <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/30 mb-8 block">CAMPAIGN V.01</span>
                       <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-12 uppercase italic">
                          <EditableText content={topBanners[0]?.title || settings.storeName || "SHADOW"} slug={slug} settingsKey="heroTitle" />
                       </h1>
                       <div className="flex flex-col gap-6">
                          <EditableButton label="VIEW RELEASES" link={`/store/${slug}/products`} slug={slug} settingsKey="obsidianBtn" className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-sm text-center" />
                          <div className="flex items-center gap-4 text-white/20">
                             <div className="w-8 h-[1px] bg-white/20" />
                             <span className="text-[8px] font-bold uppercase tracking-widest">Limited Availability</span>
                          </div>
                       </div>
                    </motion.div>
                 </div>
                 <div className="w-full md:w-2/3 relative h-full">
                    <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1600&q=80"} className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" alt="Campaign" />
                    <div className="absolute top-1/2 left-0 w-1 h-32 bg-white -translate-y-1/2" />
                    <div className="absolute bottom-20 right-20 text-[8rem] font-black text-white/5 select-none tracking-tighter italic uppercase">RAW</div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
                 </div>
                 <div className="container mx-auto px-8 flex flex-col items-center z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                       <div className="relative mb-12">
                          <div className="w-64 md:w-96 aspect-square rounded-[4rem] overflow-hidden border border-white/10 p-4">
                             <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1200&q=80"} className="w-full h-full object-cover grayscale rounded-[3rem]" alt="Abstract Center" />
                          </div>
                          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center text-black font-black text-xs uppercase italic rotate-12 shadow-2xl">ONLY</div>
                       </div>
                       <h1 className="text-6xl md:text-[12rem] font-black text-white leading-none tracking-tighter mb-12 uppercase italic text-center">
                          <EditableText content={topBanners[0]?.title || settings.storeName || "CORE"} slug={slug} settingsKey="heroTitle" />
                       </h1>
                       <EditableButton label="EXPLORE" link={`/store/${slug}/products`} slug={slug} settingsKey="obsidianBtn" className="px-16 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.6em] rounded-full hover:scale-110 transition-transform" />
                    </motion.div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden">
                 <div className="absolute inset-0">
                    <SmartImage src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1600&q=80"} className="w-full h-full object-cover opacity-40 scale-110 grayscale" alt="Immersive" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
                 </div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 100 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="max-w-6xl"
                    >
                       <span className="text-[10px] font-black uppercase tracking-[1em] text-white/40 mb-16 block">IMMERSIVE SERIES</span>
                        <h1 className="text-8xl md:text-[12rem] font-black text-white leading-none tracking-tighter mb-12 uppercase">
                           <EditableText content={topBanners[0]?.title || settings.storeName?.toUpperCase() || "OBSIDIAN"} slug={slug} settingsKey="storeName" />
                        </h1>
                       <div className="flex items-center justify-center gap-12">
                          <EditableButton label="THE EXPERIENCE" link={`/store/${slug}/products`} slug={slug} settingsKey="obsidianBtn" className="px-20 py-8 border border-white text-white text-[10px] font-black uppercase tracking-[0.8em] hover:bg-white hover:text-black transition-all" />
                       </div>
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
                <section className="relative min-h-screen flex flex-col lg:flex-row -mt-24">
                  {/* Left: Text Content */}
                  <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-20 py-32 lg:py-0 z-10 bg-[#0a0a0a]">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.8em] mb-8 block text-center lg:text-left">
                         <EditableText content={settings?.heroTagline || "New Collection / 2026"} settingsKey="heroTagline" slug={slug} />
                      </div>
                      <div className="text-6xl md:text-8xl lg:text-[10vw] font-black leading-[0.9] tracking-tighter mb-12 text-white text-center lg:text-left uppercase italic">
                         <EditableText content={topBanners[0]?.title || "Obsidian."} settingsKey="heroTitle" slug={slug} />
                      </div>
                      <div className="text-lg md:text-xl text-white/60 font-light max-w-lg mb-16 leading-relaxed text-center lg:text-left">
                         <EditableText content={topBanners[0]?.subtitle || "Engineered for impact."} settingsKey="heroSubtitle" slug={slug} />
                      </div>
                      <div className="flex gap-8 items-center justify-center lg:justify-start">
                        <EditableButton 
                          label={topBanners[0]?.buttonText || "Discovery"}
                          link={topBanners[0]?.buttonLink || `/store/${slug}/products`}
                          settingsKey="heroBtn"
                          slug={slug}
                          className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                   {/* Right: Immersive Image */}
                  <div className="w-full lg:w-1/2 relative h-[70vh] lg:h-auto overflow-hidden">
                    <motion.div 
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.5 }}
                      className="absolute inset-0"
                    >
                       <SmartImage 
                        src={topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1600&q=80"} 
                        alt="Hero Desktop"
                        className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
                      />
                      <SmartImage 
                        src={topBanners[0]?.mobileImageUrl || topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1600&q=80"} 
                        alt="Hero Mobile"
                        className="md:hidden absolute inset-0 w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
                      />
                    </motion.div>
                    
                    {/* Floating Element */}
                    <motion.div 
                       animate={{ y: [0, -20, 0] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       className="absolute bottom-20 left-10 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl max-w-[240px] hidden md:block"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Editor's Choice</p>
                      <p className="text-sm font-bold leading-snug text-white">The Obsidian Black Series. Limited Release.</p>
                    </motion.div>
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

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <section key={section.id} className="py-40 overflow-hidden bg-transparent">
              <div className="container mx-auto px-8 mb-20">
                 <div className="flex justify-between items-end text-left">
                    <div>
                      <div className="text-4xl md:text-6xl font-black tracking-tighter italic">
                        <EditableText content={settings?.featuredTitle || section.config?.title || "Selected Works"} settingsKey="featuredTitle" slug={slug} />
                      </div>
                    </div>
                    <Link href={`/store/${slug}/products`} className="text-xs font-black uppercase tracking-[0.4em] border-b border-white pb-2">View Full Series</Link>
                 </div>
              </div>

              <div className="flex gap-8 px-8 overflow-x-auto no-scrollbar pb-10">
                {products.slice(0, 8).map((p: any) => (
                  <motion.div 
                    key={p.id}
                    whileHover={{ y: -10 }}
                    className="min-w-[300px] md:min-w-[450px] aspect-[4/5] relative group overflow-hidden bg-[#111] rounded-3xl"
                  >
                    <SmartImage src={p.images[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end text-left">
                       <p className="text-[10px] font-black tracking-[0.4em] mb-2 uppercase text-white/50">{p.category_id || "Premium"}</p>
                       <h3 className="text-2xl font-black tracking-tighter mb-4">{p.name}</h3>
                       <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 transition-transform">
                          <span className="text-xl font-light">${p.price}</span>
                          <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center">
                             <Plus className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          return (
            <section key={section.id} className="py-1 bg-transparent">
              <div className="w-full ">
                {bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="relative group overflow-hidden  aspect-[4/5] md:aspect-[21/9] mb-12 last:mb-0">
                    <SmartImage 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                    <SmartImage 
                      src={banner.mobileImageUrl || banner.imageUrl} 
                      alt={banner.title} 
                      className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/40 p-6 md:p-12 flex flex-col justify-center text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                      >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase italic">{banner.title}</h2>
                        <p className="text-lg text-white/70 max-w-xl mb-8 font-light leading-relaxed">{banner.subtitle}</p>
                        <BannerButton banner={banner} slug={slug} />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'text_block' || section.type === 'story') {
          return (
            <section key={section.id} className="py-40 bg-transparent text-black">
              <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                 <div className="lg:col-span-7 relative">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="aspect-[3/4] overflow-hidden mt-20 relative">
                          <EditableImage 
                            src={settings?.storyImage1 || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"} 
                            alt="Story 1"
                            slug={slug}
                            settingsKey="storyImage1"
                            className="w-full h-full object-cover" 
                          />
                       </div>
                       <div className="aspect-[3/4] overflow-hidden relative">
                          <EditableImage 
                            src={settings?.storyImage2 || "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=800&q=80"} 
                            alt="Story 2"
                            slug={slug}
                            settingsKey="storyImage2"
                            className="w-full h-full object-cover" 
                          />
                       </div>
                    </div>
                    {/* Text Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full text-center">
                       <h2 className="text-[12vw] font-black tracking-tighter leading-none mix-blend-difference text-white">THE CRAFT</h2>
                    </div>
                 </div>
                 <div className="lg:col-span-5 text-left">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 block text-black/40 italic">Heritage & Process</div>
                    <div className="text-4xl font-black tracking-tighter mb-10 leading-tight">
                       <EditableText content={settings?.storyTitle || section.config?.title || "Engineered for longevity."} settingsKey="storyTitle" slug={slug} />
                    </div>
                    <div className="text-lg text-black/60 font-light leading-relaxed mb-12">
                       <EditableText 
                          content={settings?.storyDesc || section.config?.text || "Obsidian is more than a brand; it's a commitment to materials that survive trends."} 
                          settingsKey="storyDesc" 
                          slug={slug} 
                       />
                    </div>
                    <Link href={`/store/${slug}/about`} className="group flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                         <ArrowRight className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Our Legacy</span>
                    </Link>
                 </div>
              </div>
            </section>
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="obsidian" />;
        }

        if (section.type === 'newsletter' || section.type === 'cta') {
          return (
            <section key={section.id} className="relative h-screen overflow-hidden">
              <EditableImage 
                src={settings?.ctaBgImage || "https://images.unsplash.com/photo-1505022662217-58a947938bb5?w=1600&q=80"} 
                alt="CTA"
                slug={slug}
                settingsKey="ctaBgImage"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                 <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                 >
                   <div className="text-5xl md:text-8xl font-black tracking-tighter mb-12 leading-none uppercase italic">
                      <EditableText content={settings?.ctaTitle || "Become Part of the Syndicate"} settingsKey="ctaTitle" slug={slug} />
                   </div>
                   <div className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-light">
                      <EditableText content={settings?.ctaDesc || "Join our community to access exclusive drops and early releases."} settingsKey="ctaDesc" slug={slug} />
                   </div>
                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <input type="email" placeholder="YOUR EMAIL ADDRESS" className="px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full text-xs font-black w-full sm:w-80 focus:ring-2 focus:ring-white outline-none" />
                      <button className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/80 transition-all">Join Syndicate</button>
                   </div>
                 </motion.div>
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
        <section className="py-1  bg-transparent border-t border-white/5">
          <div className="w-full space-y-1">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9] overflow-hidden group shadow-2xl  border border-white/5">
                <SmartImage 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-105" 
                />
                <SmartImage 
                  src={banner.mobileImageUrl || banner.imageUrl} 
                  alt={banner.title} 
                  className="md:hidden absolute inset-0 w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  >
                    <h2 className="text-4xl md:text-8xl font-black italic tracking-tighter leading-none mb-6 uppercase">{banner.title}</h2>
                    <p className="text-lg md:text-xl font-light opacity-60 mb-10 max-w-2xl">{banner.subtitle}</p>
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
