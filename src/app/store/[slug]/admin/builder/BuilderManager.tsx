"use client";

import { useState, useTransition } from "react";
import { saveStoreSettings } from "../actions";
import { StoreSettings } from "@/lib/types";
import { useRouter } from "next/navigation";
import { 
  Blocks, 
  GripVertical, 
  Image as ImageIcon, 
  ShoppingBag, 
  Tag, 
  MessageSquare, 
  Type, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Settings,
  Video,
  PlayCircle,
  Link2
} from "lucide-react";
import MediaPicker from "../media/MediaPicker";

export interface LayoutSection {
  id: string;
  type: string;
  style: string;
  config: any;
  showDivider?: boolean;
}

const SECTION_DEFINITIONS = [
  { id: 'hero', name: 'Hero Section', icon: ImageIcon, defaultStyle: 'luxury' },
  { id: 'banners', name: 'Banners Slider', icon: ImageIcon, defaultStyle: 'default' },
  { id: 'categories', name: 'Categories', icon: Tag, defaultStyle: 'grid' },
  { id: 'featured_products', name: 'Featured Products', icon: ShoppingBag, defaultStyle: 'grid' },
  { id: 'sale', name: 'Sale Offers', icon: Tag, defaultStyle: 'grid' },
  { id: 'testimonials', name: 'Testimonials', icon: MessageSquare, defaultStyle: 'cards' },
  { id: 'text_block', name: 'Rich Text', icon: Type, defaultStyle: 'centered' },
  { id: 'video', name: 'Video Section', icon: Video, defaultStyle: 'default' },
  { id: 'marquee', name: 'Announcement Marquee', icon: Type, defaultStyle: 'default' },
];

export default function BuilderManager({ initialSettings, slug }: { initialSettings: StoreSettings, slug: string }) {
  // Initialize with a default layout if none exists
  const defaultLayout: LayoutSection[] = [
    { id: 'sec-1', type: 'hero', style: 'luxury', config: { title: 'Welcome to our store', subtitle: 'Discover amazing products' } },
    { id: 'sec-3', type: 'categories', style: 'grid', config: { title: 'Shop by Category' } },
    { id: 'sec-4', type: 'featured_products', style: 'grid', config: { title: 'Trending Now' } },
    { id: 'sec-5', type: 'testimonials', style: 'cards', config: { title: 'What our customers say' } }
  ];

  const [layout, setLayout] = useState<LayoutSection[]>(initialSettings.homepageLayout || defaultLayout);
  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState("");
  const [activeEditor, setActiveEditor] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    setSaveMessage("");
    startTransition(async () => {
      await saveStoreSettings(slug, { ...initialSettings, homepageLayout: layout });
      setSaveMessage("Storefront layout saved!");
      router.refresh();
      setTimeout(() => setSaveMessage(""), 3000);
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === layout.length - 1)) return;
    
    const newLayout = [...layout];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newLayout[index], newLayout[swapIndex]] = [newLayout[swapIndex], newLayout[index]];
    setLayout(newLayout);
  };

  const removeSection = (id: string) => {
    setLayout(layout.filter(s => s.id !== id));
    if (activeEditor === id) setActiveEditor(null);
  };

  const addSection = (type: string) => {
    const def = SECTION_DEFINITIONS.find(d => d.id === type);
    if (!def) return;
    
    const newSection: LayoutSection = {
      id: `sec-${Date.now()}`,
      type,
      style: def.defaultStyle,
      config: type === 'marquee' 
        ? { enabled: true, items: [{ id: '1', text: 'New Announcement' }], backgroundColor: '#000000', textColor: '#ffffff', speed: 20 }
        : { title: `New ${def.name}` },
      showDivider: type !== 'marquee'
    };
    
    setLayout([...layout, newSection]);
    setActiveEditor(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<LayoutSection>) => {
    setLayout(layout.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const toggleDivider = (id: string) => {
    setLayout(layout.map(s => s.id === id ? { ...s, showDivider: !s.showDivider } : s));
  };

  const updateSectionConfig = (id: string, key: string, value: any) => {
    setLayout(layout.map(s => s.id === id ? { ...s, config: { ...s.config, [key]: value } } : s));
  };

  const getSectionName = (type: string) => SECTION_DEFINITIONS.find(d => d.id === type)?.name || type;
  const getSectionIcon = (type: string) => {
    const Icon = SECTION_DEFINITIONS.find(d => d.id === type)?.icon || Blocks;
    return <Icon className="w-5 h-5 text-slate-500" />;
  };

  const activeSection = layout.find(s => s.id === activeEditor);

  return (
    <div className="p-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary flex items-center gap-3">
            <Blocks className="w-8 h-8 text-blue-600" /> Store Builder
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Design your homepage by adding, reordering, and customizing sections.</p>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && (
            <span className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg text-sm animate-in fade-in">
              {saveMessage}
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isPending} 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md shadow-blue-600/20"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Layout
          </button>
        </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Left Sidebar: Outline & Reorder */}
        <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Page Sections</h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{layout.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {layout.map((section, index) => (
              <div 
                key={section.id} 
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${activeEditor === section.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                onClick={() => setActiveEditor(section.id)}
              >
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                    disabled={index === 0}
                    className="text-slate-300 hover:text-blue-600 disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                    disabled={index === layout.length - 1}
                    className="text-slate-300 hover:text-blue-600 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  {getSectionIcon(section.type)}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-slate-800 text-sm truncate">{getSectionName(section.type)}</p>
                  <p className="text-xs text-slate-400 capitalize truncate">{section.style} Style</p>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
                  style={{ opacity: activeEditor === section.id ? 1 : undefined }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Add Section</h4>
              <div className="grid grid-cols-2 gap-2">
                {SECTION_DEFINITIONS.map(def => (
                  <button
                    key={def.id}
                    onClick={() => addSection(def.id)}
                    className="flex flex-col items-center justify-center gap-2 p-3 border border-slate-200 border-dashed rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all text-slate-500 hover:text-blue-600 group"
                  >
                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                       <def.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-center">{def.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Editor */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
          {!activeEditor || !activeSection ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
               <Settings className="w-16 h-16 text-slate-200 mb-4" />
               <h3 className="text-xl font-bold text-slate-600 mb-2">No Section Selected</h3>
               <p>Click on a section from the left sidebar to edit its content and style.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  {getSectionIcon(activeSection.type)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{getSectionName(activeSection.type)}</h2>
                  <p className="text-sm text-slate-500">Configure layout and content</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* Style Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-500" /> Section Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Render specific styles based on section type */}
                    {activeSection.type === 'hero' && ['slider', 'luxury', 'split', 'centered', 'minimal', 'campaign', 'abstract', 'immersive'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'categories' && ['grid', 'carousel', 'circles'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {style}
                      </button>
                    ))}
                     {activeSection.type === 'featured_products' && ['grid', 'carousel', 'masonry'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'testimonials' && ['cards', 'slider', 'minimal'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {style}
                      </button>
                    ))}
                     {activeSection.type === 'text_block' && ['centered', 'left', 'split_with_image'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {style.replace(/_/g, ' ')}
                      </button>
                    ))}
                    {activeSection.type === 'video' && ['default', 'full_width', 'tiktok_style'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {style.replace(/_/g, ' ')}
                      </button>
                    ))}
                    {activeSection.type === 'banners' && (
                       <p className="text-sm text-slate-500 col-span-2">Banner slider uses global banner settings. Edit banners in the Banners tab.</p>
                    )}
                  </div>
                </div>

                {/* Content Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 pb-2 border-b">Content Settings</h3>
                  
                  {activeSection.config?.title !== undefined && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                      <input 
                        type="text" 
                        value={activeSection.config.title} 
                        onChange={(e) => updateSectionConfig(activeSection.id, 'title', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  )}

                  {activeSection.type === 'hero' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subtitle</label>
                      <input 
                        type="text" 
                        value={activeSection.config.subtitle || ''} 
                        onChange={(e) => updateSectionConfig(activeSection.id, 'subtitle', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  )}

                  {activeSection.type === 'sale' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Section Style</label>
                        <select 
                          value={activeSection.style || 'grid'} 
                          onChange={(e) => updateSection(activeSection.id, { style: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="bento">Bento Grid (Premium)</option>
                          <option value="grid">Standard Grid</option>
                          <option value="horizontal">Horizontal List</option>
                          <option value="scroll">Horizontal Scroll Bar</option>
                          <option value="list">Minimal List</option>
                          <option value="bubbles">Circle Bubbles</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Background Color Override</label>
                        <div className="flex items-center gap-3">
                           <input 
                              type="color" 
                              value={activeSection.config?.backgroundColor || '#ffffff'} 
                              onChange={(e) => updateSectionConfig(activeSection.id, 'backgroundColor', e.target.value)}
                              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-100"
                           />
                           <input 
                              type="text" 
                              value={activeSection.config?.backgroundColor || '#ffffff'} 
                              onChange={(e) => updateSectionConfig(activeSection.id, 'backgroundColor', e.target.value)}
                              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm uppercase"
                           />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 italic">Tip: Leave as #ffffff for default theme background.</p>
                      </div>
                    </div>
                  )}

                  {activeSection.type === 'text_block' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Paragraph Text</label>
                      <textarea 
                        value={activeSection.config.text || ''} 
                        onChange={(e) => updateSectionConfig(activeSection.id, 'text', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all min-h-[120px]"
                        placeholder="Write your text here..."
                      />
                    </div>
                  )}

                  {activeSection.type === 'video' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Video Gallery ({ (activeSection.config.videos || []).length })</label>
                         <button 
                           onClick={() => {
                             const videos = Array.isArray(activeSection.config.videos) ? activeSection.config.videos : [];
                             updateSectionConfig(activeSection.id, 'videos', [...videos, { url: '', sourceType: 'upload' }]);
                           }}
                           className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100"
                         >
                           <Plus className="w-3 h-3" /> Add Video
                         </button>
                      </div>

                      <div className="space-y-4">
                        {(activeSection.config.videos || []).map((video: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black text-slate-400">VIDEO #{idx + 1}</span>
                               <button 
                                 onClick={() => {
                                   const videos = [...activeSection.config.videos];
                                   videos.splice(idx, 1);
                                   updateSectionConfig(activeSection.id, 'videos', videos);
                                 }}
                                 className="text-red-400 hover:text-red-600 p-1"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </div>

                            <div className="space-y-3">
                               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Source / Link</label>
                               <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Paste YouTube, TikTok or Video URL..." 
                                    value={video.url || ''} 
                                    onChange={(e) => {
                                      const videos = [...activeSection.config.videos];
                                      videos[idx] = { ...videos[idx], url: e.target.value };
                                      updateSectionConfig(activeSection.id, 'videos', videos);
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  />
                                  <button 
                                    onClick={() => {
                                      // Trigger media picker logic or just allow URL
                                      // For simplicity, we use the URL input
                                    }}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500"
                                    title="Media Library"
                                  >
                                    <ImageIcon className="w-4 h-4" />
                                  </button>
                               </div>
                               <p className="text-[9px] text-slate-400 italic">Supports YouTube (Regular & Shorts), TikTok, and direct MP4 links.</p>
                            </div>
                          </div>
                        ))}
                        
                        {(activeSection.config.videos || []).length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No videos added yet</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="autoPlay"
                          checked={activeSection.config.autoPlay !== false} 
                          onChange={(e) => updateSectionConfig(activeSection.id, 'autoPlay', e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <label htmlFor="autoPlay" className="text-sm font-medium text-slate-700">Loop Videos (where supported)</label>
                      </div>
                    </div>
                  )}

                  {activeSection.type === 'marquee' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-4 mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Visibility</h3>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-sm font-bold text-slate-500">Enable</span>
                          <input 
                            type="checkbox" 
                            checked={activeSection.config.enabled !== false} 
                            onChange={e => updateSectionConfig(activeSection.id, 'enabled', e.target.checked)} 
                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-600 accent-blue-600"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Background Color</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={activeSection.config.backgroundColor || '#000000'} 
                              onChange={e => updateSectionConfig(activeSection.id, 'backgroundColor', e.target.value)} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={activeSection.config.backgroundColor || '#000000'} 
                              onChange={e => updateSectionConfig(activeSection.id, 'backgroundColor', e.target.value)} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none font-mono text-sm uppercase" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Text Color</label>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={activeSection.config.textColor || '#ffffff'} 
                              onChange={e => updateSectionConfig(activeSection.id, 'textColor', e.target.value)} 
                              className="h-10 w-16 p-1 rounded-lg border border-slate-300 cursor-pointer bg-white" 
                            />
                            <input 
                              type="text" 
                              value={activeSection.config.textColor || '#ffffff'} 
                              onChange={e => updateSectionConfig(activeSection.id, 'textColor', e.target.value)} 
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none font-mono text-sm uppercase" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Animation Speed (s)</label>
                          <input 
                            type="number" 
                            min="5" max="100"
                            value={activeSection.config.speed || 20} 
                            onChange={e => updateSectionConfig(activeSection.id, 'speed', Number(e.target.value))} 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                      </div>

                      <div className="mt-6 border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-bold text-slate-800">Scrolling Texts</h3>
                          <button 
                            type="button"
                            onClick={() => {
                              const newItems = [...(activeSection.config.items || [])];
                              newItems.push({ id: Math.random().toString(36).substr(2, 9), text: 'New Announcement' });
                              updateSectionConfig(activeSection.id, 'items', newItems);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-all"
                          >
                            + Add Text
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(activeSection.config.items || []).map((item: any, idx: number) => (
                            <div key={item.id} className="flex gap-3">
                              <input 
                                type="text" 
                                value={item.text} 
                                onChange={e => {
                                  const newItems = [...(activeSection.config.items || [])];
                                  newItems[idx].text = e.target.value;
                                  updateSectionConfig(activeSection.id, 'items', newItems);
                                }}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const newItems = [...(activeSection.config.items || [])];
                                  newItems.splice(idx, 1);
                                  updateSectionConfig(activeSection.id, 'items', newItems);
                                }}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          {(!activeSection.config.items || activeSection.config.items.length === 0) && (
                            <p className="text-sm text-slate-500 text-center py-4 border-2 border-dashed rounded-xl">No texts added. Add one above.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Divider Toggle */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between group cursor-pointer" onClick={() => toggleDivider(activeSection.id)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeSection.showDivider !== false ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        <div className="w-6 h-0.5 bg-current rounded-full" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Section Divider</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Show separator below this block</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${activeSection.showDivider !== false ? 'bg-blue-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${activeSection.showDivider !== false ? 'left-7' : 'left-1'}`} />
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 italic">Advanced block customization (colors, padding, image selection) will be unlocked in Phase 2.</p>
                  </div>

                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Just adding Palette icon definition since it was missing in the import
function Palette(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  )
}
