"use client";

import React from "react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Star, Quote, ChevronRight, Play, Globe, Shield, Plus, CheckCircle2, Loader2 } from "lucide-react";
import BannerButton from "@/components/ui/BannerButton";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
  session?: any;
}

export default function MomoTemplate({ banners, settings, products, slug, categories, session }: TemplateProps) {
  const topBanners = banners.filter((b: any) => b.position === 'top' || !b.position);
  const middleBanners = banners.filter((b: any) => b.position === 'middle');
  const bottomBanners = banners.filter((b: any) => b.position === 'bottom');

  const homepageLayout = settings.homepageLayout || [
    { id: 'momo-hero', type: 'hero' },
    { id: 'momo-featured-products', type: 'featured_products' },
    { id: 'momo-banners', type: 'banners' },
    { id: 'momo-categories', type: 'categories' },
    { id: 'momo-about', type: 'about_us' },
    { id: 'momo-testimonials', type: 'testimonials' },
    { id: 'momo-footer', type: 'footer' },
  ];

  const defaultBanners = [
    { id: 'momo-default-1', title: "Summer Sale", subtitle: "Up to 50% off on selected items", buttonText: "Shop Now", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80" },
    { id: 'momo-default-2', title: "New Collection", subtitle: "Explore the latest trends for this season", buttonText: "Discover", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80" },
  ];

  return (
    <div className="relative w-full font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      {homepageLayout.map((section: any) => {
        if (section.type === 'hero') {
          return (
            <section key={section.id} className="py-32 bg-slate-50">
              <div className="max-w-7xl mx-auto px-8 text-center">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">MOMO Template</h1>
                <p className="text-slate-500 text-lg mb-12">A modern and minimalist template for your store.</p>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest">Shop Now</button>
              </div>
            </section>
          );
        }

        if (section.type === 'featured_products') {
          return (
            <section key={section.id} className="py-32">
              <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-16">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.slice(0, 4).map((product: any) => (
                    <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col">
                      <div className="aspect-[4/5] bg-transparent/10 backdrop-blur-md border border-white/10 overflow-hidden rounded-3xl mb-6 relative">
                        <SmartImage
                          src={product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          alt={product.name}
                        />
                      </div>
                      <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors truncate">{product.name}</h3>
                      <p className="text-sm mt-1 uppercase tracking-widest font-bold" style={{ color: 'var(--color-price)' }}>${product.price}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'banners') {
          const bannersToShow = middleBanners.length > 0 ? middleBanners : defaultBanners;
          return (
            <section key={section.id} className="py-32 bg-slate-50/50">
              <div className="max-w-7xl mx-auto px-8 space-y-8">
                {bannersToShow.map((banner: any, i: number) => (
                  <Link
                    key={banner.id || i}
                    href={banner.buttonLink || `/store/${slug}/products`}
                    className="group relative min-h-[350px] md:min-h-[420px] rounded-3xl overflow-hidden block bg-slate-100"
                  >
                    <SmartImage
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 flex flex-col items-center justify-end text-center p-10 md:p-16 min-h-[350px] md:min-h-[420px]">
                      {banner.subtitle && (
                        <p className="text-white/70 text-sm font-bold uppercase tracking-[0.3em] mb-4">{banner.subtitle}</p>
                      )}
                      {banner.title && (
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6">{banner.title}</h2>
                      )}
                      {banner.showButton !== false && banner.buttonText && (
                        <span className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:bg-slate-100 shadow-xl group/link">
                          {banner.buttonText} <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'categories') {
          return (
            <section key={section.id} className="py-32">
              <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-16">Categories</h2>
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
          );
        }

        if (section.type === 'about_us') {
          return (
            <section key={section.id} className="py-32 bg-slate-100">
              <div className="max-w-7xl mx-auto px-8 text-center">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-8">About Us</h2>
                <p className="text-slate-500 text-lg mb-12">Tell your brand's story here.</p>
              </div>
            </section>
          );
        }

        if (section.type === 'testimonials') {
          return (
            <section key={section.id} className="py-32">
              <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-16 text-center">Testimonials</h2>
              </div>
            </section>
          );
        }

        if (section.type === 'footer') {
          return (
            <footer key={section.id} className="py-12 bg-slate-800 text-white text-center">
              <p className="text-sm">© 2026 MOMO. All rights reserved.</p>
            </footer>
          );
        }

        return null;
      })}
    </div>
  );
}
