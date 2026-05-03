"use client";

import { useEffect, useRef } from "react";
import { recordVisit } from "@/app/actions";

export default function VisitorTracker({ slug }: { slug: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per session/mount
    if (hasTracked.current) return;
    
    const track = async () => {
      try {
        await recordVisit(slug);
        hasTracked.current = true;
      } catch (e) {
        // Silent error
      }
    };

    track();
  }, [slug]);

  return null;
}
