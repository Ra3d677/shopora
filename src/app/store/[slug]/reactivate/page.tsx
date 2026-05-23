"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Phone, Upload, Send, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

const USD_TO_EGP = 48;
const CYCLES = [
  { id: "monthly", label: "شهري", price: 9, total: "$9", totalEGP: 9 * USD_TO_EGP, billing: "تدفع شهرياً", savings: null, color: "blue", popular: false },
  { id: "3-months", label: "3 شهور", price: 7, total: "$21", totalEGP: 21 * USD_TO_EGP, billing: "تدفع كل 3 شهور", savings: "وفر $6", color: "emerald", popular: false },
  { id: "6-months", label: "6 شهور", price: 5.5, total: "$33", totalEGP: 33 * USD_TO_EGP, billing: "تدفع كل 6 شهور", savings: "وفر $21", color: "cyan", popular: true },
  { id: "annual", label: "سنوي", price: 4.5, total: "$54", totalEGP: 54 * USD_TO_EGP, billing: "تدفع سنوياً", savings: "وفر $54", color: "purple", popular: false },
];
const CYCLE_DURATION: Record<string, number> = { "monthly": 30, "3-months": 90, "6-months": 180, "annual": 365 };
const VODAFONE_CASH_NUMBER = "01000000000";

export default function ReactivateStandalonePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [selectedCycle, setSelectedCycle] = useState("6-months");
  const [step, setStep] = useState<"plan" | "payment" | "submitted">("plan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
  const [notes, setNotes] = useState("");

  const cycle = CYCLES.find(c => c.id === selectedCycle)!;

  const handleSubmit = async () => {
    if (!customerPhone || customerPhone.length < 10) { setError("من فضلك أدخل رقم الهاتف"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/store/${slug}/reactivation-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedCycle, planLabel: cycle.label, customerPhone, receiptImage: receiptImage || undefined, notes: notes || undefined, durationDays: CYCLE_DURATION[selectedCycle] || 30 }),
      });
      const data = await res.json();
      if (data.success) setStep("submitted");
      else setError(data.error || "فشل");
    } catch { setError("خطأ في الاتصال"); }
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("الصورة كبيرة جداً"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  if (step === "submitted") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">تم إرسال الطلب!</h1>
          <p className="text-slate-400 text-sm">سيتم مراجعة طلبك وتفعيل المتجر خلال 24 ساعة.</p>
          <button onClick={() => router.push(`/store/${slug}`)} className="bg-white/10 text-white h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all">الرجوع للمتجر</button>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <Phone className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">الدفع عبر فودافون كاش</h1>
            <p className="text-slate-400 text-sm">{cycle.label} — {cycle.total} ≈ {cycle.totalEGP.toLocaleString()} ج.م</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 space-y-3">
            <h3 className="text-amber-400 font-black text-sm">📋 خطوات الدفع</h3>
            <ol className="text-slate-400 text-xs space-y-2">
              <li>1. افتح محفظة فودافون كاش</li>
              <li>2. حول <span className="text-white font-black">{cycle.total} ≈ {cycle.totalEGP.toLocaleString()} ج.م</span> على: <span className="text-white font-black">{VODAFONE_CASH_NUMBER}</span></li>
              <li>3. أدخل البيانات أدناه</li>
            </ol>
          </div>
          {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-bold">{error}</div>}
          <div className="space-y-5">
            <div>
              <label className="text-slate-400 text-[10px] font-black block mb-2">رقم الهاتف *</label>
              <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="01012345678" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-black block mb-2">صورة الإيصال</label>
              <label className="flex items-center gap-3 w-full bg-white/5 border border-dashed border-white/10 rounded-xl px-5 py-4 cursor-pointer hover:border-cyan-500/50">
                <Upload className="w-5 h-5 text-slate-500" />
                <span className="text-slate-500 text-sm">{receiptImage ? "✅ تم" : "اضغط للرفع"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-black block mb-2">ملاحظات</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="أي ملاحظات..." className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none" />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-500 text-black h-16 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-green-400 disabled:opacity-50">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال...</> : <><Send className="w-5 h-5" /> إرسال طلب التفعيل</>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>اختر دورة الاشتراك</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">انتهت الفترة التجريبية</h1>
          <p className="text-slate-400 text-sm">اختر دورة الدفع عشان تفعّل متجرك وتكمل بيع.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CYCLES.map((c) => (
            <button key={c.id} onClick={() => setSelectedCycle(c.id)} className={`relative flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left ${selectedCycle === c.id ? "border-cyan-400 bg-white/[0.04] scale-[1.02]" : "border-white/5 bg-white/[0.02] hover:border-white/20"}`}>
              {c.popular && <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">الأكثر طلباً</span>}
              <p className="text-[9px] font-black text-cyan-400">{c.label}</p>
              <div className="h-4" />
              <div className="mb-1 flex items-end gap-1.5">
                <span className="text-4xl font-black text-white italic leading-none">${c.price}</span>
                <span className="text-slate-500 text-xs font-bold mb-1">/ شهرياً</span>
              </div>
              <p className="text-slate-500 text-[9px] font-bold">{c.total} — {c.billing}</p>
              <p className="text-[10px] text-yellow-400 font-black mt-1">≈ {c.totalEGP.toLocaleString()} ج.م</p>
              {c.savings && <p className="text-xs font-black mt-2 text-yellow-400">{c.savings}</p>}
            </button>
          ))}
        </div>

        {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-bold">{error}</div>}

        <div className="flex flex-col items-center gap-4">
          <button onClick={() => setStep("payment")} className="bg-cyan-500 text-black h-16 px-12 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-cyan-400 shadow-2xl">
            <Phone className="w-5 h-5" /> دفع عبر فودافون كاش — {cycle.total} ≈ {cycle.totalEGP.toLocaleString()} ج.م
          </button>
          <p className="text-slate-600 text-xs">{CYCLE_DURATION[selectedCycle]} يوم اشتراك بعد التفعيل</p>
        </div>
      </div>
    </div>
  );
}
