"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import BannerButton from "@/components/ui/BannerButton";
import Link from "next/link";
import { submitClientReview } from "@/app/store/actions";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Star, Quote, ChevronRight, Play, Globe, Shield, Plus, CheckCircle2, Loader2 } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
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
    { id: 'default-marquee', type: 'marquee' },
    { id: 'default-sale', type: 'sale_products' },
    { id: 'default-showcase', type: 'text_block' },
    { id: 'default-products', type: 'featured_products' },
    { id: 'default-testimonials', type: 'testimonials', style: 'cards', config: { items: [{ id: '1', name: 'Sarah Ahmed', role: 'عميل', content: 'خدمة ممتازة وتجربة رائعة!', rating: 5 }, { id: '2', name: 'Khaled Omar', role: 'عميل', content: 'جودة المنتجات مذهلة والتوصيل سريع جداً', rating: 5 }, { id: '3', name: 'Nora Salim', role: 'عميل', content: 'أفضل متجر تعاملت معه، أنصح الجميع', rating: 5 }] } }
  ];

  return (
    <div className="relative w-full font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      
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
                  <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 min-h-[800px]">
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
                            <h3 className="text-3xl font-black uppercase tracking-tighter truncate">{product.name}</h3>
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
                        <h2 className="text-6xl font-black tracking-tighter leading-none mb-8 break-words">
                          {section.config?.title || "Crafted to Perfection."}
                        </h2>
                        <p className="text-slate-500 text-lg mb-12 max-w-md">
                          {section.config?.text || "Experience the blend of artisanal tradition and modern technology in every piece we create."}
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 min-w-0">
                               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm">
                                 <Check size={20} className="text-green-500" />
                               </div>
                               <span className="font-bold break-words">Premium Materials Only</span>
                            </div>
                            <div className="flex items-center gap-4 min-w-0">
                               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm">
                                 <Check size={20} className="text-green-500" />
                               </div>
                               <span className="font-bold break-words">Limited Edition Releases</span>
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
              <section className="w-screen max-w-none relative left-1/2 -translate-x-1/2 bg-transparent">
                {bannersToShow.length > 0 ? bannersToShow.map((banner: any) => (
                  <div key={banner.id} className="relative overflow-hidden min-h-[400px] md:h-[500px] shadow-2xl">
                    <SmartImage 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="hidden md:block absolute inset-0 w-full h-full object-cover" 
                    />
                    <SmartImage 
                      src={banner.mobileImageUrl || banner.imageUrl} 
                      alt={banner.title} 
                      className="md:hidden absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center">
                      <div>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic text-white break-words" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{banner.title}</h2>
                        <p className="text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed text-white/90 break-words" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>{banner.subtitle}</p>
                        <BannerButton banner={banner} slug={slug} />
                      </div>
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
                      <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors truncate">{product.name}</h3>
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
          const sectionItems = (section.config?.items && section.config.items.length > 0)
            ? section.config.items
            : [];
          const customerReviews = settings.signatureSettings?.testimonials || [];
          const sectionTestimonials = [...sectionItems, ...customerReviews];
          const sectionTitle = section.config?.title || '';

          const homeBg = settings.colorSystem?.backgrounds?.home || '';
          const textPrimary = settings.colorSystem?.text?.primary || '';
          const sectionStyle: CSSProperties = homeBg ? { backgroundColor: homeBg, color: textPrimary, direction: 'rtl' } : {direction: 'rtl'};

          function renderStars(rating: number) {
            return (
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(r => (
                  <Star key={r} className={`w-4 h-4 ${(rating || 5) >= r ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                ))}
              </div>
            );
          }

          return (
            <React.Fragment key={section.id}>
              <section className="py-24" style={sectionStyle}>
                <div className="max-w-7xl mx-auto px-8">
                  {sectionTitle && (
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-center mb-4 uppercase" style={{ color: textPrimary || undefined }}>{sectionTitle}</h2>
                  )}
                  {sectionItems.length === 0 && customerReviews.length === 0 ? null : (
                    <p className="text-center text-sm mb-16 max-w-xl mx-auto" style={{ color: textPrimary ? `${textPrimary}99` : '#94a3b8' }}>What our customers say about us</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {sectionItems.map((item: any) => (
                      <div key={item.id} className="bg-white rounded-2xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="mb-4">{renderStars(item.rating)}</div>
                        <p className="text-slate-600 leading-relaxed mb-8 flex-1 text-smbreak-words">"{item.content}"</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                            <img src={item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {customerReviews.map((item: any) => (
                      <div key={item.id} className="bg-white/60 rounded-2xl p-8 shadow-sm border border-slate-100/60 flex flex-col">
                        <div className="mb-4">{renderStars(item.rating)}</div>
                        <p className="text-slate-600 leading-relaxed mb-8 flex-1 text-smbreak-words">"{item.content}"</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                          {item.avatar ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                              <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold">
                              {(item.name || 'C')[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.role || 'عميل'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ReviewFormSection slug={slug} />
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
          const aboutData = settings.aboutUsContent || section.config || {};
          const title = aboutData.title || '';
          const tagline = aboutData.tagline || '';
          const desc1 = aboutData.desc1 || '';
          const desc2 = aboutData.desc2 || '';
          const image = aboutData.image || '';
          const btnText = aboutData.btnText || '';
          const btnLink = aboutData.btnLink || '#';
          const fontFamily = aboutData.fontFamily || 'inherit';
          const shadowConfig = aboutData.textShadow || null;
          const textShadowCss = shadowConfig && shadowConfig.opacity > 0
            ? `${shadowConfig.h}px ${shadowConfig.v}px ${shadowConfig.blur}px rgba(${parseInt(shadowConfig.color.slice(1,3),16)},${parseInt(shadowConfig.color.slice(3,5),16)},${parseInt(shadowConfig.color.slice(5,7),16)},${shadowConfig.opacity/100})`
            : 'none';
          const style = aboutData.style || section.style || 'split';
          const hasText = title || tagline || desc1 || desc2;

          let aboutContent;
          if (style === 'centered') {
            aboutContent = (
              <section className="py-32 bg-transparent text-center" id="about">
                <div className="max-w-4xl mx-auto px-8">
                  {tagline && <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block" style={{ fontFamily }}>{tagline}</span>}
                  {title && <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-8 italic break-words" style={{ fontFamily }}>{title}</h2>}
                  {desc1 && <div className="text-slate-500 text-lg mb-6 leading-relaxed overflow-hidden break-words" style={{ fontFamily, textShadow: textShadowCss, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: desc1 }} />}
                  {desc2 && <div className="text-slate-500 text-lg mb-10 leading-relaxed overflow-hidden break-words" style={{ fontFamily, textShadow: textShadowCss, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: desc2 }} />}
                  {btnText && <a href={btnLink} className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">{btnText}</a>}
                </div>
                {image && (
                  <div className="max-w-6xl mx-auto px-8 mt-12">
                    <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
                      <SmartImage src={image} alt="About Us" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </section>
            );
          } else if (style === 'minimal') {
            aboutContent = (
              <section className="py-32 bg-transparent" id="about">
                <div className="max-w-3xl mx-auto px-8 border-l-4 border-slate-900 pl-8 md:pl-12">
                  {tagline && <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block" style={{ fontFamily }}>{tagline}</span>}
                  {title && <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-8 italic" style={{ fontFamily }}>{title}</h2>}
                  {desc1 && <div className="text-slate-500 text-lg mb-6 leading-relaxed overflow-hidden break-words" style={{ fontFamily, textShadow: textShadowCss, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: desc1 }} />}
                  {desc2 && <div className="text-slate-500 text-lg leading-relaxed overflow-hidden break-words" style={{ fontFamily, textShadow: textShadowCss, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: desc2 }} />}
                  {btnText && <a href={btnLink} className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all mt-8">{btnText}</a>}
                </div>
              </section>
            );
          } else {
            aboutContent = (
              <section className="py-32 bg-transparent" id="about">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  {image && (
                    <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
                      <SmartImage src={image} alt="About Us" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    {tagline && <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block" style={{ fontFamily }}>{tagline}</span>}
                    {title && <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-8 italic break-words" style={{ fontFamily }}>{title}</h2>}
                  {desc1 && <div className="text-slate-500 text-lg mb-6 leading-relaxed overflow-hidden break-words" style={{ fontFamily, textShadow: textShadowCss, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: desc1 }} />}
                  {desc2 && <div className="text-slate-500 text-lg leading-relaxed overflow-hidden break-words" style={{ fontFamily, textShadow: textShadowCss, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: desc2 }} />}
                    {btnText && <a href={btnLink} className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">{btnText}</a>}
                  </div>
                </div>
              </section>
            );
          }

          if (!hasText && !image && !btnText) return null;

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
        <section className="w-screen max-w-none relative left-1/2 -translate-x-1/2 bg-transparent">
            {bottomBanners.map((banner: any) => (
              <div key={banner.id} className="relative overflow-hidden min-h-[400px] md:h-[500px] shadow-2xl">
                <SmartImage 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover" 
                />
                <SmartImage 
                  src={banner.mobileImageUrl || banner.imageUrl} 
                  alt={banner.title} 
                  className="md:hidden absolute inset-0 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center">
                  <div>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic text-white break-words" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{banner.title}</h2>
                    <p className="text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed text-white/90 break-words" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>{banner.subtitle}</p>
                    <BannerButton banner={banner} slug={slug} />
                  </div>
                </div>
              </div>
            ))}
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

function ReviewFormSection({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImageBase64(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImageBase64(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setStatus("loading");
    await submitClientReview(slug, name.trim(), "", content.trim(), rating, imageBase64 || undefined);
    setStatus("success");
    setName("");
    setContent("");
    setRating(5);
    clearImage();
    setTimeout(() => { setOpen(false); setStatus("idle"); }, 2000);
  }

  return (
    <div className="text-center mt-16">
      {!open ? (
        <button onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all">
          <Star className="w-4 h-4" /> اكتب تقييمك
        </button>
      ) : status === "success" ? (
        <div className="max-w-lg mx-auto p-8 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-500" />
          <p className="text-green-700 font-bold text-sm">شكراً لك! تم إرسال تقييمك</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-lg text-right">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">اكتب تقييمك</h3>
          <div className="flex justify-center gap-1 mb-6" dir="ltr">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setRating(s)}
                className={`transition-transform hover:scale-125 ${rating >= s ? 'text-amber-400' : 'text-slate-200'}`}>
                <Star className="w-7 h-7 fill-current" />
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="الاسم *"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-right" />
            <textarea value={content} onChange={e => setContent(e.target.value)} required placeholder="اكتب تقييمك *" rows={4}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none text-right leading-relaxed" />
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={clearImage}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 transition-colors">
                    &times;
                  </button>
                </div>
              ) : null}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 hover:bg-slate-100 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                إضافة صورة
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={status === "loading" || !name.trim() || !content.trim()}
              className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "إرسال التقييم"}
            </button>
            <button type="button" onClick={() => setOpen(false)}
              className="px-6 py-3.5 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
