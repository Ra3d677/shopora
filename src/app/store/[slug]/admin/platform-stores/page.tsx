import { getSession } from "@/lib/auth";
import { getAllStores } from "@/lib/data";
import { redirect } from "next/navigation";
import PlatformStoresManager from "./PlatformStoresManager";

export default async function PlatformStoresPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  
  // Security Check: Only Super Admins can access this page
  if (!session || session.role !== 'superadmin') {
    redirect(`/store/${slug}/admin/dashboard`);
  }

  const stores = await getAllStores();

  return <PlatformStoresManager stores={stores} />;
}
