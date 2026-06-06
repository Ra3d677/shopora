"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search, Heart, ShoppingCart, User, Menu, X, Star,
  ChevronLeft, ChevronRight, Eye, MapPin, Phone, Mail,
  Clock, ChevronDown
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

const accent = "#ff7245";
const accentDark = "#e0603a";
const bgLight = "#fdf7f5";

/* ─── Countdown Timer ──────────────────────────────────────────── */
function useCountdown(targetHours = 12) {
  const end = useRef(Date.now() + targetHours * 3600 * 1000);
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      const diff = Math.max(0, end.current - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function TimeBox({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-white text-lg font-bold leading-none"
        style={{
          minWidth: "40px", height: "40px", display: "flex",
          alignItems: "center", justifyContent: "center",
          backgroundColor: accent, borderRadius: "4px",
        }}
      >
        {String(val).padStart(2, "0")}
      </span>
      <span className="text-[9px] text-gray-400 mt-1 uppercase">{label}</span>
    </div>
  );
}

/* ─── Star rating ──────────────────────────────────────────────── */
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={11} fill={i < n ? "#ffc107" : "#e0e0e0"} style={{ color: i < n ? "#ffc107" : "#e0e0e0" }} />
      ))}
    </div>
  );
}

/* ─── Section Heading ──────────────────────────────────────────── */
function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center mb-10">
      <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 500, color: "#111", fontFamily: "Poppins,sans-serif", marginBottom: "8px" }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: "14px", color: "#999", fontFamily: "Poppins,sans-serif" }}>{sub}</p>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function ThreeMTemplate({ store, banners, settings, products, slug, categories }: TemplateProps) {
  const storeName = store?.name || settings?.storeName || "Netro Store";
  const { items, addItem } = useCartStore();
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();
  const storeId = store?.id || slug;
  const cartCount = items.filter((i: any) => i.storeId === storeId).reduce((a: number, i: any) => a + i.quantity, 0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("featured");
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [dealIdx, setDealIdx] = useState(0);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const countdown = useCountdown(11);

  /* ── hero slides ── */
  const topBanners = banners.filter((b: any) => b.isActive && (b.position === "top" || !b.position));
  const heroSlides = topBanners.length > 0
    ? topBanners.map((b: any) => ({
        subtitle: b.subtitle || "New Arrival",
        title: b.title || "New Collection",
        description: b.description || "",
        buttonText: b.buttonText || "Shop now",
        buttonLink: b.buttonLink || `/store/${slug}/products`,
        image: b.imageUrl,
        align: b.align || "right",
      }))
    : [
        { subtitle: "Up to 15% off", title: "Diana diamante<br/>clutch bag", description: "Change up the straps to suit your mood. Wear them two<br/>ways for two different looks", buttonText: "Shop now", buttonLink: `/store/${slug}/products`, image: "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/slide_h1_1.webp?v=1768875495", align: "right" },
        { subtitle: "New Season 2025", title: "Urbana Bag<br/>shoulder", description: "Bold fun design with multiple pockets organised with<br/>secure zips to keep everything safe", buttonText: "Shop now", buttonLink: `/store/${slug}/products`, image: "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/slide_h1_2.webp?v=1768875500", align: "left" },
      ];

  const midBanners = banners.filter((b: any) => b.isActive && b.position === "middle");
  const ctaBanners = midBanners.length > 0
    ? midBanners
    : [
        { imageUrl: "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/banner_h1_1.jpg?v=1768881903", title: "Kipling Cool organised", subtitle: "New arrival", description: "The bold fun design features multiple pockets organised with secure zips to keep", buttonText: "see more" },
        { imageUrl: "https://netro-store-newdemo71.myshopify.com/cdn/shop/files/banner_h1_2.jpg?v=1768884212", title: "Urbana Bag shoulder", subtitle: "New arrival", description: "The bold fun design features multiple organised with secure zips", buttonText: "see more" },
      ];

  const announcements = [
    "🎁 Free shipping on all orders over $100",
    "✨ New arrivals – Diana collection now live",
    "🔥 Up to 15% off selected items this week",
  ];

  /* ── nav links ── */
  const navLinks = [
    { label: "Home", href: `/store/${slug}` },
    { label: "Shop", href: `/store/${slug}/products` },
    { label: "Categories", href: `/store/${slug}/categories` },
    { label: "Blog", href: `/store/${slug}/blog` },
    { label: "Contact", href: `/store/${slug}/contact` },
  ];

  /* ── product helpers ── */
  const getImg = (p: any) => Array.isArray(p?.images) ? p.images[0] : (p?.images || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80");

  const handleCart = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const img = getImg(product);
    addItem({
      id: `${slug}-${product.id}-One Size-`,
      storeId,
      product: { ...product, images: Array.isArray(product?.images) ? product.images : [img] },
      quantity: 1,
      selectedSize: "One Size",
      selectedColor: "",
      selectedImage: img,
    });
  };

  const handleWishlist = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const pid = String(product.id);
    const img = getImg(product);
    if (isWishlisted(pid)) {
      removeWishlist(pid);
    } else {
      addWishlist({ productId: pid, storeId: slug, name: product.name, price: product.price, image: img, slug: `/store/${slug}/product/${product.id}` });
    }
  };

  const getTabProducts = () => {
    if (activeTab === "featured") {
      const sale = products.filter((p: any) => p.discount_price);
      return sale.length > 0 ? sale : products.slice(0, 8);
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

  /* ── auto-play hero ── */
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  /* ── announcement ticker ── */
  useEffect(() => {
    const t = setInterval(() => setAnnouncementIdx((p) => (p + 1) % announcements.length), 3500);
    return () => clearInterval(t);
  }, []);

  /* ── Product card ── */
  const ProductCard = ({ product }: { product: any }) => {
    const [hovered, setHovered] = useState(false);
    const img = getImg(product);
    const hasDiscount = product.discount_price && product.price;
    const displayPrice = product.discount_price || product.price;
    const comparePrice = hasDiscount ? product.price : product.compare_at_price;
    const pid = String(product.id);
    const wishlisted = isWishlisted(pid);

    return (
      <div
        className="group relative"
        style={{ backgroundColor: "#fff" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#f7f7f7" }}>
          <Link href={`/store/${slug}/product/${product.id}`}>
            <img
              src={img}
              alt={product.name || product.title}
              style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
              className="group-hover:scale-105"
            />
          </Link>

          {/* Badges */}
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {hasDiscount && (
              <span style={{ backgroundColor: accent, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 8px", textTransform: "uppercase" }}>Sale</span>
            )}
            {product.isNew && (
              <span style={{ backgroundColor: "#333", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 8px", textTransform: "uppercase" }}>New</span>
            )}
          </div>

          {/* Hover actions */}
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              padding: "12px",
              transform: hovered ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.3s ease",
            }}
          >
            {[
              { icon: <ShoppingCart size={15} />, action: (e: React.MouseEvent) => handleCart(product, e), title: "Add to cart" },
              { icon: <Heart size={15} fill={wishlisted ? accent : "none"} style={{ color: wishlisted ? accent : "currentColor" }} />, action: (e: React.MouseEvent) => handleWishlist(product, e), title: "Wishlist" },
              { icon: <Eye size={15} />, href: `/store/${slug}/product/${product.id}`, title: "Quick view" },
            ].map((btn, i) =>
              btn.href ? (
                <Link key={i} href={btn.href} title={btn.title}
                  style={{ width: "36px", height: "36px", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", color: "#333", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#333"; }}
                >{btn.icon}</Link>
              ) : (
                <button key={i} onClick={btn.action} title={btn.title}
                  style={{ width: "36px", height: "36px", backgroundColor: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", color: "#333", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#333"; }}
                >{btn.icon}</button>
              )
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "14px 4px 18px", textAlign: "center" }}>
          {product.category && (
            <Link href={`/store/${slug}/products?category=${product.category}`} style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.5px", textTransform: "uppercase", textDecoration: "none" }}>
              {product.category}
            </Link>
          )}
          <Link href={`/store/${slug}/product/${product.id}`} style={{ textDecoration: "none" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 400, color: "#111", marginTop: "4px", marginBottom: "8px", fontFamily: "Poppins,sans-serif", lineHeight: 1.4 }}
              className="group-hover:opacity-70 transition-opacity line-clamp-2">
              {product.name || product.title}
            </h3>
          </Link>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: hasDiscount ? accent : "#111" }}>${Number(displayPrice).toFixed(2)}</span>
            {comparePrice && <span style={{ fontSize: "13px", color: "#bbb", textDecoration: "line-through" }}>${Number(comparePrice).toFixed(2)}</span>}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
            <Stars />
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ fontFamily: "Poppins,sans-serif", backgroundColor: "#fff", overflowX: "hidden" }}>

      {/* ═══ ANNOUNCEMENT BAR ══════════════════════════════════════ */}
      <div style={{ backgroundColor: "#111", color: "#fff", height: "38px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", fontSize: "12px" }}>
        {/* Left social */}
        <div className="hidden md:flex items-center gap-3">
          {[
            <svg key="fb" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
            <svg key="tw" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
            <svg key="ig" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
            <svg key="yt" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>,
          ].map((icon, i) => (
            <a key={i} href="#" style={{ color: "#aaa", display: "flex", alignItems: "center", transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accent; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#aaa"; }}>
              {icon}
            </a>
          ))}
        </div>
        {/* Center ticker */}
        <div style={{ flex: 1, textAlign: "center", overflow: "hidden" }}>
          {announcements.map((msg, i) => (
            <span key={i} style={{
              display: "block", transition: "opacity 0.5s, transform 0.5s",
              opacity: i === announcementIdx ? 1 : 0,
              transform: i === announcementIdx ? "translateY(0)" : "translateY(-10px)",
              position: i === 0 ? "relative" : "absolute",
              top: 0, left: 0, right: 0,
            }}>{msg}</span>
          ))}
        </div>
        {/* Right: lang */}
        <div className="hidden md:flex items-center gap-1 cursor-pointer" style={{ color: "#aaa", fontSize: "11px" }}>
          <span>EN</span><ChevronDown size={10} />
        </div>
      </div>

      {/* ═══ HEADER ════════════════════════════════════════════════ */}
      <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 9999 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: "0 0 auto" }}>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
              <Menu size={22} />
            </button>
            <Link href={`/store/${slug}`} style={{ textDecoration: "none" }}>
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={storeName}
                  style={{ height: `${settings?.headerSettings?.logoHeight || 44}px`, width: "auto", maxWidth: "200px", objectFit: "contain" }} />
              ) : (
                <span style={{ fontWeight: 700, fontSize: "20px", color: "#111", letterSpacing: "0.3px" }}>{storeName}</span>
              )}
            </Link>
          </div>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-8" style={{ flex: "1 1 auto", justifyContent: "center" }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                style={{ fontSize: "13px", fontWeight: 500, color: "#222", textDecoration: "none", letterSpacing: "0.3px", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#222"; }}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: "0 0 auto" }}>
            <button onClick={() => setSearchOpen(!searchOpen)}
              style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#333", borderRadius: "50%", transition: "background 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
              <Search size={18} />
            </button>
            <Link href={`/store/${slug}/account`}
              style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", borderRadius: "50%", transition: "background 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
              <User size={18} />
            </Link>
            <Link href={`/store/${slug}/wishlist`}
              style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", position: "relative", borderRadius: "50%", transition: "background 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
              <Heart size={18} />
              {wishlistItems.length > 0 && (
                <span style={{ position: "absolute", top: "4px", right: "4px", width: "16px", height: "16px", backgroundColor: accent, color: "#fff", fontSize: "9px", fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href={`/store/${slug}/cart`}
              style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", position: "relative", borderRadius: "50%", transition: "background 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: "4px", right: "4px", width: "16px", height: "16px", backgroundColor: accent, color: "#fff", fontSize: "9px", fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar — expandable */}
        <div style={{
          maxHeight: searchOpen ? "60px" : "0", overflow: "hidden",
          transition: "max-height 0.3s ease", borderTop: searchOpen ? "1px solid #f0f0f0" : "none",
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "10px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
              <input type="text" placeholder="Search products…"
                style={{ flex: 1, padding: "10px 16px", fontSize: "14px", border: "none", outline: "none", fontFamily: "Poppins,sans-serif" }} />
              <button style={{ padding: "10px 20px", backgroundColor: accent, border: "none", cursor: "pointer", color: "#fff" }}>
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MOBILE DRAWER ══════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex" }}>
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "relative", width: "300px", height: "100%", backgroundColor: "#fff", boxShadow: "4px 0 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", padding: "24px", overflowY: "auto", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <span style={{ fontWeight: 700, fontSize: "18px" }}>{storeName}</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} /></button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: "12px 0", fontSize: "14px", fontWeight: 500, color: "#333", borderBottom: "1px solid #f5f5f5", textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </nav>
            {categories.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Categories</p>
                {categories.slice(0, 6).map((cat: any) => (
                  <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} onClick={() => setMobileMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", fontSize: "13px", color: "#666", borderBottom: "1px solid #f5f5f5", textDecoration: "none" }}>
                    <span>{cat.name}</span>
                    <ChevronRight size={13} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ HERO SLIDESHOW ═════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ height: "clamp(360px, 55vw, 780px)", position: "relative", backgroundColor: "#f7f7f7" }}>
          {heroSlides.map((slide, idx) => (
            <div key={idx} style={{
              position: "absolute", inset: 0, opacity: idx === currentSlide ? 1 : 0,
              transition: "opacity 0.9s ease", pointerEvents: idx === currentSlide ? "auto" : "none",
              display: "flex", alignItems: "center",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover", backgroundPosition: "center",
              }} />
              {/* Subtle gradient overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)" }} />
              <div style={{ position: "relative", width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}>
                <div style={{
                  maxWidth: "500px",
                  ...(slide.align === "right" ? { marginRight: "0" } : { marginLeft: "auto", textAlign: "right" }),
                }}>
                  {slide.subtitle && (
                    <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px", letterSpacing: "0.5px" }}>{slide.subtitle}</p>
                  )}
                  {slide.title && (
                    <h1 style={{ fontSize: "clamp(32px, 5vw, 68px)", fontWeight: 400, lineHeight: 1.15, marginBottom: "16px", color: "#111" }}
                      dangerouslySetInnerHTML={{ __html: slide.title }} />
                  )}
                  {slide.description && (
                    <p style={{ fontSize: "14px", color: "#666", marginBottom: "28px", lineHeight: 1.7 }}
                      dangerouslySetInnerHTML={{ __html: slide.description }} />
                  )}
                  {slide.buttonText && (
                    <Link href={slide.buttonLink || `/store/${slug}/products`}
                      style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "#fff", padding: "14px 36px", backgroundColor: "#111", borderRadius: "30px", textDecoration: "none", transition: "all 0.3s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}>
                      {slide.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Arrows */}
          {heroSlides.length > 1 && (
            <>
              <button onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
                style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "44px", height: "44px", backgroundColor: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", zIndex: 10, transition: "all 0.2s", color: "#333" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.85)"; }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", width: "44px", height: "44px", backgroundColor: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", zIndex: 10, transition: "all 0.2s", color: "#333" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.85)"; }}>
                <ChevronRight size={20} />
              </button>
              {/* Dots */}
              <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 }}>
                {heroSlides.map((_: any, idx: number) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)}
                    style={{ width: idx === currentSlide ? "24px" : "8px", height: "8px", borderRadius: "4px", backgroundColor: idx === currentSlide ? accent : "rgba(0,0,0,0.25)", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══ TRUST BADGES ═══════════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" }}>
            {[
              { icon: "🚚", title: "Free Shipping", desc: "On orders over $100" },
              { icon: "↩️", title: "Free Returns", desc: "Within 30 days" },
              { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
              { icon: "💬", title: "24/7 Support", desc: "We're here to help" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "24px 20px", textAlign: "center",
                borderRight: i < 3 ? "1px solid #f0f0f0" : "none",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "#888" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BEST SELLER + TABS ═════════════════════════════════════ */}
      <section style={{ padding: "80px 0", backgroundColor: bgLight }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <SectionHeading title="Best Seller" />

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "48px" }}>
            {[
              { key: "featured", label: "Featured" },
              { key: "latest", label: "Latest" },
              { key: "topRated", label: "Top Rating" },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  background: "none", border: "none", cursor: "pointer", fontFamily: "Poppins,sans-serif",
                  fontSize: "13px", fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? "#111" : "#999",
                  paddingBottom: "8px",
                  borderBottom: activeTab === tab.key ? `2px solid ${accent}` : "2px solid transparent",
                  textTransform: "uppercase", letterSpacing: "1px", transition: "all 0.2s",
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product grid – 4 cols desktop, 2 mobile */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}
            className="grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
            {getTabProducts().slice(0, 8).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href={`/store/${slug}/products`}
              style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", padding: "14px 40px", border: "2px solid #111", borderRadius: "30px", textDecoration: "none", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#111"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#111"; }}>
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNERS (alternating) ══════════════════════════════ */}
      {ctaBanners.slice(0, 2).map((banner: any, i: number) => (
        <section key={i} style={{ padding: "60px 0", backgroundColor: "#fff" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{
              display: "flex",
              flexDirection: i % 2 === 0 ? "row" : "row-reverse",
              alignItems: "center", gap: "60px", flexWrap: "wrap",
            }}>
              {/* Image */}
              <div style={{ flex: "1 1 45%", minWidth: "280px" }}>
                <div style={{ overflow: "hidden", borderRadius: "4px" }}>
                  <img src={banner.imageUrl} alt={banner.title || "Banner"}
                    className="hover:scale-105 transition-transform duration-700"
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                </div>
              </div>
              {/* Text */}
              <div style={{ flex: "1 1 40%", minWidth: "260px" }}>
                {banner.subtitle && (
                  <p style={{ fontSize: "12px", color: "#999", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
                    {banner.subtitle}
                  </p>
                )}
                {banner.title && (
                  <h3 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 400, color: "#111", marginBottom: "16px", lineHeight: 1.2 }}>
                    {banner.title}
                  </h3>
                )}
                {banner.description && (
                  <p style={{ fontSize: "14px", color: "#777", marginBottom: "28px", lineHeight: 1.8 }}>
                    {banner.description}
                  </p>
                )}
                <Link href={banner.buttonLink || `/store/${slug}/products`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", textDecoration: "none", borderBottom: "2px solid #111", paddingBottom: "2px", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#111"; e.currentTarget.style.borderColor = "#111"; }}>
                  {banner.buttonText || "see more"}
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ═══ CATEGORY GRID ══════════════════════════════════════════ */}
      {(categories.filter((c: any) => !c.parentId).length > 0) && (
        <section style={{ padding: "80px 0", backgroundColor: "#111" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 500, color: "#fff" }}>Shop by Category</h2>
              <p style={{ fontSize: "14px", color: "#888", marginTop: "8px" }}>Explore our curated collections</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {categories.filter((c: any) => !c.parentId).slice(0, 6).map((cat: any) => (
                <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`}
                  className="group block relative overflow-hidden"
                  style={{ borderRadius: "4px", textDecoration: "none" }}>
                  <img src={cat.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80"} alt={cat.name}
                    style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
                    className="group-hover:scale-105 transition-transform duration-700" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(0,0,0,0.65))", display: "flex", alignItems: "flex-end", padding: "20px 16px" }}>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{cat.name}</h3>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Shop now →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ DEAL OF THE DAY ════════════════════════════════════════ */}
      {products.length > 0 && (
        <section style={{ padding: "80px 0", backgroundColor: "#fff" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">
              {/* Deal image */}
              <div style={{ position: "relative" }}>
                <div style={{ overflow: "hidden", borderRadius: "4px", backgroundColor: bgLight }}>
                  <img
                    src={getImg(products[dealIdx] || products[0])}
                    alt={products[dealIdx]?.name || "Deal"}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                    className="hover:scale-105"
                  />
                </div>
                {products.length > 1 && (
                  <>
                    <button onClick={() => setDealIdx((p) => (p - 1 + products.slice(0, 5).length) % products.slice(0, 5).length)}
                      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", backgroundColor: "#fff", border: "none", borderRadius: "50%", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setDealIdx((p) => (p + 1) % products.slice(0, 5).length)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", backgroundColor: "#fff", border: "none", borderRadius: "50%", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Deal info */}
              <div>
                <p style={{ fontSize: "12px", color: accent, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px", fontWeight: 600 }}>Deal of the Day</p>
                <h3 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 400, color: "#111", marginBottom: "12px", lineHeight: 1.2 }}>
                  {products[dealIdx]?.name || products[0]?.name || "Special Offer"}
                </h3>
                <Stars />
                <div style={{ margin: "16px 0", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 700, color: accent }}>
                    ${Number(products[dealIdx]?.discount_price || products[dealIdx]?.price || products[0]?.price || 0).toFixed(2)}
                  </span>
                  {(products[dealIdx]?.compare_price || products[dealIdx]?.compare_at_price) && (
                    <span style={{ fontSize: "18px", color: "#bbb", textDecoration: "line-through" }}>
                      ${Number(products[dealIdx]?.compare_price || products[dealIdx]?.compare_at_price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Countdown */}
                <div style={{ marginBottom: "28px" }}>
                  <p style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>Offer ends in:</p>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <TimeBox val={countdown.h} label="Hours" />
                    <span style={{ color: "#ccc", fontSize: "20px", paddingTop: "8px" }}>:</span>
                    <TimeBox val={countdown.m} label="Mins" />
                    <span style={{ color: "#ccc", fontSize: "20px", paddingTop: "8px" }}>:</span>
                    <TimeBox val={countdown.s} label="Secs" />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button onClick={() => handleCart(products[dealIdx] || products[0])}
                    style={{ flex: 1, padding: "14px 24px", backgroundColor: "#111", color: "#fff", border: "none", borderRadius: "30px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111"; }}>
                    Add to Cart
                  </button>
                  <Link href={`/store/${slug}/product/${products[dealIdx]?.id || products[0]?.id}`}
                    style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e0e0e0", borderRadius: "50%", color: "#555", textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}>
                    <Eye size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ ICONIC PRODUCTS CAROUSEL ═══════════════════════════════ */}
      {products.length > 0 && (
        <section style={{ padding: "80px 0", backgroundColor: bgLight }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
            <SectionHeading title="Iconic Products" sub="Discover our collections" />
            <div style={{ position: "relative" }}>
              <div style={{ overflow: "hidden" }}>
                <div style={{
                  display: "flex", gap: "24px",
                  transition: "transform 0.5s ease",
                  transform: `translateX(calc(-${featuredIdx} * (260px + 24px)))`,
                }}>
                  {(products.length > 0 ? products : Array.from({ length: 8 }, (_, i) => ({ id: `p-${i}`, name: `Product ${i + 1}`, price: 79 + i * 10 }))).map((product: any) => (
                    <div key={product.id} style={{ flex: "0 0 260px" }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrows */}
              <button onClick={() => setFeaturedIdx((p) => Math.max(0, p - 1))}
                style={{ position: "absolute", left: "-20px", top: "40%", transform: "translateY(-50%)", width: "44px", height: "44px", backgroundColor: "#fff", border: "none", borderRadius: "50%", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, color: "#333", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#333"; }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setFeaturedIdx((p) => Math.min(Math.max(0, products.length - 4), p + 1))}
                style={{ position: "absolute", right: "-20px", top: "40%", transform: "translateY(-50%)", width: "44px", height: "44px", backgroundColor: "#fff", border: "none", borderRadius: "50%", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, color: "#333", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#333"; }}>
                <ChevronRight size={18} />
              </button>

              {/* Dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }}>
                {Array.from({ length: Math.max(1, products.length - 3) }, (_, i) => (
                  <button key={i} onClick={() => setFeaturedIdx(i)}
                    style={{ width: i === featuredIdx ? "24px" : "8px", height: "8px", borderRadius: "4px", border: "none", cursor: "pointer", backgroundColor: i === featuredIdx ? accent : "#d0d0d0", transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ TESTIMONIAL ════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "24px" }}>
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={22} fill="#ffc107" style={{ color: "#ffc107" }} />)}
          </div>
          <blockquote style={{ fontSize: "18px", fontWeight: 300, color: "#444", lineHeight: 1.8, fontStyle: "italic", marginBottom: "32px" }}>
            "I can't believe how much nicer the materials are compared to other bags I have. Leather is super buttery. The design is practical for daily use, and the finishing details feel premium."
          </blockquote>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 14px" }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=110&q=80" alt="Customer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <p style={{ fontWeight: 600, fontSize: "14px", color: "#111", marginBottom: "4px" }}>Mr Parker</p>
          <p style={{ fontSize: "12px", color: "#aaa" }}>UX Designer</p>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═════════════════════════════════════════════ */}
      <section style={{ padding: "60px 0", backgroundColor: "#111" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 400, color: "#fff", marginBottom: "10px" }}>Keep Me Updated</h2>
              <p style={{ fontSize: "14px", color: "#888", lineHeight: 1.7 }}>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            </div>
            <div>
              <div style={{ display: "flex" }}>
                <input type="email" placeholder="Enter your email address…"
                  style={{ flex: 1, padding: "14px 20px", fontSize: "14px", border: "none", outline: "none", borderRadius: "30px 0 0 30px", fontFamily: "Poppins,sans-serif" }} />
                <button
                  style={{ padding: "14px 28px", backgroundColor: accent, border: "none", borderRadius: "0 30px 30px 0", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#fff", cursor: "pointer", transition: "background 0.2s", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentDark; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent; }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INSTAGRAM GRID ═════════════════════════════════════════ */}
      <section style={{ padding: "60px 0", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Follow us</p>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 400, color: "#111" }}>@{storeName.toLowerCase().replace(/\s+/g, "_")}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
            {[
              "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
              "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300&q=80",
              "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=300&q=80",
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
              "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&q=80",
              "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=300&q=80",
            ].map((img, i) => (
              <a key={i} href="#" className="group block overflow-hidden" style={{ aspectRatio: "1/1", position: "relative" }}>
                <img src={img} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: "#fff", borderTop: "1px solid #f0f0f0" }}>
        {/* Main footer */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 24px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: "48px" }} className="grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href={`/store/${slug}`} style={{ textDecoration: "none", display: "block", marginBottom: "20px" }}>
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={storeName} style={{ height: "40px", width: "auto", objectFit: "contain" }} />
                ) : (
                  <span style={{ fontWeight: 700, fontSize: "18px", color: "#111" }}>{storeName}</span>
                )}
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#666" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <MapPin size={15} style={{ color: accent, flexShrink: 0, marginTop: "2px" }} />
                  <span>1234 Fashion Street, New York, USA</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Phone size={15} style={{ color: accent, flexShrink: 0 }} />
                  <a href="tel:+15463479636" style={{ color: "#666", textDecoration: "none" }}>+1 (546) 347-9636</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Mail size={15} style={{ color: accent, flexShrink: 0 }} />
                  <a href="mailto:hello@store.com" style={{ color: "#666", textDecoration: "none" }}>hello@store.com</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Clock size={15} style={{ color: accent, flexShrink: 0 }} />
                  <span>Mon – Sat: 8 AM – 6 PM</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {[
                  <svg key="fb" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                  <svg key="tw" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
                  <svg key="ig" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
                  <svg key="yt" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#"
                    style={{ width: "36px", height: "36px", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", color: "#555", textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; e.currentTarget.style.color = "#555"; }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h4 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#111", marginBottom: "20px" }}>My Account</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { name: "My Account", href: `/store/${slug}/account` },
                  { name: "Order History", href: `/store/${slug}/account?section=orders` },
                  { name: "Wishlist", href: `/store/${slug}/wishlist` },
                  { name: "Addresses", href: `/store/${slug}/account?section=information` },
                  { name: "Legal Notice", href: `/store/${slug}/terms` },
                ].map((link) => (
                  <Link key={link.name} href={link.href}
                    style={{ fontSize: "13px", color: "#777", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#777"; }}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="col-span-1">
              <h4 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#111", marginBottom: "20px" }}>Information</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { name: "About Us", href: `/store/${slug}/about` },
                  { name: "Delivery & Returns", href: `/store/${slug}/shipping` },
                  { name: "Privacy Policy", href: `/store/${slug}/privacy` },
                  { name: "Terms & Conditions", href: `/store/${slug}/terms` },
                  { name: "Blog", href: `/store/${slug}/blog` },
                ].map((link) => (
                  <Link key={link.name} href={link.href}
                    style={{ fontSize: "13px", color: "#777", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#777"; }}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 md:col-span-1">
              <h4 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#111", marginBottom: "20px" }}>Newsletter</h4>
              <p style={{ fontSize: "13px", color: "#777", marginBottom: "16px", lineHeight: 1.7 }}>
                Subscribe to our newsletter and get 10% off your first purchase.
              </p>
              <div style={{ display: "flex", border: "1px solid #e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
                <input type="email" placeholder="Your email…"
                  style={{ flex: 1, padding: "12px 14px", fontSize: "13px", border: "none", outline: "none", fontFamily: "Poppins,sans-serif" }} />
                <button
                  style={{ padding: "12px 16px", backgroundColor: accent, border: "none", cursor: "pointer", color: "#fff", transition: "background 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentDark; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent; }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid #f0f0f0", backgroundColor: "#fafafa" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "12px", color: "#999" }}>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {["paypal", "visa", "mastercard", "amex"].map((brand) => (
                <img key={brand}
                  src={`https://cdn.jsdelivr.net/gh/multo-pay/icons/${brand}.svg`}
                  alt={brand}
                  style={{ height: "22px", opacity: 0.65 }}
                />
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
