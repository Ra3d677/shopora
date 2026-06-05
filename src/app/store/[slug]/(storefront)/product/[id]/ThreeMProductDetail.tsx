"use client";

import { useState, useEffect } from "react";
import SmartImage from "@/components/ui/SmartImage";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import { recordCartAdd } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag, ArrowRight, Shield, RefreshCcw, Truck, Minus, Plus, Eye, Heart, Star, ChevronRight } from "lucide-react";

const accent = "#ff7245";
const bgLight = "#eff6f6";

export default function ThreeMProductDetail({ product, store }: { product: any, store: any }) {
  const router = useRouter();
  const productColors = Array.isArray(product.colors) ? product.colors.map((c: any) => typeof c === 'string' ? { name: c, value: c, imageUrl: null } : c) : [];
  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<any>(productColors[0] || null);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const selectedColorStock = selectedColor?.stock ?? product.stock_quantity;
  const isOutOfStock = selectedColorStock <= 0;
  const addItem = useCartStore(s => s.addItem);
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  useEffect(() => { trackViewContent(product, store); }, [product, store]);
  useEffect(() => { if (selectedColor?.imageUrl) setSelectedImage(selectedColor.imageUrl); }, [selectedColor]);
  useEffect(() => { if (quantity > selectedColorStock) setQuantity(Math.max(1, selectedColorStock)); }, [selectedColor, selectedColorStock]);

  const handleAddToCart = () => {
    if (quantity > selectedColorStock) return;
    setIsAdding(true);
    addItem({ id: `${product.storeId}-${product.id}-${selectedSize}-${selectedColor?.name || selectedColor?.value || 'default'}`, storeId: product.storeId, product, quantity, selectedSize, selectedColor: selectedColor?.name || selectedColor?.value || 'default', selectedImage });
    trackAddToCart(product, quantity, store);
    recordCartAdd(store.slug, product.id);
  };

  const handleBuyNow = () => {
    if (quantity > selectedColorStock) return;
    addItem({ id: `${product.storeId}-${product.id}-${selectedSize}-${selectedColor?.name || selectedColor?.value || 'default'}`, storeId: product.storeId, product, quantity, selectedSize, selectedColor: selectedColor?.name || selectedColor?.value || 'default', selectedImage });
    trackAddToCart(product, quantity, store);
    recordCartAdd(store.slug, product.id);
    router.push(`/store/${store.slug}/checkout`);
  };

  return (
    <div className="min-h-screen pb-24" style={{ fontFamily: "Poppins,sans-serif", color: "#333333" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-10 pt-8" style={{ color: "#999999" }}>
          <Link href={`/store/${store.slug}`} className="hover:opacity-60 transition-opacity" style={{ color: "#999999" }}>Home</Link>
          <ChevronRight size={10} />
          <Link href={`/store/${store.slug}/products`} className="hover:opacity-60 transition-opacity" style={{ color: "#999999" }}>Products</Link>
          <ChevronRight size={10} />
          <span style={{ color: "#333333" }}>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
          {/* LEFT: Images */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-8 self-start">
            <div className="relative overflow-hidden" style={{ backgroundColor: "#fafafa" }}>
              <SmartImage src={selectedImage} alt={product.name} className="w-full h-full object-cover" style={{ aspectRatio: "4/5" }} />
              {product.discount_price && (
                <span className="absolute top-5 left-5 z-10 px-3 py-1 text-[10px] font-bold uppercase text-white" style={{ backgroundColor: accent }}>Sale</span>
              )}
              <button
                onClick={() => wishlisted ? removeWishlist(product.id) : addWishlist({ productId: product.id, storeId: product.storeId, name: product.name, price: product.price, image: product.images[0] || '', slug: store.slug })}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white shadow-md border-0 transition-all cursor-pointer hover:scale-110"
              >
                <Heart size={16} className={wishlisted ? "fill-current" : ""} style={{ color: wishlisted ? accent : "#333333" }} />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button key={idx} onClick={() => setSelectedImage(img)}
                    className="shrink-0 overflow-hidden border-2 transition-all cursor-pointer"
                    style={{ width: "88px", height: "88px", borderColor: selectedImage === img ? accent : "#ebebeb", opacity: selectedImage === img ? 1 : 0.5 }}>
                    <SmartImage src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col pt-4">
            <div className="mb-8">
              {product.category && <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#999999" }}>{product.category}</p>}
              <h1 className="text-3xl font-medium leading-tight mb-4" style={{ fontFamily: "Poppins,sans-serif" }}>{product.name}</h1>
              <div className="flex items-center gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={14} fill="#ff7245" style={{ color: "#ff7245" }} />))}
                <span className="text-xs ml-2" style={{ color: "#999999" }}>(5 reviews)</span>
              </div>
              <div className="flex items-end gap-3">
                {product.discount_price ? (
                  <><span className="text-2xl font-bold" style={{ color: accent }}>${product.discount_price.toFixed(2)}</span><span className="text-sm line-through font-medium" style={{ color: "#999999" }}>${product.price.toFixed(2)}</span></>
                ) : (
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Colors */}
            {productColors.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#666666" }}>Color: <span className="font-bold" style={{ color: "#333333" }}>{selectedColor?.name || ''}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {productColors.map((color: any, idx: number) => {
                    const isColOutOfStock = (color.stock || 0) <= 0;
                    return (
                      <button key={idx} onClick={() => setSelectedColor(color)}
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer"
                        style={{ borderColor: selectedColor?.value === color.value ? "#000000" : "#ebebeb", backgroundColor: color.value, opacity: isColOutOfStock ? 0.3 : 1 }}>
                        {selectedColor?.value === color.value && <Check size={16} className={color.value === '#ffffff' ? "text-black" : "text-white"} />}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: isOutOfStock ? "#ff0000" : selectedColorStock < 5 ? accent : "#666666" }}>
                  {isOutOfStock ? "Out of Stock" : selectedColorStock < 5 ? `Only ${selectedColorStock} left` : "In Stock"}
                </p>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#666666" }}>Size</h3>
                  <button className="text-[10px] font-bold underline transition-colors" style={{ color: "#999999" }}>Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className="min-w-[56px] h-11 px-4 text-xs font-semibold uppercase tracking-wider border transition-all duration-200 cursor-pointer"
                      style={{ backgroundColor: selectedSize === size ? "#000000" : "#ffffff", color: selectedSize === size ? "#ffffff" : "#333333", borderColor: selectedSize === size ? "#000000" : "#ebebeb" }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-10 pb-8 border-b border-gray-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#666666" }}>Quantity</h3>
              <div className="flex items-center border border-gray-200 w-fit" style={{ backgroundColor: "#fafafa" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || isOutOfStock} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all cursor-pointer disabled:opacity-30">
                  <Minus size={14} />
                </button>
                <span className="w-14 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(selectedColorStock, q + 1))} disabled={quantity >= selectedColorStock || isOutOfStock} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all cursor-pointer disabled:opacity-30">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart / Buy Now */}
            <div className="mb-10">
              {isAdding ? (
                <Link href={`/store/${store.slug}/cart`} className="w-full h-14 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-white transition-all" style={{ backgroundColor: "#22c55e" }}>
                  <Check size={18} /> Added! View Cart <ArrowRight size={18} />
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <button onClick={handleAddToCart} disabled={isOutOfStock}
                    className="w-full h-14 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-white transition-all cursor-pointer disabled:opacity-40"
                    style={{ backgroundColor: isOutOfStock ? "#cccccc" : "#000000" }}>
                    <ShoppingBag size={16} /> {isOutOfStock ? "Sold Out" : "Add to Cart"}
                  </button>
                  <button onClick={handleBuyNow} disabled={isOutOfStock}
                    className="w-full h-14 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider border-2 transition-all cursor-pointer disabled:opacity-40"
                    style={{ backgroundColor: "#ffffff", color: "#333333", borderColor: "#ebebeb" }}>
                    {isOutOfStock ? "Unavailable" : "Buy Now"}
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-10 pb-8 border-b border-gray-200">
              <h3 className="text-sm font-semibold mb-4">Product Details</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{product.description}</p>
            </div>

            {/* Features */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="mb-12">
              {[
                { icon: <Truck size={18} />, label: "Free Shipping" },
                { icon: <Shield size={18} />, label: "Secure Payment" },
                { icon: <RefreshCcw size={18} />, label: "Easy Returns" }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 py-4 px-2 border border-gray-200" style={{ backgroundColor: bgLight }}>
                  <div style={{ color: accent }}>{f.icon}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Related Products */}
            {store.products?.filter((p: any) => p.id !== product.id && p.category_id === product.category_id).length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-6" style={{ fontFamily: "Poppins,sans-serif" }}>You May Also Like</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                  {store.products
                    .filter((p: any) => p.id !== product.id && p.category_id === product.category_id)
                    .slice(0, 4)
                    .map((related: any) => (
                      <Link key={related.id} href={`/store/${store.slug}/product/${related.id}`} className="group border border-gray-200 p-3 text-center">
                        <div className="overflow-hidden mb-3" style={{ backgroundColor: "#fafafa", aspectRatio: "1/1" }}>
                          <img src={related.images?.[0]} alt={related.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h4 className="text-xs font-medium truncate mb-1">{related.name}</h4>
                        <p className="text-xs font-bold">${(related.discount_price || related.price).toFixed(2)}</p>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
