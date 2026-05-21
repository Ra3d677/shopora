"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe, Menu, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { setMarketingLanguageCookie } from "@/app/actions";
import { useLanguageStore } from "@/store/language";

interface ShoporaHeaderProps {
  lang: "en" | "ar";
}

export default function ShoporaHeader({ lang }: ShoporaHeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { setLanguage } = useLanguageStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node) &&
        mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = async (newLang: "en" | "ar") => {
    // Sync with Zustand store to ensure dashboard uses same language
    setLanguage(newLang);

    // Set cookie for server
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `SHOPORA_MARKETING_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;

    try {
      await setMarketingLanguageCookie(newLang);
    } catch {
      // server action may fail in some contexts; cookies are already set client-side
    }

    setIsLangOpen(false);
    setMobileMenuOpen(false);

    window.location.reload();
  };

  // Translations object helper
  const t = {
    en: {
      pricing: "Pricing",
      home: "Home",
      login: "Login",
      start: "Start Now",
      changeLang: "Change Language",
      english: "English",
      arabic: "العربية",
    },
    ar: {
      pricing: "الأسعار",
      home: "الرئيسية",
      login: "تسجيل الدخول",
      start: "ابدأ الآن",
      changeLang: "تغيير اللغة",
      english: "English",
      arabic: "العربية",
    },
  }[lang];

  const ShoporaLogo = () => (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing aura */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-md scale-110 group-hover:scale-125 transition-transform duration-300 animate-pulse" />
        {/* Logo Container */}
        <div className="relative h-10 w-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:rotate-3 transition-transform duration-300">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615 3.001 3.001 0 0 0 3.75.615 3.001 3.001 0 0 0 3.75-.615 3.001 3.001 0 0 0 3.75.615v1.442M3.75 9.349a3.001 3.001 0 0 1 3.75-.615 3.001 3.001 0 0 1 3.75.615m-7.5 0h7.5m3.75-3.18 5.4 3.18m-5.4-3.18V3m0 3.18h5.4M12 3v3.18m0-3.18h3.75M12 3H8.25m4.5 12h-3" />
          </svg>
        </div>
      </div>
      <span className="text-2xl font-black tracking-tight text-white uppercase italic bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 group-hover:from-cyan-300 group-hover:to-white transition-all duration-300">
        Shopora
      </span>
    </Link>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-white/5 py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <ShoporaLogo />

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans font-bold text-xs uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors duration-200">
            {t.home}
          </Link>
          <Link href="/pricing" className="hover:text-cyan-400 transition-colors duration-200">
            {t.pricing}
          </Link>
        </nav>

        {/* Right: Actions / Language Switcher */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Switcher */}
          <div className="relative" ref={desktopLangRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
              aria-label={t.changeLang}
            >
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>{lang === "en" ? "EN" : "عربي"}</span>
            </button>
            {isLangOpen && (
              <div
                className={`absolute mt-2 w-32 bg-[#0e0e0e] border border-white/10 rounded-xl shadow-2xl py-1.5 z-[60] text-slate-300 ${
                  lang === "ar" ? "left-0" : "right-0"
                }`}
              >
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white/5 hover:text-white transition-colors ${
                    lang === "en" ? "text-cyan-400 bg-cyan-500/5" : ""
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className={`w-full text-right px-4 py-2 text-xs font-semibold hover:bg-white/5 hover:text-white transition-colors font-arabic ${
                    lang === "ar" ? "text-cyan-400 bg-cyan-500/5" : ""
                  }`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>

          {/* Login CTA */}
          <Link
            href="/auth/login"
            className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
          >
            {t.login}
          </Link>

          {/* Start Now CTA */}
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black uppercase tracking-widest text-[10px] transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <span>{t.start}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-4">
          {/* Language Switcher on mobile */}
          <div className="relative" ref={mobileLangRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold transition-all"
            >
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>{lang === "en" ? "EN" : "عربي"}</span>
            </button>
            {isLangOpen && (
              <div
                className={`absolute mt-2 w-32 bg-[#0e0e0e] border border-white/10 rounded-xl shadow-2xl py-1.5 z-[60] text-slate-300 ${
                  lang === "ar" ? "left-0" : "right-0"
                }`}
              >
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white/5 hover:text-white transition-colors ${
                    lang === "en" ? "text-cyan-400 bg-cyan-500/5" : ""
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className={`w-full text-right px-4 py-2 text-xs font-semibold hover:bg-white/5 hover:text-white transition-colors font-arabic ${
                    lang === "ar" ? "text-cyan-400 bg-cyan-500/5" : ""
                  }`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>

          <button

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-[#0c0c0c] border-b border-white/10 shadow-2xl py-6 px-6 z-40 animate-in slide-in-from-top-4 duration-300 flex flex-col gap-6">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-cyan-400 transition-colors pb-3 border-b border-white/5"
          >
            {t.home}
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-cyan-400 transition-colors pb-3 border-b border-white/5"
          >
            {t.pricing}
          </Link>
          <Link
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-cyan-400 transition-colors pb-3 border-b border-white/5"
          >
            {t.login}
          </Link>
          <Link
            href="/auth/register"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase tracking-widest text-xs transition-all"
          >
            <span>{t.start}</span>
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      )}
    </header>
  );
}
