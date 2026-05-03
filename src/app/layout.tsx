import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${cairo.variable} antialiased min-h-screen flex flex-col ${lang === 'ar' ? 'font-arabic' : ''}`}>
        {children}
      </body>
    </html>
  );
}
