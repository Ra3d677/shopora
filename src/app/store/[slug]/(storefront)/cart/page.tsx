"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { trackInitiateCheckout } from "@/lib/tracking";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items: allItems, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const { store } = useStore();
  const primary = "#fed700";

  const items = allItems.filter(item => item.storeId === store.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
      <div className="font-['Lato',sans-serif]" style={{ color: "#333333" }}>
        <div className="mx-auto" style={{ padding: "0px 15px", maxWidth: "1200px" }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider py-4 mb-4" style={{ color: "#999999" }}>
            <Link href={`/store/${store.slug}`} className="hover:opacity-60 transition-opacity" style={{ color: "#999999" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "#333333" }}>Shopping Cart</span>
          </div>

          <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "Lato,sans-serif", color: "#333333" }}>SHOPPING CART</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: "#f7f7f7" }}>
                <ShoppingCart size={32} style={{ color: "#cccccc" }} />
              </div>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "#333333" }}>Your cart is currently empty.</h2>
              <p className="text-sm mb-8" style={{ color: "#666666" }}>Before proceed to checkout you must add some products to your shopping cart.</p>
              <Link href={`/store/${store.slug}/products`} className="inline-block px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors" style={{ backgroundColor: primary, color: "#333333" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
              >Continue shopping</Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left: Cart Table */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5e5e5" }}>
                      <th className="text-left py-4 font-bold uppercase tracking-wider text-xs" style={{ color: "#999999", width: "100px" }}>Image</th>
                      <th className="text-left py-4 font-bold uppercase tracking-wider text-xs" style={{ color: "#999999" }}>Product</th>
                      <th className="text-center py-4 font-bold uppercase tracking-wider text-xs" style={{ color: "#999999", width: "120px" }}>Qty</th>
                      <th className="text-right py-4 font-bold uppercase tracking-wider text-xs" style={{ color: "#999999", width: "100px" }}>Unit Price</th>
                      <th className="text-right py-4 font-bold uppercase tracking-wider text-xs" style={{ color: "#999999", width: "100px" }}>Total</th>
                      <th className="py-4" style={{ width: "40px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const latestProduct = store.products.find((p: any) => p.id === item.product.id) || item.product;
                      const price = latestProduct.discount_price || latestProduct.price;
                      const colors = Array.isArray(latestProduct.colors) ? latestProduct.colors : (() => { try { return JSON.parse(latestProduct.colors || '[]'); } catch { return []; } })();
                      const colorObj = colors.find((c: any) => (c.name === item.selectedColor || c.value === item.selectedColor));
                      const stock = colorObj?.stock ?? latestProduct.stock_quantity;
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #e5e5e5" }}>
                          <td className="py-4">
                            <Link href={`/store/${store.slug}/product/${latestProduct.id}`} className="block w-20 h-20 overflow-hidden" style={{ backgroundColor: "#f7f7f7" }}>
                              <img src={item.selectedImage || latestProduct.images[0]} alt={latestProduct.name} className="w-full h-full object-cover" />
                            </Link>
                          </td>
                          <td className="py-4 pr-4">
                            <Link href={`/store/${store.slug}/product/${latestProduct.id}`} className="text-sm font-semibold transition-colors hover:opacity-60" style={{ color: "#333333" }}>{latestProduct.name}</Link>
                            {item.selectedSize && <p className="text-xs mt-0.5" style={{ color: "#999999" }}>Size: {item.selectedSize}</p>}
                            {item.selectedColor && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs" style={{ color: "#999999" }}>Color:</span>
                                <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: item.selectedColor, border: "1px solid #ddd" }} />
                              </div>
                            )}
                          </td>
                          <td className="py-4 text-center">
                            <div className="inline-flex items-center" style={{ border: "1px solid #e5e5e5" }}>
                              <button onClick={() => { if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1); else removeItem(item.id); }} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center text-xs transition-colors hover:bg-[#f7f7f7] disabled:opacity-20"><Minus className="h-3 w-3" /></button>
                              <span className="w-10 text-center text-xs font-semibold">{item.quantity}</span>
                              <button onClick={() => { if (item.quantity < stock) updateQuantity(item.id, item.quantity + 1); }} disabled={item.quantity >= stock} className="w-8 h-8 flex items-center justify-center text-xs transition-colors hover:bg-[#f7f7f7] disabled:opacity-20"><Plus className="h-3 w-3" /></button>
                            </div>
                          </td>
                          <td className="py-4 text-right text-sm" style={{ color: "#666666" }}>${price.toFixed(2)}</td>
                          <td className="py-4 text-right text-sm font-bold" style={{ color: "#333333" }}>${(price * item.quantity).toFixed(2)}</td>
                          <td className="py-4 text-right">
                            <button onClick={() => removeItem(item.id)} className="transition-opacity hover:opacity-60" style={{ color: "#cccccc" }}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Continue Shopping */}
                <div className="flex items-center justify-between mt-6">
                  <Link href={`/store/${store.slug}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-60" style={{ color: "#333333" }}>
                    <ArrowLeft className="h-4 w-4" /> Continue shopping
                  </Link>
                </div>
              </div>

              {/* Right: Cart Summary */}
              <div className="lg:w-80 shrink-0">
                <div className="p-8" style={{ backgroundColor: "#f7f7f7" }}>
                  <h3 className="text-base font-bold mb-6" style={{ color: "#333333" }}>Cart totals</h3>
                  <div className="space-y-3 text-sm mb-8">
                    <div className="flex justify-between py-2" style={{ borderBottom: "1px solid #e5e5e5" }}>
                      <span style={{ color: "#666666" }}>Subtotal</span>
                      <span className="font-semibold" style={{ color: "#333333" }}>${getCartTotal(store.id).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2" style={{ borderBottom: "1px solid #e5e5e5" }}>
                      <span style={{ color: "#666666" }}>Shipping</span>
                      <span style={{ color: "#16a34a" }}>Free</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-base">
                      <span style={{ color: "#333333" }}>Total</span>
                      <span style={{ color: "#333333" }}>${getCartTotal(store.id).toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href={`/store/${store.slug}/checkout`} onClick={() => trackInitiateCheckout(items, getCartTotal(store.id), store)}
                    className="w-full h-12 flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-colors"
                    style={{ backgroundColor: primary, color: "#333333" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
                  >Proceed to checkout</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
