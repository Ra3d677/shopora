"use client";

import { useState } from "react";
import { Save, Loader2, Plus, Trash2, GripVertical, Monitor, Smartphone, Eye } from "lucide-react";
import { saveStoreSettings } from "../actions";
import MediaPicker from "../media/MediaPicker";

const DESKTOP_RATIO = 1920 / 800;
const MOBILE_RATIO = 768 / 900;

const DEFAULT_BANNERS = [
  {
    desktopImage: "https://res.cloudinary.com/dno6yitvw/image/upload/v1780997920/shopora/ironpeak/hero-bg.jpg",
    mobileImage: "",
    title: "TRANSFORM YOUR BODY, TRANSFORM YOUR LIFE",
    subtitle: "Join Iron Peak Fitness and experience world-class training with state-of-the-art equipment and expert trainers.",
    ctaText: "Join Now",
    ctaLink: "#pricing",
  },
];

interface BannerSlide {
  desktopImage: string;
  mobileImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function IronPeakBannersManager({ slug, initialSettings }: { slug: string; initialSettings: any }) {
  const existingBanners = initialSettings?.banners;
  const [slides, setSlides] = useState<BannerSlide[]>(
    Array.isArray(existingBanners) && existingBanners.length > 0
      ? existingBanners
      : DEFAULT_BANNERS
  );
  const [saving, setSaving] = useState(false);

  function updateSlide(index: number, field: keyof BannerSlide, val: string) {
    setSlides((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  }

  function removeSlide(index: number) {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  }

  function addSlide() {
    setSlides((prev) => [
      ...prev,
      {
        desktopImage: "",
        mobileImage: "",
        title: "New Slide",
        subtitle: "Add a subtitle",
        ctaText: "Shop Now",
        ctaLink: "#",
      },
    ]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await saveStoreSettings(slug, {
        ironpeakSettings: {
          ...initialSettings,
          banners: slides,
        },
      });
      if (res?.success === false) alert(res.error);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            <span className="text-orange-500">Banner</span> Slides
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage hero slider banners for your IronPeak template</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={addSlide}
            className="px-5 py-3 bg-white border-2 border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-500 hover:border-orange-400 hover:text-orange-500 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Slide
          </button>
          <button onClick={handleSave} disabled={saving}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ
          </button>
        </div>
      </div>

      {/* Recommended sizes banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Monitor className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <span className="font-bold">Recommended sizes:</span> Desktop <strong>1920×800 px</strong> (12:5 ratio) — Mobile <strong>768×900 px</strong> (portrait). For best results, use high-quality images with clean focal points.
        </div>
      </div>

      {/* Slides */}
      <div className="space-y-6">
        {slides.map((slide, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Slide header */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Slide {idx + 1}
                </span>
                {slide.desktopImage && (
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                )}
              </div>
              <button type="button" onClick={() => removeSlide(idx)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  Preview
                </div>
                {/* Desktop preview */}
                <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: `${DESKTOP_RATIO}` }}>
                  <img
                    src={slide.desktopImage || "https://placehold.co/1920x800/1a1a2e/666?text=No+Image"}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/1920x800/1a1a2e/666?text=No+Image"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-8">
                    <div className="max-w-[70%]">
                      <h3 className="text-white text-xl font-black mb-2 leading-tight">{slide.title || "Title"}</h3>
                      <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{slide.subtitle || "Subtitle"}</p>
                      {slide.ctaText && (
                        <span className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-[10px] font-bold">
                          {slide.ctaText}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-md text-[9px] text-white/60">
                    <Monitor className="w-3 h-3" />
                    Desktop
                  </div>
                </div>

                {/* Mobile preview */}
                <div className="flex justify-center">
                  <div className="relative bg-black rounded-2xl overflow-hidden border-2 border-slate-200 w-[180px]" style={{ aspectRatio: `${1 / MOBILE_RATIO}` }}>
                    <img
                      src={slide.mobileImage || slide.desktopImage || "https://placehold.co/768x900/1a1a2e/666?text=No+Image"}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/768x900/1a1a2e/666?text=No+Image"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 flex flex-col justify-center items-center px-4 text-center">
                      <h3 className="text-white text-sm font-black mb-1 leading-tight">{slide.title || "Title"}</h3>
                      <p className="text-white/60 text-[9px] leading-relaxed line-clamp-2">{slide.subtitle || "Subtitle"}</p>
                      {slide.ctaText && (
                        <span className="inline-block mt-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-[8px] font-bold">
                          {slide.ctaText}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 rounded text-[7px] text-white/50">
                      <Smartphone className="w-2.5 h-2.5" />
                      Mobile
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: editor */}
              <div className="space-y-4">
                {/* Desktop Image */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <Monitor className="w-3.5 h-3.5" />
                    Desktop Image
                    <span className="text-[9px] font-normal text-slate-400 normal-case">(1920×800)</span>
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <MediaPicker slug={slug} value={slide.desktopImage}
                      onChange={url => updateSlide(idx, 'desktopImage', url)}
                      className="bg-white"
                      maxWidth={2560}
                      maxHeight={2560}
                      quality={0.9} />
                  </div>
                </div>

                {/* Mobile Image */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <Smartphone className="w-3.5 h-3.5" />
                    Mobile Image
                    <span className="text-[9px] font-normal text-slate-400 normal-case">(768×900)</span>
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <MediaPicker slug={slug} value={slide.mobileImage}
                      onChange={url => updateSlide(idx, 'mobileImage', url)}
                      className="bg-white"
                      maxWidth={1200}
                      maxHeight={1600}
                      quality={0.9} />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                  <input type="text" value={slide.title}
                    onChange={e => updateSlide(idx, 'title', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm font-bold" />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subtitle</label>
                  <textarea rows={2} value={slide.subtitle}
                    onChange={e => updateSlide(idx, 'subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm leading-relaxed resize-none" />
                </div>

                {/* CTA row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Button Text</label>
                    <input type="text" value={slide.ctaText}
                      onChange={e => updateSlide(idx, 'ctaText', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Button Link</label>
                    <input type="text" value={slide.ctaLink}
                      onChange={e => updateSlide(idx, 'ctaLink', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all text-sm font-mono" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-orange-200">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ جميع التغييرات
        </button>
      </div>
    </div>
  );
}
