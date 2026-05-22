"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Eye, ExternalLink, Clock } from "lucide-react";
import Image from "next/image";

interface RequestItem {
  id: string;
  storeId: string;
  plan: string;
  planLabel: string;
  durationDays: number;
  customerPhone: string;
  receiptImage: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  store: { name: string; slug: string; ownerId: string; owner: { email: string; name: string | null } | null };
}

export default function RequestsList({ requests }: { requests: RequestItem[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [durationInput, setDurationInput] = useState<Record<string, string>>({});

  const handleApprove = async (req: RequestItem) => {
    const raw = durationInput[req.id] || "";
    const days = parseFloat(raw);
    if (!raw || isNaN(days) || days < 0.001 || days > 365) {
      alert("حدد مدة التفعيل (أقل حاجة دقيقة = 0.001، أقصى حاجة 365 يوم)");
      return;
    }
    setLoading(req.id);
    try {
      const res = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: req.id, action: "approve", durationDays: days }),
      });
      const data = await res.json();
      if (data.success) router.refresh();
      else alert(data.error || "فشل");
    } catch {
      alert("فشل العملية");
    }
    setLoading(null);
  };

  const handleReject = async (requestId: string) => {
    setLoading(requestId);
    try {
      const res = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "reject" }),
      });
      const data = await res.json();
      if (data.success) router.refresh();
    } catch {
      alert("فشل العملية");
    }
    setLoading(null);
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-16 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <p className="text-slate-400 text-lg font-black">لا توجد طلبات pending</p>
        <p className="text-slate-600 text-sm mt-2">كل الطلبات تمت معالجتها</p>
      </div>
    );
  }

  return (
    <>
      {expandedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setExpandedImage(null)}>
          <div className="max-w-lg max-h-[80vh] relative">
            <Image src={expandedImage} alt="Receipt" width={500} height={700} className="rounded-2xl" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {requests.map((req) => {
          const raw = durationInput[req.id] || "";
          const days = parseFloat(raw);
          const previewDate = !isNaN(days) && days > 0 ? new Date(Date.now() + days * 86400000).toLocaleDateString("ar-EG") : null;

          return (
            <div key={req.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-black text-lg">{req.store.name}</h3>
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg font-black uppercase">
                      {req.planLabel}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium mt-1">
                    {req.store.owner?.name || req.store.owner?.email || "—"}
                  </p>
                </div>
                <a
                  href={`/store/${req.store.slug}/admin/dashboard`}
                  target="_blank"
                  className="bg-white/5 text-slate-400 h-10 w-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/[0.02] rounded-xl p-3">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">رقم الدفع</p>
                  <p className="text-white font-bold" dir="ltr">{req.customerPhone}</p>
                </div>
                <div className="bg-white/[0.02] rounded-xl p-3">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">التاريخ</p>
                  <p className="text-white font-bold">{new Date(req.createdAt).toLocaleDateString("ar-EG", { dateStyle: "long" })}</p>
                </div>
              </div>

              {req.notes && (
                <div className="bg-white/[0.02] rounded-xl p-3">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">ملاحظات</p>
                  <p className="text-slate-300 text-sm">{req.notes}</p>
                </div>
              )}

              {req.receiptImage && (
                <button
                  onClick={() => setExpandedImage(req.receiptImage!)}
                  className="flex items-center gap-2 text-cyan-400 text-xs font-bold hover:text-cyan-300 transition-all"
                >
                  <Eye className="w-4 h-4" /> عرض صورة الإيصال
                </button>
              )}

              {/* Duration + Actions */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">مدة التفعيل</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0.001}
                    max={365}
                    step={0.001}
                    value={durationInput[req.id] || ""}
                    onChange={e => setDurationInput(prev => ({ ...prev, [req.id]: e.target.value }))}
                    placeholder={req.durationDays ? `اقتراح: ${req.durationDays} يوم` : "أدخل المدة بالأيام"}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                  <span className="text-slate-400 text-xs font-black">يوم</span>
                </div>
                {previewDate && (
                  <p className="text-xs text-cyan-400 font-medium">
                    ينتهي الاشتراك: {previewDate}
                  </p>
                )}
                <div className="text-[9px] text-slate-600 font-medium">
                  أقل مدة: دقيقة (0.001 يوم) — أقصى مدة: سنة (365 يوم)
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={loading === req.id}
                    className="flex-1 bg-green-500/20 text-green-400 h-12 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all disabled:opacity-50"
                  >
                    {loading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    قبول التفعيل
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={loading === req.id}
                    className="flex-1 bg-red-500/10 text-red-400 h-12 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    رفض
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
