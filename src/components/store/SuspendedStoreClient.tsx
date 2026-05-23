"use client";

export default function SuspendedStoreClient({ slug, isOwner }: { slug: string; isOwner: boolean }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-8">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
          <span className="text-4xl">⏸️</span>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">المتجر غير متاح</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          {isOwner
            ? "تم تعليق متجرك لأن الاشتراك انتهى. اختر باقة وأعد التفعيل."
            : "هذا المتجر غير متاح حالياً. صاحب المتجر قد يكون لديه اشتراك منتهي."}
        </p>
        {isOwner ? (
          <a
            href={`https://google.com`}
            className="inline-flex items-center justify-center gap-3 bg-cyan-500 text-black h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-cyan-400 transition-all shadow-2xl no-underline"
          >
            إعادة التفعيل
          </a>
        ) : (
          <p className="text-slate-600 text-xs font-medium">
            يرجى المحاولة لاحقاً
          </p>
        )}
      </div>
    </div>
  );
}
