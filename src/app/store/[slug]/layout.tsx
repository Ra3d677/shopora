import { getStoreBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { getSession } from "@/lib/auth";

export default async function TenantStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }
  
  const user = await getSession();

  return (
    <StoreProvider store={store} user={user}>
      {children}
    </StoreProvider>
  );
}
