"use client";

import { AlertTriangle, Package } from "lucide-react";

interface LowStockItem {
  name: string;
  stock_quantity: number;
}

export default function LowStockAlerts({ products }: { products: LowStockItem[] }) {
  if (products.length === 0) return null;

  return (
    <div className="admin-card rounded-2xl border border-red-500/20 shadow-2xl mt-6 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-black italic admin-text tracking-tight">
            Low Stock Alerts
          </h3>
          <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
            {products.length} product{products.length > 1 ? "s" : ""} running low
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500 pb-4">Product</th>
              <th className="text-right text-[10px] font-black uppercase tracking-widest text-slate-500 pb-4">Stock</th>
              <th className="text-right text-[10px] font-black uppercase tracking-widest text-slate-500 pb-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isCritical = p.stock_quantity === 0;
              const isLow = p.stock_quantity < 3;
              return (
                <tr key={p.name} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-bold admin-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className={`text-sm font-black ${isCritical ? "text-red-400" : isLow ? "text-amber-400" : "text-slate-300"}`}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      isCritical
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : isLow
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isCritical ? "bg-red-400 animate-pulse" : isLow ? "bg-amber-400" : "bg-cyan-400"
                      }`} />
                      {isCritical ? "Out of Stock" : isLow ? "Critical" : "Low"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
