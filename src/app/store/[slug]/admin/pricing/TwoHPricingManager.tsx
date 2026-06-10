"use client";

import { useState, useMemo } from "react";
import { Save, Loader2, Plus, Trash2, Eye, Copy, Star } from "lucide-react";
import { saveStoreSettings } from "../actions";

const DEFAULT_PRICING = {
  enabled: true,
  plans: [
    {
      name: "Basic", price: "$99", period: "/Month",
      features: [
        { text: "Service 1", enabled: true },
        { text: "Service 2", enabled: true },
        { text: "Service 3", enabled: true },
        { text: "Service 4", enabled: true },
        { text: "Service 5", enabled: true },
      ],
    },
    {
      name: "Standard", price: "$199", period: "/Month",
      features: [
        { text: "Service 1", enabled: true },
        { text: "Service 2", enabled: true },
        { text: "Service 3", enabled: true },
        { text: "Service 4", enabled: true },
        { text: "Service 5", enabled: true },
      ],
    },
    {
      name: "Premium", price: "$299", period: "/Month",
      features: [
        { text: "Service 1", enabled: true },
        { text: "Service 2", enabled: true },
        { text: "Service 3", enabled: true },
        { text: "Service 4", enabled: true },
        { text: "Service 5", enabled: true },
      ],
    },
  ],
};

function buildPricing(ip: any) {
  const p = ip.pricing || {};
  return {
    enabled: p.enabled !== false,
    plans: Array.isArray(p.plans) && p.plans.length > 0 ? p.plans : DEFAULT_PRICING.plans,
  };
}

export default function TwoHPricingManager({ slug, initialSettings }: { slug: string; initialSettings: any }) {
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
        name: "New Plan", price: "$0", period: "/Month",
        features: [{ text: "Feature", enabled: true }],
      }],
    }));
    setEditingPlan(content.plans.length);
  }

  function duplicatePlan(index: number) {
    const plan = content.plans[index];
    const copy = JSON.parse(JSON.stringify(plan));
    copy.name += " (copy)";
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
        twohSettings: {
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
          <p className="text-xs text-slate-400 mt-1">Manage pricing plans for your 2H template</p>
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
              .thp-preview-pricing { background: #fff; border-radius: 16px; padding: 4rem 2rem; }
              .thp-preview-container { max-width: 1200px; margin: 0 auto; }
              .thp-preview-section-title { text-align: center; margin-bottom: 3rem; }
              .thp-preview-section-title h2 { color: #222; font-size: 2.25rem; font-weight: 700; text-transform: uppercase; margin: 0 0 0.5rem; font-family: 'Roboto Condensed',sans-serif; }
              .thp-preview-section-title h2 span { color: #f36f21; }
              .thp-preview-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 2rem; }
              .thp-preview-card { text-align: center; padding: 2.5rem 1.5rem; border: 2px solid #eee; border-radius: 8px; transition: all .3s; }
              .thp-preview-card:hover { border-color: #f36f21; box-shadow: 0 10px 30px rgba(0,0,0,.1); transform: translateY(-5px); }
              .thp-preview-card h3 { font-size: 1.5rem; font-weight: 700; color: #222; margin: 0 0 1rem; text-transform: uppercase; font-family: 'Roboto Condensed',sans-serif; }
              .thp-preview-price { font-size: 3rem; font-weight: 700; color: #f36f21; margin-bottom: 0.5rem; }
              .thp-preview-price span { font-size: 1.1rem; font-weight: 400; }
              .thp-preview-card ul { margin: 1.5rem 0; padding: 0; list-style: none; }
              .thp-preview-card ul li { padding: 0.7rem 0; border-bottom: 1px solid #eee; color: #555; font-size: 0.95rem; }
              .thp-preview-card ul li:last-child { border-bottom: none; }
              .thp-preview-btn { display: inline-block; padding: 0.8rem 2rem; background: #f36f21; color: #fff; border-radius: 4px; font-weight: 600; font-size: 1rem; text-decoration: none; transition: background .3s; }
              .thp-preview-btn:hover { background: #e55e10; }
              @media (max-width: 768px) { .thp-preview-grid { grid-template-columns: 1fr; } }
            `}</style>
            <div className="thp-preview-pricing">
              <div className="thp-preview-container">
                <div className="thp-preview-section-title">
                  <h2>OUR <span>PRICING</span></h2>
                </div>
                {content.enabled !== false && (
                  <div className="thp-preview-grid">
                    {content.plans.map((plan: any, idx: number) => (
                      <div key={idx} className="thp-preview-card">
                        <h3>{plan.name}</h3>
                        <div className="thp-preview-price">{plan.price}<span>{plan.period || '/Month'}</span></div>
                        <ul>
                          {plan.features.map((f: any, fi: number) => (
                            <li key={fi} style={{ opacity: f.enabled === false ? 0.4 : 1 }}>{f.text}</li>
                          ))}
                        </ul>
                        <a href="#" className="thp-preview-btn">View Details</a>
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
                  <span className="text-sm font-bold text-slate-700">{plan.name || 'Unnamed Plan'}</span>
                  <span className="text-xs font-mono text-slate-400">{plan.price}{plan.period}</span>
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
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Period</label>
                    <input type="text" value={plan.period}
                      onChange={e => updatePlan(idx, 'period', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-xs font-mono" />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={() => duplicatePlan(idx)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
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
