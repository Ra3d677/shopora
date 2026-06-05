"use client";

import React from "react";
import Link from "next/link";

export default function NetroFooter({ slug, store }: { slug: string; store: any }) {
  const storeName = store?.settings?.storeName || store?.name || "Store";

  const footerLinks = [
    { label: "Home", href: `/store/${slug}` },
    { label: "Products", href: `/store/${slug}/products` },
    { label: "Cart", href: `/store/${slug}/cart` },
    { label: "Contact", href: `/store/${slug}/contact` },
  ];

  return (
    <footer style={{ backgroundColor: "#000000", padding: "60px 20px 30px", fontFamily: "Poppins,sans-serif" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
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
  );
}
