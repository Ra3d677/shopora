"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Plus } from "lucide-react";
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
}

export default function ModernTemplate({ banners, settings, products, slug }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const featuredProducts = products.slice(0, 8);
  const modSettings = settings.modernSettings || {};
  
  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');
  
  const categories = products.reduce((acc: any[], p: any) => {
    if (!acc.find(c => c.id === p.category_id)) {
      acc.push({ id: p.category_id, name: p.category_id });
    }
    return acc;
  }, []).slice(0, 4);
  
  return (
    <div className="flex flex-col w-full font-sans">
      {/* 2. Hero Section */}
      {topBanners.length > 0 ? (
        <HeroSlider banners={topBanners} settings={settings.bannerSettings} />
      ) : (
        <section className="relative h-[80vh] w-full flex items-center bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <EditableImage 
              src={modSettings.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"} 
              alt="Hero Background" 
              slug={slug}
              settingsKey="modernSettings.heroImage"
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full mb-6">
                <EditableText 
                  content={modSettings.heroBadge || "New Arrival 2026"} 
                  slug={slug} 
                  settingsKey="modernSettings.heroBadge" 
                  initialStyles={modSettings.heroBadge_styles}
                  className="text-white text-xs font-black uppercase tracking-widest" 
                />
              </span>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                <EditableText 
                  content={modSettings.heroTitle || "THE FUTURE OF STYLE."} 
                  slug={slug} 
                  settingsKey="modernSettings.heroTitle" 
                  initialStyles={modSettings.heroTitle_styles}
                  className="text-white text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter" 
                />
              </h1>
              <p className="text-xl text-slate-300 max-w-xl mb-10 leading-relaxed">
                <EditableText 
                  content={modSettings.heroSubtitle || "Elevate your wardrobe with our latest collection of premium essentials. Crafted for those who demand excellence in every detail."} 
                  slug={slug} 
                  settingsKey="modernSettings.heroSubtitle" 
                  initialStyles={modSettings.heroSubtitle_styles}
                  className="text-xl text-slate-300 max-w-xl leading-relaxed" 
                />
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                {Array.isArray(modSettings.heroButtons) && modSettings.heroButtons.map((btn: any, index: number) => (
                  <EditableButton 
                    key={btn.id || index}
                    label={btn.label}
                    link={btn.link}
                    slug={slug}
                    settingsKey={`modernSettings.heroButtons.${index}`}
                    style={btn.style}
                    onDelete={async () => {
                      const buttons = Array.isArray(modSettings.heroButtons) ? modSettings.heroButtons : [];
                      const updated = buttons.filter((_: any, i: number) => i !== index);
                      await updateStoreSettingByKey(slug, "modernSettings.heroButtons", updated);
                    }}
                    className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl"
                  />
                ))}

                {isEditMode && (
                  <button 
                    onClick={async () => {
                      const currentButtons = Array.isArray(modSettings.heroButtons) ? modSettings.heroButtons : [];
                      const newButton = {
                        id: Math.random().toString(36).substr(2, 9),
                        label: "SHOP NOW",
                        link: "#",
                        style: { backgroundColor: "#ffffff", textColor: "#0f172a" }
                      };
                      await updateStoreSettingByKey(slug, "modernSettings.heroButtons", [...currentButtons, newButton]);
                    }}
                    className="w-14 h-14 rounded-2xl border-2 border-dashed border-white/30 flex items-center justify-center text-white hover:bg-white/10"
                  >
                    <Plus size={24} />
                  </button>
                )}

                {(!Array.isArray(modSettings.heroButtons) || modSettings.heroButtons.length === 0) && (
                   <EditableButton 
                     label="SHOP NOW"
                     link={`/store/${slug}/products`} 
                     slug={slug}
                     settingsKey="modernSettings.heroButton"
                     className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl"
                   />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Marquee */}
      {settings.marqueeSettings?.enabled && (
        <StoreMarquee settings={settings.marqueeSettings} />
      )}

      {/* 3. Categories Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                <EditableText 
                  content={modSettings.categoryTitle || "Shop by Category"} 
                  slug={slug} 
                  settingsKey="modernSettings.categoryTitle" 
                  initialStyles={modSettings.categoryTitle_styles}
                  className="text-4xl font-black text-slate-900 tracking-tighter uppercase" 
                />
              </h2>
              <p className="text-slate-500 mt-2">
                <EditableText 
                  content={modSettings.categorySubtitle || "Explore our curated collections for every occasion."} 
                  slug={slug} 
                  settingsKey="modernSettings.categorySubtitle" 
                  initialStyles={modSettings.categorySubtitle_styles}
                  className="text-slate-500 mt-2" 
                />
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.length > 0 ? categories.map((cat: any) => (
              <Link href={`/store/${slug}/products?category=${cat.id}`} key={cat.id} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all">
                <SmartImage 
                  src={`https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80`} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{cat.name}</h3>
                  <span className="text-blue-400 text-sm font-bold flex items-center gap-2 mt-2">
                    EXPLORE <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )) : (
               <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                 <p className="text-slate-400 font-medium">No categories added yet.</p>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Middle Banners */}
      {middleBanners.length > 0 && (
        <section className="py-24 px-8 bg-slate-50">
          <div className="container mx-auto space-y-24">
            {middleBanners.map((banner: any) => (
              <div key={banner.id} className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl group">
                <SmartImage src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 text-white">
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6 italic">{banner.title}</h2>
                  <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mb-10">{banner.subtitle}</p>
                  {banner.buttonText && (
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl"
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

      {/* 4. Featured Products */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              <EditableText 
                content={modSettings.productsTitle || "Trending Now"} 
                slug={slug} 
                settingsKey="modernSettings.productsTitle" 
                initialStyles={modSettings.productsTitle_styles}
                className="text-4xl font-black text-slate-900 tracking-tighter uppercase" 
              />
            </h2>
            <Link href={`/store/${slug}/products`} className="text-blue-600 font-black flex items-center gap-2 group">
              VIEW ALL <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col">
                <div className="aspect-[3/4] bg-slate-200 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <SmartImage 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl">
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="text-xl font-bold text-slate-900 truncate mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900">${product.price}</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-900" />
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    </div>
                  </div>
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
            <div key={banner.id} className="relative w-full h-[450px] md:h-[600px] overflow-hidden group">
              <SmartImage 
                src={banner.imageUrl} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-center p-12 text-white">
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8 italic">{banner.title}</h2>
                <p className="text-xl md:text-3xl font-medium opacity-90 max-w-4xl mb-12">{banner.subtitle}</p>
                {banner.buttonText && (
                  <Link 
                    href={banner.buttonLink || `/store/${slug}/products`}
                    className="bg-white text-slate-900 px-16 py-6 rounded-2xl font-black text-2xl hover:bg-blue-50 transition-all shadow-2xl"
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
