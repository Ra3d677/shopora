"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Menu, X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
  session?: any;
  store?: any;
}

const accent = "#ff7245";
const bgLight = "#eff6f6";

export default function ThreeMTemplate({ store, products, slug, categories }: TemplateProps) {
  const storeName = store?.name || "Premium Store";
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = items.filter((i: any) => i.storeId === store?.id).length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("featured");
  const [featuredIdx, setFeaturedIdx] = useState(0);

  const heroSlides = [
    { subtitle: "Up to 15% off", title: "Diana diamante<br/>clutch bag", description: "Change up the straps to suit your mood. Wear them two<br/>ways for two different looks", buttonText: "Shop now", image: "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/slide_h1_1.webp?v=1768875495", align: "right" },
    { subtitle: "Up to 15% off", title: "Diana diamante<br/>clutch bag", description: "Change up the straps to suit your mood. Wear them two<br/>ways for two different looks", buttonText: "Shop now", image: "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/slide_h1_2.webp?v=1768875500", align: "left" },
  ];

  const ctaBanners = [
    { imageUrl: "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/banner_h1_1.jpg?v=1768881903", title: "Kipling Cool organised", subtitle: "New arrival", description: "The bold fun design features multiple pockets organised with secure zips to keep", buttonText: "see more" },
    { imageUrl: "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/banner_h1_2.jpg?v=1768884212", title: "Urbana Bag shoulder", subtitle: "New arrival", description: "The bold fun design features multiple organised with secure zips", buttonText: "see more" },
  ];

  const getTabProducts = () => {
    if (activeTab === "featured") {
      const sale = products.filter((p: any) => p.discount_price);
      return sale.length > 0 ? sale : products.slice(3, 9);
    }
    if (activeTab === "latest") {
      return [...products].sort((a: any, b: any) => {
        const da = a.createdAt || a.created_at;
        const db = b.createdAt || b.created_at;
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(db).getTime() - new Date(da).getTime();
      });
    }
    return [...products].reverse();
  };

  const navLinks = [
    { label: "Home", href: `/store/${slug}` },
    { label: "Products", href: `/store/${slug}/products` },
    { label: "Cart", href: `/store/${slug}/cart` },
    { label: "Contact", href: `/store/${slug}/contact` },
  ];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins,sans-serif" }}>
      {/* HEADER */}
      <header className="w-full bg-white" style={{ zIndex: 10000 }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: "1400px", padding: "0 20px", height: "70px" }}>
          <div className="flex items-center gap-6" style={{ flex: "0 0 auto" }}>
            <button onClick={() => setMobileMenuOpen(true)} className="flex items-center justify-center cursor-pointer lg:hidden" style={{ width: "40px", height: "40px" }}>
              <Menu size={22} />
            </button>
            <Link href={`/store/${slug}`} className="font-bold tracking-tight text-lg" style={{ fontFamily: "Poppins,sans-serif", color: "#000000" }}>
              {storeName}
            </Link>
          </div>
          <nav className="hidden lg:flex items-center justify-center gap-8" style={{ flex: "1 1 auto" }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity" style={{ fontFamily: "Poppins,sans-serif", color: "#000000" }}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2" style={{ flex: "0 0 auto" }}>
            <Link href={`/store/${slug}/search`} className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity"><Search size={20} /></Link>
            <Link href={`/store/${slug}/account`} className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity"><User size={20} /></Link>
            <Link href={`/store/${slug}/wishlist`} className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity relative">
              <Heart size={20} />
              {wishlistItems.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full" style={{ backgroundColor: accent }}>{wishlistItems.length}</span>}
            </Link>
            <Link href={`/store/${slug}/cart`} className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full" style={{ backgroundColor: accent }}>{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/20 lg:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl" style={{ padding: "20px" }}>
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">{storeName}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="cursor-pointer"><X size={22} /></button>
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:opacity-60 transition-opacity">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SLIDESHOW */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ height: "clamp(400px, 50vw, 900px)", position: "relative", backgroundColor: "#ffffff" }}>
          {heroSlides.map((slide: any, idx: number) => (
            <div key={idx} style={{
              position: "absolute", inset: 0,
              opacity: idx === currentSlide ? 1 : 0,
              transition: "opacity 0.8s ease",
              display: "flex", alignItems: "center",
              pointerEvents: idx === currentSlide ? "auto" : "none",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} />
              <div style={{ position: "relative", width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
                <div style={{ maxWidth: "500px", textAlign: "center", ...(slide.align === "left" ? { marginLeft: "0", marginRight: "auto" } : { marginLeft: "auto", marginRight: "0" }) }}>
                  {slide.subtitle && <p style={{ fontSize: "14px", marginBottom: "10px", color: "#666" }}>{slide.subtitle}</p>}
                  {slide.title && <h2 style={{ fontSize: "clamp(32px, 5vw, 62px)", fontWeight: 500, lineHeight: 1.2, marginBottom: "15px", color: "#000" }} dangerouslySetInnerHTML={{ __html: slide.title }} />}
                  {slide.buttonText && (
                    <Link href={slide.buttonLink || `/store/${slug}/products`} className="inline-block text-sm font-medium uppercase tracking-wider text-white transition-all" style={{ padding: "12px 30px", borderRadius: "30px", backgroundColor: "#000000" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}>
                      {slide.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
          {heroSlides.length > 1 && (
            <>
              <button onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white shadow-md transition-all z-10 cursor-pointer rounded-full">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)} className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white shadow-md transition-all z-10 cursor-pointer rounded-full">
                <ChevronRight size={20} />
              </button>
              <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 }}>
                {heroSlides.map((_: any, idx: number) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className="cursor-pointer" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: idx === currentSlide ? "#000" : "#ccc", transition: "background 0.3s" }} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA BANNERS */}
      {ctaBanners.slice(0, 2).map((banner: any, i: number) => (
        <section key={i} style={{ padding: "40px 0", backgroundColor: "#ffffff" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
            <div style={{ display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
                <div style={{ overflow: "hidden", backgroundColor: "#f5f5f5" }}>
                  <img src={banner.imageUrl} alt={banner.title || "Banner"} className="hover:scale-105 transition-transform duration-500" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                </div>
              </div>
              <div style={{ flex: "1 1 45%", minWidth: "300px", padding: i % 2 === 0 ? "0 0 0 40px" : "0 40px 0 0", textAlign: "left" }}>
                {banner.subtitle && <p style={{ fontSize: "14px", color: "#999", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Poppins,sans-serif" }}>{banner.subtitle}</p>}
                {banner.title && <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 500, color: "#000", marginBottom: "15px", lineHeight: 1.3, fontFamily: "Poppins,sans-serif" }}>{banner.title}</h3>}
                {banner.description && <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", lineHeight: 1.6, fontFamily: "Poppins,sans-serif" }}>{banner.description}</p>}
                <Link href={`/store/${slug}/products`} className="inline-block text-xs font-medium uppercase tracking-wider text-white transition-all" style={{ padding: "10px 28px", borderRadius: "30px", backgroundColor: "#000000", fontFamily: "Poppins,sans-serif" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}>
                  {banner.buttonText || "see more"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* BEST SELLER with tabs */}
      <section style={{ padding: "100px 0 80px", backgroundColor: bgLight }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "clamp(22px, 2.5vw, 30px)", fontWeight: 600, color: "#000", fontFamily: "Poppins,sans-serif", letterSpacing: "0.3px" }}>Best Seller</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "35px", marginBottom: "40px", borderBottom: 0 }}>
            {[
              { key: "featured", label: "Featured" },
              { key: "latest", label: "Latest" },
              { key: "topRated", label: "Top Rating" },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "0 0 8px",
                  fontSize: "13px",
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                  fontFamily: "Poppins,sans-serif",
                  color: activeTab === tab.key ? "#000" : "#999",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.key ? `2px solid ${accent}` : "2px solid transparent",
                  transition: "all 0.3s",
                }}>
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", rowGap: "0" }}>
            {getTabProducts().slice(0, 3).map((product: any, idx: number) => {
              const img = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80";
              const hasDiscount = product.discount_price && product.compare_price;
              const onSale = product.discount_price || product.compare_at_price;
              const salePrice = product.discount_price || product.price;
              const comparePrice = product.compare_price || product.compare_at_price;
              return (
                <div key={product.id} style={{ backgroundColor: "#fff", borderRight: idx < 2 ? "1px solid #eee" : "none" }}>
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <Link href={`/store/${slug}/product/${product.id}`}>
                      <img src={img} alt={product.name || product.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                        className="hover:scale-105" />
                    </Link>
                    {onSale && (
                      <div style={{ position: "absolute", top: "15px", left: "15px", backgroundColor: accent, color: "#fff", fontSize: "11px", fontWeight: 600, padding: "3px 12px", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "Poppins,sans-serif" }}>
                        Sale
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: "15px", right: "15px", display: "flex", flexDirection: "column", gap: "8px", opacity: 0, transition: "opacity 0.3s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}>
                      <button style={{ width: "40px", height: "40px", backgroundColor: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", transition: "all 0.2s", color: "#333" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#333"; }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                      </button>
                      <button style={{ width: "40px", height: "40px", backgroundColor: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", transition: "all 0.2s", color: "#333" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#333"; }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                      </button>
                      <button style={{ width: "40px", height: "40px", backgroundColor: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", transition: "all 0.2s", color: "#333" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#333"; }}>
                        <Heart size={15} />
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px 25px", textAlign: "center" }}>
                    <Link href={`/store/${slug}/product/${product.id}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 400, color: "#000", marginBottom: "10px", fontFamily: "Poppins,sans-serif", lineHeight: 1.4 }}>{product.name || product.title}</h3>
                    </Link>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: onSale ? 600 : 400, color: onSale ? accent : "#000", fontFamily: "Poppins,sans-serif" }}>${salePrice}</span>
                      {comparePrice && <span style={{ fontSize: "13px", color: "#bbb", textDecoration: "line-through", fontFamily: "Poppins,sans-serif" }}>${comparePrice}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORY BANNERS */}
      <section style={{ padding: "80px 0", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}>
            {categories.filter((c: any) => !c.parentId).slice(0, 2).map((cat: any) => (
              <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="group block relative overflow-hidden">
                <img src={cat.image || "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=700&q=80"} alt={cat.name}
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-500" />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                  <h3 className="text-white text-xl font-medium">{cat.name}</h3>
                </div>
              </Link>
            ))}
            {categories.filter((c: any) => !c.parentId).length === 0 && (
              <>
                <Link href={`/store/${slug}/products`} className="group block relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=700&q=80" alt="Women" className="group-hover:scale-105 transition-transform duration-500" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}><h3 className="text-white text-xl font-medium">Women</h3></div>
                </Link>
                <Link href={`/store/${slug}/products`} className="group block relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&q=80" alt="Men" className="group-hover:scale-105 transition-transform duration-500" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}><h3 className="text-white text-xl font-medium">Men</h3></div>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS - carousel matching Netro product-v1 */}
      <section style={{ padding: "100px 0", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "clamp(30px, 1.25cqw + 2.5rem, 40px)", fontWeight: 500, color: "#000", fontFamily: "Poppins,sans-serif", marginBottom: "8px" }}>Iconic products</h2>
            <p style={{ fontSize: "16px", color: "#666", fontFamily: "Poppins,sans-serif" }}>Discover our Bags collection: How to use & style</p>
          </div>

          {/* Centered Carousel Wrapper */}
          <div style={{ position: "relative", width: "100%", overflow: "hidden", padding: "20px 0" }}>
            {/* Nav Arrows */}
            <div className="hidden md:flex" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", width: "100%", justifyContent: "space-between", pointerEvents: "none", zIndex: 10, left: 0, right: 0 }}>
              <button 
                onClick={() => setFeaturedIdx((prev) => Math.max(0, prev - 1))}
                className="custom-nav-btn prev"
                style={{ pointerEvents: "auto", marginLeft: "20px" }}
                aria-label="Slide left"
              >
                <div className="icon-before"><ChevronLeft size={20} /></div>
                <div className="icon-after"><ChevronLeft size={20} /></div>
              </button>
              <button 
                onClick={() => setFeaturedIdx((prev) => Math.min(Math.max(0, products.slice(3, 9).length - 1), prev + 1))}
                className="custom-nav-btn next"
                style={{ pointerEvents: "auto", marginRight: "20px" }}
                aria-label="Slide right"
              >
                <div className="icon-before"><ChevronRight size={20} /></div>
                <div className="icon-after"><ChevronRight size={20} /></div>
              </button>
            </div>

            {/* Slider track container */}
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <div style={{ width: "280px", position: "relative" }}>
                <div style={{
                  display: "flex",
                  gap: "40px",
                  transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  transform: `translateX(calc(50% - ${(featuredIdx * (280 + 40)) + 280 / 2}px))`,
                  width: "max-content",
                }}>
                  {products.slice(3, 9).map((product: any, idx: number) => {
                    const isActive = idx === featuredIdx;
                    const img = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80";
                    const hasDiscount = product.discount_price && product.price;

                    // Hardcoded Netro video loops for the 6 items
                    const videoUrls = [
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/videos/c/vp/db11272eadaf4feea868f6fa23520ccc/db11272eadaf4feea868f6fa23520ccc.SD-480p-1.5Mbps-67402175.mp4",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/videos/c/vp/583572d6eaa545078cc2d38d00fdd824/583572d6eaa545078cc2d38d00fdd824.SD-480p-1.5Mbps-67402643.mp4",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/videos/c/vp/30c47ed425b44de2a2a16219cc741603/30c47ed425b44de2a2a16219cc741603.SD-480p-1.0Mbps-67403120.mp4",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/videos/c/vp/6d6e78a6d0a240a0a7199bd6b697aaaa/6d6e78a6d0a240a0a7199bd6b697aaaa.SD-480p-1.5Mbps-67403327.mp4",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/videos/c/vp/0469c782ad6144eb8f9303480523b1be/0469c782ad6144eb8f9303480523b1be.SD-480p-1.5Mbps-67402918.mp4",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/videos/c/vp/6e83e16e86a6497da15b58465a643d16/6e83e16e86a6497da15b58465a643d16.SD-480p-1.0Mbps-67402801.mp4"
                    ];
                    const posterUrls = [
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/preview_images/db11272eadaf4feea868f6fa23520ccc.thumbnail.0000000000_1100x.jpg?v=1768963506",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/preview_images/583572d6eaa545078cc2d38d00fdd824.thumbnail.0000000000_1100x.jpg?v=1768964221",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/preview_images/30c47ed425b44de2a2a16219cc741603.thumbnail.0000000000_1100x.jpg?v=1768965003",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/preview_images/6d6e78a6d0a240a0a7199bd6b697aaaa.thumbnail.0000000000_1100x.jpg?v=1768965215",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/preview_images/0469c782ad6144eb8f9303480523b1be.thumbnail.0000000000_1100x.jpg?v=1768964693",
                      "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/preview_images/6e83e16e86a6497da15b58465a643d16.thumbnail.0000000000_1100x.jpg?v=1768964485"
                    ];

                    const videoUrl = videoUrls[idx % videoUrls.length];
                    const posterUrl = posterUrls[idx % posterUrls.length];

                    return (
                      <div key={product.id} style={{
                        width: "280px",
                        flexShrink: 0,
                        opacity: isActive ? 1 : 0.4,
                        transition: "all 0.5s ease",
                        transform: isActive ? "scale(1)" : "scale(0.9)",
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                          
                          {/* Video loop container */}
                          <div style={{
                            height: isActive ? "373px" : "0px", // 3:4 aspect ratio of 280px is 373.33px!
                            overflow: "hidden",
                            transition: "height 0.5s ease-in-out",
                            position: "relative",
                            borderRadius: "4px",
                            backgroundColor: "#000",
                          }}>
                            {isActive && (
                              <video 
                                src={videoUrl}
                                poster={posterUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            )}
                          </div>

                          {/* Content card */}
                          <div style={{
                            border: "1px solid rgba(0, 0, 0, 0.1)",
                            padding: "16px",
                            backgroundColor: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                          }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <Link href={`/store/${slug}/product/${product.id}`} style={{ flex: 3, display: "block", aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#fafafa" }}>
                                <img src={img} alt={product.name || product.title}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                              </Link>
                              <div style={{ flex: 7, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <Link href={`/store/${slug}/product/${product.id}`} style={{ textDecoration: "none" }}>
                                  <h3 style={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    color: "#000",
                                    fontFamily: "Poppins,sans-serif",
                                    marginBottom: "8px",
                                    lineHeight: 1.4,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}>{product.name || product.title}</h3>
                                </Link>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  {hasDiscount ? (
                                    <>
                                      <span style={{ fontSize: "14px", fontWeight: 600, color: accent, fontFamily: "Poppins,sans-serif" }}>${product.discount_price}</span>
                                      <span style={{ fontSize: "12px", color: "#bbb", textDecoration: "line-through", fontFamily: "Poppins,sans-serif" }}>${product.price}</span>
                                    </>
                                  ) : (
                                    <span style={{ fontSize: "14px", fontWeight: 400, color: "#000", fontFamily: "Poppins,sans-serif" }}>${product.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Link href={`/store/${slug}/product/${product.id}`} className="custom-btn-shopnow"
                              style={{
                                display: "block",
                                textAlign: "center",
                                fontWeight: 500,
                                position: "relative",
                                zIndex: 1,
                                borderRadius: "4px",
                                backgroundColor: "#000",
                                color: "#fff",
                                fontSize: "12px",
                                padding: "10px",
                                cursor: "pointer",
                                transition: "all 0.4s cubic-bezier(0.77, 0, 0.175, 1)",
                                textDecoration: "none",
                              }}>
                              SHOP NOW
                            </Link>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "30px" }}>
              {products.slice(3, 9).map((_: any, idx: number) => (
                <button key={idx} onClick={() => setFeaturedIdx(idx)}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: idx === featuredIdx ? "#000" : "rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                  }} />
              ))}
            </div>

          </div>
        </div>

        {/* Global Styles for custom effects */}
        <style>{`
          .custom-nav-btn {
            position: relative;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.4);
            overflow: hidden;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .custom-nav-btn:hover {
            background-color: rgba(0, 0, 0, 0.9);
          }
          .custom-nav-btn svg {
            color: rgba(255, 255, 255, 0.6);
            transition: color 0.3s ease;
          }
          .custom-nav-btn:hover svg {
            color: rgba(255, 255, 255, 1);
          }
          /* Slide transition for arrow */
          .custom-nav-btn .icon-before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.3s ease;
          }
          .custom-nav-btn .icon-after {
            position: absolute;
            top: 50%;
            left: 50%;
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .custom-nav-btn.prev .icon-after {
            transform: translate(50px, -50%);
          }
          .custom-nav-btn.next .icon-after {
            transform: translate(-50px, -50%);
          }
          .custom-nav-btn.prev:hover .icon-before {
            transform: translate(-50px, -50%);
          }
          .custom-nav-btn.next:hover .icon-before {
            transform: translate(50px, -50%);
          }
          .custom-nav-btn:hover .icon-after {
            transform: translate(-50%, -50%);
          }

          /* Shop Now Button hover slide-in background color effect */
          .custom-btn-shopnow::before {
            content: "";
            display: block;
            position: absolute;
            z-index: -1;
            top: 0;
            left: 100%;
            width: 0;
            height: 100%;
            background-color: ${accent};
            transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
            border-radius: 4px;
          }
          .custom-btn-shopnow:hover::before {
            width: 100%;
            left: 0;
          }
        `}</style>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 0", backgroundColor: "#fdf5f1" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={20} fill="#ffc107" style={{ color: "#ffc107" }} />))}
          </div>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#555", fontStyle: "italic" }}>
            "I can't believe how much nicer the materials are compared to other bags I have. Leather is super buttery. The design is practical for daily use, and the finishing details feel premium."
          </p>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 15px" }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=110&q=80" alt="Customer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <p className="text-sm font-bold mb-1" style={{ color: "#000" }}>Mr Parker</p>
          <p className="text-xs" style={{ color: "#999" }}>UX Designer</p>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: "50px 0", backgroundColor: "#272727" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px", alignItems: "center" }}>
            <div>
              <h2 className="text-xl font-medium mb-3" style={{ fontFamily: "Poppins,sans-serif", color: "#fff" }}>Keep Me Updated</h2>
              <p className="text-sm" style={{ color: "#aaa" }}>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            </div>
            <div>
              <div style={{ display: "flex", gap: "0" }}>
                <input type="email" placeholder="Enter your email..." className="w-full text-sm outline-none" style={{ padding: "12px 18px", border: "none", backgroundColor: "#fff" }} />
                <button className="text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer shrink-0" style={{ padding: "12px 24px", backgroundColor: accent, borderRadius: "0" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#000"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent; }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section style={{ padding: "60px 0", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <h2 className="text-center text-[22px] font-medium mb-8" style={{ fontFamily: "Poppins,sans-serif", color: "#000" }}>Follow Us On Instagram</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
            {[
              "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
              "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300&q=80",
              "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=300&q=80",
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&q=80",
              "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=300&q=80",
            ].map((img, i) => (
              <a key={i} href="#" className="block overflow-hidden group" style={{ aspectRatio: "1/1" }}>
                <img src={img} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#ffffff", borderTop: "1px solid #ebebeb", padding: "50px 20px 20px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
            <div>
              <h4 className="text-sm font-bold mb-4" style={{ color: "#000" }}>{storeName}</h4>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "#666" }}>Address: 1234 Heaven Stress, USA.</p>
              <ul className="list-none" style={{ color: "#666", fontSize: "13px", lineHeight: 2 }}>
                <li>Phone: (+84) 1800 68 68</li>
                <li>Email: hello@domain.com</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4" style={{ color: "#000" }}>Quick Links</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-xs hover:opacity-60 transition-opacity" style={{ color: "#666" }}>{link.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4" style={{ color: "#000" }}>Information</h4>
              <div className="flex flex-col gap-2">
                <Link href={`/store/${slug}/faq`} className="text-xs hover:opacity-60 transition-opacity" style={{ color: "#666" }}>FAQ</Link>
                <Link href={`/store/${slug}/shipping`} className="text-xs hover:opacity-60 transition-opacity" style={{ color: "#666" }}>Shipping</Link>
                <Link href={`/store/${slug}/privacy`} className="text-xs hover:opacity-60 transition-opacity" style={{ color: "#666" }}>Privacy Policy</Link>
                <Link href={`/store/${slug}/terms`} className="text-xs hover:opacity-60 transition-opacity" style={{ color: "#666" }}>Terms</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4" style={{ color: "#000" }}>Follow Us</h4>
              <div className="flex gap-3">
                {["FB", "TW", "IG", "YT"].map((s) => (
                  <span key={s} className="w-9 h-9 flex items-center justify-center text-xs font-bold border transition-colors cursor-pointer" style={{ borderColor: "#ddd", color: "#666" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#000"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#666"; }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 text-center">
            <p className="text-[11px]" style={{ color: "#999" }}>&copy; 2026 {storeName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ProductCard removed — now inline in Featured Products carousel
