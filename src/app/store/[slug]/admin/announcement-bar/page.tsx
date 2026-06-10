import { getStoreBySlug } from "@/lib/data";
import IronPeakAnnouncementBar from "./IronPeakAnnouncementBar";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AnnouncementBarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  if (store.template !== 'ironpeak') {
    return <div className="max-w-4xl mx-auto p-8 text-center text-slate-400 text-sm">This feature is only available for the IronPeak template.</div>;
  }

  const ipSettings = store.settings?.ironpeakSettings || {};
  return <IronPeakAnnouncementBar slug={slug} initialSettings={ipSettings} />;
}
