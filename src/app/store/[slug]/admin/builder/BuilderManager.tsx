"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import { saveStoreSettings } from "../actions";
import { StoreSettings } from "@/lib/types";
import { useRouter } from "next/navigation";
import { 
  Blocks, GripVertical, Image as ImageIcon, ShoppingBag, Tag, MessageSquare, Type, Plus, Trash2, Save, Loader2,
  ChevronDown, ChevronUp, Settings, Video, PlayCircle, Link2, Info, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Copy, Text, Star,
} from "lucide-react";
import MediaPicker from "../media/MediaPicker";

export interface LayoutSection {
  id: string;
  type: string;
  style: string;
  config: any;
  showDivider?: boolean;
}

const ECOMMERCE_SECTION_DEFINITIONS = [
  { id: 'hero', name: 'Hero Section', icon: ImageIcon, defaultStyle: 'luxury' },
  { id: 'banners', name: 'Banners Slider', icon: ImageIcon, defaultStyle: 'default' },
  { id: 'categories', name: 'Categories', icon: Tag, defaultStyle: 'grid' },
  { id: 'featured_products', name: 'Featured Products', icon: ShoppingBag, defaultStyle: 'grid' },
  { id: 'sale', name: 'Sale Offers', icon: Tag, defaultStyle: 'grid' },
  { id: 'about_us', name: 'About Us', icon: Info, defaultStyle: 'split' },
  { id: 'testimonials', name: 'Testimonials', icon: MessageSquare, defaultStyle: 'cards' },
  { id: 'text_block', name: 'Rich Text', icon: Type, defaultStyle: 'centered' },
  { id: 'video', name: 'Video Section', icon: Video, defaultStyle: 'default' },
  { id: 'marquee', name: 'Announcement Marquee', icon: Type, defaultStyle: 'default' },
];

const WEBSITE_SECTION_DEFINITIONS = [
  { id: 'hero', name: 'Hero Section', icon: ImageIcon, defaultStyle: 'default' },
  { id: 'packages', name: 'Packages & Services', icon: ShoppingBag, defaultStyle: 'grid' },
  { id: 'about_us', name: 'About Us', icon: Info, defaultStyle: 'split' },
  { id: 'testimonials', name: 'Testimonials', icon: MessageSquare, defaultStyle: 'cards' },
  { id: 'text_block', name: 'Rich Text', icon: Type, defaultStyle: 'centered' },
  { id: 'video', name: 'Video Section', icon: Video, defaultStyle: 'default' },
  { id: 'marquee', name: 'Announcement Marquee', icon: Type, defaultStyle: 'default' },
];

const COLOR_PRESETS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Slate', value: '#f8fafc' },
  { name: 'Gray', value: '#f1f5f9' },
  { name: 'Zinc', value: '#fafafa' },
  { name: 'Rose', value: '#fff1f2' },
  { name: 'Blue', value: '#eff6ff' },
  { name: 'Indigo', value: '#eef2ff' },
  { name: 'Amber', value: '#fffbeb' },
  { name: 'Emerald', value: '#ecfdf5' },
  { name: 'Dark', value: '#0f172a' },
];

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  function execCmd(cmd: string, val?: string) {
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function handleInput() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200">
        {[
          [Bold, 'bold'], [Italic, 'italic'], [Underline, 'underline'],
        ].map(([Icon, cmd]) => (
          <button key={cmd as string} type="button" onMouseDown={e => { e.preventDefault(); execCmd(cmd as string); }}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors">
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <span className="w-px bg-slate-200 mx-1" />
        {[
          [AlignLeft, 'justifyLeft'], [AlignCenter, 'justifyCenter'], [AlignRight, 'justifyRight'],
        ].map(([Icon, cmd]) => (
          <button key={cmd as string} type="button" onMouseDown={e => { e.preventDefault(); execCmd(cmd as string); }}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors">
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <span className="w-px bg-slate-200 mx-1" />
        {['Heading', 'Heading'].map((_, i) => (
          <button key={i} type="button" onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', i === 0 ? 'h2' : 'h3'); }}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors text-xs font-bold">
            H{i + 2}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[180px] p-5 outline-none text-sm text-slate-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      />
    </div>
  );
}

function ColorPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>}
      <div className="flex gap-2 items-center">
        <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer shrink-0" />
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-1">
          {COLOR_PRESETS.map(c => (
            <button key={c.value} type="button" title={c.name} onClick={() => onChange(c.value)}
              className={`w-7 h-7 rounded-lg border border-slate-200 transition-all hover:scale-110 ${value === c.value ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
              style={{ background: c.value }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BuilderManager({ initialSettings, slug, storeType = 'ECOMMERCE' }: { initialSettings: StoreSettings, slug: string, storeType?: string }) {
  const SECTION_DEFINITIONS = storeType === 'WEBSITE' ? WEBSITE_SECTION_DEFINITIONS : ECOMMERCE_SECTION_DEFINITIONS;

  const defaultLayout: LayoutSection[] = storeType === 'WEBSITE' ? [
    { id: 'sec-1', type: 'hero', style: 'default', config: { title: 'Welcome to our platform', subtitle: 'Discover amazing services', btnText: 'Get Started', btnLink: '#', badge: 'FEATURED' } },
    { id: 'sec-2', type: 'packages', style: 'grid', config: { title: 'Our Packages' } },
    { id: 'sec-3', type: 'about_us', style: 'split', config: { title: 'About Us', tagline: 'WHO WE ARE' } },
    { id: 'sec-4', type: 'testimonials', style: 'cards', config: { title: 'What our clients say' } }
  ] : [
    { id: 'sec-1', type: 'hero', style: 'luxury', config: { title: 'Welcome to our store', subtitle: 'Discover amazing products', btnText: 'Shop Now', btnLink: '#', badge: 'NEW ARRIVALS' } },
    { id: 'sec-3', type: 'categories', style: 'grid', config: { title: 'Shop by Category' } },
    { id: 'sec-4', type: 'featured_products', style: 'grid', config: { title: 'Trending Now', subtitle: 'Most popular items' } },
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

  const duplicateSection = (id: string) => {
    const sec = layout.find(s => s.id === id);
    if (!sec) return;
    const newSec: LayoutSection = { ...sec, id: `sec-${Date.now()}` };
    const idx = layout.findIndex(s => s.id === id);
    const newLayout = [...layout];
    newLayout.splice(idx + 1, 0, newSec);
    setLayout(newLayout);
  };

  const addSection = (type: string) => {
    const def = SECTION_DEFINITIONS.find(d => d.id === type);
    if (!def) return;
    const newSection: LayoutSection = {
      id: `sec-${Date.now()}`,
      type, style: def.defaultStyle,
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
          <button onClick={handleSave} disabled={isPending}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-blue-600/20 active:scale-95">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[350px] bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Page Sections</h3>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-full">{layout.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {layout.map((section, index) => (
              <div key={section.id}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${activeEditor === section.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                onClick={() => setActiveEditor(section.id)}>
                <div className="flex flex-col gap-1">
                  <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} disabled={index === 0}
                    className="text-slate-300 hover:text-blue-600 disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} disabled={index === layout.length - 1}
                    className="text-slate-300 hover:text-blue-600 disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeEditor === section.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {getSectionIcon(section.type)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-slate-800 text-sm truncate">{getSectionName(section.type)}</p>
                  <p className="text-[10px] text-slate-400 capitalize truncate">{section.style} Style</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}
                  className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Duplicate">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4 ml-2">Add New Section</h4>
              <div className="grid grid-cols-2 gap-2 pb-6">
                {SECTION_DEFINITIONS.map(def => (
                  <button key={def.id} onClick={() => addSection(def.id)}
                    className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 border-dashed rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all text-slate-500 hover:text-blue-600 group">
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
                <div className="flex-1">
                  <h2 className="text-xl font-black text-slate-900">{getSectionName(activeSection.type)}</h2>
                  <p className="text-sm text-slate-500">Edit content and visual style</p>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Content</div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  <>
                    {activeSection.type === 'sale' && (
                      <div className="space-y-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <label className="text-sm font-bold text-blue-800 flex items-center gap-2">
                          Sale Style
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['grid', 'bento', 'horizontal', 'scroll', 'list', 'bubbles'].map(style => (
                            <button key={style} onClick={() => updateSection(activeSection.id, { style })}
                              className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>{style}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section-specific Content Settings */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                        <Text className="w-4 h-4 text-blue-500" /> Content Settings
                      </h3>

                      {/* Common Fields — Title & Subtitle */}
                      {activeSection.config?.title !== undefined && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Section Title</label>
                          <input type="text" value={activeSection.config.title}
                            onChange={(e) => updateSectionConfig(activeSection.id, 'title', e.target.value)}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold" />
                        </div>
                      )}

                      {(activeSection.type === 'featured_products' || activeSection.type === 'categories' || activeSection.type === 'about_us' || activeSection.type === 'testimonials') && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Subtitle</label>
                          <input type="text" value={activeSection.config.subtitle || ''}
                            onChange={(e) => updateSectionConfig(activeSection.id, 'subtitle', e.target.value)}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                        </div>
                      )}

                      {/* Hero Section */}
                      {activeSection.type === 'hero' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtitle</label>
                            <textarea value={activeSection.config.subtitle || ''} rows={2}
                              onChange={(e) => updateSectionConfig(activeSection.id, 'subtitle', e.target.value)}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">Button Text</label>
                              <input type="text" value={activeSection.config.btnText || ''}
                                onChange={(e) => updateSectionConfig(activeSection.id, 'btnText', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">Button Link</label>
                              <input type="text" value={activeSection.config.btnLink || ''}
                                onChange={(e) => updateSectionConfig(activeSection.id, 'btnLink', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono text-xs" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Badge Text</label>
                            <input type="text" value={activeSection.config.badge || ''}
                              onChange={(e) => updateSectionConfig(activeSection.id, 'badge', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Background Image</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                              <MediaPicker slug={slug} value={activeSection.config.bgImage || ''}
                                onChange={url => updateSectionConfig(activeSection.id, 'bgImage', url)}
                                className="bg-white" />
                            </div>
                          </div>
                        </>
                      )}

                      {/* About Us */}
                      {activeSection.type === 'about_us' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Section Image</label>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                              <MediaPicker slug={slug} value={activeSection.config.image || ''}
                                onChange={url => updateSectionConfig(activeSection.id, 'image', url)}
                                className="bg-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Tagline</label>
                            <input type="text" value={activeSection.config.tagline || ''}
                              onChange={(e) => updateSectionConfig(activeSection.id, 'tagline', e.target.value)}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                              placeholder="WHO WE ARE" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Primary Description</label>
                            <textarea value={activeSection.config.desc1 || ''} rows={4}
                              onChange={(e) => updateSectionConfig(activeSection.id, 'desc1', e.target.value)}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Secondary Description</label>
                            <textarea value={activeSection.config.desc2 || ''} rows={4}
                              onChange={(e) => updateSectionConfig(activeSection.id, 'desc2', e.target.value)}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none text-sm" />
                          </div>
                          {['split', 'centered'].includes(activeSection.style) && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Button Text</label>
                                <input type="text" value={activeSection.config.btnText || 'Learn More'}
                                  onChange={(e) => updateSectionConfig(activeSection.id, 'btnText', e.target.value)}
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Button Link</label>
                                <input type="text" value={activeSection.config.btnLink || '#'}
                                  onChange={(e) => updateSectionConfig(activeSection.id, 'btnLink', e.target.value)}
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono text-xs" />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Testimonials */}
                      {activeSection.type === 'testimonials' && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase">Testimonials</label>
                            <button type="button"
                              onClick={() => {
                                const newItems = [...(activeSection.config.items || [])];
                                newItems.push({ id: Math.random().toString(36).substr(2, 9), name: 'Customer Name', role: 'Verified Buyer', content: 'Excellent service!', rating: 5 });
                                updateSectionConfig(activeSection.id, 'items', newItems);
                              }}
                              className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-all">+ Add New</button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(activeSection.config.items || []).map((item: any, idx: number) => (
                              <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                                <button onClick={() => {
                                  const newItems = [...(activeSection.config.items || [])];
                                  newItems.splice(idx, 1);
                                  updateSectionConfig(activeSection.id, 'items', newItems);
                                }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <div className="space-y-2 flex-1">
                                      <input type="text" value={item.name} placeholder="Name"
                                        onChange={e => { const n = [...(activeSection.config.items || [])]; n[idx].name = e.target.value; updateSectionConfig(activeSection.id, 'items', n); }}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                      <input type="text" value={item.role} placeholder="Role"
                                        onChange={e => { const n = [...(activeSection.config.items || [])]; n[idx].role = e.target.value; updateSectionConfig(activeSection.id, 'items', n); }}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-500" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map(r => (
                                        <button key={r} type="button" onClick={() => { const n = [...(activeSection.config.items || [])]; n[idx].rating = r; updateSectionConfig(activeSection.id, 'items', n); }}
                                          className={`${(item.rating || 5) >= r ? 'text-amber-400' : 'text-slate-200'} hover:scale-110 transition-transform`}>
                                          <Star className="w-4 h-4 fill-current" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <textarea value={item.content} placeholder="Testimonial content..."
                                    onChange={e => { const n = [...(activeSection.config.items || [])]; n[idx].content = e.target.value; updateSectionConfig(activeSection.id, 'items', n); }}
                                    rows={3} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none text-slate-600 italic" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Text Block */}
                      {activeSection.type === 'text_block' && (
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-slate-500 uppercase">Rich Content</label>
                          <RichTextEditor
                            value={activeSection.config.content || ''}
                            onChange={v => updateSectionConfig(activeSection.id, 'content', v)} />
                        </div>
                      )}

                      {/* Video */}
                      {activeSection.type === 'video' && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase">Videos</label>
                            <button type="button"
                              onClick={() => {
                                const items = [...(activeSection.config.items || [])];
                                items.push({ id: Math.random().toString(36).substr(2, 9), url: '', title: '', poster: '' });
                                updateSectionConfig(activeSection.id, 'items', items);
                              }}
                              className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-all">+ Add Video</button>
                          </div>
                          <div className="grid grid-cols-1 gap-6">
                            {(activeSection.config.items || []).length === 0 && (
                              <div className="text-center py-12 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                No videos yet. Click "+ Add Video" to add one.
                              </div>
                            )}
                            {(activeSection.config.items || []).map((item: any, idx: number) => (
                              <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Video #{idx + 1}</span>
                                  <button type="button" onClick={() => {
                                    const items = [...(activeSection.config.items || [])];
                                    items.splice(idx, 1);
                                    updateSectionConfig(activeSection.id, 'items', items);
                                  }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Video URL</label>
                                    <input type="text" value={item.url || ''} placeholder="https://youtube.com/watch?v=..."
                                      onChange={e => {
                                        const items = [...(activeSection.config.items || [])];
                                        items[idx].url = e.target.value;
                                        updateSectionConfig(activeSection.id, 'items', items);
                                      }}
                                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-xs" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Video Title</label>
                                    <input type="text" value={item.title || ''} placeholder="My Video"
                                      onChange={e => {
                                        const items = [...(activeSection.config.items || [])];
                                        items[idx].title = e.target.value;
                                        updateSectionConfig(activeSection.id, 'items', items);
                                      }}
                                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-4 p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">Columns</label>
                              <select value={activeSection.config.columns || 2}
                                onChange={e => updateSectionConfig(activeSection.id, 'columns', parseInt(e.target.value))}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold">
                                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} cols</option>)}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">Display Style</label>
                              <select value={activeSection.config.displayStyle || 'grid'}
                                onChange={e => updateSectionConfig(activeSection.id, 'displayStyle', e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold">
                                <option value="grid">Grid</option>
                                <option value="carousel">Carousel</option>
                                <option value="stacked">Stacked Rows</option>
                                <option value="masonry">Masonry</option>
                                <option value="hero">Hero (Large Featured)</option>
                                <option value="split">Split View</option>
                                <option value="fullwidth">Full-Width Single</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Marquee */}
                      {activeSection.type === 'marquee' && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase">Scrolling Texts</label>
                            <button type="button"
                              onClick={() => {
                                const newItems = [...(activeSection.config.items || [])];
                                newItems.push({ id: Math.random().toString(36).substr(2, 9), text: 'New Announcement' });
                                updateSectionConfig(activeSection.id, 'items', newItems);
                              }}
                              className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100">+ Add Text</button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <ColorPicker label="Background Color" value={activeSection.config.backgroundColor || '#000000'}
                              onChange={v => updateSectionConfig(activeSection.id, 'backgroundColor', v)} />
                            <ColorPicker label="Text Color" value={activeSection.config.textColor || '#ffffff'}
                              onChange={v => updateSectionConfig(activeSection.id, 'textColor', v)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Speed (seconds)</label>
                            <input type="range" min="5" max="60" value={activeSection.config.speed || 20}
                              onChange={e => updateSectionConfig(activeSection.id, 'speed', parseInt(e.target.value))}
                              className="w-full" />
                            <span className="text-xs text-slate-400">{activeSection.config.speed || 20}s per loop</span>
                          </div>
                          <div className="space-y-3">
                            {(activeSection.config.items || []).map((item: any, idx: number) => (
                              <div key={item.id} className="flex gap-2">
                                <input type="text" value={item.text}
                                  onChange={e => { const n = [...(activeSection.config.items || [])]; n[idx].text = e.target.value; updateSectionConfig(activeSection.id, 'items', n); }}
                                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                <button type="button" onClick={() => {
                                  const n = [...(activeSection.config.items || [])]; n.splice(idx, 1);
                                  updateSectionConfig(activeSection.id, 'items', n);
                                }} className="text-red-400 hover:bg-red-50 p-2 rounded-xl transition-colors">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sale */}
                      {activeSection.type === 'sale' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">Badge Text</label>
                              <input type="text" value={activeSection.config.badgeText || 'SALE'}
                                onChange={(e) => updateSectionConfig(activeSection.id, 'badgeText', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                            </div>
                            <ColorPicker label="Badge Color" value={activeSection.config.badgeColor || '#ef4444'}
                              onChange={v => updateSectionConfig(activeSection.id, 'badgeColor', v)} />
                          </div>
                          {['grid', 'bento', 'horizontal'].includes(activeSection.style) && (
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <label className="text-xs font-bold text-slate-500 uppercase">Show Countdown Timer</label>
                              <button onClick={() => updateSectionConfig(activeSection.id, 'showTimer', !activeSection.config.showTimer)}
                                className={`relative w-12 h-6 rounded-full transition-all ${activeSection.config.showTimer ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-sm ${activeSection.config.showTimer ? 'left-6' : 'left-0.5'}`} />
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Featured Products */}
                      {activeSection.type === 'featured_products' && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Columns</label>
                            <select value={activeSection.config.columns || 4}
                              onChange={e => updateSectionConfig(activeSection.id, 'columns', parseInt(e.target.value))}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold">
                              {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} cols</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Max Items</label>
                            <input type="number" min={1} max={50} value={activeSection.config.limit || 8}
                              onChange={e => updateSectionConfig(activeSection.id, 'limit', parseInt(e.target.value))}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 self-end">
                            <label className="text-xs font-bold text-slate-500 uppercase">Show Ratings</label>
                            <button onClick={() => updateSectionConfig(activeSection.id, 'showRatings', !activeSection.config.showRatings)}
                              className={`relative w-12 h-6 rounded-full transition-all ${activeSection.config.showRatings ? 'bg-blue-600' : 'bg-slate-300'}`}>
                              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-sm ${activeSection.config.showRatings ? 'left-6' : 'left-0.5'}`} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Packages */}
                      {activeSection.type === 'packages' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Columns</label>
                            <select value={activeSection.config.columns || 3}
                              onChange={e => updateSectionConfig(activeSection.id, 'columns', parseInt(e.target.value))}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold">
                              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} cols</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Show Pricing</label>
                            <button onClick={() => updateSectionConfig(activeSection.id, 'showPricing', !activeSection.config.showPricing)}
                              className={`relative w-12 h-6 rounded-full transition-all ${activeSection.config.showPricing !== false ? 'bg-blue-600' : 'bg-slate-300'}`}>
                              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-sm ${activeSection.config.showPricing !== false ? 'left-6' : 'left-0.5'}`} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Categories */}
                      {activeSection.type === 'categories' && (
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <label className="text-xs font-bold text-slate-500 uppercase">Show Product Count</label>
                          <button onClick={() => updateSectionConfig(activeSection.id, 'showCount', !activeSection.config.showCount)}
                            className={`relative w-12 h-6 rounded-full transition-all ${activeSection.config.showCount ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-sm ${activeSection.config.showCount ? 'left-6' : 'left-0.5'}`} />
                          </button>
                        </div>
                      )}

                      {/* Banners */}
                      {activeSection.type === 'banners' && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Auto-play Speed (ms)</label>
                          <input type="number" min={1000} max={15000} step={500} value={activeSection.config.autoplaySpeed || 5000}
                            onChange={e => updateSectionConfig(activeSection.id, 'autoplaySpeed', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
                        </div>
                      )}
                    </div>
                  </>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
