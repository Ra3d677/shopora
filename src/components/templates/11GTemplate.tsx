"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { IMG } from "./11GImages";

interface Props {
  store?: any;
  banners?: any[];
  settings?: any;
  products?: any[];
  slug?: string;
  categories?: any[];
}

const COLORS = {
  primary: "#1e88e5",
  primaryDark: "#072066",
  accent: "#2196f3",
};

export default function ElevenGTemplate(props: Props) {
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "", newsletter: false, agree: false });
  const [counters, setCounters] = useState({ projects: 0, clients: 0, tickets: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // Typed effect
  useEffect(() => {
    const words = ["Innovation", "Technology", "Digital", "The Future"];
    let i = 0, j = 0, dir = 1;
    const interval = setInterval(() => {
      const word = words[i];
      if (dir === 1) {
        j++;
        setTypedText(word.slice(0, j));
        if (j >= word.length) { dir = -1; setTimeout(() => {}, 1500); }
      } else {
        j--;
        setTypedText(word.slice(0, j));
        if (j <= 0) { dir = 1; i = (i + 1) % words.length; }
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Counter animation
  useEffect(() => {
    if (page !== "home") return;
    const targets = { projects: 3785, clients: 9800, tickets: 1052 };
    const duration = 2000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCounters({
        projects: Math.floor(progress * targets.projects),
        clients: Math.floor(progress * targets.clients),
        tickets: Math.floor(progress * targets.tickets),
      });
      if (progress >= 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [page]);

  const navLinks = [
    { label: "Home", href: "#home", page: "home" },
    { label: "About Us", href: "#about", page: "about" },
    { label: "Services", href: "#services", page: "services" },
    { label: "Portfolio", href: "#portfolio", page: "portfolio" },
    { label: "Blog", href: "#blog", page: "blog" },
    { label: "Pages", dropdown: true, items: [
      { label: "Process", page: "process" },
      { label: "Pricing", page: "pricing" },
      { label: "Team", page: "team" },
      { label: "FAQs", page: "faqs" },
    ]},
    { label: "Contact Us", href: "#contact", page: "contact" },
  ];

  const nav = (
    <nav className={`navbar ${mobileOpen ? "open" : ""}`}>
      <style>{`
        .navbar ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 0.25rem; align-items: center; }
        .navbar ul li { position: relative; }
        .navbar ul li a { color: ${darkMode ? "#e0e0e0" : "#333"}; text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; white-space: nowrap; }
        .navbar ul li a:hover { color: ${COLORS.primary}; background: ${darkMode ? "rgba(30,136,229,0.1)" : "rgba(30,136,229,0.05)"}; }
        .navbar ul li .dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background: ${darkMode ? "#1a1a2e" : "#fff"}; border: 1px solid ${darkMode ? "#333" : "#e0e0e0"}; border-radius: 0.75rem; padding: 0.5rem; min-width: 180px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); z-index: 100; }
        .navbar ul li .dropdown-menu.open { display: block; }
        .navbar ul li .dropdown-menu a { display: block; padding: 0.5rem 1rem; font-size: 0.8125rem; }
        @media (max-width: 1024px) {
          .navbar { display: ${mobileOpen ? "block" : "none"}; position: fixed; top: 70px; left: 0; right: 0; background: ${darkMode ? "#0d0d1a" : "#fff"}; border-bottom: 1px solid ${darkMode ? "#333" : "#e0e0e0"}; padding: 1rem; z-index: 99; max-height: calc(100vh - 70px); overflow-y: auto; }
          .navbar ul { flex-direction: column; gap: 0.25rem; }
          .navbar ul li .dropdown-menu { position: static; box-shadow: none; border: none; padding: 0 0 0 1rem; background: transparent; }
          .navbar ul li .dropdown-menu.open { display: block; }
        }
      `}</style>
      <ul>
        {navLinks.map((link) => (
          <li key={link.label}>
            {"dropdown" in link && link.dropdown ? (
              <>
                <a href="#" onClick={(e) => { e.preventDefault(); setOpenDropdown(openDropdown === link.label ? null : link.label); }}
                  style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {link.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </a>
                <div className={`dropdown-menu ${openDropdown === link.label ? "open" : ""}`}>
                  {link.items.map((item) => (
                    <a key={item.page} href="#" onClick={(e) => { e.preventDefault(); setPage(item.page); setMobileOpen(false); setOpenDropdown(null); }}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <a href={link.href} onClick={(e) => { e.preventDefault(); setPage(link.page || "home"); setMobileOpen(false); }}>
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );

  // ---- RENDER FUNCTIONS FOR EACH PAGE ----
  const renderHome = () => (
    <>
      {/* Hero */}
      <section id="home" className="hero-section" style={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: COLORS.primaryDark, padding: "6rem 0" }}>
        <style>{`
          .hero-section::before { content: ''; position: absolute; inset: 0; background: url(${IMG["bg-hand-ia"]}) left center/contain no-repeat fixed; opacity: 0.15; pointer-events: none; }
        `}</style>
        <div className="container mx-auto px-4 relative z-10" style={{ maxWidth: "1200px" }}>
          <div className="flex flex-col items-end">
            <div className="max-w-2xl text-right">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                Technology Solutions Excellence
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: COLORS.primary }}>
                In <span className="typed-text" style={{ borderBottom: `2px solid ${COLORS.accent}` }}>{typedText}</span>
                <span className="animate-pulse">|</span>
              </h2>
              <p className="text-lg text-white/80 max-w-xl ml-auto mb-8" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                Helping you grow through strategy, creativity and technology.
              </p>
              <div className="flex gap-4 justify-end mb-8">
                {["twitter-x", "facebook", "linkedin", "instagram"].map((icon) => (
                  <a key={icon} href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(30,136,229,0.15)", color: COLORS.primary }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><use href={`#${icon}`} /></svg>
                  </a>
                ))}
              </div>
              <div className="flex gap-4 justify-end">
                <a href="#contact" onClick={(e) => { e.preventDefault(); setPage("contact"); }} className="px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all hover:scale-105" style={{ background: COLORS.primary, color: "#fff" }}>
                  Get Quotes
                </a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); setPage("contact"); }} className="px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider border-2 transition-all hover:scale-105" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold" style={{ color: darkMode ? "#fff" : "#000" }}>Our Services</h2>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("services"); }} className="px-6 py-2 rounded-full text-sm font-bold transition-all" style={{ background: COLORS.primary, color: "#fff" }}>
              See Services
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "monitor-code", title: "Web Development", desc: "Professional web solutions with modern technologies and responsive designs." },
              { icon: "phone", title: "Mobile App Development", desc: "Native and cross-platform mobile applications for iOS and Android." },
              { icon: "cloud-iot-2", title: "Cloud Solutions", desc: "Scalable cloud infrastructure and deployment solutions for your business." },
              { icon: "seo-monitor", title: "Digital Marketing", desc: "Strategic digital marketing campaigns to boost your online presence." },
              { icon: "vector-nodes-6", title: "UX/UI Design", desc: "User-centered design experiences that engage and convert your audience." },
              { icon: "database-2", title: "Data Analytics", desc: "Transform your data into actionable insights for better business decisions." },
            ].map((s, i) => (
              <div key={i} className="group p-8 rounded-2xl text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1" style={{ background: darkMode ? "#111125" : "#f8f9fa", boxShadow: "0 0 20px rgba(0,0,0,0.06)" }}>
                <div className="mb-4" style={{ color: COLORS.primaryDark }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: darkMode ? "#fff" : "#000" }}>{s.title}</h3>
                <p className="text-sm" style={{ color: darkMode ? "#aaa" : "#666" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20" style={{ background: darkMode ? "#0d0d20" : "#f8f9fa" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-6">
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: COLORS.primary }}>About Our Company</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: darkMode ? "#fff" : "#000" }}>
                  We&apos;re Passionate About Delivering Quality That Elevates Your Business.
                </h2>
                <p className="mt-4" style={{ color: darkMode ? "#aaa" : "#666" }}>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione illum ut, obcaecati voluptate incidunt vero esse repellendus voluptates eveniet dolores.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  { label: "IT Consulting", pct: 90 },
                  { label: "Web Development", pct: 75 },
                  { label: "UX Design", pct: 70 },
                ].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-1" style={{ color: darkMode ? "#ccc" : "#333" }}>
                      <span>{bar.label}</span>
                      <span>{bar.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: darkMode ? "#333" : "#e0e0e0" }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${bar.pct}%`, background: COLORS.primary }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group perspective-1000">
              <div className="transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1" style={{ transformStyle: "preserve-3d" }}>
                <img src={IMG["about-computer"]} alt="About" className="w-full h-auto rounded-xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="py-20" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Have <span className="text-[#1e88e5]">25 Years</span> of Experiences</h2>
              <p className="text-white/60 mt-2 mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              <a href="#contact" onClick={(e) => { e.preventDefault(); setPage("contact"); }} className="px-6 py-2.5 rounded-full text-sm font-bold border-2 border-[#1e88e5] text-[#1e88e5] hover:bg-[#1e88e5] hover:text-white transition-all">
                Get Started
              </a>
            </div>
            {[
              { icon: "bulb-2", count: counters.projects, label: "Successful Projects" },
              { icon: "hand-shake", count: counters.clients, label: "Satisfied Clients" },
              { icon: "message-3-text", count: counters.tickets, label: "Support Tickets Resolved" },
            ].map((c, i) => (
              <div key={i} className="text-center text-white p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5" className="mx-auto mb-3"><circle cx="12" cy="12" r="10"/></svg>
                <div className="text-4xl font-bold mb-1">{c.count}+</div>
                <div className="text-sm text-white/60">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <h2 className="text-3xl font-bold text-center mb-16" style={{ color: darkMode ? "#fff" : "#000" }}>Our Processes</h2>
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8" style={{ minHeight: "500px" }}>
            <div className="lg:absolute lg:top-0 lg:left-0 text-center lg:text-left">
              <div className="flex items-center gap-4 p-4 rounded-xl transition-all hover:-translate-y-2" style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                <div>
                  <span className="font-bold block mb-1" style={{ color: darkMode ? "#fff" : "#000" }}>1. WE INVESTIGATE AND PLAN</span>
                  <p className="text-sm" style={{ color: darkMode ? "#aaa" : "#666" }}>We analyze your requirements and create a comprehensive strategy.</p>
                </div>
              </div>
            </div>
            <div className="lg:absolute lg:top-0 lg:right-0 text-center lg:text-right">
              <div className="flex items-center gap-4 p-4 rounded-xl transition-all hover:-translate-y-2" style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
                <div>
                  <span className="font-bold block mb-1" style={{ color: darkMode ? "#fff" : "#000" }}>2. WE CO-CREATE AND DEVELOP</span>
                  <p className="text-sm" style={{ color: darkMode ? "#aaa" : "#666" }}>Working together, we build innovative solutions.</p>
                </div>
              </div>
            </div>
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl z-10 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 transition-all hover:scale-105">
              <img src={IMG["process-center"]} alt="Process" className="w-full h-full object-cover" />
            </div>
            <div className="lg:absolute lg:bottom-0 lg:left-0 text-center lg:text-left">
              <div className="flex items-center gap-4 p-4 rounded-xl transition-all hover:translate-y-[-8px]" style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div>
                  <span className="font-bold block mb-1" style={{ color: darkMode ? "#fff" : "#000" }}>3. WE ACCOMPANY AND GUARANTEE</span>
                  <p className="text-sm" style={{ color: darkMode ? "#aaa" : "#666" }}>We provide ongoing support and maintenance.</p>
                </div>
              </div>
            </div>
            <div className="lg:absolute lg:bottom-0 lg:right-0 text-center lg:text-right">
              <div className="flex items-center gap-4 p-4 rounded-xl transition-all hover:translate-y-[-8px]" style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div>
                  <span className="font-bold block mb-1" style={{ color: darkMode ? "#fff" : "#000" }}>4. WE DELIVER AND LAUNCH</span>
                  <p className="text-sm" style={{ color: darkMode ? "#aaa" : "#666" }}>We deploy your solution with thorough testing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20" style={{ background: darkMode ? "#0d0d20" : "#f8f9fa" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: darkMode ? "#fff" : "#000" }}>Our Portfolio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { img: IMG["portfolio-1"], title: "E-commerce Platform", cat: "Web Development" },
              { img: IMG["portfolio-2"], title: "Fitness Tracking App", cat: "Mobile Apps" },
              { img: IMG["portfolio-3"], title: "Banking Dashboard", cat: "UI/UX Design" },
              { img: IMG["portfolio-4"], title: "Tech Startup Brand", cat: "Branding" },
              { img: IMG["portfolio-5"], title: "Restaurant Website", cat: "Web Development" },
              { img: IMG["portfolio-6"], title: "Travel Planning App", cat: "Mobile Apps" },
            ].map((p, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" style={{ background: darkMode ? "#111125" : "#fff", boxShadow: "0 0 20px rgba(0,0,0,0.06)" }}>
                <div className="h-48 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold" style={{ color: darkMode ? "#fff" : "#000" }}>{p.title}</h3>
                  <span className="text-sm font-medium" style={{ color: COLORS.primary }}>{p.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Companies */}
      <section className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <h2 className="text-2xl font-bold text-center text-white mb-10">Building Success With Great Companies</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            {[1,2,3,4,5,6].map((n) => (
              <img key={n} src={(IMG as any)[`company-${n}`]} alt={`Company ${n}`} className="h-12 grayscale hover:grayscale-0 transition-all" />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold" style={{ color: darkMode ? "#fff" : "#000" }}>Pricing Plans</h2>
            <p className="mt-2" style={{ color: darkMode ? "#aaa" : "#666" }}>Clear, simple, and flexible plans for your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Basic", price: "$37", orig: "$50", desc: "Perfect for small businesses and startups", popular: false, features: ["Up to 5 Pages Website", "Mobile Responsive Design", "Basic SEO Optimization", "Contact Form Integration", "1 Month Free Support", "SSL Certificate"], missing: ["E-commerce Functionality", "Advanced Analytics", "Priority Support"] },
              { name: "Pro", price: "$57", orig: "$70", desc: "Ideal for growing businesses", popular: true, features: ["Up to 10 Pages Website", "Mobile Responsive Design", "Advanced SEO Optimization", "Contact Form Integration", "3 Month Free Support", "SSL Certificate", "E-commerce Functionality", "Advanced Analytics"], missing: ["Priority Support"] },
              { name: "Enterprise", price: "$77", orig: "$100", desc: "For large-scale businesses", popular: false, features: ["Up to 5 Pages Website", "Mobile Responsive Design", "Basic SEO Optimization", "Contact Form Integration", "1 Month Free Support", "SSL Certificate"], missing: ["E-commerce Functionality", "Advanced Analytics", "Priority Support"] },
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 transition-all duration-500 hover:scale-105 ${plan.popular ? "border-2" : "border"}`} style={{ borderColor: plan.popular ? COLORS.primary : darkMode ? "#333" : "#e0e0e0", background: plan.popular ? COLORS.primaryDark : darkMode ? "#111125" : "#fff" }}>
                {plan.popular && <div className="absolute -top-3 right-6 px-4 py-1 rounded-full text-xs font-bold" style={{ background: "#fff", color: "#000" }}>Most Popular</div>}
                <h3 className="text-xl font-semibold mb-1" style={{ color: plan.popular ? "#fff" : darkMode ? "#fff" : "#000" }}>{plan.name}</h3>
                <p className="text-sm mb-4" style={{ color: plan.popular ? "#aaa" : darkMode ? "#aaa" : "#666" }}>{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: plan.popular ? "#fff" : darkMode ? "#fff" : "#000" }}>{plan.price}</span>
                  <span className="ml-2 text-lg line-through" style={{ color: darkMode ? "#666" : "#999" }}>{plan.orig}</span>
                </div>
                <a href="#contact" onClick={(e) => { e.preventDefault(); setPage("contact"); }} className="block w-full text-center py-3 rounded-full text-sm font-bold transition-all" style={{ background: COLORS.primary, color: "#fff" }}>
                  Buy {plan.name} Plan
                </a>
                <hr className="my-6" style={{ borderColor: darkMode ? "#333" : "#e0e0e0" }} />
                <div className="space-y-3">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ color: plan.popular ? "#fff" : darkMode ? "#ccc" : "#333" }}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#666" : "#ccc"} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      <span style={{ color: darkMode ? "#666" : "#999" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Testimonials</h2>
            <p className="text-white/60 mt-2">Trusted feedback from companies and partners who believe in our quality.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Adrien Jacob", role: "CEO", face: IMG["testimonial-1"] },
              { name: "Diana Taylor", role: "Graphic Designer", face: IMG["testimonial-2"] },
              { name: "Sarah Johnson", role: "Businesswoman", face: IMG["testimonial-3"] },
              { name: "Michael Brown", role: "Marketing Director", face: IMG["testimonial-4"] },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill={COLORS.primary} className="mb-4"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h3.983v10H0z"/></svg>
                <p className="text-sm text-white/70 mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime tempora ipsum dicta nesciunt.</p>
                <div className="flex items-center gap-3">
                  <img src={t.face} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-white/50">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold" style={{ color: darkMode ? "#fff" : "#000" }}>Latest Blog Posts</h2>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage("blog"); }} className="px-6 py-2 rounded-full text-sm font-bold transition-all" style={{ background: COLORS.primary, color: "#fff" }}>
              View All Posts
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: "Technology", title: "The Future of Web Development: Trends to Watch in 2025", desc: "Discover the latest trends shaping the web development landscape.", author: "James Wilson", date: "July 15, 2025", read: "4 min read", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80" },
              { tag: "Security", title: "Mobile App Security: Best Practices for Developers", desc: "Learn essential security measures every mobile developer should implement.", author: "James Wilson", date: "July 10, 2025", read: "7 min read", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80" },
              { tag: "Cloud", title: "Cloud Migration Strategies for Modern Businesses", desc: "A comprehensive guide to successfully migrating your business infrastructure to the cloud.", author: "Emma Rodriguez", date: "July 5, 2025", read: "6 min read", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" },
            ].map((post, i) => (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" style={{ background: darkMode ? "#111125" : "#f8f9fa" }}>
                <div className="h-48 overflow-hidden relative">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: COLORS.primary, color: "#fff" }}>{post.tag}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color: darkMode ? "#888" : "#999" }}>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: darkMode ? "#fff" : "#000" }}>{post.title}</h3>
                  <p className="text-sm mb-4" style={{ color: darkMode ? "#aaa" : "#666" }}>{post.desc}</p>
                  <a href="#" className="text-sm font-semibold transition-all hover:gap-2 flex items-center gap-1" style={{ color: COLORS.primary }}>
                    Read More <span>→</span>
                  </a>
                  <div className="text-xs mt-2" style={{ color: darkMode ? "#666" : "#aaa" }}>{post.read}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center" style={{ maxWidth: "800px" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let&apos;s Build the Future Together</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">Your vision deserves to become reality. Connect with our innovative team and let&apos;s create extraordinary digital experiences.</p>
          <a href="#contact" onClick={(e) => { e.preventDefault(); setPage("contact"); }} className="inline-block px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all hover:scale-105" style={{ background: COLORS.primary, color: "#fff" }}>
            Get Started Today
          </a>
        </div>
      </section>
    </>
  );

  const renderAbout = () => (
    <>
      <div className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
          <h1 className="text-4xl font-bold mb-2">About Us</h1>
          <p className="text-white/60">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: darkMode ? "#fff" : "#000" }}>Building Digital Solutions Since 2010.</h2>
              <p className="mb-8" style={{ color: darkMode ? "#aaa" : "#666" }}>We create scalable, user-friendly, and innovative platforms tailored to your needs. Our multidisciplinary team is focused on building powerful experiences that connect brands with their audience.</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "👥", title: "Expert Team", desc: "Skilled professionals passionate about technology and design." },
                  { icon: "🚀", title: "Fast Delivery", desc: "Efficient processes to launch your projects on time." },
                  { icon: "🌍", title: "Global Impact", desc: "Solutions used and recognized around the world." },
                  { icon: "💬", title: "Dedicated Support", desc: "We accompany you in every phase of your project." },
                ].map((f, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "#f8f9fa" }}>
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <h4 className="font-semibold text-sm" style={{ color: darkMode ? "#fff" : "#000" }}>{f.title}</h4>
                    <p className="text-xs mt-1" style={{ color: darkMode ? "#aaa" : "#666" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={IMG["about-computer"]} alt="About" className="w-full rounded-xl shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
      {renderTeamGrid()}
      {renderTestimonials()}
    </>
  );

  const renderTeamGrid = () => (
    <section className="py-20" style={{ background: darkMode ? "#0d0d20" : "#f8f9fa" }}>
      <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={{ color: darkMode ? "#fff" : "#000" }}>Our Team</h2>
          <p className="mt-2" style={{ color: darkMode ? "#aaa" : "#666" }}>Meet the passionate professionals who drive our success.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Sarah Johnson", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
            { name: "James Wilson", role: "Lead Developer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
            { name: "Emma Rodriguez", role: "UI/UX Designer", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
            { name: "David Thompson", role: "Marketing Director", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
            { name: "Marco Hernández", role: "Full Stack Developer", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
            { name: "Alicia Gomez", role: "UI/UX Designer", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
            { name: "Carlos Martinez", role: "Backend Engineer", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
            { name: "Sophia Ramirez", role: "Project Manager", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
          ].map((m, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105" style={{ height: "350px", background: darkMode ? "#111125" : "#fff", boxShadow: "0 0 20px rgba(0,0,0,0.06)" }}>
              <img src={m.img} alt={m.name} className="w-full h-full object-cover object-top" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
                <div className="text-white font-semibold">{m.name}</div>
                <div className="text-xs" style={{ color: COLORS.primary }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderTestimonials = () => (
    <section className="py-20" style={{ background: COLORS.primaryDark }}>
      <div className="container mx-auto px-4 text-center" style={{ maxWidth: "1200px" }}>
        <h2 className="text-3xl font-bold text-white mb-12">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: "Adrien Jacob", role: "CEO", face: IMG["testimonial-1"] },
            { name: "Diana Taylor", role: "Graphic Designer", face: IMG["testimonial-2"] },
            { name: "Sarah Johnson", role: "Businesswoman", face: IMG["testimonial-3"] },
            { name: "Michael Brown", role: "Marketing Director", face: IMG["testimonial-4"] },
          ].map((t, i) => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-sm text-white/70 mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              <div className="flex items-center gap-3 justify-center">
                <img src={t.face} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderServices = () => (
    <>
      <div className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
          <h1 className="text-4xl font-bold mb-2">Our Services</h1>
          <p className="text-white/60">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "💻", title: "Web Development", desc: "Professional web solutions with modern technologies and responsive designs." },
              { icon: "📱", title: "Mobile App Development", desc: "Native and cross-platform mobile applications for iOS and Android." },
              { icon: "☁️", title: "Cloud Solutions", desc: "Scalable cloud infrastructure and deployment solutions for your business." },
              { icon: "📈", title: "Digital Marketing", desc: "Strategic digital marketing campaigns to boost your online presence." },
              { icon: "🎨", title: "UX/UI Design", desc: "User-centered design experiences that engage and convert your audience." },
              { icon: "📊", title: "Data Analytics", desc: "Transform your data into actionable insights for better business decisions." },
            ].map((s, i) => (
              <div key={i} className="p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" style={{ background: darkMode ? "#111125" : "#f8f9fa", border: `1px solid ${COLORS.primary}`, boxShadow: "0 0 20px rgba(0,0,0,0.06)" }}>
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: darkMode ? "#fff" : "#000" }}>{s.title}</h3>
                <p className="text-sm" style={{ color: darkMode ? "#aaa" : "#666" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderFAQ()}
      {renderTestimonials()}
    </>
  );

  const toggleFaq = (i: number) => setFaqOpen(prev => ({ ...prev, [i]: !prev[i] }));

  const FAQ_ITEMS = [
    { q: "What services do you offer?", a: "We offer a comprehensive range of IT services including web development, mobile app development, cloud solutions, cybersecurity, and digital transformation consulting." },
    { q: "How long does a typical project take?", a: "Project timelines vary depending on complexity and scope. A simple website might take 2-4 weeks, while complex enterprise applications can take 3-6 months." },
    { q: "Do you provide ongoing support and maintenance?", a: "Yes, we offer comprehensive maintenance and support packages including regular updates, security patches, performance monitoring, and technical support." },
    { q: "What is your pricing model?", a: "Our pricing is project-based and depends on the scope, complexity, and timeline. We offer transparent pricing with no hidden fees." },
    { q: "Can you work with our existing team?", a: "Absolutely! We frequently collaborate with in-house teams and can integrate seamlessly with your existing workflows." },
    { q: "Do you sign NDAs and ensure data security?", a: "Yes, we take data security very seriously. We're happy to sign NDAs and follow strict security protocols." },
  ];

  const renderFAQ = () => (
    <section className="py-20" style={{ background: darkMode ? "#0d0d20" : "#f8f9fa" }}>
      <div className="container mx-auto px-4" style={{ maxWidth: "800px" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={{ color: darkMode ? "#fff" : "#000" }}>Frequently Asked Questions</h2>
          <p className="mt-2" style={{ color: darkMode ? "#aaa" : "#666" }}>Find answers to the most common questions about our services</p>
        </div>
        {FAQ_ITEMS.map((faq, i) => (
          <div key={i} className="mb-3 rounded-xl overflow-hidden transition-all" style={{ border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}` }}>
            <button onClick={() => toggleFaq(i)} className="w-full p-4 text-left flex justify-between items-center font-medium transition-all" style={{ color: darkMode ? "#fff" : "#000" }}>
              <span>{faq.q}</span>
              <svg className={`transition-transform ${faqOpen[i] ? "rotate-180" : ""}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {faqOpen[i] && <div className="p-4 pt-0 text-sm" style={{ color: darkMode ? "#aaa" : "#666" }}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );

  const renderPortfolio = () => (
    <>
      <div className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
          <h1 className="text-4xl font-bold mb-2">Our Portfolio</h1>
          <p className="text-white/60">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: IMG["portfolio-1"], title: "E-commerce Platform", cat: "Web Development" },
              { img: IMG["portfolio-2"], title: "Fitness Tracking App", cat: "Mobile Apps" },
              { img: IMG["portfolio-3"], title: "Banking Dashboard", cat: "UI/UX Design" },
              { img: IMG["portfolio-4"], title: "Tech Startup Brand", cat: "Branding" },
              { img: IMG["portfolio-5"], title: "Restaurant Website", cat: "Web Development" },
              { img: IMG["portfolio-6"], title: "Travel Planning App", cat: "Mobile Apps" },
            ].map((p, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl" style={{ background: darkMode ? "#111125" : "#fff" }}>
                <div className="h-48 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold" style={{ color: darkMode ? "#fff" : "#000" }}>{p.title}</h3>
                  <span className="text-sm font-medium" style={{ color: COLORS.primary }}>{p.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderFAQ()}
      {renderTestimonials()}
    </>
  );

  const renderPricing = () => (
    <>
      <div className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
          <h1 className="text-4xl font-bold mb-2">Pricing Plans</h1>
          <p className="text-white/60">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Basic", price: "$37", orig: "$50", desc: "Perfect for small businesses and startups", popular: false, features: ["Up to 5 Pages Website", "Mobile Responsive Design", "Basic SEO Optimization", "Contact Form Integration", "1 Month Free Support", "SSL Certificate"], missing: ["E-commerce", "Advanced Analytics", "Priority Support"] },
              { name: "Pro", price: "$57", orig: "$70", desc: "Ideal for growing businesses", popular: true, features: ["Up to 10 Pages", "Mobile Responsive", "Advanced SEO", "Contact Form", "3 Months Support", "SSL Certificate", "E-commerce", "Advanced Analytics"], missing: ["Priority Support"] },
              { name: "Enterprise", price: "$77", orig: "$100", desc: "For large-scale businesses", popular: false, features: ["Unlimited Pages", "Mobile Responsive", "Advanced SEO", "Contact Form", "6 Months Support", "SSL Certificate", "E-commerce", "Advanced Analytics", "Priority Support"], missing: [] },
            ].map((plan, i) => (
              <div key={i} className="relative rounded-2xl p-8 transition-all hover:scale-105" style={{ border: `2px solid ${plan.popular ? COLORS.primary : darkMode ? "#333" : "#e0e0e0"}`, background: plan.popular ? COLORS.primaryDark : darkMode ? "#111125" : "#fff" }}>
                {plan.popular && <div className="absolute -top-3 right-6 px-4 py-1 rounded-full text-xs font-bold bg-white text-black">Most Popular</div>}
                <h3 className="text-xl font-semibold mb-1" style={{ color: plan.popular ? "#fff" : darkMode ? "#fff" : "#000" }}>{plan.name}</h3>
                <p className="text-sm mb-4" style={{ color: plan.popular ? "#aaa" : darkMode ? "#aaa" : "#666" }}>{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: plan.popular ? "#fff" : darkMode ? "#fff" : "#000" }}>{plan.price}</span>
                  <span className="ml-2 line-through" style={{ color: darkMode ? "#666" : "#999" }}>{plan.orig}</span>
                </div>
                <a href="#contact" className="block w-full text-center py-3 rounded-full text-sm font-bold" style={{ background: COLORS.primary, color: "#fff" }}>
                  Buy {plan.name} Plan
                </a>
                <hr className="my-6" style={{ borderColor: darkMode ? "#333" : "#e0e0e0" }} />
                <div className="space-y-3">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ color: plan.popular ? "#fff" : darkMode ? "#ccc" : "#333" }}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#666" : "#ccc"} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      <span style={{ color: darkMode ? "#666" : "#999" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderTeam = () => (
    <>
      <div className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
          <h1 className="text-4xl font-bold mb-2">Our Team</h1>
          <p className="text-white/60">The talented professionals driving innovation and success.</p>
        </div>
      </div>
      {renderTeamGrid()}
      {renderTestimonials()}
      <div className="py-12" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center" style={{ maxWidth: "1200px" }}>
          <h2 className="text-2xl font-bold text-white mb-8">Building Success With Great Companies</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            {[1,2,3,4,5,6].map((n) => (
              <img key={n} src={(IMG as any)[`company-${n}`]} alt={`Company ${n}`} className="h-10 grayscale hover:grayscale-0 transition-all" />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderContact = () => {
    return (
      <>
        <div className="py-16" style={{ background: COLORS.primaryDark }}>
          <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-white/60">Let&apos;s build the future of your business together.</p>
          </div>
        </div>
        <div className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
          <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-4" style={{ color: darkMode ? "#fff" : "#000" }}>Let&apos;s Start a Conversation</h2>
                <p className="mb-8" style={{ color: darkMode ? "#aaa" : "#666" }}>Contact our experts and start your digital journey today.</p>
                <div className="space-y-6">
                  {[
                    { icon: "📞", title: "Phone", value: "+1 (800) 987-6543" },
                    { icon: "✉️", title: "Email", value: "hello@itagency.com" },
                    { icon: "📍", title: "Address", value: "One Apple Park Way, Cupertino, CA 95014" },
                    { icon: "🕐", title: "Business Hours", value: "Mon - Fri: 9:00 AM - 6:00 PM" },
                  ].map((info, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${COLORS.primary}15` }}>{info.icon}</div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: darkMode ? "#aaa" : "#666" }}>{info.title}</div>
                        <div className="font-semibold" style={{ color: darkMode ? "#fff" : "#000" }}>{info.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-8" style={{ background: darkMode ? "#111125" : "#f8f9fa" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? "#ccc" : "#333" }}>Full Name *</label>
                    <input className="w-full p-3 rounded-xl border text-sm outline-none transition-all focus:ring-2" style={{ borderColor: darkMode ? "#333" : "#e0e0e0", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? "#ccc" : "#333" }}>Email Address *</label>
                    <input className="w-full p-3 rounded-xl border text-sm outline-none transition-all focus:ring-2" style={{ borderColor: darkMode ? "#333" : "#e0e0e0", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? "#ccc" : "#333" }}>Phone Number</label>
                    <input className="w-full p-3 rounded-xl border text-sm outline-none transition-all focus:ring-2" style={{ borderColor: darkMode ? "#333" : "#e0e0e0", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? "#ccc" : "#333" }}>Company</label>
                    <input className="w-full p-3 rounded-xl border text-sm outline-none transition-all focus:ring-2" style={{ borderColor: darkMode ? "#333" : "#e0e0e0", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? "#ccc" : "#333" }}>Service Interested In</label>
                    <select className="w-full p-3 rounded-xl border text-sm outline-none" style={{ borderColor: darkMode ? "#333" : "#e0e0e0", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000" }}>
                      <option>Select a service</option>
                      <option>Web Development</option>
                      <option>Mobile App Development</option>
                      <option>Cloud Solutions</option>
                      <option>Digital Marketing</option>
                      <option>UI/UX Design</option>
                      <option>Data Analytics</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? "#ccc" : "#333" }}>Project Budget</label>
                    <select className="w-full p-3 rounded-xl border text-sm outline-none" style={{ borderColor: darkMode ? "#333" : "#e0e0e0", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000" }}>
                      <option>Select budget range</option>
                      <option>Under $5,000</option>
                      <option>$5,000 - $15,000</option>
                      <option>$15,000 - $50,000</option>
                      <option>$50,000 - $100,000</option>
                      <option>Over $100,000</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? "#ccc" : "#333" }}>Project Details *</label>
                    <textarea rows={4} className="w-full p-3 rounded-xl border text-sm outline-none transition-all focus:ring-2" style={{ borderColor: darkMode ? "#333" : "#e0e0e0", background: darkMode ? "#1a1a2e" : "#fff", color: darkMode ? "#fff" : "#000" }} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span style={{ color: darkMode ? "#aaa" : "#666" }}>Subscribe to our newsletter for updates and tech insights</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                      <input type="checkbox" className="rounded" />
                      <span style={{ color: darkMode ? "#aaa" : "#666" }}>I agree to the Privacy Policy and Terms of Service *</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <button className="w-full py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02]" style={{ background: COLORS.primary, color: "#fff" }}>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderProcess = () => (
    <>
      <div className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
          <h1 className="text-4xl font-bold mb-2">Our Process</h1>
          <p className="text-white/60">How we bring your vision to life.</p>
        </div>
      </div>
      <div className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "900px" }}>
          {[
            { step: "01", title: "Investigate & Plan", desc: "We analyze your requirements and create a comprehensive strategy tailored to your business goals." },
            { step: "02", title: "Co-Create & Develop", desc: "Working together, we build innovative solutions using cutting-edge technology and best practices." },
            { step: "03", title: "Accompany & Guarantee", desc: "We provide ongoing support and maintenance to ensure your solution performs optimally over time." },
            { step: "04", title: "Deliver & Launch", desc: "We deploy your solution with thorough testing and seamless implementation." },
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-6 mb-8 p-6 rounded-2xl transition-all hover:-translate-y-1" style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "#f8f9fa" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0" style={{ background: COLORS.primary, color: "#fff" }}>{p.step}</div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: darkMode ? "#fff" : "#000" }}>{p.title}</h3>
                <p style={{ color: darkMode ? "#aaa" : "#666" }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderBlog = () => (
    <>
      <div className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
          <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
          <p className="text-white/60">Insights, trends, and stories from our team.</p>
        </div>
      </div>
      <div className="py-20" style={{ background: darkMode ? "#0a0a1a" : "#fff" }}>
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { tag: "Technology", title: "The Future of Web Development: Trends to Watch in 2025", desc: "Discover the latest trends shaping the web development landscape.", author: "James Wilson", date: "July 15, 2025", read: "4 min read", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80" },
              { tag: "Security", title: "Mobile App Security: Best Practices for Developers", desc: "Learn essential security measures every mobile developer should implement.", author: "James Wilson", date: "July 10, 2025", read: "7 min read", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80" },
              { tag: "Cloud", title: "Cloud Migration Strategies for Modern Businesses", desc: "A comprehensive guide to successfully migrating your business infrastructure to the cloud.", author: "Emma Rodriguez", date: "July 5, 2025", read: "6 min read", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" },
              { tag: "AI", title: "How AI is Transforming Digital Marketing in 2025", desc: "Explore how artificial intelligence is revolutionizing digital marketing strategies.", author: "David Thompson", date: "June 28, 2025", read: "5 min read", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80" },
              { tag: "Design", title: "UX Design Principles for Mobile Applications", desc: "Essential UX design principles every mobile app developer should follow.", author: "Emma Rodriguez", date: "June 20, 2025", read: "8 min read", img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80" },
              { tag: "Business", title: "Digital Transformation: A Guide for SMEs", desc: "How small and medium enterprises can leverage digital transformation.", author: "Sarah Johnson", date: "June 15, 2025", read: "6 min read", img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80" },
            ].map((post, i) => (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" style={{ background: darkMode ? "#111125" : "#f8f9fa" }}>
                <div className="h-48 overflow-hidden relative">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: COLORS.primary, color: "#fff" }}>{post.tag}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color: darkMode ? "#888" : "#999" }}>
                    <span>{post.date}</span><span>•</span><span>{post.author}</span>
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: darkMode ? "#fff" : "#000" }}>{post.title}</h3>
                  <p className="text-sm mb-4" style={{ color: darkMode ? "#aaa" : "#666" }}>{post.desc}</p>
                  <a href="#" className="text-sm font-semibold flex items-center gap-1 transition-all hover:gap-2" style={{ color: COLORS.primary }}>
                    Read More <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderFAQs = () => (
    <>
      <div className="py-16" style={{ background: COLORS.primaryDark }}>
        <div className="container mx-auto px-4 text-center text-white" style={{ maxWidth: "1200px" }}>
          <h1 className="text-4xl font-bold mb-2">FAQs</h1>
          <p className="text-white/60">Find answers to the most common questions.</p>
        </div>
      </div>
      {renderFAQ()}
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "about": return renderAbout();
      case "services": return renderServices();
      case "portfolio": return renderPortfolio();
      case "pricing": return renderPricing();
      case "team": return renderTeam();
      case "contact": return renderContact();
      case "process": return renderProcess();
      case "blog": return renderBlog();
      case "faqs": return renderFAQs();
      default: return renderHome();
    }
  };

  // ---- FOOTER ----
  const footer = (
    <footer style={{ background: darkMode ? "#0a0a18" : "#1a1a2e", color: "#ccc" }}>
      <div className="container mx-auto px-4 py-16" style={{ maxWidth: "1200px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src={IMG["logo"]} alt="11G" className="h-10 mb-4 brightness-0 invert" />
            <p className="text-sm text-gray-400 mb-4">Empowering businesses with smart, innovative tech solutions. We craft high-impact web development, mobile apps, and digital services.</p>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest mb-3 block">Follow Us</span>
              <div className="flex gap-3">
                {["twitter-x", "facebook", "linkedin", "instagram"].map((icon) => (
                  <a key={icon} href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(30,136,229,0.15)", color: COLORS.primary }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><use href={`#${icon}`} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {["Home", "About Us", "Services", "Portfolio", "Team", "Pricing", "Blog", "Privacy Policy", "Terms of Service"].map((l, i) => (
                <li key={i}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setPage(l.toLowerCase().replace(/\s+/g, "-").replace(/[&-]/g, "").trim() || "home"); }} className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Our Services</h4>
            <ul className="space-y-2 text-sm">
              {["Web Development", "Mobile App Development", "Cloud Solutions", "Digital Marketing", "UI/UX Design", "Data Analytics", "Cybersecurity", "IT Consulting"].map((s, i) => (
                <li key={i}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Contact Info</h4>
            <div className="space-y-4 text-sm">
              <div><span className="text-gray-500">Address:</span><br />789 Innovation Avenue, Future Town, FT 67890</div>
              <div><span className="text-gray-500">Phone:</span><br />+1 (800) 987-6543</div>
              <div><span className="text-gray-500">Email:</span><br />hello@itagency.com</div>
              <div><span className="text-gray-500">Hours:</span><br />Mon - Fri: 9:00 AM - 6:00 PM</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          ITAgency © 2025. All rights reserved.
        </div>
      </div>
    </footer>
  );

  // ---- MAIN RENDER ----
  return (
    <div style={{ background: darkMode ? "#050510" : "#fff", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Inline SVG Icons */}
      <svg display="none" xmlns="http://www.w3.org/2000/svg">
        <symbol id="twitter-x" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></symbol>
        <symbol id="facebook" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></symbol>
        <symbol id="linkedin" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></symbol>
        <symbol id="instagram" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></symbol>
        <symbol id="double-quotes-end-1" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h3.983v10H0z"/></symbol>
        <symbol id="star-filled" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></symbol>
      </svg>

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`} style={{ background: scrolled ? (darkMode ? "rgba(10,10,26,0.95)" : "rgba(255,255,255,0.95)") : "transparent", backdropFilter: scrolled ? "blur(10px)" : "none", height: "70px" }}>
        <div className="container mx-auto px-4 h-full flex items-center justify-between" style={{ maxWidth: "1200px" }}>
          <div className="flex items-center gap-2">
            <img src={IMG["logo"]} alt="11G" className="h-10" style={{ filter: darkMode || !scrolled ? "brightness(0) invert(1)" : "none" }} />
          </div>
          {nav}
          <div className="flex items-center gap-3">
            <a href="#contact" onClick={(e) => { e.preventDefault(); setPage("contact"); }} className="hidden md:inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all" style={{ background: COLORS.primary, color: "#fff" }}>
              Get Quotes
            </a>
            <button onClick={() => setDarkMode(!darkMode)} className="w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}>
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#333"><path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 004.463-.69.75.75 0 01.981.981A10.503 10.503 0 0118 19.5a10.5 10.5 0 01-10.5-10.5c0-2.137.64-4.126 1.718-5.528a.75.75 0 01.81-.162z"/></svg>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1" style={{ color: darkMode || !scrolled ? "#fff" : "#333" }}>
              <span className="block w-5 h-0.5 rounded-full transition-all" style={{ background: "currentColor", transform: mobileOpen ? "rotate(45deg) translate(2px, 2px)" : "none" }}></span>
              <span className="block w-5 h-0.5 rounded-full transition-all" style={{ background: "currentColor", opacity: mobileOpen ? 0 : 1 }}></span>
              <span className="block w-5 h-0.5 rounded-full transition-all" style={{ background: "currentColor", transform: mobileOpen ? "rotate(-45deg) translate(2px, -2px)" : "none" }}></span>
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main style={{ paddingTop: "70px" }}>
        {renderPage()}
      </main>

      {footer}
    </div>
  );
}
