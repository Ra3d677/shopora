import { getStoreBySlug } from "@/lib/data";
import AboutUsManager from "./AboutUsManager";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminAboutUsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();
  const aboutUsContent = store.settings?.aboutUsContent || null;
  return <AboutUsManager slug={slug} initialContent={aboutUsContent} />;
}
