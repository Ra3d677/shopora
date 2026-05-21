import { getOrderById, getStoreBySlug } from "@/lib/data";
import PurchaseTracker from "@/components/layout/PurchaseTracker";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: { slug: string },
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId as string;
  const order = orderId ? await getOrderById(orderId) : null;
  const store = await getStoreBySlug(slug);
  const t = await getTranslation();
  const displayOrderId = orderId || "ORD-UNKNOWN";

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
      <Suspense fallback={null}>
        <PurchaseTracker order={order} store={store} />
      </Suspense>
      <div className="bg-card p-10 rounded-3xl border border-border/50 shadow-sm max-w-lg w-full text-center flex flex-col items-center">
        <div className="h-24 w-24 bg-success/10 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-3">{t('orderConfirmed')}</h1>
        <p className="text-muted-foreground mb-8">
          {t('orderConfirmedDesc')}
        </p>

        <div className="bg-muted w-full p-6 rounded-2xl mb-10 border border-border/50">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">{t('orderNumber')}</p>
          <p className="text-xl font-bold font-mono text-primary">{displayOrderId}</p>
        </div>

        <Link 
          href={`/store/${slug}/products`} 
          className="bg-primary text-white w-full h-14 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
        >
          {t('continueShopping')} <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
