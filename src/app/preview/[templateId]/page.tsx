import React from 'react';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import AppleTemplate from '@/components/templates/AppleTemplate';
import HybridDarkCommerceTemplate from '@/components/templates/HybridDarkCommerceTemplate';
import SignatureTemplate from '@/components/templates/SignatureTemplate';
import ZenithTemplate from '@/components/templates/ZenithTemplate';
import ObsidianTemplate from '@/components/templates/ObsidianTemplate';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { StoreProvider } from '@/components/providers/StoreProvider';

const DUMMY_STORE = {
  name: "Demo Premium Store",
  primaryColor: "#000000",
  template: "signature",
  settings: JSON.stringify({
    storeName: "Demo Premium Store",
    bannerSettings: { autoPlay: true, interval: 5000, transition: 'slide', showArrows: true, showDots: true },
    marqueeSettings: { enabled: true, speed: 30, backgroundColor: "#f3f4f6", textColor: "#1f2937", items: [{ id: "m1", text: "WELCOME TO OUR PREMIUM DEMO STORE" }] },
    colors: {
        apple: { primaryAccent: "#ffffff", backgroundColor: "#000000" },
        hybrid: { primaryAccent: "#ffffff", backgroundColor: "#0f0f0f", textColor: "#ffffff" },
        minimal: { primaryAccent: "#000000", backgroundColor: "#ffffff" },
        signature: { primaryAccent: "#000000", backgroundColor: "#ffffff" }
    }
  })
};

const DUMMY_PRODUCTS = [
  { id: '1', name: 'Premium Leather Bag', price: 250, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'], description: 'Luxury handcrafted leather bag.' },
  { id: '2', name: 'Minimalist Watch', price: 180, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'], description: 'Clean design for modern lifestyle.' },
  { id: '3', name: 'Wireless Headphones', price: 350, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'], description: 'Studio quality sound everywhere.' },
  { id: '4', name: 'Ceramic Vase', price: 95, images: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80'], description: 'Minimalist home decor piece.' }
];

const DUMMY_CATEGORIES = [
  { id: 'c1', name: 'Accessories', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80' },
  { id: 'c2', name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=400&q=80' }
];

const DUMMY_BANNERS = [
  { id: 'b1', imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80', title: 'Summer Collection 2026', subtitle: 'Exquisite designs for the modern individual.', buttonText: 'Shop Now', buttonLink: '#' }
];

export default async function TemplatePreviewPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;

  const settings = JSON.parse(DUMMY_STORE.settings);
  const allColors = settings.colors || {};
  const colors = allColors[templateId] || {};

  const customStyles = {
    '--dynamic-primary': DUMMY_STORE.primaryColor,
    '--color-primary-accent': colors.primaryAccent || DUMMY_STORE.primaryColor,
    '--color-bg-main': colors.backgroundColor,
    '--color-text-main': colors.textColor,
    '--color-header-bg': colors.headerBackground,
    '--color-header-text': colors.headerText,
    '--color-footer-bg': colors.footerBackground,
    '--color-footer-text': colors.footerText,
    '--color-btn-bg': colors.buttonBackground,
    '--color-btn-text': colors.buttonText,
    '--color-price': colors.priceColor,
    '--color-sale-price': colors.salePriceColor
  } as React.CSSProperties;

  const renderTemplate = () => {
    const productsWithCats = DUMMY_PRODUCTS.map(p => ({ ...p, category_id: 'featured' }));
    const commonProps = {
      store: { ...DUMMY_STORE, template: templateId } as any,
      settings: settings,
      products: productsWithCats as any,
      categories: DUMMY_CATEGORIES as any,
      banners: DUMMY_BANNERS as any,
      slug: 'demo'
    };

    switch (templateId) {
      case 'minimal': return <MinimalTemplate {...commonProps} />;
      case 'apple': return <AppleTemplate {...commonProps} />;
      case 'hybrid': return <HybridDarkCommerceTemplate {...commonProps} />;
      case 'signature': return <SignatureTemplate {...commonProps} />;
      case 'zenith': return <ZenithTemplate {...commonProps} />;
      case 'obsidian': return <ObsidianTemplate {...commonProps} />;
      default: return <SignatureTemplate {...commonProps} />;
    }
  };

  return (
    <StoreProvider store={{ ...DUMMY_STORE, template: templateId } as any}>
      <div 
        className={`theme-${templateId} min-h-screen flex flex-col relative transition-colors duration-500`}
        style={{
          ...customStyles,
          backgroundColor: 'var(--color-bg-main)',
          color: 'var(--color-text-main)'
        }}
      >
        {/* PREVIEW BAR */}
        <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-900/95 backdrop-blur-md text-white p-4 shadow-2xl flex items-center justify-between px-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <Link href="/create-store" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Preview Mode</span>
              <h2 className="text-sm font-bold uppercase tracking-tight">{templateId} Template</h2>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-medium text-slate-300 italic">Live Interactive Preview</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/create-store" className="px-6 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2 shadow-lg">
              <Check className="w-4 h-4" /> Select This Template
            </Link>
          </div>
        </div>

        {/* TEMPLATE CONTENT */}
        <div className="pt-[72px] flex-1">
          <Navbar 
            activeTemplate={templateId as any} 
            storeSettings={{
                storeName: DUMMY_STORE.name,
                primaryColor: DUMMY_STORE.primaryColor,
                ...settings
            }} 
            lang="en" 
            slug="demo" 
          />
          
          {renderTemplate()}

          <Footer />
        </div>
      </div>
    </StoreProvider>
  );
}
