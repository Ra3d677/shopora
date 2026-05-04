"use client";

import { useEditorStore } from "@/store/editor";
import { ReactNode } from "react";

export default function PreviewWrapper({ children, isOwner }: { children: ReactNode, isOwner: boolean }) {
  const { device } = useEditorStore();

  if (!isOwner || device === 'desktop') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950/90 flex justify-center py-12 transition-all duration-500 overflow-hidden">
      <div className="relative w-[375px] h-[750px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[3.5rem] border-[12px] border-slate-900 flex flex-col overflow-hidden">
        {/* iPhone Style Notch/Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-[100] flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
        </div>
        
        {/* Screen Content - Aggressive Isolation */}
        <div 
          className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide bg-white relative"
          style={{ 
            contain: 'content',
            transform: 'translate(0, 0)', // Force fixed children to be relative to this div
            perspective: '1px'
          }}
        >
          <div className="w-[351px] min-h-full"> {/* 375px minus borders */}
            {children}
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="h-8 w-full bg-white flex items-center justify-center border-t border-slate-100 relative z-[100]">
            <div className="w-32 h-1.5 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
