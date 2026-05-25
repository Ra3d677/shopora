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
import { useLanguageStore } from "@/store/language";
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
  session?: any;
}

export default function SignatureTemplate({ banners, settings, products, slug, categories, session }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const { t, language } = useLanguageStore();
  const { scrollYProgress } = useScroll();
  
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
              <p className="text-xs text-slate-500">{t('premiumItem')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {homepageLayout.filter((s: any) => s.type !== 'header').map((section: any, index: number) => {
        const divider = false;

        // Helper to get safe config
        const getSafeConfig = (cfg: any) => ({
          title: cfg?.title || "Welcome to our store",
          subtitle: cfg?.subtitle || "Discover amazing products",
          btnText: cfg?.btnText || "Shop Now",
          btnLink: cfg?.btnLink || "#",
          bgImage: cfg?.bgImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80",
          ...cfg
        });

        if (section.type === 'hero') {
          const heroStyle = section.style || 'luxury';
          const cfg = getSafeConfig(section.config);
          let content;

          if (heroStyle === 'slider') {
            content = <HeroSlider key={section.id} banners={topBanners} slug={slug} settings={settings.bannerSettings} />;
          } else if (heroStyle === 'split') {
            content = (
              <section key={section.id} className="relative min-h-[80vh] md:h-screen w-full flex flex-col md:flex-row bg-transparent overflow-hidden">
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 md:p-24 text-center md:text-left bg-transparent/10 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="max-w-xl">
                    <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white/40 mb-8 block">
                      <EditableText content={cfg.subtitle || sigSettings.establishedText || "ESTABLISHED 2026"} slug={slug} settingsKey="signatureSettings.establishedText" />
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-10 uppercase italic">
                      <span className="gradient-text-support">
                        <EditableText content={cfg.title || topBanners[0]?.title || settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                      </span>
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                       {Array.isArray(sigSettings.heroButtons) ? sigSettings.heroButtons.map((btn: any, index: number) => (
                         <MagneticButton key={btn.id || index} strength={0.2}>
                           <EditableButton label={btn.label || cfg.btnText || "Shop Now"} link={btn.link || cfg.btnLink || "#"} slug={slug} settingsKey={`signatureSettings.heroButtons.${index}`} style={btn.style} className="block px-10 py-5 uppercase font-bold tracking-widest hover:scale-105 transition-transform" />
                         </MagneticButton>
                       )) : (
                          <EditableButton label={cfg.btnText} link={cfg.btnLink} slug={slug} settingsKey="heroDefaultBtn" className="block px-10 py-5 uppercase font-bold tracking-widest hover:scale-105 transition-transform" />
                       )}
                    </div>
                    <BannerButton banner={topBanners[0]} slug={slug} />
                  </motion.div>
                </div>
                <div className="w-full md:w-1/2 relative h-full">
                  <SmartImage src={cfg.bgImage} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
                </div>
              </section>
            );
          } else if (heroStyle === 'centered') {
            content = (
              <section key={section.id} className="relative min-h-[80vh] md:h-screen w-full flex flex-col items-center justify-center bg-transparent overflow-hidden text-center px-6">
                <div className="absolute inset-0 opacity-40">
                  <SmartImage src={cfg.bgImage} className="w-full h-full object-cover" alt="Hero Bg" />
                </div>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-5xl z-10">
                  <span className="text-[10px] uppercase font-black tracking-[1em] text-white/60 mb-12 block">
                    <EditableText content={cfg.subtitle || sigSettings.establishedText || "ESTABLISHED 2026"} slug={slug} settingsKey="signatureSettings.establishedText" />
                  </span>
                  <h1 className="text-7xl md:text-[12rem] font-black text-white leading-none tracking-tighter mb-16 uppercase italic mix-blend-difference">
                    <span className="gradient-text-support">
                      <EditableText content={cfg.title || settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                    </span>
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-10">
                     {Array.isArray(sigSettings.heroButtons) ? sigSettings.heroButtons.map((btn: any, index: number) => (
                       <MagneticButton key={btn.id || index} strength={0.2}>
                         <EditableButton label={btn.label || cfg.btnText || "Shop Now"} link={btn.link || cfg.btnLink || "#"} slug={slug} settingsKey={`signatureSettings.heroButtons.${index}`} style={btn.style} className="block px-12 py-6 uppercase font-black tracking-widest text-sm hover:scale-110 transition-transform" />
                       </MagneticButton>
                     )) : (
                        <EditableButton label={cfg.btnText} link={cfg.btnLink} slug={slug} settingsKey="heroDefaultBtn" className="block px-12 py-6 uppercase font-black tracking-widest text-sm hover:scale-110 transition-transform" />
                     )}
                  </div>
                </motion.div>
              </section>
            );
          } else if (heroStyle === 'minimal') {
            content = (
              <section key={section.id} className="relative min-h-[60vh] w-full bg-transparent flex items-center justify-center px-6">
                <div className="text-center max-w-4xl">
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 uppercase leading-none">
                    <span className="gradient-text-support">
                      <EditableText content={cfg.title || settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                    </span>
                  </h1>
                  <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                    <EditableText content={cfg.subtitle || ""} slug={slug} settingsKey="modernSettings.heroSubtitle" />
                  </p>
                </div>
              </section>
            );
          } else if (heroStyle === 'campaign') {
            content = (
              <section key={section.id} className="relative h-screen w-full bg-transparent overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 relative h-full overflow-hidden">
                  <motion.div initial={{ scale: 1.2 }} whileInView={{ scale: 1 }} transition={{ duration: 2 }} className="h-full">
                    <SmartImage src={cfg.bgImage} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Campaign" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/50" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 bg-transparent/20 backdrop-blur-md text-white">
                  <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="w-20 h-1 bg-blue-600 mb-12" />
                    <span className="text-[10px] uppercase font-black tracking-[0.5em] text-blue-500 mb-6 block">SEASONAL CAMPAIGN</span>
                    <h1 className="text-6xl md:text-9xl font-black leading-none tracking-tighter mb-12 uppercase">
                      <span className="gradient-text-support">
                        <EditableText content={cfg.title || settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                      </span>
                    </h1>
                  </motion.div>
                </div>
              </section>
            );
          } else if (heroStyle === 'dddyou') {
             const storeName = settings.storeName || 'STORE';
             content = (
               <section key={section.id} className="relative min-h-screen w-full flex items-center bg-[#0f0f1a] overflow-hidden">
                 <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9a96e\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '60px 60px' }} />
                 <div className="max-w-7xl mx-auto px-6 text-center relative z-10 pt-32">
                   <span className="inline-block px-6 py-2 border border-[#c9a96e] rounded-full text-[#c9a96e] text-xs tracking-widest uppercase mb-8">{cfg.subtitle || 'Édition Limitée'}</span>
                   <h2 className="mb-6">
                     <span className="block text-6xl md:text-7xl font-black text-white leading-tight">{cfg.title || storeName}</span>
                     <span className="block font-['Alex_Brush'] text-6xl md:text-7xl text-[#c9a96e] font-normal mt-2">{cfg.badge || 'Luxury'}</span>
                   </h2>
                   <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">{cfg.subtitle || 'Discover the pinnacle of elegance'}</p>
                   <div className="flex gap-4 justify-center flex-wrap mb-16">
                     <a href={cfg.btnLink || '#products'} className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#b8923e] text-[#0f0f1a] font-bold shadow-lg hover:shadow-xl transition-all">{cfg.btnText || 'Explore'}</a>
                   </div>
                 </div>
               </section>
             );
          } else {
              // Default Luxury
              content = (
               <section key={section.id} className="relative min-h-[80vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
                 <div className="absolute inset-0">
                   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10 pointer-events-none" />
                   <SmartImage src={cfg.bgImage} className="w-full h-full object-cover" alt="Hero" />
                 </div>
                 <div className="relative z-20 text-white text-center px-4">
                     <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none mb-12 uppercase italic">
                       <EditableText content={cfg.title || settings.storeName?.toUpperCase() || "STORE"} slug={slug} settingsKey="storeName" />
                     </h1>
                 </div>
               </section>
             );
          }

          return <React.Fragment key={section.id}>{content}{divider}</React.Fragment>;
        }

        if (section.type === 'marquee') {
          return section.config?.enabled !== false && (
            <React.Fragment key={section.id}>
              <StoreMarquee settings={section.config as any} />
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'sale_products') {
          return (
            <React.Fragment key={section.id}>
              <section className="py-32 px-8 max-w-[1800px] mx-auto bg-transparent">
                <Reveal>
                  <div className="flex items-end justify-between mb-16">
                    <EditableText 
                      content={sigSettings.saleProductsTitle || section.config?.title || "Special Offers"} 
                      slug={slug} 
                      settingsKey="signatureSettings.saleProductsTitle" 
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
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'text_block' || section.type === 'showcase') {
          return (
            <React.Fragment key={section.id}>
              <section className="py-32 bg-transparent">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative">
                      <Reveal>
                        <EditableText 
                          content={sigSettings.spotlightBadge || "Product Spotlight"} 
                          slug={slug} 
                          settingsKey="signatureSettings.spotlightBadge" 
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
                      <div className="aspect-square bg-transparent/10 backdrop-blur-md border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl relative">
                         <SmartImage 
                           src={products[0]?.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80"}
                           className="w-full h-full object-cover"
                           alt="Featured"
                         />
                      </div>
                   </div>
                </div>
              </section>
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? [] : topBanners);
          return (
            <React.Fragment key={section.id}>
              <section className="py-1  w-full bg-transparent">
                {bannersToShow.length > 0 ? bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="relative group overflow-hidden min-h-[400px] md:h-[500px] mb-12 last:mb-0 shadow-2xl">
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
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'featured_products' || section.type === 'products') {
          return (
            <React.Fragment key={section.id}>
              <section className="py-32 px-8 max-w-7xl mx-auto bg-transparent">
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
                      <div className="aspect-[4/5] bg-transparent/10 backdrop-blur-md border border-white/10 overflow-hidden rounded-3xl mb-6 relative">
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
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'sale') {
          return (
            <React.Fragment key={section.id}>
              <SaleSection section={section} products={products} slug={slug} template="signature" />
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'testimonials') {
          const sectionTestimonials = (section.config?.items && section.config.items.length > 0) 
            ? section.config.items 
            : (settings.signatureSettings?.testimonials && settings.signatureSettings.testimonials.length > 0 
                ? settings.signatureSettings.testimonials 
                : testimonials);

          return (
            <React.Fragment key={section.id}>
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
                         "{sectionTestimonials[activeTestimonial]?.content}"
                       </h3>
                       <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-slate-800 mb-4 overflow-hidden shadow-2xl border-2 border-white/10">
                             <img src={sectionTestimonials[activeTestimonial]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sectionTestimonials[activeTestimonial]?.name}`} alt="User" className="w-full h-full object-cover" />
                          </div>
                          <p className="font-black uppercase tracking-widest text-xs">{sectionTestimonials[activeTestimonial]?.name}</p>
                          <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{sectionTestimonials[activeTestimonial]?.role}</p>
                       </div>
                     </motion.div>
                   </AnimatePresence>
                   <div className="flex justify-center gap-2 mt-12">
                     {sectionTestimonials.map((_: any, idx: number) => (
                       <button
                         key={idx}
                         onClick={() => setActiveTestimonial(idx)}
                         className={`w-2 h-2 rounded-full transition-all ${idx === activeTestimonial ? 'bg-white w-6' : 'bg-white/20 hover:bg-white/50'}`}
                       />
                     ))}
                   </div>
                </div>
              </section>
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'categories') {
          return (
            <React.Fragment key={section.id}>
              <section className="py-20 px-8 bg-transparent">
                 <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">
                      {section.config?.title || "Explore Collections"}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                       {categories.map((cat: any) => (
                         <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="flex flex-col items-center group">
                            <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/60 transition-all duration-500 mb-4 bg-transparent/10 backdrop-blur-sm">
                               <SmartImage src={cat.image || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-black transition-colors">{cat.name}</span>
                         </Link>
                       ))}
                    </div>
                 </div>
              </section>
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'about_us') {
          const title = section.config?.title || settings.tourismSettings?.aboutTitle || "Dedicated to elevating your professional journey.";
          const tagline = section.config?.tagline || settings.tourismSettings?.aboutTagline || "WHO WE ARE";
          const desc1 = section.config?.desc1 || settings.tourismSettings?.aboutDesc1 || "We provide top-tier consulting and resources for businesses and individuals looking to scale. Our approach is uniquely tailored to every client.";
          const desc2 = section.config?.desc2 || settings.tourismSettings?.aboutDesc2 || "With years of industry experience, our dedicated team ensures you have the support and strategy needed to succeed in competitive markets.";
          const image = section.config?.image || settings.tourismSettings?.aboutImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80";
          const style = section.style || 'split';

          let aboutContent;
          if (style === 'centered') {
            aboutContent = (
              <section className="py-32 bg-transparent text-center animate-in fade-in duration-500" id="about">
                <div className="max-w-4xl mx-auto px-8">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block">{tagline}</span>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-8 italic">{title}</h2>
                  <p className="text-slate-500 text-lg mb-6 leading-relaxed">{desc1}</p>
                  {desc2 && <p className="text-slate-500 text-lg mb-10 leading-relaxed">{desc2}</p>}
                </div>
                <div className="max-w-6xl mx-auto px-8 mt-12">
                  <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
                    <SmartImage src={image} alt="About Us" className="w-full h-full object-cover" />
                  </div>
                </div>
              </section>
            );
          } else if (style === 'minimal') {
            aboutContent = (
              <section className="py-32 bg-transparent animate-in fade-in duration-500" id="about">
                <div className="max-w-3xl mx-auto px-8 border-l-4 border-slate-900 pl-8 md:pl-12">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block">{tagline}</span>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-8 italic">{title}</h2>
                  <p className="text-slate-500 text-lg mb-6 leading-relaxed">{desc1}</p>
                  {desc2 && <p className="text-slate-500 text-lg leading-relaxed">{desc2}</p>}
                </div>
              </section>
            );
          } else {
            aboutContent = (
              <section className="py-32 bg-transparent animate-in fade-in duration-500" id="about">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                  <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
                    <SmartImage src={image} alt="About Us" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block">{tagline}</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-8 italic">{title}</h2>
                    <p className="text-slate-500 text-lg mb-6 leading-relaxed">{desc1}</p>
                    <p className="text-slate-500 text-lg leading-relaxed">{desc2}</p>
                  </div>
                </div>
              </section>
            );
          }

          return (
            <React.Fragment key={section.id}>
              {aboutContent}
              {divider}
            </React.Fragment>
          );
        }

        if (section.type === 'video') {
          return (
            <React.Fragment key={section.id}>
              <VideoSection section={section} slug={slug} />
              {divider}
            </React.Fragment>
          );
        }

        return null;
      })}

      {/* Bottom Banners Section */}
      {bottomBanners.length > 0 && (
        <section className="py-1  w-full bg-transparent border-t border-slate-100">
          <div className="space-y-12">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative group overflow-hidden min-h-[400px] md:h-[500px] shadow-2xl">
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
