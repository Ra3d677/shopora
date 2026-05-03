"use client";

import { Activity } from "lucide-react";

export default function ExportButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button 
      onClick={handlePrint}
      className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2 print:hidden"
    >
      <Activity className="w-4 h-4" /> Export Full Report
    </button>
  );
}
