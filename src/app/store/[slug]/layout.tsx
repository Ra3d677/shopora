import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { getSession } from "@/lib/auth";
import { getLang } from "@/lib/i18n";
import { Metadata } from "next";
import { checkAndSuspendExpiredTrial, checkAndSuspendExpiredSubscription } from "@/lib/data";
import { prisma } from "@/lib/prisma";

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
  await checkAndSuspendExpiredSubscription(store.id);

  // Direct DB query to bypass cache after suspension check
  const freshStore = await prisma.store.findUnique({
    where: { slug },
    select: { status: true, trialEndsAt: true },
  });
  const currentStatus = freshStore?.status || store.status;
  const currentTrialEndsAt = freshStore?.trialEndsAt || store.trialEndsAt;
  const isOwner = user?.id === store.ownerId;

  if (currentStatus === "suspended") {
    return (
      <StoreProvider store={store} user={user}>
        <SuspendedStore slug={slug} isOwner={isOwner} />
      </StoreProvider>
    );
  }

  return (
    <StoreProvider store={store} user={user}>
      {children}
    </StoreProvider>
  );
}

function SuspendedStore({ slug, isOwner }: { slug: string; isOwner: boolean }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-8">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
          <span className="text-4xl">⏸️</span>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">المتجر غير متاح</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          {isOwner
            ? "تم تعليق متجرك لأن الاشتراك انتهى. اختر باقة وأعد التفعيل."
            : "هذا المتجر غير متاح حالياً. صاحب المتجر قد يكون لديه اشتراك منتهي."}
        </p>
        {isOwner ? (
          <Link
            href={`/store/${slug}/admin/reactivate`}
            className="inline-block bg-cyan-500 text-black h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all shadow-2xl"
          >
            إعادة التفعيل
          </Link>
        ) : (
          <p className="text-slate-600 text-xs font-medium">
            يرجى المحاولة لاحقاً
          </p>
        )}
      </div>
    </div>
  );
}
