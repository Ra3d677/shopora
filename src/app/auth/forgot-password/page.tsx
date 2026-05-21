"use client";

import { useState } from "react";
import { Mail, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/app/auth/actions";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true);
    setError("");
    const result = await forgotPassword(email);
    if (result.error) setError(result.error);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500/5 via-slate-50 to-blue-500/5 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-12 text-white text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 ring-2 ring-white/30">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Reset Password</h1>
          <p className="text-cyan-200">We'll send you a reset link</p>
        </div>

        <div className="p-12 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">{error}</div>
          )}

          {submitted ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 text-green-600 p-6 rounded-2xl text-sm font-bold border border-green-100">
                If that email exists, a reset link has been sent. Check your inbox (and spam).
              </div>
              <button
                onClick={() => router.push("/auth/login")}
                className="text-cyan-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-cyan-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-5 rounded-2xl font-black text-xl hover:from-cyan-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Send Reset Link</>}
              </button>

              <div className="text-center">
                <button onClick={() => router.push("/auth/login")} className="text-slate-400 text-sm font-medium hover:text-slate-600 inline-flex items-center gap-1">
                  <ArrowLeft size={14} /> Back to login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
