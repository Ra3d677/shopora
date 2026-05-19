import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getStoreBySlug } from "@/lib/data";
import { getLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CustomCursor from "@/components/ui/premium/CustomCursor";
import AdminEditorBar from "@/components/editor/AdminEditorBar";
import PreviewWrapper from "@/components/editor/PreviewWrapper";
import { getSession } from "@/lib/auth";
import VisitorTracker from "@/components/layout/VisitorTracker";
import PixelTracker from "@/components/layout/PixelTracker";
import KineticBackground from "@/components/ui/premium/KineticBackground";
import { Suspense } from "react";
import { getPremiumBackgroundStyle, getThemeByPath } from "@/lib/utils";
function hexToRgb(hex: string) {
  if (!hex) return '6, 182, 212';
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '6, 182, 212';
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  const lang = await getLang();
  const session = await getSession();
  
  const isOwner = session?.id === store?.ownerId || session?.role === 'superadmin';

  if (!store) {
    notFound();
  }
  
  const isSignature = store.template === 'signature';
  if (!store.isActive) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-4 italic uppercase">Store Suspended</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This store is currently undergoing maintenance or has been temporarily deactivated by the platform administrator. Please check back later.
          </p>
          <Link href="/" className="inline-block px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-slate-200 transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  const storeSettings = (store.settings as any) || {};
  const tpl = store.template;
  const defaultHomeBg = (tpl === 'obsidian' || tpl === 'hybrid' || tpl === 'zenith') ? '#0a0a0a' : (tpl === 'apple' ? '#f5f5f7' : '#ffffff');

  const currentThemeId = getThemeByPath(storeSettings.pageThemes || [], `/store/${slug}`);
  const premiumStyle = getPremiumBackgroundStyle(currentThemeId);
  const isPremiumBg = currentThemeId !== 'default';

    const defaultBackgrounds = { 
    home: defaultHomeBg, 
    shop: '#f8fafc', 
    categories: '#ffffff',
    product: '#ffffff',
    cart: '#ffffff',
    checkout: '#ffffff'
  };

    const rawColorSystem = storeSettings.colorSystem || {};
  const colorSystem: any = {
    backgrounds: { ...defaultBackgrounds, ...(rawColorSystem.backgrounds || {}) },
    text: { 
      primary: '#0f172a', 
      secondary: '#64748b', 
      home: '#000000',
      shop: '#000000',
      categories: '#000000',
      product: '#000000',
      cart: '#000000',
      checkout: '#000000',
      ...(rawColorSystem.text || {}) 
    },
    brand: { primary: store.primaryColor, ...(rawColorSystem.brand || {}) },
    footer: { background: '#0f172a', text: '#ffffff', ...(rawColorSystem.footer || {}) },
    product: { price: '#0f172a', salePrice: '#ef4444', ...(rawColorSystem.product || {}) },
    testimonial: { background: '#0f172a', text: '#ffffff', ...(rawColorSystem.testimonial || {}) },
    animatedBackgrounds: rawColorSystem.animatedBackgrounds || {}
  };

  // Determine current page type for specific styling
  const pageType = children?.toString().includes('Shop') ? 'shop' : 
                   children?.toString().includes('Category') ? 'categories' :
                   children?.toString().includes('Product') ? 'product' :
                   children?.toString().includes('Cart') ? 'cart' :
                   children?.toString().includes('Checkout') ? 'checkout' : 'home';

  const customStyles = {
    '--dynamic-primary': colorSystem.brand?.primary || store.primaryColor,
    '--dynamic-primary-rgb': hexToRgb(colorSystem.brand?.primary || store.primaryColor || '#22d3ee'),
    '--color-bg-home': colorSystem.backgrounds?.home || defaultHomeBg,
    '--color-bg-shop': colorSystem.backgrounds?.shop || '#ffffff',
    '--color-bg-categories': colorSystem.backgrounds?.categories || '#ffffff',
    '--color-bg-product': colorSystem.backgrounds?.product || '#ffffff',
    '--color-bg-cart': colorSystem.backgrounds?.cart || '#ffffff',
    '--color-bg-checkout': colorSystem.backgrounds?.checkout || '#ffffff',
    '--color-text-home': colorSystem.text?.home || colorSystem.text?.primary || '#000000',
    '--color-text-shop': colorSystem.text?.shop || colorSystem.text?.primary || '#000000',
    '--color-text-categories': colorSystem.text?.categories || colorSystem.text?.primary || '#000000',
    '--color-text-product': colorSystem.text?.product || colorSystem.text?.primary || '#000000',
    '--color-text-cart': colorSystem.text?.cart || colorSystem.text?.primary || '#000000',
    '--color-text-checkout': colorSystem.text?.checkout || colorSystem.text?.primary || '#000000',
    '--color-text-primary': colorSystem.text?.primary || '#000000',
    '--color-text-secondary': colorSystem.text?.secondary || '#666666',
    '--color-footer-bg': colorSystem.footer?.background || '#000000',
    '--color-footer-text': colorSystem.footer?.text || '#ffffff',
    '--color-price': colorSystem.product?.price || '#000000',
    '--color-sale-price': colorSystem.product?.salePrice || '#ef4444',
    '--color-testimonial-bg': colorSystem.testimonial?.background || '#0f172a',
    '--color-testimonial-text': colorSystem.testimonial?.text || '#ffffff',
    ...(isPremiumBg ? premiumStyle : {})
  } as React.CSSProperties;

  // Inject exact colors for kinetic interactive backgrounds
  ['home', 'shop', 'categories', 'product', 'cart', 'checkout', 'footer'].forEach(p => {
    if (colorSystem.animatedBackgrounds?.[p]) {
       const synthKey = `${p}-backgrounds`;
       const state = storeSettings.colorSystem?.synthesisStates?.[synthKey];
       if (state) {
          (customStyles as any)[`--color-a-${p}`] = state.a;
          (customStyles as any)[`--color-b-${p}`] = state.b;
       }
    }
  });

  return (
    <div 
      className={`theme-${store.template} flex flex-col min-h-screen transition-all duration-700`} 
      style={customStyles}
    >
      <style dangerouslySetInnerHTML={{ __html: `
                                :root {
          --current-bg: var(--color-bg-home);
          --current-text: var(--color-text-home);
        }
        [data-page="home"] { --current-bg: var(--color-bg-home); --current-text: var(--color-text-home); }
        [data-page="shop"] { --current-bg: var(--color-bg-shop); --current-text: var(--color-text-shop); }
        [data-page="categories"] { --current-bg: var(--color-bg-categories); --current-text: var(--color-text-categories); }
        [data-page="product"] { --current-bg: var(--color-bg-product); --current-text: var(--color-text-product); }
        [data-page="cart"] { --current-bg: var(--color-bg-cart); --current-text: var(--color-text-cart); }
        [data-page="checkout"] { --current-bg: var(--color-bg-checkout); --current-text: var(--color-text-checkout); }
        [data-page="footer"] { --current-bg: var(--color-footer-bg); --current-text: var(--color-footer-text); }

        .store-container {
          background: var(--current-bg) !important;
          color: var(--current-text) !important;
        }

        /* Animated Interactive Background Injection (Kinetic Spotlight) */
        ${['home', 'shop', 'categories', 'product', 'cart', 'checkout'].map(p => 
          colorSystem.animatedBackgrounds?.[p] ? `
            body:has([data-page="${p}"]) .store-container, [data-page="${p}"] { 
              background: radial-gradient(circle 800px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), var(--color-a-${p}, var(--current-bg)), var(--color-b-${p}, #000000)) !important;
              background-attachment: fixed !important;
            }
          ` : ''
        ).join('')}

        ${colorSystem.animatedBackgrounds?.['footer'] ? `
            [data-page="footer"] footer { 
              background: radial-gradient(circle 800px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), var(--color-a-footer, var(--color-footer-bg)), var(--color-b-footer, #000000)) !important;
              background-attachment: fixed !important;
            }
        ` : ''}

        /* Force children to respect the synthesized text color unless they are specific links/buttons */
        .store-container h1, 
        .store-container h2, 
        .store-container h3, 
        .store-container h4, 
        .store-container h5, 
        .store-container h6,
        .store-container p,
        .store-container .text-zinc-900,
        .store-container .text-slate-900,
        .store-container .text-zinc-800,
        .store-container .text-slate-800 {
           color: inherit;
        }

        /* Enhanced Gradient Text Support */
        .gradient-text-support {
          background: var(--current-text) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          display: inline-block;
        }

        /* Support for Gradient Text */
        .gradient-text-support {
          background: var(--current-text);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent !important;
          display: inline-block;
        }
        
        /* If current text is NOT a gradient, don't use transparent */
        .current-text-color {
          color: var(--current-text);
        }

        /* Override cyan colors in WEBSITE store type dynamically */
        ${store.type === 'WEBSITE' ? `
          .text-cyan-400 {
            color: var(--dynamic-primary, #22d3ee) !important;
          }
          .bg-cyan-500 {
            background-color: var(--dynamic-primary, #06b6d4) !important;
          }
          .bg-cyan-500\\/10 {
            background-color: rgba(var(--dynamic-primary-rgb, 6, 182, 212), 0.1) !important;
          }
          .bg-cyan-500\\/20 {
            background-color: rgba(var(--dynamic-primary-rgb, 6, 182, 212), 0.2) !important;
          }
          .bg-cyan-950\\/40 {
            background-color: rgba(var(--dynamic-primary-rgb, 6, 182, 212), 0.05) !important;
          }
          .border-cyan-500 {
            border-color: var(--dynamic-primary, #06b6d4) !important;
          }
          .border-cyan-500\\/50 {
            border-color: rgba(var(--dynamic-primary-rgb, 6, 182, 212), 0.5) !important;
          }
          .hover\\:border-cyan-500\\/50:hover {
            border-color: rgba(var(--dynamic-primary-rgb, 6, 182, 212), 0.5) !important;
          }
          .hover\\:bg-cyan-400:hover {
            background-color: var(--dynamic-primary, #22d3ee) !important;
          }
          .hover\\:bg-cyan-300:hover {
            background-color: var(--dynamic-primary, #67e8f9) !important;
          }
          .hover\\:text-cyan-400:hover {
            color: var(--dynamic-primary, #22d3ee) !important;
          }
          .group-hover\\:text-cyan-400:hover, 
          .group:hover .group-hover\\:text-cyan-400 {
            color: var(--dynamic-primary, #22d3ee) !important;
          }
          .group-hover\\:bg-cyan-500\\/20:hover, 
          .group:hover .group-hover\\:bg-cyan-500\\/20 {
            background-color: rgba(var(--dynamic-primary-rgb, 6, 182, 212), 0.2) !important;
          }
        ` : ''}
      `}} />

      {isSignature && <CustomCursor />}
      <KineticBackground />
      <VisitorTracker slug={slug} />
      <Suspense fallback={null}>
        <PixelTracker 
          facebookPixelId={store.facebookPixelId}
          tiktokPixelId={store.tiktokPixelId}
          snapchatPixelId={store.snapchatPixelId}
          googleAnalyticsId={store.googleAnalyticsId}
        />
      </Suspense>
      <Suspense fallback={null}>
        <AdminEditorBar slug={slug} isOwner={isOwner} store={store} />
      </Suspense>
      <PreviewWrapper isOwner={isOwner}>
        <Navbar 
          activeTemplate={store.template as any} 
          storeSettings={{
              ...store.settings,
              type: store.type,
              storeName: store.settings.storeName || store.name,
              primaryColor: store.settings.colorSystem?.brand?.primary || store.primaryColor,
          }} 
          storeId={store.id}
          categories={store.categories}
          products={store.products}
          lang={lang} 
          slug={slug}
          session={session}
        />
        <main className="flex-grow flex flex-col store-container">
          {children}
        </main>
        <div data-page="footer">
          {store.type !== 'WEBSITE' && <Footer />}
        </div>
        <WhatsAppButton />
      </PreviewWrapper>
    </div>
  );
}
