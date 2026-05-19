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
  ChevronDown
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

  const adminPath = `/store/${slug}/admin`;

  const isWebsite = store.type === 'WEBSITE';

  const mainItems = isWebsite ? [
    { label: t('overview'), iconName: 'LayoutDashboard', path: '/dashboard', color: 'text-cyan-500' },
    { label: t('toursPackages'), iconName: 'ShoppingBag', path: '/products', color: 'text-purple-500' },
    { label: t('bookingInquiries'), iconName: 'Package', path: '/orders', color: 'text-pink-500' },
    { label: t('mediaHub'), iconName: 'Library', path: '/media', color: 'text-amber-500' },
    { label: t('bannersSliders'), iconName: 'ImageIcon', path: '/banners', color: 'text-red-500' },
  ] : [
    { label: t('overview'), iconName: 'LayoutDashboard', path: '/dashboard', color: 'text-cyan-500' },
    { label: t('products'), iconName: 'ShoppingBag', path: '/products', color: 'text-purple-500' },
    { label: t('orders'), iconName: 'Package', path: '/orders', color: 'text-pink-500' },
    { label: t('mediaHub'), iconName: 'Library', path: '/media', color: 'text-amber-500' },
    { label: t('categories'), iconName: 'Tag', path: '/categories', color: 'text-green-500' },
    { label: t('banners'), iconName: 'ImageIcon', path: '/banners', color: 'text-red-500' },
  ];

  const systemItems = isSuperAdmin ? [
    { label: t('platformStores'), iconName: 'Globe', path: '/platform-stores', color: 'text-indigo-500' },
    { label: t('templates'), iconName: 'LayoutTemplate', path: '/templates', color: 'text-fuchsia-500' },
  ] : [];

  const customItems = [
    { label: isWebsite ? t('siteBuilder') : t('storeBuilder'), iconName: 'Blocks', path: '/builder', color: 'text-blue-500' },
    { label: isWebsite ? t('siteSettings') : t('generalSettings'), iconName: 'Settings', path: '/settings', color: 'text-slate-500' },
  ];

  console.log("Admin Layout Session:", { id: session?.id, email: session?.email, role: session?.role });

  return (
    <AdminThemeProvider slug={slug}>
      <div
        className="flex min-h-screen font-sans selection:bg-cyan-500/30 overflow-hidden transition-colors duration-500"
        style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text-secondary)' }}
      >
        {/* Sidebar */}
        <aside
          className={`w-80 backdrop-blur-3xl flex flex-col fixed inset-y-0 z-40 group overflow-hidden transition-colors duration-500 ${isRTL ? 'right-0' : 'left-0'}`}
          style={{
            background: 'var(--admin-sidebar-bg)',
            borderRight: isRTL ? 'none' : '1px solid var(--admin-border)',
            borderLeft: isRTL ? '1px solid var(--admin-border)' : 'none',
          }}
        >
          <div
            className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-[1px]`}
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(6,182,212,0.2), transparent)' }}
          />
          
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
                <p className="text-[6px] font-black tracking-[0.4em] text-cyan-400 uppercase mt-1">Terminal Active</p>
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
            style={{ borderTop: '1px solid var(--admin-border)', background: 'rgba(0,0,0,0.1)' }}
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
                        Uplink Active
                      </p>
                   </div>
                </div>
             </div>
             <div className="flex gap-1.5">
                <Link
                  href={`/store/${slug}`}
                  target="_blank"
                  title="View Store"
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all group/btn hover:text-cyan-400"
                  style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}
                >
                  <ExternalLink size={10} className="group-hover/btn:scale-110 transition-transform" />
                </Link>
                <form action={logoutUser} className="flex-1">
                  <button
                    type="submit"
                    title="Logout"
                    className="w-full flex items-center justify-center py-1.5 rounded-lg transition-all group/btn hover:text-red-400"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}
                  >
                    <LogOut size={10} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </form>
             </div>
          </div>
        </aside>

        <main
          className={`flex-1 ${isRTL ? 'mr-80' : 'ml-80'} flex flex-col relative overflow-hidden transition-colors duration-500`}
          style={{ backgroundColor: 'var(--admin-bg)' }}
        >
          {/* Background Decorations */}
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] blur-[150px] -z-10 rounded-full pointer-events-none"
            style={{ background: 'var(--admin-glow-cyan)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] blur-[150px] -z-10 rounded-full pointer-events-none"
            style={{ background: 'var(--admin-glow-pink)' }}
          />
          
          {/* Header */}
          <header
            className="h-24 flex items-center justify-between px-12 backdrop-blur-md z-30 sticky top-0 transition-colors duration-500"
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
                   <span>Terminal</span>
                   <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                   <span className="text-cyan-400 italic">{(store.name || 'Store').toUpperCase()}</span>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className={`flex flex-col ${isRTL ? 'items-start' : 'items-end'}`}>
                   <p
                     className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isRTL ? 'font-arabic' : ''}`}
                     style={{ color: 'var(--admin-text-muted)' }}
                   >
                     {isRTL ? "النطاق المباشر" : "Live Endpoint"}
                   </p>
                   <Link
                     href={`/store/${slug}`}
                     target="_blank"
                     className={`text-xs font-black hover:text-cyan-400 transition-colors uppercase italic flex items-center gap-2 ${isRTL ? 'font-arabic' : ''}`}
                     style={{ color: 'var(--admin-text-primary)' }}
                   >
                      {slug}.shopora.app <ExternalLink className="w-3 h-3" />
                   </Link>
                </div>
                <div className="w-[1px] h-10" style={{ background: 'var(--admin-border)' }} />
                <LanguageToggle />
                <div className="w-[1px] h-10" style={{ background: 'var(--admin-border)' }} />
                {/* Dark / Light Mode Toggle */}
                <AdminThemeToggle />
             </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-12 relative">
            {children}
          </div>
        </main>
      </div>
    </AdminThemeProvider>
  );
}
