"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowRight, ArrowLeft, Loader2, Store as StoreIcon, Compass } from "lucide-react";
import { createStoreAction } from "@/app/actions";

export default function CreateStorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    }>
      <CreateStoreForm />
    </Suspense>
  );
}

function CreateStoreForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";
  const [step, setStep] = useState(1);
  const [type, setType] = useState<"STORE" | "WEBSITE">("STORE");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("signature");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const storeTemplates = [
    { id: 'modern1', name: 'Modern 1', desc: 'Bold dark aesthetic, glass UI, and premium motion.', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80' },
    { id: 'modern', name: 'Modern Commerce', desc: 'Clean lines, premium materials, unparalleled comfort.', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80' },
    { id: 'zenith', name: 'Zenith Luxury', desc: 'Cinematic, minimalist, ultra high-end.', img: 'https://images.unsplash.com/photo-1505529848141-144c6747d765?w=400&q=80' },
    { id: 'signature', name: 'Signature Brand', desc: 'A high-end, typography-focused template.', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
    { id: 'dddyou', name: 'DDDYOU Parfumerie', desc: 'عطور فاخرة بتصميم داكن ذهبي، مثالي لمتاجر العطور والمنتجات الفاخرة.', img: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80' },
    { id: 'momo', name: 'MOMO', desc: 'تصميم حديث ومينيمال للمتاجر الصغيرة - بسيط، أنيق، وسهل الاستخدام.', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
    { id: 'senno', name: 'Senno Multipurpose', desc: 'تصميم متعدد الاستخدامات مع لمسات وردية مثالي لمتاجر التجميل والبوتيك.', img: 'https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=400&q=80' },
    { id: '1m', name: '1M', desc: 'أنيق وعصري - مثالي لمتاجر الأزياء والمنتجات الفاخرة مع سلايدر وسيشنز متعددة.', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
    { id: '2m', name: '2M', desc: 'إلكترونيات - تصميم عصري بألوان صفراء وردية مناسب لمتاجر الإلكترونيات والتكنولوجيا.', img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80' },
    { id: 'amazon', name: 'Amazon Marketplace', desc: 'تصميم عالي التحويل مستوحى من الأسواق الكبرى.', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80' }
  ];

  const websiteTemplates = [
    { id: 'ironpeak', name: 'Iron Peak Fitness', desc: 'قوي ومثير - قالب مركز لياقة بدنية متكامل مع هيرو, خدمات, تسعير, مدربين, آراء, مدونة.', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
    { id: 'fitness', name: 'برعي - Sama Fit', desc: 'قالب احترافي لمدربي اللياقة - هيرو, خدمات, تحولات, خطط أسعار, آراء عملاء, التحكم الكامل من لوحة الإعدادات.', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
    { id: 'tourism', name: 'Tourism & Travel Showcase', desc: 'High-definition destination banners, detailed itineraries, and a seamless booking inquiry system.', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
    { id: '11g', name: '11G - IT Agency', desc: 'قالب متكامل لشركات التكنولوجيا وحلول الأعمال - صفحة رئيسية متعددة الأقسام مع جميع الصفحات الداخلية.', img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80' }
  ];

  const templates = type === 'STORE' ? storeTemplates : websiteTemplates;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }

    setIsPending(true);
    setError(null);
    
    try {
      const result = await createStoreAction({ name, slug, template, type, plan });
      if (result.success) {
        router.push(`/store/${slug}/admin/dashboard`);
      } else {
        setError(result.error || "Failed to create site.");
        setStep(2); // Go back to step 2 so they can change the slug
      }
    } catch (err: any) {
      setError(err.message || "Failed to create site. Slug might already be in use.");
      setStep(2);
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-6 py-20 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className={`w-full transition-all duration-500 ${step === 3 ? 'max-w-4xl' : 'max-w-xl'} bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden`}>
        <div className="bg-slate-955/80 p-12 text-center border-b border-white/5">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10">
            {type === 'STORE' ? <StoreIcon className="text-white" size={32} /> : <Compass className="text-white" size={32} />}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2 uppercase">
            {step === 1 && 'What are you building?'}
            {step === 2 && 'Identity & Address'}
            {step === 3 && 'Choose Your Vibe'}
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {step === 1 && 'Select the purpose of your website to customize the experience.'}
            {step === 2 && 'Define your brand name and custom web slug.'}
            {step === 3 && 'Select a highly optimized template to match your style.'}
          </p>
        </div>

        <form onSubmit={handleCreate} className="p-12">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-500/20 mb-6">
              {error}
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-6">
              <div 
                onClick={() => {
                  setType("STORE");
                  setTemplate("signature");
                }}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex gap-5 items-start ${
                  type === "STORE" 
                    ? "border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5 text-white" 
                    : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className={`p-4 rounded-xl ${type === 'STORE' ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-400'} shrink-0`}>
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg mb-1">E-Commerce Store (متجر إلكتروني)</h3>
                  <p className="text-xs text-slate-400 font-medium">Sell physical or digital products, manage dynamic inventories, cart, and orders with standard checkout processes.</p>
                </div>
              </div>

              <div 
                onClick={() => {
                  setType("WEBSITE");
                  setTemplate("tourism");
                }}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex gap-5 items-start ${
                  type === "WEBSITE" 
                    ? "border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/5 text-white" 
                    : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className={`p-4 rounded-xl ${type === 'WEBSITE' ? 'bg-cyan-500 text-white' : 'bg-slate-900 text-slate-400'} shrink-0`}>
                  <Compass size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg mb-1">Tourism & Showcase Site (موقع سياحة وتعريف)</h3>
                  <p className="text-xs text-slate-400 font-medium">Display premium services, high-res travel destination packages, itineraries, and receive custom booking inquiries directly.</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Brand / Website Name</label>
                <input 
                  required
                  type="text" 
                  placeholder={type === 'STORE' ? "e.g. Vintage Apparel" : "e.g. Dream Tour Agency"}
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-white placeholder-slate-600"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug || slug === name.toLowerCase().replace(/ /g, '-')) {
                       setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Website Address URL (Slug)</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-sm">shopora.app/store/</span>
                  <input 
                    required
                    type="text" 
                    placeholder="brand-url-slug"
                    className="flex-1 px-6 py-4 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-white placeholder-slate-600"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${type === 'STORE' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6 mb-10`}>
               {templates.map((t) => (
                 <div 
                   key={t.id}
                   onClick={() => setTemplate(t.id)}
                   className={`relative cursor-pointer group rounded-3xl overflow-hidden border-4 transition-all duration-300 ${template === t.id ? 'border-blue-500 scale-[1.02] shadow-2xl shadow-blue-500/5' : 'border-transparent hover:border-slate-800'}`}
                 >
                    <div className="aspect-[16/10] md:aspect-[4/3] relative">
                      <img src={t.img} alt={t.name} className="object-cover w-full h-full" />
                      <div className={`absolute inset-0 bg-slate-950/70 flex items-center justify-center transition-opacity duration-300 ${template === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="bg-blue-500 text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20">Selected</div>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-950 border-t border-white/5">
                       <h3 className="font-bold text-md text-white">{t.name}</h3>
                       <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">{t.desc}</p>
                       <div className="flex flex-col gap-2">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTemplate(t.id);
                            }}
                            className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all ${template === t.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white'}`}
                          >
                            {template === t.id ? '✓ Selected Theme' : 'Select Theme'}
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button 
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-slate-955 border border-slate-800 text-white py-5 rounded-2xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button 
              disabled={isPending || (step === 2 && (!name || !slug))}
              type="submit"
              className="flex-[2] bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-5 rounded-2xl font-black text-lg hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/10"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>{step === 3 ? 'Launch Site' : 'Continue'} <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
