import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { getSession } from "@/lib/auth";
import { getLang } from "@/lib/i18n";
import { Metadata } from "next";
import { checkAndSuspendExpiredTrial } from "@/lib/data";

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
  await checkAndSuspendExpiredTrial(store.id);
  const isOwner = user?.id === store.ownerId;

  if (store.status === "suspended" && !isOwner) {
    return (
      <StoreProvider store={store} user={user}>
        <SuspendedStore slug={slug} />
      </StoreProvider>
    );
  }

  return (
    <StoreProvider store={store} user={user}>
      {children}
    </StoreProvider>
  );
}

function SuspendedStore({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-8">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
          <span className="text-4xl">⏸️</span>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Store Unavailable</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          This store is currently unavailable. The owner may have an expired subscription.
        </p>
        <p className="text-slate-600 text-xs font-medium">
          Please check back later.
        </p>
      </div>
    </div>
  );
}
