"use client";

import React from "react";
import { Plus, X, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface Props {
  settings: any;
  updateSettings: (settings: any) => void;
  language?: string;
}

function ArrayInput({ label, items, onChange, placeholder = "Item" }: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[8px] font-black text-slate-500 tracking-[0.08em]">{label}</label>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
              placeholder={placeholder}
              className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50" />
            <button type="button" onClick={() => { const n = items.filter((_, j) => j !== i); onChange(n); }}
              className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><X size={14} /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ""])}
        className="text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors">+ Add {label}</button>
    </div>
  );
}

function EditableList({ items, fields, onUpdate, title, onAdd, fieldLabels }: {
  items: any[];
  fields: string[];
  onUpdate: (items: any[]) => void;
  title: string;
  onAdd: () => void;
  fieldLabels: Record<string, string>;
}) {
  const setField = (idx: number, field: string, value: any) => {
    const n = [...items];
    n[idx] = { ...n[idx], [field]: value };
    onUpdate(n);
  };
  const remove = (idx: number) => onUpdate(items.filter((_, i) => i !== idx));
  const move = (idx: number, dir: number) => {
    const n = [...items];
    const j = idx + dir;
    if (j < 0 || j >= n.length) return;
    [n[idx], n[j]] = [n[j], n[idx]];
    onUpdate(n);
  };
  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase italic tracking-tight">{title}</h3>
        <button type="button" onClick={onAdd}
          className="px-4 py-2 bg-cyan-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-1.5">
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/[0.03] rounded-xl border border-white/[0.05] p-4 group hover:bg-white/[0.05] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">#{idx + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}
                  className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"><ArrowUp size={12} /></button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === items.length - 1}
                  className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"><ArrowDown size={12} /></button>
                <button type="button" onClick={() => remove(idx)}
                  className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><X size={12} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f} className="space-y-1">
                  <label className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{fieldLabels[f] || f}</label>
                  <input value={item[f] || ""} onChange={e => setField(idx, f, e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50" />
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{title} list is empty</div>
        )}
      </div>
    </div>
  );
}

export default function FitnessSettings({ settings, updateSettings, language = "en" }: Props) {
  const isAr = language === "ar";
  const fs = settings.fitnessSettings || {};

  const set = (path: string, value: any) => {
    const parts = path.split(".");
    const newFs = JSON.parse(JSON.stringify(fs));
    let obj = newFs;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    updateSettings({ ...settings, fitnessSettings: newFs });
  };

  const L = (en: string, ar: string) => isAr ? ar : en;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* ===== HERO ===== */}
      <SectionCard title={L("Hero Section", "قسم الهيرو")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label={L("Badge", "الشارة")} value={fs.hero?.badge} onChange={v => set("hero.badge", v)}
            placeholder={L("ELITE ONLINE COACHING", "تدريب نخبوي عبر الإنترنت")} />
          <TextField label={L("Title", "العنوان الرئيسي")} value={fs.hero?.title} onChange={v => set("hero.title", v)}
            placeholder={L("Advance Like Lightning", "تقدم كالبرق")} />
          <div className="md:col-span-2">
            <TextField label={L("Subtitle", "النص الفرعي")} value={fs.hero?.subtitle} onChange={v => set("hero.subtitle", v)} multiline
              placeholder={L("Training and nutrition plans scientifically designed...", "خطط تدريب وتغذية مصممة علمياً...")} />
          </div>
          <TextField label={L("Background Image URL", "رابط صورة الخلفية")} value={fs.hero?.backgroundImage} onChange={v => set("hero.backgroundImage", v)}
            placeholder="https://..." />
          <TextField label={L("Runner Image URL", "رابط صورة العداء")} value={fs.hero?.runnerImage} onChange={v => set("hero.runnerImage", v)}
            placeholder="https://..." />
          <TextField label={L("Lightning Image URL", "رابط صورة البرق")} value={fs.hero?.lightningImage} onChange={v => set("hero.lightningImage", v)}
            placeholder="https://..." />
          <TextField label={L("Primary CTA Text", "نص الزر الرئيسي")} value={fs.hero?.primaryCta?.text} onChange={v => set("hero.primaryCta.text", v)}
            placeholder={L("About Us", "عن ساما فيت")} />
          <TextField label={L("Primary CTA Link", "رابط الزر الرئيسي")} value={fs.hero?.primaryCta?.link} onChange={v => set("hero.primaryCta.link", v)}
            placeholder={"/store/slug#about"} />
          <TextField label={L("Secondary CTA Text", "نص الزر الثانوي")} value={fs.hero?.secondaryCta?.text} onChange={v => set("hero.secondaryCta.text", v)}
            placeholder={L("Subscribe Now", "اشترك الآن")} />
          <TextField label={L("Secondary CTA Link", "رابط الزر الثانوي")} value={fs.hero?.secondaryCta?.link} onChange={v => set("hero.secondaryCta.link", v)}
            placeholder={"/store/slug#pricing"} />
        </div>

        <div className="mt-6 space-y-4">
          {/* Avatar URLs */}
          <ArrayInput label={L("Avatar Image URLs", "روابط صور الأفاتار")}
            items={fs.hero?.avatars || []}
            onChange={v => set("hero.avatars", v)}
            placeholder="https://..." />

          {/* Stats */}
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.05] p-4">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-3">{L("Stats Bar", "شريط الإحصائيات")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TextField label={L("Value", "القيمة")} value={fs.hero?.statValue} onChange={v => set("hero.statValue", v)} placeholder="20" />
              <TextField label={L("Suffix", "اللاحقة")} value={fs.hero?.statSuffix} onChange={v => set("hero.statSuffix", v)} placeholder="k+" />
              <div className="md:col-span-3">
                <TextField label={L("Label", "النص")} value={fs.hero?.statLabel} onChange={v => set("hero.statLabel", v)}
                  placeholder={L("Over 20,000 people transformed", "أكثر من 20 ألف شخص غيروا حياتهم")} />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ===== MARQUEE ===== */}
      <SectionCard title={L("Marquee", "الشريط المتحرك")}>
        <label className="flex items-center gap-3 mb-4">
          <input type="checkbox" checked={fs.marquee?.enabled !== false} onChange={e => set("marquee.enabled", e.target.checked)}
            className="w-4 h-4 rounded border-white/10 bg-white/5 accent-emerald-500" />
          <span className="text-xs font-bold text-slate-300">{L("Enable Marquee", "تفعيل الشريط المتحرك")}</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TextField label={L("Separator", "الفاصل")} value={fs.marquee?.separator} onChange={v => set("marquee.separator", v)} placeholder="✦" />
        </div>
        <ArrayInput label={L("Marquee Items", "عناصر الشريط")}
          items={fs.marquee?.items || []}
          onChange={v => set("marquee.items", v)}
          placeholder={L("FITNESS", "اللياقة")} />
      </SectionCard>

      {/* ===== SERVICES ===== */}
      <SectionCard title={L("Services", "الخدمات")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField label={L("Section Title", "عنوان القسم")} value={fs.services?.title} onChange={v => set("services.title", v)}
            placeholder={L("Explore Our Services", "خدماتنا")} />
          <TextField label={L("Badge", "الشارة")} value={fs.services?.badge} onChange={v => set("services.badge", v)}
            placeholder={L("Our Services", "خدماتنا")} />
          <div className="md:col-span-2">
            <TextField label={L("Subtitle", "النص الفرعي")} value={fs.services?.subtitle} onChange={v => set("services.subtitle", v)} multiline />
          </div>
        </div>

        <EditableList
          title={L("Service Items", "عناصر الخدمات")}
          items={fs.services?.items || []}
          fields={["icon", "title", "description"]}
          fieldLabels={{ icon: L("Icon Emoji", "أيقونة"), title: L("Title", "العنوان"), description: L("Description", "الوصف") } as Record<string, string>}
          onUpdate={v => set("services.items", v)}
          onAdd={() => set("services.items", [...(fs.services?.items || []), { icon: "💪", title: "", description: "" }])}
        />
      </SectionCard>

      {/* ===== TRANSFORMATIONS ===== */}
      <SectionCard title={L("Transformations", "التحولات")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField label={L("Section Title", "عنوان القسم")} value={fs.transformations?.title} onChange={v => set("transformations.title", v)}
            placeholder={L("Wall of Greatness", "جدار العظمة")} />
          <TextField label={L("Badge", "الشارة")} value={fs.transformations?.badge} onChange={v => set("transformations.badge", v)}
            placeholder={L("Real Transformations", "تحولات حقيقية")} />
          <div className="md:col-span-2">
            <TextField label={L("Subtitle", "النص الفرعي")} value={fs.transformations?.subtitle} onChange={v => set("transformations.subtitle", v)} multiline
              placeholder={L("Your life doesn't improve by chance...", "حياتك لا تتحسن بالصدفة...")} />
          </div>
        </div>

        <EditableList
          title={L("Transformation Items", "عناصر التحول")}
          items={fs.transformations?.items || []}
          fields={["name", "before", "after"]}
          fieldLabels={{ name: L("Name", "الاسم"), before: L("Before Image URL", "رابط صورة قبل"), after: L("After Image URL", "رابط صورة بعد") } as Record<string, string>}
          onUpdate={v => set("transformations.items", v)}
          onAdd={() => set("transformations.items", [...(fs.transformations?.items || []), { name: "", before: "", after: "" }])}
        />
      </SectionCard>

      {/* ===== PRICING ===== */}
      <SectionCard title={L("Pricing Plans", "خطط الأسعار")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField label={L("Section Title", "عنوان القسم")} value={fs.pricing?.title} onChange={v => set("pricing.title", v)}
            placeholder={L("Choose Your Plan", "اختر باقتك")} />
          <TextField label={L("Badge", "الشارة")} value={fs.pricing?.badge} onChange={v => set("pricing.badge", v)}
            placeholder={L("Plans & Pricing", "خطط الأسعار")} />
          <div className="md:col-span-2">
            <TextField label={L("Subtitle", "النص الفرعي")} value={fs.pricing?.subtitle} onChange={v => set("pricing.subtitle", v)} multiline />
          </div>
        </div>

        {/* Plans with features */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white uppercase italic tracking-tight">{L("Plans", "الباقات")}</h3>
            <button type="button" onClick={() => set("pricing.plans", [...(fs.pricing?.plans || []), { id: `plan-${Date.now()}`, name: "", subtitle: "", price: "", currency: "£", duration: "", popular: false, badge: "", features: [], ctaText: "" }])}
              className="px-4 py-2 bg-cyan-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-1.5">
              <Plus size={12} /> {L("Add Plan", "إضافة باقة")}
            </button>
          </div>
          <div className="space-y-4">
            {(fs.pricing?.plans || []).map((plan: any, idx: number) => (
              <div key={plan.id || idx} className="bg-white/[0.03] rounded-xl border border-white/[0.05] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">#{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-[8px] text-slate-400 font-bold uppercase tracking-wider cursor-pointer">
                      <input type="checkbox" checked={plan.popular} onChange={e => {
                        const n = [...(fs.pricing?.plans || [])];
                        n[idx].popular = e.target.checked;
                        set("pricing.plans", n);
                      }} className="accent-cyan-500" />
                      {L("Popular", "شائع")}
                    </label>
                    <button type="button" onClick={() => {
                      const n = fs.pricing?.plans?.filter((_: any, i: number) => i !== idx) || [];
                      set("pricing.plans", n);
                    }}
                      className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white"><X size={12} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <TextField label={L("Name", "الاسم")} value={plan.name} onChange={v => {
                    const n = [...(fs.pricing?.plans || [])]; n[idx].name = v; set("pricing.plans", n);
                  }} placeholder="Pro Package" />
                  <TextField label={L("Price", "السعر")} value={plan.price} onChange={v => {
                    const n = [...(fs.pricing?.plans || [])]; n[idx].price = v; set("pricing.plans", n);
                  }} placeholder="2500" />
                  <TextField label={L("Currency", "العملة")} value={plan.currency} onChange={v => {
                    const n = [...(fs.pricing?.plans || [])]; n[idx].currency = v; set("pricing.plans", n);
                  }} placeholder="£" />
                  <TextField label={L("Duration Label", "نص المدة")} value={plan.duration} onChange={v => {
                    const n = [...(fs.pricing?.plans || [])]; n[idx].duration = v; set("pricing.plans", n);
                  }} placeholder="+ 3 months free" />
                  <TextField label={L("Badge", "الشارة")} value={plan.badge} onChange={v => {
                    const n = [...(fs.pricing?.plans || [])]; n[idx].badge = v; set("pricing.plans", n);
                  }} placeholder="Most Popular" />
                  <TextField label={L("CTA Text", "نص الزر")} value={plan.ctaText} onChange={v => {
                    const n = [...(fs.pricing?.plans || [])]; n[idx].ctaText = v; set("pricing.plans", n);
                  }} placeholder="Start Pro Now" />
                </div>
                <TextField label={L("Subtitle", "النص الفرعي")} value={plan.subtitle} onChange={v => {
                  const n = [...(fs.pricing?.plans || [])]; n[idx].subtitle = v; set("pricing.plans", n);
                }} placeholder="Follow-up with Sama Fit Team" />
                {/* Features */}
                <div className="mt-4">
                  <ArrayInput label={L("Features", "المميزات")}
                    items={plan.features || []}
                    onChange={v => {
                      const n = [...(fs.pricing?.plans || [])]; n[idx].features = v; set("pricing.plans", n);
                    }}
                    placeholder={L("Enter feature...", "أدخل ميزة...")} />
                </div>
              </div>
            ))}
            {(!fs.pricing?.plans || fs.pricing.plans.length === 0) && (
              <div className="text-center py-6 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{L("No plans yet", "لا توجد باقات بعد")}</div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ===== TESTIMONIALS ===== */}
      <SectionCard title={L("Testimonials", "آراء العملاء")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField label={L("Section Title", "عنوان القسم")} value={fs.testimonials?.title} onChange={v => set("testimonials.title", v)}
            placeholder={L("What Our Clients Say", "ماذا يقول عملاؤنا")} />
          <TextField label={L("Badge", "الشارة")} value={fs.testimonials?.badge} onChange={v => set("testimonials.badge", v)}
            placeholder={L("Testimonials", "الشهادات")} />
        </div>

        <EditableList
          title={L("Review Items", "عناصر المراجعات")}
          items={fs.testimonials?.items || []}
          fields={["name", "role", "content", "rating"]}
          fieldLabels={{ name: L("Name", "الاسم"), role: L("Role/Résultat", "الدور/النتيجة"), content: L("Content", "المحتوى"), rating: L("Rating(1-5)", "التقييم(1-5)") } as Record<string, string>}
          onUpdate={v => set("testimonials.items", v)}
          onAdd={() => set("testimonials.items", [...(fs.testimonials?.items || []), { name: "", role: "", content: "", rating: "5" }])}
        />
      </SectionCard>

      {/* ===== ABOUT / CTA ===== */}
      <SectionCard title={L("About / CTA Section", "قسم عنا")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <TextField label={L("Title", "العنوان")} value={fs.about?.title} onChange={v => set("about.title", v)}
              placeholder={L("Real Stories, Real People, Real Transformations.", "قصص حقيقية، أناس حقيقيون، تحولات حقيقية.")} />
          </div>
          <div className="md:col-span-2">
            <TextField label={L("Text", "النص")} value={fs.about?.text} onChange={v => set("about.text", v)} multiline
              placeholder={L("Real experiences from people who turned their fitness goals into reality.", "تجارب حقيقية لأشخاص حولوا أهدافهم الرياضية إلى واقع.")} />
          </div>
          <TextField label={L("CTA Text", "نص الزر")} value={fs.about?.ctaText} onChange={v => set("about.ctaText", v)}
            placeholder={L("Join Today", "انضم اليوم")} />
          <TextField label={L("CTA Link", "رابط الزر")} value={fs.about?.ctaLink} onChange={v => set("about.ctaLink", v)}
            placeholder="/store/slug#pricing" />
        </div>
      </SectionCard>

      {/* ===== FOOTER ===== */}
      <SectionCard title={L("Footer", "التذييل")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TextField label={L("Logo URL", "رابط الشعار")} value={fs.footer?.logo} onChange={v => set("footer.logo", v)} placeholder="https://..." />
          <div className="md:col-span-2">
            <TextField label={L("Description", "الوصف")} value={fs.footer?.description} onChange={v => set("footer.description", v)} multiline />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white/[0.02] rounded-xl border border-white/[0.05] p-4 mb-4">
          <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-3">{L("Contact Info", "معلومات الاتصال")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TextField label={L("Address", "العنوان")} value={fs.footer?.contact?.address} onChange={v => set("footer.contact.address", v)} placeholder="Alexandria, Egypt" />
            <TextField label={L("Email", "البريد")} value={fs.footer?.contact?.email} onChange={v => set("footer.contact.email", v)} placeholder="email@example.com" />
            <TextField label={L("Phone", "الهاتف")} value={fs.footer?.contact?.phone} onChange={v => set("footer.contact.phone", v)} placeholder="+20 100 000 0000" />
          </div>
        </div>

        {/* Social Links */}
        <EditableList
          title={L("Social Links", "روابط التواصل")}
          items={fs.footer?.socialLinks || []}
          fields={["platform", "url", "icon"]}
          fieldLabels={{ platform: L("Platform", "المنصة"), url: L("URL", "الرابط"), icon: L("Icon Emoji", "الأيقونة") } as Record<string, string>}
          onUpdate={v => set("footer.socialLinks", v)}
          onAdd={() => set("footer.socialLinks", [...(fs.footer?.socialLinks || []), { platform: "", url: "", icon: "🔗" }])}
        />

        {/* Footer Links */}
        <EditableList
          title={L("Footer Links", "روابط التذييل")}
          items={fs.footer?.links || []}
          fields={["label", "url"]}
          fieldLabels={{ label: L("Label", "النص"), url: L("URL", "الرابط") } as Record<string, string>}
          onUpdate={v => set("footer.links", v)}
          onAdd={() => set("footer.links", [...(fs.footer?.links || []), { label: "", url: "" }])}
        />

        {/* App Store */}
        <div className="bg-white/[0.02] rounded-xl border border-white/[0.05] p-4 mt-4">
          <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-3">{L("App Store Links", "روابط المتجر")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextField label="iOS (App Store)" value={fs.footer?.appStore?.ios} onChange={v => set("footer.appStore.ios", v)} placeholder="https://apps.apple.com/..." />
            <TextField label="Android (Play Store)" value={fs.footer?.appStore?.android} onChange={v => set("footer.appStore.android", v)} placeholder="https://play.google.com/..." />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
        <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, multiline }: {
  label: string; value?: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium";
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] font-black text-slate-500 tracking-[0.08em]">{label}</label>
      {multiline ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} placeholder={placeholder} />
      ) : (
        <input value={value || ""} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}
