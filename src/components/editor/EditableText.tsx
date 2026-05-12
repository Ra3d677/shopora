"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Check, X, Loader2, Move, Type, Palette, Maximize2, AlignLeft, AlignCenter, AlignRight, Bold } from "lucide-react";
import { updateStoreSettings } from "@/app/store/[slug]/admin/actions";
import { useEditorStore } from "@/store/editor";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface TextStyle {
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  fontWeight?: string;
  x?: number;
  y?: number;
  textAlign?: 'left' | 'center' | 'right' | 'inherit';
  textShadow?: string;
  lineHeight?: string;
  letterSpacing?: string;
  fontStyle?: 'normal' | 'italic';
}

interface EditableTextProps {
  content: string;
  slug: string;
  settingsKey: string;
  className?: string;
  initialStyles?: TextStyle;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

const GOOGLE_FONTS = [
  "Inter", "Roboto", "Playfair Display", "Montserrat", "Outfit", "Lexend", 
  "Bebas Neue", "Dancing Script", "Pacifico", "Cormorant Garamond", 
  "Space Grotesk", "Syne", "Cabinet Grotesk", "General Sans"
];

const SHADOW_PRESETS = [
  { name: 'None', value: 'none' },
  { name: 'Soft', value: '2px 2px 8px rgba(0,0,0,0.2)' },
  { name: 'Hard', value: '4px 4px 0px rgba(0,0,0,1)' },
  { name: 'Glow', value: '0 0 20px rgba(59, 130, 246, 0.5)' },
  { name: 'Neon', value: '0 0 10px #3b82f6, 0 0 20px #3b82f6' },
  { name: 'Deep', value: '0 20px 40px rgba(0,0,0,0.4)' },
];

export default function EditableText({ 
  content, 
  slug, 
  settingsKey, 
  className = "", 
  initialStyles = {}, 
  as: Component = 'div' 
}: EditableTextProps) {
  const { isEditMode } = useEditorStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Style States
  const [styles, setStyles] = useState<TextStyle>({
    fontSize: initialStyles.fontSize || "inherit",
    fontFamily: initialStyles.fontFamily || "inherit",
    color: initialStyles.color || "inherit",
    backgroundColor: initialStyles.backgroundColor || "transparent",
    borderRadius: initialStyles.borderRadius || "0px",
    padding: initialStyles.padding || "0px",
    fontWeight: initialStyles.fontWeight || "inherit",
    textAlign: initialStyles.textAlign || 'inherit',
    textShadow: initialStyles.textShadow || 'none',
    lineHeight: initialStyles.lineHeight || 'normal',
    letterSpacing: initialStyles.letterSpacing || 'normal',
    fontStyle: initialStyles.fontStyle || 'normal',
    x: initialStyles.x || 0,
    y: initialStyles.y || 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setText(content);
    setStyles({
      fontSize: initialStyles.fontSize || "inherit",
      fontFamily: initialStyles.fontFamily || "inherit",
      color: initialStyles.color || "inherit",
      backgroundColor: initialStyles.backgroundColor || "transparent",
      borderRadius: initialStyles.borderRadius || "0px",
      padding: initialStyles.padding || "0px",
      fontWeight: initialStyles.fontWeight || "inherit",
      textAlign: initialStyles.textAlign || 'inherit',
      textShadow: initialStyles.textShadow || 'none',
      lineHeight: initialStyles.lineHeight || 'normal',
      letterSpacing: initialStyles.letterSpacing || 'normal',
      fontStyle: initialStyles.fontStyle || 'normal',
      x: initialStyles.x || 0,
      y: initialStyles.y || 0,
    });
  }, [content, JSON.stringify(initialStyles)]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateStoreSettings(slug, {
        [settingsKey]: text,
        [`${settingsKey}_styles`]: styles
      });
      
      if (res && res.success === false) {
        alert("Failed to save to database: " + res.error);
      }
      
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      console.error("Save failed:", error);
      alert("Network error while saving: " + error?.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateStyle = (newStyle: TextStyle) => {
    setStyles(prev => ({ ...prev, ...newStyle }));
  };

  const textStyles = {
    fontSize: styles.fontSize,
    fontFamily: styles.fontFamily,
    color: styles.color,
    backgroundColor: styles.backgroundColor,
    borderRadius: styles.borderRadius,
    padding: styles.padding,
    fontWeight: styles.fontWeight,
    textAlign: styles.textAlign,
    textShadow: styles.textShadow,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    fontStyle: styles.fontStyle,
    position: 'relative' as const,
    cursor: isEditMode ? 'pointer' : 'inherit',
    zIndex: isEditing ? 50 : 1,
  };

  if (!mounted) return null;

  return (
    <>
      <motion.div
        drag={isEditMode}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          updateStyle({
            x: (styles.x || 0) + info.offset.x,
            y: (styles.y || 0) + info.offset.y
          });
        }}
        animate={{ x: styles.x, y: styles.y }}
        onClick={(e) => {
          if (isEditMode) {
             e.stopPropagation();
             setIsEditing(true);
          }
        }}
        className={`relative group inline-block ${className}`}
        style={textStyles}
      >
        <Component 
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => setText(e.currentTarget.innerText)}
          className="outline-none"
        >
          {text}
        </Component>
      </motion.div>

      {mounted && isEditing && createPortal(
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed top-24 right-8 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[2.5rem] z-[9999] overflow-hidden flex flex-col text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Type size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest italic">Text Engine</span>
              </div>
              <button onClick={() => setIsEditing(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {/* Content Edit */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Content</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none font-medium text-white transition-all"
                  placeholder="Enter text..."
                />
              </div>

              {/* Typography */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Font Family</label>
                  <select 
                    value={styles.fontFamily}
                    onChange={(e) => updateStyle({ fontFamily: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500 transition-colors text-white"
                  >
                    <option value="inherit" className="bg-slate-900">Inherit</option>
                    {GOOGLE_FONTS.map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Weight</label>
                  <select 
                    value={styles.fontWeight}
                    onChange={(e) => updateStyle({ fontWeight: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500 transition-colors text-white"
                  >
                    <option value="inherit" className="bg-slate-900">Inherit</option>
                    <option value="100" className="bg-slate-900">Thin</option>
                    <option value="300" className="bg-slate-900">Light</option>
                    <option value="400" className="bg-slate-900">Normal</option>
                    <option value="500" className="bg-slate-900">Medium</option>
                    <option value="600" className="bg-slate-900">Semi-Bold</option>
                    <option value="700" className="bg-slate-900">Bold</option>
                    <option value="900" className="bg-slate-900">Black</option>
                  </select>
                </div>
              </div>

              {/* More Typography & Spacing */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Font Style</label>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button onClick={() => updateStyle({ fontStyle: 'normal' })} className={`flex-1 py-2 rounded-lg text-[10px] font-black ${styles.fontStyle === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>NORMAL</button>
                    <button onClick={() => updateStyle({ fontStyle: 'italic' })} className={`flex-1 py-2 rounded-lg text-[10px] font-black italic ${styles.fontStyle === 'italic' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>ITALIC</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Letter Spacing</label>
                  <input 
                    type="text" 
                    value={styles.letterSpacing}
                    onChange={(e) => updateStyle({ letterSpacing: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500 transition-colors text-white"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Text Color</label>
                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                    <input 
                      type="color" 
                      value={styles.color === 'inherit' ? '#ffffff' : styles.color}
                      onChange={(e) => updateStyle({ color: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-[9px] font-mono opacity-50 uppercase truncate">{styles.color}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Background</label>
                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                    <input 
                      type="color" 
                      value={styles.backgroundColor === 'transparent' ? '#000000' : styles.backgroundColor}
                      onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <button onClick={() => updateStyle({ backgroundColor: 'transparent' })} className="text-[8px] text-blue-400 font-bold">Clear</button>
                  </div>
                </div>
              </div>

              {/* Padding & Radius */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Box Padding</label>
                    <span className="text-[10px] font-bold text-white">{styles.padding}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={parseInt(styles.padding || "0")}
                    onChange={(e) => updateStyle({ padding: `${e.target.value}px` })}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-[9px] text-slate-500 mt-2 italic">Controls space inside the background box</p>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Corner Radius</label>
                    <span className="text-[10px] font-bold text-white">{styles.borderRadius}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={parseInt(styles.borderRadius || "0")}
                    onChange={(e) => updateStyle({ borderRadius: `${e.target.value}px` })}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-[9px] text-slate-500 mt-2 italic">Controls how rounded the corners are</p>
                </div>
              </div>

              {/* Alignment */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Alignment</label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {(['left', 'center', 'right'] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateStyle({ textAlign: a })}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${styles.textAlign === a ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                      {a === 'left' && <AlignLeft size={16} />}
                      {a === 'center' && <AlignCenter size={16} />}
                      {a === 'right' && <AlignRight size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Shadow Effects</label>
                <div className="flex flex-wrap gap-2">
                  {SHADOW_PRESETS.map(p => (
                    <button
                      key={p.name}
                      onClick={() => updateStyle({ textShadow: p.value })}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${styles.textShadow === p.value ? 'bg-white text-slate-900 border-white' : 'border-white/10 text-slate-400 hover:border-white/20'}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position Control */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                 <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Drag Position</label>
                    <button onClick={() => updateStyle({ x: 0, y: 0 })} className="text-[9px] font-black uppercase text-blue-400">Reset</button>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="text-[10px] font-mono text-slate-500">X: <span className="text-white">{Math.round(styles.x || 0)}px</span></div>
                    <div className="text-[10px] font-mono text-slate-500">Y: <span className="text-white">{Math.round(styles.y || 0)}px</span></div>
                 </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Save All Styles</>}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
