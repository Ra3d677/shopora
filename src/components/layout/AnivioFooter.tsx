"use client";

import Link from "next/link";
import { Home, Phone, Mail, Clock } from "lucide-react";

export default function AnivioFooter({ slug, store }: { slug: string; store: any }) {
  return (
    <footer className="font-['Poppins',sans-serif] border-t" style={{ backgroundColor: "#ffffff", borderColor: "#ebebeb", color: "#666666" }}>
      {/* Main Footer */}
      <div style={{ padding: "60px 0 45px" }}>
        <div className="mx-auto" style={{ maxWidth: "1200px", padding: "0 15px" }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo & Contact Info */}
            <div>
              <Link href={`/store/${slug}`} className="inline-block mb-6">
                {store.settings?.logoUrl ? (
                  <img src={store.settings.logoUrl} alt={store.name} className="h-9 object-contain" />
                ) : (
                  <span className="text-xl font-black tracking-widest uppercase italic" style={{ color: "#333333" }}>{store.name}</span>
                )}
              </Link>
              <ul className="space-y-4 text-xs font-medium">
                <li className="flex items-start gap-3">
                  <Home size={14} className="mt-0.5 shrink-0" style={{ color: "#999999" }} />
                  <span>82 Valley Farms Court Grovetown</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={14} className="mt-0.5 shrink-0" style={{ color: "#999999" }} />
                  <span>(546) 347-9636</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={14} className="mt-0.5 shrink-0" style={{ color: "#999999" }} />
                  <span>sswstudio@gmail.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={14} className="mt-0.5 shrink-0" style={{ color: "#999999" }} />
                  <span>Mon - Sat : 8 AM - 5 PM</span>
                </li>
              </ul>
            </div>

            {/* My Account */}
            <div>
              <h5 className="text-xs font-bold mb-6 uppercase tracking-widest" style={{ color: "#333333" }}>My Account</h5>
              <ul className="space-y-3 text-xs font-semibold">
                {["About us", "Legal Notice", "Addresses", "Order", "Payment"].map((item) => (
                  <li key={item} className="transition-colors hover:opacity-75">
                    <Link href={`/store/${slug}`}>{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h5 className="text-xs font-bold mb-6 uppercase tracking-widest" style={{ color: "#333333" }}>Information</h5>
              <ul className="space-y-3 text-xs font-semibold">
                {["Delivery", "Legal Notice", "About us", "Prices drop"].map((item) => (
                  <li key={item} className="transition-colors hover:opacity-75">
                    <Link href={`/store/${slug}`}>{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-xs font-bold mb-6 uppercase tracking-widest" style={{ color: "#333333" }}>Newsletter</h5>
              <p className="text-xs font-medium mb-4 leading-relaxed">Subscribe to our newsletter and get 10% off your first purchase</p>
              <div className="flex border" style={{ maxWidth: "270px", borderColor: "#e5e5e5" }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="outline-none flex-1 px-4 py-2 text-xs font-medium bg-transparent"
                  style={{ color: "#333333" }}
                />
                <button
                  className="px-4 text-xs font-bold transition-colors uppercase tracking-wider"
                  style={{ backgroundColor: "#333333", color: "#ffffff", border: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#666666"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#333333"; }}
                >
                  OK
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: "1px solid #ebebeb", padding: "25px 0" }}>
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between" style={{ maxWidth: "1200px", padding: "0 15px", gap: "10px" }}>
          <p className="text-xs font-medium" style={{ color: "#999999" }}>Copyright &copy; 2026 {store.name}. All Rights Reserved.</p>
          <img src="https://akira-elementor.axonvip.com/modules/axoncreator/img/demo3-payment.png" alt="Payment methods" className="h-5 opacity-80" />
        </div>
      </div>
    </footer>
  );
}
