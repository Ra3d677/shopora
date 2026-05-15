"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X, Check } from "lucide-react";

interface FilterSidebarProps {
  categories: any[];
  availableColors: { name: string, value: string }[];
  maxPossiblePrice: number;
}

export default function StorefrontFilterSidebar({ categories, availableColors, maxPossiblePrice }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  
  const currentMin = searchParams.get('min');
  const currentMax = searchParams.get('max');
  const currentCategory = searchParams.get('category');
  const currentColors = searchParams.get('colors')?.split(',').filter(Boolean) || [];

  const [priceRange, setPriceRange] = useState([
    currentMin ? parseInt(currentMin) : 0, 
    currentMax ? parseInt(currentMax) : maxPossiblePrice
  ]);
  
  const [selectedColors, setSelectedColors] = useState<string[]>(currentColors);

  // Sync state if URL changes externally
  useEffect(() => {
    setPriceRange([
      currentMin ? parseInt(currentMin) : 0, 
      currentMax ? parseInt(currentMax) : maxPossiblePrice
    ]);
    setSelectedColors(currentColors);
  }, [currentMin, currentMax, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (priceRange[0] > 0) params.set('min', priceRange[0].toString());
    else params.delete('min');
    
    if (priceRange[1] < maxPossiblePrice) params.set('max', priceRange[1].toString());
    else params.delete('max');
    
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    else params.delete('colors');
    
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('min');
    params.delete('max');
    params.delete('colors');
    // keep category and sort
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
    setPriceRange([0, maxPossiblePrice]);
    setSelectedColors([]);
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Category List */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('category');
              router.push(`${pathname}?${params.toString()}`);
            }}
            className={`block w-full text-left text-sm transition-colors ${!currentCategory ? 'font-black text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
          >
            All Products
          </button>
          {categories.filter(c => !c.parentId).map(cat => (
            <div key={cat.id} className="space-y-1 mt-2">
              <button 
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('category', cat.id);
                  router.push(`${pathname}?${params.toString()}`);
                }}
                className={`block w-full text-left text-sm py-1 transition-colors ${currentCategory === cat.id ? 'font-black text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {cat.name}
              </button>
              {/* Subcategories */}
              {categories.filter(sub => sub.parentId === cat.id).map(sub => (
                 <button 
                   key={sub.id}
                   onClick={() => {
                     const params = new URLSearchParams(searchParams.toString());
                     params.set('category', sub.id);
                     router.push(`${pathname}?${params.toString()}`);
                   }}
                   className={`block w-full text-left text-xs py-1 pl-4 transition-colors ${currentCategory === sub.id ? 'font-black text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
                 >
                   - {sub.name}
                 </button>
              ))}
            </div>
          ))}
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('category', 'sale');
              router.push(`${pathname}?${params.toString()}`);
            }}
            className={`block w-full text-left text-sm py-1 mt-2 font-bold transition-colors ${currentCategory === 'sale' ? 'text-red-500' : 'text-red-400 hover:text-red-500'}`}
          >
            SALE
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-border/50 pt-6">
        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Price Range</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">$</span>
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 pl-7 pr-3 text-sm font-bold"
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">$</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPossiblePrice])}
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 pl-7 pr-3 text-sm font-bold"
            />
          </div>
        </div>
        <input 
          type="range" 
          min="0" 
          max={maxPossiblePrice} 
          step="10"
          value={priceRange[1]} 
          onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Colors */}
      {availableColors.length > 0 && (
        <div className="border-t border-border/50 pt-6">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4">Colors</h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map(color => {
              const isSelected = selectedColors.includes(color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`relative w-10 h-10 rounded-full shadow-sm border-2 transition-all hover:scale-110 ${isSelected ? 'border-foreground scale-110' : 'border-border/50'}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center mix-blend-difference text-white">
                      <Check size={16} strokeWidth={4} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 flex flex-col gap-3">
        <button 
          onClick={applyFilters}
          className="w-full bg-foreground text-background py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-xl"
        >
          Apply Filters
        </button>
        {(currentMin || currentMax || currentColors.length > 0) && (
          <button 
            onClick={clearFilters}
            className="w-full bg-transparent text-muted-foreground py-2 rounded-xl font-bold text-xs hover:text-foreground transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center gap-3 w-full mb-8 bg-foreground text-background py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
      >
        <SlidersHorizontal size={20} />
        Filter & Sort
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-32 w-72 bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
         <FilterContent />
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          <div className="relative w-4/5 max-w-sm h-full bg-background p-6 overflow-y-auto flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
               <h2 className="text-xl font-black uppercase tracking-widest">Filters</h2>
               <button onClick={() => setIsOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 transition-colors">
                 <X size={20} />
               </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
