"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import EditableText from "@/components/editor/EditableText";
import { useLanguageStore } from "@/store/language";

export default function Footer() {
  const { t } = useLanguageStore();
  const { store } = useStore();
  const slug = store.slug;
  const activeTemplate = store.template || 'signature';

  if (activeTemplate === 'minimal') {
    return (
      <footer 
        className="py-16 px-6 md:px-12 transition-all duration-500"
        style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)' }}
      >
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between gap-12">
          <div className="max-w-sm">
            {store.name && (
              <h2 className="text-white text-2xl font-bold uppercase tracking-tighter mb-8">
                <span className="gradient-text-support">{store.name}</span>
              </h2>
            )}
            <div className="text-sm leading-relaxed mb-8">
              <EditableText 
                content={store.settings?.footerMinimalDesc || t('studyInFormAndFunction')} 
                settingsKey="footerMinimalDesc" 
                slug={slug} 
              />
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {store.settings?.contactInfo?.email && <p>Email: {store.settings.contactInfo.email}</p>}
              {store.settings?.contactInfo?.phone && <p>Tel: {store.settings.contactInfo.phone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-20 text-[10px] font-black uppercase tracking-[0.3em]">
             <div className="flex flex-col gap-4">
                <span className="text-zinc-600">{t('links')}</span>
                <Link href="#" className="text-white hover:opacity-50">{t('inprint')}</Link>
                <Link href="#" className="text-white hover:opacity-50">{t('privacy')}</Link>
                <Link href="#" className="text-white hover:opacity-50">{t('contact')}</Link>
             </div>
             <div className="flex flex-col gap-4">
                <span className="text-zinc-600">{t('social')}</span>
                {Array.isArray(store.settings?.socialLinks) ? (
                  (store.settings.socialLinks as any[]).map((link: any) => (
                    <Link key={link.id} href={link.url} target="_blank" className="text-white hover:opacity-50 capitalize">{link.platform}</Link>
                  ))
                ) : (
                  <>
                    {store.settings?.socialLinks?.instagram && (
                      <Link href={store.settings.socialLinks.instagram} target="_blank" className="text-white hover:opacity-50">{t('instagram')}</Link>
                    )}
                    {store.settings?.socialLinks?.facebook && (
                      <Link href={store.settings.socialLinks.facebook} target="_blank" className="text-white hover:opacity-50">{t('facebook')}</Link>
                    )}
                    {store.settings?.socialLinks?.twitter && (
                      <Link href={store.settings.socialLinks.twitter} target="_blank" className="text-white hover:opacity-50">{t('twitter')}</Link>
                    )}
                    {store.settings?.socialLinks?.tiktok && (
                      <Link href={store.settings.socialLinks.tiktok} target="_blank" className="text-white hover:opacity-50">TikTok</Link>
                    )}
                    {!store.settings?.socialLinks && (
                      <>
                        <Link href="#" className="text-white hover:opacity-50">{t('instagram')}</Link>
                        <Link href="#" className="text-white hover:opacity-50">{t('twitter')}</Link>
                      </>
                    )}
                  </>
                )}
             </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-16 pt-8 border-t border-zinc-900 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-600">
           <span>© {new Date().getFullYear()} {store.name}</span>
           <span>{t('builtByAntigravity')}</span>
        </div>
      </footer>
    );
  }

  if (activeTemplate === 'apple') {
    return (
      <footer 
        className="font-sans text-xs pt-8 pb-6 border-t border-white/10 transition-all duration-500"
        style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)' }}
      >
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="border-b border-[#d2d2d7] pb-6 mb-4 text-[#86868b]">
            <div className="mb-2">
              <EditableText 
                content={store.settings?.footerAppleDisclaimer1 || "1. Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device."} 
                settingsKey="footerAppleDisclaimer1" 
                slug={slug} 
              />
            </div>
            <div>
              <EditableText 
                content={store.settings?.footerAppleDisclaimer2 || "To access and use all Apple Card features and products available only to Apple Card users, you must add Apple Card to Wallet on an iPhone or iPad with the latest version of iOS or iPadOS."} 
                settingsKey="footerAppleDisclaimer2" 
                slug={slug} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-6 text-[#1d1d1f]">
            <div>
              <h4 className="font-semibold mb-2">{t('shopAndLearn')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">{t('store')}</Link></li>
                <li><Link href="#" className="hover:underline">{t('mac')}</Link></li>
                <li><Link href="#" className="hover:underline">{t('iPad')}</Link></li>
                <li><Link href="#" className="hover:underline">{t('iPhone')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('account')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">{t('manageYourID')}</Link></li>
                <li><Link href="#" className="hover:underline">{t('storeAccount')}</Link></li>
                <li><Link href="#" className="hover:underline">{t('iCloudCom')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('forBusiness')}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">{t('shopForBusiness')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#d2d2d7] pt-4 flex flex-col md:flex-row justify-between text-[#86868b]">
            <p>
              <EditableText 
                content={store.settings?.footerAppleCopyright || `Copyright © ${new Date().getFullYear()} ${store.name} Inc. All rights reserved.`} 
                settingsKey="footerAppleCopyright" 
                slug={slug} 
              />
            </p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <Link href="#" className="hover:underline">{t('privacyPolicy')}</Link>
              <span className="border-l border-[#d2d2d7]"></span>
              <Link href="#" className="hover:underline">{t('termsOfUse')}</Link>
              <span className="border-l border-[#d2d2d7]"></span>
              <Link href="#" className="hover:underline">{t('salesAndRefunds')}</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (activeTemplate === 'obsidian') {
    return (
      <footer 
        className="py-20 font-sans border-t border-white/5 transition-all duration-500"
        style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)' }}
      >
        <div className="container mx-auto px-8 md:px-16">
          <div className="flex flex-col lg:flex-row justify-between gap-20 mb-20">
             <div className="max-w-xl">
                <div className="text-6xl md:text-8xl font-black tracking-tighter italic mb-12 uppercase leading-none">
                  <EditableText content={store.settings?.footerMarketingTitle || t('theSyndicate')} settingsKey="footerMarketingTitle" slug={slug} />
                </div>
                <div className="text-white/40 text-lg font-light leading-relaxed">
                   <EditableText content={store.settings?.footerMarketingDesc || t('boundaryPushingDesign')} settingsKey="footerMarketingDesc" slug={slug} />
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-20 text-[10px] font-black uppercase tracking-[0.5em]">
                <div className="space-y-8">
                   <p className="text-white/20 mb-12">{t('navigate')}</p>
                   <Link href="#" className="block hover:text-white/50">{t('series')}</Link>
                   <Link href="#" className="block hover:text-white/50">{t('manifesto')}</Link>
                   <Link href="#" className="block hover:text-white/50">{t('journal')}</Link>
                </div>
                <div className="space-y-8">
                   <p className="text-white/20 mb-12">{t('support')}</p>
                   <Link href="#" className="block hover:text-white/50">{t('shipping')}</Link>
                   <Link href="#" className="block hover:text-white/50">{t('returns')}</Link>
                   <Link href="#" className="block hover:text-white/50">{t('help')}</Link>
                </div>
                <div className="space-y-8">
                   <p className="text-white/20 mb-12">{t('social')}</p>
                   <Link href="#" className="block hover:text-white/50">{t('instagram')}</Link>
                   <Link href="#" className="block hover:text-white/50">{t('discord')}</Link>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-10 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-white/40">
             <span>© {new Date().getFullYear()} {store.name} / All Rights Reserved</span>
             <div className="flex gap-12 italic">
                <span>{t('rawMaterials')}</span>
                <span>{t('maximumImpact')}</span>
             </div>
          </div>
        </div>
      </footer>
    );
  }

  // DEFAULT FOOTER
  return (
    <footer 
      className="py-16 font-sans transition-all duration-500"
      style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)' }}
    >
      <div className="max-w-screen-2xl mx-auto px-12 text-center">
        {store.name && (
          <h2 className="text-white text-4xl font-serif font-light tracking-[0.2em] uppercase mb-10">
            <span className="gradient-text-support">{store.name}</span>
          </h2>
        )}
        
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-[10px] font-black uppercase tracking-[0.4em] mb-16 border-y border-white/5 py-10">
            <div className="space-y-6">
               <p className="text-white mb-8">{t('contactUs')}</p>
               {store.settings?.contactInfo?.address && <p>{store.settings.contactInfo.address}</p>}
               {store.settings?.contactInfo?.phone && <p>{store.settings.contactInfo.phone}</p>}
               {store.settings?.contactInfo?.email && <p>{store.settings.contactInfo.email}</p>}
               {!store.settings?.contactInfo && (
                 <>
                   <div>
                     <EditableText 
                       content={store.settings?.footerLuxuryAddress1 || "New York, 5th Ave"} 
                       settingsKey="footerLuxuryAddress1" 
                       slug={slug} 
                     />
                   </div>
                   <div>
                     <EditableText 
                       content={store.settings?.footerLuxuryAddress2 || "Paris, Rue de Rivoli"} 
                       settingsKey="footerLuxuryAddress2" 
                       slug={slug} 
                     />
                   </div>
                 </>
               )}
            </div>
            <div className="space-y-6">
               <p className="text-white mb-8">{t('clientService')}</p>
               <Link href={`/store/${slug}/shipping`} className="block hover:text-white">{t('shippingReturns')}</Link>
               <Link href={`/store/${slug}/account`} className="block hover:text-white">{t('trackOrder')}</Link>
               <Link href={`/store/${slug}/contact`} className="block hover:text-white">{t('appointments')}</Link>
               <Link href={`/store/${slug}/wishlist`} className="block hover:text-white">{t('wishlist')}</Link>
            </div>
            <div className="space-y-6">
               <p className="text-white mb-8">{t('houseMatters')}</p>
               <Link href={`/store/${slug}/about`} className="block hover:text-white">{t('sustainability')}</Link>
               <Link href={`/store/${slug}/about`} className="block hover:text-white">{t('heritage')}</Link>
               <Link href={`/store/${slug}/about`} className="block hover:text-white">{t('careers')}</Link>
               <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                 <Link href={`/store/${slug}/terms`} className="block hover:text-white">{t('termsOfService')}</Link>
                 <Link href={`/store/${slug}/privacy`} className="block hover:text-white">{t('privacyPolicy')}</Link>
               </div>
            </div>
            <div className="space-y-6">
               <p className="text-white mb-8">{t('newsletter')}</p>
               <NewsletterForm slug={slug} />
            </div>
         </div>
        
         <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] uppercase tracking-[0.3em]">
            <div className="flex gap-12">
                 {Array.isArray(store.settings?.socialLinks) ? (
                   (store.settings.socialLinks as any[]).map((link: any) => (
                     <Link key={link.id} href={link.url} target="_blank" className="hover:text-white capitalize">{link.platform}</Link>
                   ))
                 ) : (
                   <>
                     {store.settings?.socialLinks?.instagram && (
                       <Link href={store.settings.socialLinks.instagram} target="_blank" className="hover:text-white">Instagram</Link>
                     )}
                     {store.settings?.socialLinks?.facebook && (
                       <Link href={store.settings.socialLinks.facebook} target="_blank" className="hover:text-white">Facebook</Link>
                     )}
                     {store.settings?.socialLinks?.twitter && (
                       <Link href={store.settings.socialLinks.twitter} target="_blank" className="hover:text-white">Twitter</Link>
                     )}
                     {store.settings?.socialLinks?.tiktok && (
                       <Link href={store.settings.socialLinks.tiktok} target="_blank" className="hover:text-white">TikTok</Link>
                     )}
                   </>
                 )}
                {!store.settings?.socialLinks && (
                  <>
                    <Link href="#" className="hover:text-white">Instagram</Link>
                    <Link href="#" className="hover:text-white">{t('pinterest')}</Link>
                  </>
                )}
            </div>
            <span>© {new Date().getFullYear()} {store.name} — Handcrafted for Excellence</span>
          </div>
        </div>
      </footer>
    );
  }

function NewsletterForm({ slug }: { slug: string }) {
  const { t } = useLanguageStore();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/newsletter/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStatus("success"); setEmail(""); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return <p className="text-green-400 text-[10px] font-black uppercase tracking-widest">{t('thanksSubscribing')}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-[8px] uppercase tracking-widest text-white/40">{t('subscribeText')}</p>
      <input
        type="email" required placeholder={t('emailAddress')}
        value={email} onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-white/40 transition-all text-xs text-white placeholder:text-white/20"
      />
      <button type="submit" disabled={status === "loading"} className="w-full bg-white text-black py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:opacity-80 transition-all disabled:opacity-50">
        {status === "loading" ? t('subscribing') : t('subscribeBtn')}
      </button>
    </form>
  );
}
