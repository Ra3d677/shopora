"use client";

import { useState, useMemo } from "react";
import { Save, Loader2, Plus, Trash2, Eye, Type, Layout, GripVertical } from "lucide-react";
import { saveStoreSettings } from "../actions";

const DEFAULT_ITEMS = [
  { icon: "🏃", title: "Cardio Training", description: "Improve your cardiovascular health with our state-of-the-art cardio equipment including treadmills, ellipticals, and stationary bikes." },
  { icon: "💪", title: "Weight Lifting", description: "Build strength and muscle with our extensive free weights area, power racks, and resistance machines for all fitness levels." },
  { icon: "👤", title: "Personal Training", description: "Get personalized workout plans and one-on-one coaching from our certified trainers to maximize your results." },
  { icon: "🥗", title: "Nutrition Plans", description: "Our nutrition experts will create customized meal plans to complement your fitness routine and help you reach your goals faster." },
  { icon: "👥", title: "Group Classes", description: "Join our energetic group classes including yoga, HIIT, spin, and Zumba for motivation and community support." },
  { icon: "🧘", title: "Recovery Services", description: "Enhance your recovery with our sauna, massage therapy, and physiotherapy services to keep you performing at your best." },
];

function buildServices(settings: any) {
  const ip = settings || {};
  const s = ip.services || {};
  return {
    enabled: s.enabled !== false,
    sectionTitle: s.sectionTitle || "Our Services",
    sectionSubtitle: s.sectionSubtitle || "Everything you need to achieve your fitness goals",
    items: s.items?.length ? s.items : DEFAULT_ITEMS,
  };
}

function EmojiPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const emojis = ["🏃", "💪", "👤", "🥗", "👥", "🧘", "🏋️", "👨‍🏫", "👩‍🏫", "🕐", "🎯", "🔥", "⭐", "💎", "🏆", "💊", "🧠", "❤️", "⚡", "🎵", "📊", "🚴", "🤸", "🏄"];

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-10 h-10 flex items-center justify-center text-lg bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
        {value || "😀"}
      </button>
      {open && (
        <div className="absolute top-12 left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-72">
          <div className="grid grid-cols-5 gap-1">
            {emojis.map(e => (
              <button key={e} type="button" onClick={() => { onChange(e); setOpen(false); }}
                className={`w-10 h-10 flex items-center justify-center text-lg rounded-lg hover:bg-slate-100 transition-colors ${value === e ? 'bg-orange-50 ring-2 ring-orange-400' : ''}`}>
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function IronPeakServicesManager({ slug, initialSettings }: { slug: string; initialSettings: any }) {
  const initial = useMemo(() => buildServices(initialSettings), []);
  const [content, setContent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'items'>('content');

  function update(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  function updateItem(index: number, field: string, val: string) {
    setContent((prev: any) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, items };
    });
  }

  function removeItem(index: number) {
    setContent((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: any, i: number) => i !== index),
    }));
  }

  function addItem() {
    setContent((prev: any) => ({
      ...prev,
      items: [...prev.items, { icon: "🔥", title: "New Service", description: "Service description here" }],
    }));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setContent((prev: any) => {
      const items = [...prev.items];
      const target = index + direction;
      if (target < 0 || target >= items.length) return prev;
      [items[index], items[target]] = [items[target], items[index]];
      return { ...prev, items };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { enabled, sectionTitle, sectionSubtitle, items } = content;
      const res = await saveStoreSettings(slug, {
        ironpeakSettings: {
          ...initialSettings,
          services: { enabled, sectionTitle, sectionSubtitle, items },
        },
      });
      if (res?.success === false) alert(res.error);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-orange-500">Our</span> Services
          </h1>
          <p className="text-xs text-slate-400 mt-1">Customize the Services section of your IronPeak template</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* === Live Preview === */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
          </div>
          <div className="p-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <style>{`
              .ip-preview-services { background: #fff; padding: 4rem 0; border-radius: 16px; }
              .ip-preview-container { max-width: 93%; margin: 0 auto; }
              .ip-preview-section-header { text-align: center; margin-bottom: 4rem; }
              .ip-preview-section-header h2 { color: #222; position: relative; display: inline-block; font-size: 2.5rem; font-weight: 800; margin: 0; }
              .ip-preview-section-header h2::after { content: ""; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(135deg,#ff6b35,#f7931e); border-radius: 2px; }
              .ip-preview-section-header p { color: #666; max-width: 700px; margin: 1rem auto 0; font-size: 1.1rem; }
              .ip-preview-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
              .ip-preview-service-card { padding: 2rem; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,.06); transition: .3s; background: #fff; }
              .ip-preview-service-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,.1); }
              .ip-preview-service-icon { width: 60px; height: 60px; background: linear-gradient(135deg,#ff6b35,#f7931e); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #fff; margin-bottom: 1.2rem; box-shadow: 0 8px 25px rgba(255,107,53,.3); }
              .ip-preview-service-card h3 { font-size: 1.25rem; margin: 0 0 0.8rem; color: #222; font-weight: 700; }
              .ip-preview-service-card p { color: #666; line-height: 1.7; font-size: 0.95rem; margin: 0 0 1rem; }
              @media (max-width: 768px) {
                .ip-preview-services-grid { grid-template-columns: 1fr; }
              }
            `}</style>
            <div className="ip-preview-services">
              <div className="ip-preview-container">
                <div className="ip-preview-section-header">
                  <h2>{content.sectionTitle}</h2>
                  <p>{content.sectionSubtitle}</p>
                </div>
                <div className="ip-preview-services-grid">
                  {content.items.map((s: any, i: number) => (
                    <div key={i} className="ip-preview-service-card">
                      <div className="ip-preview-service-icon">{s.icon}</div>
                      <h3>{s.title}</h3>
                      <p>{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === Editor Panel === */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200">
          <div className="flex border-b border-slate-200">
            {[
              { id: 'content', label: 'Content', icon: Type },
              { id: 'items', label: 'Services Items', icon: Layout },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-bold transition-all border-b-2 ${activeTab === tab.id ? 'border-orange-500 text-orange-600 bg-orange-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 space-y-5 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <div className="text-xs font-bold text-slate-700">Enable Section</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Show/hide this section on the page</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer"
                  checked={content.enabled !== false}
                  onChange={e => update('enabled', e.target.checked)} />
                <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>

            {activeTab === 'content' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Section Title</label>
                  <input type="text" value={content.sectionTitle}
                    onChange={e => update('sectionTitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Section Subtitle</label>
                  <input type="text" value={content.sectionSubtitle}
                    onChange={e => update('sectionSubtitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm" />
                </div>
              </>
            )}

            {activeTab === 'items' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-700">Service Items</div>
                    <p className="text-[10px] text-slate-400">Each card shows icon, title, and description</p>
                  </div>
                  <button type="button" onClick={addItem}
                    className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-600 rounded-xl text-[11px] font-bold hover:bg-orange-100 transition-colors border border-orange-200">
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                {content.items.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex items-center gap-1 pt-1">
                        <GripVertical className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <EmojiPicker value={item.icon} onChange={v => updateItem(i, 'icon', v)} />
                          <input type="text" value={item.title}
                            onChange={e => updateItem(i, 'title', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
                            placeholder="Service title" />
                        </div>
                        <textarea rows={2} value={item.description}
                          onChange={e => updateItem(i, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs leading-relaxed resize-none"
                          placeholder="Service description" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-all disabled:opacity-30 text-xs">▲</button>
                        <button type="button" onClick={() => moveItem(i, 1)} disabled={i === content.items.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-all disabled:opacity-30 text-xs">▼</button>
                        <button type="button" onClick={() => removeItem(i)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {content.items.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">No services yet. Click "Add" to create one.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ جميع التغييرات
        </button>
      </div>
    </div>
  );
}
