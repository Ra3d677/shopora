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
    <div className="p-10 h-[calc(100vh-80px)] flex flex-col gap-8 animate-in fade-in duration-1000">
      {/* Header Section - Premium Design */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(139,92,246,0.3)] rotate-3">
            <Blocks className="w-8 h-8 drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Architect Engine</h1>
            <p className="text-cyan-400/60 text-[10px] font-black uppercase tracking-[0.3em] mt-3 bg-cyan-400/5 px-4 py-1.5 rounded-full border border-cyan-400/10 inline-block italic">Visual Storefront Synthesis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           {saveMessage && (
            <div className="flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in slide-in-from-right-4">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
               <span className="text-[10px] font-black text-green-400 uppercase tracking-widest italic">{saveMessage}</span>
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isPending} 
            className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-indigo-400 hover:text-white transition-all flex items-center gap-4 shadow-2xl disabled:opacity-50 active:scale-95 group"
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />}
            Deploy Architecture
          </button>
        </div>
      </div>

      <div className="flex gap-10 flex-1 overflow-hidden">
        {/* Left Sidebar: Outline & Reorder - Enhanced Glassmorphism */}
        <div className="w-[380px] bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/[0.05] flex flex-col overflow-hidden shadow-2xl relative group/sidebar">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500"></div>
          
          <div className="p-8 border-b border-white/[0.03] flex justify-between items-center bg-white/[0.01]">
            <div>
               <h3 className="font-black text-white text-xs uppercase tracking-widest italic">Temporal Sequence</h3>
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Order of appearance</p>
            </div>
            <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">{layout.length} NODES</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar relative">
            {layout.map((section, index) => (
              <div 
                key={section.id} 
                className={`flex items-center gap-5 p-5 rounded-[2rem] border transition-all cursor-pointer group/item relative overflow-hidden ${
                  activeEditor === section.id 
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]' 
                    : 'border-white/[0.03] hover:border-white/10 bg-white/[0.01]'
                }`}
                onClick={() => setActiveEditor(section.id)}
              >
                {activeEditor === section.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                    disabled={index === 0}
                    className="text-slate-600 hover:text-cyan-400 disabled:opacity-10 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                    disabled={index === layout.length - 1}
                    className="text-slate-600 hover:text-cyan-400 disabled:opacity-10 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                   activeEditor === section.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/[0.03] text-slate-500'
                }`}>
                  {SECTION_DEFINITIONS.find(d => d.id === section.type)?.icon && (
                    React.createElement(SECTION_DEFINITIONS.find(d => d.id === section.type)!.icon, { className: "w-6 h-6" })
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <p className={`font-black uppercase tracking-tighter text-sm italic transition-colors ${activeEditor === section.id ? 'text-white' : 'text-slate-400'}`}>{getSectionName(section.type)}</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1 truncate">{section.style} PROTOCAL ACTIVE</p>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                  className="p-3 text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="mt-10 pt-8 border-t border-white/[0.03]">
              <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6 italic ml-2">Inject New Module</h4>
              <div className="grid grid-cols-2 gap-3 pb-8">
                {SECTION_DEFINITIONS.map(def => (
                  <button
                    key={def.id}
                    onClick={() => addSection(def.id)}
                    className="flex flex-col items-center justify-center gap-3 p-5 bg-white/[0.01] border border-white/[0.03] border-dashed rounded-[2rem] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group/add relative overflow-hidden"
                  >
                    <div className="bg-white/[0.03] p-3 rounded-2xl group-hover/add:scale-110 group-hover/add:bg-indigo-500 transition-all text-slate-500 group-hover/add:text-white">
                       <def.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover/add:text-indigo-400 transition-colors text-center leading-none">{def.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Workspace: Module Configuration */}
        <div className="flex-1 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/[0.05] overflow-hidden flex flex-col relative shadow-2xl">
          {!activeEditor || !activeSection ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 animate-in fade-in zoom-in duration-700">
               <div className="w-32 h-32 bg-white/[0.01] border border-white/[0.03] rounded-full flex items-center justify-center mb-10 group cursor-pointer">
                  <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
               </div>
               <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Awaiting Signal</h3>
               <p className="text-slate-500 text-sm font-medium italic max-w-sm">Select a structural node from the temporal sequence to begin parameter configuration.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
              <div className="p-10 border-b border-white/[0.03] bg-white/[0.01] flex items-center gap-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-700 text-white rounded-3xl flex items-center justify-center shadow-2xl rotate-2">
                  {SECTION_DEFINITIONS.find(d => d.id === activeSection.type)?.icon && (
                    React.createElement(SECTION_DEFINITIONS.find(d => d.id === activeSection.type)!.icon, { className: "w-8 h-8" })
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{getSectionName(activeSection.type)}</h2>
                  <p className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Configuring structural parameters</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                
                {/* Style Matrix */}
                <div className="space-y-6 bg-black/20 p-10 rounded-[2.5rem] border border-white/[0.03]">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-1.5 h-6 bg-cyan-400 rounded-full"></div>
                     <label className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">Visual Aesthetic Protocol</label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Render specific styles based on section type */}
                    {activeSection.type === 'hero' && ['slider', 'luxury', 'split', 'centered', 'minimal', 'campaign', 'abstract', 'immersive'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeSection.style === style 
                            ? 'border-cyan-400 bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                            : 'border-white/[0.05] bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'categories' && ['grid', 'carousel', 'circles'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeSection.style === style 
                            ? 'border-cyan-400 bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                            : 'border-white/[0.05] bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'featured_products' && ['grid', 'carousel', 'masonry'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeSection.style === style 
                            ? 'border-cyan-400 bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                            : 'border-white/[0.05] bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                    {activeSection.type === 'testimonials' && ['cards', 'slider', 'minimal'].map(style => (
                      <button 
                        key={style}
                        onClick={() => updateSection(activeSection.id, { style })}
                        className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeSection.style === style 
                            ? 'border-cyan-400 bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                            : 'border-white/[0.05] bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                    {/* ... other styles */}
                  </div>
                </div>

                {/* Content Payload */}
                <div className="space-y-10">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                     <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">Data Payload Configuration</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-10 bg-white/[0.01] p-10 rounded-[3rem] border border-white/[0.03]">
                    {activeSection.config?.title !== undefined && (
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Designation (Title)</label>
                        <input 
                          type="text" 
                          value={activeSection.config.title} 
                          onChange={(e) => updateSectionConfig(activeSection.id, 'title', e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-black uppercase tracking-tighter text-xl italic" 
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
                          className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" 
                        />
                      </div>
                    )}

                    {activeSection.type === 'marquee' && (
                       <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Chromatic Background</label>
                                <div className="flex gap-4 items-center bg-white/[0.02] p-3 rounded-2xl border border-white/[0.05]">
                                   <input type="color" value={activeSection.config.backgroundColor || '#000000'} onChange={e => updateSectionConfig(activeSection.id, 'backgroundColor', e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0" />
                                   <input type="text" value={activeSection.config.backgroundColor || '#000000'} onChange={e => updateSectionConfig(activeSection.id, 'backgroundColor', e.target.value)} className="flex-1 bg-transparent text-white font-mono text-sm uppercase" />
                                </div>
                              </div>
                              <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Chromatic Text</label>
                                <div className="flex gap-4 items-center bg-white/[0.02] p-3 rounded-2xl border border-white/[0.05]">
                                   <input type="color" value={activeSection.config.textColor || '#ffffff'} onChange={e => updateSectionConfig(activeSection.id, 'textColor', e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0" />
                                   <input type="text" value={activeSection.config.textColor || '#ffffff'} onChange={e => updateSectionConfig(activeSection.id, 'textColor', e.target.value)} className="flex-1 bg-transparent text-white font-mono text-sm uppercase" />
                                </div>
                              </div>
                          </div>
                       </div>
                    )}
                  </div>
                </div>

                {/* Infrastructure Protocols */}
                <div className="pt-12 border-t border-white/[0.03]">
                   <div 
                    className="flex items-center justify-between p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 cursor-pointer group"
                    onClick={() => toggleDivider(activeSection.id)}
                   >
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeSection.showDivider !== false ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/[0.03] text-slate-600'}`}>
                           <div className="w-8 h-1 bg-current rounded-full"></div>
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Architectural Separator</h4>
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Deploy visual boundary after this module</p>
                        </div>
                     </div>
                     <div className={`w-16 h-8 rounded-full transition-all relative p-1 ${activeSection.showDivider !== false ? 'bg-indigo-500' : 'bg-white/10'}`}>
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
