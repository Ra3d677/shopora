"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, ChevronRight, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

interface ThreeMProductsProps {
  slug: string;
  store: any;
  products: any[];
  category?: string;
  pageTitle?: string;
  pageDescription?: string;
}

const accent = "#ff7245";

export default function ThreeMProducts({ slug, store, products, category: activeCategoryId }: ThreeMProductsProps) {
  const { addItem: cartAdd } = useCartStore();
  const { addItem: wishlistAdd, removeItem: wishlistRemove, isWishlisted } = useWishlistStore();

  const [sortBy, setSortBy] = useState("manual");
  const [columns, setColumns] = useState(3);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showVendors, setShowVendors] = useState<Record<string, boolean>>({});
  const [showColors, setShowColors] = useState<Record<string, boolean>>({});

  const mainCategories = useMemo(() => store.categories?.filter((c: any) => !c.parentId) || [], [store.categories]);

  const sortedProducts = useMemo(() => {
    const items = [...products];
    if (sortBy === "price-ascending") items.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    else if (sortBy === "price-descending") items.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    else if (sortBy === "title-ascending") items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else if (sortBy === "title-descending") items.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    else if (sortBy === "created-descending") items.sort((a, b) => { const da = a.createdAt || a.created_at; const db = b.createdAt || b.created_at; if (!da && !db) return 0; if (!da) return 1; if (!db) return -1; return new Date(db).getTime() - new Date(da).getTime(); });
    else if (sortBy === "created-ascending") items.sort((a, b) => { const da = a.createdAt || a.created_at; const db = b.createdAt || b.created_at; if (!da && !db) return 0; if (!da) return 1; if (!db) return -1; return new Date(da).getTime() - new Date(db).getTime(); });
    return items;
  }, [products, sortBy]);

  const priceFiltered = useMemo(() => sortedProducts.filter((p: any) => {
    const fp = p.discount_price || p.price;
    return fp >= priceMin && fp <= priceMax;
  }), [sortedProducts, priceMin, priceMax]);

  const vendorFiltered = useMemo(() => {
    const activeVendors = Object.keys(showVendors).filter((k) => showVendors[k]);
    if (activeVendors.length === 0) return priceFiltered;
    return priceFiltered.filter((p: any) => activeVendors.includes(p.vendor || p.brand || ""));
  }, [priceFiltered, showVendors]);

  const displayProducts = vendorFiltered;

  const vendors = useMemo(() => {
    const v = new Set<string>();
    products.forEach((p: any) => { const name = p.vendor || p.brand; if (name) v.add(name); });
    return Array.from(v).sort();
  }, [products]);

  const colors = ["#b8ad9d", "#000000", "#ffffff", "#c4a47c", "#8b4513", "#4169e1", "#808080", "#ff6347", "#2e8b57", "#ffd700"];

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const img = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
    cartAdd({ id: `${slug}-${product.id}-One Size-`, storeId: slug, product: { ...product, images: product.images || img }, quantity: 1, selectedSize: "One Size", selectedColor: "", selectedImage: img });
  };

  const handleWishlist = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const pid = String(product.id);
    const img = Array.isArray(product?.images) ? product.images[0] : (product?.images || "");
    if (isWishlisted(pid)) wishlistRemove(pid);
    else wishlistAdd({ productId: pid, storeId: slug, name: product.name, price: product.price, image: img, slug: `/store/${slug}/product/${product.id}` });
  };

  const SidebarContent = () => (
    <>
      <div className="collection-sidebar__header">
        <h2 className="collection-sidebar__title">CATEGORIES</h2>
      </div>
      <div className="collection-sidebar__menu">
        <div className="collection-sidebar__item">
          <span className="collection-sidebar__icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="11" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" fill="currentColor"/></svg>
          </span>
          <Link href={`/store/${slug}/products`}>All Products</Link>
        </div>
        {mainCategories.map((cat: any) => (
          <div key={cat.id} className="collection-sidebar__item">
            <span className="collection-sidebar__icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="11" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" fill="currentColor"/></svg>
            </span>
            <Link href={`/store/${slug}/products?category=${cat.id}`}>{cat.name}</Link>
          </div>
        ))}
      </div>

      <div className="fieldset-block__header">
        <h2 className="fieldset-block__title">PRICE</h2>
      </div>
      <div className="fieldset-block__content">
        <div style={{ padding: "0 0.1rem", width: "100%" }}>
          <input type="range" min={0} max={200} step={1} value={priceMax}
            onChange={(e) => { setPriceMax(Number(e.target.value)); setPriceRange([priceMin, Number(e.target.value)]); }}
            style={{ width: "100%", accentColor: "#000" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginTop: "5px" }}>
            <span>${priceMin}.00</span>
            <span>-</span>
            <span>${priceMax}.00</span>
          </div>
        </div>
      </div>

      <div className="fieldset-block__header">
        <h2 className="fieldset-block__title">COLOR</h2>
      </div>
      <div className="fieldset-block__content fieldset-block__content--color">
        {colors.map((c, i) => (
          <label key={i} className="field-checkbox-color">
            <input type="checkbox" className="field-checkbox-color__input" checked={!!showColors[c]} onChange={() => setShowColors((prev) => ({ ...prev, [c]: !prev[c] }))} />
            <div className="field-checkbox-color__item">
              <span className="field-checkbox-color__content" style={{ "--color": c } as React.CSSProperties}></span>
            </div>
          </label>
        ))}
      </div>

      {vendors.length > 0 && (
        <>
          <div className="fieldset-block__header">
            <h2 className="fieldset-block__title">BRAND</h2>
          </div>
          <div className="fieldset-block__content">
            {vendors.map((v) => (
              <label key={v} className="field-checkbox-text">
                <input type="checkbox" className="field-checkbox-text__input" checked={!!showVendors[v]} onChange={() => setShowVendors((prev) => ({ ...prev, [v]: !prev[v] }))} />
                <div className="field-checkbox-text__item">
                  <span className="field-checkbox-text__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" fill="currentColor"/></svg>
                  </span>
                  <span className="field-checkbox-text__content">{v}</span>
                </div>
              </label>
            ))}
          </div>
        </>
      )}

      <div className="collection-sidebar__banner">
        <a href={`/store/${slug}/products`}>
          <img src="https://landing.shopilaunch.com/starter/sidebar_banner.jpg" width="768" height="1024" alt="Banner" />
        </a>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="main-collection">
        <div className="xo-section color-background-1" style={{ padding: "50px 0" }}>
          <div className="xo-container--box" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
            <div className="main-collection-grid">
              {/* Sidebar */}
              <div className="main-collection-style1__sidebar">
                <div className="sidebar-desktop">
                  <SidebarContent />
                </div>
              </div>

              {/* Main content */}
              <div className="main-collection-style1__content">
                {/* Header toolbar */}
                <div className="main-collection-style1__header">
                  <button className="main-collection-mobile__trigger" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
                    <svg version="1.1" viewBox="0 0 320.42 225" width="18">
                      <path d="M303.92,33H16.5C7.39,33,0,25.61,0,16.5v0C0,7.39,7.39,0,16.5,0h287.42c9.11,0,16.5,7.39,16.5,16.5v0C320.42,25.61,313.04,33,303.92,33z" fill="currentColor"/>
                      <path d="M256.55,129H63.87c-9.11,0-16.5-7.39-16.5-16.5v0c0-9.11,7.39-16.5,16.5-16.5h192.68c9.11,0,16.5,7.39,16.5,16.5v0C273.05,121.61,265.66,129,256.55,129z" fill="currentColor"/>
                      <path d="M208.05,225h-95.67c-9.11,0-16.5-7.39-16.5-16.5v0c0-9.11,7.39-16.5,16.5-16.5h95.67c9.11,0,16.5,7.39,16.5,16.5v0C224.55,217.61,217.16,225,208.05,225z" fill="currentColor"/>
                    </svg>
                    <span className="main-collection-mobile__trigger-text">Filter</span>
                  </button>

                  <div className="xo-facets">
                    <div className="xo-facets__toggle">
                      <button style={{ border: "none", background: "none", cursor: "pointer" }}>
                        <svg viewBox="0 0 10 10" width="12">
                          <rect fill="#231f20" width="4.5" height="4.5"/>
                          <rect fill="#231f20" x="5.5" width="4.5" height="4.5"/>
                          <rect fill="#231f20" y="5.5" width="4.5" height="4.5"/>
                          <rect fill="#231f20" x="5.5" y="5.5" width="4.5" height="4.5"/>
                        </svg>
                      </button>
                      <div style={{ display: "flex", gap: "4px", marginLeft: "6px" }}>
                        {[2, 3, 4, 5, 6].map((n) => (
                          <button key={n}
                            onClick={() => setColumns(n)}
                            style={{
                              width: "28px", height: "28px", border: `1px solid ${columns === n ? "#000" : "#ddd"}`,
                              background: columns === n ? "#000" : "transparent",
                              color: columns === n ? "#fff" : "#999",
                              fontSize: "11px", fontWeight: 600, cursor: "pointer",
                            }}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="xo-facets__item">
                      <div className="xo-field-select-custom-filter">
                        <div className="xo-field-select-custom-filter__trigger" style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#333" }}>
                          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            style={{ border: "1px solid #ddd", padding: "6px 10px", fontSize: "12px", fontWeight: 500, background: "#fff", cursor: "pointer", outline: "none" }}>
                            <option value="manual">Featured</option>
                            <option value="best-selling">Best selling</option>
                            <option value="title-ascending">Alphabetically, A-Z</option>
                            <option value="title-descending">Alphabetically, Z-A</option>
                            <option value="price-ascending">Price, low to high</option>
                            <option value="price-descending">Price, high to low</option>
                            <option value="created-ascending">Date, old to new</option>
                            <option value="created-descending">Date, new to old</option>
                          </select>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product grid */}
                <div className="filters-content__grid" style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${Math.min(columns, 4)}, 1fr)`,
                  gap: "30px",
                  marginTop: "30px",
                }}>
                  {displayProducts.map((product: any) => {
                    const img = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80";
                    const isSale = product.discount_price != null;
                    const pid = String(product.id);

                    return (
                      <div key={product.id} className="xo-product-card xo-product-card--style9">
                        {/* Image header */}
                        <div className="xo-product-card__header">
                          <Link href={`/store/${slug}/product/${product.id}`}>
                            <div className="xo-product-image">
                              <div className="xo-image" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                                <img src={img} alt={product.name || product.title}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                                  className="hover-scale" />
                              </div>
                            </div>
                          </Link>
                          {isSale && (
                            <div className="xo-product-card__badge">
                              <div className="xo-badge-sale">Sale</div>
                            </div>
                          )}
                          {/* Hover actions */}
                          <div className="xo-product-card__actions">
                            <button onClick={(e) => handleAddToCart(product, e)}
                              className="xo-btn xo-btn--circle">
                              <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M12,0C9.1,0,6.7,2.4,6.7,5.3v1h10.5v-1C17.2,2.4,14.9,0,12,0z M12,1.8c1.6,0,3,1.1,3.4,2.7H8.6C9,2.9,10.4,1.8,12,1.8" fill="currentColor"/>
                                <path d="M17.6,6.2c0.9,0,1.6,0.7,1.6,1.6v12.9c0,0.9-0.7,1.6-1.6,1.6H6.4c-0.9,0-1.6-0.7-1.6-1.6V7.8c0-0.9,0.7-1.6,1.6-1.6H17.6 M17.6,4.5H6.4C4.5,4.5,3,6,3,7.8v12.9C3,22.5,4.5,24,6.4,24h11.3c1.8,0,3.3-1.5,3.3-3.3V7.8C21,6,19.5,4.5,17.6,4.5L17.6,4.5z" fill="currentColor"/>
                                <path d="M14.8,8.8H9.2c-0.4,0-0.7-0.3-0.7-0.7v0c0-0.4,0.3-0.7,0.7-0.7h5.7c0.4,0,0.7,0.3,0.7,0.7v0C15.5,8.5,15.2,8.8,14.8,8.8z" fill="currentColor"/>
                              </svg>
                            </button>
                            <Link href={`/store/${slug}/product/${product.id}`} className="xo-btn xo-btn--circle">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </Link>
                            <button onClick={(e) => handleWishlist(product, e)} className="xo-btn xo-btn--circle">
                              <Heart size={15} className={isWishlisted(pid) ? "fill-current" : ""} />
                            </button>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="xo-product-card__information">
                          <h2 className="xo-product-card__title">
                            <Link href={`/store/${slug}/product/${product.id}`}>{product.name || product.title}</Link>
                          </h2>
                          <div className="xo-product-card__price">
                            <div className="xo-product-card__price-inner">
                              {isSale ? (
                                <><span className="price-sale">${product.discount_price}</span> <del className="price-compare">${product.price}</del></>
                              ) : (
                                <span>${product.price}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter modal */}
      {mobileFilterOpen && (
        <div className="main-collection-mobile__modal-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="main-collection-mobile__modal-wrap" onClick={(e) => e.stopPropagation()}>
            <div className="main-collection-style2__modal-close">
              <button onClick={() => setMobileFilterOpen(false)} aria-label="Close">
                <svg width="15" viewBox="0 0 320 512">
                  <path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12-3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="main-collection-mobile__modal">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .main-collection { font-family: Poppins, sans-serif; }
        .main-collection-grid { display: grid; grid-template-columns: 1fr 3fr; gap: 30px; }
        @media (max-width: 768px) { .main-collection-grid { grid-template-columns: 1fr; } }
        .main-collection-style1__sidebar { overflow: hidden; }
        .sidebar-desktop { display: block; }
        @media (max-width: 768px) { .sidebar-desktop { display: none; } }
        .collection-sidebar__header { padding: 12px 16px; background: #f8f8f8; margin-bottom: 0; }
        .collection-sidebar__title { font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #000; }
        .collection-sidebar__menu { padding: 8px 0; border-bottom: 1px solid #eee; margin-bottom: 20px; }
        .collection-sidebar__item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; }
        .collection-sidebar__item a { font-size: 13px; color: #666; text-decoration: none; transition: opacity 0.2s; }
        .collection-sidebar__item a:hover { opacity: 0.6; }
        .collection-sidebar__icon { display: flex; align-items: center; color: #ccc; flex-shrink: 0; }
        .fieldset-block__header { padding: 12px 16px; background: #f8f8f8; margin-bottom: 0; margin-top: 20px; }
        .fieldset-block__title { font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #000; }
        .fieldset-block__content { padding: 16px; border-bottom: 1px solid #eee; }
        .fieldset-block__content--color { display: flex; flex-wrap: wrap; gap: 8px; }
        .field-checkbox-color { position: relative; cursor: pointer; }
        .field-checkbox-color__input { position: absolute; opacity: 0; width: 0; height: 0; }
        .field-checkbox-color__item { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid transparent; transition: border-color 0.2s; }
        .field-checkbox-color__input:checked + .field-checkbox-color__item { border-color: #000; }
        .field-checkbox-color__content { width: 20px; height: 20px; border-radius: 50%; display: block; background-color: var(--color); border: 1px solid rgba(0,0,0,0.1); }
        .field-checkbox-text { display: flex; align-items: center; padding: 5px 0; cursor: pointer; }
        .field-checkbox-text__input { position: absolute; opacity: 0; width: 0; height: 0; }
        .field-checkbox-text__item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #666; }
        .field-checkbox-text__icon { color: #ccc; display: flex; align-items: center; opacity: 0; transition: opacity 0.2s; }
        .field-checkbox-text__input:checked + .field-checkbox-text__item .field-checkbox-text__icon { opacity: 1; color: #000; }
        .collection-sidebar__banner { margin-top: 20px; }
        .collection-sidebar__banner img { width: 100%; height: auto; display: block; }
        .main-collection-style1__content { min-width: 0; }
        .main-collection-style1__header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }
        .main-collection-mobile__trigger { display: none; align-items: center; gap: 6px; cursor: pointer; background: none; border: 1px solid #ddd; padding: 8px 14px; font-size: 13px; font-weight: 500; }
        @media (max-width: 768px) { .main-collection-mobile__trigger { display: flex; } }
        .main-collection-mobile__trigger-text { font-size: 13px; font-weight: 500; color: #333; }
        .xo-facets { display: flex; align-items: center; gap: 16px; }
        .xo-facets__toggle { display: flex; align-items: center; gap: 4px; }
        .xo-facets__item { margin-left: auto; }
        .xo-field-select-custom-filter__trigger { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .xo-product-card { text-align: center; background: #fff; }
        .xo-product-card__header { position: relative; overflow: hidden; }
        .xo-product-card__header .xo-image { background: #fafafa; }
        .xo-product-card__header .hover-scale:hover img { transform: scale(1.05); }
        .xo-product-card__badge { position: absolute; top: 12px; left: 12px; z-index: 2; }
        .xo-badge-sale { background: ${accent}; color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 3px 10px; letter-spacing: 0.5px; }
        .xo-product-card__actions { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; opacity: 0; transition: opacity 0.3s; z-index: 2; }
        .xo-product-card__header:hover .xo-product-card__actions { opacity: 1; }
        .xo-btn--circle { width: 38px; height: 38px; border-radius: 50%; border: none; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #333; text-decoration: none; }
        .xo-btn--circle:hover { background: #000; color: #fff; }
        .xo-product-card__information { padding: 16px 0 20px; }
        .xo-product-card__title { font-size: 14px; font-weight: 400; color: #000; margin: 0 0 8px; line-height: 1.4; }
        .xo-product-card__title a { color: inherit; text-decoration: none; }
        .xo-product-card__title a:hover { opacity: 0.6; }
        .xo-product-card__price { font-size: 14px; color: #000; }
        .xo-product-card__price-inner { display: flex; justify-content: center; align-items: center; gap: 6px; }
        .price-sale { font-weight: 600; color: ${accent}; }
        .price-compare { color: #bbb; text-decoration: line-through; font-size: 13px; }
        .main-collection-mobile__modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 9999; }
        .main-collection-mobile__modal-wrap { position: absolute; left: 0; top: 0; bottom: 0; width: 300px; background: #fff; overflow-y: auto; padding: 20px; }
        .main-collection-style2__modal-close { display: flex; justify-content: flex-end; margin-bottom: 16px; }
        .main-collection-style2__modal-close button { background: none; border: none; cursor: pointer; padding: 4px; }
        .xo-container--box { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
        .color-background-1 { background: #fff; }
        .filters-content__grid { margin-top: 30px; }
        @media (max-width: 768px) {
          .filters-content__grid { grid-template-columns: repeat(2, 1fr) !important; gap: 15px; }
        }
      `}</style>
    </div>
  );
}
