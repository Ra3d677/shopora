"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, ArrowRight, Eye, Plus, ShoppingCart, Tag } from 'lucide-react';
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";

interface TemplateProps {
  store: any;
  banners: any[];
  settings: any;
  products: any[];
  categories: any[];
  slug: string;
}

export default function HybridDarkCommerceTemplate({ store, banners = [], settings, products, categories, slug }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const hybSettings = settings.hybridSettings || {};
  const accentColor = settings?.colors?.hybrid?.primaryAccent || '#ffffff';

  const discountedProducts = products.filter(p => p.discount_price || p.price < 500).slice(0, 3);
  const featuredProducts = products.slice(0, 8);

  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');

  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage 
            src={hybSettings.heroImage || (topBanners.length > 0 ? topBanners[0].imageUrl : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80")} 
            alt="Hero Background" 
            slug={slug}
            settingsKey="hybridSettings.heroImage"
            className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/20 via-transparent to-[#0f0f0f]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="text-xs uppercase tracking-[0.5em] text-white/60 mb-6 block font-bold">
            <EditableText 
              content={hybSettings.heroBadge || "New Collection 2026"} 
              slug={slug} 
              settingsKey="hybridSettings.heroBadge" 
              initialStyles={hybSettings.heroBadge_styles}
              className="text-white/60 text-xs uppercase tracking-[0.5em] font-bold" 
            />
          </div>
          <div className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10 uppercase italic">
            <EditableText 
              content={hybSettings.heroTitle || (topBanners.length > 0 ? topBanners[0].title : "Future Commerce.")} 
              slug={slug} 
              settingsKey="hybridSettings.heroTitle" 
              initialStyles={hybSettings.heroTitle_styles}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic" 
            />
          </div>
          <div className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium">
            <EditableText 
              content={hybSettings.heroSubtitle || (topBanners.length > 0 ? topBanners[0].subtitle : "The ultimate destination for premium digital products and physical goods.")} 
              slug={slug} 
              settingsKey="hybridSettings.heroSubtitle" 
              initialStyles={hybSettings.heroSubtitle_styles}
              className="text-lg md:text-xl text-white/50 max-w-2xl" 
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
             {Array.isArray(hybSettings.heroButtons) && hybSettings.heroButtons.map((btn: any, index: number) => (
               <EditableButton 
                 key={btn.id || index}
                 label={btn.label}
                 link={btn.link}
                 slug={slug}
                 settingsKey={`hybridSettings.heroButtons.${index}`}
                 style={btn.style}
                 onDelete={async () => {
                   const buttons = Array.isArray(hybSettings.heroButtons) ? hybSettings.heroButtons : [];
                   const updated = buttons.filter((_: any, i: number) => i !== index);
                   await updateStoreSettingByKey(slug, "hybridSettings.heroButtons", updated);
                 }}
                 className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:pr-16"
               />
             ))}

             {isEditMode && (
               <button 
                 onClick={async () => {
                   const currentButtons = Array.isArray(hybSettings.heroButtons) ? hybSettings.heroButtons : [];
                   const newButton = {
                     id: Math.random().toString(36).substr(2, 9),
                     label: "Shop Now",
                     link: "#",
                     style: { backgroundColor: "#ffffff", textColor: "#000000" }
                   };
                   await updateStoreSettingByKey(slug, "hybridSettings.heroButtons", [...currentButtons, newButton]);
                 }}
                 className="w-14 h-14 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-white hover:bg-white/10"
               >
                 <Plus size={24} />
               </button>
             )}

             {(!Array.isArray(hybSettings.heroButtons) || hybSettings.heroButtons.length === 0) && (
               <EditableButton 
                 label="Shop Now"
                 link={`/store/${slug}/products`} 
                 slug={slug}
                 settingsKey="hybridSettings.heroButton"
                 className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:pr-16"
               />
             )}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-[1px] h-12 bg-white mx-auto"></div>
        </div>
      </section>

      {/* 2. OFFER SECTION (SALES) */}
      <section className="py-24 px-6 md:px-12 bg-[#151515]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-gradient-to-r from-white/5 to-transparent p-8 md:p-16 rounded-[2rem] border border-white/5">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-white/80">
                <Tag size={14} className="text-white" /> Limited Time Only
              </div>
              <div className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                 <EditableText 
                   content="Special Offers" 
                   slug={slug} 
                   settingsKey="hybridSettings.offersTitle" 
                   initialStyles={hybSettings.offersTitle_styles}
                   className="text-4xl md:text-6xl font-black uppercase tracking-tighter" 
                 />
              </div>
              <div className="text-3xl md:text-4xl font-light italic text-white/50">
                 <EditableText 
                   content="Up to 50% OFF on selected items" 
                   slug={slug} 
                   settingsKey="hybridSettings.offersSubtitle" 
                   initialStyles={hybSettings.offersSubtitle_styles}
                   className="text-3xl md:text-4xl font-light italic text-white/50" 
                 />
              </div>
              <Link href={`/store/${slug}/products?sale=true`} className="inline-block border-b-2 border-white pb-2 font-bold uppercase tracking-widest text-sm hover:text-white/60 transition-colors">
                View All Deals
              </Link>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {discountedProducts.map((product) => (
                <div key={product.id} className="relative aspect-square bg-[#0f0f0f] rounded-2xl overflow-hidden group">
                   <SmartImage 
                     src={product.images[0]} 
                     alt={product.name} 
                     className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" 
                   />
                   <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Sale</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <div className="text-5xl font-black uppercase tracking-tighter mb-4">
                 <EditableText 
                   content="The Collection" 
                   slug={slug} 
                   settingsKey="hybridSettings.productsTitle" 
                   initialStyles={hybSettings.productsTitle_styles}
                   className="text-5xl font-black uppercase tracking-tighter" 
                 />
              </div>
              <div className="w-20 h-1.5 bg-white"></div>
            </div>
            <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold">Scroll to Explore ({products.length} Items)</p>
          </div>

          {products.length === 0 ? (
            <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <ShoppingBag size={48} className="mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-bold uppercase tracking-widest text-white/30">No products yet</h3>
              <p className="text-white/10 mt-2 italic text-sm">Stay tuned for the grand opening.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col">
                  {/* Card Container */}
                  <div className="relative aspect-[3/4] bg-[#1a1a1a] rounded-[2rem] overflow-hidden mb-6 group">
                    <SmartImage 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-500 translate-y-10 group-hover:translate-y-0">
                       <button className="w-48 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                         <Plus size={16} /> Add to Cart
                       </button>
                       <Link 
                         href={`/store/${slug}/product/${product.id}`}
                         className="w-48 py-4 border border-white/20 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                       >
                         <Eye size={16} /> View Product
                       </Link>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="px-2">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-lg font-bold uppercase tracking-tight max-w-[70%] leading-tight group-hover:text-white/60 transition-colors">
                        {product.name}
                       </h3>
                       <span className="text-lg font-medium text-white/50">${product.price}</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">{product.category_id || 'Premium'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Middle Banners */}
      {middleBanners.length > 0 && (
        <section className="py-24 px-6 md:px-12 bg-[#0a0a0a]">
          <div className="max-w-screen-2xl mx-auto space-y-24">
            {middleBanners.map((banner: any) => (
              <div key={banner.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-video rounded-[3rem] overflow-hidden group">
                  <SmartImage src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="space-y-8">
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">{banner.title}</h2>
                  <p className="text-xl text-white/40 font-medium leading-relaxed">{banner.subtitle}</p>
                  {banner.buttonText && (
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="inline-block px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white/80 transition-all"
                    >
                      {banner.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. CATEGORIES SECTION */}
      {categories.length > 0 && (
        <section className="py-32 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-screen-2xl mx-auto">
              <div className="text-3xl font-black tracking-tighter uppercase italic mb-8">
                <EditableText 
                  content={hybSettings.categoryTitle || "Shop By Department"} 
                  slug={slug} 
                  settingsKey="hybridSettings.categoryTitle" 
                  initialStyles={hybSettings.categoryTitle_styles}
                  className="text-3xl font-black tracking-tighter uppercase italic" 
                />
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link 
                  href={`/store/${slug}/products?category=${cat.id}`} 
                  key={cat.id}
                  className="group relative h-80 rounded-[2rem] overflow-hidden"
                >
                  <SmartImage 
                    src={cat.image || 'https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=800&q=80'} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-8 left-8">
                     <h3 className="text-2xl font-black uppercase tracking-tighter translate-y-4 group-hover:translate-y-0 transition-transform">{cat.name}</h3>
                     <div className="w-0 group-hover:w-full h-1 bg-white mt-2 transition-all duration-500"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Banners */}
      {bottomBanners.length > 0 && (
        <section className="w-full">
          {bottomBanners.map((banner: any) => (
            <div key={banner.id} className="relative w-full h-[400px] md:h-[550px] overflow-hidden group">
              <SmartImage 
                src={banner.imageUrl} 
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-[2s]" 
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-12 text-white">
                <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 italic">{banner.title}</h3>
                <p className="text-xl md:text-2xl text-white/60 max-w-3xl mb-12 font-medium">{banner.subtitle}</p>
                {banner.buttonText && (
                  <Link 
                    href={banner.buttonLink || `/store/${slug}/products`}
                    className="px-16 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white/80 transition-all"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Global Aesthetics Script */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
}
