"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";
import StoreMarquee from "@/components/ui/StoreMarquee";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function MinimalTemplate({ banners, settings, products, slug, categories }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const featuredProducts = products.slice(0, 6);
  const displayCategories = categories.slice(0, 3);
  const minSettings = settings.minimalSettings || {};
  
  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');
  
  return (
    <div className="flex flex-col w-full font-light antialiased">
      {/* 2. Hero Section */}
      <section className="py-16 md:py-32 px-6 md:px-12 border-b border-zinc-100 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
            <div className="max-w-2xl">
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-6 md:mb-8 block">
                <EditableText 
                  content={minSettings.heroBadge || "Collection Nº 01"} 
                  slug={slug} 
                  settingsKey="minimalSettings.heroBadge" 
                  initialStyles={minSettings.heroBadge_styles}
                  className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]" 
                />
              </div>
              <div className="text-6xl md:text-[10vw] font-bold leading-[0.85] tracking-tighter uppercase mb-8 md:mb-12">
                <EditableText 
                  content={minSettings.heroTitle || "Pure Form."} 
                  slug={slug} 
                  settingsKey="minimalSettings.heroTitle" 
                  initialStyles={minSettings.heroTitle_styles}
                  className="text-7xl md:text-[10vw] font-bold leading-[0.85] tracking-tighter uppercase" 
                />
              </div>
              <div className="text-lg md:text-2xl text-zinc-500 leading-relaxed italic max-w-lg">
                <EditableText 
                  content={minSettings.heroSubtitle || "“Design is not just what it looks like and feels like. Design is how it works.”"} 
                  slug={slug} 
                  settingsKey="minimalSettings.heroSubtitle" 
                  initialStyles={minSettings.heroSubtitle_styles}
                  className="text-xl md:text-2xl text-zinc-500 leading-relaxed italic" 
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full lg:w-auto justify-center lg:justify-end mt-8 lg:mt-0">
               {Array.isArray(minSettings.heroButtons) && minSettings.heroButtons.map((btn: any, index: number) => (
                 <EditableButton 
                   key={btn.id || index}
                   label={btn.label}
                   link={btn.link}
                   slug={slug}
                   settingsKey={`minimalSettings.heroButtons.${index}`}
                   style={btn.style}
                   onDelete={async () => {
                     const buttons = Array.isArray(minSettings.heroButtons) ? minSettings.heroButtons : [];
                     const updated = buttons.filter((_: any, i: number) => i !== index);
                     await updateStoreSettingByKey(slug, "minimalSettings.heroButtons", updated);
                   }}
                   className="w-48 h-48 rounded-full border border-zinc-200 flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-500"
                 />
               ))}

               {isEditMode && (
                 <button 
                   onClick={async () => {
                     const currentButtons = Array.isArray(minSettings.heroButtons) ? minSettings.heroButtons : [];
                     const newButton = {
                       id: Math.random().toString(36).substr(2, 9),
                       label: "DISCOVER",
                       link: "#",
                       style: { backgroundColor: "transparent", textColor: "#18181b" }
                     };
                     await updateStoreSettingByKey(slug, "minimalSettings.heroButtons", [...currentButtons, newButton]);
                   }}
                   className="w-16 h-16 rounded-full border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-all"
                 >
                   <Plus size={20} />
                 </button>
               )}

               {(!Array.isArray(minSettings.heroButtons) || minSettings.heroButtons.length === 0) && (
                 <EditableButton 
                   label="Discover" 
                   link={`/store/${slug}/products`} 
                   slug={slug}
                   settingsKey="minimalSettings.heroButton"
                   className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-zinc-200 flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-500"
                 />
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      {settings.marqueeSettings?.enabled && (
        <StoreMarquee settings={settings.marqueeSettings} />
      )}

      {/* 3. Series (Categories) */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-zinc-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {displayCategories.map((cat: any) => (
              <Link href={`/store/${slug}/products?category=${cat.id}`} key={cat.id} className="group relative aspect-[3/4] bg-white overflow-hidden border border-zinc-100">
                <SmartImage 
                  src={cat.image || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80`} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
                <div className="absolute bottom-10 left-10">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white mb-2 block opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">View Series</span>
                   <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Middle Banners */}
      {middleBanners.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12 bg-white border-y border-zinc-100">
          <div className="max-w-screen-2xl mx-auto space-y-12">
            {middleBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[4/5] md:aspect-[21/9] overflow-hidden group">
                <SmartImage 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105" 
                />
                <SmartImage 
                  src={banner.mobileImageUrl || banner.imageUrl} 
                  alt={banner.title} 
                  className="md:hidden absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 md:p-12 text-white">
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">{banner.title}</h2>
                  <p className="text-lg md:text-xl font-light italic opacity-80 mb-8">{banner.subtitle}</p>
                  {banner.buttonText && (
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="px-8 py-3 md:px-10 md:py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-500"
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

      {/* 4. The Archive (Products) */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-baseline justify-between mb-20 border-b border-zinc-200 pb-12">
             <div className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">
               <EditableText 
                 content={minSettings.productsTitle || "The Archive"} 
                 slug={slug} 
                 settingsKey="minimalSettings.productsTitle" 
                 initialStyles={minSettings.productsTitle_styles}
                 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter" 
               />
            </div>
            <p className="text-zinc-400 uppercase tracking-[0.3em] text-[10px] font-bold">Scroll to Explore ({products.length} Items)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {featuredProducts.map((product: any) => (
              <div key={product.id} className="group flex flex-col">
                <Link href={`/store/${slug}/product/${product.id}`} className="block">
                  <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden mb-6">
                    <SmartImage 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                    />
                  </div>
                </Link>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-1">{product.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{product.category_id}</p>
                  </div>
                  <span className="font-mono text-sm">${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Banners */}
      {bottomBanners.length > 0 && (
        <section className="w-full">
          {bottomBanners.map((banner: any) => (
            <div key={banner.id} className="relative w-full aspect-[4/5] md:h-[500px] md:aspect-auto overflow-hidden group">
              <SmartImage 
                src={banner.imageUrl} 
                className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" 
                alt={banner.title}
              />
              <SmartImage 
                src={banner.mobileImageUrl || banner.imageUrl} 
                className="md:hidden absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" 
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-8 md:p-12 text-white">
                <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-6">{banner.title}</h2>
                <p className="text-xl font-light italic opacity-80 mb-10 max-w-2xl">{banner.subtitle}</p>
                {banner.buttonText && (
                  <Link 
                    href={banner.buttonLink || `/store/${slug}/products`}
                    className="px-10 py-4 md:px-12 md:py-4 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-500"
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
