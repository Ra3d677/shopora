"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, Menu, X, ArrowRight, Heart, User, 
  Home, ShoppingCart, Plus, Minus, Star, Clock 
} from 'lucide-react';
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import { useCartStore } from "@/store/cart";

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
  const [activeTab, setActiveTab] = useState(categories[0]?.id || 'all');
  const [scrolled, setScrolled] = useState(false);
  
  const senSettings = settings.sennoSettings || {};
  const primaryColor = "#e6518e"; // Senno Peach/Pink accent

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');

  const filteredProducts = activeTab === 'all' 
    ? products.slice(0, 8) 
    : products.filter(p => p.category_id === activeTab).slice(0, 8);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#e6518e] selection:text-white">
      
      {/* 2. HERO SECTION */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        {topBanners.length > 0 ? (
          <HeroSlider banners={topBanners} slug={slug} settings={settings.bannerSettings} />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-[#fcf5f7]">
            <div className="absolute inset-0 z-0">
               <SmartImage 
                 src={senSettings.heroImage || "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=1600&q=80"} 
                 className="w-full h-full object-cover opacity-80" 
                 alt="Hero"
               />
            </div>
            <div className="relative z-10 text-center px-6 max-w-4xl">
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
               >
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e6518e] mb-6 block">
                   <EditableText 
                     content={senSettings.heroBadge || "Premium Quality"} 
                     slug={slug} 
                     settingsKey="sennoSettings.heroBadge" 
                     className="text-[#e6518e]" 
                   />
                 </span>
                 <h1 className="text-6xl md:text-8xl font-serif italic font-black text-slate-900 leading-[0.9] tracking-tighter mb-10">
                   <EditableText 
                     content={senSettings.heroTitle || "Beauty Redefined."} 
                     slug={slug} 
                     settingsKey="sennoSettings.heroTitle" 
                   />
                 </h1>
                 <div className="flex justify-center gap-4">
                   <EditableButton 
                     label="Shop Collection" 
                     link={`/store/${slug}/products`} 
                     slug={slug}
                     settingsKey="sennoSettings.heroButton"
                     className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#e6518e] transition-all"
                   />
                 </div>
               </motion.div>
            </div>
          </div>
        )}
      </section>

      {/* 3. CATEGORY SWIPER */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif italic font-black">Top Categories</h2>
            <Link href={`/store/${slug}/categories`} className="text-xs font-black uppercase tracking-widest border-b-2 border-[#e6518e] pb-1">View All</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar">
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="flex-shrink-0 group">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#e6518e] transition-all p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <SmartImage src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                  </div>
                </div>
                <p className="text-center font-black uppercase tracking-widest text-[10px]">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TABBED PRODUCTS */}
      <section className="py-20 bg-[#fafafa] px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif italic font-black mb-4 tracking-tighter">Our Selection</h2>
            <div className="flex justify-center gap-8 overflow-x-auto hide-scrollbar py-4">
              <button 
                onClick={() => setActiveTab('all')}
                className={`text-[10px] font-black uppercase tracking-[0.3em] pb-2 transition-all border-b-2 ${activeTab === 'all' ? 'border-[#e6518e] text-[#e6518e]' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
              >
                All Products
              </button>
              {categories.slice(0, 4).map((cat: any) => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] pb-2 transition-all border-b-2 ${activeTab === cat.id ? 'border-[#e6518e] text-[#e6518e]' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} slug={slug} primaryColor={primaryColor} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOTSPOTS SECTION */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-2xl">
                <SmartImage 
                  src={senSettings.hotspotImage || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&q=80"} 
                  className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" 
                  alt="Hotspots"
                />
                {/* Static Hotspots Example */}
                <div className="absolute top-[30%] left-[40%]">
                   <div className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition-transform shadow-lg group/hot">
                      <Plus className="w-4 h-4 text-slate-900" />
                      <div className="absolute left-10 top-0 bg-white p-3 rounded-xl shadow-xl w-40 opacity-0 group-hover/hot:opacity-100 transition-opacity pointer-events-none z-20">
                         <p className="text-[10px] font-black uppercase mb-1">Serum Blush</p>
                         <p className="text-[#e6518e] font-black text-xs">$24.00</p>
                      </div>
                   </div>
                </div>
             </div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e6518e] mb-6 block">The Spotlight</span>
                <h2 className="text-5xl md:text-7xl font-serif italic font-black leading-none tracking-tighter mb-8">Naturally Glowing Skin.</h2>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">Experience the fusion of high-performance science and artisanal beauty traditions. Our serum-based formula provides long-lasting hydration and a natural finish.</p>
                <div className="flex items-center gap-8 mb-10">
                   <div className="flex flex-col">
                      <span className="text-3xl font-serif italic font-black">98%</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Natural Ingredients</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-3xl font-serif italic font-black">24H</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Moisture Barrier</span>
                   </div>
                </div>
                <EditableButton 
                  label="Learn More" 
                  link={`/store/${slug}/products`} 
                  slug={slug}
                  settingsKey="sennoSettings.spotlightButton"
                  className="px-12 py-5 bg-white border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all"
                />
             </div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER (Senno Style) */}
      <section className="py-32 bg-[#fcf5f7] px-6">
        <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-5xl font-serif italic font-black mb-8 tracking-tighter italic leading-none">Join the Club.</h2>
           <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto">Subscribe to receive updates, access to exclusive deals, and more.</p>
           <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-8 py-5 rounded-full border-none focus:ring-2 focus:ring-[#e6518e] outline-none text-sm font-medium shadow-sm"
              />
              <button className="px-12 py-5 bg-[#e6518e] text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-slate-900 transition-all shadow-xl">Join Now</button>
           </form>
        </div>
      </section>

    </div>
  );
}

function ProductCard({ product, slug, primaryColor }: any) {
  return (
    <div className="group flex flex-col">
       <div className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#f5f5f5] mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
          <SmartImage 
            src={product.images[0]} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            alt={product.name} 
          />
          
          {/* Sale Badge */}
          {product.discount_price && (
            <div className="absolute top-4 left-4 bg-[#e6518e] text-white text-[8px] font-black px-3 py-1 rounded-full shadow-lg">SALE</div>
          )}

          {/* Countdown Example */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white/80 backdrop-blur-md rounded-xl p-2 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
             <Clock className="w-3 h-3 text-[#e6518e]" />
             <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Ends In: 05 : 12 : 45</span>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-10 group-hover:translate-x-0 transition-all duration-500 delay-75">
             <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#e6518e] hover:text-white transition-all">
                <Heart className="w-4 h-4" />
             </button>
             <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#e6518e] hover:text-white transition-all">
                <ShoppingBag className="w-4 h-4" />
             </button>
          </div>
       </div>

       <div className="text-center px-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">{product.category_id}</p>
          <Link href={`/store/${slug}/product/${product.id}`}>
            <h3 className="text-sm md:text-base font-black uppercase tracking-tight mb-2 group-hover:text-[#e6518e] transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-3">
             {[1,2,3,4,5].map(s => <Star key={s} className="w-2 h-2 fill-[#e6518e] text-[#e6518e]" />)}
          </div>
          <div className="flex items-center justify-center gap-3">
             {product.discount_price ? (
               <>
                 <span className="text-[#e6518e] font-black text-sm">${product.discount_price}</span>
                 <span className="text-slate-400 line-through text-xs">${product.price}</span>
               </>
             ) : (
               <span className="text-slate-900 font-black text-sm">${product.price}</span>
             )}
          </div>
       </div>
    </div>
  );
}
