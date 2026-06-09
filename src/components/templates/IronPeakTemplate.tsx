"use client";

import { useEffect, useRef } from "react";

interface IronPeakProps {
  store: any;
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

const IMG = {
  barbell: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997919/shopora/ironpeak/barbell.jpg",
  heroBg: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997920/shopora/ironpeak/hero-bg.jpg",
  about: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997921/shopora/ironpeak/about.jpg",
  trainer1: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997922/shopora/ironpeak/trainer1.jpg",
  trainer2: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997923/shopora/ironpeak/trainer2.jpg",
  trainer3: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997924/shopora/ironpeak/trainer3.jpg",
  trainer4: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997924/shopora/ironpeak/trainer4.jpg",
  blog1: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997925/shopora/ironpeak/blog1.jpg",
  blog2: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997926/shopora/ironpeak/blog2.jpg",
  blog3: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997927/shopora/ironpeak/blog3.jpg",
  pattern: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997928/shopora/ironpeak/pattern.jpg",
};

export default function IronPeakTemplate(props: IronPeakProps) {
  const { store, banners, settings, products, slug } = props;
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 0.6s linear;
      }
      @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const preloader = document.getElementById("ip-preloader");
    const scrollBtn = document.getElementById("ip-scroll-top");
    const scrollProgress = document.querySelector(".ip-scroll-progress") as HTMLElement;
    const navbar = document.getElementById("ip-navbar");
    const mobileMenu = document.querySelector(".ip-mobile-menu") as HTMLElement;
    const navLinks = document.querySelector(".ip-nav-links") as HTMLElement;

    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";
      }, 1500);
    }

    const handleScroll = () => {
      if (navbar) {
        if (window.scrollY > 50) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
      }
      if (scrollProgress) {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (window.scrollY / totalHeight) * 100 + "%";
      }
      if (scrollBtn) {
        if (window.scrollY > 300) scrollBtn.classList.add("visible");
        else scrollBtn.classList.remove("visible");
      }
    };
    window.addEventListener("scroll", handleScroll);

    if (scrollBtn) {
      scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    if (mobileMenu && navLinks) {
      mobileMenu.addEventListener("click", () => {
        const isOpen = navLinks.style.display === "flex";
        navLinks.style.display = isOpen ? "none" : "flex";
        mobileMenu.classList.toggle("active");
      });
    }

    const contactForm = document.querySelector(".ip-contact-form") as HTMLFormElement;
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for your message! We will get back to you soon.");
        contactForm.reset();
      });
    }

    // Scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const cards = entry.target.querySelectorAll(
              ".ip-service-card, .ip-pricing-card, .ip-trainer-card, .ip-testimonial-card, .ip-blog-card, .ip-feature-item"
            );
            cards.forEach((card, index) => {
              setTimeout(() => card.classList.add("animated"), index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section").forEach((section) => observer.observe(section));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const el = e.currentTarget as HTMLAnchorElement;
        const targetId = el.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({ top: (targetElement as HTMLElement).offsetTop - 80, behavior: "smooth" });
        }
      });
    });

    // Ripple effect on buttons
    document.querySelectorAll(".ip-btn").forEach((btn) => {
      btn.addEventListener("click", (e: any) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement("span");
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.classList.add("ripple-effect");
        (e.currentTarget as HTMLElement).appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Close mobile menu on link click
    document.querySelectorAll(".ip-nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768 && navLinks) {
          navLinks.style.display = "none";
          mobileMenu?.classList.remove("active");
          navLinks.classList.remove("active");
        }
      });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      style.remove();
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap');

        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Nunito,sans-serif;line-height:1.6;color:#333;overflow-x:hidden}

        /* Preloader */
        #ip-preloader{position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#0f0f0f,#1a1a1a);display:flex;justify-content:center;align-items:center;z-index:9999;transition:opacity .5s,visibility .5s}
        .ip-preloader-content{text-align:center}
        .ip-dumbbell-loader{position:relative;width:200px;height:60px;margin:0 auto 30px}
        .ip-dumbbell-bar{position:absolute;top:50%;transform:translateY(-50%);width:100%;height:15px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:10px;box-shadow:0 0 20px rgba(255,107,53,.5)}
        .ip-dumbbell-weight{position:absolute;width:40px;height:60px;background:linear-gradient(135deg,#333,#555);border-radius:10px;top:50%;animation:2s ease-in-out infinite ipLiftWeights}
        .ip-left-weight{left:0;animation-delay:0s}
        .ip-right-weight{right:0;animation-delay:1s}
        @keyframes ipLiftWeights{0%,100%{transform:translateY(-50%);box-shadow:0 5px 15px rgba(0,0,0,.3)}50%{transform:translateY(-80%);box-shadow:0 15px 30px rgba(255,107,53,.4)}}
        .ip-preloader-logo{font-size:2.5rem;font-weight:800;background:linear-gradient(135deg,#ff6b35,#f7931e);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:3px;margin-bottom:20px;animation:2s infinite ipLogoPulse}
        @keyframes ipLogoPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 10px rgba(255,107,53,.3))}50%{transform:scale(1.05);filter:drop-shadow(0 0 20px rgba(255,107,53,.6))}}
        .ip-preloader-text{color:#fff;font-size:1.2rem;margin-top:20px;letter-spacing:1px}
        .ip-loading-bar{width:300px;height:4px;background:rgba(255,255,255,.1);border-radius:2px;margin:20px auto;position:relative;overflow:hidden}
        .ip-loading-progress{position:absolute;left:0;top:0;height:100%;width:0%;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:2px;animation:3s ease-in-out forwards ipLoadingProgress}
        @keyframes ipLoadingProgress{0%{width:0%}30%{width:40%}70%{width:80%}100%{width:100%}}

        /* Scroll Progress */
        .ip-scroll-progress{position:fixed;top:0;left:0;width:0%;height:4px;background:linear-gradient(135deg,#ff6b35,#f7931e);z-index:1001;transition:width .3s}

        /* Scroll to Top */
        #ip-scroll-top{position:fixed;bottom:30px;right:30px;z-index:1000;width:60px;height:60px;background:linear-gradient(135deg,#ff6b35,#f7931e);border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transform:translateY(100px);transition:.4s cubic-bezier(.68,-.55,.265,1.55);box-shadow:0 10px 30px rgba(255,107,53,.3);cursor:pointer}
        #ip-scroll-top:hover{transform:translateY(-5px) scale(1.1);box-shadow:0 15px 40px rgba(255,107,53,.5)}
        #ip-scroll-top.visible{opacity:1;visibility:visible;transform:translateY(0)}
        #ip-scroll-top i{font-size:24px;color:#fff;position:relative;z-index:1}

        /* Navigation */
        #ip-navbar{position:fixed;top:0;left:0;width:100%;z-index:1000;background:rgba(15,15,15,.95);backdrop-filter:blur(10px);box-shadow:0 2px 20px rgba(0,0,0,.3);transform:translateY(-100%);animation:.8s .5s forwards ipSlideDown}
        @keyframes ipSlideDown{to{transform:translateY(0)}}
        #ip-navbar.scrolled{background:#0f0f0f}
        .ip-nav-container{max-width:1400px;margin:0 auto;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}
        .ip-logo{color:#fff;font-size:2rem;font-weight:800;letter-spacing:2px;background:linear-gradient(135deg,#ff6b35,#f7931e);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-decoration:none;animation:2s infinite alternate ipLogoGlow}
        @keyframes ipLogoGlow{0%{filter:drop-shadow(0 0 5px rgba(255,107,53,.3))}100%{filter:drop-shadow(0 0 15px rgba(255,107,53,.6))}}
        .ip-logo span{color:#ff6b35}
        .ip-nav-links{display:flex;gap:2.5rem;list-style:none}
        .ip-nav-links a{color:#fff;font-weight:500;text-decoration:none;position:relative;transition:.3s;opacity:0;animation:.8s forwards ipFadeInRight}
        .ip-nav-links li:nth-child(1) a{animation-delay:.6s}
        .ip-nav-links li:nth-child(2) a{animation-delay:.7s}
        .ip-nav-links li:nth-child(3) a{animation-delay:.8s}
        .ip-nav-links li:nth-child(4) a{animation-delay:.9s}
        .ip-nav-links li:nth-child(5) a{animation-delay:1s}
        .ip-nav-links li:nth-child(6) a{animation-delay:1.1s}
        .ip-nav-links li:nth-child(7) a{animation-delay:1.2s}
        .ip-nav-links li:nth-child(8) a{animation-delay:1.3s}
        @keyframes ipFadeInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        .ip-nav-links a::after{content:"";position:absolute;bottom:-5px;left:0;width:0;height:2px;background:linear-gradient(135deg,#ff6b35,#f7931e);transition:width .3s}
        .ip-nav-links a:hover::after,.ip-nav-links a.active::after{width:100%}
        .ip-nav-links a.active{color:#f7931e;font-weight:600}
        .ip-mobile-menu{display:none;flex-direction:column;gap:5px;cursor:pointer}
        .ip-mobile-menu span{width:25px;height:3px;background:#fff;border-radius:3px;transition:.3s}
        .ip-mobile-menu.active span:first-child{transform:rotate(45deg) translate(6px,6px)}
        .ip-mobile-menu.active span:nth-child(2){opacity:0}
        .ip-mobile-menu.active span:nth-child(3){transform:rotate(-45deg) translate(7px,-6px)}

        /* Hero */
        .ip-hero{height:100vh;background:linear-gradient(135deg,rgba(15,15,15,.8),rgba(30,30,30,.9)) center/cover fixed,url(${IMG.heroBg}) center/cover fixed;display:flex;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden}
        .ip-hero::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 30% 50%,rgba(255,107,53,.1),transparent 50%),radial-gradient(circle at 70% 50%,rgba(247,147,30,.1),transparent 50%);animation:8s ease-in-out infinite ipPulse}
        @keyframes ipPulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        .ip-hero-content{position:relative;z-index:1;max-width:900px;padding:2rem;animation:1s ipFadeInUp}
        @keyframes ipFadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .ip-hero h1{font-size:4rem;color:#fff;margin-bottom:1.5rem;font-weight:800;line-height:1.2;text-shadow:2px 2px 20px rgba(0,0,0,.5);animation:3s infinite alternate ipTextGlow}
        @keyframes ipTextGlow{0%{text-shadow:2px 2px 20px rgba(0,0,0,.5)}100%{text-shadow:0 0 30px rgba(255,107,53,.8),2px 2px 20px rgba(0,0,0,.5)}}
        .ip-hero p{font-size:1.3rem;color:#ddd;margin-bottom:2.5rem;max-width:700px;margin-left:auto;margin-right:auto}
        .ip-cta-buttons{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap}
        .ip-btn{padding:1rem 2.5rem;font-size:1.1rem;font-weight:600;border-radius:50px;border:none;display:inline-block;text-decoration:none;position:relative;overflow:hidden;transition:.3s;cursor:pointer}
        .ip-btn-primary{color:#fff;background:linear-gradient(135deg,#ff6b35,#f7931e);box-shadow:0 10px 30px rgba(255,107,53,.4);animation:2s infinite ipPulseButton}
        @keyframes ipPulseButton{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .ip-btn-primary:hover{transform:translateY(-3px);box-shadow:0 15px 40px rgba(255,107,53,.6)}
        .ip-btn-secondary{background:transparent;color:#fff;border:2px solid #fff}
        .ip-btn-secondary:hover{background:#fff;color:#333;transform:translateY(-3px)}

        /* Sections base */
        section{opacity:0;transform:translateY(30px);transition:opacity .8s,transform .8s;padding:90px 0;animation:.6s ipFadeIn}
        section.visible{opacity:1;transform:translateY(0)}
        .ip-container{max-width:93%;margin:0 auto}
        .ip-section-header{text-align:center;margin-bottom:4rem}
        .ip-section-header h2{color:#222;position:relative;display:inline-block;font-size:2.5rem}
        .ip-section-header h2::after{content:"";position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:100px;height:4px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:2px;animation:1s ease-out ipLineGrow}
        @keyframes ipLineGrow{from{width:0}to{width:100px}}
        .ip-section-header p{color:#666;max-width:700px;margin:0 auto;font-size:1.1rem}

        /* About */
        .ip-about{background:linear-gradient(135deg,#f8f9fa,#e9ecef)}
        .ip-about-content{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
        .ip-about-text h3{font-size:2rem;margin-bottom:1.5rem;color:#222}
        .ip-about-text p{font-size:1.1rem;color:#555;margin-bottom:2rem;line-height:1.8}
        .ip-features-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin-top:2rem}
        .ip-feature-item{display:flex;align-items:center;gap:1rem;padding:1rem;background:#fff;border-radius:10px;box-shadow:0 5px 15px rgba(0,0,0,.05);transition:.3s;transform:translateX(-20px);opacity:0}
        .ip-feature-item.animated{animation:.6s forwards ipSlideInRight}
        @keyframes ipSlideInRight{to{opacity:1;transform:translateX(0)}}
        .ip-feature-item:hover{transform:translateX(10px);box-shadow:0 8px 25px rgba(0,0,0,.1)}
        .ip-feature-icon{width:50px;height:50px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:#fff;flex-shrink:0;animation:2s infinite ipBounce}
        @keyframes ipBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .ip-about-image{position:relative;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.2);animation:6s ease-in-out infinite ipFloat}
        @keyframes ipFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
        .ip-about-image img{width:100%;height:auto;display:block}

        /* Services */
        .ip-services{background:#fff}
        .ip-services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:2.5rem}
        .ip-service-card{padding:2.5rem;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,.08);transition:.4s;position:relative;opacity:0;transform:translateY(20px);overflow:hidden;background:#fff}
        .ip-service-card.animated{animation:.6s forwards ipCardPopUp}
        @keyframes ipCardPopUp{to{opacity:1;transform:translateY(0)}}
        .ip-service-card::before{content:"";position:absolute;top:0;left:0;width:100%;height:5px;background:linear-gradient(135deg,#ff6b35,#f7931e);transform:scaleX(0);transition:transform .4s}
        .ip-service-card:hover{transform:translateY(-10px);box-shadow:0 20px 60px rgba(0,0,0,.15)}
        .ip-service-card:hover::before{transform:scaleX(1)}
        .ip-service-icon{width:80px;height:80px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:#fff;margin-bottom:1.5rem;box-shadow:0 10px 30px rgba(255,107,53,.3);animation:20s linear infinite ipSpinSmall}
        @keyframes ipSpinSmall{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        .ip-service-card:hover .ip-service-icon{animation:.5s ipIconBounce}
        @keyframes ipIconBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
        .ip-service-card h3{font-size:1.4rem;margin-bottom:1rem;color:#222}
        .ip-service-card p{color:#666;line-height:1.8;font-size:1.05rem;margin-bottom:1.5rem}
        .ip-joinnow{padding:.5rem 1.5rem;display:inline-block}

        /* Pricing */
        .ip-pricing{background:linear-gradient(135deg,#1a1a1a,#2d2d2d)}
        .ip-pricing .ip-section-header h2,.ip-pricing .ip-section-header p{color:#fff}
        .ip-pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:2.5rem;max-width:1200px;margin:0 auto}
        .ip-pricing-card{background:rgba(255,255,255,.05);border:2px solid rgba(255,255,255,.1);border-radius:20px;padding:3rem 2rem;text-align:center;backdrop-filter:blur(10px);transition:.4s;position:relative;opacity:0;transform:scale(.9)}
        .ip-pricing-card.animated{animation:.6s forwards ipScaleIn}
        @keyframes ipScaleIn{to{opacity:1;transform:scale(1)}}
        .ip-pricing-card.featured{border-color:transparent;background:linear-gradient(135deg,#ff6b35,#f7931e);transform:scale(.9)}
        .ip-pricing-card.featured.animated{animation:.6s forwards ipFeaturedPop}
        @keyframes ipFeaturedPop{to{opacity:1;transform:scale(1.05)}}
        .ip-pricing-card:hover{transform:translateY(-10px) scale(1.02);box-shadow:0 20px 60px rgba(255,107,53,.3)}
        .ip-pricing-card.featured:hover{transform:translateY(-10px) scale(1.08)}
        .ip-pricing-badge{position:absolute;top:-15px;left:50%;transform:translateX(-50%);background:#fff;color:#ff6b35;padding:.5rem 1.5rem;border-radius:50px;font-weight:700;font-size:.9rem;box-shadow:0 5px 20px rgba(0,0,0,.2);animation:3s ease-in-out infinite ipBadgeFloat}
        @keyframes ipBadgeFloat{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-5px)}}
        .ip-pricing-card h3{font-size:2rem;margin-bottom:1rem;color:#fff}
        .ip-price{font-size:4rem;font-weight:800;margin:1.5rem 0;background:linear-gradient(135deg,#ff6b35,#f7931e);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
        .ip-pricing-card.featured .ip-price{-webkit-text-fill-color:#fff}
        .ip-price span{font-size:1.5rem;font-weight:400}
        .ip-pricing-card p{margin-bottom:2rem;color:rgba(255,255,255,.8)}
        .ip-features-list{list-style:none;margin:2rem 0;text-align:left}
        .ip-features-list li{padding:.8rem 0;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:1rem;transition:.3s;color:rgba(255,255,255,.8)}
        .ip-features-list li:hover{transform:translateX(5px);color:#fff}
        .ip-features-list li::before{content:"✓";display:inline-block;width:24px;height:24px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:50%;line-height:24px;text-align:center;flex-shrink:0;color:#fff}
        .ip-features-list li.disabled{opacity:.4}
        .ip-features-list li.disabled::before{content:"✗";background:#555}

        /* Trainers */
        .ip-trainers{background:#f8f9fa}
        .ip-trainers-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2.5rem}
        .ip-trainer-card{background:#fff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,.08);transform:translateY(20px);opacity:0;overflow:hidden;transition:.4s}
        .ip-trainer-card.animated{animation:.6s forwards ipSlideUp}
        @keyframes ipSlideUp{to{opacity:1;transform:translateY(0)}}
        .ip-trainer-card:hover{transform:translateY(-10px);box-shadow:0 20px 60px rgba(0,0,0,.15)}
        .ip-trainer-image{height:320px;overflow:hidden;position:relative}
        .ip-trainer-image img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
        .ip-trainer-card:hover .ip-trainer-image img{transform:scale(1.1)}
        .ip-trainer-info{padding:2rem;text-align:center}
        .ip-trainer-info h3{font-size:1.6rem;margin-bottom:.5rem;color:#222}
        .ip-trainer-role{color:#ff6b35;font-weight:600;margin-bottom:1rem;font-size:1.1rem}
        .ip-trainer-info p{color:#666;line-height:1.6}

        /* Testimonials */
        .ip-testimonials{background:#fff}
        .ip-testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:2.5rem}
        .ip-testimonial-card{background:linear-gradient(135deg,#f8f9fa,#e9ecef);padding:2.5rem;border-radius:20px;position:relative;box-shadow:0 10px 30px rgba(0,0,0,.05);transition:.3s;transform:scale(.95);opacity:0}
        .ip-testimonial-card.animated{animation:.6s forwards ipTestimonialFade}
        @keyframes ipTestimonialFade{to{opacity:1;transform:scale(1)}}
        .ip-testimonial-card:hover{transform:translateY(-5px) scale(1.02);box-shadow:0 15px 40px rgba(0,0,0,.1)}
        .ip-quote-icon{position:absolute;top:20px;right:20px;font-size:4rem;color:rgba(255,107,53,.2);line-height:1;animation:4s ease-in-out infinite ipQuoteFloat;font-family:Georgia,serif}
        @keyframes ipQuoteFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .ip-testimonial-text{font-size:1.1rem;line-height:1.8;color:#555;margin-bottom:2rem;font-style:italic}
        .ip-testimonial-author{display:flex;align-items:center;gap:1rem}
        .ip-author-avatar{width:60px;height:60px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;font-weight:700;transition:.3s;flex-shrink:0}
        .ip-testimonial-card:hover .ip-author-avatar{transform:rotate(360deg);background:linear-gradient(135deg,#f7931e,#ff6b35)}
        .ip-author-info h4{color:#222;font-size:1.2rem;margin-bottom:.25rem}
        .ip-author-info p{font-size:.95rem;color:#666}

        /* Blog */
        .ip-blog{background:linear-gradient(135deg,#f8f9fa,#e9ecef);position:relative}
        .ip-blog::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%23ff6b35" opacity="0.05" d="M0,50 Q25,25 50,50 T100,50 V100 H0 Z"/></svg>') 0 0 / cover;animation:20s linear infinite ipWaveMove}
        @keyframes ipWaveMove{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(-50px) rotate(1deg)}}
        .ip-blog-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:2.5rem;position:relative;z-index:1}
        .ip-blog-card{background:#fff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,.08);transition:.4s;transform:translateY(30px) rotate(2deg);opacity:0;overflow:hidden}
        .ip-blog-card.animated{animation:.6s forwards ipBlogCardAppear}
        @keyframes ipBlogCardAppear{to{opacity:1;transform:translateY(0) rotate(0)}}
        .ip-blog-card:nth-child(2){animation-delay:.2s}
        .ip-blog-card:nth-child(3){animation-delay:.4s}
        .ip-blog-card:hover{transform:translateY(-10px) rotate(-1deg);box-shadow:0 20px 60px rgba(255,107,53,.15)}
        .ip-blog-image{overflow:hidden;position:relative}
        .ip-blog-image::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transition:.5s;z-index:1}
        .ip-blog-card:hover .ip-blog-image::before{left:100%}
        .ip-blog-image img{width:100%;display:block;transition:transform .5s}
        .ip-blog-card:hover .ip-blog-image img{transform:scale(1.05)}
        .ip-blog-content{padding:2.5rem;position:relative}
        .ip-blog-meta{display:flex;gap:1rem;margin-bottom:1rem;align-items:center}
        .ip-blog-date{padding:.5rem 1rem;border-radius:50px;font-size:.9rem;font-weight:600;background:linear-gradient(135deg,#ff6b35,#f7931e);color:#fff;animation:2s infinite alternate ipDateGlow}
        @keyframes ipDateGlow{from{box-shadow:0 0 10px rgba(255,107,53,.3)}to{box-shadow:0 0 20px rgba(255,107,53,.6)}}
        .ip-blog-category{padding:.5rem 1rem;border-radius:50px;font-size:.9rem;font-weight:600;background:rgba(255,107,53,.1);color:#ff6b35;transition:.3s}
        .ip-blog-card:hover .ip-blog-category{background:#ff6b35;color:#fff;transform:scale(1.1)}
        .ip-blog-content h3{font-size:1.4rem;margin-bottom:1rem;color:#222;line-height:1.4;transition:.3s}
        .ip-blog-card:hover .ip-blog-content h3{color:#ff6b35;transform:translateX(5px)}
        .ip-blog-content p{color:#666;line-height:1.8;margin-bottom:1.5rem}
        .ip-read-more{display:inline-flex;align-items:center;gap:.5rem;color:#ff6b35;text-decoration:none;font-weight:600;transition:.3s;position:relative}
        .ip-read-more::after{content:"→";transition:transform .3s}
        .ip-read-more:hover{gap:1rem;color:#f7931e}

        /* Contact */
        .ip-contact{background:linear-gradient(135deg,#1a1a1a,#2d2d2d)}
        .ip-contact .ip-section-header h2,.ip-contact .ip-section-header p{color:#fff}
        .ip-contact-content{display:grid;grid-template-columns:1fr 1fr;gap:4rem;max-width:1200px;margin:0 auto}
        .ip-contact-form{padding:3rem;border-radius:20px;border:2px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);backdrop-filter:blur(10px)}
        .ip-form-group{margin-bottom:1.5rem}
        .ip-form-group label{display:block;margin-bottom:.5rem;font-weight:600;color:#fff}
        .ip-form-group input,.ip-form-group textarea{width:100%;padding:1rem;border:2px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:1rem;transition:.3s}
        .ip-form-group input:focus,.ip-form-group textarea:focus{outline:0;border-color:#ff6b35;background:rgba(255,255,255,.15);box-shadow:0 0 20px rgba(255,107,53,.3)}
        .ip-form-group textarea{resize:vertical;min-height:150px}
        .ip-contact-info{display:flex;flex-direction:column;gap:2rem}
        .ip-info-item{padding:2rem;border-radius:15px;border:2px solid rgba(255,255,255,.1);display:flex;align-items:start;gap:1.5rem;transition:.3s;background:rgba(255,255,255,.05);backdrop-filter:blur(10px)}
        .ip-info-item:hover{transform:translateY(-5px);border-color:#ff6b35;box-shadow:0 10px 30px rgba(255,107,53,.2)}
        .ip-info-icon{width:50px;height:50px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;animation:2s infinite ipIconPulse}
        @keyframes ipIconPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        .ip-info-content h3{margin-bottom:.5rem;font-size:1.3rem;color:#fff}
        .ip-info-content p{color:rgba(255,255,255,.8);line-height:1.6}

        /* Footer */
        .ip-footer{background:linear-gradient(180deg,#0b0b0b,#000);color:#fff;padding:5rem 2rem 2rem}
        .ip-footer-content{max-width:1400px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:3.5rem}
        .ip-footer-section h3{font-size:1.4rem;margin-bottom:1.5rem;position:relative}
        .ip-footer-section h3::after{content:"";width:45px;height:3px;background:#ff6b35;display:block;margin-top:8px;border-radius:5px}
        .ip-footer-section p{color:rgba(255,255,255,.7);line-height:1.8;margin-bottom:1.5rem}
        .ip-footer-links{list-style:none;padding:0}
        .ip-footer-links li{margin-bottom:.9rem;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:10px;transition:transform .3s,color .3s}
        .ip-footer-links li:hover{transform:translateX(6px);color:#ff6b35}
        .ip-footer-links a{color:inherit;text-decoration:none}
        .ip-footer-links i{margin-right:5px}
        .ip-social-links{display:flex;gap:12px}
        .ip-social-links a{display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:rgba(255,255,255,.7);transition:.3s}
        .ip-social-links a:hover{color:#ff6b35;transform:translateY(-3px)}
        .ip-footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:3rem;padding-top:2rem;text-align:center}
        .ip-footer-bottom p{color:rgba(255,255,255,.6);margin-bottom:.5rem}
        .ip-legal-links{color:rgba(255,255,255,.6)}
        .ip-legal-links a{color:rgba(255,255,255,.7);text-decoration:none;margin:0 8px;transition:color .3s}
        .ip-legal-links a:hover{color:#ff6b35}
        .ip-legal-links span{margin:0 4px}

        /* Mobile */
        @media(max-width:768px){
          .ip-hero h1{font-size:2.5rem}
          .ip-hero p{font-size:1.1rem}
          .ip-about-content{grid-template-columns:1fr}
          .ip-contact-content{grid-template-columns:1fr}
          .ip-nav-links{display:none;flex-direction:column;position:absolute;top:100%;left:0;width:100%;background:rgba(0,0,0,.95);padding:1rem 0;gap:0}
          .ip-nav-links a{padding:12px 20px;border-bottom:1px solid rgba(255,255,255,.1)}
          .ip-nav-links a::after{display:none}
          .ip-mobile-menu{display:flex}
          .ip-nav-container{position:relative}
          .ip-price{font-size:3rem}
          .ip-pricing-grid{grid-template-columns:1fr}
          .ip-services-grid{grid-template-columns:1fr}
          .ip-testimonials-grid{grid-template-columns:1fr}
          .ip-blog-grid{grid-template-columns:1fr}
          .ip-trainers-grid{grid-template-columns:1fr}
          .ip-features-grid{grid-template-columns:1fr}
          .ip-preloader-logo{font-size:1.8rem}
          .ip-loading-bar{width:200px}
          .ip-footer-content{grid-template-columns:1fr}
        }

        @keyframes ipFadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      <div className="ip-root">
        {/* Preloader */}
        <div id="ip-preloader">
          <div className="ip-preloader-content">
            <div className="ip-dumbbell-loader">
              <div className="ip-dumbbell-bar"></div>
              <div className="ip-dumbbell-weight ip-left-weight"></div>
              <div className="ip-dumbbell-weight ip-right-weight"></div>
            </div>
            <div className="ip-preloader-logo">IRONPEAK</div>
            <div className="ip-loading-bar">
              <div className="ip-loading-progress"></div>
            </div>
            <div className="ip-preloader-text">Loading Your Fitness Journey...</div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="ip-scroll-progress"></div>

        {/* Scroll to Top */}
        <button id="ip-scroll-top" aria-label="Scroll to top">
          <i className="fas fa-chevron-up"></i>
        </button>

        {/* Navigation */}
        <nav id="ip-navbar">
          <div className="ip-nav-container">
            <a href="#home" className="ip-logo">IRON<span>PEAK</span></a>
            <ul className="ip-nav-links">
              <li><a href="#home" className="active">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#trainers">Trainers</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
            <div className="ip-mobile-menu">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section id="home" className="ip-hero">
          <div className="ip-hero-content">
            <h1>TRANSFORM YOUR BODY, TRANSFORM YOUR LIFE</h1>
            <p>Join Iron Peak Fitness and experience world-class training with state-of-the-art equipment and expert trainers. Start your fitness journey today and achieve the results you've always wanted.</p>
            <div className="ip-cta-buttons">
              <a href="#pricing" className="ip-btn ip-btn-primary">Join Now</a>
              <a href="#about" className="ip-btn ip-btn-secondary">Learn More</a>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="ip-about">
          <div className="ip-container">
            <div className="ip-section-header">
              <h2>About Us</h2>
              <p>We're More Than Just A Gym</p>
            </div>
            <div className="ip-about-content">
              <div className="ip-about-text">
                <h3>Your Fitness Journey Starts Here</h3>
                <p>At Iron Peak Fitness, we believe fitness is a journey, not a destination. Our mission is to provide a supportive environment where everyone, from beginners to athletes, can achieve their fitness goals.</p>
                <p>With over 10 years of experience in the fitness industry, our certified trainers are dedicated to helping you transform your body and improve your overall health.</p>
                <div className="ip-features-grid">
                  <div className="ip-feature-item">
                    <div className="ip-feature-icon">🏋️</div>
                    <div><strong>State-of-the-art equipment</strong></div>
                  </div>
                  <div className="ip-feature-item">
                    <div className="ip-feature-icon">👨‍🏫</div>
                    <div><strong>Certified personal trainers</strong></div>
                  </div>
                  <div className="ip-feature-item">
                    <div className="ip-feature-icon">🥗</div>
                    <div><strong>Nutrition planning services</strong></div>
                  </div>
                  <div className="ip-feature-item">
                    <div className="ip-feature-icon">🕐</div>
                    <div><strong>24/7 access for premium members</strong></div>
                  </div>
                </div>
              </div>
              <div className="ip-about-image">
                <img src={IMG.about} alt="About" />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="ip-services">
          <div className="ip-container">
            <div className="ip-section-header">
              <h2>Our Services</h2>
              <p>Everything you need to achieve your fitness goals</p>
            </div>
            <div className="ip-services-grid">
              {[
                { icon: "🏃", title: "Cardio Training", desc: "Improve your cardiovascular health with our state-of-the-art cardio equipment including treadmills, ellipticals, and stationary bikes." },
                { icon: "💪", title: "Weight Lifting", desc: "Build strength and muscle with our extensive free weights area, power racks, and resistance machines for all fitness levels." },
                { icon: "👤", title: "Personal Training", desc: "Get personalized workout plans and one-on-one coaching from our certified trainers to maximize your results." },
                { icon: "🥗", title: "Nutrition Plans", desc: "Our nutrition experts will create customized meal plans to complement your fitness routine and help you reach your goals faster." },
                { icon: "👥", title: "Group Classes", desc: "Join our energetic group classes including yoga, HIIT, spin, and Zumba for motivation and community support." },
                { icon: "🧘", title: "Recovery Services", desc: "Enhance your recovery with our sauna, massage therapy, and physiotherapy services to keep you performing at your best." },
              ].map((s, i) => (
                <div key={i} className="ip-service-card">
                  <div className="ip-service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <a href="#contact" className="ip-btn ip-btn-primary ip-joinnow">Join Now</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="ip-pricing">
          <div className="ip-container">
            <div className="ip-section-header">
              <h2>Fitness Plans</h2>
              <p>Choose the perfect plan for your fitness journey</p>
            </div>
            <div className="ip-pricing-grid">
              <div className="ip-pricing-card">
                <h3>Basic</h3>
                <div className="ip-price">$29<span>/month</span></div>
                <p>Perfect for beginners</p>
                <ul className="ip-features-list">
                  <li>Gym Access</li>
                  <li>Basic Equipment</li>
                  <li>Locker Room</li>
                  <li className="disabled">Personal Trainer</li>
                  <li className="disabled">Group Classes</li>
                  <li className="disabled">Nutrition Plan</li>
                </ul>
                <a href="#contact" className="ip-btn ip-btn-secondary">Get Started</a>
              </div>
              <div className="ip-pricing-card featured">
                <div className="ip-pricing-badge">Most Popular</div>
                <h3>Pro</h3>
                <div className="ip-price">$59<span>/month</span></div>
                <p>Best value for regulars</p>
                <ul className="ip-features-list">
                  <li>Gym Access 24/7</li>
                  <li>All Equipment</li>
                  <li>Locker Room + Towel</li>
                  <li>4 Personal Training Sessions</li>
                  <li>All Group Classes</li>
                  <li>Nutrition Plan</li>
                </ul>
                <a href="#contact" className="ip-btn ip-btn-primary">Get Started</a>
              </div>
              <div className="ip-pricing-card">
                <h3>Elite</h3>
                <div className="ip-price">$99<span>/month</span></div>
                <p>Ultimate fitness experience</p>
                <ul className="ip-features-list">
                  <li>Everything in Pro</li>
                  <li>Unlimited Personal Training</li>
                  <li>Custom Nutrition Plan</li>
                  <li>Recovery Services</li>
                  <li>Guest Passes</li>
                  <li>Priority Booking</li>
                </ul>
                <a href="#contact" className="ip-btn ip-btn-secondary">Get Started</a>
              </div>
            </div>
          </div>
        </section>

        {/* Trainers */}
        <section id="trainers" className="ip-trainers">
          <div className="ip-container">
            <div className="ip-section-header">
              <h2>Meet Our Trainers</h2>
              <p>Expert coaches dedicated to your success</p>
            </div>
            <div className="ip-trainers-grid">
              {[
                { img: IMG.trainer1, name: "Alex Johnson", role: "Strength & Conditioning", bio: "10+ years experience in strength training and bodybuilding coaching." },
                { img: IMG.trainer2, name: "Maria Rodriguez", role: "Yoga & Mobility", bio: "Certified yoga instructor with specialization in mobility and injury prevention." },
                { img: IMG.trainer3, name: "James Wilson", role: "HIIT & Cardio", bio: "HIIT specialist with 8 years experience transforming clients through high-intensity workouts." },
                { img: IMG.trainer4, name: "Sarah Chen", role: "Nutrition & Wellness", bio: "Registered dietitian helping clients achieve their goals through proper nutrition." },
              ].map((t, i) => (
                <div key={i} className="ip-trainer-card">
                  <div className="ip-trainer-image"><img src={t.img} alt={t.name} /></div>
                  <div className="ip-trainer-info">
                    <h3>{t.name}</h3>
                    <div className="ip-trainer-role">{t.role}</div>
                    <p>{t.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="ip-testimonials">
          <div className="ip-container">
            <div className="ip-section-header">
              <h2>What Our Members Say</h2>
              <p>Real stories from real people</p>
            </div>
            <div className="ip-testimonials-grid">
              {[
                { quote: "I've been a member at Iron Peak for 2 years now and it's completely transformed my life. The trainers are incredibly supportive and the community is amazing. I've lost 40 pounds and gained so much confidence!", author: "Michael Thompson", meta: "Member for 2 years", initials: "MT" },
                { quote: "The personal training program at Iron Peak is worth every penny. My trainer James created a customized plan that helped me build muscle and increase my strength beyond what I thought was possible. Highly recommend!", author: "Jessica Lee", meta: "Member for 1 year", initials: "JL" },
                { quote: "As a beginner, I was nervous about joining a gym, but the staff at Iron Peak made me feel welcome from day one. The group classes are fun and challenging, and I've made great friends along the way!", author: "David Park", meta: "Member for 6 months", initials: "DP" },
              ].map((t, i) => (
                <div key={i} className="ip-testimonial-card">
                  <div className="ip-quote-icon">"</div>
                  <p className="ip-testimonial-text">{t.quote}</p>
                  <div className="ip-testimonial-author">
                    <div className="ip-author-avatar">{t.initials}</div>
                    <div className="ip-author-info">
                      <h4>{t.author}</h4>
                      <p>{t.meta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog */}
        <section id="blog" className="ip-blog">
          <div className="ip-container">
            <div className="ip-section-header">
              <h2>Latest From Our Blog</h2>
              <p>Tips, guides, and insights for your fitness journey</p>
            </div>
            <div className="ip-blog-grid">
              {[
                { img: IMG.blog1, date: "Dec 8, 2025", cat: "Nutrition", title: "10 Protein-Rich Foods to Fuel Your Workouts", desc: "Discover the best protein sources to support muscle growth and recovery after intense training sessions." },
                { img: IMG.blog2, date: "Dec 5, 2025", cat: "Training", title: "How to Build a Sustainable Workout Routine", desc: "Learn the secrets to creating a fitness routine that fits your lifestyle and keeps you motivated long-term." },
                { img: IMG.blog3, date: "Dec 1, 2025", cat: "Wellness", title: "The Importance of Rest Days in Your Training", desc: "Why recovery is just as important as your workouts and how to optimize your rest days for maximum results." },
              ].map((b, i) => (
                <div key={i} className="ip-blog-card">
                  <div className="ip-blog-image"><img src={b.img} alt={b.title} /></div>
                  <div className="ip-blog-content">
                    <div className="ip-blog-meta">
                      <span className="ip-blog-date">{b.date}</span>
                      <span className="ip-blog-category">{b.cat}</span>
                    </div>
                    <h3>{b.title}</h3>
                    <p>{b.desc}</p>
                    <a href="#" className="ip-read-more">Read More</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="ip-contact">
          <div className="ip-container">
            <div className="ip-section-header">
              <h2>Get In Touch</h2>
              <p>Ready to start your fitness journey? Contact us today!</p>
            </div>
            <div className="ip-contact-content">
              <form className="ip-contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="ip-form-group">
                  <label>Your Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>
                <div className="ip-form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" required />
                </div>
                <div className="ip-form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="(555) 123-4567" />
                </div>
                <div className="ip-form-group">
                  <label>Message</label>
                  <textarea placeholder="Tell us about your fitness goals..."></textarea>
                </div>
                <button type="submit" className="ip-btn ip-btn-primary">Send Message</button>
              </form>
              <div className="ip-contact-info">
                <div className="ip-info-item">
                  <div className="ip-info-icon">📍</div>
                  <div className="ip-info-content">
                    <h3>Our Location</h3>
                    <p>123 Fitness Street<br />New York, NY 10001</p>
                  </div>
                </div>
                <div className="ip-info-item">
                  <div className="ip-info-icon">🕐</div>
                  <div className="ip-info-content">
                    <h3>Opening Hours</h3>
                    <p>Mon-Fri: 5:00 AM - 11:00 PM<br />Sat-Sun: 7:00 AM - 9:00 PM</p>
                  </div>
                </div>
                <div className="ip-info-item">
                  <div className="ip-info-icon">📞</div>
                  <div className="ip-info-content">
                    <h3>Phone</h3>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
                <div className="ip-info-item">
                  <div className="ip-info-icon">✉️</div>
                  <div className="ip-info-content">
                    <h3>Email</h3>
                    <p>info@ironpeakfitness.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="ip-footer">
          <div className="ip-footer-content">
            <div className="ip-footer-section brand">
              <h3 className="ip-logo" style={{ fontSize: "1.8rem", display: "inline-block", marginBottom: "1rem" }}>IRON<span>PEAK</span></h3>
              <p>Iron Peak Fitness helps you push limits, build strength, and stay motivated. Train harder, live stronger, and become your best self.</p>
              <div className="ip-social-links">
                <a href="#"><i className="bi bi-facebook"></i></a>
                <a href="#"><i className="bi bi-instagram"></i></a>
                <a href="#"><i className="bi bi-youtube"></i></a>
                <a href="#"><i className="bi bi-twitter-x"></i></a>
              </div>
            </div>
            <div className="ip-footer-section">
              <h3>Quick Links</h3>
              <ul className="ip-footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#trainers">Trainers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="ip-footer-section">
              <h3>Programs</h3>
              <ul className="ip-footer-links">
                <li><a href="#">Personal Training</a></li>
                <li><a href="#">Group Classes</a></li>
                <li><a href="#">Weight Lifting</a></li>
                <li><a href="#">Cardio Training</a></li>
                <li><a href="#">Nutrition Plans</a></li>
                <li><a href="#">Recovery Services</a></li>
              </ul>
            </div>
            <div className="ip-footer-section">
              <h3>Contact Info</h3>
              <ul className="ip-footer-links">
                <li><i className="bi bi-geo-alt"></i> 123 Fitness Street, New York</li>
                <li><i className="bi bi-telephone"></i> (555) 123-4567</li>
                <li><i className="bi bi-envelope"></i> info@ironpeakfitness.com</li>
                <li><i className="bi bi-clock"></i> Mon-Fri: 5AM-11PM</li>
                <li><i className="bi bi-clock"></i> Sat-Sun: 7AM-9PM</li>
              </ul>
            </div>
          </div>
          <div className="ip-footer-bottom">
            <p>&copy; 2025 Iron Peak Fitness. All rights reserved.</p>
            <p className="ip-legal-links">
              <a href="#">Terms</a>
              <span>&bull;</span>
              <a href="#">Privacy</a>
              <span>&bull;</span>
              <a href="#">FAQs</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
