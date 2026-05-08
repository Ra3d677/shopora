"use client";

import Link from "next/link";
import SmartImage from "./SmartImage";
import EditableText from "../editor/EditableText";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Heart, Star } from "lucide-react";

interface SaleSectionProps {
  section: any;
  products: any[];
  slug: string;
  template: string;
}

export default function SaleSection({ section, products = [], slug, template }: SaleSectionProps) {
  if (!products || !Array.isArray(products) || !section) return null;
  
  const saleProducts = products.filter((p: any) => p && p.discount_price);
  if (saleProducts.length === 0) return null;

  const style = section.style || 'grid';
  const config = section.config || {};
  const bgColor = config.backgroundColor || 'transparent';
  
  const renderContent = () => {
    switch (style) {
      case 'bento':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[800px]">
             {saleProducts.slice(0, 5).map((product, idx) => (
                <Link 
                  key={product.id} 
                  href={`/store/${slug}/product/${product.id}`}
                  className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl ${
                    idx === 0 ? 'md:col-span-2 md:row-span-2' : 
                    idx === 1 ? 'md:col-span-2 md:row-span-1' : 
                    'md:col-span-1'
                  }`}
                >
                   <SmartImage src={product.images[0]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                      <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4">SALE</div>
                      <h3 className="text-white font-black uppercase tracking-tighter text-2xl md:text-4xl mb-2">{product.name}</h3>
                      <div className="flex items-center gap-4">
                         <span className="text-white/40 line-through text-sm">${product.price}</span>
                         <span className="text-red-500 text-2xl font-black italic">${product.discount_price}</span>
                      </div>
                   </div>
                </Link>
             ))}
          </div>
        );

      case 'horizontal':
        return (
          <div className="space-y-6">
             {saleProducts.slice(0, 4).map((product) => (
                <Link 
                  key={product.id} 
                  href={`/store/${slug}/product/${product.id}`}
                  className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-slate-100"
                >
                   <div className="w-full md:w-1/3 aspect-square md:aspect-auto">
                      <SmartImage src={product.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.name} />
                   </div>
                   <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <span className="text-red-600 font-black uppercase tracking-widest text-[10px] mb-2 block">Special Drop</span>
                            <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">{product.name}</h3>
                         </div>
                         <div className="text-right">
                            <span className="block text-slate-400 line-through text-lg">${product.price}</span>
                            <span className="block text-red-600 text-4xl font-black italic">-${Math.round(((product.price - product.discount_price) / product.price) * 100)}%</span>
                         </div>
                      </div>
                      <p className="text-slate-500 max-w-xl mb-8 leading-relaxed">Handcrafted with premium materials and engineered for those who demand excellence in every detail.</p>
                      <div className="flex items-center justify-between">
                         <span className="text-3xl font-black text-slate-900">${product.discount_price}</span>
                         <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs">Add to Bag</button>
                      </div>
                   </div>
                </Link>
             ))}
          </div>
        );

      case 'scroll':
        return (
          <div className="flex gap-6 overflow-x-auto pb-12 snap-x hide-scrollbar no-scrollbar scrollbar-hide">
             {saleProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/store/${slug}/product/${product.id}`}
                  className="min-w-[300px] md:min-w-[400px] snap-start group"
                >
                   <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl relative">
                      <SmartImage src={product.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                      <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full">SALE</div>
                   </div>
                   <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-2">{product.name}</h3>
                   <div className="flex items-center gap-4">
                      <span className="text-slate-400 line-through font-bold text-lg">${product.price}</span>
                      <span className="text-red-600 text-2xl font-black italic">${product.discount_price}</span>
                   </div>
                </Link>
             ))}
          </div>
        );

      case 'list':
        return (
          <div className="divide-y divide-slate-100">
             {saleProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/store/${slug}/product/${product.id}`}
                  className="flex items-center justify-between py-8 group"
                >
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
                         <SmartImage src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={product.name} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black uppercase tracking-tighter group-hover:text-red-600 transition-colors">{product.name}</h3>
                         <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Limited Availability</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="block text-slate-400 line-through text-sm font-bold">${product.price}</span>
                      <span className="block text-red-600 text-2xl font-black italic">${product.discount_price}</span>
                   </div>
                </Link>
             ))}
          </div>
        );

      case 'bubbles':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
             {saleProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/store/${slug}/product/${product.id}`}
                  className="flex flex-col items-center group text-center"
                >
                   <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-2xl mb-6 relative ring-4 ring-red-500/10 group-hover:ring-red-500/50 transition-all duration-700">
                      <SmartImage src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={product.name} />
                      <div className="absolute inset-0 bg-red-600/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 group-hover:text-red-600 transition-colors">{product.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 line-through">${product.price}</span>
                      <span className="text-xs font-black text-red-600">${product.discount_price}</span>
                   </div>
                </Link>
             ))}
          </div>
        );

      default: // grid
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {saleProducts.slice(0, 8).map((product) => (
                <Link 
                  key={product.id} 
                  href={`/store/${slug}/product/${product.id}`}
                  className="group"
                >
                   <div className="aspect-[3/4] bg-white rounded-3xl overflow-hidden mb-6 relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
                      <SmartImage src={product.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full">SALE</div>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">{product.name}</h3>
                   <div className="flex items-center gap-3">
                      <span className="text-slate-400 line-through text-sm font-bold">${product.price}</span>
                      <span className="text-red-600 text-2xl font-black italic">${product.discount_price}</span>
                   </div>
                </Link>
             ))}
          </div>
        );
    }
  };

  return (
    <section 
      key={section.id} 
      className="py-32 px-8 transition-colors duration-1000"
      style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : undefined }}
    >
      <div className="container mx-auto">
         <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
               <span className="text-red-600 font-black uppercase tracking-[0.4em] text-xs mb-4 block italic">Limited Time Drops</span>
               <h2 className={`text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none ${bgColor === '#000000' || bgColor === '#000' ? 'text-white' : 'text-slate-900'}`}>
                  <EditableText content={section.config?.title || "Season Sale"} settingsKey={`sec-${section.id}-title`} slug={slug} />
               </h2>
            </div>
            <Link 
               href={`/store/${slug}/products`} 
               className={`text-xs font-black uppercase tracking-widest border-b pb-2 transition-all ${
                  bgColor === '#000000' || bgColor === '#000' 
                  ? 'text-white border-white hover:text-red-500 hover:border-red-500' 
                  : 'text-slate-900 border-slate-900 hover:text-red-600 hover:border-red-600'
               }`}
            >
               Shop the sale
            </Link>
         </div>
         {renderContent()}
      </div>
    </section>
  );
}
