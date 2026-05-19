"use client";

import { useState, useTransition } from "react";
import { saveStoreSettings } from "../actions";
import { Palette, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language";

export default function ColorsManager({ slug, initialSettings }: { slug: string, initialSettings: any }) {
  const defaultColors = {
    primaryAccent: "#2563eb",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    headerBackground: "#ffffff",
    headerText: "#000000",
    footerBackground: "#f8fafc",
    footerText: "#64748b",
    buttonBackground: "#000000",
    buttonText: "#ffffff",
    priceColor: "#000000",
    salePriceColor: "#ef4444"
  };

  const templates = [
    { id: 'modern', name: 'Modern Commerce' },
    { id: 'zenith', name: 'Zenith Luxury' },
    { id: 'signature', name: 'Signature Brand' }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  
  // Initialize colors object.
  const parsedColors = initialSettings?.colors || {};
  const [allColors, setAllColors] = useState<any>(
    parsedColors.minimal ? parsedColors : { minimal: { ...defaultColors, ...parsedColors } }
  );

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const router = useRouter();

  const { t, language } = useLanguageStore();
  const isRTL = language === 'ar';

  // Get current template's colors
  const colors = allColors[selectedTemplate] || defaultColors;

  const handleColorChange = (key: string, value: string) => {
    setAllColors((prev: any) => ({
      ...prev,
      [selectedTemplate]: {
        ...(prev[selectedTemplate] || defaultColors),
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await saveStoreSettings(slug, { colors: allColors });
      if (result?.success) {
        setStatus({ type: 'success', message: isRTL ? 'تم حفظ الألوان بنجاح!' : 'Colors saved successfully!' });
        router.refresh();
      } else {
        setStatus({ type: 'error', message: isRTL ? 'فشل حفظ الألوان. يرجى المحاولة مرة أخرى.' : 'Failed to save colors. Please try again.' });
      }
      setTimeout(() => setStatus(null), 3000);
    });
  };

  const colorFields = [
    { key: "primaryAccent", label: isRTL ? "اللون المميز الأساسي" : "Primary Accent Color", desc: isRTL ? "يستخدم للتمييز، والحدود، والحالات النشطة." : "Used for highlights, borders, and active states." },
    { key: "backgroundColor", label: isRTL ? "الخلفية الرئيسية" : "Main Background", desc: isRTL ? "لون خلفية المتجر بالكامل." : "The background color of the entire store." },
    { key: "textColor", label: isRTL ? "لون النص الرئيسي" : "Main Text Color", desc: isRTL ? "لون النص الافتراضي للأوصاف والنصوص العامة." : "The default text color for descriptions and general text." },
    { key: "headerBackground", label: isRTL ? "خلفية الترويسة" : "Header Background", desc: isRTL ? "لون خلفية شريط التنقل العلوي." : "Background color of the top navigation bar." },
    { key: "headerText", label: isRTL ? "نص الترويسة" : "Header Text", desc: isRTL ? "لون النص والروابط داخل شريط التنقل." : "Text and link color inside the navigation bar." },
    { key: "footerBackground", label: isRTL ? "خلفية التذييل" : "Footer Background", desc: isRTL ? "لون خلفية قسم التذييل السفلي." : "Background color of the bottom footer section." },
    { key: "footerText", label: isRTL ? "نص التذييل" : "Footer Text", desc: isRTL ? "لون النص داخل التذييل." : "Text color inside the footer." },
    { key: "buttonBackground", label: isRTL ? "خلفية الزر الأساسي" : "Primary Button Background", desc: isRTL ? "لون خلفية 'أضف إلى السلة' والأزرار الرئيسية الأخرى." : "Background color for 'Add to Cart' and other main buttons." },
    { key: "buttonText", label: isRTL ? "نص الزر الأساسي" : "Primary Button Text", desc: isRTL ? "لون النص للأزرار الأساسية." : "Text color for primary buttons." },
    { key: "priceColor", label: isRTL ? "لون نص السعر" : "Price Text Color", desc: isRTL ? "لون سعر المنتج العادي." : "Color of the standard product price." },
    { key: "salePriceColor", label: isRTL ? "لون سعر التخفيض" : "Sale Price Color", desc: isRTL ? "اللون المستخدم لتمييز الأسعار المخفضة." : "Color used to highlight discounted prices." }
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className={`text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Palette className="w-8 h-8 text-blue-600" /> {isRTL ? 'عناصر التحكم المتقدمة في الألوان' : 'Advanced Color Controls'}
          </h1>
          <p className="text-slate-500 mt-1">{isRTL ? 'تحكم في كل جانب من جوانب الألوان لكل قالب محدد.' : 'Control every single color aspect for each specific template.'}</p>
        </div>
        
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {status && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl border shadow-sm">
            <select 
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className={`bg-slate-50 border-none outline-none font-medium px-4 py-2 rounded-lg cursor-pointer ${isRTL ? 'pr-8 pl-4' : ''}`}
            >
              {templates.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} {isRTL ? 'قالب' : 'Template'}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleSave}
            disabled={isPending}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isPending ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ الألوان' : 'Save Colors')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colorFields.map((field: any) => (
          <div key={field.key} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className={`flex justify-between items-start mb-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div>
                <h3 className="font-bold text-slate-900">{field.label}</h3>
                <p className="text-xs text-slate-500 mt-1 h-8">{field.desc}</p>
              </div>
              <div 
                className="w-10 h-10 rounded-lg border shadow-inner flex-shrink-0"
                style={{ backgroundColor: colors[field.key] }}
              ></div>
            </div>
            <div className={`mt-auto flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <input 
                type="color" 
                value={colors[field.key] || '#000000'} 
                onChange={(e) => handleColorChange(field.key, e.target.value)}
                className="h-10 w-16 p-1 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
              />
              <input 
                type="text" 
                value={colors[field.key] || '#000000'}
                onChange={(e) => handleColorChange(field.key, e.target.value)}
                className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
