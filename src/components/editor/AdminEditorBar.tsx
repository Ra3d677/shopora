"use client";

import { useEditorStore } from "@/store/editor";
import { Edit3, Eye, Settings, LayoutDashboard, Save, X, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddElementMenu from "./AddElementMenu";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminEditorBar({ slug, isOwner, store }: { slug: string, isOwner: boolean, store: any }) {
  const { isEditMode, toggleEditMode, setEditMode, device, setDevice } = useEditorStore();
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const searchParams = useSearchParams();
  const isCustomerMode = searchParams.get('mode') === 'customer';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOwner || isCustomerMode || searchParams.get('preview') === 'mobile') return null;

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[1000] flex items-center gap-3 group">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl border border-white/10 hover:bg-slate-800 transition-all"
      >
        <Settings size={20} className={isExpanded ? 'rotate-90 transition-transform' : ''} />
      </button>

      {/* Expanded Bar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex flex-col items-center gap-2 shadow-2xl shadow-black/50"
          >
            {/* View Mode Controls */}
            <div className="flex flex-col gap-1 p-1 bg-white/5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setDevice('desktop')}
                className={`p-2.5 rounded-xl transition-all ${device === 'desktop' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                title="Desktop View"
              >
                <Monitor size={18} />
              </button>
              <button 
                onClick={() => setDevice('mobile')}
                className={`p-2.5 rounded-xl transition-all ${device === 'mobile' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                title="Mobile View"
              >
                <Smartphone size={18} />
              </button>
            </div>

            <div className="w-8 h-px bg-white/10 mx-auto my-1" />

            {/* Main Actions */}
            {isEditMode && (
              <>
                <AddElementMenu slug={slug} settings={store.settings || {}} />
                <button 
                  onClick={() => setEditMode(false)}
                  className="p-3 rounded-2xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all"
                  title="Exit Editor"
                >
                  <X size={18} />
                </button>
              </>
            )}

            <div className="w-8 h-px bg-white/10 mx-auto my-1" />

            {/* External Links */}
            <Link 
              href={`/store/${slug}/admin/dashboard`}
              className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all border border-white/5"
              title="Dashboard"
            >
              <LayoutDashboard size={18} />
            </Link>
            
            <Link 
              href={`/store/${slug}/admin/builder`}
              className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all border border-white/5"
              title="Full Builder"
            >
              <Settings size={18} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
