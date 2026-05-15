import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { getSession } from "@/lib/auth";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return {};

  const storeSettings = (store.settings as any) || {};
  const version = store.updatedAt ? new Date(store.updatedAt).getTime() : Date.now();
  const faviconUrl = storeSettings.faviconUrl || '/favicon.ico';
  const faviconWithVersion = `${faviconUrl}${faviconUrl.includes('?') ? '&' : '?'}v=${version}`;
  
  return {
    title: {
      template: `%s | ${store.name}`,
      default: store.name,
    },
    description: storeSettings.description || `Welcome to ${store.name}`,
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
export const revalidate = 0;

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
