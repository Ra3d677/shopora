"use client";

import { useState, useTransition } from "react";
import { Category } from "@/lib/types";
import { deleteCategory, addCategory, updateCategory, updateStoreSettings } from "../actions";
import { Edit, Trash2, Plus, X, Loader2, LayoutGrid, Layout, List, Circle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MediaPicker from "../media/MediaPicker";

export default function CategoriesManager({ initialCategories, slug, settings }: { initialCategories: Category[], slug: string, settings: any }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

    name: "",
    description: "",
    image: "",
    parentId: ""
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your store collections and choose how they look on your storefront.</p>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-500/10 text-green-600 px-4 py-2 rounded-xl text-xs font-bold border border-green-500/20"
            >
              Changes Saved!
            </motion.div>
          )}
          {hasChanges && (
            <button 
              onClick={handleSaveLayout}
              disabled={isUpdatingLayout}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2"
            >
              {isUpdatingLayout ? <Loader2 size={14} className="animate-spin" /> : 'Save All Changes'}
            </button>
          )}
          {!isAdding && !isEditing && (
            <button 
              onClick={startAdd}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" /> Add New Category
            </button>
          )}
        </div>
      </div>

      {/* Category Layout Selector */}
      <div className="mb-12 bg-slate-50 rounded-3xl p-8 border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Display Settings</h2>
            <p className="text-slate-500 text-xs mt-1">Configure how your collections appear in different pages.</p>
          </div>
          {isUpdatingLayout && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
        </div>

        {/* Tab Selector */}
        <div className="flex gap-4 mb-8">
           <button 
             onClick={() => setActiveTab('home')}
             className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
           >
             Home Page
           </button>
           <button 
             onClick={() => setActiveTab('collections')}
             className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'collections' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
           >
             Collections Page
           </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {layouts.map((l: any) => {
            const isCurrent = activeTab === 'home' ? homeLayout === l.id : collectionsLayout === l.id;
            return (
              <button
                key={l.id}
                onClick={() => handleLayoutSelect(l.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${isCurrent ? 'border-blue-600 bg-white ring-8 ring-blue-600/5' : 'border-white bg-white/50 hover:border-slate-200 opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCurrent ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-200 text-slate-500'}`}>
                  <l.icon size={24} />
                </div>
                <div className="text-center">
                  <div className={`text-[10px] font-black uppercase ${isCurrent ? 'text-blue-600' : 'text-slate-900'}`}>{l.name}</div>
                  <div className="text-[9px] text-slate-400 mt-1">{l.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {(isAdding || isEditing) && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
            <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parent Category (Optional)</label>
                <select 
                  value={formData.parentId || ''} 
                  onChange={e => setFormData({...formData, parentId: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter(c => !isEditing || c.id !== isEditing.id)
                    .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Image</label>
                <MediaPicker 
                  slug={slug}
                  value={formData.image || ''} 
                  onChange={url => setFormData({...formData, image: url})} 
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t flex justify-end gap-3">
              <button type="button" onClick={() => { setIsEditing(null); setIsAdding(false); }} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-border text-slate-600">
              <tr>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Identifier (ID)</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category: Category) => (
                <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden relative flex-shrink-0">
                        <Image src={category.image} alt={category.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-slate-900">{category.name}</div>
                          {category.parentId && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">
                              Sub of {categories.find(c => c.id === category.parentId)?.name || 'Unknown'}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-xs truncate max-w-[250px]">{category.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{category.id}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(category)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No categories found. Start by adding one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
