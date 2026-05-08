"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Loader2, Lock, ShieldCheck, CreditCard, ChevronRight, Mail, User as UserIcon, MapPin, Phone } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { createOrder } from "../../admin/orders/actions";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getCartTotal, clearCart } = useCartStore();
  const { store, user } = useStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      // 1. Filter valid items
      const validItems = items.filter(item => store.products.some(p => p.id === item.product.id));
      if (validItems.length === 0) {
        throw new Error("Sorry, the items in your cart are no longer available.");
      }

      // 2. Calculate total
      const total_price = validItems.reduce((total, item) => {
        const latestProduct = store.products.find(p => p.id === item.product.id) || item.product;
        const price = latestProduct.discount_price || latestProduct.price;
        return total + price * item.quantity;
      }, 0);

      const result = await createOrder({
        storeId: store.id,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        notes: formData.notes,
        totalAmount: total_price,
        items: validItems,
        userId: user?.id // Link to user if logged in
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create order");
      }

      const orderId = result.orderId;

      // WhatsApp Notification
      try {
        await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customer: formData,
            items: validItems,
            total: total_price,
            storeId: store.id
          })
        });
      } catch (waError) {
        console.warn("WhatsApp notification failed, but order was saved:", waError);
      }

      clearCart();
      router.push(`/store/${store.slug}/success?orderId=${orderId}`);
    } catch (err: any) {
      setError(err.message || "An error occurred during checkout.");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <button onClick={() => router.push(`/store/${store.slug}/products`)} className="text-slate-900 hover:underline">
          Go back to shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">
          <span>Cart</span> <ChevronRight size={14} /> <span className="text-slate-900">Checkout</span>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-6 rounded-[2rem] mb-8 border border-red-100 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">!</div>
            <p className="font-bold text-sm">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                  Delivery Details
                </h2>
            
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" id="name" name="name" required
                            value={formData.name} onChange={handleChange}
                            className="w-full h-16 pl-14 pr-5 rounded-2xl border-2 border-transparent focus:border-slate-900 outline-none transition-all bg-white shadow-sm text-sm font-bold"
                            placeholder="John Doe"
                        />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="email" id="email" name="email" required
                            value={formData.email} onChange={handleChange}
                            className="w-full h-16 pl-14 pr-5 rounded-2xl border-2 border-transparent focus:border-slate-900 outline-none transition-all bg-white shadow-sm text-sm font-bold"
                            placeholder="john@example.com"
                        />
                    </div>
                  </div>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="tel" id="phone" name="phone" required
                            value={formData.phone} onChange={handleChange}
                            className="w-full h-16 pl-14 pr-5 rounded-2xl border-2 border-transparent focus:border-slate-900 outline-none transition-all bg-white shadow-sm text-sm font-bold"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Shipping Address</label>
                  <div className="relative">
                      <MapPin className="absolute left-5 top-6 w-5 h-5 text-slate-400" />
                      <textarea 
                        id="address" name="address" required rows={3}
                        value={formData.address} onChange={handleChange}
                        className="w-full pl-14 pr-5 py-5 rounded-2xl border-2 border-transparent focus:border-slate-900 outline-none transition-all resize-none bg-white shadow-sm text-sm font-bold leading-relaxed"
                        placeholder="123 Main St, Apt 4B, City, Country"
                      />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Order Notes (Optional)</label>
                  <textarea 
                    id="notes" name="notes" rows={2}
                    value={formData.notes} onChange={handleChange}
                    className="w-full px-6 py-5 rounded-2xl border-2 border-transparent focus:border-slate-900 outline-none transition-all resize-none bg-white shadow-sm text-sm font-bold leading-relaxed"
                    placeholder="Special instructions for delivery"
                  />
                </div>
              </div>
              </div>

              <div className="pt-12 border-t border-slate-200">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                  Payment Method
                </h2>
                <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-900 shadow-2xl shadow-slate-200 flex items-start gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200">
                    <CreditCard className="h-8 w-8 text-slate-900" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-black uppercase tracking-widest text-sm mb-2">Cash on Delivery</h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Pay securely with cash once your package arrives at your doorstep.</p>
                  </div>
                  <div className="ml-auto w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-xl shadow-slate-900/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="pt-12">
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-black text-white h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-70 shadow-2xl shadow-slate-900/40"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-6 w-6 animate-spin" /> Processing...</>
                  ) : (
                    <>Complete Purchase &mdash; ${(getCartTotal()).toFixed(2)} <Lock className="h-4 w-4" /></>
                  )}
                </button>
                <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <ShieldCheck size={18} className="text-green-500" /> Encrypted & Secure
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 lg:sticky lg:top-32 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 pb-6 border-b border-slate-100">Summary</h2>
            
              <div className="flex flex-col gap-8 mb-10 max-h-[450px] overflow-y-auto pr-4 scrollbar-hide">
                {items.map((item) => {
                  const latestProduct = store.products.find(p => p.id === item.product.id) || item.product;
                  const price = latestProduct.discount_price || latestProduct.price;
                  return (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="relative h-28 w-24 rounded-[1.5rem] overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100 shadow-sm">
                        <Image src={latestProduct.images[0]} alt={latestProduct.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black h-8 w-8 flex items-center justify-center rounded-full shadow-2xl border-2 border-white">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex flex-col flex-grow justify-center">
                        <h4 className="text-sm font-black uppercase tracking-tight line-clamp-1 mb-2">{latestProduct.name}</h4>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-md uppercase tracking-widest">{item.selectedSize}</span>
                            <span className="w-4 h-4 rounded-full border border-white shadow-md" style={{backgroundColor: item.selectedColor}}></span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-lg font-black tracking-tighter">${(price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-5 border-t border-slate-100 pt-8">
                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                  <span>Delivery</span>
                  <span className="text-green-600">Complimentary</span>
                </div>
                <div className="pt-6 mt-4 flex justify-between items-end border-t-2 border-slate-900">
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Total</span>
                  <span className="text-5xl font-black tracking-tighter text-slate-900">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
