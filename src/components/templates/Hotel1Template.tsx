"use client";
import { useInsertionEffect, useState, useEffect, useCallback } from "react";
import { Hotel1Images as I } from "./Hotel1Images";

const rooms = [
  { id: "single", name: "Single Room", price: 360, img: I.card1, desc: "At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget." },
  { id: "queen", name: "Queen Room", price: 360, img: I.card2, desc: "At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget." },
  { id: "quad", name: "Quad Room", price: 360, img: I.card3, desc: "At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget." },
  { id: "double", name: "Double Room", price: 360, img: I.card4, desc: "At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget." },
];

const suites = [
  { id: "grand", name: "Grand Luxury Room", price: 360, img: I.coupleRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make Explore the intricacies of our journey, commitment to hospitality, and the unique features." },
  { id: "family", name: "Family Room", price: 380, img: I.familyRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make Explore the intricacies of our journey, commitment to hospitality, and the unique features." },
  { id: "deluxe", name: "Deluxe Room", price: 430, img: I.deluxeRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make Explore the intricacies of our journey, commitment to hospitality, and the unique features." },
];

const amenities = [
  { icon: I.iconWashroom, label: "LARGE BATHROOM", top: true },
  { icon: I.iconWiFi, label: "HIGH SPEED WIFI", top: false },
  { icon: I.iconSea, label: "AIR CONDITION", top: true },
  { icon: I.iconParking, label: "FREE PARKING", top: false },
  { icon: I.iconPets, label: "PETS ALLOWED", top: true },
  { icon: I.iconWashingMachine, label: "WASHING", top: false },
];

const team = [
  { name: "Jonathan Hall", role: "General Manager", img: I.user1 },
  { name: "Jonathan Hall", role: "General Manager", img: I.user2 },
  { name: "Jonathan Hall", role: "General Manager", img: I.user3 },
];

const blogs = [
  { id: 1, title: "Top 10 Luxury Hotel Amenities", date: "12.03.2025", img: I.blogDetail, cat: "Hotel" },
  { id: 2, title: "Spa & Wellness Guide 2025", date: "10.03.2025", img: I.blogDetail1, cat: "Spa" },
  { id: 3, title: "Fine Dining Experience", date: "08.03.2025", img: I.blogDetail2, cat: "Restaurant" },
];

const gallery = [I.gallery1, I.gallery2, I.gallery3, I.gallery4, I.gallery5, I.gallery6, I.gallery7];

const heroSlides = [
  { bg: I.bg_banner, bgMob: I.bg_mobileBanner, title: "Luxury Suite", sub: "Discounted Prices", align: "center" },
  { bg: I.bg_banner2, bgMob: I.bg_mobileBanner2, title: "Luxury Suite", sub: "Discounted Prices", align: "right" },
  { bg: I.bg_banner3, bgMob: I.bg_mobileBanner3, title: "Luxury Suite", sub: "Discounted Prices", align: "left" },
];

const styles = {
  icn: (w = 20, h = 20) => ({ width: w, height: h, fill: "none" } as const),
  svg: (p: string, w = 20, h = 20) => <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none" xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: p }} />,
};

function Icon({ name, size = 20, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const paths: Record<string, string> = {
    star: '<path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.48l-4.77 2.51.91-5.33L2.27 6.62l5.34-.78L10 1z" fill="' + color + '"/>',
    phone: '<path d="M17.657 16.657L13.414 12.5a1 1 0 00-1.414 0l-1.586 1.586a1 1 0 01-1.414 0L6.328 10.9a1 1 0 010-1.414L7.914 7.9a1 1 0 000-1.414L3.757 2.343M6.5 21h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    envelope: '<path d="M4 6h16v12H4V6zm0 0l8 5 8-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "location-dot": '<path d="M12 2a8 8 0 00-8 8c0 5.33 8 12 8 12s8-6.67 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" fill="currentColor"/>',
    user: '<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 10c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z" fill="currentColor"/>',
    "magnifying-glass": '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "arrow-up": '<path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "arrow-left": '<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>',
    "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2"/>',
    "chevron-down": '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "chevron-left": '<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2"/>',
    "chevron-right": '<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>',
    "caret-down": '<path d="M4 8l6 6 6-6" fill="currentColor"/>',
    times: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    bars: '<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "play-circle": '<circle cx="16" cy="16" r="14" fill="rgba(255,255,255,.2)"/><path d="M12 10l8 6-8 6V10z" fill="white"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" fill="currentColor"/>',
    twitter: '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" fill="currentColor"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor"/>',
    play: '<path d="M11.946 22.207L22.692 16l-10.746-6.207v12.414z" fill="currentColor"/><circle cx="16" cy="16" r="15" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  };
  const d = paths[name];
  if (!d) return null;
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: d }} />;
}

function CusBtn({ label, dark, onClick }: { label: string; dark?: boolean; onClick?: () => void }) {
  return (
    <button className={"cus-btn" + (dark ? " dark" : "")} onClick={onClick}>
      <span><samp className="text">{label}</samp><samp className="effect">{label}</samp></span>
    </button>
  );
}

interface Hotel1Props {
  store?: any;
  banners?: any[];
  settings?: any;
  products?: any[];
  slug?: string;
  categories?: any[];
}

const pageNavLinks = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Rooms", page: "rooms", children: [{ label: "Room Grid", page: "rooms" }, { label: "Room List", page: "rooms" }, { label: "Room Detail", page: "room-detail" }] },
  { label: "Blogs", page: "blog", children: [{ label: "Blog Grid", page: "blog" }, { label: "Blog Sidebar", page: "blog" }, { label: "Blog Detail", page: "blog-detail" }] },
  { label: "Pages", page: "home", children: [{ label: "Restaurant", page: "restaurant" }, { label: "Spa & Relax", page: "spa" }, { label: "Gallery", page: "gallery" }, { label: "Contact", page: "contact" }, { label: "Booking", page: "booking" }] },
  { label: "Contact", page: "contact" },
];

export default function Hotel1Template(props: Hotel1Props) {
  useInsertionEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
:root{--primary:#978667;--dark:#282525;--light:#fcfdfd;--text:#6e6e6e;--white:#fff;--black:#000;--ff-h:'Open Sans',sans-serif;--ff-b:'Lato',sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--ff-b);background:var(--light);color:var(--text);overflow-x:hidden;line-height:1.7}
a{text-decoration:none;color:inherit;cursor:pointer}
img{max-width:100%;height:auto;display:block}
ul{list-style:none}
input,button,textarea,select{font-family:inherit}
.hotel-root{min-height:100vh;overflow:hidden}
.container-fluid{width:100%;padding:0 40px;margin:0 auto}
@media(max-width:992px){.container-fluid{padding:0 20px}}
.preloader{position:fixed;inset:0;background:var(--dark);display:flex;align-items:center;justify-content:center;z-index:99999;transition:opacity 0.5s,visibility 0.5s}
.preloader.loaded{opacity:0;visibility:hidden;pointer-events:none}
.preloader svg{animation:spin 2s linear infinite}
.preloader svg path{fill:var(--primary)}
@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
.scroll-top{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:var(--primary);border:none;border-radius:50%;color:var(--white);z-index:9997;opacity:0;visibility:hidden;transform:translateY(20px);transition:0.3s;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 20px rgba(151,134,103,0.4)}
.scroll-top.visible{opacity:1;visibility:visible;transform:translateY(0)}
.scroll-top:hover{transform:translateY(-5px)}
.cus-btn{display:inline-flex;align-items:center;justify-content:center;padding:16px 40px;background:var(--primary);color:var(--white);border:none;cursor:pointer;font-family:var(--ff-h);font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;transition:0.3s;overflow:hidden;position:relative}
.cus-btn span{display:flex;flex-direction:column;height:16px;overflow:hidden}
.cus-btn span samp{display:block;transition:0.4s}
.cus-btn span .text{transform:translateY(0)}
.cus-btn span .effect{transform:translateY(-200%)}
.cus-btn:hover span .text{transform:translateY(-200%)}
.cus-btn:hover span .effect{transform:translateY(0)}
.cus-btn.dark{background:transparent;color:var(--dark);border:2px solid var(--dark)}
.cus-btn.dark:hover{background:var(--dark);color:var(--white)}
.home-header{position:fixed;top:0;left:0;width:100%;z-index:999;background:transparent;padding:30px 40px;transition:0.3s}
.home-header.scrolled{background:rgba(40,37,37,0.95);backdrop-filter:blur(10px);padding:15px 40px}
.header-inner_pages{position:fixed;top:0;left:0;width:100%;z-index:999;background:var(--dark);padding:15px 40px}
.home-header .d-flex,.header-inner_pages .d-flex{display:flex;align-items:center;justify-content:space-between;max-width:1400px;margin:0 auto}
.home-header .logo img,.header-inner_pages .logo img{height:45px}
.home-header .link,.header-inner_pages .link{display:flex;align-items:center;gap:5px;margin:0}
.home-header .link > li > a,.header-inner_pages .link > li > a{padding:10px 18px;color:var(--white);font-family:var(--ff-h);font-size:14px;font-weight:600;transition:0.3s;position:relative}
.home-header .link > li > a:hover,.home-header .link > li > a.active,.header-inner_pages .link > li > a:hover,.header-inner_pages .link > li > a.active{color:var(--primary)}
.link-has-children{position:relative}
.link-has-children > a.sub-menu::after{content:"";display:inline-block;width:6px;height:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);margin-left:6px;margin-bottom:2px;transition:0.3s}
.link-has-children:hover .sub-menu-list{opacity:1;visibility:visible;transform:translateY(0)}
.sub-menu-list{position:absolute;top:100%;left:0;min-width:200px;background:var(--white);box-shadow:0 10px 40px rgba(0,0,0,0.1);padding:10px 0;opacity:0;visibility:hidden;transform:translateY(10px);transition:0.3s;z-index:999}
.sub-menu-list li a{display:block;padding:10px 25px;color:var(--dark);font-size:14px;font-family:var(--ff-h);font-weight:500;transition:0.3s}
.sub-menu-list li a:hover{color:var(--primary);padding-left:30px}
.nav-logo .logo-icon{display:flex;align-items:center;gap:15px}
.search-block{display:flex;align-items:center;background:rgba(255,255,255,0.1);border-radius:50px;padding:0 15px}
.search-block input{background:transparent;border:none;color:var(--white);padding:10px 0;font-size:14px;outline:none;width:150px}
.search-block input::placeholder{color:rgba(255,255,255,0.6)}
.search-block button{background:transparent;border:none;cursor:pointer;display:flex;align-items:center;padding:10px}
.search-block button svg{color:var(--white);width:16px;height:16px}
.nav-logo .logo-icon > a svg{color:var(--white);width:20px;height:20px;transition:0.3s}
.nav-logo .logo-icon > a:hover svg{color:var(--primary)}
.mobile-header{display:none}
.mobile-header .btn{display:flex;align-items:center;justify-content:center;cursor:pointer;padding:8px}
.mobile-header .btn svg{width:24px;height:24px}
.home-header.scrolled .mobile-header .btn svg{fill:var(--white)}
.header-inner_pages .mobile-header .btn svg,.home-header .mobile-header .btn svg{fill:var(--white)}
.sidebar{position:fixed;top:0;right:-320px;width:300px;height:100vh;background:var(--white);z-index:9999;padding:30px;transition:0.4s;overflow-y:auto;box-shadow:-5px 0 30px rgba(0,0,0,0.1)}
.sidebar.open{right:0}
.sidebar .logo{margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid #eee}
.sidebar .logo img{height:40px}
.sidebar ul li a{display:block;padding:12px 0;color:var(--dark);font-family:var(--ff-h);font-size:15px;font-weight:600;border-bottom:1px solid #f0f0f0;transition:0.3s}
.sidebar ul li a:hover,.sidebar ul li.active > a{color:var(--primary)}
.sidebar ul li a.menu-btn{display:flex;align-items:center;justify-content:space-between}
.sidebar ul li a.menu-btn svg{transition:0.3s;width:12px;height:12px}
.sidebar ul li a.menu-btn.open svg{transform:rotate(180deg)}
.sidebar ul li .menu-item{display:none;padding-left:15px}
.sidebar ul li .menu-item.open{display:block}
.sidebar ul li .menu-item li a{font-size:14px;padding:10px 0;border-bottom:none}
.hero-banner{position:relative;min-height:100vh;overflow:hidden}
.banner__slider{position:relative;width:100%;height:100vh}
.banner__slider .slide{position:absolute;inset:0;opacity:0;transition:opacity 0.8s;z-index:1}
.banner__slider .slide.active{opacity:1;z-index:2}
.slide__img{position:absolute;inset:0;overflow:hidden}
.slide__img img.full-image{width:100%;height:100%;object-fit:cover;animation:zoomInImage 6s ease-in-out forwards}
@keyframes zoomInImage{0%{transform:scale(1)}100%{transform:scale(1.08)}}
.slide__content{position:absolute;inset:0;display:flex;align-items:center;z-index:3;padding:0 80px}
.slide__content__right{justify-content:flex-end}
.slide__content__left{justify-content:flex-start}
.slide__content--headings{max-width:700px}
.slide__content--headings h1{font-family:var(--ff-h);font-size:111px;font-weight:700;color:#282525;margin-bottom:10px;line-height:1.1;animation:fadeInUp 1s 0.3s both}
.slide__content--headings h4{font-family:var(--ff-h);font-size:56px;font-weight:400;color:#282525;animation:fadeInUp 1s 0.5s both}
.slide__content__left .slide__content--headings{text-align:left}
.slide__content__right .slide__content--headings{text-align:right}
.hero-dots{position:absolute;bottom:200px;left:50%;transform:translateX(-50%);z-index:5;display:flex;gap:10px}
.hero-dots button{width:12px;height:12px;border-radius:50%;border:2px solid rgba(40,37,37,0.4);background:transparent;cursor:pointer;transition:0.3s;padding:0}
.hero-dots button.active{border-color:var(--primary);background:var(--primary)}
.videoplayer{position:absolute;bottom:180px;right:80px;z-index:5}
.videoplayer .videoplay{cursor:pointer;transition:0.3s}
.videoplayer .videoplay:hover{transform:scale(1.1)}
.close-videoPlayer{display:none}
.booking{position:absolute;bottom:0;left:0;width:100%;z-index:5;padding:0 80px}
.booking-detail{background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);padding:25px 40px;border-radius:20px 20px 0 0}
.booking-detail .info{display:flex;align-items:center;justify-content:space-between;gap:20px}
.booking-detail .detail{display:flex;align-items:center;gap:20px;flex:1}
.booking-detail .detail .input-date-picker{flex:1}
.booking-detail label{font-family:var(--ff-h);font-size:14px;font-weight:700;color:var(--dark);display:block;margin-bottom:5px}
.booking-detail input.sel-input{width:100%;border:none;background:transparent;padding:8px 0;font-size:14px;color:var(--text);font-family:var(--ff-b);outline:none;border-bottom:1px solid #ddd}
.booking-detail input.sel-input::placeholder{color:#aaa}
.vertical-line{width:1px;height:40px;background:#ddd}
.custom-sel-input-block{position:relative}
.seat-booking{padding:8px 0;border-bottom:1px solid #ddd;font-size:14px;cursor:pointer;display:flex;align-items:center;gap:5px;color:var(--dark)}
.guest-area{position:absolute;top:100%;left:0;width:100%;min-width:280px;background:var(--white);box-shadow:0 10px 40px rgba(0,0,0,0.1);border-radius:10px;padding:20px;z-index:10;display:none}
.guest-area.open{display:block}
.guest-area h4{font-family:var(--ff-h);font-size:18px;color:var(--dark);margin-bottom:20px}
.guest-box{margin-bottom:15px}
.guest-box .row{display:flex;align-items:center;justify-content:space-between}
.guest-box .content-box h5{font-family:var(--ff-h);font-size:16px;color:var(--dark);font-weight:600}
.quantity{display:flex;align-items:center;gap:10px}
.quantity input[type="button"]{width:30px;height:30px;border:1px solid #ddd;background:var(--white);cursor:pointer;font-size:16px;border-radius:4px;transition:0.3s}
.quantity input[type="button"]:hover{background:var(--primary);color:var(--white);border-color:var(--primary)}
.quantity input.number{width:40px;text-align:center;border:none;font-size:16px;font-weight:600;color:var(--dark);background:transparent}
.rooms{position:relative;z-index:2;background:var(--light);padding:100px 0}
.sec-heading{text-align:center;margin-bottom:48px}
.sec-heading .sec-text{font-family:var(--ff-h);font-size:18px;font-weight:700;color:var(--dark);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
.sec-heading .sec-title{font-family:var(--ff-h);font-size:69px;font-weight:700;color:var(--dark);line-height:1.1}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.card-item{background:var(--white);border-radius:12px;overflow:hidden;transition:0.4s;display:block;box-shadow:0 5px 30px rgba(0,0,0,0.05)}
.card-item:hover{transform:translateY(-8px);box-shadow:0 15px 50px rgba(0,0,0,0.1)}
.card-image{position:relative;overflow:hidden}
.card-image > img.card-image{width:100%;height:280px;object-fit:cover;transition:0.5s}
.card-item:hover .card-image > img.card-image{transform:scale(1.08)}
.card-price{position:absolute;bottom:15px;left:15px;z-index:2}
.card-price p{display:flex;align-items:baseline;gap:5px;color:var(--white)}
.card-price p .price{font-family:var(--ff-h);font-size:31px;font-weight:700;color:var(--primary)}
.card-price p .light-bold{font-size:14px}
.card-image .icon{position:absolute;top:15px;right:15px;width:40px;height:40px;opacity:0;transform:translateY(-10px);transition:0.4s;z-index:2}
.card-item:hover .card-image .icon{opacity:1;transform:translateY(0)}
.card-image .corner-shape{position:absolute;bottom:0;right:0;width:100px;z-index:1}
.text-block{padding:24px}
.name-rating{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.name-rating h4{font-family:var(--ff-h);font-size:31px;color:var(--dark);font-weight:700}
.name-rating .rating p{display:flex;align-items:center;gap:5px;font-size:14px;color:var(--text)}
.name-rating .rating p svg{width:14px;height:14px;color:var(--primary)}
.sample-text{font-size:15px;color:var(--text);line-height:1.7;margin-bottom:32px}
.services{display:flex;gap:20px;flex-wrap:wrap}
.services li{display:flex;align-items:center;gap:8px}
.services li img{width:20px;height:20px;object-fit:contain}
.services li p{font-size:14px;font-weight:700;color:var(--dark);white-space:nowrap}
.btn-block{padding-top:40px}
.btn-block.text-end{text-align:right}
.resturent-video{position:relative;padding:0 40px}
.resturent-video .content{position:relative}
.resturent-video .top-cornner{position:absolute;top:-20px;right:-20px;z-index:2;width:100px}
.resturent-video .bottom-cornner{position:absolute;bottom:-20px;right:-20px;z-index:2;width:100px}
.resturent-video .bg-video{border-radius:20px;overflow:hidden;position:relative}
.resturent-video .bg-video video{width:100%;height:500px;object-fit:cover;display:block}
.suite-room{padding:100px 0}
.suite-room .sec-heading.sec{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:48px;flex-wrap:wrap;gap:20px}
.suite-room .sec-heading .heading-content{text-align:right}
.suite-room .sec-heading .heading-content p{font-family:var(--ff-h);font-size:18px;font-weight:700;color:var(--dark);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
.suite-room .sec-heading .heading-content h2{font-family:var(--ff-h);font-size:69px;font-weight:700;color:var(--dark)}
.slider-arrow{display:flex;gap:15px}
.slider-arrow .arrow{width:55px;height:55px;border:1px solid #ddd;border-radius:50%;background:var(--white);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.3s}
.slider-arrow .arrow:hover{border-color:var(--primary);background:var(--primary)}
.slider-arrow .arrow:hover svg path{stroke:var(--white)}
.slider-arrow .arrow svg{width:32px;height:32px}
.slider-arrow .arrow svg path{stroke:var(--dark);transition:0.3s}
.suite-room .room-slider .slide{display:flex;align-items:center;gap:60px}
.suite-room .room-slider .slide__img{flex:0 0 55%;position:relative}
.suite-room .room-slider .slide__img img.room_image{width:100%;height:500px;object-fit:cover;border-radius:20px}
.suite-room .room-slider .slide__img .side_vector{position:absolute;top:-30px;left:-30px;width:120px;z-index:-1}
.suite-room .room-slider .slide__img .side_vector_mobile{display:none}
.suite-room .room-slider .slide__content{flex:1}
.suite-room .room-slider .slide__content .content-block h2{font-family:var(--ff-h);font-size:53px;color:var(--dark);font-weight:700}
.suite-room .room-slider .slide__content .content-block h2 a:hover{color:var(--primary)}
.suite-room .room-slider .slide__content .price-rating{display:flex;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:32px}
.suite-room .room-slider .slide__content .price-rating p{display:flex;align-items:baseline;gap:5px}
.suite-room .room-slider .slide__content .price-rating .h-40{font-family:var(--ff-h);font-size:40px;font-weight:700;color:var(--primary)}
.suite-room .room-slider .slide__content .price-rating .light-bold{font-size:14px;color:var(--dark)}
.suite-room .room-slider .slide__content .price-rating .reviews-text{font-size:14px;display:flex;align-items:center;gap:8px}
.suite-room .room-slider .slide__content .price-rating .reviews-text svg{width:14px;height:14px;color:var(--primary)}
.suite-room .room-slider .slide__content p.reviews-text{font-size:15px;color:var(--text);line-height:1.8;margin-bottom:32px}
.page-hero{position:relative;min-height:400px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.page-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.page-hero .overlay{position:absolute;inset:0;background:rgba(40,37,37,0.6)}
.page-hero .content{position:relative;z-index:3;text-align:center}
.page-hero .content h1{font-family:var(--ff-h);font-size:69px;font-weight:700;color:var(--white);margin-bottom:10px}
.page-hero .content p{font-size:18px;color:rgba(255,255,255,0.8)}
.about-section{padding:100px 0}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.about-image{position:relative;border-radius:20px;overflow:hidden}
.about-image img{width:100%;height:auto;border-radius:20px}
.about-info h2{font-family:var(--ff-h);font-size:53px;color:var(--dark);font-weight:700;margin-bottom:20px}
.about-info p{color:var(--text);line-height:1.8;margin-bottom:15px}
.about-info .reveal-text{font-size:18px;font-weight:600;color:var(--dark);margin-bottom:20px;border-left:3px solid var(--primary);padding-left:20px}
.story-section{padding:80px 0}
.story-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.story-grid.reverse{direction:rtl}
.story-grid.reverse > *{direction:ltr}
.story-image{border-radius:20px;overflow:hidden}
.story-image img{width:100%;border-radius:20px}
.story-info h3{font-family:var(--ff-h);font-size:40px;color:var(--dark);font-weight:700;margin-bottom:20px}
.story-info p{color:var(--text);line-height:1.8;margin-bottom:15px}
.amenities-section{padding:80px 0}
.amenities-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.amenity-item{background:var(--white);border-radius:16px;padding:40px 30px;text-align:center;position:relative;transition:0.4s;box-shadow:0 5px 30px rgba(0,0,0,0.05);overflow:hidden}
.amenity-item:hover{transform:translateY(-8px);box-shadow:0 15px 50px rgba(0,0,0,0.1)}
.amenity-item::before{content:"";position:absolute;top:0;right:0;width:0;height:0;border-style:solid;border-width:0 50px 50px 0;border-color:transparent var(--primary) transparent transparent;opacity:0;transition:0.3s}
.amenity-item:hover::before{opacity:1}
.amenity-item::after{content:"";position:absolute;bottom:0;left:0;width:0;height:0;border-style:solid;border-width:0 0 40px 40px;border-color:transparent transparent var(--primary) transparent;opacity:0;transition:0.3s}
.amenity-item:hover::after{opacity:0.3}
.amenity-item img{height:60px;margin-bottom:20px;display:inline-block}
.amenity-item h4{font-family:var(--ff-h);font-size:18px;font-weight:700;color:var(--dark);letter-spacing:1px}
.team-section{padding:80px 0;background:var(--light)}
.team-slider{display:flex;gap:30px;overflow-x:auto;padding:20px 0;scroll-snap-type:x mandatory}
.team-slider::-webkit-scrollbar{display:none}
.team-card{flex:0 0 calc(33.333% - 20px);background:var(--white);border-radius:16px;overflow:hidden;box-shadow:0 5px 30px rgba(0,0,0,0.05);transition:0.4s;scroll-snap-align:start}
.team-card:hover{transform:translateY(-8px);box-shadow:0 15px 50px rgba(0,0,0,0.1)}
.team-card img{width:100%;height:350px;object-fit:cover}
.team-card .info{padding:25px;text-align:center}
.team-card .info h4{font-family:var(--ff-h);font-size:24px;color:var(--dark);font-weight:700}
.team-card .info span{color:var(--primary);font-size:14px;font-weight:600}
.footer{background:var(--dark);padding:80px 0 0;position:relative;overflow:hidden}
.footer .footer-bg{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.05;background:url("https://res.cloudinary.com/dno6yitvw/image/upload/v1781181005/hotel1/bg-shape_footer-bg-shape.png") no-repeat center/cover;pointer-events:none}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1.5fr;gap:40px}
.footer-col h4{font-family:var(--ff-h);font-size:18px;font-weight:700;color:var(--white);margin-bottom:25px;position:relative;padding-bottom:12px}
.footer-col h4::after{content:"";position:absolute;bottom:0;left:0;width:40px;height:2px;background:var(--primary)}
.footer-col p{color:rgba(255,255,255,0.6);font-size:14px;line-height:1.8;margin-bottom:15px}
.footer-col .footer-logo{height:50px;margin-bottom:20px}
.footer-col ul li{margin-bottom:12px}
.footer-col ul li a{color:rgba(255,255,255,0.6);font-size:14px;transition:0.3s;cursor:pointer}
.footer-col ul li a:hover{color:var(--primary);padding-left:5px}
.footer-contact-item{display:flex;align-items:flex-start;gap:12px;margin-bottom:15px}
.footer-contact-item svg{width:18px;height:18px;color:var(--primary);margin-top:3px;flex-shrink:0}
.footer-contact-item span{color:rgba(255,255,255,0.6);font-size:14px}
.footer-contact-item strong{display:block;color:var(--white);font-size:14px;font-weight:600}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.1);padding:25px 0;margin-top:50px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px}
.footer-bottom p{color:rgba(255,255,255,0.5);font-size:14px}
.footer-social{display:flex;gap:12px}
.footer-social a{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;transition:0.3s;color:rgba(255,255,255,0.6)}
.footer-social a:hover{background:var(--primary);border-color:var(--primary);color:var(--white)}
.page-section{padding:100px 0}
.room-filter{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:40px;flex-wrap:wrap}
.room-filter select,.room-filter input{padding:12px 20px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;font-family:var(--ff-b);background:var(--white)}
.room-filter select:focus,.room-filter input:focus{border-color:var(--primary)}
.room-filter input{width:250px}
.room-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.pagination{display:flex;justify-content:center;gap:10px;margin-top:50px}
.pagination button{width:45px;height:45px;border:1px solid #ddd;border-radius:8px;background:var(--white);cursor:pointer;font-size:14px;font-weight:600;transition:0.3s;color:var(--dark)}
.pagination button:hover,.pagination button.active{background:var(--primary);color:var(--white);border-color:var(--primary)}
.room-detail-hero{position:relative;height:500px;overflow:hidden}
.room-detail-hero img{width:100%;height:100%;object-fit:cover}
.room-detail-hero .overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(40,37,37,0.7),transparent)}
.room-detail-content{display:grid;grid-template-columns:1fr 380px;gap:50px;padding:80px 0}
.room-gallery{display:grid;grid-template-columns:repeat(2,1fr);gap:15px;margin-bottom:40px}
.room-gallery img{width:100%;height:250px;object-fit:cover;border-radius:10px;cursor:pointer;transition:0.3s}
.room-gallery img:hover{opacity:0.8}
.room-info h2{font-family:var(--ff-h);font-size:40px;color:var(--dark);font-weight:700;margin-bottom:20px}
.room-info .price{font-family:var(--ff-h);font-size:31px;color:var(--primary);font-weight:700;margin-bottom:20px;display:block}
.room-info .desc{color:var(--text);line-height:1.8;margin-bottom:30px}
.room-amenities-list{display:grid;grid-template-columns:repeat(2,1fr);gap:15px;margin-bottom:30px}
.room-amenities-list li{display:flex;align-items:center;gap:10px;font-size:15px;color:var(--dark)}
.room-amenities-list li svg{width:18px;height:18px;color:var(--primary)}
.booking-sidebar{background:var(--white);border-radius:16px;padding:30px;box-shadow:0 5px 30px rgba(0,0,0,0.08);position:sticky;top:100px}
.booking-sidebar h3{font-family:var(--ff-h);font-size:24px;color:var(--dark);font-weight:700;margin-bottom:25px}
.booking-sidebar .form-group{margin-bottom:20px}
.booking-sidebar .form-group label{display:block;font-size:14px;font-weight:600;color:var(--dark);margin-bottom:5px}
.booking-sidebar .form-group input,.booking-sidebar .form-group select{padding:12px 15px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;width:100%;transition:0.3s}
.booking-sidebar .form-group input:focus,.booking-sidebar .form-group select:focus{border-color:var(--primary)}
.blog-grid-page{display:grid;grid-template-columns:1fr 300px;gap:50px}
.blog-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.blog-card{background:var(--white);border-radius:12px;overflow:hidden;transition:0.4s;box-shadow:0 5px 30px rgba(0,0,0,0.05);cursor:pointer}
.blog-card:hover{transform:translateY(-8px);box-shadow:0 15px 50px rgba(0,0,0,0.1)}
.blog-card .img-wrap{position:relative;overflow:hidden;height:220px}
.blog-card .img-wrap img{width:100%;height:100%;object-fit:cover;transition:0.5s}
.blog-card:hover .img-wrap img{transform:scale(1.08)}
.blog-card .cat{position:absolute;top:15px;left:15px;background:var(--primary);color:var(--white);padding:5px 15px;border-radius:50px;font-size:12px;font-weight:700}
.blog-card .content{padding:25px}
.blog-card .content .date{font-size:13px;color:var(--text);margin-bottom:10px}
.blog-card .content h3{font-family:var(--ff-h);font-size:20px;color:var(--dark);font-weight:700;margin-bottom:10px;line-height:1.4}
.blog-card .content h3:hover{color:var(--primary)}
.blog-card .content p{font-size:14px;color:var(--text);line-height:1.7}
.sidebar-widget{background:var(--white);border-radius:12px;padding:25px;margin-bottom:30px;box-shadow:0 5px 30px rgba(0,0,0,0.05)}
.sidebar-widget h4{font-family:var(--ff-h);font-size:20px;color:var(--dark);font-weight:700;margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid var(--primary)}
.sidebar-widget ul li{padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:var(--text);cursor:pointer;transition:0.3s;display:flex;justify-content:space-between}
.sidebar-widget ul li:hover{color:var(--primary);padding-left:5px}
.blog-detail-article{max-width:800px}
.blog-detail-article img{width:100%;border-radius:12px;margin-bottom:30px}
.blog-detail-article h1{font-family:var(--ff-h);font-size:40px;color:var(--dark);font-weight:700;margin-bottom:15px}
.blog-detail-article .meta{display:flex;gap:20px;margin-bottom:25px;font-size:14px;color:var(--text)}
.blog-detail-article .meta svg{width:16px;height:16px;margin-right:5px;vertical-align:middle}
.blog-detail-article .content p{color:var(--text);line-height:1.9;margin-bottom:20px;font-size:15px}
.comments-section{margin-top:50px;padding-top:40px;border-top:1px solid #eee}
.comments-section h3{font-family:var(--ff-h);font-size:24px;color:var(--dark);font-weight:700;margin-bottom:30px}
.comment{display:flex;gap:20px;margin-bottom:30px;padding:25px;background:var(--light);border-radius:12px}
.comment img{width:60px;height:60px;border-radius:50%;object-fit:cover;flex-shrink:0}
.comment .comment-body h5{font-size:16px;font-weight:700;color:var(--dark);margin-bottom:5px}
.comment .comment-body .date{font-size:13px;color:var(--text);margin-bottom:10px}
.comment .comment-body p{font-size:14px;color:var(--text);line-height:1.7}
.restaurant-section{padding:80px 0}
.restaurant-about{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.restaurant-about img{width:100%;border-radius:20px}
.restaurant-about .info h2{font-family:var(--ff-h);font-size:53px;color:var(--dark);font-weight:700;margin-bottom:20px}
.restaurant-about .info p{color:var(--text);line-height:1.8;margin-bottom:15px}
.menu-highlights{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px}
.menu-item-card{background:var(--white);border-radius:12px;overflow:hidden;box-shadow:0 5px 30px rgba(0,0,0,0.05);transition:0.4s}
.menu-item-card:hover{transform:translateY(-8px);box-shadow:0 15px 50px rgba(0,0,0,0.1)}
.menu-item-card img{width:100%;height:200px;object-fit:cover}
.menu-item-card .info{padding:20px}
.menu-item-card .info h4{font-family:var(--ff-h);font-size:20px;color:var(--dark);font-weight:700;margin-bottom:8px}
.menu-item-card .info p{font-size:14px;color:var(--text);line-height:1.7;margin-bottom:10px}
.menu-item-card .info .price{font-size:18px;font-weight:700;color:var(--primary)}
.reservation-cta{background:var(--dark);padding:80px;border-radius:20px;text-align:center;margin-top:60px;position:relative;overflow:hidden}
.reservation-cta h2{font-family:var(--ff-h);font-size:53px;color:var(--white);font-weight:700;margin-bottom:15px}
.reservation-cta p{color:rgba(255,255,255,0.7);margin-bottom:30px;font-size:16px}
.spa-treatments{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px}
.treatment-card{background:var(--white);border-radius:16px;overflow:hidden;box-shadow:0 5px 30px rgba(0,0,0,0.05);transition:0.4s;text-align:center}
.treatment-card:hover{transform:translateY(-8px);box-shadow:0 15px 50px rgba(0,0,0,0.1)}
.treatment-card img{width:100%;height:250px;object-fit:cover}
.treatment-card .info{padding:25px}
.treatment-card .info h3{font-family:var(--ff-h);font-size:24px;color:var(--dark);font-weight:700;margin-bottom:10px}
.treatment-card .info p{font-size:14px;color:var(--text);line-height:1.7;margin-bottom:12px}
.treatment-card .info .price{font-size:20px;font-weight:700;color:var(--primary)}
.gallery-masonry{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-top:40px}
.gallery-masonry .item{position:relative;overflow:hidden;border-radius:10px;cursor:pointer}
.gallery-masonry .item img{width:100%;height:100%;object-fit:cover;transition:0.5s}
.gallery-masonry .item:hover img{transform:scale(1.08)}
.gallery-masonry .item .overlay{position:absolute;inset:0;background:rgba(151,134,103,0.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:0.3s}
.gallery-masonry .item:hover .overlay{opacity:1}
.gallery-masonry .item .overlay svg{width:40px;height:40px;color:var(--white)}
.gallery-masonry .item:nth-child(1){grid-row:span 2;height:450px}
.gallery-masonry .item:nth-child(2){height:200px}
.gallery-masonry .item:nth-child(3){height:200px}
.gallery-masonry .item:nth-child(4){height:220px}
.gallery-masonry .item:nth-child(5){height:220px}
.gallery-masonry .item:nth-child(6){height:300px}
.gallery-masonry .item:nth-child(7){height:300px}
.lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:0.3s;cursor:pointer}
.lightbox.open{opacity:1;visibility:visible}
.lightbox img{max-width:90%;max-height:90%;object-fit:contain;border-radius:8px}
.lightbox .close-lightbox{position:absolute;top:30px;right:40px;color:var(--white);font-size:30px;cursor:pointer;width:40px;height:40px;display:flex;align-items:center;justify-content:center;transition:0.3s}
.lightbox .close-lightbox:hover{color:var(--primary)}
.lightbox .lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);width:50px;height:50px;color:var(--white);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.3s}
.lightbox .lightbox-nav:hover{color:var(--primary)}
.lightbox .lightbox-nav.prev{left:20px}
.lightbox .lightbox-nav.next{right:20px}
.contact-section{padding:80px 0}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px}
.contact-info h2{font-family:var(--ff-h);font-size:40px;color:var(--dark);font-weight:700;margin-bottom:30px}
.contact-detail{display:flex;align-items:flex-start;gap:20px;margin-bottom:25px}
.contact-detail svg{width:24px;height:24px;color:var(--primary);flex-shrink:0;margin-top:3px}
.contact-detail div h5{font-family:var(--ff-h);font-size:18px;font-weight:700;color:var(--dark);margin-bottom:5px}
.contact-detail div p{font-size:14px;color:var(--text);line-height:1.7}
.social-media{display:flex;gap:12px;margin:30px 0}
.social-media a{width:45px;height:45px;border-radius:50%;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;transition:0.3s;color:var(--dark)}
.social-media a:hover{background:var(--primary);border-color:var(--primary);color:var(--white)}
.contact-form{background:var(--white);padding:40px;border-radius:16px;box-shadow:0 5px 30px rgba(0,0,0,0.05)}
.contact-form h3{font-family:var(--ff-h);font-size:28px;color:var(--dark);font-weight:700;margin-bottom:25px}
.contact-form .form-group{margin-bottom:20px}
.contact-form .form-group label{display:block;font-size:14px;font-weight:600;color:var(--dark);margin-bottom:5px}
.contact-form .form-group input,.contact-form .form-group textarea{width:100%;padding:12px 15px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;transition:0.3s;font-family:var(--ff-b)}
.contact-form .form-group input:focus,.contact-form .form-group textarea:focus{border-color:var(--primary)}
.contact-form .form-group textarea{resize:vertical;min-height:120px}
.map-section{padding:0 0 80px}
.map-section iframe{width:100%;height:450px;border:none;border-radius:16px}
.booking-page{padding:80px 0}
.booking-form-wrap{max-width:800px;margin:0 auto;background:var(--white);padding:50px;border-radius:16px;box-shadow:0 5px 30px rgba(0,0,0,0.05)}
.booking-form-wrap h2{font-family:var(--ff-h);font-size:40px;color:var(--dark);font-weight:700;margin-bottom:40px;text-align:center}
.booking-form .row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
.booking-form .form-group{margin-bottom:20px}
.booking-form .form-group label{display:block;font-size:14px;font-weight:600;color:var(--dark);margin-bottom:5px}
.booking-form .form-group input,.booking-form .form-group select,.booking-form .form-group textarea{width:100%;padding:12px 15px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;transition:0.3s;font-family:var(--ff-b)}
.booking-form .form-group input:focus,.booking-form .form-group select:focus,.booking-form .form-group textarea:focus{border-color:var(--primary)}
.booking-form .form-group textarea{resize:vertical;min-height:100px}
.booking-form .full-row{grid-column:1/-1}
.overlay-mob{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9998;opacity:0;visibility:hidden;transition:0.3s}
.overlay-mob.open{opacity:1;visibility:visible}
.color-primary{color:var(--primary)!important}
.text-uppercase{text-transform:uppercase}
.hidden{display:none!important}
.mb-16{margin-bottom:16px}
.mb-24{margin-bottom:24px}
.mb-32{margin-bottom:32px}
.mb-48{margin-bottom:48px}
.mt-40{margin-top:40px}
.unstyled{list-style:none;padding:0;margin:0}
.text-end{text-align:right}
.text-center{text-align:center}
.d-flex{display:flex}
.align-items-center{align-items:center}
.justify-content-between{justify-content:space-between}
.justify-content-center{justify-content:center}
.w-100{width:100%}
.d-sm-none{display:none}
.d-sm-block{display:block}
.d-none{display:none}
.d-block{display:block}
@keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInRight{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@media(max-width:992px){
.d-sm-none{display:none!important}
.d-sm-block{display:block!important}
.hero-banner .d-sm-flex.d-none{display:none!important}
.mobile-header{display:block}
.home-header{padding:15px 20px}
.home-header.scrolled{padding:10px 20px}
.header-inner_pages{padding:10px 20px}
.slide__content--headings h1{font-size:60px}
.slide__content--headings h4{font-size:36px}
.booking{padding:0 20px}
.booking-detail .info{flex-direction:column}
.booking-detail .detail{flex-wrap:wrap}
.booking-detail .detail .input-date-picker{min-width:calc(50% - 10px)}
.booking-detail .detail .cus-btn.w-100{margin-top:10px}
.vertical-line{display:none}
.cards{grid-template-columns:repeat(2,1fr)}
.sec-heading .sec-title{font-size:48px}
.suite-room .sec-heading .heading-content h2{font-size:48px}
.suite-room .room-slider .slide{flex-direction:column}
.suite-room .room-slider .slide__img{flex:1;width:100%}
.suite-room .room-slider .slide__img img.room_image{height:350px}
.suite-room .room-slider .slide__content .content-block h2{font-size:36px}
.about-grid,.story-grid{grid-template-columns:1fr}
.amenities-grid{grid-template-columns:repeat(2,1fr)}
.team-card{flex:0 0 calc(50% - 15px)}
.footer-grid{grid-template-columns:1fr 1fr}
.room-grid{grid-template-columns:repeat(2,1fr)}
.blog-grid-page{grid-template-columns:1fr}
.blog-cards{grid-template-columns:repeat(2,1fr)}
.restaurant-about{grid-template-columns:1fr}
.menu-highlights,.spa-treatments{grid-template-columns:repeat(2,1fr)}
.gallery-masonry{grid-template-columns:repeat(2,1fr)}
.contact-grid{grid-template-columns:1fr}
.room-detail-content{grid-template-columns:1fr}
.page-hero .content h1{font-size:48px}
.page-hero .content p{font-size:16px}
}
@media(max-width:768px){
.slide__content{padding:0 30px}
.slide__content--headings h1{font-size:42px}
.slide__content--headings h4{font-size:28px}
.hero-dots{bottom:240px}
.videoplayer{right:30px;bottom:210px}
.cards{grid-template-columns:1fr}
.sec-heading .sec-title{font-size:36px}
.suite-room .sec-heading .heading-content h2{font-size:36px}
.suite-room .room-slider .slide__content .content-block h2{font-size:28px}
.amenities-grid{grid-template-columns:1fr}
.team-card{flex:0 0 calc(100% - 20px)}
.footer-grid{grid-template-columns:1fr}
.room-grid{grid-template-columns:1fr}
.blog-cards{grid-template-columns:1fr}
.menu-highlights,.spa-treatments{grid-template-columns:1fr}
.gallery-masonry{grid-template-columns:1fr}
.gallery-masonry .item:nth-child(1){height:300px}
.page-hero{min-height:300px}
.page-hero .content h1{font-size:36px}
.room-detail-content{padding:40px 0}
.booking-form-wrap{padding:30px 20px}
.booking-form .row{grid-template-columns:1fr}
.contact-section{padding:40px 0}
.contact-form{padding:25px}
.reservation-cta{padding:40px 20px}
.reservation-cta h2{font-size:32px}
.about-section,.story-section,.amenities-section,.team-section{padding:50px 0}
.suite-room{padding:50px 0}
.rooms{padding:60px 0}
.resturent-video{padding:0 20px}
.resturent-video .bg-video video{height:300px}
.restaurant-section{padding:40px 0}
.page-section{padding:60px 0}
}
@media(max-width:490px){
.slide__content--headings h1{font-size:32px}
.slide__content--headings h4{font-size:22px}
.slide__content{padding:0 20px}
.home-header .logo img,.header-inner_pages .logo img{height:35px}
.sec-heading .sec-title{font-size:28px}
.suite-room .sec-heading .heading-content h2{font-size:28px}
.suite-room .room-slider .slide__img img.room_image{height:250px}
.suite-room .room-slider .slide__content .content-block h2{font-size:24px}
.page-hero .content h1{font-size:28px}
}
`;
    document.head.appendChild(s);
  }, []);

  const [page, setPage] = useState("home");
  const [slideIdx, setSlideIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [suiteIdx, setSuiteIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(-1);
  const [blogId, setBlogId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomType, setRoomType] = useState("");
  const [specialReq, setSpecialReq] = useState("");
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingRooms, setBookingRooms] = useState(1);
  const [guestPop, setGuestPop] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterPrice, setFilterPrice] = useState("");
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    const tmr = setInterval(() => setSlideIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(tmr);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const tmr = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(tmr);
  }, []);

  const scrollTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);
  const navigate = useCallback((p: string) => { setPage(p); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
  const nextSuite = useCallback(() => setSuiteIdx(i => (i + 1) % suites.length), []);
  const prevSuite = useCallback(() => setSuiteIdx(i => (i - 1 + suites.length) % suites.length), []);

  const allRooms = [
    ...rooms,
    { id: "deluxe2", name: "Deluxe Room", price: 430, img: I.card8, desc: "Experience luxury with premium amenities and stunning views." },
    { id: "premium", name: "Premium Suite", price: 520, img: I.card9, desc: "Our finest accommodation with panoramic views and butler service." },
    { id: "junior", name: "Junior Suite", price: 310, img: I.card10, desc: "Perfect blend of comfort and elegance for discerning travelers." },
    { id: "presidential", name: "Presidential Suite", price: 890, img: I.card11, desc: "The pinnacle of luxury with separate living and dining areas." },
    { id: "executive", name: "Executive Room", price: 410, img: I.card12, desc: "Designed for business travelers with dedicated workspace." },
    { id: "family2", name: "Family Suite", price: 480, img: I.card13, desc: "Spacious accommodation ideal for families with children." },
    { id: "honeymoon", name: "Honeymoon Suite", price: 650, img: I.card14, desc: "Romantic getaway with special amenities for couples." },
    { id: "penthouse", name: "Penthouse", price: 1200, img: I.card15, desc: "Ultimate luxury on the top floor with private terrace." },
  ];

  const filteredRooms = allRooms.filter(r => {
    if (filterCat !== "all" && r.id !== filterCat && !r.name.toLowerCase().includes(filterCat.toLowerCase())) return false;
    if (filterPrice) {
      const [min, max] = filterPrice.split("-").map(Number);
      if (max && (r.price < min || r.price > max)) return false;
      if (!max && r.price < min) return false;
    }
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const blogPosts = [
    { id: 1, title: "Top 10 Luxury Hotel Amenities You Must Experience", date: "12.03.2025", img: I.blogDetail, cat: "Hotel", desc: "Discover the finest amenities that define luxury hospitality, from world-class spas to personalized butler services that make your stay unforgettable." },
    { id: 2, title: "Spa & Wellness Guide 2025: Rejuvenate Your Senses", date: "10.03.2025", img: I.blogDetail1, cat: "Spa", desc: "Explore our comprehensive guide to spa treatments and wellness programs designed to restore balance and harmony during your stay." },
    { id: 3, title: "Fine Dining Experience: A Culinary Journey", date: "08.03.2025", img: I.blogDetail2, cat: "Restaurant", desc: "Indulge in an exquisite culinary experience featuring world-class chefs, locally sourced ingredients, and carefully curated wine pairings." },
    { id: 4, title: "Ultimate Guide to Hotel Room Selection", date: "05.03.2025", img: I.card1, cat: "Hotel", desc: "Learn how to choose the perfect room for your needs, whether you're traveling for business, pleasure, or a special occasion." },
    { id: 5, title: "Exploring Local Attractions Near Our Hotel", date: "28.02.2025", img: I.card2, cat: "Travel", desc: "Discover the must-visit attractions, hidden gems, and cultural landmarks surrounding our luxury property." },
    { id: 6, title: "Seasonal Offers and Packages for 2025", date: "20.02.2025", img: I.card3, cat: "Offers", desc: "Take advantage of our exclusive seasonal packages including romantic getaways, family vacations, and wellness retreats." },
  ];

  const currentBlog = blogPosts.find(b => b.id === blogId) || blogPosts[0];
  const currentRoom = allRooms.find(r => r.id === roomId) || rooms[0];
  const currentSuite = suites[suiteIdx];

  const featuredGallery = [
    { img: I.gallery1, h: 2 }, { img: I.gallery2, h: 1 }, { img: I.gallery3, h: 1 },
    { img: I.gallery4, h: 1 }, { img: I.gallery5, h: 1 }, { img: I.gallery6, h: 1.5 },
    { img: I.gallery7, h: 1.5 },
  ];

  const treatmentItems = [
    { name: "Swedish Massage", price: 120, img: I.card8, desc: "Classic relaxation massage using long flowing strokes to ease muscle tension." },
    { name: "Aromatherapy", price: 150, img: I.card9, desc: "Essential oil therapy combined with gentle massage for holistic healing." },
    { name: "Hot Stone Massage", price: 180, img: I.card10, desc: "Heated basalt stones placed on key points to melt away stress." },
    { name: "Facial Treatment", price: 130, img: I.card11, desc: "Rejuvenating facial using premium products for radiant skin." },
    { name: "Body Scrub", price: 100, img: I.card12, desc: "Exfoliating treatment that removes dead skin cells and reveals fresh skin." },
    { name: "Couples Massage", price: 250, img: I.card13, desc: "Side-by-side massage experience for two in a private suite." },
  ];

  const menuItems = [
    { name: "Grilled Salmon", price: 45, img: I.card14, desc: "Atlantic salmon with herb crust, served with seasonal vegetables." },
    { name: "Beef Tenderloin", price: 65, img: I.card15, desc: "Prime cut beef tenderloin with truffle mashed potatoes." },
    { name: "Lobster Thermidor", price: 85, img: I.card16, desc: "Classic French preparation with creamy sauce and gratinéed cheese." },
    { name: "Tiramisu", price: 18, img: I.card17, desc: "Traditional Italian dessert with mascarpone and espresso." },
    { name: "Caesar Salad", price: 22, img: I.card18, desc: "Crisp romaine with parmesan, croutons, and house-made dressing." },
    { name: "Wine Selection", price: 55, img: I.card19, desc: "Curated selection of fine wines from around the world." },
  ];

  function Navbar({ home }: { home: boolean }) {
    const [mobSub, setMobSub] = useState<string | null>(null);
    return (
      <header className={home ? "home-header" + (scrolled ? " scrolled" : "") : "header-inner_pages"}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo" onClick={() => navigate("home")}>
            <img src={I.logo} alt="" />
          </div>
          <ul className="link unstyled d-sm-flex d-none align-items-center">
            {pageNavLinks.map((l, i) => (
              <li key={i} className={l.children ? "link-has-children" : ""}>
                <a className={(page === l.page && !l.children ? "active" : "") + (l.children ? " sub-menu" : "")} onClick={() => !l.children && navigate(l.page)}>
                  {l.label}
                </a>
                {l.children && (
                  <ul className="unstyled sub-menu-list">
                    {l.children.map((c, j) => (
                      <li key={j}><a onClick={() => navigate(c.page)}>{c.label}</a></li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mobile-header d-sm-none d-block">
            <div className="btn" onClick={toggleMobile}>
              <Icon name={mobileOpen ? "times" : "bars"} size={20} color="#fff" />
            </div>
            <div className={"overlay-mob" + (mobileOpen ? " open" : "")} onClick={toggleMobile} />
            <nav className={"sidebar" + (mobileOpen ? " open" : "")}>
              <div className="logo">
                <img src={I.mobileLogo} alt="" />
              </div>
              <ul className="unstyled">
                {pageNavLinks.map((l, i) => (
                  <li key={i} className={page === l.page && !l.children ? "active" : ""}>
                    {l.children ? (
                      <>
                        <a className={"menu-btn" + (mobSub === l.label ? " open" : "")} onClick={() => setMobSub(mobSub === l.label ? null : l.label)}>
                          {l.label}
                          <Icon name="caret-down" size={12} color="#282525" />
                        </a>
                        <ul className={"menu-item unstyled" + (mobSub === l.label ? " open" : "")}>
                          {l.children.map((c, j) => (
                            <li key={j}><a onClick={() => navigate(c.page)}>{c.label}</a></li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <a onClick={() => navigate(l.page)}>{l.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="nav-logo d-sm-flex d-none">
            <div className="logo-icon">
              <form>
                <div className="search-block">
                  <input type="search" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                  <button type="submit"><Icon name="magnifying-glass" size={16} color="#fff" /></button>
                </div>
              </form>
              <a><Icon name="user" size={20} color="#fff" /></a>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function Footer() {
    return (
      <footer className="footer">
        <div className="footer-bg" />
        <div className="container-fluid">
          <div className="footer-grid">
            <div className="footer-col">
              <img src={I.footerLogo} alt="" className="footer-logo" />
              <p>Experience unparalleled luxury and comfort at our hotel. We are dedicated to providing exceptional service and creating memorable experiences for every guest.</p>
              <div className="footer-social">
                <a><Icon name="facebook" size={18} /></a>
                <a><Icon name="twitter" size={18} /></a>
                <a><Icon name="instagram" size={18} /></a>
                <a><Icon name="linkedin" size={18} /></a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="unstyled">
                <li><a onClick={() => navigate("home")}>Home</a></li>
                <li><a onClick={() => navigate("about")}>About Us</a></li>
                <li><a onClick={() => navigate("rooms")}>Our Rooms</a></li>
                <li><a onClick={() => navigate("gallery")}>Gallery</a></li>
                <li><a onClick={() => navigate("contact")}>Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <ul className="unstyled">
                <li><a>Spa & Wellness</a></li>
                <li><a>Restaurant</a></li>
                <li><a>Room Service</a></li>
                <li><a>Concierge</a></li>
                <li><a>Airport Transfer</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul className="unstyled">
                <li><a>FAQ</a></li>
                <li><a>Terms & Conditions</a></li>
                <li><a>Privacy Policy</a></li>
                <li><a>Careers</a></li>
                <li><a>Sitemap</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Info</h4>
              <div className="footer-contact-item">
                <Icon name="location-dot" size={18} />
                <div>
                  <strong>Address</strong>
                  <span>123 Luxury Avenue, Beverly Hills, CA 90210</span>
                </div>
              </div>
              <div className="footer-contact-item">
                <Icon name="phone" size={18} />
                <div>
                  <strong>Phone</strong>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              <div className="footer-contact-item">
                <Icon name="envelope" size={18} />
                <div>
                  <strong>Email</strong>
                  <span>info@luxuryhotel.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Luxury Hotel. All rights reserved.</p>
            <div className="footer-social">
              <a><Icon name="facebook" size={16} /></a>
              <a><Icon name="twitter" size={16} /></a>
              <a><Icon name="instagram" size={16} /></a>
              <a><Icon name="linkedin" size={16} /></a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  function renderHome() {
    return (
      <div className="hotel-root">
        <Navbar home />
        <section className="hero-banner" id="hero">
          <div className="container-fluid wd-100">
            <div className="banner__slider">
              {heroSlides.map((s, i) => (
                <div key={i} className={"slide" + (i === slideIdx ? " active" : "")}>
                  <div className="slide__img">
                    <img src={s.bg} alt="" className="full-image animated d-sm-block d-none" />
                    <img src={s.bgMob} alt="" className="full-image animated d-sm-none d-block" />
                  </div>
                  <div className={"slide__content" + (s.align === "right" ? " slide__content__right" : s.align === "left" ? " slide__content__left" : "")}>
                    <div className="slide__content--headings">
                      <h1>{s.title}</h1>
                      <h4>{s.sub}</h4>
                    </div>
                  </div>
                </div>
              ))}
              <div className="hero-dots">
                {heroSlides.map((_, i) => (
                  <button key={i} className={i === slideIdx ? "active" : ""} onClick={() => setSlideIdx(i)} />
                ))}
              </div>
              <div className="videoplayer animate-block d-sm-block d-none">
                <div className="videoplay">
                  <Icon name="play" size={32} color="#fff" />
                </div>
              </div>
              <div className="booking">
                <div className="booking-detail">
                  <form>
                    <div className="info">
                      <div className="detail">
                        <div className="input-date-picker">
                          <label className="date_label">Check In</label>
                          <input type="text" className="sel-input" placeholder="30 Jan, 2025" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                        </div>
                        <div className="vertical-line d-xl-flex d-none" />
                        <div className="input-date-picker">
                          <label className="date_label">Check Out</label>
                          <input type="text" className="sel-input" placeholder="02 Feb, 2025" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                        </div>
                        <div className="vertical-line d-xl-flex d-none" />
                        <div className="input-date-picker">
                          <label className="date_label mb-1">Guests and Rooms</label>
                          <div className="custom-sel-input-block">
                            <div className="seat-booking light-black sel-input" onClick={() => setGuestPop(o => !o)}>
                              <span className="total-pasenger">{bookingGuests}</span> Guest /
                              <span className="total-room"> {bookingRooms}</span> Room
                            </div>
                            <div className={"guest-area guest-box bg-white light-shadow br-5 p-24" + (guestPop ? " open" : "")}>
                              <h4>Select Guests</h4>
                              <div className="guest-box mb-24">
                                <div className="row">
                                  <div className="content-box">
                                    <h5>Guest</h5>
                                  </div>
                                  <div className="quantity quantity-wrap">
                                    <input className="decrement" type="button" value="-" onClick={() => setBookingGuests(Math.max(1, bookingGuests - 1))} />
                                    <input type="text" name="quantity" value={bookingGuests} className="number" readOnly />
                                    <input className="increment" type="button" value="+" onClick={() => setBookingGuests(bookingGuests + 1)} />
                                  </div>
                                </div>
                              </div>
                              <div className="guest-box">
                                <div className="row">
                                  <div className="content-box">
                                    <h5>Room</h5>
                                  </div>
                                  <div className="quantity quantity-wrap">
                                    <input className="decrement" type="button" value="-" onClick={() => setBookingRooms(Math.max(1, bookingRooms - 1))} />
                                    <input type="text" name="quantity" value={bookingRooms} className="number" readOnly />
                                    <input className="increment" type="button" value="+" onClick={() => setBookingRooms(bookingRooms + 1)} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CusBtn label="Book Now" />
                      </div>
                      <CusBtn label="Book Now" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="page-content">
          <section className="rooms">
            <div className="container-fluid">
              <div className="content">
                <div className="sec-heading text-sm-center mb-48">
                  <p className="h-18 bold light-black text-uppercase sec-text">Luxury Experience</p>
                  <h2 className="h-69 light-black sec-title">Our Luxury Rooms</h2>
                </div>
                <div className="card-block">
                  <div className="cards">
                    {rooms.map((r, i) => (
                      <a key={i} className="card-item" onClick={() => { setRoomId(r.id); navigate("room-detail"); }}>
                        <div className="card-image mb-24">
                          <div className="card-price">
                            <p><span className="color-primary price">${r.price}</span><span className="light-bold">/Night</span></p>
                          </div>
                          <img src={r.img} className="card-image" alt="" />
                          <img src={I.iconArrowDark} className="icon" alt="" />
                          <img src={I.vecBottomShape} className="corner-shape" alt="" />
                        </div>
                        <div className="text-block">
                          <div className="name-rating d-flex align-items-center justify-content-between mb-16">
                            <h4>{r.name}</h4>
                            <div className="rating">
                              <p className="light-bold"><Icon name="star" size={14} color="#978667" /> 4.9</p>
                            </div>
                          </div>
                          <p className="sample-text mb-32">{r.desc}</p>
                          <ul className="services unstyled">
                            <li><img src={I.iconKingBed} alt="" /><p>King Size Bed</p></li>
                            <li><img src={I.iconTv} alt="" /><p>32 Inc TV</p></li>
                            <li><img src={I.iconBreakfast} alt="" /><p>Breakfast</p></li>
                          </ul>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="btn-block text-end">
                <CusBtn label="See All Rooms" dark onClick={() => navigate("rooms")} />
              </div>
            </div>
          </section>
          <div className="resturent-video">
            <div className="container-fluid">
              <div className="content">
                <img src={I.vecTopRight} className="top-cornner" alt="" />
                <div className="bg-video">
                  <video src="https://res.cloudinary.com/dno6yitvw/video/upload/v1781181005/hotel1/hotel-video.mp4" loop muted autoPlay />
                </div>
                <img src={I.vecBottomRight} className="bottom-cornner" alt="" />
              </div>
            </div>
          </div>
          <section className="suite-room">
            <div className="container-fluid">
              <div className="sec-heading sec right text-end">
                <div className="heading-content">
                  <p className="h-18 bold light-black text-uppercase">SUITES</p>
                  <h2 className="h-69 light-black">Luxury Honeymoon Suites</h2>
                </div>
                <div className="slider-arrow">
                  <button className="arrow prev-btn" onClick={prevSuite}>
                    <svg viewBox="0 0 33 32" width="33" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.8057 23C12.8057 20 10.0057 16 6.80566 16M6.80566 16C8.639 16 12.8057 15 12.8057 9M6.80566 16H25.8057" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                  <button className="arrow next-btn" onClick={nextSuite}>
                    <svg viewBox="0 0 32 32" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.3545 23C19.3545 20 22.1545 16 25.3545 16M25.3545 16C23.5212 16 19.3545 15 19.3545 9M25.3545 16H6.35449" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="content">
                <div className="room-slider">
                  <div className="slide">
                    <div className="slide__img">
                      <img className="room_image" src={currentSuite.img} alt="" />
                      <img src={I.vecLuxuryRoom} alt="" className="side_vector d-sm-block d-none" />
                      <img src={I.vecMobileRoom} alt="" className="side_vector_mobile d-sm-none d-block" />
                    </div>
                    <div className="slide__content">
                      <div className="content-block">
                        <h2 className="light-black mb-16"><a onClick={() => { setRoomId(currentSuite.id); navigate("room-detail"); }}>{currentSuite.name}</a></h2>
                        <div className="price-rating mb-32">
                          <p><span className="color-primary h-40">${currentSuite.price}</span><span className="light-bold light-black">/Night</span></p>
                          <p className="light-bold reviews-text"><Icon name="star" size={14} color="#978667" /> 4.9 (93) REVIEWS</p>
                        </div>
                        <p className="mb-32 reviews-text">{currentSuite.desc}</p>
                        <ul className="services unstyled mb-32">
                          <li><img src={I.iconKingBed} alt="" /><p>King Size Bed</p></li>
                          <li><img src={I.iconTv} alt="" /><p>32 Inc TV</p></li>
                          <li><img src={I.iconBreakfast} alt="" /><p>Breakfast</p></li>
                        </ul>
                        <CusBtn label="Book Now" onClick={() => navigate("booking")} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  function renderAbout() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ minHeight: 400, background: `url(${I.bg_banner}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>About Us</h1>
            <p>Discover our story of luxury and hospitality</p>
          </div>
        </div>
        <div className="page-content">
          <section className="about-section">
            <div className="container-fluid">
              <div className="about-grid">
                <div className="about-image">
                  <img src={I.coupleRoom} alt="" />
                </div>
                <div className="about-info">
                  <h2>Our Journey</h2>
                  <p className="reveal-text">Welcome to Luxury Hotel, where every stay becomes a cherished memory. Since our founding, we have been dedicated to providing unparalleled hospitality and exceptional experiences.</p>
                  <p>Explore the intricacies of our journey, commitment to hospitality, and the unique features that make us a premier destination for travelers from around the world. At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="story-section" style={{ background: "var(--light)" }}>
            <div className="container-fluid">
              <div className="story-grid">
                <div className="story-image">
                  <img src={I.deluxeRoom} alt="" />
                </div>
                <div className="story-info">
                  <h3>Our Story</h3>
                  <p>At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="story-section">
            <div className="container-fluid">
              <div className="story-grid reverse">
                <div className="story-image">
                  <img src={I.familyRoom} alt="" />
                </div>
                <div className="story-info">
                  <h3>Why Choose Us</h3>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed perspiciatis unde omnis iste natus error sit voluptatem accusantium.</p>
                  <p>Doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="amenities-section" style={{ background: "var(--light)" }}>
            <div className="container-fluid">
              <div className="sec-heading mb-48">
                <p className="h-18 bold light-black text-uppercase sec-text">Amenities</p>
                <h2 className="h-69 light-black sec-title">Premium Facilities</h2>
              </div>
              <div className="amenities-grid">
                {amenities.map((a, i) => (
                  <div key={i} className="amenity-item">
                    <img src={a.icon} alt="" />
                    <h4>{a.label}</h4>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="team-section">
            <div className="container-fluid">
              <div className="sec-heading mb-48">
                <p className="h-18 bold light-black text-uppercase sec-text">Team</p>
                <h2 className="h-69 light-black sec-title">Meet Our Team</h2>
              </div>
              <div className="team-slider">
                {team.map((m, i) => (
                  <div key={i} className="team-card">
                    <img src={m.img} alt="" />
                    <div className="info">
                      <h4>{m.name}</h4>
                      <span>{m.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  function renderRooms() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ background: `url(${I.bg_banner2}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>Our Rooms</h1>
            <p>Find your perfect accommodation</p>
          </div>
        </div>
        <div className="page-section">
          <div className="container-fluid">
            <div className="room-filter">
              <div style={{ display: "flex", gap: 15, alignItems: "center", flexWrap: "wrap" }}>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="single">Single</option>
                  <option value="queen">Queen</option>
                  <option value="quad">Quad</option>
                  <option value="double">Double</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
                <select value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
                  <option value="">All Prices</option>
                  <option value="0-350">$0 - $350</option>
                  <option value="351-500">$351 - $500</option>
                  <option value="501-1000">$501 - $1000</option>
                  <option value="1000">$1000+</option>
                </select>
              </div>
              <input type="text" placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="room-grid">
              {filteredRooms.slice((pageNum - 1) * 6, pageNum * 6).map((r, i) => (
                <a key={i} className="card-item" onClick={() => { setRoomId(r.id); navigate("room-detail"); }}>
                  <div className="card-image">
                    <div className="card-price">
                      <p><span className="color-primary price">${r.price}</span><span className="light-bold">/Night</span></p>
                    </div>
                    <img src={r.img} className="card-image" alt="" />
                    <img src={I.vecBottomShape} className="corner-shape" alt="" />
                  </div>
                  <div className="text-block">
                    <div className="name-rating d-flex align-items-center justify-content-between mb-16">
                      <h4>{r.name}</h4>
                      <div className="rating">
                        <p className="light-bold"><Icon name="star" size={14} color="#978667" /> 4.9</p>
                      </div>
                    </div>
                    <p className="sample-text mb-32">{r.desc}</p>
                    <ul className="services unstyled">
                      <li><img src={I.iconKingBed} alt="" /><p>King Size Bed</p></li>
                      <li><img src={I.iconTv} alt="" /><p>32 Inc TV</p></li>
                      <li><img src={I.iconBreakfast} alt="" /><p>Breakfast</p></li>
                    </ul>
                  </div>
                </a>
              ))}
            </div>
            <div className="pagination">
              {Array.from({ length: Math.ceil(filteredRooms.length / 6) }, (_, i) => (
                <button key={i} className={pageNum === i + 1 ? "active" : ""} onClick={() => setPageNum(i + 1)}>{i + 1}</button>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  function renderRoomDetail() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="room-detail-hero" style={{ background: `url(${currentRoom.img}) center/cover no-repeat` }}>
          <div className="overlay" />
        </div>
        <div className="container-fluid">
          <div className="room-detail-content">
            <div className="room-info">
              <div className="room-gallery">
                <img src={currentRoom.img} alt="" onClick={() => setGalleryIdx(0)} />
                <img src={I.card8} alt="" onClick={() => setGalleryIdx(1)} />
                <img src={I.card9} alt="" onClick={() => setGalleryIdx(2)} />
                <img src={I.card10} alt="" onClick={() => setGalleryIdx(3)} />
              </div>
              <h2>{currentRoom.name}</h2>
              <span className="price">${currentRoom.price} / Night</span>
              <p className="desc">{currentRoom.desc} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <ul className="room-amenities-list">
                <li><Icon name="star" size={18} color="#978667" /> King Size Bed</li>
                <li><Icon name="star" size={18} color="#978667" /> 32 Inch LED TV</li>
                <li><Icon name="star" size={18} color="#978667" /> Free WiFi</li>
                <li><Icon name="star" size={18} color="#978667" /> Air Conditioning</li>
                <li><Icon name="star" size={18} color="#978667" /> Room Service</li>
                <li><Icon name="star" size={18} color="#978667" /> Mini Bar</li>
                <li><Icon name="star" size={18} color="#978667" /> Breakfast Included</li>
                <li><Icon name="star" size={18} color="#978667" /> Sea View</li>
              </ul>
            </div>
            <div className="booking-sidebar">
              <h3>Book This Room</h3>
              <div className="form-group">
                <label>Check In</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Check Out</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Guests</label>
                <select value={bookingGuests} onChange={e => setBookingGuests(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Rooms</label>
                <select value={bookingRooms} onChange={e => setBookingRooms(Number(e.target.value))}>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div style={{ marginTop: 15 }}>
                <CusBtn label="Book Now" onClick={() => navigate("booking")} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  function renderBlog() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ background: `url(${I.bg_banner3}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>Our Blog</h1>
            <p>Latest news and updates</p>
          </div>
        </div>
        <div className="page-section">
          <div className="container-fluid">
            <div className="blog-grid-page">
              <div className="blog-cards">
                {blogPosts.map((b, i) => (
                  <div key={i} className="blog-card" onClick={() => { setBlogId(b.id); navigate("blog-detail"); }}>
                    <div className="img-wrap">
                      <img src={b.img} alt="" />
                      <span className="cat">{b.cat}</span>
                    </div>
                    <div className="content">
                      <p className="date">{b.date}</p>
                      <h3>{b.title}</h3>
                      <p>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="sidebar-widget">
                  <h4>Categories</h4>
                  <ul className="unstyled">
                    <li onClick={() => setFilterCat("all")}>All Blog <span>(6)</span></li>
                    <li onClick={() => setFilterCat("Hotel")}>Hotel <span>(2)</span></li>
                    <li onClick={() => setFilterCat("Spa")}>Spa <span>(1)</span></li>
                    <li onClick={() => setFilterCat("Restaurant")}>Restaurant <span>(1)</span></li>
                    <li onClick={() => setFilterCat("Travel")}>Travel <span>(1)</span></li>
                    <li onClick={() => setFilterCat("Offers")}>Offers <span>(1)</span></li>
                  </ul>
                </div>
                <div className="sidebar-widget">
                  <h4>Recent Posts</h4>
                  <ul className="unstyled">
                    {blogPosts.slice(0, 3).map((b, i) => (
                      <li key={i} onClick={() => { setBlogId(b.id); navigate("blog-detail"); }} style={{ display: "flex", gap: 12, alignItems: "flex-start", border: "none", padding: "10px 0" }}>
                        <img src={b.img} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dark)", lineHeight: 1.4 }}>{b.title}</p>
                          <p style={{ fontSize: 12, color: "var(--text)", marginTop: 5 }}>{b.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  function renderBlogDetail() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ background: `url(${I.blogDetail}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>Blog Detail</h1>
            <p>{currentBlog.title}</p>
          </div>
        </div>
        <div className="page-section">
          <div className="container-fluid">
            <div className="blog-grid-page">
              <div className="blog-detail-article">
                <img src={currentBlog.img} alt="" />
                <div className="meta">
                  <span><Icon name="user" size={14} /> Admin</span>
                  <span><Icon name="star" size={14} /> {currentBlog.date}</span>
                  <span><Icon name="star" size={14} /> {currentBlog.cat}</span>
                </div>
                <h1>{currentBlog.title}</h1>
                <div className="content">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
                  <p>Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                </div>
                <div className="comments-section">
                  <h3>Comments (2)</h3>
                  <div className="comment">
                    <img src={I.user1} alt="" />
                    <div className="comment-body">
                      <h5>Sarah Johnson</h5>
                      <p className="date">March 12, 2025</p>
                      <p>Amazing article! I learned so much about luxury hotel amenities. The attention to detail in this post is truly commendable.</p>
                    </div>
                  </div>
                  <div className="comment">
                    <img src={I.user2} alt="" />
                    <div className="comment-body">
                      <h5>Michael Chen</h5>
                      <p className="date">March 10, 2025</p>
                      <p>Great insights! I have been to several luxury hotels and this guide perfectly captures what makes them special.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="sidebar-widget">
                  <h4>Categories</h4>
                  <ul className="unstyled">
                    <li>Hotel <span>(2)</span></li>
                    <li>Spa <span>(1)</span></li>
                    <li>Restaurant <span>(1)</span></li>
                    <li>Travel <span>(1)</span></li>
                    <li>Offers <span>(1)</span></li>
                  </ul>
                </div>
                <div className="sidebar-widget">
                  <h4>Recent Posts</h4>
                  <ul className="unstyled">
                    {blogPosts.slice(0, 3).map((b, i) => (
                      <li key={i} onClick={() => { setBlogId(b.id); navigate("blog-detail"); }} style={{ display: "flex", gap: 12, alignItems: "flex-start", border: "none", padding: "10px 0" }}>
                        <img src={b.img} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dark)", lineHeight: 1.4 }}>{b.title}</p>
                          <p style={{ fontSize: 12, color: "var(--text)", marginTop: 5 }}>{b.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  function renderRestaurant() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ background: `url(${I.card14}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>Restaurant</h1>
            <p>Exquisite dining experience</p>
          </div>
        </div>
        <div className="restaurant-section">
          <div className="container-fluid">
            <div className="restaurant-about">
              <img src={I.card18} alt="" />
              <div className="info">
                <h2>Fine Dining</h2>
                <p>Indulge in an extraordinary culinary journey at our award-winning restaurant. Our world-class chefs craft exquisite dishes using the finest locally sourced ingredients, creating unforgettable dining experiences.</p>
                <p>From intimate dinners to celebratory feasts, our restaurant offers the perfect ambiance for every occasion. Our carefully curated wine list features selections from the world's finest vineyards.</p>
                <CusBtn label="Make Reservation" onClick={() => navigate("contact")} />
              </div>
            </div>
            <div className="mt-40">
              <div className="sec-heading mb-48">
                <p className="h-18 bold light-black text-uppercase sec-text">Menu</p>
                <h2 className="h-69 light-black sec-title">Signature Dishes</h2>
              </div>
              <div className="menu-highlights">
                {menuItems.map((m, i) => (
                  <div key={i} className="menu-item-card">
                    <img src={m.img} alt="" />
                    <div className="info">
                      <h4>{m.name}</h4>
                      <p>{m.desc}</p>
                      <span className="price">${m.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reservation-cta">
              <h2>Book a Table</h2>
              <p>Reserve your table for an unforgettable dining experience</p>
              <CusBtn label="Reserve Now" onClick={() => navigate("booking")} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  function renderSpa() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ background: `url(${I.card9}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>Spa & Relax</h1>
            <p>Rejuvenate your mind, body, and soul</p>
          </div>
        </div>
        <div className="restaurant-section">
          <div className="container-fluid">
            <div className="restaurant-about">
              <div className="info">
                <h2>Wellness Journey</h2>
                <p>Escape to our serene spa sanctuary where ancient wellness traditions meet modern luxury. Our expert therapists create personalized treatments designed to restore balance and harmony.</p>
                <p>From therapeutic massages to revitalizing facials, every treatment is crafted using premium natural products and time-honored techniques.</p>
                <CusBtn label="Book Treatment" onClick={() => navigate("booking")} />
              </div>
              <img src={I.card10} alt="" />
            </div>
            <div className="mt-40">
              <div className="sec-heading mb-48">
                <p className="h-18 bold light-black text-uppercase sec-text">Treatments</p>
                <h2 className="h-69 light-black sec-title">Spa Therapies</h2>
              </div>
              <div className="spa-treatments">
                {treatmentItems.map((t, i) => (
                  <div key={i} className="treatment-card">
                    <img src={t.img} alt="" />
                    <div className="info">
                      <h3>{t.name}</h3>
                      <p>{t.desc}</p>
                      <span className="price">${t.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  function renderGallery() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ background: `url(${I.gallery1}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>Gallery</h1>
            <p>Explore our beautiful property</p>
          </div>
        </div>
        <div className="page-section">
          <div className="container-fluid">
            <div className="gallery-masonry">
              {featuredGallery.map((g, i) => (
                <div key={i} className="item" onClick={() => setGalleryIdx(i)}>
                  <img src={g.img} alt="" />
                  <div className="overlay">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {galleryIdx >= 0 && (
          <div className="lightbox open" onClick={() => setGalleryIdx(-1)}>
            <span className="close-lightbox" onClick={(e) => { e.stopPropagation(); setGalleryIdx(-1); }}>&times;</span>
            <span className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx - 1 + featuredGallery.length) % featuredGallery.length); }}>
              <Icon name="chevron-left" size={40} />
            </span>
            <img src={featuredGallery[galleryIdx].img} alt="" onClick={e => e.stopPropagation()} />
            <span className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx + 1) % featuredGallery.length); }}>
              <Icon name="chevron-right" size={40} />
            </span>
          </div>
        )}
        <Footer />
      </div>
    );
  }

  function renderContact() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ background: `url(${I.bg_banner}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>Contact Us</h1>
            <p>Get in touch with us</p>
          </div>
        </div>
        <div className="contact-section">
          <div className="container-fluid">
            <div className="contact-grid">
              <div className="contact-info">
                <h2>Get In Touch</h2>
                <div className="contact-detail">
                  <Icon name="phone" size={24} />
                  <div>
                    <h5>Phone</h5>
                    <p>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                  </div>
                </div>
                <div className="contact-detail">
                  <Icon name="envelope" size={24} />
                  <div>
                    <h5>Email</h5>
                    <p>info@luxuryhotel.com<br />reservations@luxuryhotel.com</p>
                  </div>
                </div>
                <div className="contact-detail">
                  <Icon name="location-dot" size={24} />
                  <div>
                    <h5>Location</h5>
                    <p>123 Luxury Avenue, Beverly Hills,<br />California 90210, United States</p>
                  </div>
                </div>
                <div className="social-media">
                  <a><Icon name="facebook" size={20} /></a>
                  <a><Icon name="twitter" size={20} /></a>
                  <a><Icon name="instagram" size={20} /></a>
                  <a><Icon name="linkedin" size={20} /></a>
                </div>
              </div>
              <div className="contact-form">
                <h3>Send a Message</h3>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your name" value={contactName} onChange={e => setContactName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" placeholder="Enter your phone" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea placeholder="Write your message..." value={contactMsg} onChange={e => setContactMsg(e.target.value)} />
                </div>
                <CusBtn label="Send Message" onClick={() => { setContactName(""); setContactEmail(""); setContactPhone(""); setContactMsg(""); }} />
              </div>
            </div>
          </div>
        </div>
        <div className="map-section">
          <div className="container-fluid">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.5!2d-118.4!3d34.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly+Hills%2C+CA!5e0!3m2!1sen!2sus!4v1" allowFullScreen loading="lazy" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  function renderBooking() {
    return (
      <div className="hotel-root">
        <Navbar home={false} />
        <div className="page-hero" style={{ background: `url(${I.bg_banner2}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content">
            <h1>Book Your Stay</h1>
            <p>Reserve your room now</p>
          </div>
        </div>
        <div className="booking-page">
          <div className="container-fluid">
            <div className="booking-form-wrap">
              <h2>Reservation Form</h2>
              <div className="booking-form">
                <div className="row">
                  <div className="form-group">
                    <label>Check In Date</label>
                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Check Out Date</label>
                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Room Type</label>
                    <select value={roomType} onChange={e => setRoomType(e.target.value)}>
                      <option value="">Select Room Type</option>
                      <option value="single">Single Room - $360/night</option>
                      <option value="queen">Queen Room - $360/night</option>
                      <option value="quad">Quad Room - $360/night</option>
                      <option value="double">Double Room - $360/night</option>
                      <option value="deluxe">Deluxe Room - $430/night</option>
                      <option value="suite">Suite - $520/night</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Number of Guests</label>
                    <select value={bookingGuests} onChange={e => setBookingGuests(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Number of Rooms</label>
                    <select value={bookingRooms} onChange={e => setBookingRooms(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Adults</label>
                    <select>
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group full-row">
                  <label>Special Requests</label>
                  <textarea placeholder="Any special requests or requirements..." value={specialReq} onChange={e => setSpecialReq(e.target.value)} />
                </div>
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <CusBtn label="Confirm Booking" onClick={() => { alert("Booking confirmed! We will contact you shortly."); }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className={"preloader" + (loaded ? " loaded" : "")}>
        <svg viewBox="0 0 500 500" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="M66.734 66.734v366.533h366.532V66.734H66.734zm15 15h336.532v336.533H81.734V81.734z" />
            <path d="M354.16 2.5v143.34H497.5V2.5H354.16zm10 10H487.5v123.34H364.16V12.5z" />
            <path d="M0 2.5v143.34h143.34V2.5H0zm10 10h123.34v123.34H10V12.5z" />
            <path d="M354.16 356.66V500H497.5V356.66H354.16zm10 10H487.5V490H364.16V366.66z" />
            <path d="M0 356.66V500h143.34V356.66H0zm10 10h123.34V490H10V366.66z" />
          </g>
        </svg>
      </div>
      <button className={"scroll-top" + (scrolled ? " visible" : "")} onClick={scrollTop}>
        <Icon name="arrow-up" size={20} color="#fff" />
      </button>
      {page === "home" && renderHome()}
      {page === "about" && renderAbout()}
      {page === "rooms" && renderRooms()}
      {page === "room-detail" && renderRoomDetail()}
      {page === "blog" && renderBlog()}
      {page === "blog-detail" && renderBlogDetail()}
      {page === "restaurant" && renderRestaurant()}
      {page === "spa" && renderSpa()}
      {page === "gallery" && renderGallery()}
      {page === "contact" && renderContact()}
      {page === "booking" && renderBooking()}
    </>
  );
}
