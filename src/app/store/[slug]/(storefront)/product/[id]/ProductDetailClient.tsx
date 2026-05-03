"use client";

import { useState } from "react";
import SmartImage from "@/components/ui/SmartImage";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { Check, ShoppingBag, ArrowRight, Shield, RefreshCcw, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import Link from "next/link";

export default function ProductDetailClient({ product, store }: { product: Product, store: any }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [isAdding, setIsAdding] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);

  // Track ViewContent on mount
  useEffect(() => {
    trackViewContent(product, store);
  }, [product, store]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      storeId: product.storeId,
      product,
      quantity: 1,
      selectedSize,
      selectedColor
    });
    trackAddToCart(product, 1, store);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
      {/* Left: Images */}
      <div className="flex flex-col gap-6 sticky top-32">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-slate-50 shadow-2xl"
          >
            <SmartImage 
              src={selectedImage} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
        
        {product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "relative h-32 w-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300",
                  selectedImage === img ? "border-slate-900 shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <SmartImage src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Info */}
      <div className="flex flex-col pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">{product.name}</h1>
          
          <div className="flex items-center gap-6 mb-12">
            {product.discount_price ? (
              <>
                <span className="text-4xl font-bold text-red-600">${product.discount_price}</span>
                <span className="text-2xl text-slate-400 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-4xl font-bold">${product.price}</span>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Color Selection</h3>
          <div className="flex gap-4">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md",
                  selectedColor === color ? "ring-2 ring-slate-900 ring-offset-4 scale-110" : "hover:scale-110"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              >
                {selectedColor === color && (
                  <Check className={cn("h-6 w-6", color === '#ffffff' ? "text-slate-900" : "text-white")} />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Size</h3>
            <button className="text-xs font-bold underline hover:text-blue-600 transition-colors">Size Guide</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "h-14 border-2 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300",
                  selectedSize === size 
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                    : "border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          {isAdding ? (
            <Link 
              href={`/store/${store.slug}/cart`}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-600/20"
            >
              <Check className="h-5 w-5" /> Added! View Cart <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="w-full bg-slate-900 hover:bg-black text-white h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-slate-900/20"
            >
              <ShoppingBag className="h-5 w-5" /> Add to Cart
            </button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 pt-10 border-t border-slate-100">
          <h3 className="font-black uppercase tracking-widest text-sm mb-6">Product Details</h3>
          <p className="text-slate-500 leading-loose text-sm">
            {product.description}
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
              <Shield size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">Secure Checkout</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
              <Truck size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">Fast Delivery</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
              <RefreshCcw size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">Easy Returns</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
