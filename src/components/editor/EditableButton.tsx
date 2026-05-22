"use client";

import { useEditorStore } from "@/store/editor";
import { Link as LinkIcon, Check, X, Loader2, Maximize, Palette, Type as TypeIcon, Square, GripHorizontal, Move } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { createPortal } from "react-dom";
import { useLanguageStore } from "@/store/language";

interface ButtonStyle {
  fontSize?: number;
  fontFamily?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  x?: number;
  y?: number;
}

interface EditableButtonProps {
  label: string;
  link: string;
  slug: string;
  settingsKey: string;
  className?: string;
  style?: ButtonStyle;
  onDelete?: () => Promise<void>;
}

export default function EditableButton({ label, link, slug, settingsKey, className = "", style = {}, onDelete }: EditableButtonProps) {
  const { isEditMode } = useEditorStore();
  const { t } = useLanguageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const [currentLink, setCurrentLink] = useState(link);
  
  // Style states
  const [fontSize, setFontSize] = useState(style.fontSize || 12);
  const [fontFamily, setFontFamily] = useState(style.fontFamily || "sans");
  const [bgColor, setBgColor] = useState(style.backgroundColor || "#ffffff");
  const [textColor, setTextColor] = useState(style.textColor || "#000000");
  const [borderRadius, setBorderRadius] = useState(style.borderRadius || 9999);
  
  // Position states
  const [posX, setPosX] = useState(style.x || 0);
  const [posY, setPosY] = useState(style.y || 0);
  
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelDragControls = useDragControls();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with props ONLY when NOT editing
  useEffect(() => {
    if (!isEditing) {
      setCurrentLabel(label);
      setCurrentLink(link);
      setFontSize(style.fontSize || 12);
      setFontFamily(style.fontFamily || "sans");
      setBgColor(style.backgroundColor || "#ffffff");
      setTextColor(style.textColor || "#000000");
      setBorderRadius(style.borderRadius || 9999);
      setPosX(style.x || 0);
      setPosY(style.y || 0);
    }
  }, [label, link, style, isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStoreSettingByKey(slug, settingsKey, {
        label: currentLabel,
        link: currentLink,
        style: {
          fontSize,
          fontFamily,
          backgroundColor: bgColor,
          textColor,
          borderRadius,
          x: posX,
          y: posY
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const buttonStyle = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily === 'serif' ? 'serif' : fontFamily === 'mono' ? 'monospace' : 'inherit',
    backgroundColor: bgColor,
    color: textColor,
    borderRadius: `${borderRadius}px`,
    x: posX,
    y: posY,
  };

  if (!isEditMode) {
    return (
      <motion.a 
        href={currentLink} 
        className={className} 
        style={buttonStyle}
      >
        {currentLabel}
      </motion.a>
    );
  }

  return (
    <div className="relative inline-block">
      {/* THE DRAGGABLE BUTTON */}
      <motion.div 
        drag={isEditMode}
        dragMomentum={false}
        onDragEnd={(event, info) => {
          setPosX(posX + info.offset.x);
          setPosY(posY + info.offset.y);
        }}
        onClick={() => setIsEditing(true)}
        style={buttonStyle}
        className={`${className} cursor-move transition-none relative z-10 flex items-center justify-center`}
      >
        {currentLabel}
      </motion.div>

      {/* PORTALED DRAGGABLE SETTINGS PANEL */}
      {mounted && isEditing && createPortal(
        <AnimatePresence>
          <motion.div 
            drag
            dragControls={panelDragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[10000] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-5 w-[320px] pointer-events-auto"
            style={{ top: '15%', left: '70%' }}
          >
            {/* Drag Handle Container */}
            <div 
              onPointerDown={(e) => panelDragControls.start(e)}
              className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 cursor-grab active:cursor-grabbing group"
            >
              <div className="flex items-center gap-2">
                <GripHorizontal size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('stylesAndPosition')}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }} 
                className="text-slate-400 hover:text-slate-900 pointer-events-auto"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Position Info */}
              <div className="bg-slate-50 p-2 rounded-lg flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Position X</span>
                    <span className="text-xs font-bold font-mono">{Math.round(posX)}px</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Position Y</span>
                    <span className="text-xs font-bold font-mono">{Math.round(posY)}px</span>
                 </div>
                 <button 
                  onClick={() => { setPosX(0); setPosY(0); }}
                  className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-black text-blue-600 hover:bg-blue-50"
                 >
                    {t('reset')}
                 </button>
              </div>

              {/* Basic Content */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><TypeIcon size={10} /> {t('text')}</label>
                  <input 
                    type="text" 
                    value={currentLabel}
                    onChange={(e) => setCurrentLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm text-slate-900 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><LinkIcon size={10} /> {t('url')}</label>
                  <input 
                    type="text" 
                    value={currentLink}
                    onChange={(e) => setCurrentLink(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm text-slate-900 focus:border-blue-500 outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Style Row 1: Font Size & Radius */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Maximize size={10} /> {t('fontSize')}</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" min="8" max="60" 
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="flex-1 accent-blue-600"
                    />
                    <span className="text-[10px] font-bold w-6 text-slate-900">{fontSize}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Square size={10} /> {t('roundness')}</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" min="0" max="60" 
                      value={borderRadius > 60 ? 60 : borderRadius}
                      onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                      className="flex-1 accent-blue-600"
                    />
                    <span className="text-[10px] font-bold w-6 text-slate-900">{borderRadius > 60 ? t('max') : borderRadius}</span>
                  </div>
                </div>
              </div>

              {/* Style Row 2: Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Palette size={10} /> {t('bgColor')}</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <input 
                      type="color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{bgColor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Palette size={10} /> {t('textColor')}</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <input 
                      type="color" 
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{textColor}</span>
                  </div>
                </div>
              </div>

              {/* Style Row 3: Font Family */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">{t('fontStyle')}</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {(['sans', 'serif', 'mono'] as const).map((font) => (
                    <button
                      key={font}
                      onClick={() => setFontFamily(font)}
                      className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${fontFamily === font ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                       {font}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} /> {t('save')}</>}
                </button>
                {onDelete && (
                  <button 
                    onClick={async () => {
                      if (confirm(t('deleteThisButton'))) {
                        await onDelete();
                        setIsEditing(false);
                      }
                    }}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                    title="Delete Element"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
