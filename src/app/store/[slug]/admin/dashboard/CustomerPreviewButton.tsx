"use client";

import { Eye, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

export default function CustomerPreviewButton({ slug }: { slug: string }) {
  const openPreview = () => {
    window.open(`/store/${slug}?mode=customer`, '_blank');
  };

  return (
    <button
      onClick={openPreview}
      className="flex items-center gap-3 bg-gradient-to-r from-[#1a1d2d] to-[#0f111a] hover:from-cyan-500/10 hover:to-blue-500/10 text-slate-400 hover:text-cyan-400 px-8 py-3.5 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-[0.98] shadow-2xl group"
    >
      <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" /> Experience Customer Journey <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
