"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

interface OneGProps {
  store: any;
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

function OneGProductCard({ product, slug, currentColor }: { product: any; slug: string; currentColor: string }) {
  const { addItem: cartAdd } = useCartStore();
  const { addItem: wishlistAdd, removeItem: wishlistRemove, isWishlisted } = useWishlistStore();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const img = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80";
  const isSale = product.discount_price != null;
  const pid = String(product.id);
  const wishlisted = isWishlisted(pid);

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cartAdd({ id: `${slug}-${product.id}-One Size-`, storeId: slug, product: { ...product, images: product.images || img }, quantity: 1, selectedSize: "One Size", selectedColor: "", selectedImage: img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (wishlisted) wishlistRemove(pid);
    else wishlistAdd({ productId: pid, storeId: slug, name: product.name, price: product.price, image: img, slug: `/store/${slug}/product/${product.id}` });
  };

  return (
    <div
      className="oneg-product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/store/${slug}/product/${product.id}`} className="oneg-product-img-wrap">
        <img src={img} alt={product.name} style={{ transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform .4s ease" }} />
        {isSale && <span className="oneg-badge-sale" style={{ background: currentColor }}>SALE</span>}
        <div className="oneg-product-overlay" style={{ opacity: hovered ? 1 : 0 }}>
          <button className="oneg-cart-btn" style={{ background: currentColor }} onClick={handleCart}>
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </Link>
      <div className="oneg-product-info">
        <Link href={`/store/${slug}/product/${product.id}`} className="oneg-product-name">{product.name || product.title}</Link>
        <div className="oneg-product-price-row">
          {isSale ? (
            <>
              <span className="oneg-price-sale" style={{ color: currentColor }}>${product.discount_price}</span>
              <span className="oneg-price-original">${product.price}</span>
            </>
          ) : (
            <span className="oneg-price-regular">${product.price}</span>
          )}
          <button className="oneg-wishlist-btn" onClick={handleWishlist} style={{ color: wishlisted ? currentColor : "#bbb" }} title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ShopSection({ products, slug, categories, currentColor }: { products: any[]; slug: string; categories: any[]; currentColor: string }) {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [showCount, setShowCount] = useState(8);

  const filtered = activeCat === "all"
    ? products
    : products.filter((p: any) => String(p.category_id) === String(activeCat));

  const visible = filtered.slice(0, showCount);
  const hasMore = filtered.length > showCount;

  return (
    <div className="shop-wrap" id="shop">
      <div className="container">
        <div className="title">
          <h1><span>Our</span> Shop</h1>
        </div>
        {categories && categories.length > 0 && (
          <div className="oneg-shop-cats">
            <button className={activeCat === "all" ? "active" : ""} onClick={() => { setActiveCat("all"); setShowCount(8); }}>All</button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                className={String(activeCat) === String(cat.id) ? "active" : ""}
                onClick={() => { setActiveCat(String(cat.id)); setShowCount(8); }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
        <div className="oneg-shop-grid">
          {visible.map((product: any) => (
            <OneGProductCard key={product.id} product={product} slug={slug} currentColor={currentColor} />
          ))}
        </div>
        {hasMore && (
          <div className="shop-view-all">
            <a href="#" onClick={(e) => { e.preventDefault(); setShowCount(c => c + 8); }}>Load More</a>
          </div>
        )}
        {!hasMore && products.length > 8 && (
          <div className="shop-view-all">
            <Link href={`/store/${slug}/products`}>View All Products →</Link>
          </div>
        )}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>No products in this category yet.</div>
        )}
      </div>
    </div>
  );
}

const IMAGES = {
  logo: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927978/shopora/1g/bipx926qzyn1bconuvap.png",
  logo2: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927978/shopora/1g/l33yl5yligdpzzrtohu9.png",
  banner: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927960/shopora/1g/qqwpx2iketrcj4twc1v1.jpg",
  fitness: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927969/shopora/1g/hqidtm1iq19acxmw3rny.jpg",
  training: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927981/shopora/1g/tlue8fsew4zeqypabmpa.jpg",
  yoga: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927986/shopora/1g/iupqltutnn5ofniecwc2.jpg",
  aboutImg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927956/shopora/1g/qzurj1ykuaojq1mg3f4i.jpg",
  gallery01: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927970/shopora/1g/rqe1erbzlqo1kuiljz9w.jpg",
  gallery02: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927971/shopora/1g/ismju9kc0fmmo1k2mtk0.jpg",
  gallery03: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927973/shopora/1g/xiuvoqhhs86qx1oezlt9.jpg",
  gallery04: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927974/shopora/1g/jh9xmziugnmy0j2cxdtq.jpg",
  gallery05: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927976/shopora/1g/pbc6lidkrgrd5fvkueg5.jpg",
  gallery06: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927977/shopora/1g/xlyxhdllt4w1nxxbzbtm.jpg",
  weightLifting: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927982/shopora/1g/cveldyupke6gk4wmyrvu.jpg",
  running: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927979/shopora/1g/ci7vsgtigw7oz9chip6x.jpg",
  weight: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927984/shopora/1g/i5n5wj5geb98efqaj7t0.jpg",
  expert01: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927965/shopora/1g/qbcypiwlv33lxhgi7d9s.jpg",
  expert02: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927966/shopora/1g/lniimnpmrhisvmon31fl.jpg",
  expert03: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927967/shopora/1g/gnfjicltw3pvptvjcn92.jpg",
  blog01: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927961/shopora/1g/fjpyjzmxekpfhzwbycuj.jpg",
  blog02: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927962/shopora/1g/txzymvqgbptpnhidih9k.jpg",
  blog03: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780927964/shopora/1g/fzeivvb2sxldm5wqw0uh.jpg",
  whatweBg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928198/shopora/1g/lprvkzocft4cj30pmc8p.jpg",
  joinBg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928200/shopora/1g/ivkawyt6ho7nz7x69cns.jpg",
  classesBg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928201/shopora/1g/yrika2fuieyacicumnra.jpg",
  videoBg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928204/shopora/1g/xo9q8dcjmavozjzssxih.jpg",
  counterBg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928206/shopora/1g/an1znzytyw2kebnnxucp.jpg",
  blogBg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928207/shopora/1g/ofidd8ermxwjzup36rj0.png",
  footerBg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928209/shopora/1g/lsofrc2npnlnqurecp9e.jpg",
  headingLine: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928210/shopora/1g/adm1z2e88qybyhz7whqc.png",
  headingLineWhite: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780928211/shopora/1g/skv5jabwgyqifjjxhssj.png",
  gymVideo: "https://res.cloudinary.com/dno6yitvw/video/upload/v1780928233/shopora/1g/gqmxomy0kmlt76baxugw.mp4",
  banner1: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780931475/shopora/1g/ibvlu855dxi3aqxiewjh.jpg",
};

const GALLERY_IMAGES = [
  { src: IMAGES.gallery01, filter: "all fitness", title: "Fiteness Center" },
  { src: IMAGES.gallery05, filter: "all yoga gym", title: "Fiteness Center" },
  { src: IMAGES.gallery03, filter: "all yoga gym", title: "Fiteness Center" },
  { src: IMAGES.gallery04, filter: "all running gym yoga", title: "Fiteness Center" },
  { src: IMAGES.gallery02, filter: "all fitness running", title: "Fiteness Center" },
  { src: IMAGES.gallery06, filter: "all gym yoga", title: "Fiteness Center" },
];

const SLIDES = [
  { bg: IMAGES.banner1, subtitle: "Perfect Shape  Perfect Life", title: "Get Fit Now!" },
  { bg: IMAGES.banner, subtitle: "Perfect Shape  Perfect Life", title: "Get Fit Now!" },
];

const NAV_ITEMS = [
  {
    name: "Home",
    href: "#home",
    submenu: [
      { name: "Home 01 Slider", href: "#home" },
      { name: "Home 02 Video bg", href: "#home" },
      { name: "Home 03 one page", href: "#home" },
      { name: "Home 04 one page", href: "#home" },
    ]
  },
  { name: "About", href: "#about" },
  { name: "Gallery", href: "#gallery" },
  {
    name: "Classes",
    href: "#classes",
    submenu: [
      { name: "Classes", href: "#classes" },
      { name: "Singal Classes", href: "#classes" },
    ]
  },
  {
    name: "Pages",
    href: "#",
    submenu: [
      { name: "About", href: "#about" },
      { name: "Our Experts", href: "#trainers" },
      { name: "Our Pricing", href: "#prices" },
      { name: "Testimonials", href: "#" },
      { name: "FAQs", href: "#" },
      { name: "Typoghrapy", href: "#" },
      { name: "404", href: "#" },
    ]
  },
  { name: "Trainers", href: "#trainers" },
  { name: "Shop", href: "#shop" },
  {
    name: "Blog",
    href: "#blog",
    submenu: [
      { name: "Blog with Sidebar", href: "#blog" },
      { name: "Blog Details", href: "#blog" },
    ]
  },
  { name: "Contact", href: "#contact-us" },
];

export default function OneGTemplate(props: OneGProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [activeColor, setActiveColor] = useState("orange");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => { if (slideTimerRef.current) clearInterval(slideTimerRef.current); };
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll(".counter-number");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseInt(el.getAttribute("data-to") || "0", 10);
            const speed = parseInt(el.getAttribute("data-speed") || "1000", 10);
            let current = 0;
            const increment = target / (speed / 16);
            const update = () => {
              current += increment;
              if (current < target) {
                el.textContent = Math.ceil(current).toString();
                requestAnimationFrame(update);
              } else {
                el.textContent = target.toString();
              }
            };
            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const colorMap: Record<string, string> = {
    orange: "#f36f21",
    red: "#e61111",
    blue: "#2abbf5",
    purple: "#ba6bda",
    yellow: "#e5c51a",
    nvblue: "#343db9",
    green: "#12d43c",
    pink: "#d814d2",
  };

  const currentColor = colorMap[activeColor] || "#f36f21";

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&family=Roboto+Condensed:wght@300;400;700&display=swap');

        html { scroll-behavior: smooth; }
        .oneg *{margin:0;padding:0;box-sizing:border-box;}
        .oneg body{font-family:'Open Sans',sans-serif;}
        .oneg a{transition:all .3s ease;}
        .oneg img{max-width:100%;}
        .oneg h1,.oneg h2,.oneg h3,.oneg h4,.oneg h5,.oneg h6{font-family:'Roboto Condensed',sans-serif;}
        .oneg p{font-size:14px;line-height:24px;color:#333;}
        .oneg ul,.oneg ol{list-style:none;margin:0;}

        .oneg .container{width:100%;max-width:1140px;margin:0 auto;padding:0 15px;}
        .oneg .row{display:flex;flex-wrap:wrap;margin:0 -15px;}
        .oneg .col-lg-4{position:relative;width:100%;padding:0 15px;}
        .oneg .col-lg-8{position:relative;width:100%;padding:0 15px;}
        .oneg .col-md-3{position:relative;width:25%;padding:0 15px;}
        .oneg .col-md-6{position:relative;width:50%;padding:0 15px;}
        .oneg .col-md-12{position:relative;width:100%;padding:0 15px;}
        .oneg .col-sm-3{position:relative;width:25%;padding:0 15px;}
        .oneg .col-sm-6{position:relative;width:50%;padding:0 15px;}
        .oneg .col-xs-12{position:relative;width:100%;padding:0 15px;}
        @media(min-width:992px){
          .oneg .col-lg-4{flex:0 0 33.333%;max-width:33.333%;}
          .oneg .col-lg-8{flex:0 0 66.667%;max-width:66.667%;}
          .oneg .col-lg-9{flex:0 0 75%;max-width:75%;}
          .oneg .col-lg-3{flex:0 0 25%;max-width:25%;}
        }

        .oneg .title h1{font-size:48px;color:#000;font-weight:bold;position:relative;margin-bottom:50px;}
        .oneg .title h1 span{font-size:30px;color:${currentColor};display:block;font-weight:normal;}
        .oneg .title h1:before{content:"";background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928210/shopora/1g/adm1z2e88qybyhz7whqc.png) no-repeat;width:70px;height:12px;position:absolute;bottom:-20px;left:0;}
        .oneg .readmore a{text-decoration:none;font-size:16px;color:#fff;background:${currentColor};padding:16px 35px;border-radius:30px;display:inline-block;text-transform:uppercase;font-weight:bold;}
        .oneg .readmore i{padding-left:5px;}
        .oneg .readmore a:hover{background:#000;color:#fff;}

        .oneg .header-wrap{position:absolute;top:40px;left:0;z-index:1000;width:100%;}
        .oneg .logo img{max-width:100%;}
        .oneg .navbar-dark .navbar-nav .nav-link{color:#fff;font-size:14px;font-weight:bold;text-transform:uppercase;padding:8px 16px;}
        .oneg .navbar-dark .navbar-nav .nav-link:hover{color:${currentColor};}
        .oneg .navbar{margin-top:18px;}
        .oneg .navbar-toggler{display:none;}
        .oneg .navbar-brand{display:none;}
        .oneg .bg-dark{background:none!important;}

        .oneg .navbar-nav{display:flex;flex-wrap:wrap;}
        .oneg .navbar-nav>li{position:relative;}
        .oneg .navbar-nav>li>ul{position:absolute;left:0;top:200%;width:200px;padding:0;border:1px solid rgba(255,255,255,.5);z-index:100;background:${currentColor};visibility:hidden;opacity:0;border-radius:0 2px 2px 2px;transition:all 500ms ease;}
        .oneg .navbar-nav>li:hover>ul{top:100%;opacity:1;visibility:visible;}
        .oneg .navbar-nav>li>ul>li{position:relative;float:none;width:100%;border-bottom:1px solid rgba(255,255,255,.5);}
        .oneg .navbar-nav>li>ul>li:last-child{border-bottom:none;}
        .oneg .navbar-nav>li>ul>li>a{text-decoration:none;display:block;padding:5px 20px;font-weight:normal;font-size:14px;color:#fff;transition:all 500ms ease;}
        .oneg .navbar-nav>li>ul>li:hover>a{padding-left:25px;}

        .oneg .logo2{display:none;}
        .oneg .toggle-caret{display:none;}

        .oneg .tp-banner-container{position:relative;z-index:1;padding:0;width:100%;}
        .oneg .tp-banner{position:relative;width:100%;}
        .oneg .tp-banner ul{position:relative;width:100%;margin:0;padding:0;list-style:none;}
        .oneg .tp-banner ul li{position:absolute;top:0;left:0;width:100%;height:600px;opacity:0;transition:opacity .8s ease;z-index:1;}
        .oneg .tp-banner ul li.active{opacity:1;z-index:2;}
        .oneg .tp-banner ul li img{width:100%;height:100%;object-fit:cover;}
        .oneg .tp-banner ul li:after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:1;}
        .oneg .caption{position:absolute;z-index:2;opacity:0;transition:all .8s ease;}
        .oneg .tp-banner ul li.active .caption{opacity:1;}
        .oneg .tp-banner ul li.active .slidertext2{transition-delay:.3s;}
        .oneg .tp-banner ul li.active .slidertext1{transition-delay:.6s;}
        .oneg .tp-banner ul li.active .slidertext3{transition-delay:1.2s;}
        .oneg .tp-banner ul li.active .slidertext4{transition-delay:1.8s;}
        .oneg .lft{left:0;text-align:left;}
        .oneg .lfl{left:0;text-align:left;}
        .oneg .lfb{left:0;text-align:left;}
        .oneg .large-title{font-weight:700;}
        .oneg .tp-resizeme{white-space:nowrap;}
        .oneg .slidertext1{color:#fff;font-size:100px;font-weight:700;text-shadow:0 0 10px rgba(0,0,0,.41);text-transform:uppercase;text-align:center;font-family:'Roboto Condensed',sans-serif;line-height:100px;}
        .oneg .slidertext2{color:#fff;font-size:30px;font-weight:300;font-style:italic;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif;text-align:center;}
        .oneg .slidertext3{color:#fff;font-size:16px;font-weight:normal;line-height:30px;text-align:center;}
        .oneg .slidertext4{color:#fff;font-size:18px;font-weight:600;text-align:center;font-family:'Open Sans',sans-serif;line-height:24px;margin-top:20px;}
        .oneg .slidertext4 a{background:${currentColor};color:#fff!important;font-size:20px;border-radius:30px;padding:16px 40px;font-weight:700;text-transform:uppercase;display:inline-block;font-family:'Roboto Condensed',sans-serif;text-decoration:none;}
        .oneg .slidebtn{background:${currentColor};color:#fff!important;font-size:20px;border-radius:30px;padding:16px 40px;font-weight:700;text-transform:uppercase;display:inline-block;font-family:'Roboto Condensed',sans-serif;text-decoration:none;}

        .oneg .what_we-do_wrap{background:var(--whatwe-bg) no-repeat top;background-size:cover;padding:70px 0 38px 0;text-align:center;}
        .oneg .what_we-do_wrap .what_we_img{border:6px solid ${currentColor};}
        .oneg .what_we-do_wrap h3{font-size:24px;color:#000;margin-top:15px;font-family:'Open Sans',sans-serif;}

        .oneg .about-wrap{padding:60px 0 0 0;}
        .oneg .about-wrap .readmore{margin-top:30px;}

        .oneg .join-wrap{background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928200/shopora/1g/ivkawyt6ho7nz7x69cns.jpg) no-repeat top;background-size:cover;padding:40px 0;position:relative;}
        .oneg .join-wrap:before{content:"";background:rgba(243,111,33,.86);position:absolute;top:0;left:0;height:100%;width:100%;}
        .oneg .join-wrap .title h1{color:#fff;margin-bottom:38px;}
        .oneg .join-wrap .title h1:before{background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928211/shopora/1g/skv5jabwgyqifjjxhssj.png) no-repeat;}
        .oneg .join-wrap p{color:#fff;font-weight:600;margin-bottom:0;}
        .oneg .join-wrap .readmore{margin-top:65px;}
        .oneg .join-wrap .readmore a{background:none;border:2px solid #fff;color:#fff;padding:16px 41px;font-size:18px;}
        .oneg .join-wrap .readmore a:hover{background:#fff;color:#000;}

        .oneg .gallery-wrap{padding:60px 0;}
        .oneg .gallery-wrap .title{text-align:center;}
        .oneg .gallery-wrap .title h1{display:inline-block;}
        .oneg .gallery-wrap .title h1:before{left:50%;margin-left:-35px;}
        .oneg .gallery-wrap .filters{text-align:center;}
        .oneg .gallery-wrap .filters li{display:inline-block;cursor:pointer;padding:12px 30px;border-radius:30px;font-weight:bold;font-size:14px;color:#333;margin:0 5px 5px 0;border:1px solid ${currentColor};transition:all .5s;}
        .oneg .gallery-wrap .filters li:hover,.oneg .gallery-wrap .filters li.active{color:#fff;background:${currentColor};}

        /* Shop Section */
        .oneg .shop-wrap{padding:60px 0;background:#f9f9f9;}
        .oneg .shop-wrap .title{text-align:center;}
        .oneg .shop-wrap .title h1{display:inline-block;}
        .oneg .shop-wrap .title h1:before{left:50%;margin-left:-35px;}
        .oneg .shop-wrap .shop-view-all{text-align:center;margin-top:40px;}
        .oneg .shop-wrap .shop-view-all a{display:inline-block;border:2px solid ${currentColor};color:#333;font-weight:bold;font-size:14px;padding:12px 35px;border-radius:30px;text-decoration:none;text-transform:uppercase;transition:all .3s;}
        .oneg .shop-wrap .shop-view-all a:hover{background:${currentColor};color:#fff;}
        .oneg-shop-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:40px;}
        @media(max-width:990px){.oneg-shop-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:480px){.oneg-shop-grid{grid-template-columns:1fr;}}
        .oneg-product-card{background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:box-shadow .3s;}
        .oneg-product-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.12);}
        .oneg-product-img-wrap{display:block;position:relative;overflow:hidden;aspect-ratio:1/1;text-decoration:none;}
        .oneg-product-img-wrap img{width:100%;height:100%;object-fit:cover;display:block;}
        .oneg-badge-sale{position:absolute;top:12px;left:12px;font-size:11px;font-weight:bold;color:#fff;padding:4px 10px;border-radius:2px;text-transform:uppercase;letter-spacing:.5px;z-index:1;}
        .oneg-product-overlay{position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center;padding-bottom:20px;transition:opacity .3s;}
        .oneg-cart-btn{color:#fff;font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:.5px;padding:10px 24px;border:2px solid #fff;background:transparent;cursor:pointer;border-radius:2px;transition:all .3s;}
        .oneg-cart-btn:hover{background:#fff;color:#333;}
        .oneg-product-info{padding:16px;}
        .oneg-product-name{display:block;font-size:15px;font-weight:600;color:#222;text-decoration:none;margin-bottom:8px;font-family:'Open Sans',sans-serif;transition:color .2s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .oneg-product-name:hover{color:${currentColor};}
        .oneg-product-price-row{display:flex;align-items:center;gap:10px;justify-content:space-between;}
        .oneg-price-regular,.oneg-price-sale{font-size:16px;font-weight:700;color:${currentColor};}
        .oneg-price-original{font-size:13px;color:#aaa;text-decoration:line-through;}
        .oneg-wishlist-btn{background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;transition:color .2s;}
        .oneg-shop-cats{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:20px;}
        .oneg-shop-cats button{background:none;border:1px solid #ccc;padding:7px 20px;border-radius:30px;font-size:13px;font-weight:bold;color:#555;cursor:pointer;transition:all .3s;}
        .oneg-shop-cats button.active,.oneg-shop-cats button:hover{border-color:${currentColor};background:${currentColor};color:#fff;}
        .oneg .sortable-masonry .items-container{margin:0 -15px;}
        .oneg .default-portfolio-item .inner-box{position:relative;overflow:hidden;margin:15px 0;}
        .oneg .default-portfolio-item .image-box img{width:100%;display:block;}
        .oneg .default-portfolio-item .overlay-box{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transition:all .5s;transform:scaleX(0);}
        .oneg .default-portfolio-item .inner-box:hover .overlay-box{opacity:1;transform:scaleX(1);}
        .oneg .default-portfolio-item .overlay-inner{position:absolute;left:0;top:0;width:100%;height:100%;display:table;padding:30px 50px;background:rgba(0,0,0,.85);}
        .oneg .default-portfolio-item .overlay-inner .content{display:table-cell;vertical-align:middle;text-align:center;}
        .oneg .default-portfolio-item .overlay-inner h3{font-size:20px;color:#fff;font-weight:700;text-transform:uppercase;}
        .oneg .default-portfolio-item .overlay-inner h3 a{color:#fff;text-decoration:none;}
        .oneg .default-portfolio-item .overlay-inner h3 a:hover{color:${currentColor};}
        .oneg .default-portfolio-item .image-link{position:absolute;left:0;bottom:-100px;width:50px;height:50px;color:#fff;line-height:50px;background:${currentColor};display:block;font-size:16px;z-index:1;text-align:center;}
        .oneg .default-portfolio-item:hover .image-link{bottom:0;transition:all .5s .5s;}

        .oneg .classes-wrap{background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928201/shopora/1g/yrika2fuieyacicumnra.jpg) no-repeat top;background-size:cover;padding:60px 0;}
        .oneg .center{text-align:center;}
        .oneg .center h1{color:#fff;display:inline-block;}
        .oneg .center h1:before{background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928211/shopora/1g/skv5jabwgyqifjjxhssj.png) no-repeat;left:50%;margin-left:-35px;}
        .oneg .classInfo{background:#fff;padding:20px;}
        .oneg .classInfo h3 a{font-size:22px;font-weight:bold;color:#272626;text-decoration:none;}
        .oneg .classInfo h3 a:hover{color:${currentColor};}
        .oneg .classInfo h3{margin-top:15px;}
        .oneg .author span{padding-left:15px;padding-right:15px;position:relative;}
        .oneg .author i{padding-right:5px;color:${currentColor};}
        .oneg .author span:before{content:"";background:#b2b2b2;height:20px;width:1px;position:absolute;left:0;top:0;}
        .oneg .author span:first-child:before{display:none;}
        .oneg .author span:first-child{padding-left:0;}
        .oneg .owl-carousel{display:flex;overflow-x:auto;gap:30px;padding:20px 0;scroll-snap-type:x mandatory;margin-top:80px;}
        .oneg .owl-carousel .item{flex:0 0 calc(33.333% - 20px);scroll-snap-align:start;}

        .oneg .pricing-wrap{padding:60px 0;}
        .oneg .pricing-wrap .title{text-align:center;}
        .oneg .pricing-wrap .title h1{display:inline-block;}
        .oneg .pricing-wrap .title h1:before{left:50%;margin-left:-35px;}
        .oneg .pricing-table{display:flex;flex-wrap:wrap;gap:30px;justify-content:center;}
        .oneg .pricing-table>li{flex:0 0 calc(33.333% - 20px);min-width:280px;}
        .oneg .pricingWrp{border:2px solid #ededed;text-align:center;padding:50px;transition:all .3s;}
        .oneg .pricingWrp:hover{border-color:${currentColor};}
        .oneg .pricing-table h3{font-size:40px;color:#2e2e2e;}
        .oneg .dollarPrice{font-size:60px;color:${currentColor};font-family:'Roboto Condensed',sans-serif;}
        .oneg .dollarPrice span{font-size:30px;color:#2e2e2e;}
        .oneg .tableList li{font-size:18px;color:#000;line-height:46px;}
        .oneg .viewbtn{margin-top:30px;}
        .oneg .viewbtn a{background:none;border:2px solid ${currentColor};color:#000;padding:14px 35px;}
        .oneg .viewbtn a:hover{background:${currentColor};color:#fff;}

        .oneg .video-wrap{background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928204/shopora/1g/xo9q8dcjmavozjzssxih.jpg) no-repeat top;background-size:cover;padding:100px 0;}
        .oneg .video-wrap p{font-size:24px;color:#fff;line-height:36px;text-align:center;padding:0 100px;}
        .oneg .playbtn{text-align:center;margin-top:80px;position:relative;}
        .oneg .playbtn:before{content:"";background:#fff;width:600px;height:2px;position:absolute;top:50%;left:50%;margin-left:-300px;}
        .oneg .playbtn a{box-sizing:content-box;display:inline-block;width:32px;height:44px;background:#fff;border-radius:50%;padding:18px 20px 18px 28px;position:relative;}
        .oneg .playbtn a:before{content:"";position:absolute;z-index:0;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);display:block;width:80px;height:80px;background:#fff;border-radius:50%;animation:pulse-border 1500ms ease-out infinite;}
        .oneg .playbtn a span{display:inline-block;position:relative;z-index:3;width:0;height:0;border-left:32px solid ${currentColor};border-top:22px solid transparent;border-bottom:22px solid transparent;}
        @keyframes pulse-border{0%{transform:translateX(-50%)translateY(-50%)scale(1);opacity:1;}100%{transform:translateX(-50%)translateY(-50%)scale(1.5);opacity:0;}}

        .oneg .expert-wrap{padding:60px 0;}
        .oneg .expert-wrap .title{text-align:center;}
        .oneg .expert-wrap .title h1{display:inline-block;}
        .oneg .expert-wrap .title h1:before{left:50%;margin-left:-35px;}
        .oneg .expert-wrap ul{display:flex;flex-wrap:wrap;gap:30px;justify-content:center;}
        .oneg .expert-wrap ul li{flex:0 0 calc(33.333% - 20px);min-width:280px;}
        .oneg .expert-wrap h3{font-size:26px;font-weight:bold;text-align:center;background:${currentColor};padding:10px 0;color:#fff;}
        .oneg .expert-wrap h3 span{display:block;font-size:14px;font-weight:normal;font-family:'Open Sans',sans-serif;}
        .oneg .expertImg{position:relative;}
        .oneg .overlay{height:100%;width:100%;position:absolute;top:0;opacity:0;z-index:9;transform:scale(1);transition:all .3s;background:rgba(255,255,255,.8);text-align:center;}
        .oneg .overlay h2{margin:180px 0 0 0;}
        .oneg .overlay h2 a{border:1px solid ${currentColor};color:${currentColor};text-decoration:none;display:inline-block;font-size:18px;font-weight:bold;padding:20px 90px;transition:all .3s;}
        .oneg .social-media{bottom:50px;left:0;position:absolute;right:0;}
        .oneg .expert-wrap ul li:hover .overlay{opacity:1;transform:scale(.9);}
        .oneg .social-media li{display:inline-block;margin:0 10px;}
        .oneg .social-media li a{color:${currentColor};display:block;height:40px;padding:9px 0;width:42px;border:1px solid ${currentColor};text-decoration:none;text-align:center;}
        .oneg .social-media li a:hover{color:#fff;background:${currentColor};}

        .oneg #counter{text-align:center;background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928206/shopora/1g/an1znzytyw2kebnnxucp.jpg) no-repeat top;background-size:cover;padding:40px 0;}
        .oneg #counter .counter-number{display:block;color:#fff;font-size:60px;line-height:60px;}
        .oneg #counter span{color:#fff;font-weight:bold;}
        .oneg .counter-icon{font-size:60px;margin-bottom:15px;color:#fff;}

        .oneg .blog-wrap{background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928207/shopora/1g/ofidd8ermxwjzup36rj0.png) no-repeat top;background-size:cover;padding:60px 0;}
        .oneg .blog-wrap .title{text-align:center;}
        .oneg .blog-wrap .title h1{display:inline-block;}
        .oneg .blog-wrap .title h1:before{left:50%;margin-left:-35px;}
        .oneg .blog-wrap ul{display:flex;flex-wrap:wrap;gap:30px;justify-content:center;}
        .oneg .blog-wrap ul li{flex:0 0 calc(33.333% - 20px);min-width:280px;}
        .oneg .blogInfo{background:#fff;padding:25px;}
        .oneg .blog_dete{font-size:16px;background:${currentColor};display:inline-block;padding:14px 16px;text-align:center;line-height:30px;font-weight:600;color:#fff;margin-top:-55px;border:5px solid #fff;float:left;margin-right:15px;z-index:1000;position:relative;}
        .oneg .blog_dete span{display:block;font-size:36px;font-weight:bold;}
        .oneg .blogImg{position:relative;overflow:hidden;}
        .oneg .blog-wrap li:hover img{transform:scale(1.1);}
        .oneg .blogImg img{transition:all .3s;}
        .oneg .blogInfo h3 a{font-size:24px;font-weight:600;color:#000;text-decoration:none;}
        .oneg .blogInfo h3 a:hover{color:${currentColor};}
        .oneg .blogInfo p{margin-bottom:0;}

        .oneg .footer-wrap{background:url(https://res.cloudinary.com/dno6yitvw/image/upload/v1780928209/shopora/1g/lsofrc2npnlnqurecp9e.jpg) no-repeat top;background-size:cover;padding:60px 0 10px 0;text-align:center;}
        .oneg .footer-container{max-width:800px;margin:0 auto;}
        .oneg .footerLinks{border-top:1px solid #fff;border-bottom:1px solid #fff;padding:14px 0;margin-top:25px;}
        .oneg .footerLinks li{display:inline-block;padding:0 15px;}
        .oneg .footerLinks li a{text-decoration:none;color:#fff;font-size:14px;font-weight:600;}
        .oneg .footerLinks li a:hover{color:${currentColor};}
        .oneg .newsletter{max-width:500px;margin:40px auto 0;}
        .oneg .newsletter .form-control{border-radius:0;height:46px;font-size:14px;}
        .oneg .newsletter .btn{background:${currentColor};color:#fff;padding:10px 40px;border-radius:0;font-weight:bold;border:none;}
        .oneg .newsletter .btn:hover{background:#d24512;}
        .oneg .follow{color:#fff;font-weight:bold;margin-bottom:15px;}
        .oneg .footer-social li{display:inline-block;padding:0 2px;}
        .oneg .footer-social li a{border:1px solid #4c4945;width:40px;height:40px;font-size:18px;line-height:40px;border-radius:100%;text-decoration:none;display:block;color:#ddd;text-align:center;}
        .oneg .footer-social li a:hover{background:${currentColor};color:#fff;}
        .oneg .copyright{border-top:1px solid #4c4945;padding-top:14px;margin-top:25px;color:#fff;font-size:14px;}

        .oneg .contact_wraper{padding:60px 0;text-align:center;}
        .oneg .contact_wraper h1{display:inline-block;}
        .oneg .contact_wraper h1:before{left:50%;margin-left:-35px;}
        .oneg .contact_wraper .call{font-size:30px;color:#000;}
        .oneg .contact_wraper .call a{color:${currentColor};font-weight:bold;text-decoration:none;}
        .oneg .contactText{font-size:18px;font-family:'Roboto Condensed',sans-serif;color:#333;margin-top:10px;letter-spacing:6px;text-transform:uppercase;}
        .oneg .contact_wraper .input-group{width:100%;margin-top:18px;}
        .oneg .contact_wraper .input-group .form-control{height:44px;font-size:14px;border-radius:0;}
        .oneg .contact_wraper textarea.form-control{height:115px!important;}
        .oneg .contact_wraper .contactbtn{text-align:center;display:block;}
        .oneg .contact_wraper .formwrap .btn{padding:12px 38px;font-size:18px;background:${currentColor};border-radius:30px;color:#fff;display:inline-block;font-weight:bold;text-transform:uppercase;border:none;cursor:pointer;}
        .oneg .contact_wraper .formwrap .btn:hover{background:#000;}

        .oneg #style-switcher{background:#fff;border-radius:0 0 3px;box-shadow:0 0 20px rgba(0,0,0,.2);position:fixed;top:168px;width:220px;z-index:9999;transition:left .3s;}
        .oneg #style-switcher div{padding:0 10px;}
        .oneg #style-switcher h2{color:#333;font-family:montserrat,sans-serif;font-size:14px;margin:0;padding:10px 0;text-align:center;text-transform:uppercase;}
        .oneg #style-switcher h2 a{background:#a7a7a7;display:block;height:50px;position:absolute;right:-50px;top:0;width:50px;}
        .oneg #style-switcher h2 a i{color:#fff;font-size:26px;left:12px;position:absolute;top:12px;}
        .oneg .colors{padding-left:7px;list-style:none;margin:0 0 10px 0;overflow:hidden;}
        .oneg .colors li{float:left;}
        .oneg .colors li a{border-radius:100px;cursor:pointer;display:block;height:35px;margin:6px;width:35px;}
        .oneg .colors li a.active{box-shadow:0 0 0 2px #fff;}

        @media(max-width:990px){
          .oneg .navbar-toggler{display:block;position:absolute;top:10px;right:20px;background:transparent;border:1px solid rgba(255,255,255,.79);padding:4px 12px;}
          .oneg .bg-dark{background:rgba(0,0,0,.9)!important;}
          .oneg .navbar-dark .navbar-nav .nav-link{padding:10px;}
          .oneg .navbar-dark .navbar-nav .nav-link:hover{background:${currentColor};color:#fff;}
          .oneg .navbar{padding:0;}
          .oneg .collapse{display:none;width:100%;}
          .oneg .collapse.show{display:block;}
          .oneg .navbar-nav{display:flex;flex-direction:column;width:100%;}
          .oneg .navbar{display:block;width:100%;}
          .oneg .header-wrap{position:relative;background:#000;}
          .oneg .toggle-caret{display:block;position:absolute;right:15px;top:7px;font-size:20px;cursor:pointer;color:#fff;background:${currentColor};width:30px;height:30px;text-align:center;line-height:30px;z-index:10;}
          .oneg .navbar-nav>li>ul{position:static;width:100%;border:none;background:rgba(0,0,0,.5);visibility:visible;opacity:1;display:none;transition:none;}
          .oneg .navbar-nav>li.expanded>ul{display:block;}
          .oneg .pricingWrp{max-width:350px;margin:15px auto;}
          .oneg .video-wrap p{padding:0;}
          .oneg .expert-wrap ul li{max-width:370px;margin:15px auto;}
          .oneg .blog-wrap ul li{max-width:370px;margin:10px auto;}
          .oneg .join-wrap .readmore{margin-top:28px;}
        }
        @media(max-width:767px){
          .oneg .title h1{font-size:36px;}
          .oneg .header-wrap .logo img{width:160px;}
          .oneg .header-wrap{position:static;background:#000;padding:20px 0;}
          .oneg .navbar{margin:0;}
          .oneg .playbtn:before{width:400px;margin-left:-200px;}
          .oneg .slidertext01{font-size:60px;line-height:70px;}
          .oneg .slidertext02{font-size:22px;}
          .oneg .pricing-table>li{flex:0 0 100%;}
          .oneg .expert-wrap ul li{flex:0 0 100%;}
          .oneg .blog-wrap ul li{flex:0 0 100%;}
        }
        @media(max-width:480px){
          .oneg .title h1{font-size:30px;}
          .oneg .playbtn:before{display:none;}
          .oneg .slidertext01{font-size:40px;line-height:50px;}
        }
      `}</style>

      <div
        className="oneg"
        style={{
          "--whatwe-bg": `url(${IMAGES.whatweBg})`,
        } as React.CSSProperties}
      >
        {/* Color Switcher */}
        <div id="style-switcher" style={{ left: switcherOpen ? "0" : "-220px" }}>
          <h2>
            Choose Your Color
            <a href="#" onClick={(e) => { e.preventDefault(); setSwitcherOpen(!switcherOpen); }}>
              <i className="fa fa-cog fa-spin"></i>
            </a>
          </h2>
          <div>
            <ul className="colors">
              {Object.entries(colorMap).map(([name]) => (
                <li key={name}>
                  <a
                    href="#"
                    className={`${name}${activeColor === name ? " active" : ""}`}
                    style={{ background: colorMap[name] }}
                    onClick={(e) => { e.preventDefault(); setActiveColor(name); }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Header */}
        <div className="header-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="logo">
                  <a href="#home"><img src={IMAGES.logo} alt="" /></a>
                </div>
                <div className="navbar-dark">
                  <button className="navbar-toggler" type="button" onClick={() => {
                    const el = document.getElementById("navbarColor01");
                    if (el) el.classList.toggle("show");
                  }} aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                </div>
              </div>
              <div className="col-lg-8">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                  <div className="container">
                    <a className="navbar-brand" href="#">Menu</a>
                    <div className="collapse navbar-collapse" id="navbarColor01">
                      <ul className="navbar-nav mr-auto">
                        {NAV_ITEMS.map((item) => {
                          const hasSub = !!item.submenu;
                          const isExpanded = !!expandedMenus[item.name];
                          return (
                            <li key={item.name} className="nav-item">
                              <a className="nav-link" href={item.href}>
                                {item.name}
                              </a>
                              {hasSub && (
                                <i
                                  className="fa fa-caret-down toggle-caret"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setExpandedMenus(prev => ({ ...prev, [item.name]: !prev[item.name] }));
                                  }}
                                />
                              )}
                              {hasSub && (
                                <ul className="submenu">
                                  {item.submenu.map((sub, idx) => (
                                    <li key={idx}>
                                      <a href={sub.href}>{sub.name}</a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Revolution Slider - exact match to reference */}
        <div className="tp-banner-container sliderWraper" id="home">
          <div className="tp-banner">
            <ul>
              {SLIDES.map((slide, i) => (
                <li
                  key={i}
                  data-slotamount="7"
                  data-transition={i === 0 ? "3dcurtain-horizontal" : "slotzoom-horizontal"}
                  data-masterspeed="1000"
                  data-saveperformance="on"
                  className={
                    i === currentSlide ? "active" :
                    i === (currentSlide - 1 + SLIDES.length) % SLIDES.length ? "prev" : ""
                  }
                >
                  <img alt="" src="images/dummy.png" data-lazyload={slide.bg} />
                  <div className="caption lft large-title tp-resizeme slidertext2" data-x="center" data-y="235" data-speed="600" data-start="1000">
                    {slide.subtitle}
                  </div>
                  <div className="caption lfl large-title tp-resizeme slidertext1" data-x="center" data-y="270" data-speed="600" data-start="1600">
                    {slide.title}
                  </div>
                  <div className="caption lft large-title tp-resizeme slidertext3" data-x="center" data-y="380" data-speed="600" data-start="2200">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac magna nec mauris mattis<br />
                    semper. In cursus purus arcu, vitae auctor enim blandit vel.
                  </div>
                  <div className="caption lfb large-title tp-resizeme slidertext4" data-x="center" data-y="440" data-speed="600" data-start="2800">
                    <a href="#" className="slidebtn">Join Us <i className="fa fa-arrow-right" aria-hidden="true"></i></a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What We Do */}
        <div className="what_we-do_wrap">
          <div className="container">
            <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
              {[
                { img: IMAGES.fitness, title: "Fitness Center" },
                { img: IMAGES.training, title: "Trainning Center" },
                { img: IMAGES.yoga, title: "Yoga Center" },
              ].map((item, i) => (
                <div key={i} className="col-lg-4" style={{ flex: "0 0 33.333%", maxWidth: "33.333%", padding: "0 15px", marginBottom: "30px" }}>
                  <div className="what_we_img" style={{ border: `6px solid ${currentColor}` }}><img src={item.img} alt="" style={{ width: "100%", display: "block" }} /></div>
                  <h3>{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="about-wrap" id="about">
          <div className="container">
            <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
              <div className="col-lg-7" style={{ flex: "0 0 58.333%", maxWidth: "58.333%", padding: "0 15px" }}>
                <div className="title">
                  <h1><span>Welcome To</span> FITNESS PROGRAMME</h1>
                </div>
                <p><strong>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac magna nec mauris mattis semper. In cursus purus arcu, vitae auctor enim blandit arcu vel.</strong></p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac erat a diam rutrum laoreet. Cras vitae fringilla turpis. In laoreet nunc vel lacinia luctus. Nullam suscipit volutpat magna, vel tempus mauris auctor non. Duis nec orci egestas, hendrerit purus non, egestas diam. Donec viverra arcu quam, vel aliquam libero sagittis ut. Aenean non mauris vel nisl pulvinar malesuada ut non dui. Praesent ante nisi, varius vitae tincidunt rutrum, suscipit id mauris. Nunc et porta quam, et porttitor lorem. In sagittis nisl non quam varius, iaculis scelerisque urna bibendum.</p>
                <div className="readmore"><a href="#">Read More <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i></a></div>
              </div>
              <div className="col-lg-5" style={{ flex: "0 0 41.667%", maxWidth: "41.667%", padding: "0 15px" }}>
                <div className="aboutImg" style={{ marginTop: "20px" }}><img src={IMAGES.aboutImg} alt="" style={{ width: "100%" }} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Join */}
        <div className="join-wrap">
          <div className="container">
            <div className="row" style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
              <div className="col-lg-9" style={{ flex: "0 0 75%", maxWidth: "75%", padding: "0 15px", position: "relative", zIndex: 1 }}>
                <div className="title">
                  <h1>Join Us Today!</h1>
                </div>
                <p>Aenean non mauris vel nisl pulvinar malesuada ut non dui. Praesent ante nisi, varius vitae tincidunt rutrum, suscipit id mauris. Nunc et porta quam, et porttitor lorem. In sagittis nisl non quam varius, iaculis scelerisque urna bibendum. Pellentesque molestie, felis suscipit maximus ultricies.</p>
              </div>
              <div className="col-lg-3" style={{ flex: "0 0 25%", maxWidth: "25%", padding: "0 15px", position: "relative", zIndex: 1 }}>
                <div className="readmore"><a href="#">Join Us Now <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i></a></div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="gallery-wrap fullwidth style-one" id="gallery">
          <div className="container">
            <div className="title">
              <h1>Our Gallery</h1>
            </div>
            <div className="sortable-masonry">
              <div className="filters text-center">
                <ul className="filter-tabs filter-btns" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["all", "gym", "fitness", "yoga", "running"].map((f) => (
                    <li
                      key={f}
                      className={`filter${activeFilter === f ? " active" : ""}`}
                      onClick={() => setActiveFilter(f)}
                    >
                      <span className="txt">{f.charAt(0).toUpperCase() + f.slice(1)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="items-container row" style={{ display: "flex", flexWrap: "wrap" }}>
                {GALLERY_IMAGES.map((item, i) => {
                  const visible = activeFilter === "all" || item.filter.includes(activeFilter);
                  return (
                    <div
                      key={i}
                      className="col-lg-4 col-md-4 col-sm-6"
                      style={{ flex: "0 0 33.333%", maxWidth: "33.333%", padding: "0 15px", display: visible ? "block" : "none" }}
                    >
                      <div className="default-portfolio-item masonry-item">
                        <div className="inner-box">
                          <div className="image-box"><img src={item.src} alt="" style={{ width: "100%" }} /></div>
                          <div className="overlay-box">
                            <div className="overlay-inner">
                              <div className="content">
                                <h3><a href="#">{item.title}</a></h3>
                              </div>
                            </div>
                          </div>
                          <a href={item.src} className="image-link" data-fancybox="images" title="Image Caption Here" onClick={(e) => e.preventDefault()}>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Classes */}
        <div className="classes-wrap" id="classes">
          <div className="container">
            <div className="title center">
              <h1>Our Popular Classes</h1>
            </div>
            <div className="owl-carousel">
              {[
                { img: IMAGES.weightLifting, title: "Yoga Class", author: "Jhon Carry", time: "08:00 AM" },
                { img: IMAGES.running, title: "Weight Lifting Class", author: "Jhon Carry", time: "08:00 AM" },
                { img: IMAGES.weight, title: "Running Class", author: "Jhon Carry", time: "08:00 AM" },
              ].map((item, i) => (
                <div key={i} className="item">
                  <div className="classInfo">
                    <div className="classImg"><img src={item.img} alt="" style={{ width: "100%" }} /></div>
                    <h3><a href="#">{item.title}</a></h3>
                    <div className="author">
                      <span><i className="fa fa-user" aria-hidden="true"></i> {item.author}</span>
                      <span><i className="fa fa-clock-o" aria-hidden="true"></i> {item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="pricing-wrap" id="prices">
          <div className="container">
            <div className="title">
              <h1>Our Pricing Table</h1>
            </div>
            <ul className="row pricing-table">
              {["Basic", "Standard", "Premium"].map((plan, i) => (
                <li key={i}>
                  <div className="pricingWrp">
                    <h3>{plan}</h3>
                    <div className="dollarPrice">$99/<span>Month</span></div>
                    <ul className="tableList" style={{ listStyle: "none", padding: 0 }}>
                      <li>Gym Fitness</li>
                      <li>Yoga</li>
                      <li>Running</li>
                      <li>Body Building</li>
                    </ul>
                    <div className="readmore viewbtn"><a href="#">View Details</a></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Video */}
        <div className="video-wrap">
          <div className="container">
            <div className="title center">
              <h1>Watch Video</h1>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt laoreet.</p>
            <div className="playbtn"><a href="#"><span></span></a></div>
          </div>
        </div>

        {/* Expert Trainers */}
        <div className="expert-wrap" id="trainers">
          <div className="container">
            <div className="title">
              <h1>Our Expert Trainers</h1>
            </div>
            <ul>
              {[
                { img: IMAGES.expert02, name: "John Doe", role: "Fitness Trainer" },
                { img: IMAGES.expert01, name: "Selina Stuart", role: "Fitness Trainer" },
                { img: IMAGES.expert03, name: "Williamson", role: "Fitness Trainer" },
              ].map((trainer, i) => (
                <li key={i}>
                  <div className="expertImg">
                    <img src={trainer.img} alt="" style={{ width: "100%", display: "block" }} />
                    <div className="overlay">
                      <h2><a href="#">View Bio</a></h2>
                      <div className="social-media">
                        <ul style={{ listStyle: "none", padding: 0 }}>
                          {["facebook", "twitter", "linkedin", "skype"].map((s) => (
                            <li key={s}>
                              <a href="#"><i className={`fa fa-${s}`}></i></a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <h3>{trainer.name} <span>{trainer.role}</span></h3>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shop / Products */}
        {props.products && props.products.length > 0 && (
          <ShopSection products={props.products} slug={props.slug} categories={props.categories} currentColor={currentColor} />
        )}

        {/* Counter */}
        <div id="counter">
          <div className="container">
            <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
              {[
                { icon: "fa-users", to: "399", text: "Happy Client", speed: "1000" },
                { icon: "fa-code", to: "8312", text: "Code Line", speed: "2000" },
                { icon: "fa-laptop", to: "1632", text: "Project Finished", speed: "3000" },
                { icon: "fa-trophy", to: "206", text: "Awards", speed: "4000" },
              ].map((item, i) => (
                <div key={i} className="col-md-3 col-sm-3" style={{ flex: "0 0 25%", maxWidth: "25%", padding: "15px" }}>
                  <div className="counterbox">
                    <div className="counter-icon"><i className={`fa ${item.icon}`} aria-hidden="true"></i></div>
                    <span className="counter-number" data-from="1" data-to={item.to} data-speed={item.speed}>{item.to}</span>
                    <span className="counter-text">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blog */}
        <div className="blog-wrap" id="blog">
          <div className="container">
            <div className="title">
              <h1>Our Blog</h1>
            </div>
            <ul>
              {[
                { img: IMAGES.blog01, title: "Duis eu tempor urna non lorem", desc: "Cu laoreet repudiare vel, sit no esse meis propriae. Ad quot vidit delectus est." },
                { img: IMAGES.blog02, title: "Nam ut diam", desc: "Cu laoreet repudiare vel, sit no esse meis propriae. Ad quot vidit delectus est, ex semper consequat cum." },
                { img: IMAGES.blog03, title: "Nulla dignissim porta mauris", desc: "Cu laoreet repudiare vel, sit no esse meis propriae. Ad quot vidit delectus est." },
              ].map((post, i) => (
                <li key={i}>
                  <div className="blogImg"><img src={post.img} alt="" style={{ width: "100%", display: "block" }} /></div>
                  <div className="blogInfo">
                    <div className="blog_dete">Jan <span>10</span></div>
                    <h3 style={{ lineHeight: "24px" }}><a href="#">{post.title}</a></h3>
                    <p>{post.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="contact_wraper" id="contact-us">
          <div className="container">
            <div className="title"><h1>Contact Us Now</h1></div>
            <div className="call"><a href="tel:7771234567">(777) 123 4567</a> &nbsp; or &nbsp; <a href="tel:7771234567">(777) 123 4567</a></div>
            <div className="contactText">Or Submit below form to contact us</div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row formwrap" style={{ display: "flex", flexWrap: "wrap", maxWidth: "900px", margin: "0 auto" }}>
                <div className="col-md-3" style={{ flex: "0 0 25%", maxWidth: "25%", padding: "0 15px" }}>
                  <div className="input-group"><input type="text" name="name" placeholder="First Name" className="form-control" style={{ width: "100%", boxSizing: "border-box" }} /></div>
                </div>
                <div className="col-md-3" style={{ flex: "0 0 25%", maxWidth: "25%", padding: "0 15px" }}>
                  <div className="input-group"><input type="text" name="email" placeholder="Last Name" className="form-control" style={{ width: "100%", boxSizing: "border-box" }} /></div>
                </div>
                <div className="col-md-3" style={{ flex: "0 0 25%", maxWidth: "25%", padding: "0 15px" }}>
                  <div className="input-group"><input type="text" name="phone" placeholder="Your Email" className="form-control" style={{ width: "100%", boxSizing: "border-box" }} /></div>
                </div>
                <div className="col-md-3" style={{ flex: "0 0 25%", maxWidth: "25%", padding: "0 15px" }}>
                  <div className="input-group"><input type="text" name="date" placeholder="Phone" className="form-control" style={{ width: "100%", boxSizing: "border-box" }} /></div>
                </div>
                <div className="col-md-6" style={{ flex: "0 0 50%", maxWidth: "50%", padding: "0 15px" }}>
                  <div className="input-group"><textarea placeholder="Address" className="form-control" style={{ width: "100%", boxSizing: "border-box" }}></textarea></div>
                </div>
                <div className="col-md-6" style={{ flex: "0 0 50%", maxWidth: "50%", padding: "0 15px" }}>
                  <div className="input-group"><textarea placeholder="Message" className="form-control" style={{ width: "100%", boxSizing: "border-box" }}></textarea></div>
                </div>
                <div className="col-md-12" style={{ flex: "0 0 100%", maxWidth: "100%", padding: "0 15px" }}>
                  <div className="input-group contactbtn">
                    <input type="submit" className="btn" value="Submit Now" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-wrap">
          <div className="container footer-container">
            <div className="footoer-logo"><img src={IMAGES.logo} alt="" /></div>
            <ul className="footerLinks" style={{ listStyle: "none", padding: 0 }}>
              {NAV_ITEMS.map((item) => (
                <li key={item.name}><a href={item.href}>{item.name.toUpperCase()}</a></li>
              ))}
            </ul>
            <div className="newsletter">
              <div className="input-group" style={{ display: "flex" }}>
                <input type="text" className="form-control" placeholder="Enter Your Email" style={{ flex: 1 }} />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button">Sign Up</button>
                </div>
              </div>
            </div>
            <div className="follow">Follow Us</div>
            <ul className="footer-social" style={{ listStyle: "none", padding: 0 }}>
              {["facebook", "twitter", "instagram", "pinterest-p", "youtube"].map((s) => (
                <li key={s} style={{ display: "inline-block", padding: "0 2px" }}>
                  <a href="#" style={{ border: "1px solid #4c4945", width: "40px", height: "40px", fontSize: "18px", lineHeight: "40px", borderRadius: "100%", textDecoration: "none", display: "block", color: "#ddd", textAlign: "center" }}>
                    <i className={`fa fa-${s}`} aria-hidden="true"></i>
                  </a>
                </li>
              ))}
            </ul>
            <div className="copyright">Copyright &copy; 2018 Fitness Center. All Rights Reserved.</div>
          </div>
        </div>
      </div>
    </>
  );
}
