"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, ShoppingBag } from "lucide-react";

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
}

export default function SmartSearch({ isOpen, onClose, products }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, products]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-2xl flex flex-col items-center pt-32 px-8"
        >
          <button 
            onClick={onClose}
            className="absolute top-12 right-12 p-4 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-4xl">
            <div className="relative mb-16">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={48} />
              <input 
                autoFocus
                type="text"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                className="w-full bg-transparent border-b-2 border-slate-100 py-8 pl-20 text-4xl font-black uppercase tracking-tighter focus:border-slate-900 focus:outline-none transition-colors"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Popular Categories</h4>
                  <div className="flex flex-col gap-6 text-2xl font-bold uppercase tracking-tighter">
                     <button className="text-left hover:text-blue-600 transition-colors flex items-center group">
                       New Arrivals <ArrowRight className="ml-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                     </button>
                     <button className="text-left hover:text-blue-600 transition-colors flex items-center group">
                       Limited Editions <ArrowRight className="ml-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                     </button>
                     <button className="text-left hover:text-blue-600 transition-colors flex items-center group">
                       Best Sellers <ArrowRight className="ml-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                     </button>
                  </div>
               </div>

               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Live Suggestions</h4>
                  <div className="space-y-8">
                     {results.length > 0 ? (
                       results.map(product => (
                         <button key={product.id} className="flex items-center gap-6 group w-full text-left">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                               <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1">
                               <p className="font-bold uppercase tracking-tighter text-lg">{product.name}</p>
                               <p className="text-xs text-slate-400 font-bold">${product.price}</p>
                            </div>
                            <ShoppingBag className="opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                         </button>
                       ))
                     ) : (
                       <p className="text-slate-300 italic">Start typing to see magic...</p>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
