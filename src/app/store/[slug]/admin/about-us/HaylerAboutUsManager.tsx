"use client";

import { useState, useMemo } from "react";
import { Save, Loader2, Eye, ImageIcon, Type, Link2 } from "lucide-react";
import { saveStoreSettings } from "../actions";
import MediaPicker from "../media/MediaPicker";

function buildAbout(settings: any) {
  const h = settings || {};
  const a = h.about || {};
  return {
    heading: a.heading || "A solution that goes above touch and imagination...",
    paragraph: a.paragraph || "We are a multi award winning global creative production studio that blends multidisciplinary talents and fields of expertise under a roof.",
    image: a.image || "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997925/shopora/hayler/about.jpg",
    readMoreText: a.readMoreText || "Read More",
    readMoreLink: a.readMoreLink || "#",
  };
}

export default function HaylerAboutUsManager({ slug, initialSettings }: { slug: string; initialSettings: any }) {
  const initial = useMemo(() => buildAbout(initialSettings), []);
  const [content, setContent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'image'>('content');

  function update(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { heading, paragraph, image, readMoreText, readMoreLink } = content;
      const res = await saveStoreSettings(slug, {
        haylerSettings: {
          ...initialSettings,
          about: { heading, paragraph, image, readMoreText, readMoreLink },
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
          <p className="text-xs text-slate-400 mt-1">Customize the About section of your Hayler template</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
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
            <div className="bg-[#f5f0eb] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-10 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                    {content.heading}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {content.paragraph}
                  </p>
                  <a href={content.readMoreLink} className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 border-b-2 border-gray-900 pb-0.5 w-fit hover:opacity-70 transition-opacity">
                    {content.readMoreText}
                    <span className="text-lg leading-none">→</span>
                  </a>
                </div>
                <div className="relative min-h-[300px]">
                  <img
                    src={content.image || "https://placehold.co/800x600/1a1a2e/666?text=No+Image"}
                    alt="About"
                    className="w-full h-full absolute inset-0 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x600/1a1a2e/666?text=No+Image"; }}
                  />
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
            {activeTab === 'content' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Heading</label>
                  <input type="text" value={content.heading}
                    onChange={e => update('heading', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paragraph</label>
                  <textarea rows={4} value={content.paragraph}
                    onChange={e => update('paragraph', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm leading-relaxed resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <Link2 className="w-3 h-3" />
                    Read More Text
                  </label>
                  <input type="text" value={content.readMoreText}
                    onChange={e => update('readMoreText', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <Link2 className="w-3 h-3" />
                    Read More Link
                  </label>
                  <input type="text" value={content.readMoreLink}
                    onChange={e => update('readMoreLink', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm font-mono" />
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
          </div>
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>
    </div>
  );
}
