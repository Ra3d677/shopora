"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, ChevronDown } from "lucide-react";
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

export default function ThreeMProducts({ slug, store, products }: ThreeMProductsProps) {
  const { addItem: cartAdd } = useCartStore();
  const { addItem: wishlistAdd, removeItem: wishlistRemove, isWishlisted } = useWishlistStore();

  const [sortBy, setSortBy] = useState("manual");
  const [columns, setColumns] = useState(3);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showVendors, setShowVendors] = useState<Record<string, boolean>>({});
  const [showColors, setShowColors] = useState<Record<string, boolean>>({});
  const [gridToggleOpen, setGridToggleOpen] = useState(false);

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
        <div style={{ width: "100%" }}>
          <input type="range" min={0} max={200} step={1} value={priceMax}
            onChange={(e) => { setPriceMax(Number(e.target.value)); }}
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
        {[
          ["#b8ad9d", "Beige"], ["#000000", "Black"], ["#334b7c", "Blue"],
          ["#808080", "Gray"], ["#a5ab86", "Green"], ["#f19b7a", "Orange"],
          ["#FFC0CB", "Pink"], ["#FFFFFF", "White"], ["#dedea4", "Yellow"],
        ].map(([color, label]) => (
          <label key={label} className="field-checkbox-color">
            <input type="checkbox" className="field-checkbox-color__input"
              checked={!!showColors[color]}
              onChange={() => setShowColors((prev) => ({ ...prev, [color]: !prev[color] }))} />
            <div className="field-checkbox-color__item">
              <span className="field-checkbox-color__content" style={{ "--color": color } as React.CSSProperties}></span>
            </div>
          </label>
        ))}
      </div>

      {vendors.length > 0 && (
        <>
          <div className="fieldset-block__header">
            <h2 className="fieldset-block__title">BRAND</h2>
          </div>
          <div className="fieldset-block__content fieldset-block__content--column">
            {vendors.map((v) => (
              <label key={v} className="field-checkbox-text">
                <input type="checkbox" className="field-checkbox-text__input"
                  checked={!!showVendors[v]}
                  onChange={() => setShowVendors((prev) => ({ ...prev, [v]: !prev[v] }))} />
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
              <div className="main-collection-style1__sidebar">
                <div className="sidebar-desktop">
                  <SidebarContent />
                </div>
              </div>

              <div className="main-collection-style1__content">
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
                    <div className="xo-facets__toggle"
                      onMouseEnter={() => setGridToggleOpen(true)}
                      onMouseLeave={() => setGridToggleOpen(false)}>
                      <button style={{ border: "none", background: "none", cursor: "pointer" }}>
                        <svg viewBox="0 0 10 10" width="12">
                          <rect fill="#231f20" width="4.5" height="4.5"/>
                          <rect fill="#231f20" x="5.5" width="4.5" height="4.5"/>
                          <rect fill="#231f20" y="5.5" width="4.5" height="4.5"/>
                          <rect fill="#231f20" x="5.5" y="5.5" width="4.5" height="4.5"/>
                        </svg>
                      </button>
                      <div className={`xo-facets__toggle-content ${gridToggleOpen ? "open" : ""}`}>
                        {[2, 3, 4, 5, 6].map((n) => (
                          <button key={n}
                            onClick={() => setColumns(n)}
                            className={`xo-facets__button-item ${columns === n ? "active" : ""}`}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="xo-facets__item">
                      <div className="xo-field-select-custom-filter">
                        <div className="xo-field-select-custom-filter__trigger">
                          <span className="xo-field-select-custom-filter__name">
                            {sortBy === "manual" ? "Featured" :
                             sortBy === "best-selling" ? "Best selling" :
                             sortBy === "title-ascending" ? "Alphabetically, A-Z" :
                             sortBy === "title-descending" ? "Alphabetically, Z-A" :
                             sortBy === "price-ascending" ? "Price, low to high" :
                             sortBy === "price-descending" ? "Price, high to low" :
                             sortBy === "created-ascending" ? "Date, old to new" :
                             "Date, new to old"}
                          </span>
                          <ChevronDown size={14} />
                        </div>
                        <div className="xo-field-select-custom-filter__popover">
                          {[
                            { value: "manual", label: "Featured" },
                            { value: "best-selling", label: "Best selling" },
                            { value: "title-ascending", label: "Alphabetically, A-Z" },
                            { value: "title-descending", label: "Alphabetically, Z-A" },
                            { value: "price-ascending", label: "Price, low to high" },
                            { value: "price-descending", label: "Price, high to low" },
                            { value: "created-ascending", label: "Date, old to new" },
                            { value: "created-descending", label: "Date, new to old" },
                          ].map((opt) => (
                            <label key={opt.value} className="xo-field-select-custom-filter__check">
                              <input type="radio"
                                className="xo-field-select-custom-filter__input"
                                name="sort_by"
                                value={opt.value}
                                checked={sortBy === opt.value}
                                onChange={() => setSortBy(opt.value)} />
                              <span className="xo-field-select-custom-filter__label">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                        <div className="xo-product-card__header xo-product-card__header--style9">
                          <Link href={`/store/${slug}/product/${product.id}`}>
                            <div className="xo-product-image">
                              <div className="xo-image" style={{ aspectRatio: "1/1", overflow: "hidden", background: "#fafafa" }}>
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
                          <div className="xo-product-card__actions xo-product-card__actions--style9">
                            <button onClick={(e) => handleAddToCart(product, e)}
                              className="xo-btn xo-btn--circle xo-btn--sm xo-btn--slide-up">
                              <svg width="20" height="20" viewBox="0 0 400 400">
                                <g transform="matrix(1.3333333,0,0,-1.3333333,0,400)"><g transform="scale(0.1)"><path d="m 784.238,1668.15 c 92.879,-92.87 92.879,-243.43 0,-336.3 -92.883,-92.89 -243.437,-92.89 -336.316,0 -92.883,92.87 -92.883,243.43 0,336.3 92.879,92.89 243.433,92.89 336.316,0" fill="currentColor"/><path d="m 2572.08,1668.15 c 92.88,-92.87 92.88,-243.43 0,-336.3 -92.87,-92.89 -243.44,-92.89 -336.31,0 -92.88,92.87 -92.88,243.43 0,336.3 92.87,92.89 243.44,92.89 336.31,0" fill="currentColor"/><path d="m 1678.15,1668.15 c 92.89,-92.87 92.89,-243.43 0,-336.3 -92.87,-92.89 -243.43,-92.89 -336.3,0 -92.89,92.87 -92.89,243.43 0,336.3 92.87,92.89 243.43,92.89 336.3,0" fill="currentColor"/></g></g>
                              </svg>
                            </button>
                            <Link href={`/store/${slug}/product/${product.id}`}
                              className="xo-btn xo-btn--circle xo-btn--sm xo-btn--slide-up">
                              <svg width="20" height="20" viewBox="0 0 400 400">
                                <g transform="matrix(1.3333333,0,0,-1.3333333,0,400)"><g transform="scale(0.1)"><path d="m 1312.7,795.5 c -472.7,0 -857.204,384.3 -857.204,856.7 0,472.7 384.504,857.2 857.204,857.2 472.7,0 857.3,-384.5 857.3,-857.2 0,-472.4 -384.6,-856.7 -857.3,-856.7 z M 2783.9,352.699 2172.7,963.898 c 155.8,194.702 241.5,438.602 241.5,688.302 0,607.3 -494.1,1101.4 -1101.5,1101.4 -607.302,0 -1101.399,-494.1 -1101.399,-1101.4 0,-607.4 494.097,-1101.501 1101.399,-1101.501 249.8,0 493.5,85.5 687.7,241 L 2611.7,181 c 23,-23 53.6,-35.699 86.1,-35.699 32.4,0 63,12.699 86,35.699 23.1,22.801 35.8,53.301 35.8,85.898 0,32.602 -12.7,63 -35.7,85.801" fill="currentColor"/></g></g>
                              </svg>
                            </Link>
                            <button onClick={(e) => handleWishlist(product, e)}
                              className="xo-btn xo-btn--circle xo-btn--sm xo-btn--slide-up">
                              <svg width="20" height="20" viewBox="0 0 400 400">
                                <g transform="matrix(1.3333333,0,0,-1.3333333,0,400)"><g transform="scale(0.1)"><path d="m 903,2424.4 c 157.9,0 306.4,-61.5 418.1,-173.1 l 134.8,-134.9 c 20.7,-20.6 48.1,-32 77.1,-32 29,0 56.4,11.4 77,32 l 133.7,133.7 c 111.7,111.6 259.9,173.1 417.5,173.1 156.91,0 305,-61.3 416.8,-172.5 111.2,-111.3 172.5,-259.5 172.5,-417.5 0.6,-157.3 -60.69,-305.5 -172.5,-417.4 L 1531.5,373.5 487.402,1417.6 c -111.601,111.7 -173.105,259.9 -173.105,417.5 0,158.1 61.199,306.1 172.5,416.8 111.308,111.2 259.101,172.5 416.203,172.5 z m 1829.7,-19.6 c 0,0 0,0 -0.1,0 -152.4,152.4 -355.1,236.3 -570.9,236.3 -215.7,0 -418.7,-84.1 -571.5,-236.9 l -56.9,-57 -58.2,58.2 c -153.1,153.1 -356.3,237.5 -572.1,237.5 -215.305,0 -417.902,-83.9 -570.305,-236.3 -153,-153 -236.8942,-356 -236.2966,-571.5 0,-215 84.4026,-417.8 237.4966,-571 L 1454.7,143.301 c 20.5,-20.403 48.41,-32.199 76.8,-32.199 28.7,0 56.7,11.5 76.7,31.597 L 2731.5,1261.8 c 152.7,152.7 236.8,355.7 236.8,571.4 0.7,216 -83,419 -235.6,571.6" fill="currentColor"/></g></g>
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="xo-product-card__information">
                          <h2 className="xo-product-card__title">
                            <Link href={`/store/${slug}/product/${product.id}`}>{product.name || product.title}</Link>
                          </h2>
                          <div className="xo-product-card__price">
                            <div className="xo-product-card__price-inner">
                              {isSale ? (
                                <><span className="xo-price__item xo-price__item--accent">${product.discount_price}</span> <span className="xo-price__item xo-price__item--del">${product.price}</span></>
                              ) : (
                                <span className="xo-price__item">${product.price}</span>
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

        .collection-sidebar__header { padding: 12px 16px; background: #f8f8f8; margin-bottom: 0; border-left: 3px solid #000; position: relative; }
        .collection-sidebar__header::after { content: ""; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 1px; background: #000; }
        .collection-sidebar__title { font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #000; margin: 0; }
        .collection-sidebar__menu { padding: 8px 0; border-bottom: 1px solid #eee; margin-bottom: 20px; }
        .collection-sidebar__item { display: flex; align-items: center; gap: 1rem; padding: 8px 16px; transform: translateX(-1.7rem); transition: transform 0.2s; }
        .collection-sidebar__item:hover { transform: translateX(0); }
        .collection-sidebar__item a { font-size: 13px; color: #666; text-decoration: none; transition: opacity 0.2s; white-space: nowrap; }
        .collection-sidebar__item a:hover { opacity: 0.6; }
        .collection-sidebar__icon { display: flex; align-items: center; color: #ccc; flex-shrink: 0; }

        .fieldset-block__header { padding: 12px 16px; background: #f8f8f8; margin-bottom: 0; margin-top: 20px; border-left: 3px solid #000; position: relative; }
        .fieldset-block__header::after { content: ""; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 1px; background: #000; }
        .fieldset-block__title { font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #000; margin: 0; }
        .fieldset-block__content { padding: 16px; border-bottom: 1px solid #eee; }
        .fieldset-block__content--color { display: flex; flex-wrap: wrap; gap: 8px; }
        .fieldset-block__content--column { display: flex; flex-direction: column; }

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
        .main-collection-style1__header { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }

        .main-collection-mobile__trigger { display: none; align-items: center; gap: 6px; cursor: pointer; background: none; border: 1px solid #ddd; padding: 8px 14px; font-size: 13px; font-weight: 500; }
        @media (max-width: 768px) { .main-collection-mobile__trigger { display: flex; } .main-collection-style1__header { justify-content: space-between; } }
        .main-collection-mobile__trigger-text { font-size: 13px; font-weight: 500; color: #333; }

        .xo-facets { display: flex; align-items: center; gap: 16px; }
        .xo-facets__toggle { display: flex; align-items: center; gap: 4px; position: relative; }
        .xo-facets__toggle-content { display: none; gap: 4px; margin-left: 6px; }
        .xo-facets__toggle-content.open { display: flex; }
        .xo-facets__button-item { width: 28px; height: 28px; border: 1px solid #ddd; background: transparent; color: #999; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .xo-facets__button-item.active { border-color: #000; background: #000; color: #fff; }
        .xo-facets__button-item:hover { border-color: #000; }
        .xo-facets__item { position: relative; }

        .xo-field-select-custom-filter__trigger { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; font-weight: 500; color: #333; padding: 6px 10px; border: 1px solid #ddd; }
        .xo-field-select-custom-filter__name { font-size: 12px; font-weight: 500; }
        .xo-field-select-custom-filter__popover { display: none; position: absolute; top: 100%; right: 0; z-index: 10; background: #fff; border: 1px solid #ddd; box-shadow: 0 2px 10px rgba(0,0,0,0.1); min-width: 180px; margin-top: 2px; }
        .xo-field-select-custom-filter:hover .xo-field-select-custom-filter__popover { display: block; }
        .xo-field-select-custom-filter__check { display: flex; align-items: center; padding: 8px 14px; cursor: pointer; transition: background 0.15s; }
        .xo-field-select-custom-filter__check:hover { background: #f5f5f5; }
        .xo-field-select-custom-filter__input { display: none; }
        .xo-field-select-custom-filter__label { font-size: 12px; color: #333; font-weight: 400; white-space: nowrap; }
        .xo-field-select-custom-filter__input:checked + .xo-field-select-custom-filter__label { font-weight: 600; }

        .xo-product-card { text-align: center; background: #fff; }
        .xo-product-card__header { position: relative; overflow: hidden; }
        .xo-product-card__header .hover-scale:hover img { transform: scale(1.05); }
        .xo-product-card__badge { position: absolute; top: 0; right: 0; z-index: 2; overflow: hidden; width: 60px; height: 60px; }
        .xo-badge-sale { position: absolute; top: 12px; right: -2px; background: ${accent}; color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 3px 24px; letter-spacing: 0.5px; transform: rotate(45deg); white-space: nowrap; }

        .xo-product-card__actions { position: absolute; bottom: 15%; left: 50%; transform: translateX(-50%) translateY(1.5rem); display: flex; gap: 1.5rem; opacity: 0; transition: all 0.3s; z-index: 2; }
        .xo-product-card__header:hover .xo-product-card__actions { opacity: 1; transform: translateX(-50%) translateY(0); }

        .xo-btn { display: inline-flex; align-items: center; justify-content: center; cursor: pointer; text-decoration: none; transition: all 0.2s; }
        .xo-btn--circle { width: 42px; height: 42px; border-radius: 50%; border: none; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); color: #333; }
        .xo-btn--circle:hover { background: #000; color: #fff; }
        .xo-btn--sm svg { width: 18px; height: 18px; }

        .xo-product-card__information { padding: 2rem; padding-top: 1rem; padding-bottom: 1rem; }
        .xo-product-card__title { font-size: 16px; font-weight: 500; color: #000; margin: 0 0 4px; line-height: 1.4; text-transform: capitalize; }
        .xo-product-card__title a { color: inherit; text-decoration: none; }
        .xo-product-card__title a:hover { opacity: 0.6; }

        .xo-product-card__price { font-size: 14px; color: #000; }
        .xo-product-card__price-inner { display: flex; justify-content: center; align-items: center; gap: 2rem; }
        .xo-price__item { font-weight: 500; }
        .xo-price__item--accent { color: ${accent}; font-weight: 600; }
        .xo-price__item--del { color: #bbb; text-decoration: line-through; font-size: 13px; }

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
