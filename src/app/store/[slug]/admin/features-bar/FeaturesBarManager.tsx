"use client";

import { useState } from "react";
import { 
  Save, Loader2, Rocket, Undo2, Gift, Shield, 
  Truck, Headphones, Clock, Tag, Percent, Sparkles 
} from "lucide-react";
import { saveStoreSettings } from "../actions";

const AVAILABLE_ICONS = [
  { name: 'Rocket', Icon: Rocket, label: 'صاروخ' },
  { name: 'Undo2', Icon: Undo2, label: 'إرجاع' },
  { name: 'Gift', Icon: Gift, label: 'هدية' },
  { name: 'Shield', Icon: Shield, label: 'حماية' },
  { name: 'Truck', Icon: Truck, label: 'شاحنة' },
  { name: 'Headphones', Icon: Headphones, label: 'دعم فني' },
  { name: 'Clock', Icon: Clock, label: 'وقت' },
  { name: 'Tag', Icon: Tag, label: 'بطاقة' },
  { name: 'Percent', Icon: Percent, label: 'نسبة' },
  { name: 'Sparkles', Icon: Sparkles, label: 'تميز' },
];

export default function FeaturesBarManager({ slug, initialContent }: { slug: string; initialContent: any }) {
  const [content, setContent] = useState(() => {
    const base = initialContent || {};
    return {
      showSection: base.showSection !== undefined ? base.showSection : true,
      items: base.items || [
        { id: "1", iconName: "Rocket", title: "Free Shipping", desc: "orders $50 or more", visible: true },
        { id: "2", iconName: "Undo2", title: "Free Returns", desc: "within 30 days", visible: true },
        { id: "3", iconName: "Gift", title: "Get 20% Off 1 Item", desc: "when you sign up", visible: true },
        { id: "4", iconName: "Shield", title: "We Support", desc: "24/7 amazing services", visible: true }
      ]
    };
  });

  const [saving, setSaving] = useState(false);

  function updateField(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  function updateFeatureItem(index: number, field: string, val: any) {
    setContent((prev: any) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: val };
      return {
        ...prev,
        items
      };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await saveStoreSettings(slug, { twoMFeatures: content });
      if (res?.success === false) {
        alert(res.error);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-row-reverse">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">إعدادات شريط الميزات (Features Bar)</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ التغييرات
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
        
        {/* Toggle Section Display */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-700">تفعيل شريط الميزات على الصفحة الرئيسية</h3>
            <p className="text-[10px] text-slate-400 mt-1">تحديد ما إذا كان سيظهر شريط الميزات (مثل الشحن المجاني، الدعم الفني، إلخ) في أسفل الصفحة الرئيسية للتمبلت.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={content.showSection !== false}
              onChange={(e) => updateField('showSection', e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>

        {content.showSection !== false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.items?.map((item: any, idx: number) => {
              return (
                <div key={item.id} className="bg-slate-50/50 border border-slate-200 rounded-3xl p-6 space-y-4">
                  {/* Item Header with Visibility Toggle */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h4 className="text-xs font-bold text-blue-600">الميزة رقم {idx + 1}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400">تفعيل الميزة</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={item.visible !== false}
                          onChange={(e) => updateFeatureItem(idx, 'visible', e.target.checked)}
                        />
                        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-[2.5px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                      </label>
                    </div>
                  </div>

                  {/* Inputs, disabled if item is hidden */}
                  <div className={`space-y-4 transition-opacity ${item.visible !== false ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 block">عنوان الميزة</label>
                      <input 
                        type="text" 
                        value={item.title || ''}
                        onChange={e => updateFeatureItem(idx, 'title', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
                        placeholder="العنوان"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 block">الوصف / العنوان الفرعي</label>
                      <input 
                        type="text" 
                        value={item.desc || ''}
                        onChange={e => updateFeatureItem(idx, 'desc', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        placeholder="الوصف"
                      />
                    </div>

                    {/* Icon Picker */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 block">اختر أيقونة</label>
                      <div className="grid grid-cols-5 gap-2">
                        {AVAILABLE_ICONS.map(iconOpt => {
                          const IconComponent = iconOpt.Icon;
                          const isSelected = item.iconName === iconOpt.name;
                          return (
                            <button
                              key={iconOpt.name}
                              type="button"
                              onClick={() => updateFeatureItem(idx, 'iconName', iconOpt.name)}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                                isSelected 
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                              }`}
                              title={iconOpt.label}
                            >
                              <IconComponent className="w-5 h-5 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Save button at bottom */}
        <div className="pt-4 border-t border-slate-200">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
