"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star, ChevronDown, Check, ExternalLink } from "lucide-react";
import { useLanguageStore } from "@/store/language";

interface FitnessProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

function useIntersection(ref: React.RefObject<HTMLDivElement | null>, options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.unobserve(el); }
    }, { threshold: 0.2, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options]);
  return inView;
}

function AnimatedCounter({ target, suffix = "", inView }: { target: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <>{count}{suffix}</>;
}

function MarqueeBar({ items = [], separator = "✦", speed = 40 }: { items: string[]; separator?: string; speed?: number }) {
  const repeated = Array(6).fill(items).flat().map((i, idx) => ({ text: i, key: idx }));
  return (
    <div className="w-full overflow-hidden bg-black text-white py-3 md:py-4 border-y border-white/5">
      <div className="flex whitespace-nowrap gap-0" style={{ display: "flex", animation: `marquee ${speed}s linear infinite` }}>
        {repeated.map((item) => (
          <span key={item.key} className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mx-4 md:mx-6 flex items-center gap-4 md:gap-6">
            {item.text}
            <span className="text-emerald-400 opacity-60">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
      ))}
    </div>
  );
}

export default function FitnessTemplate({ banners, settings, slug }: FitnessProps) {
  const { language } = useLanguageStore();
  const isRtl = language === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  const fs = settings.fitnessSettings || {};
  const cs = settings.colorSystem || {};
  const brand = cs.brand?.primary || "#059669";
  const textPrimary = cs.text?.primary || "#0f172a";
  const pageBg = (cs.backgrounds as any)?.home || "#ffffff";
  const pageText = (cs.text as any)?.home || "#0f172a";
  const footerBg = cs.footer?.background || "#0f172a";
  const footerText = cs.footer?.text || "#ffffff";

  const rootVars = {
    "--brand": brand, "--page-bg": pageBg, "--page-text": pageText,
    "--text-primary": textPrimary, "--footer-bg": footerBg, "--footer-text": footerText,
  } as React.CSSProperties;

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useIntersection(statsRef);

  const hero = fs.hero || {};
  const marquee = fs.marquee || {};
  const services = fs.services || {};
  const transformations = fs.transformations || {};
  const pricing = fs.pricing || {};
  const testimonials = fs.testimonials || {};
  const about = fs.about || {};
  const footer = fs.footer || {};

  const DEFAULT_PLANS = [
    {
      id: "economy", name: isRtl ? "الباقة الاقتصادية" : "Economy Package",
      subtitle: "Follow-up with Sama Fit Team",
      price: "1500", currency: "£", duration: isRtl ? "+ شهر مجاني" : "+ 1 month free",
      popular: false, badge: "",
      features: [
        isRtl ? "متابعة أسبوعية لمراجعة الأداء وتقييم النتائج" : "Weekly follow-up to review performance",
        isRtl ? "برنامج تدريبي مخصص للمنزل أو الجيم" : "Customized training program for home or gym",
        isRtl ? "خطة تغذية شخصية شاملة" : "Comprehensive personalized nutrition plan",
        isRtl ? "الرد على الاستفسارات يومياً خلال ساعات العمل الرسمية" : "Daily response during working hours",
        isRtl ? "مراجعة التحاليل الطبية قبل البدء" : "Medical test review before starting",
        isRtl ? "استشارة علاج طبيعي" : "Physical therapy consultation",
        isRtl ? "ساعات المتابعة الرسمية من 9 ص إلى 5 م" : "Official follow-up hours 9 AM to 5 PM",
      ],
      ctaText: isRtl ? "ابدأ الباقة الاقتصادية" : "Start Economy Now"
    },
    {
      id: "pro", name: isRtl ? "الباقة الاحترافية" : "Pro Package",
      subtitle: "Follow-up with Sama Fit Team",
      price: "2500", currency: "£", duration: isRtl ? "+ 3 أشهر مجاناً" : "+ 3 months free",
      popular: true, badge: isRtl ? "الأكثر طلباً" : "Most Popular",
      features: [
        isRtl ? "متابعة يومية لتقييم الأداء" : "Daily follow-up to assess performance",
        isRtl ? "برنامج تدريبي مخصص للمنزل أو الجيم" : "Customized training program",
        isRtl ? "خطة تغذية شخصية شاملة" : "Comprehensive personalized nutrition plan",
        isRtl ? "خدمة تنظيم الوقت بين الوجبات والتمارين" : "Time management service",
        isRtl ? "مراجعة التحاليل الطبية قبل البدء" : "Medical test review",
        isRtl ? "استشارة علاج طبيعي" : "Physical therapy consultation",
        isRtl ? "ساعات المتابعة الرسمية من 9 ص إلى 5 م" : "Official follow-up hours 9 AM to 5 PM",
      ],
      ctaText: isRtl ? "ابدأ الباقة الاحترافية" : "Start Pro Now"
    },
    {
      id: "premium", name: isRtl ? "الباقة الممتازة" : "Premium Package",
      subtitle: isRtl ? '"مصممة لأصحاب الجداول المزدحمة"' : '"Designed for very busy schedules"',
      price: "3500", currency: "£", duration: isRtl ? "+ 3 أشهر مجاناً" : "+ 3 months free",
      popular: false, badge: "",
      features: [
        isRtl ? "توصيل يومي لجدول الوجبات والتمارين" : "Daily delivery of meal/workout schedules",
        isRtl ? "متابعة يومية لتقييم الأداء" : "Daily follow-up for performance evaluation",
        isRtl ? "خدمة تنظيم الوقت" : "Time management service",
        isRtl ? "برنامج تدريبي مخصص" : "Customized training program",
        isRtl ? "خطة تغذية شخصية" : "Personalized nutrition plan",
        isRtl ? "مراجعة التحاليل الطبية" : "Medical test review",
        isRtl ? "ساعات المتابعة الرسمية من 9 ص إلى 5 م" : "Official follow-up hours 9 AM to 5 PM",
      ],
      ctaText: isRtl ? "ابدأ الباقة الممتازة" : "Start Premium Now"
    },
    {
      id: "diamond", name: isRtl ? "الباقة الماسية" : "Diamond Package",
      subtitle: isRtl ? '"للباحثين عن أعلى مستوى من الرعاية"' : '"Highest level of care"',
      price: "6500", currency: "£", duration: isRtl ? "+ 3 أشهر مجاناً" : "+ 3 months free",
      popular: false, badge: "",
      features: [
        isRtl ? "3 مكالمات فيديو شهرياً مع الفريق المتخصص" : "Three monthly video calls with specialist team",
        isRtl ? "متابعة يومية مكثفة من 9 ص إلى 9 م" : "Intensive daily follow-up 9 AM to 9 PM",
        isRtl ? "خطط تغذية وتمارين يومية مخصصة" : "Daily customized nutrition/workout plans",
        isRtl ? "دعم خاص لحالات الإصابات بعد التأهيل" : "Special support for post-rehabilitation",
        isRtl ? "متابعة علاج طبيعي يومية" : "Daily physical therapy follow-up",
        isRtl ? "برنامج متخصص لتصحيح الانحرافات القوامية" : "Specialized postural correction program",
      ],
      ctaText: isRtl ? "ابدأ الباقة الماسية" : "Start Diamond Now"
    },
    {
      id: "health-coaching", name: isRtl ? "باقة Health Coaching" : "Health Coaching Package",
      subtitle: "",
      price: "7000", currency: "£", duration: isRtl ? "+ 3 أشهر مجاناً" : "+ 3 months free",
      popular: false, badge: "",
      features: [
        isRtl ? "متابعة مباشرة مع فريق ساما فيت" : "Intensive direct follow-up with Sama Fit team",
        isRtl ? "جلسات فيديو أسبوعية مع مدرب صحي" : "Weekly video calls with health coach",
        isRtl ? "مكالمات شهرية مع أخصائي التغذية والمدرب" : "Monthly calls with nutritionist and trainer",
        isRtl ? "متابعة يومية من 9 ص إلى 5 م" : "Daily follow-up 9 AM to 5 PM",
        isRtl ? "دعم نفسي يومي" : "Daily psychological support",
        isRtl ? "برنامج تمارين مخصص بالكامل" : "Fully customized workout program",
        isRtl ? "خطة وجبات وتمارين يومية" : "Daily meal plan and workout program",
        isRtl ? "مجموعة تليجرام خاصة لكل عميل" : "Private Telegram group for each client",
      ],
      ctaText: isRtl ? "ابدأ الباقة الصحية" : "Start Health Coaching Now"
    }
  ];

  const SERVICE_ICONS: Record<string, string> = {
    nutrition: "🥗", therapy: "🦴", followup: "💬", medical: "📋", workout: "🏋️", coaching: "🎯"
  };

  const DEFAULT_SERVICES = [
    { icon: "nutrition", title: isRtl ? "برنامج تغذية" : "Nutrition Program", description: isRtl ? "برنامج تغذية مخصص لأهدافك واحتياجات جسمك، مصمم علمياً ليتناسب مع أنواع الطعام المتاحة وتفضيلاتك وتطور جسمك." : "A nutrition program tailored to your goals and body needs." },
    { icon: "therapy", title: isRtl ? "علاج طبيعي" : "Physical Therapy", description: isRtl ? "يهدف برنامج العلاج الطبيعي إلى تحقيق تعافي آمن وأداء طويل المدى من خلال تمارين تأهيل مخصصة." : "The physical therapy program aims for safe recovery." },
    { icon: "followup", title: isRtl ? "متابعة" : "Follow-up", description: isRtl ? "فريق دعم متخصص من المدربين وأخصائيي التغذية متاح للرد على جميع الاستفسارات." : "A specialized support team available for all inquiries." },
    { icon: "medical", title: isRtl ? "تاريخ مرضى" : "Medical History", description: isRtl ? "متابعة شاملة للتاريخ المرضي والعائلي للعميل لتحديد التعارضات الصحية المحتملة." : "Comprehensive follow-up of medical and family history." },
    { icon: "workout", title: isRtl ? "برامج تمارين" : "Workout Programs", description: isRtl ? "برامج تدريبية يمكن أداؤها في أي مكان باستخدام أدوات بسيطة." : "Training programs that can be performed anywhere." },
    { icon: "coaching", title: isRtl ? "تثقيف صحي" : "Health Coaching", description: isRtl ? "يساعدك برنامج التثقيف الصحي على بناء عادات صحية مستدامة." : "Health coaching helps build sustainable healthy habits." },
  ];

  const DEFAULT_TRANSFORMATIONS = [
    { id: "t1", name: "Ahmed", before: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80", after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80" },
    { id: "t2", name: "Amr", before: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80", after: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80" },
    { id: "t3", name: "Kamel", before: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80", after: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
    { id: "t4", name: "Moaz", before: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80", after: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80" },
    { id: "t5", name: "Mohamed", before: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", after: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80" },
    { id: "t6", name: "Mostafa", before: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80", after: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" },
    { id: "t7", name: "Tamer", before: "https://images.unsplash.com/photo-1553882809-a4f57e595701?w=600&q=80", after: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80" },
    { id: "t8", name: "Yousef", before: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80", after: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=600&q=80" },
  ];

  const DEFAULT_TESTIMONIALS = [
    { name: "أحمد", role: "خسر 15 كجم", content: "الحمد لله كل شيء تمام! برنامج كامل ومتكامل ومتناسق مع بعضه. أحجام الأكل مناسبة. ربنا يوفقكم يا رب 🌹", rating: 5 },
    { name: "مريم", role: "متخصصة تغذية", content: "صراحة البرنامج رهيب ومتكامل. خلصت المطلوب من البرنامج بالكامل!", rating: 5 },
    { name: "خالد", role: "رب أسرة", content: "مريح جداً وأسهل في الالتزام. رغم أنه من البيت إلا أنه نتائجه خيالية! مع توجيهاتك أصبحت على بعد خطوة من هدفي 😂", rating: 5 },
    { name: "سارة", role: "موظفة", content: "خدمة ممتازة واهتمام بالتفاصيل. البرنامج منظم جداً وفريق الدعم متعاون. أنا متحمسة جداً للاستمرار وواثقة إني راح أوصل لنتائجي", rating: 5 },
    { name: "محمد", role: "مدرب", content: "أكثر شخص مبسوط إني مشتركت معاكم. صراحة أول مرة أشوف أحد يسلم برنامج بهالشكل المنظم. جزاكم الله خير ❤️", rating: 5 },
    { name: "نور", role: "ربة منزل", content: "البرنامج مرررة حلو ومريح ولاحظت تغير إيجابي كبير في وزني وشكلي. قلت لكل اللي أعرفهم عنكم وبجدد معاكوا تاني أكيد ❤️😍", rating: 5 },
  ];

  const statsItems = hero.stats?.length ? hero.stats : [
    { value: 20, suffix: "k+", label: isRtl ? "أكثر من 20 ألف شخص غيروا حياتهم معنا" : "Over 20,000 people transformed" },
  ];

  const serviceItems = services.items?.length ? services.items : DEFAULT_SERVICES;
  const transformItems = transformations.items?.length ? transformations.items : DEFAULT_TRANSFORMATIONS;
  const plans = pricing.plans?.length ? pricing.plans : DEFAULT_PLANS;
  const testimonialItems = testimonials.items?.length ? testimonials.items : DEFAULT_TESTIMONIALS;

  const heroBg = banners[0]?.imageUrl || hero.backgroundImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85";
  const runnerImage = hero.runnerImage || "";
  const lightningImage = hero.lightningImage || "";
  const logoUrl = settings.logoUrl || "";
  const avatarImages = hero.avatars?.filter(Boolean) || [];

  return (
    <div dir={dir} className="fitness-colors min-h-screen font-sans antialiased overflow-x-hidden" style={rootVars}>
      <style jsx global>{`
        @font-face { font-family: 'Cairo'; src: url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap'); }
        body { font-family: ${isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif"}; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes promoMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes promoMarquee2 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }

        /* Dynamic color overrides */
        .fitness-colors { background: var(--page-bg); color: var(--page-text); }
        .fitness-colors .bg-emerald-600 { background-color: var(--brand); }
        .fitness-colors .bg-emerald-700 { background-color: color-mix(in srgb, var(--brand) 85%, black); }
        .fitness-colors .text-emerald-600 { color: var(--brand); }
        .fitness-colors .text-emerald-700 { color: color-mix(in srgb, var(--brand) 85%, black); }
        .fitness-colors .text-emerald-800 { color: color-mix(in srgb, var(--brand) 70%, black); }
        .fitness-colors .border-emerald-600 { border-color: var(--brand); }
        .fitness-colors .border-emerald-200 { border-color: color-mix(in srgb, var(--brand) 30%, transparent); }
        .fitness-colors .border-emerald-500\/30 { border-color: color-mix(in srgb, var(--brand) 30%, transparent); }
        .fitness-colors .from-emerald-600 { --tw-gradient-from: var(--brand); }
        .fitness-colors .to-emerald-700 { --tw-gradient-to: color-mix(in srgb, var(--brand) 85%, black); }
        .fitness-colors .ring-emerald-500 { --tw-ring-color: var(--brand); }
        .fitness-colors .divide-emerald-800\/30 > * + * { border-color: color-mix(in srgb, var(--brand) 30%, transparent); }
        .fitness-colors .hover\:text-emerald-600:hover { color: var(--brand); }
        .fitness-colors .hover\:bg-emerald-50:hover { background-color: color-mix(in srgb, var(--brand) 10%, transparent); }
        .fitness-colors .hover\:bg-emerald-100:hover { background-color: color-mix(in srgb, var(--brand) 20%, transparent); }
        .fitness-colors .hover\:bg-emerald-500:hover { background-color: var(--brand); }
        .fitness-colors .bg-emerald-50 { background-color: color-mix(in srgb, var(--brand) 10%, transparent); }
        /* Footer */
        .fitness-colors .bg-slate-900 { background-color: var(--footer-bg); }
        .fitness-colors .text-slate-300 { color: var(--footer-text); }
        .fitness-colors .text-slate-400 { color: color-mix(in srgb, var(--footer-text) 70%, transparent); }
        .fitness-colors .hover\:text-white:hover { color: var(--footer-text); }
        .fitness-colors .border-slate-700\/30 { border-color: color-mix(in srgb, var(--footer-text) 20%, transparent); }
        .fitness-colors .border-slate-700 { border-color: color-mix(in srgb, var(--footer-text) 30%, transparent); }
        .fitness-colors .text-slate-500 { color: var(--text-primary); opacity: 0.5; }
        .fitness-colors .text-slate-600 { color: var(--text-primary); opacity: 0.6; }
        .fitness-colors .border-slate-200 { border-color: color-mix(in srgb, var(--text-primary) 15%, transparent); }
        .fitness-colors .border-slate-100 { border-color: color-mix(in srgb, var(--text-primary) 10%, transparent); }
      `}</style>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt={settings.storeName || "Sama Fit"} className="h-8 md:h-10 w-auto object-contain" />
              ) : (
                <span className="text-xl md:text-2xl font-black italic tracking-tight text-black">
                  {settings.storeName || "Sama Fit"}
                </span>
              )}
            </div>

            <nav className={`hidden lg:flex items-center gap-1 ${isRtl ? "mr-auto ml-6" : "ml-auto mr-6"}`}>
              {(footer.links?.length ? footer.links : [
                { label: "Home", url: `/store/${slug}` },
                { label: "Packages", url: `/store/${slug}#pricing` },
                { label: "About Us", url: `/store/${slug}#about` },
              ]).slice(0, 6).map((link: any, i: number) => (
                <Link key={i} href={link.url || "#"} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href={`tel:${footer.contact?.phone || ""}`} className="hidden md:flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors">
                <span>{footer.contact?.phone || ""}</span>
              </a>
              <Link href={`/store/${slug}#pricing`} className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                {isRtl ? "ابدأ الآن" : "Subscribe"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      {hero.enabled !== false && (
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[80vh] items-center ${isRtl ? "lg:direction-rtl" : ""}`}>
            {/* Left: Text */}
            <div className={`py-16 md:py-24 lg:py-32 ${isRtl ? "order-2 lg:order-1" : ""}`}>
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {hero.badge || "ELITE ONLINE COACHING"}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 text-slate-900">
                  {hero.title || (
                    <>
                      Advance Like
                      <br />
                      <span className="text-emerald-600">Lightning</span>
                    </>
                  )}
                </h1>

                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                  {hero.subtitle || "Training and nutrition plans scientifically designed to help you reach peak performance."}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href={hero.primaryCta?.link || `/store/${slug}#about`} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200/50">
                    {hero.primaryCta?.text || (isRtl ? "عن ساما فيت" : "About Us")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href={hero.secondaryCta?.link || `/store/${slug}#pricing`} className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:border-emerald-300 hover:text-emerald-600 transition-all">
                    {hero.secondaryCta?.text || (isRtl ? "اشترك الآن" : "Subscribe Now")}
                  </Link>
                </div>

                {/* Stats + Avatars */}
                <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-100" ref={statsRef}>
                  {avatarImages.length > 0 && (
                    <div className="flex -space-x-2">
                      {avatarImages.map((url: string, i: number) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900">
                      {statsInView ? <AnimatedCounter target={parseInt(String(statsItems[0]?.value)) || 20} suffix={statsItems[0]?.suffix || "k+"} inView={statsInView} /> : `0${statsItems[0]?.suffix || "k+"}`}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{statsItems[0]?.label || ""}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className={`relative ${isRtl ? "order-1 lg:order-2" : ""}`}>
              <div className="relative lg:min-h-[600px] flex items-center justify-center">
                {runnerImage ? (
                  <div className="relative animate-float">
                    <img src={runnerImage} alt="Runner" className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl" />
                  </div>
                ) : (
                  <div className="w-full max-w-md aspect-[4/5] rounded-[3rem] bg-gradient-to-br from-emerald-100 to-teal-50 overflow-hidden shadow-2xl">
                    <img
                      src={heroBg}
                      alt="Hero"
                      className="w-full h-full object-cover mix-blend-multiply opacity-80"
                    />
                  </div>
                )}
                {lightningImage && (
                  <div className="absolute -top-6 -right-6 w-20 h-20 animate-bounce">
                    <img src={lightningImage} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ===== MARQUEE ===== */}
      <MarqueeBar
        items={marquee.items?.length ? marquee.items : ["FITNESS", "NUTRITION", "LIFESTYLE", "HEALTH COACHING"]}
        separator={marquee.separator || "✦"}
        speed={marquee.speed || 40}
      />

      {/* ===== SERVICES ===== */}
      {services.enabled !== false && (
      <section id="services" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">
              {services.badge || (isRtl ? "خدماتنا" : "Our Services")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              {services.title || (isRtl ? "خدمات ساما فيت" : "Explore Our Services")}
            </h2>
            {services.subtitle && (
              <p className="text-slate-500 max-w-2xl mx-auto">{services.subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {serviceItems.slice(0, 6).map((svc: any, i: number) => (
              <div key={i} className="group bg-slate-50 rounded-2xl p-6 md:p-8 hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 border border-slate-100 hover:border-emerald-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl mb-5 group-hover:bg-emerald-200 transition-colors">
                  {SERVICE_ICONS[svc.icon] || svc.icon || "💪"}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{svc.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ===== TRANSFORMATIONS ===== */}
      {transformations.enabled !== false && transformItems.length > 0 && (
        <section id="transformations" className="py-20 md:py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">
                {transformations.badge || (isRtl ? "تحولات حقيقية" : "Real Transformations")}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                {transformations.title || (isRtl ? "جدار العظمة" : "Wall of Greatness")}
              </h2>
              {transformations.subtitle && (
                <p className="text-slate-500 max-w-2xl mx-auto text-sm">{transformations.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {transformItems.slice(0, 24).map((t: any, i: number) => (
                <div key={t.id || i} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full overflow-hidden">
                      <img src={t.before} alt="Before" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded">
                        {isRtl ? "قبل" : "Before"}
                      </div>
                    </div>
                    <div className="w-1/2 h-full overflow-hidden">
                      <img src={t.after} alt="After" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded">
                        {isRtl ? "بعد" : "After"}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PROMO MARQUEE (TOP) ===== */}
      {pricing.enabled !== false && (
      <div className="w-full overflow-hidden bg-emerald-600 text-white py-3 md:py-3.5 border-y border-emerald-500/30">
        <div className="flex whitespace-nowrap" style={{ animation: `promoMarquee ${pricing.topMarqueeSpeed || 30}s linear infinite` }}>
          {[...Array(10)].flatMap(() => (pricing.promoTopItems?.length ? pricing.promoTopItems : [
            isRtl ? "🔥 عرض خاص   احجز الآن واحصل على شهر مجاني" : "🔥 SPECIAL OFFER   Book now and get 1 month free",
            isRtl ? "💪 ابدأ رحلة تحولك اليوم   خصم 50% على الباقة الأولى" : "💪 Start your transformation today   50% off first package",
          ])).map((text: string, i: number) => (
            <span key={i} className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] mx-6 md:mx-10 flex items-center gap-6 md:gap-10">
              {text}
              <span className="text-emerald-200/50 text-lg">✦</span>
            </span>
          ))}
        </div>
      </div>
      )}

      {/* ===== PRICING ===== */}
      {pricing.enabled !== false && (
      <section id="pricing" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">
              {pricing.badge || (isRtl ? "خطط الأسعار" : "Plans & Pricing")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              {pricing.title || (isRtl ? "اختر باقتك" : "Choose Your Plan")}
            </h2>
            {pricing.subtitle && (
              <p className="text-slate-500 max-w-2xl mx-auto">{pricing.subtitle}</p>
            )}
          </div>

          {/* Duration Period Tabs */}
          <div className="flex justify-center gap-2 md:gap-3 mb-12">
            {(pricing.periods?.length ? pricing.periods : [
              { label: isRtl ? "شهر واحد" : "1 Month", active: false },
              { label: isRtl ? "3 أشهر" : "3 Months", active: true },
              { label: isRtl ? "6 أشهر" : "6 Months", active: false },
              { label: isRtl ? "12 شهر" : "12 Months", active: false },
            ]).map((period: any, i: number) => (
              <button key={i}
                className={`px-5 md:px-8 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${
                  period.active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-white text-slate-500 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                }`}>
                {period.label}
              </button>
            ))}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center max-w-7xl mx-auto">
            {plans.slice(0, 8).map((plan: any, idx: number) => {
              const isPopular = plan.popular;
              const isLastInOddRow = plans.length > 4 && idx === plans.length - 1 && plans.length % 4 !== 0;
              return (
                <div key={plan.id || idx}
                  className={`w-full ${isLastInOddRow ? "xl:col-span-full xl:max-w-sm xl:justify-self-center" : ""} ${isPopular ? "xl:scale-105 z-10" : ""}`}>
                  <div className={`relative h-full rounded-[1.75rem] p-7 md:p-8 border-2 transition-all duration-300 hover:shadow-2xl flex flex-col ${
                    isPopular
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xl shadow-emerald-200/60"
                      : "bg-white text-slate-900 border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1"
                  }`}>
                    {/* Badge Ribbon */}
                    {(plan.badge || isPopular) && (
                      <div className={`absolute -top-3 ${isRtl ? "right-6" : "left-6"} px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
                        isPopular ? "bg-white text-emerald-700" : "bg-emerald-600 text-white"
                      }`}>
                        {plan.badge || (isPopular ? (isRtl ? "الأفضل" : "BEST VALUE") : "")}
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-5">
                      <div className={`inline-block px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest mb-3 ${
                        isPopular ? "bg-emerald-500/40 text-emerald-100" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {plan.id || (isRtl ? "باقة" : "Plan")}
                      </div>
                      <h3 className={`text-xl md:text-2xl font-black leading-tight ${isPopular ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                      {plan.subtitle && (
                        <p className={`text-[11px] leading-relaxed mt-1 ${isPopular ? "text-emerald-100/80" : "text-slate-400"}`}>{plan.subtitle}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-5 pb-5" style={{ borderBottom: isPopular ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.06)" }}>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-sm font-bold uppercase tracking-wider ${isPopular ? "text-emerald-100" : "text-slate-400"}`}>{plan.currency || "£"}</span>
                        <span className={`text-4xl md:text-5xl font-black tracking-tight ${isPopular ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                      </div>
                      {plan.duration && (
                        <span className={`inline-block mt-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                          isPopular ? "bg-emerald-500/40 text-emerald-100" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {plan.duration}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-1">
                      <ul className="space-y-3.5">
                        {(plan.features || []).slice(0, 8).map((feature: string, fi: number) => (
                          <li key={fi} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isPopular ? "bg-emerald-500/40" : "bg-emerald-100"
                            }`}>
                              <Check className={`w-3 h-3 ${isPopular ? "text-white" : "text-emerald-600"}`} strokeWidth={3} />
                            </div>
                            <span className={`text-[12px] leading-relaxed ${isPopular ? "text-emerald-50" : "text-slate-600"}`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <button className={`mt-7 w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-[0.97] ${
                      isPopular
                        ? "bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-emerald-500/20"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg"
                    }`}>
                      {plan.ctaText || (isRtl ? "ابدأ الآن" : "Get Started")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ===== PROMO MARQUEE (BOTTOM) ===== */}
      {pricing.enabled !== false && (
      <div className="w-full overflow-hidden bg-emerald-600 text-white py-3 md:py-3.5 border-y border-emerald-500/30">
        <div className="flex whitespace-nowrap" style={{ animation: `promoMarquee2 ${pricing.bottomMarqueeSpeed || 35}s linear infinite` }}>
          {[...Array(10)].flatMap(() => (pricing.promoBottomItems?.length ? pricing.promoBottomItems : [
            isRtl ? "🎯 نتائج مضمونة   أكثر من 20 ألف عميل حولوا حياتهم" : "🎯 Guaranteed Results   Over 20,000 clients transformed",
            isRtl ? "⭐ تقييم 5 نجوم   انضم لألاف العملاء السعداء" : "⭐ 5-Star Rating   Join thousands of happy clients",
          ])).map((text: string, i: number) => (
            <span key={i} className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] mx-6 md:mx-10 flex items-center gap-6 md:gap-10">
              {text}
              <span className="text-emerald-200/50 text-lg">✦</span>
            </span>
          ))}
        </div>
      </div>
      )}

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.enabled !== false && testimonialItems.length > 0 && (
        <section id="testimonials" className="py-20 md:py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-emerald-600 text-xs font-bold uppercase tracking-[0.25em] mb-3">
                {testimonials.badge || (isRtl ? "ماذا يقول عملاؤنا" : "Testimonials")}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                {testimonials.title || (isRtl ? "ماذا يقول عملاؤنا عنا" : "What Our Clients Say About Us")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonialItems.slice(0, 12).map((r: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-6 md:p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all duration-300">
                  <StarRating rating={r.rating || 5} />
                  <p className="text-slate-600 text-sm leading-relaxed mt-4 mb-5">
                    &ldquo;{r.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm">
                      {(r.name || "?").charAt(0)}
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold text-sm">{r.name}</div>
                      {r.role && <div className="text-slate-400 text-xs">{r.role}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== ABOUT / CTA ===== */}
      {about.enabled !== false && (
      <section id="about" className="py-20 md:py-28 bg-gradient-to-br from-emerald-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-[80px]" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-emerald-300 blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            {about.title || (isRtl ? "قصص حقيقية، أناس حقيقيون، تحولات حقيقية" : "Real Stories, Real People, Real Transformations.")}
          </h2>
          <p className="text-emerald-100 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {about.text || (isRtl ? "تجارب حقيقية لأشخاص حولوا أهدافهم الرياضية إلى واقع باستخدام تطبيقنا." : "Real experiences from people who turned their fitness goals into reality.")}
          </p>
          <Link href={about.ctaLink || `/store/${slug}#pricing`} className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-emerald-50 transition-all shadow-2xl">
            {about.ctaText || (isRtl ? "انضم اليوم" : "Join Today")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      )}

      {/* ===== FOOTER ===== */}
      {footer.enabled !== false && (
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo + Social */}
            <div className="space-y-5">
              {footer.logo ? (
                <img src={footer.logo} alt={settings.storeName} className="h-10 w-auto" />
              ) : (
                <div className="text-xl font-black italic tracking-tight text-white">{settings.storeName || "Sama Fit"}</div>
              )}
              <p className="text-slate-400 text-sm leading-relaxed">{footer.description || ""}</p>
              <div className="flex gap-3">
                {(footer.socialLinks || []).map((s: any, i: number) => (
                  <a key={i} href={s.url} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-slate-400 hover:text-white">
                    <span className="text-xs">{s.icon || "🔗"}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Links</h4>
              <div className="flex flex-col gap-3">
                {(footer.links?.length ? footer.links : [
                  { label: "Home", url: `/store/${slug}` },
                  { label: "Packages", url: `/store/${slug}#pricing` },
                ]).map((link: any, i: number) => (
                  <Link key={i} href={link.url || "#"} className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">{isRtl ? "تواصل معنا" : "Get in Touch"}</h4>
              <div className="flex flex-col gap-3 text-sm text-slate-400">
                {footer.contact?.address && <span>{footer.contact.address}</span>}
                {footer.contact?.email && (
                  <a href={`mailto:${footer.contact.email}`} className="hover:text-emerald-400 transition-colors">{footer.contact.email}</a>
                )}
                {footer.contact?.phone && (
                  <a href={`tel:${footer.contact.phone}`} className="hover:text-emerald-400 transition-colors">{footer.contact.phone}</a>
                )}
              </div>
            </div>

            {/* App Store */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">{isRtl ? "حمل التطبيق" : "Download App"}</h4>
              <div className="flex flex-col gap-3">
                {footer.appStore?.ios && (
                  <a href={footer.appStore.ios} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-3 rounded-xl text-sm font-bold text-white">
                    <ExternalLink className="w-4 h-4" /> App Store
                  </a>
                )}
                {footer.appStore?.android && (
                  <a href={footer.appStore.android} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-3 rounded-xl text-sm font-bold text-white">
                    <ExternalLink className="w-4 h-4" /> Play Store
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-wider">&copy; {new Date().getFullYear()} {settings.storeName || "Fitness Coach"}. {isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
