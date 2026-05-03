"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  slug: string;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, slug, view = 'grid' }: ProductCardProps) {
  if (view === 'list') {
    return (
      <Link href={`/store/${slug}/product/${product.id}`} className="group flex items-center gap-6 p-4 hover:bg-slate-50 transition-colors rounded-2xl border border-transparent hover:border-slate-100">
        <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden relative shrink-0">
          <SmartImage 
            src={product.images[0]} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{product.name}</h3>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">${product.price}</p>
        </div>
        <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ShoppingBag size={18} />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/store/${slug}/product/${product.id}`} className="group flex flex-col">
      <div className="aspect-[4/5] bg-slate-100 overflow-hidden rounded-3xl mb-6 relative">
        <SmartImage 
          src={product.images[0]}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={product.name}
        />
        <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <ShoppingBag size={18} className="text-slate-900" />
          </div>
        </div>
      </div>
      <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">{product.name}</h3>
      <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">${product.price}</p>
    </Link>
  );
}
