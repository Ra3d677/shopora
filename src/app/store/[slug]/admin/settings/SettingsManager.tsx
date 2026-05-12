"use client";

import { useState, useTransition } from "react";
import { saveStoreSettings } from "../actions";
import { Settings, Loader2, Save, X, Trash2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { StoreSettings } from "@/lib/types";
import MediaPicker from "../media/MediaPicker";

export default function SettingsManager({ 
  initialSettings, 
  activeTemplate,
  slug
}: { 
  initialSettings: StoreSettings;
  activeTemplate: string;
  slug: string;
}) {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings);
    setIsDirty(true);
  };
  const [activeTab, setActiveTab] = useState("general");
  const router = useRouter();

  const colorSystem = settings.colorSystem || {
    backgrounds: { home: '#ffffff', shop: '#f8fafc', categories: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
    brand: { primary: '#3b82f6' },
    footer: { background: '#0f172a', text: '#f8fafc' },
    product: { price: '#0f172a', salePrice: '#ef4444' }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage("");
    
    startTransition(async () => {
      await saveStoreSettings(slug, settings);
      setSaveMessage("Protocol Execution Successful");
      setIsDirty(false);
      router.refresh();
      
      setTimeout(() => setSaveMessage(""), 3000);
    });
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "header", label: "Header & Navigation" },
    { id: "theme", label: "Theme & Colors" },
    { id: "signature", label: "Signature Template" },
    { id: "layout", label: "Layout & Dividers" },
    { id: "tracking", label: "Tracking & Pixels" },
    { id: "business", label: "Business & Payments" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Store Settings
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Configure your store's general information and visual identity.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <form onSubmit={handleSave}>
          <div className="space-y-8">
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Identity Settings */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900">Brand Identity</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Store Name</label>
                      <input 
                        type="text" 
                        value={settings.storeName} 
                        onChange={e => updateSettings({...settings, storeName: e.target.value})} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold" 
                        placeholder="Enter Store Name"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Store Logo</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <MediaPicker 
                          slug={slug}
                          value={settings.logoUrl || ''} 
                          onChange={url => updateSettings({...settings, logoUrl: url})} 
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center px-1">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logo Height</h4>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{settings.headerSettings?.logoHeight || 40}PX</span>
                        </div>
                        <input 
                          type="range" 
                          min="20" 
                          max="120" 
                          step="4"
                          value={settings.headerSettings?.logoHeight || 40} 
                          onChange={(e) => updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), logoHeight: Number(e.target.value)}})} 
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      <div className="w-[1px] bg-slate-200 hidden md:block"></div>

                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Transparent Logo Mode</h4>
                          <p className="text-[9px] text-slate-500 mt-1 font-medium">Blends logo background with the header.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.headerSettings?.logoBlendMode === 'multiply'}
                            onChange={(e) => updateSettings({
                              ...settings, 
                              headerSettings: {
                                ...(settings.headerSettings || {}), 
                                logoBlendMode: e.target.checked ? 'multiply' : 'normal'
                              }
                            })}
                          />
                          <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900">Contact Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Support Email</label>
                      <input 
                        type="email" 
                        value={settings.contactInfo?.email || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), email: e.target.value}})} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold" 
                        placeholder="support@domain.com"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.phone || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), phone: e.target.value}})} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold" 
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.whatsapp || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), whatsapp: e.target.value}})} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold border-l-4 border-l-green-500" 
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'header' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900">Header Layout</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { id: 'default', name: 'Default', desc: 'Original template layout structure.' },
                      { id: 'standard', name: 'Standard', desc: 'Logo Left, Center Nav, Right Actions.' },
                      { id: 'centered', name: 'Centered', desc: 'Links Left, Logo Center, Right Actions.' },
                      { id: 'minimal', name: 'Minimal', desc: 'Logo Left, Discrete Hamburger Right.' },
                      { id: 'luxury', name: 'Luxury', desc: 'Vertical Stacked Identity & Navigation.' },
                      { id: 'hamburger', name: 'Mobile First', desc: 'Hamburger Left, Logo Center, Right Icons.' }
                    ].map((layout) => (
                      <label 
                        key={layout.id} 
                        className={`group relative cursor-pointer p-6 rounded-2xl border transition-all ${
                          (settings.headerSettings?.layout || 'default') === layout.id 
                            ? 'border-blue-600 bg-blue-50 shadow-sm' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                           <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                             (settings.headerSettings?.layout || 'default') === layout.id 
                               ? 'bg-blue-600 border-blue-500 text-white' 
                               : 'bg-slate-50 border-slate-200 text-slate-300'
                           }`}>
                             <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                           </div>
                           <input 
                             type="radio" 
                             name="headerLayout"
                             value={layout.id}
                             checked={(settings.headerSettings?.layout || 'default') === layout.id}
                             onChange={(e) => updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), layout: e.target.value as any}})}
                             className="sr-only"
                           />
                        </div>
                        <p className={`font-bold text-sm mb-1 transition-colors ${(settings.headerSettings?.layout || 'default') === layout.id ? 'text-blue-600' : 'text-slate-900'}`}>{layout.name}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{layout.desc}</p>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                   <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      <h2 className="text-xl font-black text-slate-900">Navigation Links</h2>
                    </div>
                    <button 
                      type="button"
                      onClick={() => updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: [...(settings.headerSettings?.links || [{id: '1', label: 'Home', url: `/store/${slug}`}, {id: '2', label: 'Shop', url: `/store/${slug}/categories`}]), {id: Math.random().toString(36).substr(2, 9), label: 'New Link', url: '#'}]}})}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      + Add Link
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {((settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                      {id: '1', label: 'Home', url: `/store/${slug}`},
                      {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                    ]).map((link: any, idx: number) => (
                      <div key={link.id} className="flex gap-4 items-center p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-300 transition-all">
                        <div className="flex-1 space-y-3">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</label>
                           <input 
                             type="text"
                             value={link.label}
                             onChange={(e) => {
                               const currentLinks = (settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                                  {id: '1', label: 'Home', url: `/store/${slug}`},
                                  {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                               ];
                               const newLinks = [...currentLinks];
                               newLinks[idx].label = e.target.value;
                               updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: newLinks}});
                             }}
                             className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold text-sm"
                           />
                        </div>
                        <div className="flex-[2] space-y-3">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL / Path</label>
                           <input 
                             type="text"
                             value={link.url}
                             onChange={(e) => {
                               const currentLinks = (settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                                  {id: '1', label: 'Home', url: `/store/${slug}`},
                                  {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                               ];
                               const newLinks = [...currentLinks];
                               newLinks[idx].url = e.target.value;
                               updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: newLinks}});
                             }}
                             className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold text-sm"
                           />
                        </div>
                        <div className="pt-7">
                          <button 
                            type="button"
                            onClick={() => {
                               const currentLinks = (settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                                  {id: '1', label: 'Home', url: `/store/${slug}`},
                                  {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                               ];
                               const newLinks = [...currentLinks];
                               newLinks.splice(idx, 1);
                               updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: newLinks}});
                            }}
                            className="w-10 h-10 bg-red-50 text-red-500 border border-red-100 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900">Color System</h2>
                  </div>

                  <div className="space-y-8">
                     {[
                       { title: 'Backgrounds', key: 'backgrounds', items: [
                         { key: 'home', label: 'Home Page' },
                         { key: 'shop', label: 'Shop Page' },
                         { key: 'categories', label: 'Categories Page' }
                       ]},
                       { title: 'Text Colors', key: 'text', items: [
                         { key: 'primary', label: 'Primary Text' },
                         { key: 'secondary', label: 'Secondary Text' }
                       ]},
                       { title: 'Brand Colors', key: 'brand', items: [
                         { key: 'primary', label: 'Main Brand Color' }
                       ]},
                       { title: 'Footer Colors', key: 'footer', items: [
                         { key: 'background', label: 'Background' },
                         { key: 'text', label: 'Text Color' }
                       ]},
                       { title: 'Product UI', key: 'product', items: [
                         { key: 'price', label: 'Price Tag' },
                         { key: 'salePrice', label: 'Sale Price' }
                       ]}
                     ].map((section) => (
                       <div key={section.key} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6 pb-2 border-b border-slate-200">{section.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((item) => (
                              <div key={item.key} className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{item.label}</label>
                                <div className="flex gap-3 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm group">
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-inner">
                                     <input 
                                        type="color" 
                                        value={(colorSystem as any)[section.key][item.key] || '#000000'} 
                                        onChange={e => updateSettings({
                                          ...settings, 
                                          colorSystem: { 
                                            ...colorSystem, 
                                            [section.key]: { ...(colorSystem as any)[section.key], [item.key]: e.target.value } 
                                          }
                                        })} 
                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" 
                                      />
                                  </div>
                                  <input 
                                    type="text" 
                                    value={(colorSystem as any)[section.key][item.key] || '#000000'} 
                                    onChange={e => setSettings({
                                      ...settings, 
                                      colorSystem: { 
                                        ...colorSystem, 
                                        [section.key]: { ...(colorSystem as any)[section.key], [item.key]: e.target.value } 
                                      }
                                    })} 
                                    className="flex-1 bg-transparent text-slate-900 focus:outline-none font-mono text-sm uppercase" 
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'layout' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900">Page Dividers</h2>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-3">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Divider Color</label>
                       <div className="flex gap-3 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm max-w-xs">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-inner">
                             <input 
                                type="color" 
                                value={settings.dividerColor || '#ffffff'} 
                                onChange={e => setSettings({...settings, dividerColor: e.target.value})} 
                                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" 
                              />
                          </div>
                          <input 
                            type="text" 
                            value={settings.dividerColor || '#ffffff'} 
                            onChange={e => setSettings({...settings, dividerColor: e.target.value})} 
                            className="flex-1 bg-transparent text-slate-900 focus:outline-none font-mono text-sm uppercase" 
                          />
                        </div>
                    </div>
                    <div className="w-[1px] h-12 bg-slate-200 hidden md:block"></div>
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Style</p>
                       <p className="text-xl font-black text-blue-600 uppercase">{settings.dividerStyle || 'None'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { id: 'none', name: 'None', desc: 'Clean space between sections.' },
                      { id: 'line', name: 'Line', desc: 'Single pixel horizontal line.' },
                      { id: 'minimal_dots', name: 'Dots', desc: 'Three floating geometric points.' },
                      { id: 'wave', name: 'Wave', desc: 'Organic sinusoidal liquid transition.' },
                      { id: 'curve', name: 'Curve', desc: 'Gentle downward spherical boundary.' },
                      { id: 'triangle', name: 'Triangle', desc: 'Sharp geometric pointing node.' },
                      { id: 'zigzag', name: 'Zigzag', desc: 'Aggressive serrated sawtooth edge.' },
                      { id: 'geometric', name: 'Geometric', desc: 'Layered polygonal depth elements.' },
                      { id: 'slash', name: 'Slash', desc: 'Dynamic angular spatial separation.' },
                      { id: 'mountains', name: 'Mountains', desc: 'Symmetric layered peak structures.' },
                      { id: 'fan', name: 'Fan', desc: 'Soft curved volumetric fan expansion.' },
                      { id: 'steps', name: 'Steps', desc: 'Orthogonal stepped levels.' },
                      { id: 'drops', name: 'Drops', desc: 'Floating circular liquid elements.' },
                      { id: 'arabic_pattern', name: 'Pattern', desc: 'Ornate geometric star matrix.' },
                    ].map((divider) => (
                      <label 
                        key={divider.id} 
                        className={`group relative cursor-pointer p-6 rounded-2xl border transition-all ${
                          (settings.dividerStyle || 'none') === divider.id 
                            ? 'border-blue-600 bg-blue-50 shadow-sm' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                           <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                             (settings.dividerStyle || 'none') === divider.id 
                               ? 'bg-blue-600 border-blue-500 text-white' 
                               : 'bg-slate-50 border-slate-200 text-slate-300'
                           }`}>
                             {settings.dividerStyle === divider.id ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                           </div>
                           <input 
                             type="radio" 
                             name="dividerStyle"
                             value={divider.id}
                             checked={(settings.dividerStyle || 'none') === divider.id}
                             onChange={(e) => setSettings({...settings, dividerStyle: e.target.value})}
                             className="sr-only"
                           />
                        </div>
                        <p className={`font-bold text-sm mb-1 transition-colors ${(settings.dividerStyle || 'none') === divider.id ? 'text-blue-600' : 'text-slate-900'}`}>{divider.name}</p>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{divider.desc}</p>
                        
                        <div className="h-16 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                           <div className="w-full scale-[0.35] opacity-60">
                              <SectionDividerPreview style={divider.id} color={settings.dividerColor} />
                           </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900">Tracking Pixels</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 'facebookPixelId', name: 'Facebook Pixel', color: 'bg-blue-600', placeholder: '1234567890' },
                      { id: 'tiktokPixelId', name: 'TikTok Pixel', color: 'bg-slate-900', placeholder: 'C1234567890' },
                      { id: 'snapchatPixelId', name: 'Snapchat Pixel', color: 'bg-yellow-400', placeholder: '123456-7890' },
                      { id: 'googleAnalyticsId', name: 'Google Analytics 4', color: 'bg-orange-500', placeholder: 'G-XXXXXXXX' }
                    ].map((pixel) => (
                      <div key={pixel.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${pixel.color}`}>
                               <Settings size={18} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">{pixel.name}</h3>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID / Key</label>
                            <input 
                              type="text"
                              value={(settings as any)[pixel.id] || ''}
                              onChange={e => updateSettings({...settings, [pixel.id]: e.target.value})}
                              placeholder={pixel.placeholder}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                            />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'signature' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                   <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900">Template Features</h2>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-8">
                     <div className="flex items-center justify-between mb-6">
                        <div>
                           <h3 className="text-sm font-bold text-slate-900">Live Sales Notifications</h3>
                           <p className="text-xs text-slate-500 mt-1">Show real-time purchase popups to visitors.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={settings.signatureSettings?.liveSales?.enabled}
                              onChange={e => updateSettings({
                                ...settings, 
                                signatureSettings: {
                                  ...(settings.signatureSettings || {}), 
                                  liveSales: {
                                    ...(settings.signatureSettings?.liveSales || {enabled: false, interval: 15000}), 
                                    enabled: e.target.checked
                                  }
                                }
                              })}
                           />
                           <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                        </label>
                     </div>
                     {settings.signatureSettings?.liveSales?.enabled && (
                       <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-6">
                          <div className="flex-1 space-y-2">
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interval (Seconds)</label>
                             <input 
                                type="number"
                                value={(settings.signatureSettings?.liveSales?.interval || 15000) / 1000}
                                onChange={e => updateSettings({
                                  ...settings, 
                                  signatureSettings: {
                                    ...(settings.signatureSettings || {}), 
                                    liveSales: {
                                      ...(settings.signatureSettings?.liveSales || {enabled: false, interval: 15000}), 
                                      interval: Number(e.target.value) * 1000
                                    }
                                  }
                                })}
                                className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold text-sm"
                             />
                          </div>
                       </div>
                     )}
                  </div>

                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold text-slate-900">Customer Reviews</h3>
                        <button 
                          type="button"
                          onClick={() => updateSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonials: [...(settings.signatureSettings?.testimonials || []), {name: '', role: '', content: ''}]}})}
                          className="px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all"
                        >
                          + Add Review
                        </button>
                     </div>

                     <div className="space-y-4">
                        {(settings.signatureSettings?.testimonials || []).map((t: any, idx: number) => (
                           <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                                    <input 
                                       type="text" 
                                       value={t.name}
                                       placeholder="Customer Name"
                                       onChange={e => {
                                          const newList = [...(settings.signatureSettings?.testimonials || [])];
                                          newList[idx].name = e.target.value;
                                          updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                       }}
                                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold text-sm"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role / Location</label>
                                    <input 
                                       type="text" 
                                       value={t.role}
                                       placeholder="Verified Buyer, New York, etc."
                                       onChange={e => {
                                          const newList = [...(settings.signatureSettings?.testimonials || [])];
                                          newList[idx].role = e.target.value;
                                          updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                       }}
                                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold text-sm"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Review Content</label>
                                 <textarea 
                                    value={t.content}
                                    placeholder="Write the review here..."
                                    rows={2}
                                    onChange={e => {
                                       const newList = [...(settings.signatureSettings?.testimonials || [])];
                                       newList[idx].content = e.target.value;
                                       updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm"
                                 />
                              </div>
                              <button 
                                 type="button"
                                 onClick={() => {
                                    const newList = [...(settings.signatureSettings?.testimonials || [])];
                                    newList.splice(idx, 1);
                                    updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                 }}
                                 className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                              >
                                 Delete Review
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                   <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900">Business Settings</h2>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold text-slate-900">Shipping Rates</h3>
                        <button 
                          type="button"
                          onClick={() => updateSettings({...settings, businessSettings: {...(settings.businessSettings || {}), shippingRates: [...(settings.businessSettings?.shippingRates || []), {zone: '', rate: 0}]}})}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all"
                        >
                          + Add Zone
                        </button>
                     </div>

                     <div className="space-y-3">
                        {(settings.businessSettings?.shippingRates || []).map((r: any, idx: number) => (
                           <div key={idx} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 group">
                              <div className="flex-1 space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zone Name</label>
                                 <input 
                                    type="text" 
                                    value={r.zone}
                                    placeholder="e.g. Worldwide"
                                    onChange={e => {
                                       const newList = [...(settings.businessSettings?.shippingRates || [])];
                                       newList[idx].zone = e.target.value;
                                       updateSettings({...settings, businessSettings: {...settings.businessSettings, shippingRates: newList}});
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold text-sm"
                                 />
                              </div>
                              <div className="w-28 space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rate ($)</label>
                                 <input 
                                    type="number" 
                                    value={r.rate}
                                    onChange={e => {
                                       const newList = [...(settings.businessSettings?.shippingRates || [])];
                                       newList[idx].rate = Number(e.target.value);
                                       updateSettings({...settings, businessSettings: {...settings.businessSettings, shippingRates: newList}});
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold text-sm"
                                 />
                              </div>
                              <div className="pt-6">
                                 <button 
                                    type="button"
                                    onClick={() => {
                                       const newList = [...(settings.businessSettings?.shippingRates || [])];
                                       newList.splice(idx, 1);
                                       updateSettings({...settings, businessSettings: {...settings.businessSettings, shippingRates: newList}});
                                    }}
                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                 >
                                    <X size={18} />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6 transition-all duration-500 ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
              <div className="pl-4">
                {saveMessage ? (
                  <div className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-500">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     <span className="text-xs font-bold text-slate-900">Settings Saved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-500">
                     <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                     <span className="text-xs font-bold">Unsaved changes</span>
                  </div>
                )}
              </div>
              <button 
                type="submit"
                disabled={isPending}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionDividerPreview({ style, color }: { style: string, color?: string }) {
  const previewColor = color || "#3b82f6";
  switch (style) {
    case "line":
      return (
        <div className="w-full h-[1px] opacity-20" style={{ backgroundColor: previewColor }} />
      );
    case "wave":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      );
    case "curve":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
          <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" fill="currentColor"></path>
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
          <path d="M1200 0L0 0 598.97 114.72 1200 0z" fill="currentColor"></path>
        </svg>
      );
    case "zigzag":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
          <path d="M0 0L60 120L120 0L180 120L240 0L300 120L360 0L420 120L480 0L540 120L600 0L660 120L720 0L780 120L840 0L900 120L960 0L1020 120L1080 0L1140 120L1200 0V120H0V0Z" fill="currentColor"></path>
        </svg>
      );
    case "geometric":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
           <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,0V120H0Z" opacity=".25" fill="currentColor"></path>
           <path d="M0,0V15.81c13,36.92,27.64,56.86,47.69,72.05,37.52,28.48,96.2,33.41,143,12,49.23-22.51,74.17-70.15,124.09-80.71,59.15-12.52,114.42,48,174.51,59.06,70.77,13,147.43-16.72,218.4-38.56,80.35-24.71,164.67-42.33,249.86-27.33,36,6.33,73.7,19.33,104.45,29.34C1127,25,1193,0,1200,0V120H0Z" opacity=".5" fill="currentColor"></path>
           <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      );
    case "arabic_pattern":
      return (
        <div className="flex gap-1" style={{ color: previewColor }}>
           {[...Array(5)].map((_, i) => (
             <svg key={i} className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
             </svg>
           ))}
        </div>
      );
    case "minimal_dots":
      return (
        <div className="flex gap-4" style={{ color: previewColor }}>
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-4 h-4 rounded-full bg-current" />
           ))}
        </div>
      );
    case "slash":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" fill="currentColor"></path>
        </svg>
      );
    case "fan":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
          <path d="M600 120C268.63 120 0 72.75 0 14.46V0H1200V14.46C1200 72.75 931.37 120 600 120Z" fill="currentColor"></path>
        </svg>
      );
    case "drops":
      return (
        <div className="flex gap-4" style={{ color: previewColor }}>
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-3 h-3 rounded-full bg-current opacity-20" />
           ))}
        </div>
      );
    case "mountains":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
          <path d="M1200 0L0 0 292.15 114.21 600 0 907.85 114.21 1200 0z" fill="currentColor" opacity=".3"></path>
          <path d="M1200 0L0 0 598.97 114.72 1200 0z" fill="currentColor"></path>
        </svg>
      );
    case "steps":
      return (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" style={{ color: previewColor }}>
           <path d="M0 0H200V40H400V80H600V120H1200V0H0Z" fill="currentColor" opacity=".1" />
           <path d="M0 0H100V20H200V40H300V60H400V80H500V100H600V120H1200V0H0Z" fill="currentColor" opacity=".2" />
        </svg>
      );
    default:
      return <div className="h-4 w-24 bg-slate-200 rounded" />;
  }
}
