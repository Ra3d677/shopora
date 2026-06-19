"use client";

import { useState, useMemo, ReactNode } from "react";
import { Save, Loader2, Plus, Trash2, Eye, Type, Layout, GripVertical } from "lucide-react";
import { saveStoreSettings } from "./actions";

interface Item {
  [key: string]: any;
}

interface SectionConfig {
  /** Display title (e.g. "Our Services") */
  title: string;
  /** Highlighted prefix (e.g. "Our") */
  accent?: string;
  /** Subtitle under the heading */
  subtitle: string;
  /** Key in ironpeakSettings (e.g. "services", "trainers") */
  dataKey: string;
  /** Default section values */
  defaults: {
    enabled: boolean;
    sectionTitle: string;
    sectionSubtitle: string;
    items: Item[];
  };
  /** Create an empty item for the "Add" button */
  createEmptyItem: () => Item;
  /** Render the preview of one item */
  renderPreview: (item: Item, index: number, allItems: Item[]) => ReactNode;
  /** Render the editor for one item (inside the items tab) */
  renderEditor: (
    item: Item,
    index: number,
    onChange: (field: string, val: string) => void,
    slug: string,
  ) => ReactNode;
  /** Extra CSS for the preview (scoped) */
  previewCss?: string;
  /** Custom label for items tab */
  itemsLabel?: string;
  /** Custom description for items tab */
  itemsDescription?: string;
}

export default function GenericIronPeakManager({
  slug,
  initialSettings,
  config,
}: {
  slug: string;
  initialSettings: any;
  config: SectionConfig;
}) {
  const buildData = (settings: any) => {
    const ip = settings || {};
    const d = ip[config.dataKey] || {};
    return {
      enabled: d.enabled !== false,
      sectionTitle: d.sectionTitle || config.defaults.sectionTitle,
      sectionSubtitle: d.sectionSubtitle || config.defaults.sectionSubtitle,
      items: d.items?.length ? d.items : config.defaults.items,
    };
  };

  const initial = useMemo(() => buildData(initialSettings), []);
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
      items: [...prev.items, config.createEmptyItem()],
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
          [config.dataKey]: { enabled, sectionTitle, sectionSubtitle, items },
        },
      });
      if (res?.success === false) alert(res.error);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  const accentPart = config.accent || config.title.split(' ')[0];
  const restTitle = config.accent ? config.title : config.title.slice(accentPart.length);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-orange-500">{accentPart}</span>{restTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{config.subtitle}</p>
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
          <div className="p-6 max-h-[600px] overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {config.previewCss && <style>{config.previewCss}</style>}
            {config.renderPreview(content as any, 0, content.items)}
          </div>
        </div>

        {/* === Editor Panel === */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200">
          <div className="flex border-b border-slate-200">
            {[
              { id: 'content', label: 'Content', icon: Type },
              { id: 'items', label: config.itemsLabel || 'Items', icon: Layout },
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
                    <div className="text-xs font-bold text-slate-700">{config.itemsLabel || 'Items'}</div>
                    <p className="text-[10px] text-slate-400">{config.itemsDescription || 'Manage items'}</p>
                  </div>
                  <button type="button" onClick={addItem}
                    className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-600 rounded-xl text-[11px] font-bold hover:bg-orange-100 transition-colors border border-orange-200">
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                {content.items.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex items-center gap-1 pt-1 flex-shrink-0">
                        <GripVertical className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        {config.renderEditor(item, i, (field, val) => updateItem(i, field, val), slug)}
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
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
                  <div className="text-center py-8 text-slate-400 text-xs">No items yet. Click "Add" to create one.</div>
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
