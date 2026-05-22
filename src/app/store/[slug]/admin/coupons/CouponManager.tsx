"use client";
import { useState, useTransition } from "react";
import { Trash2, Plus, Tag } from "lucide-react";
import { createCoupon, deleteCoupon } from "./actions";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/language";

export default function CouponManager({ slug, storeId, initialCoupons }: { slug: string; storeId: string; initialCoupons: any[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguageStore();

  const addCoupon = async (formData: FormData) => {
    startTransition(async () => {
      const newCoupon = await createCoupon({
        storeId,
        code: formData.get("code") as string,
        discountType: formData.get("type") as 'percentage' | 'fixed',
        discountValue: Number(formData.get("value")),
      });
      setCoupons([newCoupon, ...coupons]);
      toast.success(t('settingsSaved'));
    });
  };

  const removeCoupon = async (id: string) => {
    startTransition(async () => {
      await deleteCoupon(id, storeId);
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success(t('deleteLabel'));
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-white">{t('coupons')}</h1>
      
      <form action={addCoupon} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
        <input name="code" placeholder="Code" className="bg-transparent border border-white/10 p-2 rounded" />
        <select name="type" className="bg-transparent border border-white/10 p-2 rounded text-black">
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input name="value" type="number" placeholder="Value" className="bg-transparent border border-white/10 p-2 rounded" />
        <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">
            {t('add')}
        </button>
      </form>

      <div className="space-y-2">
        {coupons.map((c) => (
          <div key={c.id} className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <span>{c.code} - {c.discountValue}{c.discountType === 'percentage' ? '%' : '$'}</span>
            <button onClick={() => removeCoupon(c.id)} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}