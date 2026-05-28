"use client";

import React, { useState, useEffect } from "react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Search, Heart, ShoppingCart, User, Menu, MapPin, Phone, Mail, Clock, Rocket, Undo2, Info, Shield } from "lucide-react";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
  session?: any;
}

const DEFAULT_HERO_SLIDES = [
  { heading: "TOP HEADPHONES", description: "Performance<br/>Wonderful", buttonText: "799$ | Buy Now!", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80" },
  { heading: "TOP SMARTPHONES", description: "Latest Technology<br/>Amazing", buttonText: "999$ | Buy Now!", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80" },
  { heading: "Smartwatch", description: "Stay Connected<br/>Anywhere", buttonText: "299$ | Buy Now!", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80" },
];

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="flex flex-col items-center" style={{ padding: "15px 15px 25px" }}>
    <h2 className="text-[24px] md:text-[28px] font-bold text-center" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{title}</h2>
    {subtitle && <p className="text-sm text-center mt-2" style={{ fontFamily: "Lato,sans-serif", color: "#666666" }}>{subtitle}</p>}
  </div>
);

export default function TwoMTemplate({ banners, settings, products, slug, categories, session }: TemplateProps) {
  const primary = "#fed700";
  const hoverAccent = "#e1205e";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80", title: "Audio Collection", subtitle: "Wireless & Premium" },
    { imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80", title: "Cameras", subtitle: "Capture Every Moment" },
  ];

  const features = [
    { icon: Rocket, title: "Free Shipping", desc: "orders $50 or more" },
    { icon: Undo2, title: "Free Returns", desc: "within 30 days" },
    { icon: Info, title: "Get 20% Off 1 Item", desc: "when you sign up" },
    { icon: Shield, title: "We Support", desc: "24/7 amazing services" },
  ];

  const categoriesList = [
    { name: "Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80", slug: "" },
    { name: "Smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", slug: "" },
    { name: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80", slug: "" },
    { name: "Cameras", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80", slug: "" },
    { name: "Watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", slug: "" },
    { name: "Speakers", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", slug: "" },
  ];

  const blogPosts = [
    { title: "Top 10 Gadgets of 2025", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80", date: "Mar 15, 2025" },
    { title: "How to Choose the Perfect Smartphone", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", date: "Feb 28, 2025" },
    { title: "Wireless Audio Revolution", image: "https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80", date: "Jan 10, 2025" },
  ];

  const displayProducts = products.length > 0 ? products : Array.from({ length: 8 }, (_, i) => ({
    id: `demo-${i}`,
    name: ["Wireless Headphones","Smart Speaker","USB-C Hub","Bluetooth Earbuds","Laptop Stand","Phone Case","Power Bank","Desk Lamp"][i],
    price: [79.99, 149.99, 34.99, 59.99, 44.99, 19.99, 39.99, 29.99][i],
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c30d06e?w=400&q=80","https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80","https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&q=80","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80","https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80","https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"][i],
    slug: "",
    category: ["Audio","Audio","Accessories","Audio","Accessories","Accessories","Accessories","Accessories"][i],
  }));

  return (
    <div className="font-['Lato',sans-serif]">
      {/* ====== TOP BAR ====== */}
      <div className="hidden lg:block" style={{ backgroundColor: "#333333", color: "#ffffff", fontSize: "12px" }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between" style={{ padding: "0px 15px", minHeight: "40px" }}>
          <div className="flex items-center gap-4">
            <span>English</span>
            <span className="opacity-30">|</span>
            <span>USD</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/store/${slug}/contact`} className="hover:opacity-70 transition-opacity" style={{ color: "#ffffff" }}>CONTACT US</Link>
            <Link href={`/store/${slug}/faqs`} className="hover:opacity-70 transition-opacity" style={{ color: "#ffffff" }}>FAQS</Link>
            <Link href={`/store/${slug}/account`} className="hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: "#ffffff" }}>
              <User size={13} /> Account
            </Link>
            <Link href={`/store/${slug}/wishlist`} className="hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: "#ffffff" }}>
              <Heart size={13} /> Wishlist
            </Link>
            <Link href={`/store/${slug}/cart`} className="hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: "#ffffff" }}>
              <ShoppingCart size={13} /> Cart
            </Link>
          </div>
        </div>
      </div>

      {/* ====== HEADER MAIN ====== */}
      <div style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between" style={{ padding: "20px 15px" }}>
          {/* Logo */}
          <Link href={`/store/${slug}`} className="text-2xl font-black" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>
            ELECTRONICS
          </Link>

          {/* Search - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-[500px] mx-8" style={{ border: "2px solid #ebebeb" }}>
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
              style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}
            />
            <button className="px-5 py-2.5 transition-colors" style={{ backgroundColor: primary, color: "#333333" }}>
              <Search size={18} />
            </button>
          </div>

          {/* Cart - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href={`/store/${slug}/account`} className="p-2 hover:opacity-60 transition-opacity">
              <User size={22} style={{ color: "#333333" }} />
            </Link>
            <Link href={`/store/${slug}/wishlist`} className="p-2 hover:opacity-60 transition-opacity">
              <Heart size={22} style={{ color: "#333333" }} />
            </Link>
            <Link href={`/store/${slug}/cart`} className="p-2 hover:opacity-60 transition-opacity relative">
              <ShoppingCart size={22} style={{ color: "#333333" }} />
              <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: primary, color: "#333333", borderRadius: "50%" }}>0</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={24} style={{ color: "#333333" }} />
          </button>
        </div>
      </div>

      {/* ====== MENU BAR ====== */}
      <div className="hidden lg:block" style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}>
        <div className="max-w-[1200px] mx-auto flex" style={{ padding: "0px 15px" }}>
          <div className="flex items-center gap-1 px-5 py-3 text-sm font-bold uppercase cursor-pointer" style={{ backgroundColor: primary, color: "#333333" }}>
            <Menu size={16} className="mr-2" />
            All Categories
          </div>
          <nav className="flex items-center gap-6 ml-8">
            {["Home", "Shop", "Audio", "Wearables", "Accessories", "Blog"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? `/store/${slug}` : `/store/${slug}/products`}
                className="text-xs font-bold uppercase tracking-wider py-3 transition-colors"
                style={{ color: "#333333" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#333333"; }}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: "#ffffff", borderTop: "1px solid #ebebeb" }}>
          <div className="max-w-[1200px] mx-auto" style={{ padding: "15px" }}>
            <div className="flex items-center mb-4" style={{ border: "2px solid #ebebeb" }}>
              <input type="text" placeholder="Search..." className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }} />
              <button className="px-5 py-2.5" style={{ backgroundColor: primary, color: "#333333" }}><Search size={16} /></button>
            </div>
            {["Home", "Shop", "Audio", "Wearables", "Accessories", "Blog"].map((item) => (
              <Link key={item} href={item === "Home" ? `/store/${slug}` : `/store/${slug}/products`} className="block py-3 text-sm font-bold uppercase border-b" style={{ color: "#333333", borderColor: "#ebebeb" }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ====== HERO SLIDER ====== */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#f8f8f8" }}>
        <div className="relative" style={{ minHeight: "400px" }}>
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)" }} />
              <div className="relative max-w-[1200px] mx-auto flex items-center" style={{ padding: "60px 15px", minHeight: "400px" }}>
                <div className="max-w-lg">
                  <h1 className="text-3xl md:text-5xl font-black mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#ffffff", lineHeight: "1.2" }}>
                    {slide.heading}
                  </h1>
                  <p className="text-base md:text-lg mb-6" style={{ color: "#cccccc", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: slide.description }} />
                  {slide.buttonText && (
                    <Link
                      href={`/store/${slug}/products`}
                      className="inline-block px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors"
                      style={{ backgroundColor: primary, color: "#333333" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverAccent; e.currentTarget.style.color = "#ffffff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
                    >
                      {slide.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="w-3 h-3 transition-all"
              style={{ backgroundColor: index === currentSlide ? primary : "rgba(255,255,255,0.5)", borderRadius: "0" }}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 transition-opacity hover:opacity-70"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#ffffff" }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 transition-opacity hover:opacity-70"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#ffffff" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ====== CTA BANNERS (Category banners) ====== */}
      <div className="max-w-[1200px] mx-auto" style={{ padding: "40px 15px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ctaBanners.map((banner, i) => (
            <Link key={i} href={`/store/${slug}/products`} className="relative group block overflow-hidden" style={{ minHeight: "250px" }}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${banner.imageUrl})` }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4), transparent)" }} />
              <div className="relative p-8 flex flex-col justify-end h-full" style={{ minHeight: "250px" }}>
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "Lato,sans-serif", color: "#ffffff" }}>{banner.title || `Category ${i + 1}`}</h3>
                <p className="text-sm" style={{ color: "#cccccc" }}>{banner.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ====== FEATURED PRODUCTS GRID ====== */}
      <div className="max-w-[1200px] mx-auto" style={{ padding: "30px 15px 50px" }}>
        <SectionHeading title="Featured Products" subtitle="Top selling electronics this week" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {displayProducts.slice(0, 8).map((product: any) => (
            <Link
              key={product.id}
              href={product.slug ? `/store/${slug}/product/${product.id}` : `/store/${slug}/products`}
              className="group"
            >
              <div className="relative overflow-hidden mb-3" style={{ backgroundColor: "#f8f8f8" }}>
                <img
                  src={Array.isArray(product.images) ? product.images[0] : product.images}
                  alt={product.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#999999" }}>{product.category || "Electronics"}</p>
              <h3 className="text-sm font-semibold mb-1 transition-colors group-hover:opacity-60" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{product.name}</h3>
              <p className="text-sm font-bold" style={{ color: "#333333" }}>${product.price?.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ====== NEW ARRIVALS / SECOND GRID ====== */}
      <div style={{ backgroundColor: "#f8f8f8" }}>
        <div className="max-w-[1200px] mx-auto" style={{ padding: "50px 15px" }}>
          <SectionHeading title="New Arrivals" subtitle="Check out the latest products" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {displayProducts.slice(0, 8).reverse().map((product: any) => (
              <Link
                key={product.id}
                href={product.slug ? `/store/${slug}/product/${product.id}` : `/store/${slug}/products`}
                className="group"
              >
                <div className="relative overflow-hidden mb-3" style={{ backgroundColor: "#ffffff" }}>
                  <img
                    src={Array.isArray(product.images) ? product.images[0] : product.images}
                    alt={product.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#999999" }}>{product.category || "Electronics"}</p>
                <h3 className="text-sm font-semibold mb-1 transition-colors group-hover:opacity-60" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{product.name}</h3>
                <p className="text-sm font-bold" style={{ color: "#333333" }}>${product.price?.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ====== BLOG SECTION ====== */}
      <div className="max-w-[1200px] mx-auto" style={{ padding: "50px 15px" }}>
        <SectionHeading title="Latest From Blog" subtitle="Stay updated with our latest news" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <Link key={i} href={`/store/${slug}/blog`} className="group">
              <div className="overflow-hidden mb-4">
                <img src={post.image} alt={post.title} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="text-xs mb-2" style={{ color: "#999999" }}>{post.date}</p>
              <h3 className="text-base font-bold transition-colors group-hover:opacity-60" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>{post.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* ====== FOOTER ====== */}
      <footer>
        {/* Features bar */}
        <div style={{ backgroundColor: "#f8f8f8", borderTop: "1px solid #ebebeb" }}>
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6" style={{ padding: "40px 15px" }}>
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-center gap-4">
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

        {/* Main footer */}
        <div style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8" style={{ padding: "50px 15px" }}>
            {/* Logo + Contact */}
            <div>
              <Link href={`/store/${slug}`} className="text-xl font-black block mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>
                ELECTRONICS
              </Link>
              <div className="space-y-3 text-sm" style={{ color: "#666666" }}>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: primary }} />
                  <span>123 Tech Street, Silicon Valley, CA 94025</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0" style={{ color: primary }} />
                  <a href="tel:+1234567890" className="hover:underline" style={{ color: "#666666" }}>(+1) 234 567 890</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0" style={{ color: primary }} />
                  <a href="mailto:support@electronics.com" className="hover:underline" style={{ color: "#666666" }}>support@electronics.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="shrink-0" style={{ color: primary }} />
                  <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>

            {/* Information links */}
            <div>
              <h4 className="text-sm font-bold uppercase mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>Information</h4>
              <ul className="space-y-2 text-sm">
                {["About Us", "Delivery Information", "Privacy Policy", "Terms & Conditions", "Contact Us"].map((link) => (
                  <li key={link}>
                    <Link href={`/store/${slug}/products`} className="transition-colors" style={{ color: "#666666" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = hoverAccent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* My Account links */}
            <div>
              <h4 className="text-sm font-bold uppercase mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>My Account</h4>
              <ul className="space-y-2 text-sm">
                {["My Account", "Order History", "Wishlist", "Shopping Cart", "Checkout"].map((link) => (
                  <li key={link}>
                    <Link href={`/store/${slug}/account`} className="transition-colors" style={{ color: "#666666" }}
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
            <div>
              <h4 className="text-sm font-bold uppercase mb-4" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>Newsletter</h4>
              <p className="text-sm mb-4" style={{ color: "#666666" }}>Subscribe to get special offers and updates.</p>
              <div className="flex" style={{ height: "45px" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 text-sm outline-none"
                  style={{ border: "1px solid #ebebeb", color: "#333333", fontFamily: "Lato,sans-serif" }}
                />
                <button className="px-5 text-sm font-bold uppercase transition-colors" style={{ backgroundColor: primary, color: "#333333" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ backgroundColor: "#ffffff", borderTop: "1px solid #ebebeb" }}>
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between" style={{ padding: "20px 15px" }}>
            <p className="text-xs" style={{ color: "#666666" }}>Copyright &copy; 2025 Akira Store. All Rights Reserved.</p>
            <div className="flex gap-2 mt-3 md:mt-0">
              {["https://cdn.jsdelivr.net/gh/multo-pay/icons/paypal.svg","https://cdn.jsdelivr.net/gh/multo-pay/icons/visa.svg","https://cdn.jsdelivr.net/gh/multo-pay/icons/mastercard.svg","https://cdn.jsdelivr.net/gh/multo-pay/icons/amex.svg"].map((src, i) => (
                <div key={i} className="w-10 h-7" style={{ backgroundColor: "#f8f8f8" }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
