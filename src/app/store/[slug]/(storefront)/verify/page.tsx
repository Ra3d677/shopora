"use client";

import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyCustomerOtp } from "@/app/store/actions";
import { ShieldCheck, Loader2, Mail } from "lucide-react";
import { useLanguageStore } from "@/store/language";

export default function CustomerVerifyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguageStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = searchParams.get("email");
    if (e) setEmail(e);
  }, [searchParams]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = async () => {
    if (!email) { setError(t('noEmailFound')); return; }
    const code = otp.join("");
    if (code.length !== 6) { setError(t('enterFullCode')); return; }
    setLoading(true);
    setError("");
    const result = await verifyCustomerOtp(slug, email, code);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setMessage(t('verifiedRedirect'));
    setTimeout(() => router.push(`/store/${slug}`), 1000);
  };

  const allFilled = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl ring-2 ring-white/30">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 uppercase tracking-tighter">
          {t('verifyEmail')}
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
          {t('verifyDesc')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100 sm:px-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl text-center">{error}</div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 text-sm font-bold rounded-2xl text-center">{message}</div>
          )}

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-2xl font-black bg-slate-50 border-2 border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl outline-none transition-all"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || !allFilled}
            className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest text-white bg-slate-900 hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{t('verifyBtn')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
