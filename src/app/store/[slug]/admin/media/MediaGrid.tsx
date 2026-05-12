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
    <div className="space-y-12">
      <div className="flex justify-between items-center bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/[0.05] shadow-2xl">
        <div className="flex items-center gap-6">
           <div className="w-1.5 h-12 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
           <div>
             <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{media.length} <span className="text-cyan-400">Items</span></h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Active Resource Inventory</p>
           </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-4 shadow-2xl group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> New Deployment
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-[#0f111a] rounded-[3rem] border border-white/[0.1] shadow-[0_0_100px_rgba(0,0,0,1)] w-full max-w-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            
            <div className="p-10 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Initialize Asset</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Register new resource to the vault</p>
              </div>
              <button 
                onClick={() => setIsAdding(false)} 
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Designation</label>
                <input 
                  type="text" 
                  required
                  value={newMedia.name}
                  onChange={e => setNewMedia({...newMedia, name: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold"
                  placeholder="e.g. CORE_BANNER_ALPHA"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Source Protocol (URL)</label>
                <div className="relative group">
                  <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:scale-110 transition-transform" />
                  <input 
                    type="url" 
                    required
                    value={newMedia.url}
                    onChange={e => setNewMedia({...newMedia, url: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl pl-16 pr-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium text-sm"
                    placeholder="https://cdn.resource.com/..."
                  />
                </div>
                <p className="text-[9px] font-medium text-slate-600 mt-3 flex items-center gap-2 italic">
                   <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></div>
                   Direct link from external distribution node.
                </p>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-8 py-5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-white/5"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="flex-[2] px-8 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50 shadow-cyan-500/20"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />}
                  Deploy Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {media.map((item) => (
          <div key={item.id} className="group relative aspect-[4/5] rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] overflow-hidden hover:border-cyan-400/50 transition-all duration-700 shadow-2xl hover:shadow-cyan-400/10">
            <img 
              src={item.url} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white text-xs font-black uppercase tracking-widest mb-4 truncate italic">{item.name}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => window.open(item.url, '_blank')}
                    className="flex-1 h-12 bg-white text-black hover:bg-cyan-400 transition-all flex items-center justify-center rounded-2xl shadow-xl"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 h-12 bg-white/10 backdrop-blur-md hover:bg-rose-500 text-white transition-all flex items-center justify-center rounded-2xl border border-white/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Badge */}
            <div className="absolute top-6 right-6 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl group-hover:bg-cyan-400 transition-all group-hover:scale-110 duration-500">
              <ImageIcon className="w-4 h-4 text-white group-hover:text-black" />
            </div>
          </div>
        ))}

        {media.length === 0 && (
          <div className="col-span-full py-40 text-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 blur-[100px] -z-10 group-hover:bg-cyan-500/10 transition-all duration-700"></div>
            <div className="w-24 h-24 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-2xl">
              <ImageIcon className="w-10 h-10 text-slate-800" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">Zero Assets Detected</h3>
            <p className="text-slate-600 text-sm font-medium mb-10 max-w-sm mx-auto">Vault is currently empty. Initialize a new resource deployment to begin building your visual library.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all bg-cyan-400/5 px-8 py-4 rounded-full border border-cyan-400/20 hover:bg-cyan-400/20"
            >
              Start Deployment Sequence
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
