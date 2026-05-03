export interface StoreSettings {
  storeName: string;
  colorSystem?: {
    backgrounds: {
      home: string;
      shop: string;
      categories: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    brand: {
      primary: string;
    };
    footer: {
      background: string;
      text: string;
    };
    product: {
      price: string;
      salePrice: string;
    };
    testimonial?: {
      background: string;
      text: string;
    };
  };
  homepageLayout?: any[];
  categoriesLayout: 'grid' | 'list';
  categoryLayout?: {
    home?: 'grid' | 'scroll' | 'bento' | 'list' | 'circles';
    collections?: 'grid' | 'scroll' | 'bento' | 'list' | 'circles';
  };
  productsLayout: 'static' | 'carousel';
  bannerSettings: BannerSettings;
  marqueeSettings: {
    enabled: boolean;
    items: { id: string; text: string; }[];
    backgroundColor: string;
    textColor: string;
    speed: number;
  };
  logoUrl?: string;
  contactInfo?: {
    phone: string;
    email: string;
    address: string;
    whatsapp?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
  signatureSettings?: {
    testimonials?: {
      id?: string;
      name: string;
      role: string;
      content: string;
      avatar?: string;
    }[];
    brandLogos?: string[];
    liveSales?: {
      enabled: boolean;
      interval: number;
    };
    testimonialInterval?: number;
  };
  businessSettings?: {
    shippingRates?: {
      zone: string;
      rate: number;
    }[];
    paymentKeys?: {
      stripePublicKey?: string;
      paypalClientId?: string;
    };
  };
  facebookPixelId?: string;
  tiktokPixelId?: string;
  snapchatPixelId?: string;
  googleAnalyticsId?: string;
  footerMinimalDesc?: string;
  footerAppleDisclaimer1?: string;
  footerAppleDisclaimer2?: string;
  footerAppleCopyright?: string;
  footerMarketingTitle?: string;
  footerMarketingDesc?: string;
  footerLuxuryAddress1?: string;
  footerLuxuryAddress2?: string;
  [key: string]: any; 
}

export interface BannerSettings {
  autoPlay: boolean;
  interval: number; // in milliseconds
  transition: 'slide' | 'fade';
  showArrows: boolean;
  showDots: boolean;
}

export interface Banner {
  id: string;
  storeId: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  position: string;
}

export interface Category {
  id: string;
  storeId: string; // Linked to the store
  name: string;
  description: string | null;
  image: string;
  created_at?: string;
}

export interface Product {
  id: string;
  storeId: string; // Linked to the store
  name: string;
  description: string | null;
  category_id: string;
  price: number;
  discount_price: number | null;
  sizes: any;
  colors: any;
  images: any;
  stock_quantity: number;
  status: string;
  created_at?: any;
}

export interface CartItem {
  id: string; // unique id for cart item (product_id + size + color)
  storeId: string; // Linked to the store
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}
