"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CreditCard, CheckCircle2, AlertTriangle, Phone, Upload, Send } from "lucide-react";

const PLANS = [
  { id: "starter", name: "Starter", price: 9, popular: false },
  { id: "business", name: "Business", price: 25, popular: true },
  { id: "plus", name: "Plus", price: 39, popular: false },
];

const VODAFONE_CASH_NUMBER = "01000000000"; // رقم المنصة - غيّره لرقمك الفعلي

export default function ReactivatePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("business");
  const [step, setStep] = useState<"plan" | "payment" | "submitted">("plan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!customerPhone || customerPhone.length < 10) {
      setError("من فضلك أدخل رقم الهاتف اللي دفعت منه");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/store/${slug}/reactivation-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          customerPhone,
          receiptImage: receiptImage || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("submitted");
      } else {
        setError(data.error || "فشل إرسال الطلب");
      }
    } catch {
      setError("خطأ في الاتصال");
    }
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("الصورة كبيرة جداً. أقصى حجم 2MB");
      return;
    }
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
          <p className="text-slate-400 text-sm leading-relaxed">
            سيتم مراجعة طلبك وتفعيل المتجر خلال 24 ساعة. هنتواصل معاك على الرقم اللي دخلته.
          </p>
          <button
            onClick={() => router.push(`/store/${slug}/admin/dashboard`)}
            className="bg-white/10 text-white h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all"
          >
            الرجوع للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    const plan = PLANS.find(p => p.id === selectedPlan)!;
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <Phone className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">الدفع عبر فودافون كاش</h1>
            <p className="text-slate-400 text-sm">{plan.name} — ${plan.price}/شهر</p>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 space-y-3">
            <h3 className="text-amber-400 font-black text-sm uppercase tracking-wider">📋 خطوات الدفع</h3>
            <ol className="text-slate-400 text-xs space-y-2 leading-relaxed">
              <li>1. افتح محفظة فودافون كاش على هاتفك</li>
              <li>2. حول المبلغ <span className="text-white font-black">${plan.price}</span> على الرقم: <span className="text-white font-black text-sm">{VODAFONE_CASH_NUMBER}</span></li>
              <li>3. بعد التحويل، أدخل البيانات في الخانات أدناه</li>
              <li>4. هنتأكد من التحويل ونفعل المتجر خلال 24 ساعة</li>
            </ol>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-bold border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                رقم الهاتف اللي دفعت منه *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="مثال: 01012345678"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                صورة الإيصال (اختياري)
              </label>
              <label className="flex items-center gap-3 w-full bg-white/5 border border-dashed border-white/10 rounded-xl px-5 py-4 cursor-pointer hover:border-cyan-500/50 transition-all">
                <Upload className="w-5 h-5 text-slate-500" />
                <span className="text-slate-500 text-sm">
                  {receiptImage ? "✅ تم اختيار الصورة" : "اضغط لرفع صورة الإيصال"}
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                ملاحظات (اختياري)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="أي ملاحظات إضافية..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 text-black h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:bg-green-400 disabled:opacity-50 shadow-2xl"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال...</>
            ) : (
              <><Send className="w-5 h-5" /> إرسال طلب التفعيل</>
            )}
          </button>

          <p className="text-slate-600 text-xs text-center font-medium">
            بعد إرسال الطلب، هنتأكد من التحويل ونتواصل معاك
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">انتهت الفترة التجريبية</h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            متجرك معلق حالياً. اختار باقة عشان تفعله وتكمل بيع.
          </p>
        </div>

        <div className="space-y-4">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                selectedPlan === plan.id
                  ? "bg-cyan-500/10 border-cyan-500"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-black text-lg uppercase">
                    {plan.name}
                    {plan.popular && (
                      <span className="mr-3 text-[9px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        الأكثر طلباً
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium mt-1">${plan.price}/شهر</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id ? "border-cyan-500 bg-cyan-500" : "border-slate-600"
                }`}>
                  {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-bold border border-red-500/20">
            {error}
          </div>
        )}

        <button
          onClick={() => setStep("payment")}
          className="w-full bg-cyan-500 text-black h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:bg-cyan-400 shadow-2xl"
        >
          <Phone className="w-5 h-5" /> دفع عبر فودافون كاش
        </button>

        <p className="text-slate-600 text-xs text-center font-medium">
          الدفع مرة واحدة - تفعيل فوري بعد التأكيد
        </p>
      </div>
    </div>
  );
}
