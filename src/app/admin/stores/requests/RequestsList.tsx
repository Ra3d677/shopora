"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Eye, ExternalLink } from "lucide-react";
import Image from "next/image";

interface RequestItem {
  id: string;
  storeId: string;
  plan: string;
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

  const handleAction = async (requestId: string, action: "approve" | "reject") => {
    setLoading(requestId);
    try {
      const res = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
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
        {requests.map((req) => (
          <div key={req.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-black text-lg">{req.store.name}</h3>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg font-black uppercase">
                    {req.plan}
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-1">
                  {req.store.owner?.name || req.store.owner?.email || "—"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req.id, "approve")}
                  disabled={loading === req.id}
                  className="bg-green-500/20 text-green-400 h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-500/30 transition-all disabled:opacity-50"
                >
                  {loading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  تفعيل
                </button>
                <button
                  onClick={() => handleAction(req.id, "reject")}
                  disabled={loading === req.id}
                  className="bg-red-500/10 text-red-400 h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  رفض
                </button>
                <a
                  href={`/store/${req.store.slug}/admin/dashboard`}
                  target="_blank"
                  className="bg-white/5 text-slate-400 h-10 w-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
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
          </div>
        ))}
      </div>
    </>
  );
}
