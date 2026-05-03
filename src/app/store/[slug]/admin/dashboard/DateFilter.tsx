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
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm print:hidden">
      <Calendar className="w-4 h-4 text-slate-500" />
      <select 
        value={currentRange}
        onChange={handleChange}
        className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
      >
        <option value="all_time">All Time</option>
        <option value="today">Today</option>
        <option value="last_7_days">Last 7 Days</option>
        <option value="this_month">This Month</option>
        <option value="last_month">Last Month</option>
        <option value="this_year">This Year</option>
      </select>
    </div>
  );
}
