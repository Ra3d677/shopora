"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import StoreHeader from "@/components/layout/StoreHeader";
import AkiraHeader from "@/components/layout/AkiraHeader";
import AkiraFooter from "@/components/layout/AkiraFooter";
import AnivioHeader from "@/components/layout/AnivioHeader";
import AnivioFooter from "@/components/layout/AnivioFooter";
import NetroHeader from "@/components/layout/NetroHeader";
import NetroFooter from "@/components/layout/NetroFooter";

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
  const is1M = store.template === '1m';
  const is2M = store.template === '2m';
  const is3M = store.template === '3m';
  const is11G = store.template === '11g';
  const isMO = store.template === 'mo';

  if (is1M) {
    return (
      <>
        <AnivioHeader store={store} slug={slug} categories={store.categories} />
        <main className="flex-grow flex flex-col store-container">
          {children}
        </main>
        <AnivioFooter slug={slug} store={store} />
      </>
    );
  }

  if (is2M) {
    return (
      <>
        {!isHomePage && <AkiraHeader store={store} slug={slug} categories={store.categories} />}
        <main className="flex-grow flex flex-col store-container">
          {children}
        </main>
        {!isHomePage && <AkiraFooter slug={slug} store={store} />}
      </>
    );
  }

  if (is3M) {
    return (
      <>
        {!isHomePage && <NetroHeader store={store} slug={slug} categories={store.categories} />}
        <main className="flex-grow flex flex-col store-container">
          {children}
        </main>
        {!isHomePage && <NetroFooter slug={slug} store={store} />}
      </>
    );
  }

  if (is11G || isMO) {
    return (
      <main className="flex-grow flex flex-col store-container">
        {children}
      </main>
    );
  }

  return (
    <>
      {headerSection ? (
        <StoreHeader headerConfig={headerSection} slug={slug} storeName={store.name} session={session} categories={store.categories} />
      ) : (
        store.template !== 'fitness' && store.template !== 'ironpeak' && (store.template !== '2m' || !isHomePage) && (
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
      <main className={`flex-grow flex flex-col store-container ${headerSection ? 'pt-16 md:pt-20' : ''} ${store.template === 'ironpeak' ? '!p-0 !m-0' : ''}`}>
        {children}
      </main>
      <div data-page="footer">
        {store.type !== 'WEBSITE' && store.template !== 'fitness' && store.template !== 'ironpeak' && store.template !== 'dddyou' && store.template !== '1m' && (store.template !== '2m' || !isHomePage) && !is11G && !isMO && <Footer />}
      </div>
      {store.template !== 'fitness' && store.template !== 'ironpeak' && store.template !== 'dddyou' && store.template !== '1m' && store.template !== '2m' && !is11G && !isMO && <WhatsAppButton />}
    </>
  );
}
