"use client";
import { useState, useEffect, useCallback } from "react";
import { Hotel2Images as I } from "./Hotel2Images";
import "./Hotel2Styles.css";

const rooms = [
  { id: "single", name: "Single Room", price: 360, img: I.card1 },
  { id: "queen", name: "Queen Room", price: 360, img: I.card2 },
  { id: "quad", name: "Quad Room", price: 360, img: I.card3 },
  { id: "double", name: "Double Room", price: 360, img: I.card4 },
];

const suites = [
  { id: "grand", name: "Grand Luxury Room", price: 360, img: I.coupleRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make it exceptional." },
  { id: "family", name: "Family Room", price: 380, img: I.familyRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make it exceptional." },
  { id: "deluxe", name: "Deluxe Room", price: 430, img: I.deluxeRoom, desc: "Explore the intricacies of our journey, commitment to hospitality, and the unique features that make it exceptional." },
];

const amenities = [
  { icon: I.iconWashroom, label: "LARGE BATHROOM" },
  { icon: I.iconWiFi, label: "HIGH SPEED WIFI" },
  { icon: I.iconSea, label: "AIR CONDITION" },
  { icon: I.iconParking, label: "FREE PARKING" },
  { icon: I.iconPets, label: "PETS ALLOWED" },
  { icon: I.iconWashingMachine, label: "WASHING" },
];

const heroSlides = [
  { bg: I.bgBanner, bgMob: I.bgMobileBanner, title: "Luxury Suite", sub: "Discounted Prices", align: "center" as const },
  { bg: I.bgBanner2, bgMob: I.bgMobileBanner2, title: "Luxury Suite", sub: "Discounted Prices", align: "right" as const },
  { bg: I.bgBanner3, bgMob: I.bgMobileBanner3, title: "Luxury Suite", sub: "Discounted Prices", align: "left" as const },
];

const testimonials = [
  { text: "Consistency is key, and this place nails it every time. Whether it's a quick lunch or a late-night snack, the quality is consistently.", name: "Sarah Johnson", country: "U.S.A", img: I.user1, roomImg: I.card12, roomName: "Luxury Suit" },
  { text: "Consistency is key, and this place nails it every time. Whether it's a quick lunch or a late-night snack, the quality is consistently.", name: "Brian Clark", country: "Canada", img: I.user2, roomImg: I.card9, roomName: "Queen Room" },
  { text: "Consistency is key, and this place nails it every time. Whether it's a quick lunch or a late-night snack, the quality is consistently.", name: "Megan Robinson", country: "Australia", img: I.user3, roomImg: I.card10, roomName: "Family Room" },
  { text: "Consistency is key, and this place nails it every time. Whether it's a quick lunch or a late-night snack, the quality is consistently.", name: "Jonathan Hall", country: "United Kingdom", img: I.user4, roomImg: I.card11, roomName: "Luxury Suit" },
];

const blogPosts = [
  { id: "1", title: "Top 10 Luxury Hotels in Paris for an Unforgettable Stay", day: "19", month: "February", author: "Admin", category: "Hotel", date: "February 19, 2024", cat: "Hotel", img: I.blogCard1, desc: "Explore the best luxury hotels in the City of Light.", excerpt: "Explore the best luxury hotels in the City of Light. From boutique to grand, find your perfect Parisian escape." },
  { id: "2", title: "5 Must-Try Spa Treatments for Ultimate Relaxation", day: "18", month: "February", author: "Admin", category: "Spa", date: "February 18, 2024", cat: "Spa", img: I.blogCard2, desc: "Discover the most rejuvenating spa treatments.", excerpt: "Discover the most rejuvenating spa treatments that will leave you feeling refreshed and revitalized." },
  { id: "3", title: "A Guide to Fine Dining in Miami Beach", day: "17", month: "February", author: "Admin", category: "Restaurant", date: "February 17, 2024", cat: "Restaurant", img: I.blogCard3, desc: "From seafood to international cuisine.", excerpt: "From seafood to international cuisine, Miami Beach offers a diverse culinary scene worth exploring." },
  { id: "4", title: "The Best Time to Visit the Maldives", day: "16", month: "February", author: "Admin", category: "Travel", date: "February 16, 2024", cat: "Travel", img: I.blogCard4, desc: "Plan your dream vacation to the Maldives.", excerpt: "Plan your dream vacation to the Maldives with our comprehensive guide to the best travel times." },
  { id: "5", title: "How to Choose the Perfect Hotel Room", day: "15", month: "February", author: "Admin", category: "Hotel", date: "February 15, 2024", cat: "Hotel", img: I.blogCard5, desc: "Tips and tricks for selecting the ideal hotel room.", excerpt: "Tips and tricks for selecting the ideal hotel room for your next getaway." },
  { id: "6", title: "Exclusive Summer Offers at Luxury Resorts", day: "14", month: "February", author: "Admin", category: "Offers", date: "February 14, 2024", cat: "Offers", img: I.blogCard6, desc: "Take advantage of amazing summer deals.", excerpt: "Take advantage of amazing summer deals at top luxury resorts around the world." },
  { id: "7", title: "Exploring the Nightlife of Dubai", day: "13", month: "February", author: "Admin", category: "Travel", date: "February 13, 2024", cat: "Travel", img: I.blogCard7, desc: "Dubai's nightlife scene offers something for everyone.", excerpt: "Dubai's nightlife scene offers something for everyone, from rooftop lounges to beach clubs." },
  { id: "8", title: "The Art of Hotel Hospitality", day: "12", month: "February", author: "Admin", category: "Hotel", date: "February 12, 2024", cat: "Hotel", img: I.blogCard8, desc: "What makes a hotel truly exceptional?", excerpt: "What makes a hotel truly exceptional? We explore the key elements of world-class hospitality." },
  { id: "9", title: "Wellness Retreats for a Healthier You", day: "11", month: "February", author: "Admin", category: "Spa", date: "February 11, 2024", cat: "Spa", img: I.blogCard9, desc: "Recharge your mind and body.", excerpt: "Recharge your mind and body at these top wellness retreats around the globe." },
];

const teamMembers = [
  { name: "David Johnson", role: "CEO & Founder", img: I.team1 },
  { name: "Sarah Williams", role: "Manager", img: I.team2 },
  { name: "Michael Brown", role: "Chef", img: I.team3 },
];

const menuItems = [
  { name: "Grilled Salmon", desc: "Fresh Atlantic salmon with seasonal vegetables", price: 34, img: I.menu1 },
  { name: "Beef Steak", desc: "Prime cut beef with truffle mash", price: 42, img: I.menu2 },
  { name: "Seafood Pasta", desc: "Mixed seafood in creamy sauce", price: 28, img: I.menu3 },
  { name: "Caesar Salad", desc: "Classic Caesar with grilled chicken", price: 22, img: I.menu4 },
  { name: "Lobster Thermidor", desc: "Whole lobster in creamy cheese sauce", price: 56, img: I.menu5 },
  { name: "Tiramisu", desc: "Classic Italian dessert", price: 16, img: I.menu6 },
  { name: "Wine Selection", desc: "Premium red wine from Tuscany", price: 38, img: I.menu7 },
  { name: "Bruschetta", desc: "Toasted bread with fresh tomatoes", price: 14, img: I.menu8 },
  { name: "Chocolate Lava Cake", desc: "Warm chocolate cake with ice cream", price: 18, img: I.menu9 },
];

const spaServices = [
  { img: I.spaImage1, name: "Swedish Massage", desc: "Full body relaxation massage", price: 120 },
  { img: I.spaImage2, name: "Hot Stone Therapy", desc: "Volcanic stone heat treatment", price: 150 },
  { img: I.spaImage3, name: "Facial Treatment", desc: "Deep cleansing facial", price: 95 },
  { img: I.spaImage1, name: "Aromatherapy", desc: "Essential oil therapy", price: 130 },
  { img: I.spaImage2, name: "Body Scrub", desc: "Exfoliating salt scrub", price: 110 },
  { img: I.spaImage3, name: "Couple Massage", desc: "Side by side relaxation", price: 240 },
];

const offers = [
  { title: "Weekend Getaway", desc: "Enjoy a luxurious weekend with 30% off on all suites. Includes breakfast and spa access.", oldPrice: 520, newPrice: 364, img: I.card8, validUntil: "March 30, 2024" },
  { title: "Honeymoon Package", desc: "Romantic package with champagne, rose petals, and a couple massage. 25% off.", oldPrice: 680, newPrice: 510, img: I.card9, validUntil: "April 15, 2024" },
  { title: "Early Bird Special", desc: "Book 30 days in advance and get 20% off your entire stay. Free room upgrade.", oldPrice: 400, newPrice: 320, img: I.card10, validUntil: "December 31, 2024" },
  { title: "Family Fun Package", desc: "Kids stay and eat free! Includes family activities and pool access. Save up to 40%.", oldPrice: 600, newPrice: 360, img: I.card11, validUntil: "June 1, 2024" },
];

const featuredGallery = [
  { img: I.galleryGallery1 }, { img: I.galleryGallery2 }, { img: I.galleryGallery4 },
  { img: I.galleryGallery5 }, { img: I.galleryGallery6 }, { img: I.gallerySide1 },
  { img: I.gallerySide2 }, { img: I.gallerySide3 },
];

export default function Hotel2Template(props: any) {
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
  const [roomType, setRoomType] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterPrice, setFilterPrice] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [roomId, setRoomId] = useState("single");
  const [blogId, setBlogId] = useState("1");
  const [filterBlogCat, setFilterBlogCat] = useState("all");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [specialReq, setSpecialReq] = useState("");
  const [galleryIdx, setGalleryIdx] = useState(-1);
  const [preloader, setPreloader] = useState(true);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    setTimeout(() => setPreloader(false), 1500);
  }, []);

  useEffect(() => {
    const st = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", st);
    return () => window.removeEventListener("scroll", st);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);
  
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const navigate = (p: string) => { setPage(p); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const navigateCB = useCallback(navigate, []);

  const filteredRooms = rooms.filter(r => {
    if (filterCat !== "all" && r.id !== filterCat) return false;
    if (roomSearch && !r.name.toLowerCase().includes(roomSearch.toLowerCase())) return false;
    return true;
  });

  const cssVars = `:root { --color-primary: #978667; --color-dark: #282525; --color-light: #fcfdfd; }`;

  const currentRoom = rooms.find(r => r.id === roomId) || rooms[0];
  const currentBlog = blogPosts.find(b => b.id === blogId) || blogPosts[0];
  const filteredBlogs = filterBlogCat === "all" ? blogPosts : blogPosts.filter(b => b.cat.toLowerCase() === filterBlogCat.toLowerCase());

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
        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M20.3135 3.125H5.31348V4.375H20.3135V3.125ZM0.313477 9.375H20.3135V10.625H0.313477V9.375ZM5.31348 15.625H20.3135V16.875H5.31348V15.625Z" fill="currentColor" />
        </svg></span>
      </div>
      <div className={"overlay-mob" + (mobileOpen ? " open" : "")} onClick={() => setMobileOpen(false)} />
      <nav className={"sidebar" + (mobileOpen ? " open" : "")}>
        <div className="logo"><a><img src={I.mobileLogo} alt="" /></a></div>
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

  function CusBtn({ label, dark, onClick }: { label: string; dark?: boolean; onClick?: () => void }) {
    return (
      <button className={"cus-btn" + (dark ? " dark" : "")} onClick={onClick}>
        <span><samp className="text">{label}</samp><samp className="effect">{label}</samp></span>
      </button>
    );
  }

  const renderHome = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
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
                  <g clipPath="url(#a)"><path d="M27.3137 4.68625C24.2917 1.66433 20.2737 0 16 0c-4.2737 0-8.29169 1.66433-11.31375 4.68625C1.66433 7.70831 0 11.7263 0 16c0 4.2737 1.66433 8.2917 4.68625 11.3137C7.70831 30.3357 11.7263 32 16 32c4.2737 0 8.2917-1.6643 11.3137-4.6863C30.3357 24.2917 32 20.2737 32 16c0-4.2737-1.6643-8.29169-4.6863-11.31375ZM16 30.0206C8.269 30.0206 1.97938 23.731 1.97938 16 1.97938 8.269 8.269 1.97938 16 1.97938 23.731 1.97938 30.0206 8.269 30.0206 16 30.0206C23.731 30.0206 30.0206 23.731 30.0206 16 30.0206 8.269 23.731 1.97938 16 1.97938Z" fill="#FFFBFA"/><path d="M11.9464 22.207 22.6928 16 11.9464 9.79299V22.207Z" fill="#FFFBFA"/></g><defs><clipPath id="a"><rect width="32" height="32" fill="#fff"/></clipPath></defs>
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
                            <span className="total-pasenger">{bookingGuests}</span> Guest / <span className="total-room"> {bookingRooms}</span> Room
                          </div>
                          <div className={"guest-area bg-white light-shadow br-5 p-24" + (guestPop ? " open" : "")}>
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
                  <a key={i} className="card-item" onClick={() => { setRoomId(r.id); navigate("room-detail"); }}>
                    <div className="card-image mb-24">
                      <div className="card-price"><p><span className="color-primary price h-31">${r.price}</span><span className="light-bold">/Night</span></p></div>
                      <img src={r.img} className="card-image" alt="" />
                      <img src={I.iconArrowDark} className="icon" alt="" />
                      <img src={I.vecBottomShape} className="corner-shape" alt="" />
                    </div>
                    <div className="text-block">
                      <div className="name-rating d-flex align-items-center justify-content-between mb-16">
                        <h4 className="h-31 light-black">{r.name}</h4>
                        <div className="rating"><p className="light-bold"><i className="fa-solid fa-star color-primary"></i> 4.9</p></div>
                      </div>
                      <p className="sample-text mb-32">At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget.</p>
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
              <video src={I.video} loop muted autoPlay playsInline></video>
            </div>
            <img src={I.vecRightBottom} className="bottom-cornner" alt="" />
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
                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none"><path d="M12.8057 23C12.8057 20 10.0057 16 6.80566 16M6.80566 16C8.639 16 12.8057 15 12.8057 9M6.80566 16H25.8057" stroke="#1B1918" strokeWidth="2"/></svg>
              </button>
              <button className="arrow next-btn" onClick={() => setSuiteIdx(i => (i + 1) % suites.length)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M19.3545 23C19.3545 20 22.1545 16 25.3545 16M25.3545 16C23.5212 16 19.3545 15 19.3545 9M25.3545 16H6.35449" stroke="#1B1918" strokeWidth="2"/></svg>
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
            <img src={I.bgShapeRightCorner} alt="" />
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
                  <div className="card-image"><img src={I.card15} alt="" /><img src={I.card16} alt="" /></div>
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
                      <><img src={I.vecTopLeft} className="shape left-shape" alt="" /><img src={I.vecTopRight} className="shape right-shape" alt="" /></>
                    ) : (
                      <><img src={I.vecBottomLeft} className="shape left-shape" alt="" /><img src={I.vecBottomRight} className="shape right-shape" alt="" /></>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none"><path d="M12.8057 23C12.8057 20 10.0057 16 6.80566 16M6.80566 16C8.639 16 12.8057 15 12.8057 9M6.80566 16H25.8057" stroke="#1B1918" strokeWidth="2"/></svg>
              </button>
              <button className="arrow next-btn" onClick={() => setTestiIdx(i => (i + 1) % testimonials.length)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M19.3545 23C19.3545 20 22.1545 16 25.3545 16M25.3545 16C23.5212 16 19.3545 15 19.3545 9M25.3545 16H6.35449" stroke="#1B1918" strokeWidth="2"/></svg>
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
                        <p className="h-16 white"><span><i className="fa-solid fa-star-sharp color-primary"></i></span><span><i className="fa-solid fa-star-sharp color-primary"></i></span><span><i className="fa-solid fa-star-sharp color-primary"></i></span><span><i className="fa-solid fa-star-sharp color-primary"></i></span><span><i className="fa-solid fa-star-sharp color-primary"></i></span><span>(93) REVIEWS</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom-shape text-end">
            <img src={I.bgShapeRightCorner} alt="" />
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
            <div className="image-container mb-40"><img src={I.gallery1} alt="" /></div>
            <div className="imag-card">
              <div className="images">
                <div className="gallery-img"><img src={I.gallery2} alt="" /></div>
                <div className="gallery-img"><img src={I.gallery3} alt="" /></div>
                <div className="gallery-img"><img src={I.gallery4} alt="" /></div>
              </div>
              <div className="images">
                <div className="gallery-img"><img src={I.gallery5} alt="" /></div>
                <div className="gallery-img"><img src={I.gallery6} alt="" /></div>
                <div className="gallery-img"><img src={I.gallery7} alt="" /></div>
              </div>
            </div>
          </div>
          <div className="bottom-shape center text-end">
            <img src={I.bgShapeFooter} alt="" />
          </div>
        </div>
      </section>
    </div>
  );

  const renderAbout = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" />
        <div className="content"><h1>About Us</h1><p>Discover our story</p></div>
      </div>
      <div className="about-section">
        <div className="container-fluid">
          <div className="about-grid">
            <div className="about-image">
              <img src={I.about1} alt="" />
              <img src={I.vecAboutRight} className="about-shape" alt="" />
            </div>
            <div className="about-content">
              <h2>Welcome to LUXE Hotel</h2>
              <p>At LUXE Hotel, we believe in creating unforgettable experiences. Our commitment to excellence and attention to detail sets us apart as a premier destination for discerning travelers from around the world.</p>
              <p>With decades of combined experience in hospitality, our team is dedicated to ensuring every aspect of your stay exceeds expectations. From our meticulously designed rooms to our world-class dining and spa facilities, every element is crafted with your comfort in mind.</p>
              <ul className="about-features unstyled">
                <li><i className="fa-regular fa-circle-check"></i> 5 Star Accommodations</li>
                <li><i className="fa-regular fa-circle-check"></i> Award Winning Restaurant</li>
                <li><i className="fa-regular fa-circle-check"></i> Luxury Spa & Wellness</li>
                <li><i className="fa-regular fa-circle-check"></i> 24/7 Concierge Service</li>
                <li><i className="fa-regular fa-circle-check"></i> Prime Location</li>
                <li><i className="fa-regular fa-circle-check"></i> Free Airport Shuttle</li>
              </ul>
              <div className="mt-40"><CusBtn label="Book Now" onClick={() => navigate("booking")} /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="team-section">
        <div className="container-fluid">
          <div className="sec-heading mb-48">
            <p className="h-18 bold light-black text-uppercase sec-text">Team</p>
            <h2 className="h-69 light-black sec-title">Meet Our Team</h2>
          </div>
          <div className="team-grid">
            {teamMembers.map((m, i) => (
              <div key={i} className="team-card">
                <img src={m.img} alt="" />
                <div className="info"><h4>{m.name}</h4><span>{m.role}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRooms = () => {
    const paginated = filteredRooms.slice((pageNum - 1) * 6, pageNum * 6);
    const totalPages = Math.ceil(filteredRooms.length / 6);
    return (
      <div className="hotel-root">
        <header className={"home-header" + (scrolled ? " scrolled" : "")}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="logo"><a><img src={I.logo} alt="" /></a></div>
            {renderNavLinks()}{renderMobileNav()}{renderSearch()}
          </div>
        </header>
        <div className="page-hero" style={{ background: `url(${I.titleBanner2}) center/cover no-repeat` }}>
          <div className="overlay" />
          <div className="content"><h1>Our Rooms</h1><p>Find your perfect accommodation</p></div>
        </div>
        <div className="page-section">
          <div className="container-fluid">
            <div className="room-filter">
              <div style={{ display: "flex", gap: 15, alignItems: "center", flexWrap: "wrap" }}>
                <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPageNum(1); }}>
                  <option value="all">All Categories</option>
                  <option value="single">Single</option><option value="queen">Queen</option>
                  <option value="quad">Quad</option><option value="double">Double</option>
                  <option value="deluxe">Deluxe</option><option value="suite">Suite</option>
                </select>
                <select value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
                  <option value="">All Prices</option>
                  <option value="0-350">$0 - $350</option><option value="351-500">$351 - $500</option>
                  <option value="501-1000">$501 - $1000</option><option value="1000">$1000+</option>
                </select>
              </div>
              <input type="text" placeholder="Search rooms..." value={roomSearch} onChange={e => setRoomSearch(e.target.value)} />
            </div>
            <div className="room-grid">
              {paginated.map((r, i) => (
                <a key={i} className="card-item" onClick={() => { setRoomId(r.id); navigate("room-detail"); }}>
                  <div className="card-image mb-24">
                    <div className="card-price"><p><span className="color-primary price h-31">${r.price}</span><span className="light-bold">/Night</span></p></div>
                    <img src={r.img} className="card-image" alt="" />
                    <img src={I.vecBottomShape} className="corner-shape" alt="" />
                  </div>
                  <div className="text-block">
                    <div className="name-rating d-flex align-items-center justify-content-between mb-16">
                      <h4 className="h-31 light-black">{r.name}</h4>
                      <div className="rating"><p className="light-bold"><i className="fa-solid fa-star color-primary"></i> 4.9</p></div>
                    </div>
                    <p className="sample-text mb-32">At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget.</p>
                    <ul className="services unstyled">
                      <li><img src={I.iconKingBed} alt="" /><p className="h-18 bold light-black">King Size Bed</p></li>
                      <li><img src={I.iconTv} alt="" /><p className="h-18 bold light-black">32 Inc TV</p></li>
                      <li><img src={I.iconBreakfast} alt="" /><p className="h-18 bold light-black">Breakfast</p></li>
                    </ul>
                  </div>
                </a>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} className={pageNum === i + 1 ? "active" : ""} onClick={() => setPageNum(i + 1)}>{i + 1}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRestaurant = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Restaurant</h1><p>Fine dining experience</p></div>
      </div>
      <div className="page-section">
        <div className="container-fluid">
          <div className="row align-items-center mb-48">
            <div className="col-md-6"><img src={I.restaurant1} alt="" className="w-100" /></div>
            <div className="col-md-6"><h2 className="h-53 light-black mb-24">A Culinary Journey</h2>
              <p>Indulge in a gastronomic experience crafted by our world-renowned chefs. Using the finest locally-sourced ingredients, each dish tells a story of flavor, tradition, and innovation.</p>
              <div className="mt-32"><CusBtn label="Book a Table" dark onClick={() => navigate("booking")} /></div>
            </div>
          </div>
          <div className="restaurant-menu mb-48">
            <h2 className="h-53 light-black text-center mb-48">Our Menu</h2>
            <div className="menu-grid">
              {menuItems.map((item, i) => (
                <div key={i} className="menu-item">
                  <img src={item.img} alt="" />
                  <div className="info"><h4>{item.name}</h4><p>{item.desc}</p><span className="price color-primary">${item.price}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpa = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero" style={{ background: `url(${I.titleBanner3}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Spa &amp; Wellness</h1><p>Rejuvenate your senses</p></div>
      </div>
      <div className="page-section">
        <div className="container-fluid">
          <div className="row align-items-center mb-48">
            <div className="col-md-6"><img src={I.spaMainImg} alt="" className="w-100" /></div>
            <div className="col-md-6"><h2 className="h-53 light-black mb-24">Ultimate Relaxation</h2>
              <p>Escape the ordinary and immerse yourself in tranquility. Our spa offers a sanctuary where ancient wellness traditions meet modern luxury. From therapeutic massages to rejuvenating facials.</p>
              <div className="mt-32"><CusBtn label="Book Session" onClick={() => navigate("booking")} /></div>
            </div>
          </div>
          <div className="services-grid">
            {spaServices.map((s, i) => (
              <div key={i} className="service-card"><img src={s.img} alt="" /><h4 className="h-24 light-black mt-16">{s.name}</h4><p>{s.desc}</p><span className="color-primary price mt-8">${s.price}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Gallery</h1><p>Explore our property</p></div>
      </div>
      <div className="page-section">
        <div className="container-fluid">
          <div className="gallery-grid">
            {[I.gallery1, I.gallery2, I.gallery3, I.gallery4, I.gallery5, I.gallery6, I.gallery7, I.gallerySide1, I.gallerySide2, I.galleryGallery1, I.galleryGallery2, I.galleryGallery4].map((src, i) => (
              <div key={i} className="gallery-item" onClick={() => setGalleryIdx(i)}>
                <img src={src} alt="" />
                <div className="overlay"><i className="fa-regular fa-image"></i></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Contact Us</h1><p>Get in touch</p></div>
      </div>
      <div className="page-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <h2 className="h-53 light-black mb-32">Send a Message</h2>
              <form onSubmit={e => e.preventDefault()} className="contact-form">
                <div className="mb-24"><input type="text" placeholder="Your Name" className="form-control" /></div>
                <div className="mb-24"><input type="email" placeholder="Your Email" className="form-control" /></div>
                <div className="mb-24"><input type="text" placeholder="Subject" className="form-control" /></div>
                <div className="mb-24"><textarea rows={5} placeholder="Your Message" className="form-control" /></div>
                <CusBtn label="Send Message" dark />
              </form>
            </div>
            <div className="col-md-6">
              <div className="contact-info">
                <h2 className="h-53 light-black mb-32">Contact Information</h2>
                <div className="info-item"><i className="fa-regular fa-location-dot"></i><p>123 Luxury Avenue, Beverly Hills, CA 90210</p></div>
                <div className="info-item"><i className="fa-regular fa-phone"></i><p>+1 (555) 123-4567</p></div>
                <div className="info-item"><i className="fa-regular fa-envelope"></i><p>info@luxehotel.com</p></div>
                <div className="map-container mt-32">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.941263580566!2d-118.4007!3d34.0736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA0JzI0LjkiTiAxMTjCsDI0JzAyLjUiVw!5e0!3m2!1sen!2sus!4v1" width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero" style={{ background: `url(${I.titleBanner2}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Book Your Stay</h1><p>Reserve your room now</p></div>
      </div>
      <div className="page-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <h2 className="h-53 light-black mb-32">Reservation Details</h2>
              <form onSubmit={e => e.preventDefault()}>
                <div className="row mb-24">
                  <div className="col-md-6"><label className="h-18 dark-gray mb-8 d-block">Check In</label><input type="date" className="form-control" /></div>
                  <div className="col-md-6"><label className="h-18 dark-gray mb-8 d-block">Check Out</label><input type="date" className="form-control" /></div>
                </div>
                <div className="row mb-24">
                  <div className="col-md-4"><label className="h-18 dark-gray mb-8 d-block">Guests</label><input type="number" className="form-control" min="1" value="2" /></div>
                  <div className="col-md-4"><label className="h-18 dark-gray mb-8 d-block">Rooms</label><input type="number" className="form-control" min="1" value="1" /></div>
                  <div className="col-md-4"><label className="h-18 dark-gray mb-8 d-block">Room Type</label>
                    <select className="form-control"><option>Single</option><option>Double</option><option>Queen</option><option>King</option><option>Suite</option></select>
                  </div>
                </div>
                <div className="row mb-24">
                  <div className="col-md-6"><label className="h-18 dark-gray mb-8 d-block">Full Name</label><input type="text" className="form-control" /></div>
                  <div className="col-md-6"><label className="h-18 dark-gray mb-8 d-block">Email</label><input type="email" className="form-control" /></div>
                </div>
                <div className="row mb-24">
                  <div className="col-md-6"><label className="h-18 dark-gray mb-8 d-block">Phone</label><input type="tel" className="form-control" /></div>
                  <div className="col-md-6"><label className="h-18 dark-gray mb-8 d-block">Special Requests</label><input type="text" className="form-control" /></div>
                </div>
                <CusBtn label="Confirm Booking" dark />
              </form>
            </div>
            <div className="col-md-4">
              <div className="booking-summary bg-light p-32 rounded">
                <h3 className="h-31 light-black mb-24">Booking Summary</h3>
                <div className="summary-item d-flex justify-content-between mb-16"><span>Room Type</span><span className="fw-600">Double Room</span></div>
                <div className="summary-item d-flex justify-content-between mb-16"><span>Check In</span><span className="fw-600">30 Jan, 2024</span></div>
                <div className="summary-item d-flex justify-content-between mb-16"><span>Check Out</span><span className="fw-600">02 Feb, 2024</span></div>
                <div className="summary-item d-flex justify-content-between mb-16"><span>Nights</span><span className="fw-600">3</span></div>
                <hr />
                <div className="summary-item d-flex justify-content-between"><span className="h-24 light-black">Total</span><span className="h-31 color-primary">$750</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Special Offers</h1><p>Exclusive deals &amp; packages</p></div>
      </div>
      <div className="page-section">
        <div className="container-fluid">
          <div className="offers-grid">
            {offers.map((o, i) => (
              <div key={i} className="offer-card d-flex flex-wrap">
                <div className="offer-image"><img src={o.img} alt="" /></div>
                <div className="offer-content p-32">
                  <h3 className="h-31 light-black mb-16">{o.title}</h3>
                  <p className="mb-24">{o.desc}</p>
                  <p className="offer-validity"><i className="fa-regular fa-clock"></i> Valid until {o.validUntil}</p>
                  <div className="mt-24"><CusBtn label="Book Now" onClick={() => navigate("booking")} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Our Blog</h1><p>Latest news &amp; stories</p></div>
      </div>
      <div className="page-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-list">
                {blogPosts.map((p, i) => (
                  <div key={i} className="blog-card mb-48">
                    <div className="blog-image"><img src={p.img} alt="" />
                      <div className="blog-date"><span className="day">{p.day}</span><span className="month">{p.month}</span></div>
                    </div>
                    <div className="blog-content p-32">
                      <div className="blog-meta mb-16"><span><i className="fa-regular fa-user"></i> {p.author}</span><span><i className="fa-regular fa-tag"></i> {p.category}</span></div>
                      <h3 className="h-31 light-black mb-16">{p.title}</h3>
                      <p className="mb-24">{p.excerpt}</p>
                      <a className="read-more" onClick={() => navigate("blog-detail")}>Read More <i className="fa-regular fa-arrow-right"></i></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <aside className="sidebar">
                <div className="widget mb-48">
                  <h4 className="h-24 light-black mb-24">Search</h4>
                  <div className="search-widget"><input type="text" placeholder="Search..." className="form-control" /></div>
                </div>
                <div className="widget mb-48">
                  <h4 className="h-24 light-black mb-24">Categories</h4>
                  <ul className="category-list unstyled">
                    <li><a>Hotel News (12)</a></li><li><a>Travel Tips (8)</a></li>
                    <li><a>Local Guide (6)</a></li><li><a>Events (4)</a></li>
                    <li><a>Special Offers (10)</a></li>
                  </ul>
                </div>
                <div className="widget mb-48">
                  <h4 className="h-24 light-black mb-24">Recent Posts</h4>
                  <div className="recent-posts">
                    {blogPosts.slice(0, 3).map((p, i) => (
                      <div key={i} className="recent-post d-flex mb-16">
                        <img src={p.img} alt="" className="recent-thumb" />
                        <div className="recent-info"><h6 className="mb-8">{p.title}</h6><span>{p.month} {p.day}, 2024</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="widget">
                  <h4 className="h-24 light-black mb-24">Tags</h4>
                  <div className="tags">
                    {["Luxury", "Hotel", "Travel", "Spa", "Restaurant", "Booking", "Vacation", "Wellness"].map((t, i) => (
                      <span key={i} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero-sm" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Create Account</h1></div>
      </div>
      <div className="page-section">
        <div className="container">
          <div className="auth-form mx-auto" style={{ maxWidth: 500 }}>
            <form onSubmit={e => e.preventDefault()}>
              <div className="mb-24"><input type="text" placeholder="Full Name" className="form-control" /></div>
              <div className="mb-24"><input type="email" placeholder="Email Address" className="form-control" /></div>
              <div className="mb-24"><input type="password" placeholder="Password" className="form-control" /></div>
              <div className="mb-24"><input type="password" placeholder="Confirm Password" className="form-control" /></div>
              <div className="mb-24 form-check"><input type="checkbox" className="form-check-input" id="terms" /><label htmlFor="terms" className="form-check-label">I agree to Terms &amp; Conditions</label></div>
              <CusBtn label="Create Account" dark />
              <p className="text-center mt-24">Already have an account? <a className="color-primary" onClick={() => navigate("login")}>Sign In</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero-sm" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Sign In</h1></div>
      </div>
      <div className="page-section">
        <div className="container">
          <div className="auth-form mx-auto" style={{ maxWidth: 500 }}>
            <form onSubmit={e => e.preventDefault()}>
              <div className="mb-24"><input type="email" placeholder="Email Address" className="form-control" /></div>
              <div className="mb-24"><input type="password" placeholder="Password" className="form-control" /></div>
              <div className="mb-24 d-flex justify-content-between align-items-center">
                <div className="form-check"><input type="checkbox" className="form-check-input" id="remember" /><label htmlFor="remember" className="form-check-label">Remember Me</label></div>
                <a className="color-primary" onClick={() => navigate("coming-soon")}>Forgot Password?</a>
              </div>
              <CusBtn label="Sign In" dark />
              <p className="text-center mt-24">Don&apos;t have an account? <a className="color-primary" onClick={() => navigate("register")}>Create One</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="coming-soon-section d-flex align-items-center justify-content-center text-center" style={{ minHeight: "60vh" }}>
        <div className="container">
          <h1 className="h-69 light-black mb-24">Coming Soon</h1>
          <p className="mb-32">This feature is under construction. Stay tuned!</p>
          <CusBtn label="Back to Home" onClick={() => navigate("home")} />
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="error-section d-flex align-items-center justify-content-center text-center" style={{ minHeight: "60vh" }}>
        <div className="container">
          <h1 className="h-69 light-black mb-24" style={{ fontSize: 100 }}>404</h1>
          <p className="mb-32">Oops! The page you are looking for does not exist.</p>
          <CusBtn label="Back to Home" onClick={() => navigate("home")} />
        </div>
      </div>
    </div>
  );

  const renderRoomDetail = () => {
    const room = rooms.find(r => r.id === roomId) || rooms[0];
    return (
      <div className="hotel-root">
        <header className={"home-header" + (scrolled ? " scrolled" : "")}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="logo"><a><img src={I.logo} alt="" /></a></div>
            {renderNavLinks()}{renderMobileNav()}{renderSearch()}
          </div>
        </header>
        <div className="page-hero-sm" style={{ background: `url(${room.img}) center/cover no-repeat` }}>
          <div className="overlay" /><div className="content"><h1>{room.name}</h1></div>
        </div>
        <div className="page-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-8">
                <img src={room.img} alt="" className="w-100 mb-32" />
                <div className="room-detail-content">
                  <h2 className="h-53 light-black mb-24">{room.name}</h2>
                  <p className="mb-32">Experience unparalleled luxury in our {room.name}. Each detail has been carefully curated to provide the ultimate comfort and sophistication. From premium bedding to state-of-the-art amenities, every element is designed for your relaxation.</p>
                  <h3 className="h-31 light-black mb-24">Amenities</h3>
                  <ul className="amenities-list unstyled row">
                    <li className="col-md-6 mb-16"><i className="fa-regular fa-circle-check color-primary"></i> King Size Bed</li>
                    <li className="col-md-6 mb-16"><i className="fa-regular fa-circle-check color-primary"></i> 32 Inch LED TV</li>
                    <li className="col-md-6 mb-16"><i className="fa-regular fa-circle-check color-primary"></i> Mini Bar</li>
                    <li className="col-md-6 mb-16"><i className="fa-regular fa-circle-check color-primary"></i> Free WiFi</li>
                    <li className="col-md-6 mb-16"><i className="fa-regular fa-circle-check color-primary"></i> Air Conditioning</li>
                    <li className="col-md-6 mb-16"><i className="fa-regular fa-circle-check color-primary"></i> Room Service 24/7</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="booking-sidebar p-32 bg-light rounded">
                  <h3 className="h-31 light-black mb-16">${room.price}<span className="h-16">/Night</span></h3>
                  <p className="mb-24"><i className="fa-solid fa-star color-primary"></i> 4.9 (93 Reviews)</p>
                  <form onSubmit={e => e.preventDefault()}>
                    <div className="mb-16"><label className="h-18 dark-gray mb-8 d-block">Check In</label><input type="date" className="form-control" /></div>
                    <div className="mb-16"><label className="h-18 dark-gray mb-8 d-block">Check Out</label><input type="date" className="form-control" /></div>
                    <div className="mb-24"><label className="h-18 dark-gray mb-8 d-block">Guests</label><input type="number" className="form-control" min="1" defaultValue={2} /></div>
                    <CusBtn label="Book Now" dark onClick={() => navigate("booking")} />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBlogDetail = () => (
    <div className="hotel-root">
      <header className={"home-header" + (scrolled ? " scrolled" : "")}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo"><a><img src={I.logo} alt="" /></a></div>
          {renderNavLinks()}{renderMobileNav()}{renderSearch()}
        </div>
      </header>
      <div className="page-hero-sm" style={{ background: `url(${I.titleBanner}) center/cover no-repeat` }}>
        <div className="overlay" /><div className="content"><h1>Blog Detail</h1></div>
      </div>
      <div className="page-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <img src={blogPosts[0].img} alt="" className="w-100 mb-32" />
              <h2 className="h-53 light-black mb-24">{blogPosts[0].title}</h2>
              <div className="blog-meta mb-24"><span><i className="fa-regular fa-user"></i> {blogPosts[0].author}</span><span><i className="fa-regular fa-calendar"></i> {blogPosts[0].month} {blogPosts[0].day}, 2024</span><span><i className="fa-regular fa-tag"></i> {blogPosts[0].category}</span></div>
              <p>Lorem ipsum dolor sit amet consectetur. Nec vel arcu mi pulvinar egestas. Libero ut nisi mauris sed. At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget. Lorem ipsum dolor sit amet consectetur. Nec vel arcu mi pulvinar egestas.</p>
              <p className="mt-24">Libero ut nisi mauris sed. At quis nullam duis sed aliquet faucibus. Sed diam pretium cum eget. Lorem ipsum dolor sit amet consectetur. Nec vel arcu mi pulvinar egestas. Libero ut nisi mauris sed. At quis nullam duis sed aliquet faucibus.</p>
            </div>
            <div className="col-lg-4">
              <aside className="sidebar">
                <div className="widget mb-48">
                  <h4 className="h-24 light-black mb-24">Search</h4>
                  <div className="search-widget"><input type="text" placeholder="Search..." className="form-control" /></div>
                </div>
                <div className="widget mb-48">
                  <h4 className="h-24 light-black mb-24">Categories</h4>
                  <ul className="category-list unstyled">
                    <li><a>Hotel News (12)</a></li><li><a>Travel Tips (8)</a></li><li><a>Local Guide (6)</a></li><li><a>Events (4)</a></li><li><a>Special Offers (10)</a></li>
                  </ul>
                </div>
                <div className="widget mb-48">
                  <h4 className="h-24 light-black mb-24">Recent Posts</h4>
                  <div className="recent-posts">
                    {blogPosts.slice(0, 3).map((p, i) => (
                      <div key={i} className="recent-post d-flex mb-16">
                        <img src={p.img} alt="" className="recent-thumb" />
                        <div className="recent-info"><h6 className="mb-8">{p.title}</h6><span>{p.month} {p.day}, 2024</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <footer className="footer">
      <div className="container-fluid">
        <div className="footer-top">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget"><img src={I.logo} alt="" className="footer-logo mb-24" />
                <p>LUXE Hotel offers an unforgettable experience with world-class amenities, exceptional service, and a prime location. Book your stay today and discover true luxury.</p>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="footer-widget"><h4 className="mb-24">Quick Links</h4>
                <ul className="footer-links unstyled">
                  <li><a onClick={() => navigate("about")}>About Us</a></li>
                  <li><a onClick={() => navigate("rooms")}>Our Rooms</a></li>
                  <li><a onClick={() => navigate("restaurant")}>Restaurant</a></li>
                  <li><a onClick={() => navigate("spa")}>Spa &amp; Wellness</a></li>
                  <li><a onClick={() => navigate("gallery")}>Gallery</a></li>
                  <li><a onClick={() => navigate("contact")}>Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget"><h4 className="mb-24">Services</h4>
                <ul className="footer-links unstyled">
                  <li><a onClick={() => navigate("booking")}>Room Booking</a></li>
                  <li><a onClick={() => navigate("offers")}>Special Offers</a></li>
                  <li><a onClick={() => navigate("restaurant")}>Fine Dining</a></li>
                  <li><a onClick={() => navigate("spa")}>Spa &amp; Massage</a></li>
                  <li><a onClick={() => navigate("blog")}>Our Blog</a></li>
                  <li><a onClick={() => navigate("contact")}>Support</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget"><h4 className="mb-24">Contact Info</h4>
                <ul className="footer-contact unstyled">
                  <li><i className="fa-regular fa-location-dot"></i> 123 Luxury Avenue, Beverly Hills, CA</li>
                  <li><i className="fa-regular fa-phone"></i> +1 (555) 123-4567</li>
                  <li><i className="fa-regular fa-envelope"></i> info@luxehotel.com</li>
                </ul>
                <div className="social-links mt-24">
                  <a><i className="fa-brands fa-facebook-f"></i></a>
                  <a><i className="fa-brands fa-instagram"></i></a>
                  <a><i className="fa-brands fa-twitter"></i></a>
                  <a><i className="fa-brands fa-pinterest-p"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 LUXE Hotel. All Rights Reserved.</p>
        </div>
      </div>
      <div className="footer-bg-shape"><img src={I.bgShapeFooter} alt="" /></div>
    </footer>
  );

  return (
    <div id="hotel2-root" className="hotel2-main">
      <style>{`${cssVars}`}</style>

      {preloader && (
        <div className="preloader">
          <div className="preloader-inner">
            <div className="loader" />
            <p className="mt-24">Loading...</p>
          </div>
        </div>
      )}

      {page === "home" && renderHome()}
      {page === "about" && renderAbout()}
      {page === "rooms" && renderRooms()}
      {page === "room-detail" && renderRoomDetail()}
      {page === "restaurant" && renderRestaurant()}
      {page === "spa" && renderSpa()}
      {page === "gallery" && renderGallery()}
      {page === "contact" && renderContact()}
      {page === "booking" && renderBooking()}
      {page === "offers" && renderOffers()}
      {page === "blog" && renderBlog()}
      {page === "blog-detail" && renderBlogDetail()}
      {page === "register" && renderRegister()}
      {page === "login" && renderLogin()}
      {page === "coming-soon" && renderComingSoon()}
      {page === "error" && renderError()}

      {page !== "loading" && renderFooter()}

      {showTop && (
        <div className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <i className="fa-regular fa-arrow-up"></i>
        </div>
      )}

      <div className="whatsapp-chat">
        <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-whatsapp"></i>
        </a>
      </div>
    </div>
  );
}
