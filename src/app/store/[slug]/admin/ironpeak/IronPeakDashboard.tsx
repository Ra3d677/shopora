"use client";

import React, { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save, Loader2, Plus, X, ArrowUp, ArrowDown, Eye, ExternalLink, Smartphone, Monitor, 
  RefreshCw, Undo2, ChevronDown, ChevronUp, GripVertical, ImagePlus
} from "lucide-react";
import { saveStoreSettings } from "../actions";
import { useLanguageStore } from "@/store/language";
import { toast } from "sonner";

export default function IronPeakDashboard({
  slug, initialSettings, storeName
}: {
  slug: string; initialSettings: any; storeName: string;
}) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("hero");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  const ip = settings.ironpeakSettings || {};

  const get = (path: string) => {
    const parts = path.split(".");
    let obj = ip;
    for (const p of parts) { if (obj == null) return undefined; obj = obj[p]; }
    return obj;
  };

  const set = useCallback((path: string, value: any) => {
    const parts = path.split(".");
    const newIp = JSON.parse(JSON.stringify(ip || {}));
    let obj = newIp;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    setSettings((prev: any) => ({ ...prev, ironpeakSettings: newIp }));
  }, [ip]);

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

  const addItem = (path: string, item: any) => {
    const arr = get(path) || []; set(path, [...arr, item]);
  };
  const removeItem = (path: string, idx: number) => {
    const arr = get(path) || []; set(path, arr.filter((_: any, i: number) => i !== idx));
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

  const tabs = [
    { id: "hero", label: isAr ? "الهيرو" : "Hero", icon: "🔥" },
    { id: "about", label: isAr ? "عن" : "About", icon: "ℹ️" },
    { id: "services", label: isAr ? "الخدمات" : "Services", icon: "⚡" },
    { id: "pricing", label: isAr ? "الباقات" : "Pricing", icon: "💎" },
    { id: "trainers", label: isAr ? "المدربين" : "Trainers", icon: "👤" },
    { id: "testimonials", label: isAr ? "الآراء" : "Testimonials", icon: "💬" },
    { id: "blog", label: isAr ? "المدونة" : "Blog", icon: "📰" },
    { id: "contact", label: isAr ? "التواصل" : "Contact", icon: "📬" },
    { id: "footer", label: isAr ? "التذييل" : "Footer", icon: "🔻" },
    { id: "nav", label: isAr ? "القائمة" : "Nav", icon: "🧭" },
  ];

  return (
    <div dir={dir} className="min-h-screen text-white bg-[#04060e]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#04060e]/90 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white text-xs font-black italic">IP</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                IronPeak
                <span className="text-[7px] font-bold text-orange-400/70 uppercase tracking-[0.3em] bg-orange-400/10 px-2 py-0.5 rounded-full">
                  {isAr ? "تحكم كامل" : "Full Control"}
                </span>
              </h1>
              <p className="text-[8px] text-white/20 font-mono tracking-wider">{storeName} • ironpeak</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode(v => v === "edit" ? "preview" : "edit")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                viewMode === "preview" ? "bg-orange-500/20 text-orange-400 border border-orange-500/20" : "bg-white/5 text-white/40 border border-white/5 hover:text-white/70"
              }`}>
              {viewMode === "preview" ? <Monitor size={12} /> : <Smartphone size={12} />}
              {viewMode === "preview" ? (isAr ? "معاينة" : "Preview") : (isAr ? "تعديل" : "Edit")}
            </button>
            <Link href={`/store/${slug}`} target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <ExternalLink size={12} /> {isAr ? "فتح" : "View"}
            </Link>
            <div className="w-px h-6 bg-white/5" />
            <button onClick={save} disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] font-black uppercase tracking-widest hover:from-orange-500 hover:to-red-500 transition-all disabled:opacity-50 shadow-lg shadow-orange-600/20">
              {isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {isPending ? (isAr ? "حفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-0.5 px-5 pb-1 overflow-x-auto no-scrollbar" style={{scrollbarWidth: 'none'}}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap rounded-t-xl ${
                activeTab === tab.id
                  ? "text-orange-400 bg-gradient-to-b from-orange-500/10 to-transparent"
                  : "text-white/20 hover:text-white/50 hover:bg-white/[0.02]"
              }`}>
              <span className="text-xs">{tab.icon}</span> {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="p-5 max-w-7xl mx-auto">
        {activeTab === "hero" && <HeroEditor hero={hero} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "about" && <AboutEditor about={about} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "services" && <ServicesEditor services={services} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "pricing" && <PricingEditor pricing={pricing} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "trainers" && <TrainersEditor trainers={trainers} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "testimonials" && <TestimonialsEditor testimonials={testimonials} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "blog" && <BlogEditor blog={blog} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "contact" && <ContactEditor contact={contact} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "footer" && <FooterEditor footer={footer} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
        {activeTab === "nav" && <NavEditor nav={nav} set={set} isAr={isAr} addItem={addItem} removeItem={removeItem} moveItem={moveItem} updateItem={updateItem} slug={slug} viewMode={viewMode} />}
      </div>
    </div>
  );
}

/* ===== SECTION EDITORS ===== */

function HeroEditor({ hero, set, isAr, slug, viewMode }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      {/* Visual Preview */}
      <PreviewCard>
        <div className="relative h-56 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center group">
          {hero.backgroundImage && (
            <div className="absolute inset-0 bg-cover bg-center opacity-30 transition-all group-hover:scale-105 duration-700" style={{ backgroundImage: `url(${hero.backgroundImage})` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          <div className="relative z-10 text-center px-6">
            <h3 className="text-white text-2xl font-black mb-2 leading-tight">{hero.title || "YOUR TITLE"}</h3>
            <p className="text-gray-400 text-xs max-w-lg mx-auto leading-relaxed">{hero.subtitle || "Your subtitle text"}</p>
            <div className="flex gap-3 justify-center mt-4">
              <span className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-[10px] font-bold shadow-lg shadow-orange-500/30">
                {hero.primaryCta?.text || "Join Now"}
              </span>
              <span className="px-5 py-2 border border-white/30 rounded-full text-white/80 text-[10px] font-bold">
                {hero.secondaryCta?.text || "Learn More"}
              </span>
            </div>
          </div>
          {!hero.enabled && hero.enabled !== undefined && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/80 rounded-md text-[8px] font-bold text-white uppercase tracking-wider">Disabled</div>
          )}
        </div>
      </PreviewCard>

      {/* Edit Panel */}
      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير الهيرو" : "Hero Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار القسم" : "Show Section"} checked={hero.enabled !== false} onChange={v => set("hero.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "العنوان" : "Title"} value={hero.title} onChange={v => set("hero.title", v)} placeholder="TRANSFORM YOUR BODY..." />
            <FancyField label={isAr ? "صورة الخلفية" : "Background Image"} value={hero.backgroundImage} onChange={v => set("hero.backgroundImage", v)} placeholder="https://..." type="image" slug={slug} />
          </div>
          <FancyField label={isAr ? "النص الفرعي" : "Subtitle"} value={hero.subtitle} onChange={v => set("hero.subtitle", v)} multiline />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "الزر الرئيسي - نص" : "Primary Btn Text"} value={hero.primaryCta?.text} onChange={v => set("hero.primaryCta.text", v)} placeholder="Join Now" />
            <FancyField label={isAr ? "الزر الرئيسي - رابط" : "Primary Btn Link"} value={hero.primaryCta?.href} onChange={v => set("hero.primaryCta.href", v)} placeholder="#pricing" />
            <FancyField label={isAr ? "الزر الثانوي - نص" : "Secondary Btn Text"} value={hero.secondaryCta?.text} onChange={v => set("hero.secondaryCta.text", v)} placeholder="Learn More" />
            <FancyField label={isAr ? "الزر الثانوي - رابط" : "Secondary Btn Link"} value={hero.secondaryCta?.href} onChange={v => set("hero.secondaryCta.href", v)} placeholder="#about" />
          </div>
        </div>
      </EditPanel>
    </div>
  );
}

function AboutEditor({ about, set, isAr, slug, viewMode }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="grid grid-cols-2 gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl items-center">
          <div className="space-y-3">
            <div className="text-[8px] font-bold text-orange-500 uppercase tracking-[0.3em]">{about.sectionSubtitle || "We're More Than Just A Gym"}</div>
            <h3 className="text-gray-900 text-xl font-black">{about.heading || "Your Fitness Journey Starts Here"}</h3>
            <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">{about.paragraph1 || ""}</p>
            <div className="flex gap-2 flex-wrap">
              {(about.features || []).slice(0, 2).map((f: any, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-white rounded-lg text-[9px] font-bold text-gray-700 shadow-sm flex items-center gap-1">
                  <span>{f.icon}</span> {f.text}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden h-40 bg-gray-200">
            {about.image && <img src={about.image} alt="" className="w-full h-full object-cover" />}
          </div>
        </div>
      </PreviewCard>

      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير قسم عن" : "About Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار القسم" : "Show Section"} checked={about.enabled !== false} onChange={v => set("about.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "عنوان القسم" : "Section Title"} value={about.sectionTitle} onChange={v => set("about.sectionTitle", v)} placeholder="About Us" />
            <FancyField label={isAr ? "النص الفرعي للقسم" : "Section Subtitle"} value={about.sectionSubtitle} onChange={v => set("about.sectionSubtitle", v)} placeholder="We're More Than Just A Gym" />
          </div>
          <FancyField label={isAr ? "العنوان الداخلي" : "Heading"} value={about.heading} onChange={v => set("about.heading", v)} placeholder="Your Fitness Journey Starts Here" />
          <FancyField label={isAr ? "الفقرة الأولى" : "Paragraph 1"} value={about.paragraph1} onChange={v => set("about.paragraph1", v)} multiline />
          <FancyField label={isAr ? "الفقرة الثانية" : "Paragraph 2"} value={about.paragraph2} onChange={v => set("about.paragraph2", v)} multiline />
          <FancyField label={isAr ? "الصورة" : "Image"} value={about.image} onChange={v => set("about.image", v)} type="image" slug={slug} />
          <ItemListSection
            items={about.features || []}
            title={isAr ? "المميزات" : "Features"}
            fields={[
              { key: "icon", label: isAr ? "الأيقونة" : "Icon" },
              { key: "text", label: isAr ? "النص" : "Text" },
            ]}
            defaultItem={{ icon: "🏋️", text: "" }}
            onAdd={() => addItemFn(about, "features", { icon: "🏋️", text: "" })}
            onRemove={(i) => removeItemFn(about, "features", i)}
            onMove={(i, d) => moveItemFn(about, "features", i, d)}
            onUpdate={(i, k, v) => updateItemFn(about, "features", i, k, v)}
            isAr={isAr}
          />
        </div>
      </EditPanel>
    </div>
  );

  function addItemFn(obj: any, key: string, item: any) { const arr = obj[key] || []; set(`about.${key}`, [...arr, item]); }
  function removeItemFn(obj: any, key: string, idx: number) { const arr = obj[key] || []; set(`about.${key}`, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItemFn(obj: any, key: string, idx: number, dir: number) {
    const arr = [...(obj[key] || [])]; const j = idx + dir;
    if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(`about.${key}`, arr);
  }
  function updateItemFn(obj: any, key: string, idx: number, field: string, value: any) {
    const arr = [...(obj[key] || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(`about.${key}`, arr);
  }
}

function ServicesEditor({ services, set, isAr, slug, viewMode }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="p-6 bg-white rounded-xl">
          <div className="text-center mb-4">
            <div className="text-[8px] font-bold text-orange-500 uppercase tracking-[0.3em]">{services.sectionTitle || "Our Services"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(services.items || []).slice(0, 6).map((s: any, i: number) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center shadow-sm border border-gray-200/50">
                <div className="text-2xl mb-1">{s.icon || "💪"}</div>
                <div className="text-[9px] font-bold text-gray-800 truncate">{s.title || "Service"}</div>
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>

      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير الخدمات" : "Services Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار القسم" : "Show Section"} checked={services.enabled !== false} onChange={v => set("services.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "عنوان القسم" : "Section Title"} value={services.sectionTitle} onChange={v => set("services.sectionTitle", v)} placeholder="Our Services" />
            <FancyField label={isAr ? "النص الفرعي" : "Subtitle"} value={services.sectionSubtitle} onChange={v => set("services.sectionSubtitle", v)} multiline />
          </div>
          <ItemListSection
            items={services.items || []}
            title={isAr ? "الخدمات" : "Service Items"}
            fields={[
              { key: "icon", label: isAr ? "الأيقونة" : "Icon" },
              { key: "title", label: isAr ? "العنوان" : "Title" },
              { key: "description", label: isAr ? "الوصف" : "Description" },
            ]}
            defaultItem={{ icon: "💪", title: "", description: "" }}
            onAdd={() => addItemFn("services.items", { icon: "💪", title: "", description: "" })}
            onRemove={(i) => removeItemFn("services.items", i)}
            onMove={(i, d) => moveItemFn("services.items", i, d)}
            onUpdate={(i, k, v) => updateItemFn("services.items", i, k, v)}
            textAreaFields={["description"]}
            isAr={isAr}
          />
        </div>
      </EditPanel>
    </div>
  );
  function addItemFn(path: string, item: any) { const arr = getPath(services, path) || []; set(path, [...arr, item]); }
  function removeItemFn(path: string, idx: number) { const arr = getPath(services, path) || []; set(path, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItemFn(path: string, idx: number, dir: number) { const arr = [...(getPath(services, path) || [])]; const j = idx + dir; if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(path, arr); }
  function updateItemFn(path: string, idx: number, field: string, value: any) { const arr = [...(getPath(services, path) || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(path, arr); }
  function getPath(obj: any, path: string) { return path.split(".").slice(1).reduce((o, p) => o?.[p], obj); }
}

// Similar implementations for each section...
// For brevity, using generic editors for remaining sections

function PricingEditor({ pricing, set, isAr, slug, viewMode }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl">
          <div className="text-center mb-4">
            <div className="text-lg font-black text-white">{pricing.sectionTitle || "Fitness Plans"}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(pricing.plans || []).slice(0, 3).map((p: any, i: number) => (
              <div key={i} className={`rounded-xl p-4 text-center ${p.popular ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 border border-white/10'}`}>
                {p.badge && <div className="text-[7px] font-bold text-white/80 uppercase mb-1">{p.badge}</div>}
                <div className="text-white text-xs font-black mb-1">{p.name}</div>
                <div className="text-white text-2xl font-black">{p.price}<span className="text-[8px] opacity-60">{p.period}</span></div>
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>

      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير الباقات" : "Pricing Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار القسم" : "Show Section"} checked={pricing.enabled !== false} onChange={v => set("pricing.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "عنوان القسم" : "Section Title"} value={pricing.sectionTitle} onChange={v => set("pricing.sectionTitle", v)} placeholder="Fitness Plans" />
            <FancyField label={isAr ? "النص الفرعي" : "Subtitle"} value={pricing.sectionSubtitle} onChange={v => set("pricing.sectionSubtitle", v)} multiline />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{isAr ? "الباقات" : "Plans"}</Label>
              <AddButton onClick={() => addItem("pricing.plans", { name: "", price: "$0", period: "/month", description: "", popular: false, badge: "", ctaText: "Get Started", ctaVariant: "secondary", features: [] })} label={isAr ? "إضافة" : "Add"} isAr={isAr} />
            </div>
            {(pricing.plans || []).map((plan: any, idx: number) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                    <span className="text-[9px] font-bold text-white/40 uppercase">{plan.name || (isAr ? "جديد" : "New Plan")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PopToggle checked={plan.popular} onChange={v => updateItemFn("pricing.plans", idx, "popular", v)} label={isAr ? "شائع" : "Popular"} />
                    <MoveBtns idx={idx} total={(pricing.plans || []).length} onMove={(d) => moveItemFn("pricing.plans", idx, d)} onRemove={() => removeItemFn("pricing.plans", idx)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <FancyField label={isAr ? "الاسم" : "Name"} value={plan.name} onChange={v => updateItemFn("pricing.plans", idx, "name", v)} placeholder="Pro" />
                  <FancyField label={isAr ? "السعر" : "Price"} value={plan.price} onChange={v => updateItemFn("pricing.plans", idx, "price", v)} placeholder="$59" />
                  <FancyField label={isAr ? "المدة" : "Period"} value={plan.period} onChange={v => updateItemFn("pricing.plans", idx, "period", v)} placeholder="/month" />
                  <FancyField label={isAr ? "الشارة" : "Badge"} value={plan.badge} onChange={v => updateItemFn("pricing.plans", idx, "badge", v)} placeholder="Most Popular" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="md:col-span-2">
                    <FancyField label={isAr ? "الوصف" : "Description"} value={plan.description} onChange={v => updateItemFn("pricing.plans", idx, "description", v)} placeholder="Best value for regulars" />
                  </div>
                  <FancyField label={isAr ? "نص الزر" : "CTA Text"} value={plan.ctaText} onChange={v => updateItemFn("pricing.plans", idx, "ctaText", v)} placeholder="Get Started" />
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">{isAr ? "المميزات" : "Features"}</span>
                    <button onClick={() => { const arr = [...(plan.features || []), { text: "", enabled: true }]; updateItemFn("pricing.plans", idx, "features", arr); }}
                      className="text-[8px] font-bold text-orange-400 uppercase tracking-widest hover:text-orange-300">+ {isAr ? "إضافة" : "Add"}</button>
                  </div>
                  <div className="space-y-1.5">
                    {(plan.features || []).map((f: any, fi: number) => (
                      <div key={fi} className="flex gap-2 items-center">
                        <input value={f.text || ""} onChange={e => { const arr = [...(plan.features || [])]; arr[fi] = { ...arr[fi], text: e.target.value }; updateItemFn("pricing.plans", idx, "features", arr); }}
                          className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-white text-[11px] focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                        <input type="checkbox" checked={f.enabled !== false} onChange={e => { const arr = [...(plan.features || [])]; arr[fi] = { ...arr[fi], enabled: e.target.checked }; updateItemFn("pricing.plans", idx, "features", arr); }}
                          className="accent-orange-500 w-3.5 h-3.5" />
                        <button onClick={() => { const arr = plan.features.filter((_: any, j: number) => j !== fi); updateItemFn("pricing.plans", idx, "features", arr); }}
                          className="p-1 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </EditPanel>
    </div>
  );
  function addItem(path: string, item: any) { const arr = get(path) || []; set(path, arr ? [...arr, item] : [item]); }
  function get(path: string) { return path.split(".").reduce((o, p) => o?.[p], pricing as any); }
  function removeItemFn(path: string, idx: number) { const arr = get(path) || []; set(path, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItemFn(path: string, idx: number, dir: number) { const arr = [...(get(path) || [])]; const j = idx + dir; if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(path, arr); }
  function updateItemFn(path: string, idx: number, field: string, value: any) { const arr = [...(get(path) || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(path, arr); }
}

// Remaining editors use the same pattern
function TrainersEditor({ trainers, set, isAr, slug }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="text-center mb-4">
            <div className="text-sm font-black text-gray-900">{trainers.sectionTitle || "Meet Our Trainers"}</div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(trainers.items || []).slice(0, 4).map((t: any, i: number) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-24 bg-gray-200">{t.image && <img src={t.image} alt="" className="w-full h-full object-cover" />}</div>
                <div className="p-2 text-center">
                  <div className="text-[9px] font-black text-gray-800 truncate">{t.name}</div>
                  <div className="text-[7px] text-orange-500 font-bold truncate">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>
      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير المدربين" : "Trainers Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار القسم" : "Show Section"} checked={trainers.enabled !== false} onChange={v => set("trainers.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "عنوان القسم" : "Section Title"} value={trainers.sectionTitle} onChange={v => set("trainers.sectionTitle", v)} placeholder="Meet Our Trainers" />
            <FancyField label={isAr ? "النص الفرعي" : "Subtitle"} value={trainers.sectionSubtitle} onChange={v => set("trainers.sectionSubtitle", v)} multiline />
          </div>
          <ItemListSection items={trainers.items || []} title={isAr ? "المدربون" : "Trainers"} fields={[{ key: "name", label: isAr ? "الاسم" : "Name" }, { key: "role", label: isAr ? "الدور" : "Role" }, { key: "bio", label: isAr ? "السيرة" : "Bio" }, { key: "image", label: isAr ? "الصورة" : "Image" }]} defaultItem={{ name: "", role: "", bio: "", image: "" }} onAdd={() => addItem("trainers.items", { name: "", role: "", bio: "", image: "" })} onRemove={(i) => removeItem("trainers.items", i)} onMove={(i, d) => moveItem("trainers.items", i, d)} onUpdate={(i, k, v) => updateItem("trainers.items", i, k, v)} textAreaFields={["bio"]} isAr={isAr} renderExtra={(item) => item.image ? <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-white/5"><img src={item.image} alt="" className="w-full h-full object-cover" /></div> : null} slug={slug} />
        </div>
      </EditPanel>
    </div>
  );
  function addItem(path: string, item: any) { const arr = get(path) || []; set(path, [...arr, item]); }
  function get(path: string) { return path.split(".").reduce((o, p) => o?.[p], trainers as any); }
  function removeItem(path: string, idx: number) { const arr = get(path) || []; set(path, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItem(path: string, idx: number, dir: number) { const arr = [...(get(path) || [])]; const j = idx + dir; if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(path, arr); }
  function updateItem(path: string, idx: number, field: string, value: any) { const arr = [...(get(path) || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(path, arr); }
}

function TestimonialsEditor({ testimonials, set, isAr, slug }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="p-6 bg-white rounded-xl">
          <div className="text-center mb-3">
            <div className="text-sm font-black text-gray-900">{testimonials.sectionTitle || "What Our Members Say"}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(testimonials.items || []).slice(0, 3).map((t: any, i: number) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                <div className="text-2xl text-orange-200 font-serif leading-none mb-2">"</div>
                <p className="text-[9px] text-gray-600 leading-relaxed line-clamp-3 mb-3 italic">{t.quote}</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-[8px] font-bold">{t.initials}</div>
                  <div><div className="text-[8px] font-bold text-gray-800">{t.author}</div><div className="text-[6px] text-gray-400">{t.meta}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>
      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير الآراء" : "Testimonials Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار القسم" : "Show Section"} checked={testimonials.enabled !== false} onChange={v => set("testimonials.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "عنوان القسم" : "Section Title"} value={testimonials.sectionTitle} onChange={v => set("testimonials.sectionTitle", v)} placeholder="What Our Members Say" />
            <FancyField label={isAr ? "النص الفرعي" : "Subtitle"} value={testimonials.sectionSubtitle} onChange={v => set("testimonials.sectionSubtitle", v)} multiline />
          </div>
          <ItemListSection items={testimonials.items || []} title={isAr ? "المراجعات" : "Reviews"} fields={[{ key: "author", label: isAr ? "الاسم" : "Author" }, { key: "meta", label: isAr ? "الوصف" : "Meta" }, { key: "initials", label: isAr ? "الأحرف الأولى" : "Initials" }, { key: "quote", label: isAr ? "المحتوى" : "Quote" }]} defaultItem={{ author: "", meta: "", initials: "", quote: "" }} onAdd={() => addItem("testimonials.items", { author: "", meta: "", initials: "", quote: "" })} onRemove={(i) => removeItem("testimonials.items", i)} onMove={(i, d) => moveItem("testimonials.items", i, d)} onUpdate={(i, k, v) => updateItem("testimonials.items", i, k, v)} textAreaFields={["quote"]} isAr={isAr} slug={slug} />
        </div>
      </EditPanel>
    </div>
  );
  function addItem(path: string, item: any) { const arr = get(path) || []; set(path, [...arr, item]); }
  function get(path: string) { return path.split(".").reduce((o, p) => o?.[p], testimonials as any); }
  function removeItem(path: string, idx: number) { const arr = get(path) || []; set(path, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItem(path: string, idx: number, dir: number) { const arr = [...(get(path) || [])]; const j = idx + dir; if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(path, arr); }
  function updateItem(path: string, idx: number, field: string, value: any) { const arr = [...(get(path) || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(path, arr); }
}

function BlogEditor({ blog, set, isAr, slug }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="text-center mb-3">
            <div className="text-sm font-black text-gray-900">{blog.sectionTitle || "Latest From Our Blog"}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(blog.items || []).slice(0, 3).map((b: any, i: number) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-20 bg-gray-200">{b.image && <img src={b.image} alt="" className="w-full h-full object-cover" />}</div>
                <div className="p-3">
                  <div className="flex gap-1.5 mb-1.5">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-[6px] font-bold">{b.date}</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[6px] font-bold">{b.category}</span>
                  </div>
                  <div className="text-[9px] font-black text-gray-800 line-clamp-2">{b.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>
      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير المدونة" : "Blog Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار القسم" : "Show Section"} checked={blog.enabled !== false} onChange={v => set("blog.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "عنوان القسم" : "Section Title"} value={blog.sectionTitle} onChange={v => set("blog.sectionTitle", v)} placeholder="Latest From Our Blog" />
            <FancyField label={isAr ? "النص الفرعي" : "Subtitle"} value={blog.sectionSubtitle} onChange={v => set("blog.sectionSubtitle", v)} multiline />
          </div>
          <ItemListSection items={blog.items || []} title={isAr ? "المقالات" : "Blog Posts"} fields={[{ key: "title", label: isAr ? "العنوان" : "Title" }, { key: "date", label: isAr ? "التاريخ" : "Date" }, { key: "category", label: isAr ? "التصنيف" : "Category" }, { key: "description", label: isAr ? "الوصف" : "Description" }, { key: "image", label: isAr ? "الصورة" : "Image" }]} defaultItem={{ title: "", date: "", category: "", description: "", image: "" }} onAdd={() => addItem("blog.items", { title: "", date: "", category: "", description: "", image: "" })} onRemove={(i) => removeItem("blog.items", i)} onMove={(i, d) => moveItem("blog.items", i, d)} onUpdate={(i, k, v) => updateItem("blog.items", i, k, v)} textAreaFields={["description"]} isAr={isAr} slug={slug} renderExtra={(item) => item.image ? <div className="mt-2 w-20 h-12 rounded-lg overflow-hidden border border-white/5"><img src={item.image} alt="" className="w-full h-full object-cover" /></div> : null} />
        </div>
      </EditPanel>
    </div>
  );
  function addItem(path: string, item: any) { const arr = get(path) || []; set(path, [...arr, item]); }
  function get(path: string) { return path.split(".").reduce((o, p) => o?.[p], blog as any); }
  function removeItem(path: string, idx: number) { const arr = get(path) || []; set(path, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItem(path: string, idx: number, dir: number) { const arr = [...(get(path) || [])]; const j = idx + dir; if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(path, arr); }
  function updateItem(path: string, idx: number, field: string, value: any) { const arr = [...(get(path) || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(path, arr); }
}

function ContactEditor({ contact, set, isAr, slug }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-white text-[9px] font-bold uppercase tracking-wider mb-3">{contact.form?.buttonText || "Send Message"}</div>
            <div className="space-y-2">
              <div className="h-6 bg-white/10 rounded-md" />
              <div className="h-6 bg-white/10 rounded-md" />
              <div className="h-6 bg-white/10 rounded-md" />
              <div className="h-12 bg-white/10 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            {(contact.items || []).slice(0, 4).map((item: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="text-white text-[9px] font-bold">{item.title}</div>
                  <div className="text-white/50 text-[8px]" dangerouslySetInnerHTML={{ __html: item.text || "" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>
      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير التواصل" : "Contact Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار القسم" : "Show Section"} checked={contact.enabled !== false} onChange={v => set("contact.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "عنوان القسم" : "Section Title"} value={contact.sectionTitle} onChange={v => set("contact.sectionTitle", v)} placeholder="Get In Touch" />
            <div className="md:col-span-2"><FancyField label={isAr ? "النص الفرعي" : "Subtitle"} value={contact.sectionSubtitle} onChange={v => set("contact.sectionSubtitle", v)} multiline /></div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <Label>{isAr ? "إعدادات الفورم" : "Form Settings"}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <FancyField label={isAr ? "نص الاسم" : "Name Placeholder"} value={contact.form?.namePlaceholder} onChange={v => set("contact.form.namePlaceholder", v)} placeholder="John Doe" />
              <FancyField label={isAr ? "نص البريد" : "Email Placeholder"} value={contact.form?.emailPlaceholder} onChange={v => set("contact.form.emailPlaceholder", v)} placeholder="john@example.com" />
              <FancyField label={isAr ? "نص الهاتف" : "Phone Placeholder"} value={contact.form?.phonePlaceholder} onChange={v => set("contact.form.phonePlaceholder", v)} placeholder="(555) 123-4567" />
              <FancyField label={isAr ? "نص الرسالة" : "Message Placeholder"} value={contact.form?.messagePlaceholder} onChange={v => set("contact.form.messagePlaceholder", v)} placeholder="Tell us about your fitness goals..." />
              <FancyField label={isAr ? "نص الزر" : "Button Text"} value={contact.form?.buttonText} onChange={v => set("contact.form.buttonText", v)} placeholder="Send Message" />
              <FancyField label={isAr ? "رسالة النجاح" : "Success Message"} value={contact.form?.successMessage} onChange={v => set("contact.form.successMessage", v)} placeholder="Thank you!" />
            </div>
          </div>
          <ItemListSection items={contact.items || []} title={isAr ? "معلومات التواصل" : "Contact Items"} fields={[{ key: "icon", label: isAr ? "الأيقونة" : "Icon" }, { key: "title", label: isAr ? "العنوان" : "Title" }, { key: "text", label: isAr ? "النص" : "Text" }]} defaultItem={{ icon: "📍", title: "", text: "" }} onAdd={() => addItem("contact.items", { icon: "📍", title: "", text: "" })} onRemove={(i) => removeItem("contact.items", i)} onMove={(i, d) => moveItem("contact.items", i, d)} onUpdate={(i, k, v) => updateItem("contact.items", i, k, v)} textAreaFields={["text"]} isAr={isAr} slug={slug} />
        </div>
      </EditPanel>
    </div>
  );
  function addItem(path: string, item: any) { const arr = get(path) || []; set(path, [...arr, item]); }
  function get(path: string) { return path.split(".").reduce((o, p) => o?.[p], contact as any); }
  function removeItem(path: string, idx: number) { const arr = get(path) || []; set(path, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItem(path: string, idx: number, dir: number) { const arr = [...(get(path) || [])]; const j = idx + dir; if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(path, arr); }
  function updateItem(path: string, idx: number, field: string, value: any) { const arr = [...(get(path) || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(path, arr); }
}

function FooterEditor({ footer, set, isAr, slug }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="p-6 bg-gradient-to-br from-gray-950 to-black rounded-xl">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-white text-sm font-black mb-2">{footer.logo || "IRON"}<span className="text-orange-500">{footer.logoSuffix || "PEAK"}</span></div>
              <p className="text-white/40 text-[8px] leading-relaxed line-clamp-3">{footer.description}</p>
            </div>
            {["Quick Links", "Programs", "Contact"].map((col, i) => (
              <div key={i}>
                <div className="text-white text-[9px] font-bold mb-2">{col}</div>
                <div className="space-y-1">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-2 bg-white/5 rounded w-3/4" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>
      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير التذييل" : "Footer Content"}>
        <div className="space-y-5">
          <ToggleRow label={isAr ? "إظهار التذييل" : "Show Footer"} checked={footer.enabled !== false} onChange={v => set("footer.enabled", v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label="Logo" value={footer.logo} onChange={v => set("footer.logo", v)} placeholder="IRON" />
            <FancyField label="Logo Suffix" value={footer.logoSuffix} onChange={v => set("footer.logoSuffix", v)} placeholder="PEAK" />
            <div className="md:col-span-2"><FancyField label={isAr ? "الوصف" : "Description"} value={footer.description} onChange={v => set("footer.description", v)} multiline /></div>
            <div className="md:col-span-2"><FancyField label={isAr ? "حقوق النشر" : "Copyright"} value={footer.copyright} onChange={v => set("footer.copyright", v)} placeholder="© 2025 Iron Peak Fitness. All rights reserved." /></div>
          </div>
          <ItemListSection items={footer.socialLinks || []} title={isAr ? "روابط التواصل" : "Social Links"} fields={[{ key: "icon", label: isAr ? "الأيقونة" : "Icon" }, { key: "url", label: "URL" }]} defaultItem={{ icon: "bi bi-facebook", url: "#" }} onAdd={() => addItem("footer.socialLinks", { icon: "bi bi-facebook", url: "#" })} onRemove={(i) => removeItem("footer.socialLinks", i)} onMove={(i, d) => moveItem("footer.socialLinks", i, d)} onUpdate={(i, k, v) => updateItem("footer.socialLinks", i, k, v)} isAr={isAr} slug={slug} />
          <ItemListSection items={footer.quickLinks || []} title={isAr ? "الروابط السريعة" : "Quick Links"} fields={[{ key: "label", label: isAr ? "النص" : "Label" }, { key: "href", label: "href" }]} defaultItem={{ label: "", href: "#" }} onAdd={() => addItem("footer.quickLinks", { label: "", href: "#" })} onRemove={(i) => removeItem("footer.quickLinks", i)} onMove={(i, d) => moveItem("footer.quickLinks", i, d)} onUpdate={(i, k, v) => updateItem("footer.quickLinks", i, k, v)} isAr={isAr} slug={slug} />
          <ItemListSection items={footer.programs || []} title={isAr ? "البرامج" : "Programs"} fields={[{ key: "label", label: isAr ? "النص" : "Label" }, { key: "href", label: "href" }]} defaultItem={{ label: "", href: "#" }} onAdd={() => addItem("footer.programs", { label: "", href: "#" })} onRemove={(i) => removeItem("footer.programs", i)} onMove={(i, d) => moveItem("footer.programs", i, d)} onUpdate={(i, k, v) => updateItem("footer.programs", i, k, v)} isAr={isAr} slug={slug} />
          <ItemListSection items={footer.contactInfo || []} title={isAr ? "معلومات التواصل" : "Contact Info"} fields={[{ key: "icon", label: isAr ? "الأيقونة" : "Icon" }, { key: "text", label: isAr ? "النص" : "Text" }]} defaultItem={{ icon: "bi bi-geo-alt", text: "" }} onAdd={() => addItem("footer.contactInfo", { icon: "bi bi-geo-alt", text: "" })} onRemove={(i) => removeItem("footer.contactInfo", i)} onMove={(i, d) => moveItem("footer.contactInfo", i, d)} onUpdate={(i, k, v) => updateItem("footer.contactInfo", i, k, v)} isAr={isAr} slug={slug} />
        </div>
      </EditPanel>
    </div>
  );
  function addItem(path: string, item: any) { const arr = get(path) || []; set(path, [...arr, item]); }
  function get(path: string) { return path.split(".").reduce((o, p) => o?.[p], footer as any); }
  function removeItem(path: string, idx: number) { const arr = get(path) || []; set(path, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItem(path: string, idx: number, dir: number) { const arr = [...(get(path) || [])]; const j = idx + dir; if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(path, arr); }
  function updateItem(path: string, idx: number, field: string, value: any) { const arr = [...(get(path) || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(path, arr); }
}

function NavEditor({ nav, set, isAr, slug }: EditorProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="animate-fadeIn">
      <PreviewCard>
        <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm font-black">{nav.logo || "IRON"}<span className="text-orange-500">{nav.logoSuffix || "PEAK"}</span></div>
            <div className="flex gap-4">
              {(nav.links || []).slice(0, 5).map((l: any, i: number) => (
                <span key={i} className="text-white/60 text-[8px] font-bold uppercase tracking-wider">{l.label}</span>
              ))}
            </div>
          </div>
        </div>
      </PreviewCard>
      <EditPanel expanded={expanded} onToggle={() => setExpanded(!expanded)} title={isAr ? "تحرير القائمة" : "Navigation Content"}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyField label={isAr ? "نص اللوجو" : "Logo Text"} value={nav.logo} onChange={v => set("nav.logo", v)} placeholder="IRON" />
            <FancyField label={isAr ? "لاحقة اللوجو" : "Logo Suffix"} value={nav.logoSuffix} onChange={v => set("nav.logoSuffix", v)} placeholder="PEAK" />
          </div>
          <ItemListSection items={nav.links || []} title={isAr ? "روابط القائمة" : "Nav Links"} fields={[{ key: "label", label: isAr ? "النص" : "Label" }, { key: "href", label: "href" }]} defaultItem={{ label: "", href: "#" }} onAdd={() => addItem("nav.links", { label: "", href: "#" })} onRemove={(i) => removeItem("nav.links", i)} onMove={(i, d) => moveItem("nav.links", i, d)} onUpdate={(i, k, v) => updateItem("nav.links", i, k, v)} isAr={isAr} slug={slug} />
        </div>
      </EditPanel>
    </div>
  );
  function addItem(path: string, item: any) { const arr = get(path) || []; set(path, [...arr, item]); }
  function get(path: string) { return path.split(".").reduce((o, p) => o?.[p], nav as any); }
  function removeItem(path: string, idx: number) { const arr = get(path) || []; set(path, arr.filter((_: any, i: number) => i !== idx)); }
  function moveItem(path: string, idx: number, dir: number) { const arr = [...(get(path) || [])]; const j = idx + dir; if (j < 0 || j >= arr.length) return; [arr[idx], arr[j]] = [arr[j], arr[idx]]; set(path, arr); }
  function updateItem(path: string, idx: number, field: string, value: any) { const arr = [...(get(path) || [])]; if (!arr[idx]) return; arr[idx] = { ...arr[idx], [field]: value }; set(path, arr); }
}

/* ===== Shared Types ===== */

interface EditorProps {
  [key: string]: any;
  isAr: boolean;
  slug: string;
  viewMode?: string;
}

/* ===== UI Components ===== */

function PreviewCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden mb-5">
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/[0.03] to-transparent flex items-center px-4 gap-2 border-b border-white/5">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
        <span className="text-[7px] font-mono text-white/10 tracking-wider ml-2 uppercase">Preview</span>
      </div>
      <div className="pt-10 pb-4 px-4">
        {children}
      </div>
    </div>
  );
}

function EditPanel({ expanded, onToggle, title, children }: { expanded: boolean; onToggle: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,107,53,0.5)]" />
          <span className="text-sm font-black text-white uppercase tracking-tight">{title}</span>
        </div>
        {expanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
      </button>
      {expanded && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function FancyField({ label, value, onChange, placeholder, multiline, type, slug }: {
  label: string; value?: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; type?: string; slug?: string;
}) {
  const cls = "w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all font-medium placeholder:text-white/10";
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] font-bold text-white/30 uppercase tracking-wider">{label}</label>
      {type === "image" && value ? (
        <div className="space-y-2">
          <div className="relative w-full h-28 rounded-xl overflow-hidden border border-white/5 bg-black/60">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
          <input value={value || ""} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} />
        </div>
      ) : multiline ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} placeholder={placeholder} />
      ) : (
        <input value={value || ""} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer group">
      <span className="text-[11px] font-bold text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
      <div className={`relative w-10 h-5 rounded-full transition-all ${checked ? 'bg-orange-500' : 'bg-white/10'}`}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all ${checked ? 'translate-x-5' : ''}`} />
      </div>
    </label>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{children}</span>;
}

function AddButton({ onClick, label, isAr }: { onClick: () => void; label: string; isAr: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/20 border border-orange-500/20 rounded-lg text-orange-400 text-[8px] font-bold uppercase tracking-widest hover:bg-orange-600/30 transition-all">
      <Plus size={10} /> {label}
    </button>
  );
}

function PopToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-1 text-[7px] text-white/30 font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap px-2 py-1 rounded-lg hover:bg-white/5">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="accent-orange-500 w-3 h-3" />
      {label}
    </label>
  );
}

function MoveBtns({ idx, total, onMove, onRemove }: { idx: number; total: number; onMove: (dir: number) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-0.5">
      <button onClick={() => onMove(-1)} disabled={idx === 0} className="p-1 rounded-md bg-white/5 text-white/30 hover:text-white disabled:opacity-20"><ArrowUp size={10} /></button>
      <button onClick={() => onMove(1)} disabled={idx === total - 1} className="p-1 rounded-md bg-white/5 text-white/30 hover:text-white disabled:opacity-20"><ArrowDown size={10} /></button>
      <button onClick={onRemove} className="p-1 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><X size={10} /></button>
    </div>
  );
}

function ItemListSection({ items, title, fields, defaultItem, onAdd, onRemove, onMove, onUpdate, textAreaFields, renderExtra, isAr }: {
  items: any[]; title: string; fields: { key: string; label: string }[]; defaultItem?: any; onAdd: () => void; onRemove: (idx: number) => void; onMove: (idx: number, dir: number) => void; onUpdate: (idx: number, key: string, value: any) => void; textAreaFields?: string[]; renderExtra?: (item: any, idx: number) => React.ReactNode; isAr: boolean; slug?: string;
}) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <Label>{title}</Label>
        <AddButton onClick={onAdd} label={title} isAr={isAr} />
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
              <MoveBtns idx={idx} total={items.length} onMove={(d) => onMove(idx, d)} onRemove={() => onRemove(idx)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f.key} className={f.key === "description" || f.key === "bio" || f.key === "quote" ? "md:col-span-2" : f.key === "image" ? "md:col-span-2" : ""}>
                  {f.key === "image" ? (
                    <FancyField label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} type="image" />
                  ) : textAreaFields?.includes(f.key) ? (
                    <FancyField label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} multiline />
                  ) : (
                    <FancyField label={f.label} value={item[f.key]} onChange={v => onUpdate(idx, f.key, v)} />
                  )}
                </div>
              ))}
            </div>
            {renderExtra && renderExtra(item, idx)}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-white/10 text-[9px] font-bold uppercase tracking-wider">{isAr ? "فارغ" : "Empty"}</div>
        )}
      </div>
    </div>
  );
}
