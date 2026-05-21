"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import React from "react";
import { useLanguageStore } from "@/store/language";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = useParams();
  const { t } = useLanguageStore();
  
  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    router.push(`/store/${slug}/products?${params.toString()}`);
  };

  return (
    <select 
      value={currentSort}
      onChange={handleSortChange}
      className="border border-border rounded-lg bg-transparent text-sm font-medium p-2 focus:ring-1 focus:ring-slate-950 cursor-pointer outline-none"
    >
      <option value="featured">{t('featured')}</option>
      <option value="price_asc">{t('priceLowHigh')}</option>
      <option value="price_desc">{t('priceHighLow')}</option>
      <option value="newest">{t('newest')}</option>
    </select>
  );
}
