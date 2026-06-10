"use client";

import React, { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save, Loader2, Plus, X, ArrowUp, ArrowDown, ExternalLink, Trash2, GripVertical
} from "lucide-react";
import { saveStoreSettings } from "../actions";
import { useLanguageStore } from "@/store/language";
import { toast } from "sonner";

export default function IronPeakDashboard({
  slug, initialSettings
}: {
  slug: string; initialSettings: any; storeName: string;
}) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [tab, setTab] = useState("hero");

  const ip = settings.ironpeakSettings || {};

  const setNested = (path: string, value: any) => {
    const parts = path.split(".");
    const newIp = JSON.parse(JSON.stringify(ip || {}));
    let obj = newIp;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    setSettings((prev: any) => ({ ...prev, ironpeakSettings: newIp }));
  };

  const save = () => {
    startTransition(async () => {
      try {
        await saveStoreSettings(slug, settings);
        toast.success(isAr ? "✓ تم الحفظ" : "✓ Saved");
        router.refresh();
      } catch {
        toast.error(isAr ? "✗ فشل الحفظ" : "✗ Save failed");
      }
    });
  };

  const TABS = [
    { id: "hero", icon: "🔥", label: isAr ? "الهيرو" : "Hero" },
    { id: "about", icon: "ℹ️", label: isAr ? "عن" : "About" },
    { id: "services", icon: "⚡", label: isAr ? "الخدمات" : "Services" },
    { id: "pricing", icon: "💎", label: isAr ? "الباقات" : "Pricing" },
    { id: "trainers", icon: "👤", label: isAr ? "المدربين" : "Trainers" },
    { id: "testimonials", icon: "💬", label: isAr ? "الآراء" : "Testimonials" },
    { id: "blog", icon: "📰", label: isAr ? "المدونة" : "Blog" },
    { id: "contact", icon: "📬", label: isAr ? "التواصل" : "Contact" },
    { id: "footer", icon: "🔻", label: isAr ? "التذييل" : "Footer" },
    { id: "nav", icon: "🧭", label: isAr ? "القائمة" : "Nav" },
  ];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen text-white bg-[#03050c]">
      {/* === HEADER === */}
      <header className="sticky top-0 z-50 bg-[#03050c]/90 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white text-sm font-black">IP</div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-sm font-black tracking-tight">IronPeak</h1>
                <span className="text-[7px] font-bold text-orange-400/60 uppercase tracking-[0.25em] bg-orange-400/10 px-2.5 py-0.5 rounded-full">{isAr ? "تحكم" : "Control"}</span>
              </div>
              <p className="text-[7px] text-white/10 font-mono tracking-widest uppercase">Template Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/store/${slug}`} target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <ExternalLink size={12} /> {isAr ? "عرض" : "View"}
            </Link>
            <div className="w-px h-7 bg-white/5" />
            <button onClick={save} disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white text-[9px] font-black uppercase tracking-widest hover:from-orange-500 hover:to-rose-500 transition-all disabled:opacity-50 shadow-lg shadow-orange-600/20">
              {isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {isPending ? (isAr ? "حفظ..." : "...") : (isAr ? "حفظ" : "Save")}
            </button>
          </div>
        </div>
        <div className="flex gap-0.5 px-6 overflow-x-auto" style={{scrollbarWidth:'none'}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap rounded-t-xl ${
                tab === t.id ? "text-orange-400 bg-gradient-to-b from-orange-500/10 to-transparent" : "text-white/20 hover:text-white/50"
              }`}>
              <span className="mr-1.5">{t.icon}</span>{t.label}
              {tab === t.id && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]" />}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        {tab === "hero" && <HeroSection data={ip.hero || {}} set={setNested} isAr={isAr} />}
        {tab === "about" && <AboutSection data={ip.about || {}} set={setNested} isAr={isAr} />}
        {tab === "services" && <ServicesSection data={ip.services || {}} set={setNested} isAr={isAr} />}
        {tab === "pricing" && <PricingSection data={ip.pricing || {}} set={setNested} isAr={isAr} />}
        {tab === "trainers" && <TrainersSection data={ip.trainers || {}} set={setNested} isAr={isAr} />}
        {tab === "testimonials" && <TestimonialsSection data={ip.testimonials || {}} set={setNested} isAr={isAr} />}
        {tab === "blog" && <BlogSection data={ip.blog || {}} set={setNested} isAr={isAr} />}
        {tab === "contact" && <ContactSection data={ip.contact || {}} set={setNested} isAr={isAr} />}
        {tab === "footer" && <FooterSection data={ip.footer || {}} set={setNested} isAr={isAr} />}
        {tab === "nav" && <NavSection data={ip.nav || {}} set={setNested} isAr={isAr} />}
      </div>
    </div>
  );
}

/* ===== HELPERS ===== */

function getArr(obj: any, key: string) { return Array.isArray(obj?.[key]) ? obj[key] : []; }

/* ===== HERO ===== */

function HeroSection({ data, set, isAr }: any) {
  const d = data; const S = "hero";
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* PREVIEW */}
      <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center group border border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 transition-all group-hover:scale-105 duration-1000" style={d.backgroundImage ? { backgroundImage: `url(${d.backgroundImage})` } : {}} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        <div className="relative z-10 text-center px-8">
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">{d.title || "TRANSFORM YOUR BODY"}</h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed mb-5">{d.subtitle || "Join the best fitness experience"}</p>
          <div className="flex gap-3 justify-center">
            <span className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full text-white text-xs font-bold shadow-lg shadow-orange-500/30">{d.primaryCta?.text || "Join Now"}</span>
            <span className="px-6 py-2.5 border border-white/30 rounded-full text-white/70 text-xs font-bold">{d.secondaryCta?.text || "Learn More"}</span>
          </div>
        </div>
        {d.enabled === false && <BadgeDisabled />}
      </div>
      {/* EDITOR */}
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار القسم" : "Show Section"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label={isAr ? "العنوان" : "Title"} value={d.title} onChange={v => set(`${S}.title`, v)} />
          <ImageField label={isAr ? "صورة الخلفية" : "Background Image"} value={d.backgroundImage} onChange={v => set(`${S}.backgroundImage`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "النص" : "Subtitle"} value={d.subtitle} onChange={v => set(`${S}.subtitle`, v)} multiline /></div>
          <Field label={isAr ? "الزر الرئيسي - نص" : "Primary Text"} value={d.primaryCta?.text} onChange={v => set(`${S}.primaryCta.text`, v)} />
          <Field label={isAr ? "الزر الرئيسي - رابط" : "Primary Link"} value={d.primaryCta?.href} onChange={v => set(`${S}.primaryCta.href`, v)} />
          <Field label={isAr ? "الزر الثانوي - نص" : "Secondary Text"} value={d.secondaryCta?.text} onChange={v => set(`${S}.secondaryCta.text`, v)} />
          <Field label={isAr ? "الزر الثانوي - رابط" : "Secondary Link"} value={d.secondaryCta?.href} onChange={v => set(`${S}.secondaryCta.href`, v)} />
        </div>
      </Card>
    </div>
  );
}

/* ===== ABOUT ===== */

function AboutSection({ data, set, isAr }: any) {
  const d = data; const S = "about";
  const features = getArr(d, "features");
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-2 gap-6 p-8 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl border border-white/5 items-center">
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em]">{d.sectionTitle || "About Us"}</div>
          <h2 className="text-2xl font-black text-neutral-800">{d.heading || "Your Journey Starts Here"}</h2>
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-4">{d.paragraph1 || ""}</p>
          <div className="flex gap-2 flex-wrap">
            {features.slice(0, 4).map((f: any, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-white rounded-lg text-[9px] font-bold text-neutral-700 shadow-sm border border-neutral-100 flex items-center gap-1.5">
                {f.icon} {f.text}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl overflow-hidden h-48 bg-neutral-200 shadow-lg">
          {d.image && <img src={d.image} alt="" className="w-full h-full object-cover" />}
        </div>
      </div>
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار القسم" : "Show Section"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label={isAr ? "عنوان القسم" : "Section Title"} value={d.sectionTitle} onChange={v => set(`${S}.sectionTitle`, v)} />
          <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={d.sectionSubtitle} onChange={v => set(`${S}.sectionSubtitle`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "العنوان الداخلي" : "Heading"} value={d.heading} onChange={v => set(`${S}.heading`, v)} /></div>
          <div className="md:col-span-2"><Field label={isAr ? "الفقرة الأولى" : "Paragraph 1"} value={d.paragraph1} onChange={v => set(`${S}.paragraph1`, v)} multiline /></div>
          <div className="md:col-span-2"><Field label={isAr ? "الفقرة الثانية" : "Paragraph 2"} value={d.paragraph2} onChange={v => set(`${S}.paragraph2`, v)} multiline /></div>
          <ImageField label={isAr ? "الصورة" : "Image"} value={d.image} onChange={v => set(`${S}.image`, v)} />
        </div>
        <div className="mt-6 border-t border-white/5 pt-6">
          <SectionTitle>{isAr ? "المميزات" : "Features"}</SectionTitle>
          <ItemList items={features} defaultItem={{ icon: "🏋️", text: "" }} onAdd={() => set(`${S}.features`, [...features, { icon: "🏋️", text: "" }])}
            onRemove={(i: number) => set(`${S}.features`, features.filter((_: any, j: number) => j !== i))}
            onMove={(i: number, dir: number) => { const a = [...features]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(`${S}.features`, a); }}
            onUpdate={(i: number, k: string, v: any) => { const a = [...features]; a[i] = { ...a[i], [k]: v }; set(`${S}.features`, a); }}
            fields={[{ key: "icon", label: isAr ? "الأيقونة" : "Icon" }, { key: "text", label: isAr ? "النص" : "Text" }]}
          />
        </div>
      </Card>
    </div>
  );
}

/* ===== SERVICES ===== */

function ServicesSection({ data, set, isAr }: any) {
  const d = data; const S = "services";
  const items = getArr(d, "items");
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 bg-white rounded-2xl border border-neutral-100">
        <div className="text-center mb-6">
          <h2 className="text-lg font-black text-neutral-800">{d.sectionTitle || "Our Services"}</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {items.slice(0, 6).map((s: any, i: number) => (
            <div key={i} className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-5 text-center shadow-sm border border-neutral-100">
              <div className="text-3xl mb-2">{s.icon || "💪"}</div>
              <div className="text-xs font-black text-neutral-800">{s.title || "Service"}</div>
              <div className="text-[9px] text-neutral-500 mt-1 line-clamp-2">{s.description}</div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار القسم" : "Show Section"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label={isAr ? "عنوان القسم" : "Section Title"} value={d.sectionTitle} onChange={v => set(`${S}.sectionTitle`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "النص الفرعي" : "Subtitle"} value={d.sectionSubtitle} onChange={v => set(`${S}.sectionSubtitle`, v)} multiline /></div>
        </div>
        <div className="mt-6 border-t border-white/5 pt-6">
          <SectionTitle>{isAr ? "الخدمات" : "Service Items"}</SectionTitle>
          <ItemList items={items} defaultItem={{ icon: "💪", title: "", description: "" }} onAdd={() => set(`${S}.items`, [...items, { icon: "💪", title: "", description: "" }])}
            onRemove={(i: number) => set(`${S}.items`, items.filter((_: any, j: number) => j !== i))}
            onMove={(i: number, dir: number) => { const a = [...items]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(`${S}.items`, a); }}
            onUpdate={(i: number, k: string, v: any) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; set(`${S}.items`, a); }}
            fields={[{ key: "icon", label: isAr ? "الأيقونة" : "Icon" }, { key: "title", label: isAr ? "العنوان" : "Title" }, { key: "description", label: isAr ? "الوصف" : "Description" }]}
            textAreaFields={["description"]}
          />
        </div>
      </Card>
    </div>
  );
}

/* ===== PRICING ===== */

function PricingSection({ data, set, isAr }: any) {
  const d = data; const S = "pricing";
  const plans = getArr(d, "plans");
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700/30">
        <div className="text-center mb-6">
          <h2 className="text-lg font-black text-white">{d.sectionTitle || "Fitness Plans"}</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {plans.slice(0, 3).map((p: any, i: number) => (
            <div key={i} className={`rounded-xl p-5 text-center ${p.popular ? 'bg-gradient-to-br from-orange-500 to-rose-500 shadow-xl shadow-orange-500/20' : 'bg-white/5 border border-white/10'}`}>
              {p.badge && <div className="text-[8px] font-bold text-white/70 uppercase mb-1 tracking-wider">{p.badge}</div>}
              <div className="text-white text-base font-black mb-1">{p.name}</div>
              <div className="text-white text-3xl font-black">{p.price}<span className="text-sm opacity-60 font-normal">{p.period}</span></div>
              <div className="text-[9px] text-white/50 mt-2 line-clamp-1">{p.description}</div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار القسم" : "Show Section"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label={isAr ? "عنوان القسم" : "Section Title"} value={d.sectionTitle} onChange={v => set(`${S}.sectionTitle`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "النص الفرعي" : "Subtitle"} value={d.sectionSubtitle} onChange={v => set(`${S}.sectionSubtitle`, v)} multiline /></div>
        </div>
        <div className="mt-6 border-t border-white/5 pt-6">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>{isAr ? "الباقات" : "Plans"}</SectionTitle>
            <AddBtn onClick={() => set(`${S}.plans`, [...plans, { name: "", price: "$0", period: "/month", description: "", popular: false, badge: "", ctaText: "Get Started", ctaVariant: "secondary", features: [] }])} />
          </div>
          {plans.map((plan: any, idx: number) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 mb-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                  <span className="text-[10px] font-bold text-white/50 uppercase">{plan.name || (isAr ? "جديد" : "New")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[7px] text-white/30 font-bold uppercase tracking-wider cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg">
                    <input type="checkbox" checked={plan.popular} onChange={e => { const a = [...plans]; a[idx] = { ...a[idx], popular: e.target.checked }; set(`${S}.plans`, a); }} className="accent-orange-500 w-3 h-3" />
                    {isAr ? "شائع" : "Popular"}
                  </label>
                  <button onClick={() => { const a = [...plans]; const j = idx - 1; if (j < 0) return; [a[idx], a[j]] = [a[j], a[idx]]; set(`${S}.plans`, a); }} disabled={idx === 0} className="p-1 rounded-md bg-white/5 text-white/30 hover:text-white disabled:opacity-20"><ArrowUp size={10} /></button>
                  <button onClick={() => { const a = [...plans]; const j = idx + 1; if (j >= a.length) return; [a[idx], a[j]] = [a[j], a[idx]]; set(`${S}.plans`, a); }} disabled={idx === plans.length - 1} className="p-1 rounded-md bg-white/5 text-white/30 hover:text-white disabled:opacity-20"><ArrowDown size={10} /></button>
                  <button onClick={() => set(`${S}.plans`, plans.filter((_: any, j: number) => j !== idx))} className="p-1 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Trash2 size={10} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Field label={isAr ? "الاسم" : "Name"} value={plan.name} onChange={v => { const a = [...plans]; a[idx] = { ...a[idx], name: v }; set(`${S}.plans`, a); }} />
                <Field label={isAr ? "السعر" : "Price"} value={plan.price} onChange={v => { const a = [...plans]; a[idx] = { ...a[idx], price: v }; set(`${S}.plans`, a); }} />
                <Field label={isAr ? "المدة" : "Period"} value={plan.period} onChange={v => { const a = [...plans]; a[idx] = { ...a[idx], period: v }; set(`${S}.plans`, a); }} />
                <Field label={isAr ? "الشارة" : "Badge"} value={plan.badge} onChange={v => { const a = [...plans]; a[idx] = { ...a[idx], badge: v }; set(`${S}.plans`, a); }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <Field label={isAr ? "الوصف" : "Description"} value={plan.description} onChange={v => { const a = [...plans]; a[idx] = { ...a[idx], description: v }; set(`${S}.plans`, a); }} />
                <Field label={isAr ? "نص الزر" : "CTA Text"} value={plan.ctaText} onChange={v => { const a = [...plans]; a[idx] = { ...a[idx], ctaText: v }; set(`${S}.plans`, a); }} />
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">{isAr ? "المميزات" : "Features"}</span>
                  <button onClick={() => { const a = [...plans]; const f = a[idx].features || []; a[idx] = { ...a[idx], features: [...f, { text: "", enabled: true }] }; set(`${S}.plans`, a); }} className="text-[8px] font-bold text-orange-400 uppercase tracking-widest hover:text-orange-300">+ {isAr ? "إضافة" : "Add"}</button>
                </div>
                <div className="space-y-1">
                  {(plan.features || []).map((f: any, fi: number) => (
                    <div key={fi} className="flex items-center gap-2">
                      <input value={f.text || ""} onChange={e => { const a = [...plans]; const fa = [...(a[idx].features || [])]; fa[fi] = { ...fa[fi], text: e.target.value }; a[idx] = { ...a[idx], features: fa }; set(`${S}.plans`, a); }}
                        className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                      <label className="flex items-center gap-1 text-[7px] text-white/30 font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={f.enabled !== false} onChange={e => { const a = [...plans]; const fa = [...(a[idx].features || [])]; fa[fi] = { ...fa[fi], enabled: e.target.checked }; a[idx] = { ...a[idx], features: fa }; set(`${S}.plans`, a); }} className="accent-orange-500 w-3 h-3" />
                        {isAr ? "نشط" : "On"}
                      </label>
                      <button onClick={() => { const a = [...plans]; a[idx] = { ...a[idx], features: (a[idx].features || []).filter((_: any, j: number) => j !== fi) }; set(`${S}.plans`, a); }} className="p-1 rounded-md bg-rose-500/10 text-rose-400"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ===== TRAINERS ===== */

function TrainersSection({ data, set, isAr }: any) {
  const d = data; const S = "trainers";
  const items = getArr(d, "items");
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl border border-neutral-100">
        <div className="text-center mb-6"><h2 className="text-lg font-black text-neutral-800">{d.sectionTitle || "Our Trainers"}</h2></div>
        <div className="grid grid-cols-4 gap-4">
          {items.slice(0, 4).map((t: any, i: number) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100">
              <div className="h-32 bg-neutral-200">{t.image && <img src={t.image} alt="" className="w-full h-full object-cover" />}</div>
              <div className="p-3 text-center">
                <div className="text-xs font-black text-neutral-800">{t.name}</div>
                <div className="text-[9px] text-orange-500 font-bold">{t.role}</div>
                <div className="text-[8px] text-neutral-500 mt-1 line-clamp-2">{t.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار القسم" : "Show Section"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label={isAr ? "عنوان القسم" : "Section Title"} value={d.sectionTitle} onChange={v => set(`${S}.sectionTitle`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "النص الفرعي" : "Subtitle"} value={d.sectionSubtitle} onChange={v => set(`${S}.sectionSubtitle`, v)} multiline /></div>
        </div>
        <div className="mt-6 border-t border-white/5 pt-6">
          <SectionTitle>{isAr ? "المدربون" : "Trainers"}</SectionTitle>
          <ItemList items={items} defaultItem={{ name: "", role: "", bio: "", image: "" }} onAdd={() => set(`${S}.items`, [...items, { name: "", role: "", bio: "", image: "" }])}
            onRemove={(i: number) => set(`${S}.items`, items.filter((_: any, j: number) => j !== i))}
            onMove={(i: number, dir: number) => { const a = [...items]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(`${S}.items`, a); }}
            onUpdate={(i: number, k: string, v: any) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; set(`${S}.items`, a); }}
            fields={[{ key: "name", label: isAr ? "الاسم" : "Name" }, { key: "role", label: isAr ? "الدور" : "Role" }, { key: "bio", label: isAr ? "السيرة" : "Bio" }, { key: "image", label: isAr ? "الصورة" : "Image" }]}
            textAreaFields={["bio"]} imageFields={["image"]}
          />
        </div>
      </Card>
    </div>
  );
}

/* ===== TESTIMONIALS ===== */

function TestimonialsSection({ data, set, isAr }: any) {
  const d = data; const S = "testimonials";
  const items = getArr(d, "items");
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 bg-white rounded-2xl border border-neutral-100">
        <div className="text-center mb-6"><h2 className="text-lg font-black text-neutral-800">{d.sectionTitle || "Testimonials"}</h2></div>
        <div className="grid grid-cols-3 gap-4">
          {items.slice(0, 3).map((t: any, i: number) => (
            <div key={i} className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-5">
              <div className="text-3xl text-orange-200 font-serif leading-none mb-2">"</div>
              <p className="text-[10px] text-neutral-600 leading-relaxed line-clamp-3 mb-3 italic">{t.quote}</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-[9px] font-bold">{t.initials}</div>
                <div><div className="text-[10px] font-bold text-neutral-800">{t.author}</div><div className="text-[7px] text-neutral-500">{t.meta}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار القسم" : "Show Section"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label={isAr ? "عنوان القسم" : "Section Title"} value={d.sectionTitle} onChange={v => set(`${S}.sectionTitle`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "النص الفرعي" : "Subtitle"} value={d.sectionSubtitle} onChange={v => set(`${S}.sectionSubtitle`, v)} multiline /></div>
        </div>
        <div className="mt-6 border-t border-white/5 pt-6">
          <SectionTitle>{isAr ? "الآراء" : "Testimonials"}</SectionTitle>
          <ItemList items={items} defaultItem={{ author: "", meta: "", initials: "", quote: "" }} onAdd={() => set(`${S}.items`, [...items, { author: "", meta: "", initials: "", quote: "" }])}
            onRemove={(i: number) => set(`${S}.items`, items.filter((_: any, j: number) => j !== i))}
            onMove={(i: number, dir: number) => { const a = [...items]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(`${S}.items`, a); }}
            onUpdate={(i: number, k: string, v: any) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; set(`${S}.items`, a); }}
            fields={[{ key: "author", label: isAr ? "الاسم" : "Author" }, { key: "meta", label: isAr ? "الوصف" : "Meta" }, { key: "initials", label: isAr ? "الأحرف" : "Initials" }, { key: "quote", label: isAr ? "النص" : "Quote" }]}
            textAreaFields={["quote"]}
          />
        </div>
      </Card>
    </div>
  );
}

/* ===== BLOG ===== */

function BlogSection({ data, set, isAr }: any) {
  const d = data; const S = "blog";
  const items = getArr(d, "items");
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl border border-neutral-100">
        <div className="text-center mb-6"><h2 className="text-lg font-black text-neutral-800">{d.sectionTitle || "Blog"}</h2></div>
        <div className="grid grid-cols-3 gap-4">
          {items.slice(0, 3).map((b: any, i: number) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100">
              <div className="h-24 bg-neutral-200">{b.image && <img src={b.image} alt="" className="w-full h-full object-cover" />}</div>
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full text-white text-[7px] font-bold">{b.date}</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[7px] font-bold">{b.category}</span>
                </div>
                <div className="text-xs font-black text-neutral-800 line-clamp-2">{b.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار القسم" : "Show Section"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label={isAr ? "عنوان القسم" : "Section Title"} value={d.sectionTitle} onChange={v => set(`${S}.sectionTitle`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "النص الفرعي" : "Subtitle"} value={d.sectionSubtitle} onChange={v => set(`${S}.sectionSubtitle`, v)} multiline /></div>
        </div>
        <div className="mt-6 border-t border-white/5 pt-6">
          <SectionTitle>{isAr ? "المقالات" : "Blog Posts"}</SectionTitle>
          <ItemList items={items} defaultItem={{ title: "", date: "", category: "", description: "", image: "" }} onAdd={() => set(`${S}.items`, [...items, { title: "", date: "", category: "", description: "", image: "" }])}
            onRemove={(i: number) => set(`${S}.items`, items.filter((_: any, j: number) => j !== i))}
            onMove={(i: number, dir: number) => { const a = [...items]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(`${S}.items`, a); }}
            onUpdate={(i: number, k: string, v: any) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; set(`${S}.items`, a); }}
            fields={[{ key: "title", label: isAr ? "العنوان" : "Title" }, { key: "date", label: isAr ? "التاريخ" : "Date" }, { key: "category", label: isAr ? "التصنيف" : "Category" }, { key: "description", label: isAr ? "الوصف" : "Description" }, { key: "image", label: isAr ? "الصورة" : "Image" }]}
            textAreaFields={["description"]} imageFields={["image"]}
          />
        </div>
      </Card>
    </div>
  );
}

/* ===== CONTACT ===== */

function ContactSection({ data, set, isAr }: any) {
  const d = data; const S = "contact";
  const items = getArr(d, "items");
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-2 gap-4 p-8 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700/30">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-white text-xs font-bold uppercase tracking-wider mb-4">{d.form?.buttonText || "Send Message"}</div>
          <div className="space-y-2">
            <div className="h-8 bg-white/10 rounded-lg" /><div className="h-8 bg-white/10 rounded-lg" /><div className="h-8 bg-white/10 rounded-lg" /><div className="h-16 bg-white/10 rounded-lg" />
            <div className="h-8 w-1/3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg" />
          </div>
        </div>
        <div className="space-y-3">
          {items.slice(0, 4).map((item: any, i: number) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-white text-[10px] font-bold">{item.title}</div>
                <div className="text-white/50 text-[9px]" dangerouslySetInnerHTML={{ __html: item.text || "" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار القسم" : "Show Section"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label={isAr ? "عنوان القسم" : "Section Title"} value={d.sectionTitle} onChange={v => set(`${S}.sectionTitle`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "النص الفرعي" : "Subtitle"} value={d.sectionSubtitle} onChange={v => set(`${S}.sectionSubtitle`, v)} multiline /></div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mt-4">
          <SectionTitle>{isAr ? "إعدادات الفورم" : "Form Settings"}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Field label={isAr ? "الاسم" : "Name Placeholder"} value={d.form?.namePlaceholder} onChange={v => set(`${S}.form.namePlaceholder`, v)} />
            <Field label={isAr ? "البريد" : "Email Placeholder"} value={d.form?.emailPlaceholder} onChange={v => set(`${S}.form.emailPlaceholder`, v)} />
            <Field label={isAr ? "الهاتف" : "Phone Placeholder"} value={d.form?.phonePlaceholder} onChange={v => set(`${S}.form.phonePlaceholder`, v)} />
            <Field label={isAr ? "الرسالة" : "Message Placeholder"} value={d.form?.messagePlaceholder} onChange={v => set(`${S}.form.messagePlaceholder`, v)} />
            <Field label={isAr ? "نص الزر" : "Button Text"} value={d.form?.buttonText} onChange={v => set(`${S}.form.buttonText`, v)} />
            <div className="md:col-span-2"><Field label={isAr ? "رسالة النجاح" : "Success Message"} value={d.form?.successMessage} onChange={v => set(`${S}.form.successMessage`, v)} /></div>
          </div>
        </div>
        <div className="mt-6 border-t border-white/5 pt-6">
          <SectionTitle>{isAr ? "معلومات الاتصال" : "Contact Items"}</SectionTitle>
          <ItemList items={items} defaultItem={{ icon: "📍", title: "", text: "" }} onAdd={() => set(`${S}.items`, [...items, { icon: "📍", title: "", text: "" }])}
            onRemove={(i: number) => set(`${S}.items`, items.filter((_: any, j: number) => j !== i))}
            onMove={(i: number, dir: number) => { const a = [...items]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(`${S}.items`, a); }}
            onUpdate={(i: number, k: string, v: any) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; set(`${S}.items`, a); }}
            fields={[{ key: "icon", label: isAr ? "الأيقونة" : "Icon" }, { key: "title", label: isAr ? "العنوان" : "Title" }, { key: "text", label: isAr ? "النص" : "Text" }]}
            textAreaFields={["text"]}
          />
        </div>
      </Card>
    </div>
  );
}

/* ===== FOOTER ===== */

function FooterSection({ data, set, isAr }: any) {
  const d = data; const S = "footer";
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 bg-gradient-to-br from-neutral-950 to-black rounded-2xl border border-neutral-800/30">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-white text-lg font-black mb-2">{d.logo || "IRON"}<span className="text-orange-500">{d.logoSuffix || "PEAK"}</span></div>
            <p className="text-white/40 text-[10px] leading-relaxed line-clamp-3">{d.description}</p>
          </div>
          {[isAr ? "روابط" : "Links", isAr ? "برامج" : "Programs", isAr ? "اتصال" : "Contact"].map((title, i) => (
            <div key={i}>
              <div className="text-white text-[10px] font-bold mb-3 tracking-wider uppercase">{title}</div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => <div key={j} className="h-2.5 bg-white/5 rounded w-3/4" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <Toggle value={d.enabled} onChange={v => set(`${S}.enabled`, v)} label={isAr ? "إظهار التذييل" : "Show Footer"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label="Logo" value={d.logo} onChange={v => set(`${S}.logo`, v)} />
          <Field label="Logo Suffix" value={d.logoSuffix} onChange={v => set(`${S}.logoSuffix`, v)} />
          <div className="md:col-span-2"><Field label={isAr ? "الوصف" : "Description"} value={d.description} onChange={v => set(`${S}.description`, v)} multiline /></div>
          <div className="md:col-span-2"><Field label={isAr ? "حقوق النشر" : "Copyright"} value={d.copyright} onChange={v => set(`${S}.copyright`, v)} /></div>
        </div>
        <ListGroup title={isAr ? "روابط التواصل" : "Social Links"} items={getArr(d, "socialLinks")} defaultItem={{ icon: "bi bi-facebook", url: "#" }}
          onAdd={(i) => set(`${S}.socialLinks`, [...getArr(d, "socialLinks"), i])} onRemove={(idx) => set(`${S}.socialLinks`, getArr(d, "socialLinks").filter((_: any, j: number) => j !== idx))}
          onUpdate={(idx, field, val) => { const a = [...getArr(d, "socialLinks")]; a[idx] = { ...a[idx], [field]: val }; set(`${S}.socialLinks`, a); }}
          fields={[{ key: "icon", label: "Icon" }, { key: "url", label: "URL" }]} />
        <ListGroup title={isAr ? "الروابط السريعة" : "Quick Links"} items={getArr(d, "quickLinks")} defaultItem={{ label: "", href: "#" }}
          onAdd={(i) => set(`${S}.quickLinks`, [...getArr(d, "quickLinks"), i])} onRemove={(idx) => set(`${S}.quickLinks`, getArr(d, "quickLinks").filter((_: any, j: number) => j !== idx))}
          onUpdate={(idx, field, val) => { const a = [...getArr(d, "quickLinks")]; a[idx] = { ...a[idx], [field]: val }; set(`${S}.quickLinks`, a); }}
          fields={[{ key: "label", label: isAr ? "النص" : "Label" }, { key: "href", label: "href" }]} />
        <ListGroup title={isAr ? "البرامج" : "Programs"} items={getArr(d, "programs")} defaultItem={{ label: "", href: "#" }}
          onAdd={(i) => set(`${S}.programs`, [...getArr(d, "programs"), i])} onRemove={(idx) => set(`${S}.programs`, getArr(d, "programs").filter((_: any, j: number) => j !== idx))}
          onUpdate={(idx, field, val) => { const a = [...getArr(d, "programs")]; a[idx] = { ...a[idx], [field]: val }; set(`${S}.programs`, a); }}
          fields={[{ key: "label", label: isAr ? "النص" : "Label" }, { key: "href", label: "href" }]} />
        <ListGroup title={isAr ? "معلومات التواصل" : "Contact Info"} items={getArr(d, "contactInfo")} defaultItem={{ icon: "bi bi-geo-alt", text: "" }}
          onAdd={(i) => set(`${S}.contactInfo`, [...getArr(d, "contactInfo"), i])} onRemove={(idx) => set(`${S}.contactInfo`, getArr(d, "contactInfo").filter((_: any, j: number) => j !== idx))}
          onUpdate={(idx, field, val) => { const a = [...getArr(d, "contactInfo")]; a[idx] = { ...a[idx], [field]: val }; set(`${S}.contactInfo`, a); }}
          fields={[{ key: "icon", label: "Icon" }, { key: "text", label: isAr ? "النص" : "Text" }]} />
      </Card>
    </div>
  );
}

/* ===== NAV ===== */

function NavSection({ data, set, isAr }: any) {
  const d = data; const S = "nav";
  const links = getArr(d, "links");
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-5 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700/30">
        <div className="flex items-center justify-between">
          <div className="text-white text-lg font-black">{d.logo || "IRON"}<span className="text-orange-500">{d.logoSuffix || "PEAK"}</span></div>
          <div className="flex gap-5">
            {links.slice(0, 6).map((l: any, i: number) => (
              <span key={i} className="text-white/50 text-[9px] font-bold uppercase tracking-wider">{l.label || "Link"}</span>
            ))}
          </div>
        </div>
      </div>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={isAr ? "نص اللوجو" : "Logo Text"} value={d.logo} onChange={v => set(`${S}.logo`, v)} />
          <Field label={isAr ? "لاحقة اللوجو" : "Logo Suffix"} value={d.logoSuffix} onChange={v => set(`${S}.logoSuffix`, v)} />
        </div>
        <div className="mt-6 border-t border-white/5 pt-6">
          <SectionTitle>{isAr ? "روابط القائمة" : "Nav Links"}</SectionTitle>
          <ItemList items={links} defaultItem={{ label: "", href: "#" }} onAdd={() => set(`${S}.links`, [...links, { label: "", href: "#" }])}
            onRemove={(i: number) => set(`${S}.links`, links.filter((_: any, j: number) => j !== i))}
            onMove={(i: number, dir: number) => { const a = [...links]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(`${S}.links`, a); }}
            onUpdate={(i: number, k: string, v: any) => { const a = [...links]; a[i] = { ...a[i], [k]: v }; set(`${S}.links`, a); }}
            fields={[{ key: "label", label: isAr ? "النص" : "Label" }, { key: "href", label: "href" }]}
          />
        </div>
      </Card>
    </div>
  );
}

/* ===== UI COMPONENTS ===== */

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">{children}</div>;
}

function Field({ label, value, onChange, placeholder, multiline }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  const id = "bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all font-medium placeholder:text-white/15 w-full";
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] font-bold text-white/30 uppercase tracking-wider">{label}</label>
      {multiline ? <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={3} className={`${id} resize-none`} placeholder={placeholder} />
        : <input value={value || ""} onChange={e => onChange(e.target.value)} className={id} placeholder={placeholder} />}
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] font-bold text-white/30 uppercase tracking-wider">{label}</label>
      {value && <div className="w-full h-28 rounded-xl overflow-hidden border border-white/5 bg-black/60 mb-2"><img src={value} alt="" className="w-full h-full object-cover" /></div>}
      <input value={value || ""} onChange={e => onChange(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 font-medium placeholder:text-white/15" placeholder="https://..." />
    </div>
  );
}

function Toggle({ value, onChange, label }: { value?: boolean; onChange: (v: boolean) => void; label: string }) {
  const checked = value !== false;
  return (
    <label className="flex items-center justify-between py-1 cursor-pointer group border-b border-white/5 pb-4">
      <span className="text-xs font-bold text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
      <div className={`relative w-10 h-5 rounded-full transition-all ${checked ? 'bg-orange-500' : 'bg-white/10'}`}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all ${checked ? 'translate-x-5' : ''}`} />
      </div>
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{children}</span>;
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="flex items-center gap-1 px-3 py-1.5 bg-orange-600/20 border border-orange-500/20 rounded-lg text-orange-400 text-[8px] font-bold uppercase tracking-widest hover:bg-orange-600/30 transition-all"><Plus size={10} /> Add</button>;
}

function BadgeDisabled() {
  return <div className="absolute top-3 right-3 px-2.5 py-1 bg-rose-500/80 rounded-lg text-[8px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">Disabled</div>;
}

function ItemList({ items, fields, onAdd, onRemove, onMove, onUpdate, defaultItem, textAreaFields = [], imageFields = [] }: {
  items: any[]; fields: { key: string; label: string }[]; onAdd: () => void; onRemove: (idx: number) => void;
  onMove: (idx: number, dir: number) => void; onUpdate: (idx: number, key: string, value: any) => void;
  defaultItem?: any; textAreaFields?: string[]; imageFields?: string[];
}) {
  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between">
        <span className="text-[8px] text-white/20 font-mono">{items.length} items</span>
        <AddBtn onClick={onAdd} />
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => onMove(idx, -1)} disabled={idx === 0} className="p-1 rounded-md bg-white/5 text-white/30 hover:text-white disabled:opacity-20"><ArrowUp size={10} /></button>
              <button onClick={() => onMove(idx, 1)} disabled={idx === items.length - 1} className="p-1 rounded-md bg-white/5 text-white/30 hover:text-white disabled:opacity-20"><ArrowDown size={10} /></button>
              <button onClick={() => onRemove(idx)} className="p-1 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Trash2 size={10} /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.key} className={textAreaFields.includes(f.key) || imageFields.includes(f.key) ? "md:col-span-2" : ""}>
                {imageFields.includes(f.key) ? (
                  <ImageField label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} />
                ) : textAreaFields.includes(f.key) ? (
                  <Field label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} multiline />
                ) : (
                  <Field label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="text-center py-8 text-white/10 text-[9px] font-bold uppercase tracking-wider">Empty</div>}
    </div>
  );
}

function ListGroup({ title, items, fields, defaultItem, onAdd, onRemove, onUpdate }: {
  title: string; items: any[]; fields: { key: string; label: string }[]; defaultItem: any;
  onAdd: (item: any) => void; onRemove: (idx: number) => void; onUpdate: (idx: number, key: string, value: any) => void;
}) {
  return (
    <div className="mt-6 border-t border-white/5 pt-6">
      <div className="flex items-center justify-between mb-3">
        <SectionTitle>{title}</SectionTitle>
        <AddBtn onClick={() => onAdd(defaultItem)} />
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
            <button onClick={() => onRemove(idx)} className="p-1 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Trash2 size={10} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map(f => <Field key={f.key} label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} />)}
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="text-center py-4 text-white/10 text-[9px] font-bold uppercase tracking-wider">Empty</div>}
    </div>
  );
}

/* ===== GLOBAL ANIMATION ===== */
