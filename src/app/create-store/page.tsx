"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Loader2, Store as StoreIcon } from "lucide-react";
import { createStoreAction } from "@/app/actions";

export default function CreateStorePage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("signature");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const templates = [
    { id: 'modern', name: 'Modern Commerce', desc: 'Clean lines, premium materials, unparalleled comfort.', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80' },
    { id: 'zenith', name: 'Zenith Luxury', desc: 'Cinematic, minimalist, ultra high-end.', img: 'https://images.unsplash.com/photo-1505529848141-144c6747d765?w=400&q=80' },
    { id: 'signature', name: 'Signature Brand', desc: 'A high-end, typography-focused template.', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' }
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsPending(true);
    setError(null);
    
    try {
      const result = await createStoreAction({ name, slug, template });
      if (result.success) {
        router.push(`/store/${slug}/admin/dashboard`);
      } else {
        setError(result.error || "Failed to create store.");
        setStep(1); // Go back to step 1 so they can change the slug
      }
    } catch (err: any) {
      setError(err.message || "Failed to create store. Slug might already be in use.");
      setStep(1);
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-20">
      <div className={`w-full transition-all duration-500 ${step === 1 ? 'max-w-md' : 'max-w-4xl'} bg-white rounded-[2.5rem] shadow-2xl overflow-hidden`}>
        <div className="bg-slate-900 p-12 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <StoreIcon size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            {step === 1 ? 'Build Your Store' : 'Choose Your Vibe'}
          </h1>
          <p className="text-slate-400">
            {step === 1 ? 'Create your unique brand identity in seconds.' : 'Select a template that matches your brand style.'}
          </p>
        </div>

        <form onSubmit={handleCreate} className="p-12">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 mb-6">
              {error}
            </div>
          )}
          
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Store Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Vintage Goods"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-2xl outline-none transition-all font-medium"
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
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Store URL (Slug)</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">multo.com/store/</span>
                  <input 
                    required
                    type="text" 
                    placeholder="your-store-name"
                    className="flex-1 px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''))}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
               {templates.map((t) => (
                 <div 
                   key={t.id}
                   onClick={() => setTemplate(t.id)}
                   className={`relative cursor-pointer group rounded-3xl overflow-hidden border-4 transition-all duration-300 ${template === t.id ? 'border-slate-900 scale-105 shadow-xl' : 'border-transparent hover:border-slate-200'}`}
                 >
                    <div className="aspect-[4/5] relative">
                      <img src={t.img} alt={t.name} className="object-cover w-full h-full" />
                      <div className={`absolute inset-0 bg-slate-900/40 flex items-center justify-center transition-opacity ${template === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs uppercase">Selected</div>
                      </div>
                    </div>
                    <div className="p-4 bg-white border-t">
                       <h3 className="font-bold text-sm text-slate-900">{t.name}</h3>
                       <p className="text-[10px] text-slate-500 mt-1 mb-4">{t.desc}</p>
                       <div className="flex flex-col gap-2">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTemplate(t.id);
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${template === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {template === t.id ? '✓ Selected' : 'Select'}
                          </button>
                          <Link 
                            href={`/preview/${t.id}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-2 rounded-xl text-[10px] font-bold text-center border-2 border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all uppercase tracking-widest"
                          >
                            Live Preview
                          </Link>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          <div className="flex gap-4 mt-10">
            {step === 2 && (
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-100 text-slate-900 py-5 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Back
              </button>
            )}
            <button 
              disabled={isPending || !name || !slug}
              type="submit"
              className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>{step === 1 ? 'Next Step' : 'Launch Store'} <ArrowRight /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
