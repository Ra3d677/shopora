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
      className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
    >
      <Eye className="w-4 h-4" /> Experience Customer Journey <ExternalLink className="w-3 h-3 opacity-50" />
    </button>
  );
}
