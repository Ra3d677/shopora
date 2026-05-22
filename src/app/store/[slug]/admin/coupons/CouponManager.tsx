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
        expiresAt: formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null,
        usageLimit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null,
      });
      setCoupons([newCoupon, ...coupons]);
      toast.success(t('settingsSaved'));
    });
  };

  // ...

      <form action={addCoupon} className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
        <input name="code" placeholder="Code" className="bg-transparent border border-white/10 p-2 rounded col-span-2" />
        <select name="type" className="bg-transparent border border-white/10 p-2 rounded text-black">
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input name="value" type="number" placeholder="Value" className="bg-transparent border border-white/10 p-2 rounded" />
        <input name="expiresAt" type="date" className="bg-transparent border border-white/10 p-2 rounded" />
        <input name="usageLimit" type="number" placeholder="Usage Limit" className="bg-transparent border border-white/10 p-2 rounded" />
        <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded col-span-2">
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