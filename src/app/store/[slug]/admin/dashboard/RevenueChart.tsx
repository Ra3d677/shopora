"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";

const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthNamesAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

export default function RevenueChart({
  data,
  isRTL,
}: {
  data: number[];
  isRTL?: boolean;
}) {
  const chartData = useMemo(() => {
    const names = isRTL ? monthNamesAr : monthNamesEn;
    return data.map((value, i) => ({
      month: names[i],
      revenue: value,
    }));
  }, [data, isRTL]);

  const maxVal = Math.max(...data, 1);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#64748b", fontSize: 9, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
            domain={[0, maxVal * 1.2]}
          />
          <Tooltip
            contentStyle={{
              background: "#1a1d2d",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
            labelStyle={{ color: "#94a3b8", fontWeight: 700 }}
            formatter={(value) => `$${Number(value).toFixed(0)}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
