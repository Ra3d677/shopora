"use client";
import React, { useState } from "react";
import Link from "next/link";

interface StoreHeaderProps {
  headerConfig?: any;
  slug: string;
  storeName: string;
}

export default function StoreHeader({ headerConfig, slug, storeName }: StoreHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  if (!headerConfig) return null;

  const { style = 'classic', config = {} } = headerConfig;
  const links = config.links || [];
  const isDark = style === 'dark' || style === 'glass' || style === 'dddyou';
  const bgColor = config.bgColor || (isDark ? '#0f0f1a' : '#ffffff');
  const textColor = config.textColor || (isDark ? '#ffffff' : '#000000');
  const isSticky = config.sticky !== false;

  if (style === 'dddyou') {
    return (
      <header className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}`} style={{ background: bgColor }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <Link href={`/store/${slug}`} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#c87a36] flex items-center justify-center text-[#0f0f1a] text-sm font-black">D</div>
            <span className="font-['Alex_Brush'] text-xl" style={{ color: textColor }}>{config.logoText || storeName}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link: any, i: number) => (
              <Link key={i} href={link.href?.startsWith('/') ? `/store/${slug}${link.href}` : `/store/${slug}#${link.href?.replace('#', '')}`} className="text-sm font-medium transition-colors hover:text-[#c9a96e]" style={{ color: textColor + 'cc' }}>{link.label}</Link>
            ))}
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
            <span className="block w-6 h-0.5 transition-all" style={{ background: textColor, transform: menuOpen ? 'rotate(45deg) translateY(5px)' : '' }} />
            <span className="block w-6 h-0.5 transition-all" style={{ background: textColor, opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-6 h-0.5 transition-all" style={{ background: textColor, transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : '' }} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden" style={{ background: bgColor }}>
            <nav className="flex flex-col px-6 pb-6 gap-4">
              {links.map((link: any, i: number) => (
                <Link key={i} href={link.href?.startsWith('/') ? `/store/${slug}${link.href}` : `/store/${slug}#${link.href?.replace('#', '')}`} onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium" style={{ color: textColor + 'cc' }}>{link.label}</Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative'} transition-all`} style={{ background: bgColor, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <Link href={`/store/${slug}`} className="font-black text-lg tracking-tight" style={{ color: textColor }}>{config.logoText || storeName}</Link>
        {style !== 'minimal' && (
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link: any, i: number) => (
              <Link key={i} href={link.href?.startsWith('/') ? `/store/${slug}${link.href}` : `/store/${slug}#${link.href?.replace('#', '')}`} className="text-sm font-medium transition-all hover:opacity-60" style={{ color: textColor + 'aa' }}>{link.label}</Link>
            ))}
          </nav>
        )}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span className="block w-6 h-0.5 transition-all" style={{ background: textColor, transform: menuOpen ? 'rotate(45deg) translateY(5px)' : '' }} />
          <span className="block w-6 h-0.5 transition-all" style={{ background: textColor, opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-6 h-0.5 transition-all" style={{ background: textColor, transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : '' }} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden" style={{ background: bgColor }}>
          <nav className="flex flex-col px-6 pb-6 gap-4">
            {links.map((link: any, i: number) => (
              <Link key={i} href={link.href?.startsWith('/') ? `/store/${slug}${link.href}` : `/store/${slug}#${link.href?.replace('#', '')}`} onClick={() => setMenuOpen(false)}
                className="text-sm font-medium" style={{ color: textColor + 'aa' }}>{link.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}