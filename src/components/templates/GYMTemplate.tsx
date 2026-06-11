"use client";

import { useEffect, useInsertionEffect, useRef, useState, useCallback } from"react";
import { GYMImages } from"./GYMImages";

interface GYMProps {
 store: any;
 banners: any[];
 settings: any;
 products: any[];
 slug: string;
 categories: any[];
}

const coaches = [
 { img: GYMImages.trainer1, name:"Jordan", role:"Strength & Conditioning" },
 { img: GYMImages.trainer2, name:"Avery", role:"Mobility & Functional" },
 { img: GYMImages.trainer3, name:"Taylor", role:"Metcon & Fat Loss" },
];

const galleryImgs = [
 GYMImages.gallery1, GYMImages.gallery2, GYMImages.gallery3,
 GYMImages.gallery4, GYMImages.gallery5, GYMImages.gallery6,
];

const faqs = [
 { q:"Do you offer day passes?", a:"Yes, day passes are available during staffed hours. Ask at the front desk." },
 { q:"Can beginners join classes?", a:"Absolutely. Coaches provide scaling options so all levels can train safely." },
 { q:"Is there contract lock‑in?", a:"We offer flexible month‑to‑month options and upgrades when you're ready." },
 { q:"Do you offer personal training?", a:"Yes. Book one‑on‑one sessions with certified trainers for tailored programming and technique work." },
 { q:"Can I pause my membership?", a:"We allow short freezes for travel or medical reasons. Contact the front desk to arrange dates." },
 { q:"What should I bring to class?", a:"Clean indoor shoes, a towel and a water bottle. We supply equipment and provide scaling options." },
];

const scheduleData = [
 { day:"Mon", time:"6:30 AM", cls:"HIIT Conditioning", coach:"Jordan" },
 { day:"Tue", time:"7:00 PM", cls:"Strength Foundations", coach:"Avery" },
 { day:"Wed", time:"12:00 PM", cls:"Express Core", coach:"Sam" },
 { day:"Thu", time:"6:30 AM", cls:"Powerlifting Club", coach:"Jordan" },
 { day:"Sat", time:"9:00 AM", cls:"Full‑Body Circuit", coach:"Taylor" },
];

const blogArticles = [
 { img: GYMImages.gym1, date:"Feb 10, 2026", cat:"Training", title:"Beginner's Guide to Strength Training", desc:"Foundational moves, safety, and a simple 3‑day split to get started.", read:"6 min read" },
 { img: GYMImages.hero3, date:"Feb 05, 2026", cat:"Nutrition", title:"How to Burn Fat Without Losing Muscle", desc:"Training and nutrition strategies to preserve lean mass while cutting.", read:"7 min read" },
 { img: GYMImages.gallery1, date:"Jan 28, 2026", cat:"Mobility", title:"Mobility Routines for Desk Workers", desc:"10‑minute flows to open hips, T‑spine and shoulders for better posture.", read:"5 min read" },
 { img: GYMImages.hero2, date:"Jan 20, 2026", cat:"Cardio", title:"HIIT vs. Steady State: Which Is Right for You?", desc:"Pros, cons, and when to use each for fat loss and conditioning.", read:"6 min read" },
 { img: GYMImages.gallery2, date:"Jan 15, 2026", cat:"Nutrition", title:"Protein: How Much Do You Really Need?", desc:"Simple math and food examples to hit your daily targets with ease.", read:"4 min read" },
 { img: GYMImages.hero1, date:"Jan 09, 2026", cat:"Training", title:"Perfect Your Squat: Common Fixes", desc:"Knee cave, depth, and bracing — coach‑approved corrections that work.", read:"6 min read" },
 { img: GYMImages.gym6, date:"Jan 03, 2026", cat:"Recovery", title:"Recovery 101: Sleep, Steps, and Stretching", desc:"The overlooked pillars that accelerate progress and prevent burnout.", read:"5 min read" },
 { img: GYMImages.gym7, date:"Dec 27, 2025", cat:"Classes", title:"Class Spotlight: Strength & Conditioning", desc:"What to expect, how to scale, and how to get the most from class.", read:"4 min read" },
 { img: GYMImages.gym5, date:"Dec 20, 2025", cat:"Nutrition", title:"Meal Prep Made Easy", desc:"A 60‑minute weekend workflow with three protein bases and sides.", read:"5 min read" },
];

export default function GYMTemplate(props: GYMProps) {
 const { store, banners, settings, products, slug } = props;

 const [page, setPage] = useState("home");
 const [slideIdx, setSlideIdx] = useState(0);
 const [mobileOpen, setMobileOpen] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const [billing, setBilling] = useState<"monthly" |"annual">("monthly");
 const [loaded, setLoaded] = useState(false);

 const heroSlides = [
 { img: GYMImages.hero1, title: <>Burn Fat Fast,<br />HIIT + Conditioning</>, cta:"Start Fat Loss", panelTitle:"Fat Loss Focus", items: ["Interval sessions","Heart‑rate zones","Nutrition targets"] },
 { img: GYMImages.hero2, title: <>Build Strength,<br />Precision Coaching</>, cta:"Start Strength Plan", panelTitle:"Strength Plan", items: ["Progressive overload","Form cues","Recovery blocks"] },
 { img: GYMImages.hero3, title: <>Train Smarter,<br />AI‑Optimized Coaching</>, cta:"Explore Plans", panelTitle:"Smarter Training", items: ["Personalized plans","Smart tracking","Nutrition guidance"] },
 ];

 const goSlide = useCallback((i: number) => setSlideIdx(i), []);
 useEffect(() => {
 const timer = setInterval(() => setSlideIdx((p) => (p + 1) % heroSlides.length), 5000);
 return () => clearInterval(timer);
 }, [heroSlides.length]);

 const navLinks = [
 { label:"Home", page:"home", hasDropdown: true },
 { label:"About us", page:"about" },
 { label:"Programs", page:"classes" },
 { label:"Membership", page:"membership" },
 { label:"Blog", page:"blog" },
 { label:"Contact us", page:"contact" },
 ];

 const navigate = (p: string) => {
 setPage(p);
 setMobileOpen(false);
 window.scrollTo({ top: 0, behavior:"smooth" });
 };

 useEffect(() => {
 const handleScroll = () => setScrolled(window.scrollY > 50);
 window.addEventListener("scroll", handleScroll);
  const timer = setTimeout(() => setLoaded(true), 400);
 return () => { window.removeEventListener("scroll", handleScroll); clearTimeout(timer); };
 }, []);

  useInsertionEffect(() => {
  const s = document.getElementById("fg-style");
  if (!s) {
  const style = document.createElement("style");
  style.id ="fg-style";
 style.textContent = `
 @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap');
  :root{--primary:#0066FF;--primary-dark:#004dcf;--accent-green:#10b981;--dark:#0f0f23;--darker:#0a0a18;--gray:#6b7280;--light:#f3f4f6;--white:#fff}
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{background:var(--dark)}
  body{font-family:Poppins,sans-serif;color:#333;overflow-x:hidden;background:var(--dark)}
  .store-container{background:transparent!important}
  h1,h2,h3,h4,h5,.fg-hero-title,.fg-section-title,.fg-page-title,.fg-panel-title{font-family:'Bebas Neue',sans-serif;letter-spacing:1px}
 .fg-nav-links a,.fg-btn,.fg-coach-name{font-family:Montserrat,sans-serif}
 a{text-decoration:none}
  .fg-preloader{position:fixed;inset:0;background:var(--dark);display:flex;align-items:center;justify-content:center;z-index:9999;transition:opacity .4s,visibility .4s}
 .fg-preloader.hidden{opacity:0;visibility:hidden}
  .fg-spinner{width:3rem;height:3rem;border:4px solid rgba(255,255,255,.15);border-top-color:var(--primary);border-radius:50%;animation:fgSpin .8s linear infinite}
 @keyframes fgSpin{to{transform:rotate(360deg)}}
        .fg-navbar{position:absolute;top:0;left:0;width:100%;z-index:1000;padding:1rem 0;transition:all .4s;background:transparent}
        .fg-navbar.scrolled{position:fixed;background:rgba(10,10,30,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 4px 30px rgba(0,0,0,.35);border-bottom:1px solid rgba(255,255,255,.06)}
        .fg-nav-inner{max-width:1400px;margin:0 auto;padding:0 2rem;display:flex;align-items:center;justify-content:space-between}
        .fg-logo{height:44px;width:auto;transition:.3s}
        .fg-navbar.scrolled .fg-logo{height:40px}
        .fg-nav-links{display:flex;align-items:center;gap:0;list-style:none}
        .fg-nav-links a,.fg-nav-links .fg-drop-btn{padding:.6rem 1.2rem;color:rgba(255,255,255,.88);font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;transition:color .3s;cursor:pointer;background:none;border:none;display:inline-block;position:relative}
        .fg-nav-links a::after,.fg-nav-links .fg-drop-btn::after{content:'';position:absolute;bottom:2px;left:1.2rem;width:0;height:2px;background:var(--primary);transition:width .3s}
        .fg-nav-links a:hover::after,.fg-nav-links a.active::after,.fg-nav-links .fg-drop-btn:hover::after{width:calc(100% - 2.4rem)}
        .fg-nav-links a:hover,.fg-nav-links a.active,.fg-nav-links .fg-drop-btn:hover{color:#fff}
        .fg-nav-links .fg-dropdown{position:relative}
        .fg-nav-links .fg-drop-menu{display:none;position:absolute;top:100%;left:0;background:rgba(15,15,35,.96);backdrop-filter:blur(12px);min-width:180px;flex-direction:column;padding:.6rem 0;border-radius:12px;border:1px solid rgba(255,255,255,.08);box-shadow:0 10px 40px rgba(0,0,0,.4)}
        .fg-nav-links .fg-dropdown:hover .fg-drop-menu{display:flex}
        .fg-nav-links .fg-drop-menu a{padding:.7rem 1.4rem;font-size:.78rem;letter-spacing:1px}
        .fg-nav-links .fg-drop-menu a::after{display:none}
        .fg-nav-links .fg-drop-menu a:hover{background:rgba(255,255,255,.06)}
        .fg-nav-cta{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff!important;border-radius:50px;padding:.55rem 1.8rem!important;font-size:.78rem!important;letter-spacing:1px;box-shadow:0 4px 15px rgba(0,102,255,.25);transition:all .3s!important}
        .fg-nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 25px rgba(0,102,255,.4)!important}
        .fg-nav-cta::after{display:none!important}
        .fg-mobile-toggle{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;background:none;border:none}
        .fg-mobile-toggle span{width:28px;height:2.5px;background:#fff;border-radius:3px;transition:all .35s;display:block}
        .fg-mobile-toggle.active span:nth-child(1){transform:rotate(45deg) translate(5px,6px)}
        .fg-mobile-toggle.active span:nth-child(2){opacity:0;transform:translateX(-6px)}
        .fg-mobile-toggle.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-6px)}
        @media(max-width:992px){
          .fg-mobile-toggle{display:flex}
          .fg-nav-links{display:none;position:absolute;top:100%;left:0;width:100%;background:rgba(10,10,30,.98);backdrop-filter:blur(16px);flex-direction:column;padding:1rem 0;gap:0;border-top:1px solid rgba(255,255,255,.06);max-height:80vh;overflow-y:auto}
          .fg-nav-links.open{display:flex}
          .fg-nav-links a,.fg-nav-links .fg-drop-btn{padding:.9rem 2rem;border-bottom:1px solid rgba(255,255,255,.05);letter-spacing:1.5px}
          .fg-nav-links a::after,.fg-nav-links .fg-drop-btn::after{display:none}
          .fg-nav-links .fg-drop-menu{position:static;background:transparent;padding-left:2rem;border:none;box-shadow:none;border-radius:0}
          .fg-nav-links .fg-dropdown:hover .fg-drop-menu{display:none}
          .fg-nav-links .fg-drop-menu.open{display:flex!important}
          .fg-nav-cta{margin:.9rem 2rem!important;text-align:center;display:block}
          .fg-navbar{padding:.7rem 0}
          .fg-navbar.scrolled{padding:.5rem 0}
        }
  .fg-hero{height:100vh;position:relative;overflow:hidden;background:var(--dark);margin-top:0!important;padding-top:0!important}
 .fg-hero-slide{position:absolute;inset:0;opacity:0;transition:opacity .8s}
 .fg-hero-slide.active{opacity:1}
 .fg-hero-slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
 .fg-hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(15,15,35,.85),rgba(15,15,35,.4));z-index:1}
 .fg-hero-content{position:relative;z-index:2;height:100%;display:flex;align-items:center}
 .fg-hero-content .fg-container{max-width:1400px;margin:0 auto;padding:0 2rem;width:100%;display:flex;align-items:center;justify-content:space-between;gap:3rem}
 .fg-hero-text{flex:1;max-width:650px}
 .fg-hero-text h1{font-size:5rem;color:#fff;line-height:1.1;margin-bottom:1.5rem;text-shadow:0 2px 20px rgba(0,0,0,.5)}
 .fg-hero-panel{background:rgba(255,255,255,.08);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:2rem;min-width:320px}
 .fg-panel-title{font-size:1.6rem;color:#fff;margin-bottom:1rem}
 .fg-panel-list{list-style:none;margin-bottom:1.5rem}
 .fg-panel-list li{color:rgba(255,255,255,.8);padding:.4rem 0;display:flex;align-items:center;gap:.6rem;font-size:.9rem}
 .fg-panel-list li svg{color:var(--accent-green);flex-shrink:0}
 .fg-stats{display:flex;gap:2rem;border-top:1px solid rgba(255,255,255,.1);padding-top:1rem}
 .fg-stat .value{font-family:'Bebas Neue',sans-serif;font-size:2rem;color:var(--primary);line-height:1}
 .fg-stat .label{font-size:.75rem;color:rgba(255,255,255,.6);text-transform:uppercase}
 .fg-slider-dots{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);display:flex;gap:.6rem;z-index:3}
 .fg-slider-dot{width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,.5);background:transparent;cursor:pointer;transition:.3s;padding:0}
 .fg-slider-dot.active{background:var(--primary);border-color:var(--primary)}
 .fg-hero-social{position:absolute;bottom:2rem;right:2rem;z-index:3;display:flex;gap:.75rem}
 .fg-hero-social a{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);transition:.3s}
 .fg-hero-social a:hover{background:var(--primary);border-color:var(--primary);color:#fff}
 @media(max-width:992px){
 .fg-hero-text h1{font-size:3rem}
 .fg-hero-content .fg-container{flex-direction:column;justify-content:center;padding-top:5rem}
 .fg-hero-panel{min-width:auto;width:100%}
 .fg-hero-social{display:none}
 }
 .fg-btn{display:inline-block;padding:.75rem 2rem;font-weight:600;border-radius:50px;transition:.3s;cursor:pointer;border:none;font-size:.9rem}
 .fg-btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 15px rgba(0,102,255,.3)}
 .fg-btn-primary:hover{background:var(--primary-dark);transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,102,255,.4)}
 .fg-btn-outline{background:transparent;border:2px solid #fff;color:#fff}
 .fg-btn-outline:hover{background:#fff;color:var(--dark)}
 section{padding:5rem 0}
 .fg-container{max-width:1200px;margin:0 auto;padding:0 2rem}
 .fg-section-title{font-size:3rem;margin-bottom:.5rem;color:var(--dark);font-family:'Bebas Neue',sans-serif}
 .fg-section-sub{color:var(--gray);max-width:600px;margin:0 auto 3rem;text-align:center;font-size:.95rem}
 .text-center{text-align:center!important}
 .text-end{text-align:right!important}
 .h-100{height:100%!important}
 .row{display:flex;flex-wrap:wrap;margin-left:-1rem;margin-right:-1rem}
 .row>[class*="col-"]{padding-left:1rem;padding-right:1rem}
 .col-6{flex:0 0 50%;max-width:50%}
 .col-12{flex:0 0 100%;max-width:100%}
 @media(min-width:992px){
 .col-lg-4{flex:0 0 33.333%;max-width:33.333%}
 .col-lg-5{flex:0 0 41.666%;max-width:41.666%}
 .col-lg-6{flex:0 0 50%;max-width:50%}
 .col-lg-7{flex:0 0 58.333%;max-width:58.333%}
 .col-lg-8{flex:0 0 66.666%;max-width:66.666%}
 .d-lg-block{display:block!important}
 }
 .d-flex{display:flex!important}
 .d-inline-flex{display:inline-flex!important}
 .w-100{width:100%!important}
 .align-items-center{align-items:center!important}
 .justify-content-center{justify-content:center!important}
 .justify-content-between{justify-content:space-between!important}
 .flex-wrap{flex-wrap:wrap!important}
 .flex-column{flex-direction:column!important}
 .mx-auto{margin-left:auto!important;margin-right:auto!important}
 .me-3{margin-right:1rem!important}
 .mt-3{margin-top:1rem!important}
 .mt-4{margin-top:1.5rem!important}
 .mb-0{margin-bottom:0!important}
 .mb-3{margin-bottom:1rem!important}
 .mb-4{margin-bottom:1.5rem!important}
 .mb-5{margin-bottom:3rem!important}
 .p-0{padding:0!important}
 .py-sm-3{padding-top:1rem!important;padding-bottom:1rem!important}
 .px-sm-5{padding-left:3rem!important;padding-right:3rem!important}
  .gap-3{gap:1rem!important}
  .container-xxl{max-width:1400px;margin:0 auto;padding:0 2rem}
  .container{max-width:1200px;margin:0 auto}
  .btn{display:inline-block;font-family:'Bebas Neue',sans-serif;font-weight:700;letter-spacing:.5px;transition:.3s;cursor:pointer;border:none;font-size:.9rem;padding:.75rem 2rem;color:#000;background:transparent;border-radius:0}
  .btn-primary{background:var(--primary);color:#000;box-shadow:0 4px 15px rgba(0,102,255,.3)}
  .btn-primary:hover{background:var(--primary);color:#000;transform:translateY(-2px)}
  .rounded-pill{border-radius:50rem!important}
  .text-primary{color:var(--primary)!important}
  .text-muted{color:var(--gray)!important}
  .small{font-size:.85rem!important}
  .rounded{border-radius:16px!important}
  .bg-light{background:var(--light)!important}
  .display-5{font-size:3rem;font-weight:800;font-family:Montserrat,sans-serif}
  .fw-bold{font-weight:700!important}
  .flex-shrink-0{flex-shrink:0!important}
  .ms-3{margin-left:1rem!important}
  .ms-auto{margin-left:auto!important}
  .img-fluid{max-width:100%;height:auto}
  .w-75{width:75%!important}
  .fs-1{font-size:2.5rem}
  .position-relative{position:relative!important}
  .position-absolute{position:absolute!important}
  .mb-2{margin-bottom:.5rem!important}
  .mt-2{margin-top:.5rem!important}
  .py-5{padding-top:3rem!important;padding-bottom:3rem!important}
  .py-3{padding-top:1rem!important;padding-bottom:1rem!important}
  .px-5{padding-left:3rem!important;padding-right:3rem!important}
  .px-3{padding-left:1rem!important;padding-right:1rem!important}
  .p-4{padding:1.5rem!important}
  .p-5{padding:3rem!important}
  .g-4{margin-left:-.75rem;margin-right:-.75rem}
  .g-4>[class*="col-"]{padding-left:.75rem;padding-right:.75rem}
  .g-5{margin-left:-1.5rem;margin-right:-1.5rem}
  .g-5>[class*="col-"]{padding-left:1.5rem;padding-right:1.5rem}
  .g-0{margin-left:0;margin-right:0}
  .g-0>[class*="col-"]{padding-left:0;padding-right:0}
  @media(min-width:768px){
  .col-md-4{flex:0 0 33.333%;max-width:33.333%}
  }
  @media(min-width:576px){
  .col-sm-6{flex:0 0 50%;max-width:50%}
  }
  .about-hero{object-position:top}
  .about-img img{transition:.5s}
  .about-img img:hover{background:var(--primary)!important}
  .coach-card{background:#fff;border-radius:18px;box-shadow:0 8px 24px rgba(16,16,16,0.08);padding:16px}
  .coach-photo{width:100%;height:220px;object-fit:cover;object-position:top;border-radius:12px}
  .gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .gallery-item{border-radius:16px;overflow:hidden}
  .gallery-img{width:100%;height:180px;object-fit:cover;display:block;transition:transform .3s ease}
  .gallery-item:hover .gallery-img{transform:scale(1.04)}
  @media(max-width:992px){.gallery-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:576px){.gallery-grid{grid-template-columns:1fr}}
  .fg-text-muted{color:var(--gray)!important}
  .fg-text-primary{color:var(--primary)!important}
  .fg-flex-column{flex-direction:column!important}
  .rounded-circle{border-radius:50%!important;overflow:hidden}
  .method-icon{color:#103741}
  .fg-about-text{max-width:750px;margin:0 auto 2rem;color:var(--gray);line-height:1.8}
 .fg-splash-callout{background:linear-gradient(135deg,#f0f4ff,#e8f0fe);border-radius:20px;position:relative}
 .fg-splash-decor{position:absolute;top:-10px;right:-10px;width:60px;height:60px;border:4px solid var(--primary);border-radius:50%;opacity:.15}
 .fg-about-feature{background:var(--light);border-radius:12px;padding:1.5rem;transition:.3s;height:100%}
 .fg-about-feature:hover{transform:translateY(-4px);box-shadow:0 8px 25px rgba(0,0,0,.06)}
 .fg-about-feature .fg-about-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;margin-bottom:.75rem;flex-shrink:0}
 .fg-about-feature .fg-about-icon.blue{background:var(--primary)}
 .fg-about-feature .fg-about-icon.green{background:var(--accent-green)}
 .fg-about-feature h4{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;margin-bottom:.25rem}
 .fg-about-feature p{color:var(--gray);font-size:.8rem;margin:0}
 .fg-accent-stripes{display:flex;gap:4px;margin-bottom:1rem}
 .fg-accent-stripes span{width:30px;height:4px;border-radius:2px;background:var(--primary)}
 .fg-splash-callout h3{font-family:'Bebas Neue',sans-serif;font-size:2rem}
 .fg-splash-img{width:100%;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.12)}
 .fg-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:2rem}
 .fg-grid-4{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:2rem}
 .fg-grid-6{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem}
 .fg-card{background:#fff;border-radius:16px;padding:2rem;box-shadow:0 4px 20px rgba(0,0,0,.06);transition:.4s;border:1px solid rgba(0,0,0,.04)}
 .fg-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(0,0,0,.1)}
 .fg-icon-wrap{width:52px;height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#fff}
 .fg-icon-wrap.green{background:var(--accent-green)}
 .fg-icon-wrap.blue{background:var(--primary)}
 .fg-card h3{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;margin-bottom:.5rem}
 .fg-card p{color:var(--gray);font-size:.9rem;line-height:1.7}
 .fg-learn-link{color:var(--primary);font-weight:600;font-size:.85rem;display:inline-flex;align-items:center;gap:.4rem;transition:.3s}
 .fg-learn-link:hover{gap:.7rem}
 .fg-showcase-card{border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.06);transition:.4s;text-align:center;padding-bottom:1.5rem}
 .fg-showcase-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(0,0,0,.12)}
 .fg-showcase-card .fg-media-wrap{height:220px;overflow:hidden}
 .fg-showcase-card .fg-media-wrap img{width:100%;height:100%;object-fit:cover;transition:.5s}
 .fg-showcase-card:hover .fg-media-wrap img{transform:scale(1.08)}
 .fg-showcase-card h3,.fg-showcase-card h4{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;padding:0 1rem;margin-top:1rem}
 .fg-pricing-card{border-radius:16px;padding:2.5rem 2rem;background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.04);text-align:center;transition:.4s;position:relative}
 .fg-pricing-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(0,0,0,.1)}
 .fg-pricing-card.featured{background:var(--dark);border-color:var(--primary);transform:scale(1.03)}
 .fg-pricing-card.featured:hover{transform:scale(1.05) translateY(-6px)}
 .fg-pricing-card.featured h3,.fg-pricing-card.featured .fg-price,.fg-pricing-card.featured p{color:#fff}
 .fg-pricing-card h3{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:var(--dark)}
 .fg-price{font-family:Montserrat,sans-serif;font-size:2.8rem;font-weight:800;color:var(--primary);margin:1rem 0}
 .fg-price span{font-size:1rem;font-weight:400;color:var(--gray)}
 .fg-pricing-card p{color:var(--gray);font-size:.85rem;margin-bottom:1.5rem}
 .fg-pricing-card ul{list-style:none;margin-bottom:2rem;text-align:left}
 .fg-pricing-card ul li{padding:.5rem 0;color:var(--gray);font-size:.85rem;display:flex;align-items:center;gap:.5rem;border-bottom:1px solid rgba(0,0,0,.04)}
 .fg-pricing-card ul li svg{color:var(--accent-green);flex-shrink:0}
 .fg-pricing-card.featured ul li{color:rgba(255,255,255,.7);border-color:rgba(255,255,255,.08)}
 .fg-pricing-card.featured ul li svg{color:var(--accent-green)}
 .fg-testimonial-card{background:var(--light);border-radius:16px;padding:2rem;transition:.4s}
 .fg-testimonial-card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(0,0,0,.08)}
 .fg-stars{margin-bottom:.75rem;color:#f59e0b;display:flex;gap:2px}
 .fg-testimonial-card p{color:var(--gray);font-size:.9rem;line-height:1.7;margin-bottom:1.5rem;font-style:italic}
 .fg-test-author{display:flex;align-items:center;gap:1rem}
 .fg-test-author img{width:50px;height:50px;border-radius:50%;object-fit:cover}
 .fg-test-author h4{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;margin:0}
 .fg-test-author small{color:var(--gray);font-size:.8rem}
 .fg-facility-card{position:relative;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.06);transition:.4s;padding:0 0 2rem}
 .fg-facility-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(0,0,0,.12)}
 .fg-facility-card .fg-facility-media{height:200px;overflow:hidden}
 .fg-facility-card .fg-facility-media img{width:100%;height:100%;object-fit:cover;transition:.5s}
 .fg-facility-card:hover .fg-facility-media img{transform:scale(1.08)}
 .fg-facility-card .fg-icon-wrap{position:relative;margin:-28px auto 1rem;z-index:2}
  .fg-facility-card h3{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;text-align:center;padding:0 1rem}
  .fg-facility-card p{text-align:center;padding:0 1rem;color:var(--gray);font-size:.85rem}
  .fg-facility-pill{display:inline-block;padding:.6rem 1.5rem;border-radius:50px;background:#fff;border:1px solid rgba(0,0,0,.06);font-size:.85rem;font-weight:600;color:var(--dark);box-shadow:0 2px 8px rgba(0,0,0,.04);transition:.3s}
  .fg-facility-pill:hover{box-shadow:0 4px 16px rgba(0,0,0,.1);border-color:var(--primary);color:var(--primary)}
 .fg-schedule-wrapper{overflow-x:auto;border-radius:12px;border:1px solid rgba(0,0,0,.06)}
 .fg-schedule-table{width:100%;border-collapse:collapse;min-width:500px}
 .fg-schedule-table th{background:var(--dark);color:#fff;padding:1rem;font-family:Montserrat,sans-serif;font-size:.85rem;text-transform:uppercase;text-align:left}
 .fg-schedule-table td{padding:1rem;border-bottom:1px solid rgba(0,0,0,.05);font-size:.9rem}
 .fg-schedule-table tr:hover td{background:rgba(0,102,255,.03)}
 .fg-coach-card{text-align:center;padding:2rem 1rem;border-radius:16px;transition:.4s;background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.06)}
 .fg-coach-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(0,0,0,.12)}
 .fg-coach-card img{width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:1rem;border:3px solid var(--light);transition:.4s}
 .fg-coach-card:hover img{border-color:var(--primary);transform:scale(1.05)}
 .fg-coach-card h3{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;margin-bottom:.15rem}
 .fg-coach-card p{color:var(--gray);font-size:.85rem}
 .fg-gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}
 .fg-gallery-item{overflow:hidden;border-radius:12px;position:relative}
 .fg-gallery-item img{width:100%;height:200px;object-fit:cover;transition:.5s;display:block}
 .fg-gallery-item:hover img{transform:scale(1.1)}
 details.faq-item{border:1px solid rgba(0,0,0,.06);border-radius:12px;margin-bottom:.75rem;overflow:hidden;transition:.3s}
 details.faq-item[open]{border-color:var(--primary);box-shadow:0 4px 15px rgba(0,102,255,.08)}
 details.faq-item summary{padding:1.2rem 1.5rem;cursor:pointer;font-weight:600;font-size:.95rem;display:flex;justify-content:space-between;align-items:center;list-style:none}
 details.faq-item summary::-webkit-details-marker{display:none}
 details.faq-item summary::after{content:"+";font-size:1.3rem;color:var(--primary);transition:.3s}
 details.faq-item[open] summary::after{content:"−"}
 .faq-body{padding:0 1.5rem 1.2rem;color:var(--gray);font-size:.9rem;line-height:1.7}
 .fg-location iframe{width:100%;height:380px;border-radius:16px;border:0;display:block}
 .fg-location-card{background:var(--light);border-radius:16px;padding:2rem!important}
 .fg-location-card h3{font-family:'Bebas Neue',sans-serif;font-size:2rem}
 .fg-location-card .fg-hours{list-style:none;margin-bottom:1.5rem}
 .fg-location-card .fg-hours li{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid rgba(0,0,0,.04);font-size:.9rem}
 .fg-cta-section{background:var(--light);border-radius:20px;padding:3rem}
 .fg-cta-section h3{font-family:'Bebas Neue',sans-serif;font-size:2rem}
 .fg-cta-section p{color:var(--gray);max-width:600px}
 .fg-cta-section ul{list-style:none;margin-bottom:1.5rem}
 .fg-cta-section ul li{padding:.3rem 0;color:var(--gray);font-size:.9rem;display:flex;align-items:center;gap:.5rem}
 .fg-cta-section img{border-radius:12px;width:100%;max-width:300px}
  .fg-page-hero{height:50vh;min-height:320px;position:relative;overflow:hidden;margin-top:0!important;padding-top:0!important}
  .fg-page-hero .fg-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
  .fg-page-hero .fg-hero-overlay{background:linear-gradient(135deg,rgba(15,15,35,.85),rgba(15,15,35,.3))}
  .fg-page-hero-content{position:absolute;bottom:2rem;left:0;right:0;z-index:2;padding:0 2rem}

  .fg-page-title{font-size:5rem;color:#fff;font-family:'Bebas Neue',sans-serif;line-height:1.1;position:relative;z-index:2}
  .fg-page-subtitle{color:rgba(255,255,255,.7);position:relative;z-index:2;font-size:1.1rem;margin-bottom:2rem}
 .fg-methodology .fg-method-card{background:var(--light);border-radius:16px;padding:2rem;text-align:center;height:100%;transition:.4s}
 .fg-methodology .fg-method-card:hover{transform:translateY(-4px);box-shadow:0 8px 25px rgba(0,0,0,.06)}
 .fg-methodology .fg-method-card svg{color:var(--primary);margin-bottom:1rem}
 .fg-methodology .fg-method-card h5{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;margin-bottom:.5rem}
 .fg-methodology .fg-method-card p{color:var(--gray);font-size:.85rem}
 .fg-stat-card{text-align:center;padding:2rem;background:var(--light);border-radius:16px;height:100%;transition:.4s}
 .fg-stat-card:hover{transform:translateY(-4px);box-shadow:0 8px 25px rgba(0,0,0,.06)}
 .fg-stat-card .fg-stat-num{font-family:'Bebas Neue',sans-serif;font-size:3.5rem;color:var(--primary);line-height:1}
 .fg-stat-card p{color:var(--gray);font-size:.85rem;margin-top:.5rem}
 .fg-class-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.06);transition:.4s}
 .fg-class-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(0,0,0,.12)}
 .fg-class-card .fg-class-image{height:220px;position:relative;overflow:hidden}
 .fg-class-card .fg-class-image img{width:100%;height:100%;object-fit:cover;transition:.5s}
 .fg-class-card:hover .fg-class-image img{transform:scale(1.08)}
 .fg-class-card .fg-date-badge{position:absolute;bottom:1rem;left:1rem;background:rgba(15,15,35,.85);color:#fff;padding:.3rem 1rem;border-radius:50px;font-size:.75rem;display:flex;align-items:center;gap:.4rem}
 .fg-class-card .fg-class-body{padding:1.5rem}
 .fg-class-card .fg-class-body h4{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;margin-bottom:.4rem}
 .fg-class-card .fg-class-body p{color:var(--gray);font-size:.85rem;margin-bottom:1rem}
 .fg-class-card.featured{border:2px solid var(--primary)}
 .fg-teacher-card{text-align:center}
 .fg-teacher-card .fg-teacher-blob{width:180px;height:180px;border-radius:50%;margin:0 auto;background:var(--light);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
 .fg-teacher-card .fg-teacher-blob img{width:100%;height:100%;object-fit:cover;border-radius:50%}
 .fg-teacher-card h4{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;margin-top:1rem}
 .fg-teacher-card .fg-role{color:var(--gray);font-size:.85rem}
 .fg-trial-panel{background:var(--light)!important;border-radius:20px}
 .fg-trial-panel input,.fg-trial-panel select,.fg-trial-panel textarea{border:1px solid rgba(0,0,0,.08)!important;border-radius:10px!important;padding:1rem!important;font-size:.9rem!important;background:#fff!important}
 .fg-trial-panel input:focus,.fg-trial-panel select:focus,.fg-trial-panel textarea:focus{outline:none!important;border-color:var(--primary)!important;box-shadow:0 0 0 3px rgba(0,102,255,.08)!important}
 .fg-trial-panel .fg-form-label{font-size:.8rem;color:var(--gray);margin-bottom:.25rem;display:block;font-weight:500}
 .fg-billing-toggle .fg-toggle-btn{padding:.5rem 1.5rem;border:2px solid var(--dark);background:transparent;color:var(--dark);font-weight:600;cursor:pointer;transition:.3s;font-size:.85rem}
 .fg-billing-toggle .fg-toggle-btn:first-child{border-radius:50px 0 0 50px}
 .fg-billing-toggle .fg-toggle-btn:last-child{border-radius:0 50px 50px 0}
 .fg-billing-toggle .fg-toggle-btn.active{background:var(--dark);color:#fff}
 .fg-table-responsive{overflow-x:auto}
 .fg-compare-table{width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,.06)}
 .fg-compare-table th{background:var(--light);padding:1rem;font-family:Montserrat,sans-serif;font-size:.8rem;text-transform:uppercase;text-align:center}
 .fg-compare-table th:first-child{text-align:left}
 .fg-compare-table td{padding:1rem;text-align:center;border-bottom:1px solid rgba(0,0,0,.04);font-size:.85rem}
 .fg-compare-table td:first-child{text-align:left;font-weight:500}
 .fg-compare-table tr:hover td{background:rgba(0,102,255,.02)}
 .fg-blog-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.06);transition:.4s}
 .fg-blog-card:hover{transform:translateY(-6px);box-shadow:0 12px 40px rgba(0,0,0,.12)}
 .fg-blog-card .fg-blog-image{height:200px;position:relative;overflow:hidden}
 .fg-blog-card .fg-blog-image img{width:100%;height:100%;object-fit:cover;transition:.5s}
 .fg-blog-card:hover .fg-blog-image img{transform:scale(1.08)}
 .fg-blog-card .fg-blog-image .fg-date-badge{position:absolute;bottom:.75rem;left:.75rem;background:rgba(15,15,35,.85);color:#fff;padding:.25rem 1rem;border-radius:50px;font-size:.75rem;display:flex;align-items:center;gap:.4rem}
 .fg-blog-card .fg-blog-body{padding:1.5rem}
 .fg-blog-card .fg-blog-body .fg-blog-meta{font-size:.8rem;color:var(--gray);margin-bottom:.5rem}
 .fg-blog-card .fg-blog-body h4{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;margin-bottom:.4rem;line-height:1.3}
 .fg-blog-card .fg-blog-body p{color:var(--gray);font-size:.85rem;margin-bottom:1rem;line-height:1.6}
 .fg-contact-card{background:#fff;border-radius:16px;padding:2rem;box-shadow:0 4px 20px rgba(0,0,0,.06);height:100%}
 .fg-contact-card.soft-blue{background:var(--light)}
 .fg-contact-card h3{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;margin-bottom:1.5rem}
 .fg-info-item{display:flex;align-items:center;gap:1rem;margin-bottom:1rem;font-size:.9rem}
 .fg-icon-pill{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
 .fg-icon-pill.blue{background:var(--primary)}
 .fg-mini-card{background:#fff;border-radius:10px;padding:.8rem 1rem;font-size:.8rem}
 .fg-mini-card .fg-label{color:var(--gray);font-size:.75rem}
 .fg-mini-card .fg-val{font-weight:600;font-size:.9rem}
        .fg-form-floating{margin-bottom:1rem}
        .fg-form-floating label{display:block;margin-bottom:.3rem;font-size:.85rem;font-weight:500;color:#555}
        .fg-form-floating input,.fg-form-floating select,.fg-form-floating textarea{width:100%;padding:.8rem 1rem;border:1px solid rgba(0,0,0,.08);border-radius:10px;font-size:.9rem;background:#fff;transition:.3s;font-family:Poppins,sans-serif;box-sizing:border-box}
        .fg-form-floating input:focus,.fg-form-floating select:focus,.fg-form-floating textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(0,102,255,.08)}
        .fg-form-floating textarea{min-height:100px;resize:vertical}
 .fg-map-embed iframe{width:100%;height:420px;border-radius:16px;border:0}
 .fg-footer{background:var(--darker);color:rgba(255,255,255,.6);padding:5rem 0 0;font-size:.85rem}
 .fg-footer-inner{max-width:1200px;margin:0 auto;padding:0 2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:3rem}
 .fg-footer h3{font-family:'Bebas Neue',sans-serif;color:#fff;font-size:1.3rem;margin-bottom:1.5rem}
 .fg-footer p{line-height:1.8;margin-bottom:1rem}
 .fg-footer a{color:rgba(255,255,255,.6);transition:.3s}
 .fg-footer a:hover{color:var(--primary)}
 .fg-footer .fg-footer-links{list-style:none}
 .fg-footer .fg-footer-links li{margin-bottom:.6rem}
 .fg-footer .fg-footer-links a{display:flex;align-items:center;gap:.5rem}
 .fg-footer .fg-footer-links a svg{width:14px;height:14px;flex-shrink:0}
 .fg-footer .fg-social-links{display:flex;gap:.75rem;margin-top:1rem}
 .fg-footer .fg-social-links a{width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;transition:.3s}
 .fg-footer .fg-social-links a:hover{background:var(--primary);border-color:var(--primary);color:#fff}
 .fg-footer .fg-newsletter-form{display:flex;max-width:100%;gap:.5rem;flex-wrap:wrap}
 .fg-footer .fg-newsletter-form input{flex:1;min-width:140px;padding:.7rem 1rem;border-radius:50px;border:1px solid rgba(255,255,255,.15);background:transparent;color:#fff;font-size:.85rem}
 .fg-footer .fg-newsletter-form input::placeholder{color:rgba(255,255,255,.35)}
 .fg-footer .fg-newsletter-form button{padding:.7rem 1.5rem;border-radius:50px;border:none;background:var(--primary);color:#fff;font-weight:600;cursor:pointer;font-size:.85rem;transition:.3s}
 .fg-footer .fg-newsletter-form button:hover{background:var(--primary-dark)}
 .fg-footer-bottom{border-top:1px solid rgba(255,255,255,.06);margin-top:3rem;padding:2rem;text-align:center;font-size:.8rem}
 .fg-scroll-top{position:fixed;bottom:2rem;right:2rem;z-index:999;width:48px;height:48px;border-radius:50%;background:var(--primary);border:none;color:#fff;font-size:1.2rem;cursor:pointer;box-shadow:0 4px 15px rgba(0,102,255,.3);opacity:0;visibility:hidden;transform:translateY(20px);transition:.4s;display:flex;align-items:center;justify-content:center}
 .fg-scroll-top.visible{opacity:1;visibility:visible;transform:translateY(0)}
 .fg-scroll-top:hover{background:var(--primary-dark);transform:translateY(-3px)}
 .fg-fade-in{opacity:0;transform:translateY(20px);transition:opacity .6s,transform .6s}
 .fg-fade-in.visible{opacity:1;transform:translateY(0)}
 .fg-animate-on-scroll{opacity:0;transform:translateY(30px);transition:opacity .6s,transform .6s}
 .fg-animate-on-scroll.fg-visible{opacity:1;transform:translateY(0)}
 @media(max-width:768px){
 .fg-hero-text h1{font-size:2.5rem}
 .fg-page-title{font-size:3rem}
 .fg-section-title{font-size:2.2rem}
 .fg-hero-content .fg-container{padding-top:4rem}
 .fg-cta-section{text-align:center}
 .fg-cta-section .d-lg-flex{flex-direction:column;align-items:center}
 section{padding:3rem 0}
 }
 `;
 document.head.appendChild(style);
 }
 return () => { const e = document.getElementById("fg-style"); if (e) e.remove(); };
 }, []);

 useEffect(() => {
 const observer = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 entry.target.classList.add("fg-visible");
 const cards = entry.target.querySelectorAll(".fg-card, .fg-showcase-card, .fg-pricing-card, .fg-testimonial-card, .fg-coach-card, .fg-blog-card, .fg-class-card, .fg-method-card, .fg-stat-card, .fg-teacher-card");
 cards.forEach((card: Element, idx: number) => setTimeout(() => card.classList.add("fg-visible"), idx * 80));
 }
 });
 },
 { threshold: 0.08 }
 );
 document.querySelectorAll(".fg-animate-on-scroll").forEach((el) => observer.observe(el));
 return () => observer.disconnect();
 }, [page]);

 const scrollToTop = () => window.scrollTo({ top: 0, behavior:"smooth" });

 useEffect(() => {
 const btn = document.getElementById("fg-scroll-top");
 const handle = () => {
 if (!btn) return;
 if (window.scrollY > 300) btn.classList.add("visible");
 else btn.classList.remove("visible");
 };
 window.addEventListener("scroll", handle);
 return () => window.removeEventListener("scroll", handle);
 }, []);

 const renderStars = () => (
 <div className="fg-stars">
 <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
 <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
 <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
 <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
 <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
 </div>
 );

 const renderCheck = () => (
 <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
 );

 const renderMinus = () => (
 <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" opacity=".4"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
 );

 const renderIcon = (type: string) => {
 const props = { width:"20", height:"20", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
 switch (type) {
 case"utensils": return <svg {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
 case"video": return <svg {...props}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
 case"heartbeat": return <svg {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
 case"dumbbell": return <svg {...props}><path d="M6.5 6.5h11M6.5 17.5h11"/><rect x="2" y="8" width="4" height="8" rx="1"/><rect x="18" y="8" width="4" height="8" rx="1"/><path d="M6.5 12h11"/></svg>;
 case"users": return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
 case"clock": return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
 case"running": return <svg {...props}><circle cx="13" cy="4" r="2"/><path d="M13 6v6l3 5"/><path d="M11 12l-3-3-2 2"/><path d="M13 18l-1 3"/></svg>;
 case"shower": return <svg {...props}><rect x="2" y="10" width="20" height="2" rx="1"/><path d="M6 10V7a6 6 0 0112 0v3"/><path d="M10 14v4"/><path d="M14 14v4"/></svg>;
 case"map-pin": return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
 case"phone": return <svg {...props}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>;
 case"envelope": return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
 case"calendar": return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
 case"user": return <svg {...props}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
 case"arrow-right": return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
 case"chevron-up": return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>;
 case"facebook": return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
 case"instagram": return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
 case"youtube": return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
 case"linkedin": return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  case"arrow-up": return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
  case"chart": return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
  case"gauge": return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1010 10"/><path d="M12 12l4-4"/><circle cx="12" cy="12" r="2"/></svg>;
  case"repeat": return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
  default: return null;
 }
 };

 const features = [
 { icon:"utensils", title:"Nutrition Coaching", desc:"Personalized meal plans to complement your training." },
 { icon:"video", title:"Online Coaching", desc:"Train with our experts from anywhere in the world." },
 { icon:"heartbeat", title:"Recovery Zone", desc:"Access to sauna, ice baths, and massage therapy." },
 { icon:"dumbbell", title:"Personal Training", desc:"One‑on‑one sessions tailored to your goals and schedule." },
 { icon:"users", title:"Group Classes", desc:"Daily strength, conditioning, and mobility classes for all levels." },
 { icon:"clock", title:"Open Gym Access", desc:"Flexible hours and modern equipment to train on your time." },
 ];

 const programs = [
 { img: GYMImages.gym1, title:"Personal Training Sessions", desc:"" },
 { img: GYMImages.gym5, title:"Nutrition & Workout Guidance", desc:"" },
 { img: GYMImages.gym6, title:"Strength & Conditioning Zones", desc:"" },
 ];

 const pricingPlans = [
 { name:"Basic Plan", monthly: 9.99, annual: 99.90, term:"/mo", featured: false, features: ["Open gym (off‑peak)","Intro class","Community access","Locker access","Member app check‑ins"] },
 { name:"Pro Plan", monthly: 39.99, annual: 399.90, term:"/mo", featured: true, features: ["Unlimited classes","Open gym access","Coach check‑ins","Locker + showers","Priority class booking","1 guest pass / month"] },
 { name:"Ultra Plan", monthly: 79.99, annual: 799.90, term:"/mo", featured: false, features: ["Weekly 1‑on‑1 sessions","Custom programs","Priority booking","Unlimited classes","Nutrition consult (monthly)","Recovery & mobility workshops"] },
 ];

 const testimonials = [
 { img: GYMImages.testimonial1, name:"Alex", text:"Dropped 12 lbs and gained muscle with coaching and classes." },
 { img: GYMImages.testimonial2, name:"Riley", text:"Nutrition tips plus training routines made staying on track easy." },
 { img: GYMImages.testimonial3, name:"Taylor", text:"Loved the progress tracking and tailored routines for my schedule." },
 ];

 const facilities = [
 { img: GYMImages.hero1, icon:"dumbbell", title:"Strength Zone", desc:"Racks, barbells, free weights and cable machines." },
 { img: GYMImages.hero3, icon:"running", title:"Conditioning", desc:"Treadmills, rowers, bikes and sled turf." },
 { img: GYMImages.gym1, icon:"shower", title:"Locker & Showers", desc:"Fresh towels, secure storage and clean facilities." },
 ];

 const compareData = [
 { feature:"Open gym access", basic:"Off‑peak", pro: true, ultra: true },
 { feature:"Unlimited classes", basic: false, pro: true, ultra: true },
 { feature:"Coach check‑ins", basic: false, pro: true, ultra: true },
 { feature:"Locker + showers", basic:"Locker", pro:"+ Showers", ultra:"+ Showers" },
 { feature:"Priority booking", basic: false, pro: true, ultra: true },
 { feature:"Guest pass", basic: false, pro:"1 / month", ultra:"2 / month" },
 { feature:"1‑on‑1 sessions", basic: false, pro: false, ultra:"Weekly" },
 ];

 const classPrograms = [
 { img: GYMImages.gallery1, title:"Strength Foundations", desc:"Learn barbell basics and build full‑body strength with safe, coached technique.", time:"60 min • All levels" },
 { img: GYMImages.gallery2, title:"HIIT Conditioning", desc:"Intervals and circuits for fat loss and cardio health. Scaled for any fitness level.", time:"45 min • All levels", featured: true },
 { img: GYMImages.gallery3, title:"Mobility & Recovery", desc:"Improve flexibility and joint health with guided mobility, breathwork, and soft‑tissue work.", time:"30 min • All levels" },
 { img: GYMImages.gallery4, title:"Powerlifting Club", desc:"Focused squat, bench, and deadlift cycles with technique feedback and programming.", time:"90 min • Adv" },
 { img: GYMImages.gallery5, title:"Functional Hypertrophy", desc:"Build lean muscle with smart splits, tempo work, and accessory movements.", time:"60 min • All levels" },
 { img: GYMImages.gallery6, title:"Yoga Flow", desc:"Enhance balance, mobility, and mindfulness with vinyasa‑based sequences.", time:"60 min • All levels" },
 ];

 const Navbar = () => (
 <nav className={`fg-navbar${scrolled ?" scrolled" :""}`}>
 <div className="fg-nav-inner">
 <img src={GYMImages.logo} alt="FitGym" className="fg-logo" style={{ cursor:"pointer" }} onClick={() => navigate("home")} />
 <ul className={`fg-nav-links${mobileOpen ?" open" :""}`}>
 <li className="fg-dropdown">
 <button className="fg-drop-btn" onClick={() => {}}>Home</button>
 <div className="fg-drop-menu">
 <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }} className={page ==="home" ?"active" :""}>Home 1</a>
 <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home 2</a>
 </div>
 </li>
 {navLinks.slice(1).map((l) => (
 <li key={l.page}>
 <a href="#" onClick={(e) => { e.preventDefault(); navigate(l.page); }} className={page === l.page ?"active" :""}>{l.label}</a>
 </li>
 ))}
 <li style={{ marginLeft:".5rem" }}>
 <a href="#" className="fg-nav-cta" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Download App {renderIcon("arrow-right")}</a>
 </li>
 </ul>
 <button className={`fg-mobile-toggle${mobileOpen ?" active" :""}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
 <span></span><span></span><span></span>
 </button>
 </div>
 </nav>
 );

 const Footer = () => (
 <footer className="fg-footer">
 <div className="fg-footer-inner">
 <div>
 <h3>Get In Touch</h3>
 <p className="mb-3 d-flex align-items-center" style={{ gap:".6rem" }}>{renderIcon("map-pin")}123 Street, New York, USA</p>
 <p className="mb-3 d-flex align-items-center" style={{ gap:".6rem" }}>{renderIcon("phone")}+012 345 67890</p>
 <p className="mb-3 d-flex align-items-center" style={{ gap:".6rem" }}>{renderIcon("envelope")}info@fitgym.com</p>
 <div className="fg-social-links">
 <a href="#">{renderIcon("facebook")}</a>
 <a href="#">{renderIcon("youtube")}</a>
 <a href="#">{renderIcon("linkedin")}</a>
 </div>
 </div>
 <div>
 <h3>Quick Links</h3>
 <ul className="fg-footer-links">
 <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("about"); }}>{renderIcon("arrow-right")}About Us</a></li>
 <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>{renderIcon("arrow-right")}Contact Us</a></li>
 <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("classes"); }}>{renderIcon("arrow-right")}Programs</a></li>
 <li><a href="#">{renderIcon("arrow-right")}Privacy Policy</a></li>
 <li><a href="#">{renderIcon("arrow-right")}Terms & Condition</a></li>
 </ul>
 </div>
 <div>
 <h3>Resources</h3>
 <ul className="fg-footer-links">
 <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("about"); }}>{renderIcon("arrow-right")}About Us</a></li>
 <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>{renderIcon("arrow-right")}Contact Us</a></li>
 <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("classes"); }}>{renderIcon("arrow-right")}Programs</a></li>
 <li><a href="#">{renderIcon("arrow-right")}Privacy Policy</a></li>
 <li><a href="#">{renderIcon("arrow-right")}Terms & Condition</a></li>
 </ul>
 </div>
 <div>
 <h3>Newsletter</h3>
 <p>Get updates on open slots, events, and helpful tips.</p>
 <form className="fg-newsletter-form" onSubmit={(e) => e.preventDefault()}>
 <input type="email" placeholder="Your email" required />
 <button type="submit">SignUp</button>
 </form>
 </div>
 </div>
 <div className="fg-footer-bottom">
 &copy; <a href="#">FitGym</a>, All Rights Reserved. Designed by <a href="#">FitGym Studio</a>
 </div>
 </footer>
 );

const HeroSection = () => (
  <section className="fg-hero" style={{ padding: 0 }}>
  <Navbar />
  {heroSlides.map((s, i) => (
 <div key={i} className={`fg-hero-slide${i === slideIdx ?" active" :""}`}>
 <img src={s.img} alt="" />
 <div className="fg-hero-overlay"></div>
 <div className="fg-hero-content">
 <div className="fg-container">
 <div className="fg-hero-text">
 <h1>{s.title}</h1>
 <a href="#" className="fg-btn fg-btn-primary" onClick={(e) => { e.preventDefault(); navigate("membership"); }}>{s.cta}</a>
 </div>
 <div className="fg-hero-panel">
 <div className="fg-panel-title">{s.panelTitle}</div>
 <ul className="fg-panel-list">
 {s.items.map((item, j) => (
 <li key={j}>{renderCheck()} {item}</li>
 ))}
 </ul>
 <div className="fg-stats">
 <div className="fg-stat"><div className="value">24</div><div className="label">Workouts</div></div>
 <div className="fg-stat"><div className="value">7</div><div className="label">Day Streak</div></div>
 </div>
 </div>
 </div>
 </div>
 </div>
 ))}
 <div className="fg-slider-dots">
 {heroSlides.map((_, i) => (
 <button key={i} className={`fg-slider-dot${i === slideIdx ?" active" :""}`} onClick={() => goSlide(i)} />
 ))}
 </div>
 <div className="fg-hero-social">
 <a href="#">{renderIcon("facebook")}</a>
 <a href="#">{renderIcon("instagram")}</a>
 <a href="#">{renderIcon("youtube")}</a>
 </div>
 </section>
 );

const renderHome = () => (
<>
  <HeroSection />

 <section className="fg-splash">
 <div className="fg-container">
 <div className="text-center mb-5">
 <h2 className="fg-section-title">About FitGym</h2>
 <p className="fg-about-text">FitGym is your neighborhood training club with expert coaches, strength and conditioning zones, and daily classes for all levels. Train during flexible open‑gym hours, book personal training, and track progress with simple check‑ins. Friendly, clean, and focused on technique, we help you build sustainable results that last, together every week.</p>
 </div>
 <div className="row align-items-center">
 <div className="col-12 col-lg-7" >
 <div className="fg-splash-callout" style={{ padding:"2rem" }}>
 <div className="fg-accent-stripes"><span></span><span></span><span></span></div>
 <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", marginBottom:".5rem" }}>OUR FITNESS PROGRAMS</h3>
 <p style={{ color:"var(--gray)", marginBottom:"1.5rem", lineHeight: 1.8 }}>Our AI-powered system designs and adjusts your workouts based on your progress, ensuring you&apos;re always challenged and never bored. We track your performance and provide real-time feedback to help you achieve your goals faster.</p>
 <a href="#" className="fg-btn fg-btn-primary" onClick={(e) => { e.preventDefault(); navigate("classes"); }}>SEE PROGRAMS</a>
 </div>
 </div>
 <div className="col-12 col-lg-5">
 <img src={GYMImages.hero2} alt="Member reviewing workout" className="fg-splash-img" />
 </div>
 </div>
 </div>
 </section>

 <section>
 <div className="fg-container">
 <div className="text-center mb-5">
 <h2 className="fg-section-title">Train With Coaches, Classes & Community</h2>
 <p className="fg-section-sub">Top‑tier equipment, expert coaching, and a friendly, motivating gym.</p>
 </div>
 <div className="row">
 {features.map((f, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className="fg-card fg-animate-on-scroll h-100">
 <div className="fg-icon-wrap green">{renderIcon(f.icon)}</div>
 <h3>{f.title}</h3>
 <p>{f.desc}</p>
 <a href="#" className="fg-learn-link" onClick={(e) => { e.preventDefault(); navigate("classes"); }}>Learn More {renderIcon("arrow-right")}</a>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section style={{ background:"var(--light)" }}>
 <div className="fg-container">
 <div className="text-center mb-5">
 <h2 className="fg-section-title">Other Workout Programs</h2>
 </div>
 <div className="row">
 {programs.map((p, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className="fg-showcase-card fg-animate-on-scroll">
 <div className="fg-media-wrap"><img src={p.img} alt={p.title} /></div>
 <h3>{p.title}</h3>
 <a href="#" className="fg-btn fg-btn-primary mt-3" onClick={(e) => { e.preventDefault(); navigate("classes"); }}>Explore</a>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section id="pricing">
 <div className="fg-container">
 <div className="text-center mb-5">
 <h2 className="fg-section-title">Gym Membership Pricing</h2>
 </div>
 <div className="row mx-auto" style={{ maxWidth:"1000px" }}>
 {pricingPlans.map((pl, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className={`fg-pricing-card fg-animate-on-scroll${pl.featured ?" featured" :""}`}>
 <h3>{pl.name}</h3>
 <div className="fg-price">${billing ==="monthly" ? pl.monthly.toFixed(2) : pl.annual.toFixed(2)}<span>{billing ==="monthly" ?"/mo" :"/yr"}</span></div>
 <ul>
 {pl.features.map((f, j) => <li key={j}>{renderCheck()} {f}</li>)}
 </ul>
 <a href="#" className="fg-btn fg-btn-primary w-100" onClick={(e) => { e.preventDefault(); navigate("membership"); }}>Select</a>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section style={{ background:"var(--light)" }}>
 <div className="fg-container">
 <div className="text-center mb-5 mx-auto" style={{ maxWidth:"700px" }}>
 <h2 className="fg-section-title">Real People, Real Results</h2>
 </div>
 <div className="row">
 {testimonials.map((t, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className="fg-testimonial-card fg-animate-on-scroll">
 {renderStars()}
 <p>&ldquo;{t.text}&rdquo;</p>
 <div className="fg-test-author">
 <img src={t.img} alt={t.name} />
 <div>
 <h4>{t.name}</h4>
 <small>Member</small>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section>
 <div className="fg-container">
 <div className="text-center mb-5">
 <h2 className="fg-section-title">Facilities & Amenities</h2>
 <p className="fg-section-sub">Clean, modern and ready when you are.</p>
 </div>
 <div className="row">
 {facilities.map((f, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className="fg-facility-card fg-animate-on-scroll">
 <div className="fg-facility-media"><img src={f.img} alt={f.title} /></div>
 <div className="fg-icon-wrap green mx-auto" style={{ margin:"-28px auto 1rem" }}>{renderIcon(f.icon)}</div>
 <h3>{f.title}</h3>
 <p>{f.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section style={{ background:"var(--light)" }}>
 <div className="fg-container">
 <div className="text-center">
 <h2 className="fg-section-title">This Week&apos;s Classes</h2>
 </div>
 <div className="fg-schedule-wrapper">
 <table className="fg-schedule-table">
 <thead>
 <tr><th>Day</th><th>Time</th><th>Class</th><th>Coach</th></tr>
 </thead>
 <tbody>
 {scheduleData.map((s, i) => (
 <tr key={i}><td>{s.day}</td><td>{s.time}</td><td>{s.cls}</td><td>{s.coach}</td></tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="text-center" style={{ marginTop:"1.5rem" }}>
 <a href="#" className="fg-btn fg-btn-primary" onClick={(e) => { e.preventDefault(); navigate("classes"); }}>Full Schedule</a>
 </div>
 </div>
 </section>

 <section>
 <div className="fg-container">
 <div className="text-center mb-5">
 <h2 className="fg-section-title">Meet our trainers</h2>
 </div>
 <div className="row mx-auto" style={{ maxWidth:"900px" }}>
 {coaches.map((c, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className="fg-coach-card fg-animate-on-scroll">
 <img src={c.img} alt={c.name} />
 <h3>{c.name}</h3>
 <p>{c.role}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section style={{ background:"var(--light)" }}>
 <div className="fg-container">
 <div className="text-center">
 <h2 className="fg-section-title">Gallery</h2>
 <p className="fg-section-sub">A look inside FitGym</p>
 </div>
 <div className="fg-gallery-grid">
 {galleryImgs.map((g, i) => (
 <div key={i} className="fg-gallery-item fg-animate-on-scroll">
 <img src={g} alt={`Gallery ${i + 1}`} />
 </div>
 ))}
 </div>
 </div>
 </section>

 <section>
 <div className="fg-container">
 <div className="text-center">
 <h2 className="fg-section-title">Frequently Asked Questions</h2>
 </div>
 <div style={{ maxWidth:"820px", margin:"0 auto" }}>
 {faqs.map((f, i) => (
 <details key={i} className="faq-item">
 <summary>{f.q}</summary>
 <div className="faq-body">{f.a}</div>
 </details>
 ))}
 </div>
 </div>
 </section>

 <section style={{ background:"var(--light)" }}>
 <div className="fg-container">
 <div className="row align-items-stretch">
 <div className="col-12 col-lg-7">
 <div className="fg-location">
 <iframe src="https://www.google.com/maps?q=123+Street,+New+York,+USA&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="FitGym Location"></iframe>
 </div>
 </div>
 <div className="col-12 col-lg-5">
 <div className="fg-location-card">
 <h3>Location & Hours</h3>
 <p style={{ color:"var(--gray)", marginBottom:"1rem" }}>123 Street, New York, USA</p>
 <ul className="fg-hours">
 <li><span>Mon–Fri</span><span>6:00 AM – 9:00 PM</span></li>
 <li><span>Sat</span><span>8:00 AM – 6:00 PM</span></li>
 <li><span>Sun</span><span>8:00 AM – 4:00 PM</span></li>
 </ul>
 <a href="https://www.google.com/maps/search/?api=1&query=123+Street,+New+York,+USA" className="fg-btn fg-btn-primary" target="_blank" rel="noopener noreferrer">Get Directions</a>
 </div>
 </div>
 </div>
 </div>
 </section>

 <section>
 <div className="fg-container">
 <div className="fg-cta-section d-flex align-items-center justify-content-between flex-wrap" style={{ gap:"2rem" }}>
 <div>
 <h3>Book a Free Tour</h3>
 <p>See the space, meet a coach and plan your start. Get a quick walkthrough of equipment, classes and membership options that fit your goals.</p>
 <ul>
 <li>{renderCheck()} Free parking</li>
 <li>{renderCheck()} Flexible hours</li>
 <li>{renderCheck()} Coach meet‑and‑greet</li>
 </ul>
 <div className="d-flex" style={{ gap:".75rem", flexWrap:"wrap" }}>
 <a href="#" className="fg-btn fg-btn-primary" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Contact Us</a>
 <a href="#" className="fg-btn fg-btn-primary" onClick={(e) => { e.preventDefault(); navigate("membership"); }}>See Pricing</a>
 </div>
 </div>
 <img src={GYMImages.gym7} alt="Gym tour" style={{ borderRadius:"12px", maxWidth:"300px", width:"100%" }} />
 </div>
 </div>
 </section>

 <Footer />
 </>
 );

const renderAbout = () => (
  <>
  <section className="fg-page-hero about-hero-section" style={{ padding:0, marginBottom:"3rem" }}>
      <Navbar />
      <img className="fg-hero-bg about-hero" src={GYMImages.hero2} alt="About FitGym" />
      <div className="fg-hero-overlay"></div>
      <div className="fg-page-hero-content">
        <h1 className="fg-page-title mb-3">About Us</h1>
        <p className="fg-page-subtitle">Our mission, coaches and community</p>
      </div>
    </section>

  <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <h1 className="mb-4">Our Philosophy</h1>
            <p>FitGym is a community-driven fitness club focused on building strong, healthy bodies through proven strength training, smart conditioning, and mobility work. Our certified coaches tailor programs to every level so you can train safely, confidently, and consistently.</p>
            <p className="mb-4">Whether you&apos;re getting started or chasing new PRs, you&apos;ll find small‑group sessions, 1:1 coaching, and flexible memberships that fit your life. Expect clean facilities, supportive coaches, and progress you can measure—week after week.</p>
            <div className="row g-4 align-items-center">
              <div className="col-sm-6">
                <a className="btn btn-primary rounded-pill py-3 px-5" href="#" onClick={(e) => { e.preventDefault(); navigate("classes"); }}>See Programs</a>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-center">
                  <img className="rounded-circle flex-shrink-0" src={GYMImages.testimonial1} alt="" style={{ width:45, height:45 }} />
                  <div className="ms-3">
                    <h6 className="text-primary mb-1">Alex Morgan</h6>
                    <small>Head Coach</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 about-img">
            <div className="row">
              <div className="col-12 text-end">
                <img className="img-fluid w-75 fg-square-img d-block ms-auto" src={GYMImages.gallery3} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  <div className="container-xxl py-5 fg-methodology">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fg-section-title">Our Training Methodology</h2>
          <p className="text-muted">Three pillars we coach every day</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="h-100 text-center p-4 bg-light rounded">
              <div className="fs-1 mb-2 method-icon">{renderIcon("chart")}</div>
              <h5 className="mb-2">Strength</h5>
              <p className="text-muted small mb-0">Compound lifts with progressive overload for safe, measurable gains.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="h-100 text-center p-4 bg-light rounded">
              <div className="fs-1 mb-2 method-icon">{renderIcon("gauge")}</div>
              <h5 className="mb-2">Conditioning</h5>
              <p className="text-muted small mb-0">Intervals and circuits to build engine without burning out.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="h-100 text-center p-4 bg-light rounded">
              <div className="fs-1 mb-2 method-icon">{renderIcon("repeat")}</div>
              <h5 className="mb-2">Mobility</h5>
              <p className="text-muted small mb-0">Movement quality, activation and recovery to keep you training.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="fg-section-title">Facilities Highlights</h2>
          <p className="text-muted">A quick look inside</p>
        </div>
        <div className="gallery-grid">
          {[
            { src: GYMImages.gallery1, label: "Free Weights" },
            { src: GYMImages.gallery2, label: "Power Racks" },
            { src: GYMImages.gallery3, label: "Cardio Zone" },
            { src: GYMImages.gallery4, label: "Turf & Sleds" },
            { src: GYMImages.gallery5, label: "Mobility Area" },
            { src: GYMImages.gallery6, label: "Locker Rooms" },
          ].map((f, i) => (
            <div key={i} className="gallery-item">
              <img src={f.src} alt={f.label} className="gallery-img" />
              <div className="small text-center mt-2">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

  <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="fg-section-title">Member Results</h2>
          <p className="text-muted">Real progress from real people</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="h-100 text-center p-4 bg-light rounded">
              <div className="display-5 fw-bold">+18%</div>
              <div className="text-muted small">Avg strength increase in 12 weeks</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="h-100 text-center p-4 bg-light rounded">
              <div className="display-5 fw-bold">-7.4kg</div>
              <div className="text-muted small">Avg bodyweight change with coaching</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="h-100 text-center p-4 bg-light rounded">
              <div className="display-5 fw-bold">92%</div>
              <div className="text-muted small">Members training 3x/week by month 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  <div className="container-xxl py-5">
      <div className="container">
        <div className="bg-light rounded">
          <div className="row g-0">
            <div className="col-lg-6" style={{ minHeight:400 }}>
              <div className="position-relative h-100">
                <img className="position-absolute w-100 h-100 rounded" src={GYMImages.hero3} style={{ objectFit:"cover" }} alt="" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="h-100 d-flex flex-column justify-content-center p-5">
                <h1 className="mb-4">Start Your Fitness Journey</h1>
                <p className="mb-4">Book a free intro session. Meet a coach, tour the gym, and leave with a personalized plan for your goals.</p>
                <a className="btn btn-primary py-3 px-5" href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Book Free Trial {renderIcon("arrow-right")}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fg-section-title">Meet our trainers</h2>
        </div>
        <div className="row g-4">
          {coaches.map((c, i) => (
            <div key={i} className="col-lg-4 col-md-6">
              <div className="coach-card h-100 text-center">
                <img src={c.img} alt={c.name} className="coach-photo" />
                <h5 className="mt-3 mb-1">{c.name}</h5>
                <p className="text-muted small mb-0">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer />
  </>
  );

const renderClasses = () => (
<>
  <section className="fg-page-hero" style={{ padding:0, marginBottom:"3rem" }}>
      <Navbar />
      <img className="fg-hero-bg" src={GYMImages.gym6} alt="Programs" />
      <div className="fg-hero-overlay"></div>
      <div className="fg-page-hero-content">
        <h1 className="fg-page-title mb-3">Programs</h1>
        <p className="fg-page-subtitle">Coached sessions and open gym for every level</p>
      </div>
    </section>

 <section className="classes-section" style={{ background:"var(--dark)" }}>
 <div className="fg-container">
 <div className="text-center" style={{ marginBottom:"3rem" }}>
 <small style={{ color:"rgba(255,255,255,.5)" }}>Our Programs</small>
 <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3rem", color:"#fff" }}>Progress-driven training</h1>
 </div>
 <div className="row">
 {classPrograms.map((cp, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className={`fg-class-card fg-animate-on-scroll${cp.featured ?" featured" :""}`}>
 <div className="fg-class-image">
 <img src={cp.img} alt={cp.title} />
 <span className="fg-date-badge">{renderIcon("clock")}{cp.time}</span>
 </div>
 <div className="fg-class-body">
 <h4>{cp.title}</h4>
 <p>{cp.desc}</p>
 <a href="#" className="fg-btn fg-btn-primary" style={{ padding:".5rem 1.5rem", fontSize:".8rem" }} onClick={(e) => { e.preventDefault(); }}>Join Now {renderIcon("arrow-right")}</a>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section>
 <div className="fg-container">
 <div className="row align-items-end" style={{ marginBottom:"3rem" }}>
 <div className="col-12 col-lg-7">
 <small style={{ color:"var(--gray)", textTransform:"uppercase", fontWeight: 600 }}>Our Coaching Team</small>
 <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.8rem", marginTop:".5rem" }}>Meet <span style={{ color:"var(--primary)" }}>Your Coaches</span></h1>
 </div>
 <div className="col-12 col-lg-5">
 <p style={{ color:"var(--gray)" }}>Experienced coaches who guide technique, tailor progressions, and support your goals.</p>
 </div>
 </div>
 <div className="row mx-auto" style={{ maxWidth:"900px" }}>
 {[
 { img: GYMImages.trainer1, name:"Jordan", role:"Strength & Conditioning" },
 { img: GYMImages.trainer2, name:"Riley", role:"Powerlifting" },
 { img: GYMImages.trainer3, name:"Morgan", role:"Mobility & Recovery" },
 ].map((t, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className="fg-teacher-card fg-animate-on-scroll">
 <div className="fg-teacher-blob"><img src={t.img} alt={t.name} /></div>
 <h4>{t.name}</h4>
 <div className="fg-role">{t.role}</div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section style={{ background:"var(--light)" }}>
 <div className="fg-container">
 <div className="fg-trial-panel" style={{ maxWidth:"800px", margin:"0 auto", padding:"3rem 2rem" }}>
 <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.5rem", marginBottom:"2rem", textAlign:"center" }}>Book a Free Trial Session</h1>
 <form onSubmit={(e) => e.preventDefault()}>
 <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
  <div className="fg-form-floating">
  <label htmlFor="fg-fullName">Full Name</label>
  <input type="text" id="fg-fullName" placeholder="Full Name" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-email">Email</label>
  <input type="email" id="fg-email" placeholder="Email" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-phone">Phone</label>
  <input type="tel" id="fg-phone" placeholder="Phone" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-contactMethod">Preferred Contact Method</label>
  <select id="fg-contactMethod">
  <option value="email">Email</option>
  <option value="phone">Phone</option>
  </select>
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-programInterest">Program Interest</label>
  <select id="fg-programInterest">
  <option value="strength">Strength Foundations</option>
  <option value="hiit">HIIT Conditioning</option>
  <option value="mobility">Mobility & Recovery</option>
  <option value="powerlifting">Powerlifting Club</option>
  <option value="hypertrophy">Functional Hypertrophy</option>
  <option value="yoga">Yoga Flow</option>
  </select>
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-preferredDate">Preferred Date</label>
  <input type="date" id="fg-preferredDate" placeholder="Preferred Date" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-preferredTime">Preferred Time</label>
  <input type="time" id="fg-preferredTime" placeholder="Preferred Time" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-goals">Goals / Notes</label>
  <textarea id="fg-goals" placeholder="Goals / Notes" style={{ minHeight:"80px" }}></textarea>
 </div>
  <div className="fg-form-floating" style={{ gridColumn:"1/-1" }}>
  <label htmlFor="fg-hearAbout">How did you hear about FitGym?</label>
  <select id="fg-hearAbout">
  <option value="friend">Friend/Family</option>
  <option value="search">Online Search</option>
  <option value="social">Social Media</option>
  <option value="flyer">Flyer</option>
  <option value="other">Other</option>
  </select>
 </div>
  <div className="fg-form-floating" style={{ gridColumn:"1/-1" }}>
  <label htmlFor="fg-extra">Anything else we should know?</label>
  <textarea id="fg-extra" placeholder="Anything else we should know?" style={{ minHeight:"80px" }}></textarea>
 </div>
 <div style={{ gridColumn:"1/-1" }}>
 <button className="fg-btn fg-btn-primary" style={{ width:"100%", padding:"1rem" }} type="submit">Submit</button>
 </div>
 </div>
 </form>
 </div>
 </div>
 </section>

 <section>
 <div className="fg-container">
 <div className="text-center mx-auto mb-5" style={{ maxWidth:"600px" }}>
 <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.5rem" }}>Testimonials</h1>
 <p style={{ color:"var(--gray)" }}>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit.</p>
 </div>
 <div className="row">
 {testimonials.map((t, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className="fg-testimonial-card fg-animate-on-scroll" style={{ padding:"2.5rem" }}>
 <p style={{ fontSize:"1rem", lineHeight: 1.8 }}>{t.text}</p>
 <div className="fg-test-author">
 <img src={t.img} alt={t.name} />
 <div>
 <h4>{t.name}</h4>
 <small>Member</small>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <Footer />
 </>
 );

const renderMembership = () => (
<>
  <section className="fg-page-hero" style={{ padding:0, marginBottom:"3rem" }}>
      <Navbar />
      <img className="fg-hero-bg" src={GYMImages.gym7} alt="Membership" />
      <div className="fg-hero-overlay"></div>
      <div className="fg-page-hero-content">
        <h1 className="fg-page-title mb-3">Membership</h1>
        <p className="fg-page-subtitle">Flexible plans for every goal</p>
      </div>
    </section>

  <section>
  <div className="fg-container">
  <div className="text-center mb-5">
  <h2 className="fg-section-title">Gym Membership Pricing</h2>
 </div>
 <div className="text-center mb-4">
 <div className="fg-billing-toggle d-inline-flex">
 <button className={`fg-toggle-btn${billing ==="monthly" ?" active" :""}`} onClick={() => setBilling("monthly")}>Monthly</button>
 <button className={`fg-toggle-btn${billing ==="annual" ?" active" :""}`} onClick={() => setBilling("annual")}>Annual</button>
 </div>
 <span style={{ marginLeft:"1rem", color:"var(--gray)", fontSize:".85rem" }}>2 months free on annual</span>
 </div>
 <div className="row mx-auto" style={{ maxWidth:"1000px" }}>
 {pricingPlans.map((pl, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className={`fg-pricing-card fg-animate-on-scroll${pl.featured ?" featured" :""}`}>
 <h5 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem", marginBottom:".5rem" }}>{pl.name}</h5>
 <div className="fg-price">${billing ==="monthly" ? pl.monthly.toFixed(2) : pl.annual.toFixed(2)}<span>{billing ==="monthly" ?"/mo" :"/yr"}</span></div>
 <ul>
 {pl.features.map((f, j) => <li key={j}>{renderCheck()} {f}</li>)}
 </ul>
 <a href="#" className="fg-btn fg-btn-primary w-100" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Select</a>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <section style={{ background:"var(--light)" }}>
 <div className="fg-container">
 <div className="text-center">
 <h2 className="fg-section-title">Compare Plans</h2>
 </div>
 <div className="fg-table-responsive">
 <table className="fg-compare-table">
 <thead>
 <tr><th>Feature</th><th>Basic</th><th>Pro</th><th>Ultra</th></tr>
 </thead>
 <tbody>
 {compareData.map((row, i) => (
 <tr key={i}>
 <td>{row.feature}</td>
 <td>{row.basic === true ? renderCheck() : row.basic === false ? renderMinus() : row.basic}</td>
 <td>{row.pro === true ? renderCheck() : row.pro === false ? renderMinus() : row.pro}</td>
 <td>{row.ultra === true ? renderCheck() : row.ultra === false ? renderMinus() : row.ultra}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </section>

 <section>
 <div className="fg-container">
 <div className="text-center mb-5">
 <h2 className="fg-section-title">What&apos;s Included</h2>
 <p className="fg-section-sub">Facilities, classes and support that make your membership worth it.</p>
 </div>
 <div className="row" style={{ marginBottom:"3rem" }}>
 <div className="col-12 col-lg-4"><div className="fg-card fg-animate-on-scroll h-100"><div className="fg-icon-wrap green">{renderIcon("dumbbell")}</div><h3>Modern Equipment</h3><p>Strength and conditioning zones with maintained, clean gear.</p></div></div>
 <div className="col-12 col-lg-4"><div className="fg-card fg-animate-on-scroll h-100"><div className="fg-icon-wrap green">{renderIcon("users")}</div><h3>Group Classes</h3><p>Daily strength, conditioning and mobility for all levels.</p></div></div>
 <div className="col-12 col-lg-4"><div className="fg-card fg-animate-on-scroll h-100"><div className="fg-icon-wrap green">{renderIcon("shower")}</div><h3>Locker & Showers</h3><p>Fresh towels, secure storage and clean facilities.</p></div></div>
 </div>
 <div className="text-center mb-5">
 <h2 className="fg-section-title">How It Works</h2>
 </div>
 <div className="row">
 <div className="col-12 col-lg-4"><div className="fg-card fg-animate-on-scroll h-100"><div className="fg-icon-wrap blue">{renderIcon("calendar")}</div><h3>Choose a Plan</h3><p>Pick monthly or annual, then select the plan that fits.</p></div></div>
 <div className="col-12 col-lg-4"><div className="fg-card fg-animate-on-scroll h-100"><div className="fg-icon-wrap blue">{renderIcon("user")}</div><h3>Create Account</h3><p>Complete quick signup and activate your membership.</p></div></div>
 <div className="col-12 col-lg-4"><div className="fg-card fg-animate-on-scroll h-100"><div className="fg-icon-wrap blue">{renderIcon("clock")}</div><h3>Book & Train</h3><p>Reserve classes or drop in during access hours.</p></div></div>
 </div>
 </div>
 </section>

 <section style={{ background:"var(--light)" }}>
 <div className="fg-container">
 <div className="text-center" style={{ maxWidth:"820px", margin:"0 auto 2rem" }}>
 <h2 className="fg-section-title">FAQs</h2>
 <p className="fg-section-sub">Details on passes, freezes and upgrades.</p>
 </div>
 <div style={{ maxWidth:"820px", margin:"0 auto" }}>
 {[
 { q:"Can I pause my membership?", a:"Yes—short freezes are available for travel or medical reasons. Contact us to set dates." },
 { q:"Do you offer day passes?", a:"We offer day passes during staffed hours. Ask at the front desk for availability." },
 { q:"Can I upgrade my plan later?", a:"You can upgrade anytime. The new plan starts immediately and is pro‑rated." },
 ].map((f, i) => (
 <details key={i} className="faq-item">
 <summary>{f.q}</summary>
 <div className="faq-body">{f.a}</div>
 </details>
 ))}
 </div>
 </div>
 </section>

 <Footer />
 </>
 );

const renderBlog = () => (
<>
  <section className="fg-page-hero" style={{ padding:0, marginBottom:"3rem" }}>
      <Navbar />
      <img className="fg-hero-bg" src={GYMImages.gallery3} alt="Blog" />
      <div className="fg-hero-overlay"></div>
      <div className="fg-page-hero-content">
        <h1 className="fg-page-title mb-3">Blog</h1>
        <p className="fg-page-subtitle">Training tips, nutrition and community stories</p>
      </div>
    </section>

  <section>
  <div className="fg-container">
  <div className="row align-items-end" style={{ marginBottom:"3rem" }}>
 <div className="col-12 col-lg-7">
 <small style={{ color:"var(--gray)", textTransform:"uppercase", fontWeight: 600 }}>Latest Articles</small>
 <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.8rem", marginTop:".5rem" }}>
 <span style={{ color:"var(--primary)" }}>Articles</span>
 </h1>
 </div>
 <div className="col-12 col-lg-5">
 <p style={{ color:"var(--gray)" }}>Practical resources on routines, nutrition, play ideas, and what&apos;s happening at our daycare.</p>
 </div>
 </div>
 <div className="row">
 {blogArticles.map((b, i) => (
 <div key={i} className="col-12 col-lg-4">
 <div className="fg-blog-card fg-animate-on-scroll">
 <div className="fg-blog-image">
 <img src={b.img} alt={b.title} />
 <span className="fg-date-badge">{renderIcon("calendar")}{b.date}</span>
 </div>
 <div className="fg-blog-body">
 <div className="fg-blog-meta">{renderIcon("user")} Admin &bull; {b.read}</div>
 <h4>{b.title}</h4>
 <p>{b.desc}</p>
 <a href="#" className="fg-learn-link">Read More {renderIcon("arrow-right")}</a>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 <Footer />
 </>
 );

const renderContact = () => (
<>
  <section className="fg-page-hero" style={{ padding:0, marginBottom:"3rem" }}>
      <Navbar />
      <img className="fg-hero-bg" src={GYMImages.gym6} alt="Contact" />
      <div className="fg-hero-overlay"></div>
      <div className="fg-page-hero-content">
        <h1 className="fg-page-title mb-3">Contact us</h1>
        <p className="fg-page-subtitle">We respond within one business day</p>
      </div>
    </section>

  <section>
  <div className="fg-container">
  <div className="row align-items-end" style={{ marginBottom:"2rem" }}>
  <div className="col-12 col-lg-7">
  <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.8rem" }}>We&apos;d love to <span style={{ color:"var(--primary)" }}>hear from you</span></h1>
 </div>
 <div className="col-12 col-lg-5">
 <p style={{ color:"var(--gray)" }}>Reach out with questions, availability, or to schedule a tour. We respond within one business day.</p>
 </div>
 </div>
 <div className="row">
 <div className="col-12 col-lg-6">
 <div className="fg-contact-card soft-blue">
 <h3>Contact Info</h3>
 <div className="fg-info-item">
 <div className="fg-icon-pill blue">{renderIcon("map-pin")}</div>
 <div>123 Street, New York, USA</div>
 </div>
 <div className="fg-info-item">
 <div className="fg-icon-pill blue">{renderIcon("envelope")}</div>
 <div>info@fitgym.com</div>
 </div>
 <div className="fg-info-item">
 <div className="fg-icon-pill blue">{renderIcon("phone")}</div>
 <div>+012 345 6789</div>
 </div>
 <div className="row g-3" style={{ margin:"1.5rem 0" }}>
 <div className="col-6">
 <div className="fg-mini-card">
 <div className="fg-label">Office Hours</div>
 <div className="fg-val">Mon–Fri</div>
 <div style={{ fontSize:".8rem", color:"var(--gray)" }}>8:00am – 5:00pm</div>
 </div>
 </div>
 <div className="col-6">
 <div className="fg-mini-card">
 <div className="fg-label">Tours</div>
 <div className="fg-val">By appointment</div>
 <div style={{ fontSize:".8rem", color:"var(--gray)" }}>Mon–Thu</div>
 </div>
 </div>
 </div>
 <a href="#" className="fg-btn fg-btn-primary" onClick={(e) => { e.preventDefault(); }}>Schedule a Tour {renderIcon("arrow-right")}</a>
 </div>
 </div>
 <div className="col-12 col-lg-6">
 <div className="fg-contact-card">
 <h3>Send a Message</h3>
 <form onSubmit={(e) => e.preventDefault()}>
  <div className="fg-form-floating">
  <label htmlFor="fg-c-name">Your Name</label>
  <input type="text" id="fg-c-name" placeholder="Your Name" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-c-email">Your Email</label>
  <input type="email" id="fg-c-email" placeholder="Your Email" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-c-phone">Phone</label>
  <input type="tel" id="fg-c-phone" placeholder="Phone" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-c-goal">Fitness Goal (optional)</label>
  <input type="text" id="fg-c-goal" placeholder="Fitness Goal (optional)" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-c-subject">Subject</label>
  <input type="text" id="fg-c-subject" placeholder="Subject" />
 </div>
  <div className="fg-form-floating">
  <label htmlFor="fg-c-message">Message</label>
  <textarea id="fg-c-message" placeholder="Message" style={{ minHeight:"120px" }}></textarea>
 </div>
 <button className="fg-btn fg-btn-primary w-100" type="submit">Send Message</button>
 </form>
 </div>
 </div>
 </div>
 <div className="mt-4">
 <div className="fg-map-embed">
 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew+York%2C+USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd" loading="lazy" title="FitGym Map Location"></iframe>
 </div>
 </div>
 </div>
 </section>

 <Footer />
 </>
 );

 return (
 <>
 <div className="fg-preloader" style={loaded ? { opacity: 0, visibility:"hidden" } : {}}>
 <div className="fg-spinner"></div>
 </div>

 <button id="fg-scroll-top" className="fg-scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
 {renderIcon("chevron-up")}
 </button>

 {page ==="home" && renderHome()}
 {page ==="about" && renderAbout()}
 {page ==="classes" && renderClasses()}
 {page ==="membership" && renderMembership()}
 {page ==="blog" && renderBlog()}
 {page ==="contact" && renderContact()}
 </>
 );
}

