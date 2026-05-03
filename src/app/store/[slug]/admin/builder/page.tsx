import { getStoreSettingsBySlug } from "@/lib/data";
import BuilderManager from "./BuilderManager";

export const dynamic = 'force-dynamic';

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentSettings = await getStoreSettingsBySlug(slug);
  
  return <BuilderManager initialSettings={JSON.parse(JSON.stringify(currentSettings))} slug={slug} />;
}
