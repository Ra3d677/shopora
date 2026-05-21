import Link from "next/link";
import { ShieldCheck, ArrowRight, Zap, Sparkles, Check } from "lucide-react";
import { getLang } from "@/lib/i18n";
import ShoporaHeader from "@/components/layout/ShoporaHeader";

export const dynamic = 'force-dynamic';

const homeT = {
  en: {
    badge: "Next Generation Commerce",
    title: "Shopora",
    subtitle: "The ultimate multi-tenant platform designed for scale, speed, and breathtaking user experiences.",
    loginCardTitle: "Login",
    loginCardDesc: "Access your dashboard and manage your commerce empire.",
    loginCardCta: "Sign In",
    startCardTitle: "Start Now",
    startCardDesc: "Deploy a high-performance storefront in seconds.",
    startCardCta: "Create Account",
    pricingBadge: "Subscription Plans",
    pricingTitle: "Simple Pricing",
    pricingSubtitle: "One plan, every feature included. Pick the cycle that fits your budget.",
    viewAllPlans: "Go to Pricing Page",
    footer: "Powered by Shopora Architecture",
    monthly: "Monthly",
    threeMonths: "3 Months",
    sixMonths: "6 Months",
    annual: "Annual",
    mo: "/ mo",
    billedMonthly: "billed monthly",
    billedThree: "billed every 3 months",
    billedSix: "billed every 6 months",
    billedAnnual: "billed annually",
    save: "Save",
    vsMonthly: "vs monthly",
    getStarted: "Get Started",
    features: [
      "Unlimited products",
      "Custom domain support",
      "All premium templates",
      "Analytics dashboard",
      "Order management",
      "Media library",
    ]
  },
  ar: {
    badge: "التجارة الإلكترونية من الجيل القادم",
    title: "شوبورا",
    subtitle: "المنصة المثالية متعددة المتاجر والمصممة للنمو، السرعة، والتجارب الاستثنائية للمستخدم.",
    loginCardTitle: "تسجيل الدخول",
    loginCardDesc: "ادخل إلى لوحة التحكم الخاصة بك وقم بإدارة إمبراطورية التجارة الخاصة بك.",
    loginCardCta: "تسجيل الدخول",
    startCardTitle: "ابدأ الآن",
    startCardDesc: "أنشئ وانشر متجرًا عالي الأداء في ثوانٍ معدودة.",
    startCardCta: "إنشاء حساب",
    pricingBadge: "خطط الاشتراك",
    pricingTitle: "أسعار بسيطة",
    pricingSubtitle: "خطة واحدة، تشمل جميع الميزات. اختر الدورة التي تناسب ميزانيتك.",
    viewAllPlans: "الانتقال لصفحة الأسعار",
    footer: "مشغل بواسطة بنية شوبورا التحتية",
    monthly: "شهري",
    threeMonths: "3 أشهر",
    sixMonths: "6 أشهر",
    annual: "سنوي",
    mo: "/ شهرياً",
    billedMonthly: "تدفع شهرياً",
    billedThree: "تدفع كل 3 أشهر",
    billedSix: "تدفع كل 6 أشهر",
    billedAnnual: "تدفع سنوياً",
    save: "وفر",
    vsMonthly: "مقارنة بالدفع الشهري",
    getStarted: "ابدأ الآن",
    features: [
      "منتجات غير محدودة",
      "دعم النطاق الخاص (دومين)",
      "جميع القوالب المميزة",
      "لوحة تحليلات وإحصائيات",
      "إدارة كاملة للطلبات",
      "مكتبة وسائط متكاملة",
    ]
  }
};

export default async function IndexPage() {
  const lang = await getLang();
  const currentT = homeT[lang];

  const plans = [
    {
      label: currentT.monthly,
      name: lang === 'en' ? "Monthly" : "شهري",
      price: 9,
      total: "$9",
      billing: currentT.billedMonthly,
      savings: null,
      color: "blue",
      border: "border-white/5",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      checkBorder: "border-blue-500/20",
      badge: null,
      popular: false,
    },
    {
      label: currentT.threeMonths,
      name: lang === 'en' ? "3 Months" : "3 أشهر",
      price: 7,
      total: "$21",
      billing: currentT.billedThree,
      savings: `${currentT.save} $6`,
      color: "emerald",
      border: "border-white/5",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      checkBorder: "border-emerald-500/20",
      badge: null,
      popular: false,
    },
    {
      label: currentT.sixMonths,
      name: lang === 'en' ? "6 Months" : "6 أشهر",
      price: 5.5,
      total: "$33",
      billing: currentT.billedSix,
      savings: `${currentT.save} $21`,
      color: "cyan",
      border: "border-cyan-400/40",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      checkBorder: "border-cyan-500/20",
      badge: lang === 'en' ? "Most Popular" : "الأكثر شعبية",
      popular: true,
    },
    {
      label: currentT.annual,
      name: lang === 'en' ? "Annual" : "سنوي",
      price: 4.5,
      total: "$54",
      billing: currentT.billedAnnual,
      savings: `${currentT.save} $54`,
      color: "purple",
      border: "border-white/5",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      checkBorder: "border-purple-500/20",
      badge: lang === 'en' ? "Best Value" : "أفضل قيمة",
      popular: false,
    },
  ];

  return (
    <div className={`min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-start p-6 sm:p-12 pb-24 text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Header */}
      <ShoporaHeader lang={lang} />

      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full z-10 space-y-20 pt-28">

        {/* ── Hero ── */}
        <div className="text-center space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{currentT.badge}</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 uppercase italic">
            {currentT.title}
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>

        {/* ── Nav Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-200">
          <Link
            href="/auth/login"
            className="group relative flex flex-col items-center p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="h-20 w-20 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <ShieldCheck size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tight">{currentT.loginCardTitle}</h2>
            <p className="text-slate-400 text-center text-sm font-medium leading-relaxed">
              {currentT.loginCardDesc}
            </p>
            <div className="mt-8 flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
              <span>{currentT.loginCardCta}</span><ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
            </div>
          </Link>

          <Link
            href="/auth/register"
            className="group relative flex flex-col items-center p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
              <Zap size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tight">{currentT.startCardTitle}</h2>
            <p className="text-slate-400 text-center text-sm font-medium leading-relaxed">
              {currentT.startCardDesc}
            </p>
            <div className="mt-8 flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
              <span>{currentT.startCardCta}</span><ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
            </div>
          </Link>
        </div>

        {/* ── Pricing ── */}
        <div className="animate-in fade-in duration-1000 delay-300">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">{currentT.pricingBadge}</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              {currentT.pricingTitle}
            </h2>
            <p className="text-slate-400 text-base font-medium max-w-lg mx-auto">
              {currentT.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col p-7 rounded-[2rem] border transition-all duration-500 hover:scale-[1.02] bg-white/[0.02] hover:bg-white/[0.04] ${plan.border} ${plan.popular ? "shadow-[0_0_50px_rgba(6,182,212,0.12)] border-cyan-400/40" : "border-white/5"}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className={`absolute top-5 ${lang === 'ar' ? 'left-5' : 'right-5'} px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${plan.popular ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-purple-500/20 text-purple-400 border-purple-500/30"}`}>
                    {plan.badge}
                  </span>
                )}

                {/* Name */}
                <p className={`text-[9px] font-black uppercase tracking-[0.35em] ${plan.text}`}>{plan.label}</p>
                <div className="h-4" />

                {/* Price */}
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-5xl font-black text-white italic leading-none">${plan.price}</span>
                  <span className="text-slate-500 text-xs font-bold mb-1">{currentT.mo}</span>
                </div>
                <p className="text-slate-600 text-[10px] font-bold">{plan.total} — {plan.billing}</p>
                {plan.savings ? (
                  <p className={`text-xs font-black mt-1 mb-6 ${plan.text}`}>{plan.savings} {currentT.vsMonthly}</p>
                ) : (
                  <div className="mb-6" />
                )}

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-7">
                  {currentT.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.bg} border ${plan.checkBorder}`}>
                        <Check className={`w-3 h-3 ${plan.text}`} strokeWidth={3} />
                      </span>
                      <span className="text-slate-400 text-[11px] font-medium">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/auth/register"
                  className={`block w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all duration-300 border ${
                    plan.popular
                      ? "bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                      : `${plan.bg} ${plan.text} ${plan.checkBorder} hover:opacity-80`
                  }`}
                >
                  {currentT.getStarted}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest text-xs transition-colors hover:gap-3"
            >
              <span>{currentT.viewAllPlans}</span>
              <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center pt-8 border-t border-white/5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
            {currentT.footer}
          </p>
        </div>

      </div>
    </div>
  );
}
