"use client";

import { useEditorStore } from "@/store/editor";
import { ReactNode } from "react";

export default function PreviewWrapper({ children, isOwner }: { children: ReactNode, isOwner: boolean }) {
  const { device } = useEditorStore();

  if (!isOwner || device === 'desktop') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center py-12 transition-all duration-500 overflow-hidden">
      <div className="relative w-[375px] h-[750px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[3.5rem] border-[12px] border-slate-900 overflow-hidden flex flex-col isolation-auto">
        {/* iPhone Style Notch/Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-[100] flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
        </div>
        
        {/* Screen Content - Isolated with Transform */}
        <div 
          className="flex-grow overflow-y-auto scrollbar-hide relative bg-white" 
          style={{ 
            transform: 'translateZ(0)',
            perspective: '1000px',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="relative min-h-full flex flex-col">
            {children}
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="h-8 w-full bg-white flex items-center justify-center border-t border-slate-100">
            <div className="w-32 h-1.5 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
