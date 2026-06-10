"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save, Loader2, Plus, X, ArrowUp, ArrowDown, Image as ImageIcon,
  Eye, ExternalLink
} from "lucide-react";
import { saveStoreSettings } from "../actions";
import { useLanguageStore } from "@/store/language";
import { toast } from "sonner";

type IpData = Record<string, any>;

export default function IronPeakDashboard({
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

  const ip = settings.ironpeakSettings || {};
  const get = (path: string) => {
    const parts = path.split(".");
    let obj = ip;
    for (const p of parts) {
      if (obj == null) return undefined;
      obj = obj[p];
    }
    return obj;
  };

  const set = (path: string, value: any) => {
    const parts = path.split(".");
    const newIp = JSON.parse(JSON.stringify(ip || {}));
    let obj = newIp;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    setSettings({ ...settings, ironpeakSettings: newIp });
  };

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
    { id: "about", label: isAr ? "عن" : "About", icon: "ℹ️" },
    { id: "services", label: isAr ? "الخدمات" : "Services", icon: "🛎️" },
    { id: "pricing", label: isAr ? "الباقات" : "Pricing", icon: "💰" },
    { id: "trainers", label: isAr ? "المدربين" : "Trainers", icon: "👨‍🏫" },
    { id: "testimonials", label: isAr ? "الآراء" : "Testimonials", icon: "⭐" },
    { id: "blog", label: isAr ? "المدونة" : "Blog", icon: "📝" },
    { id: "contact", label: isAr ? "التواصل" : "Contact", icon: "✉️" },
    { id: "footer", label: isAr ? "التذييل" : "Footer", icon: "📋" },
    { id: "nav", label: isAr ? "القائمة" : "Nav", icon: "🧭" },
  ];

  const hero = ip.hero || {};
  const about = ip.about || {};
  const services = ip.services || {};
  const pricing = ip.pricing || {};
  const trainers = ip.trainers || {};
  const testimonials = ip.testimonials || {};
  const blog = ip.blog || {};
  const contact = ip.contact || {};
  const footer = ip.footer || {};
  const nav = ip.nav || {};

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0c14]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div>
            <h1 className="text-base font-black italic tracking-tighter uppercase flex items-center gap-2">
              <span className="text-orange-400">IronPeak </span>
              <span className="text-white text-[9px] font-bold text-slate-400">— {isAr ? "تحكم كامل" : "Full Control"}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/store/${slug}`} target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all">
              <ExternalLink size={10} /> {isAr ? "عرض" : "View"}
            </Link>
            <button onClick={save} disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all disabled:opacity-50 shadow-lg shadow-orange-600/20">
              {isPending ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
              {isPending ? (isAr ? "..." : "...") : (isAr ? "حفظ" : "Save")}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 px-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "text-orange-400 border-orange-400 bg-orange-400/5"
                  : "text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-600"
              }`}>
              <span className="text-[11px]">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto space-y-4">
        {/* ===== HERO TAB ===== */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <Section title={isAr ? "قسم الهيرو" : "Hero Section"}>
              <ActiveToggle checked={hero.enabled !== false} onChange={v => set("hero.enabled", v)} isAr={isAr} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={isAr ? "العنوان الرئيسي" : "Title"} value={hero.title} onChange={v => set("hero.title", v)} placeholder="TRANSFORM YOUR BODY, TRANSFORM YOUR LIFE" />
                <div className="md:col-span-2">
                  <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={hero.subtitle} onChange={v => set("hero.subtitle", v)} multiline />
                </div>
              </div>
              <div className="grid grid-cols-1 md:col-span-2 gap-4 mt-4">
                <ImageField label={isAr ? "صورة الخلفية" : "Background Image"} value={hero.backgroundImage} onChange={v => set("hero.backgroundImage", v)} />
              </div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mt-6 mb-3">{isAr ? "الأزرار" : "CTA Buttons"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={isAr ? "النص - الزر الرئيسي" : "Primary Text"} value={hero.primaryCta?.text} onChange={v => set("hero.primaryCta.text", v)} placeholder="Join Now" />
                <Field label={isAr ? "الرابط" : "Primary Link"} value={hero.primaryCta?.href} onChange={v => set("hero.primaryCta.href", v)} placeholder="#pricing" />
                <Field label={isAr ? "النص - الزر الثانوي" : "Secondary Text"} value={hero.secondaryCta?.text} onChange={v => set("hero.secondaryCta.text", v)} placeholder="Learn More" />
                <Field label={isAr ? "الرابط" : "Secondary Link"} value={hero.secondaryCta?.href} onChange={v => set("hero.secondaryCta.href", v)} placeholder="#about" />
              </div>
            </Section>
          </div>
        )}

        {/* ===== ABOUT TAB ===== */}
        {activeTab === "about" && (
          <Section title={isAr ? "قسم عن" : "About Section"}>
            <ActiveToggle checked={about.enabled !== false} onChange={v => set("about.enabled", v)} isAr={isAr} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={about.sectionTitle} onChange={v => set("about.sectionTitle", v)} placeholder="About Us" />
              <Field label={isAr ? "النص الفرعي" : "Section Subtitle"} value={about.sectionSubtitle} onChange={v => set("about.sectionSubtitle", v)} placeholder="We're More Than Just A Gym" />
              <div className="md:col-span-2">
                <Field label={isAr ? "العنوان الداخلي" : "Heading"} value={about.heading} onChange={v => set("about.heading", v)} placeholder="Your Fitness Journey Starts Here" />
              </div>
              <div className="md:col-span-2">
                <Field label={isAr ? "الفقرة الأولى" : "Paragraph 1"} value={about.paragraph1} onChange={v => set("about.paragraph1", v)} multiline />
              </div>
              <div className="md:col-span-2">
                <Field label={isAr ? "الفقرة الثانية" : "Paragraph 2"} value={about.paragraph2} onChange={v => set("about.paragraph2", v)} multiline />
              </div>
              <ImageField label={isAr ? "الصورة" : "Image"} value={about.image} onChange={v => set("about.image", v)} />
            </div>
            <ItemList
              items={about.features || []}
              title={isAr ? "المميزات" : "Features"}
              fields={[
                { key: "icon", label: isAr ? "الأيقونة" : "Icon" },
                { key: "text", label: isAr ? "النص" : "Text" },
              ]}
              defaultItem={{ icon: "🏋️", text: "" }}
              onAdd={() => addItem("about.features", { icon: "🏋️", text: "" })}
              onRemove={(i) => removeItem("about.features", i)}
              onMove={(i, d) => moveItem("about.features", i, d)}
              onUpdate={(i, k, v) => updateItem("about.features", i, k, v)}
            />
          </Section>
        )}

        {/* ===== SERVICES TAB ===== */}
        {activeTab === "services" && (
          <Section title={isAr ? "الخدمات" : "Services"}>
            <ActiveToggle checked={services.enabled !== false} onChange={v => set("services.enabled", v)} isAr={isAr} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={services.sectionTitle} onChange={v => set("services.sectionTitle", v)} placeholder="Our Services" />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={services.sectionSubtitle} onChange={v => set("services.sectionSubtitle", v)} multiline />
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
              textAreaFields={["description"]}
            />
          </Section>
        )}

        {/* ===== PRICING TAB ===== */}
        {activeTab === "pricing" && (
          <Section title={isAr ? "خطط الأسعار" : "Pricing Plans"}>
            <ActiveToggle checked={pricing.enabled !== false} onChange={v => set("pricing.enabled", v)} isAr={isAr} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={pricing.sectionTitle} onChange={v => set("pricing.sectionTitle", v)} placeholder="Fitness Plans" />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={pricing.sectionSubtitle} onChange={v => set("pricing.sectionSubtitle", v)} multiline />
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase italic tracking-tight text-white">{isAr ? "الباقات" : "Plans"}</h3>
                <button onClick={() => addItem("pricing.plans", {
                  name: "", price: "$0", period: "/month", description: "", popular: false, badge: "",
                  ctaText: "Get Started", ctaVariant: "secondary", features: []
                })}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-1.5">
                  <Plus size={12} /> {isAr ? "إضافة باقة" : "Add Plan"}
                </button>
              </div>

              <div className="space-y-4">
                {(pricing.plans || []).map((plan: any, idx: number) => (
                  <div key={idx} className="bg-white/[0.03] rounded-xl border border-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-black">#{idx + 1}</span>
                        <span className="text-[9px] font-black text-slate-500 uppercase">{plan.name || (isAr ? "باقة جديدة" : "New Plan")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-[8px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer">
                          <input type="checkbox" checked={plan.popular} onChange={e => updateItem("pricing.plans", idx, "popular", e.target.checked)}
                            className="accent-orange-500" />
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
                      <Field label={isAr ? "الاسم" : "Name"} value={plan.name} onChange={v => updateItem("pricing.plans", idx, "name", v)} placeholder="Pro" />
                      <Field label={isAr ? "السعر" : "Price"} value={plan.price} onChange={v => updateItem("pricing.plans", idx, "price", v)} placeholder="$59" />
                      <Field label={isAr ? "المدة" : "Period"} value={plan.period} onChange={v => updateItem("pricing.plans", idx, "period", v)} placeholder="/month" />
                      <Field label={isAr ? "الشارة" : "Badge"} value={plan.badge} onChange={v => updateItem("pricing.plans", idx, "badge", v)} placeholder="Most Popular" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div className="md:col-span-2">
                        <Field label={isAr ? "الوصف" : "Description"} value={plan.description} onChange={v => updateItem("pricing.plans", idx, "description", v)} placeholder="Best value for regulars" />
                      </div>
                      <Field label={isAr ? "نوع الزر" : "CTA Variant"} value={plan.ctaVariant} onChange={v => updateItem("pricing.plans", idx, "ctaVariant", v)} placeholder="primary or secondary" />
                    </div>
                    <Field label={isAr ? "نص الزر" : "CTA Text"} value={plan.ctaText} onChange={v => updateItem("pricing.plans", idx, "ctaText", v)} placeholder="Get Started" />

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                        {isAr ? "المميزات" : "Features"}
                      </label>
                      <div className="space-y-1.5">
                        {(plan.features || []).map((f: any, fi: number) => (
                          <div key={fi} className="flex gap-2 items-center">
                            <input value={f.text || f} onChange={e => {
                              const arr = [...(plan.features || [])];
                              arr[fi] = typeof arr[fi] === "string" ? e.target.value : { ...arr[fi], text: e.target.value };
                              updateItem("pricing.plans", idx, "features", arr);
                            }}
                              className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                            <label className="flex items-center gap-1 text-[8px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap">
                              <input type="checkbox" checked={f.enabled !== false}
                                onChange={e => {
                                  const arr = [...(plan.features || [])];
                                  arr[fi] = typeof arr[fi] === "string" ? { text: arr[fi], enabled: e.target.checked } : { ...arr[fi], enabled: e.target.checked };
                                  updateItem("pricing.plans", idx, "features", arr);
                                }}
                                className="accent-orange-500" />
                              {isAr ? "مفعل" : "On"}
                            </label>
                            <button onClick={() => {
                              const arr = plan.features.filter((_: any, j: number) => j !== fi);
                              updateItem("pricing.plans", idx, "features", arr);
                            }}
                              className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => {
                        const arr = [...(plan.features || []), { text: "", enabled: true }];
                        updateItem("pricing.plans", idx, "features", arr);
                      }}
                        className="mt-2 text-[9px] font-black text-orange-400 uppercase tracking-widest hover:text-orange-300 transition-colors">
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

        {/* ===== TRAINERS TAB ===== */}
        {activeTab === "trainers" && (
          <Section title={isAr ? "المدربون" : "Trainers"}>
            <ActiveToggle checked={trainers.enabled !== false} onChange={v => set("trainers.enabled", v)} isAr={isAr} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={trainers.sectionTitle} onChange={v => set("trainers.sectionTitle", v)} placeholder="Meet Our Trainers" />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={trainers.sectionSubtitle} onChange={v => set("trainers.sectionSubtitle", v)} multiline />
              </div>
            </div>
            <ItemList
              items={trainers.items || []}
              title={isAr ? "المدربون" : "Trainer Items"}
              fields={[
                { key: "name", label: isAr ? "الاسم" : "Name" },
                { key: "role", label: isAr ? "الدور" : "Role" },
                { key: "bio", label: isAr ? "السيرة" : "Bio" },
                { key: "image", label: isAr ? "الصورة" : "Image" },
              ]}
              defaultItem={{ name: "", role: "", bio: "", image: "" }}
              onAdd={() => addItem("trainers.items", { name: "", role: "", bio: "", image: "" })}
              onRemove={(i) => removeItem("trainers.items", i)}
              onMove={(i, d) => moveItem("trainers.items", i, d)}
              onUpdate={(i, k, v) => updateItem("trainers.items", i, k, v)}
              textAreaFields={["bio"]}
              renderExtra={(item, i) => item.image && (
                <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-white/5">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            />
          </Section>
        )}

        {/* ===== TESTIMONIALS TAB ===== */}
        {activeTab === "testimonials" && (
          <Section title={isAr ? "آراء العملاء" : "Testimonials"}>
            <ActiveToggle checked={testimonials.enabled !== false} onChange={v => set("testimonials.enabled", v)} isAr={isAr} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={testimonials.sectionTitle} onChange={v => set("testimonials.sectionTitle", v)} placeholder="What Our Members Say" />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={testimonials.sectionSubtitle} onChange={v => set("testimonials.sectionSubtitle", v)} multiline />
              </div>
            </div>
            <ItemList
              items={testimonials.items || []}
              title={isAr ? "المراجعات" : "Reviews"}
              fields={[
                { key: "author", label: isAr ? "الاسم" : "Author" },
                { key: "meta", label: isAr ? "الوصف" : "Meta" },
                { key: "initials", label: isAr ? "الأحرف الأولى" : "Initials" },
                { key: "quote", label: isAr ? "المحتوى" : "Quote" },
              ]}
              defaultItem={{ author: "", meta: "", initials: "", quote: "" }}
              onAdd={() => addItem("testimonials.items", { author: "", meta: "", initials: "", quote: "" })}
              onRemove={(i) => removeItem("testimonials.items", i)}
              onMove={(i, d) => moveItem("testimonials.items", i, d)}
              onUpdate={(i, k, v) => updateItem("testimonials.items", i, k, v)}
              textAreaFields={["quote"]}
            />
          </Section>
        )}

        {/* ===== BLOG TAB ===== */}
        {activeTab === "blog" && (
          <Section title={isAr ? "المدونة" : "Blog"}>
            <ActiveToggle checked={blog.enabled !== false} onChange={v => set("blog.enabled", v)} isAr={isAr} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={blog.sectionTitle} onChange={v => set("blog.sectionTitle", v)} placeholder="Latest From Our Blog" />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={blog.sectionSubtitle} onChange={v => set("blog.sectionSubtitle", v)} multiline />
              </div>
            </div>
            <ItemList
              items={blog.items || []}
              title={isAr ? "المقالات" : "Blog Items"}
              fields={[
                { key: "title", label: isAr ? "العنوان" : "Title" },
                { key: "date", label: isAr ? "التاريخ" : "Date" },
                { key: "category", label: isAr ? "التصنيف" : "Category" },
                { key: "description", label: isAr ? "الوصف" : "Description" },
                { key: "image", label: isAr ? "الصورة" : "Image" },
              ]}
              defaultItem={{ title: "", date: "", category: "", description: "", image: "" }}
              onAdd={() => addItem("blog.items", { title: "", date: "", category: "", description: "", image: "" })}
              onRemove={(i) => removeItem("blog.items", i)}
              onMove={(i, d) => moveItem("blog.items", i, d)}
              onUpdate={(i, k, v) => updateItem("blog.items", i, k, v)}
              textAreaFields={["description"]}
              renderExtra={(item, i) => item.image && (
                <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden border border-white/5">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            />
          </Section>
        )}

        {/* ===== CONTACT TAB ===== */}
        {activeTab === "contact" && (
          <Section title={isAr ? "التواصل" : "Contact"}>
            <ActiveToggle checked={contact.enabled !== false} onChange={v => set("contact.enabled", v)} isAr={isAr} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "عنوان القسم" : "Section Title"} value={contact.sectionTitle} onChange={v => set("contact.sectionTitle", v)} placeholder="Get In Touch" />
              <div className="md:col-span-2">
                <Field label={isAr ? "النص الفرعي" : "Subtitle"} value={contact.sectionSubtitle} onChange={v => set("contact.sectionSubtitle", v)} multiline />
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-xl border border-white/5 p-4 mb-6">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-3">{isAr ? "إعدادات الفورم" : "Form Settings"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={isAr ? "نص الحقل - الاسم" : "Name Placeholder"} value={contact.form?.namePlaceholder} onChange={v => set("contact.form.namePlaceholder", v)} placeholder="John Doe" />
                <Field label={isAr ? "نص الحقل - البريد" : "Email Placeholder"} value={contact.form?.emailPlaceholder} onChange={v => set("contact.form.emailPlaceholder", v)} placeholder="john@example.com" />
                <Field label={isAr ? "نص الحقل - الهاتف" : "Phone Placeholder"} value={contact.form?.phonePlaceholder} onChange={v => set("contact.form.phonePlaceholder", v)} placeholder="(555) 123-4567" />
                <Field label={isAr ? "نص الحقل - الرسالة" : "Message Placeholder"} value={contact.form?.messagePlaceholder} onChange={v => set("contact.form.messagePlaceholder", v)} placeholder="Tell us about your fitness goals..." />
                <Field label={isAr ? "نص الزر" : "Button Text"} value={contact.form?.buttonText} onChange={v => set("contact.form.buttonText", v)} placeholder="Send Message" />
                <div className="md:col-span-2">
                  <Field label={isAr ? "رسالة النجاح" : "Success Message"} value={contact.form?.successMessage} onChange={v => set("contact.form.successMessage", v)} placeholder="Thank you for your message!" />
                </div>
              </div>
            </div>

            <ItemList
              items={contact.items || []}
              title={isAr ? "معلومات الاتصال" : "Contact Info Items"}
              fields={[
                { key: "icon", label: isAr ? "الأيقونة" : "Icon" },
                { key: "title", label: isAr ? "العنوان" : "Title" },
                { key: "text", label: isAr ? "النص" : "Text" },
              ]}
              defaultItem={{ icon: "📍", title: "", text: "" }}
              onAdd={() => addItem("contact.items", { icon: "📍", title: "", text: "" })}
              onRemove={(i) => removeItem("contact.items", i)}
              onMove={(i, d) => moveItem("contact.items", i, d)}
              onUpdate={(i, k, v) => updateItem("contact.items", i, k, v)}
              textAreaFields={["text"]}
            />
          </Section>
        )}

        {/* ===== FOOTER TAB ===== */}
        {activeTab === "footer" && (
          <Section title={isAr ? "التذييل" : "Footer"}>
            <ActiveToggle checked={footer.enabled !== false} onChange={v => set("footer.enabled", v)} isAr={isAr} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label="Logo" value={footer.logo} onChange={v => set("footer.logo", v)} placeholder="IRON" />
              <Field label="Logo Suffix" value={footer.logoSuffix} onChange={v => set("footer.logoSuffix", v)} placeholder="PEAK" />
              <div className="md:col-span-2">
                <Field label={isAr ? "الوصف" : "Description"} value={footer.description} onChange={v => set("footer.description", v)} multiline />
              </div>
              <div className="md:col-span-2">
                <Field label={isAr ? "حقوق النشر" : "Copyright"} value={footer.copyright} onChange={v => set("footer.copyright", v)} placeholder="© 2025 Iron Peak Fitness. All rights reserved." />
              </div>
            </div>

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">{isAr ? "روابط التواصل" : "Social Links"}</h4>
            <ItemList
              items={footer.socialLinks || []}
              title={isAr ? "روابط التواصل" : "Social Links"}
              fields={[
                { key: "icon", label: isAr ? "الأيقونة (bi bi-...)" : "Icon" },
                { key: "url", label: isAr ? "الرابط" : "URL" },
              ]}
              defaultItem={{ icon: "bi bi-facebook", url: "#" }}
              onAdd={() => addItem("footer.socialLinks", { icon: "bi bi-facebook", url: "#" })}
              onRemove={(i) => removeItem("footer.socialLinks", i)}
              onMove={(i, d) => moveItem("footer.socialLinks", i, d)}
              onUpdate={(i, k, v) => updateItem("footer.socialLinks", i, k, v)}
            />

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 mt-6">{isAr ? "الروابط السريعة" : "Quick Links"}</h4>
            <ItemList
              items={footer.quickLinks || []}
              title={isAr ? "الروابط" : "Links"}
              fields={[
                { key: "label", label: isAr ? "النص" : "Label" },
                { key: "href", label: "href" },
              ]}
              defaultItem={{ label: "", href: "#" }}
              onAdd={() => addItem("footer.quickLinks", { label: "", href: "#" })}
              onRemove={(i) => removeItem("footer.quickLinks", i)}
              onMove={(i, d) => moveItem("footer.quickLinks", i, d)}
              onUpdate={(i, k, v) => updateItem("footer.quickLinks", i, k, v)}
            />

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 mt-6">{isAr ? "البرامج" : "Programs"}</h4>
            <ItemList
              items={footer.programs || []}
              title={isAr ? "البرامج" : "Programs"}
              fields={[
                { key: "label", label: isAr ? "النص" : "Label" },
                { key: "href", label: "href" },
              ]}
              defaultItem={{ label: "", href: "#" }}
              onAdd={() => addItem("footer.programs", { label: "", href: "#" })}
              onRemove={(i) => removeItem("footer.programs", i)}
              onMove={(i, d) => moveItem("footer.programs", i, d)}
              onUpdate={(i, k, v) => updateItem("footer.programs", i, k, v)}
            />

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 mt-6">{isAr ? "معلومات التواصل" : "Contact Info"}</h4>
            <ItemList
              items={footer.contactInfo || []}
              title={isAr ? "المعلومات" : "Items"}
              fields={[
                { key: "icon", label: isAr ? "الأيقونة" : "Icon" },
                { key: "text", label: isAr ? "النص" : "Text" },
              ]}
              defaultItem={{ icon: "bi bi-geo-alt", text: "" }}
              onAdd={() => addItem("footer.contactInfo", { icon: "bi bi-geo-alt", text: "" })}
              onRemove={(i) => removeItem("footer.contactInfo", i)}
              onMove={(i, d) => moveItem("footer.contactInfo", i, d)}
              onUpdate={(i, k, v) => updateItem("footer.contactInfo", i, k, v)}
            />
          </Section>
        )}

        {/* ===== NAV TAB ===== */}
        {activeTab === "nav" && (
          <Section title={isAr ? "القائمة" : "Navigation"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label={isAr ? "نص اللوجو" : "Logo Text"} value={nav.logo} onChange={v => set("nav.logo", v)} placeholder="IRON" />
              <Field label={isAr ? "لاحقة اللوجو" : "Logo Suffix"} value={nav.logoSuffix} onChange={v => set("nav.logoSuffix", v)} placeholder="PEAK" />
            </div>
            <ItemList
              items={nav.links || []}
              title={isAr ? "روابط القائمة" : "Nav Links"}
              fields={[
                { key: "label", label: isAr ? "النص" : "Label" },
                { key: "href", label: "href" },
              ]}
              defaultItem={{ label: "", href: "#" }}
              onAdd={() => addItem("nav.links", { label: "", href: "#" })}
              onRemove={(i) => removeItem("nav.links", i)}
              onMove={(i, d) => moveItem("nav.links", i, d)}
              onUpdate={(i, k, v) => updateItem("nav.links", i, k, v)}
            />
          </Section>
        )}
      </div>
    </div>
  );
}

/* ===== UI Components ===== */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f111a] rounded-xl border border-white/[0.05] p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-0.5 h-4 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
        <h2 className="text-sm font-black italic uppercase tracking-tighter text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value?: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all font-medium";
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

function ImageField({ label, value, onChange }: {
  label: string; value?: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        <input value={value || ""} onChange={e => onChange(e.target.value)}
          className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 font-medium"
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

function ActiveToggle({ checked, onChange, isAr }: { checked: boolean; onChange: (v: boolean) => void; isAr: boolean }) {
  return (
    <label className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5 cursor-pointer">
      <div className={`relative w-9 h-5 rounded-full transition-all ${checked ? 'bg-orange-500' : 'bg-white/10'}`}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest ${checked ? 'text-orange-400' : 'text-slate-600'}`}>
        {checked ? (isAr ? "نشط" : "Active") : (isAr ? "غير نشط" : "Inactive")}
      </span>
    </label>
  );
}

function ItemList({ items, title, fields, onAdd, onRemove, onMove, onUpdate, textAreaFields, renderExtra, defaultItem }: {
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
          className="px-4 py-2 bg-orange-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-1.5">
          <Plus size={12} /> {title}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/[0.03] rounded-xl border border-white/5 p-4 group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-black">#{idx + 1}</span>
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
                <div key={f.key} className={f.key === "quote" || f.key === "description" ? "md:col-span-2" : ""}>
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
