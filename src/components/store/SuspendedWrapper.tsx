"use client";

import { usePathname } from "next/navigation";
import SuspendedStoreClient from "./SuspendedStoreClient";

export default function SuspendedWrapper({
  children,
  slug,
  isOwner,
  isSuspended,
}: {
  children: React.ReactNode;
  slug: string;
  isOwner: boolean;
  isSuspended: boolean;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith(`/store/${slug}/admin`);

  if (isSuspended && !isAdminRoute) {
    return <SuspendedStoreClient slug={slug} isOwner={isOwner} />;
  }

  return <>{children}</>;
}
