"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import StoreHeader from "@/components/layout/StoreHeader";
import AkiraHeader from "@/components/layout/AkiraHeader";
import AkiraFooter from "@/components/layout/AkiraFooter";

export default function StorefrontShell({
  children,
  headerSection,
  store,
  session,
  lang,
  slug,
  isOwner,
}: {
  children: React.ReactNode;
  headerSection: any;
  store: any;
  session: any;
  lang: "en" | "ar";
  slug: string;
  isOwner: boolean;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === `/store/${slug}` || pathname === `/store/${slug}/`;
  const isCartPage = pathname.includes('/cart');
  const isAkira = store.template === '1m' || store.template === '2m';

  if (isAkira && isCartPage) {
    return (
      <>
        <AkiraHeader store={store} slug={slug} categories={store.categories} />
        <main className="flex-grow flex flex-col store-container">
          {children}
        </main>
        <AkiraFooter slug={slug} store={store} />
      </>
    );
  }

  return (
    <>
      {headerSection ? (
        <StoreHeader headerConfig={headerSection} slug={slug} storeName={store.name} session={session} categories={store.categories} />
      ) : (
        store.template !== 'fitness' && (store.template !== '2m' || !isHomePage) && (
          <Navbar
            activeTemplate={store.template}
            storeSettings={{
              ...store.settings,
              type: store.type,
              storeName: store.settings?.storeName || store.name,
              primaryColor: store.settings?.colorSystem?.brand?.primary || store.primaryColor,
            }}
            storeId={store.id}
            categories={store.categories}
            products={store.products}
            lang={lang}
            slug={slug}
            session={session}
          />
        )
      )}
      <main className={`flex-grow flex flex-col store-container ${headerSection ? 'pt-16 md:pt-20' : ''}`}>
        {children}
      </main>
      <div data-page="footer">
        {store.type !== 'WEBSITE' && store.template !== 'fitness' && store.template !== 'dddyou' && store.template !== '1m' && (store.template !== '2m' || !isHomePage) && <Footer />}
      </div>
      {store.template !== 'fitness' && store.template !== 'dddyou' && store.template !== '1m' && store.template !== '2m' && <WhatsAppButton />}
    </>
  );
}
