"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Calendar, Users, ArrowRight, Eye, Phone, Mail, Clock, ShieldCheck, MapPin } from "lucide-react";
import EditableText from "@/components/editor/EditableText";

interface TourismTemplateProps {
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
}: TourismTemplateProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Active banner image or elegant travel fallback
  const heroBanner = banners[0]?.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80";
  const heroTitle = banners[0]?.title || settings.storeName || "Unforgettable Journeys";
  const heroSubtitle = banners[0]?.description || settings.description || "Discover handpicked premium travel experiences designed just for you.";

  // Filter products (tours) based on category selection
  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  return (
    <div className="bg-[#070913] text-slate-100 min-h-screen font-sans antialiased overflow-x-hidden">
      {/* Dynamic Styled Google Font Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        body {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Glassy Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBanner} 
            alt={heroTitle}
            className="w-full h-full object-cover scale-105 animate-pulse duration-[10s]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-[#070913]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Compass className="text-cyan-400 w-4 h-4 animate-spin-slow" />
            <EditableText 
              content={settings.tourismSettings?.startBadge || "Start Your Adventure"} 
              slug={slug} 
              settingsKey="tourismSettings.startBadge" 
              className="text-[10px] font-black uppercase tracking-widest text-cyan-300" 
              as="span" 
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 uppercase leading-none">
            <EditableText 
              content={settings.tourismSettings?.heroTitle || heroTitle} 
              slug={slug} 
              settingsKey="tourismSettings.heroTitle" 
            />
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            <EditableText 
              content={settings.tourismSettings?.heroSubtitle || heroSubtitle} 
              slug={slug} 
              settingsKey="tourismSettings.heroSubtitle" 
            />
          </p>

          <a 
            href="#destinations" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black text-xs uppercase tracking-widest px-8 py-5 rounded-2xl shadow-xl shadow-cyan-500/10 transition-all hover:scale-105"
          >
            <EditableText 
              content={settings.tourismSettings?.exploreButton || "Explore Tour Packages"} 
              slug={slug} 
              settingsKey="tourismSettings.exploreButton" 
              as="span" 
            /> <ArrowRight size={16} />
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Scroll Down</span>
          <div className="w-1 h-6 bg-cyan-400/50 rounded-full" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-slate-950/60 border-y border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-all">
              <ShieldCheck size={24} />
            </div>
            <div>
              <EditableText 
                content={settings.tourismSettings?.badge1Title || "Guaranteed Safety"} 
                slug={slug} 
                settingsKey="tourismSettings.badge1Title" 
                className="font-bold text-sm text-white uppercase tracking-wider mb-1 block" 
                as="h4" 
              />
              <EditableText 
                content={settings.tourismSettings?.badge1Desc || "Certified local guides, 24/7 client support line."} 
                slug={slug} 
                settingsKey="tourismSettings.badge1Desc" 
                className="text-xs text-slate-400 block" 
                as="p" 
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-all">
              <Calendar size={24} />
            </div>
            <div>
              <EditableText 
                content={settings.tourismSettings?.badge2Title || "Flexible Bookings"} 
                slug={slug} 
                settingsKey="tourismSettings.badge2Title" 
                className="font-bold text-sm text-white uppercase tracking-wider mb-1 block" 
                as="h4" 
              />
              <EditableText 
                content={settings.tourismSettings?.badge2Desc || "Easy booking change up to 48 hours in advance."} 
                slug={slug} 
                settingsKey="tourismSettings.badge2Desc" 
                className="text-xs text-slate-400 block" 
                as="p" 
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 group">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-all">
              <Users size={24} />
            </div>
            <div>
              <EditableText 
                content={settings.tourismSettings?.badge3Title || "Tailored Experiences"} 
                slug={slug} 
                settingsKey="tourismSettings.badge3Title" 
                className="font-bold text-sm text-white uppercase tracking-wider mb-1 block" 
                as="h4" 
              />
              <EditableText 
                content={settings.tourismSettings?.badge3Desc || "Private trips or friendly group outings."} 
                slug={slug} 
                settingsKey="tourismSettings.badge3Desc" 
                className="text-xs text-slate-400 block" 
                as="p" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Destinations Section */}
      <section id="destinations" className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 uppercase flex gap-3 flex-wrap">
              <EditableText 
                content={settings.tourismSettings?.sectionTitlePart1 || "Dream"} 
                slug={slug} 
                settingsKey="tourismSettings.sectionTitlePart1" 
                as="span" 
              />
              <EditableText 
                content={settings.tourismSettings?.sectionTitlePart2 || "Destinations"} 
                slug={slug} 
                settingsKey="tourismSettings.sectionTitlePart2" 
                className="text-cyan-400" 
                as="span" 
              />
            </h2>
            <EditableText 
              content={settings.tourismSettings?.sectionSubtitle || "Explore our premium selection of curated tourism packages and tours."} 
              slug={slug} 
              settingsKey="tourismSettings.sectionSubtitle" 
              className="text-slate-400 max-w-md text-sm font-medium block mb-4" 
              as="p" 
            />
          </div>

          {/* Categories Tab Selector */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  selectedCategory === null 
                    ? "bg-cyan-500 border-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/10" 
                    : "bg-slate-900 border-white/5 text-slate-400 hover:border-slate-800 hover:text-white"
                }`}
              >
                {settings.tourismSettings?.allPackagesText || "All Packages"}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                    selectedCategory === cat.id 
                      ? "bg-cyan-500 border-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/10" 
                      : "bg-slate-900 border-white/5 text-slate-400 hover:border-slate-800 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Packages Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-dashed border-white/5 rounded-[2rem] p-12">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" />
            <EditableText 
              content={settings.tourismSettings?.emptyStateTitle || "No Tour Packages Active Yet"} 
              slug={slug} 
              settingsKey="tourismSettings.emptyStateTitle" 
              className="font-bold text-lg text-white mb-2 block" 
              as="h4" 
            />
            <EditableText 
              content={settings.tourismSettings?.emptyStateDesc || "Check back soon or contact us directly to design your dream itinerary."} 
              slug={slug} 
              settingsKey="tourismSettings.emptyStateDesc" 
              className="text-xs text-slate-500 block" 
              as="p" 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              // Extract specs or setup defaults
              const duration = product.specs?.find((s: any) => s.label.toLowerCase() === 'duration')?.value;
              const groupSize = product.specs?.find((s: any) => s.label.toLowerCase() === 'group size')?.value;
              const location = product.specs?.find((s: any) => s.label.toLowerCase() === 'location')?.value;
              const image = product.images?.[0]?.url || product.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";

              return (
                <div 
                  key={product.id}
                  className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-cyan-500/30 hover:scale-[1.01] transition-all duration-300 group flex flex-col justify-between"
                >
                  {/* Tour Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-950">
                    <img 
                      src={image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Badge */}
                    <div className="absolute top-6 left-6 bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Clock size={12} className="text-cyan-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                        {duration || <EditableText content={settings.tourismSettings?.defaultDuration || "7 Days"} slug={slug} settingsKey="tourismSettings.defaultDuration" />}
                      </span>
                    </div>
                  </div>

                  {/* Tour Details */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-slate-500 mb-2">
                        <MapPin size={12} className="text-slate-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {location || <EditableText content={settings.tourismSettings?.defaultLocation || "Global Destination"} slug={slug} settingsKey="tourismSettings.defaultLocation" />}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors mb-4 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6 font-light">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      {/* Specs Row */}
                      <div className="flex justify-between items-center py-4 border-t border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
                        <span className="flex items-center gap-1.5">
                          <Users size={12} className="text-slate-500" /> 
                          {groupSize || <EditableText content={settings.tourismSettings?.defaultGroupSize || "Max 12"} slug={slug} settingsKey="tourismSettings.defaultGroupSize" />}
                        </span>
                        <span className="text-white text-md font-black italic tracking-tighter">
                          ${product.price.toFixed(0)} 
                          <span className="text-[9px] font-normal text-slate-500 not-italic ml-1">
                            <EditableText content={settings.tourismSettings?.priceSuffix || "/Person"} slug={slug} settingsKey="tourismSettings.priceSuffix" />
                          </span>
                        </span>
                      </div>

                      {/* Action Button */}
                      <Link 
                        href={`/store/${slug}/product/${product.id}`}
                        className="w-full py-4 bg-slate-950 border border-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-cyan-500 hover:border-cyan-500 hover:text-slate-950 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/5"
                      >
                        <EditableText 
                          content={settings.tourismSettings?.bookButtonText || "Book / Inquire"} 
                          slug={slug} 
                          settingsKey="tourismSettings.bookButtonText" 
                          as="span" 
                        /> <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Premium Footer */}
      <footer className="bg-slate-950/80 border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-black italic text-white mb-6 uppercase tracking-wider">{settings.storeName}</h3>
            <EditableText 
              content={settings.tourismSettings?.footerDesc || "Designing exclusive travel packages, high-end cruises, and unforgettable private tours across the globe."} 
              slug={slug} 
              settingsKey="tourismSettings.footerDesc" 
              className="text-xs text-slate-400 leading-relaxed font-light max-w-sm mb-6 block" 
              as="p" 
            />
            <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
              <Compass size={14} className="animate-spin-slow" /> 
              <EditableText 
                content={settings.tourismSettings?.footerSlogan || "Discover the unexplored"} 
                slug={slug} 
                settingsKey="tourismSettings.footerSlogan" 
                as="span" 
              />
            </div>
          </div>

          <div>
            <EditableText 
              content={settings.tourismSettings?.footerLocationTitle || "Office Location"} 
              slug={slug} 
              settingsKey="tourismSettings.footerLocationTitle" 
              className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 block" 
              as="h4" 
            />
            <EditableText 
              content={settings.tourismSettings?.footerAddress || "104 Al Tagamoa Al Khames, Suite 4\nNew Cairo, Egypt"} 
              slug={slug} 
              settingsKey="tourismSettings.footerAddress" 
              className="text-xs text-slate-500 leading-relaxed mb-4 whitespace-pre-wrap block" 
              as="p" 
            />
            <EditableText 
              content={settings.tourismSettings?.footerHours || "Open: 9 AM - 6 PM (Sun-Thu)"} 
              slug={slug} 
              settingsKey="tourismSettings.footerHours" 
              className="text-xs text-cyan-400 font-bold block" 
              as="span" 
            />
          </div>

          <div>
            <EditableText 
              content={settings.tourismSettings?.footerContactTitle || "Get in Touch"} 
              slug={slug} 
              settingsKey="tourismSettings.footerContactTitle" 
              className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 block" 
              as="h4" 
            />
            <div className="space-y-4">
              <a href={`tel:${settings.tourismSettings?.footerPhone || "+201000000000"}`} className="flex items-center gap-3 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                <Phone size={14} className="text-cyan-500" /> 
                <EditableText 
                  content={settings.tourismSettings?.footerPhoneText || "+2 Egyptian Helpline"} 
                  slug={slug} 
                  settingsKey="tourismSettings.footerPhoneText" 
                  as="span" 
                />
              </a>
              <a href={`mailto:${settings.tourismSettings?.footerEmail || "info@shopora.app"}`} className="flex items-center gap-3 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                <Mail size={14} className="text-cyan-500" /> 
                <EditableText 
                  content={settings.tourismSettings?.footerEmailText || `bookings@${slug}.com`} 
                  slug={slug} 
                  settingsKey="tourismSettings.footerEmailText" 
                  as="span" 
                />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p>Powered by <span className="text-cyan-400">Shopora Platform</span></p>
        </div>
      </footer>
    </div>
  );
}
