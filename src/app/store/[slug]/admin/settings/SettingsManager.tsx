"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveStoreSettings } from "../actions";
import { Settings, Loader2, Save, X, Trash2, CheckCircle2, Globe } from "lucide-react";
import { StoreSettings } from "@/lib/types";
import MediaPicker from "../media/MediaPicker";
import { useLanguageStore } from '@/store/language';
import { toast } from 'sonner';

const PRESET_GRADIENTS = [
  'radial-gradient(ellipse at top, #0f172a, #0a0c14, #000000)', // Abyss
  'radial-gradient(circle at bottom left, rgba(88, 28, 135, 0.4), #0a0c14, #0a0c14)', // Nebula
  'linear-gradient(to bottom right, rgba(22, 78, 99, 0.4), #0a0c14, rgba(30, 58, 138, 0.4))', // Cyberpunk
  'radial-gradient(ellipse at center, rgba(120, 53, 15, 0.2), #0a0c14, #000000)', // Luxury Gold
  'linear-gradient(to bottom, #111827, #000000)', // Deep Space
  'linear-gradient(to right, #1e3a8a, #0f172a)' // Royal Blue
];

export default function SettingsManager({ 
  initialSettings, 
  activeTemplate,
  slug,
  storeType = 'ECOMMERCE'
}: { 
  initialSettings: StoreSettings;
  activeTemplate: string;
  slug: string;
  storeType?: string;
}) {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const { t, language } = useLanguageStore();
  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings);
    setIsDirty(true);
  };
  const [activeTab, setActiveTab] = useState("general");
  const [linkInput, setLinkInput] = useState<{ [key: string]: string }>({});
  const [synthTarget, setSynthTarget] = useState<{page: string, type: 'backgrounds' | 'text' | 'salePrice' | 'price'}>({ page: 'home', type: 'backgrounds' });
  const [gradA, setGradA] = useState('#0F172A');
  const [gradB, setGradB] = useState('#0A0C14');
  const [gradDir, setGradDir] = useState('to bottom');
  const [isAnimated, setIsAnimated] = useState(false);
  const router = useRouter();

  // Sync synthesis inputs when target changes
  useEffect(() => {
    if (!settings.colorSystem) return;
    
    const key = `${synthTarget.page}-${synthTarget.type}`;
    const savedState = settings.colorSystem.synthesisStates?.[key];
    
    if (savedState) {
      setGradA(savedState.a);
      setGradB(savedState.b);
      setGradDir(savedState.dir);
      if (synthTarget.type === 'backgrounds') {
         const targetP = synthTarget.page === 'all' ? 'home' : synthTarget.page;
         setIsAnimated(!!(settings.colorSystem as any).animatedBackgrounds?.[targetP]);
      } else {
         setIsAnimated(false);
      }
    } else {
      // Fallback: try to get the solid color if it's not a gradient
      let currentColor = '';
      if (synthTarget.type === 'salePrice' || synthTarget.type === 'price') {
         currentColor = settings.colorSystem.product?.[synthTarget.type] || '';
      } else if (synthTarget.page === 'footer') {
         currentColor = settings.colorSystem.footer?.[synthTarget.type === 'backgrounds' ? 'background' : 'text'] || '';
      } else if (synthTarget.page !== 'all') {
         const targetSection = synthTarget.type as 'backgrounds' | 'text';
         currentColor = (settings.colorSystem[targetSection] as any)?.[synthTarget.page] || '';
      }
      
      if (currentColor && currentColor.startsWith('#')) {
         setGradA(currentColor);
         setGradB('#0A0C14');
      }
    }
  }, [synthTarget.page, synthTarget.type, settings.colorSystem]);

     const defaultColorSystem = {
      backgrounds: { 
         home: '#ffffff', shop: '#f8fafc', categories: '#ffffff', 
         product: '#ffffff', cart: '#ffffff', checkout: '#ffffff' 
      },
      text: { 
         primary: '#0f172a', secondary: '#64748b',
         home: '#0f172a', shop: '#0f172a', categories: '#0f172a', 
         product: '#0f172a', cart: '#0f172a', checkout: '#0f172a' 
      },
      brand: { primary: '#000000' },
      footer: { background: '#0f172a', text: '#ffffff' },
      product: { price: '#0f172a', salePrice: '#ef4444' }
   };

   const colorSystem = settings.colorSystem ? {
      ...defaultColorSystem,
      ...settings.colorSystem,
      backgrounds: { ...defaultColorSystem.backgrounds, ...(settings.colorSystem.backgrounds || {}) },
      text: { ...defaultColorSystem.text, ...(settings.colorSystem.text || {}) },
      footer: { ...defaultColorSystem.footer, ...(settings.colorSystem.footer || {}) }
   } : defaultColorSystem;

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
      try {
        await saveStoreSettings(slug, settings);
        toast.success(t('settingsSaved'));
        setIsDirty(false);
        router.refresh();
      } catch (e) {
        toast.error(t('failedToSaveColors'));
      }
    });
  };

  const tabs = [
    { id: "general", label: t('general') },
    { id: "theme", label: t('theme') },
    { id: "header", label: t('header') },
    { id: "signature", label: t('signature') },
    { id: "tracking", label: t('tracking') },
    ...(storeType === 'WEBSITE' ? [] : [
      { id: "business", label: t('business') },
    ]),
  ];

  return (
    <div dir={language === 'ar' ? "rtl" : "ltr"} className={`animate-in fade-in duration-700 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter text-white uppercase">
            {t('storeCore')}
          </h1>
          <p className="text-slate-500 mt-1 font-medium tracking-[0.08em] text-[10px] uppercase">{t('masterControl')}</p>
        </div>
        
        <div className="flex bg-white/5 backdrop-blur-3xl p-1.5 rounded-xl border border-white/5 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.08em] transition-all duration-500 whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500 text-white shadow-[0_10px_20px_rgba(6,182,212,0.3)] scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'} ${language === 'ar' ? 'font-arabic' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <form onSubmit={handleSave}>
              <div className="space-y-5">
            {activeTab === 'general' && (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
                {/* Identity Settings */}
                <div className="admin-card backdrop-blur-3xl rounded-xl p-5 border admin-border shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[80px] -z-10"></div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-0.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-base font-black text-white italic uppercase tracking-tight">{t('brandMatrix')}</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-1">{t('marketIdentity')}</label>
                      <input 
                        type="text" 
                        value={settings.storeName} 
                        onChange={e => updateSettings({...settings, storeName: e.target.value})} 
                        className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-[0.75rem] px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-black uppercase tracking-tight italic text-sm ${language === 'ar' ? 'font-arabic text-right' : ''}`} 
                        placeholder={t('enterStoreName')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-1">{t('seoSignal')}</label>
                      <input 
                        type="text" 
                        value={settings.description || ''} 
                        onChange={e => updateSettings({...settings, description: e.target.value})} 
                        className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-[0.75rem] px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold text-xs ${language === 'ar' ? 'font-arabic text-right' : ''}`} 
                        placeholder={t('premiumExperience')}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-1">{t('signatureLogo')}</label>
                      <div className="bg-white/[0.03] border border-white/[0.05] rounded-[0.75rem] p-3">
                        <MediaPicker 
                          slug={slug}
                          value={settings.logoUrl || ''} 
                          onChange={url => updateSettings({...settings, logoUrl: url})} 
                          className="bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-1">{t('browserNode')}</label>
                      <div className="bg-white/[0.03] border border-white/[0.05] rounded-[0.75rem] p-3">
                        <MediaPicker 
                          slug={slug}
                          value={settings.faviconUrl || ''} 
                          onChange={url => updateSettings({...settings, faviconUrl: url})} 
                          className="bg-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 px-2">
                        <div className="w-0.5 h-0.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        <p className={`text-[7px] text-slate-500 font-medium tracking-wide ${language === 'ar' ? 'font-arabic' : ''}`}>{language === 'ar' ? "المقاس القياسي: 32x32 بكسل أو 64x64 بكسل." : "Global standard: 32x32px or 64x64px Resource."}</p>
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-white/[0.02] p-4 rounded-xl border border-white/[0.03] flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-center px-1">
                          <h4 className={`text-[8px] font-black text-slate-400 uppercase tracking-[0.08em] ${language === 'ar' ? 'font-arabic' : ''}`}>{language === 'ar' ? "حجم شعار الترويسة" : "Header Logo Scale"}</h4>
                          <span className="text-[8px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">{settings.headerSettings?.logoHeight || 40}PX</span>
                        </div>
                        <input 
                          type="range" 
                          min="20" 
                          max="120" 
                          step="4"
                          value={settings.headerSettings?.logoHeight || 40} 
                          onChange={(e) => updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), logoHeight: Number(e.target.value)}})} 
                          className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                      </div>

                      <div className="w-[1px] bg-white/5 hidden md:block"></div>

                      <div className="flex-1 flex items-center gap-3">
                        <div className={`flex-1 ${language === 'ar' ? 'text-right' : ''}`}>
                          <h4 className={`text-[9px] font-black text-white uppercase tracking-[0.08em] ${language === 'ar' ? 'font-arabic' : ''}`}>{language === 'ar' ? "دمج الشفافية (Alpha)" : "Alpha Synthesis"}</h4>
                          <p className={`text-[8px] text-slate-500 mt-1 font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>{language === 'ar' ? "إزالة الخلفية من ملف الشعار في الترويسة." : "Remove background from header logo resource."}</p>
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

                <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className={`text-lg font-black text-white italic uppercase tracking-tighter ${language === 'ar' ? 'font-arabic' : ''}`}>{language === 'ar' ? "قنوات الاتصال" : "Comm Channels"}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{language === 'ar' ? "البريد الإلكتروني للاتصال" : "Uplink Email"}</label>
                      <input 
                        type="email" 
                        value={settings.contactInfo?.email || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), email: e.target.value}})} 
                        className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-black italic ${language === 'ar' ? 'font-arabic text-right' : ''}`} 
                        placeholder="support@hq.com"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{language === 'ar' ? "رقم الهاتف المباشر" : "Voice Direct"}</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.phone || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), phone: e.target.value}})} 
                        className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-black tracking-[0.08em] ${language === 'ar' ? 'font-arabic text-right' : ''}`} 
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{language === 'ar' ? "رقم الواتساب الآمن" : "Secure WhatsApp"}</label>
                      <input 
                        type="text" 
                        value={settings.contactInfo?.whatsapp || ''} 
                        onChange={e => updateSettings({...settings, contactInfo: {...(settings.contactInfo || {phone:'', email:'', address:''}), whatsapp: e.target.value}})} 
                        className="w-full bg-white/[0.03] border border-green-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-black tracking-[0.08em] border-l-4 border-l-green-500" 
                        placeholder="+1 (000) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'header' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className={`text-lg font-black text-white italic uppercase tracking-tighter ${language === 'ar' ? 'font-arabic' : ''}`}>{t('headerTopology')}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { id: 'default', name: language === 'ar' ? 'تقليدي' : 'Legacy', desc: language === 'ar' ? 'المعايير والهيكلية الأصلية.' : 'Original structure parameters.' },
                      { id: 'standard', name: language === 'ar' ? 'متماثل' : 'Symmetric', desc: language === 'ar' ? 'الشعار على اليسار، مع روابط متوازنة في المنتصف.' : 'Logo Left, Balanced Central Matrix.' },
                      { id: 'centered', name: language === 'ar' ? 'تركيز' : 'Focus', desc: language === 'ar' ? 'الروابط على اليسار، الشعار في المنتصف.' : 'Links Left, Identity Center Node.' },
                      { id: 'minimal', name: language === 'ar' ? 'مبسط' : 'Discrete', desc: language === 'ar' ? 'شعار خفي، يركز على الإجراءات.' : 'Stealth Identity, Action Focused.' },
                      { id: 'luxury', name: language === 'ar' ? 'فاخر' : 'High-End', desc: language === 'ar' ? 'هوية مكدسة رأسياً بمظهر فاخر.' : 'Vertical Stacked Premium Identity.' },
                      { id: 'hamburger', name: language === 'ar' ? 'مرن (همبرغر)' : 'Fluid', desc: language === 'ar' ? 'واجهة ديناميكية مصممة للهواتف أولاً.' : 'Mobile-First Dynamic Interface.' }
                    ].map((layout) => (
                      <label 
                        key={layout.id} 
                        className={`group relative cursor-pointer p-5 rounded-xl border transition-all duration-500 ${
                          (settings.headerSettings?.layout || 'default') === layout.id 
                            ? 'border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                           <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                             (settings.headerSettings?.layout || 'default') === layout.id 
                               ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30' 
                               : 'bg-white/5 border-white/5 text-slate-700 group-hover:text-cyan-400'
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
                        <p className={`font-black text-sm mb-1 transition-colors uppercase italic ${language === 'ar' ? 'font-arabic' : ''} ${(settings.headerSettings?.layout || 'default') === layout.id ? 'text-cyan-400' : 'text-white'}`}>{layout.name}</p>
                        <p className={`text-[9px] text-slate-500 leading-relaxed font-medium uppercase tracking-[0.08em] ${language === 'ar' ? 'font-arabic' : ''}`}>{layout.desc}</p>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative">
                   <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                      <h2 className={`text-lg font-black text-white italic uppercase tracking-tighter ${language === 'ar' ? 'font-arabic' : ''}`}>{t('navigationNodes')}</h2>
                    </div>
                    <button 
                      type="button"
                      onClick={() => updateSettings({...settings, headerSettings: {...(settings.headerSettings || {}), links: [...(settings.headerSettings?.links || [{id: '1', label: 'Home', url: `/store/${slug}`}, {id: '2', label: 'Shop', url: `/store/${slug}/categories`}]), {id: Math.random().toString(36).substr(2, 9), label: 'New Link', url: '#'}]}})}
                      className={`px-5 py-3 bg-cyan-500 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.08em] hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(6,182,212,0.3)] ${language === 'ar' ? 'font-arabic' : ''}`}
                    >
                      {t('injectLink')}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {((settings.headerSettings?.links?.length ?? 0) > 0 ? settings.headerSettings!.links! : [
                      {id: '1', label: 'Home', url: `/store/${slug}`},
                      {id: '2', label: 'Shop', url: `/store/${slug}/categories`}
                    ]).map((link: any, idx: number) => (
                      <div key={link.id} className="flex gap-4 items-center p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:border-white/10 transition-all group/node relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -z-10 group-hover/node:bg-cyan-500/5 transition-all"></div>
                        <div className="flex-1 space-y-3">
                           <label className={`block text-[8px] font-black text-slate-600 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('label')}</label>
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
                             className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-[11px] uppercase italic ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                           />
                        </div>
                        <div className="flex-[2] space-y-3">
                           <label className={`block text-[8px] font-black text-slate-600 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('uplinkPath')}</label>
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
                             className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-bold text-[11px]"
                           />
                        </div>
                        <div className="pt-6">
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
                             className="w-10 h-10 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            
            
            {activeTab === 'theme' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] -z-10"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                      <div className={`${language === 'ar' ? 'text-right' : ''}`}>
                        <h2 className={`text-xl font-black text-white italic uppercase tracking-tighter ${language === 'ar' ? 'font-arabic' : ''}`}>{t('colorArchitecture')}</h2>
                        <p className={`text-slate-500 text-[9px] font-medium tracking-[0.08em] uppercase mt-0.5 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('colorArchitectureDesc')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Gradient Matrix (Mixed Colors) */}
                  <div className="mb-6 bg-white/[0.02] p-6 rounded-2xl border border-white/[0.08] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                     
                     <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
                           <div className={`${language === 'ar' ? 'text-right' : ''}`}>
                              <h3 className={`text-base font-black text-white uppercase italic tracking-tighter ${language === 'ar' ? 'font-arabic' : ''}`}>{t('aestheticSynthesis')}</h3>
                              <p className={`text-[8px] font-black text-slate-500 tracking-[0.08em] mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('globalColorControl')}</p>
                           </div>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-[0.08em] shadow-xl">{t('versionActive')}</div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
                         <div className="space-y-3">
                            <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('phaseA')}</label>
                            <div className="relative group/synthesis h-14 bg-black/60 rounded-xl border border-white/[0.1] hover:border-cyan-400/50 transition-all overflow-hidden flex items-center justify-center">
                               <input 
                                 type="color" 
                                 value={gradA} 
                                 className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-30" 
                                 onChange={(e) => setGradA(e.target.value.toUpperCase())}
                               />
                               <div className="absolute inset-0 z-10 opacity-30 group-hover/synthesis:opacity-50 transition-opacity" style={{backgroundColor: gradA}}></div>
                               <div className="relative z-20 text-white font-mono text-sm uppercase font-black text-center w-full pointer-events-none">
                                  {gradA}
                               </div>
                            </div>
                         </div>

                          <div className="space-y-3">
                             <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('phaseB')}</label>
                             <div className="relative group/synthesis h-14 bg-black/60 rounded-xl border border-white/[0.1] hover:border-pink-400/50 transition-all overflow-hidden flex items-center justify-center">
                               <input 
                                 type="color" 
                                 value={gradB} 
                                 className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-30" 
                                 onChange={(e) => setGradB(e.target.value.toUpperCase())}
                               />
                               <div className="absolute inset-0 z-10 opacity-30 group-hover/synthesis:opacity-50 transition-opacity" style={{backgroundColor: gradB}}></div>
                               <div className="relative z-20 text-white font-mono text-sm uppercase font-black text-center w-full pointer-events-none">
                                  {gradB}
                               </div>
                            </div>
                         </div>

                          <div className="space-y-3">
                             <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('flowPattern')}</label>
                             <div className="h-14 bg-black/60 rounded-xl border border-white/[0.1] flex items-center px-2">
                                <select 
                                  value={gradDir} 
                                  onChange={(e) => setGradDir(e.target.value)}
                                  className={`w-full bg-transparent p-3 text-white text-[10px] uppercase font-black outline-none cursor-pointer ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                               >
                                  <option value="to bottom" className="bg-slate-900">{t('linearVertical')}</option>
                                  <option value="to right" className="bg-slate-900">{t('linearHorizontal')}</option>
                                  <option value="to bottom right" className="bg-slate-900">{t('diagonalFlow')}</option>
                                  <option value="radial-gradient(circle at center" className="bg-slate-900">{t('radialCore')}</option>
                               </select>
                            </div>
                         </div>

                        <div className="space-y-3">
                           <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('injectionNode')}</label>
                           <div className="h-14 bg-black/60 rounded-xl border border-white/[0.1] flex items-center px-2">
                              <select 
                                value={synthTarget.page}
                                onChange={(e) => setSynthTarget({...synthTarget, page: e.target.value})}
                                className={`w-full bg-transparent p-3 text-white text-[10px] uppercase font-black outline-none cursor-pointer ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                              >
                                {storeType === 'WEBSITE' ? (
                                  <>
                                    <option value="all" className="bg-slate-900">{t('globalFullMesh')}</option>
                                    <option value="home" className="bg-slate-900">{t('nexusHome')}</option>
                                    <option value="footer" className="bg-slate-900">{t('baseFooter')}</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="all" className="bg-slate-900">{t('globalFullMesh')}</option>
                                    <option value="home" className="bg-slate-900">{t('nexusHome')}</option>
                                    <option value="shop" className="bg-slate-900">{t('archiveShop')}</option>
                                    <option value="categories" className="bg-slate-900">{t('neuralCategories')}</option>
                                    <option value="product" className="bg-slate-900">{t('signalProduct')}</option>
                                    <option value="cart" className="bg-slate-900">{t('gatewayCart')}</option>
                                    <option value="checkout" className="bg-slate-900">{t('secureCheckout')}</option>
                                    <option value="footer" className="bg-slate-900">{t('baseFooter')}</option>
                                  </>
                                )}
                              </select>
                           </div>
                        </div>

                          <div className="space-y-3">
                             <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('targetStream')}</label>
                             <div className="h-14 bg-black/60 rounded-xl border border-white/[0.1] flex items-center px-2">
                                <select 
                                  value={synthTarget.type}
                                  onChange={(e) => setSynthTarget({...synthTarget, type: e.target.value as any})}
                                  className={`w-full bg-transparent p-3 text-white text-[10px] uppercase font-black outline-none cursor-pointer ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                               >
                                  <option value="backgrounds" className="bg-slate-900">{t('atmosphereBg')}</option>
                                  <option value="text" className="bg-slate-900">{t('frequencyText')}</option>
                               </select>
                            </div>
                         </div>

                          <div className={`space-y-3 ${synthTarget.type !== 'backgrounds' ? 'opacity-50 pointer-events-none' : ''}`}>
                             <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('kineticMotion')}</label>
                             <div className="flex bg-black/60 rounded-xl border border-white/[0.1] p-1.5 h-14">
                               <button 
                                 type="button" 
                                 onClick={() => setIsAnimated(false)}
                                 className={`flex-1 rounded-[1rem] text-[11px] font-black uppercase tracking-[0.08em] transition-all duration-300 ${!isAnimated ? 'bg-white text-black shadow-lg scale-100' : 'text-slate-500 hover:text-white scale-95'} ${language === 'ar' ? 'font-arabic text-[9px]' : ''}`}
                               >
                                  {t('static')}
                               </button>
                               <button 
                                 type="button" 
                                 onClick={() => setIsAnimated(true)}
                                 className={`flex-1 rounded-[1rem] text-[11px] font-black uppercase tracking-[0.08em] transition-all duration-300 ${isAnimated ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-100' : 'text-slate-500 hover:text-white scale-95'} ${language === 'ar' ? 'font-arabic text-[9px]' : ''}`}
                               >
                                  {t('animated')}
                               </button>
                            </div>
                         </div>

                        <div className="flex items-end">
                          <button 
                            type="button"
                             onClick={() => {
                                const a = gradA;
                                const b = gradB;
                                const dir = gradDir;
                                const grad = dir.includes('radial') ? `${dir}, ${a}, ${b})` : `linear-gradient(${dir}, ${a}, ${b})`;
                                
                                let newColorSystem = { ...colorSystem };

                                // Persist the synthesis state
                                if (!(newColorSystem as any).synthesisStates) (newColorSystem as any).synthesisStates = {};
                                if (!(newColorSystem as any).animatedBackgrounds) (newColorSystem as any).animatedBackgrounds = {};
                                
                                if (synthTarget.page === 'all') {
                                   const pages = ['home', 'shop', 'categories', 'product', 'cart', 'checkout'];
                                   pages.forEach(p => {
                                      (newColorSystem as any).synthesisStates[`${p}-${synthTarget.type}`] = { a, b, dir };
                                      if (synthTarget.type === 'backgrounds') {
                                         (newColorSystem as any).animatedBackgrounds[p] = isAnimated;
                                      }
                                   });
                                   (newColorSystem as any).synthesisStates[`footer-${synthTarget.type}`] = { a, b, dir };
                                   (newColorSystem as any).synthesisStates[`all-${synthTarget.type}`] = { a, b, dir };
                                } else {
                                   const key = `${synthTarget.page}-${synthTarget.type}`;
                                   (newColorSystem as any).synthesisStates[key] = { a, b, dir };
                                   if (synthTarget.type === 'backgrounds') {
                                      (newColorSystem as any).animatedBackgrounds[synthTarget.page] = isAnimated;
                                   }
                                }

                                if (synthTarget.type === 'salePrice' || synthTarget.type === 'price') {
                                   newColorSystem.product = {
                                      ...newColorSystem.product,
                                      [synthTarget.type]: grad
                                   };
                                } else if (synthTarget.page === 'all') {
                                   // Apply to everything
                                   if (synthTarget.type === 'backgrounds') {
                                      newColorSystem.backgrounds = {
                                         home: grad, shop: grad, categories: grad, product: grad, cart: grad, checkout: grad
                                      };
                                      newColorSystem.footer = { ...newColorSystem.footer, background: grad };
                                   } else {
                                      newColorSystem.text = {
                                         ...newColorSystem.text,
                                         home: grad, shop: grad, categories: grad, product: grad, cart: grad, checkout: grad
                                      };
                                      newColorSystem.footer = { ...newColorSystem.footer, text: grad };
                                   }
                                } else if (synthTarget.page === 'footer') {
                                   newColorSystem.footer = { 
                                     ...newColorSystem.footer, 
                                     [synthTarget.type === 'backgrounds' ? 'background' : 'text']: grad 
                                   };
                                } else {
                                   const targetSection = synthTarget.type as 'backgrounds' | 'text';
                                   newColorSystem[targetSection] = {
                                     ...(newColorSystem[targetSection] as any),
                                     [synthTarget.page]: grad
                                   };
                                }

                                updateSettings({
                                  ...settings, 
                                  colorSystem: newColorSystem
                                });
                             }}
                              className="w-full h-14 bg-white text-black rounded-xl font-black uppercase tracking-[0.08em] text-[10px] hover:bg-cyan-400 hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 flex flex-col items-center justify-center gap-0.5 group/btn"
                           >
                              <span className={`group-hover/btn:scale-110 transition-transform ${language === 'ar' ? 'font-arabic' : ''}`}>{t('applySynthesis')}</span>
                              <span className={`text-[7px] opacity-40 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('syncToCloud')}</span>
                           </button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Page Specific Settings */}
                    {([
                      { id: 'home', label: t('homePageLabel'), desc: t('homePageDesc') },
                      { id: 'shop', label: t('productGalleryLabel'), desc: t('productGalleryDesc') },
                      { id: 'categories', label: t('collectionsLabel'), desc: t('collectionsDesc') },
                      { id: 'product', label: t('productDetailsLabel'), desc: t('productDetailsDesc') },
                      { id: 'cart', label: t('shoppingCartLabel'), desc: t('shoppingCartDesc') },
                      { id: 'checkout', label: t('checkoutPhaseLabel'), desc: t('checkoutPhaseDesc') }
                    ] as { id: string; label: string; desc: string }[]).filter(page => storeType !== 'WEBSITE' || page.id === 'home').map((page) => (
                      <div key={page.id} className="bg-white/[0.02] p-6 rounded-xl border border-white/[0.05] hover:border-white/10 transition-all group/page">
                        <div className="flex items-center gap-2 mb-6">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover/page:scale-150 transition-transform"></div>
                          <h3 className={`text-xs font-black text-white uppercase italic tracking-wider ${language === 'ar' ? 'font-arabic' : ''}`}>{page.label}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Background Color */}
                          <div className="space-y-3">
                            <label className={`block text-[8px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('atmosphereBg')}</label>
                            <div className="flex gap-3 items-center bg-black/40 p-2.5 rounded-2xl border border-white/[0.05]">
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0" style={{ background: (colorSystem.backgrounds as any)[page.id] || '#ffffff' }}>
                                <input 
                                  type="color" 
                                  value={((colorSystem.backgrounds as any)[page.id] || '').includes('gradient') ? '#000000' : ((colorSystem.backgrounds as any)[page.id] || '#ffffff')} 
                                  onChange={e => updateSettings({
                                    ...settings, 
                                    colorSystem: { 
                                      ...colorSystem, 
                                      backgrounds: { ...colorSystem.backgrounds, [page.id]: e.target.value } 
                                    }
                                  })} 
                                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                                />
                              </div>
                              <input 
                                type="text" 
                                value={(colorSystem.backgrounds as any)[page.id] || '#ffffff'} 
                                onChange={e => updateSettings({
                                  ...settings, 
                                  colorSystem: { 
                                    ...colorSystem, 
                                    backgrounds: { ...colorSystem.backgrounds, [page.id]: e.target.value } 
                                  }
                                })} 
                                className="flex-1 bg-transparent text-white focus:outline-none font-mono text-[10px] uppercase font-black" 
                              />
                            </div>
                          </div>

                          {/* Text Color */}
                          <div className="space-y-3">
                            <label className={`block text-[8px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('frequencyText')}</label>
                            <div className="flex gap-3 items-center bg-black/40 p-2 rounded-xl border border-white/[0.05]">
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0" style={{ backgroundColor: (colorSystem.text as any)[page.id] || '#000000' }}>
                                <input 
                                  type="color" 
                                  value={(colorSystem.text as any)[page.id] || '#000000'} 
                                  onChange={e => updateSettings({
                                    ...settings, 
                                    colorSystem: { 
                                      ...colorSystem, 
                                      text: { ...colorSystem.text, [page.id]: e.target.value } 
                                    }
                                  })} 
                                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                                />
                              </div>
                              <input 
                                type="text" 
                                value={(colorSystem.text as any)[page.id] || '#000000'} 
                                onChange={e => updateSettings({
                                  ...settings, 
                                  colorSystem: { 
                                    ...colorSystem, 
                                    text: { ...colorSystem.text, [page.id]: e.target.value } 
                                  }
                                })} 
                                className="flex-1 bg-transparent text-white focus:outline-none font-mono text-[9px] uppercase font-black" 
                              />
                            </div>
                          </div>

                          {/* Gradient Presets for Background */}
                          <div className="col-span-full pt-1">
                             <div className="flex flex-wrap gap-1.5">
                                {PRESET_GRADIENTS.map((grad, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => updateSettings({
                                      ...settings, 
                                      colorSystem: { 
                                        ...colorSystem, 
                                    backgrounds: { ...colorSystem.backgrounds, [page.id]: grad } 
                                      }
                                    })}
                                    className="w-4 h-4 rounded-lg border border-white/10 hover:scale-125 hover:rotate-6 transition-all cursor-pointer shadow-xl active:scale-95"
                                    style={{ background: grad }}
                                    title={language === 'ar' ? "تطبيق التدرج" : "Inject Gradient Matrix"}
                                  />
                                ))}
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-6">
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/[0.02] to-transparent pointer-events-none"></div>
                        <h3 className={`text-[9px] font-black uppercase tracking-[0.08em] text-slate-500 mb-6 border-b border-white/5 pb-3 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('globalSignalFooter')}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           {/* Brand Color */}
                           <div className="space-y-3">
                             <label className={`block text-[8px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('primaryBrandIdentity')}</label>
                             <div className="flex gap-3 items-center bg-black/40 p-3 rounded-2xl border border-white/[0.05]">
                               <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-2xl shrink-0" style={{ backgroundColor: colorSystem.brand.primary }}>
                                 <input 
                                   type="color" 
                                   value={colorSystem.brand.primary} 
                                   onChange={e => updateSettings({
                                     ...settings, 
                                     colorSystem: { ...colorSystem, brand: { ...colorSystem.brand, primary: e.target.value } }
                                   })} 
                                   className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                                 />
                               </div>
                               <input 
                                 type="text" 
                                 value={colorSystem.brand.primary} 
                                 onChange={e => updateSettings({
                                   ...settings, 
                                   colorSystem: { ...colorSystem, brand: { ...colorSystem.brand, primary: e.target.value } }
                                 })} 
                                 className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs uppercase font-black" 
                               />
                             </div>
                           </div>

                           {/* Footer Background */}
                           <div className="space-y-3">
                             <label className={`block text-[8px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('footerAtmosphereBg')}</label>
                             <div className="flex gap-3 items-center bg-black/40 p-3 rounded-2xl border border-white/[0.05]">
                               <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-2xl shrink-0" style={{ background: colorSystem.footer.background }}>
                                 <input 
                                   type="color" 
                                   value={colorSystem.footer.background.includes('gradient') ? '#000000' : colorSystem.footer.background} 
                                   onChange={e => updateSettings({
                                     ...settings, 
                                     colorSystem: { ...colorSystem, footer: { ...colorSystem.footer, background: e.target.value } }
                                   })} 
                                   className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                                 />
                               </div>
                               <input 
                                 type="text" 
                                 value={colorSystem.footer.background} 
                                 onChange={e => updateSettings({
                                   ...settings, 
                                   colorSystem: { ...colorSystem, footer: { ...colorSystem.footer, background: e.target.value } }
                                 })} 
                                 className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs uppercase font-black" 
                               />
                             </div>
                           </div>

                           {/* Footer Text */}
                           <div className="space-y-3">
                             <label className={`block text-[8px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('footerSignalText')}</label>
                             <div className="flex gap-3 items-center bg-black/40 p-3 rounded-2xl border border-white/[0.05]">
                               <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-2xl shrink-0" style={{ backgroundColor: colorSystem.footer.text }}>
                                 <input 
                                   type="color" 
                                   value={colorSystem.footer.text} 
                                   onChange={e => updateSettings({
                                     ...settings, 
                                     colorSystem: { ...colorSystem, footer: { ...colorSystem.footer, text: e.target.value } }
                                   })} 
                                   className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                                 />
                               </div>
                               <input 
                                 type="text" 
                                 value={colorSystem.footer.text} 
                                 onChange={e => updateSettings({
                                   ...settings, 
                                   colorSystem: { ...colorSystem, footer: { ...colorSystem.footer, text: e.target.value } }
                                 })} 
                                 className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs uppercase font-black" 
                               />
                             </div>
                           </div>

                        </div>
                     </div>
                  </div>

                  {/* Financial Signal Matrix */}
                  <div className="mb-6 bg-white/[0.02] p-6 rounded-2xl border border-white/[0.08] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                     
                     <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                           <div className={`${language === 'ar' ? 'text-right' : ''}`}>
                              <h3 className={`text-base font-black text-white uppercase italic tracking-tighter ${language === 'ar' ? 'font-arabic' : ''}`}>{t('financialSignalMatrix')}</h3>
                              <p className={`text-[8px] font-black text-slate-500 tracking-[0.08em] mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('priceDynamicsControl')}</p>
                           </div>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-400 uppercase tracking-[0.08em] shadow-xl">{t('economyModule')}</div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-3">
                           <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('corePriceSignal')}</label>
                           <div className="relative group/price h-16 bg-black/60 rounded-xl border border-white/[0.1] hover:border-slate-400 transition-all overflow-hidden flex items-center justify-center">
                              <input 
                                type="color" 
                                value={colorSystem.product?.price || '#0f172a'} 
                                onChange={(e) => {
                                   updateSettings({
                                      ...settings,
                                      colorSystem: {
                                         ...colorSystem,
                                         product: { ...colorSystem.product, price: e.target.value }
                                      }
                                   });
                                }}
                                className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-30" 
                              />
                              <div className="absolute inset-0 z-10 opacity-20 group-hover/price:opacity-40 transition-opacity" style={{backgroundColor: colorSystem.product?.price || '#0f172a'}}></div>
                              <div className="relative z-20 flex flex-col items-center">
                                 <span className="text-white font-mono text-lg uppercase font-black tracking-[0.08em]">{colorSystem.product?.price || '#0F172A'}</span>
                                 <span className={`text-[8px] text-slate-500 uppercase font-black mt-2 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('standardRateColor')}</span>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className={`block text-[9px] font-black text-slate-500 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('pulseSignalSale')}</label>
                           <div className="relative group/price h-16 bg-black/60 rounded-xl border border-white/[0.1] hover:border-red-500/50 transition-all overflow-hidden flex items-center justify-center">
                              <input 
                                type="color" 
                                value={colorSystem.product?.salePrice || '#ef4444'} 
                                onChange={(e) => {
                                   updateSettings({
                                      ...settings,
                                      colorSystem: {
                                         ...colorSystem,
                                         product: { ...colorSystem.product, salePrice: e.target.value }
                                      }
                                   });
                                }}
                                className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-30" 
                              />
                              <div className="absolute inset-0 z-10 opacity-20 group-hover/price:opacity-40 transition-opacity" style={{backgroundColor: colorSystem.product?.salePrice || '#ef4444'}}></div>
                              <div className="relative z-20 flex flex-col items-center">
                                 <span className="text-red-500 font-mono text-lg uppercase font-black tracking-[0.08em]">{colorSystem.product?.salePrice || '#EF4444'}</span>
                                 <span className={`text-[8px] text-slate-500 uppercase font-black mt-2 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('discountPulseColor')}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
            


            {activeTab === 'tracking' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className={`text-lg font-black text-white italic uppercase tracking-tighter ${language === 'ar' ? 'font-arabic' : ''}`}>{t('observatoryPixels')}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 'facebookPixelId', name: language === 'ar' ? 'بكسل ميتا (فيسبوك)' : 'Meta Pixel', color: 'bg-blue-600', placeholder: '1234567890' },
                      { id: 'tiktokPixelId', name: language === 'ar' ? 'إشارات تيك توك' : 'TikTok Signal', color: 'bg-slate-900', placeholder: 'C1234567890' },
                      { id: 'snapchatPixelId', name: language === 'ar' ? 'سناب شات' : 'Snap Snapchat', color: 'bg-yellow-400', placeholder: '123456-7890' },
                      { id: 'googleAnalyticsId', name: language === 'ar' ? 'تحليلات جوجل (GA4)' : 'Analytics G4', color: 'bg-orange-500', placeholder: 'G-XXXXXXXX' }
                    ].map((pixel) => (
                      <div key={pixel.id} className="bg-white/[0.02] p-6 rounded-xl border border-white/[0.05] space-y-4 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl -z-10 group-hover:bg-cyan-500/5 transition-all"></div>
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-2xl ${pixel.color}`}>
                               <Settings size={16} />
                            </div>
                            <h3 className={`text-sm font-black text-white uppercase italic tracking-tight ${language === 'ar' ? 'font-arabic' : ''}`}>{pixel.name}</h3>
                         </div>
                         <div className="space-y-2">
                            <label className={`block text-[8px] font-black text-slate-600 tracking-[0.08em] ml-2 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>{t('secretId')}</label>
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
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative">
                   <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">
                      {t('signature')}
                    </h2>
                  </div>

                  {storeType !== 'WEBSITE' && (
                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05] mb-6 group">
                       <div className="flex items-center justify-between mb-6">
                          <div>
                             <h3 className="text-base font-black text-white uppercase italic tracking-tight">{t('livePulse')}</h3>
                             <p className="text-[9px] text-slate-500 mt-1 font-medium uppercase tracking-[0.08em]">{language === 'ar' ? "إشعار فوري بحركات الشراء للمتصفحين" : "Real-time social proof stream for visitors."}</p>
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
                             <div className="w-11 h-6 bg-white/5 rounded-full peer peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                          </label>
                       </div>
                       {settings.signatureSettings?.liveSales?.enabled && (
                         <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.05] flex items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                            <div className="flex-1 space-y-2">
                               <label className="block text-[8px] font-black text-slate-500 tracking-[0.08em] ml-2">{t('pulseInterval')}</label>
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
                                   className="w-28 bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-xs"
                                />
                             </div>
                          </div>
                        )}
                     </div>
                   )}

                  <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05]">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-black text-white uppercase italic tracking-tight">
                          {t('socialProof')}
                        </h3>
                        <button 
                          type="button"
                          onClick={() => updateSettings({...settings, signatureSettings: {...(settings.signatureSettings || {}), testimonials: [...(settings.signatureSettings?.testimonials || []), {name: '', role: '', content: ''}]}})}
                          className={`px-4 py-2.5 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-[0.08em] hover:bg-cyan-400 hover:text-white transition-all shadow-2xl ${language === 'ar' ? 'font-arabic' : ''}`}
                        >
                          {t('injectReview')}
                        </button>
                     </div>

                     <div className="space-y-4">
                        {(settings.signatureSettings?.testimonials || []).map((t: any, idx: number) => (
                           <div key={idx} className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.05] shadow-2xl relative group/card transition-all hover:bg-white/[0.05]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                 <div className="space-y-2">
                                    <label className="text-[8px] font-black text-slate-600 tracking-[0.08em] ml-2">{t('identity')}</label>
                                    <input 
                                       type="text" 
                                       value={t.name}
                                       placeholder={language === 'ar' ? "الاسم الكامل" : "Subject Name"}
                                       onChange={e => {
                                          const newList = [...(settings.signatureSettings?.testimonials || [])];
                                          newList[idx].name = e.target.value;
                                          updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                       }}
                                       className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-[11px] uppercase ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[8px] font-black text-slate-600 tracking-[0.08em] ml-2">{t('coordinates')}</label>
                                    <input 
                                       type="text" 
                                       value={t.role}
                                       placeholder={language === 'ar' ? "الوظيفة / الموقع" : "Sector / Location"}
                                       onChange={e => {
                                          const newList = [...(settings.signatureSettings?.testimonials || [])];
                                          newList[idx].role = e.target.value;
                                          updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                       }}
                                       className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-bold text-[11px] uppercase ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-slate-600 tracking-[0.08em] ml-2">{t('reviewContent')}</label>
                                 <textarea 
                                    value={t.content}
                                    placeholder={language === 'ar' ? "اكتب نص المراجعة هنا..." : "Input signal content..."}
                                    rows={3}
                                    onChange={e => {
                                       const newList = [...(settings.signatureSettings?.testimonials || [])];
                                       newList[idx].content = e.target.value;
                                       updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                    }}
                                    className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium text-[11px] leading-relaxed italic ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                                 />
                              </div>
                              <button 
                                 type="button"
                                 onClick={() => {
                                    const newList = [...(settings.signatureSettings?.testimonials || [])];
                                    newList.splice(idx, 1);
                                    updateSettings({...settings, signatureSettings: {...settings.signatureSettings, testimonials: newList}});
                                  }}
                                 className={`mt-6 text-[8px] font-black text-rose-500 uppercase tracking-[0.1em] hover:text-rose-400 transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}
                              >
                                 {language === 'ar' ? "حذف المراجعة" : "Delete Review"}
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && storeType !== 'WEBSITE' && (activeTab === 'business' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative">
                   <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">{t('business')}</h2>
                  </div>

                  <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05]">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-black text-white uppercase italic tracking-tight">{t('logisticsGrids')}</h3>
                        <button 
                          type="button"
                          onClick={() => updateSettings({...settings, businessSettings: {...(settings.businessSettings || {}), shippingRates: [...(settings.businessSettings?.shippingRates || []), {zone: '', rate: 0}]}})}
                          className={`px-6 py-3 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.08em] hover:scale-105 active:scale-95 transition-all shadow-2xl ${language === 'ar' ? 'font-arabic' : ''}`}
                        >
                          {t('defineGrid')}
                        </button>
                     </div>

                       <div className="space-y-3">
                         {(settings.businessSettings?.shippingRates || []).map((r: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center bg-white/[0.03] p-4 rounded-xl border border-white/[0.05] group transition-all hover:bg-white/[0.05]">
                               <div className="flex-1 space-y-2">
                                  <label className="text-[8px] font-black text-slate-600 tracking-[0.08em] ml-2">{t('zoneIdentifier')}</label>
                                  <input 
                                     type="text" 
                                     value={r.zone}
                                     placeholder={language === 'ar' ? "مثال: الشحن المحلي" : "e.g. Global"}
                                     onChange={e => {
                                        const newList = [...(settings.businessSettings?.shippingRates || [])];
                                        newList[idx].zone = e.target.value;
                                        updateSettings({...settings, businessSettings: {...settings.businessSettings, shippingRates: newList}});
                                     }}
                                     className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-[11px] uppercase ${language === 'ar' ? 'font-arabic text-right' : ''}`}
                                  />
                               </div>
                               <div className="w-32 space-y-2">
                                  <label className="text-[8px] font-black text-slate-600 tracking-[0.08em] ml-2">{t('rateValue')}</label>
                                  <input 
                                     type="number" 
                                     value={r.rate}
                                     onChange={e => {
                                        const newList = [...(settings.businessSettings?.shippingRates || [])];
                                        newList[idx].rate = Number(e.target.value);
                                        updateSettings({...settings, businessSettings: {...settings.businessSettings, shippingRates: newList}});
                                     }}
                                     className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-black text-[11px]"
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
                                     className="w-10 h-10 rounded-xl bg-rose-500/5 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/10 shadow-2xl"
                                  >
                                     <X size={16} />
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

          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4 transition-all duration-700 ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
            <div className="bg-[#0f111a]/90 backdrop-blur-3xl border border-cyan-500/30 p-3 rounded-2xl flex items-center justify-between shadow-[0_20px_50px_rgba(6,182,212,0.2)]">
              <div className="pl-4">
                {saveMessage ? (
                  <div className="flex items-center gap-3 animate-in slide-in-from-left-6 duration-700">
                     <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                     <span className="text-[9px] font-black text-white uppercase tracking-[0.08em]">Protocol Secured</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-500">
                     <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                     <span className="text-[9px] font-black uppercase tracking-[0.08em]">Uplink Pending</span>
                  </div>
                )}
              </div>
              <button 
                type="submit"
                disabled={isPending}
                className={`px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.08em] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-cyan-500/20 disabled:opacity-50 ${language === 'ar' ? 'font-arabic' : ''}`}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isPending ? t('saving') : t('saveChanges')}
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
