import { getStoreBySlug } from "@/lib/data";
import TemplatesManager from "./TemplatesManager";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  const session = await getSession();
  
  if (!store) {
    notFound();
  }

  const isSuperAdmin = session?.email === 'ksh128395@gmail.com';

  // Fetch all templates from DB
  const templates = await prisma.template.findMany({
    where: isSuperAdmin ? {} : { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
  
  return (
    <TemplatesManager 
      slug={slug} 
      initialTemplate={store.template} 
      templates={JSON.parse(JSON.stringify(templates))}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
