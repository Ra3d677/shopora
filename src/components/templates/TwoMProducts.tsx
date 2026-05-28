"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Grid, List, Star, ChevronRight, Heart, ShoppingCart, Eye, 
  GitCompare, SlidersHorizontal, Plus, Minus, ArrowUpDown 
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useLanguageStore } from "@/store/language";
import SmartImage from "@/components/ui/SmartImage";

interface TwoMProductsProps {
  slug: string;
  store: any;
  products: any[];
  category?: string;
  pageTitle: string;
  pageDescription: string;
}

export default function TwoMProducts({
  slug,
  store,
  products,
  category: activeCategoryId,
  pageTitle,
  pageDescription
}: TwoMProductsProps) {
  const { t } = useLanguageStore();
  const primary = "#fed700";
  const hoverAccent = "#e1205e";

  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [activePriceRange, setActivePriceRange] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("default");

  // Cart & Wishlist hooks
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
        quantity: quantity,
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
      if (isWishlisted(pid)) {
        removeWishlist(pid);
      } else {
        addWishlist({ 
          productId: pid, 
          storeId: slug, 
          name: product.name, 
          price: product.price, 
          image: img, 
          slug: `/store/${slug}/product/${product.id}` 
        });
      }
    } catch (err) { console.error("wishlist error:", err); }
  };

  // Price range quick-options filter logic
  const priceFilteredProducts = useMemo(() => {
    return products.filter((product) => {
      const finalPrice = product.discount_price || product.price;

      // Min/Max input logic takes precedence if provided
      if (minPrice !== "" && finalPrice < parseFloat(minPrice)) return false;
      if (maxPrice !== "" && finalPrice > parseFloat(maxPrice)) return false;

      // If inputs are empty, apply quick-range select
      if (minPrice === "" && maxPrice === "") {
        if (activePriceRange === "under50") return finalPrice < 50;
        if (activePriceRange === "50to100") return finalPrice >= 50 && finalPrice <= 100;
        if (activePriceRange === "100to200") return finalPrice >= 100 && finalPrice <= 200;
        if (activePriceRange === "above200") return finalPrice > 200;
      }

      return true;
    });
  }, [products, minPrice, maxPrice, activePriceRange]);

  // Sort logic applied client-side on filtered items
  const sortedProducts = useMemo(() => {
    const items = [...priceFilteredProducts];
    if (selectedSort === "price_asc") {
      items.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (selectedSort === "price_desc") {
      items.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (selectedSort === "newest") {
      items.reverse();
    }
    return items;
  }, [priceFilteredProducts, selectedSort]);

  // Subcategories recursive extraction
  const getSubcategories = (catId: string) => {
    return store.categories.filter((c: any) => c.parentId === catId);
  };

  const mainCategories = useMemo(() => {
    return store.categories.filter((c: any) => !c.parentId);
  }, [store.categories]);

  // Sidebar featured products
  const sidebarFeatured = useMemo(() => {
    return products.slice(0, 3);
  }, [products]);

  return (
    <div className="min-h-screen bg-white pb-24 font-['Lato',sans-serif]" style={{ color: "#333333" }}>
      
      {/* Banner / Header */}
      <div className="bg-[#fcf2f4] py-16 px-6 mb-12 border-b border-[#f5f5f5]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-4">
            <Link href={`/store/${slug}`} className="hover:text-[#e1205e] transition-colors">{t('homeBreadcrumb')}</Link>
            <ChevronRight size={10} />
            <span className="text-[#333333]">{pageTitle}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-tight" style={{ fontFamily: "Lato,sans-serif" }}>
            {pageTitle}
          </h1>
          <p className="text-[#666666] text-sm max-w-2xl leading-relaxed italic">{pageDescription}</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[40px]">
          
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-1 flex flex-col gap-10">
            
            {/* Categories Widget */}
            <div className="border border-[#ebebeb] p-6 rounded-sm bg-white">
              <h3 className="text-sm font-black uppercase tracking-wider mb-5 pb-3 border-b border-[#ebebeb] flex items-center justify-between">
                <span>Categories</span>
                <SlidersHorizontal size={14} className="text-[#999999]" />
              </h3>
              <ul className="space-y-3.5">
                <li>
                  <Link 
                    href={`/store/${slug}/products`}
                    className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all hover:text-[#e1205e] ${!activeCategoryId ? 'text-[#e1205e] pl-1' : 'text-[#666666]'}`}
                  >
                    <span>All Products</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{products.length}</span>
                  </Link>
                </li>
                {mainCategories.map((cat: any) => {
                  const subCats = getSubcategories(cat.id);
                  const isCatActive = activeCategoryId === cat.id || subCats.some((s: any) => s.id === activeCategoryId);
                  return (
                    <li key={cat.id} className="group">
                      <div className="flex items-center justify-between">
                        <Link 
                          href={`/store/${slug}/products?category=${cat.id}`}
                          className={`text-xs font-bold uppercase tracking-wider transition-all hover:text-[#e1205e] ${activeCategoryId === cat.id ? 'text-[#e1205e] pl-1' : 'text-[#666666]'}`}
                        >
                          {cat.name}
                        </Link>
                      </div>
                      {subCats.length > 0 && isCatActive && (
                        <ul className="mt-2.5 ml-4 pl-3.5 border-l-2 border-[#ebebeb] space-y-2">
                          {subCats.map((sub: any) => (
                            <li key={sub.id}>
                              <Link 
                                href={`/store/${slug}/products?category=${sub.id}`}
                                className={`text-[11px] font-semibold uppercase tracking-wider block transition-colors hover:text-[#e1205e] ${activeCategoryId === sub.id ? 'text-[#e1205e]' : 'text-[#999999]'}`}
                              >
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

            {/* Price Filter Widget */}
            <div className="border border-[#ebebeb] p-6 rounded-sm bg-white">
              <h3 className="text-sm font-black uppercase tracking-wider mb-5 pb-3 border-b border-[#ebebeb]">
                Filter By Price
              </h3>
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Min Price</span>
                  <input 
                    type="number" 
                    placeholder="$ Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setActivePriceRange("custom");
                    }}
                    className="w-full text-xs font-bold border border-[#ebebeb] outline-none px-3 py-2 rounded-sm focus:border-[#fed700]"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Max Price</span>
                  <input 
                    type="number" 
                    placeholder="$ Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setActivePriceRange("custom");
                    }}
                    className="w-full text-xs font-bold border border-[#ebebeb] outline-none px-3 py-2 rounded-sm focus:border-[#fed700]"
                  />
                </div>
              </div>

              {/* Clear price button */}
              {(minPrice !== "" || maxPrice !== "" || activePriceRange !== "all") && (
                <button
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setActivePriceRange("all");
                  }}
                  className="w-full py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 hover:bg-[#fed700] hover:text-[#333333] transition-colors mb-4 rounded-sm"
                >
                  Clear Price Filters
                </button>
              )}

              {/* Price Ranges Options */}
              <div className="flex flex-col gap-2">
                {[
                  { key: "all", label: "All Prices" },
                  { key: "under50", label: "Under $50" },
                  { key: "50to100", label: "$50 to $100" },
                  { key: "100to200", label: "$100 to $200" },
                  { key: "above200", label: "$200 & Above" }
                ].map((range) => (
                  <button
                    key={range.key}
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      setActivePriceRange(range.key);
                    }}
                    className={`text-left text-xs font-semibold py-1 transition-all ${
                      activePriceRange === range.key && minPrice === "" && maxPrice === ""
                        ? 'text-[#e1205e] font-bold pl-1.5 border-l-2 border-[#e1205e]' 
                        : 'text-[#666666] hover:text-[#e1205e]'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Best Sellers Widget */}
            {sidebarFeatured.length > 0 && (
              <div className="border border-[#ebebeb] p-6 rounded-sm bg-white hidden lg:block">
                <h3 className="text-sm font-black uppercase tracking-wider mb-5 pb-3 border-b border-[#ebebeb]">
                  Best Sellers
                </h3>
                <div className="flex flex-col gap-4">
                  {sidebarFeatured.map((p) => {
                    const imgSrc = Array.isArray(p.images) ? p.images[0] : (p.images || "");
                    return (
                      <Link 
                        href={`/store/${slug}/product/${p.id}`} 
                        key={p.id}
                        className="flex gap-3.5 group items-center"
                      >
                        <div className="w-16 h-16 bg-[#fafafa] border border-[#ebebeb] shrink-0 overflow-hidden">
                          <img 
                            src={imgSrc} 
                            alt={p.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="text-xs font-bold truncate group-hover:text-[#e1205e] transition-colors leading-tight mb-1">
                            {p.name}
                          </h4>
                          <div className="flex gap-0.5 mb-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={10} fill="#fed700" style={{ color: "#fed700" }} />
                            ))}
                          </div>
                          <p className="text-xs font-black text-slate-800">
                            ${(p.discount_price || p.price).toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* MAIN PRODUCT LIST AREA */}
          <main className="lg:col-span-3">
            
            {/* TOOLBAR */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border border-[#ebebeb] p-4 rounded-sm bg-white mb-8">
              
              {/* Product count */}
              <p className="text-xs text-[#666666] font-medium">
                Showing <span className="font-bold text-[#333333]">{sortedProducts.length}</span> of <span className="font-bold text-[#333333]">{products.length}</span> products
              </p>

              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                
                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <ArrowUpDown size={12} /> Sort By
                  </span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="text-xs font-bold border border-[#ebebeb] outline-none bg-white py-1.5 px-3 rounded-sm cursor-pointer focus:border-[#fed700]"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Items</option>
                  </select>
                </div>

                {/* Grid / List Toggles */}
                <div className="flex items-center gap-1 border-l border-[#ebebeb] pl-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className="w-9 h-9 border flex items-center justify-center transition-all cursor-pointer rounded-sm"
                    style={{
                      backgroundColor: viewMode === "grid" ? primary : "transparent",
                      borderColor: viewMode === "grid" ? primary : "#ebebeb",
                      color: "#333333"
                    }}
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className="w-9 h-9 border flex items-center justify-center transition-all cursor-pointer rounded-sm"
                    style={{
                      backgroundColor: viewMode === "list" ? primary : "transparent",
                      borderColor: viewMode === "list" ? primary : "#ebebeb",
                      color: "#333333"
                    }}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 border border-[#ebebeb] bg-slate-50 rounded-sm">
                <SlidersHorizontal size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-1">No products found</h3>
                <p className="text-xs text-[#666666] mb-5">Try relaxing your price filters or choose another category.</p>
                <button
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setActivePriceRange("all");
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold uppercase tracking-wider text-xs hover:bg-[#fed700] hover:text-[#333333] transition-colors rounded-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]" 
                : "flex flex-col gap-[20px]"
              }>
                {sortedProducts.map((product) => (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    slug={slug}
                    viewMode={viewMode}
                    primary={primary}
                    hoverAccent={hoverAccent}
                    isWishlisted={isWishlisted(String(product.id))}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Sub-component for product item to manage local state (e.g. Quantity picker)
function ProductListItem({
  product,
  slug,
  viewMode,
  primary,
  hoverAccent,
  isWishlisted,
  onAddToCart,
  onToggleWishlist
}: {
  product: any;
  slug: string;
  viewMode: "grid" | "list";
  primary: string;
  hoverAccent: string;
  isWishlisted: boolean;
  onAddToCart: (product: any, e?: React.MouseEvent, quantity?: number) => void;
  onToggleWishlist: (product: any, e?: React.MouseEvent) => void;
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const imgSrc = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const isSale = product.discount_price !== null;

  if (viewMode === "grid") {
    return (
      <div className="group border border-[#ebebeb] bg-white transition-shadow hover:shadow-lg rounded-sm p-4 relative flex flex-col justify-between">
        <div>
          {/* Image Container */}
          <div className="relative overflow-hidden bg-[#fafafa] mb-4.5 aspect-square border-b border-[#ebebeb] -mx-4 -mt-4">
            <Link href={`/store/${slug}/product/${product.id}`}>
              <SmartImage 
                src={imgSrc} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            {isSale && (
              <span className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-sm" style={{ backgroundColor: hoverAccent }}>
                Sale
              </span>
            )}
            
            {/* Quick action floating buttons on hover */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <button 
                onClick={(e) => onToggleWishlist(product, e)}
                className={`w-9 h-9 flex items-center justify-center border shadow-md transition-colors cursor-pointer rounded-full`}
                style={{
                  backgroundColor: isWishlisted ? primary : "#ffffff",
                  borderColor: isWishlisted ? primary : "#ebebeb",
                  color: "#333333"
                }}
              >
                <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
              </button>
              <Link 
                href={`/store/${slug}/product/${product.id}`}
                className="w-9 h-9 flex items-center justify-center border shadow-md bg-white border-[#ebebeb] hover:bg-[#fed700] hover:border-[#fed700] transition-colors cursor-pointer rounded-full"
              >
                <Eye size={14} style={{ color: "#333333" }} />
              </Link>
            </div>
          </div>

          {/* Details */}
          <div className="px-1 flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
              {product.category || "General"}
            </span>
            <Link href={`/store/${slug}/product/${product.id}`} className="hover:text-[#e1205e] transition-colors">
              <h3 className="text-xs font-bold leading-tight line-clamp-1 mb-1.5" style={{ fontFamily: "Lato,sans-serif" }}>
                {product.name}
              </h3>
            </Link>
            
            {/* Rating */}
            <div className="flex gap-0.5 mb-2.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={11} fill="#fed700" style={{ color: "#fed700" }} />
              ))}
            </div>
            
            {/* Prices */}
            <div className="flex items-center gap-2 mb-4">
              {isSale ? (
                <>
                  <span className="text-sm font-black" style={{ color: "#333333" }}>${product.discount_price.toFixed(2)}</span>
                  <span className="text-[11px] text-slate-400 line-through font-semibold">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-sm font-black" style={{ color: "#333333" }}>${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action controls row */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-[#ebebeb] mt-auto">
          <div className="flex items-center border border-[#ebebeb] rounded-sm bg-slate-50 shrink-0">
            <button 
              onClick={handleDecrement}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-[#fed700] hover:text-[#333333] transition-colors rounded-l-sm"
            >
              <Minus size={10} />
            </button>
            <span className="w-7 text-center text-xs font-bold" style={{ color: "#333333" }}>
              {quantity}
            </span>
            <button 
              onClick={handleIncrement}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-[#fed700] hover:text-[#333333] transition-colors rounded-r-sm"
            >
              <Plus size={10} />
            </button>
          </div>
          <button 
            onClick={(e) => onAddToCart(product, e, quantity)}
            className="flex-1 h-7 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 rounded-sm shadow-sm"
            style={{ backgroundColor: primary, color: "#333333" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
          >
            <ShoppingCart size={11} /> Add to cart
          </button>
        </div>
      </div>
    );
  }

  // LIST ROW VIEW
  return (
    <div className="group border border-[#ebebeb] bg-white transition-shadow hover:shadow-lg rounded-sm p-5 flex flex-col md:flex-row gap-6 relative">
      
      {/* Product Image */}
      <div className="w-full md:w-48 aspect-square bg-[#fafafa] shrink-0 border border-[#ebebeb] overflow-hidden rounded-sm relative">
        <Link href={`/store/${slug}/product/${product.id}`} className="block w-full h-full">
          <SmartImage 
            src={imgSrc} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {isSale && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 text-[9px] font-black uppercase text-white" style={{ backgroundColor: hoverAccent }}>
            Sale
          </span>
        )}
      </div>

      {/* Product Details Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {product.category || "General"}
            </span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={11} fill="#fed700" style={{ color: "#fed700" }} />
              ))}
            </div>
          </div>
          
          <Link href={`/store/${slug}/product/${product.id}`} className="hover:text-[#e1205e] transition-colors inline-block mb-2">
            <h3 className="text-lg font-bold leading-tight" style={{ fontFamily: "Lato,sans-serif" }}>
              {product.name}
            </h3>
          </Link>
          
          {/* Description */}
          <p className="text-xs text-[#666666] leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
            {product.description || "No description available for this product."}
          </p>
        </div>

        {/* Actions & Price Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto pt-4 border-t border-dashed border-[#ebebeb]">
          
          {/* Prices */}
          <div className="flex items-baseline gap-2">
            {isSale ? (
              <>
                <span className="text-xl font-black" style={{ color: "#333333" }}>${product.discount_price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through font-semibold">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-black" style={{ color: "#333333" }}>${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Quantity Picker */}
            <div className="flex items-center border border-[#ebebeb] rounded-sm bg-slate-50">
              <button 
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-[#fed700] hover:text-[#333333] transition-colors rounded-l-sm"
              >
                <Minus size={11} />
              </button>
              <span className="w-8 text-center text-xs font-bold" style={{ color: "#333333" }}>
                {quantity}
              </span>
              <button 
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-[#fed700] hover:text-[#333333] transition-colors rounded-r-sm"
              >
                <Plus size={11} />
              </button>
            </div>

            {/* Wishlist Button */}
            <button 
              onClick={(e) => onToggleWishlist(product, e)}
              className="w-8 h-8 flex items-center justify-center border transition-colors cursor-pointer rounded-sm"
              style={{
                backgroundColor: isWishlisted ? primary : "#ffffff",
                borderColor: isWishlisted ? primary : "#ebebeb",
                color: "#333333"
              }}
            >
              <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
            </button>

            {/* Add to Cart Button */}
            <button 
              onClick={(e) => onAddToCart(product, e, quantity)}
              className="px-5 h-8 text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 rounded-sm shadow-sm"
              style={{ backgroundColor: primary, color: "#333333" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#333333"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = primary; e.currentTarget.style.color = "#333333"; }}
            >
              <ShoppingCart size={12} /> Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
