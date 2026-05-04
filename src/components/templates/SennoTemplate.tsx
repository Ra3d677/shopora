"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Search, Heart, Star
} from 'lucide-react';
import EditableText from "@/components/editor/EditableText";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import SmartImage from "@/components/ui/SmartImage";

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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-[#f06292] selection:text-white">
      
      {/* 3. HERO SECTION (Right Aligned Content) */}
      <section className="relative h-[600px] md:h-[800px] bg-[#fcf2f4] overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-20 left-20 w-32 h-32 bg-[#fde9ed] rounded-full blur-3xl opacity-60" />
         <div className="absolute bottom-40 right-20 w-64 h-64 bg-[#f06292]/10 rounded-full blur-3xl opacity-40" />
         
         <div className="container mx-auto h-full px-6 md:px-12 relative z-10 flex items-center">
            {/* Image Placeholder / Main Image (Left) */}
            <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0 md:z-auto">
               <SmartImage 
                 src={senSettings.heroImage || "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=1600&q=80"} 
                 className="w-full h-full object-cover object-center" 
                 alt="Hero"
               />
               {/* Organic Sticker (Static) */}
               <div className="absolute bottom-20 left-10 md:left-20 w-24 h-24 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center animate-spin-slow">
                  <span className="text-[8px] font-black text-center uppercase tracking-widest text-slate-400">Natural Organic Best Store</span>
               </div>
            </div>

            {/* Content (Right Aligned) */}
            <div className="w-full md:w-1/2 flex flex-col items-start md:pl-16 lg:pl-32 z-10 text-left bg-white/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-8 md:p-0 rounded-3xl md:rounded-none m-4 md:m-0">
               <motion.div
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
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
                 <p className="text-lg md:text-xl text-slate-600 mb-10 flex items-center gap-3">
                   Helpline number : <span className="font-bold border-b-2 border-slate-300"><EditableText content={senSettings.heroHelpline || "(+06) 059 030 095"} slug={slug} settingsKey="sennoSettings.heroHelpline" /></span>
                 </p>
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

      {/* 4. PRODUCT GRID (Matching demo style) */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">Our Best Picks</h2>
               <p className="text-slate-500 font-medium italic">Premium beauty care for your daily routine.</p>
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

      {/* 5. HOTSPOTS SECTION */}
      <section className="py-20 px-6 bg-[#fcf2f4]">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-20">
           <div className="w-full lg:w-1/2 relative group rounded-[3rem] overflow-hidden shadow-2xl">
              <SmartImage src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&q=80" className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" alt="Hotspots" />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform group/dot">
                    <div className="w-3 h-3 bg-[#f06292] rounded-full animate-ping" />
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-2xl w-40 opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                       <p className="text-[10px] font-black uppercase mb-1">Night Recovery Serum</p>
                       <p className="text-[#f06292] font-black text-xs">$39.00</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="w-full lg:w-1/2">
              <h2 className="text-5xl md:text-7xl font-black text-slate-800 leading-tight mb-8">Crafted for your glowing skin.</h2>
              <p className="text-slate-500 text-lg mb-12 leading-relaxed">Our products are made from organic ingredients, carefully selected to provide the best care for your skin without any harsh chemicals.</p>
              <div className="grid grid-cols-2 gap-8 mb-12">
                 <div className="border-l-4 border-[#f06292] pl-6">
                    <h4 className="text-2xl font-black">99%</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Natural Extraction</p>
                 </div>
                 <div className="border-l-4 border-slate-900 pl-6">
                    <h4 className="text-2xl font-black">100%</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vegan Formula</p>
                 </div>
              </div>
              <button className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#f06292] transition-all rounded shadow-xl">DISCOVER MORE</button>
           </div>
        </div>
      </section>

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
