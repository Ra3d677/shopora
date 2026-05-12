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
      setSaveMessage("Settings saved successfully!");
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
    <div className="p-10 space-y-12 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase">
            Control <span className="text-indigo-400">Center</span>
          </h1>
          <p className="text-slate-500 mt-3 font-medium tracking-widest text-[10px] uppercase">Architect your store's global DNA and performance parameters.</p>
        </div>
        
        <div className="flex bg-white/[0.02] backdrop-blur-3xl p-2 rounded-[2rem] border border-white/[0.05] shadow-2xl overflow-x-auto max-w-full no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <form onSubmit={handleSave}>
          <div className="space-y-12">
            {activeTab === 'general' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Identity Settings */}
                <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 border border-white/[0.05] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] -z-10 group-hover:bg-indigo-500/10 transition-all"></div>
                  
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-1.5 h-10 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Brand Identity</h2>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Core store signature and visual markers.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Store Designation</label>
                      <input 
                        type="text" 
                        value={settings.storeName} 
                        onChange={e => setSettings({...settings, storeName: e.target.value})} 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-black uppercase tracking-tighter text-xl italic" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Logotype (Logo)</label>
                      <div className="bg-white/[0.01] border border-white/[0.05] rounded-[2rem] p-3">
                        <MediaPicker 
                          slug={slug}
                          value={settings.logoUrl || ''} 
                          onChange={url => setSettings({...settings, logoUrl: url})} 
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-black/20 p-8 rounded-[2.5rem] border border-white/[0.03] flex flex-col md:flex-row gap-12">
                      <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-center mb-2 px-1">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logo Vertical Scale</h4>
                          <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">{settings.headerSettings?.logoHeight || 40}PX</span>
                        </div>
                        <input 
                          type="range" 
                          min="20" 
                          max="120" 
                          step="4"
                          value={settings.headerSettings?.logoHeight || 40} 
                          onChange={(e) => setSettings({...settings, headerSettings: {...(settings.headerSettings || {}), logoHeight: Number(e.target.value)}})} 
                          className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>

                      <div className="w-[1px] bg-white/5 hidden md:block"></div>

                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Background Synthesis</h4>
                          <p className="text-[9px] text-slate-500 mt-2 font-medium italic">Remove white artifacts for seamless header integration.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.headerSettings?.logoBlendMode === 'multiply'}
                            onChange={(e) => setSettings({
                              ...settings, 
                              headerSettings: {
                                ...(settings.headerSettings || {}), 
                                logoBlendMode: e.target.checked ? 'multiply' : 'normal'
                              }
                            })}
                          />
                          <div className="w-14 h-7 bg-white/5 border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-500 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-black peer-checked:after:scale-110"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 border border-white/[0.05] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] -z-10 group-hover:bg-indigo-500/10 transition-all"></div>
                   
                   <div className="flex items-center gap-4 mb-12">
                    <div className="w-1.5 h-10 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Communication Uplink</h2>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Support channels and business reachability.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Support Terminal (Email)</label>
                      <input 
                        type="email" 
                        value={settings.contactInfo?.email || ''} 
                        onChange={e => setSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), email: e.target.value}})} 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" 
                        placeholder="support@domain.com"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Voice Protocol (Phone)</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.phone || ''} 
                        onChange={e => setSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), phone: e.target.value}})} 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" 
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp Direct Sync</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.whatsapp || ''} 
                        onChange={e => setSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), whatsapp: e.target.value}})} 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold border-l-4 border-l-green-500/30" 
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'header' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 border border-white/[0.05] shadow-2xl">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-1.5 h-10 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Navigation Architecture</h2>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Spatial layout of your store's header.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { id: 'default', name: 'TEMPLATE_CORE', desc: 'Original template layout structure.' },
                      { id: 'standard', name: 'STANDARD_GRID', desc: 'Logo Left, Center Nav, Right Actions.' },
                      { id: 'centered', name: 'CENTERED_HUB', desc: 'Links Left, Logo Center, Right Actions.' },
                      { id: 'minimal', name: 'MINIMAL_NODE', desc: 'Logo Left, Discrete Hamburger Right.' },
                      { id: 'luxury', name: 'LUXURY_STACK', desc: 'Vertical Stacked Identity & Navigation.' },
                      { id: 'hamburger', name: 'MODERN_FLOW', desc: 'Hamburger Left, Logo Center, Right Icons.' }
                    ].map((layout) => (
                      <label 
                        key={layout.id} 
                        className={`group relative cursor-pointer p-8 rounded-[2rem] border transition-all overflow-hidden ${
                          (settings.headerSettings?.layout || 'default') === layout.id 
                            ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_40px_rgba(99,102,241,0.2)]' 
                            : 'border-white/[0.05] bg-white/[0.01] hover:border-white/10'
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                             <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                               (settings.headerSettings?.layout || 'default') === layout.id 
                                 ? 'bg-indigo-500 border-indigo-400 text-white' 
                                 : 'bg-white/5 border-white/10 text-slate-500'
                             }`}>
                               <div className="w-2 h-2 rounded-full bg-current"></div>
                             </div>
                             <input 
                               type="radio" 
                               name="headerLayout"
                               value={layout.id}
                               checked={(settings.headerSettings?.layout || 'default') === layout.id}
                               onChange={(e) => setSettings({...settings, headerSettings: {...(settings.headerSettings || {}), layout: e.target.value as any}})}
                               className="sr-only"
                             />
                          </div>
                          <p className={`font-black uppercase tracking-widest text-[10px] mb-2 transition-colors ${(settings.headerSettings?.layout || 'default') === layout.id ? 'text-indigo-400' : 'text-slate-400'}`}>{layout.name}</p>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{layout.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 border border-white/[0.05] shadow-2xl">
                   <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-10 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Resource Links</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Active navigation nodes in header.</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: [...(settings.headerSettings?.links || [{id: '1', label: 'Home', url: `/store/${slug}`}, {id: '2', label: 'Shop', url: `/store/${slug}/categories`}]), {id: Math.random().toString(36).substr(2, 9), label: 'New Link', url: '#'}]}})}
                      className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-2xl"
                    >
                      + ADD NODE
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {((settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                      {id: '1', label: 'Home', url: `/store/${slug}`},
                      {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                    ]).map((link: any, idx: number) => (
                      <div key={link.id} className="flex gap-6 items-center p-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] hover:bg-white/[0.04] transition-all group/link">
                        <div className="flex-1 space-y-4">
                           <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Node Label</label>
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
                               setSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: newLinks}});
                             }}
                             className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-bold text-xs"
                           />
                        </div>
                        <div className="flex-[2] space-y-4">
                           <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination URL</label>
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
                               setSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: newLinks}});
                             }}
                             className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-bold text-xs"
                           />
                        </div>
                        <div className="pt-8">
                          <button 
                            type="button"
                            onClick={() => {
                               const currentLinks = (settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                                  {id: '1', label: 'Home', url: `/store/${slug}`},
                                  {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                               ];
                               const newLinks = [...currentLinks];
                               newLinks.splice(idx, 1);
                               setSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: newLinks}});
                            }}
                            className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all flex items-center justify-center"
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
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 border border-white/[0.05] shadow-2xl">
                   <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-10 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Color Engine</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Chromatic configuration for storefront interface.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                     {/* Sections of colors */}
                     {[
                       { title: 'Base Environments', key: 'backgrounds', items: [
                         { key: 'home', label: 'Home Surface' },
                         { key: 'shop', label: 'Product Surface' },
                         { key: 'categories', label: 'Directory Surface' }
                       ]},
                       { title: 'Typography Matrix', key: 'text', items: [
                         { key: 'primary', label: 'Main Headlines' },
                         { key: 'secondary', label: 'Supporting Text' }
                       ]},
                       { title: 'Brand Core', key: 'brand', items: [
                         { key: 'primary', label: 'Primary Brand Accent' }
                       ]},
                       { title: 'Infrastructure (Footer)', key: 'footer', items: [
                         { key: 'background', label: 'Base Background' },
                         { key: 'text', label: 'Terminal Text' }
                       ]},
                       { title: 'Commerce Unit (Product)', key: 'product', items: [
                         { key: 'price', label: 'MSRP Display' },
                         { key: 'salePrice', label: 'Active Discount' }
                       ]}
                     ].map((section) => (
                       <div key={section.key} className="bg-black/20 p-10 rounded-[2.5rem] border border-white/[0.03]">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 border-b border-white/5 pb-4 italic">{section.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {section.items.map((item) => (
                              <div key={item.key} className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{item.label}</label>
                                <div className="flex gap-4 items-center bg-white/[0.02] p-3 rounded-2xl border border-white/[0.05] group/color">
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover/color:scale-110 transition-transform">
                                     <input 
                                        type="color" 
                                        value={(colorSystem as any)[section.key][item.key] || '#000000'} 
                                        onChange={e => setSettings({
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
                                    className="flex-1 bg-transparent text-white focus:outline-none font-mono text-sm uppercase tracking-tighter" 
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
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 border border-white/[0.05] shadow-2xl">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-1.5 h-10 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Section Transitions</h2>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Visual separators for homepage architecture.</p>
                    </div>
                  </div>

                  <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/[0.03] mb-12 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-4">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Chromatic Signature (Divider Color)</label>
                       <div className="flex gap-4 items-center bg-white/[0.02] p-3 rounded-2xl border border-white/[0.05] group/color">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover/color:scale-110 transition-transform">
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
                            className="flex-1 bg-transparent text-white focus:outline-none font-mono text-sm uppercase tracking-tighter" 
                          />
                        </div>
                    </div>
                    <div className="w-[1px] h-20 bg-white/5 hidden md:block"></div>
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic">Active Selection</p>
                       <p className="text-2xl font-black text-white uppercase italic tracking-tighter">{settings.dividerStyle || 'NONE'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { id: 'none', name: 'PRISTINE_VOID', desc: 'Clean negative space between sections.' },
                      { id: 'line', name: 'MINIMAL_AXIS', desc: 'Single pixel precise horizontal line.' },
                      { id: 'minimal_dots', name: 'QUANTUM_DOTS', desc: 'Three floating geometric points.' },
                      { id: 'wave', name: 'FLUID_SURGE', desc: 'Organic sinusoidal liquid transition.' },
                      { id: 'curve', name: 'ELIPTIC_ARC', desc: 'Gentle downward spherical boundary.' },
                      { id: 'triangle', name: 'VECTORS_PEAK', desc: 'Sharp geometric downward pointing node.' },
                      { id: 'zigzag', name: 'FRACTAL_EDGE', desc: 'Aggressive serrated sawtooth architecture.' },
                      { id: 'geometric', name: 'COMPOSITE_STRATA', desc: 'Layered polygonal depth elements.' },
                      { id: 'slash', name: 'DIAGONAL_SPLIT', desc: 'Dynamic angular spatial separation.' },
                      { id: 'mountains', name: 'ALPINE_RIDGE', desc: 'Symmetric layered peak structures.' },
                      { id: 'fan', name: 'RADIAL_SWEEP', desc: 'Soft curved volumetric fan expansion.' },
                      { id: 'steps', name: 'DIGITAL_TIERS', desc: 'Orthogonal stepped architectural levels.' },
                      { id: 'drops', name: 'GRAVITY_NODES', desc: 'Floating circular liquid elements.' },
                      { id: 'arabic_pattern', name: 'CULTURAL_DNA', desc: 'Ornate geometric star matrix.' },
                    ].map((divider) => (
                      <label 
                        key={divider.id} 
                        className={`group relative cursor-pointer p-6 rounded-[2rem] border transition-all overflow-hidden ${
                          (settings.dividerStyle || 'none') === divider.id 
                            ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_40px_rgba(99,102,241,0.2)] scale-105 z-10' 
                            : 'border-white/[0.05] bg-white/[0.01] hover:border-white/10'
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                             <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                               (settings.dividerStyle || 'none') === divider.id 
                                 ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                                 : 'bg-white/5 border-white/10 text-slate-500'
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
                          <p className={`font-black uppercase tracking-widest text-[9px] mb-1 transition-colors ${(settings.dividerStyle || 'none') === divider.id ? 'text-indigo-400' : 'text-slate-400'}`}>{divider.name}</p>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic mb-6">{divider.desc}</p>
                          
                          <div className="h-20 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                             <div className="w-full scale-[0.35] opacity-40 group-hover:opacity-100 transition-all">
                                <SectionDividerPreview style={divider.id} color={settings.dividerColor} />
                             </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {['tracking', 'business', 'signature'].includes(activeTab) && (
              <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-20 border border-white/[0.05] text-center shadow-2xl animate-in fade-in duration-700">
                  <div className="w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                     <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Module Synchronizing</h2>
                  <p className="text-slate-500 text-sm mt-4 font-medium italic">Establishing high-bandwidth connection to {tabs.find(t => t.id === activeTab)?.label} parameters...</p>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-12 bg-indigo-400/5 py-2 px-6 rounded-full inline-block border border-indigo-400/10 animate-pulse">Encryption Layer Active</p>
              </div>
            )}
          </div>

          {/* Premium Sticky Save Bar */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-6 group/save">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur-[30px] opacity-20 group-hover/save:opacity-40 transition-opacity"></div>
            <div className="relative bg-[#0f111a]/80 backdrop-blur-3xl border border-white/[0.1] p-6 rounded-[2.5rem] flex items-center justify-between shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <div className="pl-6">
                {saveMessage ? (
                  <div className="flex items-center gap-4 animate-in slide-in-from-left-4 duration-500">
                     <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">System Synchronized</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-slate-500">
                     <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pending Commitment</span>
                  </div>
                )}
              </div>
              <button 
                type="submit"
                disabled={isPending}
                className="px-12 py-5 bg-white text-black rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-indigo-400 transition-all flex items-center gap-4 shadow-2xl disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                Execute Protocol
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
