"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";

interface DDDYOUProduct {
  id: number;
  name: string;
  category: string;
  categoryAr: string;
  price: number;
  oldPrice: number | null;
  badge: string | null;
  badgeClass: string;
  image: string;
  description: string;
}

const DEFAULT_PRODUCTS: DDDYOUProduct[] = [
  { id: 1, name: 'DDDYOU Noir Intense', category: 'oriental', categoryAr: 'شرقية', price: 890, oldPrice: 1090, badge: 'الأكثر مبيعاً', badgeClass: 'best-seller', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80', description: 'مزيج غامض من العود الأسود والمسك والعنبر.' },
  { id: 2, name: 'DDDYOU Oud Royal', category: 'woody', categoryAr: 'خشبية', price: 1250, oldPrice: null, badge: 'جديد', badgeClass: 'new', image: 'https://images.unsplash.com/photo-1590736969955-71cc949011c0?w=400&q=80', description: 'عود ملكي نادر من كمبوديا مع لمسات من الزعفران.' },
  { id: 3, name: 'DDDYOU Jasmine D\'Or', category: 'floral', categoryAr: 'زهرية', price: 750, oldPrice: 950, badge: null, badgeClass: '', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80', description: 'ياسمين غراس الفاخر ممزوج بورود بلغاريا.' },
  { id: 4, name: 'DDDYOU Aqua Breeze', category: 'fresh', categoryAr: 'منعشة', price: 680, oldPrice: null, badge: null, badgeClass: '', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80', description: 'نسيم البحر الأبيض المتوسط مع الحمضيات المنعشة.' },
  { id: 5, name: 'DDDYOU Amber Mystique', category: 'oriental', categoryAr: 'شرقية', price: 980, oldPrice: null, badge: 'الأكثر مبيعاً', badgeClass: 'best-seller', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80', description: 'عنبر دافئ مع الفانيليا والتوابل الشرقية.' },
  { id: 6, name: 'DDDYOU Cedar & Sage', category: 'woody', categoryAr: 'خشبية', price: 720, oldPrice: 820, badge: null, badgeClass: '', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80', description: 'أرز أطلسي مع مريمية برية وخشب الصندل الكريمي.' },
  { id: 7, name: 'DDDYOU Rose Éternelle', category: 'floral', categoryAr: 'زهرية', price: 850, oldPrice: null, badge: 'جديد', badgeClass: 'new', image: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&q=80', description: 'وردة بلغارية أبدية مع مسك أبيض وخشب الصندل.' },
  { id: 8, name: 'DDDYOU Citrus Splash', category: 'fresh', categoryAr: 'منعشة', price: 590, oldPrice: null, badge: null, badgeClass: '', image: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=400&q=80', description: 'مزيج منعش من البرغموت والجريب فروت والليمون.' },
  { id: 9, name: 'DDDYOU Musk Al White', category: 'oriental', categoryAr: 'شرقية', price: 1100, oldPrice: 1350, badge: 'خصم خاص', badgeClass: '', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80', description: 'مسك أبيض نقي من جبال الهيمالايا مع العنبر الذهبي.' },
];

const COLORS = {
  gold: '#c9a96e',
  dark: '#0f0f1a',
  dark2: '#1a1a2e',
  dark3: '#25253e',
};

export default function DDDYOUTemplate({ banners, settings, products: storeProducts, slug, categories }: any) {
  const storeName = settings?.storeName || 'DDDYOU';
  const [filter, setFilter] = useState('all');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<DDDYOUProduct | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [counterVals, setCounterVals] = useState({ perfumes: 0, clients: 0, awards: 0 });

  const displayProducts = DEFAULT_PRODUCTS;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = filter === 'all' ? displayProducts : displayProducts.filter(p => p.category === filter);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!countersAnimated) {
      const targets = { perfumes: 50, clients: 15000, awards: 25 };
      const duration = 2000;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setCounterVals({
          perfumes: Math.ceil(progress * targets.perfumes),
          clients: Math.ceil(progress * targets.clients),
          awards: Math.ceil(progress * targets.awards),
        });
        if (progress < 1) requestAnimationFrame(animate);
        else setCountersAnimated(true);
      };
      const timer = setTimeout(animate, 500);
      return () => clearTimeout(timer);
    }
  }, [countersAnimated]);

  const addToCart = (product: DDDYOUProduct) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== productId));
    } else {
      setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity: qty } : i));
    }
  };

  const Section = ({ children, className = '', id }: any) => (
    <section id={id} className={`py-24 relative ${className}`}>{children}</section>
  );

  const SectionHeader = ({ subtitle, title }: { subtitle: string; title: any }) => (
    <div className="text-center mb-16">
      <p className="font-['Alex_Brush'] text-[#c9a96e] text-2xl mb-2 tracking-wider">{subtitle}</p>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
      <div className="flex items-center justify-center gap-3 text-[#c9a96e]">
        <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a96e]" />
        <i className="text-lg">✦</i>
        <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a96e]" />
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#0f0f1a] text-white font-['Tajawal'] overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f0f1a]/95 backdrop-blur-xl shadow-2xl py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#c87a36] flex items-center justify-center text-[#0f0f1a] shadow-lg">
              <i className="fas fa-gem text-xl"></i>
            </div>
            <div>
              <h1 className="font-['Alex_Brush'] text-2xl text-[#c9a96e] leading-none tracking-wider">{storeName}</h1>
              <p className="text-[0.6rem] text-gray-500 uppercase tracking-widest font-light">Parfumerie de Luxe</p>
            </div>
          </div>
          <nav className={`${menuOpen ? 'fixed inset-0 z-40 bg-[#1a1a2e] flex flex-col items-center justify-center' : 'hidden'} md:flex md:static md:bg-transparent`}>
            <ul className={`${menuOpen ? 'flex-col gap-8 text-2xl' : 'hidden md:flex'} flex md:flex-row gap-8 items-center`}>
              {['الرئيسية', 'عن العلامة', 'مجموعتنا', 'آراء العملاء', 'اتصل بنا'].map((item, i) => (
                <li key={item}><a href={`#${['hero', 'about', 'products', 'testimonials', 'contact'][i]}`} onClick={() => setMenuOpen(false)}
                  className="text-white/70 hover:text-[#c9a96e] transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#c9a96e] after:w-0 hover:after:w-full after:transition-all">{item}</a></li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setCartOpen(true)} className="relative text-white hover:text-[#c9a96e] transition-colors text-xl">
              <i className="fas fa-shopping-bag"></i>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#c9a96e] text-[#0f0f1a] text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
              <span className={`block w-7 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-7 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-7 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <Section id="hero" className="min-h-screen flex items-center bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0a0a14]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9a96e\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '60px 60px' }} />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 pt-32">
          <span className="inline-block px-6 py-2 border border-[#c9a96e] rounded-full text-[#c9a96e] text-xs tracking-widest uppercase mb-8 animate-fadeIn">Édition Limitée</span>
          <h2 className="mb-6">
            <span className="block text-6xl md:text-7xl font-black text-white leading-tight">رَائِحَةٌ تَرْوِي</span>
            <span className="block font-['Alex_Brush'] text-6xl md:text-7xl text-[#c9a96e] font-normal mt-2" style={{ textShadow: '0 0 60px rgba(201,169,110,0.3)' }}>حِكَايَتَكَ</span>
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">عطور تجمع بين أصالة الشرق ورقي الغرب، crafted لكل لحظة لا تُنسى</p>
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <a href="#products" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#b8923e] text-[#0f0f1a] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">اكتشف المجموعة</a>
            <a href="#about" className="inline-flex items-center gap-2 px-10 py-4 rounded-full border-2 border-[#c9a96e] text-white font-bold hover:bg-[#c9a96e] hover:text-[#0f0f1a] transition-all">اقرأ قصتنا</a>
          </div>
          <div className="flex justify-center gap-16 flex-wrap">
            {[
              { num: counterVals.perfumes, suffix: '+', label: 'عطر فاخر' },
              { num: counterVals.clients.toLocaleString('ar-SA'), suffix: '+', label: 'عميل سعيد' },
              { num: counterVals.awards, suffix: '+', label: 'جائزة دولية' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-5xl font-black text-[#c9a96e]">{s.num}<span className="text-3xl">{s.suffix}</span></div>
                <p className="text-white/50 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* About */}
      <Section id="about" className="bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader subtitle="Notre Histoire" title={<>فن العطر منذ <span className="text-[#c9a96e]">١٨٩٢</span></>} />
            <p className="text-white/70 mb-5 leading-relaxed">في DDDYOU، نؤمن أن العطر ليس مجرد منتج، بل هو بصمة لا تُمحى، وجسر بين الذاكرة والحواس. منذ أكثر من قرن، ونحن نصنع روائح استثنائية تروي قصصاً لا تُنسى.</p>
            <p className="text-white/70 mb-6 leading-relaxed">ننتقي أجود المكونات الطبيعية من أقاصي العالم: زهر الياسمين من غراس، خشب العود من كمبوديا، والمسك الأبيض من جبال الهيمالايا. كل زجاجة تُعبَّأ يدوياً بشغف وإتقان.</p>
            <div className="border-t border-[#c9a96e]/20 pt-5 mt-5">
              <p className="font-['Alex_Brush'] text-[#c9a96e] text-xl">— المؤسس: رايد صالح</p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden relative z-10">
              <SmartImage src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80" className="w-full h-[450px] object-cover rounded-2xl" alt="Perfume Creation" />
            </div>
            <div className="absolute top-5 -right-5 -bottom-5 -left-5 border-2 border-[#c9a96e]/30 rounded-2xl -z-0" />
          </div>
        </div>
      </Section>

      {/* Products */}
      <Section id="products">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Notre Collection" title={<>مجموعتنا <span className="text-[#c9a96e]">الفاخرة</span></>} />
          <div className="flex justify-center gap-3 flex-wrap mb-10">
            {[{ key: 'all', label: 'الجميع' }, { key: 'oriental', label: 'شرقية' }, { key: 'woody', label: 'خشبية' }, { key: 'floral', label: 'زهرية' }, { key: 'fresh', label: 'منعشة' }].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-7 py-2.5 rounded-full border transition-all text-sm font-medium ${filter === f.key ? 'bg-[#c9a96e] text-[#0f0f1a] border-[#c9a96e]' : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'}`}>{f.label}</button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
              <div key={p.id} className="bg-[#1a1a2e] rounded-2xl overflow-hidden border border-white/5 hover:border-[#c9a96e]/20 hover:-translate-y-2 transition-all group">
                <div className="relative h-[300px] overflow-hidden">
                  <SmartImage src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                  {p.badge && <span className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase ${p.badgeClass === 'best-seller' ? 'bg-[#c87a36] text-white' : p.badgeClass === 'new' ? 'bg-[#d4a0a0] text-[#0f0f1a]' : 'bg-[#c9a96e] text-[#0f0f1a]'}`}>{p.badge}</span>}
                </div>
                <div className="p-6">
                  <p className="text-[#c9a96e] text-xs uppercase tracking-widest mb-1">{p.categoryAr}</p>
                  <h3 className="text-lg font-bold text-white mb-2">{p.name}</h3>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-[#c9a96e]">{p.price.toLocaleString('ar-SA')} ر.س</span>
                      {p.oldPrice && <span className="text-sm text-white/30 line-through mr-2">{p.oldPrice.toLocaleString('ar-SA')} ر.س</span>}
                    </div>
                    <button onClick={() => addToCart(p)} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c9a96e] text-[#c9a96e] text-sm font-semibold hover:bg-[#c9a96e] hover:text-[#0f0f1a] transition-all">
                      <i className="fas fa-shopping-bag"></i> أضف للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section className="bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: 'fa-truck', title: 'شحن عالمي مجاني', desc: 'للطلبات فوق ٥٠٠ ر.س مع تغليف هدايا فاخر' },
            { icon: 'fa-shield-alt', title: 'منتج أصلي ١٠٠٪', desc: 'ضمان استعادة الأموال لمدة ٣٠ يوماً' },
            { icon: 'fa-gem', title: 'تغليف فاخر', desc: 'كل زجاجة تُقدم في صندوق هدية فاخر' },
            { icon: 'fa-headset', title: 'دعم على مدار الساعة', desc: 'فريق متخصص لخدمتك في أي وقت' },
          ].map(f => (
            <div key={f.title} className="text-center p-8 bg-[#25253e] rounded-2xl border border-white/5 hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a96e]/20 to-[#c87a36]/10 flex items-center justify-center mx-auto mb-5 text-[#c9a96e] text-2xl">
                <i className={`fas ${f.icon}`}></i>
              </div>
              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Témoignages" title={<>ماذا يقولون <span className="text-[#c9a96e]">عنا</span></>} />
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {[
              { name: 'نورة السعد', role: 'عميلة دائمة', img: 'https://randomuser.me/api/portraits/women/44.jpg', text: '"عطر DDDYOU Noir هو ببساطة الأفضل. ثباته يدوم لأكثر من ١٢ ساعة ورائحته تأسر القلوب. أنصح به بشدة."' },
              { name: 'خالد المنصور', role: 'خبير عطور', img: 'https://randomuser.me/api/portraits/men/32.jpg', text: '"التغليف الفاخر والاهتمام بالتفاصيل جعل تجربة الشراء لا تُنسى. العطر أصلي ١٠٠٪ ويدوم طويلاً."' },
              { name: 'لينا الفهد', role: 'جامعة عطور', img: 'https://randomuser.me/api/portraits/women/68.jpg', text: '"مجموعة العود عند DDDYOU لا تُضاهى. كل زجاجة قطعة فنية بحد ذاتها."' },
              { name: 'سامي الحربي', role: 'زبون مميز', img: 'https://randomuser.me/api/portraits/men/46.jpg', text: '"اشتريت هدية لزوجتي من DDDYOU، كانت سعيدة جداً. العطر فخم والخدمة ممتازة."' },
            ].map(t => (
              <div key={t.name} className="min-w-[320px] md:min-w-[380px] shrink-0 snap-start bg-[#1a1a2e] rounded-2xl p-9 border border-white/5">
                <div className="text-[#c9a96e] mb-4 tracking-widest">★★★★★</div>
                <p className="text-white/70 italic leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} className="w-12 h-12 rounded-full object-cover border-2 border-[#c9a96e]/30" alt={t.name} />
                  <div>
                    <h4 className="text-white font-semibold">{t.name}</h4>
                    <span className="text-white/40 text-sm">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact / Newsletter */}
      <Section id="contact" className="bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-right">
              <p className="font-['Alex_Brush'] text-[#c9a96e] text-2xl mb-2">Restons en Contact</p>
              <h2 className="text-4xl font-bold text-white mb-4">تواصل <span className="text-[#c9a96e]">معنا</span></h2>
              <div className="flex items-center justify-end gap-3 text-[#c9a96e] mb-6">
                <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a96e]" />
                <i className="text-lg">✦</i>
                <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a96e]" />
              </div>
            </div>
            <p className="text-white/60 mb-6">اشترك في نشرتنا البريدية ليصلك كل جديد عن إصداراتنا الحصرية والعروض الخاصة</p>
            <div className="flex rounded-full overflow-hidden max-w-md border border-[#c9a96e]/20">
              <button className="px-8 py-4 bg-gradient-to-r from-[#c9a96e] to-[#b8923e] text-[#0f0f1a] font-bold text-sm">اشتراك</button>
              <input type="email" placeholder="أدخل بريدك الإلكتروني" className="flex-1 px-5 py-4 bg-[#25253e] text-white outline-none text-sm" />
            </div>
            <div className="flex gap-4 mt-8">
              {['fa-instagram', 'fa-facebook-f', 'fa-twitter', 'fa-snapchat-ghost', 'fa-tiktok'].map(icon => (
                <a key={icon} href="#" className="w-12 h-12 rounded-full bg-[#25253e] flex items-center justify-center text-white/50 hover:bg-[#c9a96e] hover:text-[#0f0f1a] transition-all text-xl border border-white/5">
                  <i className={`fab ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <SmartImage src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&q=80" className="w-full h-[500px] object-cover rounded-2xl" alt="Perfume Bottle" />
          </div>
        </div>
      </Section>

      {/* Cart Sidebar */}
      {cartOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setCartOpen(false)} />}
      <div className={`fixed top-0 left-0 h-full w-[400px] max-w-full bg-[#1a1a2e] z-50 border-l border-white/5 flex flex-col transition-transform duration-300 ${cartOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white">سلة التسوق</h3>
          <button onClick={() => setCartOpen(false)} className="text-white/50 hover:text-[#c9a96e] transition-colors text-xl"><i className="fas fa-times"></i></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-shopping-bag text-5xl text-white/10 mb-4"></i>
              <p className="text-white mb-1">سلتك فارغة</p>
              <span className="text-white/40 text-sm">تصفح مجموعتنا وأضف ما يعجبك</span>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-[#25253e] rounded-xl">
                  <img src={item.image} className="w-[70px] h-[70px] rounded-lg object-cover" alt={item.name} />
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-semibold mb-1">{item.name}</h4>
                    <p className="text-[#c9a96e] font-bold text-sm">{item.price.toLocaleString('ar-SA')} ر.س</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-white/10 text-white text-sm hover:bg-white/10 transition-colors">−</button>
                      <span className="text-white font-semibold text-sm w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-white/10 text-white text-sm hover:bg-white/10 transition-colors">+</button>
                    </div>
                  </div>
                  <button onClick={() => setCartItems(prev => prev.filter(i => i.id !== item.id))} className="text-white/30 hover:text-red-400 transition-colors"><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold">المجموع:</span>
              <span className="text-[#c9a96e] text-xl font-bold">{cartTotal.toLocaleString('ar-SA')} ر.س</span>
            </div>
            <button className="w-full py-4 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#b8923e] text-[#0f0f1a] font-bold">إتمام الشراء</button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-[#1a1a2e] rounded-2xl p-10 max-w-3xl w-[90%] max-h-[80vh] overflow-y-auto border border-[#c9a96e]/10 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-[#c9a96e] hover:text-[#0f0f1a] transition-all flex items-center justify-center"><i className="fas fa-times"></i></button>
            <div className="grid md:grid-cols-2 gap-8">
              <SmartImage src={quickViewProduct.image} className="w-full h-[400px] object-cover rounded-xl" alt={quickViewProduct.name} />
              <div>
                <p className="text-[#c9a96e] text-xs uppercase tracking-widest mb-2">{quickViewProduct.categoryAr}</p>
                <h3 className="text-2xl font-bold text-white mb-4">{quickViewProduct.name}</h3>
                <p className="text-white/60 leading-relaxed mb-6">{quickViewProduct.description}</p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-3xl font-extrabold text-[#c9a96e]">{quickViewProduct.price.toLocaleString('ar-SA')} ر.س</span>
                  {quickViewProduct.oldPrice && <span className="text-lg text-white/30 line-through">{quickViewProduct.oldPrice.toLocaleString('ar-SA')} ر.س</span>}
                </div>
                <button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }} className="w-full py-4 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#b8923e] text-[#0f0f1a] font-bold flex items-center justify-center gap-2">
                  <i className="fas fa-shopping-bag"></i> أضف للسلة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 py-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#c87a36] flex items-center justify-center text-[#0f0f1a]"><i className="fas fa-gem"></i></div>
              <div>
                <h2 className="font-['Alex_Brush'] text-xl text-[#c9a96e]">{storeName}</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Parfumerie de Luxe</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">عطور تجمع بين الرقي والأصالة، تُصنع بشغف منذ ١٨٩٢</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              {['الرئيسية', 'عن العلامة', 'المجموعة', 'المدونة', 'اتصل بنا'].map(l => (
                <li key={l}><a href="#" className="text-white/50 text-sm hover:text-[#c9a96e] hover:pr-1 transition-all">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">خدمة العملاء</h4>
            <ul className="space-y-3">
              {['الشحن والتوصيل', 'سياسة الإرجاع', 'الأسئلة الشائعة', 'حجم العطر', 'خريطة الموقع'].map(l => (
                <li key={l}><a href="#" className="text-white/50 text-sm hover:text-[#c9a96e] hover:pr-1 transition-all">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">معلومات الاتصال</h4>
            <div className="space-y-3 text-white/50 text-sm">
              <p className="flex items-center gap-2"><i className="fas fa-map-marker-alt text-[#c9a96e] w-5"></i> الرياض، المملكة العربية السعودية</p>
              <p className="flex items-center gap-2"><i className="fas fa-phone text-[#c9a96e] w-5"></i> +٩٦٦ ٥٥٥ ٢٢٢ ٣٣٣</p>
              <p className="flex items-center gap-2"><i className="fas fa-envelope text-[#c9a96e] w-5"></i> info@dddyou.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">&copy; ٢٠٢٦ {storeName}. جميع الحقوق محفوظة.</p>
            <div className="flex gap-3 text-2xl text-white/30">
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-amex"></i>
              <i className="fab fa-cc-paypal"></i>
              <i className="fab fa-cc-apple-pay"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}