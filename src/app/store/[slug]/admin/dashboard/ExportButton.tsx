"use client";

import { Activity } from "lucide-react";

export default function ExportButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button 
      onClick={handlePrint}
      className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.2)] flex items-center gap-3 print:hidden"
    >
      <Activity className="w-4 h-4 animate-pulse" /> Export Report
    </button>
  );
}
