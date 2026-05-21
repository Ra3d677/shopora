import Link from "next/link";
import { Store, ShieldCheck, ArrowRight, Zap, Sparkles } from "lucide-react";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Premium Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl w-full z-10 space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Next Generation Commerce</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 uppercase italic">
            Multo
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            The ultimate multi-tenant platform designed for scale, speed, and breathtaking user experiences.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-200">
          
          {/* Card 1: Login */}
          <Link 
            href="/auth/login"
            className="group relative flex flex-col items-center p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="h-20 w-20 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <ShieldCheck size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tight">Login</h2>
            <p className="text-slate-400 text-center text-sm font-medium leading-relaxed">
              Access your dashboard and manage your commerce empire.
            </p>
            <div className="mt-8 flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
              <span>Sign In</span> <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: Get Started */}
          <Link 
            href="/auth/register"
            className="group relative flex flex-col items-center p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <Zap size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tight">Start Now</h2>
            <p className="text-slate-400 text-center text-sm font-medium leading-relaxed">
              Deploy a high-performance storefront in seconds.
            </p>
            <div className="mt-8 flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
              <span>Create Account</span> <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Demo Store */}
          <Link 
            href="/store/shopaora"
            className="group relative flex flex-col items-center p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="h-20 w-20 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <Store size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tight">Demo</h2>
            <p className="text-slate-400 text-center text-sm font-medium leading-relaxed">
              Experience the power of our premium storefront templates.
            </p>
            <div className="mt-8 flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
              <span>View Store</span> <ArrowRight size={14} />
            </div>
          </Link>

        </div>
        
        {/* Footer Area */}
        <div className="text-center mt-16 pt-8 border-t border-white/5 animate-in fade-in duration-1000 delay-500">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
            Powered by Multo Architecture
          </p>
        </div>
      </div>
    </div>
  );
}
