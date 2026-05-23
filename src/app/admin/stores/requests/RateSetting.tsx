"use client";

import { useState } from "react";
import { DollarSign, Save, CheckCircle2 } from "lucide-react";

export default function RateSetting({ currentRate }: { currentRate: number }) {
  const [rate, setRate] = useState(currentRate.toString());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate: parseFloat(rate) }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } catch {}
    setSaving(false);
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
      <DollarSign className="w-6 h-6 text-green-400 shrink-0" />
      <div className="flex-1">
        <p className="text-white text-sm font-black mb-1">سعر الدولار (USD → EGP)</p>
        <p className="text-slate-500 text-[10px] font-medium">يستخدم لحساب السعر بالجنيه المصري في صفحة التفعيل</p>
      </div>
      <input
        type="number"
        step="0.01"
        min="1"
        value={rate}
        onChange={e => setRate(e.target.value)}
        className="w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-black text-center focus:outline-none focus:border-cyan-500"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-500 text-black h-12 px-6 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-green-400 disabled:opacity-50"
      >
        {saved ? <><CheckCircle2 className="w-4 h-4" /> تم</> : saving ? <><Save className="w-4 h-4 animate-pulse" /> حفظ</> : <><Save className="w-4 h-4" /> حفظ</>}
      </button>
    </div>
  );
}
