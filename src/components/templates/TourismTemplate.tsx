"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Star, Quote } from "lucide-react";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";
import ReviewForm from "@/components/templates/ReviewForm";
import { useLanguageStore } from "@/store/language";

interface LandingTemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function TourismTemplate({
  banners,
  settings,
  products,
  slug,
  categories
}: LandingTemplateProps) {
  const { t } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  const defaultLayout = [
    { id: 'sec-1', type: 'hero' },
    { id: 'sec-2', type: 'packages' },
    { id: 'sec-3', type: 'about_us' },
    { id: 'sec-4', type: 'testimonials' }
  ];

  const layout = settings.homepageLayout || defaultLayout;

  const renderHero = (section: any) => (
    <section key={section.id} className="relative w-full h-[60vh] md:h-[80vh] bg-slate-900 border-b border-white/5">
      <EditableImage 
        src={banners[0]?.imageUrl || settings.tourismSettings?.heroBannerImage || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80"}
        alt="Hero Banner"
        slug={slug}
        settingsKey="tourismSettings.heroBannerImage"
        className="w-full h-full object-cover"
      />
    </section>
  );

  const renderPackages = (section: any) => {
    const style = section.style || 'grid';

    return (
      <section key={section.id} className="py-24 max-w-7xl mx-auto px-6" id="packages">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 break-words" style={{ color: 'var(--color-text-home, #ffffff)' }}>
            {section.config?.title || settings.tourismSettings?.packagesTitle || t('ourPackagesOffers')}
          </h2>
          <EditableText 
            content={settings.tourismSettings?.packagesSubtitle || t('packagesSubtitle')} 
            slug={slug} 
            settingsKey="tourismSettings.packagesSubtitle" 
            as="p"
            className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto block"
          />
        </div>

        {/* Style selection */}
        {style === 'list' && (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] transition-all flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden group" style={{'--hover-border': 'var(--dynamic-primary, #22d3ee)'} as any}>
                <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] -z-10 transition-all" style={{ background: 'rgba(var(--dynamic-primary-rgb, 6,182,212), 0.1)' }}></div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-black text-white transition-colors truncate" style={{ color: 'var(--color-text-home, #ffffff)' }}>{product.name}</h3>
                  <p className="text-slate-400 text-sm whitespace-pre-wrap break-words leading-relaxed max-w-xl">{product.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">${product.price}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{settings.tourismSettings?.priceSuffix || t('perMonth')}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 flex flex-col md:items-end gap-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 md:text-right">Included Features</h4>
                    <ul className="flex flex-wrap md:justify-end gap-3 max-w-md">
                      {product.specs && product.specs.length > 0 ? (
                        product.specs.map((spec: any, idx: number) => (
                          <li key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-white">
                            <Check size={10} style={{ color: 'var(--dynamic-primary, #22d3ee)' }} />
                            <span>{spec.label}: {spec.value}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-xs text-slate-500 italic">No features listed.</li>
                      )}
                    </ul>
                  </div>
                  <Link 
                    href={`/store/${slug}/product/${product.id}`}
                    className="w-full md:w-48 py-4 bg-white border border-white/10 rounded-2xl text-black font-black text-xs uppercase tracking-widest text-center transition-all shadow-xl block hover:opacity-90"
                  >
                    {settings.tourismSettings?.bookButtonText || t('selectPackage')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {style === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col justify-between bg-black/40">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed">{product.description}</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-black text-white">${product.price}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{settings.tourismSettings?.priceSuffix || t('perMonth')}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {product.specs && product.specs.length > 0 ? (
                      product.specs.map((spec: any, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check size={12} className="shrink-0" style={{ color: 'var(--dynamic-primary, #22d3ee)' }} />
                          <span>{spec.label}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-500 italic">No features.</li>
                    )}
                  </ul>
                </div>
                <Link 
                  href={`/store/${slug}/product/${product.id}`}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-wider text-center hover:bg-white hover:text-black transition-all block"
                >
                  {settings.tourismSettings?.bookButtonText || t('selectPackage')}
                </Link>
              </div>
            ))}
          </div>
        )}

        {style === 'compact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.03] transition-all flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{product.name}</h3>
                  <div className="text-2xl font-black mb-4" style={{ color: 'var(--dynamic-primary, #22d3ee)' }}>${product.price}</div>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4">{product.description}</p>
                </div>
                <Link 
                  href={`/store/${slug}/product/${product.id}`}
                    className="w-full py-2.5 bg-white border border-white/5 rounded-xl text-black font-black text-[10px] uppercase tracking-wider text-center transition-all block hover:opacity-90"
                >
                  {settings.tourismSettings?.bookButtonText || t('selectPackage')}
                </Link>
              </div>
            ))}
          </div>
        )}

        {style === 'featured' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {filteredProducts.map((product, idx) => {
              const isFeatured = idx === 1 || filteredProducts.length === 1;
              return (
                <div 
                  key={product.id} 
                  className={`rounded-3xl p-8 transition-all flex flex-col justify-between relative overflow-hidden ${
                    isFeatured 
                      ? 'border-2 md:scale-105 z-10' 
                      : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
                  }`}
                  style={isFeatured ? {
                    background: `linear-gradient(to bottom, rgba(var(--dynamic-primary-rgb, 6,182,212), 0.05), #060913)`,
                    borderColor: 'var(--dynamic-primary, #06b6d4)',
                    boxShadow: '0 0 50px rgba(var(--dynamic-primary-rgb, 6,182,212), 0.15)'
                  } : {}}
                >
                  {isFeatured && (
                    <div className="absolute top-4 right-4 text-slate-950 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'var(--dynamic-primary, #06b6d4)' }}>
                      Best Seller
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">{product.name}</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{product.description}</p>
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-4xl font-black text-white">${product.price}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{settings.tourismSettings?.priceSuffix || t('perMonth')}</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {product.specs && product.specs.length > 0 ? (
                        product.specs.map((spec: any, sIdx: number) => (
                          <li key={sIdx} className="flex items-start gap-3">
                            <div className="mt-0.5 p-1 rounded-full" style={{ background: 'rgba(var(--dynamic-primary-rgb, 6,182,212), 0.2)', color: 'var(--dynamic-primary, #22d3ee)' }}><Check size={12} strokeWidth={4} /></div>
                            <div>
                              <span className="text-sm font-bold text-white block">{spec.label}</span>
                              <span className="text-xs text-slate-400 block">{spec.value}</span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-xs text-slate-500 italic">No features.</li>
                      )}
                    </ul>
                  </div>
                  <Link 
                    href={`/store/${slug}/product/${product.id}`}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all block hover:opacity-90`}
                    style={isFeatured ? { background: 'var(--dynamic-primary, #22d3ee)', color: '#0f172a' } : { background: '#ffffff', color: '#0f172a' }}
                  >
                    {settings.tourismSettings?.bookButtonText || t('selectPackage')}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {style === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] transition-all flex flex-col group shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] -z-10 transition-all" style={{ background: 'rgba(var(--dynamic-primary-rgb, 6,182,212), 0.1)' }}></div>
                
                <div className="mb-6 border-b border-white/5 pb-6">
                  <h3 className="text-2xl font-black mb-2 transition-colors" style={{ color: 'var(--color-text-home, #ffffff)' }}>{product.name}</h3>
                  <p className="text-slate-400 text-sm whitespace-pre-wrap break-words leading-relaxed">{product.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">${product.price}</span>
                    <EditableText 
                      content={settings.tourismSettings?.priceSuffix || t('perMonth')} 
                      slug={slug} 
                      settingsKey="tourismSettings.priceSuffix" 
                      as="span"
                      className="text-sm font-bold text-slate-500 uppercase tracking-widest block"
                    />
                  </div>
                </div>

                <div className="flex-1 mb-8">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Included Features</h4>
                  <ul className="space-y-4">
                    {product.specs && product.specs.length > 0 ? (
                      product.specs.map((spec: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5 p-1 rounded-full" style={{ background: 'rgba(var(--dynamic-primary-rgb, 6,182,212), 0.2)', color: 'var(--dynamic-primary, #22d3ee)' }}><Check size={12} strokeWidth={4} /></div>
                          <div>
                            <span className="text-sm font-bold text-white block">{spec.label}</span>
                            <span className="text-xs text-slate-400 block">{spec.value}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-500 italic">No specific features listed.</li>
                    )}
                  </ul>
                </div>

                <Link 
                  href={`/store/${slug}/product/${product.id}`}
                  className="w-full py-4 bg-white border border-white/10 rounded-2xl text-black font-black text-xs uppercase tracking-widest text-center transition-all shadow-xl block hover:opacity-90"
                >
                  <EditableText 
                    content={settings.tourismSettings?.bookButtonText || t('selectPackage')} 
                    slug={slug} 
                    settingsKey="tourismSettings.bookButtonText" 
                    as="span"
                  />
                </Link>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            <EditableText 
              content={settings.tourismSettings?.noPackagesText || "No packages currently available."} 
              slug={slug} 
              settingsKey="tourismSettings.noPackagesText" 
              as="p"
              className="text-slate-400 font-medium block"
            />
          </div>
        )}
      </section>
    );
  };

  const renderAboutUs = (section: any) => {
    const title = section.config?.title || settings.tourismSettings?.aboutTitle || "Dedicated to elevating your professional journey.";
    const tagline = section.config?.tagline || settings.tourismSettings?.aboutTagline || "WHO WE ARE";
    const desc1 = section.config?.desc1 || settings.tourismSettings?.aboutDesc1 || "We provide top-tier consulting and resources for businesses and individuals looking to scale. Our approach is uniquely tailored to every client.";
    const desc2 = section.config?.desc2 || settings.tourismSettings?.aboutDesc2 || "With years of industry experience, our dedicated team ensures you have the support and strategy needed to succeed in competitive markets.";
    const image = section.config?.image || settings.tourismSettings?.aboutImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80";
    const style = section.style || 'split';

    if (style === 'centered') {
      return (
        <section key={section.id} className="py-24 bg-white/[0.01] border-y border-white/5 relative overflow-hidden text-center" id="about">
          <div className="max-w-4xl mx-auto px-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--dynamic-primary, #22d3ee)' }}>{tagline}</h4>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8" style={{ color: 'var(--color-text-home, #ffffff)' }}>{title}</h2>
            <p className="text-slate-400 text-base md:text-lg mb-6 leading-relaxed">{desc1}</p>
            {desc2 && <p className="text-slate-400 text-base md:text-lg mb-10 leading-relaxed">{desc2}</p>}
          </div>
          <div className="max-w-6xl mx-auto px-6 mt-12">
            <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src={image} alt="About Us" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      );
    }

    if (style === 'minimal') {
      return (
        <section key={section.id} className="py-24 relative overflow-hidden" style={{ background: 'var(--color-bg-home, #0a0c14)' }} id="about">
          <div className="max-w-3xl mx-auto px-6 pl-8 md:pl-12" style={{ borderLeft: '4px solid var(--dynamic-primary, #22d3ee)' }}>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--dynamic-primary, #22d3ee)' }}>{tagline}</h4>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-8" style={{ color: 'var(--color-text-home, #ffffff)' }}>{title}</h2>
            <p className="text-slate-400 text-base md:text-lg mb-6 leading-relaxed">{desc1}</p>
            {desc2 && <p className="text-slate-400 text-base md:text-lg leading-relaxed">{desc2}</p>}
          </div>
        </section>
      );
    }

    // Default 'split' style
    return (
      <section key={section.id} className="py-24 bg-white/[0.01] border-y border-white/5 relative overflow-hidden" id="about">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img src={image} alt="About Us" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: 'var(--dynamic-primary, #22d3ee)' }}>{tagline}</h4>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8" style={{ color: 'var(--color-text-home, #ffffff)' }}>{title}</h2>
            <p className="text-slate-400 text-base md:text-lg mb-6 leading-relaxed block">{desc1}</p>
            <p className="text-slate-400 text-base md:text-lg mb-10 leading-relaxed block">{desc2}</p>
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonials = (section: any) => {
    // Priority: settings.signatureSettings.testimonials > section.config.items > legacy static
    const settingsReviews = settings.signatureSettings?.testimonials || [];
    const sectionItems = section.config?.items || [];
    const reviews = settingsReviews.length > 0 ? settingsReviews : sectionItems;
    const hasReviews = reviews.length > 0;
    
    return (
      <section key={section.id} className="py-24 max-w-7xl mx-auto px-6" id="reviews">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 break-words" style={{ color: 'var(--color-text-home, #ffffff)' }}>
             {section.config?.title || settings.tourismSettings?.reviewsTitle || "What Our Clients Say"}
          </h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">{t('realExperiences')}</p>
        </div>

        {hasReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {reviews.map((item: any, idx: number) => (
              <div key={idx} className="bg-white/[0.03] border border-white/[0.07] rounded-[2rem] p-8 relative hover:bg-white/[0.06] transition-all duration-300 group">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 group-hover:text-white/10 transition-all" />
                <div className="flex gap-1 mb-5" style={{ color: 'var(--dynamic-primary, #22d3ee)' }}>
                  {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={14} />)}
                </div>
                <p className="text-slate-300 italic mb-7 leading-relaxed text-sm">"{item.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-black text-sm" style={{ background: 'var(--dynamic-primary, #22d3ee)', opacity: 0.85 }}>
                    {item.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">{item.name}</h5>
                    {item.role && <span className="text-slate-500 text-xs">{item.role}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Fallback to legacy static reviews when no reviews exist at all
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 relative">
              <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5" />
              <div className="flex gap-1 mb-6 text-yellow-500">
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
              </div>
              <EditableText 
                content={settings.tourismSettings?.review1Text || "This service completely transformed the way we operate. The packages are incredibly well-structured and the support is phenomenal."} 
                slug={slug} 
                settingsKey="tourismSettings.review1Text" 
                as="p"
                className="text-slate-300 italic mb-8 leading-relaxed block"
              />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                  <EditableImage 
                    src={settings.tourismSettings?.review1Avatar || "https://ui-avatars.com/api/?name=Sarah+J&background=random"}
                    alt="Avatar"
                    slug={slug}
                    settingsKey="tourismSettings.review1Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <EditableText 
                    content={settings.tourismSettings?.review1Name || "Sarah Jenkins"} 
                    slug={slug} 
                    settingsKey="tourismSettings.review1Name" 
                    as="h5"
                    className="text-white font-bold text-sm block"
                  />
                  <EditableText 
                    content={settings.tourismSettings?.review1Role || "CEO, TechCorp"} 
                    slug={slug} 
                    settingsKey="tourismSettings.review1Role" 
                    as="span"
                    className="text-slate-500 text-xs block"
                  />
                </div>
              </div>
            </div>

              {/* Review 2 */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 relative">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5" />
                <div className="flex gap-1 mb-6 text-yellow-500">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                </div>
                <EditableText 
                  content={settings.tourismSettings?.review2Text || "Worth every penny. The clarity and strategic value provided in these packages gave us a clear roadmap for the entire year."} 
                  slug={slug} 
                  settingsKey="tourismSettings.review2Text" 
                  as="p"
                  className="text-slate-300 italic mb-8 leading-relaxed block"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                    <EditableImage 
                      src={settings.tourismSettings?.review2Avatar || "https://ui-avatars.com/api/?name=Michael+D&background=random"}
                      alt="Avatar"
                      slug={slug}
                      settingsKey="tourismSettings.review2Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <EditableText 
                      content={settings.tourismSettings?.review2Name || "Michael Dubois"} 
                      slug={slug} 
                      settingsKey="tourismSettings.review2Name" 
                      as="h5"
                      className="text-white font-bold text-sm block"
                    />
                    <EditableText 
                      content={settings.tourismSettings?.review2Role || "Marketing Director"} 
                      slug={slug} 
                      settingsKey="tourismSettings.review2Role" 
                      as="span"
                      className="text-slate-500 text-xs block"
                    />
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 relative">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5" />
                <div className="flex gap-1 mb-6 text-yellow-500">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                </div>
                <EditableText 
                  content={settings.tourismSettings?.review3Text || "Highly professional. We booked a consultation package and within weeks we saw measurable results in our team's performance."} 
                  slug={slug} 
                  settingsKey="tourismSettings.review3Text" 
                  as="p"
                  className="text-slate-300 italic mb-8 leading-relaxed block"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                    <EditableImage 
                      src={settings.tourismSettings?.review3Avatar || "https://ui-avatars.com/api/?name=Elena+R&background=random"}
                      alt="Avatar"
                      slug={slug}
                      settingsKey="tourismSettings.review3Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <EditableText 
                      content={settings.tourismSettings?.review3Name || "Elena Rodriguez"} 
                      slug={slug} 
                      settingsKey="tourismSettings.review3Name" 
                      as="h5"
                      className="text-white font-bold text-sm block"
                    />
                    <EditableText 
                      content={settings.tourismSettings?.review3Role || "Startup Founder"} 
                      slug={slug} 
                      settingsKey="tourismSettings.review3Role" 
                      as="span"
                      className="text-slate-500 text-xs block"
                    />
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Public Review Submission Form */}
        <ReviewForm slug={slug} />

      </section>
    );
  };

  return (
    <div 
      className="min-h-screen font-sans antialiased overflow-x-hidden"
      style={{ 
        background: 'var(--color-bg-home, #0f111a)', 
        color: 'var(--color-text-home, #f1f5f9)' 
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        body {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>

      {layout.map((section: any) => {
        if (section.type === 'hero') return renderHero(section);
        if (section.type === 'packages') return renderPackages(section);
        if (section.type === 'about_us') return renderAboutUs(section);
        if (section.type === 'testimonials') return renderTestimonials(section);
        return null;
      })}

      {/* Simple Footer */}
      <footer 
        className="py-12 border-t border-white/10 text-center"
        style={{ 
          background: 'var(--color-footer-bg, #070913)', 
          color: 'var(--color-footer-text, #64748b)' 
        }}
      >
        <EditableText 
          content={settings.tourismSettings?.footerText || `© 2026 ${settings.storeName || "Company"}. ${t('allRightsReserved')}`} 
          slug={slug} 
          settingsKey="tourismSettings.footerText" 
          as="p"
          className="text-slate-500 text-xs uppercase tracking-widest font-bold block"
        />
      </footer>
    </div>
  );
}
