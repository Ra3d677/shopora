"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface PixelTrackerProps {
  facebookPixelId?: string | null;
  tiktokPixelId?: string | null;
  snapchatPixelId?: string | null;
  googleAnalyticsId?: string | null;
}

export default function PixelTracker({ 
  facebookPixelId, 
  tiktokPixelId, 
  snapchatPixelId, 
  googleAnalyticsId 
}: PixelTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle PageView events on route change
  useEffect(() => {
    // Facebook Pixel PageView
    if (facebookPixelId && typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }

    // TikTok Pixel PageView
    if (tiktokPixelId && typeof window !== "undefined" && (window as any).ttq?.page) {
      (window as any).ttq.page();
    }

    // Snapchat Pixel PageView
    if (snapchatPixelId && typeof window !== "undefined" && (window as any).snaptr) {
      (window as any).snaptr('track', 'PAGE_VIEW');
    }

    // Google Analytics PageView
    if (googleAnalyticsId && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('config', googleAnalyticsId, {
        page_path: pathname,
      });
    }
  }, [pathname, searchParams, facebookPixelId, tiktokPixelId, snapchatPixelId, googleAnalyticsId]);

  return (
    <>
      {/* Facebook Pixel Base Code */}
      {facebookPixelId && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* TikTok Pixel Base Code */}
      {tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","aliasWithContext","setAndVerify","getAndVerify"];ttq.setAndVerify=function(t,n){return function(){t.push([n].concat([].slice.call(arguments)))}};for(var i=0;i<ttq.methods.length;i++)ttq[ttq.methods[i]]=ttq.setAndVerify(ttq,ttq.methods[i]);ttq.load=function(e,n){var t="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=t,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=t+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${tiktokPixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* Snapchat Pixel Base Code */}
      {snapchatPixelId && (
        <Script id="snapchat-pixel" strategy="afterInteractive">
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');
            snaptr('init', '${snapchatPixelId}');
            snaptr('track','PAGE_VIEW');
          `}
        </Script>
      )}

      {/* Google Analytics Base Code */}
      {googleAnalyticsId && (
        <>
          <Script 
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
