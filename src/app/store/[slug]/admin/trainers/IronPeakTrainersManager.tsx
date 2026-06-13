"use client";

import { useState, useMemo } from "react";
import { Save, Loader2, Plus, Trash2, Eye, Type, Layout, GripVertical, Image as ImageIcon } from "lucide-react";
import { saveStoreSettings } from "../actions";
import MediaPicker from "../media/MediaPicker";

const DEFAULT_ITEMS = [
  { image: "", name: "Alex Johnson", role: "Strength & Conditioning", bio: "10+ years experience in strength training and bodybuilding coaching." },
  { image: "", name: "Maria Rodriguez", role: "Yoga & Mobility", bio: "Certified yoga instructor with specialization in mobility and injury prevention." },
  { image: "", name: "James Wilson", role: "HIIT & Cardio", bio: "HIIT specialist with 8 years experience transforming clients through high-intensity workouts." },
  { image: "", name: "Sarah Chen", role: "Nutrition & Wellness", bio: "Registered dietitian helping clients achieve their goals through proper nutrition." },
];

function buildTrainers(settings: any) {
  const ip = settings || {};
  const t = ip.trainers || {};
  return {
    enabled: t.enabled !== false,
    sectionTitle: t.sectionTitle || "Meet Our Trainers",
    sectionSubtitle: t.sectionSubtitle || "Expert coaches dedicated to your success",
    items: t.items?.length ? t.items : DEFAULT_ITEMS,
  };
}

export default function IronPeakTrainersManager({ slug, initialSettings }: { slug: string; initialSettings: any }) {
  const initial = useMemo(() => buildTrainers(initialSettings), []);
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
      items: [...prev.items, { image: "", name: "New Trainer", role: "Role", bio: "Trainer bio here" }],
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
          trainers: { enabled, sectionTitle, sectionSubtitle, items },
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
            <span className="text-orange-500">Meet Our</span> Trainers
          </h1>
          <p className="text-xs text-slate-400 mt-1">Customize the Trainers section of your IronPeak template</p>
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
              .ip-preview-trainers { background: #f8f9fa; padding: 4rem 0; border-radius: 16px; }
              .ip-preview-container { max-width: 93%; margin: 0 auto; }
              .ip-preview-section-header { text-align: center; margin-bottom: 4rem; }
              .ip-preview-section-header h2 { color: #222; position: relative; display: inline-block; font-size: 2.5rem; font-weight: 800; margin: 0; }
              .ip-preview-section-header h2::after { content: ""; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(135deg,#ff6b35,#f7931e); border-radius: 2px; }
              .ip-preview-section-header p { color: #666; max-width: 700px; margin: 1rem auto 0; font-size: 1.1rem; }
              .ip-preview-trainers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.5rem; }
              .ip-preview-trainer-card { background: #fff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,.08); overflow: hidden; transition: .4s; }
              .ip-preview-trainer-card:hover { transform: translateY(-10px); box-shadow: 0 20px 60px rgba(0,0,0,.15); }
              .ip-preview-trainer-image { height: 320px; overflow: hidden; position: relative; background: #e9ecef; }
              .ip-preview-trainer-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
              .ip-preview-trainer-card:hover .ip-preview-trainer-image img { transform: scale(1.1); }
              .ip-preview-trainer-info { padding: 2rem; text-align: center; }
              .ip-preview-trainer-info h3 { font-size: 1.6rem; margin: 0 0 .5rem; color: #222; font-weight: 700; }
              .ip-preview-trainer-role { color: #ff6b35; font-weight: 600; margin-bottom: 1rem; font-size: 1.1rem; }
              .ip-preview-trainer-info p { color: #666; line-height: 1.6; margin: 0; }
              @media (max-width: 768px) {
                .ip-preview-trainers-grid { grid-template-columns: 1fr; }
              }
            `}</style>
            <div className="ip-preview-trainers">
              <div className="ip-preview-container">
                <div className="ip-preview-section-header">
                  <h2>{content.sectionTitle}</h2>
                  <p>{content.sectionSubtitle}</p>
                </div>
                <div className="ip-preview-trainers-grid">
                  {content.items.map((t: any, i: number) => (
                    <div key={i} className="ip-preview-trainer-card">
                      <div className="ip-preview-trainer-image">
                        {t.image ? (
                          <img src={t.image} alt={t.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl">👤</div>
                        )}
                      </div>
                      <div className="ip-preview-trainer-info">
                        <h3>{t.name}</h3>
                        <div className="ip-preview-trainer-role">{t.role}</div>
                        <p>{t.bio}</p>
                      </div>
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
              { id: 'items', label: 'Trainers', icon: Layout },
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
                    <div className="text-xs font-bold text-slate-700">Trainer Cards</div>
                    <p className="text-[10px] text-slate-400">Each card shows image, name, role, and bio</p>
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
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">📷</div>
                            )}
                          </div>
                          <input type="text" value={item.name}
                            onChange={e => updateItem(i, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
                            placeholder="Trainer name" />
                        </div>
                        <input type="text" value={item.role}
                          onChange={e => updateItem(i, 'role', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
                          placeholder="Role / title" />
                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                          <MediaPicker slug={slug} value={item.image || ''}
                            onChange={url => updateItem(i, 'image', url)}
                            className="border-0 rounded-none" />
                        </div>
                        <textarea rows={2} value={item.bio}
                          onChange={e => updateItem(i, 'bio', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs leading-relaxed resize-none"
                          placeholder="Trainer bio / description" />
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
                  <div className="text-center py-8 text-slate-400 text-xs">No trainers yet. Click "Add" to create one.</div>
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
