import { getStoreBySlug } from "@/lib/data";
import BannersManager from "./BannersManager";
import IronPeakBannersManager from "./IronPeakBannersManager";
import TwoHBannersManager from "./TwoHBannersManager";
import HaylerBannersManager from "./HaylerBannersManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  
  if (!store) {
    notFound();
  }

  if (store.template === 'hayler') {
    const haylerSettings = store.settings?.haylerSettings || {};
    return <HaylerBannersManager slug={slug} initialSettings={haylerSettings} />;
  }

  if (store.template === '2h') {
    const twohSettings = store.settings?.twohSettings || {};
    return <TwoHBannersManager slug={slug} initialSettings={twohSettings} />;
  }

  if (store.template === 'ironpeak') {
    const ipSettings = store.settings?.ironpeakSettings || {};
    return <IronPeakBannersManager slug={slug} initialSettings={ipSettings} />;
  }
  
  return (
    <BannersManager 
      slug={slug} 
      initialBanners={JSON.parse(JSON.stringify(store.banners))} 
      initialSettings={store.settings.bannerSettings || { autoPlay: true, interval: 5000, transition: 'slide', showArrows: true, showDots: true }}
    />
  );
}
