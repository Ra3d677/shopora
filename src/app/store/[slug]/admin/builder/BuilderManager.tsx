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

const SHADOW_PRESETS = [
  { name: 'بدون', h: 0, v: 0, blur: 0, color: '#000', opacity: 0 },
  { name: 'ناعم', h: 0, v: 4, blur: 12, color: '#000', opacity: 15 },
  { name: 'ساقط', h: 2, v: 2, blur: 0, color: '#000', opacity: 30 },
  { name: 'مموه', h: 0, v: 3, blur: 20, color: '#000', opacity: 18 },
  { name: 'متوهج', h: 0, v: 0, blur: 25, color: '#3b82f6', opacity: 60 },
  { name: 'نيون', h: 0, v: 0, blur: 12, color: '#06b6d4', opacity: 80 },
  { name: 'بنفسجي', h: 3, v: 3, blur: 0, color: '#8b5cf6', opacity: 35 },
  { name: 'بارز', h: 0, v: 0, blur: 8, color: '#fff', opacity: 60 },
  { name: 'ذهبي', h: 0, v: 0, blur: 10, color: '#f59e0b', opacity: 50 },
  { name: 'عميق', h: 0, v: 8, blur: 24, color: '#000', opacity: 30 },
];

function buildTextShadow(shadow: { h: number; v: number; blur: number; color: string; opacity: number } | null): string {
  if (!shadow || shadow.opacity === 0) return 'none';
  const r = parseInt(shadow.color.slice(1, 3), 16);
  const g = parseInt(shadow.color.slice(3, 5), 16);
  const b = parseInt(shadow.color.slice(5, 7), 16);
  return `${shadow.h}px ${shadow.v}px ${shadow.blur}px rgba(${r},${g},${b},${shadow.opacity / 100})`;
}

function TextShadowEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const shadow = value || { h: 0, v: 0, blur: 0, color: '#000', opacity: 0 };
  const active = shadow.opacity > 0;

  function pickPreset(p: typeof SHADOW_PRESETS[number]) {
    onChange({ h: p.h, v: p.v, blur: p.blur, color: p.color, opacity: p.opacity });
  }

  function updateField(field: string, val: number | string) {
    onChange({ ...shadow, [field]: val });
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-500 uppercase">ظل النص</label>
      {/* Presets */}
      <div className="grid grid-cols-5 gap-1.5">
        {SHADOW_PRESETS.map(p => {
          const isActive = shadow.h === p.h && shadow.v === p.v && shadow.blur === p.blur &&
            shadow.color === p.color && shadow.opacity === p.opacity;
          const previewCss = p.opacity > 0 ? buildTextShadow(p) : 'none';
          return (
            <button key={p.name} type="button" onClick={() => pickPreset(p)}
              className={`p-2 rounded-xl text-[9px] font-bold transition-all border ${isActive ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <span className="block text-center leading-tight" style={{ textShadow: previewCss }}>{p.name}</span>
            </button>
          );
        })}
      </div>
      {/* Customization */}
      {active && (
        <div className="space-y-2.5 bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-bold text-slate-400 w-12">اللون</label>
            <input type="color" value={shadow.color}
              onChange={e => updateField('color', e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200" />
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={100} value={shadow.opacity}
                onChange={e => updateField('opacity', parseInt(e.target.value))}
                className="w-20 h-1.5 accent-blue-500" />
              <span className="text-[10px] font-mono text-slate-400 w-6">{shadow.opacity}%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'أفقي', field: 'h', min: -20, max: 20 },
              { label: 'رأسي', field: 'v', min: -20, max: 20 },
              { label: 'ضباب', field: 'blur', min: 0, max: 40 },
            ].map(({ label, field, min, max }) => (
              <div key={field}>
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-bold text-slate-400">{label}</span>
                  <span className="text-[9px] font-mono text-slate-500">{shadow[field]}px</span>
                </div>
                <input type="range" min={min} max={max}
                  value={shadow[field]}
                  onChange={e => updateField(field, parseInt(e.target.value))}
                  className="w-full h-1 accent-blue-500" />
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-200">
            <p className="text-[9px] text-slate-400 text-center font-mono truncate"
              style={{ textShadow: buildTextShadow(shadow) }}>
              {buildTextShadow(shadow)}
            </p>
            <p className="text-center text-sm font-bold mt-1" style={{ textShadow: buildTextShadow(shadow) }}>
              معاينة الظل
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('16');
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0);
    }
  }

  function execCmd(cmd: string, val?: string) {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function handleInput() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function applyFontSize(size: string) {
    if (!size || !editorRef.current) return;
    const parsed = parseInt(size, 10);
    if (isNaN(parsed)) return;
    const clamped = Math.min(200, Math.max(8, parsed));
    setFontSize(String(clamped));
    editorRef.current.focus();
    const sel = window.getSelection();
    if (!sel) return;
    if (savedRange.current) {
      try { sel.removeAllRanges(); sel.addRange(savedRange.current); } catch { return; }
    }
    if (sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    // Clone, delete, then re-insert with styled wrapper
    const fragment = range.cloneContents();
    const temp = document.createElement('div');
    temp.appendChild(fragment);
    range.deleteContents();
    document.execCommand('insertHTML', false, `<div style="font-size: ${clamped}px">${temp.innerHTML}</div>`);
    savedRange.current = null;
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function toggleHighlight() {
    if (editorRef.current) editorRef.current.focus();
    execCmd('hiliteColor', '#ffff00');
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
        <input type="number" value={fontSize} min={8} max={200}
          onChange={e => applyFontSize(e.target.value)}
          onMouseDown={saveSelection}
          onFocus={saveSelection}
          className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center outline-none"
          title="Font Size (px)" />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[180px] p-5 outline-none text-sm text-slate-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-2 [&_div]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_mark]:bg-yellow-200"
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
        : type === 'hero'
        ? { title: `New ${def.name}`, subtitle: 'Add your description here', btnText: 'Shop Now', btnLink: '#', bgImage: '' }
        : { title: `New ${def.name}` },
      showDivider: false
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

                    {/* Style Selector */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        Layout Style
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {activeSection.type === 'hero' && ['slider', 'luxury', 'split', 'centered', 'minimal', 'campaign', 'abstract', 'immersive', 'dddyou'].map(style => (
                          <button key={style} onClick={() => updateSection(activeSection.id, { style })}
                            className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>{style}</button>
                        ))}
                        {activeSection.type === 'categories' && ['grid', 'carousel', 'circles'].map(style => (
                          <button key={style} onClick={() => updateSection(activeSection.id, { style })}
                            className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>{style}</button>
                        ))}
                        {activeSection.type === 'packages' && ['grid', 'list', 'cards', 'compact', 'featured'].map(style => (
                          <button key={style} onClick={() => updateSection(activeSection.id, { style })}
                            className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>{style}</button>
                        ))}
                        {activeSection.type === 'about_us' && ['split', 'centered', 'minimal'].map(style => (
                          <button key={style} onClick={() => updateSection(activeSection.id, { style })}
                            className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>{style}</button>
                        ))}
                        {activeSection.type === 'featured_products' && ['grid', 'carousel', 'masonry'].map(style => (
                          <button key={style} onClick={() => updateSection(activeSection.id, { style })}
                            className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>{style}</button>
                        ))}
                        {activeSection.type === 'testimonials' && ['cards', 'slider', 'minimal'].map(style => (
                          <button key={style} onClick={() => updateSection(activeSection.id, { style })}
                            className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>{style}</button>
                        ))}
                        {activeSection.type === 'text_block' && ['centered', 'left', 'right', 'bordered', 'highlight'].map(style => (
                          <button key={style} onClick={() => updateSection(activeSection.id, { style })}
                            className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${activeSection.style === style ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}>{style}</button>
                        ))}
                      </div>
                    </div>

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
                            <RichTextEditor value={activeSection.config.desc1 || ''}
                              onChange={v => updateSectionConfig(activeSection.id, 'desc1', v)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Secondary Description</label>
                            <RichTextEditor value={activeSection.config.desc2 || ''}
                              onChange={v => updateSectionConfig(activeSection.id, 'desc2', v)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Font Family</label>
                            <select value={activeSection.config.fontFamily || 'inherit'}
                              onChange={(e) => updateSectionConfig(activeSection.id, 'fontFamily', e.target.value)}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                              style={{ fontFamily: activeSection.config.fontFamily || 'inherit' }}>
                              <option value="inherit">Default</option>
                              {["Inter", "Roboto", "Playfair Display", "Montserrat", "Outfit", "Lexend", "Bebas Neue", "Dancing Script", "Pacifico", "Cormorant Garamond", "Space Grotesk", "Syne", "Cabinet Grotesk", "General Sans", "Cairo"].map(f => (
                                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">ظل النص (للفقرات)</label>
                            <TextShadowEditor value={activeSection.config.textShadow}
                              onChange={v => updateSectionConfig(activeSection.id, 'textShadow', v)} />
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
