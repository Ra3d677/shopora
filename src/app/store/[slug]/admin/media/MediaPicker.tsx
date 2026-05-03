"use client";

import { useState, useEffect } from "react";
import { getStoreMedia } from "@/lib/data";
import { ImageIcon, Plus, X, Search, CheckCircle2, Link as LinkIcon, Library } from "lucide-react";
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

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            placeholder="Paste image URL here..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors border border-slate-200"
        >
          <Library className="w-4 h-4" /> Library
        </button>
      </div>

      {value && (
        <div className="relative w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">Media Library</h3>
                <p className="text-slate-500 text-xs">Select an asset for your product</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-white p-2 rounded-full shadow-sm hover:bg-slate-100 transition-all border border-slate-100 text-slate-400 hover:text-slate-600"><X /></button>
            </div>

            <div className="p-4 border-b">
               <div className="relative">
                  <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search your media..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p>Loading your assets...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMedia.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.url);
                        setIsOpen(false);
                      }}
                      className={`group relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${value === item.url ? 'border-blue-600 shadow-xl scale-[0.98]' : 'border-transparent hover:border-slate-200'}`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                         <p className="text-[10px] font-bold text-white truncate">{item.name}</p>
                      </div>
                      {value === item.url && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-lg">
                           <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                  
                  {filteredMedia.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">
                      No media found matching your search.
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 border-t flex justify-end">
               <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
