import { getStoreMedia } from "@/lib/data";
import MediaGrid from "./MediaGrid";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MediaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const media = await getStoreMedia(slug);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <ImageIcon className="w-8 h-8" /> Media Library
        </h1>
        <p className="text-muted-foreground mt-1">Manage your store's images and videos. Upload new assets or link external URLs.</p>
      </div>

      <MediaGrid initialMedia={JSON.parse(JSON.stringify(media))} slug={slug} />
    </div>
  );
}
