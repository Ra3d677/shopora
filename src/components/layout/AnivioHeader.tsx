"use client";

import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Menu, Phone } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useState } from "react";

export default function AnivioHeader({ store, slug, categories }: { store: any; slug: string; categories: any[] }) {
  const primary = "#fed700";
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = items.filter((i: any) => i.storeId === store.id).length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/store/${slug}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="font-['Poppins',sans-serif] w-full" style={{ color: "#333333", backgroundColor: "#ffffff" }}>
      {/* ====== TOP BAR ====== */}
      <div className="hidden lg:block" style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: "1200px", height: "45px", padding: "0 15px" }}>
          {/* Phone (Left) */}
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "#666666" }}>
            <Phone size={13} style={{ color: "#999999" }} />
            <span>(563) 474-8953</span>
          </div>

          {/* Search form (Center) */}
          <form onSubmit={handleSearch} className="flex items-center relative w-full max-w-sm" style={{ borderBottom: "1px solid #e5e5e5" }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-transparent outline-none py-1.5 pr-8 font-medium"
              style={{ color: "#333333", border: "none" }}
            />
            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2" style={{ color: "#999999" }}>
              <Search size={14} />
            </button>
          </form>

          {/* Social Icons (Right) */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-400 hover:text-zinc-800 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-800 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-800 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <Link href={`/store/${slug}/contact`} className="text-xs font-semibold uppercase tracking-wider transition-colors hover:opacity-75" style={{ color: "#666666" }}>Contact Us</Link>
          </div>
        </div>
      </div>

      {/* ====== MAIN HEADER ====== */}
      <div style={{ borderBottom: "1px solid #ebebeb", position: "relative", zIndex: 50 }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: "1200px", padding: "0 15px", height: "90px" }}>
          
          {/* Logo (Left Column) */}
          <div className="flex items-center">
            <Link href={`/store/${slug}`} className="shrink-0">
              {store.settings?.logoUrl ? (
                <img src={store.settings.logoUrl} alt={store.name} className="h-9 object-contain" />
              ) : (
                <span className="text-2xl font-black tracking-widest uppercase italic" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {store.name}
                </span>
              )}
            </Link>
          </div>

          {/* Centered Navigation Menu (Center Column) */}
          <nav className="hidden lg:flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest">
            <Link href={`/store/${slug}`} className="hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>Home</Link>
            <Link href={`/store/${slug}/products`} className="hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>Shop</Link>
            {categories.slice(0, 4).map((cat: any) => (
              <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>{cat.name}</Link>
            ))}
            <Link href={`/store/${slug}/contact`} className="hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>Contact</Link>
          </nav>

          {/* Action Icons (Right Column) */}
          <div className="flex items-center gap-5 shrink-0">
            <Link href={`/store/${slug}/account`} className="flex flex-col items-center gap-0.5 hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>
              <User size={19} />
              <span className="hidden md:inline text-[9px] font-bold uppercase tracking-wider">Account</span>
            </Link>
            
            <Link href={`/store/${slug}/wishlist`} className="flex flex-col items-center gap-0.5 hover:opacity-60 transition-opacity relative" style={{ color: "#333333" }}>
              <Heart size={19} />
              <span className="hidden md:inline text-[9px] font-bold uppercase tracking-wider">Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full text-white bg-zinc-950">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href={`/store/${slug}/cart`} className="flex flex-col items-center gap-0.5 hover:opacity-60 transition-opacity relative" style={{ color: "#333333" }}>
              <ShoppingCart size={19} />
              <span className="hidden md:inline text-[9px] font-bold uppercase tracking-wider">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full text-white bg-zinc-950">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-zinc-800 hover:opacity-60 transition-opacity"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-[90px] left-0 right-0 bg-white shadow-lg border-b lg:hidden py-4 px-6 flex flex-col gap-3 font-semibold uppercase text-xs tracking-wider" style={{ zIndex: 100 }}>
            <Link href={`/store/${slug}`} onClick={() => setMobileMenuOpen(false)} className="py-2 hover:opacity-60 transition-opacity border-b border-zinc-100">Home</Link>
            <Link href={`/store/${slug}/products`} onClick={() => setMobileMenuOpen(false)} className="py-2 hover:opacity-60 transition-opacity border-b border-zinc-100">Shop</Link>
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} onClick={() => setMobileMenuOpen(false)} className="py-2 hover:opacity-60 transition-opacity border-b border-zinc-100">{cat.name}</Link>
            ))}
            <Link href={`/store/${slug}/contact`} onClick={() => setMobileMenuOpen(false)} className="py-2 hover:opacity-60 transition-opacity">Contact</Link>
          </div>
        )}
      </div>
    </header>
  );
}
