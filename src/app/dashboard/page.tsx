import { getUserStore, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Store } from "lucide-react";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) {
    redirect("/auth/login");
  }

  const store = await getUserStore();

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6">
          <Store size={40} />
        </div>
        <h1 className="text-3xl font-black mb-2">Welcome, {user.name}</h1>
        <p className="text-slate-500 mb-8 max-w-md">You don't have a store yet. Launch your business today in just a few clicks.</p>
        <Link 
          href="/create-store" 
          className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20"
        >
          <Plus /> Create Your Store
        </Link>
      </div>
    );
  }

  // Redirect to the existing admin panel
  // For the foundation, we'll use /admin but we need it to be tenant-aware.
  // Actually, I'll redirect to /store/[slug]/admin to keep it separated.
  redirect(`/store/${store.slug}/admin/dashboard`);
}
