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
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', color: 'text-cyan-500' },
    { label: 'Products', icon: ShoppingBag, path: '/products', color: 'text-purple-500' },
    { label: 'Orders', icon: Package, path: '/orders', color: 'text-pink-500' },
    { label: 'Media Hub', icon: Library, path: '/media', color: 'text-amber-500' },
    { label: 'Categories', icon: Tag, path: '/categories', color: 'text-green-500' },
    { label: 'Banners', icon: ImageIcon, path: '/banners', color: 'text-red-500' },
  ];

  const systemItems = isSuperAdmin ? [
    { label: 'Platform Stores', icon: Globe, path: '/platform-stores', color: 'text-indigo-500' },
    { label: 'Templates', icon: LayoutTemplate, path: '/templates', color: 'text-fuchsia-500' },
  ] : [];

  const customItems = [
    { label: 'Store Builder', icon: Blocks, path: '/builder', color: 'text-blue-500' },
    { label: 'General Settings', icon: Settings, path: '/settings', color: 'text-slate-500' },
  ];

  console.log("Admin Layout Session:", { id: session?.id, email: session?.email, role: session?.role });

  return (
    <div className="flex min-h-screen bg-[#0a0c14] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Sidebar - Premium Glassmorphic */}
      <aside className="w-80 bg-[#0f111a]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col fixed inset-y-0 z-40 group overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
        
        <div className="p-10 border-b border-white/[0.03]">
          <div className="flex items-center gap-4 group/logo">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover/logo:rotate-12 transition-transform duration-500">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">Shopora</h1>
              <p className="text-[8px] font-black tracking-[0.4em] text-cyan-400 uppercase mt-1">Admin OS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <SidebarNav 
            items={mainItems} 
            adminPath={adminPath} 
            systemItems={systemItems}
            customItems={customItems}
          />
        </nav>

        <div className="p-8 border-t border-white/[0.05] bg-black/20">
           <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white font-black italic shadow-lg shadow-pink-500/10">{(session.email?.[0] || 'A').toUpperCase()}</div>
              <div className="overflow-hidden">
                 <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{session.email?.split('@')[0] || 'Admin'}</p>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Uplink Active</p>
                 </div>
              </div>
           </div>
           <div className="flex gap-2">
              <Link href={`/store/${slug}`} target="_blank" className="flex-1 flex items-center justify-center py-3 rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <ExternalLink size={14} />
              </Link>
              <form action={logoutUser} className="flex-1">
                <button type="submit" className="w-full flex items-center justify-center py-3 rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-red-500 hover:border-red-500/30 transition-all">
                  <LogOut size={14} />
                </button>
              </form>
           </div>
        </div>
      </aside>

      <main className="flex-1 ml-80 flex flex-col relative overflow-hidden bg-[#0a0c14]">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/5 blur-[150px] -z-10 rounded-full"></div>
        
        {/* Header - Transparent High End */}
        <header className="h-24 border-b border-white/[0.05] flex items-center justify-between px-12 backdrop-blur-md bg-[#0a0c14]/50 z-30 sticky top-0">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                 <span>Terminal</span>
                 <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                 <span className="text-cyan-400 italic">{(store.name || 'Store').toUpperCase()}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Live Endpoint</p>
                 <Link href={`/store/${slug}`} target="_blank" className="text-xs font-black text-white hover:text-cyan-400 transition-colors uppercase italic flex items-center gap-2">
                    {slug}.shopora.app <ExternalLink className="w-3 h-3" />
                 </Link>
              </div>
              <div className="w-[1px] h-10 bg-white/5"></div>
              <button className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all group">
                 <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-700" />
              </button>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-12 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
