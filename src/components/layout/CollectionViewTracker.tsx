"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/tracking";

export default function CollectionViewTracker({ collection, store }: { collection: any, store: any }) {
  useEffect(() => {
    if (collection && store) {
      // Track collection view as ViewContent
      trackViewContent({
        id: collection.id,
        name: collection.name,
        price: 0
      }, store);
    }
  }, [collection, store]);

  return null;
}
