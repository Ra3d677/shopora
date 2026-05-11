"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Globe, ChevronDown, Home, ShoppingBag, Heart, User, Mail } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { StoreSettings } from "@/lib/types";
import { setLanguageCookie } from "@/app/actions";
import { translations, TranslationKey } from "@/lib/translations";
import SignatureNavbar from "./SignatureNavbar";
import { logoutCustomer } from "@/app/store/actions";

export default function Navbar({ 
  activeTemplate = 'signature', 
  storeSettings, 
  lang = 'en',
  slug,
  categories = [],
  products = [],
  session = null
}: { 
  activeTemplate?: string, 
  storeSettings?: any, 
  lang?: 'en' | 'ar',
  slug?: string,
  categories?: any[],
  products?: any[],
  session?: any
}) {
  const t = (key: TranslationKey): string => {
    try {
      return translations[lang || 'en'][key] || key;
    } catch (e) {
      return key;
    }
  };

  
  const headerLinks = storeSettings?.headerSettings?.links || [
    { id: 'home', label: t('home') || 'Home', url: `/store/${slug}` },
    { id: 'shop', label: t('shop') || 'Shop', url: `/store/${slug}/categories` }
  ];
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.filter(i => products?.some(p => p.id === i.product?.id)).reduce((acc, item) => acc + item.quantity, 0);

  const rawLayout = storeSettings?.headerSettings?.layout;
  const effectiveLayout = (rawLayout && rawLayout !== 'default') ? rawLayout : activeTemplate;
  const originalTemplate = activeTemplate;

  
  const MobileMenuDrawer = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 left-0 w-[80%] max-w-[320px] z-[9999] bg-white shadow-2xl p-8 flex flex-col font-sans text-slate-900"
        >
          <div className="flex justify-between items-center mb-12">
            <Link href={`/store/${slug}`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black uppercase tracking-tighter" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? <img src={storeSettings.logoUrl} alt={storeSettings.storeName} className="h-8 w-auto object-contain" /> : (storeSettings?.storeName || 'Store')}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6 text-lg font-bold tracking-widest uppercase">
            {headerLinks.map((link: any) => (
              <Link key={link.id} href={link.url} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors flex items-center border-b border-slate-100 pb-4">
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pt-8 border-t border-slate-100">
             <LanguageSwitcher />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (effectiveLayout === 'signature') {
    return (
      <>
        <SignatureNavbar 
        storeName={storeSettings?.storeName || 'Store'} 
        logoUrl={storeSettings?.logoUrl} 
        slug={slug || ''} 
        products={products}
        session={session}
        storeSettings={storeSettings}
      />
      </>
    );
  }

  if (effectiveLayout === 'senno') {
    return (
      <>
        <SennoNavbar 
          storeName={storeSettings?.storeName || 'Store'} 
          logoUrl={storeSettings?.logoUrl} 
          slug={slug || ''} 
          cartItemCount={cartItemCount}
          session={session}
          storeSettings={storeSettings}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <MobileMenuDrawer />
      </>
    );
  }

  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/store/${slug}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logoutCustomer(slug || '');
    router.refresh();
    setIsUserMenuOpen(false);
  };

  // Common User Menu Dropdown
  const UserMenuDropdown = () => (
    <div className="relative" ref={userMenuRef}>
      <button 
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
        className="p-2 transition-all hover:scale-110 flex items-center" 
        aria-label="User account"
      >
        {user && user.photoURL ? (
           <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full border border-slate-600" />
        ) : (
           <UserIcon className="h-5 w-5" />
        )}
      </button>
      
      {isUserMenuOpen && mounted && (
        <div className={`absolute ${lang === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 transform transition-all`}>
          {session ? (
            <>
              <div className="px-4 py-3 border-b border-slate-100 mb-1">
                <p className="text-sm font-medium text-slate-900 truncate">{session.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{session.email}</p>
              </div>
              <Link href={`/store/${slug}/account`} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                <UserIcon className="w-4 h-4" /> {t('myAccount')}
              </Link>
              {session.role === 'superadmin' && (
                <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> {t('adminPanel')}
                </Link>
              )}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left mt-1 border-t border-slate-100 pt-3">
                <LogOut className="w-4 h-4" /> {t('signOut')}
              </button>
            </>
          ) : (
            <>
              <Link href={`/store/${slug}/login`} onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                {t('signIn')}
              </Link>
              <Link href={`/store/${slug}/register`} onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                {t('createAccount')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );

  const LanguageSwitcher = ({ dark = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

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
          aria-label="Change Language"
        >
          <Globe className="h-5 w-5" />
          <span className="hidden md:inline">{lang === 'en' ? 'EN' : 'عربي'}</span>
        </button>
        {isOpen && mounted && (
          <div className={`absolute ${lang === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-3 w-32 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 transform transition-all text-slate-900`}>
            <button
              onClick={async () => { await setLanguageCookie('en'); setIsOpen(false); router.refresh(); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${lang === 'en' ? 'text-blue-600' : ''}`}
              dir="ltr"
            >
              English
            </button>
            <button
              onClick={async () => { await setLanguageCookie('ar'); setIsOpen(false); router.refresh(); }}
              className={`w-full text-right px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors font-arabic ${lang === 'ar' ? 'text-blue-600' : ''}`}
              dir="rtl"
            >
              العربية
            </button>
          </div>
        )}
      </div>
    );
  };

  // SEARCH BAR COMPONENT
  const SearchBar = ({ dark = false }) => (
    isSearchOpen ? (
      <form onSubmit={handleSearch} className={`flex items-center rounded-full px-3 py-1.5 border transition-colors ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm placeholder-slate-400 outline-none w-32 md:w-48 transition-all"
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" onClick={() => setIsSearchOpen(false)} className="hover:opacity-70 p-1 ml-1">
          <X className="h-4 w-4" />
        </button>
      </form>
    ) : (
      <button onClick={() => setIsSearchOpen(true)} className="p-2 transition-all hover:scale-110" aria-label="Search">
        <Search className="h-5 w-5" />
      </button>
    )
  );

  const CartButton = () => (
    <Link href={`/store/${slug}/cart`} className="relative p-2 transition-all hover:scale-110 group">
      <ShoppingCart className="h-5 w-5" />
      {mounted && cartItemCount > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-blue-600 shadow-sm text-[10px] font-bold text-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
          {cartItemCount}
        </span>
      )}
    </Link>
  );

  // 1. MINIMAL NAVBAR
  if (effectiveLayout === 'minimal') {
    return (
      <>
        <nav 
        className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-zinc-100 font-light antialiased transition-colors"
        style={{ backgroundColor: 'var(--color-header-bg, rgba(255,255,255,0.9))', color: 'var(--color-header-text, #18181b)' }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="flex h-24 items-center justify-between">
            <Link href={`/store/${slug}`} className="text-3xl font-bold tracking-tighter uppercase" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? (
                <img 
                  src={storeSettings.logoUrl} 
                  alt={storeSettings.storeName} 
                  className="w-auto object-contain" 
                  style={{ 
                    height: storeSettings?.headerSettings?.logoHeight || 48,
                    mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
                  }}
                />
              ) : (
                storeSettings?.storeName || 'Store'
              )}
            </Link>
            
            <div className="hidden lg:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.3em]">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:opacity-50 transition-opacity">{link.label}</Link>
              ))}
            </div>

            <div className="flex items-center gap-8">
              <LanguageSwitcher />
              <SearchBar />
              <UserMenuDropdown />
              <CartButton />
              <button className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenuDrawer />
      </>

    );
  }

  // 2. APPLE NAVBAR
  if (effectiveLayout === 'apple') {
    return (
      <>
        <nav 
        className="sticky top-0 z-50 w-full backdrop-blur-md font-sans text-xs antialiased border-b border-[#333336] transition-colors"
        style={{ backgroundColor: 'var(--color-header-bg, rgba(29,29,31,0.8))', color: 'var(--color-header-text, #f5f5f7)' }}
      >
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="flex h-[44px] items-center justify-between">
            <Link href={`/store/${slug}`} className="hover:opacity-70 transition-opacity font-semibold tracking-wide text-sm" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? (
                <img 
                  src={storeSettings.logoUrl} 
                  alt={storeSettings.storeName} 
                  className="w-auto object-contain brightness-0 invert" 
                  style={{ 
                    height: storeSettings?.headerSettings?.logoHeight || 24,
                    mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
                  }}
                />
              ) : (
                storeSettings?.storeName || 'Store'
              )}
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 font-normal tracking-wide">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:opacity-70 transition-opacity">{link.label}</Link>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <SearchBar dark />
              <CartButton />
              <button className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenuDrawer />
      </>

    );
  }

  if (effectiveLayout === 'obsidian') {
    return (
      <>
        <ObsidianNavbar 
          storeSettings={storeSettings}
          storeName={storeSettings?.storeName || 'Store'} 
          logoUrl={storeSettings?.logoUrl} 
          slug={slug || ''} 
          cartItemCount={cartItemCount}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <MobileMenuDrawer />
      </>
    );
  }

  if (effectiveLayout === 'zenith') {
    return (
      <>
        <ZenithNavbar 
          storeSettings={storeSettings}
          storeName={storeSettings?.storeName || 'Store'} 
          logoUrl={storeSettings?.logoUrl} 
          slug={slug || ''} 
          cartItemCount={cartItemCount}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <MobileMenuDrawer />
      </>
    );
  }

  

  // === NEW LAYOUTS ===
  
  if (effectiveLayout === 'standard') {
    return (
      <>
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-slate-100 bg-white/90 text-slate-900 transition-colors">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <Link href={`/store/${slug}`} className="flex-shrink-0 text-2xl font-black tracking-tighter uppercase" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? (
                <img 
                  src={storeSettings.logoUrl} 
                  alt={storeSettings.storeName} 
                  className="w-auto object-contain" 
                  style={{ 
                    height: storeSettings?.headerSettings?.logoHeight || 40,
                    mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
                  }}
                />
              ) : (storeSettings?.storeName || 'Store')}
            </Link>
            <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-600">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:text-blue-600 transition-colors">{link.label}</Link>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
              <SearchBar />
              <UserMenuDropdown />
              <CartButton />
              <button className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenuDrawer />
      </>

    );
  }

  if (effectiveLayout === 'centered') {
    return (
      <>
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-slate-100 bg-white/90 text-slate-900 transition-colors">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-24 items-center justify-between">
            <div className="hidden lg:flex flex-1 items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-600">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:text-blue-600 transition-colors">{link.label}</Link>
              ))}
            </div>
            <Link href={`/store/${slug}`} className="flex-1 flex justify-center text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? (
                <img 
                  src={storeSettings.logoUrl} 
                  alt={storeSettings.storeName} 
                  className="w-auto object-contain" 
                  style={{ 
                    height: storeSettings?.headerSettings?.logoHeight || 48,
                    mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
                  }}
                />
              ) : (storeSettings?.storeName || 'Store')}
            </Link>
            <div className="flex-1 flex items-center justify-end gap-6">
              <LanguageSwitcher />
              <SearchBar />
              <UserMenuDropdown />
              <CartButton />
              <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenuDrawer />
      </>

    );
  }

  if (effectiveLayout === 'luxury') {
    return (
      <>
        <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl border-b border-slate-100 bg-white/95 text-slate-900 transition-colors py-4">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center gap-6">
          <div className="w-full flex justify-between items-center relative">
             <div className="w-32 flex items-center gap-4">
               <LanguageSwitcher />
               <SearchBar />
             </div>
              <Link href={`/store/${slug}`} className="text-4xl font-light tracking-[0.2em] uppercase absolute left-1/2 -translate-x-1/2" style={{ color: 'var(--color-primary-accent, inherit)' }}>
                {storeSettings?.logoUrl ? (
                  <img 
                    src={storeSettings.logoUrl} 
                    alt={storeSettings.storeName} 
                    className="w-auto object-contain mx-auto" 
                    style={{ 
                      height: storeSettings?.headerSettings?.logoHeight || 56,
                      mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
                    }}
                  />
                ) : (storeSettings?.storeName || 'Store')}
              </Link>
             <div className="w-32 flex items-center justify-end gap-4">
               <UserMenuDropdown />
               <CartButton />
               <button className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
             </div>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
             {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:text-slate-900 transition-colors">{link.label}</Link>
              ))}
          </div>
        </div>
      </nav>
      <MobileMenuDrawer />
      </>
    );
  }

  if (effectiveLayout === 'hamburger') {
    return (
      <>
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-slate-100 bg-white/90 text-slate-900 transition-colors">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <div className="flex-1 flex items-center gap-6">
               <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Menu className="w-6 h-6" /></button>
               <div className="hidden md:block"><LanguageSwitcher /></div>
            </div>
            <Link href={`/store/${slug}`} className="flex-1 flex justify-center text-2xl font-black tracking-widest uppercase" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? (
                <img 
                  src={storeSettings.logoUrl} 
                  alt={storeSettings.storeName} 
                  className="w-auto object-contain" 
                  style={{ height: storeSettings?.headerSettings?.logoHeight || 40 }}
                />
              ) : (storeSettings?.storeName || 'Store')}
            </Link>
            <div className="flex-1 flex items-center justify-end gap-6">
              <SearchBar />
              <UserMenuDropdown />
              <CartButton />
            </div>
          </div>
        </div>
      </nav>
      <MobileMenuDrawer />
      </>

    );
  }

  // === END NEW LAYOUTS ===

  // DEFAULT (LUXURY)
  return (
    <>
      <nav 
        className="sticky top-0 z-50 w-full backdrop-blur-2xl border-b border-[#1a1a1a]/5 font-serif transition-colors"
        style={{ backgroundColor: 'var(--color-header-bg, rgba(250,249,246,0.8))', color: 'var(--color-header-text, #1a1a1a)' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex h-28 items-center justify-between">
            <div className="hidden lg:flex flex-1 items-center gap-10 text-[11px] uppercase tracking-[0.3em] font-sans font-bold">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:opacity-40 transition-opacity">{link.label}</Link>
              ))}
            </div>
            
            <Link href={`/store/${slug}`} className="flex-1 text-center text-4xl font-light tracking-[0.2em] uppercase" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? (
                <img 
                  src={storeSettings.logoUrl} 
                  alt={storeSettings.storeName} 
                  className="mx-auto w-auto object-contain" 
                  style={{ 
                    height: storeSettings?.headerSettings?.logoHeight || 64,
                    mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
                  }}
                />
              ) : (
                storeSettings?.storeName || 'Store'
              )}
            </Link>
            
            <div className="flex-1 flex items-center justify-end gap-6 text-[11px] uppercase tracking-[0.3em] font-sans font-bold">
              <LanguageSwitcher />
              <SearchBar />
              <UserMenuDropdown />
              <CartButton />
              <button className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenuDrawer />
    </>
  );
}

function ZenithNavbar({ storeName, logoUrl, slug, cartItemCount, storeSettings, onMenuClick }: any) {
  const [scrolled, setScrolled] = useState(false);
  const headerLinks = storeSettings?.headerSettings?.links || [{ id: 'home', label: 'Home', url: `/store/${slug}` }, { id: 'shop', label: 'Shop', url: `/store/${slug}/categories` }];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-white/80 backdrop-blur-xl py-4 shadow-sm text-[#1c1c1b]' : 'bg-transparent py-8 text-white'}`}>
      <div className="container mx-auto px-8 md:px-16 flex justify-between items-center">
        <div className="flex-1 hidden md:flex gap-12 text-[10px] uppercase tracking-[0.4em] font-sans font-bold">
          {headerLinks.map((link: any) => (
            <Link key={link.id} href={link.url} className="hover:text-[#c5a368] transition-colors">{link.label}</Link>
          ))}
        </div>

        <Link href={`/store/${slug}`} className="flex-1 text-center">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={storeName} 
              className={`mx-auto w-auto object-contain ${!scrolled ? 'brightness-0 invert' : ''}`} 
              style={{ 
                height: storeSettings?.headerSettings?.logoHeight || 40,
                mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
              }}
            />
          ) : (
            <h1 className="text-3xl font-light tracking-[0.25em] uppercase">{storeName}</h1>
          )}
        </Link>

        <div className="flex-1 flex justify-end items-center gap-8">
           <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.4em] font-sans font-bold">
              <Link href={`/store/${slug}/cart`} className="hover:text-[#c5a368] transition-colors flex items-center gap-2">
                Cart ({cartItemCount})
              </Link>
           </div>
           <button className="md:hidden p-2" onClick={onMenuClick}>
             <Menu className="w-6 h-6" />
           </button>
        </div>
      </div>
    </nav>
  );
}

function ObsidianNavbar({ storeName, logoUrl, slug, cartItemCount, storeSettings, onMenuClick }: any) {
  const headerLinks = storeSettings?.headerSettings?.links || [{ id: 'home', label: 'Home', url: `/store/${slug}` }, { id: 'shop', label: 'Shop', url: `/store/${slug}/categories` }];
  return (
    <nav className="fixed top-0 w-full z-[100] bg-transparent py-8 text-white">
      <div className="container mx-auto px-8 md:px-16 flex justify-between items-center">
        <div className="flex-1 hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.5em]">
          {headerLinks.map((link: any) => (
            <Link key={link.id} href={link.url} className="hover:text-white/50 transition-colors">{link.label}</Link>
          ))}
        </div>

        <Link href={`/store/${slug}`} className="flex-1 text-center">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={storeName} 
              className="mx-auto w-auto object-contain grayscale brightness-200" 
              style={{ 
                height: storeSettings?.headerSettings?.logoHeight || 48,
                mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
              }}
            />
          ) : (
            <h1 className="text-4xl font-black tracking-tighter uppercase">{storeName}</h1>
          )}
        </Link>

        <div className="flex-1 flex justify-end items-center gap-8">
           <Link href={`/store/${slug}/cart`} className="text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
             Cart [{cartItemCount}]
           </Link>
           <button className="p-2" onClick={onMenuClick}>
             <Menu className="w-6 h-6" />
           </button>
        </div>
      </div>
    </nav>
  );
}

function SennoNavbar({ storeName, logoUrl, slug, cartItemCount, session, storeSettings, onMenuClick }: any) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === `/store/${slug}`;
  const headerLinks = storeSettings?.headerSettings?.links || [
    { id: '1', label: 'HOME', url: `/store/${slug}` },
    { id: '2', label: 'SHOP', url: `/store/${slug}/categories` },
    { id: '3', label: 'PRODUCTS', url: `/store/${slug}/products` }
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#1c1c1b] text-white py-2.5 px-6 md:px-12 flex justify-between items-center text-[11px] font-medium tracking-wide z-[110] relative">
         <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Mail size={12} className="text-[#f06292]" />
               <span>Email now : {storeSettings?.contactInfo?.email || 'demo@demo.com'}</span>
            </div>
         </div>
         <div className="flex-1 text-center md:text-right flex justify-center md:justify-end items-center gap-8">
            <p className="uppercase tracking-widest"><span className="text-[#f06292]">Save 50% off</span> cosmetic beauty discount</p>
            <div className="hidden md:flex items-center gap-4 border-l border-white/20 pl-4 uppercase">
               <button className="flex items-center gap-1">USD $ <ChevronDown size={10} /></button>
               <button className="flex items-center gap-1">ENGLISH <ChevronDown size={10} /></button>
            </div>
         </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className={`w-full z-[100] transition-all duration-500 bg-white border-b border-slate-100 py-6 px-6 md:px-12 ${scrolled ? 'fixed top-0 shadow-sm' : 'relative'}`}>
         <div className="container mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link href={`/store/${slug}`} className="flex items-center gap-2 group">
               <div className="w-8 h-8 bg-[#f06292] rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <div className="w-4 h-4 bg-white rounded-full" />
               </div>
               {logoUrl ? (
                 <img 
                   src={logoUrl} 
                   alt={storeName} 
                   className="w-auto" 
                   style={{ 
                     height: storeSettings?.headerSettings?.logoHeight || 32,
                     mixBlendMode: (storeSettings?.headerSettings?.logoBlendMode as any) || 'normal'
                   }}
                 />
               ) : (
                 <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">{storeName}</h1>
               )}
            </Link>

            {/* Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-900">
               {headerLinks.map((link: any) => (
                 <Link key={link.id} href={link.url} className={`${pathname === link.url ? 'text-[#f06292]' : 'hover:text-[#f06292]'} transition-colors`}>
                   {link.label}
                 </Link>
               ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-5 text-slate-900">
               <button className="p-1 hover:text-[#f06292] transition-colors"><Search size={20} strokeWidth={2.5} /></button>
               <Link href={`/store/${slug}/account`} className="p-1 hover:text-[#f06292] transition-colors"><User size={20} strokeWidth={2.5} /></Link>
               <button className="p-1 hover:text-[#f06292] transition-colors relative">
                  <Heart size={20} strokeWidth={2.5} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f06292] text-white text-[8px] font-black rounded-full flex items-center justify-center">0</span>
               </button>
               <Link href={`/store/${slug}/cart`} className="flex items-center gap-2 group">
                  <div className="relative p-1 group-hover:text-[#f06292] transition-colors">
                     <ShoppingBag size={20} strokeWidth={2.5} />
                     {cartItemCount > 0 && (
                       <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f06292] text-white text-[8px] font-black rounded-full flex items-center justify-center">
                         {cartItemCount}
                       </span>
                     )}
                  </div>
                  <div className="hidden md:block">
                     <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Cart</p>
                     <p className="text-[11px] font-black text-slate-900 leading-tight">$0.00</p>
                  </div>
               </Link>
            </div>
         </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[200]">
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/50 p-2 flex items-center justify-between px-6">
           <Link href={`/store/${slug}`} className={`p-3 ${pathname === `/store/${slug}` ? 'text-[#f06292]' : 'text-slate-400'}`}><Home className="w-6 h-6" /></Link>
           <button className="p-3 text-slate-400"><Search className="w-6 h-6" /></button>
           <Link href={`/store/${slug}/products`} className="p-5 bg-[#f06292] text-white rounded-full shadow-lg -translate-y-6">
              <ShoppingBag className="w-6 h-6" />
           </Link>
           <button className="p-3 text-slate-400" onClick={onMenuClick}><Menu className="w-6 h-6" /></button>
           <Link href={`/store/${slug}/account`} className={`p-3 ${pathname.includes('/account') ? 'text-[#f06292]' : 'text-slate-400'}`}><User className="w-6 h-6" /></Link>
        </div>
      </div>
    </>
  );
}
