"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ITSImages } from "./ITSImages";

interface ITSolutionProps {
  store: any;
  banners: any;
  settings: any;
  products: any;
  slug: string;
  categories: any;
}

const SERVICES = [
  { icon: "monitor", title: "Web Development", desc: "Professional web solutions with modern technologies and responsive designs." },
  { icon: "phone", title: "Mobile App Development", desc: "Native and cross-platform mobile applications for iOS and Android." },
  { icon: "cloud", title: "Cloud Solutions", desc: "Scalable cloud infrastructure and deployment solutions for your business." },
  { icon: "marketing", title: "Digital Marketing", desc: "Strategic digital marketing campaigns to boost your online presence." },
  { icon: "design", title: "UX/UI Design", desc: "User-centered design experiences that engage and convert your audience." },
  { icon: "data", title: "Data Analytics", desc: "Transform your data into actionable insights for better business decisions." },
];

const PORTFOLIO_ITEMS = [
  { img: ITSImages.portfolio1, title: "E-commerce Platform", cat: "Web Development", filter: "web" },
  { img: ITSImages.portfolio2, title: "Fitness Tracking App", cat: "Mobile Apps", filter: "mobile" },
  { img: ITSImages.portfolio3, title: "Banking Dashboard", cat: "UI/UX Design", filter: "design" },
  { img: ITSImages.portfolio4, title: "Tech Startup Brand", cat: "Branding", filter: "branding" },
  { img: ITSImages.portfolio5, title: "Restaurant Website", cat: "Web Development", filter: "web" },
  { img: ITSImages.portfolio6, title: "Travel Planning App", cat: "Mobile Apps", filter: "mobile" },
];

const FILTERS = [
  { label: "All Projects", value: "all" },
  { label: "Web Development", value: "web" },
  { label: "Mobile Apps", value: "mobile" },
  { label: "UI/UX Design", value: "design" },
  { label: "Branding", value: "branding" },
];

const COMPANIES = [
  ITSImages.company1, ITSImages.company2, ITSImages.company3,
  ITSImages.company4, ITSImages.company5, ITSImages.company6,
];

const TESTIMONIALS = [
  { img: ITSImages.testimonial1, name: "Adrien Jacob", role: "CEO", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime tempora ipsum dicta nesciunt, perspiciatis placeat molestias nemo vitae nulla tempore." },
  { img: ITSImages.testimonial2, name: "Diana Taylor", role: "Graphic Designer", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime tempora ipsum dicta nesciunt, perspiciatis placeat molestias nemo vitae nulla tempore." },
  { img: ITSImages.testimonial3, name: "Sarah Johnson", role: "Businesswoman", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime tempora ipsum dicta nesciunt, perspiciatis placeat molestias nemo vitae nulla tempore." },
  { img: ITSImages.testimonial4, name: "Michael Brown", role: "Marketing Director", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime tempora ipsum dicta nesciunt, perspiciatis placeat molestias nemo vitae nulla tempore." },
];

const TEAM = [
  { name: "Alex Johnson", role: "CEO & Founder", bio: "Visionary leader with 15+ years in tech innovation.", img: ITSImages.testimonial1 },
  { name: "Maria Garcia", role: "CTO", bio: "Expert in cloud architecture and scalable systems.", img: ITSImages.testimonial2 },
  { name: "James Wilson", role: "Lead Developer", bio: "Full-stack developer passionate about clean code.", img: ITSImages.testimonial3 },
  { name: "Sarah Chen", role: "UX Director", bio: "Design thinking advocate with award-winning portfolio.", img: ITSImages.testimonial4 },
];

const BLOG_POSTS = [
  { img: ITSImages.portfolio1, date: "July 15, 2025", cat: "Technology", title: "The Future of Web Development: Trends to Watch in 2025", desc: "Discover the latest trends shaping the web development landscape, from AI-powered tools to progressive web applications.", author: "James Wilson" },
  { img: ITSImages.portfolio2, date: "July 10, 2025", cat: "Security", title: "Mobile App Security: Best Practices for Developers", desc: "Learn essential security measures every mobile developer should implement to protect user data.", author: "Emma Rodriguez" },
  { img: ITSImages.portfolio3, date: "July 5, 2025", cat: "Cloud", title: "Cloud Migration Strategies for Modern Businesses", desc: "A comprehensive guide to successfully migrating your business infrastructure to the cloud.", author: "James Wilson" },
];

const PRICING_PLANS = [
  { name: "Basic", price: "$37", discount: "$50", desc: "Perfect for small businesses and startups", popular: false, features: ["Up to 5 Pages Website", "Mobile Responsive Design", "Basic SEO Optimization", "Contact Form Integration", "1 Month Free Support", "SSL Certificate"], unavailable: ["E-commerce Functionality", "Advanced Analytics", "Priority Support"] },
  { name: "Pro", price: "$57", discount: "$70", desc: "Ideal for growing businesses", popular: true, features: ["Up to 5 Pages Website", "Mobile Responsive Design", "Basic SEO Optimization", "Contact Form Integration", "1 Month Free Support", "SSL Certificate", "E-commerce Functionality", "Advanced Analytics"], unavailable: ["Priority Support"] },
  { name: "Enterprise", price: "$77", discount: "$100", desc: "For large-scale businesses", popular: false, features: ["Up to 5 Pages Website", "Mobile Responsive Design", "Basic SEO Optimization", "Contact Form Integration", "1 Month Free Support", "SSL Certificate", "E-commerce Functionality", "Advanced Analytics", "Priority Support"], unavailable: [] },
];

const FAQ_DATA = [
  { q: "What services does your IT agency offer?", a: "We offer a comprehensive range of IT services including web development, mobile app development, cloud solutions, digital marketing, UX/UI design, and data analytics." },
  { q: "How long does a typical web development project take?", a: "Project timelines vary based on complexity. A standard website takes 4-8 weeks, while more complex web applications can take 3-6 months." },
  { q: "Do you provide ongoing support after project completion?", a: "Yes, we offer comprehensive maintenance and support packages to ensure your solution continues to perform optimally." },
  { q: "What technologies do you use?", a: "We work with modern technologies including React, Next.js, Node.js, Python, AWS, Azure, and many more tailored to each project's needs." },
  { q: "Can you work with our existing team?", a: "Absolutely. We frequently collaborate with in-house teams, providing expertise and support where needed." },
  { q: "How do you ensure project quality?", a: "We follow rigorous QA processes including automated testing, code reviews, performance optimization, and continuous integration." },
];

const BLOG_DETAIL = {
  title: "The Future of Web Development: Trends to Watch in 2025",
  date: "July 15, 2025",
  author: "James Wilson",
  cat: "Technology",
  img: ITSImages.portfolio1,
  content: "The landscape of web development continues to evolve at a rapid pace. As we move through 2025, several key trends are shaping the way developers build and deploy web applications.\n\nArtificial Intelligence Integration\n\nAI is no longer a futuristic concept - it's here and transforming web development. From AI-powered code assistants to intelligent user experiences, machine learning is becoming an integral part of the development process.\n\nProgressive Web Applications\n\nPWAs continue to bridge the gap between web and native applications, offering offline capabilities, push notifications, and app-like experiences directly from the browser.\n\nWebAssembly and Performance\n\nWebAssembly is revolutionizing web performance, allowing developers to run high-performance code written in languages like Rust, C++, and Go directly in the browser.\n\nServerless Architecture\n\nServerless computing is changing how we think about infrastructure, allowing developers to focus on code while cloud providers handle scaling and maintenance.\n\nEdge Computing\n\nEdge computing brings computation closer to users, reducing latency and improving performance for global applications.\n\nThe future of web development is bright, with new technologies making it possible to build faster, more powerful, and more engaging web experiences than ever before.",
};

const PROCESS_STEPS = [
  { num: "1", label: "WE INVESTIGATE AND PLAN", desc: "We analyze your requirements and create a comprehensive strategy tailored to your business goals." },
  { num: "2", label: "WE CO-CREATE AND DEVELOP", desc: "Working together, we build innovative solutions using cutting-edge technology and best practices." },
  { num: "3", label: "WE ACCOMPANY AND GUARANTEE", desc: "We provide ongoing support and maintenance to ensure your solution performs optimally over time." },
  { num: "4", label: "WE DELIVER AND LAUNCH", desc: "We deploy your solution with thorough testing and seamless implementation." },
];

export default function ITSolutionTemplate(props: ITSolutionProps) {
  const { store, banners, settings, products, slug } = props;
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [typedText, setTypedText] = useState("");
  const [loaderDone, setLoaderDone] = useState(false);
  const [countersVisible, setCountersVisible] = useState(false);
  const countersRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const tmr = setTimeout(() => setLoaderDone(true), 1800);
    return () => clearTimeout(tmr);
  }, []);

  useEffect(() => {
    const words = ["Innovation", "Technology", "Excellence", "The Future"];
    let wordIdx = 0;
    let charIdx = 0;
    let dir = 1;
    const speed = 100;
    const pause = 2000;
    let paused = false;
    const tmr = setInterval(() => {
      if (paused) return;
      const word = words[wordIdx];
      setTypedText(word.slice(0, charIdx + dir));
      charIdx += dir;
      if (charIdx === word.length + 1) { paused = true; dir = -1; setTimeout(() => { paused = false; }, pause); }
      if (charIdx < 0) { charIdx = 0; dir = 1; wordIdx = (wordIdx + 1) % words.length; }
    }, speed);
    return () => clearInterval(tmr);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCountersVisible(true);
      },
      { threshold: 0.3 }
    );
    if (countersRef.current) obs.observe(countersRef.current);
    return () => obs.disconnect();
  }, []);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVisible, setScrollVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      setScrollVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".its-nav-item")) setOpenDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root{--its-primary:#6c63ff;--its-primary-dark:#5a52d5;--its-primary-light:#8b85ff;--its-accent:#ff6b35;--its-dark:#0a0a1a;--its-dark-2:#12122a;--its-dark-3:#1a1a3e;--its-light:#ffffff;--its-light-2:#f0f0ff;--its-light-3:#e0e0f0;--its-text:#c0c0e0;--its-text-dark:#333355;--its-border:rgba(108,99,255,0.2);--its-shadow:rgba(108,99,255,0.3);--its-gradient:linear-gradient(135deg,#6c63ff,#ff6b35);--its-gradient-2:linear-gradient(135deg,#6c63ff,#8b85ff)}
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--its-dark);color:var(--its-text);overflow-x:hidden;line-height:1.6}
      .its-root{min-height:100vh}
      .its-container{max-width:1200px;margin:0 auto;padding:0 20px}
      .its-main{background:var(--its-dark-2);padding:80px 0}
      .its-root.light{--its-dark:#ffffff;--its-dark-2:#f5f5ff;--its-dark-3:#e8e8f5;--its-text:#444466;--its-text-dark:#222244;--its-border:rgba(108,99,255,0.15);background:#fff}
      .its-root.light .its-main{background:#f5f5ff}
      .its-root.light .its-service-card,.its-root.light .its-pricing-card,.its-root.light .its-testimonial-card,.its-root.light .its-blog-card,.its-root.light .its-contact-card,.its-root.light .its-process-card{background:#fff;box-shadow:0 5px 30px rgba(0,0,0,0.06)}
      .its-root.light .its-counting,.its-root.light .its-companies,.its-root.light .its-testimonials-section{background:var(--its-dark-3)}
      .its-root.light .its-header{background:rgba(255,255,255,0.95)}
      .its-root.light .its-nav-link{color:var(--its-text-dark)}
      .its-root.light .its-footer{background:#1a1a3e}
      .its-root.light .its-page-section,.its-root.light .its-blog-content{background:#fff}
      .its-loader{position:fixed;inset:0;background:var(--its-dark);display:flex;align-items:center;justify-content:center;z-index:99999;transition:opacity 0.5s,visibility 0.5s}
      .its-loader.hidden{opacity:0;visibility:hidden}
      .its-loader-inner{text-align:center}
      .its-loader-spinner{width:80px;height:80px;margin:0 auto 30px;position:relative}
      .its-loader-spinner div{position:absolute;width:100%;height:100%;border:4px solid transparent;border-top-color:var(--its-primary);border-radius:50%;animation:itsSpin 1.2s cubic-bezier(0.5,0,0.5,1) infinite}
      .its-loader-spinner div:nth-child(1){animation-delay:-0.45s}
      .its-loader-spinner div:nth-child(2){animation-delay:-0.3s;border-top-color:var(--its-accent)}
      .its-loader-spinner div:nth-child(3){animation-delay:-0.15s;border-top-color:var(--its-primary-light)}
      @keyframes itsSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
      .its-loader-bar{width:280px;height:4px;background:rgba(255,255,255,0.1);border-radius:4px;margin:0 auto;overflow:hidden}
      .its-loader-fill{height:100%;width:0%;background:var(--its-gradient);border-radius:4px;animation:itsLoad 1.8s ease-in-out forwards}
      @keyframes itsLoad{0%{width:0%}30%{width:35%}60%{width:70%}100%{width:100%}}
      .its-scroll-progress{position:fixed;top:0;left:0;height:3px;background:var(--its-gradient);z-index:9998;transition:width 0.1s}
      .its-scroll-top{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:var(--its-gradient);border:none;border-radius:50%;color:#fff;font-size:20px;z-index:9997;opacity:0;visibility:hidden;transform:translateY(30px);transition:0.3s;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 20px var(--its-shadow)}
      .its-scroll-top.visible{opacity:1;visibility:visible;transform:translateY(0)}
      .its-scroll-top:hover{transform:translateY(-5px);box-shadow:0 10px 30px var(--its-shadow)}
      .its-header{position:fixed;top:0;left:0;width:100%;z-index:9999;background:rgba(10,10,26,0.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--its-border);transition:0.3s}
      .its-header-inner{display:flex;align-items:center;justify-content:space-between;padding:15px 0;max-width:1200px;margin:0 auto;padding-left:20px;padding-right:20px}
      .its-logo{display:flex;align-items:center;gap:10px;cursor:pointer}
      .its-logo img{height:40px}
      .its-nav{display:flex;align-items:center;gap:5px}
      .its-nav-item{position:relative}
      .its-nav-link{color:var(--its-text);text-decoration:none;padding:10px 16px;font-size:0.9rem;font-weight:500;cursor:pointer;transition:0.3s;border-radius:8px;white-space:nowrap}
      .its-nav-link:hover,.its-nav-link.active{color:var(--its-primary-light);background:rgba(108,99,255,0.1)}
      .its-nav-link.dropdown-toggle{display:flex;align-items:center;gap:4px}
      .its-nav-link.dropdown-toggle::after{content:"";display:inline-block;width:6px;height:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);transition:0.3s;margin-top:-3px}
      .its-nav-link.dropdown-toggle.open::after{transform:rotate(-135deg);margin-top:3px}
      .its-dropdown{position:absolute;top:100%;left:0;min-width:200px;background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:12px;padding:8px;opacity:0;visibility:hidden;transform:translateY(10px);transition:0.3s;z-index:999;box-shadow:0 10px 40px rgba(0,0,0,0.3)}
      .its-dropdown.open{opacity:1;visibility:visible;transform:translateY(5px)}
      .its-dropdown a{display:block;padding:10px 16px;color:var(--its-text);text-decoration:none;font-size:0.85rem;border-radius:8px;cursor:pointer;transition:0.3s}
      .its-dropdown a:hover{background:rgba(108,99,255,0.15);color:var(--its-primary-light);padding-left:20px}
      .its-header-actions{display:flex;align-items:center;gap:12px}
      .its-theme-btn{width:40px;height:40px;border-radius:50%;border:1px solid var(--its-border);background:transparent;color:var(--its-text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.3s;font-size:18px}
      .its-theme-btn:hover{background:rgba(108,99,255,0.1);color:var(--its-primary-light)}
      .its-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:5px}
      .its-hamburger span{width:24px;height:2px;background:var(--its-text);border-radius:2px;transition:0.3s}
      .its-hamburger.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
      .its-hamburger.active span:nth-child(2){opacity:0}
      .its-hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
      .its-btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 32px;border-radius:50px;font-size:0.95rem;font-weight:600;border:none;cursor:pointer;transition:0.3s;text-decoration:none;gap:8px;font-family:inherit}
      .its-btn-primary{background:var(--its-gradient);color:#fff;box-shadow:0 5px 20px var(--its-shadow)}
      .its-btn-primary:hover{transform:translateY(-3px);box-shadow:0 10px 30px var(--its-shadow)}
      .its-btn-outline{border:2px solid var(--its-primary);color:var(--its-primary-light);background:transparent}
      .its-btn-outline:hover{background:var(--its-primary);color:#fff;transform:translateY(-3px)}
      .its-btn-sm{padding:10px 24px;font-size:0.85rem}
      .its-hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;background:var(--its-dark);padding-top:80px}
      .its-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(108,99,255,0.15),transparent 60%),radial-gradient(ellipse at 30% 30%,rgba(255,107,53,0.1),transparent 50%);animation:itsBgPulse 6s ease-in-out infinite alternate}
      @keyframes itsBgPulse{0%{opacity:0.6}100%{opacity:1}}
      .its-hero-content{position:relative;z-index:2;width:100%;padding:60px 0}
      .its-hero-info{text-align:center;max-width:800px;margin:0 auto}
      .its-hero-title{font-size:3.5rem;font-weight:800;color:#fff;margin-bottom:20px;line-height:1.2;animation:itsFadeDown 1s}
      .its-hero-subtitle{font-size:2.5rem;font-weight:700;margin-bottom:20px;animation:itsFadeRight 1s 0.2s both}
      .its-typed-text{color:var(--its-accent);position:relative}
      .its-cursor{display:inline-block;animation:itsBlink 0.7s infinite;color:var(--its-accent)}
      @keyframes itsBlink{0%,50%{opacity:1}51%,100%{opacity:0}}
      .its-hero-desc{font-size:1.2rem;color:var(--its-text);max-width:600px;margin:0 auto 30px;animation:itsFadeUp 1s 0.4s both}
      .its-hero-social{display:flex;justify-content:center;gap:15px;margin-bottom:30px;animation:itsFadeIn 1s 0.6s both}
      .its-hero-cta{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;animation:itsFadeUp 1s 0.8s both}
      .its-social-link{width:40px;height:40px;border-radius:50%;border:1px solid var(--its-border);display:flex;align-items:center;justify-content:center;color:var(--its-text);transition:0.3s}
      .its-social-link:hover{background:var(--its-primary);color:#fff;transform:translateY(-3px);border-color:var(--its-primary)}
      .its-social-link svg{width:18px;height:18px}
      .its-social-row{display:flex;gap:10px}
      .its-section-title{text-align:center;font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:15px;position:relative}
      .its-section-title::after{content:"";display:block;width:60px;height:3px;background:var(--its-gradient);margin:15px auto 0;border-radius:3px}
      .its-section-desc{text-align:center;color:var(--its-text);max-width:600px;margin:0 auto 50px;font-size:1.05rem}
      .its-text-white{color:#fff!important}
      .its-accent{color:var(--its-accent);font-weight:600;font-size:0.9rem;text-transform:uppercase;letter-spacing:2px;display:block;margin-bottom:10px}
      .its-highlight{color:var(--its-accent)}
      .its-section-header{display:flex;align-items:baseline;justify-content:space-between;padding-bottom:40px;flex-wrap:wrap;gap:15px}
      .its-section-header h2{font-size:2rem;font-weight:700;color:#fff}
      .its-services-section{padding:0 0 80px}
      .its-services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:25px}
      .its-service-card{background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:16px;padding:30px;transition:0.4s;cursor:default;position:relative;overflow:hidden;animation:itsFadeUp 0.6s both}
      .its-service-card::before{content:"";position:absolute;top:0;left:0;width:100%;height:4px;background:var(--its-gradient);transform:scaleX(0);transition:0.4s;transform-origin:left}
      .its-service-card:hover{transform:translateY(-8px);border-color:var(--its-primary);box-shadow:0 10px 40px var(--its-shadow)}
      .its-service-card:hover::before{transform:scaleX(1)}
      .its-service-icon{width:60px;height:60px;background:rgba(108,99,255,0.12);border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;color:var(--its-primary-light);transition:0.4s}
      .its-service-icon svg{width:28px;height:28px}
      .its-service-card:hover .its-service-icon{background:var(--its-gradient);color:#fff;transform:scale(1.1) rotate(5deg)}
      .its-service-card h3{font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:12px}
      .its-service-card p{color:var(--its-text);font-size:0.93rem;line-height:1.7}
      .its-about-section{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;padding:40px 0}
      .its-about-info h2{font-size:2rem;font-weight:700;color:#fff;margin-bottom:20px;line-height:1.3}
      .its-about-info p{color:var(--its-text);margin-bottom:15px;line-height:1.8}
      .its-progress-bars{display:flex;flex-direction:column;gap:20px;margin-top:30px}
      .its-progress-item{width:100%}
      .its-progress-label{display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9rem;font-weight:500;color:var(--its-text)}
      .its-progress-track{height:8px;background:rgba(255,255,255,0.08);border-radius:10px;overflow:hidden}
      .its-progress-fill{height:100%;background:var(--its-gradient);border-radius:10px;transition:width 1.5s ease-in-out}
      .its-about-image{border-radius:20px;overflow:hidden;position:relative}
      .its-about-image img{width:100%;height:auto;display:block;border-radius:20px;transition:0.5s}
      .its-about-image:hover img{transform:scale(1.05)}
      .its-counting{padding:80px 0;background:var(--its-dark-3)}
      .its-counting-content{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
      .its-counting-info h2{font-size:2.2rem;font-weight:700;color:#fff;margin-bottom:20px}
      .its-counting-info p{color:var(--its-text);margin-bottom:30px;line-height:1.8}
      .its-counting-boxes{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
      .its-count-item{text-align:center;padding:30px 20px;background:var(--its-dark-2);border-radius:16px;border:1px solid var(--its-border);transition:0.3s}
      .its-count-item:hover{transform:translateY(-5px);border-color:var(--its-primary)}
      .its-count-item svg{width:40px;height:40px;color:var(--its-primary-light);margin-bottom:15px}
      .its-count-num{display:block;font-size:2rem;font-weight:800;color:#fff;margin-bottom:5px}
      .its-count-label{font-size:0.85rem;color:var(--its-text)}
      .its-process-section{padding:40px 0 80px}
      .its-process-grid{display:grid;grid-template-columns:1fr 1fr 160px 1fr 1fr;grid-template-rows:auto auto;gap:20px;align-items:center;margin-top:40px}
      .its-process-center{grid-column:3;grid-row:1/3;position:relative;z-index:2}
      .its-process-center img{width:100%;border-radius:50%;border:4px solid var(--its-primary);box-shadow:0 0 30px var(--its-shadow);animation:itsFloat 6s ease-in-out infinite}
      .its-process-up{grid-column:1/3;grid-row:1}
      .its-process-right{grid-column:4/6;grid-row:1}
      .its-process-down{grid-column:4/6;grid-row:2}
      .its-process-left{grid-column:1/3;grid-row:2}
      @keyframes itsFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
      .its-process-card{background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:16px;padding:25px;transition:0.4s}
      .its-process-card:hover{transform:translateY(-5px);border-color:var(--its-primary);box-shadow:0 10px 30px var(--its-shadow)}
      .its-process-card svg{width:36px;height:36px;color:var(--its-primary-light);margin-bottom:12px}
      .its-process-label{display:block;font-size:0.85rem;font-weight:700;color:var(--its-accent);letter-spacing:1px;margin-bottom:8px}
      .its-process-card p{color:var(--its-text);font-size:0.9rem;line-height:1.7}
      .its-portfolio-section{padding:40px 0 0}
      .its-portfolio-filters{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:40px}
      .its-filter-btn{padding:10px 22px;border-radius:50px;border:1px solid var(--its-border);background:transparent;color:var(--its-text);cursor:pointer;font-size:0.85rem;font-weight:500;transition:0.3s;font-family:inherit}
      .its-filter-btn:hover{border-color:var(--its-primary);color:var(--its-primary-light)}
      .its-filter-btn.active{background:var(--its-gradient);color:#fff;border-color:transparent;box-shadow:0 5px 15px var(--its-shadow)}
      .its-portfolio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:25px}
      .its-portfolio-item{border-radius:16px;overflow:hidden}
      .its-portfolio-card{position:relative;border-radius:16px;overflow:hidden;cursor:pointer}
      .its-portfolio-card img{width:100%;height:280px;object-fit:cover;display:block;transition:0.5s}
      .its-portfolio-card:hover img{transform:scale(1.1)}
      .its-portfolio-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(108,99,255,0.9),transparent);display:flex;flex-direction:column;justify-content:flex-end;padding:25px;opacity:0;transition:0.4s}
      .its-portfolio-card:hover .its-portfolio-overlay{opacity:1}
      .its-portfolio-overlay h3{color:#fff;font-size:1.1rem;font-weight:700;margin-bottom:5px}
      .its-portfolio-overlay span{color:rgba(255,255,255,0.8);font-size:0.85rem}
      .its-companies{padding:80px 0;background:var(--its-dark-3);overflow:hidden}
      .its-companies h2{text-align:center;color:#fff;font-size:2rem;margin-bottom:50px;font-weight:700}
      .its-companies-track{overflow:hidden;position:relative}
      .its-companies-slide{display:flex;gap:60px;animation:itsMarquee 30s linear infinite;width:max-content}
      .its-company-logo{flex-shrink:0;height:60px;display:flex;align-items:center}
      .its-company-logo img{height:50px;opacity:0.5;transition:0.3s;filter:grayscale(1)}
      .its-company-logo img:hover{opacity:1;filter:grayscale(0)}
      @keyframes itsMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      .its-pricing-section{padding:40px 0}
      .its-pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:25px;margin-top:30px}
      .its-pricing-card{background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:20px;padding:35px 30px;text-align:center;transition:0.4s;position:relative}
      .its-pricing-card:hover{transform:translateY(-10px);border-color:var(--its-primary);box-shadow:0 15px 50px var(--its-shadow)}
      .its-pricing-card.popular{border-color:var(--its-primary);background:linear-gradient(180deg,rgba(108,99,255,0.08),transparent)}
      .its-popular-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--its-gradient);color:#fff;padding:6px 20px;border-radius:50px;font-size:0.8rem;font-weight:700;box-shadow:0 5px 15px var(--its-shadow)}
      .its-pricing-header h3{font-size:1.5rem;font-weight:700;color:#fff;margin-bottom:8px}
      .its-pricing-header p{color:var(--its-text);font-size:0.9rem;margin-bottom:20px}
      .its-pricing-price{margin:20px 0}
      .its-price-main{font-size:3rem;font-weight:800;color:#fff}
      .its-price-discount{font-size:1.2rem;color:var(--its-text);text-decoration:line-through;margin-left:10px;font-weight:400}
      .its-pricing-features{margin-top:25px;text-align:left}
      .its-pf-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--its-border);font-size:0.9rem;color:var(--its-text)}
      .its-pf-item svg{width:18px;height:18px;color:var(--its-primary-light);flex-shrink:0}
      .its-pf-item.unavailable{opacity:0.5}
      .its-pf-item.unavailable svg{color:var(--its-text)}
      .its-testimonials-section{padding:80px 0;background:var(--its-dark-3)}
      .its-testimonials-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:25px}
      .its-testimonial-card{background:var(--its-dark-2);border:1px solid var(--its-border);border-radius:16px;padding:30px;position:relative;transition:0.4s}
      .its-testimonial-card:hover{transform:translateY(-5px);border-color:var(--its-primary);box-shadow:0 10px 30px var(--its-shadow)}
      .its-quote-icon{position:absolute;top:20px;right:25px;width:30px;height:30px;color:rgba(108,99,255,0.2)}
      .its-testimonial-card p{color:var(--its-text);font-size:0.95rem;line-height:1.8;margin-bottom:20px;font-style:italic}
      .its-testimonial-user{display:flex;align-items:center;gap:12px}
      .its-testimonial-user img{width:50px;height:50px;border-radius:50%;object-fit:cover;border:2px solid var(--its-primary)}
      .its-testimonial-user strong{display:block;color:#fff;font-size:0.95rem}
      .its-testimonial-user span{color:var(--its-text);font-size:0.8rem}
      .its-testimonial-stars{display:flex;gap:2px;margin-top:10px}
      .its-star{width:16px;height:16px;color:#ffc107}
      .its-blog-section{padding:40px 0 80px}
      .its-blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:25px}
      .its-blog-card{background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:16px;overflow:hidden;cursor:pointer;transition:0.4s}
      .its-blog-card:hover{transform:translateY(-8px);border-color:var(--its-primary);box-shadow:0 10px 30px var(--its-shadow)}
      .its-blog-image{position:relative;overflow:hidden;height:200px}
      .its-blog-image img{width:100%;height:100%;object-fit:cover;transition:0.5s}
      .its-blog-card:hover .its-blog-image img{transform:scale(1.1)}
      .its-blog-cat{position:absolute;top:15px;left:15px;background:var(--its-gradient);color:#fff;padding:4px 14px;border-radius:50px;font-size:0.75rem;font-weight:600}
      .its-blog-content{padding:25px}
      .its-blog-meta{display:flex;gap:15px;margin-bottom:12px;font-size:0.8rem;color:var(--its-text)}
      .its-blog-meta svg{width:14px;height:14px;margin-right:5px;vertical-align:middle}
      .its-blog-content h3{font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:10px;line-height:1.4}
      .its-blog-content p{color:var(--its-text);font-size:0.88rem;line-height:1.7;margin-bottom:15px}
      .its-read-more{display:inline-flex;align-items:center;gap:8px;color:var(--its-primary-light);font-weight:600;font-size:0.85rem;cursor:pointer;transition:0.3s;text-decoration:none}
      .its-read-more svg{width:16px;height:16px;transition:0.3s}
      .its-read-more:hover{gap:12px;color:var(--its-primary)}
      .its-contact-section{padding:40px 0 0}
      .its-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px}
      .its-contact-card{background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:20px;padding:35px}
      .its-contact-card h3{font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:15px}
      .its-contact-card>p{color:var(--its-text);margin-bottom:25px;line-height:1.7}
      .its-contact-details{display:flex;flex-direction:column;gap:18px;margin-bottom:25px}
      .its-contact-item{display:flex;align-items:center;gap:15px}
      .its-contact-item svg{width:22px;height:22px;color:var(--its-primary-light);flex-shrink:0}
      .its-contact-item div span{display:block;font-size:0.8rem;color:var(--its-text)}
      .its-contact-item div strong{color:#fff;font-size:0.9rem;font-weight:600}
      .its-contact-social{margin-top:20px}
      .its-contact-social>span{display:block;font-size:0.85rem;color:var(--its-text);margin-bottom:12px;font-weight:600}
      .its-contact-form-wrap{background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:20px;padding:35px}
      .its-form{display:flex;flex-direction:column;gap:20px}
      .its-form-row{display:grid;grid-template-columns:1fr 1fr;gap:20px}
      .its-form-group{display:flex;flex-direction:column;gap:8px}
      .its-form-group label{font-size:0.85rem;font-weight:600;color:var(--its-text)}
      .its-form-group input,.its-form-group select,.its-form-group textarea{padding:12px 16px;border:1px solid var(--its-border);border-radius:10px;background:var(--its-dark-2);color:#fff;font-size:0.9rem;transition:0.3s;font-family:inherit}
      .its-form-group input:focus,.its-form-group select:focus,.its-form-group textarea:focus{outline:none;border-color:var(--its-primary);box-shadow:0 0 0 3px var(--its-shadow);background:var(--its-dark-3)}
      .its-form-group textarea{resize:vertical;min-height:120px}
      .its-checkbox{display:flex;align-items:center;gap:10px;font-size:0.85rem;color:var(--its-text);cursor:pointer}
      .its-checkbox input[type="checkbox"]{accent-color:var(--its-primary);width:16px;height:16px}
      .its-footer{background:var(--its-dark-3);padding:60px 0 0;border-top:1px solid var(--its-border)}
      .its-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1.5fr;gap:40px}
      .its-footer-col h4{color:#fff;font-size:1.1rem;font-weight:700;margin-bottom:20px;position:relative;padding-bottom:12px}
      .its-footer-col h4::after{content:"";position:absolute;bottom:0;left:0;width:35px;height:2px;background:var(--its-gradient);border-radius:2px}
      .its-footer-col p{color:var(--its-text);font-size:0.88rem;line-height:1.8;margin-bottom:20px}
      .its-footer-logo{display:flex;align-items:center;gap:10px;margin-bottom:15px}
      .its-footer-logo img{height:35px}
      .its-footer-links{list-style:none;padding:0}
      .its-footer-links li{margin-bottom:10px}
      .its-footer-links a{color:var(--its-text);text-decoration:none;font-size:0.88rem;transition:0.3s;cursor:pointer;display:block}
      .its-footer-links a:hover{color:var(--its-primary-light);padding-left:5px}
      .its-footer-contact-item{display:flex;align-items:flex-start;gap:12px;margin-bottom:15px;font-size:0.85rem;color:var(--its-text)}
      .its-footer-contact-item svg{width:16px;height:16px;color:var(--its-primary-light);margin-top:4px;flex-shrink:0}
      .its-footer-bottom{border-top:1px solid var(--its-border);padding:25px 0;margin-top:40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px}
      .its-footer-bottom p{color:var(--its-text);font-size:0.85rem}
      .its-footer-bottom a{color:var(--its-text);text-decoration:none;transition:0.3s;margin:0 8px;font-size:0.85rem}
      .its-footer-bottom a:hover{color:var(--its-primary-light)}
      .its-page-section{padding:40px 0;background:var(--its-dark-2);border-radius:20px;padding:50px}
      .its-page-title{font-size:2.5rem;font-weight:800;color:#fff;margin-bottom:10px;text-align:center}
      .its-page-subtitle{text-align:center;color:var(--its-text);font-size:1.05rem;max-width:700px;margin:0 auto}
      .its-page-content{margin-top:40px}
      .its-faq-list{max-width:800px;margin:40px auto 0;display:flex;flex-direction:column;gap:12px}
      .its-faq-item{background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:12px;overflow:hidden;transition:0.3s}
      .its-faq-item:hover{border-color:var(--its-primary)}
      .its-faq-question{display:flex;justify-content:space-between;align-items:center;padding:20px 25px;cursor:pointer;color:#fff;font-weight:600;font-size:1rem;transition:0.3s}
      .its-faq-question svg{width:20px;height:20px;transition:0.3s;color:var(--its-primary-light);flex-shrink:0}
      .its-faq-question.open svg{transform:rotate(180deg)}
      .its-faq-answer{padding:0 25px 20px;color:var(--its-text);font-size:0.9rem;line-height:1.8}
      .its-blog-detail{max-width:800px;margin:0 auto}
      .its-blog-detail-image{width:100%;max-height:500px;object-fit:cover;border-radius:20px;margin-bottom:30px}
      .its-blog-detail-meta{display:flex;gap:20px;margin-bottom:20px;color:var(--its-text);font-size:0.9rem}
      .its-blog-detail h1{font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:30px;line-height:1.3}
      .its-blog-detail-content p{color:var(--its-text);font-size:1.05rem;line-height:1.9;margin-bottom:20px}
      .its-team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:25px;margin-top:40px}
      .its-team-card{background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:16px;overflow:hidden;transition:0.4s;text-align:center}
      .its-team-card:hover{transform:translateY(-8px);border-color:var(--its-primary);box-shadow:0 10px 30px var(--its-shadow)}
      .its-team-img{width:100%;height:280px;object-fit:cover;transition:0.5s}
      .its-team-card:hover .its-team-img{transform:scale(1.05)}
      .its-team-info{padding:25px}
      .its-team-info h3{color:#fff;font-size:1.1rem;font-weight:700;margin-bottom:5px}
      .its-team-info span{color:var(--its-accent);font-size:0.85rem;font-weight:500}
      .its-team-info p{color:var(--its-text);font-size:0.85rem;margin-top:10px;line-height:1.6}
      .its-process-page-grid{display:flex;flex-direction:column;gap:30px;max-width:800px;margin:40px auto 0}
      .its-process-page-step{display:grid;grid-template-columns:80px 1fr;gap:25px;align-items:start;background:var(--its-dark-3);border:1px solid var(--its-border);border-radius:16px;padding:30px;transition:0.4s}
      .its-process-page-step:hover{border-color:var(--its-primary);transform:translateX(10px)}
      .its-process-page-num{width:60px;height:60px;border-radius:50%;background:var(--its-gradient);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.3rem;flex-shrink:0}
      .its-process-page-step h3{color:#fff;font-size:1.1rem;font-weight:700;margin-bottom:8px}
      .its-process-page-step p{color:var(--its-text);font-size:0.9rem;line-height:1.7}
      @keyframes itsFadeDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes itsFadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes itsFadeRight{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
      @keyframes itsFadeLeft{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
      @keyframes itsFadeIn{from{opacity:0}to{opacity:1}}
      @media(max-width:1024px){
        .its-services-grid,.its-portfolio-grid,.its-pricing-grid,.its-blog-grid{grid-template-columns:repeat(2,1fr)}
        .its-team-grid{grid-template-columns:repeat(2,1fr)}
        .its-process-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto}
        .its-process-center,.its-process-up,.its-process-right,.its-process-down,.its-process-left{grid-column:auto;grid-row:auto}
        .its-process-center{display:none}
        .its-footer-grid{grid-template-columns:1fr 1fr}
      }
      @media(max-width:768px){
        .its-hamburger{display:flex}
        .its-nav{position:fixed;top:70px;left:0;width:100%;background:var(--its-dark);border-bottom:1px solid var(--its-border);flex-direction:column;padding:15px;gap:0;display:none;z-index:999}
        .its-nav.open{display:flex}
        .its-nav-item{width:100%}
        .its-nav-link{padding:12px 16px;width:100%;border-radius:8px}
        .its-dropdown{position:static;opacity:1;visibility:visible;transform:none;box-shadow:none;border:none;padding-left:15px;display:none;background:transparent}
        .its-dropdown.open{display:block}
        .its-nav-link.dropdown-toggle::after{display:none}
        .its-hero-title{font-size:2.2rem}
        .its-hero-subtitle{font-size:1.6rem}
        .its-services-grid,.its-portfolio-grid,.its-pricing-grid,.its-blog-grid,.its-testimonials-grid,.its-team-grid{grid-template-columns:1fr}
        .its-about-section,.its-counting-content,.its-contact-grid{grid-template-columns:1fr}
        .its-process-grid{grid-template-columns:1fr}
        .its-form-row{grid-template-columns:1fr}
        .its-footer-grid{grid-template-columns:1fr}
        .its-hero-cta{flex-direction:column;align-items:center}
        .its-section-title{font-size:1.8rem}
        .its-page-section{padding:30px 20px}
        .its-counting-boxes{grid-template-columns:1fr}
        .its-footer-bottom{flex-direction:column;text-align:center}
        .its-portfolio-filters{gap:8px}
        .its-filter-btn{padding:8px 16px;font-size:0.8rem}
      }
      @media(max-width:480px){
        .its-hero-title{font-size:1.8rem}
        .its-hero-subtitle{font-size:1.3rem}
        .its-hero-desc{font-size:1rem}
      }
    `;
    document.head.appendChild(style);

    const scrollBtn = document.getElementById("its-scroll-top");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    return () => {
      style.remove();
    };
  }, []);

  const navLinks = [
    { label: "Home", page: "home", dropdown: null },
    { label: "About Us", page: "about", dropdown: null },
    { label: "Services", page: "services", dropdown: null },
    { label: "Portfolio", page: "portfolio", dropdown: null },
    { label: "Blog", page: "blog", dropdown: [
      { label: "Blog Column 1", page: "blog" },
      { label: "Blog Column 2", page: "blog" },
      { label: "Blog Detail", page: "blog-detail" },
    ]},
    { label: "Pages", page: "about", dropdown: [
      { label: "Process", page: "process" },
      { label: "Pricing", page: "pricing" },
      { label: "Team", page: "team" },
      { label: "FAQ", page: "faq" },
      { label: "Terms & Conditions", page: "terms" },
      { label: "Privacy Policy", page: "privacy" },
      { label: "Service Cards", page: "service-cards-grid" },
    ]},
    { label: "Contact Us", page: "contact", dropdown: null },
  ];

  const filteredPortfolio = activeFilter === "all" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((p) => p.filter === activeFilter);

  const navigate = (p: string) => {
    setPage(p);
    setMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStars = () => (
    <>
      <svg className="its-star" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      <svg className="its-star" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      <svg className="its-star" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      <svg className="its-star" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      <svg className="its-star" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
    </>
  );

  const socialIcons = (
    <>
      <a href="#" className="its-social-link" onClick={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="#" className="its-social-link" onClick={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <a href="#" className="its-social-link" onClick={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <a href="#" className="its-social-link" onClick={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      </a>
    </>
  );

  const renderHome = () => (
    <>
      <section className="its-hero">
        <div className="its-hero-bg"></div>
        <div className="its-container its-hero-content">
          <div className="its-hero-info">
            <h1 className="its-hero-title">Technology Solutions Excellence</h1>
            <h2 className="its-hero-subtitle">
              In <span className="its-typed-text">{typedText}<span className="its-cursor">|</span></span>
            </h2>
            <p className="its-hero-desc">Helping you grow through strategy, creativity and technology.</p>
            <div className="its-hero-social">{socialIcons}</div>
            <div className="its-hero-cta">
              <a className="its-btn its-btn-primary" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Get Quotes</a>
              <a className="its-btn its-btn-outline" onClick={(e) => { e.preventDefault(); navigate("about"); }}>Get Started</a>
            </div>
          </div>
        </div>
      </section>

      <div className="its-main">
        <div className="its-container">
          <section className="its-services-section">
            <div className="its-section-header">
              <h2>Our Services</h2>
              <a className="its-btn its-btn-primary its-btn-sm" onClick={(e) => { e.preventDefault(); navigate("services"); }}>See Services</a>
            </div>
            <div className="its-services-grid">
              {SERVICES.map((s, i) => (
                <div key={i} className="its-service-card" style={{ animationDelay: i * 100 + "ms" }}>
                  <div className="its-service-icon">
                    {s.icon === "monitor" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
                    {s.icon === "phone" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>}
                    {s.icon === "cloud" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z"/></svg>}
                    {s.icon === "marketing" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
                    {s.icon === "design" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>}
                    {s.icon === "data" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="its-about-section">
            <div className="its-about-info">
              <span className="its-accent">About Our Company</span>
              <h2>We&apos;re Passionate About Delivering Quality That Elevates Your Business.</h2>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione illum ut, obcaecati voluptate incidunt vero esse repellendus voluptates eveniet dolores.</p>
              <div className="its-progress-bars">
                <div className="its-progress-item">
                  <div className="its-progress-label"><span>IT Consulting</span><span>90%</span></div>
                  <div className="its-progress-track"><div className="its-progress-fill" style={{ width: countersVisible ? "90%" : "0%" }}></div></div>
                </div>
                <div className="its-progress-item">
                  <div className="its-progress-label"><span>Web Development</span><span>75%</span></div>
                  <div className="its-progress-track"><div className="its-progress-fill" style={{ width: countersVisible ? "75%" : "0%" }}></div></div>
                </div>
                <div className="its-progress-item">
                  <div className="its-progress-label"><span>UX Design</span><span>70%</span></div>
                  <div className="its-progress-track"><div className="its-progress-fill" style={{ width: countersVisible ? "70%" : "0%" }}></div></div>
                </div>
              </div>
            </div>
            <div className="its-about-image">
              <img src={ITSImages.computerCode} alt="About" />
            </div>
          </section>
        </div>
      </div>

      <section className="its-counting" ref={countersRef}>
        <div className="its-container its-counting-content">
          <div className="its-counting-info">
            <h2>Have <span className="its-highlight">25 Years</span> of Experiences</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod veniam temporibus eaque, a neque nulla.</p>
            <a className="its-btn its-btn-outline" onClick={(e) => { e.preventDefault(); navigate("about"); }}>Get Started</a>
          </div>
          <div className="its-counting-boxes">
            <div className="its-count-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              <span className="its-count-num">{countersVisible ? "3,785+" : "0"}</span>
              <span className="its-count-label">Successful Projects</span>
            </div>
            <div className="its-count-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-3H8M8 8h.01M4 8h.01M12 12h.01M4 12h.01M12 16h.01M4 16h.01"/></svg>
              <span className="its-count-num">{countersVisible ? "9,800+" : "0"}</span>
              <span className="its-count-label">Satisfied Clients</span>
            </div>
            <div className="its-count-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              <span className="its-count-num">{countersVisible ? "1,052+" : "0"}</span>
              <span className="its-count-label">Support Tickets Resolved</span>
            </div>
          </div>
        </div>
      </section>

      <div className="its-main">
        <div className="its-container">
          <section className="its-process-section">
            <h2 className="its-section-title">Our Processes</h2>
            <div className="its-process-grid">
              <div className="its-process-step its-process-up">
                <div className="its-process-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  <span className="its-process-label">1. WE INVESTIGATE AND PLAN</span>
                  <p>We analyze your requirements and create a comprehensive strategy tailored to your business goals.</p>
                </div>
              </div>
              <div className="its-process-step its-process-right">
                <div className="its-process-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <span className="its-process-label">2. WE CO-CREATE AND DEVELOP</span>
                  <p>Working together, we build innovative solutions using cutting-edge technology and best practices.</p>
                </div>
              </div>
              <div className="its-process-center">
                <img src={ITSImages.process} alt="Process" />
              </div>
              <div className="its-process-step its-process-down">
                <div className="its-process-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  <span className="its-process-label">3. WE ACCOMPANY AND GUARANTEE</span>
                  <p>We provide ongoing support and maintenance to ensure your solution performs optimally over time.</p>
                </div>
              </div>
              <div className="its-process-step its-process-left">
                <div className="its-process-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-3H8M8 8h.01M4 8h.01M12 12h.01M4 12h.01M12 16h.01M4 16h.01"/></svg>
                  <span className="its-process-label">4. WE DELIVER AND LAUNCH</span>
                  <p>We deploy your solution with thorough testing and seamless implementation.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="its-portfolio-section">
            <h2 className="its-section-title">Our Portfolio</h2>
            <div className="its-portfolio-filters">
              {FILTERS.map((f) => (
                <button key={f.value} className={"its-filter-btn" + (activeFilter === f.value ? " active" : "")} onClick={() => setActiveFilter(f.value)}>{f.label}</button>
              ))}
            </div>
            <div className="its-portfolio-grid">
              {filteredPortfolio.map((item, i) => (
                <div key={i} className="its-portfolio-item">
                  <div className="its-portfolio-card">
                    <img src={item.img} alt={item.title} />
                    <div className="its-portfolio-overlay">
                      <h3>{item.title}</h3>
                      <span>{item.cat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="its-companies">
        <div className="its-container">
          <h2>Building Success With Great Companies</h2>
          <div className="its-companies-track">
            <div className="its-companies-slide">
              {COMPANIES.map((c, i) => (
                <div key={i} className="its-company-logo"><img src={c} alt={"Company " + (i + 1)} /></div>
              ))}
              {COMPANIES.map((c, i) => (
                <div key={"dup-" + i} className="its-company-logo"><img src={c} alt={"Company " + (i + 1)} /></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="its-main">
        <div className="its-container">
          <section className="its-pricing-section">
            <h2 className="its-section-title">Pricing Plans</h2>
            <p className="its-section-desc">Clear, simple, and flexible plans for your business.</p>
            <div className="its-pricing-grid">
              {PRICING_PLANS.map((plan, i) => (
                <div key={i} className={"its-pricing-card" + (plan.popular ? " popular" : "")}>
                  {plan.popular && <div className="its-popular-badge">Most Popular</div>}
                  <div className="its-pricing-header">
                    <h3>{plan.name}</h3>
                    <p>{plan.desc}</p>
                  </div>
                  <div className="its-pricing-price">
                    <span className="its-price-main">{plan.price} <span className="its-price-discount">{plan.discount}</span></span>
                  </div>
                  <a className="its-btn its-btn-primary" onClick={(e) => { e.preventDefault(); navigate("pricing"); }}>Buy {plan.name} Plan</a>
                  <div className="its-pricing-features">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="its-pf-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                        <span>{f}</span>
                      </div>
                    ))}
                    {plan.unavailable.map((f, fi) => (
                      <div key={"un-" + fi} className="its-pf-item unavailable">
                        <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/></svg>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <section className="its-testimonials-section">
        <div className="its-container">
          <h2 className="its-section-title its-text-white">Testimonials</h2>
          <p className="its-section-desc its-text-white">Trusted feedback from companies and partners who believe in our quality.</p>
          <div className="its-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="its-testimonial-card">
                <svg className="its-quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/></svg>
                <p>{t.text}</p>
                <div className="its-testimonial-user">
                  <img src={t.img} alt={t.name} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
                <div className="its-testimonial-stars">{renderStars()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="its-main">
        <div className="its-container">
          <section className="its-blog-section">
            <div className="its-section-header">
              <h2>Latest Blog Posts</h2>
              <a className="its-btn its-btn-primary its-btn-sm" onClick={(e) => { e.preventDefault(); navigate("blog"); }}>View All Posts</a>
            </div>
            <div className="its-blog-grid">
              {BLOG_POSTS.map((post, i) => (
                <article key={i} className="its-blog-card" onClick={() => navigate("blog-detail")}>
                  <div className="its-blog-image">
                    <img src={post.img} alt={post.title} />
                    <span className="its-blog-cat">{post.cat}</span>
                  </div>
                  <div className="its-blog-content">
                    <div className="its-blog-meta">
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{post.date}</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>{post.author}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.desc}</p>
                    <a className="its-read-more" onClick={(e) => { e.preventDefault(); navigate("blog-detail"); }}>Read More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="its-contact-section">
            <h2 className="its-section-title">Contact Us</h2>
            <div className="its-contact-grid">
              <div className="its-contact-info">
                <div className="its-contact-card">
                  <h3>Let&apos;s Start a Conversation</h3>
                  <p>Let&apos;s build the future of your business together. Contact our experts and start your digital journey today.</p>
                  <div className="its-contact-details">
                    <div className="its-contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                      <div><span>Phone</span><strong>+1 (800) 987-6543</strong></div>
                    </div>
                    <div className="its-contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <div><span>Email</span><strong>hello@itagency.com</strong></div>
                    </div>
                    <div className="its-contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <div><span>Address</span><strong>789 Innovation Avenue, Future Town</strong></div>
                    </div>
                    <div className="its-contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <div><span>Business Hours</span><strong>Mon - Fri: 9:00 AM - 6:00 PM</strong></div>
                    </div>
                  </div>
                  <div className="its-contact-social">
                    <span>Follow Us</span>
                    <div className="its-social-row">{socialIcons}</div>
                  </div>
                </div>
              </div>
              <div className="its-contact-form-wrap">
                <form className="its-form" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent successfully."); }}>
                  <div className="its-form-row">
                    <div className="its-form-group">
                      <label>Full Name *</label>
                      <input type="text" required />
                    </div>
                    <div className="its-form-group">
                      <label>Email Address *</label>
                      <input type="email" required />
                    </div>
                  </div>
                  <div className="its-form-row">
                    <div className="its-form-group">
                      <label>Phone Number</label>
                      <input type="tel" />
                    </div>
                    <div className="its-form-group">
                      <label>Company</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="its-form-group">
                    <label>Service Interested In</label>
                    <select>
                      <option value="">Select a service</option>
                      <option>Web Development</option>
                      <option>Mobile App Development</option>
                      <option>Cloud Solutions</option>
                      <option>Digital Marketing</option>
                      <option>UI/UX Design</option>
                      <option>Data Analytics</option>
                    </select>
                  </div>
                  <div className="its-form-group">
                    <label>Project Budget</label>
                    <select>
                      <option value="">Select budget range</option>
                      <option>Under ,000</option>
                      <option>,000 - ,000</option>
                      <option>,000 - ,000</option>
                      <option>,000 - ,000</option>
                      <option>Over ,000</option>
                    </select>
                  </div>
                  <div className="its-form-group">
                    <label>Project Details *</label>
                    <textarea rows={5} placeholder="Tell us about your project requirements..." required></textarea>
                  </div>
                  <label className="its-checkbox">
                    <input type="checkbox" /> <span>I agree to the Privacy Policy and Terms of Service *</span>
                  </label>
                  <button type="submit" className="its-btn its-btn-primary">Send Message</button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="its-footer">
        <div className="its-container">
          <div className="its-footer-grid">
            <div className="its-footer-col">
              <div className="its-footer-logo">
                <img src={ITSImages.logo} alt="Logo" />
              </div>
              <p>Empowering businesses with smart, innovative tech solutions. We craft high-impact web development, mobile apps, and digital services that fuel your growth and success.</p>
              <div className="its-social-row">{socialIcons}</div>
            </div>
            <div className="its-footer-col">
              <h4>Navigation</h4>
              <ul className="its-footer-links">
                <li><a onClick={() => navigate("home")}>Home</a></li>
                <li><a onClick={() => navigate("about")}>About Us</a></li>
                <li><a onClick={() => navigate("services")}>Services</a></li>
                <li><a onClick={() => navigate("portfolio")}>Portfolio</a></li>
                <li><a onClick={() => navigate("pricing")}>Pricing</a></li>
                <li><a onClick={() => navigate("blog")}>Blog</a></li>
                <li><a onClick={() => navigate("contact")}>Contact</a></li>
                <li><a onClick={() => navigate("terms")}>Terms of Service</a></li>
                <li><a onClick={() => navigate("privacy")}>Privacy Policy</a></li>
              </ul>
            </div>
            <div className="its-footer-col">
              <h4>Our Services</h4>
              <ul className="its-footer-links">
                {SERVICES.map((s, i) => (
                  <li key={i}><a onClick={() => navigate("services")}>{s.title}</a></li>
                ))}
                <li><a onClick={() => navigate("services")}>Cybersecurity</a></li>
                <li><a onClick={() => navigate("services")}>IT Consulting</a></li>
              </ul>
            </div>
            <div className="its-footer-col">
              <h4>Quick Links</h4>
              <ul className="its-footer-links">
                <li><a onClick={() => navigate("process")}>Our Process</a></li>
                <li><a onClick={() => navigate("team")}>Our Team</a></li>
                <li><a onClick={() => navigate("faq")}>FAQs</a></li>
                <li><a onClick={() => navigate("service-cards-grid")}>Service Cards</a></li>
                <li><a onClick={() => navigate("pricing")}>Pricing</a></li>
                <li><a onClick={() => navigate("portfolio")}>Portfolio</a></li>
              </ul>
            </div>
            <div className="its-footer-col">
              <h4>Contact Info</h4>
              <div className="its-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>789 Innovation Avenue, Future Town, FT 67890</span>
              </div>
              <div className="its-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <span>+1 (800) 987-6543</span>
              </div>
              <div className="its-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>hello@itagency.com</span>
              </div>
              <div className="its-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
          <div className="its-footer-bottom">
            <p>&copy; 2025 ITSolution. All rights reserved.</p>
            <div>
              <a onClick={() => navigate("privacy")}>Privacy Policy</a>
              <span> | </span>
              <a onClick={() => navigate("terms")}>Terms of Service</a>
              <span> | </span>
              <a onClick={() => navigate("faq")}>FAQs</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
  const renderAbout = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">About Us</h1>
          <div className="its-page-content">
            <div className="its-about-section" style={{ margin: 0 }}>
              <div className="its-about-info">
                <span className="its-accent">About Our Company</span>
                <h2>We&apos;re Passionate About Delivering Quality That Elevates Your Business.</h2>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione illum ut, obcaecati voluptate incidunt vero esse repellendus voluptates eveniet dolores. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, doloremque? Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="its-progress-bars">
                  <div className="its-progress-item">
                    <div className="its-progress-label"><span>IT Consulting</span><span>90%</span></div>
                    <div className="its-progress-track"><div className="its-progress-fill" style={{ width: "90%" }}></div></div>
                  </div>
                  <div className="its-progress-item">
                    <div className="its-progress-label"><span>Web Development</span><span>75%</span></div>
                    <div className="its-progress-track"><div className="its-progress-fill" style={{ width: "75%" }}></div></div>
                  </div>
                  <div className="its-progress-item">
                    <div className="its-progress-label"><span>UX Design</span><span>70%</span></div>
                    <div className="its-progress-track"><div className="its-progress-fill" style={{ width: "70%" }}></div></div>
                  </div>
                </div>
              </div>
              <div className="its-about-image">
                <img src={ITSImages.computerCode} alt="About" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Our Services</h1>
          <p className="its-page-subtitle">Comprehensive technology solutions to drive your business forward.</p>
          <div className="its-services-grid" style={{ marginTop: "3rem" }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="its-service-card">
                <div className="its-service-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Our Portfolio</h1>
          <p className="its-page-subtitle">Showcasing our best work across web, mobile, design, and branding.</p>
          <div className="its-portfolio-filters">
            {FILTERS.map((f) => (
              <button key={f.value} className={"its-filter-btn" + (activeFilter === f.value ? " active" : "")} onClick={() => setActiveFilter(f.value)}>{f.label}</button>
            ))}
          </div>
          <div className="its-portfolio-grid">
            {filteredPortfolio.map((item, i) => (
              <div key={i} className="its-portfolio-item">
                <div className="its-portfolio-card">
                  <img src={item.img} alt={item.title} />
                  <div className="its-portfolio-overlay">
                    <h3>{item.title}</h3>
                    <span>{item.cat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Pricing Plans</h1>
          <p className="its-page-subtitle">Clear, simple, and flexible plans for your business.</p>
          <div className="its-pricing-grid" style={{ marginTop: "3rem" }}>
            {PRICING_PLANS.map((plan, i) => (
              <div key={i} className={"its-pricing-card" + (plan.popular ? " popular" : "")}>
                {plan.popular && <div className="its-popular-badge">Most Popular</div>}
                <div className="its-pricing-header">
                  <h3>{plan.name}</h3>
                  <p>{plan.desc}</p>
                </div>
                <div className="its-pricing-price">
                  <span className="its-price-main">{plan.price} <span className="its-price-discount">{plan.discount}</span></span>
                </div>
                <a className="its-btn its-btn-primary" onClick={(e) => { e.preventDefault(); }}>Buy {plan.name} Plan</a>
                <div className="its-pricing-features">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="its-pf-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.unavailable.map((f, fi) => (
                    <div key={"un-" + fi} className="its-pf-item unavailable">
                      <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/></svg>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Our Team</h1>
          <p className="its-page-subtitle">Meet the talented people behind our success.</p>
          <div className="its-team-grid">
            {TEAM.map((member, i) => (
              <div key={i} className="its-team-card">
                <img src={member.img} alt={member.name} className="its-team-img" />
                <div className="its-team-info">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderFaq = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Frequently Asked Questions</h1>
          <p className="its-page-subtitle">Find answers to common questions about our services.</p>
          <div className="its-faq-list">
            {FAQ_DATA.map((item, i) => (
              <div key={i} className="its-faq-item">
                <div className={"its-faq-question" + (openFaq === i ? " open" : "")} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {openFaq === i && <div className="its-faq-answer">{item.a}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Our Blog</h1>
          <p className="its-page-subtitle">Stay updated with the latest tech insights and industry news.</p>
          <div className="its-blog-grid" style={{ marginTop: "3rem" }}>
            {BLOG_POSTS.map((post, i) => (
              <article key={i} className="its-blog-card" onClick={() => navigate("blog-detail")}>
                <div className="its-blog-image">
                  <img src={post.img} alt={post.title} />
                  <span className="its-blog-cat">{post.cat}</span>
                </div>
                <div className="its-blog-content">
                  <div className="its-blog-meta">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.desc}</p>
                  <a className="its-read-more">Read More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderBlogDetail = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <div className="its-blog-detail">
            <img src={BLOG_DETAIL.img} alt={BLOG_DETAIL.title} className="its-blog-detail-image" />
            <div className="its-blog-detail-meta">
              <span><strong>Date:</strong> {BLOG_DETAIL.date}</span>
              <span><strong>Author:</strong> {BLOG_DETAIL.author}</span>
              <span><strong>Category:</strong> {BLOG_DETAIL.cat}</span>
            </div>
            <h1>{BLOG_DETAIL.title}</h1>
            <div className="its-blog-detail-content">
              {BLOG_DETAIL.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <a className="its-btn its-btn-outline" onClick={() => navigate("blog")} style={{ marginTop: "30px" }}>Back to Blog</a>
          </div>
        </section>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Contact Us</h1>
          <p className="its-page-subtitle">Let&apos;s build the future of your business together.</p>
          <div className="its-contact-grid" style={{ marginTop: "3rem" }}>
            <div className="its-contact-info">
              <div className="its-contact-card">
                <h3>Let&apos;s Start a Conversation</h3>
                <p>Contact our experts and start your digital journey today.</p>
                <div className="its-contact-details">
                  <div className="its-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                    <div><span>Phone</span><strong>+1 (800) 987-6543</strong></div>
                  </div>
                  <div className="its-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <div><span>Email</span><strong>hello@itagency.com</strong></div>
                  </div>
                  <div className="its-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <div><span>Address</span><strong>789 Innovation Avenue, Future Town</strong></div>
                  </div>
                  <div className="its-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <div><span>Business Hours</span><strong>Mon - Fri: 9:00 AM - 6:00 PM</strong></div>
                  </div>
                </div>
                <div className="its-contact-social">
                  <span>Follow Us</span>
                  <div className="its-social-row">{socialIcons}</div>
                </div>
              </div>
            </div>
            <div className="its-contact-form-wrap">
              <form className="its-form" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent successfully."); }}>
                <div className="its-form-row">
                  <div className="its-form-group">
                    <label>Full Name *</label>
                    <input type="text" required />
                  </div>
                  <div className="its-form-group">
                    <label>Email Address *</label>
                    <input type="email" required />
                  </div>
                </div>
                <div className="its-form-row">
                  <div className="its-form-group">
                    <label>Phone Number</label>
                    <input type="tel" />
                  </div>
                  <div className="its-form-group">
                    <label>Company</label>
                    <input type="text" />
                  </div>
                </div>
                <div className="its-form-group">
                  <label>Service Interested In</label>
                  <select>
                    <option>Select a service</option>
                    <option>Web Development</option>
                    <option>Mobile App Development</option>
                    <option>Cloud Solutions</option>
                    <option>Digital Marketing</option>
                    <option>UI/UX Design</option>
                    <option>Data Analytics</option>
                  </select>
                </div>
                <div className="its-form-group">
                  <label>Project Budget</label>
                  <select>
                    <option>Select budget range</option>
                    <option>Under ,000</option>
                    <option>,000 - ,000</option>
                    <option>,000 - ,000</option>
                    <option>,000 - ,000</option>
                    <option>Over ,000</option>
                  </select>
                </div>
                <div className="its-form-group">
                  <label>Project Details *</label>
                  <textarea rows={5} placeholder="Tell us about your project requirements..." required></textarea>
                </div>
                <label className="its-checkbox">
                  <input type="checkbox" /> <span>I agree to the Privacy Policy and Terms of Service *</span>
                </label>
                <button type="submit" className="its-btn its-btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
  const renderProcess = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Our Process</h1>
          <p className="its-page-subtitle">How we bring your ideas to life, step by step.</p>
          <div className="its-process-page-grid">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="its-process-page-step">
                <div className="its-process-page-num">{step.num}</div>
                <div>
                  <h3>{step.label}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderServiceCardsGrid = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Our Services</h1>
          <p className="its-page-subtitle">Comprehensive solutions tailored to your needs.</p>
          <div className="its-services-grid its-service-grid-page" style={{ marginTop: "3rem" }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="its-service-card" style={{ textAlign: "center" }}>
                <div className="its-service-icon" style={{ margin: "0 auto 20px", width: "70px", height: "70px", borderRadius: "50%" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "32px", height: "32px" }}>
                    {s.icon === "monitor" && <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>}
                    {s.icon === "phone" && <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></>}
                    {s.icon === "cloud" && <><path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z"/></>}
                    {s.icon === "marketing" && <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>}
                    {s.icon === "design" && <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></>}
                    {s.icon === "data" && <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>}
                  </svg>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a className="its-btn its-btn-primary its-btn-sm" style={{ marginTop: "15px" }} onClick={() => navigate("services")}>Learn More</a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Terms &amp; Conditions</h1>
          <div className="its-page-content">
            <p className="its-page-subtitle" style={{ marginBottom: "30px", textAlign: "left" }}>Last updated: January 2025</p>
            <div style={{ color: "var(--its-text)", lineHeight: "2", fontSize: "0.95rem" }}>
              <p>Please read these Terms and Conditions carefully before using our services.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>1. Acceptance of Terms</h3>
              <p>By accessing or using our services, you agree to be bound by these Terms. If you do not agree, please do not use our services.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>2. Services Description</h3>
              <p>We provide IT consulting, web development, mobile app development, cloud solutions, and digital marketing services. The scope and pricing of each service will be defined in a separate agreement.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>3. Intellectual Property</h3>
              <p>All intellectual property rights to the work product remain the property of the client upon full payment. Our methodologies, frameworks, and proprietary tools remain our intellectual property.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>4. Limitation of Liability</h3>
              <p>We shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>5. Contact</h3>
              <p>For any questions regarding these terms, please contact us at hello@itagency.com.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="its-main">
      <div className="its-container">
        <section className="its-page-section">
          <h1 className="its-page-title">Privacy Policy</h1>
          <div className="its-page-content">
            <p className="its-page-subtitle" style={{ marginBottom: "30px", textAlign: "left" }}>Last updated: January 2025</p>
            <div style={{ color: "var(--its-text)", lineHeight: "2", fontSize: "0.95rem" }}>
              <p>This Privacy Policy describes how we collect, use, and protect your personal information.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>1. Information We Collect</h3>
              <p>We collect information you provide directly, such as your name, email address, phone number, and company details when you fill out our contact form or use our services.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>2. How We Use Your Information</h3>
              <p>We use your information to respond to inquiries, provide services, improve our offerings, and send relevant updates with your consent.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>3. Data Protection</h3>
              <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>4. Third-Party Services</h3>
              <p>We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law.</p>
              <h3 style={{ color: "#fff", marginTop: "30px", marginBottom: "15px" }}>5. Contact</h3>
              <p>For privacy-related inquiries, please contact us at hello@itagency.com.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
  return (
    <div className={"its-root" + (theme === "light" ? " light" : "")}>
      <div className="its-scroll-progress" style={{ width: scrollProgress + "%" }}></div>
      <button id="its-scroll-top" className={"its-scroll-top" + (scrollVisible ? " visible" : "")}>&uarr;</button>

      <div id="its-preloader" className={"its-loader" + (loaderDone ? " hidden" : "")}>
        <div className="its-loader-inner">
          <div className="its-loader-spinner"><div></div><div></div><div></div></div>
          <div className="its-loader-bar"><div className="its-loader-fill"></div></div>
        </div>
      </div>

      <header className="its-header">
        <div className="its-header-inner">
          <div className="its-logo" onClick={() => navigate("home")}>
            <img src={ITSImages.logo} alt="Logo" />
          </div>
          <nav className={"its-nav" + (menuOpen ? " open" : "")}>
            {navLinks.map((link, i) => (
              <div key={i} className="its-nav-item">
                {link.dropdown ? (
                  <>
                    <span className={"its-nav-link dropdown-toggle" + (openDropdown === link.label ? " open" : "")}
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}>
                      {link.label}
                    </span>
                    <div className={"its-dropdown" + (openDropdown === link.label ? " open" : "")}>
                      {link.dropdown.map((dl, di) => (
                        <a key={di} onClick={() => navigate(dl.page)}>{dl.label}</a>
                      ))}
                    </div>
                  </>
                ) : (
                  <span className={"its-nav-link" + (page === link.page ? " active" : "")} onClick={() => navigate(link.page)}>{link.label}</span>
                )}
              </div>
            ))}
          </nav>
          <div className="its-header-actions">
            <a className="its-btn its-btn-primary its-btn-sm" onClick={() => navigate("contact")}>Get Quotes</a>
            <button className="its-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.894 17.894a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM6.106 6.106a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 004.463-.69.75.75 0 01.981.981A10.501 10.501 0 0118 19.5a10.5 10.5 0 01-10.5-10.5 10.5 10.5 0 011.718-5.528.75.75 0 01.81-.162z" clip-rule="evenodd"/></svg>
              )}
            </button>
            <div className={"its-hamburger" + (menuOpen ? " active" : "")} onClick={() => setMenuOpen(!menuOpen)}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </header>

      {page === "home" && renderHome()}
      {page === "about" && renderAbout()}
      {page === "services" && renderServices()}
      {page === "portfolio" && renderPortfolio()}
      {page === "pricing" && renderPricing()}
      {page === "team" && renderTeam()}
      {page === "faq" && renderFaq()}
      {page === "blog" && renderBlog()}
      {page === "blog-detail" && renderBlogDetail()}
      {page === "contact" && renderContact()}
      {page === "process" && renderProcess()}
      {page === "service-cards-grid" && renderServiceCardsGrid()}
      {page === "terms" && renderTerms()}
      {page === "privacy" && renderPrivacy()}
    </div>
  );
}
