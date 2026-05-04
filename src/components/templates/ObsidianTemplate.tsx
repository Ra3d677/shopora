"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Play, Search, Menu, Plus } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import HeroSlider from '@/components/ui/HeroSlider';
import { motion, useScroll, useTransform } from 'framer-motion';
import EditableText from '@/components/editor/EditableText';
import EditableButton from '@/components/editor/EditableButton';
import EditableImage from '@/components/editor/EditableImage';

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

  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black">
      {/* HERO SECTION */}
      {topBanners.length > 0 && (
        topBanners.length > 1 ? (
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
                   <EditableText content={topBanners[0].title} settingsKey="heroTitle" slug={slug} />
                </div>
                <div className="text-lg md:text-xl text-white/60 font-light max-w-lg mb-16 leading-relaxed text-center lg:text-left">
                   <EditableText content={topBanners[0].subtitle} settingsKey="heroSubtitle" slug={slug} />
                </div>
                <div className="flex gap-8 items-center justify-center lg:justify-start">
                  <EditableButton 
                    label={topBanners[0].buttonText || "Discovery"}
                    link={topBanners[0].buttonLink || `/store/${slug}/products`}
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
                  src={topBanners[0].imageUrl} 
                  alt="Hero Desktop"
                  className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
                />
                <SmartImage 
                  src={topBanners[0].mobileImageUrl || topBanners[0].imageUrl} 
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
        )
      )}

      {/* HORIZONTAL SCROLL / FEATURED LIST */}
      <section className="py-40 overflow-hidden">
        <div className="container mx-auto px-8 mb-20">
           <div className="flex justify-between items-end">
              <div>
                <div className="text-4xl md:text-6xl font-black tracking-tighter italic">
                  <EditableText content={settings?.featuredTitle || "Selected Works"} settingsKey="featuredTitle" slug={slug} />
                </div>
              </div>
              <Link href={`/store/${slug}/products`} className="text-xs font-black uppercase tracking-[0.4em] border-b border-white pb-2">View Full Series</Link>
           </div>
        </div>

        <div className="flex gap-8 px-8 overflow-x-auto no-scrollbar pb-10">
          {featuredProducts.map((p: any, i: number) => (
            <motion.div 
              key={p.id}
              whileHover={{ y: -10 }}
              className="min-w-[300px] md:min-w-[450px] aspect-[4/5] relative group overflow-hidden bg-[#111] rounded-3xl"
            >
              <SmartImage src={p.images[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                 <p className="text-[10px] font-black tracking-[0.4em] mb-2 uppercase text-white/50">{p.category?.name || "Premium"}</p>
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

      {/* MIDDLE BANNERS SECTION */}
      {middleBanners.length > 0 && (
        <section className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-8">
            {middleBanners.map((banner: any) => (
              <div key={banner.id} className="relative group overflow-hidden rounded-3xl aspect-[4/5] md:aspect-[21/9] mb-12 last:mb-0">
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
                <div className="absolute inset-0 bg-black/40 p-6 md:p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase italic">{banner.title}</h2>
                    <p className="text-lg text-white/70 max-w-xl mb-8 font-light leading-relaxed">{banner.subtitle}</p>
                    {banner.buttonText && (
                      <Link 
                        href={banner.buttonLink || `/store/${slug}/products`}
                        className="inline-block px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all"
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

      {/* BRUTALIST STORY SECTION */}
      <section className="py-40 bg-white text-black">
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
           <div className="lg:col-span-5">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 block text-black/40 italic">Heritage & Process</div>
              <div className="text-4xl font-black tracking-tighter mb-10 leading-tight">
                 <EditableText content={settings?.storyTitle || "Engineered for longevity. Designed for the individual."} settingsKey="storyTitle" slug={slug} />
              </div>
              <div className="text-lg text-black/60 font-light leading-relaxed mb-12">
                 <EditableText 
                    content={settings?.storyDesc || "Obsidian is more than a brand; it's a commitment to materials that survive trends. We combine brutalist aesthetics with premium comfort."} 
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

      {/* FULL WIDTH IMMERSIVE CALLOUT */}
      <section className="relative h-screen overflow-hidden">
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
                <EditableText content={settings?.ctaTitle || "Become Part of the <br/> Syndicate"} settingsKey="ctaTitle" slug={slug} />
             </div>
             <div className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-light">
                <EditableText content={settings?.ctaDesc || "Join our community to access exclusive drops and early releases. No spam, only impact."} settingsKey="ctaDesc" slug={slug} />
             </div>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input type="email" placeholder="YOUR EMAIL ADDRESS" className="px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full text-xs font-black w-full sm:w-80 focus:ring-2 focus:ring-white outline-none" />
                <button className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/80 transition-all">Join Syndicate</button>
             </div>
           </motion.div>
        </div>
      </section>

      {/* BOTTOM BANNERS SECTION */}
      {bottomBanners.length > 0 && (
        <section className="w-full">
          {bottomBanners.map((banner: any) => (
            <div key={banner.id} className="relative w-full aspect-[4/5] md:h-[600px] md:aspect-auto overflow-hidden group">
              <SmartImage 
                src={banner.imageUrl} 
                alt={banner.title} 
                className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-transform duration-[2s] group-hover:scale-105" 
              />
              <SmartImage 
                src={banner.mobileImageUrl || banner.imageUrl} 
                alt={banner.title} 
                className="md:hidden absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-transform duration-[2s] group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/20 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 italic text-white uppercase">{banner.title}</h2>
                  <p className="text-xl md:text-2xl text-white/60 mb-12 font-light max-w-3xl leading-relaxed">{banner.subtitle}</p>
                  {banner.buttonText && (
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="inline-flex items-center gap-6 px-12 py-5 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all rounded-full"
                    >
                      {banner.buttonText} <ArrowRight size={20} />
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
