"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Star,
  Dumbbell,
  Users,
  Trophy,
  Target,
  Flame,
  Heart,
  Zap,
  ArrowRight,
  Quote,
  ChevronDown,
  Camera,
  Video,
  Link2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface FitnessProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function FitnessTemplate({
  banners,
  settings,
  products,
  slug,
  categories,
}: FitnessProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroBg =
    banners[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85";
  const coachName = settings.storeName || "Alex Morgan";
  const coachTitle = "ELITE PERFORMANCE COACH";
  const coachTagline = "Transform Your Body. Transform Your Life.";

  const stats = [
    { value: "500+", label: "Clients Trained", icon: Users },
    { value: "8+", label: "Years Experience", icon: Trophy },
    { value: "97%", label: "Success Rate", icon: Target },
    { value: "50+", label: "Programs", icon: Dumbbell },
  ];

  const features = [
    {
      icon: Dumbbell,
      title: "Personalized Training",
      desc: "Custom workout plans tailored to your body type, goals, and schedule.",
    },
    {
      icon: Heart,
      title: "Nutrition Coaching",
      desc: "Science-based meal plans that fuel your performance and accelerate results.",
    },
    {
      icon: Zap,
      title: "24/7 Support",
      desc: "Direct messaging with your coach. Accountability that never sleeps.",
    },
    {
      icon: Flame,
      title: "Progressive Overload",
      desc: "Systematic program progression to ensure continuous gains and breakthroughs.",
    },
  ];

  const faqs = [
    {
      q: "Do I need gym equipment?",
      a: "Not at all! Every program comes with both gym and home workout versions. You can train anywhere.",
    },
    {
      q: "How soon will I see results?",
      a: "Most clients notice changes within 2 weeks. Significant transformations typically occur within 8-12 weeks of consistent training.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Absolutely. No contracts, no hidden fees. Cancel with one click and keep all the materials you've received.",
    },
    {
      q: "Is this suitable for beginners?",
      a: "Yes! Programs are scaled for all levels — from complete beginners to advanced athletes. Every exercise includes modifications.",
    },
    {
      q: "What's included in the nutrition plan?",
      a: "You get a fully customized macronutrient plan, meal timing guide, grocery lists, and weekly check-ins to adjust as you progress.",
    },
  ];

  const defaultLayout = [
    { id: "sec-1", type: "hero" },
    { id: "sec-2", type: "stats" },
    { id: "sec-3", type: "about" },
    { id: "sec-4", type: "features" },
    { id: "sec-5", type: "programs" },
    { id: "sec-6", type: "testimonials" },
    { id: "sec-7", type: "cta" },
    { id: "sec-8", type: "faq" },
  ];

  const layout = settings.homepageLayout || defaultLayout;
  const defaultPrices = [
    { name: "Starter", price: 29, period: "month", features: ["Custom workout plan", "Nutrition guide", "Email support", "Progress tracking"], popular: false },
    { name: "Pro", price: 59, period: "month", features: ["Everything in Starter", "1-on-1 video coaching", "Custom meal plans", "24/7 WhatsApp support", "Weekly check-ins"], popular: true },
    { name: "Elite", price: 99, period: "month", features: ["Everything in Pro", "Daily check-ins", "Video form analysis", "Supplement protocol", "Priority booking"], popular: false },
  ];

  const heroData = settings.fitnessSettings?.hero || {};
  const aboutData = settings.fitnessSettings?.about || {};
  const testimonialData = settings.fitnessSettings?.testimonials || [];

  const renderHero = () => (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60 z-10"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30 z-10"
        />
        <img
          src={heroBg}
          alt="Hero"
          className="w-full h-full object-cover scale-105"
        />
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-8 backdrop-blur-sm">
            <Flame className="w-3.5 h-3.5" />
            <span>{heroData.badge || coachTitle}</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-6">
            {heroData.tagline || coachTagline}
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            {heroData.subtitle || "Science-backed training, personalized nutrition, and relentless support. Join 500+ clients who have transformed their bodies and lives."}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/store/${slug}#programs`}
              className="inline-flex items-center gap-3 bg-cyan-500 text-slate-950 h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/25 active:scale-[0.97]"
            >
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/store/${slug}#about`}
              className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.97]"
            >
              Meet Your Coach
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/30" />
      </div>
    </section>
  );

  const renderStats = () => (
    <section className="py-16 relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-4" />
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                {stat.value}
              </div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={aboutData.image || "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=85"}
                alt="Coach"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-500/20 rounded-full border border-cyan-500/30 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-black text-white">8+</div>
                <div className="text-[6px] font-black uppercase tracking-widest text-cyan-400">YEARS</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
              <Target className="w-3.5 h-3.5" />
              <span>{aboutData.badge || "ABOUT YOUR COACH"}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-[1.1] tracking-tight">
              {aboutData.title || "Built Different. Built for You."}
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {aboutData.desc1 || "With over 8 years of hands-on coaching experience and certifications in strength & conditioning, sports nutrition, and functional training, I've helped hundreds of clients transform from the inside out."}
            </p>
            <p className="text-slate-400 leading-relaxed">
              {aboutData.desc2 || "My philosophy is simple: no gimmicks, no shortcuts, just proven science and unwavering accountability. Whether you're looking to lose weight, build muscle, or perform at your peak — I'll build a system that works for your life."}
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-white font-black text-sm">NSCA Certified</div>
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Strength & Conditioning</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-white font-black text-sm">PN Level 1</div>
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Nutrition Coach</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderFeatures = () => (
    <section className="py-24 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>WHY CHOOSE US</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-[1.1] tracking-tight">
            What Sets Us Apart
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">
                {f.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderPrograms = () => {
    const style = settings.fitnessSettings?.programStyle || "cards";

    return (
      <section id="programs" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>TRAINING PROGRAMS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-[1.1] tracking-tight mb-4">
              Choose Your Path
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every program is fully customized to your body, goals, and lifestyle.
            </p>
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0
              ? products.map((product, idx) => {
                  const isMiddle = products.length > 1 && idx === Math.floor((products.length - 1) / 2);
                  return (
                    <div
                      key={product.id}
                      className={`relative rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 ${
                        isMiddle
                          ? "border-2 scale-[1.02] z-10"
                          : "bg-white/[0.02] border border-white/10 hover:border-white/20"
                      }`}
                      style={
                        isMiddle
                          ? {
                              background: "linear-gradient(145deg, rgba(6,182,212,0.08), #0a0c14)",
                              borderColor: "var(--dynamic-primary, #06b6d4)",
                            }
                          : {}
                      }
                    >
                      {isMiddle && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30">
                          Most Popular
                        </div>
                      )}
                      <div className="mb-6">
                        {product.images?.[0] && (
                          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-white/5">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-2xl font-black text-white mb-3 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed min-h-[60px]">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-4xl font-black text-white">
                          ${product.price}
                        </span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                          / program
                        </span>
                      </div>
                      {product.specs && product.specs.length > 0 && (
                        <div className="flex-1 mb-8">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                            What's Included
                          </div>
                          <ul className="space-y-3">
                            {product.specs.map((spec: any, si: number) => (
                              <li key={si} className="flex items-start gap-3">
                                <div className="mt-0.5 w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 text-cyan-400" strokeWidth={3} />
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-white block">
                                    {spec.label}
                                  </span>
                                  {spec.value && (
                                    <span className="text-xs text-slate-400 block">
                                      {spec.value}
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Link
                        href={`/store/${slug}/product/${product.id}`}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all block active:scale-[0.97] ${
                          isMiddle
                            ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-xl"
                            : "bg-white text-slate-950 hover:opacity-90"
                        }`}
                      >
                        Get Started
                      </Link>
                    </div>
                  );
                })
              : defaultPrices.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 ${
                      plan.popular
                        ? "border-2 scale-[1.02] z-10"
                        : "bg-white/[0.02] border border-white/10 hover:border-white/20"
                    }`}
                    style={
                      plan.popular
                        ? {
                            background: "linear-gradient(145deg, rgba(6,182,212,0.08), #0a0c14)",
                            borderColor: "var(--dynamic-primary, #06b6d4)",
                          }
                        : {}
                    }
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-xl font-black text-white mb-4">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-black text-white">${plan.price}</span>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/{plan.period}</span>
                    </div>
                    <div className="flex-1 mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feat, fi) => (
                          <li key={fi} className="flex items-start gap-3">
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-cyan-400" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-slate-300">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all active:scale-[0.97] ${
                      plan.popular
                        ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-xl"
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    }`}>
                      Get Started
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonials = () => {
    const reviews = testimonialData.length > 0
      ? testimonialData
      : [
          { name: "James Mitchell", role: "Lost 42 lbs in 16 weeks", content: "I've tried every program out there. Nothing compares to the level of personalization and accountability here. This isn't just a workout plan — it's a complete lifestyle overhaul.", rating: 5 },
          { name: "Sophia Chen", role: "Strength Athlete", content: "The coaching completely transformed my approach to training. I went from plateauing for months to hitting PRs every week. The nutrition guidance was a game-changer.", rating: 5 },
          { name: "Marcus Johnson", role: "Busy Professional", content: "With a 60-hour work week, I thought getting in shape was impossible. The custom scheduling and 15-minute workouts made it happen. Down 28 lbs and stronger than ever.", rating: 5 },
        ];

    return (
      <section id="testimonials" className="py-24 md:py-32 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Quote className="w-3.5 h-3.5" />
              <span>SUCCESS STORIES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-[1.1] tracking-tight">
              Real Results from Real People
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r: any, i: number) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-[2rem] p-8 relative hover:bg-white/[0.06] transition-all duration-300 group">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 group-hover:text-white/10 transition-all" />
                <div className="flex gap-1 mb-5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} fill="currentColor" size={14} />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed text-sm mb-7">
                  &ldquo;{r.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{r.name}</div>
                    {r.role && <div className="text-slate-500 text-xs">{r.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderCta = () => (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-transparent to-amber-600/20" />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-sm">
          <Flame className="w-3.5 h-3.5 text-cyan-400" />
          <span>LIMITED SPOTS AVAILABLE</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-[1.1] tracking-tight mb-6">
          Ready to Transform?
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Join 500+ clients who have already taken the first step. Your transformation starts with a single click.
        </p>
        <Link
          href={`/store/${slug}#programs`}
          className="inline-flex items-center gap-3 bg-cyan-500 text-slate-950 h-16 px-12 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/25 active:scale-[0.97]"
        >
          Claim Your Spot <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );

  const renderFaq = () => (
    <section id="faq" className="py-24 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <span>FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-[1.1] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-white font-bold text-sm">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6">
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div
      className="min-h-screen font-sans antialiased overflow-x-hidden"
      style={{
        background: "var(--color-bg-home, #05070a)",
        color: "var(--color-text-home, #f1f5f9)",
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Oswald:wght@500;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {layout.map((section: any) => {
        if (section.type === "hero") return renderHero();
        if (section.type === "stats") return renderStats();
        if (section.type === "about") return renderAbout();
        if (section.type === "features") return renderFeatures();
        if (section.type === "programs") return renderPrograms();
        if (section.type === "testimonials") return renderTestimonials();
        if (section.type === "cta") return renderCta();
        if (section.type === "faq") return renderFaq();
        return null;
      })}

      <footer className="py-16 border-t border-white/5" style={{ background: "var(--color-footer-bg, #030508)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-white font-black text-lg uppercase tracking-tight">
                {settings.storeName || "FITNESS COACH"}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Science-backed training, personalized nutrition, and unwavering accountability.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                  <Camera className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                  <Video className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                  <Link2 className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h4>
              <div className="flex flex-col gap-3">
                <Link href={`/store/${slug}`} className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">Home</Link>
                <Link href={`/store/${slug}#programs`} className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">Programs</Link>
                <Link href={`/store/${slug}#about`} className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">About</Link>
                <Link href={`/store/${slug}#faq`} className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">FAQ</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Contact</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>coach@{slug}.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>+1 (555) 000-0000</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Online Worldwide</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-slate-600 text-xs uppercase tracking-widest font-bold">
              &copy; 2026 {settings.storeName || "FITNESS COACH"}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
