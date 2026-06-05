"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Search, Heart, ShoppingCart, User, Menu, Star, Eye, X } from "lucide-react";
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

const DEFAULT_SLIDES = [
  { subtitle: "New arrival", title: "Premium Collection", description: "Discover our latest premium products with exquisite design.", buttonText: "Shop Now", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80", bgColor: "#ffffff" },
  { subtitle: "Summer Sale", title: "Up to 50% Off", description: "Limited time offer on selected items.", buttonText: "Shop Now", image: "https://images.unsplash.com/photo-1555529771-122e5d482265?w=1600&q=80", bgColor: "#f8f8f8" },
];

const SectionHeading = ({ title }: { title: string }) => (
  <div className="xo-section-heading xo-section-heading--center" style={{ padding: "15px 15px 25px" }}>
    <h2 className="text-[28px] font-medium text-center" style={{ fontFamily: "Poppins,sans-serif", color: "#000000", lineHeight: 1.2 }}>{title}</h2>
  </div>
);

export default function ThreeMTemplate({ store, banners, settings, products, slug, categories }: TemplateProps) {
  const accent = "#ff7245";
  const bgLight = "#eff6f6";
  const storeName = store?.name || "Premium Store";

  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);

  const cartAddItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();
  const storeId = store?.id || slug;
  const cartCount = cartItems.filter((i) => i.storeId === storeId).reduce((a, i) => a + i.quantity, 0);

  const handleAddToCart = (product: any, e?: React.MouseEvent, quantity = 1) => {
    e?.stopPropagation();
    try {
      const img = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
      cartAddItem({
        id: `${slug}-${product.id}-One Size-`,
        storeId: storeId,
        product: { ...product, images: Array.isArray(product?.images) ? product.images : [img] },
        quantity,
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
      if (isWishlisted(pid)) removeWishlist(pid);
      else addWishlist({ productId: pid, storeId: slug, name: product.name, price: product.price, image: img, slug: `/store/${slug}/product/${product.id}` });
    } catch (err) { console.error("wishlist error:", err); }
  };

  const topBanners = banners.filter((b: any) => b.isActive && (b.position === 'top' || !b.position));

  useEffect(() => {
    if (topBanners.length > 0) return;
    const interval = setInterval(() => setCurrentSlide((p) => (p + 1) % DEFAULT_SLIDES.length), 5000);
    return () => clearInterval(interval);
  }, [topBanners.length]);

  const heroSlides = topBanners.length > 0
    ? topBanners.map(b => ({ title: b.title || "", description: b.subtitle || "", buttonText: b.showButton !== false ? (b.buttonText || "Shop Now") : "", image: b.imageUrl, subtitle: "", bgColor: "#ffffff" }))
    : DEFAULT_SLIDES;

  const tabs = [
    ...new Set(products.flatMap((p: any) => (p.tags ? (Array.isArray(p.tags) ? p.tags : [p.tags]) : ["all"])))
  ].filter(Boolean);
  const effectiveTabs = ["all", ...tabs.filter(t => t !== "all")];
  const filteredProducts = activeTab === "all" ? products : products.filter((p: any) => (Array.isArray(p.tags) ? p.tags : [p.tags]).includes(activeTab));

  const mainCats = (categories || []).filter((c: any) => !c.parentId);

  const navLinks = [
    { label: "Home", href: `/store/${slug}` },
    { label: "Shop", href: `/store/${slug}/products` },
    ...mainCats.slice(0, 3).map((c: any) => ({ label: c.name, href: `/store/${slug}/products?category=${c.id}` })),
    { label: "About", href: `/store/${slug}/about` },
    { label: "Contact", href: `/store/${slug}/contact` },
  ];

  const footerLinks = [
    { label: "Home", href: `/store/${slug}` },
    { label: "Products", href: `/store/${slug}/products` },
    { label: "Cart", href: `/store/${slug}/cart` },
    { label: "Contact", href: `/store/${slug}/contact` },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins,sans-serif" }}>
      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-100" style={{ zIndex: 100 }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: "1400px", padding: "0 20px", height: "70px" }}>
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileMenuOpen(true)} className="flex items-center justify-center cursor-pointer" style={{ width: "40px", height: "40px" }}>
              <Menu size={22} />
            </button>
            <Link href={`/store/${slug}`} className="font-bold tracking-tight text-lg" style={{ fontFamily: "Poppins,sans-serif", color: "#000000" }}>
              {storeName}
            </Link>
          </div>
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity" style={{ fontFamily: "Poppins,sans-serif", color: "#000000" }}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={`/store/${slug}/search`} className="p-2 hover:opacity-60 transition-opacity">
              <Search size={20} />
            </Link>
            <Link href={`/store/${slug}/account`} className="p-2 hover:opacity-60 transition-opacity">
              <User size={20} />
            </Link>
            <Link href={`/store/${slug}/wishlist`} className="p-2 hover:opacity-60 transition-opacity">
              <Heart size={20} />
            </Link>
            <button onClick={() => setCartOpen(true)} className="p-2 hover:opacity-60 transition-opacity relative cursor-pointer">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full" style={{ backgroundColor: accent }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/20">
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl" style={{ padding: "20px" }}>
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">{storeName}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="cursor-pointer"><X size={22} /></button>
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:opacity-60 transition-opacity">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/20">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-xl" style={{ padding: "20px" }}>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Shopping Cart</span>
              <button onClick={() => setCartOpen(false)} className="cursor-pointer"><X size={22} /></button>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">Your cart is empty</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 shrink-0 overflow-hidden">
                      <img src={item.product?.images?.[0] || ""} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                      <p className="text-xs font-bold mt-1">${(item.product?.discount_price || item.product?.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <Link href={`/store/${slug}/cart`} className="w-full py-3 text-center text-sm font-bold text-white rounded-full transition-colors" style={{ backgroundColor: "#000000" }} onClick={() => setCartOpen(false)}>
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO SLIDESHOW */}
      <div className="w-full overflow-hidden relative" style={{ backgroundColor: heroSlides[currentSlide]?.bgColor || "#ffffff" }}>
        <div className="relative" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {heroSlides.map((slide, idx) => (
              <div key={idx} className="w-full shrink-0 relative" style={{ minHeight: "450px" }}>
                <div className="flex items-center" style={{ minHeight: "450px", padding: "60px 40px" }}>
                  <div style={{ width: "50%", paddingRight: "40px" }}>
                    {slide.subtitle && <p className="text-sm font-normal mb-3" style={{ fontFamily: "Poppins,sans-serif", color: "#666666" }}>{slide.subtitle}</p>}
                    <h1 className="text-[62px] font-medium leading-tight mb-4" style={{ fontFamily: "Poppins,sans-serif", color: "#000000", lineHeight: 1.1 }}>{slide.title}</h1>
                    <p className="text-base font-normal mb-6" style={{ fontFamily: "Poppins,sans-serif", color: "#666666", lineHeight: 1.6 }}>{slide.description}</p>
                    {slide.buttonText && (
                      <Link href={`/store/${slug}/products`} className="inline-block px-6 py-3 text-sm font-medium text-white rounded-full transition-all hover:opacity-90" style={{ backgroundColor: "#000000", borderRadius: "3rem" }}>
                        {slide.buttonText}
                      </Link>
                    )}
                  </div>
                  <div style={{ width: "50%" }}>
                    {slide.image && (
                      <div className="overflow-hidden rounded-lg">
                        <img src={slide.image} alt={slide.title} className="w-full object-cover" style={{ aspectRatio: "1/1", maxHeight: "400px" }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {heroSlides.length > 1 && (
            <div className="flex justify-center gap-2 mt-4 pb-6">
              {heroSlides.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} className="w-2 h-2 rounded-full transition-all cursor-pointer" style={{ backgroundColor: idx === currentSlide ? accent : "#cccccc" }} />
              ))}
            </div>
          )}
          {heroSlides.length > 1 && (
            <>
              <button onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white transition-all rounded-full shadow cursor-pointer">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white transition-all rounded-full shadow cursor-pointer">
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* BANNER GRID */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "50px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          <Link href={`/store/${slug}/products`} className="block relative overflow-hidden group" style={{ backgroundColor: "#f9f9f9" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", minHeight: "300px" }}>
              <div style={{ padding: "40px" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>New arrival</p>
                <h3 className="text-2xl font-medium mb-2" style={{ fontFamily: "Poppins,sans-serif", color: "#000000" }}>Premium Collection</h3>
                <p className="text-sm mb-4" style={{ color: "#666666" }}>Explore our latest premium products with exquisite design.</p>
                <span className="inline-block px-6 py-2 text-sm font-medium text-white rounded-full transition-all" style={{ backgroundColor: "#000000", borderRadius: "3rem" }}>see more</span>
              </div>
              <div className="overflow-hidden">
                <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" alt="Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ aspectRatio: "1/1" }} />
              </div>
            </div>
          </Link>
          <Link href={`/store/${slug}/products`} className="block relative overflow-hidden group" style={{ backgroundColor: "#f9f9f9" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", minHeight: "300px" }}>
              <div style={{ padding: "40px" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>New arrival</p>
                <h3 className="text-2xl font-medium mb-2" style={{ fontFamily: "Poppins,sans-serif", color: "#000000" }}>Urban Collection</h3>
                <p className="text-sm mb-4" style={{ color: "#666666" }}>Modern designs for the contemporary lifestyle.</p>
                <span className="inline-block px-6 py-2 text-sm font-medium text-white rounded-full transition-all" style={{ backgroundColor: "#000000", borderRadius: "3rem" }}>see more</span>
              </div>
              <div className="overflow-hidden">
                <img src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80" alt="Urban" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ aspectRatio: "1/1" }} />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ backgroundColor: bgLight, padding: "60px 20px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <SectionHeading title="Featured Products" />
          {effectiveTabs.length > 1 && (
            <div className="flex justify-center gap-6 mb-8" style={{ fontFamily: "Poppins,sans-serif" }}>
              {effectiveTabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="text-xs font-semibold uppercase tracking-wider pb-1 transition-colors cursor-pointer" style={{ color: activeTab === tab ? accent : "#999999", borderBottom: activeTab === tab ? `2px solid ${accent}` : "2px solid transparent" }}>
                  {tab === "all" ? "All" : tab}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "30px" }}>
            {filteredProducts.slice(0, 8).map((product: any) => {
              const imgSrc = Array.isArray(product.images) ? product.images[0] : (product.images || "");
              const isSale = product.discount_price != null;
              return (
                <div key={product.id} className="group bg-white overflow-hidden text-center flex flex-col" style={{ border: "1px solid #f0f0f0" }}>
                  <Link href={`/store/${slug}/product/${product.id}`} className="block relative overflow-hidden bg-white">
                    <div style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                      <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    {isSale && (
                      <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold text-white uppercase" style={{ backgroundColor: accent }}>
                        Sale
                      </span>
                    )}
                  </Link>
                  <div style={{ padding: "15px 10px" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#aaaaaa" }}>{product.category || "General"}</p>
                    <Link href={`/store/${slug}/product/${product.id}`}>
                      <h3 className="text-sm font-medium leading-tight mb-2 hover:opacity-60 transition-opacity" style={{ fontFamily: "Poppins,sans-serif", color: "#000000" }}>{product.name}</h3>
                    </Link>
                    <div className="flex justify-center gap-2 items-baseline mb-3">
                      {isSale ? (
                        <>
                          <span className="text-sm font-bold" style={{ color: "#000000" }}>${product.discount_price.toFixed(2)}</span>
                          <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-sm font-bold" style={{ color: "#000000" }}>${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <button onClick={(e) => handleAddToCart(product, e)} className="w-full py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all cursor-pointer rounded-full" style={{ backgroundColor: "#000000" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      {mainCats.length > 0 && (
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 20px" }}>
          <SectionHeading title="Shop by Category" />
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(mainCats.length, 4)}, 1fr)`, gap: "30px" }}>
            {mainCats.slice(0, 4).map((cat: any) => (
              <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="group block text-center">
                <div className="overflow-hidden mb-4" style={{ backgroundColor: bgLight }}>
                  <img src={cat.image || "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&q=80"} alt={cat.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-sm font-semibold" style={{ fontFamily: "Poppins,sans-serif" }}>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#000000", padding: "60px 20px 30px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px", marginBottom: "40px" }}>
            <div>
              <h4 className="text-sm font-bold mb-4 text-white tracking-wide">{storeName}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "#999999" }}>Your premium destination for quality products. We bring you the best selection with exceptional service.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 text-white tracking-wide">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-xs hover:opacity-60 transition-opacity" style={{ color: "#999999" }}>{link.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 text-white tracking-wide">Contact</h4>
              <p className="text-xs" style={{ color: "#999999", lineHeight: 1.8 }}>Email: info@{slug}.com<br />Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 text-white tracking-wide">Follow Us</h4>
              <div className="flex gap-3">
                {["FB", "TW", "IG", "YT"].map((s) => (
                  <span key={s} className="w-8 h-8 flex items-center justify-center text-[10px] font-bold border border-gray-700 text-white hover:bg-white hover:text-black transition-colors cursor-pointer">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-800 text-center">
            <p className="text-[10px]" style={{ color: "#666666" }}>&copy; 2026 {storeName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
