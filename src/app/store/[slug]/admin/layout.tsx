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

  const isSuperAdmin = session?.role === 'superadmin' || session?.email === 'DJ@Gmail.com';

  if (!session || !store || (!isSuperAdmin && store.ownerId !== session.id)) {
    redirect("/auth/login");
  }

  const adminPath = `/store/${slug}/admin`;

  console.log("Admin Layout Session:", { id: session?.id, email: session?.email, role: session?.role });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <ShoppingBag size={18} />
            </div>
            <span className="font-bold text-white tracking-tight">Admin Console</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          <Link href={`${adminPath}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <LayoutDashboard className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href={`${adminPath}/products`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <ShoppingBag className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium text-sm">Products</span>
          </Link>
          <Link href={`${adminPath}/orders`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <Package className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium text-sm">Orders</span>
          </Link>
          <Link href={`${adminPath}/media`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <Library className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium text-sm">Media Library</span>
          </Link>
          <Link href={`${adminPath}/categories`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <Tag className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium text-sm">Categories</span>
          </Link>
          <Link href={`${adminPath}/banners`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <ImageIcon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium text-sm">Banners</span>
          </Link>

          {/* SENSITIVE SECTION: ONLY FOR DJ@GMAIL.COM */}
          {session.email === 'DJ@Gmail.com' && (
            <>
              <div className="my-3 border-t border-white/5 pt-3 px-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Platform Owner</span>
              </div>
              <Link href={`${adminPath}/platform-stores`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <Globe className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                <span className="font-medium text-sm">All Stores</span>
              </Link>
              <Link href={`${adminPath}/templates`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <LayoutTemplate className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                <span className="font-medium text-sm">Templates</span>
              </Link>
            </>
          )}

          <Link href={`${adminPath}/colors`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <Palette className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium text-sm">Colors</span>
          </Link>
          <Link href={`${adminPath}/settings`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <Settings className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <Link href={`${adminPath}/builder`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
            <Blocks className="w-5 h-5 opacity-70 group-hover:opacity-100 text-blue-400" />
            <span className="font-medium text-sm text-blue-400">Store Builder</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-1 mt-auto">
          <div className="px-4 py-2 mb-1 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-lg shadow-blue-900/20">
               {session.email[0]}
             </div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-[11px] font-bold text-white truncate">{session.email}</span>
               {session.email === 'DJ@Gmail.com' && (
                 <span className="text-[9px] text-blue-400 font-black uppercase tracking-tighter">Super Admin</span>
               )}
             </div>
          </div>
          
          <Link href={`/store/${slug}`} target="_blank" className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
            <Globe className="w-4 h-4 opacity-70 group-hover:opacity-100 text-blue-400" />
            <span className="text-xs font-bold">Visit My Store</span>
          </Link>
          
          <form action={logoutUser}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group">
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-bold">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-0 min-h-screen">
        {/* Global Top Bar */}
        <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Current Store:</span>
              <span className="text-sm font-bold text-slate-900 italic tracking-tight">{store.name}</span>
           </div>
           
           <div className="flex items-center gap-3">
              {/* Clean header - actions moved to sidebar */}
           </div>
        </header>

        <div className="p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
