"use client";

import { useEditorStore } from "@/store/editor";
import { ReactNode } from "react";

export default function PreviewWrapper({ children, isOwner }: { children: ReactNode, isOwner: boolean }) {
  const { device } = useEditorStore();

  if (!isOwner || device === 'desktop') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center py-12 transition-all duration-500 overflow-x-hidden">
      <div className="relative w-[375px] h-[812px] bg-white shadow-2xl rounded-[3rem] border-[8px] border-slate-800 overflow-hidden flex flex-col">
        {/* iPhone Style Notch/Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-800 rounded-b-3xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-700 rounded-full" />
        </div>
        
        {/* Screen Content */}
        <div className="flex-grow overflow-y-auto scrollbar-hide">
          {children}
        </div>
        
        {/* Home Indicator */}
        <div className="h-6 w-full bg-white flex items-center justify-center">
            <div className="w-32 h-1 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
