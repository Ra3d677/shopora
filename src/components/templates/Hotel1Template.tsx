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
  { id: "grand", name: "Grand Luxury Room", price: 360, img: I.coupleRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make it exceptional." },
  { id: "family", name: "Family Room", price: 380, img: I.familyRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make it exceptional." },
  { id: "deluxe", name: "Deluxe Room", price: 430, img: I.deluxeRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make it exceptional." },
];

const amenities = [
  { icon: I.iconWashroom, label: "LARGE BATHROOM", top: true },
  { icon: I.iconWiFi, label: "HIGH SPEED WIFI", top: false },
  { icon: I.iconSea, label: "AIR CONDITION", top: true },
  { icon: I.iconParking, label: "FREE PARKING", top: false },
  { icon: I.iconPets, label: "PETS ALLOWED", top: true },
  { icon: I.iconWashingMachine, label: "WASHING", top: false },
];

const heroSlides = [
  { bg: I.bg_banner, bgMob: I.bg_mobileBanner, title: "Luxury Suite", sub: "Discounted Prices", align: "center" },
  { bg: I.bg_banner2, bgMob: I.bg_mobileBanner2, title: "Luxury Suite", sub: "Discounted Prices", align: "right" },
  { bg: I.bg_banner3, bgMob: I.bg_mobileBanner3, title: "Luxury Suite", sub: "Discounted Prices", align: "left" },
];

const testimonials = [
  { text: "Consistency is key, and this place nails it every time. Whether it's a quick lunch or a late-night snack, the quality is consistently.", name: "Sarah Johnson", country: "U.S.A", img: I.user1, roomImg: I.card9, roomName: "Luxury Suit" },
  { text: "Consistency is key, and this place nails it every time. Whether it's a quick lunch or a late-night snack, the quality is consistently.", name: "Brian Clark", country: "Canada", img: I.user2, roomImg: I.card10, roomName: "Queen Room" },
  { text: "Consistency is key, and this place nails it every time. Whether it's a quick lunch or a late-night snack, the quality is consistently.", name: "Megan Robinson", country: "Australia", img: I.user3, roomImg: I.card11, roomName: "Family Room" },
  { text: "Consistency is key, and this place nails it every time. Whether it's a quick lunch or a late-night snack, the quality is consistently.", name: "Jonathan Hall", country: "United Kingdom", img: I.user1, roomImg: I.card12, roomName: "Luxury Suit" },
];

const galleryImgs = [I.gallery1, I.gallery2, I.gallery3, I.gallery4, I.gallery5, I.gallery6, I.gallery7];

function CusBtn({ label, dark, onClick }: { label: string; dark?: boolean; onClick?: () => void }) {
  return (
    <button className={"cus-btn" + (dark ? " dark" : "")} onClick={onClick}>
      <span><samp className="text">{label}</samp><samp className="effect">{label}</samp></span>
    </button>
  );
}

export default function Hotel1Template(props: any) {
  useInsertionEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
:root{--primary:#978667;--dark:#282525;--light:#fcfdfd;--text:#979797;--white:#fff;--black:#000;--ff-h:'Open Sans',sans-serif;--ff-b:'Lato',sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--ff-b);background:var(--light);color:var(--text);overflow-x:hidden;font-size:0.9375vw;line-height:1.4}
a{text-decoration:none;color:inherit;cursor:pointer}
img{max-width:100%;height:auto;display:block}ul{list-style:none}
input,button,textarea,select{font-family:inherit;outline:none}
.hotel-root{min-height:100vh;overflow:hidden;background:var(--light)}
.container-fluid{width:96.666vw;margin:0 auto;padding:0}
@media(max-width:1024px){.container-fluid{width:96.875vw}}
@media(max-width:490px){.container-fluid.wd-100{width:100%}}
.row{display:flex;flex-wrap:wrap;margin:0 -12px}
.row>*{padding:0 12px;flex:0 0 auto}
.col-md-4{width:33.333%}@media(max-width:768px){.col-md-4{width:100%}}
.d-flex{display:flex}.align-items-center{align-items:center}
.justify-content-between{justify-content:space-between}
.justify-content-start{justify-content:flex-start}
.text-end{text-align:right}.text-center{text-align:center}
.text-uppercase{text-transform:uppercase}
@media(min-width:993px){.d-sm-flex{display:flex}.d-sm-block{display:block}.d-sm-none{display:none!important}.d-xl-flex{display:flex!important}}
@media(max-width:992px){.d-sm-none{display:none!important}.d-sm-block{display:block!important}.d-xl-flex{display:none!important}}
.fw-400{font-weight:400}
.mb-8{margin-bottom:8px}.mb-16{margin-bottom:16px}.mb-24{margin-bottom:24px}.mb-32{margin-bottom:32px}.mb-40{margin-bottom:40px}.mb-48{margin-bottom:48px}.mt-40{margin-top:40px}.p-24{padding:24px}
.h-111{font-family:var(--ff-h);font-size:5.78vw;font-weight:400;line-height:1.2;letter-spacing:-0.1156vw}
.h-69{font-family:var(--ff-h);font-size:3.59375vw;font-weight:600;line-height:1.2;letter-spacing:0.0359vw}
.h-56{font-family:var(--ff-h);font-size:2.9167vw;font-weight:400;line-height:1.2;letter-spacing:-0.0583vw}
.h-53{font-family:var(--ff-h);font-size:2.76vw;font-weight:600;line-height:1.2;letter-spacing:-0.0276vw}
.h-40{font-family:var(--ff-h);font-size:2.083vw;font-weight:600;line-height:1.2;letter-spacing:-0.0417vw}
.h-31{font-family:var(--ff-h);font-size:1.6146vw;font-weight:600;line-height:1.2;letter-spacing:-0.032vw}
.h-24{font-family:var(--ff-h);font-size:1.25vw;font-weight:600;line-height:1.4;letter-spacing:-0.025vw}
.h-18{font-family:var(--ff-b);font-size:0.9375vw;font-weight:400;line-height:1.4}
.h-18.bold{font-weight:500;line-height:1.2}
.h-16{font-family:var(--ff-b);font-size:0.833vw;font-weight:400;line-height:1.4}
@media(max-width:1024px){
.h-111{font-size:5.96vw}.h-69{font-size:3.516vw}.h-56{font-size:2.93vw}.h-53{font-size:2.93vw}
.h-40{font-size:2.148vw}.h-31{font-size:1.563vw}.h-24{font-size:2.27vw}.h-18{font-size:1.27vw}.h-18.bold{font-size:0.977vw}.h-16{font-size:1.25vw}
}
@media(max-width:768px){.h-24{font-size:2.2vw}.h-18.bold{font-size:1.97vw}.h-16{font-size:1.5vw}}
@media(max-width:490px){
.h-53{font-size:3.93vw}.h-40{font-size:4.148vw}.h-31{font-size:3.5vw}.h-24{font-size:3.2vw}.h-18{font-size:3vw}.h-16{font-size:2.5vw}
}
.color-primary{color:#978667!important}.light-black{color:#282525!important}.dark-gray{color:#979797!important}.white{color:#fcfdfd!important}
.cus-btn{display:inline-flex;align-items:center;justify-content:center;padding:16px 40px;background:#978667;color:#fff;border:none;cursor:pointer;font-family:var(--ff-h);font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;transition:0.3s;overflow:hidden;position:relative}
.cus-btn span{display:flex;flex-direction:column;height:16px;overflow:hidden}
.cus-btn span samp{display:block;transition:0.4s}
.cus-btn span .text{transform:translateY(0)}
.cus-btn span .effect{transform:translateY(-200%)}
.cus-btn:hover span .text{transform:translateY(-200%)}
.cus-btn:hover span .effect{transform:translateY(0)}
.cus-btn.dark{background:transparent;color:#282525;border:2px solid #282525}
.cus-btn.dark:hover{background:#282525;color:#fff}
#preloader{position:fixed;inset:0;background:#282525;display:flex;align-items:center;justify-content:center;z-index:99999;transition:opacity 0.5s,visibility 0.5s}
#preloader.loaded{opacity:0;visibility:hidden;pointer-events:none}
#preloader svg{animation:spin 2s linear infinite}
#preloader svg path{fill:#978667}
@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
.scrollToTopBtn{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:#978667;border:none;border-radius:50%;color:#fff;z-index:9997;opacity:0;visibility:hidden;transform:translateY(20px);transition:0.3s;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 20px rgba(151,134,103,0.4)}
.scrollToTopBtn.visible{opacity:1;visibility:visible;transform:translateY(0)}
.scrollToTopBtn:hover{transform:translateY(-5px)}
.home-header{position:fixed;top:0;left:0;width:100%;z-index:999;background:transparent;padding:30px 40px;transition:0.3s}
.home-header.scrolled{background:rgba(40,37,37,0.95);backdrop-filter:blur(10px);padding:15px 40px}
.home-header .d-flex{display:flex;align-items:center;justify-content:space-between;max-width:1400px;margin:0 auto}
.home-header .logo img{height:45px}
.home-header .link{display:flex;align-items:center;gap:5px;margin:0}
.home-header .link>li>a{padding:10px 18px;color:#fff;font-family:var(--ff-h);font-size:14px;font-weight:600;transition:0.3s;position:relative}
.home-header .link>li>a:hover,.home-header .link>li>a.active{color:#978667}
.link-has-children{position:relative}
.link-has-children>a.sub-menu::after{content:"";display:inline-block;width:6px;height:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);margin-left:6px;margin-bottom:2px;transition:0.3s}
.link-has-children:hover .sub-menu-list{opacity:1;visibility:visible;transform:translateY(0)}
.sub-menu-list{position:absolute;top:100%;left:0;min-width:200px;background:#fff;box-shadow:0 10px 40px rgba(0,0,0,0.1);padding:10px 0;opacity:0;visibility:hidden;transform:translateY(10px);transition:0.3s;z-index:999}
.sub-menu-list li a{display:block;padding:10px 25px;color:#282525;font-size:14px;font-family:var(--ff-h);font-weight:500;transition:0.3s}
.sub-menu-list li a:hover{color:#978667;padding-left:30px}
.nav-logo .logo-icon{display:flex;align-items:center;gap:15px}
.search-block{display:flex;align-items:center;background:rgba(255,255,255,0.1);border-radius:50px;padding:0 15px}
.search-block input{background:transparent;border:none;color:#fff;padding:10px 0;font-size:14px;outline:none;width:150px}
.search-block input::placeholder{color:rgba(255,255,255,0.6)}
.search-block button{background:transparent;border:none;cursor:pointer;display:flex;align-items:center;padding:10px}
.search-block button i{color:#fff;font-size:16px}
.nav-logo .logo-icon>a i{color:#fff;font-size:20px;transition:0.3s}
.nav-logo .logo-icon>a:hover i{color:#978667}
.mobile-header{display:none}
.mobile-header .btn{display:flex;align-items:center;justify-content:center;cursor:pointer;padding:8px;color:#fff}
@media(max-width:992px){
.mobile-header{display:block}
.home-header{padding:15px 20px}
.home-header.scrolled{padding:10px 20px}
.home-header .logo img{height:35px}
}
.sidebar{position:fixed;top:0;right:-320px;width:300px;height:100vh;background:#fff;z-index:9999;padding:30px;transition:0.4s;overflow-y:auto;box-shadow:-5px 0 30px rgba(0,0,0,0.1)}
.sidebar.open{right:0}
.sidebar .logo{margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid #eee}
.sidebar .logo img{height:40px}
.sidebar ul li a{display:block;padding:12px 0;color:#282525;font-family:var(--ff-h);font-size:15px;font-weight:600;border-bottom:1px solid #f0f0f0;transition:0.3s}
.sidebar ul li a:hover,.sidebar ul li.active>a{color:#978667}
.sidebar ul li a.menu-btn{display:flex;align-items:center;justify-content:space-between}
.sidebar ul li .menu-item{display:none;padding-left:15px}
.sidebar ul li .menu-item.open{display:block}
.sidebar ul li .menu-item li a{font-size:14px;padding:10px 0;border-bottom:none}
.hero-banner{position:relative;min-height:100vh;overflow:hidden}
.banner__slider{position:relative;width:100%;height:100vh}
.banner__slider .slide{position:absolute;inset:0;opacity:0;transition:opacity 0.8s;z-index:1}
.banner__slider .slide.active{opacity:1;z-index:2}
.slide__img{position:absolute;inset:0;overflow:hidden}
.slide__img img.full-image{width:100%;height:100%;object-fit:cover}
.slide__content{position:absolute;inset:0;display:flex;align-items:center;z-index:3;padding:0 80px}
.slide__content__right{justify-content:flex-end}
.slide__content__left{justify-content:flex-start}
.slide__content--headings{max-width:700px}
.slide__content__right .slide__content--headings{text-align:right}
.slide__content__left .slide__content--headings{text-align:left}
.slide__content--headings h1{font-family:var(--ff-h);font-size:111px;font-weight:700;color:#282525;line-height:1.1}
.slide__content--headings h4{font-family:var(--ff-h);font-size:56px;font-weight:400;color:#282525}
@media(max-width:992px){
.slide__content--headings h1{font-size:60px}
.slide__content--headings h4{font-size:36px}
.slide__content{padding:0 30px}
}
@media(max-width:768px){
.slide__content--headings h1{font-size:42px}.slide__content--headings h4{font-size:28px}
.hero-dots{bottom:240px}.videoplayer{right:30px;bottom:210px}
}
@media(max-width:490px){
.slide__content--headings h1{font-size:32px}.slide__content--headings h4{font-size:22px}
.slide__content{padding:0 20px}
}
.hero-dots{position:absolute;bottom:200px;left:50%;transform:translateX(-50%);z-index:5;display:flex;gap:10px}
.hero-dots button{width:12px;height:12px;border-radius:50%;border:2px solid rgba(40,37,37,0.4);background:transparent;cursor:pointer;transition:0.3s;padding:0}
.hero-dots button.active{border-color:#978667;background:#978667}
.videoplayer{position:absolute;bottom:180px;right:80px;z-index:5}
.videoplayer .videoplay{cursor:pointer;transition:0.3s}
.videoplayer .videoplay:hover{transform:scale(1.1)}
.booking{position:absolute;bottom:0;left:0;width:100%;z-index:5;padding:0 80px}
.booking-detail{background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);padding:25px 40px;border-radius:20px 20px 0 0}
.booking-detail .info{display:flex;align-items:center;justify-content:space-between;gap:20px}
.booking-detail .detail{display:flex;align-items:center;gap:20px;flex:1}
.booking-detail .detail .input-date-picker{flex:1}
.booking-detail label{font-family:var(--ff-h);font-size:14px;font-weight:700;color:#282525;display:block;margin-bottom:5px}
.booking-detail input.sel-input{width:100%;border:none;background:transparent;padding:8px 0;font-size:14px;color:var(--text);outline:none;border-bottom:1px solid #ddd}
.booking-detail input.sel-input::placeholder{color:#aaa}
.vertical-line{width:1px;height:40px;background:#ddd}
.custom-sel-input-block{position:relative}
.seat-booking{padding:8px 0;border-bottom:1px solid #ddd;font-size:14px;cursor:pointer;display:flex;align-items:center;gap:5px}
.guest-area{position:absolute;top:100%;left:0;width:100%;min-width:280px;background:#fff;box-shadow:0 10px 40px rgba(0,0,0,0.1);border-radius:10px;padding:20px;z-index:10;display:none}
.guest-area.open{display:block}
.guest-area h4{font-family:var(--ff-h);font-size:18px;color:#282525;margin-bottom:20px}
.guest-box .row{display:flex;align-items:center;justify-content:space-between}
.guest-box .content-box h5{font-family:var(--ff-h);font-size:16px;color:#282525;font-weight:600}
.quantity{display:flex;align-items:center;gap:10px}
.quantity input[type="button"]{width:30px;height:30px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:16px;border-radius:4px;transition:0.3s}
.quantity input[type="button"]:hover{background:#978667;color:#fff;border-color:#978667}
.quantity input.number{width:40px;text-align:center;border:none;font-size:16px;font-weight:600;color:#282525;background:transparent}
@media(max-width:992px){
.booking{padding:0 20px}
.booking-detail .info{flex-direction:column}
.booking-detail .detail{flex-wrap:wrap}
.booking-detail .detail .input-date-picker{min-width:calc(50% - 10px)}
.vertical-line{display:none}
}
.rooms{position:relative;z-index:2;background:var(--light);padding:100px 0}
.sec-heading{text-align:center;margin-bottom:48px}
.sec-heading .sec-text{font-family:var(--ff-h);font-size:18px;font-weight:700;color:#282525;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
.sec-heading .sec-title{font-family:var(--ff-h);font-size:69px;font-weight:700;color:#282525;line-height:1.1}
@media(max-width:992px){.sec-heading .sec-title{font-size:48px}}
@media(max-width:768px){.sec-heading .sec-title{font-size:36px}}
@media(max-width:490px){.sec-heading .sec-title{font-size:28px}}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
@media(max-width:992px){.cards{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.cards{grid-template-columns:1fr}.rooms{padding:60px 0}}
.card-item{background:#fff;border-radius:12px;overflow:hidden;transition:0.4s;display:block;box-shadow:0 5px 30px rgba(0,0,0,0.05)}
.card-item:hover{transform:translateY(-8px);box-shadow:0 15px 50px rgba(0,0,0,0.1)}
.card-image{position:relative;overflow:hidden}
.card-image>img.card-image{width:100%;height:280px;object-fit:cover;transition:0.5s}
.card-item:hover .card-image>img.card-image{transform:scale(1.08)}
.card-price{position:absolute;bottom:15px;left:15px;z-index:2}
.card-price p{display:flex;align-items:baseline;gap:5px;color:#fff}
.card-price p .price{font-family:var(--ff-h);font-size:31px;font-weight:700;color:#978667}
.card-price p .light-bold{font-size:14px}
.card-image .icon{position:absolute;top:15px;right:15px;width:40px;height:40px;opacity:0;transform:translateY(-10px);transition:0.4s;z-index:2}
.card-item:hover .card-image .icon{opacity:1;transform:translateY(0)}
.card-image .corner-shape{position:absolute;bottom:0;right:0;width:100px;z-index:1}
.text-block{padding:24px}
.name-rating{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.name-rating h4{font-family:var(--ff-h);font-size:31px;color:#282525;font-weight:700}
.name-rating .rating p{display:flex;align-items:center;gap:5px;font-size:14px;color:var(--text)}
.sample-text{font-size:15px;color:var(--text);line-height:1.7;margin-bottom:32px}
.services{display:flex;gap:20px;flex-wrap:wrap}
.services li{display:flex;align-items:center;gap:8px}
.services li img{width:20px;height:20px;object-fit:contain}
.services li p{font-size:14px;font-weight:700;color:#282525;white-space:nowrap}
.btn-block{padding-top:40px}
.resturent-video{position:relative;padding:0 40px}
.resturent-video .content{position:relative}
.resturent-video .top-cornner{position:absolute;top:-20px;right:-20px;z-index:2;width:100px}
.resturent-video .bottom-cornner{position:absolute;bottom:-20px;right:-20px;z-index:2;width:100px}
.resturent-video .bg-video{border-radius:20px;overflow:hidden;position:relative}
.resturent-video .bg-video video{width:100%;height:500px;object-fit:cover;display:block}
@media(max-width:768px){.resturent-video{padding:0 20px}.resturent-video .bg-video video{height:300px}}
.suite-room{padding:100px 0}
.suite-room .sec-heading.sec{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:48px;flex-wrap:wrap;gap:20px}
.suite-room .sec-heading .heading-content{text-align:right}
.suite-room .sec-heading .heading-content p{font-family:var(--ff-h);font-size:18px;font-weight:700;color:#282525;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
.suite-room .sec-heading .heading-content h2{font-family:var(--ff-h);font-size:69px;font-weight:700;color:#282525}
@media(max-width:992px){.suite-room .sec-heading .heading-content h2{font-size:48px}}
@media(max-width:768px){.suite-room .sec-heading .heading-content h2{font-size:36px}.suite-room{padding:50px 0}}
@media(max-width:490px){.suite-room .sec-heading .heading-content h2{font-size:28px}}
.slider-arrow{display:flex;gap:15px}
.slider-arrow .arrow{width:55px;height:55px;border:1px solid #ddd;border-radius:50%;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.3s}
.slider-arrow .arrow:hover{border-color:#978667;background:#978667}
.slider-arrow .arrow:hover svg path{stroke:#fff!important}
.slider-arrow .arrow svg{width:32px;height:32px}
.slider-arrow .arrow svg path{stroke:#282525;transition:0.3s}
.suite-room .room-slider .slide{display:flex;align-items:center;gap:60px}
.suite-room .room-slider .slide__img{flex:0 0 55%;position:relative}
.suite-room .room-slider .slide__img img.room_image{width:100%;height:500px;object-fit:cover;border-radius:20px}
.suite-room .room-slider .slide__img .side_vector{position:absolute;top:-30px;left:-30px;width:120px;z-index:-1}
.suite-room .room-slider .slide__img .side_vector_mobile{display:none}
.suite-room .room-slider .slide__content{flex:1}
.suite-room .room-slider .slide__content .content-block h2{font-family:var(--ff-h);font-size:53px;color:#282525;font-weight:700}
@media(max-width:992px){
.suite-room .room-slider .slide{flex-direction:column}
.suite-room .room-slider .slide__img{flex:1;width:100%}
.suite-room .room-slider .slide__img img.room_image{height:350px}
.suite-room .room-slider .slide__content .content-block h2{font-size:36px}
}
@media(max-width:768px){.suite-room .room-slider .slide__img img.room_image{height:250px}.suite-room .room-slider .slide__content .content-block h2{font-size:28px}}
@media(max-width:490px){.suite-room .room-slider .slide__content .content-block h2{font-size:24px}}
.suite-room .room-slider .slide__content .price-rating{display:flex;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:32px}
.suite-room .room-slider .slide__content .price-rating .h-40{font-family:var(--ff-h);font-size:40px;font-weight:700;color:#978667}
.suite-room .room-slider .slide__content .price-rating .light-bold{font-size:14px;color:#282525}
.suite-room .room-slider .slide__content .price-rating .reviews-text{font-size:14px;display:flex;align-items:center;gap:8px}
.suite-room .room-slider .slide__content p.reviews-text{font-size:15px;color:var(--text);line-height:1.8;margin-bottom:32px}
.activities{padding:80px 0}
.activities .sec-heading .heading-content p{font-family:var(--ff-h);font-size:18px;font-weight:700;color:#282525;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
.activities .sec-heading .heading-content h2{font-family:var(--ff-h);font-size:69px;font-weight:700;color:#282525}
@media(max-width:768px){.activities .sec-heading .heading-content h2{font-size:36px}}
.activitie-card{position:relative;border-radius:20px;overflow:hidden;margin-bottom:24px;cursor:pointer;transition:0.4s}
.activitie-card:hover{transform:translateY(-8px)}
.activitie-card .intersect{position:absolute;top:0;left:0;width:40%;z-index:1}
.activitie-card .card-image img{width:100%;height:auto;border-radius:20px}
.activitie-card .card-content{padding:24px;position:absolute;bottom:0;left:0;color:#fff;z-index:2}
.activitie-card .card-content h5{font-family:var(--ff-h);font-size:31px;font-weight:700;color:#fff}
.activitie-card .card-content p{font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6}
.activitie-card.sec .card-image{display:flex;gap:10px}
.activitie-card.sec .card-image img{width:calc(50% - 5px);height:300px;object-fit:cover}
.activitie-card.right .card-content{position:relative;background:#fff;color:#282525;min-height:200px}
.activitie-card.right .card-content h5{color:#282525}
.activitie-card.right .card-content p{color:var(--text)}
.amenities{margin-top:40px;overflow:hidden}
.amenities-slider{display:flex;flex-wrap:wrap;gap:24px;justify-content:center}
.amenities-slider .slider-slide{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 30px;border-radius:16px;position:relative;overflow:hidden;min-width:160px;flex:1;max-width:200px;transition:0.4s}
.amenities-slider .slider-slide:hover{transform:translateY(-8px)}
.amenities-slider .slider-slide.top{background:#fff;box-shadow:0 5px 30px rgba(0,0,0,0.05)}
.amenities-slider .slider-slide.bottom{background:#282525}
.amenities-slider .slider-slide h6{font-family:var(--ff-h);font-size:16px;font-weight:600;text-align:center;letter-spacing:1px}
.amenities-slider .slider-slide.bottom h6{color:#fcfdfd}
.amenities-slider .slider-slide .shape{position:absolute}
.amenities-slider .slider-slide .shape.left-shape{top:0;left:0;width:60px}
.amenities-slider .slider-slide .shape.right-shape{top:0;right:0;width:60px}
.amenities-slider .slider-slide img.icon{height:60px;display:inline-block}
.amenities-shape{text-align:right;margin-top:20px}
.testimonial{padding:80px 0}
.testimonial .sec-heading.right-2{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:48px;flex-wrap:wrap;gap:20px}
.testimonial .sec-heading .heading-content p{font-family:var(--ff-h);font-size:18px;font-weight:700;color:#282525;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
.testimonial .sec-heading .heading-content h2{font-family:var(--ff-h);font-size:69px;font-weight:700;color:#282525}
.testimonial .testimonial-slider{display:flex;gap:24px;overflow-x:auto;padding:10px 0;scroll-snap-type:x mandatory}
.testimonial .testimonial-slider::-webkit-scrollbar{display:none}
.testimonial .slider-slide{flex:0 0 calc(33.333% - 16px);background:#fff;border-radius:12px;padding:30px;box-shadow:0 5px 30px rgba(0,0,0,0.05);scroll-snap-align:start;transition:0.4s}
.testimonial .slider-slide:hover{transform:translateY(-8px)}
@media(max-width:992px){.testimonial .slider-slide{flex:0 0 calc(50% - 12px)}}
@media(max-width:768px){.testimonial .slider-slide{flex:0 0 100%}}
.testimonial .user-detail{display:flex;align-items:center;gap:15px;margin-bottom:20px}
.testimonial .user-detail img{width:50px;height:50px;border-radius:50%;object-fit:cover}
.testimonial .user-detail .name h6{font-family:var(--ff-h);font-size:18px;font-weight:700;color:#282525}
.testimonial .room{display:flex;align-items:center;gap:12px;background:#282525;border-radius:10px;padding:12px;position:relative}
.testimonial .room img{width:80px;height:60px;object-fit:cover;border-radius:8px;flex-shrink:0}
.testimonial .room .info{flex:1}
.testimonial .room .info .text h6{font-family:var(--ff-h);font-size:16px;font-weight:700;color:#fff;margin-bottom:5px}
.testimonial .room .info .text p{font-size:12px;color:rgba(255,255,255,0.8);display:flex;gap:4px;align-items:center;flex-wrap:wrap}
.testimonial .room a{position:absolute;bottom:12px;right:12px}
.gallery{padding:80px 0}
.gallery .sec-heading .heading-content p{font-family:var(--ff-h);font-size:18px;font-weight:700;color:#282525;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px}
.gallery .sec-heading .heading-content h2{font-family:var(--ff-h);font-size:69px;font-weight:700;color:#282525}
.image-container{margin-bottom:24px}
.image-container img{width:100%;border-radius:12px;max-height:500px;object-fit:cover}
.imag-card{display:flex;gap:24px}
.imag-card .images{flex:1;display:flex;flex-direction:column;gap:24px}
.imag-card .images .gallery-img{border-radius:12px;overflow:hidden}
.imag-card .images .gallery-img img{width:100%;height:250px;object-fit:cover;transition:0.5s;cursor:pointer}
.imag-card .images .gallery-img img:hover{transform:scale(1.05)}
@media(max-width:768px){.imag-card{flex-direction:column}.gallery{padding:50px 0}}
.footer{background:#282525;padding:80px 0 0;position:relative;overflow:hidden}
.footer .content{text-align:center}
.footer .footer-logo{height:60px;margin-bottom:30px;display:inline-block}
.footer .content-detail{margin-bottom:40px}
.footer .category{display:flex;justify-content:center;gap:30px;margin-bottom:30px;flex-wrap:wrap}
.footer .category li a{font-family:var(--ff-h);font-size:20px;font-weight:400;color:rgba(255,255,255,0.7);transition:0.3s}
.footer .category li a:hover{color:#978667}
.footer .center-content{display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;margin-bottom:30px}
.footer .contact-list{display:flex;gap:30px;flex-wrap:wrap;justify-content:center}
.footer .contact-list li .icon-detail{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.6);font-size:14px}
.footer .contact-list li .icon-detail i{color:#978667;font-size:16px}
.footer .contact-list li .icon-detail a{color:rgba(255,255,255,0.6);transition:0.3s}
.footer .contact-list li .icon-detail a:hover{color:#978667}
.footer .vr-line{width:1px;height:50px;background:rgba(255,255,255,0.15)}
.footer .subscribe-block{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.footer .subscribe-block input{padding:16px 20px;border:1px solid rgba(255,255,255,0.2);border-radius:8px;background:transparent;color:#fff;font-size:14px;outline:none;width:300px;transition:0.3s}
.footer .subscribe-block input:focus{border-color:#978667}
.footer .subscribe-block input::placeholder{color:rgba(255,255,255,0.4)}
.footer .bottom-text{border-top:1px solid rgba(255,255,255,0.1);padding:25px 0;margin-top:40px}
.footer .bottom-text p{color:rgba(255,255,255,0.5);font-size:14px}
@media(max-width:768px){
.footer{padding:50px 0 0}
.footer .category{flex-direction:column;align-items:center;gap:15px}
.footer .center-content{flex-direction:column;gap:20px}
.footer .contact-list{flex-direction:column;align-items:center;gap:15px}
.footer .vr-line{display:none}
.footer .subscribe-block input{width:100%}
.activitie-card .card-content h5{font-size:24px}
}
.overlay-mob{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9998;opacity:0;visibility:hidden;transition:0.3s}
.overlay-mob.open{opacity:1;visibility:visible}
.unstyled{list-style:none;padding:0;margin:0}
.text-sm-center{text-align:center}
`;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);
  const [page, setPage] = useState("home");
  const [slideIdx, setSlideIdx] = useState(0);
  const [suiteIdx, setSuiteIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobSub, setMobSub] = useState<string | null>(null);
  const [guestPop, setGuestPop] = useState(false);
  const [bookingGuests, setBookingGuests] = useState(0);
  const [bookingRooms, setBookingRooms] = useState(0);
  const [testiIdx, setTestiIdx] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const navigate = (p: string) => { setPage(p); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const navigateCB = useCallback(navigate, []);

  const renderNavLinks = () => (
    <ul className="link unstyled d-sm-flex d-none align-items-center">
      <li><a className={page === "home" ? "active" : ""} onClick={() => navigate("home")}>Home</a></li>
      <li><a className={page === "about" ? "active" : ""} onClick={() => navigate("about")}>About</a></li>
      <li className="link-has-children">
        <a className="sub-menu">Rooms</a>
        <ul className="unstyled sub-menu-list">
          <li><a onClick={() => navigate("rooms")}>Room Grid</a></li>
          <li><a onClick={() => navigate("rooms")}>Room List</a></li>
          <li><a onClick={() => navigate("room-detail")}>Room Detail</a></li>
        </ul>
      </li>
      <li className="link-has-children">
        <a className="sub-menu">Blogs</a>
        <ul className="unstyled sub-menu-list">
          <li><a onClick={() => navigate("blog")}>Blog Grid</a></li>
          <li><a onClick={() => navigate("blog")}>Blog Sidebar</a></li>
          <li><a onClick={() => navigate("blog-detail")}>Blog Detail</a></li>
        </ul>
      </li>
      <li className="link-has-children">
        <a className="sub-menu">Pages</a>
        <ul className="unstyled sub-menu-list">
          <li><a onClick={() => navigate("restaurant")}>Restaurant</a></li>
          <li><a onClick={() => navigate("spa")}>Spa & Relax</a></li>
          <li><a onClick={() => navigate("gallery")}>Gallery</a></li>
          <li><a onClick={() => navigate("offers")}>Offers</a></li>
          <li><a onClick={() => navigate("booking")}>Bookings</a></li>
          <li><a onClick={() => navigate("register")}>Register</a></li>
          <li><a onClick={() => navigate("login")}>Login</a></li>
          <li><a onClick={() => navigate("coming-soon")}>Coming Soon</a></li>
          <li><a onClick={() => navigate("error")}>404</a></li>
        </ul>
      </li>
      <li><a className={page === "contact" ? "active" : ""} onClick={() => navigate("contact")}>Contact</a></li>
    </ul>
  );

  const renderMobileNav = () => (
    <div className="mobile-header d-sm-none d-block">
      <div className="btn" onClick={() => setMobileOpen(o => !o)}>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.3135 3.125H5.31348V4.375H20.3135V3.125ZM0.313477 9.375H20.3135V10.625H0.313477V9.375ZM5.31348 15.625H20.3135V16.875H5.31348V15.625Z" fill="currentColor" />
          </svg>
        </span>
      </div>
      <div className={"overlay-mob" + (mobileOpen ? " open" : "")} onClick={() => setMobileOpen(false)} />
      <nav className={"sidebar" + (mobileOpen ? " open" : "")}>
        <div className="logo">
          <a><img src={I.mobileLogo} alt="" /></a>
        </div>
        <ul className="unstyled">
          <li className={page === "home" ? "active" : ""}><a onClick={() => navigate("home")}>Home</a></li>
          <li className={page === "about" ? "active" : ""}><a onClick={() => navigate("about")}>About</a></li>
          <li>
            <a className={"menu-btn" + (mobSub === "Rooms" ? " open" : "")} onClick={() => setMobSub(mobSub === "Rooms" ? null : "Rooms")}>
              Rooms <i className="fas fa-caret-down first"></i>
            </a>
            <ul className={"menu-item" + (mobSub === "Rooms" ? " open" : "")}>
              <li><a onClick={() => navigate("rooms")}>Rooms Grid</a></li>
              <li><a onClick={() => navigate("rooms")}>Rooms List</a></li>
              <li><a onClick={() => navigate("room-detail")}>Rooms Detail</a></li>
            </ul>
          </li>
          <li>
            <a className={"menu-btn" + (mobSub === "Blogs" ? " open" : "")} onClick={() => setMobSub(mobSub === "Blogs" ? null : "Blogs")}>
              Blogs <i className="fas fa-caret-down second"></i>
            </a>
            <ul className={"menu-item" + (mobSub === "Blogs" ? " open" : "")}>
              <li><a onClick={() => navigate("blog")}>Blogs Grid</a></li>
              <li><a onClick={() => navigate("blog")}>Blogs Sidebar</a></li>
              <li><a onClick={() => navigate("blog-detail")}>Blogs Detail</a></li>
            </ul>
          </li>
          <li>
            <a className={"menu-btn" + (mobSub === "Pages" ? " open" : "")} onClick={() => setMobSub(mobSub === "Pages" ? null : "Pages")}>
              Pages <i className="fas fa-caret-down third"></i>
            </a>
            <ul className={"menu-item" + (mobSub === "Pages" ? " open" : "")}>
              <li><a onClick={() => navigate("restaurant")}>Restaurant</a></li>
              <li><a onClick={() => navigate("spa")}>Spa & Relax</a></li>
              <li><a onClick={() => navigate("offers")}>Offers</a></li>
              <li><a onClick={() => navigate("contact")}>Contact Us</a></li>
              <li><a onClick={() => navigate("booking")}>Booking Form</a></li>
              <li><a onClick={() => navigate("login")}>Login</a></li>
              <li><a onClick={() => navigate("register")}>Register</a></li>
              <li><a onClick={() => navigate("gallery")}>Gallery</a></li>
              <li><a onClick={() => navigate("error")}>Error</a></li>
              <li><a onClick={() => navigate("coming-soon")}>Coming Soon</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );

  const renderSearch = () => (
    <div className="nav-logo d-sm-flex d-none">
      <div className="logo-icon">
        <form onSubmit={e => e.preventDefault()}>
          <div className="search-block">
            <input type="search" name="search" id="search" placeholder="Search..." value={searchVal} onChange={e => setSearchVal(e.target.value)} />
            <button type="submit"><i className="fa-light fa-magnifying-glass"></i></button>
          </div>
        </form>
        <a><i className="fa-light fa-user"></i></a>
      </div>
    </div>
  );

  const sections = (
    <>
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo">
            <a><img src={I.logo} alt="" /></a>
          </div>
          {renderNavLinks()}
          {renderMobileNav()}
          {renderSearch()}
        </div>
      </header>

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
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <g clipPath="url(#clip0_565_644)">
                    <path d="M27.3137 4.68625C24.2917 1.66433 20.2737 0 16 0C11.7263 0 7.70831 1.66433 4.68625 4.68625C1.66433 7.70831 0 11.7263 0 16C0 20.2737 1.66433 24.2917 4.68625 27.3137C7.70831 30.3357 11.7263 32 16 32C20.2737 32 24.2917 30.3357 27.3137 27.3137C30.3357 24.2917 32 20.2737 32 16C32 11.7263 30.3357 7.70831 27.3137 4.68625ZM16 30.0206C8.269 30.0206 1.97938 23.731 1.97938 16C1.97938 8.269 8.269 1.97938 16 1.97938C23.731 1.97938 30.0206 8.269 30.0206 16C30.0206 23.731 23.731 30.0206 16 30.0206Z" fill="#FFFBFA" />
                    <path d="M11.9464 22.207L22.6928 16L11.9464 9.79299V22.207Z" fill="#FFFBFA" />
                  </g>
                  <defs><clipPath id="clip0_565_644"><rect width="32" height="32" fill="white" /></clipPath></defs>
                </svg>
              </div>
            </div>
            <div className="booking">
              <div className="booking-detail">
                <form onSubmit={e => e.preventDefault()}>
                  <div className="info">
                    <div className="detail">
                      <div className="input-date-picker">
                        <label className="date_label h-18 dark-gray">Check In</label>
                        <input type="text" className="sel-input date_from" placeholder="30 Jan, 2024" />
                      </div>
                      <div className="vertical-line d-xl-flex d-none" />
                      <div className="input-date-picker">
                        <label className="date_label h-18 dark-gray">Check Out</label>
                        <input type="text" className="sel-input date_to" placeholder="30 Jan, 2024" />
                      </div>
                      <div className="vertical-line d-xl-flex d-none" />
                      <div className="input-date-picker">
                        <label className="date_label h-18 dark-gray mb-1">Guests and Rooms</label>
                        <div className="custom-sel-input-block">
                          <div className="seat-booking light-black sel-input" onClick={() => setGuestPop(o => !o)}>
                            <span className="total-pasenger">{bookingGuests}</span> Guest /
                            <span className="total-room"> {bookingRooms}</span> Room
                          </div>
                          <div className={"guest-area guest-box bg-white light-shadow br-5 p-24" + (guestPop ? " open" : "")}>
                            <h4 className="light-black mb-32">Select Guests</h4>
                            <div className="guest-box mb-24">
                              <div className="row">
                                <div className="col-md-7 col-sm-6 col-6">
                                  <div className="content-box"><h5 className="h-18 fw-600 light-black">Guest</h5></div>
                                </div>
                                <div className="col-md-5 col-sm-6 col-6">
                                  <div className="quantity quantity-wrap">
                                    <input className="decrement" type="button" value="-" onClick={() => setBookingGuests(Math.max(0, bookingGuests - 1))} />
                                    <input type="text" name="quantity" value={bookingGuests} maxLength={2} size={1} id="guest" className="number" readOnly />
                                    <input className="increment" type="button" value="+" onClick={() => setBookingGuests(bookingGuests + 1)} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="guest-box">
                              <div className="row">
                                <div className="col-md-7 col-sm-6 col-6">
                                  <div className="content-box"><h5 className="h-18 fw-600 light-black">Room</h5></div>
                                </div>
                                <div className="col-md-5 col-sm-6 col-6">
                                  <div className="quantity quantity-wrap">
                                    <input className="decrement" type="button" value="-" onClick={() => setBookingRooms(Math.max(0, bookingRooms - 1))} />
                                    <input type="text" name="quantity" value={bookingRooms} maxLength={2} size={1} id="room" className="number" readOnly />
                                    <input className="increment" type="button" value="+" onClick={() => setBookingRooms(bookingRooms + 1)} />
                                  </div>
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
                  <a key={i} className="card-item" onClick={() => navigate("room-detail")}>
                    <div className="card-image mb-24">
                      <div className="card-price">
                        <p><span className="color-primary price h-31">${r.price}</span><span className="light-bold">/Night</span></p>
                      </div>
                      <img src={r.img} className="card-image" alt="" />
                      <img src={I.iconArrowDark} className="icon" alt="" />
                      <img src={I.vecBottomShape} className="corner-shape" alt="" />
                    </div>
                    <div className="text-block">
                      <div className="name-rating d-flex align-items-center justify-content-between mb-16">
                        <h4 className="h-31 light-black">{r.name}</h4>
                        <div className="rating">
                          <p className="light-bold"><i className="fa-solid fa-star color-primary"></i> 4.9</p>
                        </div>
                      </div>
                      <p className="sample-text mb-32">{r.desc}</p>
                      <ul className="services unstyled">
                        <li><img src={I.iconKingBed} alt="" /><p className="h-18 bold light-black">King Size Bed</p></li>
                        <li><img src={I.iconTv} alt="" /><p className="h-18 bold light-black">32 Inc TV</p></li>
                        <li><img src={I.iconBreakfast} alt="" /><p className="h-18 bold light-black">Breakfast</p></li>
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
              <video src="https://res.cloudinary.com/dno6yitvw/video/upload/v1781181005/hotel1/hotel-video.mp4" loop muted autoPlay></video>
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
              <button className="arrow prev-btn" onClick={() => setSuiteIdx(i => (i - 1 + suites.length) % suites.length)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
                  <path d="M12.8057 23C12.8057 20 10.0057 16 6.80566 16M6.80566 16C8.639 16 12.8057 15 12.8057 9M6.80566 16H25.8057" stroke="#1B1918" strokeWidth="2" />
                </svg>
              </button>
              <button className="arrow next-btn" onClick={() => setSuiteIdx(i => (i + 1) % suites.length)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M19.3545 23C19.3545 20 22.1545 16 25.3545 16M25.3545 16C23.5212 16 19.3545 15 19.3545 9M25.3545 16H6.35449" stroke="#1B1918" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
          <div className="content">
            <div className="room-slider sliders" data-parent="suite-room">
              <div className="slide">
                <div className="slide__img">
                  <img className="room_image" src={suites[suiteIdx].img} alt="" />
                  <img src={I.vecLuxuryRoom} alt="" className="side_vector d-sm-block d-none" />
                  <img src={I.vecMobileRoom} alt="" className="side_vector_mobile d-sm-none d-block" />
                </div>
                <div className="slide__content">
                  <div className="content-block animated faster">
                    <h2 className="h-53 light-black mb-16"><a onClick={() => navigate("room-detail")}>{suites[suiteIdx].name}</a></h2>
                    <div className="price-rating mb-32">
                      <p><span className="color-primary h-40">${suites[suiteIdx].price}</span><span className="light-bold light-black">/Night</span></p>
                      <p className="light-bold reviews-text"><i className="fa-solid fa-star color-primary"></i> 4.9 (93) REVIEWS</p>
                    </div>
                    <p className="mb-32 reviews-text">{suites[suiteIdx].desc}</p>
                    <ul className="services unstyled mb-32">
                      <li><img src={I.iconKingBed} alt="" /><p className="h-18 bold light-black">King Size Bed</p></li>
                      <li><img src={I.iconTv} alt="" /><p className="h-18 bold light-black">32 Inc TV</p></li>
                      <li><img src={I.iconBreakfast} alt="" /><p className="h-18 bold light-black">Breakfast</p></li>
                    </ul>
                    <CusBtn label="Book Now" onClick={() => navigate("booking")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-shape text-end">
            <img src={I.rightCornerShape} alt="" />
          </div>
        </div>
      </section>
      <section className="activities">
        <div className="container-fluid">
          <div className="sec-heading sec-2 text-start">
            <div className="heading-content">
              <p className="h-18 bold light-black justify-content-start text-uppercase sec-text">Facilities</p>
              <h2 className="h-69 light-black local-activities">Local Activities</h2>
            </div>
          </div>
          <div className="content">
            <div className="row mb-48">
              <div className="col-md-4">
                <a className="activitie-card" onClick={() => navigate("restaurant")}>
                  <div className="intersect"><img src={I.vecCenterShape} alt="" /></div>
                  <div className="card-image"><img src={I.card14} alt="" /></div>
                  <div className="card-content">
                    <h5 className="h-31 mb-32 card-title">Restaurant</h5>
                    <p>Consistency is key, and this place nails it every time. Whether it&apos;s a quick lunch or a late-night snack, the quality is consistently.</p>
                  </div>
                </a>
              </div>
              <div className="col-md-4">
                <a className="activitie-card sec" onClick={() => navigate("spa")}>
                  <div className="intersect"><img src={I.vecCenterShape} alt="" /></div>
                  <div className="card-content d-sm-block d-none">
                    <h5 className="h-31 mb-32 card-title">Swimming Pool &amp; SPA</h5>
                    <p>Lorem ipsum dolor sit amet consectetur. Nec vel arcu mi pulvinar egestas. Libero ut nisi mauris sed.</p>
                  </div>
                  <div className="card-image">
                    <img src={I.card15} alt="" />
                    <img src={I.card16} alt="" />
                  </div>
                  <div className="card-content d-sm-none d-block">
                    <h5 className="h-31 mb-32 card-title">Swimming Pool &amp; SPA</h5>
                    <p>Lorem ipsum dolor sit amet consectetur. Nec vel arcu mi pulvinar egestas. Libero ut nisi mauris sed.</p>
                  </div>
                </a>
              </div>
              <div className="col-md-4">
                <a className="activitie-card right">
                  <div className="card-content d-sm-block d-none">
                    <h5 className="h-31 mb-32 card-title">Horse Ride</h5>
                    <p>Consistency is key, and this place nails it every time. Whether it&apos;s a quick lunch or a late-night snack, the quality is consistently.</p>
                  </div>
                  <div className="card-image"><img src={I.card17} alt="" /></div>
                  <div className="card-content d-sm-none d-block">
                    <h5 className="h-31 mb-32 card-title">Horse Ride</h5>
                    <p>Consistency is key, and this place nails it every time. Whether it&apos;s a quick lunch or a late-night snack, the quality is consistently.</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="amenities">
              <div className="amenities-slider">
                {amenities.map((a, i) => (
                  <div key={i} className={"slider-slide " + (i % 2 === 0 ? "top" : "bottom")}>
                    {i % 2 === 0 ? (
                      <>
                        <img src={I.vecTopLeft} className="shape left-shape" alt="" />
                        <img src={I.vecTopRight} className="shape right-shape" alt="" />
                      </>
                    ) : (
                      <>
                        <img src={I.vecBottomLeft} className="shape left-shape" alt="" />
                        <img src={I.vecBottomRight} className="shape right-shape" alt="" />
                      </>
                    )}
                    <img src={a.icon} className="icon mb-16" alt="" />
                    <h6 className={i % 2 === 0 ? "h-24 light-black" : "h-24 white"}>{a.label}</h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="amenities-shape text-end">
            <img src={I.vecActivities} alt="" />
          </div>
        </div>
      </section>

      <section className="testimonial">
        <div className="container-fluid">
          <div className="sec-heading right-2 text-start">
            <div className="heading-content">
              <p className="h-18 bold light-black justify-content-start sec-text">TESTIMONIALS</p>
              <h2 className="h-69 light-black satisfied-customer">Satisfied Customers</h2>
            </div>
            <div className="slider-arrow">
              <button className="arrow prev-btn" onClick={() => setTestiIdx(i => (i - 1 + testimonials.length) % testimonials.length)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
                  <path d="M12.8057 23C12.8057 20 10.0057 16 6.80566 16M6.80566 16C8.639 16 12.8057 15 12.8057 9M6.80566 16H25.8057" stroke="#1B1918" strokeWidth="2" />
                </svg>
              </button>
              <button className="arrow next-btn" onClick={() => setTestiIdx(i => (i + 1) % testimonials.length)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M19.3545 23C19.3545 20 22.1545 16 25.3545 16M25.3545 16C23.5212 16 19.3545 15 19.3545 9M25.3545 16H6.35449" stroke="#1B1918" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
          <div className="content">
            <div className="testimonial-slider sliders" data-parent="testimonial">
              {testimonials.map((t, i) => (
                <div key={i} className="slider-slide">
                  <p className="h-16 mb-32">&ldquo;{t.text}&rdquo;</p>
                  <div className="user-detail mb-32">
                    <img src={t.img} alt="" />
                    <div className="name">
                      <h6 className="h-24 mb-8 light-black">{t.name}</h6>
                      <p className="h-16 light-black">{t.country}</p>
                    </div>
                  </div>
                  <div className="room">
                    <img src={t.roomImg} alt="" />
                    <div className="info">
                      <div className="text">
                        <h6 className="h-24 white mb-8">{t.roomName}</h6>
                        <p className="h-16 white">
                          <span><i className="fa-solid fa-star-sharp color-primary"></i></span>
                          <span><i className="fa-solid fa-star-sharp color-primary"></i></span>
                          <span><i className="fa-solid fa-star-sharp color-primary"></i></span>
                          <span><i className="fa-solid fa-star-sharp color-primary"></i></span>
                          <span><i className="fa-solid fa-star-sharp color-primary"></i></span>
                          <span>(93) REVIEWS</span>
                        </p>
                      </div>
                      <a>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" fill="none" width="24" height="24">
                          <path d="M21.2334 18.3228C19.7334 16.8228 19.1334 13.4228 20.7334 11.8228M20.7334 11.8228C19.8167 12.7394 17.2334 14.3228 14.2334 11.3228M20.7334 11.8228L11.2334 21.3228" stroke="#FCFDFD" strokeWidth="1.41421" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom-shape text-end">
            <img src={I.rightCornerShape} alt="" />
          </div>
        </div>
      </section>

      <section className="gallery">
        <div className="container-fluid">
          <div className="sec-heading sec-2 text-start">
            <div className="heading-content">
              <p className="h-18 bold light-black justify-content-start text-uppercase sec-text">Gallery</p>
              <h2 className="h-69 light-black local-activities">Interior Gallery</h2>
            </div>
          </div>
          <div className="content">
            <div className="image-container mb-40">
              <img src={galleryImgs[0]} alt="" />
            </div>
            <div className="imag-card">
              <div className="images">
                <div className="gallery-img"><img src={galleryImgs[1]} alt="" /></div>
                <div className="gallery-img"><img src={galleryImgs[2]} alt="" /></div>
                <div className="gallery-img"><img src={galleryImgs[3]} alt="" /></div>
              </div>
              <div className="images">
                <div className="gallery-img"><img src={galleryImgs[4]} alt="" /></div>
                <div className="gallery-img"><img src={galleryImgs[5]} alt="" /></div>
                <div className="gallery-img"><img src={galleryImgs[6]} alt="" /></div>
              </div>
            </div>
          </div>
          <div className="bottom-shape center text-end">
            <img src={I.footerBgShape} alt="" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container-fluid">
          <div className="content text-center">
            <a className="footer-logo"><img src={I.footerLogo} alt="" /></a>
            <div className="content-detail">
              <ul className="category category-1 unstyled d-sm-flex d-none">
                <li><a className="h-24 fw-400 light-black" onClick={() => navigate("home")}><span>Home Page</span></a></li>
                <li><a className="h-24 fw-400 light-black" onClick={() => navigate("about")}><span>About Us</span></a></li>
                <li><a className="h-24 fw-400 light-black" onClick={() => navigate("contact")}><span>Contact Us</span></a></li>
                <li><a className="h-24 fw-400 light-black" onClick={() => navigate("blog")}><span>Our Blogs</span></a></li>
              </ul>
              <div className="center-content">
                <ul className="contact-list unstyled mb-32">
                  <li>
                    <div className="icon-detail"><i className="fa-regular fa-phone"></i>
                      <a className="tooltip-text">+1 123 456 789</a>
                    </div>
                  </li>
                  <li>
                    <div className="icon-detail"><i className="fa-regular fa-envelope"></i>
                      <a className="tooltip-text">example@gmail.com</a>
                    </div>
                  </li>
                  <li>
                    <div className="icon-detail"><i className="fa-regular fa-location-dot"></i>
                      <a className="tooltip-text">123 Main Street, Cityville, State</a>
                    </div>
                  </li>
                </ul>
                <div className="vr-line d-sm-block d-none"></div>
                <form onSubmit={e => e.preventDefault()}>
                  <p className="h-31 light-black mb-24">Weekly Newsletter.</p>
                  <div className="subscribe-block">
                    <input type="email" name="email" id="email" placeholder="example@gmail.com" />
                    <button type="submit" className="cus-btn">Subscribe</button>
                  </div>
                </form>
              </div>
              <ul className="category unstyled d-sm-flex d-none">
                <li><a className="h-24 fw-400 light-black" onClick={() => navigate("rooms")}><span>Accommodation</span></a></li>
                <li><a className="h-24 fw-400 light-black" onClick={() => navigate("restaurant")}><span>Restaurant</span></a></li>
                <li><a className="h-24 fw-400 light-black" onClick={() => navigate("spa")}><span>Spa and Wellness</span></a></li>
                <li><a className="h-24 fw-400 light-black" onClick={() => navigate("rooms")}><span>Our Rooms</span></a></li>
              </ul>
            </div>
            <div className="bottom-text">
              <p className="h-18 dark-gray">&copy; 2025. All rights reserved by LUXE</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );

  return (
    <>
      <div id={"preloader" + (loaded ? " loaded" : "")}>
        <div className="mini-loader-content">
          <svg viewBox="0 0 500 500" height="100" width="100" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M66.734 66.734v366.533h366.532V66.734H66.734zm15 15h336.532v336.533H81.734V81.734z" />
              <path d="M354.16 2.5v143.34H497.5V2.5H354.16zm10 10H487.5v123.34H364.16V12.5z" />
              <path d="M0 2.5v143.34h143.34V2.5H0zm10 10h123.34v123.34H10V12.5z" />
              <path d="M354.16 356.66V500H497.5V356.66H354.16zm10 10H487.5V490H364.16V366.66z" />
              <path d="M0 356.66V500h143.34V356.66H0zm10 10h123.34V490H10V366.66z" />
            </g>
          </svg>
        </div>
      </div>
      <button className={"scrollToTopBtn" + (scrolled ? " visible" : "")} onClick={scrollTop}>
        <i className="fa fa-arrow-up"></i>
      </button>
      <div className="hotel-root">
        {sections}
      </div>
    </>
  );
}
