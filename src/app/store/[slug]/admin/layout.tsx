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
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-slate-600 flex flex-col fixed inset-y-0 border-r border-slate-200 z-40 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <ShoppingBag size={20} />
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight text-lg block leading-none">Shopora</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Control Center</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-2 px-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Menu</span>
          </div>
          {[
            { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', color: 'text-blue-600' },
            { label: 'Products', icon: ShoppingBag, path: '/products', color: 'text-purple-600' },
            { label: 'Orders', icon: Package, path: '/orders', color: 'text-pink-600' },
            { label: 'Media Hub', icon: Library, path: '/media', color: 'text-amber-600' },
            { label: 'Categories', icon: Tag, path: '/categories', color: 'text-green-600' },
            { label: 'Banners', icon: ImageIcon, path: '/banners', color: 'text-red-600' },
          ].map((item) => (
            <Link 
              key={item.label}
              href={`${adminPath}${item.path}`} 
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all group"
            >
              <item.icon className={`w-5 h-5 ${item.color} opacity-70 group-hover:opacity-100 transition-all`} />
              <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
            </Link>
          ))}

          {session.email === 'ksh128395@gmail.com' && (
            <>
              <div className="my-6 border-t border-slate-100 pt-6 px-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Admin</span>
              </div>
              <Link href={`${adminPath}/platform-stores`} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all group">
                <Globe className="w-5 h-5 text-indigo-500 opacity-70 group-hover:opacity-100" />
                <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">Platform Stores</span>
              </Link>
              <Link href={`${adminPath}/templates`} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all group">
                <LayoutTemplate className="w-5 h-5 text-fuchsia-500 opacity-70 group-hover:opacity-100" />
                <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">Templates</span>
              </Link>
            </>
          )}

          <div className="my-6 border-t border-slate-100 pt-6 px-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Settings</span>
          </div>
          <Link href={`${adminPath}/builder`} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <Blocks className="w-5 h-5 text-blue-600 opacity-70 group-hover:opacity-100" />
            <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">Store Builder</span>
          </Link>
          <Link href={`${adminPath}/settings`} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <Settings className="w-5 h-5 text-slate-500 opacity-70 group-hover:opacity-100" />
            <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900">General Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
              {session.email[0]}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-slate-900 truncate">{session.email.split('@')[0]}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Administrator</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/store/${slug}`} target="_blank" className="flex-1 flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all">
              <Globe size={16} />
            </Link>
            <form action={logoutUser} className="flex-1">
              <button type="submit" className="w-full flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-600 transition-all">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{store.name}</h2>
          </div>
          <div className="flex items-center gap-4">
             <Link href={`${adminPath}/settings`} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-slate-100">
                <Settings size={18} />
             </Link>
          </div>
        </header>

        <div className="p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
