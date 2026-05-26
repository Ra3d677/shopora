"use client";

import { useState, useRef, useEffect } from "react";
import { Save, Loader2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { saveStoreSettings } from "../actions";
import MediaPicker from "../media/MediaPicker";

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
    const fragment = range.cloneContents();
    const temp = document.createElement('div');
    temp.appendChild(fragment);
    range.deleteContents();
    document.execCommand('insertHTML', false, `<div style="font-size: ${clamped}px">${temp.innerHTML}</div>`);
    savedRange.current = null;
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
            <p className="text-center text-sm font-bold mt-1" style={{ textShadow: buildTextShadow(shadow) }}>
              معاينة الظل
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const FONTS = ["Inter", "Roboto", "Playfair Display", "Montserrat", "Outfit", "Lexend", "Bebas Neue", "Dancing Script", "Pacifico", "Cormorant Garamond", "Space Grotesk", "Syne", "Cabinet Grotesk", "General Sans", "Cairo"];

const STYLES = [
  { id: 'split', name: 'منقسم (نص + صورة)' },
  { id: 'centered', name: 'في المنتصف' },
  { id: 'minimal', name: 'بسيط' },
];

export default function AboutUsManager({ slug, initialContent }: { slug: string; initialContent: any }) {
  const [content, setContent] = useState(initialContent || {
    title: 'About Us',
    tagline: 'WHO WE ARE',
    desc1: '',
    desc2: '',
    image: '',
    btnText: '',
    btnLink: '#',
    fontFamily: 'inherit',
    textShadow: { h: 0, v: 0, blur: 0, color: '#000', opacity: 0 },
    style: 'split',
  });
  const [saving, setSaving] = useState(false);

  function update(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await saveStoreSettings(slug, { aboutUsContent: content });
      if (res?.success === false) alert(res.error);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">About Us</h1>
        <button onClick={handleSave} disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-8">
        {/* Layout Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">الشكل</label>
          <div className="flex gap-2">
            {STYLES.map(s => (
              <button key={s.id} type="button" onClick={() => update('style', s.id)}
                className={`px-5 py-3 rounded-xl border text-xs font-bold capitalize transition-all ${content.style === s.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">صورة القسم</label>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <MediaPicker slug={slug} value={content.image || ''}
              onChange={url => update('image', url)}
              className="bg-white" />
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Tagline</label>
          <input type="text" value={content.tagline || ''}
            onChange={e => update('tagline', e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            placeholder="WHO WE ARE" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">العنوان</label>
          <input type="text" value={content.title || ''}
            onChange={e => update('title', e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            placeholder="About Us" />
        </div>

        {/* desc1 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">النص الأول</label>
          <RichTextEditor value={content.desc1 || ''}
            onChange={v => update('desc1', v)} />
        </div>

        {/* desc2 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">النص الثاني</label>
          <RichTextEditor value={content.desc2 || ''}
            onChange={v => update('desc2', v)} />
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">نوع الخط</label>
          <select value={content.fontFamily || 'inherit'}
            onChange={e => update('fontFamily', e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            style={{ fontFamily: content.fontFamily || 'inherit' }}>
            <option value="inherit">Default</option>
            {FONTS.map(f => (
              <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
            ))}
          </select>
        </div>

        {/* Text Shadow */}
        <TextShadowEditor value={content.textShadow}
          onChange={v => update('textShadow', v)} />

        {/* Button */}
        {['split', 'centered'].includes(content.style) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">نص الزر</label>
              <input type="text" value={content.btnText || ''}
                onChange={e => update('btnText', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Learn More" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">رابط الزر</label>
              <input type="text" value={content.btnLink || '#'}
                onChange={e => update('btnLink', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono text-xs" />
            </div>
          </div>
        )}

        {/* Save button at bottom */}
        <div className="pt-4 border-t border-slate-200">
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-95">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
