"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { KitchenImages as I } from "./KitchenImages";
import "./KitchenStyles.css";

export default function KitchenTemplate(props: any) {
  const { store, slug } = props;
  const router = useRouter();
  const pathname = usePathname();
  const basePath = `/${slug}`;
  const nav = (p: string) => router.push(`${basePath}${p}`);

  const page = pathname?.replace(basePath, "") || "/";
  const isActive = (p: string) => page === p || (p === "/" && page === "/");

  const [menu, setMenu] = useState("menu1");
  const [showBooking, setShowBooking] = useState(false);
  const [preloader, setPreloader] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPreloader(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const btn = document.getElementById("backto-top");
      if (btn) {
        if (window.scrollY > 300) btn.classList.add("show");
        else btn.classList.remove("show");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderHeader = () => {
    const linkStyle = (path: string) => ({
      cursor: "pointer",
      color: isActive(path) ? "#9B6C27" : "#000000",
      fontWeight: isActive(path) ? 700 : 500,
      fontSize: "15px",
      borderBottom: isActive(path) ? "2px solid #9B6C27" : "2px solid transparent",
      paddingBottom: "4px",
      transition: "all 0.3s ease",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    });
    return (
      <header style={{
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        background: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div className="kitchen-header-container">
          {/* Left side desktop links */}
          <div className="kitchen-nav-left">
            <a href="tel:001239999" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#000000", fontSize: "14px", fontWeight: 600, textDecoration: "none", marginRight: "12px" }}>
              <i className="fas fa-phone-alt" style={{ color: "#9B6C27", fontSize: "14px" }}></i>
              <span style={{ fontSize: "15px", fontFamily: '"Lato", sans-serif' }}>+1 233 898 0897</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("/"); }} style={linkStyle("/")}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("/about"); }} style={linkStyle("/about")}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("/blogs"); }} style={linkStyle("/blogs")}>Blog</a>
          </div>

          {/* Centered Logo */}
          <div className="kitchen-logo-center">
            <a href="#" onClick={(e) => { e.preventDefault(); nav("/"); }} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <img alt="The Kitchen" src={I.logo} style={{ height: "48px", width: "auto" }} />
            </a>
          </div>

          {/* Right side desktop links */}
          <div className="kitchen-nav-right">
            <a href="#" onClick={(e) => { e.preventDefault(); nav("/menu"); }} style={linkStyle("/menu")}>Menu</a>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("/contact"); }} style={linkStyle("/contact")}>Contact</a>
            <button
              onClick={() => setShowBooking(true)}
              style={{
                background: "#9B6C27",
                color: "#ffffff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "0px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginLeft: "12px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2c2d2f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#9B6C27")}
            >
              Book Table
            </button>
          </div>

          {/* Mobile responsive actions */}
          <div className="kitchen-mobile-actions">
            <button
              onClick={() => setShowBooking(true)}
              style={{
                background: "#9B6C27",
                color: "#ffffff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "0px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2c2d2f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#9B6C27")}
            >
              Book Table
            </button>
            <button
              onClick={() => {
                const menu = document.getElementById("kitchen-mobile-nav");
                if (menu) menu.style.display = menu.style.display === "flex" ? "none" : "flex";
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#000000",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <div
          id="kitchen-mobile-nav"
          style={{
            display: "none",
            flexDirection: "column",
            background: "#ffffff",
            borderTop: "1px solid #e5e5e5",
            padding: "16px 24px",
            gap: "12px",
            position: "absolute",
            top: "80px",
            left: 0,
            width: "100%",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            zIndex: 9998,
          }}
        >
          <a href="#" onClick={(e) => { e.preventDefault(); nav("/"); const m = document.getElementById("kitchen-mobile-nav"); if (m) m.style.display = "none"; }} style={{ ...linkStyle("/"), fontSize: "15px" }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); nav("/about"); const m = document.getElementById("kitchen-mobile-nav"); if (m) m.style.display = "none"; }} style={{ ...linkStyle("/about"), fontSize: "15px" }}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); nav("/menu"); const m = document.getElementById("kitchen-mobile-nav"); if (m) m.style.display = "none"; }} style={{ ...linkStyle("/menu"), fontSize: "15px" }}>Menu</a>
          <a href="#" onClick={(e) => { e.preventDefault(); nav("/blogs"); const m = document.getElementById("kitchen-mobile-nav"); if (m) m.style.display = "none"; }} style={{ ...linkStyle("/blogs"), fontSize: "15px" }}>Blog</a>
          <a href="#" onClick={(e) => { e.preventDefault(); nav("/contact"); const m = document.getElementById("kitchen-mobile-nav"); if (m) m.style.display = "none"; }} style={{ ...linkStyle("/contact"), fontSize: "15px" }}>Contact</a>
          <a href="tel:001239999" style={{ color: "#000000", fontSize: "15px", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <i className="fas fa-phone-alt" style={{ color: "#9B6C27" }}></i>
            +1 233 898 0897
          </a>
        </div>
      </header>
    );
  };

  const renderFooter = () => (
    <footer>
      <div className="container">
        <div className="content">
          <div className="row">
            <div className="col-xl-4 col-lg-4">
              <div className="detail">
                <div className="logo"><a href="#" onClick={() => nav("/")}><img src={I.logo} alt="" /></a></div>
                <div className="since"><span>SINCE</span><span>1995</span></div>
                <p>Welcome to a THE KITCHEN where every bite is a journey of taste and delight. Here, we invite you to savor exquisite flavors which will transport your senses to realms of bliss.</p>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="border-box">
                <div className="timing">
                  <h2>OPENING HOURS</h2>
                  <div className="line mb-16"><h5>Mon–Fri</h5><p>9 AM – 7 PM</p></div>
                  <div className="line"><h5>Sat–Sun</h5><p>9 AM – 5 PM</p></div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 offset-xl-1">
              <div className="contact">
                <ul>
                  <li><a href="tel:123456789"><i className="fal fa-phone-alt"></i>+1 233 898 0897</a></li>
                  <li><a href="mailto:info@gmail.com"><i className="fal fa-envelope"></i>email@example.com</a></li>
                  <li><span><i className="fal fa-map-marker-alt"></i>123 Main Street,<br />Anytown, USA.</span></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <ul className="social-icons">
                <li><a href=""><i className="fab fa-facebook-f"></i></a></li>
                <li><a href=""><i className="fab fa-youtube"></i></a></li>
                <li><a href=""><i className="fab fa-instagram"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom"><p>©2025 All rights are reserved by The Kitchen</p></div>
    </footer>
  );

  const renderBookingForm = () => (
    <div className={`booking-popup${showBooking ? " show" : ""}`}>
      <div className="container">
        <div className="text-end">
          <button className="close" onClick={() => setShowBooking(false)}><i className="far fa-times"></i></button>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="border-box">
            <div className="content">
              <div className="heading_1"><h2 className="mb-32">Book Table</h2></div>
              <div className="booking-form2">
                <form method="post" action="#" className="modal-form">
                  <div className="form-group"><input type="text" className="form-control" required placeholder="Name" /></div>
                  <div className="form-group"><input type="number" className="form-control" required placeholder="Phone Number" /></div>
                  <div className="form-group"><input type="text" className="form-control" required placeholder="Time" /></div>
                  <div className="form-group mb-24">
                    <div className="wrapper-dropdown" id="dropdown3">
                      <span className="selected-display light-gray fw-700">Select Deal</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M19.7337 4.8117C19.3788 4.45673 18.8031 4.45667 18.4481 4.81176L10.0002 13.2598L1.55191 4.8117C1.19694 4.45673 0.621303 4.45667 0.266273 4.81176C-0.0887576 5.16679 -0.0887576 5.74237 0.266273 6.0974L9.35742 15.1883C9.52791 15.3588 9.75912 15.4545 10.0002 15.4545C10.2413 15.4545 10.4726 15.3587 10.643 15.1882L19.7337 6.09734C20.0888 5.74237 20.0888 5.16673 19.7337 4.8117Z" fill="#92949F" />
                      </svg>
                    </div>
                  </div>
                  <div className="form-group mb-32"><input type="text" className="form-control sel-input date_from picker__input" placeholder="DD/MM/YYYY" /></div>
                  <div className="text-center"><button type="submit" className="cus-btn dark text-center">Book Table</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHero = () => (
    <div className="hero-banner-1">
      <div className="content">
        <h5 className="subtitle">OUR SPECIAL</h5>
        <h2 className="title">PERFECT STEAK</h2>
        <p>Indulge in our premium quality, hand-selected steaks, grilled to perfection <br />and seasoned with our secret blend of spices. Each bite will transport your<br /> taste buds to a world of savory flavors and unmatched tenderness. Savor the<br /> experience of a single steak like never before.</p>
        <span className="stars">
          <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
          <i className="fas fa-star"></i><i className="fas fa-star"></i>
        </span>
        <div className="ingredients-box">
          <div className="ingredients-head">
            <div className="box-title"><h6>INGREDIENTS</h6></div>
            <div><a href="tel:123456789" className="cus-btn">Order Now</a></div>
          </div>
          <ul className="ingredients-list">
            <li>High-quality beef (such as ribeye, sirloin, or filet mignon)</li>
            <li>Garlic (for flavor, optional)</li>
            <li>Salt and pepper (for seasoning)</li>
            <li>Olive oil or butter (for cooking)</li>
            <li>Fresh herbs (such as thyme, rosemary, or parsley, optional)</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="about pt-144 pb-72">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="since">Since 1995</div>
            <div className="about-content">
              <h3 className="about-title">Where Culinary Passion Meets Unforgettable Dining</h3>
              <p className="description">At THE KITCHEN we believe that great food is not just about flavors; <br />it&apos;s an experience that nourishes the soul. Established with a deep <br />passion for the art of gastronomy, our restaurant to our <br />unwavering commitment to delivering exceptional dining moments.</p>
              <div className="mission">
                <h5>Our Mission</h5>
                <p>Our culinary journey began with a vision to create a haven for food<br /> enthusiasts, where innovation, quality, and heartfelt hospitality<br /> intertwine.</p>
              </div>
              <a href="#" onClick={() => nav("/about")} className="cus-btn dark">Learn More</a>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="border-box"><img src={I.about} alt="" /></div>
          </div>
        </div>
      </div>
    </div>
  );

  const menuCategories = [
    {
      id: "menu1", label: "Starters", items: [
        { num: "01", name: "Crispy Calamari", price: "$9.99", desc: "Breaded rings, marinara dip." },
        { num: "02", name: "Brochette Trio", price: "$8.99", desc: "Tomato & Basil, Goat Cheese & Pepper, Balsamic Mushroom." },
        { num: "03", name: "Spinach and Artichoke Dip", price: "$7.99", desc: "Creamy dip with warm bread or chips." },
        { num: "04", name: "Caprese Skewers", price: "$10.99", desc: "Mozzarella, tomatoes, basil, balsamic glaze." },
        { num: "05", name: "Spicy Chicken Wings", price: "$8.99", desc: "Crispy wings, spicy sauce, celery, blue cheese." },
        { num: "06", name: "Vegetable Spring Rolls", price: "$6.99", desc: "Crispy rolls, fresh veggies, sweet chili dip." },
      ]
    },
    {
      id: "menu2", label: "Main Dishes", items: [
        { num: "01", name: "Grilled Salmon", price: "$16.99", desc: "Salmon, lemon butter, veggies." },
        { num: "02", name: "Margherita Pizza", price: "$12.99", desc: "Tomatoes, mozzarella, basil." },
        { num: "03", name: "Chicken Alfredo", price: "$14.99", desc: "Chicken Alfredo" },
        { num: "04", name: "Beef Stir-Fry", price: "$15.99", desc: "Sautéed beef, mixed veggies, soy sauce, rice." },
        { num: "05", name: "Vegetable Curry", price: "$12.99", desc: "Fresh veggies, curry sauce, basmati rice." },
        { num: "06", name: "BBQ Ribs", price: "$17.99", desc: "Tender, tangy ribs, coleslaw, fries." },
      ]
    },
    {
      id: "menu3", label: "Desserts", items: [
        { num: "01", name: "Chocolate Lava Cake", price: "$7.99", desc: "Warm, gooey cake with vanilla ice cream." },
        { num: "02", name: "New York Cheesecake", price: "$6.99", desc: "Creamy, graham crust, strawberry drizzle." },
        { num: "03", name: "Crème Brûlée", price: "$7.99", desc: "Warm apple pie, vanilla ice cream, cinnamon." },
        { num: "04", name: "Tiramisu", price: "$10.99", desc: "Espresso ladyfingers, mascarpone, cocoa." },
        { num: "05", name: "Berry Parfait", price: "$8.99", desc: "Mixed berries, yogurt, granola, whipped cream." },
        { num: "06", name: "Apple Pie à la Mode", price: "$6.99", desc: "Crispy rolls, fresh veggies, sweet chili dip." },
      ]
    },
    {
      id: "menu4", label: "Drinks", items: [
        { num: "01", name: "Classic Mojito", price: "$16.99", desc: "Rum, mint, lime, sugar, soda." },
        { num: "02", name: "Strawberry Margarita", price: "$12.99", desc: "Tequila, strawberry, lime, salted rim." },
        { num: "03", name: "Mango Lassi", price: "$14.99", desc: "Yogurt, mango, cardamom." },
        { num: "04", name: "Espresso Martini", price: "$15.99", desc: "Vodka, coffee liqueur, espresso." },
        { num: "05", name: "Raspberry Lemonade", price: "$12.99", desc: "Lemonade, raspberry, ice." },
        { num: "06", name: "Watermelon Cooler", price: "$17.99", desc: "Watermelon, sparkling water, lime." },
      ]
    },
  ];

  const renderMenuSection = (id: string) => {
    const cat = menuCategories.find(c => c.id === id);
    if (!cat) return null;
    return (
      <div className={`menu-item ${id}`}>
        <div className="menu-detail-block">
          <h2 className="title">{cat.label}</h2>
          {cat.items.map((item) => (
            <div className="menu-list" key={item.num}>
              <span className="number">{item.num}</span>
              <div className="dishes-item">
                <div className="upper-row">
                  <h5 className="name">{item.name}</h5>
                  <span className="price">{item.price}</span>
                </div>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <>
      {renderHero()}
      {renderAbout()}
      <div className="menu pt-72 pb-72">
        <div className="container">
          <div className="heading_1"><h2>Our Menu</h2></div>
          <div className="row">
            <div className="col-xg-6 col-lg-5">
              {menuCategories.map((cat) => (
                <div className="border-box mb-30" key={cat.id}>
                  <div className={`menu-block ${menu === cat.id ? "active" : ""} ${cat.id}`} id={cat.id} onClick={() => setMenu(cat.id)}>
                    <h3>{cat.label}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-xg-6 col-lg-7" id="menuDetail">
              <div className="border-box box-v2 mb-30">
                {menuCategories.map((cat) => (
                  <div key={cat.id} style={{ display: menu === cat.id ? "block" : "none" }}>
                    {renderMenuSection(cat.id)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="popular-deals pt-72 pb-72">
        <div className="container">
          <div className="heading_1"><h2>Popular Deals</h2></div>
          <div className="row">
            <div className="col-lg-6">
              <div className="deal-block-2 mb-24">
                <img src={I.deal1} alt="" />
                <div className="content">
                  <div className="detail-block">
                    <h6 className="title">Crispy Calamari</h6>
                    <p className="detail">Breaded rings, marinara dip.</p>
                    <div className="price"><span className="old-price">$9.99</span><span className="new-price">$5.99</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="deal-block-2 mb-24">
                <img src={I.deal2} alt="" />
                <div className="content">
                  <div className="detail-block">
                    <h6 className="title">Chicken Alfredo</h6>
                    <p className="detail">Creamy sauce, fettuccine pasta.</p>
                    <div className="price"><span className="old-price">$14.99</span><span className="new-price">$10.99</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="book-table pt-72 pb-72">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-7">
              <div className="border-box">
                <div className="content">
                  <div className="heading_1"><h2 className="mb-32">Book Table</h2></div>
                  <div className="booking-form">
                    <form method="post" action="#">
                      <div className="form-group"><input type="text" className="form-control" required placeholder="Name" /></div>
                      <div className="form-group"><input type="number" className="form-control" required placeholder="Phone Number" /></div>
                      <div className="form-group"><input type="text" className="form-control" required placeholder="Time" /></div>
                      <div className="form-group mb-24">
                        <div className="wrapper-dropdown" id="dropdown2">
                          <span className="selected-display light-gray fw-700">Select Deal</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M19.7337 4.8117C19.3788 4.45673 18.8031 4.45667 18.4481 4.81176L10.0002 13.2598L1.55191 4.8117C1.19694 4.45673 0.621303 4.45667 0.266273 4.81176C-0.0887576 5.16679 -0.0887576 5.74237 0.266273 6.0974L9.35742 15.1883C9.52791 15.3588 9.75912 15.4545 10.0002 15.4545C10.2413 15.4545 10.4726 15.3587 10.643 15.1882L19.7337 6.09734C20.0888 5.74237 20.0888 5.16673 19.7337 4.8117Z" fill="#92949F" />
                          </svg>
                        </div>
                      </div>
                      <div className="form-group mb-32"><input type="text" className="form-control sel-input date_from picker__input" placeholder="DD/MM/YYYY" /></div>
                      <div className="text-center"><button type="submit" className="cus-btn dark text-center">Book Table</button></div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-5"><img src={I.bannerBg2} alt="" /></div>
          </div>
        </div>
      </div>
      <div className="achievements pt-72 pb-72">
        <div className="container">
          <div className="heading_1"><h2>Achievements</h2></div>
          <div className="row">
            <div className="col-lg-3"><div className="achievement-box"><h5>25+</h5><p>Years of Experience</p></div></div>
            <div className="col-lg-3"><div className="achievement-box"><h5>1000+</h5><p>Services Completed</p></div></div>
            <div className="col-lg-3"><div className="achievement-box"><h5>21</h5><p>Experienced Staff</p></div></div>
            <div className="col-lg-3"><div className="achievement-box"><h5>1220+</h5><p>Happy Customers</p></div></div>
            <div className="col-lg-10 offset-lg-1">
              <div className="border-box">
                <div className="video">
                  <div className="img-box">
                    <img className="detail-image" src={I.videoImage} alt="" />
                    <div className="overlay">
                      <a href="javascript:;" className="play-btn"><i className="fas fa-play"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="chefs pt-72 pb-72">
        <div className="container">
          <div className="heading_1"><h2>Our Chefs</h2></div>
          <div className="row">
            {[I.chef1, I.chef2, I.chef3, I.chef4].map((img, i) => (
              <div className="col-xl-3 col-md-6" key={i}>
                <div className="chef-block">
                  <div className="img-block"><img src={img} alt="" /></div>
                  <div className="border-box">
                    <div className="content-box">
                      <h6 className="name">Crispy Calamari</h6>
                      <p className="specialty">Head Chefs</p>
                      <ul className="social-icons">
                        <li><a href=""><i className="fab fa-facebook-f"></i></a></li>
                        <li><a href=""><i className="fab fa-youtube"></i></a></li>
                        <li><a href=""><i className="fab fa-instagram"></i></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="gallery pt-72 pb-72">
        <div className="heading_1"><h2>Food Gallery</h2></div>
        <div className="gallerySlider d-flex flex-wrap justify-content-center">
          {[I.gallery1, I.gallery2, I.gallery3, I.gallery4, I.gallery5].map((img, i) => (
            <div className="img-block" key={i}><img src={img} alt="" /></div>
          ))}
        </div>
      </div>
      <div className="reviews pt-72 pb-144">
        <div className="container">
          <div className="heading_1"><h2>Customer&rsquo;s Reviews</h2></div>
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="review-box">
                <div className="border-box">
                  <div className="reviewSlider">
                    {["Morai Hex", "Crispy Calamari", "Calamari Hex", "Calamari Hex"].map((name, i) => (
                      <div className="review" key={i}>
                        <h6>{name}</h6>
                        <p>Absolutely amazing dining experience at The Kitchen! The flavors were perfectly balanced, and every dish was a work of art. The service was exceptional, and the ambiance added to the overall enjoyment. Highly recommend!</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="blogs pt-72 pb-144">
        <div className="container">
          <div className="heading_1"><h2>Our Blogs</h2></div>
          <div className="row">
            {[
              { img: I.blog1, title: "Bowled Over: Stylish Bowls for Every Meal" },
              { img: I.blog2, title: "Dish it Out: Unique Finds for Your Kitchen" },
              { img: I.blog3, title: "Kitchen Chic: Trendy Dishes to Impress Guests" },
              { img: I.blog4, title: "Feast Ready: Dishes Made for Moments" },
            ].map((blog, i) => (
              <div className="col-xl-3 col-md-6" key={i}>
                <div className="blog-block">
                  <div className="img-block"><img src={blog.img} alt="" /></div>
                  <div className="border-box">
                    <div className="content-box">
                      <h6><a href="#" onClick={() => nav("/blog-detail")} className="name">{blog.title}</a></h6>
                      <p className="specialty">April 25, 2025</p>
                      <ul className="social-icons">
                        <li><a href="#" onClick={() => nav("/blog-detail")}>Read More <i className="fal fa-long-arrow-right"></i></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderFooter()}
    </>
  );

  const renderAboutPage = () => (
    <>
      <div className="page-start-banner"><h1 className="title">About Us</h1></div>
      <div className="about pt-144 pb-72">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="since">Since 1995</div>
              <div className="about-content">
                <h3 className="about-title">Where Culinary Passion Meets Unforgettable Dining</h3>
                <p className="description">At THE KITCHEN we believe that great food is not just about flavors; it&rsquo;s an experience that nourishes the soul. Established with a deep passion for the art of gastronomy, our restaurant to our unwavering commitment to delivering exceptional dining moments.</p>
                <div className="mission">
                  <h5>Our Mission</h5>
                  <p>Our culinary journey began with a vision to create a haven for food enthusiasts, where innovation, quality, and heartfelt hospitality intertwine.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-5"><div className="border-box"><img src={I.about} alt="" /></div></div>
          </div>
        </div>
      </div>
      <div className="achievements pt-72 pb-72">
        <div className="container">
          <div className="heading_1"><h2>Achievements</h2></div>
          <div className="row">
            <div className="col-lg-3"><div className="achievement-box"><h5>25+</h5><p>Years of Experience</p></div></div>
            <div className="col-lg-3"><div className="achievement-box"><h5>1000+</h5><p>Services Completed</p></div></div>
            <div className="col-lg-3"><div className="achievement-box"><h5>21</h5><p>Experienced Staff</p></div></div>
            <div className="col-lg-3"><div className="achievement-box"><h5>1220+</h5><p>Happy Customers</p></div></div>
          </div>
        </div>
      </div>
      {renderFooter()}
    </>
  );

  const renderMenuPage = () => (
    <>
      <div className="page-start-banner"><h1 className="title">Our Menu</h1></div>
      <div className="menu pt-72 pb-72">
        <div className="container">
          <div className="heading_1"><h2>Our Menu</h2></div>
          <div className="row">
            <div className="col-xg-6 col-lg-5">
              {menuCategories.map((cat) => (
                <div className="border-box mb-30" key={cat.id}>
                  <div className={`menu-block ${menu === cat.id ? "active" : ""} ${cat.id}`} onClick={() => setMenu(cat.id)}>
                    <h3>{cat.label}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-xg-6 col-lg-7" id="menuDetail">
              <div className="border-box box-v2 mb-30 fix-height">
                {menuCategories.map((cat) => (
                  <div key={cat.id} style={{ display: menu === cat.id ? "block" : "none" }}>
                    {renderMenuSection(cat.id)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gallery pt-72 pb-72">
        <div className="heading_1"><h2>Food Gallery</h2></div>
        <div className="gallerySlider d-flex flex-wrap justify-content-center">
          {[I.gallery1, I.gallery2, I.gallery3, I.gallery4, I.gallery5, I.gallery6, I.gallery7, I.gallery8, I.gallery9].map((img, i) => (
            <div className="img-block" key={i} style={{ width: "20%" }}><img src={img} alt="" /></div>
          ))}
        </div>
      </div>
      {renderFooter()}
    </>
  );

  const renderBLogsPage = () => (
    <>
      <div className="page-start-banner"><h1 className="title">Our Blog</h1></div>
      <div className="blogs pt-144 pb-144">
        <div className="container">
          <div className="row">
            {[
              { img: I.blog1, title: "Bowled Over: Stylish Bowls for Every Meal" },
              { img: I.blog2, title: "Dish it Out: Unique Finds for Your Kitchen" },
              { img: I.blog3, title: "Kitchen Chic: Trendy Dishes to Impress Guests" },
              { img: I.blog4, title: "Feast Ready: Dishes Made for Moments" },
              { img: I.blog5, title: "Savor the Flavor: Tips for Perfect Seasoning" },
            ].map((blog, i) => (
              <div className="col-xl-3 col-md-6" key={i}>
                <div className="blog-block">
                  <div className="img-block"><img src={blog.img} alt="" /></div>
                  <div className="border-box">
                    <div className="content-box">
                      <h6><a href="#" onClick={() => nav("/blog-detail")} className="name">{blog.title}</a></h6>
                      <p className="specialty">April 25, 2025</p>
                      <ul className="social-icons">
                        <li><a href="#" onClick={() => nav("/blog-detail")}>Read More <i className="fal fa-long-arrow-right"></i></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderFooter()}
    </>
  );

  const renderBlogDetailPage = () => (
    <>
      <div className="page-start-banner"><h1 className="title">Blog Detail</h1></div>
      <div className="blog-detail-wrapper pt-72 pb-144">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2>Bowled Over: Stylish Bowls for Every Meal</h2>
              <p>April 25, 2025</p>
              <img src={I.blog1} alt="" className="mb-32 w-100" />
              <p>Welcome to the world of stylish bowls, where functionality meets artistry and every meal becomes a canvas for creativity. At The Kitchen, we believe that dining is not just about taste; it&rsquo;s a multisensory experience that begins with the eyes. Bowls, in their diverse shapes, sizes, and materials, play a pivotal role in this experience.</p>
              <p>From rustic ceramic bowls that evoke a sense of earthy warmth to sleek, modern glass bowls that add a touch of sophistication, each piece has a story to tell. The right bowl can transform a simple salad into a masterpiece or a hearty stew into a comforting embrace. Let us guide you through the art of selecting the perfect bowl for every occasion.</p>
              <div className="qoutes mb-32">
                <p>&ldquo;The right bowl can transform a simple salad into a masterpiece or a hearty stew into a comforting embrace.&rdquo;</p>
              </div>
              <p>Whether you are hosting a dinner party or enjoying a quiet meal at home, the right tableware sets the tone. Explore our curated collection and discover how the perfect bowl can elevate your dining experience.</p>
              <div className="review-area mb-48">
                <h3>Comments</h3>
                <div className="review-block mb-32">
                  <div className="image-box"><img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="" /></div>
                  <div className="text-box">
                    <h6>John Doe</h6>
                    <p>Great article! I never thought about how much the bowl matters for presentation. Thanks for the tips.</p>
                    <a href="javascript:;" className="reply-btn"><i className="fal fa-reply"></i> Reply</a>
                  </div>
                </div>
                <div className="review-block block-2 mb-32">
                  <div className="image-box"><img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="" /></div>
                  <div className="text-box">
                    <h6>Jane Smith</h6>
                    <p>I love the rustic ceramic bowls you mentioned. Where can I find similar ones?</p>
                    <a href="javascript:;" className="reply-btn"><i className="fal fa-reply"></i> Reply</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="border-box mb-32">
                <h4>Categories</h4>
                <ul className="unstyled">
                  <li><a href="javascript:;">Cooking Tips</a></li>
                  <li><a href="javascript:;">Kitchen Design</a></li>
                  <li><a href="javascript:;">Tableware</a></li>
                  <li><a href="javascript:;">Recipes</a></li>
                </ul>
              </div>
              <div className="border-box">
                <h4>Tags</h4>
                <div className="blog-tags-wrapper">
                  <span className="blog-tags">Bowls</span>
                  <span className="blog-tags">Tableware</span>
                  <span className="blog-tags">Dining</span>
                  <span className="blog-tags">Kitchen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderFooter()}
    </>
  );

  const renderContactPage = () => (
    <>
      <div className="page-start-banner"><h1 className="title">Contact Us</h1></div>
      <div className="contact pt-72 pb-144">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="border-box mb-30">
                <div className="contact-link-box">
                  <i className="fal fa-phone-alt fa-3x color-primary mb-16"></i>
                  <br /><a href="tel:123456789">+1 233 898 0897</a>
                </div>
              </div>
              <div className="border-box mb-30">
                <div className="contact-link-box">
                  <i className="fal fa-envelope fa-3x color-primary mb-16"></i>
                  <br /><a href="mailto:info@gmail.com">email@example.com</a>
                </div>
              </div>
              <div className="border-box mb-30">
                <div className="contact-link-box">
                  <i className="fal fa-map-marker-alt fa-3x color-primary mb-16"></i>
                  <br /><span>123 Main Street, Anytown, USA.</span>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="form-block">
                <h3>Send Us a Message</h3>
                <form>
                  <div className="form-group"><input type="text" className="form-control" required placeholder="Name" /></div>
                  <div className="form-group"><input type="email" className="form-control" required placeholder="Email" /></div>
                  <div className="form-group"><textarea className="form-control" required placeholder="Message"></textarea></div>
                  <button type="submit" className="cus-btn dark">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderFooter()}
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "/about": return renderAboutPage();
      case "/menu": return renderMenuPage();
      case "/blogs": return renderBLogsPage();
      case "/blog-detail": return renderBlogDetailPage();
      case "/contact": return renderContactPage();
      default: return renderHome();
    }
  };

  return (
    <div id="kitchen-root" className="kitchen-main">
      {preloader && (
        <div id="preloader">
          <div className="spinner"><div></div><div></div></div>
        </div>
      )}
      <a href="#main-wrapper" id="backto-top" className="back-to-top"><i className="fas fa-angle-up"></i></a>
      <div id="main-wrapper" className="main-wrapper overflow-hidden">
        <div id="scroll-container">
          {renderHeader()}
          {renderPage()}
          {renderBookingForm()}
        </div>
      </div>
    </div>
  );
}
