import { getStoreMedia } from "@/lib/data";
import MediaGrid from "./MediaGrid";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MediaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const media = await getStoreMedia(slug);

  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase flex items-center gap-6">
            Asset <span className="text-cyan-400">Vault</span>
          </h1>
          <p className="text-slate-500 mt-3 font-medium tracking-widest text-[10px] uppercase">Centralized repository for your store's visual resources.</p>
        </div>
      </div>

      <MediaGrid initialMedia={JSON.parse(JSON.stringify(media))} slug={slug} />
    </div>
  );
}
