"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { seedTourismDemoData } from "@/app/actions";

interface Props {
  storeId: string;
}

export default function TourismDemoSeedButton({ storeId }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSeed = async () => {
    const isArabic = document.documentElement.dir === "rtl" || navigator.language.startsWith("ar");
    const confirmMsg = isArabic
      ? "هل أنت متأكد؟ هذا الإجراء سيقوم بحذف جميع الملابس والمنتجات الحالية واستيراد 6 باقات رحلات سياحية عالمية فاخرة (جزر المالديف، جبال الألب السويسرية، سانتوريني، وغيرها) بالكامل مع الصور عالية الجودة!"
      : "Are you sure? This will delete all current products (clothing) and instantly import 6 breathtaking luxury travel packages (Maldives, Swiss Alps, Santorini, etc.) with high-resolution travel photos!";

    if (!confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await seedTourismDemoData(storeId);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        alert(res.error || "Failed to seed travel packages.");
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong while importing travel data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
      
      <div className="flex items-center gap-6 relative z-10 text-center md:text-left flex-col md:flex-row">
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-tight uppercase mb-1">
            ✨ Transform into a Real <span className="text-amber-400">Tourism & Travel Website</span>
          </h3>
          <p className="text-sm text-slate-400 font-medium max-w-xl">
            Import gorgeous ready-to-use luxury travel packages (Maldives, Swiss Alps, Santorini) to instantly replace your clothing items and show stunning high-res photography!
          </p>
          <p className="text-xs text-amber-500/80 font-bold mt-2 font-arabic" dir="rtl">
            ✨ هل تريد تجربة موقع سياحي حقيقي؟ اضغط هنا لحذف الملابس فوراً وتنزيل 6 رحلات سياحية عالمية فاخرة بصور ساحرة عالية الجودة!
          </p>
        </div>
      </div>

      <button
        onClick={handleSeed}
        disabled={loading || success}
        className="shrink-0 flex items-center gap-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black uppercase tracking-widest text-xs px-10 py-5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 relative z-10"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Seeding Destinations...
          </>
        ) : success ? (
          "✨ Imported Successfully!"
        ) : (
          <>
            Import Travel Packages <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
