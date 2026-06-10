import { getStoreBySlug } from "@/lib/data";
import TwoMAboutUsManager from "./TwoMAboutUsManager";
import IronPeakAboutUsManager from "./IronPeakAboutUsManager";
import TwoHAboutUsManager from "./TwoHAboutUsManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminAboutUsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  if (store.template === '2h') {
    const twohSettings = store.settings?.twohSettings || {};
    return <TwoHAboutUsManager slug={slug} initialSettings={twohSettings} />;
  }

  if (store.template === '2m') {
    const twoMAboutUs = store.settings?.twoMAboutUs || null;
    return <TwoMAboutUsManager slug={slug} initialContent={twoMAboutUs} />;
  }

  if (store.template === 'ironpeak') {
    const ipSettings = store.settings?.ironpeakSettings || {};
    return <IronPeakAboutUsManager slug={slug} initialSettings={ipSettings} />;
  }

  return <div className="max-w-4xl mx-auto p-8 text-center text-slate-400 text-sm">This template does not support a dedicated About Us editor.</div>;
}
