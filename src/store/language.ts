import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

export const translations = {
  en: {
    home: "Home",
    shop: "Shop",
    shopAll: "Shop All",
    collections: "Collections",
    categories: "Categories",
    boutique: "Boutique",
    drop: "Drop",
    search: "Search...",
    myAccount: "My Account",
    adminPanel: "Admin Panel",
    signOut: "Sign Out",
    signIn: "Sign In",
    createAccount: "Create Account",
    
    // Storefront General
    addToCart: "Add to Cart",
    cart: "Cart",
    featuredProducts: "Featured Products",
    exploreCollections: "Explore Collections",
    saleOffers: "Sale Offers",
    testimonials: "Testimonials",
    videoSection: "Video",
    marquee: "Announcement",
    aboutUs: "About Us",
    reviews: "Reviews",

    // Admin Sidebar
    overview: "Overview",
    products: "Products",
    orders: "Orders",
    mediaHub: "Media Hub",
    banners: "Banners",
    storeBuilder: "Store Builder",
    siteBuilder: "Site Builder",
    generalSettings: "General Settings",
    siteSettings: "Site Settings",
    platformStores: "Platform Stores",
    templates: "Templates",
    toursPackages: "Tours & Packages",
    bookingInquiries: "Booking Inquiries",
    bannersSliders: "Banners & Sliders",

    // Admin settings tabs and headers
    general: "General",
    theme: "Colors & Style",
    header: "Header & Navigation",
    signature: "Advanced Features",
    tracking: "Pixels & Tracking",
    business: "Shipping & Delivery",
    storeCore: "Store Core",
    masterControl: "Master control for your brand identity and ecosystem.",
    brandMatrix: "Brand Matrix",
    marketIdentity: "Market Identity (Title)",
    enterStoreName: "Enter Store Name",
    seoSignal: "SEO Signal (Description)",
    premiumExperience: "Premium e-commerce experience...",
    signatureLogo: "Signature Logo (Header)",
    browserNode: "Browser Node (Favicon)",
    saveChanges: "Save Changes",
    saving: "Saving...",
    settingsSaved: "Settings saved successfully",
    themeConfiguration: "Theme Configuration",
    primaryColor: "Primary Accent Color",
    logoUpload: "Logo Upload",
    navigationMenu: "Navigation Menu",
    logisticsGrids: "Logistics Grids",
    defineGrid: "Define Grid",
    zoneIdentifier: "Zone Identifier",
    rateValue: "Rate Value",
    livePulse: "Live Pulse Notifications",
    pulseInterval: "Pulse Interval (Seconds)",
    socialProof: "Social Proof Matrix",
    injectReview: "Inject Review",
    identity: "Identity",
    coordinates: "Coordinates",
    reviewContent: "Review Content"
  },
  ar: {
    home: "الرئيسية",
    shop: "المتجر",
    shopAll: "تسوق الكل",
    collections: "التشكيلات",
    categories: "الفئات",
    boutique: "البوتيك",
    drop: "الإصدارات",
    search: "بحث...",
    myAccount: "حسابي",
    adminPanel: "لوحة التحكم",
    signOut: "تسجيل الخروج",
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",

    // Storefront General
    addToCart: "إضافة إلى السلة",
    cart: "سلة التسوق",
    featuredProducts: "المنتجات المميزة",
    exploreCollections: "استكشف المجموعات",
    saleOffers: "عروض التخفيضات",
    testimonials: "آراء العملاء",
    videoSection: "فيديو",
    marquee: "شريط الإعلانات",
    aboutUs: "من نحن",
    reviews: "التقييمات",

    // Admin Sidebar
    overview: "نظرة عامة",
    products: "المنتجات",
    orders: "الطلبات",
    mediaHub: "مكتبة الوسائط",
    banners: "البانرات",
    storeBuilder: "منشئ المتجر",
    siteBuilder: "منشئ الموقع",
    generalSettings: "الإعدادات العامة",
    siteSettings: "إعدادات الموقع",
    platformStores: "متاجر المنصة",
    templates: "القوالب",
    toursPackages: "الرحلات والبرامج",
    bookingInquiries: "طلبات الحجز",
    bannersSliders: "البانرات والشرائح",

    // Admin settings tabs and headers
    general: "عام",
    theme: "الألوان والتصميم",
    header: "الهيدر والتنقل",
    signature: "خصائص متقدمة",
    tracking: "أكواد التتبع",
    business: "الشحن والتوصيل",
    storeCore: "إعدادات المتجر",
    masterControl: "التحكم الكامل في هوية علامتك التجارية ونظامك البيئي.",
    brandMatrix: "بيانات المتجر الأساسية",
    marketIdentity: "اسم المتجر",
    enterStoreName: "أدخل اسم المتجر",
    seoSignal: "وصف المتجر (SEO)",
    premiumExperience: "تجربة تسوق إلكتروني مميزة...",
    signatureLogo: "شعار المتجر (الهيدر)",
    browserNode: "أيقونة المتصفح (Favicon)",
    saveChanges: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    settingsSaved: "تم حفظ الإعدادات بنجاح",
    themeConfiguration: "إعدادات المظهر",
    primaryColor: "اللون الأساسي للمتجر",
    logoUpload: "تحميل الشعار",
    navigationMenu: "قائمة التنقل",
    logisticsGrids: "مناطق وأسعار الشحن",
    defineGrid: "إضافة منطقة شحن",
    zoneIdentifier: "اسم المنطقة (مثال: الشحن المحلي)",
    rateValue: "تكلفة الشحن",
    livePulse: "إشعارات الشراء المباشرة",
    pulseInterval: "الفترة الزمنية بين الإشعارات (بالثواني)",
    socialProof: "آراء العملاء والمراجعات",
    injectReview: "إضافة مراجعة",
    identity: "الاسم",
    coordinates: "الوظيفة أو الموقع",
    reviewContent: "نص المراجعة"
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      t: (key: string) => {
        const lang = get().language;
        // @ts-ignore
        return translations[lang][key] || key;
      }
    }),
    {
      name: 'language-storage',
    }
  )
);
