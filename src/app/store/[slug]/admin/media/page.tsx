import { getStoreMedia } from "@/lib/data";
import MediaGrid from "./MediaGrid";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MediaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const media = await getStoreMedia(slug);

  return (
    <div className="p-10">
      <MediaGrid initialMedia={JSON.parse(JSON.stringify(media))} slug={slug} />
    </div>
  );
}
