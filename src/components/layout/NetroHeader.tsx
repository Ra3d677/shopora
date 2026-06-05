"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

const accent = "#ff7245";

export default function NetroHeader({ store, slug, categories }: { store: any; slug: string; categories: any[] }) {
  const storeName = store?.settings?.storeName || store?.name || "Store";
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = items.filter((i: any) => i.storeId === store?.id).length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: `/store/${slug}` },
    { label: "Products", href: `/store/${slug}/products` },
    { label: "Cart", href: `/store/${slug}/cart` },
    { label: "Contact", href: `/store/${slug}/contact` },
  ];

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 sticky top-0" style={{ fontFamily: "Poppins,sans-serif", zIndex: 100 }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: "1400px", padding: "0 20px", height: "70px" }}>
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileMenuOpen(true)} className="flex items-center justify-center cursor-pointer lg:hidden" style={{ width: "40px", height: "40px" }}>
              <Menu size={22} />
            </button>
            <Link href={`/store/${slug}`} className="font-bold tracking-tight text-lg" style={{ fontFamily: "Poppins,sans-serif", color: "#000000" }}>
              {storeName}
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
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
            <Link href={`/store/${slug}/wishlist`} className="p-2 hover:opacity-60 transition-opacity relative">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full" style={{ backgroundColor: accent }}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href={`/store/${slug}/cart`} className="p-2 hover:opacity-60 transition-opacity relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full" style={{ backgroundColor: accent }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 lg:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl" style={{ padding: "20px" }}>
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg" style={{ fontFamily: "Poppins,sans-serif" }}>{storeName}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="cursor-pointer"><X size={22} /></button>
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:opacity-60 transition-opacity" style={{ fontFamily: "Poppins,sans-serif" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
