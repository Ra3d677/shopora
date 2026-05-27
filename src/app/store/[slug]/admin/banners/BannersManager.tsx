"use client";

import { useState, useTransition } from "react";
import { saveBanners } from "../actions";
import { Banner, BannerSettings } from "@/lib/types";
import { Loader2, Plus, Save, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Settings2, Clock, Play, Zap } from "lucide-react";
import MediaPicker from "../media/MediaPicker";
import SmartImage from "@/components/ui/SmartImage";
import { useLanguageStore } from "@/store/language";

export default function BannersManager({ initialBanners, slug, initialSettings }: { initialBanners: Banner[], slug: string, initialSettings: BannerSettings }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners.sort((a, b) => a.order - b.order));
  const [sliderSettings, setSliderSettings] = useState<BannerSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState("");

  const { t, language } = useLanguageStore();
  const isRTL = language === 'ar';

  const handleAddBanner = () => {
    const newBanner: Banner = {
      id: `b-${Date.now()}`,
      storeId: "", // Will be set on server side or we can pass it from props
      imageUrl: "",
      title: "New Banner",
      subtitle: "Add a catchy subtitle here",
      buttonText: "Shop Now",
      buttonLink: "/products",
      showButton: true,
      buttonPosition: "center",
      buttonShape: "rounded",
      buttonColor: "primary",
      isActive: true,
      order: banners.length,
      position: "top",
      targetPage: "home"
    };
    setBanners([...banners, newBanner]);
  };

  const handleRemoveBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id).map((b, idx) => ({ ...b, order: idx })));
  };

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === banners.length - 1)) return;
    
    const newBanners = [...banners];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order
    [newBanners[index], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[index]];
    
    // Update order property
    newBanners.forEach((b, idx) => b.order = idx);
    setBanners(newBanners);
  };

  const updateBanner = (index: number, field: keyof Banner, value: any) => {
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setBanners(newBanners);
  };

  const handleSave = async () => {
    setSaveMessage("");
    startTransition(async () => {
      const result = await saveBanners(slug, banners, sliderSettings);
      if (result && !result.success) {
        setSaveMessage("Error: " + (result.error || "Unknown error"));
        setTimeout(() => setSaveMessage(""), 5000);
      }
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`p-10 space-y-12 animate-in fade-in duration-700 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex justify-between items-end ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase">
            {t('motionCanvas')}
          </h1>
          <p className="text-slate-500 mt-3 font-medium tracking-widest text-[10px] uppercase">{t('curateVisualNarrative')}</p>
        </div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/[0.05] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 blur-[120px] -z-10 group-hover:bg-yellow-500/10 transition-all"></div>
        
        <div className={`flex items-center gap-4 mb-10 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
           <div className="w-1.5 h-10 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
           <div>
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{t('sliderDynamics')}</h2>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{t('globalTransitionProtocols')}</p>
           </div>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="space-y-4">
            <label className={`text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Play className="w-3.5 h-3.5 text-yellow-400" /> {t('autoCycle')}
            </label>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
               <button 
                onClick={() => setSliderSettings(prev => ({ ...prev, autoPlay: !prev.autoPlay }))}
                className={`w-14 h-7 rounded-full transition-all relative border border-white/10 ${sliderSettings.autoPlay ? 'bg-yellow-400' : 'bg-white/5'}`}
               >
                 <div className={`absolute top-1 w-5 h-5 rounded-full transition-all shadow-xl ${sliderSettings.autoPlay ? 'left-8 bg-black' : 'left-1 bg-slate-500'}`} />
               </button>
               <span className="text-[10px] font-black text-white uppercase">{sliderSettings.autoPlay ? (isRTL ? 'مفعل' : 'ENABLED') : (isRTL ? 'يدوي' : 'MANUAL')}</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className={`text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-3.5 h-3.5 text-yellow-400" /> {t('latencyMs')}
            </label>
            <input 
              type="number" 
              value={sliderSettings.interval} 
              onChange={e => setSliderSettings(prev => ({ ...prev, interval: parseInt(e.target.value) || 5000 }))}
              step={500}
              min={1000}
              className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-black text-xs ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>

          <div className="space-y-4">
            <label className={`text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> {t('morphEffect')}
            </label>
            <select 
              value={sliderSettings.transition}
              onChange={e => setSliderSettings(prev => ({ ...prev, transition: e.target.value as any }))}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
            >
              <option value="slide" className="bg-[#1a1d2d]">{isRTL ? 'انزلاق' : 'TRANSLATION'}</option>
              <option value="fade" className="bg-[#1a1d2d]">{isRTL ? 'تلاشي' : 'DISSOLVE'}</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('uiControls')}</label>
            <label className={`flex items-center gap-3 cursor-pointer group/nav ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={sliderSettings.showArrows}
                  onChange={e => setSliderSettings(prev => ({ ...prev, showArrows: e.target.checked }))}
                  className="peer sr-only" 
                />
                <div className="w-5 h-5 bg-white/[0.03] border border-white/[0.1] rounded-lg peer-checked:bg-yellow-400 transition-all"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/nav:text-white transition-colors">{t('tactileArrows')}</span>
            </label>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('progressMap')}</label>
            <label className={`flex items-center gap-3 cursor-pointer group/nav ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={sliderSettings.showDots}
                  onChange={e => setSliderSettings(prev => ({ ...prev, showDots: e.target.checked }))}
                  className="peer sr-only" 
                />
                <div className="w-5 h-5 bg-white/[0.03] border border-white/[0.1] rounded-lg peer-checked:bg-yellow-400 transition-all"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/nav:text-white transition-colors">{t('visualNodes')}</span>
            </label>
          </div>
        </div>
      </div>

      <div className={`flex justify-between items-center px-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
           <div className="w-1.5 h-10 bg-yellow-400 rounded-full"></div>
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t('frameInventory')}</h2>
        </div>
        <button 
          onClick={handleAddBanner}
          className={`px-8 py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all flex items-center gap-3 shadow-2xl ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Plus className="w-5 h-5" /> {t('appendFrame')}
        </button>
      </div>

      <div className="space-y-10">
        {banners.length === 0 ? (
          <div className="bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5 p-40 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-yellow-500/5 blur-[100px] -z-10 group-hover:bg-yellow-500/10 transition-all duration-700"></div>
            <ImageIcon className="w-20 h-20 text-slate-800 mx-auto mb-8 animate-pulse" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">{t('noMediaProjected')}</h3>
            <p className="text-slate-600 text-sm font-medium mb-10 max-w-sm mx-auto">{t('initializeCinematicFrame')}</p>
            <button onClick={handleAddBanner} className="text-yellow-400 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all">
              {t('launchSequence')}
            </button>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div key={banner.id} className="group/banner bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/[0.05] shadow-2xl overflow-hidden flex flex-col xl:flex-row transition-all duration-500 hover:border-white/10">
              {/* Preview Side - Cinematic View */}
              <div className="w-full xl:w-2/5 bg-black relative aspect-[21/9] xl:aspect-auto min-h-[350px] flex items-center justify-center overflow-hidden border-b xl:border-b-0 xl:border-r border-white/[0.05]">
                {banner.imageUrl || banner.mobileImageUrl ? (
                  <div className="absolute inset-0 w-full h-full">
                    <SmartImage 
                      src={banner.imageUrl || banner.mobileImageUrl || ""} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover opacity-50 group-hover/banner:scale-110 transition-transform duration-[2s]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-800">
                    <ImageIcon className="w-16 h-16" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{isRTL ? "مخرجات فارغة" : "Null Output"}</span>
                  </div>
                )}
                
                {/* Content Preview Overlay */}
                <div className={`absolute inset-0 p-12 flex flex-col justify-center max-w-[80%] ${isRTL ? 'text-right right-0' : 'text-left left-0'}`}>
                  <div className={`inline-block px-3 py-1 bg-yellow-400 text-black text-[8px] font-black uppercase tracking-widest mb-6 w-fit rounded shadow-[0_0_20px_rgba(250,204,21,0.5)] ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                    {t('frame')} {index + 1}
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                    {banner.title || (isRTL ? 'عنوان_الإطار' : 'FRAME_TITLE')}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest line-clamp-2 max-w-sm">
                    {banner.subtitle || (isRTL ? "تم تهيئة النص الفرعي للنظام..." : "System subtext initialized...")}
                  </p>
                  
                  {banner.showButton !== false && (
                    <div className={`mt-8 px-6 py-3 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest w-fit rounded-xl backdrop-blur-md ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                      {banner.buttonText || (isRTL ? "تفعيل_الحدث" : "ACTION_TRIGGER")}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Side - Technical Interface */}
              <div className="p-10 flex-1 relative">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group/active">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={banner.isActive} 
                          onChange={(e) => updateBanner(index, 'isActive', e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 bg-white/[0.03] border border-white/[0.1] rounded-xl peer-checked:bg-green-500 transition-all"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                           <div className="w-2 h-2 rounded-full bg-black"></div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/active:text-white transition-colors">{t('productionStatus')}</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                      <button 
                        onClick={() => moveBanner(index, 'up')} 
                        disabled={index === 0}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-white disabled:opacity-20 transition-all hover:bg-white/5 rounded-xl"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => moveBanner(index, 'down')} 
                        disabled={index === banners.length - 1}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-white disabled:opacity-20 transition-all hover:bg-white/5 rounded-xl"
                      >
                        <ArrowDown className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveBanner(banner.id)} 
                      className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center rounded-2xl shadow-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className={`grid grid-cols-1 gap-8 col-span-1 md:col-span-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="space-y-4">
                        <div className={`flex justify-between items-end mb-2 px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('mainDistribution')}</label>
                          <span className="text-[8px] font-black text-yellow-400/50 uppercase italic tracking-widest">{isRTL ? 'يوصى بـ UHD' : 'UHD RECOMMENDED'}</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-[2rem] p-3">
                          <MediaPicker 
                            slug={slug}
                            value={banner.imageUrl} 
                            onChange={url => updateBanner(index, 'imageUrl', url)} 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className={`flex justify-between items-end mb-2 px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('mobileNode')}</label>
                          <span className="text-[8px] font-black text-yellow-400/50 uppercase italic tracking-widest">{isRTL ? 'مُحسّن للوضع الرأسي' : 'PORTRAIT OPTIMIZED'}</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-[2rem] p-3">
                          <MediaPicker 
                            slug={slug}
                            value={banner.mobileImageUrl || ""} 
                            onChange={url => updateBanner(index, 'mobileImageUrl', url)} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div>
                      <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('manifestTitle')}</label>
                      <input 
                        type="text" 
                        value={banner.title || ""} 
                        onChange={e => updateBanner(index, 'title', e.target.value)} 
                        className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-black uppercase tracking-tighter text-xl italic ${isRTL ? 'text-right' : 'text-left'}`}
                        placeholder={isRTL ? 'أدخل العنوان' : 'ENTER HEADLINE'}
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('supportingNarrative')}</label>
                      <textarea 
                        value={banner.subtitle || ""} 
                        onChange={e => updateBanner(index, 'subtitle', e.target.value)} 
                        className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-medium text-sm h-28 ${isRTL ? 'text-right' : 'text-left'}`}
                        placeholder={isRTL ? 'حدد رؤية هذا الإطار...' : 'Define the vision for this frame...'}
                      />
                    </div>
                  </div>

                  <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('triggerText')}</label>
                          <input 
                            type="text" 
                            value={banner.buttonText || ""} 
                            onChange={e => updateBanner(index, 'buttonText', e.target.value)} 
                            className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-bold text-xs ${isRTL ? 'text-right' : 'text-left'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('deploymentUrl')}</label>
                          <input 
                            type="text" 
                            value={banner.buttonLink || ""} 
                            onChange={e => updateBanner(index, 'buttonLink', e.target.value)} 
                            className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-bold text-xs ${isRTL ? 'text-right' : 'text-left'}`}
                          />
                        </div>
                     </div>

                     <div className="bg-black/20 rounded-[2rem] p-8 border border-white/[0.03] space-y-8">
                        <label className={`flex items-center gap-4 cursor-pointer group/ui ${isRTL ? 'flex-row-reverse' : ''}`}>
                           <div className="relative">
                              <input 
                                type="checkbox" 
                                checked={banner.showButton !== false}
                                onChange={(e) => updateBanner(index, 'showButton', e.target.checked)}
                                className="peer sr-only"
                              />
                              <div className="w-6 h-6 bg-white/[0.03] border border-white/[0.1] rounded-xl peer-checked:bg-yellow-400 transition-all"></div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                 <div className="w-2 h-2 rounded-full bg-black"></div>
                              </div>
                           </div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/ui:text-white transition-colors">{t('renderActionUi')}</span>
                        </label>

                        {banner.showButton !== false && (
                          <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                            <div>
                              <label className={`block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('spatialPosition')}</label>
                              <select 
                                value={banner.buttonPosition || "center"} 
                                onChange={e => updateBanner(index, 'buttonPosition', e.target.value)} 
                                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-black uppercase text-[10px] tracking-widest cursor-pointer"
                              >
                                {['top', 'center', 'bottom', 'left', 'right', 'bottom-left', 'bottom-right'].map(pos => (
                                  <option key={pos} value={pos} className="bg-[#1a1d2d]">{pos.toUpperCase()}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className={`block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('visualArchitecture')}</label>
                              <select 
                                value={banner.buttonShape || "rounded"} 
                                onChange={e => updateBanner(index, 'buttonShape', e.target.value)} 
                                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-black uppercase text-[10px] tracking-widest cursor-pointer"
                              >
                                <option value="rounded" className="bg-[#1a1d2d]">{isRTL ? 'هندسي' : 'GEOMETRIC'}</option>
                                <option value="square" className="bg-[#1a1d2d]">{isRTL ? 'تبسيطي' : 'MINIMALIST'}</option>
                                <option value="pill" className="bg-[#1a1d2d]">{isRTL ? 'عضوي' : 'ORGANIC'}</option>
                              </select>
                            </div>
                          </div>
                        )}
                     </div>
                  </div>

                  <div className={`col-span-1 md:col-span-2 pt-10 border-t border-white/[0.05] grid grid-cols-1 md:grid-cols-2 gap-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div>
                      <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('spatialContext')}</label>
                      <div className="flex gap-4">
                        <select 
                          value={banner.targetPage || "home"} 
                          onChange={e => updateBanner(index, 'targetPage', e.target.value)} 
                          className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-black uppercase tracking-widest text-[10px] cursor-pointer"
                        >
                          <option value="home" className="bg-[#1a1d2d]">{isRTL ? 'الصفحة الرئيسية' : 'LANDING_PAGE'}</option>
                          <option value="collections" className="bg-[#1a1d2d]">{isRTL ? 'عقد المجموعات' : 'COLLECTION_NODES'}</option>
                        </select>
                        <select 
                          value={banner.position || "top"} 
                          onChange={e => updateBanner(index, 'position', e.target.value)} 
                          className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-black uppercase tracking-widest text-[10px] cursor-pointer"
                        >
                          <option value="top" className="bg-[#1a1d2d]">{isRTL ? 'القطاع العلوي' : 'TOP_SECTOR'}</option>
                          <option value="middle" className="bg-[#1a1d2d]">{isRTL ? 'القطاع الأساسي' : 'CORE_SECTOR'}</option>
                          <option value="bottom" className="bg-[#1a1d2d]">{isRTL ? 'القطاع الأساسي (سفلي)' : 'BASE_SECTOR'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center">
                       <p className={`text-[9px] font-medium text-slate-600 leading-relaxed italic border-white/5 ${isRTL ? 'border-r pr-8' : 'border-l pl-8'}`}>
                         {t('definePreciseGeographicalCoordinates')}
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Premium Sticky Save Bar */}
      <div className="sticky bottom-10 z-[50] group/save">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-[2.5rem] blur-[30px] opacity-20 group-hover/save:opacity-40 transition-opacity"></div>
        <div className={`relative bg-[#0f111a]/80 backdrop-blur-2xl border border-white/[0.1] p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'pr-6' : 'pl-6'}>
            {saveMessage ? (
              <div className={`flex items-center gap-4 animate-in duration-500 ${isRTL ? 'slide-in-from-right-4 flex-row-reverse' : 'slide-in-from-left-4'}`}>
                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">{isRTL ? "تمت المزامنة بنجاح" : "Manifest Synchronized"}</span>
              </div>
            ) : (
              <div className={`flex items-center gap-4 text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">{isRTL ? "في انتظار الأوامر" : "Awaiting Instruction"}</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleSave}
            disabled={isPending} 
            className={`px-12 py-5 bg-white text-black rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-yellow-400 transition-all flex items-center gap-4 shadow-2xl disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {t('commitToRegistry')}
          </button>
        </div>
      </div>
    </div>
  );
}
