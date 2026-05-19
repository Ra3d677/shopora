"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Star, Quote } from "lucide-react";
import EditableText from "@/components/editor/EditableText";
import EditableImage from "@/components/editor/EditableImage";

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
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            {section.config?.title || settings.tourismSettings?.packagesTitle || "Our Packages & Offers"}
          </h2>
          <EditableText 
            content={settings.tourismSettings?.packagesSubtitle || "Select the perfect plan designed to meet your specific needs."} 
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
              <div key={product.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-cyan-500/50 hover:bg-white/[0.04] transition-all flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] -z-10 group-hover:bg-cyan-500/20 transition-all"></div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                  <p className="text-slate-400 text-sm whitespace-pre-wrap leading-relaxed max-w-xl">{product.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">${product.price}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{settings.tourismSettings?.priceSuffix || "/Month"}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 flex flex-col md:items-end gap-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 md:text-right">Included Features</h4>
                    <ul className="flex flex-wrap md:justify-end gap-3 max-w-md">
                      {product.specs && product.specs.length > 0 ? (
                        product.specs.map((spec: any, idx: number) => (
                          <li key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-white">
                            <Check size={10} className="text-cyan-400" />
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
                    className="w-full md:w-48 py-4 bg-white border border-white/10 rounded-2xl text-black font-black text-xs uppercase tracking-widest text-center hover:bg-cyan-400 hover:border-cyan-400 hover:text-slate-900 transition-all shadow-xl block"
                  >
                    {settings.tourismSettings?.bookButtonText || "Select Package"}
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
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{settings.tourismSettings?.priceSuffix || "/Month"}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {product.specs && product.specs.length > 0 ? (
                      product.specs.map((spec: any, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check size={12} className="text-cyan-400 shrink-0" />
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
                  {settings.tourismSettings?.bookButtonText || "Select Package"}
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
                  <div className="text-2xl font-black text-cyan-400 mb-4">${product.price}</div>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4">{product.description}</p>
                </div>
                <Link 
                  href={`/store/${slug}/product/${product.id}`}
                  className="w-full py-2.5 bg-white border border-white/5 rounded-xl text-black font-black text-[10px] uppercase tracking-wider text-center hover:bg-cyan-400 hover:text-slate-900 transition-all block"
                >
                  {settings.tourismSettings?.bookButtonText || "Select"}
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
                      ? 'bg-gradient-to-b from-cyan-950/40 to-slate-950 border-2 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.15)] md:scale-105 z-10' 
                      : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute top-4 right-4 bg-cyan-500 text-slate-950 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      Best Seller
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">{product.name}</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{product.description}</p>
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-4xl font-black text-white">${product.price}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{settings.tourismSettings?.priceSuffix || "/Month"}</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {product.specs && product.specs.length > 0 ? (
                        product.specs.map((spec: any, sIdx: number) => (
                          <li key={sIdx} className="flex items-start gap-3">
                            <div className="mt-0.5 bg-cyan-500/20 text-cyan-400 p-1 rounded-full"><Check size={12} strokeWidth={4} /></div>
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
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all block ${
                      isFeatured 
                        ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' 
                        : 'bg-white text-black hover:bg-cyan-400 hover:text-slate-950'
                    }`}
                  >
                    {settings.tourismSettings?.bookButtonText || "Select Package"}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {style === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-cyan-500/50 hover:bg-white/[0.04] transition-all flex flex-col group shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] -z-10 group-hover:bg-cyan-500/20 transition-all"></div>
                
                <div className="mb-6 border-b border-white/5 pb-6">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                  <p className="text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">{product.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">${product.price}</span>
                    <EditableText 
                      content={settings.tourismSettings?.priceSuffix || "/Month"} 
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
                          <div className="mt-0.5 bg-cyan-500/20 text-cyan-400 p-1 rounded-full"><Check size={12} strokeWidth={4} /></div>
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
                  className="w-full py-4 bg-white border border-white/10 rounded-2xl text-black font-black text-xs uppercase tracking-widest text-center hover:bg-cyan-400 hover:border-cyan-400 hover:text-slate-900 transition-all shadow-xl block"
                >
                  <EditableText 
                    content={settings.tourismSettings?.bookButtonText || "Select Package"} 
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
            <h4 className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-4">{tagline}</h4>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">{title}</h2>
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
        <section key={section.id} className="py-24 bg-[#0a0c14] relative overflow-hidden" id="about">
          <div className="max-w-3xl mx-auto px-6 border-l-4 border-cyan-500 pl-8 md:pl-12">
            <h4 className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-4">{tagline}</h4>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-8">{title}</h2>
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
            <h4 className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-4 block">{tagline}</h4>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">{title}</h2>
            <p className="text-slate-400 text-base md:text-lg mb-6 leading-relaxed block">{desc1}</p>
            <p className="text-slate-400 text-base md:text-lg mb-10 leading-relaxed block">{desc2}</p>
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonials = (section: any) => {
    const hasItems = section.config?.items && section.config.items.length > 0;
    
    return (
      <section key={section.id} className="py-24 max-w-7xl mx-auto px-6" id="reviews">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
             {section.config?.title || settings.tourismSettings?.reviewsTitle || "Client Success Stories"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hasItems ? section.config.items.map((item: any, idx: number) => (
            <div key={item.id || idx} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 relative">
              <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5" />
              <div className="flex gap-1 mb-6 text-yellow-500">
                {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={16} />)}
              </div>
              <p className="text-slate-300 italic mb-8 leading-relaxed">"{item.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0 bg-slate-800"></div>
                <div>
                  <h5 className="text-white font-bold text-sm">{item.name}</h5>
                  <span className="text-slate-500 text-xs">{item.role}</span>
                </div>
              </div>
            </div>
          )) : (
            // Fallback to legacy static reviews
            <>
              {/* Review 1 */}
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
            </>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-[#0f111a] text-slate-100 min-h-screen font-sans antialiased overflow-x-hidden">
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
      <footer className="py-12 border-t border-white/10 bg-[#070913] text-center">
        <EditableText 
          content={settings.tourismSettings?.footerText || `© 2026 ${settings.storeName || "Company"}. All rights reserved.`} 
          slug={slug} 
          settingsKey="tourismSettings.footerText" 
          as="p"
          className="text-slate-500 text-xs uppercase tracking-widest font-bold block"
        />
      </footer>
    </div>
  );
}
