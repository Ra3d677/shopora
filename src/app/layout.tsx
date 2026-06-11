import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Vercel Deployment Trigger: Reverting to stable state 2026-05-05 20:53
import { Cairo } from "next/font/google";
import { getLang, getMarketingLang } from "@/lib/i18n";
import { headers } from "next/headers";
import LanguageProvider from "@/components/providers/LanguageProvider";
import { Toaster } from "sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multi-Store Platform",
  description: "A premium multi-store e-commerce platform",
  icons: {
    icon: "/_favicon.ico",
  }
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const isMarketing = pathname === '/' || pathname === '/pricing' || pathname.startsWith('/pricing/');
  const lang = isMarketing ? await getMarketingLang() : await getLang();

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${cairo.variable} antialiased min-h-screen flex flex-col ${lang === 'ar' ? 'font-arabic' : ''}`}>
        <div style={{ position: 'fixed', inset: 0, width: 0, height: 0, pointerEvents: 'none', zIndex: 9999 }}>
          <Toaster position="top-right" richColors />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookies = document.cookie.split(';');
                  var lang = 'en';
                  var pathname = window.location.pathname;
                  var isMarketing = pathname === '/' || pathname === '/pricing' || pathname.indexOf('/pricing/') === 0;
                  var cookieName = isMarketing ? 'SHOPORA_MARKETING_LOCALE' : 'NEXT_LOCALE';
                  for (var i = 0; i < cookies.length; i++) {
                    var c = cookies[i].trim();
                    if (c.indexOf(cookieName + '=') === 0) {
                      lang = c.substring((cookieName + '=').length);
                      break;
                    }
                  }
                  // Sync Zustand persist store with server cookie
                  try {
                    localStorage.setItem('language-storage', JSON.stringify({ state: { language: lang }, version: 0 }));
                  } catch (e) {}
                  document.documentElement.lang = lang;
                  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                  if (lang === 'ar') {
                    document.body.classList.add('font-arabic');
                  } else {
                    document.body.classList.remove('font-arabic');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

