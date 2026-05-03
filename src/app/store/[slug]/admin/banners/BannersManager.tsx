"use client";

import { useState, useTransition } from "react";
import { saveBanners, updateStoreSettings } from "../actions";
import { Banner, BannerSettings } from "@/lib/types";
import { Loader2, Plus, Save, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Settings2, Clock, Play, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MediaPicker from "../media/MediaPicker";

export default function BannersManager({ initialBanners, slug, initialSettings }: { initialBanners: Banner[], slug: string, initialSettings: BannerSettings }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners.sort((a, b) => a.order - b.order));
  const [sliderSettings, setSliderSettings] = useState<BannerSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState("");
  const router = useRouter();

  const handleAddBanner = () => {
    const newBanner: Banner = {
      id: `b-${Date.now()}`,
      storeId: "", // Will be set on server side or we can pass it from props
      imageUrl: "",
      title: "New Banner",
      subtitle: "Add a catchy subtitle here",
      buttonText: "Shop Now",
      buttonLink: "/products",
      isActive: true,
      order: banners.length,
      position: "top"
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
      // 1. Save Banners
      await saveBanners(slug, banners);
      
      // 2. Save Slider Settings
      await updateStoreSettings(slug, { bannerSettings: sliderSettings });

      setSaveMessage("Banners and settings saved successfully!");
      router.refresh();
      setTimeout(() => setSaveMessage(""), 3000);
    });
  };

  return (
    <div className="p-8">
      <div className="space-y-6 mb-8 bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Settings2 className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-primary uppercase tracking-tighter">Hero Slider Configuration</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Play className="w-3 h-3" /> Auto Play
            </label>
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setSliderSettings(prev => ({ ...prev, autoPlay: !prev.autoPlay }))}
                className={`w-12 h-6 rounded-full transition-all relative ${sliderSettings.autoPlay ? 'bg-green-500' : 'bg-slate-200'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${sliderSettings.autoPlay ? 'left-7' : 'left-1'}`} />
               </button>
               <span className="text-sm font-medium">{sliderSettings.autoPlay ? 'On' : 'Off'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3" /> Interval (ms)
            </label>
            <input 
              type="number" 
              value={sliderSettings.interval} 
              onChange={e => setSliderSettings(prev => ({ ...prev, interval: parseInt(e.target.value) || 5000 }))}
              step={500}
              min={1000}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" /> Transition
            </label>
            <select 
              value={sliderSettings.transition}
              onChange={e => setSliderSettings(prev => ({ ...prev, transition: e.target.value as any }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white font-medium"
            >
              <option value="slide">Slide</option>
              <option value="fade">Fade</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Navigation</label>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input 
                type="checkbox" 
                checked={sliderSettings.showArrows}
                onChange={e => setSliderSettings(prev => ({ ...prev, showArrows: e.target.checked }))}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" 
              />
              <span className="text-sm font-medium">Show Arrows</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pagination</label>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input 
                type="checkbox" 
                checked={sliderSettings.showDots}
                onChange={e => setSliderSettings(prev => ({ ...prev, showDots: e.target.checked }))}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" 
              />
              <span className="text-sm font-medium">Show Dots</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-primary uppercase tracking-tighter flex items-center gap-3">
             Individual Banners
          </h2>
          <p className="text-muted-foreground mt-1">Configure and position your visual content.</p>
        </div>
        <button 
          onClick={handleAddBanner}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 flex items-center gap-2 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <div className="space-y-6">
        {banners.length === 0 ? (
          <div className="bg-card border border-border/50 rounded-2xl p-12 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-primary mb-2">No banners yet</h3>
            <p className="text-muted-foreground mb-4">Add your first banner to display on the homepage.</p>
            <button onClick={handleAddBanner} className="text-accent font-medium hover:underline">
              Create Banner
            </button>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div key={banner.id} className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Preview Side */}
              <div className="w-full md:w-1/3 bg-slate-100 relative min-h-[200px] flex items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
                {banner.imageUrl ? (
                  <Image 
                    src={banner.imageUrl} 
                    alt="Banner preview" 
                    fill 
                    className="object-cover" 
                    unoptimized={banner.imageUrl.startsWith('http')}
                  />
                ) : (
                  <span className="text-muted-foreground text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> No Image
                  </span>
                )}
                {/* Overlay preview text */}
                <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-center text-white">
                  <h3 className="text-xl font-bold">{banner.title || 'Title'}</h3>
                  <p className="text-sm opacity-80 mt-1">{banner.subtitle || 'Subtitle'}</p>
                </div>
              </div>

              {/* Form Side */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full text-xs">
                      #{index + 1}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={banner.isActive} 
                        onChange={(e) => updateBanner(index, 'isActive', e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-sm font-medium text-slate-700">Active</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveBanner(index, 'up')} 
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveBanner(index, 'down')} 
                      disabled={index === banners.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemoveBanner(banner.id)} 
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Image URL</label>
                    <input 
                      type="text" 
                      value={banner.imageUrl} 
                      onChange={e => updateBanner(index, 'imageUrl', e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={banner.title} 
                      onChange={e => updateBanner(index, 'title', e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Subtitle</label>
                    <input 
                      type="text" 
                      value={banner.subtitle} 
                      onChange={e => updateBanner(index, 'subtitle', e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Button Text</label>
                    <input 
                      type="text" 
                      value={banner.buttonText} 
                      onChange={e => updateBanner(index, 'buttonText', e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Button Link</label>
                    <input 
                      type="text" 
                      value={banner.buttonLink} 
                      onChange={e => updateBanner(index, 'buttonLink', e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 mt-2 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Banner Position (Where to display?)</label>
                    <select 
                      value={banner.position || "top"} 
                      onChange={e => updateBanner(index, 'position', e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                    >
                      <option value="top">Top Header (Hero Slider)</option>
                      <option value="middle">Middle Page (After Products)</option>
                      <option value="bottom">Bottom Page (Above Footer)</option>
                    </select>
                    <p className="text-[10px] text-muted-foreground mt-1">Choose where exactly this banner should appear on your store's homepage.</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t flex items-center justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 rounded-xl">
        <div>
          {saveMessage && (
            <span className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg text-sm">
              {saveMessage}
            </span>
          )}
        </div>
        <button 
          onClick={handleSave}
          disabled={isPending} 
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:opacity-90 flex items-center gap-2 transition-opacity disabled:opacity-70 shadow-lg"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
