import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Settings, 
  LayoutTemplate, 
  LogOut, 
  Image as ImageIcon,
  ChevronLeft,
  Palette,
  Globe,
  Package,
  Library,
  Blocks
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getStoreBySlug } from "@/lib/data";
import { redirect } from "next/navigation";
import { logoutUser } from "@/app/auth/actions";

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

  console.log("Admin Layout Session:", { id: session?.id, email: session?.email, role: session?.role });

  return (
    <div className="flex min-h-screen bg-[#0f111a] font-sans selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f111a] text-slate-300 flex flex-col fixed inset-y-0 border-r border-white/5 z-40 shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#1a1d2d]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <ShoppingBag size={20} className="drop-shadow-lg" />
            </div>
            <div>
              <span className="font-black text-white tracking-tighter text-lg italic uppercase block leading-none">Admin</span>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] block mt-1">Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'text-cyan-400' },
            { label: 'Products', icon: ShoppingBag, path: '/products', color: 'text-purple-400' },
            { label: 'Orders', icon: Package, path: '/orders', color: 'text-pink-400' },
            { label: 'Media Library', icon: ImageIcon, path: '/media', color: 'text-amber-400' },
            { label: 'Categories', icon: Tag, path: '/categories', color: 'text-green-400' },
            { label: 'Banners', icon: ImageIcon, path: '/banners', color: 'text-red-400' },
          ].map((item) => (
            <Link 
              key={item.label}
              href={`${adminPath}${item.path}`} 
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-[#1a1d2d] transition-all group relative overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <item.icon className={`w-5 h-5 ${item.color} opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
              <span className="font-black text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
            </Link>
          ))}

          {/* SENSITIVE SECTION: ONLY FOR DJ@GMAIL.COM */}
          {session.email === 'ksh128395@gmail.com' && (
            <>
              <div className="my-6 border-t border-white/5 pt-6 px-4">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Platform Master</span>
              </div>
              <Link href={`${adminPath}/platform-stores`} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-[#1a1d2d] transition-all group border border-dashed border-white/5">
                <Globe className="w-5 h-5 text-indigo-400 opacity-70 group-hover:opacity-100" />
                <span className="font-black text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-white">All Stores</span>
              </Link>
              <Link href={`${adminPath}/templates`} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-[#1a1d2d] transition-all group border border-dashed border-white/5 mt-2">
                <LayoutTemplate className="w-5 h-5 text-fuchsia-400 opacity-70 group-hover:opacity-100" />
                <span className="font-black text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-white">Templates</span>
              </Link>
            </>
          )}

          <div className="my-6 border-t border-white/5 pt-6 px-4">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Management</span>
          </div>

          <Link href={`${adminPath}/settings`} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-[#1a1d2d] transition-all group">
            <Settings className="w-5 h-5 text-slate-400 opacity-70 group-hover:opacity-100" />
            <span className="font-black text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-white">Settings</span>
          </Link>
          
          <Link href={`${adminPath}/builder`} className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 hover:border-cyan-500/50 transition-all group mt-4 shadow-lg shadow-cyan-500/5">
            <Blocks className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="font-black text-xs uppercase tracking-tighter text-cyan-400 italic">Open Builder</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#1a1d2d]/30 space-y-4">
          <div className="flex items-center gap-4 px-2">
             <div className="w-10 h-10 rounded-2xl bg-[#0f111a] border border-white/10 flex items-center justify-center text-cyan-400 text-sm font-black uppercase shadow-xl">
               {session.email[0]}
             </div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-[10px] font-black text-white truncate uppercase tracking-tight">{session.email.split('@')[0]}</span>
               <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Store Owner</span>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Link href={`/store/${slug}`} target="_blank" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
            <form action={logoutUser} className="w-full">
              <button type="submit" className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/10">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-0 min-h-screen relative">
        {/* Global Top Bar - Transparent & Integrated */}
        <header className="sticky top-0 z-30 w-full bg-[#0f111a]/80 backdrop-blur-xl border-b border-white/5 px-10 py-5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Active Node:</span>
              <span className="text-sm font-black text-white italic tracking-widest uppercase">{store.name}</span>
           </div>
           
           <div className="flex items-center gap-6">
              {/* Notifications or search could go here */}
              <div className="flex items-center gap-2 bg-[#1a1d2d] px-4 py-2 rounded-xl border border-white/5">
                 <span className="text-[10px] font-black text-cyan-400 italic">v2.0.4</span>
              </div>
           </div>
        </header>

        <div className="relative z-10">
          {children}
        </div>

        {/* Global Background Glows */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] -z-10 pointer-events-none"></div>
        <div className="fixed bottom-0 left-72 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] -z-10 pointer-events-none"></div>
      </main>
    </div>
  );
}
