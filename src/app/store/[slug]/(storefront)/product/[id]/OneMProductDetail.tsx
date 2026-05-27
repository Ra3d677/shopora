"use client";

import { useState, useEffect } from "react";
import SmartImage from "@/components/ui/SmartImage";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Minus, Plus, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recordCartAdd } from "@/app/actions";
import { useWishlistStore } from "@/store/wishlist";
import ProductReviews from "@/components/store/ProductReviews";

export default function OneMProductDetail({ product, store }: { product: any, store: any }) {
  const accent = store?.settings?.colorSystem?.brand?.primary || store?.primaryColor || "#e1205e";
  const router = useRouter();
  const productColors = Array.isArray(product.colors) ? product.colors.map((c: any) => typeof c === 'string' ? { name: c, value: c, imageUrl: null } : c) : [];

  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<any>(productColors[0] || null);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const selectedColorStock = selectedColor?.stock ?? product.stock_quantity;
  const isOutOfStock = selectedColorStock <= 0;

  const allProducts = store.products || [];
  const currentIdx = allProducts.findIndex((p: any) => p.id === product.id);
  const prevProduct = currentIdx > 0 ? allProducts[currentIdx - 1] : null;
  const nextProduct = currentIdx < allProducts.length - 1 ? allProducts[currentIdx + 1] : null;

  const addItem = useCartStore(state => state.addItem);
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  useEffect(() => { trackViewContent(product, store); }, [product, store]);
  useEffect(() => { if (selectedColor?.imageUrl) setSelectedImage(selectedColor.imageUrl); }, [selectedColor]);
  useEffect(() => { if (quantity > selectedColorStock) setQuantity(Math.max(1, selectedColorStock)); }, [selectedColor, selectedColorStock]);

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

  const relatedProducts = allProducts.filter((p: any) => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);

  return (
    <div className="font-['Poppins',sans-serif]" style={{ color: "#333333" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider mb-8" style={{ color: "#999999", padding: "15px 0" }}>
        <Link href={`/store/${store.slug}`} className="hover:opacity-60 transition-opacity">Home</Link>
        <span>/</span>
        <Link href={`/store/${store.slug}/products`} className="hover:opacity-60 transition-opacity">{store.settings?.storeName || "Shop"}</Link>
        <span>/</span>
        <span style={{ color: "#333333" }}>{product.name}</span>
      </div>

      {/* Prev / Next Navigation */}
      <div className="flex justify-between mb-8">
        <div>
          {prevProduct && (
            <Link href={`/store/${store.slug}/product/${prevProduct.id}`} className="flex items-center gap-2 group text-xs uppercase tracking-wider" style={{ color: "#999999" }}>
              <ChevronLeft size={14} className="group-hover:opacity-60" />
              <span className="group-hover:opacity-60 transition-opacity">Previous product</span>
            </Link>
          )}
        </div>
        <Link href={`/store/${store.slug}`} className="text-xs uppercase tracking-wider hover:opacity-60 transition-opacity" style={{ color: "#999999" }}>Back to home</Link>
        <div>
          {nextProduct && (
            <Link href={`/store/${store.slug}/product/${nextProduct.id}`} className="flex items-center gap-2 group text-xs uppercase tracking-wider" style={{ color: "#999999" }}>
              <span className="group-hover:opacity-60 transition-opacity">Next product</span>
              <ChevronRight size={14} className="group-hover:opacity-60" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Images */}
        <div className="flex flex-col">
          <div className="relative w-full overflow-hidden text-center" style={{ backgroundColor: "#f7f7f7" }}>
            <SmartImage src={selectedImage} alt={product.name} className="w-full h-auto object-contain" style={{ maxHeight: "600px" }} />
            {product.discount_price && (
              <span className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wider z-10" style={{ backgroundColor: accent }}>Sale</span>
            )}
            {!product.discount_price && (
              <span className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wider z-10" style={{ backgroundColor: "#333333" }}>New</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {product.images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(img)} className="shrink-0 w-20 h-20 overflow-hidden transition-all duration-300" style={{ border: selectedImage === img ? `2px solid ${accent}` : "2px solid transparent", opacity: selectedImage === img ? 1 : 0.5 }}>
                  <SmartImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: "#333333", lineHeight: "1.4" }}>{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            {product.discount_price ? (
              <>
                <span className="text-2xl font-bold" style={{ color: accent }}>${product.discount_price.toFixed(2)}</span>
                <span className="text-lg line-through" style={{ color: "#999999" }}>${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold" style={{ color: "#333333" }}>${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: "#666666" }}>{product.description}</p>

          {/* Stock */}
          <div className="mb-8 py-4" style={{ borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5" }}>
            <p className="text-sm" style={{ color: isOutOfStock ? accent : "#16a34a" }}>
              {isOutOfStock ? "Out of stock" : `In stock ${selectedColorStock} Items`}
            </p>
          </div>

          {/* Colors */}
          {productColors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#999999" }}>Color</h3>
              <div className="flex flex-wrap gap-3">
                {productColors.map((color: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 relative"
                    style={{
                      border: selectedColor?.value === color.value ? `2px solid ${accent}` : "2px solid #e5e5e5",
                      backgroundColor: color.value,
                      opacity: (color.stock ?? product.stock_quantity) <= 0 ? 0.4 : 1
                    }}
                  >
                    {selectedColor?.value === color.value && (
                      <span style={{ color: color.value === '#ffffff' ? "#333333" : "#ffffff", fontSize: "14px" }}>&#10003;</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#999999" }}>Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
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

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#999999" }}>Quantity</h3>
            <div className="flex items-center h-10 w-32" style={{ border: "1px solid #e5e5e5" }}>
              <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={quantity <= 1 || isOutOfStock} className="w-10 h-full flex items-center justify-center hover:bg-[#f7f7f7] transition-colors disabled:opacity-20" style={{ color: "#333333" }}>
                <Minus className="h-3 w-3" />
              </button>
              <div className="flex-1 flex items-center justify-center font-semibold text-sm" style={{ color: "#333333" }}>
                {quantity}
              </div>
              <button onClick={() => setQuantity(prev => Math.min(selectedColorStock, prev + 1))} disabled={quantity >= selectedColorStock || isOutOfStock} className="w-10 h-full flex items-center justify-center hover:bg-[#f7f7f7] transition-colors disabled:opacity-20" style={{ color: "#333333" }}>
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Add to Cart + Buy Now */}
          {isAdding ? (
            <Link href={`/store/${store.slug}/cart`} className="w-full h-12 flex items-center justify-center text-sm font-semibold uppercase tracking-wider transition-colors" style={{ backgroundColor: "#16a34a", color: "#ffffff" }}>
              &#10003; View Cart &#8594;
            </Link>
          ) : (
            <div className="flex gap-4 mb-6">
              <button onClick={handleAddToCart} disabled={isOutOfStock}
                className="flex-1 h-12 text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  border: isOutOfStock ? "1px solid #e5e5e5" : `1px solid ${accent}`,
                  backgroundColor: isOutOfStock ? "#f5f5f5" : "transparent",
                  color: isOutOfStock ? "#999999" : "#333333"
                }}
                onMouseEnter={(e) => { if (!isOutOfStock) { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#ffffff"; } }}
                onMouseLeave={(e) => { if (!isOutOfStock) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#333333"; } }}
              >
                <ShoppingBag className="h-4 w-4" /> {isOutOfStock ? "Sold Out" : "Add to cart"}
              </button>
              <button onClick={handleBuyNow} disabled={isOutOfStock}
                className="flex-1 h-12 text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  border: isOutOfStock ? "1px solid #e5e5e5" : `1px solid ${accent}`,
                  backgroundColor: isOutOfStock ? "#e5e5e5" : accent,
                  color: "#ffffff"
                }}
                onMouseEnter={(e) => { if (!isOutOfStock) { e.currentTarget.style.backgroundColor = "#ef3444"; } }}
                onMouseLeave={(e) => { if (!isOutOfStock) { e.currentTarget.style.backgroundColor = accent; } }}
              >
                Buy Now
              </button>
            </div>
          )}

          {/* Compare / Wishlist / Size Guide */}
          <div className="flex flex-wrap gap-6 mb-6 text-xs uppercase tracking-wider" style={{ color: "#999999" }}>
            <span className="hover:opacity-60 transition-opacity cursor-pointer">Add to Compare</span>
            <button
              onClick={() => wishlisted ? removeWishlist(product.id) : addWishlist({ productId: product.id, storeId: product.storeId, name: product.name, price: product.price, image: product.images[0] || '', slug: store.slug })}
              className="hover:opacity-60 transition-opacity cursor-pointer"
              style={{ color: wishlisted ? accent : "#999999" }}
            >
              <Heart className={`w-3 h-3 inline mr-1 ${wishlisted ? 'fill-current' : ''}`} />
              {wishlisted ? "My wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* SKU / Brand */}
          <div className="mb-6 text-xs" style={{ color: "#666666" }}>
            <p>SKU: {product.id?.slice(-6) || "N/A"}</p>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-2 mb-10 text-xs uppercase tracking-wider" style={{ color: "#999999" }}>
            <span className="mr-2">Share:</span>
            <a href="#" className="hover:opacity-60 transition-opacity" onClick={(e) => { e.preventDefault(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank'); }}>Facebook</a>
            <span>/</span>
            <a href="#" className="hover:opacity-60 transition-opacity" onClick={(e) => { e.preventDefault(); window.open(`https://twitter.com/share?url=${window.location.href}`, '_blank'); }}>Twitter</a>
            <span>/</span>
            <a href="#" className="hover:opacity-60 transition-opacity" onClick={(e) => { e.preventDefault(); window.open(`https://pinterest.com/pin/create/button/?url=${window.location.href}`, '_blank'); }}>Pinterest</a>
            <span>/</span>
            <a href="#" className="hover:opacity-60 transition-opacity" onClick={(e) => { e.preventDefault(); window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`, '_blank'); }}>Linkedin</a>
          </div>

          {/* Tabs: Description / Product Details / Reviews */}
          <div className="mt-4">
            <div className="flex border-b text-xs uppercase tracking-wider" style={{ borderColor: "#e5e5e5" }}>
              {["description", "details", "reviews"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="py-3 px-6 font-semibold transition-colors duration-300"
                  style={{
                    borderBottom: activeTab === tab ? `2px solid ${accent}` : "2px solid transparent",
                    color: activeTab === tab ? "#333333" : "#999999"
                  }}
                >
                  {tab === "description" ? "Description" : tab === "details" ? "Product Details" : `Reviews (0)`}
                </button>
              ))}
            </div>
            <div className="py-8">
              {activeTab === "description" && (
                <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{product.description || "No description available."}</p>
              )}
              {activeTab === "details" && (
                <div className="text-sm leading-relaxed" style={{ color: "#666666" }}>
                  <p className="mb-2"><strong style={{ color: "#333333" }}>SKU:</strong> {product.id?.slice(-6) || "N/A"}</p>
                  <p className="mb-2"><strong style={{ color: "#333333" }}>Stock:</strong> {product.stock_quantity || 0} Items</p>
                  {product.sizes.length > 0 && (
                    <p className="mb-2"><strong style={{ color: "#333333" }}>Sizes:</strong> {product.sizes.join(", ")}</p>
                  )}
                  {productColors.length > 0 && (
                    <p><strong style={{ color: "#333333" }}>Colors:</strong> {productColors.map((c: any) => c.name).join(", ")}</p>
                  )}
                </div>
              )}
              {activeTab === "reviews" && (
                <ProductReviews productId={product.id} storeSlug={store.slug} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10" style={{ borderTop: "1px solid #e5e5e5" }}>
          <h3 className="text-lg font-semibold mb-8" style={{ color: "#333333" }}>Related Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((related: any) => (
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
  );
}
