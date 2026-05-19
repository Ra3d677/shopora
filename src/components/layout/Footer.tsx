"use client";

import Link from "next/link";
import { useStore } from "@/components/providers/StoreProvider";
import EditableText from "@/components/editor/EditableText";

export default function Footer() {
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
                content={store.settings?.footerMinimalDesc || "A study in form and function. Curated essentials for the modern minimalist. Designed to last a lifetime, not a season."} 
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
                <span className="text-zinc-600">Links</span>
                <Link href="#" className="text-white hover:opacity-50">Inprint</Link>
                <Link href="#" className="text-white hover:opacity-50">Privacy</Link>
                <Link href="#" className="text-white hover:opacity-50">Contact</Link>
             </div>
             <div className="flex flex-col gap-4">
                <span className="text-zinc-600">Social</span>
                {store.settings?.socialLinks?.instagram && (
                  <Link href={store.settings.socialLinks.instagram} target="_blank" className="text-white hover:opacity-50">Instagram</Link>
                )}
                {store.settings?.socialLinks?.facebook && (
                  <Link href={store.settings.socialLinks.facebook} target="_blank" className="text-white hover:opacity-50">Facebook</Link>
                )}
                {store.settings?.socialLinks?.twitter && (
                  <Link href={store.settings.socialLinks.twitter} target="_blank" className="text-white hover:opacity-50">Twitter</Link>
                )}
                {!store.settings?.socialLinks && (
                  <>
                    <Link href="#" className="text-white hover:opacity-50">Instagram</Link>
                    <Link href="#" className="text-white hover:opacity-50">Twitter</Link>
                  </>
                )}
             </div>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto mt-16 pt-8 border-t border-zinc-900 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-600">
           <span>© {new Date().getFullYear()} {store.name}</span>
           <span>Built by Antigravity</span>
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
              <h4 className="font-semibold mb-2">Shop and Learn</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Store</Link></li>
                <li><Link href="#" className="hover:underline">Mac</Link></li>
                <li><Link href="#" className="hover:underline">iPad</Link></li>
                <li><Link href="#" className="hover:underline">iPhone</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Account</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Manage Your ID</Link></li>
                <li><Link href="#" className="hover:underline">Store Account</Link></li>
                <li><Link href="#" className="hover:underline">iCloud.com</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Business</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Shop for Business</Link></li>
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
              <Link href="#" className="hover:underline">Privacy Policy</Link>
              <span className="border-l border-[#d2d2d7]"></span>
              <Link href="#" className="hover:underline">Terms of Use</Link>
              <span className="border-l border-[#d2d2d7]"></span>
              <Link href="#" className="hover:underline">Sales and Refunds</Link>
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
                  <EditableText content={store.settings?.footerMarketingTitle || "The Syndicate"} settingsKey="footerMarketingTitle" slug={slug} />
                </div>
                <div className="text-white/40 text-lg font-light leading-relaxed">
                   <EditableText content={store.settings?.footerMarketingDesc || "Boundary-pushing design. Engineered for longevity. Join the movement toward sustainable impact."} settingsKey="footerMarketingDesc" slug={slug} />
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-20 text-[10px] font-black uppercase tracking-[0.5em]">
                <div className="space-y-8">
                   <p className="text-white/20 mb-12">Navigate</p>
                   <Link href="#" className="block hover:text-white/50">Series</Link>
                   <Link href="#" className="block hover:text-white/50">Manifesto</Link>
                   <Link href="#" className="block hover:text-white/50">Journal</Link>
                </div>
                <div className="space-y-8">
                   <p className="text-white/20 mb-12">Support</p>
                   <Link href="#" className="block hover:text-white/50">Shipping</Link>
                   <Link href="#" className="block hover:text-white/50">Returns</Link>
                   <Link href="#" className="block hover:text-white/50">Help</Link>
                </div>
                <div className="space-y-8">
                   <p className="text-white/20 mb-12">Social</p>
                   <Link href="#" className="block hover:text-white/50">Instagram</Link>
                   <Link href="#" className="block hover:text-white/50">Discord</Link>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-10 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-white/40">
             <span>© {new Date().getFullYear()} {store.name} / All Rights Reserved</span>
             <div className="flex gap-12 italic">
                <span>RAW MATERIALS</span>
                <span>MAXIMUM IMPACT</span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[10px] font-black uppercase tracking-[0.4em] mb-16 border-y border-white/5 py-10">
           <div className="space-y-6">
              <p className="text-white mb-8">Contact Us</p>
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
              <p className="text-white mb-8">Client Service</p>
              <Link href={`/store/${slug}/shipping`} className="block hover:text-white">Shipping & Returns</Link>
              <Link href={`/store/${slug}/account`} className="block hover:text-white">Track Order</Link>
              <Link href={`/store/${slug}/contact`} className="block hover:text-white">Appointments</Link>
           </div>
           <div className="space-y-6">
              <p className="text-white mb-8">House Matters</p>
              <Link href={`/store/${slug}/about`} className="block hover:text-white">Sustainability</Link>
              <Link href={`/store/${slug}/about`} className="block hover:text-white">Heritage</Link>
              <Link href={`/store/${slug}/about`} className="block hover:text-white">Careers</Link>
              <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                <Link href={`/store/${slug}/terms`} className="block hover:text-white">Terms of Service</Link>
                <Link href={`/store/${slug}/privacy`} className="block hover:text-white">Privacy Policy</Link>
              </div>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] uppercase tracking-[0.3em]">
           <div className="flex gap-12">
              {store.settings?.socialLinks?.instagram && (
                <Link href={store.settings.socialLinks.instagram} target="_blank" className="hover:text-white">Instagram</Link>
              )}
              {store.settings?.socialLinks?.facebook && (
                <Link href={store.settings.socialLinks.facebook} target="_blank" className="hover:text-white">Facebook</Link>
              )}
              {store.settings?.socialLinks?.twitter && (
                <Link href={store.settings.socialLinks.twitter} target="_blank" className="hover:text-white">Twitter</Link>
              )}
              {!store.settings?.socialLinks && (
                <>
                  <Link href="#" className="hover:text-white">Instagram</Link>
                  <Link href="#" className="hover:text-white">Pinterest</Link>
                </>
              )}
           </div>
           <span>© {new Date().getFullYear()} {store.name} — Handcrafted for Excellence</span>
        </div>
      </div>
    </footer>
  );
}
