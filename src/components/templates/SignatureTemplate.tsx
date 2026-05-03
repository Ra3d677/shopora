"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Star, Quote, ChevronRight, Play, Globe, Shield, Plus } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import StoreMarquee from "@/components/ui/StoreMarquee";
import Reveal from "@/components/ui/premium/Reveal";
import MagneticButton from "@/components/ui/premium/MagneticButton";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function SignatureTemplate({ banners, settings, products, slug, categories }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  
  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');
  const saleProducts = products.filter((p: any) => p.discount_price && p.discount_price > 0 && p.status !== 'inactive');

  const [activeTab, setActiveTab] = useState(categories[0]?.id || "");
  const [showLiveSale, setShowLiveSale] = useState(false);
  const [currentSale, setCurrentSale] = useState({ name: "", location: "" });

  const sigSettings = settings.signatureSettings || {};
  const liveSales = sigSettings.liveSales || { enabled: false, interval: 15000 };
  const testimonials = sigSettings.testimonials && sigSettings.testimonials.length > 0 ? sigSettings.testimonials : [
    { 
      id: "1",
      name: "Alexander Knight", 
      role: "Creative Director, LUXE", 
      content: "The attention to detail and the sheer quality of the products exceeded all my expectations. Truly a masterpiece in modern ecommerce." 
    }
  ];
  const testimonialInterval = sigSettings.testimonialInterval || 5000;

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, testimonialInterval);
    return () => clearInterval(interval);
  }, [testimonials.length, testimonialInterval]);

  // Simulate Live Sales
  useEffect(() => {
    if (!liveSales.enabled) return;

    const names = ["Ahmed", "Sarah", "John", "Elena", "Omar", "Yasmine"];
    const locations = ["Cairo", "Dubai", "New York", "London", "Riyadh", "Paris"];
    
    const interval = setInterval(() => {
      setCurrentSale({
        name: names[Math.floor(Math.random() * names.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      });
      setShowLiveSale(true);
      setTimeout(() => setShowLiveSale(false), 5000);
    }, liveSales.interval);
    
    return () => clearInterval(interval);
  }, [liveSales.enabled, liveSales.interval]);

  return (
    <div className="relative w-full font-sans selection:bg-slate-900 selection:text-white overflow-hidden">
      
      {/* Live Sale Toast */}
      <AnimatePresence>
        {showLiveSale && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 20 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-8 left-8 z-[100] bg-white/80 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm"
          >
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">{currentSale.name} from {currentSale.location}</p>
              <p className="text-xs text-slate-500">just purchased a premium item</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Cinematic Hero Section */}
      {topBanners.length > 0 && (
        topBanners.length > 1 ? (
          <HeroSlider banners={topBanners} slug={slug} settings={settings.bannerSettings} />
        ) : (
          <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
              {/* Fallback to image if video not available, but UI looks premium */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10 pointer-events-none" />
              <EditableImage 
                src={sigSettings.heroImage || topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"} 
                slug={slug} 
                settingsKey="signatureSettings.heroImage" 
                className="w-full h-full object-cover"
                alt="Hero"
              />
              {/* Animated Overlay Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white px-4 pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, letterSpacing: "1em" }}
                  transition={{ duration: 1.5 }}
                  className="text-[10px] uppercase font-black mb-8 block text-center pointer-events-auto"
                >
                   <EditableText 
                     content={sigSettings.establishedText || "ESTABLISHED 2026"} 
                     slug={slug} 
                     settingsKey="signatureSettings.establishedText" 
                     initialStyles={sigSettings.establishedText_styles}
                     className="text-[10px] uppercase font-black" 
                   />
                 </motion.div>
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 1, delay: 0.5 }}
                   className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none text-center mb-12 mix-blend-difference pointer-events-auto"
                 >
                   <EditableText 
                     content={settings.storeName.toUpperCase()} 
                     slug={slug} 
                     settingsKey="storeName" 
                     initialStyles={settings.storeName_styles}
                     className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none text-center" 
                   />
                 </motion.div>
                 <div className="flex flex-wrap items-center justify-center gap-6 z-50 pointer-events-auto">
                    {/* Dynamic Buttons */}
                    {Array.isArray(sigSettings.heroButtons) && sigSettings.heroButtons.map((btn: any, index: number) => (
                      <MagneticButton key={btn.id || index} strength={0.2}>
                        <EditableButton 
                          label={btn.label}
                          link={btn.link}
                          slug={slug}
                          settingsKey={`signatureSettings.heroButtons.${index}`}
                          style={btn.style}
                          onDelete={async () => {
                            const buttons = Array.isArray(sigSettings.heroButtons) ? sigSettings.heroButtons : [];
                            const updated = buttons.filter((_: any, i: number) => i !== index);
                            await updateStoreSettingByKey(slug, "signatureSettings.heroButtons", updated);
                          }}
                          className="block px-10 py-5 uppercase font-bold tracking-widest hover:scale-105 transition-transform"
                        />
                      </MagneticButton>
                     ))}
                     
                     {/* Add Button Action */}
                     {isEditMode && (
                       <button 
                         onClick={async () => {
                           const currentButtons = Array.isArray(sigSettings.heroButtons) ? sigSettings.heroButtons : [];
                           const newButton = {
                             id: Math.random().toString(36).substr(2, 9),
                             label: "NEW BUTTON",
                             link: "#",
                             style: { backgroundColor: "#ffffff", textColor: "#000000" }
                           };
                           await updateStoreSettingByKey(slug, "signatureSettings.heroButtons", [...currentButtons, newButton]);
                         }}
                         className="w-12 h-12 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all active:scale-90"
                         title="Add New Button"
                       >
                         <Plus size={20} />
                       </button>
                     )}
                  </div>
              </div>
            </motion.div>
          </section>
        )
      )}

      {/* 1.5. Marquee */}
      {settings.marqueeSettings?.enabled && (
        <StoreMarquee settings={settings.marqueeSettings} />
      )}



      {/* 3. Dynamic Sale Products Section */}
      <section className="py-32 px-8 max-w-[1800px] mx-auto">
        <Reveal>
          <div className="flex items-end justify-between mb-16">
            <EditableText 
              content={sigSettings.saleProductsTitle || "Special Offers"} 
              slug={slug} 
              settingsKey="signatureSettings.saleProductsTitle" 
              initialStyles={sigSettings.saleProductsTitle_styles}
              as="h2"
              className="text-5xl font-black tracking-tighter uppercase" 
            />
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Section 03</div>
          </div>
        </Reveal>

        {saleProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-3xl">
            No active sales at the moment.
          </div>
        ) : (
          <>

        {/* Layout Selection Logic */}
        {(!settings.categoryLayout?.home && (!settings.categoryLayout || settings.categoryLayout === 'bento')) && (
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px]">
             {saleProducts.slice(0, 4).map((product: any, idx: number) => (
               <Link 
                 href={`/store/${slug}/product/${product.id}`} 
                 key={product.id}
                 className={`group relative overflow-hidden rounded-3xl ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''} ${idx === 1 ? 'md:col-span-2' : ''}`}
               >
                  <SmartImage 
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                    alt={product.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-8 right-8 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-10">
                    Sale
                  </div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-white/60 line-through text-sm">${product.price}</span>
                      <span className="text-white font-bold text-xl">${product.discount_price}</span>
                    </div>
                  </div>
               </Link>
             ))}
          </div>
        )}

        {(settings.categoryLayout?.home === 'grid' || settings.categoryLayout === 'grid') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {saleProducts.map((product: any) => (
              <Link 
                href={`/store/${slug}/product/${product.id}`} 
                key={product.id}
                className="group flex flex-col"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden relative mb-6">
                  <SmartImage 
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={product.name}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-10">
                    Sale
                  </div>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-slate-400 line-through text-sm">${product.price}</span>
                  <span className="text-red-500 font-bold">${product.discount_price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {(settings.categoryLayout?.home === 'scroll' || settings.categoryLayout === 'scroll') && (
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {saleProducts.map((product: any) => (
              <Link 
                href={`/store/${slug}/product/${product.id}`} 
                key={product.id}
                className="min-w-[400px] aspect-[16/10] rounded-3xl overflow-hidden relative group"
              >
                <SmartImage 
                  src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest z-10">
                  Sale
                </div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{product.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-white/60 line-through text-sm">${product.price}</span>
                    <span className="text-white font-bold text-xl">${product.discount_price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {(settings.categoryLayout?.home === 'list' || settings.categoryLayout === 'list') && (
          <div className="space-y-4">
            {saleProducts.map((product: any) => (
              <Link 
                href={`/store/${slug}/product/${product.id}`} 
                key={product.id}
                className="flex items-center justify-between py-12 border-b border-slate-100 group hover:px-8 transition-all duration-500"
              >
                <div>
                  <div className="bg-red-600 text-white inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Sale</div>
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-slate-400 line-through text-lg">${product.price}</span>
                    <span className="text-red-500 font-black text-2xl">${product.discount_price}</span>
                  </div>
                </div>
                <div className="w-32 h-32 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-0 group-hover:scale-100">
                  <SmartImage src={product.images?.[0]} className="w-full h-full object-cover" alt={product.name} />
                </div>
                <ArrowRight size={48} className="text-slate-200 group-hover:text-blue-600 transition-colors hidden md:block" />
              </Link>
            ))}
          </div>
        )}

        {(settings.categoryLayout?.home === 'circles' || settings.categoryLayout === 'circles') && (
          <div className="flex flex-wrap justify-center gap-12">
            {saleProducts.map((product: any) => (
              <Link 
                href={`/store/${slug}/product/${product.id}`} 
                key={product.id}
                className="flex flex-col items-center group relative"
              >
                <div className="w-48 h-48 rounded-full p-1 border-2 border-slate-100 group-hover:border-blue-600 transition-all duration-500 mb-6 relative">
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-20 shadow-lg">
                    Sale
                  </div>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <SmartImage 
                      src={product.images?.[0]} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={product.name} 
                    />
                  </div>
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest text-center max-w-[200px] truncate">{product.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-slate-400 line-through text-xs">${product.price}</span>
                  <span className="text-red-500 font-bold text-sm">${product.discount_price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
          </>
        )}
      </section>

      {/* 4. Interactive Product Showcase */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <Reveal>
                <EditableText 
                  content={sigSettings.spotlightBadge || "Product Spotlight"} 
                  slug={slug} 
                  settingsKey="signatureSettings.spotlightBadge" 
                  initialStyles={sigSettings.spotlightBadge_styles}
                  className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4 block" 
                />
                <EditableText 
                  content={sigSettings.spotlightTitle || "Crafted to Perfection."} 
                  slug={slug} 
                  settingsKey="signatureSettings.spotlightTitle" 
                  initialStyles={sigSettings.spotlightTitle_styles}
                  as="h2"
                  className="text-6xl font-black tracking-tighter leading-none mb-8" 
                />
                <EditableText 
                  content={sigSettings.spotlightDesc || "Experience the blend of artisanal tradition and modern technology in every piece we create."} 
                  slug={slug} 
                  settingsKey="signatureSettings.spotlightDesc" 
                  initialStyles={sigSettings.spotlightDesc_styles}
                  as="p"
                  className="text-slate-500 text-lg mb-12 max-w-md" 
                />
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <Check size={20} className="text-green-500" />
                       </div>
                       <EditableText 
                         content="Premium Materials Only" 
                         slug={slug} 
                         settingsKey="signatureSettings.spotlightFeature1" 
                         initialStyles={sigSettings.spotlightFeature1_styles}
                         className="font-bold" 
                       />
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <Check size={20} className="text-green-500" />
                       </div>
                       <EditableText 
                         content="Limited Edition Releases" 
                         slug={slug} 
                         settingsKey="signatureSettings.spotlightFeature2" 
                         initialStyles={sigSettings.spotlightFeature2_styles}
                         className="font-bold" 
                       />
                    </div>
                </div>
              </Reveal>
           </div>
           <div className="relative group">
              <div className="aspect-square bg-white rounded-[4rem] overflow-hidden shadow-2xl relative">
                 <SmartImage 
                   src={products[0]?.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80"}
                   className="w-full h-full object-cover"
                   alt="Featured"
                 />
                 {/* Hotspots */}
                 <motion.div 
                   whileHover={{ scale: 1.2 }}
                   className="absolute top-1/4 left-1/3 w-6 h-6 bg-white/80 backdrop-blur-md rounded-full border border-white flex items-center justify-center cursor-pointer shadow-lg"
                 >
                    <div className="w-2 h-2 bg-slate-900 rounded-full" />
                 </motion.div>
                 <motion.div 
                   whileHover={{ scale: 1.2 }}
                   className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white/80 backdrop-blur-md rounded-full border border-white flex items-center justify-center cursor-pointer shadow-lg"
                 >
                    <div className="w-2 h-2 bg-slate-900 rounded-full" />
                 </motion.div>
              </div>
           </div>
        </div>
      </section>

      {/* 4.5 Middle Banners */}
      {middleBanners.length > 0 && (
        <section className="py-20 px-8 max-w-[1800px] mx-auto">
          {middleBanners.map((banner: any) => (
            <div key={banner.id} className="relative group overflow-hidden rounded-[3rem] aspect-[21/9] mb-12 last:mb-0 shadow-2xl">
              <SmartImage 
                src={banner.imageUrl} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent p-16 flex flex-col justify-center text-white">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic">{banner.title}</h2>
                  <p className="text-xl text-white/70 max-w-xl mb-10 font-light leading-relaxed">{banner.subtitle}</p>
                  {banner.buttonText && (
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="inline-block px-12 py-6 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-slate-200 transition-all shadow-xl"
                    >
                      {banner.buttonText}
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 5. Featured Products Grid */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-24">
          <Reveal>
            <h2 className="text-5xl font-black tracking-tighter uppercase">New Drops</h2>
          </Reveal>
          <Link href={`/store/${slug}/products`} className="flex items-center gap-2 font-black uppercase tracking-widest text-xs border-b-2 border-slate-900 pb-2">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.slice(0, 8).map((product) => (
            <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col">
              <div className="aspect-[4/5] bg-slate-100 overflow-hidden rounded-3xl mb-6 relative">
                 <SmartImage 
                   src={product.images[0]}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                   alt={product.name}
                 />
                 <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <ShoppingBag size={18} />
                    </div>
                 </div>
              </div>
              <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">{product.name}</h3>
              <p className="text-sm mt-1 uppercase tracking-widest font-bold" style={{ color: 'var(--color-price)' }}>${product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Premium Testimonial Section */}
      <section 
        className="py-32 overflow-hidden relative"
        style={{ backgroundColor: 'var(--color-testimonial-bg)', color: 'var(--color-testimonial-text)' }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
           <Quote size={64} className="mx-auto mb-12 text-white/20" />
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTestimonial}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.5 }}
             >
               <h3 className="text-3xl md:text-5xl font-light italic leading-tight mb-12 min-h-[150px] flex items-center justify-center">
                 "{testimonials[activeTestimonial]?.content}"
               </h3>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 mb-4 overflow-hidden shadow-2xl border-2 border-white/10">
                     <img src={testimonials[activeTestimonial]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonials[activeTestimonial]?.name}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <p className="font-black uppercase tracking-widest text-xs">{testimonials[activeTestimonial]?.name}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{testimonials[activeTestimonial]?.role}</p>
               </div>
             </motion.div>
           </AnimatePresence>
           <div className="flex justify-center gap-2 mt-12">
             {testimonials.map((_: any, idx: number) => (
               <button
                 key={idx}
                 onClick={() => setActiveTestimonial(idx)}
                 className={`w-2 h-2 rounded-full transition-all ${idx === activeTestimonial ? 'bg-white w-6' : 'bg-white/20 hover:bg-white/50'}`}
               />
             ))}
           </div>
        </div>
      </section>

      {/* 6.5 Bottom Banners */}
      {/* 6.5 Bottom Banners */}
      {bottomBanners.length > 0 && (
        <section className="w-full">
          {bottomBanners.map((banner: any) => (
            <div key={banner.id} className="relative w-full h-[400px] md:h-[500px] overflow-hidden group border-t border-slate-100">
              <SmartImage 
                src={banner.imageUrl} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 p-12 flex flex-col items-center justify-center text-center text-white">
                <Reveal>
                  <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 italic">{banner.title}</h3>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-xl md:text-2xl text-white/80 mb-12 font-light max-w-3xl leading-relaxed">{banner.subtitle}</p>
                </Reveal>
                {banner.buttonText && (
                  <Reveal delay={0.4}>
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                      {banner.buttonText} <ArrowRight size={18} />
                    </Link>
                  </Reveal>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 7. Footer */}
      <footer className="py-24 px-8 border-t border-slate-100">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
               <h4 className="text-3xl font-black uppercase tracking-tighter mb-8">{settings.storeName}</h4>
               <p className="text-slate-500 max-w-sm mb-12">Join our exclusive inner circle for early access to limited drops and artisanal content.</p>
               <div className="flex gap-4">
                  <input type="email" placeholder="YOUR EMAIL" className="flex-1 bg-slate-50 border-none px-6 py-4 rounded-full text-xs font-bold focus:ring-2 focus:ring-slate-900 transition-all" />
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800">JOIN</button>
               </div>
            </div>
            <div>
               <h5 className="font-black uppercase tracking-widest text-xs mb-8">Navigation</h5>
               <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><Link href={`/store/${slug}/products`} className="hover:text-black">Archive</Link></li>
                  <li><Link href={`/store/${slug}/categories`} className="hover:text-black">Collections</Link></li>
                  <li><Link href={`/store/${slug}/about`} className="hover:text-black">Our Story</Link></li>
               </ul>
            </div>
            <div>
               <h5 className="font-black uppercase tracking-widest text-xs mb-8">Legal</h5>
               <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><Link href="#" className="hover:text-black">Terms</Link></li>
                  <li><Link href="#" className="hover:text-black">Privacy</Link></li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}

function Check({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
