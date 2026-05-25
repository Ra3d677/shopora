"use client";

import { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import { setLanguageCookie } from "@/app/actions";
import { useLanguageStore } from "@/store/language";

interface Props {
  dark?: boolean;
  lang: string;
}

export default function LanguageSwitcher({ dark = false, lang }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguageStore();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={langRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 p-2 transition-all hover:scale-105 font-bold text-sm tracking-widest uppercase ${dark ? 'text-white' : 'text-slate-900'}`}
        aria-label={t('changeLanguage')}
      >
        <Globe className="h-5 w-5" />
        <span className="hidden md:inline">{lang === 'en' ? 'EN' : 'عربي'}</span>
      </button>
      {isOpen && mounted && (
        <div className={`absolute ${lang === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-3 w-32 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 transform transition-all text-slate-900`}>
          <button
            onClick={async () => { await setLanguageCookie('en'); setIsOpen(false); window.location.reload(); }}
            className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${lang === 'en' ? 'text-blue-600' : ''}`}
            dir="ltr"
          >
            {t('englishLabel')}
          </button>
          <button
            onClick={async () => { await setLanguageCookie('ar'); setIsOpen(false); window.location.reload(); }}
            className={`w-full text-right px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors font-arabic ${lang === 'ar' ? 'text-blue-600' : ''}`}
            dir="rtl"
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
