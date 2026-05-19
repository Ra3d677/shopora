"use client";

import { useState, useTransition } from "react";
import { Category } from "@/lib/types";
import { deleteCategory, addCategory, updateCategory, updateStoreSettings } from "../actions";
import { Edit, Trash2, Plus, X, Loader2, LayoutGrid, Layout, List, Circle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MediaPicker from "../media/MediaPicker";
import { useLanguageStore } from "@/store/language";

export default function CategoriesManager({ initialCategories, slug, settings }: { initialCategories: Category[], slug: string, settings: any }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t, language } = useLanguageStore();
  const isRTL = language === 'ar';

  const [isEditing, setIsEditing] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'collections'>('home');
  const [homeLayout, setHomeLayout] = useState(settings.categoryLayout?.home || 'bento');
  const [collectionsLayout, setCollectionsLayout] = useState(settings.categoryLayout?.collections || 'grid');
  const [isUpdatingLayout, setIsUpdatingLayout] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const layouts = [
    { id: 'bento', name: 'Bento Grid', icon: Layout, desc: 'Premium cinematic mosaic' },
    { id: 'grid', name: 'Standard Grid', icon: LayoutGrid, desc: 'Clean 4-column layout' },
    { id: 'scroll', name: 'Horizontal Scroll', icon: ChevronRight, desc: 'Sleek carousel strip' },
    { id: 'list', name: 'Minimal List', icon: List, desc: 'Simple vertical list' },
    { id: 'circles', name: 'Circle Bubbles', icon: Circle, desc: 'Modern social-style bubbles' },
  ];

  const handleLayoutSelect = (layoutId: string) => {
    if (activeTab === 'home') setHomeLayout(layoutId);
    else setCollectionsLayout(layoutId);
    setHasChanges(true);
  };

  const handleSaveLayout = async () => {
    setIsUpdatingLayout(true);
    try {
      // Save both settings in ONE call to avoid race conditions
      await updateStoreSettings(slug, {
        "categoryLayout.home": homeLayout,
        "categoryLayout.collections": collectionsLayout
      });
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      router.refresh();
    } catch (error) {
      console.error("Failed to update layout:", error);
    } finally {
      setIsUpdatingLayout(false);
    }
  };

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
    image: "",
    parentId: ""
  });

  const handleDelete = async (id: string) => {
    if (confirm(t('confirmDeleteCategory'))) {
      setCategories(categories.filter(c => c.id !== id));
      startTransition(async () => {
        await deleteCategory(slug, id);
        router.refresh();
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setCategories(categories.map(c => c.id === isEditing.id ? { ...c, ...formData } as Category : c));
      startTransition(async () => {
        await updateCategory(slug, isEditing.id, formData);
        router.refresh();
      });
    } else {
      startTransition(async () => {
        await addCategory(slug, formData as Omit<Category, "id">);
        router.refresh();
        window.location.reload(); 
      });
    }
    setIsEditing(null);
    setIsAdding(false);
  };

  const startEdit = (category: Category) => {
    setFormData(category);
    setIsEditing(category);
    setIsAdding(false);
  };

  const startAdd = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      parentId: ""
    });
    setIsAdding(true);
    setIsEditing(null);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`p-10 space-y-12 animate-in fade-in duration-700 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex justify-between items-end ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase">
            {t('collectionHub')}
          </h1>
          <p className="text-slate-500 mt-3 font-medium tracking-widest text-[10px] uppercase">{t('architectNavStructure')}</p>
        </div>
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-500/10 text-green-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-500/20 backdrop-blur-md"
            >
              {t('syncSuccessful')}
            </motion.div>
          )}
          {hasChanges && (
            <button 
              onClick={handleSaveLayout}
              disabled={isUpdatingLayout}
              className="px-10 py-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.2)] flex items-center gap-3"
            >
              {isUpdatingLayout ? <Loader2 size={16} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              {t('commitChanges')}
            </button>
          )}
          {!isAdding && !isEditing && (
            <button 
              onClick={startAdd}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-green-400 hover:text-black transition-all flex items-center gap-3 shadow-2xl"
            >
              <Plus className="w-5 h-5" /> {t('newCollection')}
            </button>
          )}
        </div>
      </div>

      {/* Category Layout Selector - Premium Dark Glassmorphism */}
      <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/[0.05] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/5 blur-[120px] -z-10 group-hover:bg-green-500/10 transition-all"></div>
        
        <div className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <div className="w-1.5 h-10 bg-green-400 rounded-full"></div>
             <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{t('visualMatrix')}</h2>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{t('defineStorefrontAesthetic')}</p>
             </div>
          </div>
          {isUpdatingLayout && <Loader2 className="w-5 h-5 animate-spin text-green-400" />}
        </div>

        {/* Tab Selector - Minimalist & Sleek */}
        <div className={`flex gap-3 mb-10 bg-black/20 p-2 rounded-2xl w-fit border border-white/[0.03] ${isRTL ? 'ml-auto flex-row-reverse' : ''}`}>
           <button 
             onClick={() => setActiveTab('home')}
             className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
           >
             {t('landingPage')}
           </button>
           <button 
             onClick={() => setActiveTab('collections')}
             className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'collections' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
           >
             {t('allCollections')}
           </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {layouts.map((l: any) => {
            const isCurrent = activeTab === 'home' ? homeLayout === l.id : collectionsLayout === l.id;
            return (
              <button
                key={l.id}
                onClick={() => handleLayoutSelect(l.id)}
                className={`flex flex-col items-center gap-6 p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden group/layout ${isCurrent ? 'border-green-400/50 bg-green-400/5 shadow-[0_0_40px_rgba(74,222,128,0.1)]' : 'border-white/[0.03] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.02]'}`}
              >
                {isCurrent && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)]"></div>}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCurrent ? 'bg-green-400 text-black scale-110 rotate-3' : 'bg-white/[0.03] text-slate-500 group-hover/layout:text-white group-hover/layout:scale-110'}`}>
                  <l.icon size={32} strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <div className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isCurrent ? 'text-green-400' : 'text-slate-300'}`}>{l.name}</div>
                  <div className="text-[9px] font-medium text-slate-600 tracking-wide line-clamp-1">{l.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {(isAdding || isEditing) && (
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.05] shadow-2xl p-10 relative overflow-hidden">
          <div className={`flex justify-between items-center mb-10 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <div className="w-1.5 h-10 bg-green-400 rounded-full"></div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                 {isEditing ? t('modifySector') : t('registerNewSector')}
               </h2>
            </div>
            <button 
               onClick={() => { setIsEditing(null); setIsAdding(false); }} 
               className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div>
                <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('sectorDesignation')}</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`} 
                  placeholder={isRTL ? 'مثال: مستلزمات الصيف' : 'e.g. Summer Essentials'}
                />
              </div>
              <div>
                <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('narrativeDescription')}</label>
                <textarea 
                  required 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className={`w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all h-32 font-medium ${isRTL ? 'text-right' : 'text-left'}`} 
                  placeholder={isRTL ? 'اشرح تفاصيل هذه المجموعة...' : 'Elaborate on this collection\'s theme...'}
                />
              </div>
              <div>
                <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('structuralHierarchy')}</label>
                <select 
                  value={formData.parentId || ''} 
                  onChange={e => setFormData({...formData, parentId: e.target.value})} 
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-black uppercase tracking-widest text-xs cursor-pointer"
                >
                  <option value="" className="bg-[#1a1d2d]">ROOT COLLECTION</option>
                  {categories
                    .filter(c => !isEditing || c.id !== isEditing.id)
                    .map(c => (
                    <option key={c.id} value={c.id} className="bg-[#1a1d2d]">{c.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div>
                <label className={`block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>{t('visualSignature')}</label>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-[2rem] p-4">
                  <MediaPicker 
                    slug={slug}
                    value={formData.image || ''} 
                    onChange={url => setFormData({...formData, image: url})} 
                    className="w-full aspect-[16/9] rounded-2xl"
                  />
                </div>
              </div>

              <div className="pt-10 border-t border-white/[0.05] flex gap-4">
                <button 
                  type="submit" 
                  disabled={isPending} 
                  className="flex-1 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black uppercase tracking-[0.3em] text-xs rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />}
                  {isEditing ? (isRTL ? 'تحديث السجل' : 'Update Registry') : (isRTL ? 'تفعيل القطاع' : 'Initialize Sector')}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(null); setIsAdding(false); }} 
                  className="px-10 py-5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] rounded-[2rem] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modern High-End Table for Categories */}
      <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.05] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`bg-white/[0.01] border-b border-white/[0.05] ${isRTL ? 'text-right' : 'text-left'}`}>
              <tr>
                <th className={`px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ${isRTL ? 'text-right' : 'text-left'}`}>{t('collectionIdentity')}</th>
                <th className={`px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ${isRTL ? 'text-right' : 'text-left'}`}>{t('registryCode')}</th>
                <th className={`px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ${isRTL ? 'text-left' : 'text-right'}`}>{t('operations')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {categories.map((category: Category) => (
                <tr key={category.id} className="group hover:bg-white/[0.02] transition-all duration-500">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] overflow-hidden relative flex-shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Image src={category.image} alt={category.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className={`flex items-center gap-4 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className="font-black text-white uppercase tracking-tighter text-xl">{category.name}</div>
                          {category.parentId && (
                            <div className={`flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                               <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                               <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">
                                  {isRTL ? 'عقدة من' : 'Node of'} {categories.find(c => c.id === category.parentId)?.name.toUpperCase() || (isRTL ? 'الجذر' : 'ROOT')}
                               </span>
                            </div>
                          )}
                        </div>
                        <div className={`text-slate-500 text-[10px] font-medium tracking-wide italic max-w-[400px] line-clamp-1 opacity-60 group-hover:opacity-100 transition-opacity ${isRTL ? 'text-right' : 'text-left'}`}>{category.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="font-mono text-[9px] font-black text-slate-600 bg-black/20 px-3 py-1.5 rounded-lg border border-white/[0.02]">
                      {category.id.toUpperCase()}
                    </span>
                  </td>
                  <td className={`px-10 py-8 ${isRTL ? 'text-left' : 'text-right'}`}>
                    <div className={`flex gap-3 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                      <button 
                        onClick={() => startEdit(category)} 
                        className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center justify-center text-slate-500 hover:text-green-400 hover:bg-green-400/10 hover:border-green-400/30 transition-all shadow-xl"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)} 
                        className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all shadow-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="p-40 text-center">
               <div className="w-24 h-24 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                 <LayoutGrid className="w-12 h-12 text-slate-800" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-3">{isRTL ? 'لا توجد بيانات' : 'No Matrix Data'}</h3>
               <p className="text-slate-600 text-sm font-medium">{isRTL ? 'ابدأ القطاع الأول لبدء النشر.' : 'Initialize your first sector to begin deployment.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
