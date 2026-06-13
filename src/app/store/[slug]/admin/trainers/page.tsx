import { getStoreBySlug } from "@/lib/data";
import IronPeakTrainersManager from "./IronPeakTrainersManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminTrainersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  if (store.template === 'ironpeak') {
    const ipSettings = store.settings?.ironpeakSettings || {};
    return <IronPeakTrainersManager slug={slug} initialSettings={ipSettings} />;
  }

  return <div className="max-w-4xl mx-auto p-8 text-center text-slate-400 text-sm">This template does not support a dedicated Trainers editor.</div>;
}
