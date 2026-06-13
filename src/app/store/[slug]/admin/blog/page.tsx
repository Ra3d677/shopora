import { getStoreBySlug } from "@/lib/data";
import IronPeakBlogManager from "./IronPeakBlogManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  if (store.template === 'ironpeak') {
    const ipSettings = store.settings?.ironpeakSettings || {};
    return <IronPeakBlogManager slug={slug} initialSettings={ipSettings} />;
  }

  return <div className="max-w-4xl mx-auto p-8 text-center text-slate-400 text-sm">This template does not support a dedicated Blog editor.</div>;
}
