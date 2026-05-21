import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Vercel Deployment Trigger: Reverting to stable state 2026-05-05 20:53
import { Cairo } from "next/font/google";
import { getLang } from "@/lib/i18n";

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
  const lang = await getLang();

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${cairo.variable} antialiased min-h-screen flex flex-col ${lang === 'ar' ? 'font-arabic' : ''}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookies = document.cookie.split(';');
                  var lang = 'en';
                  for (var i = 0; i < cookies.length; i++) {
                    var c = cookies[i].trim();
                    if (c.indexOf('NEXT_LOCALE=') === 0) {
                      lang = c.substring('NEXT_LOCALE='.length);
                      break;
                    }
                  }
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
        {children}
      </body>
    </html>
  );
}

