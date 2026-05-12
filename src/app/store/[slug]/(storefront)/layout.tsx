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
import { Suspense } from "react";
import { getPremiumBackgroundStyle, getThemeByPath } from "@/lib/utils";

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

  const colorSystem = storeSettings.colorSystem || {
    backgrounds: { home: defaultHomeBg, shop: '#f8fafc', categories: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
    brand: { primary: store.primaryColor },
    footer: { background: '#0f172a', text: '#ffffff' },
    product: { price: '#0f172a', salePrice: '#ef4444' }
  };

  const customStyles = {
    '--dynamic-primary': colorSystem.brand?.primary || store.primaryColor,
    '--color-bg-home': colorSystem.backgrounds?.home || defaultHomeBg,
    '--color-bg-shop': colorSystem.backgrounds?.shop || '#ffffff',
    '--color-bg-categories': colorSystem.backgrounds?.categories || '#ffffff',
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

  return (
    <div 
      className={`theme-${store.template} flex flex-col min-h-screen transition-all duration-1000 ${isOwner ? 'pt-10' : ''}`} 
      style={customStyles}
    >
      {isSignature && <CustomCursor />}
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
              storeName: store.settings.storeName || store.name,
              primaryColor: store.settings.colorSystem?.brand?.primary || store.primaryColor,
          }} 
          categories={store.categories}
          products={store.products}
          lang={lang} 
          slug={slug}
          session={session}
        />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </PreviewWrapper>
    </div>
  );
}
