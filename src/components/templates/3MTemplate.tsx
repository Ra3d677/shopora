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

export default function ThreeMTemplate({ store, banners, settings, products, slug, categories }: TemplateProps) {
  const storeName = store?.name || "Premium Store";
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = items.filter((i: any) => i.storeId === store?.id).length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("featured");

  const slides = banners.length > 0 ? banners : [
    { subtitle: "Up to 15% off", title: "Diana diamante<br/>clutch bag", description: "Change up the straps to suit your mood. Wear them two<br/>ways for two different looks", buttonText: "Shop now", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1600&q=80" },
    { subtitle: "New collection", title: "Kipling Cool<br/>organised", description: "The bold fun design features multiple pockets organised with secure zips to keep", buttonText: "Shop now", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=80" },
  ];

  const featuredProducts = products.filter(p => p.discount_price).slice(0, 6);
  const latestProducts = products.slice(0, 6);
  const topRated = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);

  const getTabProducts = () => {
    if (activeTab === "featured") return featuredProducts;
    if (activeTab === "latest") return latestProducts;
    return topRated;
  };

  const defaultProducts = getTabProducts();

  const navLinks = [
    { label: "Home", href: `/store/${slug}` },
    { label: "Products", href: `/store/${slug}/products` },
    { label: "Cart", href: `/store/${slug}/cart` },
    { label: "Contact", href: `/store/${slug}/contact` },
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
            <Link href={`/store/${slug}/search`} className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity">
              <Search size={20} />
            </Link>
            <Link href={`/store/${slug}/account`} className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity">
              <User size={20} />
            </Link>
            <Link href={`/store/${slug}/wishlist`} className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity relative">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full" style={{ backgroundColor: accent }}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href={`/store/${slug}/cart`} className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full" style={{ backgroundColor: accent }}>
                  {cartCount}
                </span>
              )}
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
          {slides.map((slide, idx) => (
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
                <div style={{ maxWidth: "500px", textAlign: "center", marginLeft: "auto", marginRight: "0" }}>
                  <p style={{ fontSize: "14px", marginBottom: "10px", color: "#666" }}>{slide.subtitle}</p>
                  <h2 style={{ fontSize: "clamp(32px, 5vw, 62px)", fontWeight: 500, lineHeight: 1.2, marginBottom: "15px", color: "#000" }} dangerouslySetInnerHTML={{ __html: slide.title }} />
                  <p style={{ fontSize: "16px", marginBottom: "25px", color: "#666", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: slide.description }} />
                  <Link href={`/store/${slug}/products`} className="inline-block text-sm font-medium uppercase tracking-wider text-white transition-all" style={{ padding: "12px 30px", borderRadius: "30px", backgroundColor: "#000000" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}>
                    {slide.buttonText || "Shop now"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {slides.length > 1 && (
            <>
              <button onClick={() => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length)} className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white shadow-md transition-all z-10 cursor-pointer rounded-full">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentSlide((p) => (p + 1) % slides.length)} className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white shadow-md transition-all z-10 cursor-pointer rounded-full">
                <ChevronRight size={20} />
              </button>
              <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 }}>
                {slides.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className="cursor-pointer" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: idx === currentSlide ? "#000" : "#ccc", transition: "background 0.3s" }} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* BANNER v2 - First */}
      <section style={{ padding: "50px 0", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", alignItems: "center" }}>
            <div>
              <div style={{ overflow: "hidden" }}>
                <img src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1080&q=80" alt="Banner" className="hover:scale-105 transition-transform duration-500" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "14px", color: "#999", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>New arrival</p>
              <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 500, color: "#000", marginBottom: "15px", lineHeight: 1.3, fontFamily: "Poppins,sans-serif" }}>Kipling Cool<br />organised</h3>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", lineHeight: 1.6 }}>The bold fun design features multiple pockets organised with secure zips to keep</p>
              <Link href={`/store/${slug}/products`} className="inline-block text-xs font-medium uppercase tracking-wider text-white transition-all" style={{ padding: "10px 28px", borderRadius: "30px", backgroundColor: "#000000" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}>
                See more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER v2 - Second */}
      <section style={{ padding: "0 0 50px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", alignItems: "center" }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "14px", color: "#999", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Featured</p>
              <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 500, color: "#000", marginBottom: "15px", lineHeight: 1.3, fontFamily: "Poppins,sans-serif" }}>Premium Leather<br />Collection</h3>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", lineHeight: 1.6 }}>Handcrafted with premium materials for lasting quality and timeless style.</p>
              <Link href={`/store/${slug}/products`} className="inline-block text-xs font-medium uppercase tracking-wider text-white transition-all" style={{ padding: "10px 28px", borderRadius: "30px", backgroundColor: "#000000" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}>
                See more
              </Link>
            </div>
            <div>
              <div style={{ overflow: "hidden" }}>
                <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1080&q=80" alt="Banner" className="hover:scale-105 transition-transform duration-500" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLER with tabs */}
      <section style={{ padding: "80px 0", backgroundColor: bgLight }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <h2 className="text-center text-[28px] font-medium mb-8" style={{ fontFamily: "Poppins,sans-serif", color: "#000" }}>Best Seller</h2>

          <div className="flex justify-center gap-0 mb-10" style={{ borderBottom: "1px solid #ddd" }}>
            {[
              { key: "featured", label: "Featured" },
              { key: "latest", label: "Latest" },
              { key: "topRated", label: "Top Rating" },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="px-6 pb-3 text-xs font-medium uppercase tracking-wider cursor-pointer transition-all"
                style={{ color: activeTab === tab.key ? accent : "#999", borderBottom: activeTab === tab.key ? `2px solid ${accent}` : "2px solid transparent" }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
            {defaultProducts.length > 0 ? defaultProducts.map((product) => (
              <ProductCard key={product.id} product={product} slug={slug} accent={accent} storeId={store?.id} />
            )) : products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} slug={slug} accent={accent} storeId={store?.id} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY BANNERS - Women / Men */}
      <section style={{ padding: "80px 0", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}>
            {categories.filter(c => !c.parentId).slice(0, 2).map((cat) => (
              <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="group block relative overflow-hidden">
                <img src={cat.image || "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=700&q=80"} alt={cat.name}
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-500" />
                <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", padding: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                  <h3 className="text-white text-xl font-medium">{cat.name}</h3>
                </div>
              </Link>
            ))}
            {categories.filter(c => !c.parentId).length === 0 && (
              <>
                <Link href={`/store/${slug}/products`} className="group block relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=700&q=80" alt="Women" className="group-hover:scale-105 transition-transform duration-500" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                    <h3 className="text-white text-xl font-medium">Women</h3>
                  </div>
                </Link>
                <Link href={`/store/${slug}/products`} className="group block relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&q=80" alt="Men" className="group-hover:scale-105 transition-transform duration-500" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                    <h3 className="text-white text-xl font-medium">Men</h3>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTS v1 */}
      <section style={{ padding: "80px 0", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <h2 className="text-center text-[28px] font-medium mb-10" style={{ fontFamily: "Poppins,sans-serif", color: "#000" }}>Featured Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
            {products.slice(3, 9).map((product) => (
              <ProductCard key={product.id} product={product} slug={slug} accent={accent} storeId={store?.id} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 0", backgroundColor: "#fdf5f1" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill="#ffc107" style={{ color: "#ffc107" }} />
              ))}
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
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: "50px 0", backgroundColor: "#272727" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px", alignItems: "center" }}>
            <div>
              <h2 className="text-xl font-medium mb-3" style={{ fontFamily: "Poppins,sans-serif", color: "#ffffff" }}>Keep Me Updated</h2>
              <p className="text-sm" style={{ color: "#aaaaaa" }}>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            </div>
            <div>
              <div style={{ display: "flex", gap: "0" }}>
                <input type="email" placeholder="Enter your email..." className="w-full text-sm outline-none" style={{ padding: "12px 18px", border: "none", backgroundColor: "#ffffff" }} />
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
                  <span key={s} className="w-9 h-9 flex items-center justify-center text-xs font-bold border transition-colors cursor-pointer" style={{ borderColor: "#ddd", color: "#666" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#000"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#666"; }}>{s}</span>
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

function ProductCard({ product, slug, accent, storeId }: { product: any; slug: string; accent: string; storeId?: string }) {
  const imgSrc = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
  const isSale = product.discount_price != null;
  const { addItem } = useCartStore();
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();

  return (
    <div className="group bg-white relative text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="relative overflow-hidden" style={{ backgroundColor: "#fafafa", aspectRatio: "1/1" }}>
        <Link href={`/store/${slug}/product/${product.id}`}>
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        {isSale && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white" style={{ backgroundColor: accent }}>Sale</span>
        )}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); const pid = String(product.id); if (isWishlisted(pid)) removeWishlist(pid); else addWishlist({ productId: pid, storeId: slug, name: product.name, price: product.price, image: imgSrc, slug: `/store/${slug}/product/${product.id}` }); }}
            className="w-9 h-9 bg-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <Heart size={14} className={isWishlisted(String(product.id)) ? "fill-current" : ""} style={{ color: isWishlisted(String(product.id)) ? accent : "#333" }} />
          </button>
          <Link href={`/store/${slug}/product/${product.id}`} className="w-9 h-9 bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </Link>
        </div>
      </div>
      <div style={{ padding: "15px" }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#aaa" }}>{product.category || "General"}</p>
        <Link href={`/store/${slug}/product/${product.id}`} className="hover:opacity-60 transition-opacity">
          <h3 className="text-sm font-medium leading-tight my-1.5 truncate" style={{ fontFamily: "Poppins,sans-serif" }}>{product.name}</h3>
        </Link>
        <div className="flex justify-center gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={12} fill="#ffc107" style={{ color: "#ffc107" }} />))}
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          {isSale ? (
            <><span className="text-sm font-bold" style={{ color: accent }}>${product.discount_price.toFixed(2)}</span><span className="text-xs line-through" style={{ color: "#999" }}>${product.price.toFixed(2)}</span></>
          ) : (
            <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>
        <button onClick={(e) => { e.stopPropagation(); addItem({ id: `${slug}-${product.id}-One Size-`, storeId: slug, product, quantity: 1, selectedSize: "One Size", selectedColor: "", selectedImage: imgSrc }); }}
          className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer rounded-full"
          style={{ backgroundColor: "#000000" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
