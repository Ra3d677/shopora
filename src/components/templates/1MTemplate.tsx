"use client";

import React, { useState, useEffect } from "react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
  session?: any;
}

const DEFAULT_HERO_SLIDES = [
  { subheading: "WOMEN BESTSELLER LIST", heading: "New collection", description: "New design - New design", buttonText: "SHOP NOW", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80" },
  { subheading: "SUMMER SALE", heading: "50% Off Women's Clothes", description: "Limited time offer", buttonText: "SHOP NOW", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" },
  { subheading: "MEN COLLECTION", heading: "New arrivals", description: "Explore the latest trends", buttonText: "DISCOVER", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80" },
];

const SectionHeading = ({ title, subtitle, subtitle2 }: { title: string; subtitle?: string; subtitle2?: string }) => (
  <div className="flex flex-col items-center" style={{ padding: "15px" }}>
    <h2 className="text-[28px] md:text-[32px] font-bold text-center" style={{ lineHeight: "1.4", color: "var(--color-text-home, #333333)" }}>{title}</h2>
    <div style={{ paddingTop: "15px", paddingBottom: "15px" }}>
      <div className="w-[100px] h-[1px]" style={{ backgroundColor: "var(--dynamic-primary, #f6bcce)" }} />
    </div>
    {subtitle && (
      <p className="text-sm italic text-center" style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--color-text-secondary, #999999)", marginLeft: subtitle2 ? "30px" : "0" }}>
        {subtitle}
        {subtitle2 && <span className="not-italic ml-2" style={{ color: "var(--color-text-secondary, #999999)", fontSize: "14px" }}>{subtitle2}</span>}
      </p>
    )}
  </div>
);

export default function OneMTemplate({ banners, settings, products, slug, categories, session }: TemplateProps) {
  const accent = settings?.colorSystem?.brand?.primary || "#e1205e";
  const topBanners = banners.filter((b: any) => b.isActive && (b.position === 'top' || !b.position));
  const heroSlides = topBanners.length > 0
    ? topBanners.map((b: any) => ({ subheading: b.subtitle || '', heading: b.title || '', description: '', buttonText: b.buttonText || 'SHOP NOW', image: b.imageUrl }))
    : DEFAULT_HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

  const homepageLayout = [
    { id: '1m-hero', type: 'hero' },
    { id: '1m-categories', type: 'categories' },
    { id: '1m-products', type: 'products' },
    { id: '1m-cta', type: 'cta_banners' },
    { id: '1m-tabbed-products', type: 'tabbed_products' },
    { id: '1m-blog', type: 'blog' },
  ];

  const allCategories = categories.length > 0 ? categories : [{ id: 'all', name: 'All' }];
  const [activeTab, setActiveTab] = useState(allCategories[0]?.id || 'all');
  const filteredProducts = activeTab === 'all' ? products : products.filter((p: any) => p.category_id === activeTab);

  return (
    <div className="relative w-full font-['Poppins',sans-serif] overflow-x-hidden" style={{ backgroundColor: "var(--color-bg-home, #ffffff)", color: "var(--color-text-home, #333333)" }}>
      {homepageLayout.map((section: any) => {
        if (section.type === 'hero') {
          return (
            <section key={section.id} className="relative w-full overflow-hidden" style={{ marginTop: "-40px", marginBottom: "75px" }}>
              <div style={{ height: "655px" }}>
                {heroSlides.map((s, i) => (
                  <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === currentSlide ? 1 : 0, backgroundColor: "var(--color-bg-home, #ffffff)" }}>
                    <SmartImage src={s.image} className="w-full h-full object-cover" alt={s.heading} />
                  </div>
                ))}
                <div className="absolute inset-0" />
                <div className="absolute inset-0 flex items-center" style={{ padding: "50px" }}>
                  <div className="w-full max-w-[1240px] mx-auto text-center">
                    {heroSlides.map((s, i) => (
                      <div key={i} className="transition-all duration-700 text-left" style={{ opacity: i === currentSlide ? 1 : 0, display: i === currentSlide ? 'block' : 'none' }}>
                        <p className="mb-5" style={{ fontSize: "16px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "3px", lineHeight: "16px", color: "var(--color-text-home, #333333)" }}>{s.subheading}</p>
                        <h1 className="capitalize break-words" style={{ fontSize: "clamp(26px, 5vw, 56px)", fontWeight: 700, lineHeight: "clamp(36px, 5vw, 66px)", color: "var(--color-text-home, #333333)", marginBottom: "19px" }}>{s.heading}</h1>
                        <p className="max-w-2xl" style={{ fontSize: "18px", color: "var(--color-text-secondary, #666666)", marginBottom: "19px" }}>{s.description}</p>
                        <button
                          className="text-sm font-semibold uppercase tracking-wider px-10 py-4 border transition-colors duration-300"
                          style={{ borderWidth: "1px", borderColor: accent, borderRadius: "0px", color: "var(--color-text-home, #333333)", backgroundColor: "rgba(240,90,102,0)", fontWeight: 600, fontSize: "14px", textTransform: "uppercase" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#ffffff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(240,90,102,0)"; e.currentTarget.style.color = "var(--color-text-home, #333333)"; }}
                        >
                          {s.buttonText}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-colors duration-300" style={{ width: "44px", height: "44px", backgroundColor: "#f7f7f7", color: "var(--color-text-home, #333333)", borderRadius: "100px", boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#ffffff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f7f7f7"; e.currentTarget.style.color = "var(--color-text-home, #333333)"; }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-colors duration-300" style={{ width: "44px", height: "44px", backgroundColor: "#f7f7f7", color: "var(--color-text-home, #333333)", borderRadius: "100px", boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#ffffff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f7f7f7"; e.currentTarget.style.color = "var(--color-text-home, #333333)"; }}>
                <ChevronRight size={16} />
              </button>
            </section>
          );
        }

        if (section.type === 'categories') {
          const displayCats = categories.slice(0, Math.min(categories.length, 4));
          if (displayCats.length === 0) return null;
          const rowLayouts = [
            ["60%", "40%"],
            ["40%", "60%"],
          ];
          return (
            <section key={section.id} className="max-w-[1170px] mx-auto" style={{ padding: "0px 15px", marginBottom: "50px" }}>
              {[0, 2].map((start, ri) => (
                <div key={start} style={{ padding: "15px" }}>
                  <div className="flex flex-col md:flex-row" style={{ gap: "30px" }}>
                    {displayCats.slice(start, start + 2).map((cat, ci) => (
                      <Link
                        key={cat.id}
                        href={`/store/${slug}/products?category=${cat.id}`}
                        className="block group"
                        style={{ width: "100%", flex: `0 0 ${rowLayouts[ri][ci]}`, maxWidth: rowLayouts[ri][ci] }}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: "#f7f7f7" }}>
                          <SmartImage
                            src={cat.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt={cat.name}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          );
        }

        if (section.type === 'products') {
          return (
            <section key={section.id} className="max-w-[1170px] mx-auto" style={{ padding: "0px 15px", marginTop: "0px", marginBottom: "25px" }}>
              <SectionHeading title="Our Products" subtitle="Best selling products" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" style={{ marginTop: "50px" }}>
                {products.slice(0, 8).map((product: any) => (
                  <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col">
                    <div className="aspect-square overflow-hidden mb-4 relative" style={{ backgroundColor: "#f7f7f7" }}>
                      <SmartImage src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                    </div>
                    <h3 className="font-semibold mb-1 truncate" style={{ fontSize: "15px", color: "var(--color-text-home, #333333)" }}>{product.name}</h3>
                    <p className="font-bold text-sm" style={{ color: accent }}>${product.price}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'cta_banners') {
          const ctaBanners = banners.filter((b: any) => b.isActive && b.position === 'middle').slice(0, 2);
          const defaultBanners = [
            { id: 'default-1', title: "50% off Women's Clothes!", subtitle: "Use code: #Hurry", buttonText: "Shop now", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" },
            { id: 'default-2', title: "Men Collection", subtitle: "New arrivals", buttonText: "Shop now", buttonLink: `/store/${slug}/products?category=men`, imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80" },
          ];
          const displayBanners = ctaBanners.length > 0 ? ctaBanners : defaultBanners;
          return (
            <section key={section.id} className="max-w-[1750px] mx-auto" style={{ padding: "0px 15px", marginBottom: "50px" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayBanners.map((banner: any, i: number) => {
                  const content = (
                    <div className="relative overflow-hidden group flex flex-col justify-center" style={{ minHeight: "435px", backgroundColor: "#261f1a" }}>
                      <div className="absolute inset-0">
                        <SmartImage src={banner.imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-[1000ms]" alt="" />
                      </div>
                      <div className="absolute inset-0" style={{ backgroundColor: "rgba(38,31,26,0.6)", transitionDuration: "1000ms" }} />
                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 md:p-12" style={{ minHeight: "435px" }}>
                        {banner.subtitle && (
                          <p className="uppercase font-semibold mb-4 text-white/80" style={{ fontSize: "16px", lineHeight: "35px" }}>{banner.subtitle}</p>
                        )}
                        {banner.title && (
                          <h3 className="font-semibold mb-8 text-white" style={{ fontSize: "36px", lineHeight: "1em" }}>{banner.title}</h3>
                        )}
                        {banner.showButton !== false && banner.buttonText && (
                          <button className="font-semibold uppercase transition-colors duration-300 px-10 py-4" style={{ fontWeight: 600, backgroundColor: "var(--color-text-home, #ffffff)", color: "var(--color-bg-home, #333333)", border: "0px", borderRadius: "0px" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#ffffff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-text-home, #ffffff)"; e.currentTarget.style.color = "var(--color-bg-home, #333333)"; }}>{banner.buttonText}</button>
                        )}
                      </div>
                    </div>
                  );
                  return banner.buttonLink ? (
                    <Link key={banner.id || i} href={banner.buttonLink} className="block">{content}</Link>
                  ) : (
                    <div key={banner.id || i}>{content}</div>
                  );
                })}
              </div>
            </section>
          );
        }

        if (section.type === 'tabbed_products') {
          return (
            <section key={section.id} className="max-w-[1170px] mx-auto" style={{ padding: "0px 15px", marginTop: "0px", marginBottom: "15px" }}>
              <SectionHeading title="Latest Products" subtitle="Best selling products" />
              {allCategories.length > 1 && (
                <div className="flex flex-wrap justify-center gap-4 mb-8" style={{ margin: "0px 0px 15px 0px" }}>
                  {allCategories.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className="text-base font-medium pb-1 transition-colors"
                      style={{ fontSize: "18px", lineHeight: "1.4", color: activeTab === cat.id ? "var(--color-text-home, #333333)" : "var(--color-text-secondary, #999999)", margin: "10px 15px 20px 15px" }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.slice(0, 8).map((product: any) => (
                  <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col">
                    <div className="aspect-square overflow-hidden mb-4 relative" style={{ backgroundColor: "#f7f7f7" }}>
                      <SmartImage src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                    </div>
                    <h3 className="font-semibold mb-1 truncate" style={{ fontSize: "15px", color: "var(--color-text-home, #333333)" }}>{product.name}</h3>
                    <p className="font-bold text-sm" style={{ color: accent }}>${product.price}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'blog') {
          const blogProducts = products.slice(0, 4);
          return (
            <section key={section.id} className="max-w-[1170px] mx-auto" style={{ padding: "0px 15px" }}>
              <div style={{ padding: "15px" }}>
                <div className="text-left mb-6">
                  <h2 className="font-bold" style={{ fontSize: "32px", lineHeight: "1.4", color: "var(--color-text-home, #333333)" }}>Latest news</h2>
                  <div style={{ paddingTop: "15px", paddingBottom: "15px" }}>
                    <div className="w-[100px] h-[1px]" style={{ backgroundColor: "var(--dynamic-primary, #f6bcce)" }} />
                  </div>
                  <p className="italic" style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--color-text-secondary, #999999)", paddingLeft: "30px" }}>See our latest news</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" style={{ marginTop: "20px", marginBottom: "-40px" }}>
                {blogProducts.map((product: any, idx: number) => (
                  <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group flex flex-col" style={{ padding: "0 calc(20px/2)", marginBottom: "20px" }}>
                    <div className="aspect-[4/3] overflow-hidden mb-4 relative" style={{ backgroundColor: "#f7f7f7" }}>
                      <SmartImage src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                    </div>
                    <span className="font-semibold uppercase tracking-wider mb-2" style={{ fontSize: "11px", color: "var(--color-text-secondary, #999999)" }}>29 Jul 2025</span>
                    <h3 className="font-semibold mb-2 leading-relaxed line-clamp-2 group-hover:opacity-60 transition-opacity" style={{ fontSize: "14px", color: "var(--color-text-home, #333333)" }}>{product.name || "Donec odio ipsum sagittis"}</h3>
                    <p className="leading-relaxed line-clamp-2 mb-3" style={{ fontSize: "13px", color: "var(--color-text-secondary, #999999)" }}>{product.description || "Vestibulum malesuada varius mi id congue."}</p>
                    <span className="font-semibold uppercase tracking-wider group-hover:opacity-60 transition-opacity" style={{ fontSize: "11px", color: accent }}>View more</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'footer') {
          return (
            <footer key={section.id} style={{ backgroundColor: "var(--color-footer-bg, #f5f5f5)", color: "var(--color-footer-text, #666666)", padding: "60px 15px 35px 15px", marginTop: "60px" }}>
              <div className="max-w-[1170px] mx-auto">
                <div className="flex flex-wrap" style={{ margin: "0 -15px" }}>
                  <div className="w-full md:w-[30%] px-[15px] mb-8">
                    <h4 className="font-bold mb-6" style={{ fontSize: "15px", lineHeight: "15px", color: "var(--color-footer-text, #333333)" }}>Contact</h4>
                    <ul className="space-y-4" style={{ fontSize: "14px", color: "var(--color-footer-text, #666666)" }}>
                      <li style={{ paddingBottom: "7.5px" }}><span style={{ color: "var(--color-footer-text, #696969)", paddingLeft: "15px" }}>82 Valley Farms Court Grovetown</span></li>
                      <li style={{ paddingBottom: "7.5px" }}><span style={{ color: "var(--color-footer-text, #696969)", paddingLeft: "15px" }}>(546) 347-9636</span></li>
                      <li style={{ paddingBottom: "7.5px" }}><span style={{ color: "var(--color-footer-text, #696969)", paddingLeft: "15px" }}>contact@store.com</span></li>
                      <li style={{ paddingBottom: "7.5px" }}><span style={{ color: "var(--color-footer-text, #696969)", paddingLeft: "15px" }}>Mon - Sat : 8 AM - 5 PM</span></li>
                    </ul>
                  </div>
                  <div className="w-full md:w-[17%] px-[15px] mb-8">
                    <h4 className="font-bold mb-6" style={{ fontSize: "15px", lineHeight: "15px", color: "var(--color-footer-text, #333333)" }}>My Account</h4>
                    <ul style={{ fontSize: "14px", lineHeight: "32px", color: "var(--color-footer-text, #666666)" }}>
                      <li><Link href={`/store/${slug}`} className="hover:opacity-60 transition-opacity">About us</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:opacity-60 transition-opacity">Legal Notice</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:opacity-60 transition-opacity">Addresses</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:opacity-60 transition-opacity">Order</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:opacity-60 transition-opacity">Payment</Link></li>
                    </ul>
                  </div>
                  <div className="w-full md:w-[17%] px-[15px] mb-8">
                    <h4 className="font-bold mb-6" style={{ fontSize: "15px", lineHeight: "15px", color: "var(--color-footer-text, #333333)" }}>Information</h4>
                    <ul style={{ fontSize: "14px", lineHeight: "32px", color: "var(--color-footer-text, #666666)" }}>
                      <li><Link href={`/store/${slug}/products`} className="hover:opacity-60 transition-opacity">Delivery</Link></li>
                      <li><Link href={`/store/${slug}/products`} className="hover:opacity-60 transition-opacity">Legal Notice</Link></li>
                      <li><Link href={`/store/${slug}`} className="hover:opacity-60 transition-opacity">About us</Link></li>
                      <li><Link href={`/store/${slug}/products?category=sale`} className="hover:opacity-60 transition-opacity">Prices drop</Link></li>
                    </ul>
                  </div>
                  <div className="w-full md:w-[36%] px-[15px] mb-8">
                    <h4 className="font-bold mb-6" style={{ fontSize: "15px", lineHeight: "15px", color: "var(--color-footer-text, #181818)" }}>Newsletter</h4>
                    <p className="mb-4" style={{ fontSize: "14px", lineHeight: "24px", color: "var(--color-footer-text, #666666)" }}>Subscribe to our newsletter and get 10% off your first purchase</p>
                    <div className="flex" style={{ maxWidth: "270px" }}>
                      <input type="email" placeholder="Your email address" className="outline-none flex-1" style={{ height: "45px", backgroundColor: "#ffffff", border: "0px", padding: "0px 20px", color: "#7a7a7a", fontSize: "14px" }} />
                      <button style={{ width: "45px", height: "45px", backgroundColor: accent, color: "#ffffff", border: "0px", borderRadius: "0px", fontSize: "14px", padding: "16px 10px", lineHeight: 1 }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#d11d53"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent; }}>OK</button>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: "var(--color-bg-home, #ffffff)", padding: "5px 15px", marginTop: "35px" }}>
                <div className="max-w-[1170px] mx-auto flex flex-col md:flex-row items-center justify-center" style={{ minHeight: "90px" }}>
                  <p style={{ fontSize: "13px", color: "var(--color-text-home, #666666)" }}>Copyright (c) 2026 1M Store. All Rights Reserved.</p>
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
