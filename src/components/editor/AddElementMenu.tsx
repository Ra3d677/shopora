"use client";

import { Plus, MousePointer2, Image as ImageIcon, Type, Layout, X, Trash2, Settings2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";

interface AddElementMenuProps {
  slug: string;
  settings: any;
}

export default function AddElementMenu({ slug, settings }: AddElementMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sigSettings = settings.signatureSettings || {};
  const currentButtons = sigSettings.heroButtons || [];

  const handleAddButton = async () => {
    let updatedButtons = [...currentButtons];
    
    // Migration: If there was a legacy button but no buttons array yet, 
    // move the legacy button into the new array first
    if (updatedButtons.length === 0 && sigSettings.heroButton) {
      updatedButtons.push({
        id: 'legacy_btn',
        ...sigSettings.heroButton
      });
    }
    
    // Add the new button
    const newButton = {
      id: `btn_${Date.now()}`,
      label: "New Button",
      link: "#",
      style: {
        fontSize: 14,
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        borderRadius: 8,
        x: 0,
        y: 0
      }
    };

    updatedButtons.push(newButton);
    await updateStoreSettingByKey(slug, "signatureSettings.heroButtons", updatedButtons);
    setIsOpen(false);
  };

  const handleDeleteButton = async (index: number) => {
    const updated = currentButtons.filter((_: any, i: number) => i !== index);
    await updateStoreSettingByKey(slug, "signatureSettings.heroButtons", updated);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
      >
        <Plus size={14} /> Add Element
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[1001]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[1002] overflow-hidden p-3"
            >
              {/* Add Section */}
              <div className="px-3 py-2 border-b border-white/5 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Add New Element</span>
              </div>
              
              <button 
                onClick={handleAddButton}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-xs font-bold group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MousePointer2 size={14} />
                </div>
                Add Action Button
              </button>

              {/* Manage Section */}
              {currentButtons.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="px-3 py-2 mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manage Buttons</span>
                    <span className="text-[10px] font-bold text-blue-500">{currentButtons.length}</span>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {currentButtons.map((btn: any, idx: number) => (
                      <div key={btn.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5 group">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-[11px] font-bold text-slate-300 truncate">{btn.label || 'Button'}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteButton(idx)}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholders */}
              <div className="mt-4 pt-4 border-t border-white/5 opacity-40">
                <div className="px-3 py-2 mb-1 flex items-center gap-2">
                  <ImageIcon size={12} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Image Blocks (Coming)</span>
                </div>
                <div className="px-3 py-2 flex items-center gap-2">
                  <Type size={12} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Text Blocks (Coming)</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
