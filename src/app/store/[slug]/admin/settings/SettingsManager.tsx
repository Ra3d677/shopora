"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveStoreSettings } from "../actions";
import { Settings, Loader2, Save, X, Trash2, CheckCircle2, Globe } from "lucide-react";
import { StoreSettings } from "@/lib/types";
import MediaPicker from "../media/MediaPicker";

const PRESET_GRADIENTS = [
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
  'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
  'linear-gradient(to right, #ff0844 0%, #ffb199 100%)',
  'radial-gradient(circle at center, #0f172a, #0a0c14, #000000)',
  'linear-gradient(to bottom right, rgba(22, 78, 99, 0.4), #0a0c14, rgba(30, 58, 138, 0.4))'
];

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
  const [linkInput, setLinkInput] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const colorSystem = settings.colorSystem || {
    backgrounds: { home: '#ffffff', shop: '#f8fafc', categories: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
    brand: { primary: '#3b82f6' },
    footer: { background: '#0f172a', text: '#f8fafc' },
    product: { price: '#0f172a', salePrice: '#ef4444' }
  };

  const premiumBackgrounds = [
    { id: 'default', name: 'Void', desc: 'Pure dark matter.', style: { backgroundColor: '#0a0c14' } },
    { id: 'abyss', name: 'Abyss', desc: 'Deep radial gradient.', style: { background: 'radial-gradient(ellipse at top, #0f172a, #0a0c14, #000000)' } },
    { id: 'nebula', name: 'Nebula', desc: 'Purple ambient glow.', style: { background: 'radial-gradient(circle at bottom left, rgba(88, 28, 135, 0.4), #0a0c14, #0a0c14)' } },
    { id: 'cyber', name: 'Cyber', desc: 'Cyan & Blue intersections.', style: { background: 'linear-gradient(to bottom right, rgba(22, 78, 99, 0.4), #0a0c14, rgba(30, 58, 138, 0.4))' } },
    { id: 'luxury', name: 'Luxury', desc: 'Subtle amber central highlight.', style: { background: 'radial-gradient(ellipse at center, rgba(120, 53, 15, 0.2), #0a0c14, #000000)' } }
  ];

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
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">
            Store <span className="text-cyan-400">Core</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium tracking-widest text-[10px] uppercase">Master control for your brand identity and ecosystem.</p>
        </div>
        
        <div className="flex bg-white/5 backdrop-blur-3xl p-2 rounded-[2rem] border border-white/5 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500 text-white shadow-[0_10px_20px_rgba(6,182,212,0.3)] scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <form onSubmit={handleSave}>
          <div className="space-y-10">
            {activeTab === 'general' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Identity Settings */}
                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -z-10 group-hover:bg-cyan-500/10 transition-all"></div>
                  
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Brand Matrix</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Market Name</label>
                      <input 
                        type="text" 
                        value={settings.storeName} 
                        onChange={e => updateSettings({...settings, storeName: e.target.value})} 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-black uppercase tracking-tight italic" 
                        placeholder="Enter Identifier"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Signature Logo</label>
                      <div className="bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] p-4">
                        <MediaPicker 
                          slug={slug}
                          value={settings.logoUrl || ''} 
                          onChange={url => updateSettings({...settings, logoUrl: url})} 
                          className="bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.03] flex flex-col md:flex-row gap-10">
                      <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-center px-2">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Vertical Scale</h4>
                          <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">{settings.headerSettings?.logoHeight || 40}PX</span>
                        </div>
                        <input 
                          type="range" 
                          min="20" 
                          max="120" 
                          step="4"
                          value={settings.headerSettings?.logoHeight || 40} 
                          onChange={(e) => updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), logoHeight: Number(e.target.value)}})} 
                          className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                      </div>

                      <div className="w-[1px] bg-white/5 hidden md:block"></div>

                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Alpha Blend Mode</h4>
                          <p className="text-[9px] text-slate-500 mt-2 font-medium tracking-wide">Sync logo transparency with header matrix.</p>
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
                          <div className="w-14 h-7 bg-white/5 rounded-full peer peer-checked:bg-cyan-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Comm Channels</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Uplink Email</label>
                      <input 
                        type="email" 
                        value={settings.contactInfo?.email || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), email: e.target.value}})} 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-black italic" 
                        placeholder="support@hq.com"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Voice Direct</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.phone || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), phone: e.target.value}})} 
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-black tracking-widest" 
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Secure WhatsApp</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.whatsapp || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), whatsapp: e.target.value}})} 
                        className="w-full bg-white/[0.03] border border-green-500/20 rounded-[1.5rem] px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-black tracking-widest border-l-4 border-l-green-500" 
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'header' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Header Topology</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { id: 'default', name: 'Legacy', desc: 'Original structure parameters.' },
                      { id: 'standard', name: 'Symmetric', desc: 'Logo Left, Balanced Central Matrix.' },
                      { id: 'centered', name: 'Focus', desc: 'Links Left, Identity Center Node.' },
                      { id: 'minimal', name: 'Discrete', desc: 'Stealth Identity, Action Focused.' },
                      { id: 'luxury', name: 'High-End', desc: 'Vertical Stacked Premium Identity.' },
                      { id: 'hamburger', name: 'Fluid', desc: 'Mobile-First Dynamic Interface.' }
                    ].map((layout) => (
                      <label 
                        key={layout.id} 
                        className={`group relative cursor-pointer p-8 rounded-3xl border transition-all duration-500 ${
                          (settings.headerSettings?.layout || 'default') === layout.id 
                            ? 'border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-6">
                           <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                             (settings.headerSettings?.layout || 'default') === layout.id 
                               ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30' 
                               : 'bg-white/5 border-white/5 text-slate-700 group-hover:text-cyan-400'
                           }`}>
                             <div className="w-2 h-2 rounded-full bg-current"></div>
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
                        <p className={`font-black text-base mb-2 transition-colors uppercase italic ${(settings.headerSettings?.layout || 'default') === layout.id ? 'text-cyan-400' : 'text-white'}`}>{layout.name}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-widest">{layout.desc}</p>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                   <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Navigation Nodes</h2>
                    </div>
                    <button 
                      type="button"
                      onClick={() => updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: [...(settings.headerSettings?.links || [{id: '1', label: 'Home', url: `/store/${slug}`}, {id: '2', label: 'Shop', url: `/store/${slug}/categories`}]), {id: Math.random().toString(36).substr(2, 9), label: 'New Link', url: '#'}]}})}
                      className="px-8 py-4 bg-cyan-500 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_25px_rgba(6,182,212,0.3)]"
                    >
                      + Inject Link
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {((settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                      {id: '1', label: 'Home', url: `/store/${slug}`},
                      {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                    ]).map((link: any, idx: number) => (
                      <div key={link.id} className="flex gap-6 items-center p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] hover:border-white/10 transition-all group/node relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -z-10 group-hover/node:bg-cyan-500/5 transition-all"></div>
                        <div className="flex-1 space-y-4">
                           <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Label</label>
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
                             className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-xs uppercase italic"
                           />
                        </div>
                        <div className="flex-[2] space-y-4">
                           <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Uplink Path</label>
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
                             className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 py-3 text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-bold text-xs"
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
                               updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: newLinks}});
                            }}
                            className="w-12 h-12 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'theme' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Color Algorithm</h2>
                  </div>

                  <div className="space-y-10">
                     {[
                       { title: 'Base Matrix', key: 'backgrounds', items: [
                         { key: 'home', label: 'Home Node' },
                         { key: 'shop', label: 'Shop Node' },
                         { key: 'categories', label: 'Category Node' }
                       ]},
                       { title: 'Text Spectrum', key: 'text', items: [
                         { key: 'primary', label: 'Primary' },
                         { key: 'secondary', label: 'Dimmed' }
                       ]},
                       { title: 'Signal Colors', key: 'brand', items: [
                         { key: 'primary', label: 'Primary Signal' }
                       ]},
                       { title: 'Footer Layer', key: 'footer', items: [
                         { key: 'background', label: 'Matrix' },
                         { key: 'text', label: 'Symbol' }
                       ]},
                       { title: 'Economic UI', key: 'product', items: [
                         { key: 'price', label: 'Base Rate' },
                         { key: 'salePrice', label: 'Impact Rate' }
                       ]}
                     ].map((section) => (
                       <div key={section.key} className="bg-white/[0.01] p-8 rounded-[2rem] border border-white/[0.03]">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-8 pb-4 border-b border-white/5">{section.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {section.items.map((item) => (
                              <div key={item.key} className="space-y-4">
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">{item.label}</label>
                                <div className="flex gap-4 items-center bg-white/[0.03] p-3 rounded-[1.25rem] border border-white/[0.05] group transition-all hover:bg-white/[0.05]">
                                  <div 
                                    className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-2xl shrink-0"
                                    style={{ background: (colorSystem as any)[section.key][item.key] || '#000000' }}
                                  >
                                     <input 
                                        type="color" 
                                        value={((colorSystem as any)[section.key][item.key] || '').includes('gradient') ? '#000000' : ((colorSystem as any)[section.key][item.key] || '#000000')} 
                                        onChange={e => updateSettings({
                                          ...settings, 
                                          colorSystem: { 
                                            ...colorSystem, 
                                            [section.key]: { ...(colorSystem as any)[section.key], [item.key]: e.target.value } 
                                          }
                                        })} 
                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0" 
                                        title="Pick Solid Color"
                                      />
                                  </div>
                                  <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                                    <input 
                                      type="text" 
                                      value={(colorSystem as any)[section.key][item.key] || '#000000'} 
                                      onChange={e => updateSettings({
                                        ...settings, 
                                        colorSystem: { 
                                          ...colorSystem, 
                                          [section.key]: { ...(colorSystem as any)[section.key], [item.key]: e.target.value } 
                                        }
                                      })} 
                                      className="w-full bg-transparent text-white focus:outline-none font-mono text-xs uppercase font-black" 
                                    />
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                      {PRESET_GRADIENTS.map((grad, i) => (
                                        <button
                                          key={i}
                                          onClick={() => updateSettings({
                                            ...settings, 
                                            colorSystem: { 
                                              ...colorSystem, 
                                              [section.key]: { ...(colorSystem as any)[section.key], [item.key]: grad } 
                                            }
                                          })}
                                          className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform cursor-pointer shadow-lg"
                                          style={{ background: grad }}
                                          title="Apply Gradient"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>
                     ))}
                  </div>
                </div>

                {/* Premium Page Themes Section */}
                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative mt-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-purple-400 rounded-full shadow-[0_0_15px_rgba(192,132,252,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Premium Page Themes</h2>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-10 font-bold italic">Link complex gradients to specific URL paths (e.g. /products, /categories).</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {premiumBackgrounds.filter(bg => bg.id !== 'default').map(bg => {
                      const themeConfig = settings.pageThemes?.find(t => t.themeId === bg.id) || { themeId: bg.id, links: [] };
                      
                      return (
                        <div key={bg.id} className="bg-white/[0.01] p-8 rounded-[2.5rem] border border-white/[0.03] space-y-8 group/card transition-all hover:bg-white/[0.03]">
                           <div className="flex items-start justify-between gap-6">
                              <div className="flex-1">
                                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">{bg.name}</h3>
                                 <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">{bg.desc}</p>
                              </div>
                              <div className={`w-32 h-20 rounded-2xl border border-white/10 shadow-2xl overflow-hidden`} style={bg.style}></div>
                           </div>

                           <div className="space-y-4">
                              <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                 <Globe size={10} className="text-purple-400" /> Linked Protocols
                              </h4>
                              
                              <div className="flex flex-wrap gap-2 min-h-[40px]">
                                 {themeConfig.links.length === 0 ? (
                                   <span className="text-[9px] text-slate-700 italic uppercase font-bold py-2">No links established.</span>
                                 ) : (
                                   themeConfig.links.map(link => (
                                     <div key={link} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 animate-in zoom-in duration-300">
                                       {link}
                                       <button 
                                         type="button"
                                         onClick={() => {
                                            const currentThemes = settings.pageThemes || [];
                                            const newThemes = currentThemes.map(t => 
                                              t.themeId === bg.id 
                                                ? { ...t, links: t.links.filter(l => l !== link) }
                                                : t
                                            );
                                            updateSettings({ ...settings, pageThemes: newThemes });
                                         }}
                                         className="hover:text-white transition-colors"
                                       >
                                         <X size={10} />
                                       </button>
                                     </div>
                                   ))
                                 )}
                              </div>
                           </div>

                           <div className="flex gap-4">
                              <input 
                                type="text"
                                value={linkInput[bg.id] || ''}
                                onChange={(e) => setLinkInput({ ...linkInput, [bg.id]: e.target.value })}
                                placeholder="/path/to/page"
                                className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all font-mono text-xs"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                   let rawPath = linkInput[bg.id];
                                   if (!rawPath) return;

                                   // Normalize link: if full URL, extract pathname
                                   let normalizedPath = rawPath;
                                   try {
                                      if (rawPath.includes('://')) {
                                         normalizedPath = new URL(rawPath).pathname;
                                      }
                                   } catch(e) {}

                                   const currentThemes = settings.pageThemes || [];
                                   const themeExists = currentThemes.some(t => t.themeId === bg.id);
                                   
                                   let newThemes;
                                   if (themeExists) {
                                      newThemes = currentThemes.map(t => 
                                        t.themeId === bg.id 
                                          ? { ...t, links: [...new Set([...t.links, normalizedPath])] }
                                          : t
                                      );
                                   } else {
                                      newThemes = [...currentThemes, { themeId: bg.id, links: [normalizedPath] }];
                                   }
                                   
                                   updateSettings({ ...settings, pageThemes: newThemes });
                                   setLinkInput({ ...linkInput, [bg.id]: '' });
                                }}
                                className="px-6 py-4 bg-purple-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(192,132,252,0.2)]"
                              >
                                Link Node
                              </button>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'layout' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Spatial Dividers</h2>
                  </div>

                  <div className="bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/[0.05] mb-10 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 space-y-4">
                       <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Spectral Hue</label>
                       <div className="flex gap-4 items-center bg-white/[0.03] p-3 rounded-[1.25rem] border border-white/[0.05] max-w-xs">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10">
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
                            className="flex-1 bg-transparent text-white focus:outline-none font-mono text-sm uppercase font-black" 
                          />
                        </div>
                    </div>
                    <div className="w-[1px] h-16 bg-white/5 hidden md:block"></div>
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Active Protocol</p>
                       <p className="text-3xl font-black text-cyan-400 uppercase italic tracking-tighter">{settings.dividerStyle || 'NULL'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { id: 'none', name: 'Void', desc: 'Zero-point spatial clearance.' },
                      { id: 'line', name: 'Vector', desc: 'Precise 1px horizontal nexus.' },
                      { id: 'minimal_dots', name: 'Cluster', desc: 'Floating geometric coordinates.' },
                      { id: 'wave', name: 'Fluid', desc: 'Sinusoidal liquid transition.' },
                      { id: 'curve', name: 'Spherical', desc: 'Organic boundary curvature.' },
                      { id: 'triangle', name: 'Prism', desc: 'Sharp geometric convergence.' },
                      { id: 'zigzag', name: 'Pulse', desc: 'High-frequency serrated edge.' },
                      { id: 'geometric', name: 'Array', desc: 'Polygonal depth structures.' },
                      { id: 'slash', name: 'Angular', desc: 'Dynamic spatial intersection.' },
                      { id: 'mountains', name: 'Summit', desc: 'Symmetric layered peak matrix.' },
                      { id: 'fan', name: 'Radial', desc: 'Curved volumetric expansion.' },
                      { id: 'steps', name: 'Ladder', desc: 'Orthogonal hierarchical levels.' },
                      { id: 'drops', name: 'Liquid', desc: 'Floating circular elements.' },
                      { id: 'arabic_pattern', name: 'Pattern', desc: 'Star-matrix geometric weave.' },
                    ].map((divider) => (
                      <label 
                        key={divider.id} 
                        className={`group relative cursor-pointer p-8 rounded-3xl border transition-all duration-500 ${
                          (settings.dividerStyle || 'none') === divider.id 
                            ? 'border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-6">
                           <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                             (settings.dividerStyle || 'none') === divider.id 
                               ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30' 
                               : 'bg-white/5 border-white/5 text-slate-700'
                           }`}>
                             {settings.dividerStyle === divider.id ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
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
                        <p className={`font-black text-lg mb-2 transition-colors uppercase italic ${(settings.dividerStyle || 'none') === divider.id ? 'text-cyan-400' : 'text-white'}`}>{divider.name}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-widest mb-6">{divider.desc}</p>
                        
                        <div className="h-20 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                           <div className="w-full scale-[0.4] opacity-50">
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
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Observatory Pixels</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { id: 'facebookPixelId', name: 'Meta Pixel', color: 'bg-blue-600', placeholder: '1234567890' },
                      { id: 'tiktokPixelId', name: 'TikTok Signal', color: 'bg-slate-900', placeholder: 'C1234567890' },
                      { id: 'snapchatPixelId', name: 'Snap Protocol', color: 'bg-yellow-400', placeholder: '123456-7890' },
                      { id: 'googleAnalyticsId', name: 'Analytics G4', color: 'bg-orange-500', placeholder: 'G-XXXXXXXX' }
                    ].map((pixel) => (
                      <div key={pixel.id} className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05] space-y-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -z-10 group-hover:bg-cyan-500/5 transition-all"></div>
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl ${pixel.color}`}>
                               <Settings size={20} />
                            </div>
                            <h3 className="text-base font-black text-white uppercase italic tracking-tight">{pixel.name}</h3>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Secret ID</label>
                            <input 
                              type="text"
                              value={(settings as any)[pixel.id] || ''}
                              onChange={e => updateSettings({...settings, [pixel.id]: e.target.value})}
                              placeholder={pixel.placeholder}
                              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                            />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'signature' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                   <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Elite Features</h2>
                  </div>

                  <div className="bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/[0.05] mb-10 group">
                     <div className="flex items-center justify-between mb-8">
                        <div>
                           <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Live Pulse Notifications</h3>
                           <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-widest">Real-time social proof stream for visitors.</p>
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
                           <div className="w-14 h-7 bg-white/5 rounded-full peer peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7"></div>
                        </label>
                     </div>
                     {settings.signatureSettings?.liveSales?.enabled && (
                       <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.05] flex items-center gap-8 animate-in slide-in-from-top-4 duration-500">
                          <div className="flex-1 space-y-3">
                             <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Pulse Interval (Seconds)</label>
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
                                className="w-32 bg-black/40 border border-white/5 rounded-xl px-6 py-3 text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-sm"
                             />
                          </div>
                       </div>
                     )}
                  </div>

                  <div className="bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/[0.05]">
                     <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Social Proof Matrix</h3>
                        <button 
                          type="button"
                          onClick={() => updateSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonials: [...(settings.signatureSettings?.testimonials || []), {name: '', role: '', content: ''}]}})}
                          className="px-6 py-3 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all shadow-2xl"
                        >
                          + Inject Review
                        </button>
                     </div>

                     <div className="space-y-6">
                        {(settings.signatureSettings?.testimonials || []).map((t: any, idx: number) => (
                           <div key={idx} className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/[0.05] shadow-2xl relative group/card transition-all hover:bg-white/[0.05]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                 <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Identity</label>
                                    <input 
                                       type="text" 
                                       value={t.name}
                                       placeholder="Subject Name"
                                       onChange={e => {
                                          const newList = [...(settings.signatureSettings?.testimonials || [])];
                                          newList[idx].name = e.target.value;
                                          updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                       }}
                                       className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-xs uppercase"
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Coordinates</label>
                                    <input 
                                       type="text" 
                                       value={t.role}
                                       placeholder="Sector / Location"
                                       onChange={e => {
                                          const newList = [...(settings.signatureSettings?.testimonials || [])];
                                          newList[idx].role = e.target.value;
                                          updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                       }}
                                       className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-bold text-xs uppercase"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Manifesto</label>
                                 <textarea 
                                    value={t.content}
                                    placeholder="Input signal content..."
                                    rows={3}
                                    onChange={e => {
                                       const newList = [...(settings.signatureSettings?.testimonials || [])];
                                       newList[idx].content = e.target.value;
                                       updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                    }}
                                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium text-xs leading-relaxed italic"
                                 />
                              </div>
                              <button 
                                 type="button"
                                 onClick={() => {
                                    const newList = [...(settings.signatureSettings?.testimonials || [])];
                                    newList.splice(idx, 1);
                                    updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                 }}
                                 className="mt-8 text-[9px] font-black text-rose-500 uppercase tracking-[0.4em] hover:text-rose-400 transition-colors"
                              >
                                 Terminated Review
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (activeTab === 'business' && (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-[#1a1d2d]/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                   <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Economic Parameters</h2>
                  </div>

                  <div className="bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/[0.05]">
                     <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Logistics Grids</h3>
                        <button 
                          type="button"
                          onClick={() => updateSettings({...settings, businessSettings: {...(settings.businessSettings || {}), shippingRates: [...(settings.businessSettings?.shippingRates || []), {zone: '', rate: 0}]}})}
                          className="px-6 py-3 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                          + Define Grid
                        </button>
                     </div>

                     <div className="space-y-4">
                        {(settings.businessSettings?.shippingRates || []).map((r: any, idx: number) => (
                           <div key={idx} className="flex gap-6 items-center bg-white/[0.03] p-6 rounded-[1.5rem] border border-white/[0.05] group transition-all hover:bg-white/[0.05]">
                              <div className="flex-1 space-y-3">
                                 <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Zone Identifier</label>
                                 <input 
                                    type="text" 
                                    value={r.zone}
                                    placeholder="e.g. Global"
                                    onChange={e => {
                                       const newList = [...(settings.businessSettings?.shippingRates || [])];
                                       newList[idx].zone = e.target.value;
                                       updateSettings({...settings, businessSettings: {...settings.businessSettings, shippingRates: newList}});
                                    }}
                                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-xs uppercase"
                                 />
                              </div>
                              <div className="w-40 space-y-3">
                                 <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Rate Value ($)</label>
                                 <input 
                                    type="number" 
                                    value={r.rate}
                                    onChange={e => {
                                       const newList = [...(settings.businessSettings?.shippingRates || [])];
                                       newList[idx].rate = Number(e.target.value);
                                       updateSettings({...settings, businessSettings: {...settings.businessSettings, shippingRates: newList}});
                                    }}
                                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-5 py-3 text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-xs"
                                 />
                              </div>
                              <div className="pt-8">
                                 <button 
                                    type="button"
                                    onClick={() => {
                                       const newList = [...(settings.businessSettings?.shippingRates || [])];
                                       newList.splice(idx, 1);
                                       updateSettings({...settings, businessSettings: {...settings.businessSettings, shippingRates: newList}});
                                    }}
                                    className="w-12 h-12 rounded-xl bg-rose-500/5 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/10 shadow-2xl"
                                 >
                                    <X size={20} />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-10 transition-all duration-700 ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
            <div className="bg-[#0f111a]/90 backdrop-blur-3xl border border-cyan-500/30 p-5 rounded-[2.5rem] flex items-center justify-between shadow-[0_20px_50px_rgba(6,182,212,0.2)]">
              <div className="pl-6">
                {saveMessage ? (
                  <div className="flex items-center gap-4 animate-in slide-in-from-left-6 duration-700">
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Protocol Secured</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-slate-500">
                     <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Uplink Pending</span>
                  </div>
                )}
              </div>
              <button 
                type="submit"
                disabled={isPending}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-2xl shadow-cyan-500/20 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                Sync Protocol
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
