"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CreditCard, CheckCircle2, AlertTriangle } from "lucide-react";

const PLANS = [
  { id: "starter", name: "Starter", price: 9, popular: false },
  { id: "business", name: "Business", price: 25, popular: true },
  { id: "plus", name: "Plus", price: 39, popular: false },
];

export default function ReactivatePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("business");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReactivate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/store/${slug}/reactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push(`/store/${slug}/admin/dashboard`), 2000);
      } else {
        setError(data.error || "Failed to reactivate");
      }
    } catch {
      setError("Connection error");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Reactivated!</h1>
          <p className="text-slate-400 text-sm">Redirecting to dashboard...</p>
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
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Subscription Expired</h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            Your store is currently suspended. Choose a plan to reactivate it and continue selling.
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
                      <span className="ml-3 text-[9px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Popular
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium mt-1">${plan.price}/month</p>
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
          onClick={handleReactivate}
          disabled={loading}
          className="w-full bg-cyan-500 text-black h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:bg-cyan-400 disabled:opacity-50 shadow-2xl"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            <><CreditCard className="w-5 h-5" /> Reactivate — ${PLANS.find(p => p.id === selectedPlan)?.price}/month</>
          )}
        </button>

        <p className="text-slate-600 text-xs text-center font-medium">
          Secure payment via Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
