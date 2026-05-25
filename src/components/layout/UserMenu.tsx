"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User as UserIcon, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useLanguageStore } from "@/store/language";

interface Props {
  slug: string;
  lang: string;
  textColor?: string;
}

export default function UserMenu({ slug, lang, textColor }: Props) {
  const { user, setUser } = useAuthStore();
  const { t } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 transition-all hover:scale-110 flex items-center"
        aria-label={t('userAccount')}
        style={{ color: textColor }}
      >
        {user && user.photoURL ? (
          <img src={user.photoURL} alt={t('userAlt')} className="w-6 h-6 rounded-full border" style={{ borderColor: textColor || 'currentColor' }} />
        ) : (
          <UserIcon className="h-5 w-5" />
        )}
      </button>

      {isOpen && mounted && (
        <div className={`absolute ${lang === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50`}>
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-slate-100 mb-1">
                <p className="text-sm font-medium text-slate-900 truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <Link href={`/store/${slug}/account`} onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                <UserIcon className="w-4 h-4" /> {t('myAccount')}
              </Link>
              <button onClick={() => { setUser(null); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left mt-1 border-t border-slate-100 pt-3">
                <LogOut className="w-4 h-4" /> {t('signOut')}
              </button>
            </>
          ) : (
            <>
              <Link href={`/store/${slug}/login`} onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                {t('signIn')}
              </Link>
              <Link href={`/store/${slug}/register`} onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                {t('createAccount')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
