"use client";

import { useState, useEffect, useRef } from "react";
import { getStoreMedia } from "@/lib/data";
import { ImageIcon, Plus, X, Search, CheckCircle2, Link as LinkIcon, Library, Loader2, UploadCloud } from "lucide-react";
import { Media } from "@prisma/client";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  slug: string;
}

export default function MediaPicker({ value, onChange, slug }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "library" | "url">("upload");

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/store/${slug}/media`);
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error("Failed to fetch media", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        
        const img = new Image();
        img.src = base64Url;
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          const res = await fetch(`/api/store/${slug}/media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: compressedBase64,
              name: file.name,
              type: "image"
            })
          });

          if (res.ok) {
            const newMedia = await res.json();
            onChange(newMedia.url);
            setMedia(prev => [newMedia, ...prev]);
          } else {
            alert("Failed to upload image.");
          }
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };
      };
    } catch (error) {
      console.error(error);
      alert("Error uploading file.");
      setUploading(false);
    }
  };

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      {/* Current Preview or Empty State */}
      {value ? (
        <div className="group relative w-full aspect-video md:aspect-square max-w-[300px] rounded-3xl border-4 border-slate-100 overflow-hidden bg-slate-50 shadow-inner transition-all hover:border-blue-100">
          <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <button 
              type="button"
              onClick={() => onChange("")}
              className="bg-white/90 backdrop-blur-md text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-xl"
              title="Remove Image"
            >
              <X size={20} />
            </button>
            <p className="text-white text-[10px] font-black uppercase tracking-widest">Remove Asset</p>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video md:aspect-square max-w-[300px] rounded-[2.5rem] border-4 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
            <UploadCloud className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="text-slate-900 font-black text-lg">Upload Asset</h4>
          <p className="text-slate-500 text-sm mt-1">Select a photo from your device</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Upload from Device"}
        </button>
        
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-white text-slate-700 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
        >
          <Library className="w-4 h-4 text-blue-600" /> Library
        </button>

        <div className="relative group">
          <button 
            type="button"
            className="bg-white text-slate-700 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
          >
            <LinkIcon className="w-4 h-4 text-purple-600" /> Image URL
          </button>
          
          {/* URL Popover */}
          <div className="absolute left-0 bottom-full mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all z-20">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Paste Image URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={value} 
                onChange={e => onChange(e.target.value)} 
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Media Library</h3>
                <p className="text-slate-500 text-sm font-medium">Select an asset from your store collection</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="bg-white p-3 rounded-full shadow-sm hover:bg-slate-100 transition-all border border-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X />
              </button>
            </div>

            <div className="p-6 border-b bg-white">
               <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search by asset name..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold placeholder:text-slate-400"
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                  <Loader2 className="w-16 h-16 animate-spin mb-4 text-blue-600" />
                  <p className="font-bold text-slate-500">Retrieving your assets...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredMedia.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.url);
                        setIsOpen(false);
                      }}
                      className={`group relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all hover:scale-[1.02] active:scale-[0.98] ${value === item.url ? 'border-blue-600 shadow-2xl shadow-blue-600/20' : 'border-white shadow-lg shadow-slate-200/50 hover:border-blue-100'}`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                         <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{item.name}</p>
                      </div>
                      {value === item.url && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1.5 shadow-xl border-2 border-white animate-in zoom-in">
                           <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                  
                  {filteredMedia.length === 0 && (
                    <div className="col-span-full py-32 text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <ImageIcon size={40} />
                      </div>
                      <p className="text-slate-400 font-bold italic">No matching media found.</p>
                      <button onClick={() => setSearch("")} className="text-blue-600 font-black text-xs uppercase tracking-widest mt-4">Clear Search</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-8 bg-white border-t flex justify-end gap-4">
               <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 bg-slate-100 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-700 hover:bg-slate-200 transition-all"
               >
                 Cancel
               </button>
               <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
               >
                 Confirm Selection
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

