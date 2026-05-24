"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import EditableText from "@/components/editor/EditableText";
import EditableButton from "@/components/editor/EditableButton";
import SmartImage from "@/components/ui/SmartImage";
import BannerButton from "@/components/ui/BannerButton";
import HeroSlider from "@/components/ui/HeroSlider";
import StoreMarquee from "@/components/ui/StoreMarquee";
import SaleSection from "@/components/ui/SaleSection";
import VideoSection from "@/components/ui/VideoSection";
import SectionDivider from "@/components/ui/SectionDivider";
import { useEditorStore } from "@/store/editor";
import { useLanguageStore } from "@/store/language";

interface TemplateProps {
  banners: any[];
  settings: any;
  products: any[];
  slug: string;
  categories: any[];
}

export default function Modern1Template({ banners, settings, products, slug, categories = [] }: TemplateProps) {
  const { t } = useLanguageStore();
  const { isEditMode } = useEditorStore();

  const topBanners = (banners || []).filter((b: any) => b.position === "top" || !b.position);
  const middleBanners = (banners || []).filter((b: any) => b.position === "middle");
  const bottomBanners = (banners || []).filter((b: any) => b.position === "bottom");

  const featuredProducts = (products || []).slice(0, 10);
  const themeAccent = settings?.colorSystem?.brand?.primary || "var(--dynamic-primary, #38bdf8)";

  const mod1 = settings?.modern1Settings || {};

  const homepageLayout = settings?.homepageLayout || [
    { id: "m1-hero", type: "hero" },
    { id: "m1-marquee", type: "marquee" },
    { id: "m1-categories", type: "categories" },
    { id: "m1-featured", type: "featured_products" },
    { id: "m1-sale", type: "sale" },
    { id: "m1-banners", type: "banners" },
  ];

  const glowStyle = {
    background: `radial-gradient(900px circle at 20% 10%, rgba(56, 189, 248, 0.18), transparent 55%),
radial-gradient(800px circle at 80% 40%, rgba(99, 102, 241, 0.14), transparent 55%),
radial-gradient(700px circle at 50% 90%, rgba(16, 185, 129, 0.10), transparent 55%),
linear-gradient(to bottom, #05070d, #070a13 55%, #05070d)`,
  } as React.CSSProperties;

  const renderHero = (section: any) => {
    const heroStyle = section.style || "neo";
    const title = mod1.heroTitle ?? topBanners[0]?.title ?? settings?.storeName ?? "";
    const subtitle =
      mod1.heroSubtitle ??
      topBanners[0]?.subtitle ??
      "Design-forward commerce with cinematic polish and high conversion layouts.";

    const heroImage = mod1.heroImage || topBanners[0]?.imageUrl || "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80";
    const primaryCta = mod1.primaryCta || {
      label: t("shop") || "Shop",
      link: `/store/${slug}/categories`,
      style: { backgroundColor: themeAccent, textColor: "#0b1020", borderRadius: 18, fontSize: 12 },
    };

    if (heroStyle === "slider") {
      return (
        <section key={section.id} className="w-full">
          <HeroSlider banners={topBanners} slug={slug} settings={settings?.bannerSettings} />
        </section>
      );
    }

    return (
      <section key={section.id} className="relative w-full overflow-hidden">
        <div className="absolute inset-0" style={glowStyle} />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%226%22 height=%226%22 viewBox=%220 0 6 6%22%3E%3Cpath fill=%22%23ffffff%22 fill-opacity=%220.9%22 d=%22M1 0h1v1H1zM4 2h1v1H4zM2 4h1v1H2z%22/%3E%3C/svg%3E')" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.35em] font-black text-white/80">
                  <Sparkles size={12} style={{ color: themeAccent }} />
                  <EditableText content={mod1.heroBadge ?? "NEW SEASON DROP"} slug={slug} settingsKey="modern1Settings.heroBadge" />
                </div>

                <h1 className="mt-8 text-5xl md:text-7xl lg:text-[5.2rem] font-black leading-[0.9] tracking-[-0.06em] text-white">
                  <span style={{ background: `linear-gradient(90deg, ${themeAccent}, #ffffff 55%, rgba(255,255,255,0.85))`, WebkitBackgroundClip: "text", color: "transparent" }}>
                    <EditableText content={String(title)} slug={slug} settingsKey="modern1Settings.heroTitle" />
                  </span>
                </h1>

                <p className="mt-6 text-base md:text-lg text-white/70 leading-relaxed max-w-xl">
                  <EditableText content={String(subtitle)} slug={slug} settingsKey="modern1Settings.heroSubtitle" />
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <EditableButton
                    label={primaryCta.label || t("shop") || "Shop"}
                    link={primaryCta.link || `/store/${slug}/categories`}
                    slug={slug}
                    settingsKey="modern1Settings.primaryCta"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-4 text-xs font-black uppercase tracking-[0.25em] text-slate-950 shadow-2xl active:scale-[0.99]"
                    style={primaryCta.style || { backgroundColor: themeAccent, textColor: "#0b1020", borderRadius: 18, fontSize: 12 }}
                  />

                  <Link
                    href={`/store/${slug}/products`}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-4 text-xs font-black uppercase tracking-[0.25em] text-white border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] transition-colors"
                  >
                    {t("viewAllProducts") || "View All"} <ArrowRight size={16} />
                  </Link>

                  <BannerButton banner={topBanners[0]} slug={slug} />
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4 max-w-xl">
                  {[
                    { k: "ship", v: mod1.feature1 || "Fast shipping" },
                    { k: "pay", v: mod1.feature2 || "Secure checkout" },
                    { k: "curated", v: mod1.feature3 || "Curated drops" },
                    { k: "support", v: mod1.feature4 || "24/7 support" },
                  ].map((item) => (
                    <div key={item.k} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-[11px] font-bold tracking-wide text-white/75">
                      {item.v}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-6">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <div className="relative rounded-[2.75rem] border border-white/10 bg-white/[0.03] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
                  <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[70px]" style={{ background: themeAccent, opacity: 0.18 }} />

                  <div className="grid grid-cols-12 gap-3 p-3">
                    <div className="col-span-7 relative aspect-[3/4] rounded-[2.2rem] overflow-hidden">
                      <SmartImage src={featuredProducts[0]?.images?.[0] || featuredProducts[0]?.image || heroImage} alt="Featured" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.35em] font-black text-white/70">{t("latestArrivals") || "Latest arrivals"}</div>
                          <div className="mt-2 text-lg font-black text-white line-clamp-1">{featuredProducts[0]?.name || "Featured Product"}</div>
                        </div>
                        <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/15 bg-white/[0.04] text-white">
                          <ShoppingBag size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-5 grid grid-rows-2 gap-3">
                      <div className="relative rounded-[2.2rem] overflow-hidden border border-white/10 bg-white/[0.02]">
                        <SmartImage
                          src={featuredProducts[1]?.images?.[0] || featuredProducts[1]?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
                          alt="Secondary"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-[10px] uppercase tracking-[0.35em] font-black text-white/70">{t("inStock") || "In Stock"}</div>
                          <div className="mt-1 text-sm font-black text-white line-clamp-1">{featuredProducts[1]?.name || "Modern Essential"}</div>
                        </div>
                      </div>

                      <div className="relative rounded-[2.2rem] overflow-hidden border border-white/10 bg-white/[0.02]">
                        <SmartImage
                          src={featuredProducts[2]?.images?.[0] || featuredProducts[2]?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"}
                          alt="Secondary"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-[10px] uppercase tracking-[0.35em] font-black text-white/70">{t("premiumItem") || "Premium"}</div>
                          <div className="mt-1 text-sm font-black text-white line-clamp-1">{featuredProducts[2]?.name || "Signature Pick"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                      <div className="text-[10px] uppercase tracking-[0.35em] font-black text-white/60">
                        <EditableText content={mod1.heroFootnote ?? "Crafted for premium brands."} slug={slug} settingsKey="modern1Settings.heroFootnote" />
                      </div>
                      <Link href={`/store/${slug}/products`} className="text-[10px] uppercase tracking-[0.35em] font-black text-white hover:text-white/80 transition-colors">
                        {t("exploreArchive") || "Explore"} <ArrowRight className="inline-block ml-2" size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;600;800;900&family=Urbanist:wght@300;400;600;800;900&display=swap");
          .theme-modern1 {
            font-family: "Urbanist", system-ui, -apple-system, Segoe UI, sans-serif;
          }
          .theme-modern1 h1,
          .theme-modern1 h2,
          .theme-modern1 h3 {
            font-family: "Unbounded", system-ui, -apple-system, Segoe UI, sans-serif;
          }
        `}</style>
      </section>
    );
  };

  const renderCategories = (section: any) => {
    const list = Array.isArray(categories) ? categories : [];
    const title = section?.config?.title || mod1.categoriesTitle || t("collections") || "Collections";

    return (
      <section key={section.id} className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-8 mb-12">
            <div>
              <div className="text-[10px] uppercase tracking-[0.5em] font-black text-white/55 mb-4">{t("theCollections") || "The collections"}</div>
              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.04em] text-white">
                <EditableText content={String(title)} slug={slug} settingsKey="modern1Settings.categoriesTitle" />
              </h2>
            </div>
            <Link href={`/store/${slug}/categories`} className="hidden md:inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] font-black text-white/70 hover:text-white transition-colors">
              {t("shop") || "Shop"} <ArrowRight size={14} />
            </Link>
          </div>

          {list.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {list.slice(0, 8).map((cat: any) => (
                <Link key={cat.id} href={`/store/${slug}/products?category=${cat.id}`} className="group relative rounded-[2.25rem] overflow-hidden border border-white/10 bg-white/[0.02]">
                  <div className="relative aspect-[4/3]">
                    <SmartImage
                      src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.35em] font-black text-white/60">{t("exploreLabel") || "Explore"}</div>
                        <div className="mt-1 text-lg font-black text-white truncate">{cat.name}</div>
                      </div>
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/15 bg-white/[0.05] text-white shrink-0">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[2.25rem] border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-white/60 font-bold">
              {isEditMode ? "Add categories to showcase collections here." : ""}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderFeaturedProducts = (section: any) => {
    const title = section?.config?.title || mod1.productsTitle || t("theDrop") || "The Drop";
    const subtitle = section?.config?.subtitle || mod1.productsSubtitle || t("latestArrivals") || "Latest Arrivals";

    return (
      <section key={section.id} className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div>
              <div className="text-[10px] uppercase tracking-[0.5em] font-black text-white/55 mb-4">
                <EditableText content={String(subtitle)} slug={slug} settingsKey="modern1Settings.productsSubtitle" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.06em] text-white">
                <EditableText content={String(title)} slug={slug} settingsKey="modern1Settings.productsTitle" />
              </h2>
            </div>

            <Link href={`/store/${slug}/products`} className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] font-black text-white/70 hover:text-white transition-colors">
              {t("viewAllProducts") || "View all"}{" "}
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/15 bg-white/[0.04]">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
              {featuredProducts.map((product: any, idx: number) => {
                const image = product?.images?.[0] || product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80";
                return (
                  <motion.div
                    key={product.id || idx}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.25) }}
                    className="group"
                  >
                    <Link href={`/store/${slug}/product/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] rounded-[2.25rem] overflow-hidden border border-white/10 bg-white/[0.02]">
                        <SmartImage src={image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-95" />
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
                          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[9px] uppercase tracking-[0.35em] font-black text-white/75">
                            {product?.category?.name || t("premiumItem") || "Premium"}
                          </div>
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 bg-white/[0.04] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <ShoppingBag size={16} />
                          </div>
                        </div>

                        <div className="absolute bottom-5 left-5 right-5">
                          <div className="text-sm font-black tracking-tight text-white line-clamp-1">{product.name}</div>
                          <div className="mt-2 flex items-baseline justify-between gap-4">
                            <div className="text-white/80 text-sm font-black">${product.price}</div>
                            <div className="text-[10px] uppercase tracking-[0.35em] font-black" style={{ color: themeAccent }}>
                              {t("inStock") || "In Stock"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2.25rem] border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-white/60 font-bold">
              {isEditMode ? "Add products to show featured items here." : ""}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderBanners = (section: any) => {
    const bannersToShow = middleBanners.length > 0 ? middleBanners : (topBanners.length > 1 ? topBanners.slice(1) : []);
    const finalBanners = bannersToShow.length > 0 ? bannersToShow : bottomBanners;

    if (!finalBanners || finalBanners.length === 0) return null;

    return (
      <section key={section.id} className="relative py-8">
        <div className="mx-auto max-w-7xl px-6 space-y-6">
          {finalBanners.map((banner: any) => (
            <div key={banner.id} className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.02] shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
              <div className="relative min-h-[380px] md:h-[520px]">
                <SmartImage src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="px-8 md:px-14 max-w-2xl">
                    <div className="text-[10px] uppercase tracking-[0.6em] font-black text-white/60">{t("campaignNo1") || "Campaign"}</div>
                    <h3 className="mt-5 text-4xl md:text-6xl font-black tracking-[-0.05em] text-white">{banner.title}</h3>
                    <p className="mt-5 text-white/70 text-base md:text-lg leading-relaxed">{banner.subtitle}</p>
                    <div className="mt-8 flex items-center gap-4">
                      <BannerButton banner={banner} slug={slug} />
                      <Link href={`/store/${slug}/products`} className="text-[10px] uppercase tracking-[0.35em] font-black text-white/70 hover:text-white transition-colors">
                        {t("viewCatalog") || "View catalog"} <ArrowRight className="inline-block ml-2" size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSection = (section: any) => {
    if (section.type === "hero") return renderHero(section);
    if (section.type === "marquee") return section.config?.enabled !== false ? <StoreMarquee key={section.id} settings={section.config as any} /> : null;
    if (section.type === "categories") return renderCategories(section);
    if (section.type === "featured_products" || section.type === "products") return renderFeaturedProducts(section);
    if (section.type === "sale") return <SaleSection key={section.id} section={section} products={products} slug={slug} template="modern1" />;
    if (section.type === "video") return <VideoSection key={section.id} section={section} slug={slug} />;
    if (section.type === "banners") return renderBanners(section);
    if (section.type === "text_block") {
      const title = section?.config?.title || mod1.textTitle || "Crafted to move fast.";
      const text =
        section?.config?.text ||
        mod1.textBody ||
        "A modern storefront designed to feel premium, load fast, and guide customers with clarity.";
      return (
        <section key={section.id} className="relative py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.05em] text-white">
              <EditableText content={String(title)} slug={slug} settingsKey="modern1Settings.textTitle" />
            </h2>
            <p className="mt-6 text-white/70 text-base md:text-lg leading-relaxed">
              <EditableText content={String(text)} slug={slug} settingsKey="modern1Settings.textBody" />
            </p>
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <div className="theme-modern1 w-full min-h-screen" style={{ color: "#ffffff" }}>
      <div className="absolute inset-0 -z-10" style={glowStyle} />

      {homepageLayout.map((section: any) => {
        const divider = section.showDivider !== false && (
          <SectionDivider style={settings?.dividerStyle || "line"} color={settings?.dividerColor || themeAccent} />
        );

        return (
          <React.Fragment key={section.id}>
            {renderSection(section)}
            {divider}
          </React.Fragment>
        );
      })}
    </div>
  );
}
