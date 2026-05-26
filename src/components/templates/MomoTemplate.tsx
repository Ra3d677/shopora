"use client";

import React from "react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Star, Quote, ChevronRight, Play, Globe, Shield, Plus, CheckCircle2, Loader2 } from "lucide-react";

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
    { id: 'momo-categories', type: 'categories' },
    { id: 'momo-about', type: 'about_us' },
    { id: 'momo-testimonials', type: 'testimonials' },
    { id: 'momo-footer', type: 'footer' },
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
