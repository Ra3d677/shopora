"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, X, ArrowRight, Menu } from "lucide-react";
import SmartSearch from "@/components/ui/premium/SmartSearch";
import { useCartStore } from "@/store/cart";
import { buildCategoryTree } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const LogoTransparencyFilter = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
    <filter id="remove-white-bg" colorInterpolationFilters="sRGB">
      <feColorMatrix 
        type="matrix" 
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                -1 -1 -1 3 0" 
      />
    </filter>
  </svg>
);

interface SignatureNavbarProps {
  storeName: string;
  logoUrl?: string;
  slug: string;
  products: any[];
  categories?: any[];
  session?: any;
  storeSettings?: any;
}

export default function SignatureNavbar({ storeName, logoUrl, slug, products, categories = [], session, storeSettings }: SignatureNavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const items = useCartStore((state) => state.items);

  const categoryTree = buildCategoryTree(categories);

  const cartItemCount = items.filter(i => products.some(p => p.id === i.product?.id)).reduce((acc, item) => acc + item.quantity, 0);

  const headerLinks = storeSettings?.headerSettings?.links || [
    { id: 'home', label: 'Home', url: `/store/${slug}` },
    { id: 'shop', label: 'Shop', url: `/store/${slug}/categories` }
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={products} />
      
      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full md:w-[500px] z-[250] bg-white shadow-2xl p-12 flex flex-col"
          >
            <div className="flex justify-between items-center mb-24">
              <span className="text-xl font-black uppercase tracking-tighter">{storeName}</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-4 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8 text-5xl font-black tracking-tighter uppercase">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors flex items-center group">
                  {link.label} <ArrowRight className="ml-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>

            {categoryTree.length > 0 && (
              <div className="mt-12 flex flex-col gap-6">
                <p className="text-xs font-black tracking-[0.3em] uppercase text-slate-400">Collections</p>
                <div className="flex flex-col gap-4">
                  {categoryTree.map((cat: any) => (
                    <div key={cat.id} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center group">
                        <Link 
                          href={`/store/${slug}/products?category=${cat.id}`} 
                          onClick={() => setIsMenuOpen(false)}
                          className="text-2xl font-black uppercase tracking-tighter hover:text-blue-600 transition-colors"
                        >
                          {cat.name}
                        </Link>
                        {cat.children.length > 0 && (
                          <button 
                            onClick={() => setOpenSubMenu(openSubMenu === cat.id ? null : cat.id)}
                            className="p-2 bg-slate-50 rounded-full"
                          >
                            <ChevronDown size={20} className={`transition-transform duration-500 ${openSubMenu === cat.id ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {cat.children.length > 0 && openSubMenu === cat.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-3 pl-4 border-l-2 border-slate-100 overflow-hidden"
                          >
                            {cat.children.map((child: any) => (
                              <Link 
                                key={child.id} 
                                href={`/store/${slug}/products?category=${child.id}`} 
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 flex flex-col gap-8 text-5xl font-black tracking-tighter uppercase">
              {session ? (
                <Link href={`/store/${slug}/account`} onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors flex items-center group">
                  Account <ArrowRight className="ml-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ) : (
                <Link href={`/store/${slug}/login`} onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition-colors flex items-center group">
                  Login <ArrowRight className="ml-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              )}
            </div>

            <div className="mt-auto">
               <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <Link href="#">Instagram</Link>
                  <Link href="#">Twitter</Link>
                  <Link href="#">Facebook</Link>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoTransparencyFilter />
      <nav className={`fixed top-0 w-full z-[150] px-8 py-8 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-6' : 'bg-transparent mix-blend-difference text-white'}`}>
         <div className="flex items-center gap-12">
           <Link href={`/store/${slug}`} className={`text-2xl font-black tracking-tighter uppercase ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              {logoUrl ? (
                <div style={{ filter: storeSettings?.headerSettings?.logoBlendMode === 'multiply' ? 'url(#remove-white-bg)' : 'none' }}>
                  <img 
                    src={logoUrl} 
                    alt={storeName} 
                    className={`${scrolled ? '' : 'invert'}`} 
                    style={{ 
                      height: storeSettings?.headerSettings?.logoHeight || 32, 
                      width: 'auto', 
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ) : (
                storeName
              )}
           </Link>
           <div className={`hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest ${scrolled ? 'text-slate-500' : 'text-white'}`}>
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:opacity-50 transition-opacity">{link.label}</Link>
              ))}
           </div>
         </div>
         <div className={`flex items-center gap-8 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:opacity-50 rounded-full transition-all hover:scale-110"
            >
              <Search size={24} />
            </button>
            <Link href={`/store/${slug}/cart`} className="relative p-2 hover:opacity-50 rounded-full transition-all hover:scale-110 group">
              <ShoppingBag size={24} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-600 shadow-sm text-[10px] font-bold text-white flex items-center justify-center transform group-hover:scale-110 transition-transform -mt-1 -mr-1">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} className="flex flex-col gap-1.5 group">
               <div className={`w-8 h-0.5 transition-all group-hover:w-4 ${scrolled ? 'bg-slate-900' : 'bg-white'}`} />
               <div className={`w-8 h-0.5 ${scrolled ? 'bg-slate-900' : 'bg-white'}`} />
            </button>
         </div>
      </nav>
    </>
  );
}
