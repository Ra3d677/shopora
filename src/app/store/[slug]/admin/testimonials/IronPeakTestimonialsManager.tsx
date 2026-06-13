"use client";

import { useState, useMemo } from "react";
import { Save, Loader2, Plus, Trash2, Eye, Type, Layout, GripVertical, MessageSquare, Star } from "lucide-react";
import { saveStoreSettings } from "../actions";

const DEFAULT_ITEMS = [
  { quote: "I've been a member at Iron Peak for 2 years now and it's completely transformed my life. The trainers are incredibly supportive and the community is amazing. I've lost 40 pounds and gained so much confidence!", author: "Michael Thompson", meta: "Member for 2 years", initials: "MT" },
  { quote: "The personal training program at Iron Peak is worth every penny. My trainer James created a customized plan that helped me build muscle and increase my strength beyond what I thought was possible. Highly recommend!", author: "Jessica Lee", meta: "Member for 1 year", initials: "JL" },
  { quote: "As a beginner, I was nervous about joining a gym, but the staff at Iron Peak made me feel welcome from day one. The group classes are fun and challenging, and I've made great friends along the way!", author: "David Park", meta: "Member for 6 months", initials: "DP" },
];

function buildTestimonials(settings: any) {
  const ip = settings || {};
  const t = ip.testimonials || {};
  return {
    enabled: t.enabled !== false,
    sectionTitle: t.sectionTitle || "What Our Members Say",
    sectionSubtitle: t.sectionSubtitle || "Real stories from real people",
    items: t.items?.length ? t.items : DEFAULT_ITEMS,
    customerItems: t.customerItems || [],
  };
}

function initialsFromName(name: string) {
  return name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);
}

export default function IronPeakTestimonialsManager({ slug, initialSettings }: { slug: string; initialSettings: any }) {
  const initial = useMemo(() => buildTestimonials(initialSettings), []);
  const [content, setContent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'items' | 'customer'>('content');
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);

  function update(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  function updateItem(index: number, field: string, val: string) {
    setContent((prev: any) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: val };
      if (field === 'author') items[index].initials = initialsFromName(val);
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
      items: [...prev.items, { quote: "Great experience!", author: "New Member", meta: "Member", initials: "NM" }],
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

  async function deleteCustomerItem(index: number) {
    setDeletingIdx(index);
    try {
      const res = await fetch(`/api/store/${slug}/testimonials`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || 'Failed to delete'); return; }
      setContent((prev: any) => ({
        ...prev,
        customerItems: prev.customerItems.filter((_: any, i: number) => i !== index),
      }));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeletingIdx(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { enabled, sectionTitle, sectionSubtitle, items, customerItems } = content;
      const res = await saveStoreSettings(slug, {
        ironpeakSettings: {
          ...initialSettings,
          testimonials: { enabled, sectionTitle, sectionSubtitle, items, customerItems },
        },
      });
      if (res?.success === false) alert(res.error);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  const allItems = [...content.items, ...content.customerItems];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-orange-500">Testimonials</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage testimonials and customer reviews</p>
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
            <style>{`
              .ip-preview-testimonials { background: #fff; padding: 4rem 0; border-radius: 16px; }
              .ip-preview-container { max-width: 93%; margin: 0 auto; }
              .ip-preview-section-header { text-align: center; margin-bottom: 4rem; }
              .ip-preview-section-header h2 { color: #222; position: relative; display: inline-block; font-size: 2.5rem; font-weight: 800; margin: 0; }
              .ip-preview-section-header h2::after { content: ""; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(135deg,#ff6b35,#f7931e); border-radius: 2px; }
              .ip-preview-section-header p { color: #666; max-width: 700px; margin: 1rem auto 0; font-size: 1.1rem; }
              .ip-preview-testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2.5rem; }
              .ip-preview-testimonial-card { background: linear-gradient(135deg,#f8f9fa,#e9ecef); padding: 2.5rem; border-radius: 20px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,.05); transition: .3s; }
              .ip-preview-testimonial-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 15px 40px rgba(0,0,0,.1); }
              .ip-preview-quote-icon { position: absolute; top: 20px; right: 20px; font-size: 4rem; color: rgba(255,107,53,.2); line-height: 1; font-family: Georgia,serif; }
              .ip-preview-testimonial-text { font-size: 1.1rem; line-height: 1.8; color: #555; margin-bottom: 2rem; font-style: italic; }
              .ip-preview-author-avatar { width: 60px; height: 60px; background: linear-gradient(135deg,#ff6b35,#f7931e); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
              .ip-preview-author-info h4 { color: #222; font-size: 1.2rem; margin-bottom: .25rem; }
              .ip-preview-author-info p { font-size: .95rem; color: #666; }
              .ip-preview-testimonial-author { display: flex; align-items: center; gap: 1rem; }
              @media (max-width: 768px) {
                .ip-preview-testimonials-grid { grid-template-columns: 1fr; }
              }
            `}</style>
            <div className="ip-preview-testimonials">
              <div className="ip-preview-container">
                <div className="ip-preview-section-header">
                  <h2>{content.sectionTitle}</h2>
                  <p>{content.sectionSubtitle}</p>
                </div>
                <div className="ip-preview-testimonials-grid">
                  {allItems.map((t: any, i: number) => (
                    <div key={i} className="ip-preview-testimonial-card">
                      <div className="ip-preview-quote-icon">"</div>
                      <p className="ip-preview-testimonial-text">{t.quote}</p>
                      <div className="ip-preview-testimonial-author">
                        <div className="ip-preview-author-avatar">{t.initials}</div>
                        <div className="ip-preview-author-info">
                          <h4>{t.author}</h4>
                          <p>{t.meta}</p>
                        </div>
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
              { id: 'items', label: 'Manage', icon: Layout },
              { id: 'customer', label: `Customer (${content.customerItems.length})`, icon: MessageSquare },
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
                    <div className="text-xs font-bold text-slate-700">Testimonial Cards</div>
                    <p className="text-[10px] text-slate-400">Edit, reorder, or delete default testimonials</p>
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
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{item.initials}</div>
                          <input type="text" value={item.author}
                            onChange={e => updateItem(i, 'author', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
                            placeholder="Author name" />
                        </div>
                        <input type="text" value={item.meta}
                          onChange={e => updateItem(i, 'meta', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs"
                          placeholder="Meta (e.g. Member for 2 years)" />
                        <textarea rows={2} value={item.quote}
                          onChange={e => updateItem(i, 'quote', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs leading-relaxed resize-none"
                          placeholder="Testimonial text" />
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
                  <div className="text-center py-8 text-slate-400 text-xs">No testimonials yet. Click "Add" to create one.</div>
                )}
              </div>
            )}

            {activeTab === 'customer' && (
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-bold text-slate-700">Customer Reviews</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Reviews submitted by customers from the site</p>
                </div>
                {content.customerItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No customer reviews yet.</div>
                ) : (
                  content.customerItems.map((item: any, i: number) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">{item.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-slate-700">{item.author}</span>
                            {item.meta && <span className="text-[10px] text-slate-400">— {item.meta}</span>}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed italic">&ldquo;{item.quote}&rdquo;</p>
                          {item.createdAt && <p className="text-[9px] text-slate-300 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>}
                        </div>
                        <button type="button" onClick={() => deleteCustomerItem(i)} disabled={deletingIdx === i}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 flex-shrink-0">
                          {deletingIdx === i ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))
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
