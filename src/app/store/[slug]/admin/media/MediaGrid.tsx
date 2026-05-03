"use client";

import { useState, useTransition } from "react";
import { addMedia, deleteMedia } from "../actions";
import { Plus, Trash2, Link as LinkIcon, ExternalLink, Image as ImageIcon, CheckCircle2, Loader2, X } from "lucide-react";
import { Media } from "@prisma/client";

export default function MediaGrid({ initialMedia, slug }: { initialMedia: Media[], slug: string }) {
  const [media, setMedia] = useState<Media[]>(initialMedia);
  const [isAdding, setIsAdding] = useState(false);
  const [newMedia, setNewMedia] = useState({ name: "", url: "", type: "image" });
  const [isPending, startTransition] = useTransition();

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.url || !newMedia.name) return;

    startTransition(async () => {
      const result = await addMedia(slug, newMedia);
      if (result.success) {
        // Optimistically update or just let revalidate work
        // For better UX, we can fetch again or manually update state
        setIsAdding(false);
        setNewMedia({ name: "", url: "", type: "image" });
        window.location.reload(); // Simple way to refresh for now
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    
    startTransition(async () => {
      await deleteMedia(slug, id);
      setMedia(media.filter(m => m.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">{media.length} Assets</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add New Asset
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Media</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleAddMedia} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
                <input 
                  type="text" 
                  required
                  value={newMedia.name}
                  onChange={e => setNewMedia({...newMedia, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Summer Collection Hero"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                   <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="url" 
                      required
                      value={newMedia.url}
                      onChange={e => setNewMedia({...newMedia, url: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Paste a link from Unsplash, Cloudinary, or any source.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {media.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden hover:border-blue-400 transition-all shadow-sm hover:shadow-md">
            <img 
              src={item.url} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-xs font-bold truncate mb-2">{item.name}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.open(item.url, '_blank')}
                  className="flex-1 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-lg transition-colors flex justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 text-red-100 p-2 rounded-lg transition-colors flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Asset Type Icon */}
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-lg">
              <ImageIcon className="w-3 h-3 text-slate-600" />
            </div>
          </div>
        ))}

        {media.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-600">Your media library is empty</h3>
            <p className="text-slate-400 mb-6">Start by adding your first image link or uploading a file.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="text-blue-600 font-bold hover:underline"
            >
              Add your first asset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
