"use client";

import { useState, useEffect } from "react";
import { X, Upload, Check, Loader2, Image as ImageIcon, Plus } from "lucide-react";
import { getStoreMedia, addMedia } from "@/app/store/[slug]/admin/actions";
import { useLanguageStore } from "@/store/language";

interface ImagePickerModalProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
}

export default function ImagePickerModal({ slug, isOpen, onClose, onSelect, currentUrl }: ImagePickerModalProps) {
  const { t } = useLanguageStore();
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(currentUrl);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setIsLoading(true);
    const data = await getStoreMedia(slug);
    setMedia(data);
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // In a real app, you'd upload to S3/Cloudinary. 
      // For this demo, we'll use a local mock or the existing addMedia action if it handles files.
      // Since addMedia expects a URL, we'll mock the upload by using a temporary URL or similar.
      // BUT, since we have Firebase/Supabase, we should ideally upload there.
      
      // Let's assume we have a simple way to get a URL for now or just prompt the user.
      // For now, I'll just simulate it with a random Unsplash image to show it works, 
      // OR I can use a Base64 string if the DB supports it.
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const result = await addMedia(slug, {
          url: base64String,
          name: file.name,
          type: "image"
        });
        await loadMedia();
        if (result.success && result.media) {
          setSelectedUrl(result.media.url);
        } else {
          setSelectedUrl(base64String);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload failed:", err);
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t('mediaLibrary')}</h2>
            <p className="text-sm text-slate-500">{t('chooseImageOrUpload')}</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              <span>{t('uploadNew')}</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
            </label>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 size={40} className="animate-spin text-blue-600" />
              <p className="text-slate-500 font-medium">{t('loadingYourMedia')}</p>
            </div>
          ) : media.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 rounded-3xl">
              <ImageIcon size={48} className="text-slate-300" />
              <div className="text-center">
                <p className="text-slate-900 font-bold">{t('noImagesYet')}</p>
                <p className="text-slate-500 text-sm">{t('uploadFirstImage')}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {media.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedUrl(item.url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
                    selectedUrl === item.url ? 'border-blue-600 ring-4 ring-blue-600/20' : 'border-transparent hover:border-slate-200'
                  }`}
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  {selectedUrl === item.url && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                        <Check size={20} />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-slate-50 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400 hidden sm:block">
            {t('tipUploadMoreImages')}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-white transition-all"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={() => selectedUrl && onSelect(selectedUrl)}
              disabled={!selectedUrl}
              className="flex-1 sm:flex-none px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
            >
              {t('selectImage')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
