import { getStoreBySlug } from "@/lib/data";
import BannersManager from "./BannersManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  
  if (!store) {
    notFound();
  }
  
  return (
    <BannersManager 
      slug={slug} 
      initialBanners={JSON.parse(JSON.stringify(store.banners))} 
      initialSettings={store.settings.bannerSettings || { autoPlay: true, interval: 5000, transition: 'slide', showArrows: true, showDots: true }}
    />
  );
}
