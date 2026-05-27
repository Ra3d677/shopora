"use client";

import { useState, useEffect } from "react";
import SmartImage from "@/components/ui/SmartImage";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { Check, ShoppingBag, ArrowRight, Shield, RefreshCcw, Truck, Minus, Plus, Heart } from "lucide-react";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recordCartAdd } from "@/app/actions";
import { useWishlistStore } from "@/store/wishlist";
import ProductReviews from "@/components/store/ProductReviews";

const accent = "#e1205e";

export default function OneMProductDetail({ product, store }: { product: any, store: any }) {
  const router = useRouter();
  const productColors = Array.isArray(product.colors) ? product.colors.map((c: any) => typeof c === 'string' ? { name: c, value: c, imageUrl: null } : c) : [];

  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<any>(productColors[0] || null);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const selectedColorStock = selectedColor?.stock ?? product.stock_quantity;
  const isOutOfStock = selectedColorStock <= 0;

  const addItem = useCartStore(state => state.addItem);
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  useEffect(() => { trackViewContent(product, store); }, [product, store]);

  useEffect(() => {
    if (selectedColor?.imageUrl) setSelectedImage(selectedColor.imageUrl);
  }, [selectedColor]);

  useEffect(() => {
    if (quantity > selectedColorStock) setQuantity(Math.max(1, selectedColorStock));
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

  return (
    <div className="font-['Poppins',sans-serif]" style={{ color: "#333333" }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Images */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-32">
          <div className="relative w-full overflow-hidden" style={{ backgroundColor: "#f7f7f7", minHeight: "500px" }}>
            <SmartImage src={selectedImage} alt={product.name} className="w-full h-full object-cover" style={{ minHeight: "500px" }} />
            {product.discount_price && (
              <span className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wider" style={{ backgroundColor: accent }}>Sale</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(img)} className="shrink-0 w-20 h-20 overflow-hidden transition-all duration-300" style={{ border: selectedImage === img ? `2px solid ${accent}` : "2px solid transparent", opacity: selectedImage === img ? 1 : 0.5 }}>
                  <SmartImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col pt-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider mb-6" style={{ color: "#999999" }}>
            <Link href={`/store/${store.slug}`} className="hover:opacity-60 transition-opacity">Home</Link>
            <span>/</span>
            <Link href={`/store/${store.slug}/products`} className="hover:opacity-60 transition-opacity">Shop</Link>
            <span>/</span>
            <span style={{ color: "#333333" }}>{product.name}</span>
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#333333", lineHeight: "1.2" }}>{product.name}</h1>
            <button
              onClick={() => wishlisted ? removeWishlist(product.id) : addWishlist({ productId: product.id, storeId: product.storeId, name: product.name, price: product.price, image: product.images[0] || '', slug: store.slug })}
              className="shrink-0 w-10 h-10 flex items-center justify-center transition-colors duration-300 border"
              style={{ borderColor: wishlisted ? accent : "#e5e5e5", color: wishlisted ? accent : "#999999" }}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8 py-4" style={{ borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5" }}>
            {product.discount_price ? (
              <>
                <span className="text-2xl font-bold" style={{ color: accent }}>${product.discount_price}</span>
                <span className="text-lg line-through" style={{ color: "#999999" }}>${product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold" style={{ color: "#333333" }}>${product.price}</span>
            )}
          </div>

          {productColors.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#999999" }}>Color</h3>
              <div className="flex flex-wrap gap-3">
                {productColors.map((color: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className="h-10 w-10 flex items-center justify-center transition-all duration-300 relative"
                    style={{
                      border: selectedColor?.value === color.value ? `2px solid ${accent}` : "2px solid #e5e5e5",
                      backgroundColor: color.value,
                      opacity: (color.stock ?? product.stock_quantity) <= 0 ? 0.4 : 1
                    }}
                  >
                    {selectedColor?.value === color.value && (
                      <Check className="h-5 w-5" style={{ color: color.value === '#ffffff' ? "#333333" : "#ffffff" }} />
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider" style={{ color: isOutOfStock ? "#e1205e" : selectedColorStock < 5 ? "#d97706" : "#16a34a" }}>
                  {isOutOfStock ? "Out of Stock" : selectedColorStock < 5 ? `Only ${selectedColorStock} left` : "In Stock"}
                </p>
              )}
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#999999" }}>Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
                    style={{
                      border: selectedSize === size ? `2px solid ${accent}` : "2px solid #e5e5e5",
                      backgroundColor: selectedSize === size ? accent : "transparent",
                      color: selectedSize === size ? "#ffffff" : "#333333"
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#999999" }}>Quantity</h3>
              {selectedColor && (
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: selectedColorStock <= 0 ? accent : selectedColorStock < 10 ? "#d97706" : "#16a34a" }}>
                  {selectedColorStock <= 0 ? "Sold Out" : `${selectedColorStock} Available`}
                </span>
              )}
            </div>
            <div className="flex items-center h-12 w-40 overflow-hidden" style={{ border: "1px solid #e5e5e5" }}>
              <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={quantity <= 1 || isOutOfStock} className="w-12 h-full flex items-center justify-center transition-colors hover:bg-[#f7f7f7] disabled:opacity-20" style={{ color: "#333333" }}>
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex-1 flex items-center justify-center font-semibold text-sm" style={{ color: "#333333" }}>
                {quantity}
              </div>
              <button onClick={() => setQuantity(prev => Math.min(selectedColorStock, prev + 1))} disabled={quantity >= selectedColorStock || isOutOfStock} className="w-12 h-full flex items-center justify-center transition-colors hover:bg-[#f7f7f7] disabled:opacity-20" style={{ color: "#333333" }}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isAdding ? (
            <Link href={`/store/${store.slug}/cart`} className="w-full h-14 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-300" style={{ backgroundColor: "#16a34a", color: "#ffffff" }}>
              <Check className="h-4 w-4" /> View Cart <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleAddToCart} disabled={isOutOfStock} className={cn("flex-1 h-14 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300", isOutOfStock ? "bg-[#f5f5f5] text-[#999999] cursor-not-allowed" : "border-2 hover:bg-[#f7f7f7]")} style={{ borderColor: isOutOfStock ? "#e5e5e5" : accent, color: isOutOfStock ? "#999999" : "#333333" }}>
                <ShoppingBag className="h-4 w-4" /> {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </button>
              <button onClick={handleBuyNow} disabled={isOutOfStock} className={cn("flex-1 h-14 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300", isOutOfStock ? "bg-[#e5e5e5] text-[#999999] cursor-not-allowed" : "hover:opacity-90")} style={{ backgroundColor: isOutOfStock ? "#e5e5e5" : accent, color: "#ffffff" }}>
                {isOutOfStock ? "Unavailable" : "Buy Now"}
              </button>
            </div>
          )}

          <div className="mt-12 pt-8" style={{ borderTop: "1px solid #e5e5e5" }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#333333" }}>Product Details</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{product.description}</p>
          </div>

          <div className="mt-10 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ borderTop: "1px solid #e5e5e5" }}>
            <div className="flex flex-col items-center text-center gap-3 py-6" style={{ backgroundColor: "#f7f7f7" }}>
              <Shield size={20} style={{ color: accent }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#333333" }}>Secure Checkout</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3 py-6" style={{ backgroundColor: "#f7f7f7" }}>
              <Truck size={20} style={{ color: accent }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#333333" }}>Fast Delivery</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3 py-6" style={{ backgroundColor: "#f7f7f7" }}>
              <RefreshCcw size={20} style={{ color: accent }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#333333" }}>Easy Returns</p>
            </div>
          </div>

          <ProductReviews productId={product.id} storeSlug={store.slug} />

          {store.products.filter((p: any) => p.id !== product.id && p.category_id === product.category_id).length > 0 && (
            <div className="mt-12 pt-8" style={{ borderTop: "1px solid #e5e5e5" }}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: "#333333" }}>You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {store.products
                  .filter((p: any) => p.id !== product.id && p.category_id === product.category_id)
                  .slice(0, 4)
                  .map((related: any) => (
                    <Link key={related.id} href={`/store/${store.slug}/product/${related.id}`} className="group">
                      <div className="overflow-hidden mb-3" style={{ backgroundColor: "#f7f7f7" }}>
                        <img src={related.images?.[0]} alt={related.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <h4 className="text-xs font-semibold truncate group-hover:opacity-60 transition-opacity" style={{ color: "#333333" }}>{related.name}</h4>
                      <p className="text-sm font-bold mt-1" style={{ color: accent }}>${(related.discount_price || related.price).toFixed(2)}</p>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
