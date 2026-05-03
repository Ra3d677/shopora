"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/tracking";

export default function PurchaseTracker({ order, store }: { order: any, store: any }) {
  useEffect(() => {
    if (order && store) {
      trackPurchase(order, store);
    }
  }, [order, store]);

  return null;
}
