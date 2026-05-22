import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { getSession } from "@/lib/auth";
import { getLang } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  const lang = await getLang();
  if (!store) return {};

  const storeSettings = (store.settings as any) || {};
  const version = store.updatedAt ? new Date(store.updatedAt).getTime() : Date.now();
  const faviconUrl = storeSettings.faviconUrl || '/favicon.ico';
  const faviconWithVersion = faviconUrl.startsWith('data:') 
    ? faviconUrl 
    : `${faviconUrl}${faviconUrl.includes('?') ? '&' : '?'}v=${version}`;
  
  const separator = lang === 'ar' ? ' | ' : ' | ';
  const defaultTitle = lang === 'ar' ? `مرحباً بكم في ${store.name}` : `Welcome to ${store.name}`;
  
  return {
    title: {
      template: `%s${separator}${store.name}`,
      default: store.name,
    },
    description: storeSettings.description || defaultTitle,
    icons: {
      icon: [
        { url: faviconWithVersion, type: 'image/x-icon' },
        { url: faviconWithVersion, type: 'image/png' },
      ],
      shortcut: [faviconWithVersion],
      apple: [
        { url: faviconWithVersion, sizes: '180x180', type: 'image/png' },
      ],
    }
  };
}

export const dynamic = 'force-dynamic';

export default async function TenantStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }
  
  const user = await getSession();

  return (
    <StoreProvider store={store} user={user}>
      {children}
    </StoreProvider>
  );
}
