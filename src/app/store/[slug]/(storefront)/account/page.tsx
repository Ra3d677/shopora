import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShoppingBag, Package, Truck, CheckCircle2, Clock, XCircle, LogOut, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getTranslation } from "@/lib/i18n";

export default async function CustomerAccountPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params;
  const t = await getTranslation();
  const user = await getSession();
  const sp = (await searchParams) || {};
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!user) {
    redirect(`/store/${slug}/login`);
  }

  const store = await prisma.store.findUnique({
    where: { slug }
  });

  if (!store) {
    redirect("/");
  }

  // Get paginated orders (limit to 20) and total count to avoid SELECT * without limit
  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
      storeId: store.id
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take: limit
  });

  const totalCount = await prisma.order.count({
    where: {
      userId: user.id,
      storeId: store.id
    }
  });

  const hasMore = skip + orders.length < totalCount;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white border-b border-slate-100 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">{t('myAccount')}</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        {t('loggedInAs')} <span className="text-slate-900">{user.email}</span>
                    </p>
                </div>
                <LogoutButton slug={slug} />
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-12">
        <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="w-6 h-6 text-slate-900" />
            <h2 className="text-xl font-black uppercase tracking-tight">{t('orderHistory')}</h2>
            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalCount}</span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{t('noOrdersYet')}</h3>
            <p className="text-slate-500 font-medium mb-8">{t('yourCartIsEmpty')}</p>
            <Link href={`/store/${slug}/products`} className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
                {t('startShopping')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group hover:border-slate-300 transition-all">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${getStatusColor(order.status)} shadow-sm`}>
                            {getStatusIcon(order.status)}
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{t('orderNum')}{order.id.slice(-6).toUpperCase()}</p>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{t('statusColon')} {order.status}</h4>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{t('orderedOn')}</p>
                        <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                    <div className="flex flex-col md:items-end">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{t('totalAmountColon')}</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                    </div>
                </div>

                <div className="p-6 md:p-8 bg-slate-50/50">
                    <div className="flex flex-wrap gap-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                    {item.product?.images && (
                                        <Image 
                                            src={JSON.parse(item.product.images)[0]} 
                                            alt={item.product.name} 
                                            fill 
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-tight text-slate-900 line-clamp-1">{item.product?.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity} • {item.size}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            ))}

            {/* Storefront Pagination Controls */}
            {(page > 1 || hasMore) && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm gap-4">
                {page > 1 ? (
                  <Link 
                    href={`/store/${slug}/account?page=${page - 1}`}
                    className="w-full sm:w-auto text-center bg-white border border-slate-200 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    {t('previousPage')}
                  </Link>
                ) : (
                  <div className="hidden sm:block w-32" />
                )}
                
                <span className="text-slate-500 font-bold tracking-widest text-[10px] uppercase text-center">
                  {t('pageOf').replace('{page}', page.toString()).replace('{total}', Math.ceil(totalCount / limit).toString() || '1')}
                </span>
                
                {hasMore ? (
                  <Link 
                    href={`/store/${slug}/account?page=${page + 1}`}
                    className="w-full sm:w-auto text-center bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    {t('nextPage')}
                  </Link>
                ) : (
                  <div className="hidden sm:block w-32" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
