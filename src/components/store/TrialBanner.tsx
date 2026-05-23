"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TrialBanner({ slug, trialEndsAt, isSubscription }: { slug: string; trialEndsAt: string | null; isSubscription?: boolean }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!trialEndsAt) return;
    const end = new Date(trialEndsAt).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [trialEndsAt]);

  if (!trialEndsAt || timeLeft === "Expired") return null;

  const isLow = timeLeft.length === 8 && parseInt(timeLeft) < 21600;

  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
      isLow ? "bg-amber-500/10 border-amber-500/20" : "bg-cyan-500/5 border-cyan-500/10"
    }`}>
      <div className="flex items-center gap-3">
        {isLow ? <AlertTriangle className="w-5 h-5 text-amber-400" /> : <Clock className="w-5 h-5 text-cyan-400" />}
        <div>
          <p className={`text-sm font-black uppercase tracking-wider ${isLow ? "text-amber-400" : "text-cyan-400"}`}>
            {isSubscription ? "Subscription Active" : "Trial Mode"}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {isSubscription
              ? (isLow ? "Your subscription is ending soon. Renew to keep your store live." : "Subscription active — renew before it expires.")
              : (isLow ? "Your trial is ending soon. Reactivate to keep your store live." : "Experience all features during your trial.")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-2xl font-mono font-black ${isLow ? "text-amber-400" : "text-white"}`}>
          {timeLeft}
        </span>
        <Link
          href={`/store/${slug}/admin/reactivate`}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isLow
              ? "bg-amber-500 text-black hover:bg-amber-400"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {isLow ? "Renew Now" : "View Plans"}
        </Link>
      </div>
    </div>
  );
}
