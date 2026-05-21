"use client";

import { LogOut } from "lucide-react";
import { logoutCustomer } from "@/app/store/actions";
import { useLanguageStore } from "@/store/language";

export default function LogoutButton({ slug }: { slug: string }) {
  const { t } = useLanguageStore();
  return (
    <button 
      onClick={() => logoutCustomer(slug)}
      className="flex items-center gap-2 px-6 py-3 border-2 border-slate-900 rounded-full text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all shadow-lg shadow-slate-200"
    >
      <LogOut className="w-4 h-4" /> {t('signOut')}
    </button>
  );
}
