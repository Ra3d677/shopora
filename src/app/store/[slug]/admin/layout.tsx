import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Settings, 
  LayoutTemplate, 
  LogOut, 
  Image as  ImageIcon,
  ChevronLeft,
  Palette,
  Globe,
  Package,
  Library,
  Blocks,
  ExternalLink,
  ChevronDown,
  Bell,
  Users,
  AlertTriangle,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getStoreBySlug } from "@/lib/data";
import { redirect } from "next/navigation";
import { logoutUser } from "@/app/auth/actions";
import SidebarNav from "./SidebarNav";
import { AdminThemeProvider } from "./AdminThemeProvider";
import AdminThemeToggle from "./AdminThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { getTranslation, getLang } from "@/lib/i18n";
import AdminShell from "./AdminShell";
import NotificationsBell from "./NotificationsBell";
import { checkAndSuspendExpiredTrial, checkAndSuspendExpiredSubscription } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();
  const store = await getStoreBySlug(slug);
  const t = await getTranslation();
  const lang = await getLang();
  const isRTL = lang === 'ar';

  const isSuperAdmin = session?.role === 'superadmin' || session?.email === 'ksh128395@gmail.com';

  if (!session || !store || (!isSuperAdmin && store.ownerId !== session.id)) {
    redirect("/auth/login");
  }

  await checkAndSuspendExpiredTrial(store.id);
  await checkAndSuspendExpiredSubscription(store.id);

  // Get fresh status after suspension check
  const freshStore = await prisma.store.findUnique({
    where: { slug },
    select: { status: true },
  });
  const currentStatus = freshStore?.status || store.status;
  const isSuspended = currentStatus === "suspended";

  const adminPath = `/store/${slug}/admin`;

  const isWebsite = store.type === 'WEBSITE';

  const isFitness = store.template === 'fitness';
  const isDDDYOU = store.template === 'dddyou';

  const mainItems = isWebsite ? [
    { label: t('overview'), iconName: 'LayoutDashboard', path: '/dashboard', color: 'text-cyan-500' },
    ...(isFitness ? [{ label: isRTL ? 'لوحة تحكم برعي' : 'برعي Dashboard', iconName: 'LayoutDashboard' as const, path: '/fitness', color: 'text-emerald-500' }] : []),
    { label: t('toursPackages'), iconName: 'ShoppingBag', path: '/products', color: 'text-purple-500' },
    { label: t('bookingInquiries'), iconName: 'Package', path: '/orders', color: 'text-pink-500' },
    { label: t('mediaHub'), iconName: 'Library', path: '/media', color: 'text-amber-500' },
    { label: t('bannersSliders'), iconName: 'ImageIcon', path: '/banners', color: 'text-red-500' },
  ] : [
    { label: t('overview'), iconName: 'LayoutDashboard', path: '/dashboard', color: 'text-cyan-500' },
    { label: t('products'), iconName: 'ShoppingBag', path: '/products', color: 'text-purple-500' },
    { label: t('orders'), iconName: 'Package', path: '/orders', color: 'text-pink-500' },
    { label: t('customers'), iconName: 'Users', path: '/customers', color: 'text-cyan-500' },
    { label: t('mediaHub'), iconName: 'Library', path: '/media', color: 'text-amber-500' },
    { label: t('categories'), iconName: 'Tag', path: '/categories', color: 'text-green-500' },
    { label: t('coupons'), iconName: 'Tag', path: '/coupons', color: 'text-yellow-500' },
    { label: t('banners'), iconName: 'ImageIcon', path: '/banners', color: 'text-red-500' },
    { label: 'Blog', iconName: 'Library', path: '/blog', color: 'text-emerald-500' },
    ...(isDDDYOU ? [{ label: isRTL ? 'لوحة تحكم DDDYOU' : 'DDDYOU Dashboard', iconName: 'LayoutDashboard' as const, path: '/dddyou', color: 'text-amber-500' }] : []),
  ];

  const systemItems = isSuperAdmin ? [
    { label: t('platformStores'), iconName: 'Globe', path: '/platform-stores', color: 'text-indigo-500' },
    { label: t('templates'), iconName: 'LayoutTemplate', path: '/templates', color: 'text-fuchsia-500' },
    { label: isRTL ? 'طلبات التفعيل' : 'Activation Requests', iconName: 'Users', path: '/admin/stores/requests', color: 'text-amber-500' },
  ] : [];

  const customItems = [
    { label: isWebsite ? t('siteBuilder') : t('storeBuilder'), iconName: 'Blocks', path: '/builder', color: 'text-blue-500' },
    { label: isWebsite ? t('siteSettings') : t('generalSettings'), iconName: 'Settings', path: '/settings', color: 'text-slate-500' },
  ];

  const sidebar = (
    <>
      <div className="p-6" style={{ borderBottom: '1px solid var(--admin-border)' }}>
        <div className="flex items-center gap-3 group/logo">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)] group-hover/logo:rotate-12 transition-all duration-500 overflow-hidden border border-white/5">
            {((store.settings as any)?.faviconUrl || (store.settings as any)?.logoUrl) ? (
              <img 
                src={(store.settings as any).faviconUrl || (store.settings as any).logoUrl} 
                alt={store.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div className="overflow-hidden">
            <h1
              className="text-lg font-black italic tracking-tighter uppercase leading-none truncate"
              style={{ color: 'var(--admin-text-primary)' }}
            >
              {store.name}
            </h1>
            <p className="text-[6px] font-black tracking-[0.4em] text-cyan-400 uppercase mt-1">{isRTL ? "المنصة نشطة" : "Terminal Active"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-5 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <SidebarNav 
          items={mainItems} 
          adminPath={adminPath} 
          systemItems={systemItems}
          customItems={customItems}
        />
      </nav>

      <div
        className="p-5"
        style={{ borderTop: '1px solid var(--admin-border)', background: 'var(--admin-card-bg-darker)' }}
      >
        <div
          className="flex items-center gap-3 p-2 rounded-xl mb-2.5"
          style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)' }}
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white text-[9px] font-black italic shadow-lg shadow-pink-500/10">{(session.email?.[0] || 'A').toUpperCase()}</div>
          <div className="overflow-hidden">
            <p
              className="text-[7px] font-black uppercase tracking-tighter truncate leading-none"
              style={{ color: 'var(--admin-text-primary)' }}
            >
              {session.email?.split('@')[0] || 'Admin'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-0.5 h-0.5 rounded-full bg-green-500 animate-pulse"></div>
              <p
                className="text-[5px] font-black uppercase tracking-widest leading-none"
                style={{ color: 'var(--admin-text-muted)' }}
              >
                {isRTL ? "الاتصال نشط" : "Uplink Active"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Link
            href={`/store/${slug}`}
            target="_blank"
            title={isRTL ? "عرض المتجر" : "View Store"}
            className="flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all group/btn hover:text-cyan-400"
            style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}
          >
            <ExternalLink size={10} className="group-hover/btn:scale-110 transition-transform" />
          </Link>
          <form action={logoutUser} className="flex-1">
            <button
              type="submit"
              title={isRTL ? "تسجيل الخروج" : "Logout"}
              className="w-full flex items-center justify-center py-1.5 rounded-lg transition-all group/btn hover:text-red-400"
              style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}
            >
              <LogOut size={10} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </>
  );

  const header = (
    <>
      {isSuspended && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 md:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-amber-400 text-[10px] font-black uppercase tracking-wider">
              {isRTL ? "المتجر معلق — الاشتراك منتهي" : "STORE SUSPENDED — SUBSCRIPTION EXPIRED"}
            </p>
          </div>
          <Link
            href={`/reactivate/${slug}`}
            className="bg-amber-500 text-black px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-amber-400 transition-all"
          >
            {isRTL ? "إعادة التفعيل" : "REACTIVATE"}
          </Link>
        </div>
      )}
      <header
        className="h-24 flex items-center justify-between px-4 md:px-12 backdrop-blur-md z-30 sticky top-0 transition-colors duration-500"
        style={{
          background: 'var(--admin-header-bg)',
          borderBottom: '1px solid var(--admin-border)',
        }}
      >
      <div className="flex items-center gap-6">
        <div
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]"
          style={{ color: 'var(--admin-text-muted)' }}
        >
          <span>{isRTL ? "المنصة" : "Terminal"}</span>
          <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
          <span className="text-cyan-400 italic hidden sm:inline">{(store.name || 'Store').toUpperCase()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <NotificationsBell slug={slug} />
        <div className="w-[1px] h-10 hidden md:block" style={{ background: 'var(--admin-border)' }} />
        <div className="hidden md:flex flex-col items-end">
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-1"
            style={{ color: 'var(--admin-text-muted)' }}
          >
            {isRTL ? "النطاق المباشر" : "Live Endpoint"}
          </p>
          <Link
            href={`/store/${slug}`}
            target="_blank"
            className="text-xs font-black hover:text-cyan-400 transition-colors uppercase italic flex items-center gap-2"
            style={{ color: 'var(--admin-text-primary)' }}
          >
            {slug}.shopora.app <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="w-[1px] h-10" style={{ background: 'var(--admin-border)' }} />
        <LanguageToggle />
        <div className="w-[1px] h-10 hidden md:block" style={{ background: 'var(--admin-border)' }} />
        <AdminThemeToggle />
      </div>
    </header>
    </>
  );

  return (
    <AdminThemeProvider slug={slug}>
      <AdminShell sidebar={sidebar} header={header} isRTL={isRTL}>
        {children}
      </AdminShell>
    </AdminThemeProvider>
  );
}
