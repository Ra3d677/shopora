"use client";

import Link from "next/link";
import { Home, Phone, Mail, Clock } from "lucide-react";

export default function AkiraFooter({ slug, store }: { slug: string; store: any }) {
  return (
    <footer className="font-['Lato',sans-serif]" style={{ backgroundColor: "#fafafa", color: "#666666" }}>
      {/* Features Bar */}
      <div style={{ borderBottom: "1px solid #e5e5e5" }}>
        <div className="mx-auto grid grid-cols-2 md:grid-cols-4" style={{ maxWidth: "1200px", padding: "0 15px" }}>
          {[
            { icon: "🚀", title: "Free Shipping", desc: "orders $50 or more" },
            { icon: "↩️", title: "Free Returns", desc: "within 30 days" },
            { icon: "ℹ️", title: "Get 20% Off 1 Item", desc: "when you sign up" },
            { icon: "⭐", title: "We Support", desc: "24/7 amazing services" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-6 px-2" style={{ borderRight: i < 3 ? "1px solid #e5e5e5" : "none" }}>
              <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-full" style={{ backgroundColor: "#fed700", color: "#333333", fontSize: "18px" }}>
                {item.icon === "🚀" && <span className="text-lg">🚀</span>}
                {item.icon === "↩️" && <span className="text-lg">↩️</span>}
                {item.icon === "ℹ️" && <span className="text-lg">ℹ️</span>}
                {item.icon === "⭐" && <span className="text-lg">⭐</span>}
              </div>
              <div>
                <h6 className="text-sm font-bold" style={{ color: "#333333" }}>{item.title}</h6>
                <p className="text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ padding: "60px 0 40px" }}>
        <div className="mx-auto" style={{ maxWidth: "1200px", padding: "0 15px" }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Contact */}
            <div>
              <Link href={`/store/${slug}`} className="inline-block mb-6">
                {store.settings?.logoUrl ? (
                  <img src={store.settings.logoUrl} alt={store.name} className="h-10 object-contain" />
                ) : (
                  <span className="text-xl font-bold tracking-tight uppercase" style={{ color: "#333333" }}>{store.name}</span>
                )}
              </Link>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Home size={14} className="mt-0.5 shrink-0" style={{ color: "#fed700" }} />
                  <span>82 Valley Farms Court Grovetown</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={14} className="mt-0.5 shrink-0" style={{ color: "#fed700" }} />
                  <span>(546) 347-9636</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={14} className="mt-0.5 shrink-0" style={{ color: "#fed700" }} />
                  <span>contact@store.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={14} className="mt-0.5 shrink-0" style={{ color: "#fed700" }} />
                  <span>Mon - Sat : 8 AM - 5 PM</span>
                </li>
              </ul>
            </div>

            {/* My Account */}
            <div>
              <h5 className="text-sm font-bold mb-6 uppercase" style={{ color: "#333333" }}>My Account</h5>
              <ul className="space-y-3 text-sm">
                {["About us", "Legal Notice", "Addresses", "Order", "Payment"].map((item) => (
                  <li key={item}><Link href={`/store/${slug}`} className="hover:opacity-60 transition-opacity">{item}</Link></li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h5 className="text-sm font-bold mb-6 uppercase" style={{ color: "#333333" }}>Information</h5>
              <ul className="space-y-3 text-sm">
                {["Delivery", "Legal Notice", "About us", "New products", "Prices drop"].map((item) => (
                  <li key={item}><Link href={`/store/${slug}`} className="hover:opacity-60 transition-opacity">{item}</Link></li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-sm font-bold mb-3 uppercase" style={{ color: "#333333" }}>Newsletter</h5>
              <p className="text-sm mb-4">Subscribe to our newsletter and get 10% off your first purchase</p>
              <div className="flex" style={{ maxWidth: "270px" }}>
                <input type="email" placeholder="Your email address" className="outline-none flex-1 px-4 py-2.5 text-sm" style={{ border: "1px solid #e5e5e5", backgroundColor: "#ffffff", color: "#999999" }} />
                <button className="px-4 text-sm font-bold transition-colors" style={{ backgroundColor: "#fed700", color: "#333333", border: "1px solid #fed700" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#333333"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fed700"; e.currentTarget.style.color = "#333333"; e.currentTarget.style.borderColor = "#fed700"; }}
                >OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: "1px solid #e5e5e5", padding: "20px 0" }}>
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between" style={{ maxWidth: "1200px", padding: "0 15px", gap: "10px" }}>
          <p className="text-xs" style={{ color: "#666666" }}>Copyright &copy; 2026 {store.name}. All Rights Reserved.</p>
          <img src="https://akira-elementor.axonvip.com/modules/axoncreator/img/demo3-payment.png" alt="Payment methods" className="h-6" />
        </div>
      </div>
    </footer>
  );
}
