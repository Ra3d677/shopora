"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp, resendOtp } from "@/app/auth/actions";
import { Mail, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

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
    if (!email) { setError("No email found. Please register again."); return; }
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the full 6-digit code."); return; }
    setLoading(true);
    setError("");
    setMessage("");

    const result = await verifyOtp(email, code);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setMessage("Verified! Redirecting...");
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError("");
    await resendOtp(email);
    setResending(false);
    setMessage("New code sent! Check your email.");
  };

  const allFilled = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500/5 via-slate-50 to-blue-500/5 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-12 text-white text-center relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 ring-2 ring-white/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Verify Your Email</h1>
          <p className="text-cyan-200">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="p-12 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">{error}</div>
          )}
          {message && (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-bold border border-green-100 text-center">{message}</div>
          )}

          <div className="flex justify-center gap-3">
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
                className="w-12 h-14 text-center text-2xl font-black bg-slate-50 border-2 border-slate-200 focus:border-cyan-600 focus:bg-white rounded-xl outline-none transition-all"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || !allFilled}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-5 rounded-2xl font-black text-xl hover:from-cyan-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Verify Email</>}
          </button>

          <div className="text-center space-y-3">
            <p className="text-slate-500 text-sm font-medium">
              Didn't receive the code?{" "}
              <button onClick={handleResend} disabled={resending} className="text-cyan-600 font-bold hover:underline">
                {resending ? "Sending..." : "Resend"}
              </button>
            </p>
            <button onClick={() => router.push("/auth/login")} className="text-slate-400 text-sm font-medium hover:text-slate-600 inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
