"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save, Loader2, Plus, X, ArrowUp, ArrowDown, Image as ImageIcon,
  Eye, Settings, Star, ChevronRight, GripVertical, Trash2,
  AlertTriangle, ExternalLink
} from "lucide-react";
import { saveStoreSettings } from "../actions";
import { useLanguageStore } from "@/store/language";
import { toast } from "sonner";
import MediaPicker from "../media/MediaPicker";

type FsData = Record<string, any>;

export default function FitnessDashboard({
  slug, initialSettings, storeName
}: {
  slug: string; initialSettings: any; storeName: string;
}) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("hero");
  const [showMedia, setShowMedia] = useState<string | null>(null);

  const fs = settings.fitnessSettings || {};
  const get = (path: string) => {
    const parts = path.split(".");
    let obj = fs;
    for (const p of parts) {
      if (obj == null) return undefined;
      obj = obj[p];
    }
    return obj;
  };

  const set = (path: string, value: any) => {
    const parts = path.split(".");
    const newFs = JSON.parse(JSON.stringify(fs || {}));
    let obj = newFs;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    setSettings({ ...settings, fitnessSettings: newFs });
  };

  const [syncing, setSyncing] = useState(false);

  const save = () => {
    startTransition(async () => {
      try {
        await saveStoreSettings(slug, settings);
        toast.success(isAr ? "تم الحفظ" : "Saved");
        router.refresh();
      } catch {
        toast.error(isAr ? "فشل الحفظ" : "Failed to save");
      }
    });
  };

  const syncToDb = async () => {
    setSyncing(true);
    try {
      await saveStoreSettings(slug, settings);
      const res = await fetch(`/api/fitness/${slug}/sync`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success(isAr ? "تمت المزامنة مع قاعدة البيانات" : "Synced to DB");
      } else {
        toast.error(json.error || "Sync failed");
      }
    } catch {
      toast.error(isAr ? "فشلت المزامنة" : "Sync failed");
    }
    setSyncing(false);
  };

  const addItem = (path: string, item: any) => {
    const arr = get(path) || [];
    set(path, [...arr, item]);
  };

  const removeItem = (path: string, idx: number) => {
    const arr = get(path) || [];
    set(path, arr.filter((_: any, i: number) => i !== idx));
  };

  const moveItem = (path: string, idx: number, dir: number) => {
    const arr = [...(get(path) || [])];
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    set(path, arr);
  };

  const updateItem = (path: string, idx: number, field: string, value: any) => {
    const arr = [...(get(path) || [])];
    if (!arr[idx]) return;
    arr[idx] = { ...arr[idx], [field]: value };
    set(path, arr);
  };

  const tabs = [
    { id: "hero", label: isAr ? "الهيرو" : "Hero", icon: "🏠" },
    { id: "marquee", label: isAr ? "الشريط" : "Marquee", icon: "📜" },
    { id: "services", label: isAr ? "الخدمات" : "Services", icon: "🛎️" },
    { id: "transformations", label: isAr ? "التحولات" : "Transformations", icon: "🔄" },
    { id: "pricing", label: isAr ? "الباقات" : "Pricing", icon: "💰" },
    { id: "testimonials", label: isAr ? "الآراء" : "Testimonials", icon: "⭐" },
    { id: "footer", label: isAr ? "التذييل" : "Footer", icon: "📋" },
  ];

  const hero = fs.hero || {};
  const marquee = fs.marquee || {};
  const services = fs.services || {};
  const transformations = fs.transformations || {};
  const pricing = fs.pricing || {};
  const testimonials = fs.testimonials || {};
  const footer = fs.footer || {};

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen text-white">
      {showMedia && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0f111a] rounded-2xl border border-white/10 w-full max-w-4xl max-h-[80vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-sm uppercase tracking-wider">{isAr ? "اختر صورة" : "Pick Image"}</h3>
              <button onClick={() => setShowMedia(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10"><X size={16} /></button>
            </div>
            <MediaPicker
              value=""
              slug={slug}
              onChange={(url: string) => {
                if (showMedia) {
                  set(showMedia, url);
                  setShowMedia(null);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0c14]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">
              <span className="text-emerald-400">{isAr ? "لوحة تحكم" : "Fitness"} </span>
              <span className="text-white">برعي</span>
            </h1>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              {storeName} — {isAr ? "تحكم كامل بالموقع" : "Full Site Control"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={syncToDb} disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all disabled:opacity-50">
              {syncing ? <Loader2 size={12} className="animate-spin" /> : null}
              {syncing ? (isAr ? "..." : "Syncing...") : (isAr ? "مزامنة DB" : "Sync DB")}
            </button>
            <Link href={`/store/${slug}`} target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all">
              <ExternalLink size={14} /> {isAr ? "عرض الموقع" : "View Site"}
            </Link>
            <button onClick={save} disabled={isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20">
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isPending ? (isAr ? "جارٍ الحفظ" : "Saving...") : (isAr ? "حفظ" : "Save")}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "text-emerald-400 border-emerald-400 bg-emerald-400/5"
                  : "text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-600"
              }`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* ===== HERO TAB ===== */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <Section title={isAr ? "قسم الهيرو" : "Hero Section"}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={isAr ? "الشارة" : "Badge"} value={hero.badge} onChange={v => set("hero.badge", v)} placeholder="ELITE ONLINE COACHING" />
                <Field label={isAr ? "العنوان" : "Title"} value={hero.title} onChange={v => set("hero.title", v)} placeholder="Advance Like Lightning" />
                <div className="md:col-span-2">
                  <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={hero.subtitle} onChange={v => set("hero.subtitle", v)} multiline />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <ImageField label={isAr ? "صورة الخلفية" : "Background"} value={hero.backgroundImage} onChange={v => set("hero.backgroundImage", v)} slug={slug} onPick={setShowMedia} />
                <ImageField label={isAr ? "صورة العداء" : "Runner"} value={hero.runnerImage} onChange={v => set("hero.runnerImage", v)} slug={slug} onPick={setShowMedia} />
                <ImageField label={isAr ? "صورة البرق" : "Lightning"} value={hero.lightningImage} onChange={v => set("hero.lightningImage", v)} slug={slug} onPick={setShowMedia} />
              </div>

              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mt-6 mb-3">{isAr ? "الأزرار" : "CTA Buttons"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={isAr ? "النص - الزر الرئيسي" : "Primary Text"} value={hero.primaryCta?.text} onChange={v => set("hero.primaryCta.text", v)} placeholder={isAr ? "عن ساما فيت" : "About Us"} />
                <Field label={isAr ? "الرابط" : "Primary Link"} value={hero.primaryCta?.link} onChange={v => set("hero.primaryCta.link", v)} placeholder="/store/slug#about" />
                <Field label={isAr ? "النص - الزر الثانوي" : "Secondary Text"} value={hero.secondaryCta?.text} onChange={v => set("hero.secondaryCta.text", v)} placeholder={isAr ? "اشترك الآن" : "Subscribe Now"} />
                <Field label={isAr ? "الرابط" : "Secondary Link"} value={hero.secondaryCta?.link} onChange={v => set("hero.secondaryCta.link", v)} placeholder="/store/slug#pricing" />
              </div>

              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mt-6 mb-3">{isAr ? "صور الأفاتار (المستخدمين)" : "Avatar Images"}</h4>
              <ArrayEdit label={isAr ? "روابط صور الأفاتار" : "Avatar URLs"} items={hero.avatars || []} onChange={v => set("hero.avatars", v)} />

              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mt-6 mb-3">{isAr ? "الإحصائيات" : "Stats"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.02] rounded-xl p-4 border border-white/5">
                <Field label={isAr ? "القيمة" : "Value"} value={hero.statValue} onChange={v => set("hero.statValue", v)} placeholder="20" />
                <Field label={isAr ? "اللاحقة" : "Suffix"} value={hero.statSuffix} onChange={v => set("hero.statSuffix", v)} placeholder="k+" />
                <div className="md:col-span-3">
                  <Field label={isAr ? "النص" : "Label"} value={hero.statLabel} onChange={v => set("hero.statLabel", v)}
                    placeholder={isAr ? "أكثر من 20 ألف شخص غيروا حياتهم" : "Over 20,000 people transformed"} />
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ===== MARQUEE TAB ===== */}
        {activeTab === "marquee" && (
          <Section title={isAr ? "الشريط المتحرك" : "Marquee Bar"}>
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input type="checkbox" checked={marquee.enabled !== false} onChange={e => set("marquee.enabled", e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500" />
              <span className="text-sm font-bold text-slate-300">{isAr ? "تفعيل الشريط" : "Enable Marquee"}</span>
            </label>
            <div className="mb-4">
              <Field label={isAr ? "رمز الفاصل" : "Separator"} value={marquee.separator} onChange={v => set("marquee.separator", v)} placeholder="✦" />
            </div>
            <ArrayEdit label={isAr ? "عناصر الشريط" : "Marquee Items"} items={marquee.items || []} onChange={v => set("marquee.items", v)} />
            {marquee.items?.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-2">{isAr ? "معاينة" : "Preview"}</div>
                <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] gap-0">
                  {[...Array(8)].flatMap(() => marquee.items || []).map((item: string, i: number) => (
                    <span key={i} className="text-xs font-bold uppercase tracking-[0.2em] mx-4 text-slate-300 flex items-center gap-4">
                      {item}
                      <span className="text-emerald-400/60">{marquee.separator || "✦"}</span>
                    </span>
                  ))}
                </div>
                <style jsx>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
              </div>
            )}
          </Section>
        )}

        {/* ===== SERVICES TAB ===== */}
        {activeTab === "services" && (
          <Section title={isAr ? "الخدمات" : "Services"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={services.title} onChange={v => set("services.title", v)}
                placeholder={isAr ? "خدمات ساما فيت" : "Our Services"} />
              <Field label={isAr ? "الشارة" : "Badge"} value={services.badge} onChange={v => set("services.badge", v)}
                placeholder={isAr ? "خدماتنا" : "Our Services"} />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={services.subtitle} onChange={v => set("services.subtitle", v)} multiline />
              </div>
            </div>

            <ItemList
              items={services.items || []}
              title={isAr ? "الخدمات" : "Service Items"}
              fields={[
                { key: "icon", label: isAr ? "الأيقونة" : "Icon" },
                { key: "title", label: isAr ? "العنوان" : "Title" },
                { key: "description", label: isAr ? "الوصف" : "Description" },
              ]}
              defaultItem={{ icon: "💪", title: "", description: "" }}
              onAdd={() => addItem("services.items", { icon: "💪", title: "", description: "" })}
              onRemove={(i) => removeItem("services.items", i)}
              onMove={(i, d) => moveItem("services.items", i, d)}
              onUpdate={(i, k, v) => updateItem("services.items", i, k, v)}
            />
          </Section>
        )}

        {/* ===== TRANSFORMATIONS TAB ===== */}
        {activeTab === "transformations" && (
          <Section title={isAr ? "التحولات (قبل/بعد)" : "Transformations"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={transformations.title} onChange={v => set("transformations.title", v)}
                placeholder={isAr ? "جدار العظمة" : "Wall of Greatness"} />
              <Field label={isAr ? "الشارة" : "Badge"} value={transformations.badge} onChange={v => set("transformations.badge", v)}
                placeholder={isAr ? "تحولات حقيقية" : "Real Transformations"} />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={transformations.subtitle} onChange={v => set("transformations.subtitle", v)} multiline />
              </div>
            </div>

            <ItemList
              items={transformations.items || []}
              title={isAr ? "صور التحولات" : "Transformation Images"}
              fields={[
                { key: "name", label: isAr ? "الاسم" : "Name" },
                { key: "before", label: isAr ? "صورة قبل" : "Before Image" },
                { key: "after", label: isAr ? "صورة بعد" : "After Image" },
              ]}
              defaultItem={{ name: "", before: "", after: "" }}
              onAdd={() => addItem("transformations.items", { name: "", before: "", after: "" })}
              onRemove={(i) => removeItem("transformations.items", i)}
              onMove={(i, d) => moveItem("transformations.items", i, d)}
              onUpdate={(i, k, v) => updateItem("transformations.items", i, k, v)}
              renderExtra={(item, i) => (
                <div className="flex gap-2 mt-2">
                  {item.before && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/5">
                      <img src={item.before} alt="before" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[7px] text-white text-center font-bold">{isAr ? "قبل" : "B"}</span>
                    </div>
                  )}
                  {item.after && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/5">
                      <img src={item.after} alt="after" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/80 text-[7px] text-white text-center font-bold">{isAr ? "بعد" : "A"}</span>
                    </div>
                  )}
                </div>
              )}
            />
          </Section>
        )}

        {/* ===== PRICING TAB ===== */}
        {activeTab === "pricing" && (
          <Section title={isAr ? "خطط الأسعار" : "Pricing Plans"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={pricing.title} onChange={v => set("pricing.title", v)}
                placeholder={isAr ? "اختر باقتك" : "Choose Your Plan"} />
              <Field label={isAr ? "الشارة" : "Badge"} value={pricing.badge} onChange={v => set("pricing.badge", v)}
                placeholder={isAr ? "خطط الأسعار" : "Plans & Pricing"} />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={pricing.subtitle} onChange={v => set("pricing.subtitle", v)} multiline />
              </div>
            </div>

            {/* Promo Marquee Strips */}
            <div className="bg-white/[0.02] rounded-xl border border-white/5 p-4 mb-6">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-3">{isAr ? "الشريط الإعلاني (فوق)" : "Top Promo Marquee"}</h4>
              <ArrayEdit label={isAr ? "النصوص" : "Text Items"} items={pricing.promoTopItems || []} onChange={v => set("pricing.promoTopItems", v)} />
            </div>
            <div className="bg-white/[0.02] rounded-xl border border-white/5 p-4 mb-6">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-3">{isAr ? "الشريط الإعلاني (تحت)" : "Bottom Promo Marquee"}</h4>
              <ArrayEdit label={isAr ? "النصوص" : "Text Items"} items={pricing.promoBottomItems || []} onChange={v => set("pricing.promoBottomItems", v)} />
            </div>

            {/* Duration Periods */}
            <div className="bg-white/[0.02] rounded-xl border border-white/5 p-4 mb-6">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-3">{isAr ? "فترات المدة (الأزرار فوق الباقات)" : "Duration Periods"}</h4>
              <div className="space-y-2">
                {(pricing.periods || []).map((p: any, i: number) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={p.label} onChange={e => {
                      const arr = [...(pricing.periods || [])];
                      arr[i] = { ...arr[i], label: e.target.value };
                      set("pricing.periods", arr);
                    }}
                      className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
                    <label className="flex items-center gap-1 text-[8px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap">
                      <input type="checkbox" checked={p.active || false}
                        onChange={e => {
                          const arr = [...(pricing.periods || [])];
                          arr[i] = { ...arr[i], active: e.target.checked };
                          set("pricing.periods", arr);
                        }}
                        className="accent-emerald-500" />
                      {isAr ? "نشط" : "Active"}
                    </label>
                    <button onClick={() => {
                      const arr = pricing.periods.filter((_: any, j: number) => j !== i);
                      set("pricing.periods", arr);
                    }}
                      className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                const arr = [...(pricing.periods || []), { label: "", active: false }];
                set("pricing.periods", arr);
              }}
                className="mt-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
                + {isAr ? "إضافة فترة" : "Add Period"}
              </button>
            </div>

            {/* Plans */}
            <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase italic tracking-tight text-white">{isAr ? "الباقات" : "Plans"}</h3>
                <button onClick={() => addItem("pricing.plans", {
                  id: `plan-${Date.now()}`, name: "", subtitle: "", price: "", currency: "£",
                  duration: "", popular: false, badge: "", features: [], ctaText: ""
                })}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-1.5">
                  <Plus size={12} /> {isAr ? "إضافة باقة" : "Add Plan"}
                </button>
              </div>

              <div className="space-y-4">
                {(pricing.plans || []).map((plan: any, idx: number) => (
                  <div key={plan.id || idx} className="bg-white/[0.03] rounded-xl border border-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-black">#{idx + 1}</span>
                        <span className="text-[9px] font-black text-slate-500 uppercase">{plan.name || (isAr ? "باقة جديدة" : "New Plan")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-[8px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer">
                          <input type="checkbox" checked={plan.popular} onChange={e => updateItem("pricing.plans", idx, "popular", e.target.checked)}
                            className="accent-emerald-500" />
                          {isAr ? "شائع" : "Popular"}
                        </label>
                        <button onClick={() => moveItem("pricing.plans", idx, -1)} disabled={idx === 0}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"><ArrowUp size={12} /></button>
                        <button onClick={() => moveItem("pricing.plans", idx, 1)} disabled={idx === (pricing.plans || []).length - 1}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"><ArrowDown size={12} /></button>
                        <button onClick={() => removeItem("pricing.plans", idx)}
                          className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white"><X size={12} /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <Field label={isAr ? "الاسم" : "Name"} value={plan.name} onChange={v => updateItem("pricing.plans", idx, "name", v)}
                        placeholder={isAr ? "الباقة الاحترافية" : "Pro Package"} />
                      <Field label={isAr ? "السعر" : "Price"} value={plan.price} onChange={v => updateItem("pricing.plans", idx, "price", v)}
                        placeholder="2500" />
                      <Field label={isAr ? "العملة" : "Currency"} value={plan.currency} onChange={v => updateItem("pricing.plans", idx, "currency", v)}
                        placeholder="£" />
                      <Field label={isAr ? "الشارة" : "Badge"} value={plan.badge} onChange={v => updateItem("pricing.plans", idx, "badge", v)}
                        placeholder={isAr ? "الأكثر طلباً" : "Most Popular"} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div className="md:col-span-2">
                        <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={plan.subtitle} onChange={v => updateItem("pricing.plans", idx, "subtitle", v)}
                          placeholder="Follow-up with Sama Fit Team" />
                      </div>
                      <Field label={isAr ? "مدة العرض" : "Duration"} value={plan.duration} onChange={v => updateItem("pricing.plans", idx, "duration", v)}
                        placeholder="+ 3 months free" />
                    </div>
                    <Field label={isAr ? "نص الزر" : "CTA Text"} value={plan.ctaText} onChange={v => updateItem("pricing.plans", idx, "ctaText", v)}
                      placeholder={isAr ? "ابدأ الآن" : "Get Started"} />

                    {/* Features */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                        {isAr ? "المميزات" : "Features"}
                      </label>
                      <div className="space-y-1.5">
                        {(plan.features || []).map((f: string, fi: number) => (
                          <div key={fi} className="flex gap-2">
                            <input value={f} onChange={e => {
                              const arr = [...(plan.features || [])];
                              arr[fi] = e.target.value;
                              updateItem("pricing.plans", idx, "features", arr);
                            }}
                              className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
                            <button onClick={() => {
                              const arr = plan.features.filter((_: string, j: number) => j !== fi);
                              updateItem("pricing.plans", idx, "features", arr);
                            }}
                              className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => {
                        const arr = [...(plan.features || []), ""];
                        updateItem("pricing.plans", idx, "features", arr);
                      }}
                        className="mt-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
                        + {isAr ? "إضافة ميزة" : "Add Feature"}
                      </button>
                    </div>
                  </div>
                ))}
                {(!pricing.plans || pricing.plans.length === 0) && (
                  <div className="text-center py-8 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{isAr ? "لا توجد باقات بعد" : "No plans yet"}</div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* ===== TESTIMONIALS TAB ===== */}
        {activeTab === "testimonials" && (
          <Section title={isAr ? "آراء العملاء" : "Testimonials"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={testimonials.title} onChange={v => set("testimonials.title", v)}
                placeholder={isAr ? "ماذا يقول عملاؤنا عنا" : "What Our Clients Say"} />
              <Field label={isAr ? "الشارة" : "Badge"} value={testimonials.badge} onChange={v => set("testimonials.badge", v)}
                placeholder={isAr ? "الشهادات" : "Testimonials"} />
            </div>

            <ItemList
              items={testimonials.items || []}
              title={isAr ? "المراجعات" : "Reviews"}
              fields={[
                { key: "name", label: isAr ? "الاسم" : "Name" },
                { key: "role", label: isAr ? "الدور" : "Role/Result" },
                { key: "rating", label: isAr ? "التقييم (1-5)" : "Rating (1-5)" },
                { key: "content", label: isAr ? "المحتوى" : "Content" },
              ]}
              defaultItem={{ name: "", role: "", content: "", rating: "5" }}
              onAdd={() => addItem("testimonials.items", { name: "", role: "", content: "", rating: "5" })}
              onRemove={(i) => removeItem("testimonials.items", i)}
              onMove={(i, d) => moveItem("testimonials.items", i, d)}
              onUpdate={(i, k, v) => updateItem("testimonials.items", i, k, v)}
              textAreaFields={["content"]}
            />
          </Section>
        )}

        {/* ===== FOOTER TAB ===== */}
        {activeTab === "footer" && (
          <Section title={isAr ? "التذييل" : "Footer"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="md:col-span-2">
                <Field label={isAr ? "رابط الشعار" : "Logo URL"} value={footer.logo} onChange={v => set("footer.logo", v)} />
              </div>
              <div className="md:col-span-2">
                <Field label={isAr ? "الوصف" : "Description"} value={footer.description} onChange={v => set("footer.description", v)} multiline />
              </div>
            </div>

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">{isAr ? "معلومات الاتصال" : "Contact Info"}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white/[0.02] rounded-xl p-4 border border-white/5">
              <Field label={isAr ? "العنوان" : "Address"} value={footer.contact?.address} onChange={v => set("footer.contact.address", v)}
                placeholder="Alexandria, Egypt" />
              <Field label={isAr ? "البريد" : "Email"} value={footer.contact?.email} onChange={v => set("footer.contact.email", v)}
                placeholder="email@example.com" />
              <Field label={isAr ? "الهاتف" : "Phone"} value={footer.contact?.phone} onChange={v => set("footer.contact.phone", v)}
                placeholder="+20 100 000 0000" />
            </div>

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">{isAr ? "روابط التواصل" : "Social Links"}</h4>
            <ItemList
              items={footer.socialLinks || []}
              title={isAr ? "روابط التواصل" : "Social Links"}
              fields={[
                { key: "platform", label: isAr ? "المنصة" : "Platform" },
                { key: "url", label: isAr ? "الرابط" : "URL" },
                { key: "icon", label: isAr ? "الأيقونة" : "Icon" },
              ]}
              defaultItem={{ platform: "", url: "", icon: "🔗" }}
              onAdd={() => addItem("footer.socialLinks", { platform: "", url: "", icon: "🔗" })}
              onRemove={(i) => removeItem("footer.socialLinks", i)}
              onMove={(i, d) => moveItem("footer.socialLinks", i, d)}
              onUpdate={(i, k, v) => updateItem("footer.socialLinks", i, k, v)}
            />

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 mt-6">{isAr ? "روابط التذييل" : "Footer Links"}</h4>
            <ItemList
              items={footer.links || []}
              title={isAr ? "الروابط" : "Links"}
              fields={[
                { key: "label", label: isAr ? "النص" : "Label" },
                { key: "url", label: isAr ? "الرابط" : "URL" },
              ]}
              defaultItem={{ label: "", url: "" }}
              onAdd={() => addItem("footer.links", { label: "", url: "" })}
              onRemove={(i) => removeItem("footer.links", i)}
              onMove={(i, d) => moveItem("footer.links", i, d)}
              onUpdate={(i, k, v) => updateItem("footer.links", i, k, v)}
            />

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 mt-6">{isAr ? "روابط المتجر" : "App Store Links"}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] rounded-xl p-4 border border-white/5">
              <Field label="iOS (App Store)" value={footer.appStore?.ios} onChange={v => set("footer.appStore.ios", v)}
                placeholder="https://apps.apple.com/..." />
              <Field label="Android (Play Store)" value={footer.appStore?.android} onChange={v => set("footer.appStore.android", v)}
                placeholder="https://play.google.com/..." />
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

/* ===== UI Components ===== */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f111a] rounded-2xl border border-white/[0.05] p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
        <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value?: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium";
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} placeholder={placeholder} />
      ) : (
        <input value={value || ""} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange, slug, onPick }: {
  label: string; value?: string; onChange: (v: string) => void; slug: string; onPick: (path: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        <input value={value || ""} onChange={e => onChange(e.target.value)}
          className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-medium"
          placeholder="https://..." />
      </div>
      {value && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/5 mt-1">
          <img src={value} alt={label} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

function ArrayEdit({ label, items, onChange }: {
  label: string; items: string[]; onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2 bg-white/[0.02] rounded-xl p-4 border border-white/5">
      <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
              className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white"><X size={14} /></button>
          </div>
        ))}
      </div>
      <button onClick={() => onChange([...items, ""])}
        className="text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
        + {label}
      </button>
    </div>
  );
}

function ItemList({ items, title, fields, onAdd, onRemove, onMove, onUpdate, textAreaFields, renderExtra }: {
  items: any[];
  title: string;
  fields: { key: string; label: string }[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onMove: (idx: number, dir: number) => void;
  onUpdate: (idx: number, key: string, value: any) => void;
  textAreaFields?: string[];
  renderExtra?: (item: any, idx: number) => React.ReactNode;
  defaultItem?: any;
}) {
  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase italic tracking-tight text-white">{title}</h3>
        <button onClick={onAdd}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-1.5">
          <Plus size={12} /> {title}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/[0.03] rounded-xl border border-white/5 p-4 group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-black">#{idx + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onMove(idx, -1)} disabled={idx === 0}
                  className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"><ArrowUp size={12} /></button>
                <button onClick={() => onMove(idx, 1)} disabled={idx === items.length - 1}
                  className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"><ArrowDown size={12} /></button>
                <button onClick={() => onRemove(idx)}
                  className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white"><X size={12} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f.key} className={f.key === "content" ? "md:col-span-2" : ""}>
                  {textAreaFields?.includes(f.key) ? (
                    <Field label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} multiline />
                  ) : (
                    <Field label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} />
                  )}
                </div>
              ))}
            </div>
            {renderExtra && renderExtra(item, idx)}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-[10px] font-bold uppercase tracking-wider">Empty</div>
        )}
      </div>
    </div>
  );
}
