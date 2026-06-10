"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TwoHProps {
  store: any;
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

const IMG = {
  logo: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997919/shopora/ironpeak/logo.png",
  logo2: "https://res.cloudinary.com/dno6yitvw/image/upload/v1781000000/shopora/twoh/logo2.png",
  banner1: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
  banner2: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80",
  banner3: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80",
  whatwe1: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  whatwe2: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  whatwe3: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
  aboutImg: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
  joinBg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
  gallery1: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  gallery2: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
  gallery3: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  gallery4: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  gallery5: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
  gallery6: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80",
  classes1: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  classes2: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  classes3: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  videoBg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
  trainer1: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80",
  trainer2: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&q=80",
  trainer3: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80",
  counterBg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
  blog1: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  blog2: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  blog3: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
  footerBg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
  whatweBg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
  classesBg: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80",
  blogBg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80",
  headingLine: "https://res.cloudinary.com/dno6yitvw/image/upload/v1781000000/shopora/twoh/heading-line.png",
  headingLineWhite: "https://res.cloudinary.com/dno6yitvw/image/upload/v1781000000/shopora/twoh/heading-line-white.png",
};

const DEFAULT = {
  nav: {
    logo: "TWO",
    logoSuffix: "H",
    logoImg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1781000000/shopora/twoh/logo.png",
    logo2Img: "https://res.cloudinary.com/dno6yitvw/image/upload/v1781000000/shopora/twoh/logo2.png",
    links: [
      { label: "Home", href: "#home" },
      { label: "What We Do", href: "#what-we-do" },
      { label: "About", href: "#about" },
      { label: "Gallery", href: "#gallery" },
      { label: "Classes", href: "#classes" },
      { label: "Trainers", href: "#trainers" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
  },
  preloader: {
    text: "Loading...",
    enabled: true,
  },
  hero: {
    enabled: true,
    slides: [
      {
        title: "GIVE YOURSELF A CHANGE",
        subtitle: "The Body Achieves What The Mind Believes",
        description: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form by injected humour.",
        ctaText: "See Our Work",
        ctaLink: "#gallery",
        bg: IMG.banner1,
      },
      {
        title: "PUSH BEYOND YOUR LIMITS",
        subtitle: "No Pain, No Gain",
        description: "Discover your true potential with our expert trainers and state-of-the-art equipment. Transform your body and mind.",
        ctaText: "Join Today",
        ctaLink: "#join",
        bg: IMG.banner2,
      },
      {
        title: "TRAIN HARD, STAY STRONG",
        subtitle: "Fitness is Not About Being Better Than Others",
        description: "It's about being better than you used to be. Start your fitness journey with us and achieve your goals.",
        ctaText: "Get Started",
        ctaLink: "#pricing",
        bg: IMG.banner3,
      },
    ],
  },
  whatWeDo: {
    enabled: true,
    items: [
      { image: IMG.whatwe1, title: "Fitness Center" },
      { image: IMG.whatwe2, title: "Training Center" },
      { image: IMG.whatwe3, title: "Yoga Center" },
    ],
  },
  about: {
    enabled: true,
    title: "Your Fitness Goals",
    subtitle: "Welcome To",
    content1: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form by injected humour or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum you need to be sure there isn't anything embarrassing hidden in the middle of text.",
    content2: "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words combined with a handful of model sentence structures.",
    image: IMG.aboutImg,
    readMoreLink: "#gallery",
  },
  join: {
    enabled: true,
    title: "Join Us Today",
    description: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form.",
    ctaText: "Join Us Now",
    ctaLink: "#pricing",
    bg: IMG.joinBg,
  },
  gallery: {
    enabled: true,
    images: [
      { src: IMG.gallery1, alt: "Gym", category: "gym" },
      { src: IMG.gallery2, alt: "Fitness", category: "fitness" },
      { src: IMG.gallery3, alt: "Yoga", category: "yoga" },
      { src: IMG.gallery4, alt: "Running", category: "running" },
      { src: IMG.gallery5, alt: "Gym 2", category: "gym" },
      { src: IMG.gallery6, alt: "Fitness 2", category: "fitness" },
    ],
  },
  classes: {
    enabled: true,
    items: [
      {
        image: IMG.classes1,
        title: "Yoga Class",
        author: "Jone Doe",
        time: "8.00 am - 10.00 am",
      },
      {
        image: IMG.classes2,
        title: "Weight Lifting Class",
        author: "Jone Doe",
        time: "10.00 am - 12.00 pm",
      },
      {
        image: IMG.classes3,
        title: "Running Class",
        author: "Jone Doe",
        time: "4.00 pm - 6.00 pm",
      },
    ],
  },
  pricing: {
    enabled: true,
    plans: [
      {
        name: "Basic",
        price: "$99",
        period: "/Month",
        features: ["Service 1", "Service 2", "Service 3", "Service 4", "Service 5"],
      },
      {
        name: "Standard",
        price: "$199",
        period: "/Month",
        features: ["Service 1", "Service 2", "Service 3", "Service 4", "Service 5"],
      },
      {
        name: "Premium",
        price: "$299",
        period: "/Month",
        features: ["Service 1", "Service 2", "Service 3", "Service 4", "Service 5"],
      },
    ],
  },
  video: {
    enabled: true,
    bg: IMG.videoBg,
    videoUrl: "https://www.youtube.com/watch?v=example",
  },
  trainers: {
    enabled: true,
    items: [
      { image: IMG.trainer1, name: "Jone Doe", title: "Fitness Trainer" },
      { image: IMG.trainer2, name: "Jone Doe", title: "Fitness Trainer" },
      { image: IMG.trainer3, name: "Jone Doe", title: "Fitness Trainer" },
    ],
  },
  counter: {
    enabled: true,
    items: [
      { icon: "fa-smile-o", count: 399, label: "Happy Client" },
      { icon: "fa-code", count: 8312, label: "Code Line" },
      { icon: "fa-folder-open-o", count: 1632, label: "Project Finished" },
      { icon: "fa-trophy", count: 206, label: "Awards" },
    ],
  },
  blog: {
    enabled: true,
    items: [
      {
        image: IMG.blog1,
        date: "January 20 2025",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form...",
      },
      {
        image: IMG.blog2,
        date: "January 21 2025",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form...",
      },
      {
        image: IMG.blog3,
        date: "January 22 2025",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form...",
      },
    ],
  },
  footer: {
    enabled: true,
    logoImg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1781000000/shopora/twoh/logo2.png",
    links: [
      { label: "Home", href: "#home" },
      { label: "What We Do", href: "#what-we-do" },
      { label: "About", href: "#about" },
      { label: "Gallery", href: "#gallery" },
      { label: "Classes", href: "#classes" },
      { label: "Trainers", href: "#trainers" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
    newsletterPlaceholder: "Enter Your Email Here...",
    newsletterButton: "Sign Up",
    followUs: "Follow Us",
    socialLinks: [
      { icon: "fa-facebook", url: "#" },
      { icon: "fa-twitter", url: "#" },
      { icon: "fa-instagram", url: "#" },
      { icon: "fa-pinterest-p", url: "#" },
      { icon: "fa-youtube-play", url: "#" },
    ],
    copyright: "Copyright &copy; 2025 TwoH. All Rights Reserved.",
    bg: IMG.footerBg,
  },
};

export default function TwoHTemplate(props: TwoHProps) {
  const { store, banners, settings, products, slug } = props;
  const sectionRef = useRef<HTMLElement | null>(null);

  const ip = settings.twohSettings || {};

  const nav = { ...DEFAULT.nav, ...ip.nav };
  const preloader = { ...DEFAULT.preloader, ...ip.preloader };
  const hero = { ...DEFAULT.hero, ...ip.hero };
  const whatWeDo = { ...DEFAULT.whatWeDo, ...ip.whatWeDo };
  const about = { ...DEFAULT.about, ...ip.about };
  const join = { ...DEFAULT.join, ...ip.join };
  const gallery = { ...DEFAULT.gallery, ...ip.gallery };
  const classes = { ...DEFAULT.classes, ...ip.classes };
  const pricing = { ...DEFAULT.pricing, ...ip.pricing };
  const video = { ...DEFAULT.video, ...ip.video };
  const trainers = { ...DEFAULT.trainers, ...ip.trainers };
  const counter = { ...DEFAULT.counter, ...ip.counter };
  const blog = { ...DEFAULT.blog, ...ip.blog };
  const footer = { ...DEFAULT.footer, ...ip.footer };

  const bannerData = ip.banners || [];
  const bannerSlides = Array.isArray(bannerData) && bannerData.length > 0 ? bannerData : null;
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = bannerSlides || hero.slides || [];

  const goNext = useCallback(() => {
    if (heroSlides.length < 2) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length, goNext]);

  useEffect(() => {
    const header = document.getElementById("th-header");
    const mobileBtn = document.getElementById("th-mobile-btn");
    const navCollapse = document.getElementById("th-nav-collapse");
    const scrollTopBtn = document.getElementById("th-scroll-top");
    const colorDots = document.querySelectorAll(".th-color-dot");
    const filterBtns = document.querySelectorAll(".th-filter-btn");
    const galleryItems = document.querySelectorAll(".th-gallery-item");
    const contactForm = document.getElementById("th-contact-form") as HTMLFormElement;
    const videoBtn = document.getElementById("th-video-play-btn");

    const handleScroll = () => {
      if (header) {
        if (window.scrollY > 50) header.classList.add("th-sticky");
        else header.classList.remove("th-sticky");
      }
      if (scrollTopBtn) {
        if (window.scrollY > 300) scrollTopBtn.classList.add("th-visible");
        else scrollTopBtn.classList.remove("th-visible");
      }
    };
    window.addEventListener("scroll", handleScroll);

    if (mobileBtn && navCollapse) {
      mobileBtn.addEventListener("click", () => {
        navCollapse.classList.toggle("th-open");
        mobileBtn.classList.toggle("th-active");
      });
    }

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        const targetId = el.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const offset = header ? header.offsetHeight : 80;
          window.scrollTo({ top: (targetElement as HTMLElement).offsetTop - offset, behavior: "smooth" });
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("th-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section").forEach((sec) => observer.observe(sec));

    colorDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        colorDots.forEach((d) => d.classList.remove("th-active"));
        dot.classList.add("th-active");
        const color = (dot as HTMLElement).getAttribute("data-color");
        if (color) {
          document.documentElement.style.setProperty("--theme-primary", color);
          document.documentElement.style.setProperty("--theme-secondary", color);
        }
      });
    });

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("th-active"));
        btn.classList.add("th-active");
        const filter = (btn as HTMLElement).getAttribute("data-filter");
        galleryItems.forEach((item) => {
          const el = item as HTMLElement;
          if (!filter || filter === "*") {
            el.style.display = "block";
          } else {
            const cats = el.getAttribute("data-category");
            el.style.display = cats && cats.includes(filter) ? "block" : "none";
          }
        });
      });
    });

    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for your message! We will get back to you soon.");
        contactForm.reset();
      });
    }

    if (videoBtn) {
      videoBtn.addEventListener("click", () => {
        alert("Video would play: " + (video.videoUrl || ""));
      });
    }

    document.querySelectorAll(".th-nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (navCollapse && navCollapse.classList.contains("th-open")) {
          navCollapse.classList.remove("th-open");
          if (mobileBtn) mobileBtn.classList.remove("th-active");
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (navCollapse && navCollapse.classList.contains("th-open")) {
        const target = e.target as HTMLElement;
        if (!target.closest("#th-header") && !target.closest("#th-nav-collapse")) {
          navCollapse.classList.remove("th-open");
          if (mobileBtn) mobileBtn.classList.remove("th-active");
        }
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [video.videoUrl]);

  const [galFilter, setGalFilter] = useState("*");

  return (
    <>
      <style jsx global>{`
        @import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&family=Roboto+Condensed:wght@300;400;700&display=swap');

        :root {
          --theme-primary: #f36f21;
          --theme-secondary: #f36f21;
        }

        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Open Sans',sans-serif;font-size:14px;line-height:1.6;color:#333;overflow-x:hidden}
        a{text-decoration:none;color:inherit}
        ul{list-style:none}
        img{max-width:100%;height:auto}

        /* Preloader */
        #th-preloader{position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;display:flex;justify-content:center;align-items:center;z-index:99999;transition:opacity .5s,visibility .5s}
        .th-preloader-content{text-align:center}
        .th-preloader-content .th-spinner{width:60px;height:60px;border:6px solid #eee;border-top-color:var(--theme-primary,#f36f21);border-radius:50%;animation:thSpin 1s linear infinite;margin:0 auto 20px}
        @keyframes thSpin{to{transform:rotate(360deg)}}
        .th-preloader-content p{color:#333;font-size:16px;letter-spacing:1px;text-transform:uppercase}

        /* Header */
        .th-header-wrap{position:absolute;top:40px;left:0;width:100%;z-index:1000;transition:all .3s ease}
        .th-header-wrap.th-sticky{position:fixed;top:0;background:#f36f21;box-shadow:0 2px 10px rgba(0,0,0,.2);animation:thSlideDown .3s}
        @keyframes thSlideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}
        .th-header-wrap .th-logo2{display:none}
        .th-header-wrap.th-sticky .th-logo1{display:none}
        .th-header-wrap.th-sticky .th-logo2{display:block}
        .th-header-wrap.th-sticky .th-navbar-nav>li>a{color:#fff;line-height:30px}
        .th-header-inner{max-width:1170px;margin:0 auto;padding:0 15px;display:flex;justify-content:space-between;align-items:center}
        .th-logo{padding:10px 0}
        .th-logo img{max-height:50px}
        .th-header-right{display:flex;align-items:center}
        .th-navbar-nav{display:flex;gap:25px}
        .th-navbar-nav>li>a{color:#fff;font-family:'Roboto Condensed',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;padding:15px 0;display:block;transition:color .3s}
        .th-navbar-nav>li>a:hover{color:#f36f21}
        .th-header-wrap.th-sticky .th-navbar-nav>li>a:hover{color:#333}
        .th-mobile-btn{display:none;flex-direction:column;cursor:pointer;padding:15px 0}
        .th-mobile-btn span{width:28px;height:3px;background:#fff;margin:3px 0;border-radius:2px;transition:all .3s}
        .th-mobile-btn.th-active span:nth-child(1){transform:rotate(45deg) translate(6px,6px)}
        .th-mobile-btn.th-active span:nth-child(2){opacity:0}
        .th-mobile-btn.th-active span:nth-child(3){transform:rotate(-45deg) translate(6px,-6px)}
        .th-nav-collapse{display:flex!important}
        @media(max-width:990px){
          .th-nav-collapse{display:none!important;position:absolute;top:100%;left:0;width:100%;background:#f36f21;flex-direction:column;padding:15px 0}
          .th-nav-collapse.th-open{display:flex!important}
          .th-navbar-nav{flex-direction:column;gap:0;padding:0 15px;width:100%}
          .th-navbar-nav>li>a{padding:10px 0;border-bottom:1px solid rgba(255,255,255,.2)}
          .th-navbar-nav>li:last-child>a{border-bottom:none}
          .th-mobile-btn{display:flex}
          .th-header-wrap{top:0}
        }

        /* Scroll to Top */
        #th-scroll-top{position:fixed;bottom:30px;right:30px;z-index:999;width:45px;height:45px;background:var(--theme-primary,#f36f21);border:none;border-radius:3px;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transform:translateY(20px);transition:all .4s;cursor:pointer;color:#fff;font-size:20px;box-shadow:0 2px 10px rgba(0,0,0,.2)}
        #th-scroll-top.th-visible{opacity:1;visibility:visible;transform:translateY(0)}
        #th-scroll-top:hover{background:#e55e10}

        /* Hero Slider */
        .th-hero-slider{position:relative;overflow:hidden;height:100vh;min-height:600px}
        .th-hero-slide{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .8s ease;background-size:cover;background-position:center}
        .th-hero-slide.th-active{opacity:1}
        .th-hero-slide::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.5)}
        .th-hero-content{position:relative;z-index:2;text-align:center;max-width:900px;padding:0 20px}
        .th-hero-content h1{font-size:48px;color:#fff;font-weight:700;text-transform:uppercase;margin-bottom:15px;font-family:'Roboto Condensed',sans-serif;animation:thFadeInUp 1s}
        .th-hero-content h4{font-size:24px;color:#fff;font-weight:300;margin-bottom:15px;font-family:'Roboto Condensed',sans-serif;animation:thFadeInUp 1s .2s both}
        .th-hero-content p{font-size:14px;color:#ddd;max-width:700px;margin:0 auto 30px;line-height:1.8;animation:thFadeInUp 1s .4s both}
        .th-hero-content .th-btn{animation:thFadeInUp 1s .6s both}
        @keyframes thFadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .th-btn{display:inline-block;padding:12px 35px;font-size:14px;font-weight:600;text-transform:uppercase;border-radius:3px;transition:all .3s;border:none;cursor:pointer;font-family:'Roboto Condensed',sans-serif}
        .th-btn-primary{background:var(--theme-primary,#f36f21);color:#fff}
        .th-btn-primary:hover{background:#e55e10}
        .th-btn-white{border:2px solid #fff;color:#fff;background:transparent}
        .th-btn-white:hover{background:#fff;color:#333}
        .th-hero-dots{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:3}
        .th-hero-dot{width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,.7);background:transparent;cursor:pointer;transition:all .3s}
        .th-hero-dot.th-active{background:var(--theme-primary,#f36f21);border-color:var(--theme-primary,#f36f21)}

        /* Section Base */
        section{opacity:0;transform:translateY(30px);transition:opacity .8s,transform .8s;padding:80px 0}
        section.th-visible{opacity:1;transform:translateY(0)}
        .th-container{max-width:1170px;margin:0 auto;padding:0 15px}
        .th-section-title{text-align:center;margin-bottom:50px}
        .th-section-title h2{font-size:36px;font-weight:700;color:#222;text-transform:uppercase;margin-bottom:10px;font-family:'Roboto Condensed',sans-serif}
        .th-section-title h2 span{color:var(--theme-primary,#f36f21)}
        .th-section-title img{margin-top:10px}

        /* What We Do */
        .th-what-we-do{background:url(${whatWeDo.backgroundImage || IMG.whatweBg}) center/cover fixed;padding:80px 0}
        .th-what-we-do .th-section-title h2{color:#fff}
        .th-what-we-do .th-section-title h2 span{color:#fff}
        .th-what-list{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
        .th-what-item{text-align:center}
        .th-what-item img{width:100%;border:6px solid var(--theme-primary,#f36f21);border-radius:3px;transition:all .3s}
        .th-what-item:hover img{transform:scale(1.05)}
        .th-what-item h3{font-size:20px;font-weight:700;color:#fff;margin-top:20px;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif}
        @media(max-width:767px){.th-what-list{grid-template-columns:1fr}}

        /* About */
        .th-about{padding:80px 0}
        .th-about-row{display:flex;flex-wrap:wrap;align-items:center;margin:0 -15px}
        .th-about-text{width:58.333%;padding:0 15px}
        .th-about-img{width:41.667%;padding:0 15px}
        .th-about-text h2{font-size:36px;font-weight:700;color:#222;text-transform:uppercase;margin-bottom:15px;font-family:'Roboto Condensed',sans-serif}
        .th-about-text h2 span{color:var(--theme-primary,#f36f21);font-size:18px;display:block;font-weight:600;text-transform:uppercase}
        .th-about-text p{font-size:14px;color:#555;line-height:1.8;margin-bottom:15px}
        .th-about-text strong{font-size:14px;color:#333;line-height:1.8;display:block;margin-bottom:15px}
        .th-about-text .th-btn{margin-top:10px}
        @media(max-width:990px){
          .th-about-text,.th-about-img{width:100%;text-align:center}
          .th-about-img{margin-top:30px}
        }

        /* Join */
        .th-join{background:url(${join.bg}) center/cover fixed;padding:80px 0;position:relative}
        .th-join::before{content:"";position:absolute;inset:0;background:rgba(243,111,33,.86)}
        .th-join .th-container{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap}
        .th-join-text{width:60%}
        .th-join-text h2{font-size:36px;font-weight:700;color:#fff;text-transform:uppercase;margin-bottom:10px;font-family:'Roboto Condensed',sans-serif}
        .th-join-text p{font-size:14px;color:#fff;line-height:1.8}
        .th-join-btn{width:35%;text-align:right}
        @media(max-width:767px){
          .th-join-text,.th-join-btn{width:100%;text-align:center}
          .th-join-btn{margin-top:20px}
        }

        /* Gallery */
        .th-gallery{padding:80px 0;background:#f9f9f9}
        .th-gallery-filters{text-align:center;margin-bottom:40px}
        .th-filter-btn{display:inline-block;padding:10px 25px;margin:0 5px 10px;font-size:14px;font-weight:600;color:#333;background:transparent;border:1px solid #ddd;border-radius:3px;cursor:pointer;transition:all .3s;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif}
        .th-filter-btn.th-active,.th-filter-btn:hover{background:#fb5c22;color:#fff;border-color:#fb5c22}
        .th-gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}
        .th-gallery-item{position:relative;overflow:hidden;border-radius:3px}
        .th-gallery-item img{width:100%;display:block;transition:transform .5s}
        .th-gallery-item:hover img{transform:scale(1.1)}
        .th-gallery-overlay{position:absolute;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0);transition:all .4s}
        .th-gallery-item:hover .th-gallery-overlay{opacity:1;transform:scale(1)}
        .th-gallery-overlay a{color:#fff;font-size:30px;transition:all .3s}
        .th-gallery-overlay a:hover{color:var(--theme-primary,#f36f21)}
        .th-gallery-plus{position:absolute;bottom:0;left:50%;transform:translateX(-50%) translateY(100%);color:#fff;font-size:24px;width:50px;height:50px;background:var(--theme-primary,#f36f21);display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all .4s;opacity:0}
        .th-gallery-item:hover .th-gallery-plus{transform:translateX(-50%) translateY(-50%);opacity:1}
        .th-gallery-title{position:absolute;bottom:20px;left:20px;color:#fff;font-size:16px;font-weight:600;text-transform:uppercase;z-index:2;font-family:'Roboto Condensed',sans-serif}
        @media(max-width:767px){.th-gallery-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.th-gallery-grid{grid-template-columns:1fr}}

        /* Classes */
        .th-classes{background:var(--theme-primary,#f36f21);padding:80px 0}
        .th-classes .th-section-title h2{color:#fff}
        .th-classes .th-section-title img{filter:brightness(0) invert(1)}
        .th-classes-carousel{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
        .th-class-item{background:#fff;border-radius:3px;overflow:hidden;transition:all .3s}
        .th-class-item:hover{transform:translateY(-10px);box-shadow:0 10px 30px rgba(0,0,0,.2)}
        .th-class-item img{width:100%;display:block}
        .th-class-info{padding:20px}
        .th-class-info h3{font-size:18px;font-weight:700;color:#222;margin-bottom:10px;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif}
        .th-class-author{display:flex;justify-content:space-between;font-size:13px;color:#888}
        .th-class-author i{color:var(--theme-primary,#f36f21);margin-right:5px}
        @media(max-width:767px){.th-classes-carousel{grid-template-columns:1fr}}

        /* Pricing */
        .th-pricing{padding:80px 0}
        .th-pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
        .th-pricing-card{text-align:center;padding:40px 30px;border:1px solid #eee;border-radius:3px;transition:all .3s}
        .th-pricing-card:hover{border-color:var(--theme-primary,#f36f21);box-shadow:0 10px 30px rgba(0,0,0,.1);transform:translateY(-5px)}
        .th-pricing-card h3{font-size:24px;font-weight:700;color:#222;margin-bottom:15px;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif}
        .th-pricing-card .th-price{font-size:48px;font-weight:700;color:var(--theme-primary,#f36f21);margin-bottom:5px}
        .th-pricing-card .th-price span{font-size:18px;font-weight:400}
        .th-pricing-card ul{margin:25px 0;padding:0}
        .th-pricing-card ul li{padding:10px 0;border-bottom:1px solid #eee;color:#555;font-size:14px}
        .th-pricing-card ul li:last-child{border-bottom:none}
        .th-pricing-card .th-btn{background:var(--theme-primary,#f36f21);color:#fff;padding:10px 30px;border-radius:3px}
        .th-pricing-card .th-btn:hover{background:#e55e10}
        @media(max-width:767px){.th-pricing-grid{grid-template-columns:1fr}}

        /* Video */
        .th-video{background:url(${video.bg}) center/cover fixed;padding:120px 0;position:relative;text-align:center}
        .th-video::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.5)}
        .th-video .th-video-content{position:relative;z-index:1}
        .th-video-play-btn{width:80px;height:80px;border-radius:50%;background:var(--theme-primary,#f36f21);border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;animation:thPulseBorder 2s infinite;position:relative;transition:all .3s}
        .th-video-play-btn:hover{transform:scale(1.1)}
        .th-video-play-btn::after{content:"";width:0;height:0;border-left:18px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent;margin-left:4px}
        @keyframes thPulseBorder{0%{box-shadow:0 0 0 0 rgba(243,111,33,.6)}50%{box-shadow:0 0 0 20px rgba(243,111,33,.2)}100%{box-shadow:0 0 0 40px rgba(243,111,33,0)}}

        /* Trainers */
        .th-trainers{padding:80px 0;background:#f9f9f9}
        .th-trainers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
        .th-trainer-card{text-align:center;background:#fff;border-radius:3px;overflow:hidden;transition:all .3s;box-shadow:0 2px 15px rgba(0,0,0,.08)}
        .th-trainer-card:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(0,0,0,.15)}
        .th-trainer-img{position:relative;overflow:hidden}
        .th-trainer-img img{width:100%;display:block;transition:transform .5s}
        .th-trainer-card:hover .th-trainer-img img{transform:scale(1.1)}
        .th-trainer-overlay{position:absolute;inset:0;background:rgba(0,0,0,.7);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;opacity:0;transform:scale(.9);transition:all .4s}
        .th-trainer-card:hover .th-trainer-overlay{opacity:1;transform:scale(1)}
        .th-trainer-overlay a{color:#fff;font-size:16px;padding:8px 20px;border:1px solid #fff;border-radius:3px;transition:all .3s;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif}
        .th-trainer-overlay a:hover{background:var(--theme-primary,#f36f21);border-color:var(--theme-primary,#f36f21)}
        .th-trainer-social{display:flex;gap:10px}
        .th-trainer-social a{width:36px;height:36px;border-radius:50%;border:1px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;transition:all .3s}
        .th-trainer-social a:hover{background:var(--theme-primary,#f36f21);border-color:var(--theme-primary,#f36f21)}
        .th-trainer-info{padding:20px}
        .th-trainer-info h3{font-size:18px;font-weight:700;color:#fff;margin-bottom:5px;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif;background:var(--theme-primary,#f36f21);padding:8px 0}
        .th-trainer-info p{font-size:14px;color:#888;margin-top:8px}
        @media(max-width:767px){.th-trainers-grid{grid-template-columns:1fr}}

        /* Counter */
        .th-counter{background:url(${counter.backgroundImage || IMG.counterBg}) center/cover fixed;padding:80px 0;position:relative}
        .th-counter::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.7)}
        .th-counter .th-container{position:relative;z-index:1}
        .th-counter-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;text-align:center}
        .th-counter-item{color:#fff}
        .th-counter-item i{font-size:40px;margin-bottom:15px;display:block}
        .th-counter-item .th-counter-num{font-size:60px;font-weight:700;margin-bottom:5px;font-family:'Roboto Condensed',sans-serif}
        .th-counter-item p{font-size:18px;font-weight:300;text-transform:uppercase}
        @media(max-width:767px){.th-counter-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.th-counter-grid{grid-template-columns:1fr}}

        /* Blog */
        .th-blog{padding:80px 0}
        .th-blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
        .th-blog-card{background:#fff;border-radius:3px;overflow:hidden;transition:all .3s;box-shadow:0 2px 15px rgba(0,0,0,.08)}
        .th-blog-card:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(0,0,0,.15)}
        .th-blog-img{position:relative;overflow:hidden}
        .th-blog-img img{width:100%;display:block;transition:transform .5s}
        .th-blog-card:hover .th-blog-img img{transform:scale(1.1)}
        .th-blog-date{position:absolute;bottom:-15px;left:15px;background:var(--theme-primary,#f36f21);color:#fff;padding:8px 15px;border-radius:3px;font-size:13px;font-weight:600;border:2px solid #fff;z-index:2}
        .th-blog-info{padding:25px 20px 20px}
        .th-blog-info h3{font-size:16px;font-weight:700;color:#222;margin-bottom:10px;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif;transition:color .3s}
        .th-blog-card:hover .th-blog-info h3{color:var(--theme-primary,#f36f21)}
        .th-blog-info p{font-size:13px;color:#777;line-height:1.8}
        @media(max-width:767px){.th-blog-grid{grid-template-columns:1fr}}

        /* Footer */
        .th-footer{background:url(${footer.bg}) center/cover;padding:0;position:relative;color:#fff}
        .th-footer::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.85)}
        .th-footer .th-container{position:relative;z-index:1}
        .th-footer-top{padding:60px 0 40px;text-align:center}
        .th-footer-logo{margin-bottom:30px}
        .th-footer-logo img{max-height:50px}
        .th-footer-nav{margin-bottom:30px;padding:15px 0;border-top:1px solid rgba(255,255,255,.2);border-bottom:1px solid rgba(255,255,255,.2)}
        .th-footer-nav ul{display:flex;justify-content:center;flex-wrap:wrap;gap:5px 25px}
        .th-footer-nav ul li a{color:rgba(255,255,255,.8);font-size:14px;font-weight:600;text-transform:uppercase;transition:color .3s;font-family:'Roboto Condensed',sans-serif}
        .th-footer-nav ul li a:hover{color:var(--theme-primary,#f36f21)}
        .th-footer-newsletter{margin-bottom:30px}
        .th-footer-newsletter p{font-size:16px;font-weight:600;margin-bottom:15px;text-transform:uppercase}
        .th-footer-newsletter form{display:flex;justify-content:center;max-width:500px;margin:0 auto}
        .th-footer-newsletter input{flex:1;padding:12px 15px;border:none;font-size:14px;outline:none}
        .th-footer-newsletter button{background:var(--theme-primary,#f36f21);color:#fff;border:none;padding:12px 25px;font-size:14px;font-weight:600;cursor:pointer;text-transform:uppercase;transition:background .3s;font-family:'Roboto Condensed',sans-serif}
        .th-footer-newsletter button:hover{background:#e55e10}
        .th-footer-social{margin-bottom:30px}
        .th-footer-social p{font-size:16px;font-weight:600;margin-bottom:15px;text-transform:uppercase}
        .th-footer-social .th-social-icons{display:flex;justify-content:center;gap:10px}
        .th-footer-social .th-social-icons a{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.8);font-size:16px;transition:all .3s}
        .th-footer-social .th-social-icons a:hover{background:var(--theme-primary,#f36f21);border-color:var(--theme-primary,#f36f21);color:#fff}
        .th-footer-bottom{padding:20px 0;border-top:1px solid rgba(255,255,255,.15);text-align:center}
        .th-footer-bottom p{font-size:14px;color:rgba(255,255,255,.6)}
        .th-footer-bottom p a{color:var(--theme-primary,#f36f21)}

        /* Color Switcher */
        .th-color-switcher{position:fixed;top:150px;left:-220px;z-index:9999;transition:left .3s;display:flex}
        .th-color-switcher.th-open{left:0}
        .th-color-switcher .th-switcher-toggle{width:45px;height:45px;background:#333;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;border:none;border-radius:0 3px 3px 0}
        .th-color-switcher .th-switcher-inner{background:#fff;padding:15px;width:220px;box-shadow:2px 0 10px rgba(0,0,0,.2)}
        .th-color-switcher .th-switcher-inner h4{font-size:14px;font-weight:700;color:#333;margin-bottom:10px;text-transform:uppercase;font-family:'Roboto Condensed',sans-serif}
        .th-color-switcher .th-switcher-colors{display:flex;flex-wrap:wrap;gap:8px}
        .th-color-switcher .th-color-dot{width:30px;height:30px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .3s}
        .th-color-switcher .th-color-dot.th-active,.th-color-switcher .th-color-dot:hover{border-color:#333;transform:scale(1.1)}

        /* Responsive */
        @media(max-width:1200px){
          .th-container{max-width:970px}
        }
        @media(max-width:990px){
          .th-container{max-width:750px}
          .th-hero-content h1{font-size:36px}
          .th-hero-content h4{font-size:20px}
          .th-pricing-grid,.th-trainers-grid,.th-blog-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:767px){
          .th-container{max-width:100%}
          .th-hero-content h1{font-size:28px}
          .th-hero-content h4{font-size:18px}
          .th-about-text h2{font-size:28px}
          .th-join-text h2{font-size:28px}
          .th-section-title h2{font-size:28px}
          .th-pricing-grid,.th-trainers-grid,.th-blog-grid{grid-template-columns:1fr}
        }
        @media(max-width:480px){
          .th-hero-content h1{font-size:22px}
          .th-hero-content h4{font-size:16px}
          .th-btn{padding:10px 25px;font-size:13px}
          .th-counter-item .th-counter-num{font-size:40px}
        }
      `}</style>

      <div className="th-root">
        {/* Preloader */}
        {preloader.enabled !== false && (
          <div id="th-preloader">
            <div className="th-preloader-content">
              <div className="th-spinner"></div>
              <p>{preloader.text}</p>
            </div>
          </div>
        )}

        {/* Scroll to Top */}
        <button id="th-scroll-top" aria-label="Scroll to top">
          <i className="fa fa-angle-up"></i>
        </button>

        {/* Header */}
        <header id="th-header" className="th-header-wrap">
          <div className="th-header-inner">
            <div className="th-logo">
              <a href="#home">
                <img className="th-logo1" src={nav.logoImg} alt="Logo" />
                <img className="th-logo2" src={nav.logo2Img} alt="Logo" />
              </a>
            </div>
            <div className="th-header-right">
              <div id="th-nav-collapse" className="th-nav-collapse">
                <ul className="th-navbar-nav">
                  {nav.links.map((link: any, i: number) => (
                    <li key={i}><a className="th-nav-link" href={link.href || "#"}>{link.label}</a></li>
                  ))}
                </ul>
              </div>
              <div id="th-mobile-btn" className="th-mobile-btn">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Slider */}
        {hero.enabled !== false && (
          <section id="home" className="th-hero-slider" style={{ padding: 0 }}>
            {heroSlides.map((slide: any, i: number) => (
              <div
                key={i}
                className={`th-hero-slide ${i === currentSlide ? 'th-active' : ''}`}
                style={{ backgroundImage: `url(${slide.bg || slide.desktopImage || slide.image})` }}
              >
                <div className="th-hero-content">
                  <h1>{slide.title || slide.heading}</h1>
                  <h4>{slide.subtitle || slide.subheading}</h4>
                  <p>{slide.description || slide.paragraph}</p>
                  {(slide.ctaText || slide.ctaLink) && (
                    <a href={slide.ctaLink || "#"} className="th-btn th-btn-primary">{slide.ctaText || "See Our Work"}</a>
                  )}
                </div>
              </div>
            ))}
            {heroSlides.length > 1 && (
              <div className="th-hero-dots">
                {heroSlides.map((_: any, i: number) => (
                  <button
                    key={i}
                    className={`th-hero-dot ${i === currentSlide ? 'th-active' : ''}`}
                    onClick={() => setCurrentSlide(i)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* What We Do */}
        {whatWeDo.enabled !== false && (
          <section id="what-we-do" className="th-what-we-do">
            <div className="th-container">
              <div className="th-section-title">
                <h2>WHAT <span>WE DO</span></h2>
                <img src={IMG.headingLine} alt="" />
              </div>
              <div className="th-what-list">
                {whatWeDo.items.map((item: any, i: number) => (
                  <div key={i} className="th-what-item">
                    <img src={item.image} alt={item.title} />
                    <h3>{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About */}
        {about.enabled !== false && (
          <section id="about" className="th-about">
            <div className="th-container">
              <div className="th-about-row">
                <div className="th-about-text">
                  <h2><span>{about.subtitle}</span> {about.title}</h2>
                  <strong>{about.content1}</strong>
                  <p>{about.content2}</p>
                  <a href={about.readMoreLink || "#gallery"} className="th-btn th-btn-primary">Read More</a>
                </div>
                <div className="th-about-img">
                  <img src={about.image} alt="About" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Join Us */}
        {join.enabled !== false && (
          <section id="join" className="th-join">
            <div className="th-container">
              <div className="th-join-text">
                <h2>{join.title}</h2>
                <p>{join.description}</p>
              </div>
              <div className="th-join-btn">
                <a href={join.ctaLink || "#pricing"} className="th-btn th-btn-white">{join.ctaText}</a>
              </div>
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery.enabled !== false && (
          <section id="gallery" className="th-gallery">
            <div className="th-container">
              <div className="th-section-title">
                <h2>OUR <span>GALLERY</span></h2>
                <img src={IMG.headingLine} alt="" />
              </div>
              <div className="th-gallery-filters">
                {[
                  { label: "All", filter: "*" },
                  { label: "Gym", filter: "gym" },
                  { label: "Fitness", filter: "fitness" },
                  { label: "Yoga", filter: "yoga" },
                  { label: "Running", filter: "running" },
                ].map((f, i) => (
                  <button
                    key={i}
                    className={`th-filter-btn ${galFilter === f.filter ? 'th-active' : ''}`}
                    data-filter={f.filter}
                    onClick={() => setGalFilter(f.filter)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="th-gallery-grid">
                {gallery.images
                  .filter((img: any) => galFilter === "*" || img.category === galFilter)
                  .map((img: any, i: number) => (
                    <div key={i} className="th-gallery-item" data-category={img.category}>
                      <img src={img.src} alt={img.alt} />
                      <div className="th-gallery-overlay">
                        <a href={img.src} data-fancybox="gallery"><i className="fa fa-search"></i></a>
                      </div>
                      <div className="th-gallery-plus">
                        <i className="fa fa-plus"></i>
                      </div>
                      <div className="th-gallery-title">{img.alt}</div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Classes */}
        {classes.enabled !== false && (
          <section id="classes" className="th-classes">
            <div className="th-container">
              <div className="th-section-title">
                <h2>OUR CLASSES</h2>
                <img src={IMG.headingLineWhite} alt="" />
              </div>
              <div className="th-classes-carousel">
                {classes.items.map((item: any, i: number) => (
                  <div key={i} className="th-class-item">
                    <img src={item.image} alt={item.title} />
                    <div className="th-class-info">
                      <h3>{item.title}</h3>
                      <div className="th-class-author">
                        <span><i className="fa fa-user"></i> {item.author}</span>
                        <span><i className="fa fa-clock-o"></i> {item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        {pricing.enabled !== false && (
          <section id="pricing" className="th-pricing">
            <div className="th-container">
              <div className="th-section-title">
                <h2>OUR <span>PRICING</span></h2>
                <img src={IMG.headingLine} alt="" />
              </div>
              <div className="th-pricing-grid">
                {pricing.plans.map((plan: any, i: number) => (
                  <div key={i} className="th-pricing-card">
                    <h3>{plan.name}</h3>
                    <div className="th-price">{plan.price}<span>{plan.period}</span></div>
                    <ul>
                      {plan.features.map((f: string, fi: number) => (
                        <li key={fi}>{f}</li>
                      ))}
                    </ul>
                    <a href="#contact" className="th-btn">View Details</a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Video */}
        {video.enabled !== false && (
          <section className="th-video">
            <div className="th-video-content">
              <button id="th-video-play-btn" className="th-video-play-btn"></button>
            </div>
          </section>
        )}

        {/* Expert Trainers */}
        {trainers.enabled !== false && (
          <section id="trainers" className="th-trainers">
            <div className="th-container">
              <div className="th-section-title">
                <h2>EXPERT <span>TRAINERS</span></h2>
                <img src={IMG.headingLine} alt="" />
              </div>
              <div className="th-trainers-grid">
                {trainers.items.map((t: any, i: number) => (
                  <div key={i} className="th-trainer-card">
                    <div className="th-trainer-img">
                      <img src={t.image} alt={t.name} />
                      <div className="th-trainer-overlay">
                        <a href="#">View Bio</a>
                        <div className="th-trainer-social">
                          <a href="#"><i className="fa fa-facebook"></i></a>
                          <a href="#"><i className="fa fa-twitter"></i></a>
                          <a href="#"><i className="fa fa-instagram"></i></a>
                        </div>
                      </div>
                    </div>
                    <div className="th-trainer-info">
                      <h3>{t.name}</h3>
                      <p>{t.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Counter */}
        {counter.enabled !== false && (
          <section className="th-counter">
            <div className="th-container">
              <div className="th-counter-grid">
                {counter.items.map((item: any, i: number) => (
                  <div key={i} className="th-counter-item">
                    <i className={`fa ${item.icon}`}></i>
                    <div className="th-counter-num">{item.count}</div>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog */}
        {blog.enabled !== false && (
          <section id="blog" className="th-blog">
            <div className="th-container">
              <div className="th-section-title">
                <h2>OUR <span>BLOG</span></h2>
                <img src={IMG.headingLine} alt="" />
              </div>
              <div className="th-blog-grid">
                {blog.items.map((item: any, i: number) => (
                  <div key={i} className="th-blog-card">
                    <div className="th-blog-img">
                      <img src={item.image} alt={item.title} />
                      <div className="th-blog-date">{item.date}</div>
                    </div>
                    <div className="th-blog-info">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        {footer.enabled !== false && (
          <footer className="th-footer">
            <div className="th-container">
              <div className="th-footer-top">
                <div className="th-footer-logo">
                  <img src={footer.logoImg} alt="Logo" />
                </div>
                <div className="th-footer-nav">
                  <ul>
                    {footer.links.map((link: any, i: number) => (
                      <li key={i}><a href={link.href}>{link.label}</a></li>
                    ))}
                  </ul>
                </div>
                <div className="th-footer-newsletter">
                  <p>{footer.followUs}</p>
                  <form id="th-contact-form" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder={footer.newsletterPlaceholder} required />
                    <button type="submit">{footer.newsletterButton}</button>
                  </form>
                </div>
                <div className="th-footer-social">
                  <p>{footer.followUs}</p>
                  <div className="th-social-icons">
                    {footer.socialLinks.map((s: any, i: number) => (
                      <a key={i} href={s.url}><i className={`fa ${s.icon}`}></i></a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="th-footer-bottom">
                <p dangerouslySetInnerHTML={{ __html: footer.copyright }} />
              </div>
            </div>
          </footer>
        )}

        {/* Color Switcher */}
        <div className="th-color-switcher" id="th-color-switcher">
          <button
            className="th-switcher-toggle"
            onClick={() => {
              const sw = document.getElementById("th-color-switcher");
              if (sw) sw.classList.toggle("th-open");
            }}
          >
            <i className="fa fa-cog"></i>
          </button>
          <div className="th-switcher-inner">
            <h4>Style Switcher</h4>
            <div className="th-switcher-colors">
              {[
                { color: "#e74c3c", label: "Red" },
                { color: "#2980b9", label: "Blue" },
                { color: "#8e44ad", label: "Purple" },
                { color: "#f36f21", label: "Orange", active: true },
                { color: "#f1c40f", label: "Yellow" },
                { color: "#34495e", label: "nvblue" },
                { color: "#27ae60", label: "Green" },
                { color: "#e91e63", label: "Pink" },
              ].map((c, i) => (
                <span
                  key={i}
                  className={`th-color-dot ${c.active ? 'th-active' : ''}`}
                  style={{ background: c.color }}
                  data-color={c.color}
                  title={c.label}
                  onClick={() => {
                    document.documentElement.style.setProperty("--theme-primary", c.color);
                    document.documentElement.style.setProperty("--theme-secondary", c.color);
                    document.querySelectorAll(".th-color-dot").forEach((d) => d.classList.remove("th-active"));
                    (document.querySelectorAll(".th-color-dot")[i] as HTMLElement)?.classList.add("th-active");
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener("load", function() {
              var preloader = document.getElementById("th-preloader");
              if (preloader) { setTimeout(function() { preloader.style.opacity = "0"; preloader.style.visibility = "hidden"; }, 500); }
            });
          `
        }} />
      </div>

      <style jsx>{`
        @keyframes thFadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
