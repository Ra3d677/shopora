"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useStore } from "@/components/providers/StoreProvider";
import { useLanguageStore } from "@/store/language";

export default function WishlistPage() {
  const { t } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const { items, removeItem } = useWishlistStore();
  const { store } = useStore();
  const storeItems = items.filter(i => i.storeId === store.id);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Heart className="w-8 h-8" />
          <h1 className="text-4xl font-black tracking-tighter uppercase">{t('wishlist')}</h1>
          <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{storeItems.length}</span>
        </div>

        {storeItems.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
            <Heart size={48} className="mx-auto mb-6 text-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">{t('wishlistEmpty')}</p>
            <Link href={`/store/${store.slug}/products`} className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
              <ShoppingBag size={16} /> {t('browseProducts')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storeItems.map(item => (
              <div key={item.productId} className="group bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                <Link href={`/store/${store.slug}/product/${item.productId}`}>
                  <div className="aspect-square overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/store/${store.slug}/product/${item.productId}`}>
                    <h3 className="font-black tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-lg font-black tracking-tighter mb-4">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3">
                    <Link href={`/store/${store.slug}/product/${item.productId}`} className="flex-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-full text-center hover:bg-black transition-all">
                      <ShoppingBag size={14} className="inline mr-1" /> {t('viewProduct')}
                    </Link>
                    <button onClick={() => removeItem(item.productId)} className="p-3 rounded-full border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all" title={t('deleteLabel')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
