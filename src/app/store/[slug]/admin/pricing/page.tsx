import { getStoreBySlug } from "@/lib/data";
import IronPeakPricingManager from "./IronPeakPricingManager";
import TwoHPricingManager from "./TwoHPricingManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPricingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  if (store.template === '2h') {
    const twohSettings = store.settings?.twohSettings || {};
    return <TwoHPricingManager slug={slug} initialSettings={twohSettings} />;
  }

  if (store.template !== 'ironpeak') {
    return <div className="max-w-4xl mx-auto p-8 text-center text-slate-400 text-sm">Pricing management is only available for the IronPeak and 2H templates.</div>;
  }

  const ipSettings = store.settings?.ironpeakSettings || {};
  return <IronPeakPricingManager slug={slug} initialSettings={ipSettings} />;
}
