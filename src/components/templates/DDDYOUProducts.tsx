"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80",
  "https://images.unsplash.com/photo-1590736969955-71cc949011c0?w=400&q=80",
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
  "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
  "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&q=80",
  "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=400&q=80",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
  "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&q=80",
];

interface DDDYOUProductsProps {
  products: any[];
  slug: string;
  store: any;
  category?: string;
  pageTitle: string;
  pageDescription: string;
}

export default function DDDYOUProducts({ products, slug, store, category: initialCategory, pageTitle, pageDescription }: DDDYOUProductsProps) {
  const [filter, setFilter] = useState(initialCategory || 'all');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const storeName = store?.name || 'DDDYOU';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = filter === 'all' ? products : products.filter((p: any) => {
    const catId = store.categories?.find((c: any) => c.name?.toLowerCase() === filter)?.id;
    return catId ? p.category_id === catId : p.category_id === filter;
  });

  const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const addToCart = (product: any) => {
    setCartItems((prev: any[]) => {
      const existing = prev.find((i: any) => i.id === product.id);
      if (existing) return prev.map((i: any) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1, image: product.images?.[0] || PRODUCT_IMAGES[0] }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) setCartItems((prev: any[]) => prev.filter((i: any) => i.id !== productId));
    else setCartItems((prev: any[]) => prev.map((i: any) => i.id === productId ? { ...i, quantity: qty } : i));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0f0f1a] text-white font-['Tajawal']">
      <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f0f1a]/95 backdrop-blur-xl shadow-2xl py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href={`/store/${slug}`} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#c87a36] flex items-center justify-center text-[#0f0f1a] shadow-lg">
              <i className="fas fa-gem text-xl"></i>
            </div>
            <div>
              <h1 className="font-['Alex_Brush'] text-2xl text-[#c9a96e] leading-none tracking-wider">{storeName}</h1>
              <p className="text-[0.6rem] text-gray-500 uppercase tracking-widest font-light">Parfumerie de Luxe</p>
            </div>
          </Link>
          <nav className={`${menuOpen ? 'fixed inset-0 z-40 bg-[#1a1a2e] flex flex-col items-center justify-center' : 'hidden'} md:flex md:static md:bg-transparent`}>
            <ul className={`${menuOpen ? 'flex-col gap-8 text-2xl' : 'hidden md:flex'} flex md:flex-row gap-8 items-center`}>
              <li><Link href={`/store/${slug}`} className="text-white/70 hover:text-[#c9a96e] transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#c9a96e] after:w-0 hover:after:w-full after:transition-all">الرئيسية</Link></li>
              <li><Link href={`/store/${slug}#about`} className="text-white/70 hover:text-[#c9a96e] transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#c9a96e] after:w-0 hover:after:w-full after:transition-all">عن العلامة</Link></li>
              <li><Link href={`/store/${slug}/products`} className="text-[#c9a96e] font-bold relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#c9a96e] after:w-full">منتجاتنا</Link></li>
              <li><Link href={`/store/${slug}#testimonials`} className="text-white/70 hover:text-[#c9a96e] transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#c9a96e] after:w-0 hover:after:w-full after:transition-all">آراء العملاء</Link></li>
              <li><Link href={`/store/${slug}/products`} className="text-[#c9a96e] font-bold relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#c9a96e] after:w-full">NO</Link></li>
              <li><Link href={`/store/${slug}#contact`} className="text-white/70 hover:text-[#c9a96e] transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#c9a96e] after:w-0 hover:after:w-full after:transition-all">اتصل بنا</Link></li>
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

      {/* Page Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0a0a14] relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9a96e\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '60px 60px' }} />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 text-sm text-white/40 mb-6">
            <Link href={`/store/${slug}`} className="hover:text-[#c9a96e] transition-colors">الرئيسية</Link>
            <i className="fas fa-chevron-left text-[0.5rem]"></i>
            <span className="text-[#c9a96e]">{pageTitle}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4" dangerouslySetInnerHTML={{ __html: pageTitle.replace(/DDDYOU - /, '').replace(/فاخرة/, '<span class="text-[#c9a96e]">فاخرة</span>') }} />
          <p className="text-white/50 text-lg max-w-xl mx-auto">{pageDescription}</p>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-3 flex-wrap mb-12">
            {[
              { key: 'all', label: 'الجميع' },
              ...(store.categories || []).map((cat: any) => ({ key: cat.id, label: cat.name })),
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-7 py-2.5 rounded-full border transition-all text-sm font-medium ${filter === f.key ? 'bg-[#c9a96e] text-[#0f0f1a] border-[#c9a96e]' : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'}`}>{f.label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-32">
              <i className="fas fa-search text-5xl text-white/10 mb-6"></i>
              <h3 className="text-2xl font-bold text-white mb-2">لا توجد منتجات</h3>
              <p className="text-white/40 mb-6">لا توجد منتجات في هذه الفئة حالياً</p>
              <button onClick={() => setFilter('all')} className="px-8 py-3 rounded-full bg-[#c9a96e] text-[#0f0f1a] font-bold">عرض الكل</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map((product: any, idx: number) => (
                <div key={product.id} className="bg-[#1a1a2e] rounded-2xl overflow-hidden border border-white/5 hover:border-[#c9a96e]/20 hover:-translate-y-2 transition-all group">
                  <div className="relative h-[280px] overflow-hidden">
                    <SmartImage src={product.images?.[0] || PRODUCT_IMAGES[idx % PRODUCT_IMAGES.length]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                    {product.discount_price && (
                      <span className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-[#c87a36] text-white">خصم</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-white/40 text-xs mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discount_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-extrabold text-[#c9a96e]">{product.discount_price.toLocaleString('ar-SA')} ر.س</span>
                            <span className="text-sm text-white/30 line-through">{product.price.toLocaleString('ar-SA')} ر.س</span>
                          </div>
                        ) : (
                          <span className="text-lg font-extrabold text-[#c9a96e]">{product.price.toLocaleString('ar-SA')} ر.س</span>
                        )}
                      </div>
                      <button onClick={() => addToCart({ ...product, image: product.images?.[0] || PRODUCT_IMAGES[idx % PRODUCT_IMAGES.length] })}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9a96e] text-[#c9a96e] text-xs font-semibold hover:bg-[#c9a96e] hover:text-[#0f0f1a] transition-all">
                        <i className="fas fa-shopping-bag"></i> أضف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: 'fa-truck', title: 'شحن عالمي مجاني', desc: 'للطلبات فوق ٥٠٠ ر.س' },
            { icon: 'fa-shield-alt', title: 'منتج أصلي ١٠٠٪', desc: 'ضمان استعادة الأموال لمدة ٣٠ يوماً' },
            { icon: 'fa-gem', title: 'تغليف فاخر', desc: 'كل زجاجة في صندوق هدية فاخر' },
            { icon: 'fa-headset', title: 'دعم على مدار الساعة', desc: 'فريق متخصص لخدمتك' },
          ].map(f => (
            <div key={f.title} className="text-center p-6 bg-[#25253e] rounded-2xl border border-white/5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c9a96e]/20 to-[#c87a36]/10 flex items-center justify-center mx-auto mb-4 text-[#c9a96e] text-xl">
                <i className={`fas ${f.icon}`}></i>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cart */}
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
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-[#25253e] rounded-xl">
                  <SmartImage src={item.image} className="w-[70px] h-[70px] rounded-lg object-cover" alt={item.name} />
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-semibold mb-1">{item.name}</h4>
                    <p className="text-[#c9a96e] font-bold text-sm">{item.price.toLocaleString('ar-SA')} ر.س</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-white/10 text-white text-sm hover:bg-white/10">−</button>
                      <span className="text-white font-semibold text-sm w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-white/10 text-white text-sm hover:bg-white/10">+</button>
                    </div>
                  </div>
                  <button onClick={() => setCartItems((prev: any[]) => prev.filter((i: any) => i.id !== item.id))} className="text-white/30 hover:text-red-400"><i className="fas fa-trash"></i></button>
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
              {[['الرئيسية', ''], ['عن العلامة', '#about'], ['المنتجات', '/products'], ['اتصل بنا', '#contact']].map(([l, p]) => (
                <li key={l}><Link href={`/store/${slug}${p}`} className="text-white/50 text-sm hover:text-[#c9a96e] hover:pr-1 transition-all">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">المجموعات</h4>
            <ul className="space-y-3">
              {(store.categories || []).map((cat: any) => (
                <li key={cat.id}>
                  <button onClick={() => setFilter(cat.id)} className="text-white/50 text-sm hover:text-[#c9a96e] hover:pr-1 transition-all">{cat.name}</button>
                </li>
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
              <i className="fab fa-cc-visa"></i><i className="fab fa-cc-mastercard"></i><i className="fab fa-cc-amex"></i><i className="fab fa-cc-paypal"></i><i className="fab fa-cc-apple-pay"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}