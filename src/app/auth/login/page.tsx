"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { loginUser } from "../actions";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await loginUser(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-red-200">
        <div className="bg-gradient-to-r from-red-600 via-blue-700 to-red-600 p-12 text-white text-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ring-2 ring-white/30">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase text-white">Member Login</h1>
          <p className="text-red-200">Access your dashboard and manage your store.</p>
        </div>

        <form action={handleLogin} className="p-12 space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-50 via-blue-50 to-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-800 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-red-400" size={20} />
              <input 
                name="email"
                required
                type="email" 
                placeholder="you@example.com"
                className="w-full pl-14 pr-6 py-4 bg-gradient-to-r from-red-50 via-blue-50 to-red-50 border-2 border-red-200 focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-800 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-red-400" size={20} />
              <input 
                name="password"
                required
                type="password" 
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-gradient-to-r from-red-50 via-blue-50 to-red-50 border-2 border-red-200 focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              />
            </div>
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-blue-600 text-sm font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button 
            disabled={isPending}
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 via-blue-600 to-red-700 text-white py-5 rounded-2xl font-black text-xl hover:from-red-700 hover:via-blue-700 hover:to-red-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-red-600/30 active:scale-[0.98]"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Sign In <ArrowRight /></>
            )}
          </button>
          
          {/* Placeholder for Google Login */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-red-200"></div>
            <span className="flex-shrink-0 mx-4 text-blue-600 text-sm font-medium">Or continue with</span>
            <div className="flex-grow border-t border-red-200"></div>
          </div>
          
          <button 
            type="button"
            className="w-full bg-gradient-to-r from-red-50 via-white to-blue-50 text-blue-800 py-4 rounded-2xl font-bold text-lg border-2 border-red-200 hover:border-blue-300 hover:from-red-100 hover:via-white hover:to-blue-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            Google
          </button>

          <div className="text-center pt-2">
            <p className="text-blue-700 font-medium">
              Don't have a store? <span className="text-red-600 font-bold cursor-pointer hover:underline hover:text-red-700" onClick={() => router.push("/auth/register")}>Create one now</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
