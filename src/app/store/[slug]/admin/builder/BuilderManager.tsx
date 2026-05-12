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
    <div className="p-8 h-[calc(100vh-80px)] flex flex-col gap-6 animate-in fade-in duration-700 bg-[#f8fafc]">
      {/* Header Section - Modern & Clear */}
      <div className="flex justify-between items-center shrink-0 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Blocks className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Architect Engine</h1>
            <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Visual Interface Synthesis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {saveMessage && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{saveMessage}</span>
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isPending} 
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20 disabled:opacity-50 active:scale-95"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Architecture
          </button>
        </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Left Sidebar - High Clarity */}
        <div className="w-[350px] bg-white rounded-[2.5rem] border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.3em]">Temporal Sequence</h3>
             <span className="bg-indigo-100 text-indigo-600 text-[9px] font-black px-3 py-1 rounded-full">{layout.length} NODES</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {layout.map((section, index) => (
              <div 
                key={section.id} 
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                  activeEditor === section.id 
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-300 bg-white'
                }`}
                onClick={() => setActiveEditor(section.id)}
              >
                <div className="flex flex-col gap-1 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                    disabled={index === 0}
                    className="text-slate-300 hover:text-indigo-600 disabled:opacity-10"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                    disabled={index === layout.length - 1}
                    className="text-slate-300 hover:text-indigo-600 disabled:opacity-10"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                   activeEditor === section.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                }`}>
                  {SECTION_DEFINITIONS.find(d => d.id === section.type)?.icon && (
                    React.createElement(SECTION_DEFINITIONS.find(d => d.id === section.type)!.icon, { className: "w-5 h-5" })
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <p className={`font-black uppercase tracking-tight text-[11px] italic truncate ${activeEditor === section.id ? 'text-indigo-900' : 'text-slate-700'}`}>{getSectionName(section.type)}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{section.style} ACTIVE</p>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                  className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 ml-2">Inject Module</h4>
              <div className="grid grid-cols-2 gap-2 pb-6">
                {SECTION_DEFINITIONS.map(def => (
                  <button
                    key={def.id}
                    onClick={() => addSection(def.id)}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 border-dashed rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                  >
                    <div className="bg-white p-2 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                       <def.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors">{def.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Workspace - Ultra Bright & High Contrast */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden flex flex-col shadow-sm relative">
          {!activeEditor || !activeSection ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
               <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-8">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Awaiting Signal</h3>
               <p className="text-slate-400 text-xs font-medium max-w-xs">Select a structural node from the left sidebar to begin configuration.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in fade-in duration-500">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  {SECTION_DEFINITIONS.find(d => d.id === activeSection.type)?.icon && (
                    React.createElement(SECTION_DEFINITIONS.find(d => d.id === activeSection.type)!.icon, { className: "w-7 h-7" })
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{getSectionName(activeSection.type)}</h2>
                  <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic underline decoration-indigo-200 underline-offset-4">Configuring Module Parameters</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar bg-white">
                
                {/* Style Matrix */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                     <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] italic">Visual Aesthetic Protocol</label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {activeSection.type === 'hero' && ['slider', 'luxury', 'split', 'centered', 'minimal', 'campaign', 'abstract', 'immersive'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                          activeSection.style === style 
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' 
                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'categories' && ['grid', 'carousel', 'circles'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                          activeSection.style === style 
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' 
                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'featured_products' && ['grid', 'carousel', 'masonry'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                          activeSection.style === style 
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' 
                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'testimonials' && ['cards', 'slider', 'minimal'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`px-4 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                          activeSection.style === style 
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' 
                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Payload */}
                <div className="space-y-10">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
                     <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] italic">Data Payload Configuration</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-10 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                    {activeSection.config?.title !== undefined && (
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Designation (Title)</label>
                        <input 
                          type="text" 
                          value={activeSection.config.title} 
                          onChange={(e) => updateSectionConfig(activeSection.id, 'title', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all font-black uppercase tracking-tighter text-xl italic" 
                          placeholder="Enter Title..."
                        />
                      </div>
                    )}

                    {activeSection.type === 'hero' && (
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contextual Subtext (Subtitle)</label>
                        <input 
                          type="text" 
                          value={activeSection.config.subtitle || ''} 
                          onChange={(e) => updateSectionConfig(activeSection.id, 'subtitle', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all font-bold text-sm" 
                          placeholder="Enter Subtitle..."
                        />
                      </div>
                    )}

                    {activeSection.type === 'testimonials' && (
                      <div className="space-y-8">
                        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                           <div>
                              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic leading-none">Social Proof Records</h4>
                              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-2">Manage customer reviews for this section</p>
                           </div>
                           <button 
                            type="button"
                            onClick={() => {
                              const newItems = [...(activeSection.config.items || [])];
                              newItems.push({ id: Math.random().toString(36).substr(2, 9), name: 'New Customer', role: 'Verified Buyer', content: 'Describe their experience...' });
                              updateSectionConfig(activeSection.id, 'items', newItems);
                            }}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                          >
                            + New Record
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {(activeSection.config.items || []).map((item: any, idx: number) => (
                             <div key={item.id} className="p-8 bg-white rounded-3xl border border-slate-200 space-y-6 relative group shadow-sm hover:shadow-md transition-all">
                               <button 
                                 onClick={() => {
                                   const newItems = [...(activeSection.config.items || [])];
                                   newItems.splice(idx, 1);
                                   updateSectionConfig(activeSection.id, 'items', newItems);
                                 }}
                                 className="absolute top-6 right-6 text-rose-300 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                               >
                                 <Trash2 className="w-5 h-5" />
                               </button>
                               
                               <div className="space-y-4">
                                  <div className="grid grid-cols-1 gap-4">
                                     <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                                        <input 
                                          type="text" 
                                          value={item.name} 
                                          onChange={e => {
                                            const newItems = [...(activeSection.config.items || [])];
                                            newItems[idx].name = e.target.value;
                                            updateSectionConfig(activeSection.id, 'items', newItems);
                                          }}
                                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600/10"
                                        />
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Rank / Designation</label>
                                        <input 
                                          type="text" 
                                          value={item.role} 
                                          onChange={e => {
                                            const newItems = [...(activeSection.config.items || [])];
                                            newItems[idx].role = e.target.value;
                                            updateSectionConfig(activeSection.id, 'items', newItems);
                                          }}
                                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 outline-none focus:ring-2 focus:ring-indigo-600/10"
                                        />
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Transcript (Review Content)</label>
                                     <textarea 
                                       value={item.content} 
                                       onChange={e => {
                                         const newItems = [...(activeSection.config.items || [])];
                                         newItems[idx].content = e.target.value;
                                         updateSectionConfig(activeSection.id, 'items', newItems);
                                       }}
                                       rows={3}
                                       className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-600/10 italic"
                                     />
                                  </div>
                               </div>
                             </div>
                           ))}
                           {(activeSection.config.items || []).length === 0 && (
                             <div className="col-span-2 py-12 bg-white border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400 opacity-60">
                                <p className="text-xs font-black uppercase tracking-[0.2em] italic">No Social Proof Records Detected</p>
                             </div>
                           )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Infrastructure Protocols */}
                <div className="pt-12 border-t border-slate-100">
                   <div 
                    className="flex items-center justify-between p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 cursor-pointer hover:bg-indigo-100/50 transition-all group"
                    onClick={() => toggleDivider(activeSection.id)}
                   >
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeSection.showDivider !== false ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white text-slate-300'}`}>
                           <div className="w-8 h-1 bg-current rounded-full"></div>
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-none">Architectural Separator</h4>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Deploy visual boundary after this module</p>
                        </div>
                     </div>
                     <div className={`w-16 h-8 rounded-full transition-all relative p-1 ${activeSection.showDivider !== false ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-md ${activeSection.showDivider !== false ? 'translate-x-8' : 'translate-x-0'}`}></div>
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
