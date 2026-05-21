"use client";

import { useEditorStore } from "@/store/editor";
import { X, Type, Link as LinkIcon, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { updateStoreSettingByKey } from "@/app/store/[slug]/admin/actions";
import { motion, AnimatePresence } from "framer-motion";
import ImagePickerModal from "./ImagePickerModal";
import { useLanguageStore } from "@/store/language";

export default function EditorSidebar() {
  const { isEditMode, selectedElement, setSelectedElement } = useEditorStore();
  const { t } = useLanguageStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  useEffect(() => {
    if (selectedElement) {
      setFormData(selectedElement.data);
    }
  }, [selectedElement]);

  if (!isEditMode) return null;

  const handleSave = async () => {
    if (!selectedElement) return;
    setIsSaving(true);
    try {
      if (selectedElement.type === 'button') {
        await updateStoreSettingByKey(selectedElement.slug, `${selectedElement.settingsKey}.label`, formData.label);
        await updateStoreSettingByKey(selectedElement.slug, `${selectedElement.settingsKey}.link`, formData.link);
      } else if (selectedElement.type === 'image') {
        await updateStoreSettingByKey(selectedElement.slug, selectedElement.settingsKey, formData.src);
      }
      
      // Update local state to reflect changes immediately without full reload
      selectedElement.data = { ...formData };
      
      // Show success briefly
      setTimeout(() => setSelectedElement(null), 500);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {selectedElement && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl border-l border-slate-200 z-[9999] flex flex-col font-sans"
          >
            {/* Header */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">
                {selectedElement.type === 'button' ? t('editButton') : t('editImage')}
              </h3>
              <button 
                onClick={() => setSelectedElement(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Button Settings */}
              {selectedElement.type === 'button' && (
                <div className="space-y-6">
                  
                  {/* Label Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-900">
                      {t('buttonText')}
                    </label>
                    <input 
                      type="text" 
                      value={formData.label || ''}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-lg px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
                      placeholder={t('e.gShopNow')}
                    />
                  </div>
                  
                  {/* Link Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-900">
                      {t('buttonLinkURL')}
                    </label>
                    <input 
                      type="text" 
                      value={formData.link || ''}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-lg px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
                      placeholder={t('storeSlashPlaceholder')}
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              {/* Image Settings */}
              {selectedElement.type === 'image' && (
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-bold text-slate-900">
                    {t('currentImage')}
                  </label>
                  <div className="w-full h-48 bg-slate-100 border-2 border-slate-300 rounded-lg overflow-hidden flex items-center justify-center p-2">
                    <img src={formData.src} className="max-w-full max-h-full object-contain" alt={t('preview')} />
                  </div>
                  <button 
                    onClick={() => setIsMediaModalOpen(true)}
                    className="w-full py-3 bg-slate-100 border-2 border-slate-300 text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    {t('changeImage')}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-4 bg-blue-600 text-white text-base font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : t('saveChanges')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedElement?.type === 'image' && (
        <ImagePickerModal 
          slug={selectedElement.slug}
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={(url) => {
            setFormData({ ...formData, src: url });
            setIsMediaModalOpen(false);
          }}
          currentUrl={formData.src}
        />
      )}
    </>
  );
}
