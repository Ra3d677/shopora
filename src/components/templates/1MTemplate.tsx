"use client";

import React, { useState, useEffect } from "react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import { ShoppingBag, ArrowRight, ArrowLeft, Star, ChevronRight, ChevronLeft } from "lucide-react";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
  session?: any;
}

const HERO_SLIDES = [
  {
    subheading: "WOMEN BESTSELLER LIST",
    heading: "New collection",
    description: "New design - Elevate your style",
    buttonText: "SHOP NOW",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
  },
  {
    subheading: "SUMMER SALE",
    heading: "50% Off Women's Clothes",
    description: "Limited time offer - Don't miss out",
    buttonText: "SHOP NOW",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
  },
  {
    subheading: "MEN COLLECTION",
    heading: "New arrivals",
    description: "Explore the latest trends for men",
    buttonText: "DISCOVER",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
  },
];

const ACCENT = "#e1205e";

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="flex flex-col items-center justify-center mb-12">
    <h2 className="text-3xl md:text-[32px] leading-[1.4] font-bold text-[#333333] text-center">{title}</h2>
    <div className="w-[100px] h-[1px] my-4" style={{ backgroundColor: "#f6bcce" }} />
    {subtitle && (
      <p className="text-sm italic text-[#999999] text-center">{subtitle}</p>
    )}
  </div>
);

export default function OneMTemplate({ banners, settings, products, slug, categories, session }: TemplateProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);

  const homepageLayout = settings.homepageLayout || [
    { id: '1m-hero', type: 'hero' },
    { id: '1m-categories', type: 'categories' },
    { id: '1m-products', type: 'products' },
    { id: '1m-cta', type: 'cta_banners' },
    { id: '1m-tabbed-products', type: 'tabbed_products' },
    { id: '1m-blog', type: 'blog' },
    { id: '1m-footer', type: 'footer' },
  ];

  const allCategories = categories.length > 0 ? categories : [
    { id: 'all', name: 'All' },
  ];

  const [activeTab, setActiveTab] = useState(allCategories[0]?.id || 'all');
  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p: any) => p.category_id === activeTab);

  return (
    <div className="relative w-full font-['Poppins',sans-serif] overflow-x-hidden" style={{ backgroundColor: "#ffffff", color: "#333333" }}>
      {homepageLayout.map((section: any) => {
        if (section.type === 'hero') {
          const slide = HERO_SLIDES[currentSlide];
          return (
            <section key={section.id} className="relative w-full overflow-hidden" style={{ height: "655px" }}>
              {HERO_SLIDES.map((s, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === currentSlide ? 1 : 0 }}
                >
                  <SmartImage
                    src={s.image}
                    className="w-full h-full object-cover"
                    alt={s.heading}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 h-full flex items-center" style={{ padding: "50px" }}>
                <div className="w-full max-w-[1240px] mx-auto">
                  {HERO_SLIDES.map((s, i) => (
                    <div
                      key={i}
                      className="transition-all duration-700"
                      style={{
                        opacity: i === currentSlide ? 1 : 0,
                        transform: i === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                        display: i === currentSlide ? 'block' : 'none',
                      }}
                    >
                      <p className="text-sm md:text-base tracking-[3px] uppercase mb-5 font-normal" style={{ color: "#333333" }}>{s.subheading}</p>
                      <h1 className="text-[40px] md:text-[56px] font-bold capitalize leading-[1.18] max-w-3xl break-words" style={{ color: "#333333" }}>{s.heading}</h1>
                      <p className="text-lg mt-6 mb-8 text-[#333333]/70 max-w-xl">{s.description}</p>
                      <button
                        className="inline-block text-sm font-semibold uppercase tracking-wider px-10 py-4 border transition-colors duration-300"
                        style={{
                          borderColor: ACCENT,
                          color: "#333333",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = ACCENT;
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#333333";
                        }}
                      >
                        {s.buttonText}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-300 shadow-lg" style={{ backgroundColor: "#f7f7f7", color: "#333333" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.color = "#ffffff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f7f7f7"; e.currentTarget.style.color = "#333333"; }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-300 shadow-lg" style={{ backgroundColor: "#f7f7f7", color: "#333333" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.color = "#ffffff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f7f7f7"; e.currentTarget.style.color = "#333333"; }}>
                <ChevronRight size={16} />
              </button>
            </section>
          );
        }

        if (section.type === 'categories') {
          const categoryImages = [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          ];
          return (
            <section key={section.id} className="py-10 max-w-[1240px] mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((cat: any, idx: number) => (
                  <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="group relative overflow-hidden aspect-square">
                    <SmartImage src={cat.image || categoryImages[idx]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={cat.name} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'products') {
          return (
            <section key={section.id} className="py-16 md:py-24 max-w-[1170px] mx-auto px-6">
              <SectionHeading title="Our Products" subtitle="Best selling products" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {products.slice(0, 8).map((product: any) => (
                  <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group">
                    <div className="aspect-square overflow-hidden mb-5 bg-[#f7f7f7] relative">
                      <SmartImage
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={product.name}
                      />
                    </div>
                    <h3 className="text-base font-semibold mb-1 truncate" style={{ color: "#333333" }}>{product.name}</h3>
                    <p className="text-sm font-bold" style={{ color: ACCENT }}>${product.price}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'cta_banners') {
          return (
            <section key={section.id} className="py-10 max-w-[1750px] mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden group min-h-[435px] flex items-center justify-center" style={{ backgroundColor: "#261f1a" }}>
                  <div className="absolute inset-0">
                    <SmartImage src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="CTA 1" />
                  </div>
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="relative z-10 text-center p-8 md:p-12">
                    <p className="text-sm uppercase tracking-[2px] font-semibold mb-4 text-white/80">Use code: #Hurry</p>
                    <h3 className="text-2xl md:text-[36px] font-semibold leading-[1] mb-8 text-white">50% off Women's Clothes!</h3>
                    <button className="text-xs md:text-sm font-semibold uppercase tracking-wider px-8 py-4 text-[#333333] bg-white hover:text-white transition-colors duration-300" style={{ backgroundColor: "#ffffff", color: "#333333" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.color = "#ffffff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.color = "#333333"; }}>Shop now</button>
                  </div>
                </div>
                <Link href={`/store/${slug}/products?category=men`} className="relative overflow-hidden group min-h-[435px] flex items-center justify-center" style={{ backgroundColor: "#261f1a" }}>
                  <div className="absolute inset-0">
                    <SmartImage src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="CTA 2" />
                  </div>
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="relative z-10 text-center p-8 md:p-12">
                    <h3 className="text-2xl md:text-[36px] font-semibold leading-[1] mb-4 text-white">Men Collection</h3>
                    <p className="text-base md:text-xl italic leading-[38px] text-white/80">New arrivals</p>
                  </div>
                </Link>
              </div>
            </section>
          );
        }

        if (section.type === 'tabbed_products') {
          return (
            <section key={section.id} className="py-16 md:py-24 max-w-[1170px] mx-auto px-6">
              <SectionHeading title="Latest Products" subtitle="Best selling products" />
              {allCategories.length > 1 && (
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
                  {allCategories.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className="text-base font-medium pb-1 transition-colors border-b-2"
                      style={{
                        color: activeTab === cat.id ? "#333333" : "#999999",
                        borderColor: activeTab === cat.id ? ACCENT : "transparent",
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.slice(0, 8).map((product: any) => (
                  <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group">
                    <div className="aspect-square overflow-hidden mb-5 bg-[#f7f7f7] relative">
                      <SmartImage
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={product.name}
                      />
                    </div>
                    <h3 className="text-base font-semibold mb-1 truncate" style={{ color: "#333333" }}>{product.name}</h3>
                    <p className="text-sm font-bold" style={{ color: ACCENT }}>${product.price}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'blog') {
          const blogProducts = products.slice(0, 4);
          return (
            <section key={section.id} className="py-16 md:py-24 max-w-[1240px] mx-auto px-6 mb-8">
              <SectionHeading title="Latest news" subtitle="See our latest news" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {blogProducts.map((product: any, idx: number) => (
                  <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden mb-4 bg-[#f7f7f7] relative">
                      <SmartImage
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={product.name}
                      />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>29 Jul 2025</span>
                    <h3 className="text-sm font-semibold mb-2 leading-relaxed line-clamp-2 group-hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>{product.name || "Donec odio ipsum sagittis"}</h3>
                    <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "#999999" }}>{product.description || "Vestibulum malesuada varius mi id congue. Phasellus aliquam mollis ex..."}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-wider group-hover:opacity-60 transition-opacity" style={{ color: ACCENT }}>View more</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'footer') {
          return (
            <footer key={section.id} className="pt-16 pb-8 px-6 border-t" style={{ borderColor: "#e5e5e5", backgroundColor: "#fafafa" }}>
              <div className="max-w-[1240px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: "#333333" }}>Contact</h4>
                    <ul className="space-y-3 text-xs" style={{ color: "#999999" }}>
                      <li className="flex items-start gap-2">
                        <span>82 Valley Farms Court Grovetown</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>(546) 347-9636</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>contact@store.com</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>Mon - Sat : 8 AM - 5 PM</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: "#333333" }}>My Account</h4>
                    <ul className="space-y-3 text-xs" style={{ color: "#999999" }}>
                      <li><Link href={`/store/${slug}`} className="hover:text-[#e1205e] transition-colors">About us</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:text-[#e1205e] transition-colors">Legal Notice</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:text-[#e1205e] transition-colors">Addresses</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:text-[#e1205e] transition-colors">Order</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:text-[#e1205e] transition-colors">Payment</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: "#333333" }}>Information</h4>
                    <ul className="space-y-3 text-xs" style={{ color: "#999999" }}>
                      <li><Link href={`/store/${slug}/products`} className="hover:text-[#e1205e] transition-colors">Delivery</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:text-[#e1205e] transition-colors">Legal Notice</Link></li>
                      <li><Link href={`/store/${slug}`} className="hover:text-[#e1205e] transition-colors">About us</Link></li>
                      <li><Link href={`/store/${slug}/products?category=sale`} className="hover:text-[#e1205e] transition-colors">Prices drop</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: "#333333" }}>Newsletter</h4>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: "#999999" }}>Subscribe to our newsletter and get 10% off your first purchase</p>
                    <div className="flex border" style={{ borderColor: "#e5e5e5" }}>
                      <input type="email" placeholder="Your email address" className="flex-1 px-3 py-2.5 text-xs outline-none bg-transparent" style={{ color: "#333333" }} />
                      <button className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors" style={{ backgroundColor: ACCENT }}>OK</button>
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t text-center" style={{ borderColor: "#e5e5e5" }}>
                  <p className="text-xs" style={{ color: "#999999" }}>Copyright (c) 2026 1M Store. All Rights Reserved.</p>
                </div>
              </div>
            </footer>
          );
        }

        return null;
      })}
    </div>
  );
}
