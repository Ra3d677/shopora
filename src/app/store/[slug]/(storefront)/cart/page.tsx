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
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const { store } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
      <h1 className="text-4xl font-bold tracking-tight text-primary mb-12">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Trash2 className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link href={`/store/${store.slug}/products`} className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {items.map((item) => {
              // ALWAYS fetch the latest product data from the current store
              const latestProduct = store.products.find(p => p.id === item.product.id) || item.product;
              const price = latestProduct.discount_price || latestProduct.price;
              
              return (
                <div key={item.id} className="flex gap-6 py-6 border-b border-border/50">
                  <Link href={`/store/${store.slug}/products/${latestProduct.id}`} className="relative h-32 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image src={latestProduct.images[0]} alt={latestProduct.name} fill className="object-cover" />
                  </Link>
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/store/${store.slug}/products/${latestProduct.id}`} className="text-lg font-medium text-primary hover:underline">
                          {latestProduct.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">Size: {item.selectedSize}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">Color:</span>
                          <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: item.selectedColor }} />
                        </div>
                      </div>
                      <span className="font-semibold text-lg">${(price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border rounded-lg h-10 w-32">
                        <button 
                          className="flex-1 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="flex-1 flex items-center justify-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          className="flex-1 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-muted/30 rounded-2xl p-8 border border-border/50 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="flex justify-between mb-4 text-muted-foreground">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6 text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="border-t border-border/50 pt-6 mb-8 flex justify-between items-end">
                <span className="font-medium text-lg">Total</span>
                <span className="text-3xl font-bold">${getCartTotal().toFixed(2)}</span>
              </div>

              <Link 
                href={`/store/${store.slug}/checkout`} 
                onClick={() => trackInitiateCheckout(items, getCartTotal(), store)}
                className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
