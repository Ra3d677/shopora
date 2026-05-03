"use client";

import { useState, useTransition } from "react";
import { Product, Category } from "@/lib/types";
import { deleteProduct, addProduct, updateProduct } from "../actions";
import { Edit, Trash2, Plus, X, Loader2 } from "lucide-react";
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
    setFormData({ ...formData, sizes: (formData.sizes || []).filter((_, i) => i !== index) });
  };

  const handleAddColor = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!colorInput.trim()) return;
    if ((formData.colors || []).includes(colorInput.trim())) { setColorInput(""); return; }
    setFormData({ ...formData, colors: [...(formData.colors || []), colorInput.trim()] });
    setColorInput("");
  };

  const handleRemoveColor = (index: number) => {
    setFormData({ ...formData, colors: (formData.colors || []).filter((_, i) => i !== index) });
  };

  const defaultCategoryId = categories.length > 0 ? categories[0].id : "";

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    discount_price: null,
    category_id: defaultCategoryId,
    sizes: ["M", "L"],
    colors: ["#000000"],
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
      colors: ["#000000"],
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
      stock_quantity: 10,
      status: "active"
    });
    setIsAdding(true);
    setIsEditing(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Products Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or remove your store products.</p>
        </div>
        {!isAdding && !isEditing && (
          <button 
            onClick={startAdd}
            className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        )}
      </div>

      {(isAdding || isEditing) && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input required type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Price ($)</label>
                  <input type="number" value={formData.discount_price || ''} onChange={e => setFormData({...formData, discount_price: e.target.value ? Number(e.target.value) : null})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Optional" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sizes Available</label>
                  <p className="text-xs text-slate-500 mb-4">Add product sizes (e.g., Small, 44, 10.5)</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.sizes?.map((size: string, index: number) => (
                      <div key={index} className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="text-sm font-bold">{size}</span>
                        <button type="button" onClick={() => handleRemoveSize(index)} className="ml-1 text-slate-400 hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(!formData.sizes || formData.sizes.length === 0) && <span className="text-sm text-slate-400 italic">No sizes added yet</span>}
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={sizeInput} 
                      onChange={e => setSizeInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleAddSize(e)}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                      placeholder="Type a size and press Enter" 
                    />
                    <button type="button" onClick={handleAddSize} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">Add</button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Colors Available</label>
                  <p className="text-xs text-slate-500 mb-4">Add colors by name (e.g. black, blue) or HEX code (#FF0000)</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.colors?.map((color: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 bg-white border border-slate-200 pl-2 pr-3 py-1.5 rounded-full shadow-sm">
                        <span className="w-4 h-4 rounded-full border border-slate-200 shadow-inner" style={{backgroundColor: color}}></span>
                        <span className="text-xs font-bold capitalize">{color}</span>
                        <button type="button" onClick={() => handleRemoveColor(index)} className="ml-1 text-slate-400 hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(!formData.colors || formData.colors.length === 0) && <span className="text-sm text-slate-400 italic">No colors added yet</span>}
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary bg-white">
                      <input 
                        type="color" 
                        value={colorInput.startsWith('#') ? colorInput : '#000000'} 
                        onChange={e => setColorInput(e.target.value)} 
                        className="w-12 h-full p-0 border-0 outline-none cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={colorInput} 
                        onChange={e => setColorInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleAddColor(e)}
                        className="flex-1 px-4 py-2 border-0 outline-none" 
                        placeholder="Type or pick a color..." 
                      />
                    </div>
                    <button type="button" onClick={handleAddColor} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">Add</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={formData.category_id || defaultCategoryId} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  {categories.length === 0 && <option value="" disabled>No categories available</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <MediaPicker 
                  slug={slug}
                  value={formData.images?.[0] || ''} 
                  onChange={url => setFormData({...formData, images: [url]})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input required type="number" value={formData.stock_quantity || 0} onChange={e => setFormData({...formData, stock_quantity: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={formData.status || 'active'} onChange={e => setFormData({...formData, status: e.target.value as 'active' | 'draft'})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t flex justify-end gap-3">
              <button type="button" onClick={() => { setIsEditing(null); setIsAdding(false); }} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Product'}
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
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Variants</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{product.name}</div>
                        <div className="text-slate-500 text-xs truncate max-w-[150px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-600">{product.category_id}</td>
                  <td className="px-6 py-4">
                    {product.discount_price ? (
                      <div>
                        <span className="font-bold text-slate-900">${product.discount_price}</span>
                        <span className="text-slate-400 line-through text-xs ml-2">${product.price}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-900">${product.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1">
                        {product.sizes?.length > 0 ? product.sizes.slice(0, 3).map((s: string, i: number) => <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">{s}</span>) : <span className="text-xs text-slate-400">-</span>}
                        {product.sizes?.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{product.sizes.length - 3}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        {product.colors?.length > 0 ? product.colors.slice(0, 3).map((c: string, i: number) => <span key={i} className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: c }} title={c} />) : null}
                        {product.colors?.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{product.colors.length - 3}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock_quantity} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No products found. Start by adding one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
