"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { trackInitiateCheckout } from "@/lib/tracking";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items: allItems, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const { store } = useStore();

  const items = allItems.filter(item => item.storeId === store.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="store-container min-h-screen py-16 transition-all duration-700"
      data-page="cart"
      style={{ background: 'var(--color-bg-cart)', color: 'var(--color-text-cart)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight mb-12">
          <span className="gradient-text-support">Shopping Cart</span>
        </h1>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-24 w-24 bg-black/10 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="h-10 w-10 opacity-50" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="opacity-50 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href={`/store/${store.slug}/products`} className="bg-white text-black px-8 py-4 rounded-full font-medium hover:opacity-80 transition-all">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 flex flex-col gap-8">
              {items.map((item) => {
                const latestProduct = store.products.find(p => p.id === item.product.id) || item.product;
                const price = latestProduct.discount_price || latestProduct.price;
                return (
                  <div key={item.id} className="flex gap-6 py-6 border-b border-white/10">
                    <Link href={`/store/${store.slug}/product/${latestProduct.id}`} className="relative h-32 w-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      <Image src={latestProduct.images[0]} alt={latestProduct.name} fill className="object-cover" />
                    </Link>
                    <div className="flex flex-col flex-grow justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/store/${store.slug}/product/${latestProduct.id}`} className="text-lg font-medium hover:underline">
                            {latestProduct.name}
                          </Link>
                          <p className="text-sm opacity-50 mt-1">Size: {item.selectedSize}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm opacity-50">Color:</span>
                            <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: item.selectedColor }} />
                          </div>
                        </div>
                        <span className="font-semibold text-lg">${(price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-white/10 rounded-lg h-10 w-32">
                          <button className="flex-1 flex items-center justify-center hover:opacity-50" onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}><Minus className="h-4 w-4" /></button>
                          <span className="flex-1 flex items-center justify-center font-medium text-sm">{item.quantity}</span>
                          <button className="flex-1 flex items-center justify-center hover:opacity-50" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-sm opacity-50 hover:text-red-500 transition-colors flex items-center gap-1"><Trash2 className="h-4 w-4" /> Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 lg:sticky lg:top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="flex justify-between mb-4 opacity-50"><span>Subtotal</span><span>${getCartTotal(store.id).toFixed(2)}</span></div>
                <div className="flex justify-between mb-6 opacity-50"><span>Shipping</span><span>Calculated at checkout</span></div>
                <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-end"><span className="font-medium text-lg">Total</span><span className="text-3xl font-bold">${getCartTotal(store.id).toFixed(2)}</span></div>
                <Link href={`/store/${store.slug}/checkout`} onClick={() => trackInitiateCheckout(items, getCartTotal(store.id), store)} className="w-full bg-white text-black hover:opacity-80 h-14 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]">Proceed to Checkout <ArrowRight className="h-5 w-5" /></Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
