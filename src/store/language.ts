import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const translations = {
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
