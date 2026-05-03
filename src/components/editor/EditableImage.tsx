"use client";

import { useEditorStore } from "@/store/editor";
import { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";

interface EditableImageProps {
  src: string;
  alt: string;
  slug: string;
  settingsKey: string;
  className?: string;
}

export default function EditableImage({ src, alt, slug, settingsKey, className = "" }: EditableImageProps) {
  const { isEditMode, selectedElement, setSelectedElement } = useEditorStore();
  const [currentSrc, setCurrentSrc] = useState(src);

  const isSelected = selectedElement?.settingsKey === settingsKey;

  // Sync state if it changed from the sidebar
  useEffect(() => {
    if (selectedElement?.settingsKey === settingsKey && selectedElement.data.src) {
      setCurrentSrc(selectedElement.data.src);
    } else {
      setCurrentSrc(src);
    }
  }, [src, selectedElement, settingsKey]);

  if (!isEditMode) {
    return <img src={currentSrc} alt={alt} className={className} />;
  }

  return (
    <div className={`relative group/edit-image w-full h-full ${isEditMode ? 'ring-2 ring-dashed ring-offset-2 ' + (isSelected ? 'ring-blue-600' : 'ring-slate-400/50 hover:ring-blue-400') : ''} transition-all`}>
      {isEditMode && !isSelected && (
        <div className="absolute inset-0 border-2 border-dashed border-slate-400/30 pointer-events-none z-[55] animate-pulse" />
      )}
      <img src={currentSrc} alt={alt} className={`${className} transition-all duration-500`} />
      
      <div className={`absolute inset-0 bg-blue-600/0 ${isSelected ? 'bg-blue-600/10' : 'group-hover/edit-image:bg-blue-600/10'} transition-all flex items-center justify-center pointer-events-none z-[60]`}>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedElement({
              type: 'image',
              settingsKey,
              slug,
              data: { src: currentSrc }
            });
          }}
          className={`pointer-events-auto opacity-0 ${isSelected ? 'opacity-100 scale-100 bg-blue-600 text-white' : 'group-hover/edit-image:opacity-100 scale-90 group-hover/edit-image:scale-100 bg-white text-slate-900'} transition-all px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-blue-600 hover:text-white z-[70] border border-slate-200`}
        >
          <ImageIcon size={16} />
          {isSelected ? 'EDITING IMAGE...' : 'EDIT IMAGE'}
        </button>
      </div>
    </div>
  );
}
