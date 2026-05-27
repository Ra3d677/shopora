"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/providers/StoreProvider";
import { createOrder } from "../../admin/orders/actions";
import Link from "next/link";
import { Minus, Plus, Trash2, Shield, RefreshCcw, Truck } from "lucide-react";

const accent = "#e1205e";

export default function OneMCheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items: allItems, getCartTotal, clearCart, updateQuantity, removeItem } = useCartStore();
  const { store, user } = useStore();
  const router = useRouter();

  const items = allItems.filter(item => item.storeId === store.id);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const total = getCartTotal(store.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError("");

    try {
      const validItems = items.filter(item => store.products.some((p: any) => p.id === item.product.id));
      if (validItems.length === 0) throw new Error("Cart items are no longer available.");

      const result = await createOrder({
        storeId: store.id,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        notes: formData.notes,
        totalAmount: total,
        items: validItems,
        userId: user?.id,
      });

      if (!result.success) throw new Error(result.error || "Order failed");

      try {
        await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: result.orderId, customer: formData, items: validItems, total, storeId: store.id })
        });
      } catch {}

      clearCart(store.id);
      router.push(`/store/${store.slug}/success?orderId=${result.orderId}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="font-['Poppins',sans-serif]" style={{ color: "#333333" }}>
      <div className="max-w-[1170px] mx-auto" style={{ padding: "0px 15px" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider py-4 mb-6" style={{ color: "#999999" }}>
          <Link href={`/store/${store.slug}`} className="hover:opacity-60 transition-opacity">Home</Link>
          <span>/</span>
          <span style={{ color: "#333333" }}>Checkout</span>
        </div>

        <h2 className="text-2xl font-semibold mb-8" style={{ color: "#333333" }}>Checkout</h2>

        {error && (
          <div className="p-4 mb-6 text-sm" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#333333" }}>Your cart is currently empty.</h2>
            <p className="mb-6 text-sm" style={{ color: "#666666" }}>Before proceed to checkout you must add some products to your shopping cart.</p>
            <Link href={`/store/${store.slug}/products`} className="inline-block px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300" style={{ backgroundColor: accent, color: "#ffffff" }}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Cart Items + Form */}
            <div className="lg:col-span-2">
              {/* Cart Items */}
              <div className="mb-10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
                      <th className="text-left py-4 font-semibold uppercase tracking-wider text-xs" style={{ color: "#999999" }}>Product</th>
                      <th className="text-center py-4 font-semibold uppercase tracking-wider text-xs" style={{ color: "#999999" }}>Qty</th>
                      <th className="text-right py-4 font-semibold uppercase tracking-wider text-xs" style={{ color: "#999999" }}>Total</th>
                      <th className="py-4 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const latestProduct = store.products.find((p: any) => p.id === item.product.id) || item.product;
                      const price = latestProduct.discount_price || latestProduct.price;
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #e5e5e5" }}>
                          <td className="py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 shrink-0 overflow-hidden" style={{ backgroundColor: "#f7f7f7" }}>
                                <img src={item.selectedImage || latestProduct.images[0]} alt={latestProduct.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm" style={{ color: "#333333" }}>{latestProduct.name}</p>
                                <p className="text-xs mt-1" style={{ color: "#666666" }}>${price.toFixed(2)}</p>
                                {item.selectedSize && <p className="text-xs" style={{ color: "#999999" }}>Size: {item.selectedSize}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <div className="inline-flex items-center h-8" style={{ border: "1px solid #e5e5e5" }}>
                              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1} className="w-8 h-full flex items-center justify-center hover:bg-[#f7f7f7] transition-colors disabled:opacity-20">
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= (latestProduct.stock_quantity || 999)} className="w-8 h-full flex items-center justify-center hover:bg-[#f7f7f7] transition-colors disabled:opacity-20">
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 text-right font-semibold text-sm">${(price * item.quantity).toFixed(2)}</td>
                          <td className="py-4 text-right">
                            <button onClick={() => removeItem(item.id)} className="hover:opacity-60 transition-opacity" style={{ color: "#999999" }}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="max-w-lg">
                <h3 className="text-base font-semibold mb-6" style={{ color: "#333333" }}>Shipping Information</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Full Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full h-12 px-4 outline-none text-sm transition-colors"
                      style={{ border: "1px solid #e5e5e5", color: "#333333", backgroundColor: "#ffffff" }}
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full h-12 px-4 outline-none text-sm transition-colors"
                      style={{ border: "1px solid #e5e5e5", color: "#333333", backgroundColor: "#ffffff" }}
                      placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Phone</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                      className="w-full h-12 px-4 outline-none text-sm transition-colors"
                      style={{ border: "1px solid #e5e5e5", color: "#333333", backgroundColor: "#ffffff" }}
                      placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Address</label>
                    <textarea name="address" required rows={3} value={formData.address} onChange={handleChange}
                      className="w-full px-4 py-3 outline-none text-sm transition-colors resize-none"
                      style={{ border: "1px solid #e5e5e5", color: "#333333", backgroundColor: "#ffffff" }}
                      placeholder="123 Main St, City" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#999999" }}>Order Notes (optional)</label>
                    <textarea name="notes" rows={2} value={formData.notes} onChange={handleChange}
                      className="w-full px-4 py-3 outline-none text-sm transition-colors resize-none"
                      style={{ border: "1px solid #e5e5e5", color: "#333333", backgroundColor: "#ffffff" }}
                      placeholder="Special instructions" />
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="p-8" style={{ backgroundColor: "#f7f7f7" }}>
                <h3 className="text-base font-semibold mb-6" style={{ color: "#333333" }}>Cart totals</h3>
                <div className="space-y-3 text-sm mb-8">
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid #e5e5e5" }}>
                    <span style={{ color: "#666666" }}>{items.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                    <span className="font-semibold" style={{ color: "#333333" }}>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid #e5e5e5" }}>
                    <span style={{ color: "#666666" }}>Subtotal</span>
                    <span className="font-semibold" style={{ color: "#333333" }}>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: "1px solid #e5e5e5" }}>
                    <span style={{ color: "#666666" }}>Shipping</span>
                    <span style={{ color: "#16a34a" }}>Free</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold text-base">
                    <span style={{ color: "#333333" }}>Total</span>
                    <span style={{ color: accent }}>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={isSubmitting}
                  className="w-full h-12 text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
                  style={{ backgroundColor: accent, color: "#ffffff" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ef3444"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent; }}
                >
                  {isSubmitting ? "Processing..." : "Proceed to checkout"}
                </button>
              </div>

              {/* Policy Icons */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs py-3" style={{ borderBottom: "1px solid #e5e5e5", color: "#666666" }}>
                  <Shield size={16} style={{ color: accent }} />
                  <span>Security policy</span>
                </div>
                <div className="flex items-center gap-3 text-xs py-3" style={{ borderBottom: "1px solid #e5e5e5", color: "#666666" }}>
                  <Truck size={16} style={{ color: accent }} />
                  <span>Delivery policy</span>
                </div>
                <div className="flex items-center gap-3 text-xs py-3" style={{ borderBottom: "1px solid #e5e5e5", color: "#666666" }}>
                  <RefreshCcw size={16} style={{ color: accent }} />
                  <span>Return policy</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
