"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Grid, List, Star, ChevronRight, Heart, ShoppingCart, Eye, SlidersHorizontal, Plus, Minus, ArrowUpDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import SmartImage from "@/components/ui/SmartImage";

interface ThreeMProductsProps {
  slug: string;
  store: any;
  products: any[];
  category?: string;
  pageTitle: string;
  pageDescription: string;
}

export default function ThreeMProducts({ slug, store, products, category: activeCategoryId, pageTitle, pageDescription }: ThreeMProductsProps) {
  const accent = "#ff7245";
  const bgLight = "#eff6f6";
  const { t } = { t: (s: string) => s };

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [activePriceRange, setActivePriceRange] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("default");

  const cartAddItem = useCartStore((s) => s.addItem);
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlistStore();

  const handleAddToCart = (product: any, e?: React.MouseEvent, quantity = 1) => {
    e?.stopPropagation();
    try {
      const img = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
      cartAddItem({
        id: `${slug}-${product.id}-One Size-`,
        storeId: slug,
        product: { ...product, images: product.images || img },
        quantity,
        selectedSize: "One Size",
        selectedColor: "",
        selectedImage: img,
      });
    } catch (err) { console.error("cartAddItem error:", err); }
  };

  const handleToggleWishlist = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const pid = String(product.id);
      const img = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
      if (isWishlisted(pid)) removeWishlist(pid);
      else addWishlist({ productId: pid, storeId: slug, name: product.name, price: product.price, image: img, slug: `/store/${slug}/product/${product.id}` });
    } catch (err) { console.error("wishlist error:", err); }
  };

  const priceFilteredProducts = useMemo(() => products.filter((product) => {
    const fp = product.discount_price || product.price;
    if (minPrice !== "" && fp < parseFloat(minPrice)) return false;
    if (maxPrice !== "" && fp > parseFloat(maxPrice)) return false;
    if (minPrice === "" && maxPrice === "") {
      if (activePriceRange === "under50") return fp < 50;
      if (activePriceRange === "50to100") return fp >= 50 && fp <= 100;
      if (activePriceRange === "100to200") return fp >= 100 && fp <= 200;
      if (activePriceRange === "above200") return fp > 200;
    }
    return true;
  }), [products, minPrice, maxPrice, activePriceRange]);

  const sortedProducts = useMemo(() => {
    const items = [...priceFilteredProducts];
    if (selectedSort === "price_asc") items.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    else if (selectedSort === "price_desc") items.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    else if (selectedSort === "newest") items.reverse();
    return items;
  }, [priceFilteredProducts, selectedSort]);

  const getSubcategories = (catId: string) => store.categories.filter((c: any) => c.parentId === catId);
  const mainCategories = useMemo(() => store.categories.filter((c: any) => !c.parentId), [store.categories]);
  const sidebarFeatured = useMemo(() => products.slice(0, 3), [products]);

  return (
    <div className="min-h-screen bg-white pb-24" style={{ fontFamily: "Poppins,sans-serif", color: "#333333" }}>
      {/* Banner */}
      <div style={{ backgroundColor: bgLight, padding: "60px 20px", marginBottom: "40px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#999999" }}>
            <Link href={`/store/${slug}`} className="hover:opacity-60 transition-opacity" style={{ color: "#999999" }}>Home</Link>
            <ChevronRight size={10} />
            <span style={{ color: "#333333" }}>{pageTitle}</span>
          </div>
          <h1 className="text-4xl font-medium mb-2 tracking-tight" style={{ fontFamily: "Poppins,sans-serif" }}>{pageTitle}</h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "#666666" }}>{pageDescription}</p>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "40px" }}>
          {/* SIDEBAR */}
          <aside className="flex flex-col gap-8">
            {/* Categories */}
            <div className="border border-gray-200 p-6 bg-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 pb-3 border-b border-gray-200 flex items-center justify-between">
                <span>Categories</span>
                <SlidersHorizontal size={14} style={{ color: "#999999" }} />
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href={`/store/${slug}/products`} className={`text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-all hover:opacity-60 ${!activeCategoryId ? 'font-bold' : ''}`} style={{ color: !activeCategoryId ? accent : "#666666" }}>
                    <span>All Products</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: bgLight, color: "#999999" }}>{products.length}</span>
                  </Link>
                </li>
                {mainCategories.map((cat: any) => {
                  const subCats = getSubcategories(cat.id);
                  const isActive = activeCategoryId === cat.id || subCats.some((s: any) => s.id === activeCategoryId);
                  return (
                    <li key={cat.id}>
                      <Link href={`/store/${slug}/products?category=${cat.id}`} className={`text-xs font-medium uppercase tracking-wider transition-all hover:opacity-60 ${activeCategoryId === cat.id ? 'font-bold' : ''}`} style={{ color: activeCategoryId === cat.id ? accent : "#666666" }}>
                        {cat.name}
                      </Link>
                      {subCats.length > 0 && isActive && (
                        <ul className="mt-2 ml-4 space-y-1.5">
                          {subCats.map((sub: any) => (
                            <li key={sub.id}>
                              <Link href={`/store/${slug}/products?category=${sub.id}`} className="text-[11px] font-medium uppercase tracking-wider block transition-colors hover:opacity-60" style={{ color: activeCategoryId === sub.id ? accent : "#999999" }}>
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="border border-gray-200 p-6 bg-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 pb-3 border-b border-gray-200">Filter By Price</h3>
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "#999999" }}>Min</span>
                  <input type="number" placeholder="$ Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setActivePriceRange("custom"); }} className="w-full text-xs font-medium border border-gray-200 outline-none px-3 py-2 focus:border-black" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "#999999" }}>Max</span>
                  <input type="number" placeholder="$ Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setActivePriceRange("custom"); }} className="w-full text-xs font-medium border border-gray-200 outline-none px-3 py-2 focus:border-black" />
                </div>
              </div>
              {(minPrice !== "" || maxPrice !== "" || activePriceRange !== "all") && (
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); setActivePriceRange("all"); }} className="w-full py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors mb-4" style={{ color: "#666666", backgroundColor: bgLight }}>
                  Clear Filters
                </button>
              )}
              <div className="flex flex-col gap-2">
                {[
                  { key: "all", label: "All Prices" },
                  { key: "under50", label: "Under $50" },
                  { key: "50to100", label: "$50 to $100" },
                  { key: "100to200", label: "$100 to $200" },
                  { key: "above200", label: "$200 & Above" }
                ].map((range) => (
                  <button key={range.key} onClick={() => { setMinPrice(""); setMaxPrice(""); setActivePriceRange(range.key); }} className="text-left text-xs font-medium py-1 transition-all" style={{ color: activePriceRange === range.key && minPrice === "" && maxPrice === "" ? accent : "#666666" }}>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Best Sellers */}
            {sidebarFeatured.length > 0 && (
              <div className="border border-gray-200 p-6 bg-white">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 pb-3 border-b border-gray-200">Best Sellers</h3>
                <div className="flex flex-col gap-4">
                  {sidebarFeatured.map((p: any) => {
                    const imgSrc = Array.isArray(p.images) ? p.images[0] : (p.images || "");
                    return (
                      <Link href={`/store/${slug}/product/${p.id}`} key={p.id} className="flex gap-3 group items-center">
                        <div className="w-16 h-16 shrink-0 overflow-hidden" style={{ backgroundColor: bgLight }}>
                          <img src={imgSrc} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="text-xs font-medium truncate leading-tight mb-1">{p.name}</h4>
                          <div className="flex gap-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={10} fill="#ff7245" style={{ color: "#ff7245" }} />))}
                          </div>
                          <p className="text-xs font-bold">${(p.discount_price || p.price).toFixed(2)}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* MAIN PRODUCT AREA */}
          <main>
            {/* Toolbar */}
            <div className="flex justify-between items-center gap-4 border border-gray-200 p-4 bg-white mb-8">
              <p className="text-xs font-medium" style={{ color: "#666666" }}>
                Showing <span className="font-bold" style={{ color: "#333333" }}>{sortedProducts.length}</span> of <span className="font-bold" style={{ color: "#333333" }}>{products.length}</span> products
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1" style={{ color: "#999999" }}>
                    <ArrowUpDown size={12} /> Sort
                  </span>
                  <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} className="text-xs font-medium border border-gray-200 outline-none bg-white py-1.5 px-3 cursor-pointer focus:border-black">
                    <option value="default">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                  <button onClick={() => setViewMode("grid")} className="w-9 h-9 border flex items-center justify-center transition-all cursor-pointer" style={{ backgroundColor: viewMode === "grid" ? "#000000" : "transparent", borderColor: viewMode === "grid" ? "#000000" : "#ebebeb", color: viewMode === "grid" ? "#ffffff" : "#333333" }}>
                    <Grid size={15} />
                  </button>
                  <button onClick={() => setViewMode("list")} className="w-9 h-9 border flex items-center justify-center transition-all cursor-pointer" style={{ backgroundColor: viewMode === "list" ? "#000000" : "transparent", borderColor: viewMode === "list" ? "#000000" : "#ebebeb", color: viewMode === "list" ? "#ffffff" : "#333333" }}>
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 border border-gray-200" style={{ backgroundColor: bgLight }}>
                <SlidersHorizontal size={40} className="mx-auto mb-4" style={{ color: "#cccccc" }} />
                <h3 className="text-xl font-medium mb-1">No products found</h3>
                <p className="text-xs mb-5" style={{ color: "#666666" }}>Try adjusting your filters.</p>
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); setActivePriceRange("all"); }} className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors" style={{ backgroundColor: "#000000" }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={viewMode === "grid"
                ? { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }
                : { display: "flex", flexDirection: "column", gap: "20px" }
              }>
                {sortedProducts.map((product) => (
                  <ProductItem key={product.id} product={product} slug={slug} viewMode={viewMode} accent={accent} isWishlisted={isWishlisted(String(product.id))} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProductItem({ product, slug, viewMode, accent, isWishlisted, onAddToCart, onToggleWishlist }: {
  product: any; slug: string; viewMode: "grid" | "list"; accent: string;
  isWishlisted: boolean; onAddToCart: (p: any, e?: React.MouseEvent, q?: number) => void; onToggleWishlist: (p: any, e?: React.MouseEvent) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const imgSrc = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
  const isSale = product.discount_price != null;

  if (viewMode === "grid") {
    return (
      <div className="group border border-gray-200 bg-white transition-shadow hover:shadow-lg p-4 relative flex flex-col justify-between text-center">
        <div>
          <div className="relative overflow-hidden mb-4 -mx-4 -mt-4" style={{ backgroundColor: "#fafafa", aspectRatio: "1/1" }}>
            <Link href={`/store/${slug}/product/${product.id}`}>
              <SmartImage src={imgSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </Link>
            {isSale && <span className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[9px] font-bold uppercase text-white" style={{ backgroundColor: accent }}>Sale</span>}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <button onClick={(e) => onToggleWishlist(product, e)} className="w-9 h-9 flex items-center justify-center border shadow-md transition-colors cursor-pointer rounded-full bg-white" style={{ borderColor: "#ebebeb" }}>
                <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
              </button>
              <Link href={`/store/${slug}/product/${product.id}`} className="w-9 h-9 flex items-center justify-center border shadow-md bg-white border-gray-200 transition-colors rounded-full">
                <Eye size={14} />
              </Link>
            </div>
          </div>
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#aaaaaa" }}>{product.category || "General"}</p>
          <Link href={`/store/${slug}/product/${product.id}`} className="hover:opacity-60 transition-opacity">
            <h3 className="text-xs font-medium leading-tight mb-1.5" style={{ fontFamily: "Poppins,sans-serif" }}>{product.name}</h3>
          </Link>
          <div className="flex justify-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={11} fill="#ff7245" style={{ color: "#ff7245" }} />))}
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            {isSale ? (
              <><span className="text-sm font-bold">${product.discount_price.toFixed(2)}</span><span className="text-[11px] line-through font-medium" style={{ color: "#999999" }}>${product.price.toFixed(2)}</span></>
            ) : (
              <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-3 border-t border-gray-200">
          <div className="flex items-center border border-gray-200 bg-gray-50 shrink-0">
            <button onClick={(e) => { e.stopPropagation(); setQuantity((q) => Math.max(1, q - 1)); }} className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-black hover:text-white transition-colors cursor-pointer"><Minus size={10} /></button>
            <span className="w-7 text-center text-xs font-bold">{quantity}</span>
            <button onClick={(e) => { e.stopPropagation(); setQuantity((q) => q + 1); }} className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-black hover:text-white transition-colors cursor-pointer"><Plus size={10} /></button>
          </div>
          <button onClick={(e) => onAddToCart(product, e, quantity)} className="flex-1 h-7 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 rounded-full" style={{ backgroundColor: "#000000", color: "#ffffff" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}
          ><ShoppingCart size={11} /> Add</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group border border-gray-200 bg-white transition-shadow hover:shadow-lg p-5 flex gap-6 relative">
      <div className="w-48 aspect-square shrink-0 overflow-hidden relative" style={{ backgroundColor: "#fafafa" }}>
        <Link href={`/store/${slug}/product/${product.id}`} className="block w-full h-full">
          <SmartImage src={imgSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        {isSale && <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 text-[9px] font-bold uppercase text-white" style={{ backgroundColor: accent }}>Sale</span>}
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#999999" }}>{product.category || "General"}</span>
            <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={11} fill="#ff7245" style={{ color: "#ff7245" }} />))}</div>
          </div>
          <Link href={`/store/${slug}/product/${product.id}`} className="hover:opacity-60 transition-opacity inline-block mb-2">
            <h3 className="text-lg font-medium leading-tight" style={{ fontFamily: "Poppins,sans-serif" }}>{product.name}</h3>
          </Link>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "#666666" }}>{product.description || "No description available."}</p>
        </div>
        <div className="flex justify-between items-center gap-4 mt-auto pt-4 border-t border-dashed border-gray-200">
          <div className="flex items-baseline gap-2">
            {isSale ? (
              <><span className="text-xl font-bold">${product.discount_price.toFixed(2)}</span><span className="text-xs line-through font-medium" style={{ color: "#999999" }}>${product.price.toFixed(2)}</span></>
            ) : (<span className="text-xl font-bold">${product.price.toFixed(2)}</span>)}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 bg-gray-50">
              <button onClick={(e) => { e.stopPropagation(); setQuantity((q) => Math.max(1, q - 1)); }} className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-black hover:text-white transition-colors cursor-pointer"><Minus size={11} /></button>
              <span className="w-8 text-center text-xs font-bold">{quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); setQuantity((q) => q + 1); }} className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-black hover:text-white transition-colors cursor-pointer"><Plus size={11} /></button>
            </div>
            <button onClick={(e) => onToggleWishlist(product, e)} className="w-8 h-8 flex items-center justify-center border transition-colors cursor-pointer" style={{ backgroundColor: isWishlisted ? "#000000" : "#ffffff", borderColor: "#ebebeb", color: isWishlisted ? "#ffffff" : "#333333" }}>
              <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
            </button>
            <button onClick={(e) => onAddToCart(product, e, quantity)} className="px-5 h-8 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 rounded-full" style={{ backgroundColor: "#000000", color: "#ffffff" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#000000"; }}
            ><ShoppingCart size={12} /> Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
