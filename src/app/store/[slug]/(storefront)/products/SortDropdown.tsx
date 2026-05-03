"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <select 
      value={currentSort}
      onChange={handleSortChange}
      className="border border-border rounded-lg bg-transparent text-sm font-medium p-2 focus:ring-1 focus:ring-slate-950 cursor-pointer outline-none"
    >
      <option value="featured">Featured</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="newest">Newest</option>
    </select>
  );
}
