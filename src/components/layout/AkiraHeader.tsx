"use client";

import Link from "next/link";
import { Search, Heart, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

export default function AkiraHeader({ store, slug, categories }: { store: any; slug: string; categories: any[] }) {
  const primary = "#fed700";
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = items.filter((i: any) => i.storeId === store.id).length;

  return (
    <header className="font-['Lato',sans-serif]" style={{ color: "#333333" }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #e5e5e5" }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: "1200px", height: "42px", padding: "0 15px", fontSize: "12px" }}>
          <div className="flex items-center gap-4" style={{ color: "#666666" }}>
            <span>FREE SHIPPING FOR ALL ORDERS OF $150</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:opacity-60 transition-opacity" style={{ color: "#666666", fontSize: "14px" }}>f</a>
            <a href="#" className="hover:opacity-60 transition-opacity" style={{ color: "#666666", fontSize: "14px" }}>𝕏</a>
            <a href="#" className="hover:opacity-60 transition-opacity" style={{ color: "#666666", fontSize: "14px" }}>📷</a>
            <Link href={`/store/${slug}/contact`} className="hover:opacity-60 transition-opacity uppercase tracking-wider" style={{ color: "#666666", marginLeft: "8px" }}>Contact Us</Link>
            <Link href={`/store/${slug}/faq`} className="hover:opacity-60 transition-opacity uppercase tracking-wider" style={{ color: "#666666" }}>FAQs</Link>
          </div>
        </div>
      </div>

      {/* Logo + Search + Icons */}
      <div style={{ borderBottom: "1px solid #e5e5e5" }}>
        <div className="mx-auto flex items-center" style={{ maxWidth: "1200px", padding: "0 15px", height: "90px", gap: "30px" }}>
          <Link href={`/store/${slug}`} className="shrink-0">
            {store.settings?.logoUrl ? (
              <img src={store.settings.logoUrl} alt={store.name} className="h-10 object-contain" />
            ) : (
              <span className="text-2xl font-bold tracking-tight uppercase">{store.name}</span>
            )}
          </Link>

          <div className="flex-1 max-w-xl mx-auto">
            <div className="flex" style={{ border: "2px solid #e5e5e5" }}>
              <input type="text" placeholder="Enter your keyword ..." className="flex-1 outline-none px-4 py-2.5 text-sm" style={{ color: "#999999", border: "none", backgroundColor: "#ffffff" }} />
              <button className="px-6 text-sm font-bold uppercase tracking-wider transition-colors" style={{ backgroundColor: primary, color: "#333333" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
              >Search</button>
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <Link href={`/store/${slug}/account`} className="flex flex-col items-center gap-0.5 hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>
              <User size={20} />
              <span className="text-[10px] uppercase tracking-wider">Account</span>
            </Link>
            <Link href={`/store/${slug}/wishlist`} className="flex flex-col items-center gap-0.5 hover:opacity-60 transition-opacity relative" style={{ color: "#333333" }}>
              <Heart size={20} />
              <span className="text-[10px] uppercase tracking-wider">Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full" style={{ backgroundColor: primary, color: "#333333" }}>{wishlistItems.length}</span>
              )}
            </Link>
            <Link href={`/store/${slug}/cart`} className="flex flex-col items-center gap-0.5 hover:opacity-60 transition-opacity relative" style={{ color: "#333333" }}>
              <ShoppingCart size={20} />
              <span className="text-[10px] uppercase tracking-wider">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full" style={{ backgroundColor: primary, color: "#333333" }}>{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ borderBottom: "1px solid #e5e5e5" }}>
        <div className="mx-auto flex items-center" style={{ maxWidth: "1200px", padding: "0 15px", height: "50px" }}>
          <div className="flex items-center h-full px-5 mr-8" style={{ backgroundColor: primary }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#333333" }}>All Categories</span>
            <ChevronDown size={14} className="ml-2" style={{ color: "#333333" }} />
          </div>
          <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
            <Link href={`/store/${slug}`} className="hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>Home</Link>
            <Link href={`/store/${slug}/products`} className="hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>Shop</Link>
            {categories.slice(0, 4).map((cat: any) => (
              <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>{cat.name}</Link>
            ))}
            <Link href={`/store/${slug}/contact`} className="hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
