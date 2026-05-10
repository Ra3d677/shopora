"use client";

import { useState, useTransition } from "react";
import { saveStoreSettings } from "../actions";
import { Settings, Loader2, Save, X, Trash2 } from "lucide-react";
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
    { id: "tracking", label: "Tracking & Pixels" },
    { id: "business", label: "Business & Payments" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Settings className="w-8 h-8" /> Store Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure global appearance and layout preferences.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="p-8">
          <div className="space-y-8">
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Identity Settings */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Brand Identity</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                      <input 
                        type="text" 
                        value={settings.storeName} 
                        onChange={e => setSettings({...settings, storeName: e.target.value})} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Store Logo</label>
                      <MediaPicker 
                        slug={slug}
                        value={settings.logoUrl || ''} 
                        onChange={url => setSettings({...settings, logoUrl: url})} 
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                      <input 
                        type="email" 
                        value={settings.contactInfo?.email || ''} 
                        onChange={e => setSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), email: e.target.value}})} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.phone || ''} 
                        onChange={e => setSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), phone: e.target.value}})} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.whatsapp || ''} 
                        onChange={e => setSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), whatsapp: e.target.value}})} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Banner Slider Settings */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Hero Slider Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer mt-4">
                        <input 
                          type="checkbox" 
                          checked={settings.bannerSettings?.autoPlay} 
                          onChange={e => setSettings({...settings, bannerSettings: {...settings.bannerSettings, autoPlay: e.target.checked}})} 
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span className="text-sm font-medium text-slate-700">Auto-play slider</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Slide Duration (seconds)</label>
                      <input 
                        type="number" 
                        min="1"
                        max="15"
                        value={(settings.bannerSettings?.interval || 5000) / 1000} 
                        onChange={e => setSettings({...settings, bannerSettings: {...settings.bannerSettings, interval: Number(e.target.value) * 1000}})} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Marquee (Moving Strip) Settings */}
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Announcement Marquee</h2>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm font-bold text-slate-500">Enable</span>
                      <input 
                        type="checkbox" 
                        checked={settings.marqueeSettings?.enabled || false} 
                        onChange={e => setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), enabled: e.target.checked}})} 
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-600 accent-blue-600"
                      />
                    </label>
                  </div>
                  
                  {settings.marqueeSettings?.enabled && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Background Color</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={settings.marqueeSettings?.backgroundColor || '#000000'} 
                              onChange={e => setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), backgroundColor: e.target.value}})} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={settings.marqueeSettings?.backgroundColor || '#000000'} 
                              onChange={e => setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), backgroundColor: e.target.value}})} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none font-mono text-sm uppercase" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Text Color</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={settings.marqueeSettings?.textColor || '#ffffff'} 
                              onChange={e => setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), textColor: e.target.value}})} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={settings.marqueeSettings?.textColor || '#ffffff'} 
                              onChange={e => setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), textColor: e.target.value}})} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none font-mono text-sm uppercase" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Animation Speed (seconds)</label>
                          <input 
                            type="number" 
                            min="5" max="100"
                            value={settings.marqueeSettings?.speed || 20} 
                            onChange={e => setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), speed: Number(e.target.value)}})} 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                      </div>

                      <div className="mt-6 border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-slate-800">Scrolling Texts</h3>
                          <button 
                            type="button"
                            onClick={() => {
                              const newItems = [...(settings.marqueeSettings?.items || [])];
                              newItems.push({ id: Math.random().toString(36).substr(2, 9), text: 'New Announcement' });
                              setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), items: newItems}});
                            }}
                            className="text-xs font-black uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                          >
                            + Add Text
                          </button>
                        </div>
                        <div className="space-y-3">
                          {settings.marqueeSettings?.items?.map((item, idx) => (
                            <div key={item.id} className="flex gap-3">
                              <input 
                                type="text" 
                                value={item.text} 
                                onChange={e => {
                                  const newItems = [...(settings.marqueeSettings?.items || [])];
                                  newItems[idx].text = e.target.value;
                                  setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), items: newItems}});
                                }}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const newItems = [...(settings.marqueeSettings?.items || [])];
                                  newItems.splice(idx, 1);
                                  setSettings({...settings, marqueeSettings: {...(settings.marqueeSettings || { items: [], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }), items: newItems}});
                                }}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          {(!settings.marqueeSettings?.items || settings.marqueeSettings.items.length === 0) && (
                            <p className="text-sm text-slate-500 text-center py-4 border-2 border-dashed rounded-xl">No texts added. Add one above.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'header' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Navigation Links</h3>
                      <p className="text-sm text-slate-500">Manage the links that appear in your store's header.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: [...(settings.headerSettings?.links || [{id: '1', label: 'Home', url: `/store/${slug}`}, {id: '2', label: 'Shop', url: `/store/${slug}/categories`}]), {id: Math.random().toString(36).substr(2, 9), label: 'New Link', url: '#'}]}})}
                      className="text-xs font-black uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                    >
                      + Add Link
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {((settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                      {id: '1', label: 'Home', url: `/store/${slug}`},
                      {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                    ]).map((link: any, idx: number) => (
                      <div key={link.id} className="flex gap-4 items-center p-3 bg-white border border-slate-200 rounded-xl">
                        <div className="flex-1">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Label</label>
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
                             className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                           />
                        </div>
                        <div className="flex-[2]">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL / Link</label>
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
                             className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                           />
                        </div>
                        <div className="pt-5">
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
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Colors Settings - Redesigned System */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-900">Color System</h2>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold tracking-wider border border-blue-100">
                      Professional Color Engine
                    </span>
                  </div>

                  {/* 1. Page Backgrounds */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Page Backgrounds</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { key: 'home', label: 'Home Page' },
                        { key: 'shop', label: 'Shop Page (Products)' },
                        { key: 'categories', label: 'Categories Page' }
                      ].map((item) => (
                        <div key={item.key}>
                          <label className="block text-sm font-bold text-slate-700 mb-2">{item.label}</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={colorSystem.backgrounds[item.key as keyof typeof colorSystem.backgrounds]} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  backgrounds: { ...colorSystem.backgrounds, [item.key]: e.target.value } 
                                }
                              })} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={colorSystem.backgrounds[item.key as keyof typeof colorSystem.backgrounds]} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  backgrounds: { ...colorSystem.backgrounds, [item.key]: e.target.value } 
                                }
                              })} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Text Colors */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Text Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'primary', label: 'Primary Text (Headings)' },
                        { key: 'secondary', label: 'Secondary Text (Paragraphs & Muted)' }
                      ].map((item) => (
                        <div key={item.key}>
                          <label className="block text-sm font-bold text-slate-700 mb-2">{item.label}</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={colorSystem.text[item.key as keyof typeof colorSystem.text]} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  text: { ...colorSystem.text, [item.key]: e.target.value } 
                                }
                              })} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={colorSystem.text[item.key as keyof typeof colorSystem.text]} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  text: { ...colorSystem.text, [item.key]: e.target.value } 
                                }
                              })} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Brand Colors */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Brand Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Primary Brand (Buttons & Accents)</label>
                        <div className="flex gap-3">
                          <input 
                            type="color" 
                            value={colorSystem.brand.primary} 
                            onChange={e => setSettings({
                              ...settings, 
                              colorSystem: { 
                                ...colorSystem, 
                                brand: { ...colorSystem.brand, primary: e.target.value } 
                              }
                            })} 
                            className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                          />
                          <input 
                            type="text" 
                            value={colorSystem.brand.primary} 
                            onChange={e => setSettings({
                              ...settings, 
                              colorSystem: { 
                                ...colorSystem, 
                                brand: { ...colorSystem.brand, primary: e.target.value } 
                              }
                            })} 
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono text-sm" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Footer Colors */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Footer Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'background', label: 'Footer Background' },
                        { key: 'text', label: 'Footer Text' }
                      ].map((item) => (
                        <div key={item.key}>
                          <label className="block text-sm font-bold text-slate-700 mb-2">{item.label}</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={colorSystem.footer?.[item.key as keyof typeof colorSystem.footer] || '#000000'} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  footer: { ...colorSystem.footer, [item.key]: e.target.value } 
                                }
                              })} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={colorSystem.footer?.[item.key as keyof typeof colorSystem.footer] || '#000000'} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  footer: { ...colorSystem.footer, [item.key]: e.target.value } 
                                }
                              })} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Product Colors */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Product Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'price', label: 'Regular Price Color' },
                        { key: 'salePrice', label: 'Sale Price Color' }
                      ].map((item) => (
                        <div key={item.key}>
                          <label className="block text-sm font-bold text-slate-700 mb-2">{item.label}</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={colorSystem.product?.[item.key as keyof typeof colorSystem.product] || '#000000'} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  product: { ...colorSystem.product, [item.key]: e.target.value } 
                                }
                              })} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={colorSystem.product?.[item.key as keyof typeof colorSystem.product] || '#000000'} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  product: { ...colorSystem.product, [item.key]: e.target.value } 
                                }
                              })} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6. Testimonial Colors */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Testimonial Colors (Signature Template)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'background', label: 'Section Background Color' },
                        { key: 'text', label: 'Section Text Color' }
                      ].map((item) => (
                        <div key={item.key}>
                          <label className="block text-sm font-bold text-slate-700 mb-2">{item.label}</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={colorSystem.testimonial?.[item.key as keyof typeof colorSystem.testimonial] || (item.key === 'background' ? '#0f172a' : '#ffffff')} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  testimonial: { ...(colorSystem.testimonial || { background: '#0f172a', text: '#ffffff' }), [item.key]: e.target.value } 
                                }
                              })} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={colorSystem.testimonial?.[item.key as keyof typeof colorSystem.testimonial] || (item.key === 'background' ? '#0f172a' : '#ffffff')} 
                              onChange={e => setSettings({
                                ...settings, 
                                colorSystem: { 
                                  ...colorSystem, 
                                  testimonial: { ...(colorSystem.testimonial || { background: '#0f172a', text: '#ffffff' }), [item.key]: e.target.value } 
                                }
                              })} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layout Settings */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Layout & Display</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Categories Layout</label>
                      <select 
                        value={settings.categoriesLayout} 
                        onChange={e => setSettings({...settings, categoriesLayout: e.target.value as 'grid' | 'list'})} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'tracking' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h2 className="text-xl font-bold text-indigo-900 mb-2">Marketing & Tracking Pixels</h2>
                  <p className="text-indigo-700 text-sm">Add your tracking IDs here to monitor your store's performance and run targeted ads.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Facebook Pixel */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#1877F2] rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </div>
                      <h3 className="font-bold text-lg">Facebook Pixel</h3>
                    </div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Pixel ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 123456789012345"
                      value={settings.facebookPixelId || ''} 
                      onChange={e => setSettings({...settings, facebookPixelId: e.target.value})} 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                    <p className="text-xs text-slate-400 mt-2">Enter your 15-digit Facebook Pixel ID.</p>
                  </div>

                  {/* TikTok Pixel */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-black transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-1.01V14.5c.01 2.32-.6 4.67-2.12 6.44-1.56 1.82-3.83 2.87-6.17 3.03-2.56.23-5.32-.59-7.15-2.45-1.88-1.89-2.75-4.63-2.32-7.26.38-2.61 2.25-4.99 4.63-6.06 1.43-.65 3.01-.87 4.56-.63V11.5c-1.12-.28-2.39-.12-3.37.54-.99.64-1.61 1.77-1.63 2.95-.01 1.05.32 2.11 1.01 2.91.69.83 1.75 1.3 2.81 1.3 1.04-.01 2.12-.48 2.76-1.3.69-.87 1-2.02.95-3.13V0h.01z"/></svg>
                      </div>
                      <h3 className="font-bold text-lg">TikTok Pixel</h3>
                    </div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Pixel ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. C1234567890ABCDE"
                      value={settings.tiktokPixelId || ''} 
                      onChange={e => setSettings({...settings, tiktokPixelId: e.target.value})} 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" 
                    />
                    <p className="text-xs text-slate-400 mt-2">Enter your TikTok Pixel ID (Code).</p>
                  </div>

                  {/* Snapchat Pixel */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-yellow-400 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#FFFC00] rounded-lg flex items-center justify-center text-black">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.3c-4.4 0-8 2.4-8 5.4 0 1.5.9 2.9 2.5 3.9-.4 1.1-.9 2.1-1.6 3.1-.2.3-.2.7.1.9.3.2.7.2 1 .1 1.1-.5 2.1-.9 3.1-1.2.9.4 1.9.6 2.9.6s2-.2 2.9-.6c1 .3 2 .7 3.1 1.2.3.1.7.1 1-.1.3-.2.3-.6.1-.9-.7-1-1.2-2-1.6-3.1 1.6-1 2.5-2.4 2.5-3.9 0-3-3.6-5.4-8-5.4zm0 13.5c-1.1 0-2.2-.2-3.1-.6-.5.1-1 .3-1.6.6-.1.1-.2.1-.4.1-.2 0-.4-.1-.5-.3-.1-.2-.1-.4.1-.5.4-.5.8-1 1.1-1.6-1.2-.8-1.9-1.9-1.9-3.1 0-2.3 2.8-4.2 6.3-4.2s6.3 1.9 6.3 4.2c0 1.2-.7 2.3-1.9 3.1.3.6.7 1.1 1.1 1.6.2.2.2.4.1.5-.1.2-.3.3-.5.3-.2 0-.3 0-.4-.1-.6-.3-1.1-.5-1.6-.6-.9.4-2 .6-3.1.6z"/></svg>
                      </div>
                      <h3 className="font-bold text-lg">Snapchat Pixel</h3>
                    </div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Pixel ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 12345678-1234-1234-1234-123456789012"
                      value={settings.snapchatPixelId || ''} 
                      onChange={e => setSettings({...settings, snapchatPixelId: e.target.value})} 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" 
                    />
                    <p className="text-xs text-slate-400 mt-2">Enter your Snapchat Pixel ID.</p>
                  </div>

                  {/* Google Analytics */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-400 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#F9AB00] rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M21.1 18.2c-.1-.1-.2-.2-.3-.3l-4.4-4.4c-.2-.2-.5-.2-.7 0l-1.4 1.4c-.2.2-.2.5 0 .7l4.4 4.4c.1.1.2.2.3.3.2.1.4.1.6 0l1.4-1.4c.3-.3.3-.8.1-1.1zM9.5 15c-3 0-5.5-2.5-5.5-5.5S6.5 4 9.5 4 15 6.5 15 9.5 12.5 15 9.5 15zm0-9c-1.9 0-3.5 1.6-3.5 3.5S7.6 13 9.5 13s3.5-1.6 3.5-3.5S11.4 6 9.5 6z"/></svg>
                      </div>
                      <h3 className="font-bold text-lg">Google Analytics 4</h3>
                    </div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Measurement ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. G-1234567890"
                      value={settings.googleAnalyticsId || ''} 
                      onChange={e => setSettings({...settings, googleAnalyticsId: e.target.value})} 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
                    />
                    <p className="text-xs text-slate-400 mt-2">Enter your GA4 Measurement ID (G-XXXXXX).</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'signature' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h2 className="text-xl font-bold text-blue-900 mb-2">Signature Exclusive Features</h2>
                  <p className="text-blue-700 text-sm">These settings only apply to the "Signature" template.</p>
                </div>

                {/* Live Sales */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-bold mb-4">Live Sales Notifications</h3>
                  <div className="flex items-center gap-12">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.signatureSettings?.liveSales?.enabled} 
                        onChange={e => setSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), liveSales: {...(settings.signatureSettings?.liveSales || {enabled: false, interval: 15000}), enabled: e.target.checked}}})} 
                        className="w-5 h-5 rounded accent-blue-600"
                      />
                      <span className="font-bold">Enable Live Notifications</span>
                    </label>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Interval (seconds)</label>
                      <input 
                        type="number" 
                        value={(settings.signatureSettings?.liveSales?.interval || 15000) / 1000} 
                        onChange={e => setSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), liveSales: {...(settings.signatureSettings?.liveSales || {enabled: false, interval: 15000}), interval: Number(e.target.value) * 1000}}})} 
                        className="w-32 px-4 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Testimonials */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Client Testimonials</h3>
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonials: [...(settings.signatureSettings?.testimonials || []), {name: '', role: '', content: ''}]}})}
                      className="text-xs font-black uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                    >
                      + Add Testimonial
                    </button>
                  </div>
                  
                  <div className="mb-6 flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700">Slide Interval (seconds):</label>
                    <input 
                      type="number" 
                      value={(settings.signatureSettings?.testimonialInterval || 5000) / 1000} 
                      onChange={e => setSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonialInterval: Number(e.target.value) * 1000}})} 
                      className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    {(settings.signatureSettings?.testimonials || []).map((testimonial: any, index: number) => (
                      <div key={index} className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                              <input 
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => {
                                  const newTestimonials = [...(settings.signatureSettings?.testimonials || [])];
                                  newTestimonials[index].name = e.target.value;
                                  setSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonials: newTestimonials}});
                                }}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                placeholder="Client Name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role / Title</label>
                              <input 
                                type="text"
                                value={testimonial.role}
                                onChange={(e) => {
                                  const newTestimonials = [...(settings.signatureSettings?.testimonials || [])];
                                  newTestimonials[index].role = e.target.value;
                                  setSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonials: newTestimonials}});
                                }}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                placeholder="e.g. CEO, Developer"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Testimonial Content</label>
                            <textarea 
                              value={testimonial.content}
                              onChange={(e) => {
                                const newTestimonials = [...(settings.signatureSettings?.testimonials || [])];
                                newTestimonials[index].content = e.target.value;
                                setSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonials: newTestimonials}});
                              }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                              rows={3}
                              placeholder="What the client said..."
                            />
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newTestimonials = [...(settings.signatureSettings?.testimonials || [])];
                            newTestimonials.splice(index, 1);
                            setSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonials: newTestimonials}});
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    {(settings.signatureSettings?.testimonials?.length || 0) === 0 && (
                      <div className="text-center py-8 text-slate-500 border border-dashed border-slate-300 rounded-lg">
                        No testimonials added yet. Click "Add Testimonial" to start.
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Shipping Rates */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                   <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Shipping Rates</h3>
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, businessSettings: {...(settings.businessSettings || {}), shippingRates: [...(settings.businessSettings?.shippingRates || []), {zone: '', rate: 0}]}})}
                      className="text-xs font-black uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                    >
                      + Add Shipping Zone
                    </button>
                  </div>
                  <div className="space-y-3">
                    {settings.businessSettings?.shippingRates?.map((rate, idx) => (
                       <div key={idx} className="flex gap-4 items-center">
                          <input 
                            type="text" 
                            placeholder="Zone (e.g. Cairo)" 
                            value={rate.zone} 
                            onChange={e => {
                              const newR = [...(settings.businessSettings?.shippingRates || [])];
                              newR[idx].zone = e.target.value;
                              setSettings({...settings, businessSettings: {...(settings.businessSettings || {}), shippingRates: newR}});
                            }}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none"
                          />
                          <input 
                            type="number" 
                            placeholder="Rate" 
                            value={rate.rate} 
                            onChange={e => {
                              const newR = [...(settings.businessSettings?.shippingRates || [])];
                              newR[idx].rate = Number(e.target.value);
                              setSettings({...settings, businessSettings: {...(settings.businessSettings || {}), shippingRates: newR}});
                            }}
                            className="w-32 px-4 py-2 border border-slate-200 rounded-lg outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newR = [...(settings.businessSettings?.shippingRates || [])];
                              newR.splice(idx, 1);
                              setSettings({...settings, businessSettings: {...(settings.businessSettings || {}), shippingRates: newR}});
                            }}
                            className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                          >
                            <X className="w-5 h-5" />
                          </button>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t flex items-center justify-between">
            <div>
              {saveMessage && (
                <span className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
                  {saveMessage}
                </span>
              )}
            </div>
            <button 
              type="submit" 
              disabled={isPending} 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
