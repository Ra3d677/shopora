"use client";

import { useEditorStore } from "@/store/editor";
import { ReactNode } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function PreviewWrapper({ children, isOwner }: { children: ReactNode, isOwner: boolean }) {
  const { device } = useEditorStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // If we are currently inside the iframe, just render the content normally
  if (searchParams.get('preview') === 'mobile') {
    return <>{children}</>;
  }

  // If not owner or desktop mode, render normally
  if (!isOwner || device === 'desktop') {
    return <>{children}</>;
  }

  // Create the iframe URL, preserving existing params but adding preview=mobile
  const currentParams = new URLSearchParams(searchParams.toString());
  currentParams.set('preview', 'mobile');
  const iframeUrl = `${pathname}?${currentParams.toString()}`;

  return (
    <div className="min-h-screen bg-slate-950/90 flex justify-center items-center py-8 transition-all duration-500 overflow-hidden relative z-50">
      <div className="relative w-[375px] h-[750px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[3.5rem] border-[14px] border-slate-900 flex flex-col overflow-hidden">
        {/* iPhone Style Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-3xl z-[100] flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
            <div className="absolute right-6 w-2 h-2 bg-slate-800 rounded-full" />
        </div>
        
        {/* Actual Iframe Viewport */}
        <div className="flex-grow w-full bg-white relative">
          <iframe 
            src={iframeUrl} 
            className="w-full h-full border-none pointer-events-auto"
            title="Mobile Preview"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
        
        {/* Home Indicator */}
        <div className="h-6 w-full bg-white flex items-center justify-center absolute bottom-0 z-[100]">
            <div className="w-32 h-1 bg-slate-900/20 rounded-full mb-2" />
        </div>
      </div>
      
      {/* Help text */}
      <div className="absolute bottom-8 text-white/50 text-sm font-medium">
        Mobile Preview Mode - Changes inside this frame will not be saved automatically.
      </div>
    </div>
  );
}
