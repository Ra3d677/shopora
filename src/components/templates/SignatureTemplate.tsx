"use client";

import React, { useState, useEffect } from "react";
import BannerButton from "@/components/ui/BannerButton";
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
import SaleSection from "@/components/ui/SaleSection";
import VideoSection from "@/components/ui/VideoSection";
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

  const homepageLayout = settings.homepageLayout || [
    { id: 'default-hero', type: 'hero' },
    { id: 'default-marquee', type: 'marquee' },
    { id: 'default-sale', type: 'sale_products' },
    { id: 'default-showcase', type: 'text_block' },
    { id: 'default-products', type: 'featured_products' },
    { id: 'default-testimonials', type: 'testimonials' }
  ];

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

      {homepageLayout.map((section: any) => {
        if (section.type === 'hero') {
          const heroStyle = section.style || 'luxury';

          if (heroStyle === 'slider') {
            return <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
          }

          if (heroStyle === 'split') {
            return (
              <section key={section.id} className="relative min-h-[80vh] md:h-screen w-full flex flex-col md:flex-row bg-transparent overflow-hidden">
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 md:p-24 text-center md:text-left bg-zinc-900">
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="max-w-xl">
                    <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white/40 mb-8 block">
                      <EditableText content={sigSettings.establishedText || "ESTABLISHED 2026"} slug={slug} settingsKey="signatureSettings.establishedText" />
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-10 uppercase italic">
                      <EditableText content={topBanners[0]?.title || settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                       {Array.isArray(sigSettings.heroButtons) && sigSettings.heroButtons.map((btn: any, index: number) => (
                         <MagneticButton key={btn.id || index} strength={0.2}>
                           <EditableButton label={btn.label} link={btn.link} slug={slug} settingsKey={`signatureSettings.heroButtons.${index}`} style={btn.style} className="block px-10 py-5 uppercase font-bold tracking-widest hover:scale-105 transition-transform" />
                         </MagneticButton>
                       ))}
                    </div>
                  </motion.div>
                </div>
                <div className="w-full md:w-1/2 relative h-full">
                  <SmartImage src={topBanners[0]?.imageUrl || sigSettings.heroImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
                </div>
              </section>
            );
          }

          if (heroStyle === 'centered') {
            return (
              <section key={section.id} className="relative min-h-[80vh] md:h-screen w-full flex flex-col items-center justify-center bg-transparent overflow-hidden text-center px-6">
                <div className="absolute inset-0 opacity-40">
                  <SmartImage src={topBanners[0]?.imageUrl || sigSettings.heroImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"} className="w-full h-full object-cover" alt="Hero Bg" />
                </div>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-5xl z-10">
                  <span className="text-[10px] uppercase font-black tracking-[1em] text-white/60 mb-12 block">
                    <EditableText content={sigSettings.establishedText || "ESTABLISHED 2026"} slug={slug} settingsKey="signatureSettings.establishedText" />
                  </span>
                  <h1 className="text-7xl md:text-[12rem] font-black text-white leading-none tracking-tighter mb-16 uppercase italic mix-blend-difference">
                    <EditableText content={settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-10">
                     {Array.isArray(sigSettings.heroButtons) && sigSettings.heroButtons.map((btn: any, index: number) => (
                       <MagneticButton key={btn.id || index} strength={0.2}>
                         <EditableButton label={btn.label} link={btn.link} slug={slug} settingsKey={`signatureSettings.heroButtons.${index}`} style={btn.style} className="block px-12 py-6 uppercase font-black tracking-widest text-sm hover:scale-110 transition-transform" />
                       </MagneticButton>
                     ))}
                  </div>
                </motion.div>
              </section>
            );
          }

          if (heroStyle === 'minimal') {
            return (
              <section key={section.id} className="relative min-h-[60vh] w-full bg-transparent flex items-center justify-center px-6">
                <div className="text-center max-w-4xl">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-300 mb-8 block">THE SIGNATURE COLLECTION</span>
                  <h1 className="text-6xl md:text-[8rem] font-black text-black leading-none tracking-tighter mb-12 uppercase italic">
                    <EditableText content={settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                  </h1>
                  <div className="flex justify-center gap-8">
                    <Link href={`/store/${slug}/products`} className="text-xs font-black uppercase tracking-[0.4em] border-b-2 border-black pb-2 hover:opacity-50 transition-opacity">
                      VIEW ARCHIVE
                    </Link>
                  </div>
                </div>
              </section>
            );
          }

          if (heroStyle === 'campaign') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 relative h-full overflow-hidden">
                  <motion.div 
                    initial={{ scale: 1.2 }} 
                    whileInView={{ scale: 1 }} 
                    transition={{ duration: 2 }}
                    className="h-full"
                  >
                    <SmartImage src={topBanners[0]?.imageUrl || sigSettings.heroImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Campaign" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/50" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 bg-slate-950 text-white">
                  <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="w-20 h-1 bg-blue-600 mb-12" />
                    <span className="text-[10px] uppercase font-black tracking-[0.5em] text-blue-500 mb-6 block">SEASONAL CAMPAIGN</span>
                    <h1 className="text-6xl md:text-9xl font-black leading-none tracking-tighter mb-12 uppercase">
                      <EditableText content={topBanners[0]?.title || settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                    </h1>
                    <div className="flex flex-wrap gap-6">
                      {Array.isArray(sigSettings.heroButtons) && sigSettings.heroButtons.map((btn: any, index: number) => (
                        <MagneticButton key={btn.id || index}>
                          <EditableButton label={btn.label} link={btn.link} slug={slug} settingsKey={`signatureSettings.heroButtons.${index}`} style={btn.style} className="block px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-xs" />
                        </MagneticButton>
                      ))}
                    </div>
                  </motion.div>
                </div>
                <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden xl:block">
                   <p className="[writing-mode:vertical-lr] text-white/5 font-black text-[15rem] leading-none select-none uppercase">SIGNATURE</p>
                </div>
              </section>
            );
          }

          if (heroStyle === 'abstract') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden flex items-center justify-center p-8">
                 <div className="absolute top-24 left-24 w-64 h-64 bg-blue-50 rounded-full blur-[100px]" />
                 <div className="absolute bottom-24 right-24 w-64 h-64 bg-slate-100 rounded-full blur-[100px]" />
                 
                 <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="order-2 lg:order-1">
                       <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="max-w-6xl z-10">
                          <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 leading-[0.8] tracking-tighter mb-12 uppercase italic">
                            <EditableText content={topBanners[0]?.title || settings.storeName?.toUpperCase() || "SIGNATURE"} slug={slug} settingsKey="storeName" />
                          </h1>
                          <p className="text-slate-400 text-xl max-w-md mb-12 font-medium">Elevating your lifestyle through exceptional design and unparalleled quality.</p>
                          <div className="flex gap-4">
                             {Array.isArray(sigSettings.heroButtons) && sigSettings.heroButtons.map((btn: any, index: number) => (
                               <EditableButton key={btn.id || index} label={btn.label} link={btn.link} slug={slug} settingsKey={`signatureSettings.heroButtons.${index}`} style={btn.style} className="px-10 py-5 border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all" />
                             ))}
                          </div>
                       </motion.div>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center">
                       <motion.div 
                         initial={{ borderRadius: "100px" }}
                         animate={{ borderRadius: ["100px", "300px", "100px"] }}
                         transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                         className="w-full max-w-lg aspect-[4/5] bg-slate-100 overflow-hidden shadow-2xl relative"
                       >
                          <SmartImage src={topBanners[0]?.imageUrl || sigSettings.heroImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" alt="Abstract" />
                          <div className="absolute inset-0 border-[20px] border-white/20 pointer-events-none" />
                       </motion.div>
                    </div>
                 </div>
              </section>
            );
          }

          if (heroStyle === 'immersive') {
            return (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden flex items-end">
                <div className="absolute inset-0">
                  <SmartImage src={topBanners[0]?.imageUrl || sigSettings.heroImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"} className="w-full h-full object-cover opacity-70" alt="Immersive" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 w-full p-12 md:p-24">
                  <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                    <div className="flex items-center gap-6 mb-12">
                       <div className="w-24 h-[1px] bg-white/40" />
                       <span className="text-[10px] uppercase font-black tracking-[0.8em] text-white/60">IMMERSIVE EXPERIENCE</span>
                    </div>
                    <h1 className="text-7xl md:text-[15rem] font-black text-white leading-none tracking-tighter mb-16 uppercase italic">
                      <EditableText content={topBanners[0]?.title || settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                    </h1>
                    <div className="flex flex-wrap gap-12 items-center">
                       {Array.isArray(sigSettings.heroButtons) && sigSettings.heroButtons.map((btn: any, index: number) => (
                         <MagneticButton key={btn.id || index}>
                           <EditableButton label={btn.label} link={btn.link} slug={slug} settingsKey={`signatureSettings.heroButtons.${index}`} style={btn.style} className="px-16 py-8 border border-white text-white font-black uppercase tracking-[0.5em] text-[10px] hover:bg-white hover:text-black transition-all" />
                         </MagneticButton>
                       ))}
                       <div className="flex items-center gap-4 text-white/40">
                          <Play size={24} fill="currentColor" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Cinema View</span>
                       </div>
                    </div>
                  </motion.div>
                </div>
              </section>
            );
          }

          // Default: Luxury (Original Design)
          return (
            <section key={section.id} className="relative min-h-[80vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
              <motion.div 
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10 pointer-events-none" />
                <SmartImage 
                  src={sigSettings.heroImage || (topBanners.length > 0 ? topBanners[0]?.imageUrl : "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80")} 
                  alt="Hero Desktop"
                  className="hidden md:block w-full h-full object-cover"
                />
                <SmartImage 
                  src={(topBanners.length > 0 ? (topBanners[0]?.mobileImageUrl || topBanners[0]?.imageUrl) : sigSettings.heroImage) || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"} 
                  alt="Hero Mobile"
                  className="md:hidden w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white px-4 pointer-events-none">
                  <motion.div 
                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                    whileInView={{ opacity: 1, letterSpacing: "1em" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    className="text-[10px] uppercase font-black mb-8 block text-center pointer-events-auto"
                  >
                     <EditableText 
                       content={sigSettings.establishedText || "ESTABLISHED 2026"} 
                       slug={slug} 
                       settingsKey="signatureSettings.establishedText" 
                       className="text-[10px] uppercase font-black" 
                     />
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 1, delay: 0.5 }}
                     className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none text-center mb-12 mix-blend-difference pointer-events-auto"
                   >
                     <EditableText 
                       content={settings.storeName?.toUpperCase() || "STORE"} 
                       slug={slug} 
                       settingsKey="storeName" 
                       className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none text-center" 
                     />
                   </motion.div>
                   <div className="flex flex-wrap items-center justify-center gap-6 z-50 pointer-events-auto">
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
          );
        }

        if (section.type === 'marquee') {
          return settings.marqueeSettings?.enabled && (
            <StoreMarquee key={section.id} settings={settings.marqueeSettings} />
          );
        }

        if (section.type === 'sale_products') {
          return (
            <section key={section.id} className="py-32 px-8 max-w-[1800px] mx-auto bg-transparent">
              <Reveal>
                <div className="flex items-end justify-between mb-16">
                  <EditableText 
                    content={sigSettings.saleProductsTitle || section.config?.title || "Special Offers"} 
                    slug={slug} 
                    settingsKey="signatureSettings.saleProductsTitle" 
                    initialStyles={sigSettings.saleProductsTitle_styles}
                    as="h2"
                    className="text-5xl font-black tracking-tighter uppercase" 
                  />
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Limited Offers</div>
                </div>
              </Reveal>

              {saleProducts.length === 0 ? (
                <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-3xl">
                  No active sales at the moment.
                </div>
              ) : (
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
            </section>
          );
        }

        if (section.type === 'text_block' || section.type === 'showcase') {
          return (
            <section key={section.id} className="py-32 bg-transparent">
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
                      <h2 className="text-6xl font-black tracking-tighter leading-none mb-8">
                        {section.config?.title || "Crafted to Perfection."}
                      </h2>
                      <p className="text-slate-500 text-lg mb-12 max-w-md">
                        {section.config?.text || "Experience the blend of artisanal tradition and modern technology in every piece we create."}
                      </p>
                      <div className="space-y-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm">
                               <Check size={20} className="text-green-500" />
                             </div>
                             <span className="font-bold">Premium Materials Only</span>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm">
                               <Check size={20} className="text-green-500" />
                             </div>
                             <span className="font-bold">Limited Edition Releases</span>
                          </div>
                      </div>
                    </Reveal>
                 </div>
                 <div className="relative group">
                    <div className="aspect-square bg-slate-50 rounded-[4rem] overflow-hidden shadow-2xl relative">
                       <SmartImage 
                         src={products[0]?.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80"}
                         className="w-full h-full object-cover"
                         alt="Featured"
                       />
                    </div>
                 </div>
              </div>
            </section>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          return (
            <div key={section.id}>
              <section className="py-1  w-full bg-transparent">
                {bannersToShow.length > 0 ? bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="relative group overflow-hidden  md: aspect-[4/5] md:aspect-[21/9] mb-12 last:mb-0 shadow-2xl">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent p-8 md:p-16 flex flex-col justify-center text-white">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                      >
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic">{banner.title}</h2>
                        <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 font-light leading-relaxed">{banner.subtitle}</p>
                        <BannerButton banner={banner} slug={slug} />
                      </motion.div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-3xl">
                    Add banners in the admin dashboard to display them here.
                  </div>
                )}
              </section>
            </div>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <section key={section.id} className="py-32 px-8 max-w-7xl mx-auto bg-transparent">
              <div className="flex items-end justify-between mb-24">
                <Reveal>
                  <h2 className="text-5xl font-black tracking-tighter uppercase">
                    {section.config?.title || "New Drops"}
                  </h2>
                </Reveal>
                <Link href={`/store/${slug}/products`} className="flex items-center gap-2 font-black uppercase tracking-widest text-xs border-b-2 border-slate-900 pb-2">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {products.slice(0, 8).map((product) => (
                  <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col">
                    <div className="aspect-[4/5] bg-slate-50 overflow-hidden rounded-3xl mb-6 relative">
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
          );
        }

        if (section.type === 'sale') {
          return <SaleSection key={section.id} section={section} products={products} slug={slug} template="signature" />;
        }

        if (section.type === 'testimonials') {
          return (
            <section 
              key={section.id}
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
          );
        }

        if (section.type === 'categories') {
          return (
            <section key={section.id} className="py-20 px-8 bg-transparent">
               <div className="max-w-7xl mx-auto">
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">
                    {section.config?.title || "Explore Collections"}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                     {categories.map((cat: any) => (
                       <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="flex flex-col items-center group">
                          <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-slate-50 group-hover:border-slate-900 transition-all duration-500 mb-4">
                             <SmartImage src={cat.image || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-black transition-colors">{cat.name}</span>
                       </Link>
                     ))}
                  </div>
               </div>
            </section>
          );
        }

        
        if (section.type === 'video') {
          return <VideoSection key={section.id} section={section} slug={slug} />;
        }

        return null;
      })}

      {/* Bottom Banners Section */}
      {bottomBanners.length > 0 && (
        <section className="py-1  w-full bg-transparent border-t border-slate-100">
          <div className="space-y-12">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative group overflow-hidden  md: aspect-[4/5] md:aspect-[21/9] shadow-2xl">
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent p-8 md:p-16 flex flex-col justify-center text-white">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic">{banner.title}</h2>
                    <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 font-light leading-relaxed">{banner.subtitle}</p>
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
