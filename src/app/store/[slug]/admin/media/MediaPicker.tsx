"use client";

import { useState, useEffect, useRef } from "react";
import { getStoreMedia } from "@/lib/data";
import { ImageIcon, Plus, X, Search, CheckCircle2, Link as LinkIcon, Library, Loader2, UploadCloud } from "lucide-react";
import { Media } from "@prisma/client";
import { cn } from "@/lib/utils";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  slug: string;
  className?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export default function MediaPicker({ 
  value, 
  onChange, 
  slug, 
  className,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6
}: MediaPickerProps) {
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
      const isVideo = file.type.startsWith("video/");
      
      if (isVideo) {
        // Direct upload for videos (no client-side compression for now)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (event) => {
          const base64Url = event.target?.result as string;
          
          const res = await fetch(`/api/store/${slug}/media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: base64Url,
              name: file.name,
              type: "video"
            })
          });

          if (res.ok) {
            const newMedia = await res.json();
            onChange(newMedia.url);
            setMedia(prev => [newMedia, ...prev]);
          } else {
            alert("Failed to upload video.");
          }
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };
        return;
      }

      // Existing image logic
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        
        const img = new Image();
        img.src = base64Url;
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = maxWidth;
          const MAX_HEIGHT = maxHeight;
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
          
          // Use WebP format to preserve transparency (alpha channel) for logos/icons while maintaining excellent compression
          const compressedBase64 = canvas.toDataURL("image/webp", quality);

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
    <div className={cn("space-y-2", className)}>
      {/* Current Preview or Empty State */}
      {value ? (
        <div className="relative w-full aspect-[4/3] max-w-[160px] rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-sm group">
          {value.includes("video") || value.includes(".mp4") || value.includes(".webm") ? (
            <video src={value} className="w-full h-full object-cover" muted />
          ) : (
            <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          <button 
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 transition-all shadow-md z-10 hover:scale-110 flex items-center justify-center"
            title="Remove"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-[4/3] max-w-[160px] rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-white/[0.04] hover:border-cyan-500/40 transition-all group"
        >
          <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 mb-1.5 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
          </div>
          <h4 className="text-white font-bold text-[10px] uppercase tracking-wide">Upload</h4>
          <p className="text-slate-500 text-[8px] mt-0.5">Select from device</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*,video/*" 
          className="hidden" 
        />
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg font-bold text-[8px] uppercase tracking-wider flex items-center gap-1 transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-white/5 border border-white/5 text-white px-3 py-1.5 rounded-lg font-bold text-[8px] uppercase tracking-wider flex items-center gap-1 hover:bg-white/10 transition-all"
        >
          <Library className="w-3 h-3 text-cyan-400" /> Library
        </button>

        <div className="relative">
          <button 
            type="button"
            onClick={() => setActiveTab(activeTab === 'url' ? 'upload' : 'url')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold text-[8px] uppercase tracking-wider flex items-center gap-1 transition-all border",
              activeTab === 'url' ? "bg-cyan-500 border-cyan-500 text-white" : "bg-white/5 border-white/5 text-white hover:bg-white/10"
            )}
          >
            <LinkIcon className={cn("w-3 h-3", activeTab === 'url' ? "text-white" : "text-cyan-400")} /> URL
          </button>
          
          {/* URL Popover */}
          {activeTab === 'url' && (
            <div className="absolute left-0 bottom-full mb-4 w-80 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-6 z-30 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">External Asset Link</label>
                <button onClick={() => setActiveTab('upload')} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={value} 
                    onChange={e => onChange(e.target.value)} 
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-xs font-medium"
                    autoFocus
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Set URL Resource
                </button>
              </div>
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45"></div>
            </div>
          )}
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
                      {item.url.includes("video") || item.type === "video" ? (
                        <video src={item.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      )}
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

