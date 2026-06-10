"use client";

import { useState, useMemo } from "react";
import { Save, Loader2, Plus, Trash2, Eye, Edit3, ImageIcon, Type, Layout, GripVertical } from "lucide-react";
import { saveStoreSettings } from "../actions";
import MediaPicker from "../media/MediaPicker";

const DEFAULT_FEATURES = [
  { icon: "🏋️", text: "State-of-the-art equipment" },
  { icon: "👨‍🏫", text: "Certified personal trainers" },
  { icon: "🥗", text: "Nutrition planning services" },
  { icon: "🕐", text: "24/7 access for premium members" },
];

function buildAbout(settings: any) {
  const ip = settings || {};
  const a = ip.about || {};
  return {
    enabled: a.enabled !== false,
    sectionTitle: a.sectionTitle || "Your Fitness Goals",
    sectionSubtitle: a.sectionSubtitle || "Welcome To",
    paragraph1: a.paragraph1 || "",
    paragraph2: a.paragraph2 || "",
    image: a.image || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    features: a.features?.length ? a.features : DEFAULT_FEATURES,
  };
}

function EmojiPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const emojis = ["🏋️", "💪", "👨‍🏫", "👩‍🏫", "🥗", "🕐", "🏃", "🧘", "👥", "🎯", "🔥", "⭐", "💎", "🏆", "💊", "🧠", "❤️", "⚡", "🎵", "📊"];

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

export default function TwoHAboutUsManager({ slug, initialSettings }: { slug: string; initialSettings: any }) {
  const initial = useMemo(() => buildAbout(initialSettings), []);
  const [content, setContent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'image' | 'features'>('content');

  function update(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  function updateFeature(index: number, field: string, val: string) {
    setContent((prev: any) => {
      const features = [...prev.features];
      features[index] = { ...features[index], [field]: val };
      return { ...prev, features };
    });
  }

  function removeFeature(index: number) {
    setContent((prev: any) => ({
      ...prev,
      features: prev.features.filter((_: any, i: number) => i !== index),
    }));
  }

  function addFeature() {
    setContent((prev: any) => ({
      ...prev,
      features: [...prev.features, { icon: "🔥", text: "New feature" }],
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { enabled, sectionTitle, sectionSubtitle, paragraph1, paragraph2, image, features } = content;
      const res = await saveStoreSettings(slug, {
        twohSettings: {
          ...initialSettings,
          about: { enabled, sectionTitle, sectionSubtitle, paragraph1, paragraph2, image, features },
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-orange-500">About</span> Us
          </h1>
          <p className="text-xs text-slate-400 mt-1">Customize the About section of your 2H template</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ التغييرات
        </button>
      </div>

      {/* Main grid: Preview + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* === Live Preview === */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
          </div>
          <div className="p-6">
            <style>{`
              .th-preview-about { padding: 4rem 0; border-radius: 16px; }
              .th-preview-container { max-width: 93%; margin: 0 auto; }
              .th-preview-about-row { display: flex; flex-wrap: wrap; align-items: center; margin: 0 -15px; }
              .th-preview-about-text { width: 58.333%; padding: 0 15px; }
              .th-preview-about-img { width: 41.667%; padding: 0 15px; }
              .th-preview-about-text h2 { font-size: 2.25rem; font-weight: 700; color: #222; text-transform: uppercase; margin-bottom: 1rem; font-family: 'Roboto Condensed',sans-serif; }
              .th-preview-about-text h2 span { color: #f36f21; font-size: 1.125rem; display: block; font-weight: 600; text-transform: uppercase; }
              .th-preview-about-text p { font-size: 0.875rem; color: #555; line-height: 1.8; margin-bottom: 1rem; }
              .th-preview-features-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem; margin-top: 2rem; }
              .th-preview-feature-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,.05); }
              .th-preview-feature-icon { width: 50px; height: 50px; background: #f36f21; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; flex-shrink: 0; }
              .th-preview-about-img img { width: 100%; border-radius: 20px; display: block; }
              @media (max-width: 990px) {
                .th-preview-about-text, .th-preview-about-img { width: 100%; text-align: center; }
                .th-preview-about-img { margin-top: 2rem; }
                .th-preview-features-grid { grid-template-columns: 1fr; }
              }
            `}</style>
            <div className="th-preview-about">
              <div className="th-preview-container">
                <div className="th-preview-about-row">
                  <div className="th-preview-about-text">
                    <h2><span>{content.sectionSubtitle}</span> {content.sectionTitle}</h2>
                    <p>{content.paragraph1}</p>
                    <p>{content.paragraph2}</p>
                    <div className="th-preview-features-grid">
                      {content.features.map((f: any, i: number) => (
                        <div key={i} className="th-preview-feature-item">
                          <div className="th-preview-feature-icon">{f.icon}</div>
                          <div style={{ fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>{f.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="th-preview-about-img">
                    <img src={content.image} alt="About" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === Editor Panel === */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {[
              { id: 'content', label: 'Content', icon: Type },
              { id: 'image', label: 'Image', icon: ImageIcon },
              { id: 'features', label: 'Features', icon: Layout },
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
            {/* Section enable toggle */}
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
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paragraph 1</label>
                  <textarea rows={3} value={content.paragraph1}
                    onChange={e => update('paragraph1', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm leading-relaxed resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paragraph 2</label>
                  <textarea rows={3} value={content.paragraph2}
                    onChange={e => update('paragraph2', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm leading-relaxed resize-none" />
                </div>
              </>
            )}

            {activeTab === 'image' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50">
                    {content.image ? (
                      <img src={content.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-6 h-6" /></div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-700">About Image</div>
                    <p className="text-[10px] text-slate-400">Shown on the right side of the section</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <MediaPicker slug={slug} value={content.image || ''}
                    onChange={url => update('image', url)}
                    className="bg-white" />
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-700">Feature Items</div>
                    <p className="text-[10px] text-slate-400">Shown in a 2x2 grid below the paragraphs</p>
                  </div>
                  <button type="button" onClick={addFeature}
                    className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-600 rounded-xl text-[11px] font-bold hover:bg-orange-100 transition-colors border border-orange-200">
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                {content.features.map((f: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center gap-1 pt-1">
                      <GripVertical className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <EmojiPicker value={f.icon} onChange={v => updateFeature(i, 'icon', v)} />
                        <input type="text" value={f.text}
                          onChange={e => updateFeature(i, 'text', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
                          placeholder="Feature text" />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFeature(i)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all mt-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {content.features.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">No features yet. Click "Add" to create one.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom save */}
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
