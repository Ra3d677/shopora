import { getStoreById } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  Settings, 
  PlusCircle, 
  Eye, 
  LayoutDashboard,
  ArrowUpRight
} from "lucide-react";

export default async function StoreDashboardPage({ params }: { params: { storeId: string } }) {
  const { storeId } = await params;
  const store = await getStoreById(storeId);

  if (!store) {
    notFound();
  }

  const adminPath = `/store/${store.slug}/admin`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Nav */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShoppingBag size={18} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">{store.name}</span>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-500">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href={`/store/${store.slug}`} 
            target="_blank"
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all"
          >
            View Store <ArrowUpRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome Back!</h1>
          <p className="text-slate-500">Manage your store and grow your business.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link 
            href={`${adminPath}/products`}
            className="bg-white p-8 rounded-3xl border-2 border-transparent hover:border-blue-600 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PlusCircle size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Add Products</h2>
            <p className="text-sm text-slate-500">List new items in your store and manage inventory.</p>
          </Link>

          <Link 
            href={`${adminPath}/templates`}
            className="bg-white p-8 rounded-3xl border-2 border-transparent hover:border-purple-600 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Customize Store</h2>
            <p className="text-sm text-slate-500">Change your theme, colors, and layout settings.</p>
          </Link>

          <Link 
            href={`${adminPath}/settings`}
            className="bg-white p-8 rounded-3xl border-2 border-transparent hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Settings size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Store Settings</h2>
            <p className="text-sm text-slate-500">Update store info, domains, and payment settings.</p>
          </Link>
        </div>

        {/* Store Preview Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
              Live Preview
            </div>
            <h2 className="text-3xl font-black">{store.name} is online</h2>
            <p className="text-slate-400 max-w-sm">Your store is currently using the <span className="text-white font-bold">{store.template}</span> template and is ready for customers.</p>
          </div>
          <Link 
            href={`/store/${store.slug}`}
            className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all flex items-center gap-3 whitespace-nowrap"
          >
            Visit Store Front <ArrowUpRight />
          </Link>
        </div>
      </main>
    </div>
  );
}
