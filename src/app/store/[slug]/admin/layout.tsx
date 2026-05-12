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
    <div className="flex min-h-screen bg-[#0f111a] font-sans selection:bg-cyan-500/30 text-slate-200">
      {/* Sidebar - Enhanced Premium Glassmorphism */}
      <aside className="w-72 bg-[#0b0d15]/80 backdrop-blur-3xl text-slate-300 flex flex-col fixed inset-y-0 border-r border-white/[0.03] z-40 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-white/[0.03] flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] rotate-3 group hover:rotate-0 transition-transform duration-500">
              <ShoppingBag size={24} className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
            </div>
            <div>
              <span className="font-black text-white tracking-tighter text-xl italic uppercase block leading-none">Shopora</span>
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em] block mt-1.5 opacity-80">Pro Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Main Analytics</span>
          </div>
          {[
            { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', color: 'from-cyan-400 to-blue-500', textColor: 'text-cyan-400' },
            { label: 'Products', icon: ShoppingBag, path: '/products', color: 'from-purple-400 to-pink-500', textColor: 'text-purple-400' },
            { label: 'Orders', icon: Package, path: '/orders', color: 'from-pink-400 to-red-500', textColor: 'text-pink-400' },
            { label: 'Media Hub', icon: Library, path: '/media', color: 'from-amber-400 to-orange-500', textColor: 'text-amber-400' },
            { label: 'Categories', icon: Tag, path: '/categories', color: 'from-green-400 to-emerald-500', textColor: 'text-green-400' },
            { label: 'Banners', icon: ImageIcon, path: '/banners', color: 'from-red-400 to-rose-500', textColor: 'text-red-400' },
          ].map((item) => (
            <Link 
              key={item.label}
              href={`${adminPath}${item.path}`} 
              className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/[0.05] transition-all group relative overflow-hidden"
            >
              <div className={`absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b ${item.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-full`}></div>
              <item.icon className={`w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all text-white`} />
              <span className={`font-black text-[11px] uppercase tracking-widest text-slate-300 group-hover:${item.textColor} transition-colors`}>{item.label}</span>
              <div className={`absolute right-4 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-100 transition-all scale-100`}></div>
            </Link>
          ))}

          {/* SENSITIVE SECTION: MASTER CONTROL */}
          {session.email === 'ksh128395@gmail.com' && (
            <>
              <div className="my-8 border-t border-white/[0.03] pt-8 px-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Master Engine</span>
              </div>
              <Link href={`${adminPath}/platform-stores`} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/[0.03] transition-all group border border-white/[0.02] bg-white/[0.01]">
                <Globe className="w-5 h-5 text-indigo-400 opacity-50 group-hover:opacity-100" />
                <span className="font-black text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-white">Global Nodes</span>
              </Link>
              <Link href={`${adminPath}/templates`} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/[0.03] transition-all group border border-white/[0.02] bg-white/[0.01] mt-3">
                <LayoutTemplate className="w-5 h-5 text-fuchsia-400 opacity-50 group-hover:opacity-100" />
                <span className="font-black text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-white">Design Systems</span>
              </Link>
            </>
          )}

          <div className="my-8 border-t border-white/[0.03] pt-8 px-4">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Infrastructure</span>
          </div>

          <Link href={`${adminPath}/settings`} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/[0.03] transition-all group">
            <Settings className="w-5 h-5 text-slate-500 opacity-50 group-hover:opacity-100" />
            <span className="font-black text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-white">Core Settings</span>
          </Link>
          
          <Link href={`${adminPath}/builder`} className="flex items-center gap-5 px-6 py-5 rounded-[2rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all group mt-8 shadow-[0_10px_30px_rgba(6,182,212,0.2)]">
            <Blocks className="w-6 h-6 text-white animate-bounce" />
            <div className="flex flex-col">
              <span className="font-black text-[10px] uppercase tracking-[0.2em] text-white/70 leading-none mb-1">Visual Editor</span>
              <span className="font-black text-sm uppercase tracking-tighter text-white italic leading-none">Store Builder</span>
            </div>
          </Link>
        </nav>

        <div className="p-8 border-t border-white/[0.03] bg-gradient-to-t from-white/[0.02] to-transparent space-y-6">
          <div className="flex items-center gap-4 px-2">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 flex items-center justify-center text-cyan-400 text-lg font-black uppercase shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {session.email[0]}
             </div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">{session.email.split('@')[0]}</span>
               <span className="text-[9px] text-cyan-400/60 font-black uppercase tracking-[0.2em]">Store Architect</span>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href={`/store/${slug}`} target="_blank" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/[0.05] group">
              <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
            </Link>
            <form action={logoutUser} className="w-full">
              <button type="submit" className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/10 group">
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content - Improved with dynamic background elements */}
      <main className="flex-1 ml-72 p-0 min-h-screen relative overflow-x-hidden">
        {/* Global Top Bar - Premium Minimalist */}
        <header className="sticky top-0 z-30 w-full bg-[#0f111a]/60 backdrop-blur-2xl border-b border-white/[0.03] px-12 py-6 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">System Ready</span>
              </div>
              <div className="h-6 w-[1px] bg-white/[0.05]"></div>
              <span className="text-sm font-black text-white italic tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{store.name}</span>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 bg-white/[0.02] px-5 py-2.5 rounded-full border border-white/[0.05] shadow-inner">
                 <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
                 <span className="text-[10px] font-black text-cyan-400 italic tracking-widest">PRO EDITION</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/[0.1] bg-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                 <Settings size={18} />
              </div>
           </div>
        </header>

        <div className="relative z-10 min-h-[calc(100vh-80px)]">
          {children}
        </div>

        {/* Global Background Glows - Adjusted for better depth */}
        <div className="fixed top-[-10%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/10 blur-[180px] -z-10 animate-pulse pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-600/5 blur-[150px] -z-10 pointer-events-none"></div>
        <div className="fixed top-[40%] left-[-5%] w-[400px] h-[400px] bg-blue-600/5 blur-[120px] -z-10 pointer-events-none"></div>
      </main>
    </div>
  );
}
