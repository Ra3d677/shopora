"use client";

import { Clock, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";

interface RecentOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  processing: "bg-blue-500/10 text-blue-400",
  shipped: "bg-cyan-500/10 text-cyan-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function RecentActivity({
  orders,
  slug,
}: {
  orders: RecentOrder[];
  slug: string;
}) {
  const { language } = useLanguageStore();
  const isRTL = language === "ar";

  return (
    <div className="bg-[#1a1d2d] rounded-[2.5rem] border border-white/5 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-black italic text-white tracking-tight">
            {isRTL ? "آخر النشاطات" : "Recent Activity"}
          </h3>
        </div>
        <Link
          href={`/store/${slug}/admin/orders`}
          className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          {isRTL ? "عرض الكل" : "View All"} <ArrowRight size={12} className={isRTL ? "rotate-180" : ""} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={32} className="mx-auto mb-3 opacity-20 text-slate-500" />
          <p className="text-sm font-medium text-slate-500">{isRTL ? "لا توجد طلبات حديثة" : "No recent orders"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const date = new Date(order.createdAt);
            const minsAgo = Math.floor((Date.now() - date.getTime()) / 60000);
            const timeLabel = minsAgo < 60 ? `${minsAgo}m ago` : minsAgo < 1440 ? `${Math.floor(minsAgo / 60)}h ago` : date.toLocaleDateString();

            return (
              <Link
                key={order.id}
                href={`/store/${slug}/admin/orders`}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#0f111a] border border-white/5 hover:border-cyan-500/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center border border-white/5">
                    <Package size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {order.customerName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium text-slate-500">{timeLabel}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${statusColors[order.status] || "bg-slate-500/10 text-slate-400"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-400">${Number(order.totalAmount).toFixed(0)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
