"use client";

import { useState, useMemo } from "react";
import { Save, Loader2, Plus, Trash2, GripVertical, Eye, Copy, Star } from "lucide-react";
import { saveStoreSettings } from "../actions";

const DEFAULT_PRICING = {
  enabled: true,
  sectionTitle: "Fitness Plans",
  sectionSubtitle: "Choose the perfect plan for your fitness journey",
  plans: [
    {
      name: "Basic", price: "$29", period: "/month", description: "Perfect for beginners",
      popular: false, badge: "", ctaText: "Get Started", ctaVariant: "secondary",
      features: [
        { text: "Gym Access", enabled: true },
        { text: "Basic Equipment", enabled: true },
        { text: "Locker Room", enabled: true },
        { text: "Personal Trainer", enabled: false },
        { text: "Group Classes", enabled: false },
        { text: "Nutrition Plan", enabled: false },
      ],
    },
    {
      name: "Pro", price: "$59", period: "/month", description: "Best value for regulars",
      popular: true, badge: "Most Popular", ctaText: "Get Started", ctaVariant: "primary",
      features: [
        { text: "Gym Access 24/7", enabled: true },
        { text: "All Equipment", enabled: true },
        { text: "Locker Room + Towel", enabled: true },
        { text: "4 Personal Training Sessions", enabled: true },
        { text: "All Group Classes", enabled: true },
        { text: "Nutrition Plan", enabled: true },
      ],
    },
    {
      name: "Elite", price: "$99", period: "/month", description: "Ultimate fitness experience",
      popular: false, badge: "", ctaText: "Get Started", ctaVariant: "secondary",
      features: [
        { text: "Everything in Pro", enabled: true },
        { text: "Unlimited Personal Training", enabled: true },
        { text: "Custom Nutrition Plan", enabled: true },
        { text: "Recovery Services", enabled: true },
        { text: "Guest Passes", enabled: true },
        { text: "Priority Booking", enabled: true },
      ],
    },
  ],
};

function buildPricing(ip: any) {
  const p = ip.pricing || {};
  return {
    enabled: p.enabled !== false,
    sectionTitle: p.sectionTitle || DEFAULT_PRICING.sectionTitle,
    sectionSubtitle: p.sectionSubtitle || DEFAULT_PRICING.sectionSubtitle,
    plans: Array.isArray(p.plans) && p.plans.length > 0 ? p.plans : DEFAULT_PRICING.plans,
  };
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function IronPeakPricingManager({ slug, initialSettings }: { slug: string; initialSettings: any }) {
  const initial = useMemo(() => buildPricing(initialSettings), []);
  const [content, setContent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState<number | null>(null);

  function update(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  function updatePlan(index: number, field: string, val: any) {
    setContent((prev: any) => {
      const plans = [...prev.plans];
      plans[index] = { ...plans[index], [field]: val };
      return { ...prev, plans };
    });
  }

  function addFeature(planIdx: number) {
    setContent((prev: any) => {
      const plans = [...prev.plans];
      plans[planIdx] = {
        ...plans[planIdx],
        features: [...plans[planIdx].features, { text: "New feature", enabled: true }],
      };
      return { ...prev, plans };
    });
  }

  function updateFeature(planIdx: number, featIdx: number, field: string, val: any) {
    setContent((prev: any) => {
      const plans = [...prev.plans];
      const features = [...plans[planIdx].features];
      features[featIdx] = { ...features[featIdx], [field]: val };
      plans[planIdx] = { ...plans[planIdx], features };
      return { ...prev, plans };
    });
  }

  function removeFeature(planIdx: number, featIdx: number) {
    setContent((prev: any) => {
      const plans = [...prev.plans];
      plans[planIdx] = {
        ...plans[planIdx],
        features: plans[planIdx].features.filter((_: any, i: number) => i !== featIdx),
      };
      return { ...prev, plans };
    });
  }

  function addPlan() {
    setContent((prev: any) => ({
      ...prev,
      plans: [...prev.plans, {
        name: "New Plan", price: "$0", period: "/month", description: "",
        popular: false, badge: "", ctaText: "Get Started", ctaVariant: "secondary",
        features: [{ text: "Feature", enabled: true }],
      }],
    }));
    setEditingPlan(content.plans.length);
  }

  function duplicatePlan(index: number) {
    const plan = content.plans[index];
    const copy = JSON.parse(JSON.stringify(plan));
    copy.name += " (copy)";
    copy.popular = false;
    copy.badge = "";
    setContent((prev: any) => {
      const plans = [...prev.plans];
      plans.splice(index + 1, 0, copy);
      return { ...prev, plans };
    });
  }

  function removePlan(index: number) {
    setContent((prev: any) => ({
      ...prev,
      plans: prev.plans.filter((_: any, i: number) => i !== index),
    }));
    if (editingPlan === index) setEditingPlan(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await saveStoreSettings(slug, {
        ironpeakSettings: {
          ...initialSettings,
          pricing: content,
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
            <span className="text-orange-500">Pricing</span> Plans
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage subscription plans for your IronPeak template</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={addPlan}
            className="px-5 py-3 bg-white border-2 border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-500 hover:border-orange-400 hover:text-orange-500 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
          <button onClick={handleSave} disabled={saving}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ
          </button>
        </div>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
        <div>
          <div className="text-sm font-bold text-slate-700">Enable Pricing Section</div>
          <p className="text-xs text-slate-400 mt-0.5">Show/hide the entire pricing section on the page</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer"
            checked={content.enabled !== false}
            onChange={e => update('enabled', e.target.checked)} />
          <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
        </label>
      </div>

      {/* Section header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-2 gap-4">
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
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Live preview */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
          </div>
          <div className="p-6">
            <style>{`
              .ipp-preview-pricing { background: linear-gradient(135deg,#1a1a1a,#2d2d2d); border-radius: 16px; padding: 4rem 2rem; }
              .ipp-preview-container { max-width: 1200px; margin: 0 auto; }
              .ipp-preview-section-header { text-align: center; margin-bottom: 3rem; }
              .ipp-preview-section-header h2 { color: #fff; font-size: 2.5rem; font-weight: 800; display: inline-block; position: relative; margin: 0; }
              .ipp-preview-section-header h2::after { content: ""; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(135deg,#ff6b35,#f7931e); border-radius: 2px; }
              .ipp-preview-section-header p { color: rgba(255,255,255,.7); margin-top: 1rem; font-size: 1.1rem; }
              .ipp-preview-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 2.5rem; }
              .ipp-preview-card { background: rgba(255,255,255,.05); border: 2px solid rgba(255,255,255,.1); border-radius: 20px; padding: 2.5rem 1.5rem; text-align: center; position: relative; backdrop-filter: blur(10px); }
              .ipp-preview-card.featured { border-color: transparent; background: linear-gradient(135deg,#ff6b35,#f7931e); }
              .ipp-preview-badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #fff; color: #ff6b35; padding: .4rem 1.2rem; border-radius: 50px; font-weight: 700; font-size: .85rem; box-shadow: 0 5px 20px rgba(0,0,0,.2); }
              .ipp-preview-card h3 { font-size: 1.8rem; margin: 0 0 .5rem; color: #fff; }
              .ipp-preview-price { font-size: 3.5rem; font-weight: 800; margin: 1rem 0; background: linear-gradient(135deg,#ff6b35,#f7931e); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
              .ipp-preview-card.featured .ipp-preview-price { -webkit-text-fill-color: #fff; }
              .ipp-preview-price span { font-size: 1.3rem; font-weight: 400; }
              .ipp-preview-card p { color: rgba(255,255,255,.7); font-size: .95rem; margin: 0 0 1.5rem; }
              .ipp-preview-features { list-style: none; padding: 0; margin: 0 0 2rem; text-align: left; }
              .ipp-preview-features li { padding: .7rem 0; border-bottom: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; gap: .8rem; color: rgba(255,255,255,.75); font-size: .9rem; }
              .ipp-preview-features li::before { content: "✓"; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; background: linear-gradient(135deg,#ff6b35,#f7931e); border-radius: 50%; font-size: 12px; color: #fff; flex-shrink: 0; }
              .ipp-preview-features li.disabled { opacity: .4; }
              .ipp-preview-features li.disabled::before { content: "✗"; background: #555; }
              .ipp-preview-btn { display: inline-block; padding: .8rem 2rem; border-radius: 50px; font-weight: 600; font-size: 1rem; text-decoration: none; transition: .3s; }
              .ipp-preview-btn.primary { background: linear-gradient(135deg,#ff6b35,#f7931e); color: #fff; box-shadow: 0 10px 30px rgba(255,107,53,.4); }
              .ipp-preview-btn.secondary { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.5); }
              @media (max-width: 768px) { .ipp-preview-grid { grid-template-columns: 1fr; } }
            `}</style>
            <div className="ipp-preview-pricing">
              <div className="ipp-preview-container">
                <div className="ipp-preview-section-header">
                  <h2>{content.sectionTitle}</h2>
                  <p>{content.sectionSubtitle}</p>
                </div>
                {content.enabled !== false && (
                  <div className="ipp-preview-grid">
                    {content.plans.map((plan: any, idx: number) => (
                      <div key={idx} className={`ipp-preview-card ${plan.popular ? 'featured' : ''}`}>
                        {plan.badge && <div className="ipp-preview-badge">{plan.badge}</div>}
                        <h3>{plan.name}</h3>
                        <div className="ipp-preview-price">{plan.price}<span>{plan.period || '/month'}</span></div>
                        <p>{plan.description}</p>
                        <ul className="ipp-preview-features">
                          {plan.features.map((f: any, fi: number) => (
                            <li key={fi} className={f.enabled === false ? 'disabled' : ''}>{f.text}</li>
                          ))}
                        </ul>
                        <a href="#" className={`ipp-preview-btn ${plan.ctaVariant === 'primary' ? 'primary' : 'secondary'}`}>
                          {plan.ctaText || 'Get Started'}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
          {content.plans.map((plan: any, idx: number) => (
            <div key={idx} className={`bg-white rounded-2xl border overflow-hidden transition-all ${editingPlan === idx ? 'border-orange-400 ring-2 ring-orange-100' : 'border-slate-200'}`}>
              {/* Accordion header */}
              <button type="button" onClick={() => setEditingPlan(editingPlan === idx ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">
                  {plan.popular && <Star className="w-4 h-4 text-orange-500 fill-orange-500" />}
                  <span className="text-sm font-bold text-slate-700">{plan.name || 'Unnamed Plan'}</span>
                  <span className="text-xs font-mono text-slate-400">{plan.price}{plan.period}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${plan.popular ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                    {plan.popular ? 'Popular' : 'Standard'}
                  </span>
                </div>
              </button>

              {/* Accordion body */}
              {editingPlan === idx && (
                <div className="p-4 space-y-3 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Name</label>
                      <input type="text" value={plan.name}
                        onChange={e => updatePlan(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Price</label>
                      <input type="text" value={plan.price}
                        onChange={e => updatePlan(idx, 'price', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Period</label>
                      <input type="text" value={plan.period}
                        onChange={e => updatePlan(idx, 'period', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Badge</label>
                      <input type="text" value={plan.badge}
                        onChange={e => updatePlan(idx, 'badge', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                    <input type="text" value={plan.description}
                      onChange={e => updatePlan(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">CTA Text</label>
                    <input type="text" value={plan.ctaText}
                      onChange={e => updatePlan(idx, 'ctaText', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs font-bold" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="sr-only peer"
                        checked={plan.popular}
                        onChange={e => {
                          updatePlan(idx, 'popular', e.target.checked);
                          if (e.target.checked) updatePlan(idx, 'ctaVariant', 'primary');
                          else updatePlan(idx, 'ctaVariant', 'secondary');
                        }} />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 relative"></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Popular / Featured</span>
                    </label>
                    <button type="button" onClick={() => duplicatePlan(idx)}
                      className="ml-auto p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => removePlan(idx)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Features */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Features</span>
                      <button type="button" onClick={() => addFeature(idx)}
                        className="text-[10px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {plan.features.map((f: any, fi: number) => (
                        <div key={fi} className="flex items-center gap-1.5">
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input type="checkbox" className="sr-only peer"
                              checked={f.enabled !== false}
                              onChange={e => updateFeature(idx, fi, 'enabled', e.target.checked)} />
                            <div className={`w-7 h-4 rounded-full transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3 ${f.enabled !== false ? 'bg-orange-400' : 'bg-slate-300'}`}></div>
                          </label>
                          <input type="text" value={f.text}
                            onChange={e => updateFeature(idx, fi, 'text', e.target.value)}
                            className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-orange-400 text-[11px]" />
                          <button type="button" onClick={() => removeFeature(idx, fi)}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all flex-shrink-0">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {content.plans.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200">
              No plans yet. Click "Add Plan" to create one.
            </div>
          )}
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
