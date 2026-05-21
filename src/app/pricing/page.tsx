import Link from "next/link";
import { Check, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { getLang } from "@/lib/i18n";
import ShoporaHeader from "@/components/layout/ShoporaHeader";

const t = {
  en: {
    title: "Simple, Transparent Pricing",
    subtitle: "One plan, every feature included. Pick the cycle that fits your budget.",
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
    mostPopular: "Most Popular",
    bestValue: "Best Value",
    getStarted: "Get Started",
    featuresTitle: "Everything you need to succeed",
    featuresSubtitle: "All plans include complete access to our advanced multi-store suite.",
    features: [
      "Unlimited products",
      "Custom domain support",
      "All premium templates",
      "Analytics dashboard",
      "Order management",
      "Media library",
    ],
    backToHome: "Back to Home",
    footerText: "Powered by Shopora Infrastructure"
  },
  ar: {
    title: "أسعار بسيطة وشفافة",
    subtitle: "خطة واحدة، تشمل جميع الميزات. اختر الدورة التي تناسب ميزانيتك.",
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
    mostPopular: "الأكثر شعبية",
    bestValue: "أفضل قيمة",
    getStarted: "ابدأ الآن",
    featuresTitle: "كل ما تحتاجه للنجاح",
    featuresSubtitle: "تشمل جميع الخطط وصولاً كاملاً لمجموعة أدوات إدارة المتاجر المتقدمة لدينا.",
    features: [
      "منتجات غير محدودة",
      "دعم النطاق الخاص (دومين)",
      "جميع القوالب المميزة",
      "لوحة تحليلات وإحصائيات",
      "إدارة كاملة للطلبات",
      "مكتبة وسائط متكاملة",
    ],
    backToHome: "العودة للرئيسية",
    footerText: "مشغل بواسطة بنية شوبورا التحتية"
  }
};

export default async function PricingPage() {
  const lang = await getLang();
  const currentT = t[lang];

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
      badge: currentT.mostPopular,
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
      badge: currentT.bestValue,
      popular: false,
    },
  ];

  return (
    <div className={`min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-start p-6 sm:p-12 pb-24 text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Reusable Header */}
      <ShoporaHeader lang={lang} />

      {/* Background glow structures */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full z-10 space-y-20 pt-28">
        {/* Title / Hero section */}
        <div className="text-center space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Pricing Portal' : 'بوابة الاشتراكات'}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
            {currentT.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.03] bg-white/[0.02] hover:bg-white/[0.04] ${
                plan.border
              } ${plan.popular ? "shadow-[0_0_50px_rgba(6,182,212,0.12)] border-cyan-400/40" : "border-white/5"}`}
            >
              {/* Plan Badge */}
              {plan.badge && (
                <span
                  className={`absolute top-5 ${lang === 'ar' ? 'left-5' : 'right-5'} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    plan.popular
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                      : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              {/* Cycle Name */}
              <p className={`text-[10px] font-black uppercase tracking-[0.35em] mb-1 ${plan.text}`}>
                {plan.label}
              </p>
              <div className="h-6" />

              {/* Price block */}
              <div className="mb-2 flex items-end gap-1.5">
                <span className="text-5xl font-black text-white italic leading-none">${plan.price}</span>
                <span className="text-slate-500 text-xs font-bold mb-1">{currentT.mo}</span>
              </div>
              <p className="text-slate-500 text-[10px] font-bold">
                {plan.total} — {plan.billing}
              </p>
              
              {/* Savings label */}
              {plan.savings ? (
                <p className={`text-xs font-black mt-2 mb-6 ${plan.text}`}>
                  {plan.savings} {currentT.vsMonthly}
                </p>
              ) : (
                <div className="mb-8" />
              )}

              {/* Plan Features */}
              <ul className="space-y-3.5 flex-1 mb-8">
                {currentT.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.bg} border ${plan.checkBorder}`}
                    >
                      <Check className={`w-3.5 h-3.5 ${plan.text}`} strokeWidth={3.5} />
                    </span>
                    <span className="text-slate-400 text-xs font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href="/auth/register"
                className={`block w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all duration-300 border ${
                  plan.popular
                    ? "bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                    : `${plan.bg} ${plan.text} ${plan.checkBorder} hover:opacity-85`
                }`}
              >
                {currentT.getStarted}
              </Link>
            </div>
          ))}
        </div>

        {/* Extra Features Grid or Security Trust Badge */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>
              {lang === 'en' ? 'Secured by 256-bit encryption protocol' : 'مؤمن بالكامل ببروتوكول تشفير 256 بت'}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              {currentT.backToHome}
            </Link>
            <span>•</span>
            <span className="uppercase tracking-widest text-[10px] text-slate-600 font-bold">
              {currentT.footerText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
