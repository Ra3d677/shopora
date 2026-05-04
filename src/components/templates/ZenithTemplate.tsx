"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Menu, X, ChevronRight, Play } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import { motion, AnimatePresence } from 'framer-motion';
import EditableText from '@/components/editor/EditableText';
import EditableButton from '@/components/editor/EditableButton';
import StoreMarquee from '@/components/ui/StoreMarquee';
import HeroSlider from '@/components/ui/HeroSlider';

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

  return (
    <div className="min-h-screen font-serif selection:bg-[#c5a368] selection:text-white">
      {/* Cinematic Hero */}
      {topBanners.length > 0 && (
        topBanners.length > 1 ? (
          <HeroSlider banners={topBanners} slug={slug} settings={settings.bannerSettings} />
        ) : (
          <section className="relative h-screen w-full overflow-hidden bg-black -mt-24">
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
                  src={topBanners[0].imageUrl} 
                  alt={topBanners[0].title}
                  className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <SmartImage 
                  src={topBanners[0].mobileImageUrl || topBanners[0].imageUrl} 
                  alt={topBanners[0].title}
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
                <div className="text-white/60 text-[10px] uppercase tracking-[0.6em] mb-6 block font-sans font-black">
                  <EditableText 
                    content={settings?.establishedText || "Established 2026"} 
                    settingsKey="establishedText" 
                    slug={slug} 
                  />
                </div>
                <div className="text-5xl md:text-8xl font-light text-white mb-8 tracking-tighter leading-tight max-w-4xl italic uppercase">
                  <EditableText 
                    content={topBanners[0].title} 
                    settingsKey="heroTitle" 
                    slug={slug} 
                  />
                </div>
                <div className="text-white/80 text-lg md:text-xl font-sans font-light tracking-wide mb-12 max-w-2xl mx-auto leading-relaxed">
                  <EditableText 
                    content={topBanners[0].subtitle} 
                    settingsKey="heroSubtitle" 
                    slug={slug} 
                  />
                </div>
                <div className="flex justify-center">
                  <EditableButton
                    label={topBanners[0].buttonText || "View Collection"}
                    link={`/store/${slug}/products`}
                    settingsKey="heroButtonText"
                    slug={slug}
                    className="group relative inline-flex items-center gap-4 text-white text-[10px] uppercase tracking-[0.5em] font-sans font-black hover:text-[#c5a368] transition-colors"
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
        )
      )}

      {/* Marquee */}
      {settings.marqueeSettings?.enabled && (
        <StoreMarquee settings={settings.marqueeSettings} />
      )}

      {/* Introduction */}
      <section className="py-32 container mx-auto px-8 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-3xl md:text-4xl font-light mb-12 leading-relaxed italic">
            <EditableText 
              content={settings?.introQuote || "\"We believe in the beauty of the essential. Every piece we create is a dialogue between timeless elegance and modern restraint.\""} 
              settingsKey="introQuote" 
              slug={slug} 
            />
          </div>
          <div className="w-12 h-[1px] bg-[#c5a368] mx-auto mb-12" />
          <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#c5a368] font-bold">
            <EditableText 
              content={settings?.introTagline || "The Zenith Philosophy"} 
              settingsKey="introTagline" 
              slug={slug} 
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Collections Grid */}
      <section className="pb-32 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.slice(0, 2).map((cat: any, i: number) => (
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

      {/* Minimal Product Gallery */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <div className="text-[#c5a368] text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">
                <EditableText 
                  content={settings?.productsTagline || "Curated Essentials"} 
                  settingsKey="productsTagline" 
                  slug={slug} 
                />
              </div>
              <div className="text-4xl md:text-5xl font-light tracking-tight italic">
                <EditableText 
                  content={settings?.productsTitle || "Timeless Pieces for the Discerning Individual"} 
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
            {featuredProducts.map((product: any) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link href={`/store/${slug}/products/${product.id}`}>
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

      {/* Middle Banners */}
      {middleBanners.length > 0 && (
        <section className="py-24 px-8 bg-[#f9f9f8]">
          <div className="container mx-auto space-y-16">
            {middleBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9] overflow-hidden group shadow-2xl rounded-sm">
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
                    {banner.buttonText && (
                      <Link 
                        href={banner.buttonLink || `/store/${slug}/products`}
                        className="inline-block px-12 py-5 border border-white text-[10px] uppercase tracking-[0.5em] font-black hover:bg-white hover:text-black transition-all"
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

      {/* Full Width Callout */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <SmartImage 
          src="https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=1600&q=80" 
          alt="Parallax"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.8]"
        />
        <div className="relative text-center text-white px-6">
          <div className="text-4xl md:text-6xl font-light mb-8 italic tracking-tight">
            <EditableText 
              content={settings?.calloutText || "Elegance is not being noticed, it's being remembered."} 
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

      {/* Bottom Banners */}
      {bottomBanners.length > 0 && (
        <section className="w-full">
          {bottomBanners.map((banner: any) => (
            <div key={banner.id} className="relative w-full aspect-[4/5] md:h-[600px] md:aspect-auto overflow-hidden group">
              <SmartImage 
                src={banner.imageUrl} 
                className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
                alt={banner.title}
              />
              <SmartImage 
                src={banner.mobileImageUrl || banner.imageUrl} 
                className="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-8 md:p-12">
                <h3 className="text-5xl md:text-8xl font-light italic mb-8 tracking-tighter">{banner.title}</h3>
                <p className="text-xl md:text-2xl font-sans font-light tracking-widest opacity-80 mb-12 max-w-3xl">{banner.subtitle}</p>
                {banner.buttonText && (
                  <Link 
                    href={banner.buttonLink || `/store/${slug}/products`}
                    className="inline-block px-12 py-5 border border-white text-[12px] uppercase tracking-[0.5em] font-black hover:bg-white hover:text-black transition-all"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
