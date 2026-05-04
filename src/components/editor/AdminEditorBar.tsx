"use client";

import { useEditorStore } from "@/store/editor";
import { Edit3, Eye, Settings, LayoutDashboard, Save, X, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddElementMenu from "./AddElementMenu";

export default function AdminEditorBar({ slug, isOwner, store }: { slug: string, isOwner: boolean, store: any }) {
  const { isEditMode, toggleEditMode, setEditMode, device, setDevice } = useEditorStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCustomerMode = searchParams.get('mode') === 'customer';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOwner || isCustomerMode) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] bg-slate-900 text-white flex items-center justify-between px-6 py-2 shadow-2xl border-b border-white/10 backdrop-blur-md bg-slate-900/90">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Live Editor</span>
        </div>
        
        <div className="h-4 w-px bg-white/10 mx-2" />
        
        <button 
          onClick={toggleEditMode}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isEditMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
        >
          {isEditMode ? <><Save size={14} /> Saving Mode On</> : <><Edit3 size={14} /> Start Editing</>}
        </button>

        {isEditMode && (
          <div className="flex items-center gap-3">
            <div className="h-4 w-px bg-white/10 mx-1" />
            <AddElementMenu slug={slug} settings={store.settings || {}} />
            <button 
              onClick={() => setEditMode(false)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all"
            >
              <X size={14} /> Exit Editor
            </button>
          </div>
        )}
        
        <div className="h-4 w-px bg-white/10 mx-2" />
        
        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
          <button 
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-full transition-all ${device === 'desktop' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button 
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-full transition-all ${device === 'mobile' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href={`/store/${slug}/admin/dashboard`}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 text-slate-300 hover:bg-white/10 transition-all border border-white/5"
        >
          <LayoutDashboard size={14} /> Dashboard
        </Link>
        <Link 
          href={`/store/${slug}/admin/builder`}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-slate-900 hover:bg-slate-200 transition-all"
        >
          <Settings size={14} /> Full Builder
        </Link>
      </div>
    </div>
  );
}
