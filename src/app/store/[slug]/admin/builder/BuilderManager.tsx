"use client";

import React, { useState, useTransition } from "react";
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
    <div className="p-8 h-[calc(100vh-80px)] flex flex-col bg-slate-50">
      <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Blocks className="w-8 h-8 text-blue-600" /> Store Builder
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Design your homepage by adding, reordering, and customizing sections.</p>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && (
            <span className="text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl text-xs animate-in fade-in">
              {saveMessage}
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isPending} 
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Left Sidebar: Outline & Reorder */}
        <div className="w-[350px] bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Page Sections</h3>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-full">{layout.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {layout.map((section, index) => (
              <div 
                key={section.id} 
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${activeEditor === section.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                onClick={() => setActiveEditor(section.id)}
              >
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                    disabled={index === 0}
                    className="text-slate-300 hover:text-blue-600 disabled:opacity-20"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                    disabled={index === layout.length - 1}
                    className="text-slate-300 hover:text-blue-600 disabled:opacity-20"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeEditor === section.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {getSectionIcon(section.type)}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-slate-800 text-sm truncate">{getSectionName(section.type)}</p>
                  <p className="text-[10px] text-slate-400 capitalize truncate">{section.style} Style</p>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4 ml-2">Add New Section</h4>
              <div className="grid grid-cols-2 gap-2 pb-6">
                {SECTION_DEFINITIONS.map(def => (
                  <button
                    key={def.id}
                    onClick={() => addSection(def.id)}
                    className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 border-dashed rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all text-slate-500 hover:text-blue-600 group"
                  >
                    <div className="bg-slate-100 p-2 rounded-xl group-hover:bg-blue-100 transition-colors">
                       <def.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-center">{def.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Editor Panel */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
          {!activeEditor || !activeSection ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Settings className="w-10 h-10 text-slate-200" />
               </div>
               <h3 className="text-xl font-bold text-slate-600 mb-2">No Section Selected</h3>
               <p className="text-sm max-w-xs">Click on a section from the left sidebar to edit its content and style.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  {getSectionIcon(activeSection.type)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{getSectionName(activeSection.type)}</h2>
                  <p className="text-sm text-slate-500">Edit content and visual style</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                
                {/* Style Selector */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-500" /> Section Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {activeSection.type === 'hero' && ['slider', 'luxury', 'split', 'centered', 'minimal', 'campaign', 'abstract', 'immersive'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'categories' && ['grid', 'carousel', 'circles'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'featured_products' && ['grid', 'carousel', 'masonry'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'testimonials' && ['cards', 'slider', 'minimal'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Settings */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Content Settings</h3>
                  
                  {activeSection.config?.title !== undefined && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                      <input 
                        type="text" 
                        value={activeSection.config.title} 
                        onChange={(e) => updateSectionConfig(activeSection.id, 'title', e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  )}

                  {activeSection.type === 'hero' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Subtitle</label>
                      <input 
                        type="text" 
                        value={activeSection.config.subtitle || ''} 
                        onChange={(e) => updateSectionConfig(activeSection.id, 'subtitle', e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  )}

                  {activeSection.type === 'testimonials' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase">Testimonials</label>
                        <button 
                          type="button"
                          onClick={() => {
                            const newItems = [...(activeSection.config.items || [])];
                            newItems.push({ id: Math.random().toString(36).substr(2, 9), name: 'Customer Name', role: 'Verified Buyer', content: 'Excellent service!' });
                            updateSectionConfig(activeSection.id, 'items', newItems);
                          }}
                          className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-all"
                        >
                          + Add New
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(activeSection.config.items || []).map((item: any, idx: number) => (
                          <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                            <button 
                              onClick={() => {
                                const newItems = [...(activeSection.config.items || [])];
                                newItems.splice(idx, 1);
                                updateSectionConfig(activeSection.id, 'items', newItems);
                              }}
                              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="space-y-3">
                               <input 
                                 type="text" 
                                 value={item.name} 
                                 placeholder="Name"
                                 onChange={e => {
                                   const newItems = [...(activeSection.config.items || [])];
                                   newItems[idx].name = e.target.value;
                                   updateSectionConfig(activeSection.id, 'items', newItems);
                                 }}
                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                               />
                               <input 
                                 type="text" 
                                 value={item.role} 
                                 placeholder="Role"
                                 onChange={e => {
                                   const newItems = [...(activeSection.config.items || [])];
                                   newItems[idx].role = e.target.value;
                                   updateSectionConfig(activeSection.id, 'items', newItems);
                                 }}
                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-500"
                               />
                               <textarea 
                                 value={item.content} 
                                 placeholder="Testimonial content..."
                                 onChange={e => {
                                   const newItems = [...(activeSection.config.items || [])];
                                   newItems[idx].content = e.target.value;
                                   updateSectionConfig(activeSection.id, 'items', newItems);
                                 }}
                                 rows={3}
                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-600 italic"
                               />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection.type === 'marquee' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold text-slate-500 uppercase">Scrolling Texts</label>
                        <button 
                          type="button"
                          onClick={() => {
                            const newItems = [...(activeSection.config.items || [])];
                            newItems.push({ id: Math.random().toString(36).substr(2, 9), text: 'New Announcement' });
                            updateSectionConfig(activeSection.id, 'items', newItems);
                          }}
                          className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100"
                        >
                          + Add Text
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(activeSection.config.items || []).map((item: any, idx: number) => (
                          <div key={item.id} className="flex gap-2">
                            <input 
                              type="text" 
                              value={item.text} 
                              onChange={e => {
                                const newItems = [...(activeSection.config.items || [])];
                                newItems[idx].text = e.target.value;
                                updateSectionConfig(activeSection.id, 'items', newItems);
                              }}
                              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const newItems = [...(activeSection.config.items || [])];
                                newItems.splice(idx, 1);
                                updateSectionConfig(activeSection.id, 'items', newItems);
                              }}
                              className="text-red-400 hover:bg-red-50 p-2 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Divider Toggle */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between group cursor-pointer" onClick={() => toggleDivider(activeSection.id)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeSection.showDivider !== false ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-slate-100 text-slate-400'}`}>
                        <GripVertical className="w-5 h-5 rotate-90" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Section Divider</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Show separator below this block</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${activeSection.showDivider !== false ? 'bg-blue-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${activeSection.showDivider !== false ? 'left-7' : 'left-1'}`} />
                    </div>
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
