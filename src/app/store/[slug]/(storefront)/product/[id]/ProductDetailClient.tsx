"use client";

import { useState } from "react";
import SmartImage from "@/components/ui/SmartImage";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { Check, ShoppingBag, ArrowRight, Shield, RefreshCcw, Truck, Minus, Plus, Compass, Calendar, Users, Phone, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recordCartAdd } from "@/app/actions";
import { createOrder } from "../../../admin/orders/actions";

export default function ProductDetailClient({ product, store }: { product: Product, store: any }) {
  const router = useRouter();
  const productColors = Array.isArray(product.colors) ? product.colors.map(c => typeof c === 'string' ? { name: c, value: c, imageUrl: null } : c) : [];

  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<any>(productColors[0] || null);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Website / Tourism Booking States
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingGuests, setBookingGuests] = useState(1);
  const [bookingNotes, setBookingNotes] = useState("");
  const [isBookingPending, setIsBookingPending] = useState(false);
  const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  const selectedColorStock = selectedColor?.stock ?? product.stock_quantity;
  const isOutOfStock = selectedColorStock <= 0;
  
  const addItem = useCartStore(state => state.addItem);

  // Track ViewContent on mount
  useEffect(() => {
    trackViewContent(product, store);
  }, [product, store]);

  // Switch image when color changes
  useEffect(() => {
    if (selectedColor?.imageUrl) {
      setSelectedImage(selectedColor.imageUrl);
    }
  }, [selectedColor]);

  // Reset quantity if it exceeds new color's stock
  useEffect(() => {
    if (quantity > selectedColorStock) {
      setQuantity(Math.max(1, selectedColorStock));
    }
  }, [selectedColor, selectedColorStock]);

  const handleAddToCart = () => {
    if (quantity > selectedColorStock) return;
    setIsAdding(true);
    addItem({
      id: `${product.storeId}-${product.id}-${selectedSize}-${selectedColor?.name || selectedColor?.value || 'default'}`,
      storeId: product.storeId,
      product,
      quantity,
      selectedSize,
      selectedColor: selectedColor?.name || selectedColor?.value || 'default',
      selectedImage
    });
    trackAddToCart(product, quantity, store);
    recordCartAdd(store.slug, product.id);
  };

  const handleBuyNow = () => {
    if (quantity > selectedColorStock) return;
    addItem({
      id: `${product.storeId}-${product.id}-${selectedSize}-${selectedColor?.name || selectedColor?.value || 'default'}`,
      storeId: product.storeId,
      product,
      quantity,
      selectedSize,
      selectedColor: selectedColor?.name || selectedColor?.value || 'default',
      selectedImage
    });
    trackAddToCart(product, quantity, store);
    recordCartAdd(store.slug, product.id);
    router.push(`/store/${store.slug}/checkout`);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) {
      setBookingError("Full Name and Phone Number are required.");
      return;
    }
    setIsBookingPending(true);
    setBookingError(null);

    const notesSummary = `Departure Date: ${bookingDate || 'Not specified'}\nGuests: ${bookingGuests}\nSpecial Requests: ${bookingNotes}`;

    try {
      const result = await createOrder({
        storeId: product.storeId,
        customerName: bookingName,
        customerPhone: bookingPhone,
        customerEmail: bookingEmail || "inquiry@shopora.com",
        shippingAddress: "Website Booking Request",
        notes: notesSummary,
        totalAmount: product.price * bookingGuests,
        items: [
          {
            id: `${product.storeId}-${product.id}-default-default`,
            storeId: product.storeId,
            product,
            quantity: bookingGuests,
            selectedSize: "Default",
            selectedColor: "Default",
            selectedImage: selectedImage
          }
        ]
      });

      if (result.success) {
        setIsBookingSubmitted(true);
      } else {
        setBookingError(result.error || "Failed to submit booking inquiry.");
      }
    } catch (err: any) {
      setBookingError(err.message || "Failed to submit booking inquiry.");
    } finally {
      setIsBookingPending(false);
    }
  };

  if (store.template === 'senno') {
    return (
      <SennoProductDetail 
        product={product} 
        store={store} 
        selectedImage={selectedImage} 
        setSelectedImage={setSelectedImage}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        productColors={productColors}
        isAdding={isAdding}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
      {/* Left: Images */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-32">
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
            {product.images.map((img: string, idx: number) => (
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
        {store.type === 'WEBSITE' ? (
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-4.5 py-1.5 rounded-full mb-6 text-cyan-400">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span className="text-[9px] font-black uppercase tracking-widest">Premium Travel Package</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-white leading-none">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-8 text-slate-400 text-xs font-medium">
                <span className="flex items-center gap-1"><Calendar size={14} className="text-cyan-500" /> Curated Package</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Users size={14} className="text-cyan-500" /> Private or Group Tours</span>
              </div>

              <div className="flex items-end gap-2 mb-10 py-4 border-y border-white/5">
                <span className="text-3xl font-black text-cyan-400">${product.price.toFixed(0)}</span>
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold pb-1">/ Per Traveler</span>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isBookingSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-10 rounded-[2rem] text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                    <Check size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Inquiry Received!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm mx-auto">
                    Your booking request has been successfully submitted. A dedicated travel coordinator will contact you via phone or WhatsApp within the next 2 hours.
                  </p>
                  <p className="text-xs font-bold text-emerald-400 border-t border-white/5 pt-4">
                    تم استلام طلب الحجز بنجاح! سيتصل بك منسق الرحلات الخاص بنا خلال ساعتين.
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleBookingSubmit}
                  className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
                >
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-cyan-400" /> Book This Tour Package
                  </h3>

                  {bookingError && (
                    <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-xs font-bold border border-red-500/20">
                      {bookingError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name (الاسم بالكامل)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Doe"
                        className="w-full px-5 py-3.5 bg-slate-950/60 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none transition-all text-xs font-medium text-white"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp / Phone (رقم الهاتف)</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="e.g. +201000000000"
                        className="w-full px-5 py-3.5 bg-slate-950/60 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none transition-all text-xs font-medium text-white"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Estimated Date of Departure (تاريخ المغادرة المقدر)</label>
                      <input 
                        type="date" 
                        className="w-full px-5 py-3.5 bg-slate-950/60 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none transition-all text-xs font-bold text-white uppercase"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address (البريد الإلكتروني)</label>
                      <input 
                        type="email" 
                        placeholder="e.g. name@example.com"
                        className="w-full px-5 py-3.5 bg-slate-950/60 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none transition-all text-xs font-medium text-white"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Number of Travelers (عدد المسافرين)</label>
                    <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-xl h-12 w-36 overflow-hidden group focus-within:border-cyan-500 transition-all">
                      <button 
                        type="button"
                        onClick={() => setBookingGuests(prev => Math.max(1, prev - 1))}
                        disabled={bookingGuests <= 1 || isBookingPending}
                        className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-900 transition-all disabled:opacity-20"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="flex-1 flex items-center justify-center font-bold text-white text-sm">
                        {bookingGuests}
                      </div>
                      <button 
                        type="button"
                        onClick={() => setBookingGuests(prev => prev + 1)}
                        disabled={isBookingPending}
                        className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-900 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Special Requests or Notes (ملاحظات خاصة)</label>
                    <textarea 
                      rows={3}
                      placeholder="Specify hotel preferences, dietary requests, or custom duration."
                      className="w-full px-5 py-3.5 bg-slate-950/60 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none transition-all text-xs font-medium text-white placeholder-slate-650 resize-none"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                    />
                  </div>

                  <button 
                    disabled={isBookingPending}
                    type="submit"
                    className="w-full py-4.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 disabled:opacity-50"
                  >
                    {isBookingPending ? (
                      "Submitting Inquiry..."
                    ) : (
                      <><Compass size={14} className="animate-spin-slow" /> Send Booking Inquiry</>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div>
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
              <div className="flex flex-wrap gap-4">
                {productColors.map((color: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md relative",
                      selectedColor?.value === color.value ? "ring-2 ring-slate-900 ring-offset-4 scale-110" : "hover:scale-110",
                      (color.stock <= 0) && "opacity-40 grayscale"
                    )}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select color ${color.name}`}
                  >
                    {selectedColor?.value === color.value && (
                      <Check className={cn("h-6 w-6", color.value === '#ffffff' ? "text-slate-900" : "text-white")} />
                    )}
                    {color.stock <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-red-500 rotate-45"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className={cn(
                  "mt-4 text-[10px] font-bold uppercase tracking-widest",
                  isOutOfStock ? "text-red-500" : selectedColorStock < 5 ? "text-amber-500" : "text-green-600"
                )}>
                  {isOutOfStock ? "Out of Stock" : selectedColorStock < 5 ? `Only ${selectedColorStock} left - Order soon!` : "In Stock"}
                </p>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Size</h3>
                <button className="text-xs font-bold underline hover:text-blue-600 transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.sizes.map((size: string) => (
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Quantity</h3>
                {selectedColor && (
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    selectedColorStock <= 0 ? "text-red-500" : selectedColorStock < 10 ? "text-amber-500" : "text-green-600"
                  )}>
                    {selectedColorStock <= 0 ? "Sold Out" : `${selectedColorStock} Units Available`}
                  </span>
                )}
              </div>
              <div className="flex items-center bg-slate-50 border-2 border-slate-100 rounded-2xl h-16 w-full sm:w-48 overflow-hidden group focus-within:border-slate-900 transition-all">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-16 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-20"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="flex-1 flex items-center justify-center font-black text-lg">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(prev => Math.min(selectedColorStock, prev + 1))}
                  disabled={quantity >= selectedColorStock || isOutOfStock}
                  className="w-16 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-20"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {quantity >= selectedColorStock && selectedColorStock > 0 && (
                <p className="mt-3 text-[10px] font-bold text-amber-600 uppercase tracking-widest animate-pulse">
                  Maximum available stock reached
                </p>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              {isAdding ? (
                <Link 
                  href={`/store/${store.slug}/cart`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-20 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-600/20"
                >
                  <Check className="h-5 w-5" /> Added! View Cart <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={cn(
                      "flex-1 h-20 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all",
                      isOutOfStock 
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                        : "bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    <ShoppingBag className="h-5 w-5" /> {isOutOfStock ? "Sold Out" : "Add to Cart"}
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={cn(
                      "flex-1 h-20 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl",
                      isOutOfStock
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-slate-900 hover:bg-black text-white hover:scale-[1.02] shadow-slate-900/20"
                    )}
                  >
                    {isOutOfStock ? "Unavailable" : "Buy Now"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

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

function SennoProductDetail({ 
  product, 
  store, 
  selectedImage, 
  setSelectedImage,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  productColors,
  isAdding,
  handleAddToCart,
  handleBuyNow
}: any) {
  const pink = "#f06292";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start pb-32">
       {/* Left: Images */}
       <div className="flex flex-col gap-6 lg:sticky lg:top-32">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden bg-[#fcf2f4] shadow-2xl"
            >
               <SmartImage src={selectedImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
               {product.discount_price && (
                 <div className="absolute top-8 left-8 bg-[#f06292] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-widest">Sale Offer</div>
               )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             {product.images.map((img: string, idx: number) => (
               <button 
                 key={idx}
                 onClick={() => setSelectedImage(img)}
                 className={cn(
                   "relative h-32 w-24 rounded-2xl overflow-hidden border-2 transition-all duration-500",
                   selectedImage === img ? "border-[#f06292] scale-105 shadow-xl shadow-[#f06292]/20" : "border-transparent opacity-40 hover:opacity-100"
                 )}
               >
                 <SmartImage src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
               </button>
             ))}
          </div>
       </div>

       {/* Right: Info */}
       <div className="flex flex-col pt-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                <Link href={`/store/${store.slug}`} className="hover:text-[#f06292]">Home</Link>
                <span>/</span>
                <Link href={`/store/${store.slug}/products`} className="hover:text-[#f06292]">Shop</Link>
                <span>/</span>
                <span className="text-slate-900">{product.name}</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">{product.name}</h1>
             
             <div className="flex items-center gap-6 mb-12">
                {product.discount_price ? (
                  <>
                    <span className="text-5xl font-black text-[#f06292]">${product.discount_price}</span>
                    <span className="text-2xl text-slate-300 line-through font-medium">${product.price}</span>
                  </>
                ) : (
                  <span className="text-5xl font-black text-slate-900">${product.price}</span>
                )}
             </div>
          </motion.div>

          <div className="space-y-12">
             {/* Colors */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-4">
                   Select Color <div className="flex-1 h-[1px] bg-slate-100" />
                </h3>
                 <div className="flex flex-wrap gap-4">
                     {productColors.map((color: any, idx: number) => {
                       const isColOutOfStock = (color.stock || 0) <= 0;
                       return (
                       <button
                         key={idx}
                         onClick={() => setSelectedColor(color)}
                         className={cn(
                           "h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-500 relative",
                           selectedColor?.value === color.value ? "ring-2 ring-[#f06292] ring-offset-4 scale-110 shadow-xl shadow-[#f06292]/20" : "hover:scale-110",
                           isColOutOfStock && "opacity-30 grayscale"
                         )}
                         style={{ backgroundColor: color.value }}
                       >
                         {selectedColor?.value === color.value && (
                           <Check className={cn("h-6 w-6", color.value === '#ffffff' ? "text-slate-900" : "text-white")} />
                         )}
                         {isColOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-[1px] bg-red-500 rotate-45"></div>
                            </div>
                         )}
                       </button>
                     )})}
                 </div>
                 {selectedColor && (
                    <p className={cn(
                      "mt-4 text-[10px] font-black uppercase tracking-[0.2em]",
                      (selectedColor.stock <= 0) ? "text-red-500" : (selectedColor.stock < 5) ? "text-amber-500" : "text-[#f06292]"
                    )}>
                      {(selectedColor.stock <= 0) ? "Out of Stock" : (selectedColor.stock < 5) ? `Low Stock: ${selectedColor.stock} Units` : "Inventory Available"}
                    </p>
                 )}
             </motion.div>

             {/* Sizes */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-4">
                   Select Size <div className="flex-1 h-[1px] bg-slate-100" />
                </h3>
                <div className="flex flex-wrap gap-3">
                   {product.sizes.map((size: string) => (
                     <button
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={cn(
                         "px-8 py-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                         selectedSize === size 
                           ? "border-slate-900 bg-slate-900 text-white shadow-2xl" 
                           : "border-slate-100 text-slate-400 hover:border-[#f06292] hover:text-[#f06292]"
                       )}
                     >
                       {size}
                     </button>
                   ))}
                </div>
             </motion.div>

             {/* Add to Cart and Buy Now */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                 <div className="flex gap-4">
                    <button 
                      onClick={handleAddToCart}
                      disabled={isAdding || (selectedColor?.stock <= 0)}
                      className={cn(
                        "flex-1 h-20 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all duration-700",
                        isAdding 
                          ? "bg-green-600 text-white" 
                          : (selectedColor?.stock <= 0)
                            ? "bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed"
                            : "bg-white text-[#f06292] border-2 border-[#f06292] hover:bg-[#fcf2f4] hover:scale-[1.02]"
                      )}
                    >
                       {isAdding ? (
                         <><Check size={20} /> Added</>
                       ) : (selectedColor?.stock <= 0) ? (
                         "Sold Out"
                       ) : (
                         <><ShoppingBag size={20} /> Add to Bag</>
                       )}
                    </button>
                    <button 
                      onClick={handleBuyNow}
                      disabled={(selectedColor?.stock <= 0)}
                      className={cn(
                        "flex-1 h-20 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all duration-700",
                        (selectedColor?.stock <= 0)
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-[#f06292] text-white hover:bg-slate-900 hover:scale-[1.02] shadow-2xl shadow-[#f06292]/20"
                      )}
                    >
                      {(selectedColor?.stock <= 0) ? "Unavailable" : "Buy Now"}
                    </button>
                 </div>
             </motion.div>

             {/* Description */}
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-12 border-t border-slate-100">
                <p className="text-slate-500 leading-loose text-sm italic">
                   {product.description}
                </p>
             </motion.div>

             {/* Features */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
                <div className="flex flex-col items-center gap-4 group">
                   <div className="w-16 h-16 rounded-full bg-[#fcf2f4] text-[#f06292] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Truck size={24} />
                   </div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Global Shipping</p>
                </div>
                <div className="flex flex-col items-center gap-4 group">
                   <div className="w-16 h-16 rounded-full bg-[#fcf2f4] text-[#f06292] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield size={24} />
                   </div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Product Guarantee</p>
                </div>
                <div className="flex flex-col items-center gap-4 group">
                   <div className="w-16 h-16 rounded-full bg-[#fcf2f4] text-[#f06292] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <RefreshCcw size={24} />
                   </div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Easy Returns</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
