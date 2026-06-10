"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface HaylerProps {
  store: any;
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

const IMG = {
  slide1: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997919/shopora/hayler/slide-1.jpg",
  slide2: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997920/shopora/hayler/slide-2.jpg",
  slide3: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997921/shopora/hayler/slide-3.jpg",
  portfolio1: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997922/shopora/hayler/portfolio-1.jpg",
  portfolio2: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997923/shopora/hayler/portfolio-2.jpg",
  portfolio3: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997924/shopora/hayler/portfolio-3.jpg",
  portfolio4: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997924/shopora/hayler/portfolio-4.jpg",
  about: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997925/shopora/hayler/about.jpg",
  client1: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997926/shopora/hayler/client-1.png",
  client2: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997927/shopora/hayler/client-2.png",
  client3: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997928/shopora/hayler/client-3.png",
  client4: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997929/shopora/hayler/client-4.png",
  client5: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997930/shopora/hayler/client-5.png",
  client6: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997931/shopora/hayler/client-6.png",
  pattern: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997932/shopora/hayler/pattern.jpg",
};

const DEFAULT = {
  nav: {
    logo: "Hayler",
    links: [
      { label: "Index", href: "#hero" },
      { label: "Works", href: "#", dropdown: [
        { label: "Case Studies", href: "#portfolio" },
        { label: "Portfolio", href: "#portfolio" },
      ]},
      { label: "Studio", href: "#about" },
      { label: "Archive", href: "#clients" },
      { label: "Contact", href: "#footer" },
    ],
  },
  preloader: {
    enabled: true,
    text: "Page is Loading",
  },
  hero: {
    enabled: true,
    slides: [
      { title: "Neo Action", year: "2026", category: "Brand Identity", bg: IMG.slide1 },
      { title: "Thorned", year: "2026", category: "Visual Design", bg: IMG.slide2 },
      { title: "Pure Motion", year: "2026", category: "Motion Graphics", bg: IMG.slide3 },
    ],
  },
  about: {
    enabled: true,
    heading: "A solution that goes above touch and imagination...",
    paragraphs: [
      "We are a multi award winning global creative production studio working across digital and physical experiences. Our focus is on delivering work that not only looks incredible but fundamentally shifts how audiences connect with brands.",
      "From strategy through execution, we partner with ambitious organisations to create meaningful impact through design, technology, and storytelling.",
    ],
    features: [
      { label: "Strategic Approach" },
      { label: "World Class Team" },
      { label: "Global Reach" },
      { label: "Award Winning" },
    ],
    image: IMG.about,
    ctaText: "Read More \u2192",
  },
  portfolio: {
    enabled: true,
    heading: "Selected Work",
    items: [
      { title: "Arctic Flame", year: "2026", category: "Photography", image: IMG.portfolio1 },
      { title: "Yolk", year: "2026", category: "Branding", image: IMG.portfolio2 },
      { title: "Mono Block", year: "2026", category: "Web Design", image: IMG.portfolio3 },
      { title: "Kinetic", year: "2026", category: "Photography", image: IMG.portfolio4 },
    ],
    ctaText: "See all Projects",
  },
  clients: {
    enabled: true,
    marqueeText: "Our clients \u2022 Partnership \u2022 Relations \u2022 ",
    items: [
      { name: "Nordic Wave", logo: IMG.client1, category: "Partnership" },
      { name: "Vertex Studio", logo: IMG.client2, category: "Relations" },
      { name: "Echo Labs", logo: IMG.client3, category: "Partnership" },
      { name: "Pulse Media", logo: IMG.client4, category: "Our clients" },
      { name: "Crafted Co", logo: IMG.client5, category: "Relations" },
      { name: "Dawn Creative", logo: IMG.client6, category: "Partnership" },
    ],
  },
  services: {
    enabled: true,
    heading: "Services, skills and expertise",
    skills: [
      "Ajax Page Load",
      "Visual Editor",
      "GSAP Powered",
      "Lottie Animation",
      "Three.js Integration",
      "WebGL Effects",
      "Responsive Design",
      "SEO Optimized",
      "Custom Cursor",
    ],
  },
  pageNav: {
    enabled: true,
    title: "Digital Experiences",
    subtitle: "Explore the case studies",
    label: "Next Page",
  },
  footer: {
    enabled: true,
    logo: "Hayler",
    email: "hello@studiohayler.com",
    address: "Rosenthaler Str. 23, Berlin, 10119",
    hours: "9AM \u2013 6PM",
    sitemap: [
      "Index", "Case Studies", "Portfolio", "Studio", "Archive", "Contact", "Page 404", "Terms", "Help Center",
    ],
    socials: [
      { icon: "fa-brands fa-twitter", url: "#" },
      { icon: "fa-brands fa-instagram", url: "#" },
      { icon: "fa-brands fa-dribbble", url: "#" },
      { icon: "fa-brands fa-behance", url: "#" },
    ],
    copyright: "2026 \u00a9 ClaPat. All rights reserved.",
  },
};

export default function HaylerTemplate(props: HaylerProps) {
  const { store, banners, settings, products, slug } = props;
  const sectionRef = useRef<HTMLElement | null>(null);

  const hayler = settings.haylerSettings || {};

  const nav = { ...DEFAULT.nav, ...hayler.nav };
  const preloader = { ...DEFAULT.preloader, ...hayler.preloader };
  const hero = { ...DEFAULT.hero, ...hayler.hero };
  const about = { ...DEFAULT.about, ...hayler.about };
  const portfolio = { ...DEFAULT.portfolio, ...hayler.portfolio };
  const clients = { ...DEFAULT.clients, ...hayler.clients };
  const services = { ...DEFAULT.services, ...hayler.services };
  const pageNav = { ...DEFAULT.pageNav, ...hayler.pageNav };
  const footer = { ...DEFAULT.footer, ...hayler.footer };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [preloaderProgress, setPreloaderProgress] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Preloader counting
    let count = 0;
    const preloaderInterval = setInterval(() => {
      count += 1;
      setPreloaderProgress(count);
      if (count >= 100) {
        clearInterval(preloaderInterval);
        setTimeout(() => {
          setPreloaderDone(true);
        }, 500);
      }
    }, 25);

    // Header scroll effect
    const handleScroll = () => {
      const header = headerRef.current;
      if (header) {
        if (window.scrollY > 50) header.classList.add("hy-header-scrolled");
        else header.classList.remove("hy-header-scrolled");
      }
      // Reveal elements on scroll
      document.querySelectorAll(".hy-reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("hy-revealed");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);

    // Cursor
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;
    const moveCursor = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      }
      if (cursorRing) {
        cursorRing.style.left = e.clientX + "px";
        cursorRing.style.top = e.clientY + "px";
      }
    };
    const hoverables = document.querySelectorAll("a, button, .hy-hover-target, .hy-portfolio-item, .hy-slider-nav-btn, .hy-slider-dot");
    const addHover = () => {
      cursorRing?.classList.add("hy-cursor-hover");
      cursor?.classList.add("hy-cursor-hover");
    };
    const removeHover = () => {
      cursorRing?.classList.remove("hy-cursor-hover");
      cursor?.classList.remove("hy-cursor-hover");
    };
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });
    document.addEventListener("mousemove", moveCursor);
    const hideCursor = () => {
      if (cursor) cursor.style.display = "none";
      if (cursorRing) cursorRing.style.display = "none";
    };
    const showCursor = () => {
      if (cursor) cursor.style.display = "block";
      if (cursorRing) cursorRing.style.display = "block";
    };
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);

    // Slider drag
    const slider = sliderRef.current;
    let mouseDown: ((e: MouseEvent) => void) | null = null;
    let mouseLeave: (() => void) | null = null;
    let mouseUp: (() => void) | null = null;
    let mouseMove: ((e: MouseEvent) => void) | null = null;
    if (slider) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isDragging = false;

      mouseDown = (e: MouseEvent) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.classList.add("hy-grabbing");
      };
      mouseLeave = () => {
        isDown = false;
        slider.classList.remove("hy-grabbing");
      };
      mouseUp = () => {
        isDown = false;
        slider.classList.remove("hy-grabbing");
        isDragging = false;
      };
      mouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        isDragging = true;
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
        // Update active slide based on scroll position
        const slideWidth = slider.querySelector(".hy-slide")?.clientWidth || 1;
        const newIndex = Math.round(slider.scrollLeft / slideWidth);
        if (newIndex >= 0 && newIndex < hero.slides.length) {
          setCurrentSlide(newIndex);
        }
      };
      slider.addEventListener("mousedown", mouseDown);
      slider.addEventListener("mouseleave", mouseLeave);
      slider.addEventListener("mouseup", mouseUp);
      slider.addEventListener("mousemove", mouseMove);
    }

    // Mobile menu toggle
    const toggle = document.querySelector(".hy-menu-toggle");
    const navMenu = document.querySelector(".hy-nav");
    toggle?.addEventListener("click", () => {
      navMenu?.classList.toggle("hy-nav-open");
      toggle.classList.toggle("hy-menu-open");
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('.hy-nav a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const el = e.currentTarget as HTMLAnchorElement;
        const targetId = el.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({ top: (targetElement as HTMLElement).offsetTop - 80, behavior: "smooth" });
        }
        navMenu?.classList.remove("hy-nav-open");
        toggle?.classList.remove("hy-menu-open");
      });
    });

    // Clock
    const updateClock = () => {
      if (clockRef.current) {
        const now = new Date();
        const berlinTime = now.toLocaleTimeString("en-US", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", second: "2-digit" });
        clockRef.current.textContent = berlinTime;
      }
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Intersection observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hy-revealed");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".hy-anim-section").forEach((el) => observer.observe(el));

    // Dropdown
    const dropdowns = document.querySelectorAll(".hy-dropdown");
    dropdowns.forEach((dd) => {
      dd.addEventListener("mouseenter", () => dd.classList.add("hy-dropdown-open"));
      dd.addEventListener("mouseleave", () => dd.classList.remove("hy-dropdown-open"));
    });

    return () => {
      clearInterval(preloaderInterval);
      clearInterval(clockInterval);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      if (slider && mouseDown && mouseLeave && mouseUp && mouseMove) {
        slider.removeEventListener("mousedown", mouseDown);
        slider.removeEventListener("mouseleave", mouseLeave);
        slider.removeEventListener("mouseup", mouseUp);
        slider.removeEventListener("mousemove", mouseMove);
      }
      observer.disconnect();
    };
  }, [hero.slides.length]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&family=Funnel+Display:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@300;400;500&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        :root {
          --hy-gap: 24px;
          --hy-horizontal-gutter: 50px;
          --hy-vertical-gutter: 120px;
          --hy-primary-color: #b880ff;
          --hy-secondary-color: #b880ff;
          --hy-color-black: #000;
          --hy-color-white: #fff;
          --hy-header-height: 120px;
          --hy-footer-height: 120px;
          --hy-default-font-family: 'Inter Tight', sans-serif;
          --hy-primary-font-family: 'Funnel Display', sans-serif;
          --hy-secondary-font-family: 'Roboto Mono', monospace;
          --hy-title-font-size: clamp(2rem, 1.5rem + 6vw, 8rem);
          --hy-title-line-height: 1.15em;
          --hy-title-font-weight: 600;
          --hy-body-font-size: 1rem;
          --hy-body-line-height: 24px;
          --hy-dark-bg: #0a0a0a;
          --hy-dark-card: #111111;
          --hy-dark-border: #1e1e1e;
          --hy-text-primary: #ffffff;
          --hy-text-secondary: #aaaaaa;
          --hy-text-muted: #666666;
        }

        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-family:var(--hy-default-font-family);background:var(--hy-color-black);color:var(--hy-text-primary);line-height:var(--hy-body-line-height);overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;cursor:none}
        ::selection{background:var(--hy-primary-color);color:var(--hy-color-black)}
        a{text-decoration:none;color:inherit}
        ul{list-style:none}
        img{max-width:100%;display:block}
        button{border:none;background:none;cursor:none;color:inherit;font-family:inherit}
        section{position:relative}

        /* Preloader */
        .hy-preloader{position:fixed;top:0;left:0;width:100%;height:100%;background:var(--hy-color-black);z-index:20000;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity 0.6s ease,visibility 0.6s ease}
        .hy-preloader.hy-preloader-hidden{opacity:0;visibility:hidden;pointer-events:none}
        .hy-preloader-reveals{position:absolute;inset:0;display:flex;z-index:2;pointer-events:none}
        .hy-preloader-reveal{flex:1;background:var(--hy-primary-color);transform:translateY(100%);transition:transform 1.2s cubic-bezier(0.77,0,0.175,1)}
        .hy-preloader-reveal.hy-reveal-out{transform:translateY(-100%)}
        .hy-preloader-reveal:nth-child(1){transition-delay:0s}
        .hy-preloader-reveal:nth-child(2){transition-delay:0.1s}
        .hy-preloader-reveal:nth-child(3){transition-delay:0.2s}
        .hy-preloader-reveal:nth-child(4){transition-delay:0.3s}
        .hy-preloader-reveal:nth-child(5){transition-delay:0.4s}
        .hy-preloader-content{position:relative;z-index:1;text-align:center}
        .hy-preloader-text{font-family:var(--hy-secondary-font-family);font-size:0.85rem;text-transform:uppercase;letter-spacing:4px;color:var(--hy-text-secondary);margin-bottom:30px}
        .hy-preloader-text span{animation:hyDots 1.5s infinite;opacity:0}
        .hy-preloader-text span:nth-child(1){animation-delay:0s}
        .hy-preloader-text span:nth-child(2){animation-delay:0.3s}
        .hy-preloader-text span:nth-child(3){animation-delay:0.6s}
        @keyframes hyDots{0%,100%{opacity:0}50%{opacity:1}}
        .hy-preloader-counter{font-family:var(--hy-primary-font-family);font-size:clamp(4rem,6vw,8rem);font-weight:800;color:var(--hy-text-primary);line-height:1}
        .hy-preloader-counter span{display:inline-block;min-width:3ch}
        .hy-preloader-bar{width:200px;height:2px;background:var(--hy-dark-border);margin-top:40px;position:relative;overflow:hidden}
        .hy-preloader-bar-inner{position:absolute;left:0;top:0;height:100%;width:0%;background:var(--hy-primary-color);transition:width 0.1s linear}

        /* Custom Cursor */
        .hy-cursor{position:fixed;width:8px;height:8px;background:var(--hy-primary-color);border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width 0.2s,height 0.2s,background 0.2s;mix-blend-mode:difference}
        .hy-cursor-ring{position:fixed;width:40px;height:40px;border:1px solid rgba(255,255,255,0.3);border-radius:50%;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width 0.3s,height 0.3s,border-color 0.3s,transform 0.15s}
        .hy-cursor-hover.hy-cursor{width:12px;height:12px;background:var(--hy-primary-color);mix-blend-mode:difference}
        .hy-cursor-hover.hy-cursor-ring{width:60px;height:60px;border-color:var(--hy-primary-color);background:rgba(184,128,255,0.08)}

        /* Header */
        .hy-header{position:fixed;top:0;left:0;width:100%;z-index:1000;padding:0 var(--hy-horizontal-gutter);height:var(--hy-header-height);display:flex;align-items:center;transition:all 0.4s cubic-bezier(0.77,0,0.175,1);mix-blend-mode:difference}
        .hy-header-scrolled{height:80px;background:rgba(10,10,10,0.9);backdrop-filter:blur(20px);mix-blend-mode:normal}
        .hy-header-container{width:100%;display:flex;justify-content:space-between;align-items:center}
        .hy-logo{font-family:var(--hy-primary-font-family);font-size:1.8rem;font-weight:700;letter-spacing:-0.02em;color:var(--hy-text-primary)}
        .hy-nav ul{display:flex;gap:35px;align-items:center}
        .hy-nav ul li{position:relative}
        .hy-nav ul li a{font-size:0.85rem;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:var(--hy-text-primary);position:relative;padding:5px 0;transition:color 0.3s}
        .hy-nav ul li a::after{content:"";position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--hy-primary-color);transition:width 0.3s}
        .hy-nav ul li a:hover::after{width:100%}
        .hy-nav ul li a:hover{color:var(--hy-primary-color)}
        .hy-dropdown-menu{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(10px);background:rgba(17,17,17,0.95);backdrop-filter:blur(20px);border:1px solid var(--hy-dark-border);padding:15px 0;min-width:160px;opacity:0;visibility:hidden;transition:all 0.3s ease;pointer-events:none}
        .hy-dropdown-open .hy-dropdown-menu{opacity:1;visibility:visible;transform:translateX(-50%) translateY(5px);pointer-events:auto}
        .hy-dropdown-menu li{width:100%}
        .hy-dropdown-menu li a{display:block;padding:8px 25px;font-size:0.8rem;text-transform:uppercase;letter-spacing:1.5px;white-space:nowrap}
        .hy-menu-toggle{display:none;font-size:0.85rem;text-transform:uppercase;letter-spacing:2px;cursor:none;color:var(--hy-text-primary);position:relative;z-index:1001}

        /* Hero Showcase Slider */
        .hy-hero{height:100vh;position:relative;overflow:hidden;background:var(--hy-dark-bg)}
        .hy-showcase-slider-carousel-horizontal{width:100%;height:100%}
        .hy-slider-wrapper{width:100%;height:100%;position:relative}
        .hy-slider{width:100%;height:100%;overflow:hidden}
        .hy-slider-viewport{display:flex;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;cursor:grab}
        .hy-slider-viewport::-webkit-scrollbar{display:none}
        .hy-slider-viewport.hy-grabbing{cursor:grabbing}
        .hy-slide{flex:0 0 100%;height:100%;scroll-snap-align:start;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;user-select:none}
        .hy-slide-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.1);transition:transform 8s cubic-bezier(0.25,0.46,0.45,0.94)}
        .hy-slide-content{position:relative;z-index:2;text-align:center;padding:0 50px;max-width:900px}
        .hy-slide-category{font-family:var(--hy-secondary-font-family);font-size:0.8rem;text-transform:uppercase;letter-spacing:4px;color:var(--hy-primary-color);margin-bottom:20px;opacity:0;transform:translateY(20px);animation:hySlideContentIn 1s 0.3s forwards}
        .hy-slide-title{font-family:var(--hy-primary-font-family);font-size:var(--hy-title-font-size);line-height:var(--hy-title-line-height);font-weight:var(--hy-title-font-weight);color:var(--hy-text-primary);margin-bottom:15px;opacity:0;transform:translateY(30px);animation:hySlideContentIn 1s 0.5s forwards}
        .hy-slide-year{font-family:var(--hy-secondary-font-family);font-size:0.9rem;color:var(--hy-text-secondary);letter-spacing:2px;opacity:0;transform:translateY(20px);animation:hySlideContentIn 1s 0.7s forwards}
        @keyframes hySlideContentIn{to{opacity:1;transform:translateY(0)}}
        .hy-slide-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.8) 100%);z-index:1}

        /* Hero Footer */
        .hy-hero-footer{position:absolute;bottom:0;left:0;right:0;padding:30px var(--hy-horizontal-gutter);display:flex;justify-content:space-between;align-items:flex-end;z-index:10}
        .hy-hero-footer-left{display:flex;align-items:center;gap:15px}
        .hy-drag-indicator{font-family:var(--hy-secondary-font-family);font-size:0.75rem;text-transform:uppercase;letter-spacing:3px;color:var(--hy-text-secondary);display:flex;align-items:center;gap:10px}
        .hy-drag-line{width:60px;height:1px;background:var(--hy-text-secondary);position:relative;overflow:hidden}
        .hy-drag-line::after{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:var(--hy-primary-color);animation:hyDragLine 2s infinite}
        @keyframes hyDragLine{0%{left:-100%}100%{left:200%}}
        .hy-featured-project{font-family:var(--hy-primary-font-family);font-size:1.2rem;font-weight:600;color:var(--hy-text-primary);display:flex;align-items:center;gap:10px}
        .hy-featured-project i{font-size:1rem;transition:transform 0.3s;color:var(--hy-primary-color)}
        .hy-featured-project:hover i{transform:translateX(5px)}

        /* Pagination */
        .hy-slider-pagination{display:flex;gap:30px;align-items:center}
        .hy-slider-dot{display:flex;align-items:center;gap:8px;cursor:pointer;background:none;border:none;padding:5px 0;border-bottom:1px solid transparent;transition:all 0.3s}
        .hy-slider-dot.active{border-bottom-color:var(--hy-primary-color)}
        .hy-slider-dot-number{font-family:var(--hy-secondary-font-family);font-size:0.75rem;color:var(--hy-text-muted);letter-spacing:1px;transition:color 0.3s}
        .hy-slider-dot.active .hy-slider-dot-number{color:var(--hy-text-primary)}
        .hy-slider-dot-line{width:30px;height:1px;background:var(--hy-text-muted);transition:background 0.3s,width 0.3s}
        .hy-slider-dot.active .hy-slider-dot-line{background:var(--hy-primary-color);width:50px}
        .hy-slider-nav{display:flex;gap:15px;margin-left:30px}
        .hy-slider-nav-btn{width:45px;height:45px;border:1px solid var(--hy-dark-border);display:flex;align-items:center;justify-content:center;color:var(--hy-text-primary);transition:all 0.3s;background:transparent;cursor:pointer;font-size:0.9rem}
        .hy-slider-nav-btn:hover{border-color:var(--hy-primary-color);color:var(--hy-primary-color)}

        /* About */
        .hy-about{padding:var(--hy-vertical-gutter) var(--hy-horizontal-gutter);background:var(--hy-dark-bg);min-height:100vh;display:flex;align-items:center}
        .hy-container{max-width:1400px;margin:0 auto;width:100%}
        .hy-about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .hy-about-text h2{font-family:var(--hy-primary-font-family);font-size:clamp(2rem,1.5rem + 3vw,4rem);line-height:1.15;font-weight:700;color:var(--hy-text-primary);margin-bottom:30px}
        .hy-about-text h2 span{color:var(--hy-primary-color)}
        .hy-about-content p{font-size:1.05rem;line-height:1.8;color:var(--hy-text-secondary);margin-bottom:25px}
        .hy-about-features{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:35px}
        .hy-about-feature{display:flex;align-items:center;gap:10px;font-size:0.9rem;color:var(--hy-text-primary);font-weight:500}
        .hy-about-feature i{color:var(--hy-primary-color);font-size:0.7rem}
        .hy-about-image{position:relative;border-radius:20px;overflow:hidden}
        .hy-about-image img{width:100%;height:auto;transform:scale(1);transition:transform 8s cubic-bezier(0.25,0.46,0.45,0.94)}
        .hy-about-image:hover img{transform:scale(1.05)}
        .hy-btn{display:inline-flex;align-items:center;gap:10px;padding:18px 40px;border:1px solid var(--hy-dark-border);font-size:0.85rem;text-transform:uppercase;letter-spacing:2px;font-weight:500;color:var(--hy-text-primary);transition:all 0.3s;position:relative;overflow:hidden}
        .hy-btn::before{content:"";position:absolute;inset:0;background:var(--hy-primary-color);transform:scaleX(0);transform-origin:right;transition:transform 0.4s cubic-bezier(0.77,0,0.175,1);z-index:-1}
        .hy-btn:hover{border-color:var(--hy-primary-color);color:var(--hy-color-black)}
        .hy-btn:hover::before{transform:scaleX(1);transform-origin:left}

        /* Portfolio */
        .hy-portfolio{padding:var(--hy-vertical-gutter) var(--hy-horizontal-gutter);background:var(--hy-dark-bg);position:relative}
        .hy-portfolio-header{margin-bottom:60px;display:flex;justify-content:space-between;align-items:flex-end}
        .hy-portfolio-header h2{font-family:var(--hy-primary-font-family);font-size:clamp(1.8rem,1.2rem + 2.5vw,3.5rem);font-weight:700;color:var(--hy-text-primary);max-width:500px}
        .hy-portfolio-count{font-family:var(--hy-secondary-font-family);font-size:0.8rem;color:var(--hy-text-muted);letter-spacing:1px}
        .hy-showcase-portfolio-wrapper{overflow:hidden}
        .hy-portfolio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
        .hy-portfolio-item{position:relative;overflow:hidden;border-radius:12px;min-height:400px;cursor:pointer}
        .hy-portfolio-item:nth-child(1){grid-column:span 2;min-height:500px}
        .hy-portfolio-item:nth-child(4n){grid-column:span 2}
        .hy-portfolio-item img{width:100%;height:100%;object-fit:cover;transition:transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)}
        .hy-portfolio-item:hover img{transform:scale(1.08)}
        .hy-portfolio-item-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,0.85) 0%,transparent 60%);z-index:1;opacity:0;transition:opacity 0.4s}
        .hy-portfolio-item:hover .hy-portfolio-item-overlay{opacity:1}
        .hy-portfolio-item-info{position:absolute;bottom:0;left:0;right:0;padding:35px;z-index:2;transform:translateY(20px);opacity:0;transition:all 0.4s 0.1s}
        .hy-portfolio-item:hover .hy-portfolio-item-info{transform:translateY(0);opacity:1}
        .hy-portfolio-item-title{font-family:var(--hy-primary-font-family);font-size:1.6rem;font-weight:600;color:var(--hy-text-primary);margin-bottom:5px}
        .hy-portfolio-item-meta{display:flex;gap:15px;align-items:center}
        .hy-portfolio-item-year{font-family:var(--hy-secondary-font-family);font-size:0.75rem;color:var(--hy-text-muted);letter-spacing:1px}
        .hy-portfolio-item-category{font-family:var(--hy-secondary-font-family);font-size:0.75rem;color:var(--hy-primary-color);letter-spacing:1px;text-transform:uppercase}
        .hy-portfolio-footer{margin-top:60px;text-align:center}

        /* Marquee */
        .hy-marquee{background:var(--hy-dark-bg);overflow:hidden;padding:25px 0;border-top:1px solid var(--hy-dark-border);border-bottom:1px solid var(--hy-dark-border)}
        .hy-marquee-track{display:flex;gap:0;white-space:nowrap;animation:hyMarquee 30s linear infinite}
        .hy-marquee-track span{font-family:var(--hy-primary-font-family);font-size:1.2rem;font-weight:500;color:var(--hy-text-secondary);letter-spacing:4px;text-transform:uppercase;padding:0 20px}
        .hy-marquee-track span::before{content:"\\2726";margin-right:20px;color:var(--hy-primary-color)}
        @keyframes hyMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

        /* Clients Logo Table */
        .hy-clients{padding:var(--hy-vertical-gutter) var(--hy-horizontal-gutter);background:var(--hy-dark-bg)}
        .hy-clients-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:stretch}
        .hy-clients-logos{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .hy-client-logo-card{background:var(--hy-dark-card);border:1px solid var(--hy-dark-border);border-radius:16px;padding:40px 30px;display:flex;align-items:center;justify-content:center;min-height:130px;transition:all 0.4s;position:relative;overflow:hidden}
        .hy-client-logo-card::before{content:"";position:absolute;inset:0;background:var(--hy-primary-color);opacity:0;transition:opacity 0.4s}
        .hy-client-logo-card:hover::before{opacity:0.05}
        .hy-client-logo-card:hover{border-color:var(--hy-primary-color);transform:translateY(-5px)}
        .hy-client-logo-card img{max-height:50px;opacity:0.5;transition:opacity 0.4s;position:relative;z-index:1}
        .hy-client-logo-card:hover img{opacity:1}
        .hy-clients-info{display:flex;flex-direction:column;gap:20px}
        .hy-client-info-card{background:var(--hy-dark-card);border:1px solid var(--hy-dark-border);border-radius:16px;padding:35px;transition:all 0.4s;flex:1}
        .hy-client-info-card:hover{border-color:var(--hy-primary-color);transform:translateX(-5px)}
        .hy-client-info-card h3{font-family:var(--hy-primary-font-family);font-size:1.4rem;font-weight:600;color:var(--hy-text-primary);margin-bottom:10px}
        .hy-client-info-card p{font-size:0.95rem;color:var(--hy-text-secondary);line-height:1.7}
        .hy-client-info-card .hy-client-count{font-family:var(--hy-primary-font-family);font-size:3rem;font-weight:700;color:var(--hy-primary-color);margin-bottom:5px}
        .hy-client-info-card:nth-child(2) .hy-client-count{color:var(--hy-text-primary)}

        /* Services Skills */
        .hy-services{padding:var(--hy-vertical-gutter) var(--hy-horizontal-gutter);background:var(--hy-dark-bg);position:relative}
        .hy-services h2{font-family:var(--hy-primary-font-family);font-size:clamp(1.8rem,1.2rem + 2.5vw,3.5rem);font-weight:700;color:var(--hy-text-primary);margin-bottom:60px;max-width:600px}
        .hy-skills-list{display:flex;flex-direction:column;gap:0;max-width:800px}
        .hy-skill-item{display:flex;align-items:center;justify-content:space-between;padding:22px 0;border-bottom:1px solid var(--hy-dark-border);cursor:pointer;transition:all 0.3s;position:relative}
        .hy-skill-item:first-child{border-top:1px solid var(--hy-dark-border)}
        .hy-skill-item:hover{border-bottom-color:var(--hy-primary-color);padding-left:15px}
        .hy-skill-name{font-family:var(--hy-primary-font-family);font-size:1.2rem;font-weight:500;color:var(--hy-text-primary);transition:color 0.3s}
        .hy-skill-item:hover .hy-skill-name{color:var(--hy-primary-color)}
        .hy-skill-dot{width:6px;height:6px;background:var(--hy-primary-color);border-radius:50%;opacity:0;transition:opacity 0.3s}
        .hy-skill-item:hover .hy-skill-dot{opacity:1}
        .hy-skill-index{font-family:var(--hy-secondary-font-family);font-size:0.75rem;color:var(--hy-text-muted);margin-right:20px;min-width:30px}

        /* Page Navigation */
        .hy-page-nav{padding:80px var(--hy-horizontal-gutter);background:var(--hy-dark-bg);border-top:1px solid var(--hy-dark-border);border-bottom:1px solid var(--hy-dark-border);text-align:center;cursor:pointer;transition:all 0.4s;position:relative;overflow:hidden}
        .hy-page-nav::before{content:"";position:absolute;inset:0;background:var(--hy-primary-color);opacity:0;transition:opacity 0.4s}
        .hy-page-nav:hover::before{opacity:0.05}
        .hy-page-nav:hover{border-color:var(--hy-primary-color)}
        .hy-next-hero-infotitle{font-family:var(--hy-secondary-font-family);font-size:0.75rem;text-transform:uppercase;letter-spacing:4px;color:var(--hy-text-muted);margin-bottom:20px}
        .hy-page-nav:hover .hy-next-hero-infotitle{color:var(--hy-primary-color)}
        .hy-next-hero-title{font-family:var(--hy-primary-font-family);font-size:clamp(2rem,1.5rem + 4vw,6rem);font-weight:700;line-height:1.1;color:var(--hy-text-primary);display:flex;flex-direction:column;gap:5px;align-items:center}
        .hy-next-hero-title span{display:block}
        .hy-next-hero-subtitle{font-family:var(--hy-secondary-font-family);font-size:0.85rem;color:var(--hy-text-secondary);margin-top:20px;letter-spacing:1px}
        .hy-page-nav:hover .hy-next-hero-subtitle{color:var(--hy-text-primary)}

        /* Footer */
        .hy-footer{background:var(--hy-color-black);padding:var(--hy-vertical-gutter) var(--hy-horizontal-gutter) 30px;border-top:1px solid var(--hy-dark-border)}
        .hy-footer-main{display:grid;grid-template-columns:1fr 1.5fr 1.5fr;gap:60px;margin-bottom:80px}
        .hy-footer-col .hy-logo{font-family:var(--hy-primary-font-family);font-size:2.5rem;font-weight:700;color:var(--hy-text-primary);margin-bottom:30px}
        .hy-clock-wrapper{display:flex;flex-direction:column;gap:5px}
        .hy-clock-label{font-family:var(--hy-secondary-font-family);font-size:0.7rem;text-transform:uppercase;letter-spacing:3px;color:var(--hy-text-muted)}
        .hy-clock-time{font-family:var(--hy-secondary-font-family);font-size:2.5rem;font-weight:300;color:var(--hy-text-primary);line-height:1}
        .hy-clock-location{font-family:var(--hy-secondary-font-family);font-size:0.75rem;color:var(--hy-text-secondary);letter-spacing:1px}
        .hy-footer-col h3{font-family:var(--hy-primary-font-family);font-size:1.2rem;font-weight:600;color:var(--hy-text-primary);margin-bottom:25px}
        .hy-footer-col p{font-size:0.95rem;color:var(--hy-text-secondary);margin-bottom:8px;line-height:1.7}
        .hy-footer-col p:hover{color:var(--hy-text-primary)}
        .hy-footer-col ul{display:flex;flex-direction:column;gap:10px}
        .hy-footer-col ul li{font-size:0.9rem;color:var(--hy-text-secondary);transition:all 0.3s;cursor:pointer}
        .hy-footer-col ul li:hover{color:var(--hy-primary-color);transform:translateX(5px)}
        .hy-footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:30px;border-top:1px solid var(--hy-dark-border)}
        .hy-footer-bottom span{font-size:0.85rem;color:var(--hy-text-muted)}
        .hy-socials{display:flex;gap:20px}
        .hy-socials a{width:40px;height:40px;border:1px solid var(--hy-dark-border);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--hy-text-secondary);transition:all 0.3s;font-size:0.9rem}
        .hy-socials a:hover{border-color:var(--hy-primary-color);color:var(--hy-primary-color);transform:translateY(-3px)}

        /* Animations */
        .hy-anim-section{opacity:0;transform:translateY(40px);transition:opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94),transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)}
        .hy-anim-section.hy-revealed{opacity:1;transform:translateY(0)}

        /* Responsive */
        @media (max-width: 1537px){
          :root{--hy-horizontal-gutter:40px;--hy-vertical-gutter:100px}
          .hy-portfolio-grid{grid-template-columns:repeat(3,1fr)}
        }
        @media (max-width: 1280px){
          .hy-about-grid{grid-template-columns:1fr;gap:50px}
          .hy-clients-grid{grid-template-columns:1fr;gap:40px}
          .hy-footer-main{grid-template-columns:1fr 1fr;gap:40px}
          .hy-portfolio-item:nth-child(1){grid-column:span 1;min-height:400px}
          .hy-portfolio-item:nth-child(4n){grid-column:span 1}
        }
        @media (max-width: 1024px){
          :root{--hy-horizontal-gutter:30px;--hy-vertical-gutter:80px;--hy-header-height:90px}
          .hy-nav{position:fixed;top:0;right:-100%;width:70%;height:100vh;background:rgba(10,10,10,0.98);backdrop-filter:blur(20px);flex-direction:column;justify-content:center;align-items:center;transition:right 0.5s cubic-bezier(0.77,0,0.175,1);z-index:999}
          .hy-nav.hy-nav-open{right:0}
          .hy-nav ul{flex-direction:column;gap:30px;text-align:center}
          .hy-nav ul li a{font-size:1.1rem}
          .hy-menu-toggle{display:block}
          .hy-menu-open{color:var(--hy-primary-color)}
          .hy-dropdown-menu{position:static;transform:none;background:transparent;backdrop-filter:none;border:none;padding:10px 0;opacity:1;visibility:visible;text-align:center}
          .hy-dropdown-menu li a{font-size:0.85rem;padding:5px 0}
          .hy-portfolio-grid{grid-template-columns:1fr;gap:20px}
          .hy-portfolio-item{min-height:350px}
          .hy-hero-footer{flex-direction:column;gap:20px;align-items:flex-start}
          .hy-slider-pagination{flex-wrap:wrap;gap:15px}
          .hy-slider-nav{display:none}
        }
        @media (max-width: 767px){
          :root{--hy-horizontal-gutter:20px;--hy-vertical-gutter:60px;--hy-header-height:70px}
          .hy-logo{font-size:1.4rem}
          .hy-nav{width:100%}
          .hy-hero-footer{display:none}
          .hy-about-features{grid-template-columns:1fr}
          .hy-clients-logos{grid-template-columns:1fr}
          .hy-footer-main{grid-template-columns:1fr;gap:30px}
          .hy-footer-bottom{flex-direction:column;gap:20px;text-align:center}
          .hy-portfolio-item{min-height:280px}
          .hy-slide-content{padding:0 20px}
          .hy-header{padding:0 20px}
          .hy-cursor,.hy-cursor-ring{display:none}
          body{cursor:auto}
        }
        @media (max-width: 479px){
          :root{--hy-horizontal-gutter:15px;--hy-vertical-gutter:40px}
          .hy-portfolio-item-title{font-size:1.2rem}
          .hy-skills-list{max-width:100%}
          .hy-skill-name{font-size:1rem}
        }
      `}</style>

      <div className="hy-root">
        {/* Preloader */}
        {preloader.enabled !== false && (
        <div className={`hy-preloader ${preloaderDone ? 'hy-preloader-hidden' : ''}`}>
          <div className="hy-preloader-reveals">
            <div className={`hy-preloader-reveal ${preloaderDone ? 'hy-reveal-out' : ''}`}></div>
            <div className={`hy-preloader-reveal ${preloaderDone ? 'hy-reveal-out' : ''}`}></div>
            <div className={`hy-preloader-reveal ${preloaderDone ? 'hy-reveal-out' : ''}`}></div>
            <div className={`hy-preloader-reveal ${preloaderDone ? 'hy-reveal-out' : ''}`}></div>
            <div className={`hy-preloader-reveal ${preloaderDone ? 'hy-reveal-out' : ''}`}></div>
          </div>
          <div className="hy-preloader-content">
            <div className="hy-preloader-text">
              {preloader.text}
              <span>.</span><span>.</span><span>.</span>
            </div>
            <div className="hy-preloader-counter">
              <span>{preloaderProgress}%</span>
            </div>
            <div className="hy-preloader-bar">
              <div className="hy-preloader-bar-inner" style={{ width: preloaderProgress + '%' }}></div>
            </div>
          </div>
        </div>
        )}

        {/* Custom Cursor */}
        <div ref={cursorRef} className="hy-cursor" style={{ display: 'none' }}></div>
        <div ref={cursorRingRef} className="hy-cursor-ring" style={{ display: 'none' }}></div>

        {/* Header */}
        <header ref={headerRef} id="hy-header" className="hy-header">
          <div className="hy-header-container">
            <div className="hy-logo">{nav.logo}</div>
            <nav className="hy-nav">
              <ul>
                {nav.links.map((link: any, i: number) => (
                  link.dropdown ? (
                    <li key={i} className="hy-dropdown">
                      <a>{link.label}</a>
                      <ul className="hy-dropdown-menu">
                        {link.dropdown.map((sub: any, j: number) => (
                          <li key={j}><a href={sub.href || "#"}>{sub.label}</a></li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={i}><a href={link.href || "#"}>{link.label}</a></li>
                  )
                ))}
              </ul>
            </nav>
            <div className="hy-menu-toggle">Menu</div>
          </div>
        </header>

        {/* Hero Showcase Slider */}
        {hero.enabled !== false && (
        <section id="hero" className="hy-hero hy-showcase-slider-carousel-horizontal hy-anim-section">
          <div className="hy-slider-wrapper">
            <div className="hy-slider">
              <div ref={sliderRef} className="hy-slider-viewport" id="hy-slider-viewport">
                {hero.slides.map((slide: any, i: number) => (
                  <div key={i} className="hy-slide">
                    <img className="hy-slide-bg" src={slide.bg} alt={slide.title} draggable="false" />
                    <div className="hy-slide-overlay"></div>
                    <div className="hy-slide-content">
                      <div className="hy-slide-category">{slide.category}</div>
                      <h2 className="hy-slide-title">{slide.title}</h2>
                      <div className="hy-slide-year">{slide.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hy-hero-footer">
              <div className="hy-hero-footer-left">
                <div className="hy-drag-indicator">
                  <span>Drag to Explore</span>
                  <div className="hy-drag-line"></div>
                </div>
                <div className="hy-featured-project">
                  Featured Project <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="hy-slider-pagination">
                {hero.slides.map((slide: any, i: number) => (
                  <button key={i} className={`hy-slider-dot ${i === currentSlide ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentSlide(i);
                      if (sliderRef.current) {
                        const slideWidth = sliderRef.current.querySelector(".hy-slide")?.clientWidth || 0;
                        sliderRef.current.scrollTo({ left: slideWidth * i, behavior: "smooth" });
                      }
                    }}>
                    <span className="hy-slider-dot-number">0{i + 1}.</span>
                    <span className="hy-slider-dot-line"></span>
                  </button>
                ))}
                <div className="hy-slider-nav">
                  <button className="hy-slider-nav-btn" onClick={() => {
                    const prev = currentSlide > 0 ? currentSlide - 1 : hero.slides.length - 1;
                    setCurrentSlide(prev);
                    if (sliderRef.current) {
                      const slideWidth = sliderRef.current.querySelector(".hy-slide")?.clientWidth || 0;
                      sliderRef.current.scrollTo({ left: slideWidth * prev, behavior: "smooth" });
                    }
                  }}><i className="fa-solid fa-arrow-left"></i></button>
                  <button className="hy-slider-nav-btn" onClick={() => {
                    const next = (currentSlide + 1) % hero.slides.length;
                    setCurrentSlide(next);
                    if (sliderRef.current) {
                      const slideWidth = sliderRef.current.querySelector(".hy-slide")?.clientWidth || 0;
                      sliderRef.current.scrollTo({ left: slideWidth * next, behavior: "smooth" });
                    }
                  }}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* About */}
        {about.enabled !== false && (
        <section id="about" className="hy-about hy-anim-section">
          <div className="hy-container">
            <div className="hy-about-grid">
              <div className="hy-about-text">
                <h2>{about.heading}</h2>
                <div className="hy-about-content">
                  {about.paragraphs.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="hy-about-features">
                  {about.features.map((f: any, i: number) => (
                    <div key={i} className="hy-about-feature">
                      <i className="fa-solid fa-star"></i>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
                <a href="#" className="hy-btn">{about.ctaText}</a>
              </div>
              <div className="hy-about-image">
                <img src={about.image} alt="About" />
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Portfolio */}
        {portfolio.enabled !== false && (
        <section id="portfolio" className="hy-portfolio hy-anim-section">
          <div className="hy-container">
            <div className="hy-portfolio-header">
              <h2>{portfolio.heading}</h2>
              <span className="hy-portfolio-count">0{portfolio.items.length} Projects</span>
            </div>
            <div className="hy-showcase-portfolio-wrapper">
              <div className="hy-portfolio-grid">
                {portfolio.items.map((item: any, i: number) => (
                  <div key={i} className="hy-portfolio-item">
                    <img src={item.image} alt={item.title} />
                    <div className="hy-portfolio-item-overlay"></div>
                    <div className="hy-portfolio-item-info">
                      <h3 className="hy-portfolio-item-title">{item.title}</h3>
                      <div className="hy-portfolio-item-meta">
                        <span className="hy-portfolio-item-year">{item.year}</span>
                        <span className="hy-portfolio-item-category">{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hy-portfolio-footer">
              <a href="#" className="hy-btn">{portfolio.ctaText} <i className="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </section>
        )}

        {/* Clients Marquee */}
        {clients.enabled !== false && (
        <div className="hy-marquee">
          <div className="hy-marquee-track">
            <span>{clients.marqueeText}</span>
            <span>{clients.marqueeText}</span>
            <span>{clients.marqueeText}</span>
            <span>{clients.marqueeText}</span>
          </div>
        </div>
        )}

        {/* Clients */}
        {clients.enabled !== false && (
        <section id="clients" className="hy-clients hy-anim-section">
          <div className="hy-container">
            <div className="hy-clients-grid">
              <div className="hy-clients-logos">
                {clients.items.map((client: any, i: number) => (
                  <div key={i} className="hy-client-logo-card">
                    <img src={client.logo} alt={client.name} />
                  </div>
                ))}
              </div>
              <div className="hy-clients-info">
                <div className="hy-client-info-card">
                  <div className="hy-client-count">24+</div>
                  <h3>Our clients</h3>
                  <p>Trusted by industry leaders worldwide to deliver exceptional creative work that drives results.</p>
                </div>
                <div className="hy-client-info-card">
                  <div className="hy-client-count">150+</div>
                  <h3>Projects Delivered</h3>
                  <p>Each project is crafted with precision, passion, and a relentless pursuit of excellence.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Services */}
        {services.enabled !== false && (
        <section id="services" className="hy-services hy-anim-section">
          <div className="hy-container">
            <h2>{services.heading}</h2>
            <ul className="hy-skills-list">
              {services.skills.map((skill: string, i: number) => (
                <li key={i} className="hy-skill-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="hy-skill-index">{(i + 1).toString().padStart(2, '0')}.</span>
                    <span className="hy-skill-name">{skill}</span>
                  </div>
                  <span className="hy-skill-dot"></span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        )}

        {/* Page Navigation */}
        {pageNav.enabled !== false && (
        <section id="page-nav" className="hy-page-nav hy-anim-section" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="hy-page-nav-caption">
            <div className="hy-next-hero-infotitle">{pageNav.label}</div>
            <div className="hy-next-hero-title">
              {pageNav.title.split(' ').map((word: string, i: number) => (
                <span key={i}>{word}</span>
              ))}
            </div>
            <div className="hy-next-hero-subtitle">{pageNav.subtitle}</div>
          </div>
        </section>
        )}

        {/* Footer */}
        {footer.enabled !== false && (
        <footer id="hy-footer" className="hy-footer">
          <div className="hy-footer-main">
            <div className="hy-footer-col">
              <div className="hy-logo">{footer.logo}</div>
              <div className="hy-clock-wrapper">
                <span className="hy-clock-label">CEST Berlin</span>
                <div ref={clockRef} className="hy-clock-time">00:00:00</div>
                <span className="hy-clock-location">Local Time</span>
              </div>
            </div>
            <div className="hy-footer-col">
              <h3>Work with Us</h3>
              <p>{footer.email}</p>
              <p>{footer.address}</p>
              <p>{footer.hours}</p>
            </div>
            <div className="hy-footer-col">
              <h3>Sitemap</h3>
              <ul>
                {footer.sitemap.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hy-footer-bottom">
            <span>{footer.copyright}</span>
            <div className="hy-socials">
              {footer.socials.map((s: any, i: number) => (
                <a key={i} href={s.url}><i className={s.icon}></i></a>
              ))}
            </div>
          </div>
        </footer>
        )}
      </div>
    </>
  );
}
