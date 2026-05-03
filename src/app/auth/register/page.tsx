"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Mail, User, Lock, Loader2, ArrowRight } from "lucide-react";
import { registerUser } from "../actions";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await registerUser(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-12 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Start Your Journey</h1>
          <p className="text-blue-100">Create an account to launch your multi-store business.</p>
        </div>

        <form action={handleRegister} className="p-12 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                name="name"
                required
                type="text" 
                placeholder="John Doe"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                name="email"
                required
                type="email" 
                placeholder="you@example.com"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                name="password"
                required
                type="password" 
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button 
            disabled={isPending}
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl active:scale-[0.98]"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Create Account <ArrowRight /></>
            )}
          </button>
          
          <div className="text-center pt-4">
            <p className="text-slate-500 font-medium">
              Already have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => router.push("/auth/login")}>Sign In</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
