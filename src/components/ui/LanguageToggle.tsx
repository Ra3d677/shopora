"use client";

import { useLanguageStore } from "@/store/language";
import { setLanguageCookie } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useTransition } from "react";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguageStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = async () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    
    // Set Zustand state
    setLanguage(nextLang);
    
    // Set server cookie
    await setLanguageCookie(nextLang);
    
    // Refresh page to apply server-side RTL/LTR direction
    window.location.reload();
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 font-bold text-xs uppercase tracking-wider backdrop-blur-md ${
        language === 'ar' ? 'font-arabic' : ''
      } ${
        isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
      } ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--admin-text-primary, #ffffff)'
      }}
    >
      <Globe size={14} className={isPending ? 'animate-spin' : ''} />
      <span>{language === 'en' ? 'عربي' : 'English'}</span>
    </button>
  );
}
