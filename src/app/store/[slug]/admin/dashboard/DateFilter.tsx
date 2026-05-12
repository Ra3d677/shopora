"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar } from "lucide-react";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentRange = searchParams.get('range') || 'all_time';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRange = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', newRange);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 bg-[#1a1d2d] border border-white/5 rounded-2xl px-5 py-3 shadow-2xl group hover:border-cyan-500/30 transition-all print:hidden">
      <Calendar className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
      <select 
        value={currentRange}
        onChange={handleChange}
        className="bg-transparent text-[11px] font-black text-slate-400 uppercase tracking-widest outline-none cursor-pointer focus:text-white transition-colors"
      >
        <option value="all_time" className="bg-[#0f111a]">All Time</option>
        <option value="today" className="bg-[#0f111a]">Today</option>
        <option value="last_7_days" className="bg-[#0f111a]">Last 7 Days</option>
        <option value="this_month" className="bg-[#0f111a]">This Month</option>
        <option value="last_month" className="bg-[#0f111a]">Last Month</option>
        <option value="this_year" className="bg-[#0f111a]">This Year</option>
      </select>
    </div>
  );
}
