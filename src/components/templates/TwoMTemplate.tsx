"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronRight, ChevronLeft, Search, Heart, ShoppingCart, User, Menu, MapPin,
  Phone, Mail, Clock, Rocket, Undo2, Info, Shield, Star, Eye,
  Gift, ChevronDown, X
} from "lucide-react";
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

const DEFAULT_HERO_SLIDES = [
  { heading: "TOP HEADPHONES", description: "Performance<br/>Wonderful", buttonText: "799$ | Buy Now!", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
  { heading: "TOP SMARTPHONES", description: "Performance<br/>Wonderful", buttonText: "800$ | Buy Now!", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" },
  { heading: "Smartwatch", description: "Performance<br/>Wonderful", buttonText: "650$ | Buy Now!", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" },
];

const SectionHeading2M = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="flex flex-col items-center" style={{ padding: "15px 15px 25px" }}>
    <h2 className="text-[28px] font-bold text-center" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{title}</h2>
    {subtitle && <p className="text-sm text-center mt-2" style={{ fontFamily: "Lato,sans-serif", color: "#666666" }}>{subtitle}</p>}
  </div>
);

function SwiperArrows({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <button onClick={onPrev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-70" style={{ backgroundColor: "rgba(0,0,0,0.15)", color: "#333333" }}>
        <ChevronLeft size={16} />
      </button>
      <button onClick={onNext} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-70" style={{ backgroundColor: "rgba(0,0,0,0.15)", color: "#333333" }}>
        <ChevronRight size={16} />
      </button>
    </>
  );
}

export default function TwoMTemplate({ store, banners, settings, products, slug, categories, session }: TemplateProps) {
  const primary = "#fed700";
  const hoverAccent = "#e1205e";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("NEW");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [saleIdx, setSaleIdx] = useState(0);
  const cartAddItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();

  const storeId = store?.id || slug;
  const cartCount = cartItems.filter((i) => i.storeId === storeId).reduce((a, i) => a + i.quantity, 0);

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const img = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
      cartAddItem({
        id: `${slug}-${product.id}-One Size-`,
        storeId: storeId,
        product: { ...product, images: Array.isArray(product?.images) ? product.images : [img] },
        quantity: 1,
        selectedSize: "One Size",
        selectedColor: "",
        selectedImage: img,
      });
    } catch (err) { console.error("cartAddItem error:", err); }
  };

  const handleToggleWishlist = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const pid = String(product.id);
      const img = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
      if (isWishlisted(pid)) {
        removeWishlist(pid);
      } else {
        addWishlist({ productId: pid, storeId: slug, name: product.name, price: product.price, image: img, slug: `/store/${slug}/product/${product.id}` });
      }
    } catch (err) { console.error("wishlist error:", err); }
  };

  const topBanners = banners.filter((b: any) => b.isActive && (b.position === 'top' || !b.position));
  const midBanners = banners.filter((b: any) => b.isActive && b.position === 'middle');

  useEffect(() => {
    if (topBanners.length > 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % DEFAULT_HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [topBanners.length]);

  const heroSlides = topBanners.length > 0 ? topBanners.map(b => ({
    heading: b.title || "",
    description: b.subtitle || "",
    buttonText: b.showButton !== false ? (b.buttonText || "Shop Now") : "",
    image: b.imageUrl,
  })) : DEFAULT_HERO_SLIDES;

  const ctaBanners = midBanners.length > 0 ? midBanners : [
    { imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80", title: "NEW TECHNOLOGIES", subtitle: "HEADPHONES 2025", buttonText: "SHOP NOW!" },
    { imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", title: "APPLE ACCESSORIES", subtitle: "LEATHER CASES", buttonText: "SHOP NOW!" },
  ];

  const features = [
    { icon: Rocket, title: "Free Shipping", desc: "orders $50 or more" },
    { icon: Undo2, title: "Free Returns", desc: "within 30 days" },
    { icon: Gift, title: "Get 20% Off 1 Item", desc: "when you sign up" },
    { icon: Shield, title: "We Support", desc: "24/7 amazing services" },
  ];

  const brandLogos = [
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&q=80",
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&q=80",
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&q=80",
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&q=80",
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&q=80",
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&q=80",
  ];

  const blogPosts = [
    { title: "Phasellus et dictum vel", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80", date: "Aug 9" },
    { title: "Interdum et sodales sed", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", date: "Aug 9" },
    { title: "Fusce pharetra volutpat", image: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80", date: "Aug 9" },
    { title: "Vestibulum vel molestie", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", date: "Aug 9" },
    { title: "Ut maximus quis vivamus", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80", date: "Aug 9" },
    { title: "Morbi tellus lacus biam", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", date: "Aug 9" },
    { title: "In convallis vel aenean", image: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80", date: "Aug 9" },
    { title: "Vivamus a aliquam dolor", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", date: "Aug 9" },
  ];

  const blogWidth = 370;
  const blogStep = 370;

  const productSliders = {
    saleProducts: products.length > 0 ? products : Array.from({ length: 9 }, (_, i) => ({
      id: `sale-${i}`, name: `Product ${i + 1}`, price: 99.99,
      images: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80",
      category: "Electronics",
    })),
    tabProducts: products.length > 0 ? products : Array.from({ length: 11 }, (_, i) => ({
      id: `tab-${i}`, name: `Item ${i + 1}`, price: [600, 450, 350, 300.60, 300, 250, 240.60, 220.60, 180, 170, 168][i] || 99.99,
      images: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80",
      category: "Electronics",
    })),
    newProd: products.length > 0 ? products : Array.from({ length: 9 }, (_, i) => ({
      id: `np-${i}`, name: `New Item ${i + 1}`, price: 99.99,
      images: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80",
      category: "Electronics",
    })),
    featuredProd: products.length > 0 ? products : Array.from({ length: 9 }, (_, i) => ({
      id: `fp-${i}`, name: `Featured ${i + 1}`, price: 99.99,
      images: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80",
      category: "Electronics",
    })),
    topRatedProd: products.length > 0 ? products : Array.from({ length: 9 }, (_, i) => ({
      id: `tr-${i}`, name: `Top ${i + 1}`, price: 99.99,
      images: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80",
      category: "Electronics",
    })),
    prod4: products.length > 0 ? products : Array.from({ length: 9 }, (_, i) => ({
      id: `p4-${i}`, name: `Popular ${i + 1}`, price: 99.99,
      images: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80",
      category: "Electronics",
    })),
  };

  const realCategories = Array.isArray(categories) ? categories : [];
  const visibleCategories = showAllCategories ? realCategories : realCategories.slice(0, 8);

  const renderStars = (count = 5) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: count }, (_, i) => (
          <Star key={i} size={11} fill="#fed700" style={{ color: "#fed700" }} />
        ))}
      </div>
    );
  };

  const renderProductCard = (product: any) => {
    const imgSrc = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
    return (
      <div className="group" style={{ backgroundColor: "#ffffff" }}>
        {/* Image area */}
        <div className="relative overflow-hidden" style={{ backgroundColor: "#f8f8f8" }}>
          <Link href={`/store/${slug}/product/${product.id}`}>
            <img src={imgSrc} alt={product?.name} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
          </Link>
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: "#e1205e", color: "#ffffff" }}>New</span>
          {/* Hover overlay: Wishlist, Quick View */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={(e) => handleToggleWishlist(product, e)} className="w-9 h-9 flex items-center justify-center transition-colors" style={{ backgroundColor: "#ffffff", color: "#333333", border: "1px solid #ebebeb" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.borderColor = primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.borderColor = "#ebebeb"; }}
            ><Heart size={14} /></button>
            <Link href={`/store/${slug}/product/${product.id}`} className="w-9 h-9 flex items-center justify-center transition-colors" style={{ backgroundColor: "#ffffff", color: "#333333", border: "1px solid #ebebeb", display: "inline-flex" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.borderColor = primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.borderColor = "#ebebeb"; }}
            ><Eye size={14} /></Link>
          </div>
        </div>
        {/* Always-visible action row */}
        <div className="flex items-center gap-1" style={{ padding: "10px 0 6px" }}>
          <div className="flex items-center" style={{ border: "1px solid #ebebeb" }}>
            <button className="w-7 h-7 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#f7f7f7", color: "#333333" }}>−</button>
            <span className="w-7 h-7 flex items-center justify-center text-xs font-bold" style={{ color: "#333333" }}>1</span>
            <button className="w-7 h-7 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#f7f7f7", color: "#333333" }}>+</button>
          </div>
          <button onClick={(e) => handleAddToCart(product, e)} className="flex-1 h-7 text-[10px] font-bold uppercase tracking-wider transition-colors" style={{ backgroundColor: primary, color: "#333333" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
          >Add to cart</button>
        </div>
        {/* Details */}
        <Link href={`/store/${slug}/categories`} className="text-[10px] uppercase tracking-wider transition-colors hover:opacity-60" style={{ color: "#999999" }}>{product?.category || "Category"}</Link>
        <h3 className="text-xs font-semibold my-1 transition-colors group-hover:opacity-60" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>
          <Link href={`/store/${slug}/product/${product.id}`}>{product?.name}</Link>
        </h3>
        <div className="flex items-center gap-1.5">{renderStars()}<span className="text-[10px]" style={{ color: "#999999" }}>(0 Reviews)</span></div>
        <p className="text-sm font-bold mt-1" style={{ color: "#333333" }}>${product?.price?.toFixed(2)}</p>
      </div>
    );
  };

  return (
    <div className="font-['Lato',sans-serif] overflow-x-hidden">
      {/* ====== MOBILE DRAWER MENU ====== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" style={{ zIndex: 99999 }}>
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />
          {/* Drawer container */}
          <div className="relative w-80 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-10 p-5 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <Link href={`/store/${slug}`} onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-lg font-black tracking-wider text-[#333333]">ELECTRONICS</span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-[#333333] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-4 mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Menu</p>
                <Link href={`/store/${slug}`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-[#333333] hover:text-[#e1205e] transition-colors py-1">Home</Link>
                <Link href={`/store/${slug}/products`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-[#333333] hover:text-[#e1205e] transition-colors py-1 flex items-center gap-1.5">
                  Shop <span className="px-1.5 py-0.5 text-[8px] font-bold text-white bg-[#e1205e]">HOT</span>
                </Link>
                <Link href={`/store/${slug}/blog`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-[#333333] hover:text-[#e1205e] transition-colors py-1">Blog</Link>
                <Link href={`/store/${slug}/contact`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-[#333333] hover:text-[#e1205e] transition-colors py-1">Contact Us</Link>
                <Link href={`/store/${slug}/faqs`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-[#333333] hover:text-[#e1205e] transition-colors py-1">FAQS</Link>
              </div>

              {/* Categories Links */}
              {realCategories.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categories</p>
                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {realCategories.map((cat, i) => (
                      <Link
                        key={cat.id || i}
                        href={`/store/${slug}/products?category=${cat.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs font-semibold text-gray-600 hover:text-[#e1205e] transition-colors py-1.5 border-b border-gray-50 flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <ChevronRight size={12} className="opacity-50" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Account Links */}
            <div className="border-t border-gray-100 pt-4 mt-6">
              <Link 
                href={`/store/${slug}/account`} 
                onClick={() => setMobileMenuOpen(false)} 
                className="flex items-center gap-2.5 py-2 text-sm font-bold text-gray-700 hover:text-[#e1205e] transition-colors"
              >
                <User size={16} />
                <span>My Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ====== TOP BAR ====== */}
      {/* Desktop Top Bar */}
      <div className="hidden md:block" style={{ backgroundColor: "#fed700", color: "#333333", fontSize: "12px" }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between" style={{ padding: "0px 15px", minHeight: "40px" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <img src="https://flagcdn.com/w20/us.png" alt="en" className="w-4 h-3 object-cover" />
              <span style={{ fontWeight: 600 }}>English</span>
              <ChevronDown size={10} />
            </div>
            <span className="opacity-40">|</span>
            <div className="flex items-center gap-1.5">
              <span style={{ fontWeight: 600 }}>USD</span>
              <ChevronDown size={10} />
            </div>
            <span className="opacity-40">|</span>
            <span style={{ fontWeight: 600 }}>FREE SHIPPING FOR ALL ORDERS OF $150</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#333333"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#333333"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#333333"><path d="M22.014 4.606a8.746 8.746 0 0 1-2.512.689 4.392 4.392 0 0 0 1.922-2.424 8.736 8.736 0 0 1-2.776 1.062 4.37 4.37 0 0 0-7.442 3.987A12.4 12.4 0 0 1 2.91 3.21a4.371 4.371 0 0 0 1.352 5.834 4.34 4.34 0 0 1-1.98-.547v.055a4.37 4.37 0 0 0 3.503 4.285 4.38 4.38 0 0 1-1.972.075 4.373 4.373 0 0 0 4.08 3.034 8.766 8.766 0 0 1-5.427 1.872c-.35 0-.698-.02-1.043-.063a12.36 12.36 0 0 0 6.697 1.964c8.035 0 12.427-6.659 12.427-12.434 0-.19-.004-.378-.013-.565a8.88 8.88 0 0 0 2.18-2.263z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#333333"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14h-3v-2.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5V16h-3V8h3v1.5a3.5 3.5 0 0 1 6.5-1.5V16z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#333333"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="none"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-width="2" stroke="#333333"/></svg>
            </div>
            <span className="opacity-40">|</span>
            <Link href={`/store/${slug}/contact`} className="hover:opacity-70 transition-opacity" style={{ color: "#333333", fontWeight: 600 }}>CONTACT US</Link>
            <span className="opacity-30">|</span>
            <Link href={`/store/${slug}/faqs`} className="hover:opacity-70 transition-opacity" style={{ color: "#333333", fontWeight: 600 }}>FAQS</Link>
          </div>
        </div>
      </div>
      {/* Mobile Top Bar (Clean and Simple) */}
      <div className="md:hidden flex items-center justify-center py-2 text-center text-[10px] font-bold px-4" style={{ backgroundColor: "#fed700", color: "#333333", letterSpacing: "0.5px" }}>
        <span>FREE SHIPPING FOR ALL ORDERS OF $150</span>
      </div>

      {/* ====== HEADER MAIN ====== */}
      {/* Desktop Header */}
      <div className="hidden md:block" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1200px] mx-auto flex items-center" style={{ padding: "8px 15px" }}>
          <div className="w-1/3 flex items-center">
            <Link href={`/store/${slug}`} className="inline-block">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings?.storeName || "Logo"}
                  style={{
                    height: `${settings?.headerSettings?.logoHeight || 65}px`,
                    width: "auto",
                    maxWidth: "280px",
                    objectFit: "contain",
                    display: "block",
                    mixBlendMode: (settings?.headerSettings?.logoBlendMode || 'normal') as any
                  }}
                />
              ) : (
                <div style={{ fontSize: "28px", fontWeight: 900, fontFamily: "Lato,sans-serif", color: "#333333", letterSpacing: "1px" }}>
                  <span>{settings?.storeName || "ELECTRONICS"}</span>
                </div>
              )}
            </Link>
          </div>
          <div className="w-1/3 flex justify-center">
            <div className="flex items-center w-full max-w-[400px]" style={{ border: "2px solid #ebebeb" }}>
              <input
                type="text"
                placeholder="Enter your keyword ..."
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
                style={{ fontFamily: "Lato,sans-serif", color: "#333333", height: "42px" }}
              />
              <button className="px-5 transition-colors flex items-center justify-center" style={{ backgroundColor: primary, color: "#333333", height: "42px", width: "48px" }}>
                <Search size={18} />
              </button>
            </div>
          </div>
          <div className="w-1/3 flex items-center justify-end gap-4">
            <Link href={`/store/${slug}/account`} className="flex flex-col items-center cursor-pointer">
              <User size={20} style={{ color: "#333333" }} />
              <span className="text-[10px] font-semibold mt-0.5" style={{ color: "#333333" }}>YOUR ACCOUNT</span>
            </Link>
            <Link href={`/store/${slug}/wishlist`} className="flex flex-col items-center cursor-pointer">
              <Heart size={20} style={{ color: "#333333" }} />
              <span className="text-[10px] font-semibold mt-0.5" style={{ color: "#333333" }}>WISHLIST</span>
            </Link>
            <Link href={`/store/${slug}/cart`} className="flex flex-col items-center cursor-pointer relative">
              <ShoppingCart size={20} style={{ color: "#333333" }} />
              <span className="text-[10px] font-semibold mt-0.5" style={{ color: "#333333" }}>CART</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: primary, color: "#333333", borderRadius: "50%" }}>{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Header (Sleek and Non-overlapping) */}
      <div className="md:hidden bg-white border-b border-gray-100 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Menu size={22} style={{ color: "#333333" }} />
          </button>
          <Link href={`/store/${slug}`}>
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings?.storeName || "Logo"}
                style={{
                  height: `${Math.round((settings?.headerSettings?.logoHeight || 65) * 0.75)}px`,
                  width: "auto",
                  maxWidth: "180px",
                  objectFit: "contain",
                  display: "block",
                  mixBlendMode: (settings?.headerSettings?.logoBlendMode || 'normal') as any
                }}
              />
            ) : (
              <span className="text-lg font-black tracking-wider text-[#333333]" style={{ fontFamily: "Lato,sans-serif" }}>
                {settings?.storeName || "ELECTRONICS"}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-3">
            <Link href={`/store/${slug}/wishlist`} className="relative p-1">
              <Heart size={20} style={{ color: "#333333" }} />
            </Link>
            <Link href={`/store/${slug}/cart`} className="relative p-1">
              <ShoppingCart size={20} style={{ color: "#333333" }} />
              <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: primary, color: "#333333", borderRadius: "50%" }}>{cartCount}</span>
            </Link>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-3.5 py-2 text-xs outline-none bg-transparent text-gray-700"
              style={{ fontFamily: "Lato,sans-serif", height: "36px" }}
            />
            <button className="px-4 transition-colors flex items-center justify-center" style={{ backgroundColor: primary, color: "#333333", height: "36px" }}>
              <Search size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ====== NAVIGATION BAR ====== */}
      {/* Desktop Navigation */}
      <div className="hidden md:block max-w-[1200px] mx-auto" style={{ padding: "0px 15px" }}>
        <div className="flex items-stretch" style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}>
          <div className="flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase cursor-pointer shrink-0" style={{ backgroundColor: primary, color: "#333333", width: "220px" }}>
            <Menu size={16} />
            <span>All categories</span>
          </div>
          <nav className="flex items-center ml-6">
            <Link href={`/store/${slug}`} className="px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: "#333333" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#333333"; }}
            >
              Home
            </Link>
            <Link href={`/store/${slug}/products`} className="relative group px-4 py-3 block">
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors" style={{ color: "#333333" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#333333"; }}
              >
                Shop
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: "#e1205e", color: "#ffffff" }}>Hot</span>
              </div>
            </Link>
            <Link href={`/store/${slug}/blog`} className="px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: "#333333" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#333333"; }}
            >
              Blog
            </Link>
            <Link href={`/store/${slug}/products`} className="px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: "#333333" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#333333"; }}
            >
              Pages
            </Link>
            <div className="relative group px-4 py-3">
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors" style={{ color: "#333333" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#333333"; }}
              >
                Elementor Live
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: primary, color: "#333333" }}>52+ Widgets</span>
              </div>
            </div>
            <div className="relative group px-4 py-3">
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors" style={{ color: "#333333" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#333333"; }}
              >
                Elements
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: "#e1205e", color: "#ffffff" }}>New Update</span>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* ====== HERO SECTION with Categories Sidebar ====== */}
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row" style={{ padding: "0px 15px" }}>
        {/* Categories Vertical Sidebar (always visible on desktop, hidden on mobile) */}
        {realCategories.length > 0 && (
          <div className="hidden md:block w-[220px] shrink-0" style={{ marginTop: "0px", height: "380px" }}>
            <div className="flex flex-col h-full bg-white" style={{ border: "1px solid #ebebeb", height: "100%" }}>
              <div className="flex-1 overflow-y-auto flex flex-col h-full" style={{ scrollbarWidth: "thin", display: "flex", flexDirection: "column", height: "100%" }}>
                {visibleCategories.map((cat, i) => (
                  <Link
                    key={cat.id || i}
                    href={`/store/${slug}/categories`}
                    className="px-4 text-xs font-semibold transition-colors flex items-center flex-1 min-h-[44px]"
                    style={{ color: "#666666", borderBottom: "1px solid #f0f0f0" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; e.currentTarget.style.paddingLeft = "20px"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.paddingLeft = "16px"; }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              {realCategories.length > 8 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-left transition-colors border-t shrink-0"
                  style={{ color: primary, borderColor: "#ebebeb", paddingTop: "10px", paddingBottom: "10px" }}
                >
                  {showAllCategories ? "− Show Less" : `+ ${realCategories.length - 8} more`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hero Slider */}
        <div className="flex-1 relative overflow-hidden w-full" style={{ backgroundColor: "#f8f8f8" }}>
          <div className="relative h-[250px] sm:h-[300px] md:h-[380px]">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: index === currentSlide ? 1 : 0, zIndex: index === currentSlide ? 1 : 0 }}
              >
                <div className="flex items-center h-full" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: "center center", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundColor: "#f8f8f8" }}>
                  <div className="max-w-[380px] mr-auto p-6 sm:p-8 md:p-12 flex flex-col justify-center h-full">
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2" style={{ color: primary, letterSpacing: "1px" }}>{slide.heading}</p>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold uppercase leading-tight sm:leading-snug md:leading-normal mb-3 sm:mb-5" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>
                      <span dangerouslySetInnerHTML={{ __html: slide.description }} />
                    </h2>
                    {slide.buttonText && (
                      <Link
                        href={`/store/${slug}/products`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors w-max"
                        style={{ backgroundColor: primary, color: "#333333", lineHeight: "16px" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
                      >
                        {slide.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="w-2.5 h-2.5 transition-all"
                  style={{ backgroundColor: index === currentSlide ? primary : "rgba(0,0,0,0.15)", borderRadius: "0" }}
                />
              ))}
            </div>
            {/* Arrows */}
            <button
              onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ backgroundColor: "rgba(0,0,0,0.1)", color: "#333333" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ backgroundColor: "rgba(0,0,0,0.1)", color: "#333333" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ====== CTA BANNERS ====== */}
      <div className="max-w-[1200px] mx-auto" style={{ padding: "0px 15px", marginTop: "30px", marginBottom: "50px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[30px]">
          {ctaBanners.map((banner, i) => (
            <Link key={i} href={banner.buttonLink || `/store/${slug}/products`} className="group block overflow-hidden relative min-h-[200px] md:min-h-[290px]">
              <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${banner.imageUrl})` }} />
              {/* Legibility overlay */}
              <div className="absolute inset-0 bg-black/25 transition-opacity duration-300 group-hover:bg-black/35" />
              {/* Text & Button content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-center items-start text-white">
                {banner.subtitle && (
                  <p className="text-[11px] font-bold tracking-widest uppercase mb-1.5" style={{ color: primary }}>
                    {banner.subtitle}
                  </p>
                )}
                {banner.title && (
                  <h3 className="text-2xl font-black uppercase mb-5 tracking-tight leading-tight max-w-[280px]">
                    {banner.title}
                  </h3>
                )}
                {banner.showButton !== false && (
                  <span className="inline-flex items-center gap-1 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-sm" 
                        style={{ backgroundColor: primary, color: "#333333" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; }}>
                    {banner.buttonText || "Shop Now"}
                    <ChevronRight size={10} />
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ====== SALE PRODUCTS + SPECIAL OFFERS ====== */}
      <div className="max-w-[1200px] mx-auto" style={{ padding: "0px 15px", marginBottom: "65px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[40px]">
          {/* LEFT: Sale Products */}
          <div>
            <div style={{ border: "2px solid #fed700", borderRadius: "5px", padding: "20px" }}>
              <h3 className="mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333", fontSize: "26px", fontWeight: 700 }}>Sale Products</h3>
              {(() => {
                const saleItems = productSliders.saleProducts.slice(0, 3);
                const p = saleItems[saleIdx];
                const imgSrc = Array.isArray(p?.images) ? p.images[0] : (p?.images || "");
                return (
                  <div>
                    {/* Large product card */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative shrink-0 w-full sm:w-1/2" style={{ backgroundColor: "#f8f8f8" }}>
                        <Link href={`/store/${slug}/product/${p?.id}`}>
                          <img src={imgSrc} alt={p?.name} className="w-full aspect-square object-cover" />
                        </Link>
                        <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: hoverAccent, color: "#ffffff" }}>New</span>
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <div className="flex gap-2 mb-2">
                          <button onClick={(e) => handleAddToCart(p, e)} className="w-8 h-8 flex items-center justify-center transition-colors" style={{ backgroundColor: "#ffffff", color: "#999999", border: "1px solid #ebebeb" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.borderColor = primary; e.currentTarget.style.color = "#333333"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.color = "#999999"; }}
                          ><ShoppingCart size={13} /></button>
                          <button onClick={(e) => handleToggleWishlist(p, e)} className="w-8 h-8 flex items-center justify-center transition-colors" style={{ backgroundColor: "#ffffff", color: "#999999", border: "1px solid #ebebeb" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.borderColor = primary; e.currentTarget.style.color = "#333333"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.color = "#999999"; }}
                          ><Heart size={13} /></button>
                          <Link href={`/store/${slug}/product/${p?.id}`} className="w-8 h-8 flex items-center justify-center transition-colors" style={{ backgroundColor: "#ffffff", color: "#999999", border: "1px solid #ebebeb", display: "inline-flex" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.borderColor = primary; e.currentTarget.style.color = "#333333"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.color = "#999999"; }}
                          ><Eye size={13} /></Link>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <button className="w-8 h-8 flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#f0f0f0", color: "#333333", border: "1px solid #ebebeb" }}>−</button>
                          <span className="text-sm font-bold px-2">1</span>
                          <button className="w-8 h-8 flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#f0f0f0", color: "#333333", border: "1px solid #ebebeb" }}>+</button>
                          <button onClick={(e) => handleAddToCart(p, e)} className="flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors" style={{ backgroundColor: primary, color: "#333333" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
                          >Add to cart</button>
                        </div>
                        <Link href={`/store/${slug}/product/${p?.id}`} className="text-sm font-bold mb-1 transition-colors hover:opacity-60" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{p?.name}</Link>
                        <Link href={`/store/${slug}/categories`} className="text-[11px] uppercase tracking-wider mb-1 transition-colors hover:opacity-60" style={{ color: "#999999" }}>{p?.category || "Category"}</Link>
                        {renderStars()}
                        <p className="text-xs" style={{ color: "#999999" }}>(0 Reviews)</p>
                        <p className="text-sm font-bold mt-1" style={{ color: "#333333" }}>${p?.price?.toFixed(2)}</p>
                      </div>
                    </div>
                    {/* Navigation arrows */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button onClick={() => setSaleIdx((saleIdx - 1 + saleItems.length) % saleItems.length)} className="w-8 h-8 flex items-center justify-center transition-colors" style={{ backgroundColor: "#f0f0f0", color: "#999999" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0"; e.currentTarget.style.color = "#999999"; }}
                      ><ChevronLeft size={14} /></button>
                      <div className="flex gap-1.5">
                        {saleItems.map((_, idx) => (
                          <span key={idx} className="w-2 h-2 cursor-pointer" style={{ backgroundColor: idx === saleIdx ? primary : "#d4d4d4", borderRadius: "50%" }} onClick={() => setSaleIdx(idx)} />
                        ))}
                      </div>
                      <button onClick={() => setSaleIdx((saleIdx + 1) % saleItems.length)} className="w-8 h-8 flex items-center justify-center transition-colors" style={{ backgroundColor: "#f0f0f0", color: "#999999" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0"; e.currentTarget.style.color = "#999999"; }}
                      ><ChevronRight size={14} /></button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* RIGHT: SPECIAL OFFERS with Tabs */}
          <div>
            <div style={{ padding: "15px 0" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 style={{ fontFamily: "Lato,sans-serif", color: "#333333", fontSize: "22px", fontWeight: 700 }}>SPECIAL OFFERS</h3>
                <div className="flex gap-0 overflow-x-auto pb-1 hide-scrollbar">
                  {["NEW", "FEATURED", "TOP RATED"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
                      style={{
                        color: activeTab === tab ? "#333333" : "rgba(51,51,51,0.7)",
                        borderBottom: activeTab === tab ? "2px solid #fed700" : "2px solid transparent",
                        marginLeft: "12px",
                        paddingBottom: "3px",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              {/* Tab Content - product cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(activeTab === "NEW" ? productSliders.tabProducts :
                  activeTab === "FEATURED" ? productSliders.featuredProd :
                  productSliders.topRatedProd
                ).slice(0, 9).map((product: any, i: number) => (
                  <div key={i}>{renderProductCard(product)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== BRAND LOGOS CAROUSEL ====== */}
      <div className="max-w-[1200px] mx-auto" style={{ padding: "15px 15px", marginBottom: "60px" }}>
        <div style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb", padding: "25px 0" }}>
          <div className="relative">
            <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-around gap-6 md:gap-4 overflow-hidden">
              {brandLogos.map((logo, i) => (
                <div key={i} className="px-4 transition-opacity duration-300" style={{ opacity: 0.5 }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
                >
                  <img src={logo} alt={`Brand ${i + 1}`} className="h-8 w-auto object-contain mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== PRODUCT GRID COLUMNS (4-col cards) ====== */}
      <div className="max-w-[1200px] mx-auto" style={{ padding: "10px 15px 40px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[30px]">
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>New Products</h3>
            <div style={{ borderTop: "2px solid #ebebeb", paddingTop: "15px" }}>
              {productSliders.newProd.slice(0, 4).map((product: any, i: number) => (
                <div key={i} className="mb-5">{renderProductCard(product)}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>Featured products</h3>
            <div style={{ borderTop: "2px solid #ebebeb", paddingTop: "15px" }}>
              {productSliders.featuredProd.slice(0, 4).map((product: any, i: number) => (
                <div key={i} className="mb-5">{renderProductCard(product)}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>Top Rated</h3>
            <div style={{ borderTop: "2px solid #ebebeb", paddingTop: "15px" }}>
              {productSliders.topRatedProd.slice(0, 4).map((product: any, i: number) => (
                <div key={i} className="mb-5">{renderProductCard(product)}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>Popular</h3>
            <div style={{ borderTop: "2px solid #ebebeb", paddingTop: "15px" }}>
              {productSliders.prod4.slice(0, 4).map((product: any, i: number) => (
                <div key={i} className="mb-5">{renderProductCard(product)}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== BLOG SECTION ====== */}
      <div style={{ backgroundColor: "#f8f8f8" }}>
        <div className="max-w-[1200px] mx-auto" style={{ padding: "50px 15px 60px" }}>
          <div className="flex flex-col items-center mb-2">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#999999" }}>AKIRA ELECTRONICS</p>
            <h2 className="text-[30px] font-bold text-center" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>LATEST FROM BLOG</h2>
            <p className="text-sm text-center mt-2" style={{ fontFamily: "Lato,sans-serif", color: "#666666" }}>Nullam gravida, dolor ac ultrices lobortis, mi dolor justo.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-[30px]" style={{ marginTop: "30px" }}>
            {blogPosts.slice(0, 3).map((post, i) => (
              <Link key={i} href={`/store/${slug}/blog`} className="group">
                <div className="overflow-hidden mb-4">
                  <img src={post.image} alt={post.title} className="w-full aspect-[370/227] object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="text-xs mb-2" style={{ color: "#999999" }}>{post.date}</p>
                <h3 className="text-base font-bold transition-colors group-hover:opacity-60" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ====== FOOTER ====== */}
      <footer className="pb-20 md:pb-0">
        {/* Features bar */}
        <div className="flex items-center" style={{ backgroundColor: "#f8f8f8", minHeight: "110px" }}>
          <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "15px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ columnGap: "30px" }}>
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-2 sm:py-0">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}>
                      <Icon size={22} style={{ color: "#333333" }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{feat.title}</p>
                      <p className="text-xs" style={{ color: "#666666" }}>{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8" style={{ padding: "50px 15px" }}>
            {/* Logo + Contact */}
            <div className="col-span-2 md:col-span-1">
              <Link href={`/store/${slug}`} className="block mb-4">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName || "Logo"} className="h-10 w-auto object-contain" />
                ) : (
                  <span className="text-xl font-black block" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{settings?.storeName || "ELECTRONICS"}</span>
                )}
              </Link>
              <div className="space-y-3 text-sm" style={{ color: "#666666" }}>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "#fed700" }} />
                  <span>82 Valley Farms Court Grovetown</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0" style={{ color: "#fed700" }} />
                  <a href="tel:+15463479636" className="hover:underline" style={{ color: "#666666" }}>(546) 347-9636</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0" style={{ color: "#fed700" }} />
                  <a href="mailto:demo@axonvip.com" className="hover:underline" style={{ color: "#666666" }}>demo@axonvip.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="shrink-0" style={{ color: "#fed700" }} />
                  <span>Mon - Sat : 8 AM - 5 PM</span>
                </div>
              </div>
            </div>

            {/* My Account links */}
            <div className="col-span-1">
              <h4 className="text-sm font-bold uppercase mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>My Account</h4>
              <ul className="space-y-2 text-sm">
                {["About us", "Legal Notice", "Addresses", "Order", "Payment"].map((link) => (
                  <li key={link}>
                    <Link href={`/store/${slug}/account`} className="transition-colors block" style={{ color: "#666666" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information links */}
            <div className="col-span-1">
              <h4 className="text-sm font-bold uppercase mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>Information</h4>
              <ul className="space-y-2 text-sm">
                {["Delivery", "Legal Notice", "About us", "New products", "Prices drop"].map((link) => (
                  <li key={link}>
                    <Link href={`/store/${slug}/products`} className="transition-colors block" style={{ color: "#666666" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 md:col-span-1 pt-2 md:pt-0">
              <h4 className="text-sm font-bold uppercase mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>Newsletter</h4>
              <p className="text-sm mb-4" style={{ color: "#666666" }}>Subscribe to our newsletter and get 10% off your first purchase</p>
              <div className="flex mb-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 text-sm outline-none"
                  style={{ border: "1px solid #ebebeb", color: "#333333", fontFamily: "Lato,sans-serif", height: "42px" }}
                />
                <button className="px-4 flex items-center justify-center transition-colors" style={{ backgroundColor: primary, color: "#333333", height: "42px" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-0.5" />
                <span className="text-xs" style={{ color: "#999999" }}>Enim quis fugiat consequat elit minim nisi eu occaecat occaecat deserunt aliquip nisi ex deserunt.</span>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ backgroundColor: "#f8f8f8" }}>
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left" style={{ padding: "20px 15px", minHeight: "60px" }}>
            <p className="text-xs" style={{ color: "#666666" }}>Copyright &copy; 2025 Akira Store. All Rights Reserved.</p>
            <div className="flex gap-2 mt-0">
              <img src="https://cdn.jsdelivr.net/gh/multo-pay/icons/paypal.svg" alt="paypal" className="h-6" style={{ opacity: 0.6 }} />
              <img src="https://cdn.jsdelivr.net/gh/multo-pay/icons/visa.svg" alt="visa" className="h-6" style={{ opacity: 0.6 }} />
              <img src="https://cdn.jsdelivr.net/gh/multo-pay/icons/mastercard.svg" alt="mastercard" className="h-6" style={{ opacity: 0.6 }} />
              <img src="https://cdn.jsdelivr.net/gh/multo-pay/icons/amex.svg" alt="amex" className="h-6" style={{ opacity: 0.6 }} />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
