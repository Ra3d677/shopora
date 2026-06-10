"use client";

import { useState, useMemo } from "react";
import { Save, Loader2, Eye } from "lucide-react";
import { saveStoreSettings } from "../actions";

const POSITIONS = [
  { id: 'above-nav', label: 'Above Navbar', desc: 'At the very top of the page' },
  { id: 'below-nav', label: 'Below Navbar', desc: 'Between navbar and hero' },
  { id: 'below-hero', label: 'Below Hero', desc: 'After the hero/banner section' },
];

function buildAnn(ip: any) {
  const a = ip.announcement || {};
  return {
    enabled: a.enabled !== false,
    text: a.text || '🔥 Free shipping on orders over $50 — use code FIT25',
    textColor: a.textColor || '#ffffff',
    bgColor: a.bgColor || '#ff6b35',
    link: a.link || '',
    linkText: a.linkText || 'Shop Now',
    position: a.position || 'below-nav',
  };
}

export default function IronPeakAnnouncementBar({ slug, initialSettings }: { slug: string; initialSettings: any }) {
  const initial = useMemo(() => buildAnn(initialSettings), []);
  const [content, setContent] = useState(initial);
  const [saving, setSaving] = useState(false);

  function update(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await saveStoreSettings(slug, {
        ironpeakSettings: {
          ...initialSettings,
          announcement: content,
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-orange-500">Announcement</span> Bar
          </h1>
          <p className="text-xs text-slate-400 mt-1">Show a promo bar on your IronPeak homepage</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ
        </button>
      </div>

      {/* Enable */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
        <div>
          <div className="text-sm font-bold text-slate-700">Enable Announcement Bar</div>
          <p className="text-xs text-slate-400 mt-0.5">Show/hide the announcement bar on all pages</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer"
            checked={content.enabled !== false}
            onChange={e => update('enabled', e.target.checked)} />
          <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Live preview */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
          </div>
          <div className="p-6 space-y-6">
            {/* Page mockup */}
            <div className="bg-slate-100 rounded-xl overflow-hidden">
              {/* Simulated announcement bar */}
              <div style={{ background: content.bgColor, color: content.textColor }}
                className="flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium">
                <span>{content.text}</span>
                {content.link && content.linkText && (
                  <a href={content.link} target="_blank" rel="noopener noreferrer"
                    style={{ color: content.textColor }}
                    className="underline font-bold decoration-2 underline-offset-2 hover:opacity-80 whitespace-nowrap text-xs">
                    {content.linkText} →
                  </a>
                )}
              </div>
              {/* Simulated navbar */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
                <div className="text-lg font-black">
                  <span style={{ color: '#ff6b35' }}>IRON</span>
                  <span className="text-slate-900">PEAK</span>
                </div>
                <div className="flex gap-6 text-xs font-semibold text-slate-500">
                  <span>Home</span>
                  <span className="text-orange-500">About</span>
                  <span>Services</span>
                  <span>Pricing</span>
                </div>
              </div>
              {/* Simulated hero area */}
              <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-white mb-2">Hero Section</div>
                  <div className="text-xs text-slate-400">Banner slider appears here</div>
                </div>
              </div>
            </div>

            {/* Position indicator */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Current Position</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-6 bg-slate-200 rounded flex items-center justify-center text-[9px] font-bold text-slate-400">Navbar</div>
                {content.position === 'above-nav' && (
                  <div className="px-3 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white" style={{ background: content.bgColor }}>← Bar here</div>
                )}
                <div className="flex-1 h-6 bg-slate-200 rounded flex items-center justify-center text-[9px] font-bold text-slate-400">Hero / Banner</div>
                {content.position === 'below-nav' && (
                  <div className="px-3 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white" style={{ background: content.bgColor }}>← Bar here</div>
                )}
                <div className="flex-1 h-6 bg-slate-200 rounded flex items-center justify-center text-[9px] font-bold text-slate-400">Content</div>
                {content.position === 'below-hero' && (
                  <div className="px-3 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white" style={{ background: content.bgColor }}>← Bar here</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Position */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Position on Page</label>
            <div className="space-y-2">
              {POSITIONS.map(p => (
                <button key={p.id} type="button" onClick={() => update('position', p.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all ${content.position === p.id ? 'border-orange-400 bg-orange-50 ring-1 ring-orange-200' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="font-bold text-slate-700">{p.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Announcement Text</label>
            <input type="text" value={content.text}
              onChange={e => update('text', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm" />
          </div>

          {/* Colors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Colors</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">Background</label>
                <div className="flex gap-2">
                  <input type="color" value={content.bgColor}
                    onChange={e => update('bgColor', e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 flex-shrink-0" />
                  <input type="text" value={content.bgColor}
                    onChange={e => update('bgColor', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-[10px] font-mono" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">Text</label>
                <div className="flex gap-2">
                  <input type="color" value={content.textColor}
                    onChange={e => update('textColor', e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 flex-shrink-0" />
                  <input type="text" value={content.textColor}
                    onChange={e => update('textColor', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-[10px] font-mono" />
                </div>
              </div>
            </div>
          </div>

          {/* Link */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Link (optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Link Text</label>
                <input type="text" value={content.linkText}
                  onChange={e => update('linkText', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">URL</label>
                <input type="text" value={content.link}
                  onChange={e => update('link', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs font-mono" />
              </div>
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
