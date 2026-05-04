"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Plus } from "lucide-react";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import EditableButton from "@/components/editor/EditableButton";
import { useEditorStore } from "@/store/editor";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import SmartImage from "@/components/ui/SmartImage";
import HeroSlider from "@/components/ui/HeroSlider";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
}

export default function AmazonTemplate({ banners, settings, products, slug }: TemplateProps) {
  const { isEditMode } = useEditorStore();
  const featuredProducts = products.slice(0, 10);
  const amzSettings = settings.amazonSettings || {};
  
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
    <div className="flex flex-col w-full font-sans antialiased min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-[#232F3E]">
        {topBanners.length > 0 ? (
          <HeroSlider banners={topBanners} slug={slug} settings={{ ...settings.bannerSettings, transition: 'fade' }} />
        ) : (
          <div className="relative h-[400px] w-full flex items-center bg-gradient-to-r from-[#232F3E] to-[#131921] overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                <EditableText 
                  content={amzSettings.heroTitle || (banners.length > 0 ? banners[0].title : `Welcome to ${settings.storeName}`)} 
                  slug={slug} 
                  settingsKey="amazonSettings.heroTitle" 
                  initialStyles={amzSettings.heroTitle_styles}
                  className="text-5xl md:text-7xl font-black tracking-tighter leading-none" 
                />
              </h1>
              <p className="text-xl md:text-2xl font-medium mb-10 max-w-2xl text-slate-100">
                <EditableText 
                  content={amzSettings.heroSubtitle || (banners.length > 0 ? banners[0].subtitle : "Discover the Global Marketplace.")} 
                  slug={slug} 
                  settingsKey="amazonSettings.heroSubtitle" 
                  initialStyles={amzSettings.heroSubtitle_styles}
                  className="text-xl md:text-2xl font-medium" 
                />
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                {Array.isArray(amzSettings.heroButtons) && amzSettings.heroButtons.map((btn: any, index: number) => (
                  <EditableButton 
                    key={btn.id || index}
                    label={btn.label}
                    link={btn.link}
                    slug={slug}
                    settingsKey={`amazonSettings.heroButtons.${index}`}
                    style={btn.style}
                    onDelete={async () => {
                      const buttons = Array.isArray(amzSettings.heroButtons) ? amzSettings.heroButtons : [];
                      const updated = buttons.filter((_: any, i: number) => i !== index);
                      await updateStoreSettingByKey(slug, "amazonSettings.heroButtons", updated);
                    }}
                    className="inline-flex items-center gap-2 bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-3 rounded-md font-medium transition-colors"
                  />
                ))}

                {isEditMode && (
                  <button 
                    onClick={async () => {
                      const currentButtons = Array.isArray(amzSettings.heroButtons) ? amzSettings.heroButtons : [];
                      const newButton = {
                        id: Math.random().toString(36).substr(2, 9),
                        label: "Shop Now",
                        link: "#",
                        style: { backgroundColor: "#FFD814", textColor: "#000000" }
                      };
                      await updateStoreSettingByKey(slug, "amazonSettings.heroButtons", [...currentButtons, newButton]);
                    }}
                    className="w-12 h-12 rounded-md border-2 border-dashed border-white/30 flex items-center justify-center text-white hover:bg-white/10"
                  >
                    <Plus size={20} />
                  </button>
                )}

                {(!Array.isArray(amzSettings.heroButtons) || amzSettings.heroButtons.length === 0) && (
                   <EditableButton 
                     label="Shop Now"
                     link={`/store/${slug}/products`} 
                     slug={slug}
                     settingsKey="amazonSettings.heroButton"
                     className="inline-flex items-center gap-2 bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-3 rounded-md font-medium transition-colors"
                   />
                )}
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-50 md:opacity-100">
               <EditableImage 
                 src={amzSettings.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80"} 
                 alt="Boxes" 
                 slug={slug}
                 settingsKey="amazonSettings.heroImage"
                 className="object-cover h-[400px] w-[500px]" 
               />
            </div>
          </div>
        )}
      </section>

      {/* 2. Content Grid */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-12">
        {/* Categories Section Header */}
        <div className="bg-white p-5 rounded-t-md border-b border-gray-100 flex items-center justify-between">
           <h2 className="text-2xl font-bold">
             <EditableText 
               content={amzSettings.featuredTitle || "Featured Collections"} 
               slug={slug} 
               settingsKey="amazonSettings.featuredTitle" 
               initialStyles={amzSettings.featuredTitle_styles}
               className="text-2xl font-bold" 
             />
           </h2>
        </div>
        {/* Categories Grid (4 cards in a row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-white p-5 rounded-b-md shadow-sm h-[400px] flex flex-col">
              <h2 className="text-xl font-bold mb-4 capitalize">{cat.name}</h2>
              <div className="flex-grow relative mb-4">
                <SmartImage 
                  src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <Link href={`/store/${slug}/products?category=${cat.id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm font-medium">
                Shop now
              </Link>
            </div>
          ))}
          {categories.length === 0 && (
             <div className="col-span-full bg-white p-8 text-center rounded-md">
               <p className="text-slate-500">No categories added yet.</p>
             </div>
          )}
        </div>

        {/* Horizontal Product Scroller (Deals style) */}
        <div className="bg-white p-5 rounded-md shadow-sm mb-8">
          <div className="flex items-end gap-4 mb-4">
            <h2 className="text-xl font-bold">
              <EditableText 
                content={amzSettings.dealsTitle || "Today's Deals"} 
                slug={slug} 
                settingsKey="amazonSettings.dealsTitle" 
                initialStyles={amzSettings.dealsTitle_styles}
                className="text-xl font-bold" 
              />
            </h2>
            <Link href={`/store/${slug}/products?category=sale`} className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm font-medium">
              See all deals
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
            {featuredProducts.map((product) => (
              <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="min-w-[200px] w-[200px] group flex flex-col">
                <div className="aspect-square bg-[#F7F7F7] p-2 mb-2 relative flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <SmartImage 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-contain mix-blend-multiply" 
                    />
                  </div>
                </div>
                {product.discount_price ? (
                  <div className="mb-1">
                    <span className="bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded-sm mr-2">
                      {Math.round((1 - product.discount_price / product.price) * 100)}% off
                    </span>
                    <span className="text-[#CC0C39] text-xs font-bold">Deal</span>
                  </div>
                ) : null}
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-medium">${product.discount_price || product.price}</span>
                  {product.discount_price && (
                    <span className="text-xs text-[#565959] line-through">List: ${product.price}</span>
                  )}
                </div>
                <h3 className="text-sm text-[#0F1111] line-clamp-2 mt-1 group-hover:text-[#C7511F]">{product.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Banners */}
        {middleBanners.length > 0 && (
          <div className="space-y-6 mb-8">
            {middleBanners.map((banner: any) => (
              <div key={banner.id} className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-[350px]">
                <div className="w-full md:w-2/3 relative aspect-[4/5] md:aspect-auto h-auto md:h-full">
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
                </div>
                <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{banner.title}</h3>
                  <p className="text-gray-600 mb-8">{banner.subtitle}</p>
                  {banner.buttonText && (
                    <Link 
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className="w-full md:w-fit bg-[#FFD814] hover:bg-[#F7CA00] text-black px-8 py-3 rounded-md font-medium text-center transition-colors shadow-sm"
                    >
                      {banner.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Regular Product Grid */}
        <div className="bg-white p-5 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4">
             <EditableText 
               content={amzSettings.recommendedTitle || "Recommended based on your shopping trends"} 
               slug={slug} 
               settingsKey="amazonSettings.recommendedTitle" 
               initialStyles={amzSettings.recommendedTitle_styles}
               className="text-xl font-bold" 
             />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.slice(0, 10).map((product) => (
              <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col border border-transparent hover:border-gray-200 p-2 rounded-md transition-colors">
                <div className="aspect-square bg-[#F7F7F7] mb-3 relative flex items-center justify-center">
                  <SmartImage 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-2" 
                  />
                </div>
                <h3 className="text-sm text-[#0F1111] line-clamp-2 group-hover:text-[#C7511F]">{product.name}</h3>
                <div className="flex text-[#FFA41C] text-sm my-1">
                  <Star fill="currentColor" size={14} />
                  <Star fill="currentColor" size={14} />
                  <Star fill="currentColor" size={14} />
                  <Star fill="currentColor" size={14} />
                  <Star fill="currentColor" size={14} className="text-gray-300" />
                  <span className="text-[#007185] text-xs ml-1 hover:underline">1,024</span>
                </div>
                <div className="mt-auto">
                  <span className="text-lg font-medium">${product.discount_price || product.price}</span>
                  {product.discount_price && (
                    <span className="text-xs text-[#565959] line-through ml-1">${product.price}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Banners */}
        {bottomBanners.length > 0 && (
          <div className="space-y-6 mt-8">
          {bottomBanners.map((banner: any) => (
            <div key={banner.id} className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-[400px]">
              <div className="w-full md:w-2/3 relative aspect-[4/5] md:aspect-auto h-auto md:h-full">
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
              </div>
              <div className="w-full md:w-1/3 p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">{banner.title}</h3>
                <p className="text-gray-600 text-lg mb-8">{banner.subtitle}</p>
                {banner.buttonText && (
                  <Link 
                    href={banner.buttonLink || `/store/${slug}/products`}
                    className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-10 py-4 rounded-md font-bold text-center transition-colors shadow-sm"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
