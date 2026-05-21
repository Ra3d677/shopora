import Link from "next/link";
import { ShieldCheck, ArrowRight, Zap, Sparkles, Check, Globe, BarChart3, Layout, Rocket, UserPlus, Settings, Star } from "lucide-react";
import { getMarketingLang } from "@/lib/i18n";
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
    ],
    featureTitle: "Everything You Need",
    featureSubtitle: "Built for modern commerce from the ground up.",
    features2: [
      { title: "Multi-Tenant", desc: "Manage multiple stores from one dashboard. Fully isolated and independently scalable." },
      { title: "Blazing Fast", desc: "Optimized for speed with edge-ready infrastructure. Your store loads in milliseconds." },
      { title: "Premium Templates", desc: "Stunning mobile-responsive templates. Customize every detail to match your brand." },
      { title: "Advanced Analytics", desc: "Track sales, traffic, and behavior with real-time dashboards and exportable reports." }
    ],
    howTitle: "How It Works",
    howSubtitle: "Launch your store in 3 simple steps.",
    steps: [
      { num: "01", title: "Create Account", desc: "Sign up in seconds with your email. No credit card required." },
      { num: "02", title: "Customize Store", desc: "Pick a template, add your products, configure your domain." },
      { num: "03", title: "Start Selling", desc: "Go live instantly. Accept orders, manage inventory, and grow." }
    ],
    ctaTitle: "Ready to Launch Your Store?",
    ctaSubtitle: "Join thousands of merchants using Shopora to power their commerce.",
    ctaBtn: "Create Your Store Now"
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
    ],
    featureTitle: "كل ما تحتاجه",
    featureSubtitle: "صُممت خصيصًا للتجارة الإلكترونية الحديثة من الألف إلى الياء.",
    features2: [
      { title: "متعدد المتاجر", desc: "أدر متاجر متعددة من لوحة تحكم واحدة. كل متجر مستقل قابل للتوسع بشكل منفصل." },
      { title: "سرعة فائقة", desc: "محسّن للسرعة مع بنية تحتية جاهزة للحافة. متجرك يتحمل في أجزاء من الثانية." },
      { title: "قوالب مميزة", desc: "قوالب مذهلة متجاوبة مع الجوال. خصص كل التفاصيل لتتناسب مع علامتك التجارية." },
      { title: "تحليلات متقدمة", desc: "تتبع المبيعات والزيارات وسلوك العملاء بلوحات بيانات فورية وتقارير قابلة للتصدير." }
    ],
    howTitle: "كيف تعمل",
    howSubtitle: "أطلق متجرك في 3 خطوات بسيطة.",
    steps: [
      { num: "۰۱", title: "إنشاء حساب", desc: "سجل في ثوانٍ باستخدام بريدك الإلكتروني. لا حاجة لبطاقة ائتمان." },
      { num: "۰۲", title: "تخصيص المتجر", desc: "اختر قالباً، أضف منتجاتك، واختر نطاقك الخاص." },
      { num: "۰۳", title: "ابدأ البيع", desc: "انطلق فوراً. استقبل الطلبات، وأدر المخزون، ونّمِ أعمالك." }
    ],
    ctaTitle: "مستعد لإطلاق متجرك؟",
    ctaSubtitle: "انضم إلى آلاف التجار الذين يستخدمون شوبورا لإدارة أعمالهم.",
    ctaBtn: "أنشئ متجرك الآن"
  }
};

export default async function IndexPage() {
  const lang = await getMarketingLang();
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{currentT.badge}</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 uppercase italic">
            {currentT.title}
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>

        {/* ── Features ── */}
        <div className="animate-in fade-in duration-1000 delay-200">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/60">{currentT.featureTitle}</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              {currentT.featureSubtitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Globe, color: "blue" },
              { icon: Zap, color: "emerald" },
              { icon: Layout, color: "cyan" },
              { icon: BarChart3, color: "purple" },
            ].map((feat, i) => {
              const f = currentT.features2[i];
              const colors = [
                { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
                { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
                { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
                { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
              ];
              const c = colors[i];
              const Icon = feat.icon;
              return (
                <div
                  key={f.title}
                  className="group relative flex flex-col p-7 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
                >
                  <div className={`w-12 h-12 ${c.bg} ${c.border} border rounded-2xl flex items-center justify-center ${c.text} mb-6 group-hover:scale-110 transition-all duration-500`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className={`text-lg font-black text-white uppercase italic mb-2`}>{f.title}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
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

        {/* ── How It Works ── */}
        <div className="animate-in fade-in duration-1000 delay-200">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/60">{currentT.howTitle}</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              {currentT.howSubtitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentT.steps.map((step, i) => (
              <div
                key={step.num}
                className="relative flex flex-col items-center text-center p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                  <span className="text-2xl font-black text-cyan-400">{step.num}</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase italic mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{step.desc}</p>
                {i < currentT.steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-cyan-400/30">
                    <ArrowRight size={24} className={lang === 'ar' ? 'rotate-180' : ''} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className="animate-in fade-in duration-1000 delay-300">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/60">{currentT.pricingBadge}</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              {currentT.pricingTitle}
            </h2>
            <p className="text-cyan-300/60 text-base font-medium max-w-lg mx-auto">
              {currentT.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col p-7 rounded-[2rem] border transition-all duration-500 hover:scale-[1.02] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 ${plan.border} ${plan.popular ? "shadow-[0_0_60px_rgba(6,182,212,0.2)] border-cyan-400/50" : "border-white/5"}`}
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

        {/* ── CTA ── */}
        <div className="relative text-center animate-in fade-in duration-1000 delay-200 p-14 rounded-[2.5rem] bg-gradient-to-br from-cyan-600/10 via-blue-700/10 to-purple-600/10 border border-white/5 overflow-hidden">
          <div className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <Star className="w-10 h-10 text-cyan-400 mx-auto" strokeWidth={1.5} />
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              {currentT.ctaTitle}
            </h2>
            <p className="text-cyan-300/60 text-base font-medium max-w-lg mx-auto">
              {currentT.ctaSubtitle}
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-3 mt-6 px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black text-lg hover:from-cyan-700 hover:to-blue-800 transition-all shadow-xl shadow-cyan-600/20 active:scale-[0.98]"
            >
              <Rocket size={22} />
              <span>{currentT.ctaBtn}</span>
              <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
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
