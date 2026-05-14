"use client";

import { useState, useTransition } from "react";
import { Product, Category } from "@/lib/types";
import { deleteProduct, addProduct, updateProduct } from "../actions";
import { Edit, Trash2, Plus, X, Loader2, Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MediaPicker from "../media/MediaPicker";

export default function ProductsManager({ initialProducts, slug, categories }: { initialProducts: Product[], slug: string, categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const handleAddSize = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!sizeInput.trim()) return;
    if ((formData.sizes || []).includes(sizeInput.trim())) { setSizeInput(""); return; }
    setFormData({ ...formData, sizes: [...(formData.sizes || []), sizeInput.trim()] });
    setSizeInput("");
  };

  const handleRemoveSize = (index: number) => {
    setFormData({ ...formData, sizes: (formData.sizes || []).filter((_: any, i: number) => i !== index) });
  };

  const handleAddColor = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!colorInput.trim()) return;
    
    const colors = Array.isArray(formData.colors) ? formData.colors : [];
    // If it's old format (strings), convert it
    const normalizedColors = colors.map((c: any) => typeof c === 'string' ? { name: c, value: c, imageUrl: null } : c);
    
    if (normalizedColors.some((c: any) => c.value === colorInput.trim())) { setColorInput(""); return; }
    
    setFormData({ 
      ...formData, 
      colors: [...normalizedColors, { name: colorInput.trim(), value: colorInput.trim(), imageUrl: null, stock: 10 }] 
    });
    setColorInput("");
  };

  const handleRemoveColor = (index: number) => {
    const colors = Array.isArray(formData.colors) ? formData.colors : [];
    setFormData({ ...formData, colors: colors.filter((_: any, i: number) => i !== index) });
  };

  const handleUpdateColorField = (index: number, field: string, value: any) => {
    const colors = [...(formData.colors || [])];
    colors[index] = { ...colors[index], [field]: value };
    setFormData({ ...formData, colors });
  };

  const defaultCategoryId = categories.length > 0 ? categories[0].id : "";

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    discount_price: null,
    category_id: defaultCategoryId,
    sizes: ["M", "L"],
    colors: [{ name: "Black", value: "#000000", imageUrl: null }],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
    stock_quantity: 10,
    status: "active"
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
      startTransition(async () => {
        await deleteProduct(slug, id);
        router.refresh();
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_id) {
        alert("Please create a category first before adding products.");
        return;
    }

    if (isEditing) {
      setProducts(products.map(p => p.id === isEditing.id ? { ...p, ...formData } as Product : p));
      startTransition(async () => {
        await updateProduct(slug, isEditing.id, formData);
        router.refresh();
      });
    } else {
      startTransition(async () => {
        try {
          await addProduct(slug, formData as Omit<Product, "id">);
          router.refresh();
          window.location.reload(); 
        } catch(err) {
            console.error(err);
            alert("Error adding product");
        }
      });
    }
    setIsEditing(null);
    setIsAdding(false);
  };

  const startEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(product);
    setIsAdding(false);
  };

  const startAdd = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      discount_price: null,
      category_id: defaultCategoryId,
      sizes: ["M", "L"],
      colors: [{ name: "Black", value: "#000000", imageUrl: null }],
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
      stock_quantity: 10,
      status: "active"
    });
    setIsAdding(true);
    setIsEditing(null);
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase">
            Inventory <span className="text-cyan-400">Vault</span>
          </h1>
          <p className="text-slate-500 mt-3 font-medium tracking-widest text-[10px] uppercase">Control your product ecosystem with precision.</p>
        </div>
        {!isAdding && !isEditing && (
          <button 
            onClick={startAdd}
            className="group relative px-8 py-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(6,182,212,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Add New Asset
          </button>
        )}
      </div>

      {(isAdding || isEditing) && (
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.05] shadow-2xl p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] -z-10 group-hover:bg-cyan-500/20 transition-all"></div>
          
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-10 bg-cyan-400 rounded-full"></div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                 {isEditing ? 'Modify Identity' : 'Initiate New Asset'}
               </h2>
            </div>
            <button 
               onClick={() => { setIsEditing(null); setIsAdding(false); }} 
               className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Asset Designation</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Hyper-Light Sneakers"
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Asset Narrative</label>
                  <textarea 
                    required 
                    placeholder="Describe the essence of this product..."
                    value={formData.description || ''} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all h-32 font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/[0.03]">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Base Valuation ($)</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.price || 0} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                    className="w-full bg-transparent text-3xl font-black text-cyan-400 outline-none" 
                  />
                </div>
                <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/[0.03]">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Flash Discount ($)</label>
                  <input 
                    type="number" 
                    value={formData.discount_price || ''} 
                    onChange={e => setFormData({...formData, discount_price: e.target.value ? Number(e.target.value) : null})} 
                    className="w-full bg-transparent text-3xl font-black text-rose-500 outline-none" 
                    placeholder="None" 
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 bg-white/[0.02] border border-white/[0.03] rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimension Scale</label>
                    <div className="h-[1px] flex-1 bg-white/[0.05] mx-4"></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {formData.sizes?.map((size: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl group/size">
                        <span className="text-xs font-black text-cyan-400 uppercase">{size}</span>
                        <button type="button" onClick={() => handleRemoveSize(index)} className="text-cyan-500/40 hover:text-rose-500 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {(!formData.sizes || formData.sizes.length === 0) && <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Universal Scale</span>}
                  </div>
                  
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={sizeInput} 
                      onChange={e => setSizeInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleAddSize(e)}
                      className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-sm" 
                      placeholder="Add size (e.g. XL, 42)..." 
                    />
                    <button type="button" onClick={handleAddSize} className="px-6 py-3 bg-white text-black rounded-xl hover:bg-cyan-400 transition-all text-xs font-black uppercase tracking-widest">Add</button>
                  </div>
                </div>

                <div className="p-8 bg-white/[0.02] border border-white/[0.03] rounded-3xl">
                   <div className="flex items-center justify-between mb-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Color Spectrum</label>
                    <div className="h-[1px] flex-1 bg-white/[0.05] mx-4"></div>
                  </div>
                  
                   <div className="space-y-4 mb-8">
                    {formData.colors?.map((colorObj: any, index: number) => {
                      const color = typeof colorObj === 'string' ? { name: colorObj, value: colorObj, imageUrl: null } : colorObj;
                      return (
                        <div key={index} className="bg-[#1a1d2d]/60 border border-white/[0.05] rounded-3xl p-5 hover:border-cyan-500/30 transition-all duration-300 relative group/row">
                          <div className="flex items-center gap-6">
                            {/* Identity Section */}
                            <div className="flex items-center gap-4 shrink-0">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full border-2 border-white/10 shadow-2xl" style={{backgroundColor: color.value}}></div>
                                <span className="text-[9px] font-black text-white uppercase tracking-tighter truncate w-16 text-center">{color.name}</span>
                              </div>
                              
                              <div className="relative w-20 h-20 rounded-2xl bg-black/40 border border-white/5 overflow-hidden group/media shadow-xl">
                                 {color.imageUrl ? (
                                   <>
                                     <Image src={color.imageUrl} alt="Variant" fill className="object-cover" />
                                     <button 
                                       type="button" 
                                       onClick={() => handleUpdateColorField(index, 'imageUrl', null)}
                                       className="absolute inset-0 bg-black/60 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center text-white"
                                     >
                                       <X className="w-5 h-5" />
                                     </button>
                                   </>
                                 ) : (
                                   <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-[8px] font-black text-slate-700 uppercase">
                                      <Plus className="w-5 h-5" />
                                      <span>Link</span>
                                   </div>
                                 )}
                              </div>
                            </div>

                            {/* Controls Section - Stacked Vertically to prevent overflow */}
                            <div className="flex-1 space-y-4">
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                     <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Link</label>
                                     <select 
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-cyan-400 focus:ring-1 focus:ring-cyan-500/50 cursor-pointer outline-none transition-all"
                                        value={color.imageUrl || ''}
                                        onChange={(e) => handleUpdateColorField(index, 'imageUrl', e.target.value || null)}
                                     >
                                        <option value="" className="bg-[#1a1d2d]">No Selection</option>
                                        {formData.images?.map((img: string, i: number) => (
                                          <option key={i} value={img} className="bg-[#1a1d2d]">Visual Node {i + 1}</option>
                                        ))}
                                     </select>
                                  </div>

                                  <div className="space-y-2">
                                     <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Inventory (Stock)</label>
                                     <div className="flex items-center bg-white/5 border border-white/5 rounded-xl overflow-hidden focus-within:border-cyan-500/30 transition-all">
                                        <button 
                                          type="button" 
                                          onClick={() => handleUpdateColorField(index, 'stock', Math.max(0, (color.stock || 0) - 1))}
                                          className="w-12 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
                                        >-</button>
                                        <input 
                                          type="number"
                                          value={color.stock || 0}
                                          onChange={(e) => handleUpdateColorField(index, 'stock', Number(e.target.value))}
                                          className="w-full bg-transparent border-none text-center text-sm font-black text-white focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button 
                                          type="button" 
                                          onClick={() => handleUpdateColorField(index, 'stock', (color.stock || 0) + 1)}
                                          className="w-12 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
                                        >+</button>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            {/* Delete Action */}
                            <div className="shrink-0">
                              <button type="button" onClick={() => handleRemoveColor(index)} className="w-12 h-12 rounded-2xl bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all flex items-center justify-center border border-transparent hover:border-rose-500/20 group-hover/row:scale-110">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center bg-white/[0.03] border border-white/[0.05] rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-cyan-500/50">
                      <input 
                        type="color" 
                        value={colorInput.startsWith('#') ? colorInput : '#000000'} 
                        onChange={e => setColorInput(e.target.value)} 
                        className="w-12 h-12 p-0 border-0 outline-none cursor-pointer bg-transparent" 
                      />
                      <input 
                        type="text" 
                        value={colorInput} 
                        onChange={e => setColorInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleAddColor(e)}
                        className="flex-1 bg-transparent px-4 py-3 text-white text-sm focus:outline-none" 
                        placeholder="Add Hex or Name..." 
                      />
                    </div>
                    <button type="button" onClick={handleAddColor} className="px-6 py-3 bg-white text-black rounded-xl hover:bg-cyan-400 transition-all text-xs font-black uppercase tracking-widest">Inject</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 bg-white/[0.02] border border-white/[0.03] rounded-3xl">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Market Sector</label>
                <select 
                  value={formData.category_id || defaultCategoryId} 
                  onChange={e => setFormData({...formData, category_id: e.target.value})} 
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-black uppercase tracking-widest text-xs cursor-pointer"
                >
                  {categories.map(cat => {
                    const getCategoryLabel = (c: Category, all: Category[]): string => {
                      if (!c.parentId) return c.name;
                      const parent = all.find(p => p.id === c.parentId);
                      if (!parent) return c.name;
                      return `${getCategoryLabel(parent, all)} > ${c.name}`;
                    };
                    return (
                      <option key={cat.id} value={cat.id} className="bg-[#1a1d2d]">{getCategoryLabel(cat, categories).toUpperCase()}</option>
                    );
                  })}
                  {categories.length === 0 && <option value="" disabled className="bg-[#1a1d2d]">NO SECTORS DEFINED</option>}
                </select>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/[0.03] rounded-3xl">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Visual Matrix</label>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {(formData.images || []).map((img: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group/img shadow-2xl">
                       <Image src={img} alt="Product" fill className="object-cover transition-transform duration-500 group-hover/img:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-end p-4">
                          <button 
                            type="button" 
                            onClick={() => {
                              const newImgs = [...(formData.images || [])];
                              newImgs.splice(i, 1);
                              setFormData({...formData, images: newImgs});
                            }}
                            className="bg-rose-500/20 backdrop-blur-md border border-rose-500/50 text-rose-500 p-2.5 rounded-xl hover:bg-rose-500 hover:text-white transition-all mb-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Visual node {i + 1}</span>
                       </div>
                    </div>
                  ))}
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.03] hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden group/addimg">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover/addimg:text-cyan-400 group-hover/addimg:scale-110 transition-all">
                       <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover/addimg:text-cyan-400 transition-colors">Capture Asset</span>
                    <MediaPicker 
                       slug={slug} 
                       value="" 
                       onChange={(url) => setFormData({...formData, images: [...(formData.images || []), url]})} 
                       className="absolute inset-0 opacity-0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/[0.03] rounded-2xl">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Stock Units</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.stock_quantity || 0} 
                    onChange={e => setFormData({...formData, stock_quantity: Number(e.target.value)})} 
                    className="w-full bg-transparent text-2xl font-black text-white outline-none" 
                  />
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/[0.03] rounded-2xl">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Deployment Status</label>
                  <select 
                    value={formData.status || 'active'} 
                    onChange={e => setFormData({...formData, status: e.target.value as 'active' | 'draft'})} 
                    className="w-full bg-transparent text-xs font-black text-white outline-none uppercase tracking-widest cursor-pointer"
                  >
                    <option value="active" className="bg-[#1a1d2d]">Active</option>
                    <option value="draft" className="bg-[#1a1d2d]">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-8 border-t border-white/[0.05] flex flex-col gap-4">
                <button 
                  type="submit" 
                  disabled={isPending} 
                  className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2rem] text-white font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(6,182,212,0.3)] disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
                  {isEditing ? 'Sync Matrix' : 'Deploy Asset'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(null); setIsAdding(false); }} 
                  className="w-full py-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-[2rem] text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] transition-all"
                >
                  Abort Mission
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modern High-End Table */}
      <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.05] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.01] border-b border-white/[0.05]">
              <tr>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Asset Identity</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sector</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Valuation</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Variants</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Inventory</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Status</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {products.map(product => (
                <tr key={product.id} className="group hover:bg-white/[0.02] transition-all duration-500">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] overflow-hidden relative flex-shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-black text-white uppercase tracking-tighter text-lg mb-1">{product.name}</div>
                        <div className="text-slate-500 text-[10px] font-medium tracking-wide truncate max-w-[200px] italic">#{product.id.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/[0.03] px-4 py-2 rounded-full border border-white/[0.05]">
                      {categories.find(c => c.id === product.category_id)?.name || 'Unknown Sector'}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    {product.discount_price ? (
                      <div className="flex flex-col">
                        <span className="font-black text-rose-500 text-xl">${product.discount_price}</span>
                        <span className="text-slate-600 line-through text-[10px] font-black tracking-widest mt-1">${product.price}</span>
                      </div>
                    ) : (
                      <span className="font-black text-cyan-400 text-xl">${product.price}</span>
                    )}
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-1.5">
                        {product.sizes?.length > 0 ? product.sizes.slice(0, 3).map((s: string, i: number) => (
                          <span key={i} className="text-[8px] font-black bg-white/[0.05] text-slate-400 border border-white/[0.05] px-2 py-1 rounded-md uppercase tracking-tighter">
                            {s}
                          </span>
                        )) : <span className="text-[10px] text-slate-700">-</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {product.colors?.length > 0 ? product.colors.slice(0, 3).map((c: any, i: number) => {
                          const color = typeof c === 'string' ? { value: c } : c;
                          return <span key={i} className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: color.value }} />;
                        }) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock_quantity > 0 ? 'text-green-500' : 'text-rose-500'}`}>
                         {product.stock_quantity} Units
                       </span>
                       <div className="w-20 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                          <div className={`h-full ${product.stock_quantity > 5 ? 'bg-green-500' : 'bg-rose-500'} transition-all`} style={{ width: `${Math.min(product.stock_quantity * 5, 100)}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full animate-pulse ${product.status === 'active' ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`}></div>
                       <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${product.status === 'active' ? 'text-white' : 'text-slate-600'}`}>
                         {product.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => startEdit(product)} 
                        className="w-10 h-10 bg-white/[0.03] border border-white/[0.05] rounded-xl flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all shadow-xl"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="w-10 h-10 bg-white/[0.03] border border-white/[0.05] rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all shadow-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-32 text-center">
               <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-6">
                 <Package className="w-10 h-10 text-slate-700" />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-2">Vault Empty</h3>
               <p className="text-slate-600 text-sm font-medium">No assets have been deployed to your inventory yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
