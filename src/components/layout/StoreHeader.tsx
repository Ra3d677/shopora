"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import UserMenu from "@/components/layout/UserMenu";
import { useLanguageStore } from "@/store/language";

interface Props {
  headerConfig: any;
  slug: string;
  storeName: string;
  session?: any;
  categories?: any[];
}

const PAGES = [
  { label: 'storePages', href: '' },
  { label: 'home', href: '' },
  { label: 'shop', href: '/products' },
  { label: 'cart', href: '/cart' },
  { label: 'search', href: '/search' },
  { label: 'account', href: '/account' },
  { label: 'tracking', href: '/tracking' },
];

export default function StoreHeader({ headerConfig, slug, storeName, session, categories = [] }: Props) {
  const { language, t } = useLanguageStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const h = headerConfig?.config || {};
  const style = headerConfig?.style || 'classic';
  const links = h.links || [];

  const isDark = style === 'dark' || style === 'glass' || style === 'dddyou';
  const textColor = h.textColor || (isDark ? '#ffffff' : '#000000');
  const mutedColor = h.textColor || (isDark ? '#ffffffcc' : '#4a5568');
  const bgColor = h.bgColor || (isDark ? '#0f0f1a' : '#ffffff');

  const MobileMenu = () => (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
      <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} h-full w-80 max-w-[85vw] overflow-y-auto`} style={{ background: bgColor }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: mutedColor + '33' }}>
          <span className="font-bold text-lg" style={{ color: textColor }}>{h.logoText || storeName}</span>
          <button onClick={() => setMobileOpen(false)} className="p-2" style={{ color: textColor }}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          {links.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: mutedColor }}>Navigation</p>
              {links.map((link: any, i: number) => (
                <Link key={i} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm font-bold transition-all hover:opacity-60" style={{ color: textColor }}>{link.label}</Link>
              ))}
            </div>
          )}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: mutedColor }}>{language === 'ar' ? 'الصفحات' : 'Pages'}</p>
            <Link href={`/store/${slug}`} onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-bold transition-all hover:opacity-60" style={{ color: textColor }}>{t('home')}</Link>
            <Link href={`/store/${slug}/products`} onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-bold transition-all hover:opacity-60" style={{ color: textColor }}>{t('shop')}</Link>
            <Link href={`/store/${slug}/cart`} onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-bold transition-all hover:opacity-60" style={{ color: textColor }}>{t('cart')}</Link>
            <Link href={`/store/${slug}/search`} onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-bold transition-all hover:opacity-60" style={{ color: textColor }}>{t('search')}</Link>
            <Link href={`/store/${slug}/account`} onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-bold transition-all hover:opacity-60" style={{ color: textColor }}>{t('myAccount')}</Link>
            <Link href={`/store/${slug}/tracking`} onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-bold transition-all hover:opacity-60" style={{ color: textColor }}>{t('tracking')}</Link>
          </div>
          {categories.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: mutedColor }}>{t('categories')}</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: any) => (
                  <Link key={cat.id} href={`/store/${slug}/categories/${cat.slug || cat.id}`} onClick={() => setMobileOpen(false)}
                    className="px-3 py-1.5 text-xs font-bold rounded-full transition-all hover:opacity-60 border"
                    style={{ color: textColor, borderColor: mutedColor + '44' }}>{cat.name}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (style === 'dddyou') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: bgColor }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#c87a36] flex items-center justify-center text-[#0f0f1a] text-sm font-black">D</div>
            <span className="font-['Alex_Brush'] text-xl" style={{ color: h.textColor || '#c9a96e' }}>{h.logoText || storeName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link: any, i: number) => (
              <Link key={i} href={link.href} className="text-sm font-medium transition-colors hover:text-[#c9a96e]" style={{ color: mutedColor }}>{link.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            {h.showTracking && <Link href={`/store/${slug}/tracking`} className="p-2 text-sm text-white/70 hover:text-[#c9a96e]"><i className="fas fa-truck"></i></Link>}
            {h.showSearch && <Link href={`/store/${slug}/search`} className="p-2 text-sm text-white/70 hover:text-[#c9a96e]"><i className="fas fa-search"></i></Link>}
            {h.showCart !== false && <Link href={`/store/${slug}/cart`} className="p-2 text-sm text-white/70 hover:text-[#c9a96e]"><i className="fas fa-shopping-bag"></i></Link>}
            {h.showLanguage !== false && <LanguageSwitcher dark lang={language} />}
            {h.showAccount !== false && <UserMenu slug={slug} lang={language} session={session} textColor={mutedColor} />}
            <button onClick={() => setMobileOpen(true)} className="md:hidden flex flex-col gap-1 p-2">
              <span className="block w-6 h-0.5" style={{ background: textColor }} />
              <span className="block w-6 h-0.5" style={{ background: textColor }} />
              <span className="block w-6 h-0.5" style={{ background: textColor }} />
            </button>
          </div>
        </div>
        {mobileOpen && <MobileMenu />}
      </header>
    );
  }

  return (
    <header className={`${h.sticky !== false ? 'fixed top-0 left-0 right-0 z-50' : 'relative'} transition-all duration-300`}
      style={{ background: bgColor, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="font-black text-lg tracking-tight" style={{ color: textColor }}>
          {style === 'centered' ? '' : h.logoText || storeName}
        </Link>
        {style !== 'minimal' && (
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link: any, i: number) => (
              <Link key={i} href={link.href} className="text-sm font-medium transition-all hover:opacity-60" style={{ color: mutedColor }}>{link.label}</Link>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-1">
          {h.showTracking && (
            <Link href={`/store/${slug}/tracking`} className="p-2 text-sm transition-all hover:opacity-60" style={{ color: mutedColor }}>
              <i className="fas fa-truck"></i>
            </Link>
          )}
          {h.showSearch && <Link href={`/store/${slug}/search`} className="p-2 text-sm transition-all hover:opacity-60" style={{ color: mutedColor }}><i className="fas fa-search"></i></Link>}
          {h.showCart !== false && <Link href={`/store/${slug}/cart`} className="p-2 text-sm relative transition-all hover:opacity-60" style={{ color: mutedColor }}><i className="fas fa-shopping-bag"></i></Link>}
          {h.showLanguage !== false && <LanguageSwitcher dark={isDark} lang={language} />}
          {h.showAccount !== false && <UserMenu slug={slug} lang={language} session={session} textColor={mutedColor} />}
          <button onClick={() => setMobileOpen(true)} className="md:hidden flex flex-col gap-1 p-2">
            <span className="block w-6 h-0.5" style={{ background: textColor }} />
            <span className="block w-6 h-0.5" style={{ background: textColor }} />
            <span className="block w-6 h-0.5" style={{ background: textColor }} />
          </button>
        </div>
      </div>
      {style === 'centered' && (
        <div className="max-w-7xl mx-auto px-6 pb-3 hidden md:block">
          <nav className="flex justify-center gap-8">
            {links.map((link: any, i: number) => (
              <Link key={i} href={link.href} className="text-sm font-medium transition-all hover:opacity-60" style={{ color: mutedColor }}>{link.label}</Link>
            ))}
          </nav>
        </div>
      )}
      {mobileOpen && <MobileMenu />}
    </header>
  );
}
