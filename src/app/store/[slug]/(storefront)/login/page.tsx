"use client";

import { useState, use } from "react";
import { loginCustomer } from "@/app/store/actions";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerLoginPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginCustomer(slug, formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-600/20 ring-2 ring-white/30">
            <ShoppingBag className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-white uppercase tracking-tighter">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-cyan-300 uppercase tracking-widest">
          Sign in to track your orders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] py-10 px-6 shadow-2xl backdrop-blur-sm sm:px-12"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold rounded-2xl flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center shrink-0 text-red-400 font-black">!</div>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-2 ml-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full h-14 pl-12 pr-5 bg-slate-800/50 border-2 border-slate-700/50 focus:border-cyan-500 focus:bg-slate-800 rounded-2xl outline-none transition-all text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full h-14 pl-12 pr-5 bg-slate-800/50 border-2 border-slate-700/50 focus:border-cyan-500 focus:bg-slate-800 rounded-2xl outline-none transition-all text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="text-right -mt-4">
                <Link href="/auth/forgot-password" className="text-cyan-400 text-sm font-bold hover:text-cyan-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-3 h-14 px-4 border border-transparent rounded-2xl shadow-xl shadow-cyan-600/20 text-sm font-black uppercase tracking-widest text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Don't have an account?{" "}
              <Link href={`/store/${slug}/register`} className="text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
