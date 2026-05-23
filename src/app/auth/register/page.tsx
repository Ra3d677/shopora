"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Mail, User, Lock, Loader2, ArrowRight } from "lucide-react";
import { registerUser } from "../actions";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";
  const cycle = searchParams.get("cycle") || "monthly";

  const handleRegister = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await registerUser(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(`/create-store?plan=${plan}&cycle=${cycle}`);
      }
    });
  };

  const handleGoogleRegister = () => {
    setGoogleLoading(true);
    window.location.href = "/api/auth/google";
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
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 shadow-sm"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            )}
            {googleLoading ? "جاري الاتصال بـ Google..." : "Google"}
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
