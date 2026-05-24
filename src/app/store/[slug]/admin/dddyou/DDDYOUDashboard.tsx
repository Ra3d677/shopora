"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save, Loader2, Plus, X, Image as ImageIcon, Eye, Star, Trash2, ArrowUp, ArrowDown, ExternalLink
} from "lucide-react";
import { saveStoreSettings } from "../actions";
import { useLanguageStore } from "@/store/language";
import { toast } from "sonner";
import MediaPicker from "../media/MediaPicker";

type Dd = Record<string, any>;

export default function DDDYOUDashboard({ slug, initialSettings, storeName }: { slug: string; initialSettings: any; storeName: string }) {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("hero");
  const [showMedia, setShowMedia] = useState<string | null>(null);

  const ds = settings.dddyouSettings || {};
  const get = (path: string) => {
    const parts = path.split(".");
    let obj = ds;
    for (const p of parts) { if (obj == null) return undefined; obj = obj[p]; }
    return obj;
  };
  const set = (path: string, value: any) => {
    const parts = path.split(".");
    const newDs = JSON.parse(JSON.stringify(ds || {}));
    let obj = newDs;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    setSettings({ ...settings, dddyouSettings: newDs });
  };

  const save = () => {
    startTransition(async () => {
      try {
        await saveStoreSettings(slug, settings);
        toast.success(isAr ? "تم الحفظ" : "Saved");
        router.refresh();
      } catch { toast.error(isAr ? "خطأ في الحفظ" : "Save error"); }
    });
  };

  const tabs = [
    { id: "hero", label: isAr ? "القسم الرئيسي" : "Hero", icon: Eye },
    { id: "about", label: isAr ? "عن العلامة" : "About", icon: Star },
    { id: "features", label: isAr ? "المميزات" : "Features", icon: Plus },
    { id: "contact", label: isAr ? "التواصل" : "Contact", icon: Plus },
    { id: "testimonials", label: isAr ? "آراء العملاء" : "Testimonials", icon: Star },
  ];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen p-4 md:p-8 pb-8 font-sans admin-bg admin-text">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter admin-text mb-2 uppercase">{isAr ? "لوحة تحكم DDDYOU" : "DDDYOU Dashboard"}</h1>
          <p className="admin-text-muted font-medium tracking-wide text-sm">{isAr ? "تخصيص كل أقسام قالب DDDYOU" : "Customize every section of the DDDYOU template"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/store/${slug}`} target="_blank" className="admin-card p-3 rounded-xl border admin-border flex items-center gap-2 text-xs font-bold hover:text-cyan-400 transition-all">
            <Eye className="w-4 h-4" /> {isAr ? "عرض المتجر" : "View Store"} <ExternalLink className="w-3 h-3" />
          </Link>
          <button onClick={save} disabled={isPending}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-cyan-500/10 active:scale-95">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isAr ? "حفظ" : "Save"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/5' : 'admin-card border admin-border text-admin-text-muted hover:border-cyan-500/20'}`}>
              <TabIcon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Tab */}
          {activeTab === "hero" && (
            <div className="admin-card p-8 rounded-2xl border admin-border space-y-6">
              <h2 className="text-lg font-black italic admin-text tracking-tight uppercase">{isAr ? "القسم الرئيسي" : "Hero Section"}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "العنوان الرئيسي" : "Main Title"}</label>
                  <input value={get("hero.title") || ""} onChange={e => set("hero.title", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl text-sm font-bold outline-none transition-all"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder={isAr ? "رائحة تروي حكايتك" : "A scent that tells your story"} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "النص الفرعي (Alex Brush)" : "Subtitle (Alex Brush)"}</label>
                  <input value={get("hero.subtitle") || ""} onChange={e => set("hero.subtitle", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl text-sm font-bold outline-none transition-all"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder={isAr ? "حكايتك" : "Your Story"} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "الوصف" : "Description"}</label>
                  <textarea value={get("hero.description") || ""} onChange={e => set("hero.description", e.target.value)} rows={3}
                    className="w-full px-5 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder={isAr ? "عطور تجمع بين أصالة الشرق ورقي الغرب" : "Perfumes blending Eastern authenticity with Western elegance"} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "نص الزر" : "Button Text"}</label>
                    <input value={get("hero.btnText") || ""} onChange={e => set("hero.btnText", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all"
                      style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                      placeholder={isAr ? "اكتشف المجموعة" : "Discover Collection"} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "رابط الزر" : "Button Link"}</label>
                    <input value={get("hero.btnLink") || ""} onChange={e => set("hero.btnLink", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                      style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                      placeholder="#products" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "صورة الخلفية" : "Background Image"}</label>
                  <MediaPicker slug={slug} value={get("hero.bgImage") || ""} onChange={url => set("hero.bgImage", url)} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "صورة الخلفية للجوال" : "Mobile Background Image"}</label>
                  <MediaPicker slug={slug} value={get("hero.mobileBgImage") || ""} onChange={url => set("hero.mobileBgImage", url)} />
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="admin-card p-8 rounded-2xl border admin-border space-y-6">
              <h2 className="text-lg font-black italic admin-text tracking-tight uppercase">{isAr ? "عن العلامة" : "About Section"}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "النص الفرعي (Alex Brush)" : "Subtitle (Alex Brush)"}</label>
                  <input value={get("about.subtitle") || ""} onChange={e => set("about.subtitle", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl text-sm font-bold outline-none transition-all"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder={isAr ? "Notre Histoire" : "Notre Histoire"} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "العنوان" : "Title"}</label>
                  <input value={get("about.title") || ""} onChange={e => set("about.title", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl text-sm font-bold outline-none transition-all"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder={isAr ? "فن العطر منذ ١٨٩٢" : "The art of perfume since 1892"} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "الفقرة الأولى" : "First Paragraph"}</label>
                  <textarea value={get("about.paragraph1") || ""} onChange={e => set("about.paragraph1", e.target.value)} rows={4}
                    className="w-full px-5 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "الفقرة الثانية" : "Second Paragraph"}</label>
                  <textarea value={get("about.paragraph2") || ""} onChange={e => set("about.paragraph2", e.target.value)} rows={4}
                    className="w-full px-5 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "الصورة" : "Image"}</label>
                  <MediaPicker slug={slug} value={get("about.image") || ""} onChange={url => set("about.image", url)} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "نص التوقيع" : "Signature Text"}</label>
                  <input value={get("about.signature") || ""} onChange={e => set("about.signature", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl text-sm font-bold outline-none transition-all"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder={isAr ? "— المؤسس: رايد صالح" : "— Founder: Raed Saleh"} />
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="admin-card p-8 rounded-2xl border admin-border space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black italic admin-text tracking-tight uppercase">{isAr ? "المميزات" : "Features"}</h2>
                <button onClick={() => {
                  const items = [...(get("features") || [])];
                  items.push({ icon: "fa-truck", title: isAr ? "ميزة جديدة" : "New Feature", desc: isAr ? "وصف الميزة" : "Feature description" });
                  set("features", items);
                }} className="flex items-center gap-1.5 text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-xl hover:bg-cyan-500/20 transition-all">
                  <Plus className="w-3 h-3" /> {isAr ? "إضافة" : "Add"}
                </button>
              </div>
              {(get("features") || []).map((f: any, i: number) => (
                <div key={i} className="admin-subcard p-5 rounded-xl border admin-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black admin-text-muted uppercase tracking-widest">{isAr ? "ميزة" : "Feature"} #{i + 1}</span>
                    <button onClick={() => {
                      const items = [...(get("features") || [])];
                      items.splice(i, 1);
                      set("features", items);
                    }} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest admin-text-muted block mb-1">{isAr ? "أيقونة (Font Awesome)" : "Icon (Font Awesome)"}</label>
                      <input value={f.icon} onChange={e => {
                        const items = [...(get("features") || [])];
                        items[i].icon = e.target.value; set("features", items);
                      }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                        placeholder="fa-truck" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest admin-text-muted block mb-1">{isAr ? "العنوان" : "Title"}</label>
                      <input value={f.title} onChange={e => {
                        const items = [...(get("features") || [])];
                        items[i].title = e.target.value; set("features", items);
                      }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest admin-text-muted block mb-1">{isAr ? "الوصف" : "Description"}</label>
                      <input value={f.desc} onChange={e => {
                        const items = [...(get("features") || [])];
                        items[i].desc = e.target.value; set("features", items);
                      }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="admin-card p-8 rounded-2xl border admin-border space-y-6">
              <h2 className="text-lg font-black italic admin-text tracking-tight uppercase">{isAr ? "معلومات التواصل" : "Contact Information"}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "العنوان" : "Address"}</label>
                  <input value={get("contact.address") || ""} onChange={e => set("contact.address", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder={isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "الهاتف" : "Phone"}</label>
                  <input value={get("contact.phone") || ""} onChange={e => set("contact.phone", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder="+966 555 222 333" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest admin-text-muted block mb-1.5">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                  <input value={get("contact.email") || ""} onChange={e => set("contact.email", e.target.value)}
                    className="w-full px-5 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }}
                    placeholder="info@dddyou.com" />
                </div>
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <div className="admin-card p-8 rounded-2xl border admin-border space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black italic admin-text tracking-tight uppercase">{isAr ? "آراء العملاء" : "Testimonials"}</h2>
                <button onClick={() => {
                  const items = [...(get("testimonials") || [])];
                  items.push({ name: isAr ? "عميل" : "Customer", role: isAr ? "عميل مميز" : "Verified Buyer", text: isAr ? "تجربة رائعة!" : "Excellent service!", img: "" });
                  set("testimonials", items);
                }} className="flex items-center gap-1.5 text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-xl hover:bg-cyan-500/20 transition-all">
                  <Plus className="w-3 h-3" /> {isAr ? "إضافة" : "Add"}
                </button>
              </div>
              {(get("testimonials") || []).map((t: any, i: number) => (
                <div key={i} className="admin-subcard p-5 rounded-xl border admin-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black admin-text-muted uppercase tracking-widest">{i + 1}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        const items = [...(get("testimonials") || [])];
                        if (i > 0) { [items[i - 1], items[i]] = [items[i], items[i - 1]]; set("testimonials", items); }
                      }} className="admin-text-muted hover:text-cyan-400"><ArrowUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => {
                        const items = [...(get("testimonials") || [])];
                        if (i < items.length - 1) { [items[i], items[i + 1]] = [items[i + 1], items[i]]; set("testimonials", items); }
                      }} className="admin-text-muted hover:text-cyan-400"><ArrowDown className="w-3.5 h-3.5" /></button>
                      <button onClick={() => {
                        const items = [...(get("testimonials") || [])];
                        items.splice(i, 1); set("testimonials", items);
                      }} className="text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest admin-text-muted block mb-1">{isAr ? "الاسم" : "Name"}</label>
                      <input value={t.name} onChange={e => {
                        const items = [...(get("testimonials") || [])];
                        items[i].name = e.target.value; set("testimonials", items);
                      }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest admin-text-muted block mb-1">{isAr ? "الدور" : "Role"}</label>
                      <input value={t.role} onChange={e => {
                        const items = [...(get("testimonials") || [])];
                        items[i].role = e.target.value; set("testimonials", items);
                      }} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest admin-text-muted block mb-1">{isAr ? "النص" : "Text"}</label>
                    <textarea value={t.text} onChange={e => {
                      const items = [...(get("testimonials") || [])];
                      items[i].text = e.target.value; set("testimonials", items);
                    }} rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                      style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest admin-text-muted block mb-1">{isAr ? "الصورة" : "Image"}</label>
                    <MediaPicker slug={slug} value={t.img || ""} onChange={url => {
                      const items = [...(get("testimonials") || [])];
                      items[i].img = url; set("testimonials", items);
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preview Note */}
          <div className="admin-card p-6 rounded-2xl border admin-border/50 text-center">
            <p className="text-[10px] font-black admin-text-muted uppercase tracking-widest">
              <Eye className="w-3.5 h-3.5 inline-block text-cyan-400 ml-1" />
              {isAr ? "اضغط حفظ ثم اذهب إلى المتجر لرؤية التغييرات" : "Save changes then visit your store to see them live."}
            </p>
          </div>
        </div>

        {/* Right Sidebar — Quick Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="admin-card p-6 rounded-2xl border admin-border sticky top-28">
            <h3 className="text-xs font-black italic admin-text tracking-tight uppercase mb-6">{isAr ? "معاينة سريعة" : "Quick Preview"}</h3>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border admin-border relative" style={{ background: '#0f0f1a' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#c87a36] flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-[#0f0f1a] text-xs font-black">D</span>
                </div>
                <p className="font-['Alex_Brush'] text-[#c9a96e] text-lg">{storeName}</p>
                <div className="w-12 h-px bg-[#c9a96e]/30 my-3" />
                {activeTab === "hero" && <p className="text-white/40 text-[10px]">{isAr ? "تعديل القسم الرئيسي" : "Editing Hero Section"}</p>}
                {activeTab === "about" && <p className="text-white/40 text-[10px]">{isAr ? "تعديل قسم عن العلامة" : "Editing About Section"}</p>}
                {activeTab === "features" && <p className="text-white/40 text-[10px]">{isAr ? `تعديل ${(get("features") || []).length} ميزات` : `Editing ${(get("features") || []).length} features`}</p>}
                {activeTab === "contact" && <p className="text-white/40 text-[10px]">{isAr ? "تعديل معلومات التواصل" : "Editing Contact Info"}</p>}
                {activeTab === "testimonials" && <p className="text-white/40 text-[10px]">{isAr ? `تعديل ${(get("testimonials") || []).length} آراء` : `Editing ${(get("testimonials") || []).length} testimonials`}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}