"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import UserMenu from "@/components/layout/UserMenu";
import { useLanguageStore } from "@/store/language";

interface Props {
  headerConfig: any;
  slug: string;
  storeName: string;
  session?: any;
}

export default function StoreHeader({ headerConfig, slug, storeName, session }: Props) {
  const { language } = useLanguageStore();
  const h = headerConfig?.config || {};
  const style = headerConfig?.style || 'classic';
  const links = h.links || [];

  if (style === 'dddyou') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: h.bgColor || '#0f0f1a' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#c87a36] flex items-center justify-center text-[#0f0f1a] text-sm font-black">D</div>
            <span className="font-['Alex_Brush'] text-xl" style={{ color: h.textColor || '#c9a96e' }}>{h.logoText || storeName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link: any, i: number) => (
              <Link key={i} href={link.href} className="text-sm font-medium transition-colors hover:text-[#c9a96e]" style={{ color: h.textColor || '#ffffffcc' }}>{link.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            {h.showTracking && <Link href={`/store/${slug}/tracking`} className="p-2 text-sm text-white/70 hover:text-[#c9a96e]"><i className="fas fa-truck"></i></Link>}
            {h.showSearch && <Link href={`/store/${slug}/search`} className="p-2 text-sm text-white/70 hover:text-[#c9a96e]"><i className="fas fa-search"></i></Link>}
            {h.showCart !== false && <Link href={`/store/${slug}/cart`} className="p-2 text-sm text-white/70 hover:text-[#c9a96e]"><i className="fas fa-shopping-bag"></i></Link>}
            {h.showLanguage !== false && <LanguageSwitcher dark lang={language} />}
            {h.showAccount !== false && <UserMenu slug={slug} lang={language} session={session} textColor={h.textColor || '#ffffffcc'} />}
          </div>
        </div>
      </header>
    );
  }

  const isDark = style === 'dark' || style === 'glass';
  const textColor = h.textColor || (isDark ? '#ffffff' : '#000000');
  const mutedColor = h.textColor || (isDark ? '#ffffffcc' : '#4a5568');

  return (
    <header className={`${h.sticky !== false ? 'fixed top-0 left-0 right-0 z-50' : 'relative'} transition-all duration-300`}
      style={{
        background: h.bgColor || (isDark ? '#0f0f1a' : '#ffffff'),
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
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
    </header>
  );
}
