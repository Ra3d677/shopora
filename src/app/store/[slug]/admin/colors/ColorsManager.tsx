"use client";

import { useState, useTransition } from "react";
import { saveStoreSettings } from "../actions";
import { Palette, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

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
        setStatus({ type: 'success', message: 'Colors saved successfully!' });
        router.refresh();
      } else {
        setStatus({ type: 'error', message: 'Failed to save colors. Please try again.' });
      }
      setTimeout(() => setStatus(null), 3000);
    });
  };

  const colorFields = [
    { key: "primaryAccent", label: "Primary Accent Color", desc: "Used for highlights, borders, and active states." },
    { key: "backgroundColor", label: "Main Background", desc: "The background color of the entire store." },
    { key: "textColor", label: "Main Text Color", desc: "The default text color for descriptions and general text." },
    { key: "headerBackground", label: "Header Background", desc: "Background color of the top navigation bar." },
    { key: "headerText", label: "Header Text", desc: "Text and link color inside the navigation bar." },
    { key: "footerBackground", label: "Footer Background", desc: "Background color of the bottom footer section." },
    { key: "footerText", label: "Footer Text", desc: "Text color inside the footer." },
    { key: "buttonBackground", label: "Primary Button Background", desc: "Background color for 'Add to Cart' and other main buttons." },
    { key: "buttonText", label: "Primary Button Text", desc: "Text color for primary buttons." },
    { key: "priceColor", label: "Price Text Color", desc: "Color of the standard product price." },
    { key: "salePriceColor", label: "Sale Price Color", desc: "Color used to highlight discounted prices." }
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Palette className="w-8 h-8 text-blue-600" /> Advanced Color Controls
          </h1>
          <p className="text-slate-500 mt-1">Control every single color aspect for each specific template.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {status && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl border shadow-sm">
            <select 
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="bg-slate-50 border-none outline-none font-medium px-4 py-2 rounded-lg cursor-pointer"
            >
              {templates.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} Template</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isPending ? 'Saving...' : 'Save Colors'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colorFields.map((field: any) => (
          <div key={field.key} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900">{field.label}</h3>
                <p className="text-xs text-slate-500 mt-1 h-8">{field.desc}</p>
              </div>
              <div 
                className="w-10 h-10 rounded-lg border shadow-inner flex-shrink-0"
                style={{ backgroundColor: colors[field.key] }}
              ></div>
            </div>
            <div className="mt-auto flex gap-3">
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
