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

  const isSuperAdmin = session?.role === 'superadmin' || session?.email === 'ksh128395@gmail.com';

  if (!session || !store || (!isSuperAdmin && store.ownerId !== session.id)) {
    redirect("/auth/login");
  }

  const adminPath = `/store/${slug}/admin`;

  const mainItems = [
    { label: 'Overview', iconName: 'LayoutDashboard', path: '/dashboard', color: 'text-cyan-500' },
    { label: 'Products', iconName: 'ShoppingBag', path: '/products', color: 'text-purple-500' },
    { label: 'Orders', iconName: 'Package', path: '/orders', color: 'text-pink-500' },
    { label: 'Media Hub', iconName: 'Library', path: '/media', color: 'text-amber-500' },
    { label: 'Categories', iconName: 'Tag', path: '/categories', color: 'text-green-500' },
    { label: 'Banners', iconName: 'ImageIcon', path: '/banners', color: 'text-red-500' },
  ];

  const systemItems = isSuperAdmin ? [
    { label: 'Platform Stores', iconName: 'Globe', path: '/platform-stores', color: 'text-indigo-500' },
    { label: 'Templates', iconName: 'LayoutTemplate', path: '/templates', color: 'text-fuchsia-500' },
  ] : [];

  const customItems = [
    { label: 'Store Builder', iconName: 'Blocks', path: '/builder', color: 'text-blue-500' },
    { label: 'General Settings', iconName: 'Settings', path: '/settings', color: 'text-slate-500' },
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
          className="w-80 backdrop-blur-3xl flex flex-col fixed inset-y-0 z-40 group overflow-hidden transition-colors duration-500"
          style={{
            background: 'var(--admin-sidebar-bg)',
            borderRight: '1px solid var(--admin-border)',
          }}
        >
          <div
            className="absolute inset-y-0 right-0 w-[1px]"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(6,182,212,0.2), transparent)' }}
          />
          
          <div className="p-6" style={{ borderBottom: '1px solid var(--admin-border)' }}>
            <div className="flex items-center gap-3 group/logo">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover/logo:rotate-12 transition-transform duration-500">
                <ShoppingBag className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1
                  className="text-lg font-black italic tracking-tighter uppercase leading-none"
                  style={{ color: 'var(--admin-text-primary)' }}
                >
                  Shopora
                </h1>
                <p className="text-[6px] font-black tracking-[0.4em] text-cyan-400 uppercase mt-1">Admin OS</p>
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
          className="flex-1 ml-80 flex flex-col relative overflow-hidden transition-colors duration-500"
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
                <div className="flex flex-col items-end">
                   <p
                     className="text-[10px] font-black uppercase tracking-widest mb-1"
                     style={{ color: 'var(--admin-text-muted)' }}
                   >
                     Live Endpoint
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
