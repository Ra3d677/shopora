import { DollarSign, ShoppingBag, Package, CheckCircle2, Clock, Eye, Compass, BarChart3, Users } from "lucide-react";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import ExportButton from "./ExportButton";
import DateFilter from "./DateFilter";
import TourismDemoSeedButton from "./TourismDemoSeedButton";
import LowStockAlerts from "./LowStockAlerts";
import RevenueChart from "./RevenueChart";
import RecentActivity from "./RecentActivity";
import TrialBanner from "@/components/store/TrialBanner";
import { getTranslation, getLang } from "@/lib/i18n";

export default async function AdminDashboard({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ range?: string }> }) {
  const { slug } = await params;
  const sp = (await searchParams) || {};
  const currentRange = sp.range || 'all_time';

  const t = await getTranslation();
  const lang = await getLang();
  const isRTL = lang === 'ar';

  const now = new Date();
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (currentRange === 'today') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (currentRange === 'last_7_days') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
  } else if (currentRange === 'this_month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (currentRange === 'last_month') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (currentRange === 'this_year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  const baseWhereCondition: any = {};
  if (startDate) {
    baseWhereCondition.createdAt = { gte: startDate };
    if (endDate) {
      baseWhereCondition.createdAt.lte = endDate;
    }
  }

  const store = await prisma.store.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      status: true,
      trialEndsAt: true,
      subscriptionEndsAt: true,
      orders: {
        where: baseWhereCondition,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          customerEmail: true,
          customerName: true,
          customerPhone: true,
          items: {
            select: {
              productId: true,
              quantity: true
            }
          }
        }
      },
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          stock_quantity: true,
          category: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  if (!store) {
    return (
      <div className="p-20 text-center admin-bg min-h-screen">
         <h1 className="text-2xl font-black admin-text uppercase italic">{isRTL ? "المتجر غير موجود" : "Store Not Found"}</h1>
         <p className="admin-text-muted mt-4 font-bold tracking-[0.08em] text-xs">{isRTL ? "المتجر المطلوب غير موجود في قاعدة البيانات." : "The requested store does not exist."}</p>
      </div>
    );
  }

  // Count visits and cart additions directly in the database (egress optimized)
  const totalVisits = await prisma.visit.count({
    where: {
      storeId: store.id,
      ...baseWhereCondition
    }
  });

  const totalCartAdds = await prisma.cartAdd.count({
    where: {
      storeId: store.id,
      ...baseWhereCondition
    }
  });

  const totalOrders = store.orders.length;
  // Only include shipped or delivered orders in total revenue
  const totalRevenue = store.orders
    .filter(order => ['shipped', 'delivered'].includes(order.status))
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  // Previous period data for growth calculation
  let prevStartDate: Date | null = null;
  let prevEndDate: Date | null = startDate;
  
  if (startDate) {
    const duration = now.getTime() - startDate.getTime();
    prevStartDate = new Date(startDate.getTime() - duration);
  }

  const prevOrders = (prevStartDate && prevEndDate) ? await prisma.order.findMany({
    where: {
      storeId: store.id,
      createdAt: { gte: prevStartDate, lt: prevEndDate }
    },
    select: {
      status: true,
      totalAmount: true
    }
  }) : [];

  const prevRevenue = prevOrders
    .filter(order => ['shipped', 'delivered'].includes(order.status))
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 100;

  const uniqueCustomers = new Set(store.orders.map(o => o.customerEmail)).size;
  const inStockProducts = store.products.filter(p => p.stock_quantity > 0).length;

  // Abandonment Rate
  const abandonmentRate = totalCartAdds > 0 ? (((totalCartAdds - totalOrders) / totalCartAdds) * 100).toFixed(1) : "0.0";
  const retentionRate = "0.0";

  // Heatmap Data (Orders by Hour and Day - Adjusted for UTC+3)
  const heatmap = Array(7).fill(0).map(() => Array(24).fill(0));
  store.orders.forEach(order => {
    try {
      const d = new Date(order.createdAt);
      if (!isNaN(d.getTime())) {
        const localHour = (d.getHours() + 3) % 24;
        const localDay = d.getDay(); 
        heatmap[localDay][localHour]++;
      }
    } catch(e) {}
  });

  // Low Stock Alerts
  const lowStockProducts = store.products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 5);

  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const conversionRate = totalVisits > 0 ? ((totalOrders / totalVisits) * 100).toFixed(1) : "0.0";

  const recentOrders = store.orders.slice(0, 5);

  // Compute product sales from the filtered orders
  const productSalesMap = new Map<string, number>();
  store.orders.forEach(order => {
    order.items.forEach(item => {
      productSalesMap.set(item.productId, (productSalesMap.get(item.productId) || 0) + item.quantity);
    });
  });

  const allProductsWithSales = store.products.map(p => {
    const salesCount = productSalesMap.get(p.id) || 0;
    let image = "";
    try {
      if (p.images) {
        const parsed = JSON.parse(p.images);
        if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
      }
    } catch (e) {}
    return { ...p, salesCount, image };
  });

  const topProducts = [...allProductsWithSales]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  // Get aggregated daily metrics for this store to draw the line chart (egress optimized)
  const dailyMetrics = await prisma.dailyMetric.findMany({
    where: {
      storeId: store.id
    },
    select: {
      date: true,
      revenue: true
    }
  });

  const monthlyRevenue = Array(12).fill(0);
  
  dailyMetrics.forEach(metric => {
    const d = new Date(metric.date);
    const month = d.getMonth();
    monthlyRevenue[month] += Number(metric.revenue || 0);
  });

  const maxMonthRevenue = Math.max(...monthlyRevenue, 1);
  const trendData = monthlyRevenue.map(rev => (rev / maxMonthRevenue) * 100);

  const dateRangeLabels: Record<string, string> = {
    all_time: "All Time",
    today: "Today",
    last_7_days: "Last 7 Days",
    this_month: "This Month",
    last_month: "Last Month",
    this_year: "This Year",
  };
  const dateRange = dateRangeLabels[currentRange] || "All Time";

  const isWebsite = store.type === 'WEBSITE';

  return (
    <div dir={isRTL ? "rtl" : "ltr"}             className={`min-h-screen p-4 md:p-8 pb-8 font-sans selection:bg-cyan-500/30 admin-bg admin-text ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header Section */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div>
           <h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter admin-text mb-2 uppercase">
             {isWebsite ? t('websiteAnalytics') : t('analyticsDashboard')}
           </h1>
           <p className="admin-text-muted font-medium tracking-wide">
             {isWebsite ? t('websiteAnalyticsDesc') : t('analyticsDashboardDesc')}
           </p>
        </div>
        <div className="flex items-center gap-4 admin-card p-2 rounded-2xl border admin-border shadow-2xl">
           <DateFilter />
           <ExportButton
             storeName={store.name}
             dateRange={dateRange}
             metrics={{
               totalRevenue,
               revenueGrowth,
               totalOrders,
               totalVisits,
               conversionRate,
               uniqueCustomers,
               averageOrderValue,
               abandonmentRate,
               retentionRate,
               inStockProducts,
             }}
             topProducts={topProducts.map(p => ({ name: p.name, salesCount: p.salesCount, price: p.price, image: p.image }))}
             recentOrders={recentOrders.map(o => ({ customerName: o.customerName, totalAmount: Number(o.totalAmount), status: o.status, createdAt: o.createdAt.toISOString() }))}
             lowStockProducts={lowStockProducts.map(p => ({ name: p.name, stock_quantity: p.stock_quantity }))}
           />
        </div>
      </div>

      {isWebsite && <TourismDemoSeedButton storeId={store.id} />}

      {(store as any).trialEndsAt && (
        <div className="mb-6">
          <TrialBanner slug={slug} trialEndsAt={(store as any).trialEndsAt.toISOString()} />
        </div>
      )}

      {(store as any).subscriptionEndsAt && !(store as any).trialEndsAt && (
        <div className="mb-6">
          <TrialBanner slug={slug} trialEndsAt={(store as any).subscriptionEndsAt.toISOString()} isSubscription />
        </div>
      )}

      {/* KPI Blocks - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         {/* Revenue / Inquiries Card */}
         <div className="admin-card p-6 rounded-xl border admin-border relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-500">
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all ${isRTL ? 'right-auto -left-8' : ''}`}></div>
            <h4 className={`text-[9px] font-black tracking-[0.08em] admin-text-muted mb-4 flex items-center gap-2 ${isRTL ? 'justify-start' : ''}`}>
               {isWebsite ? <Users className="w-3 h-3 text-cyan-400" /> : <DollarSign className="w-3 h-3 text-cyan-400" />} 
               {isWebsite ? t('inquiryLeads') : t('totalRevenue')}
            </h4>
            <div className="flex items-end gap-3 mb-3">
               <h3 className="text-3xl font-black tracking-tighter admin-text drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                 {isWebsite 
                   ? totalOrders 
                   : `$${totalRevenue > 1000 ? (totalRevenue/1000).toFixed(1) + 'k' : totalRevenue.toFixed(0)}`
                 }
               </h3>
               {!isWebsite && (
                 <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full mb-1 ${revenueGrowth >= 0 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
                    {revenueGrowth >= 0 ? '▲' : '▼'} {Math.abs(revenueGrowth).toFixed(1)}%
                 </div>
               )}
               {isWebsite && (
                 <div className="flex items-center text-[10px] font-black px-2 py-0.5 rounded-full mb-1 bg-cyan-500/10 text-cyan-400">
                    {uniqueCustomers} {t('uniqueLeads')}
                 </div>
               )}
            </div>
            <p className="text-[10px] font-bold admin-text-muted uppercase tracking-widest">
              {isWebsite ? `${t('responseRate')}:` : `${t('vsLastMonth')}:`}               <span className="admin-text">{isWebsite ? "100%" : `$${prevRevenue.toFixed(0)}`}</span>
            </p>
         </div>

         {/* Orders / Visits Card */}
         <div className="admin-card p-6 rounded-xl border admin-border relative overflow-hidden group hover:border-pink-500/50 transition-all duration-500">
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all ${isRTL ? 'right-auto -left-8' : ''}`}></div>
            <h4 className={`text-[9px] font-black tracking-[0.08em] admin-text-muted mb-4 flex items-center gap-2 ${isRTL ? 'justify-start' : ''}`}>
               {isWebsite ? <Eye className="w-3 h-3 text-pink-400" /> : <ShoppingBag className="w-3 h-3 text-pink-400" />} 
               {isWebsite ? t('pageVisits') : t('totalOrders')}
            </h4>
            <div className="flex items-end gap-3 mb-3">
               <h3 className="text-3xl font-black tracking-tighter admin-text drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                 {isWebsite ? totalVisits : totalOrders}
               </h3>
               <div className="flex items-center text-[10px] font-black px-2 py-0.5 rounded-full mb-1 bg-pink-500/10 text-pink-400">
                  {isWebsite ? `${conversionRate}% ${t('conversionRate')}` : `${uniqueCustomers} ${t('customers')}`}
               </div>
            </div>
            <p className="text-[10px] font-bold admin-text-muted tracking-[0.08em]">
              {isWebsite ? `${t('trafficSource')}:` : `${t('avgValue')}:`}               <span className="admin-text">{isWebsite ? t('organicDirect') : `$${averageOrderValue.toFixed(0)}`}</span>
            </p>
         </div>

         {/* Inventory / Packages Card */}
         <div className="admin-card p-6 rounded-xl border admin-border relative overflow-hidden group hover:border-amber-500/50 transition-all duration-500">
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all ${isRTL ? 'right-auto -left-8' : ''}`}></div>
            <h4 className={`text-[9px] font-black tracking-[0.08em] admin-text-muted mb-4 flex items-center gap-2 ${isRTL ? 'justify-start' : ''}`}>
               {isWebsite ? <Compass className="w-3 h-3 text-amber-400" /> : <Package className="w-3 h-3 text-amber-400" />} 
               {isWebsite ? t('activePackages') : t('inStock')}
            </h4>
            <div className="flex items-end gap-3 mb-3">
               <h3 className="text-3xl font-black tracking-tighter admin-text drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                 {isWebsite ? store.products.length : inStockProducts}
               </h3>
               <div className="flex items-center text-[10px] font-black px-2 py-0.5 rounded-full mb-1 bg-amber-500/10 text-amber-400">
                  {isWebsite ? t('showcaseLive') : `${lowStockProducts.length} ${t('needsAttention')}`}
               </div>
            </div>
            <p className="text-[10px] font-bold admin-text-muted tracking-[0.08em]">
              {isWebsite ? `${t('tourismTemplate')}:` : `${t('activeProducts')}:`} <span className="admin-text">{isWebsite ? t('active') : store.products.length}</span>
            </p>
         </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="mb-6 admin-card p-6 rounded-xl border admin-border">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-black italic admin-text tracking-tight">
            {t('monthlyRevenueTrend')}
          </h3>
        </div>
        <div className="h-48 w-full">
          <RevenueChart data={monthlyRevenue} isRTL={isRTL} />
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Funnel + Recent Activity */}
          <div className="lg:col-span-1 space-y-8">
             {/* Sales / Leads Funnel */}
              <div className="admin-card p-6 rounded-2xl border admin-border shadow-2xl">
                <h3 className="text-lg font-black italic admin-text mb-6 tracking-tight">
                  {isWebsite ? t('leadsFunnel') : t('salesFunnel')}
               </h3>
               <div className="space-y-4">
                  {/* Step 1: Add to Cart / Visits */}
                  <div className="admin-subcard p-5 rounded-xl border admin-border flex items-center justify-between group hover:border-purple-500/30 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/5">
                           {isWebsite ? <Eye className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                        </div>
                        <div>
                           <p className="text-[9px] font-black tracking-[0.08em] admin-text-muted">
                             {isWebsite ? t('websiteVisits') : t('addToCartLabel')}
                           </p>
                            <h4 className="text-lg font-black admin-text">{isWebsite ? totalVisits : totalCartAdds}</h4>
                        </div>
                     </div>
                  </div>
                  {/* Step 2: Clicks / Checkout */}
                  <div className="admin-subcard p-5 rounded-xl border admin-border flex items-center justify-between group hover:border-amber-500/30 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/5">
                           {isWebsite ? <Compass className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                        </div>
                        <div>
                           <p className="text-[9px] font-black tracking-[0.08em] admin-text-muted">
                             {isWebsite ? t('packageClicks') : t('checkoutLabel')}
                           </p>
                            <h4 className="text-lg font-black admin-text">{isWebsite ? totalCartAdds : "---"}</h4>
                        </div>
                     </div>
                  </div>
                  {/* Step 3: Purchased / Inquiries */}
                  <div className="admin-subcard p-5 rounded-xl border admin-border flex items-center justify-between group hover:border-green-500/30 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 shadow-lg shadow-green-500/5">
                           <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black tracking-[0.08em] admin-text-muted">
                             {isWebsite ? t('inquiriesSubmitted') : t('purchasedLabel')}
                           </p>
                            <h4 className="text-lg font-black admin-text">{totalOrders}</h4>
                        </div>
                     </div>
                     <span className="text-[9px] font-black text-green-400 shadow-green-400/50 drop-shadow-md">{t('goalLabel')}</span>
                  </div>
               </div>
            </div>

            <RecentActivity
              orders={recentOrders.map(o => ({
                id: o.id,
                customerName: o.customerName || 'Unknown',
                totalAmount: Number(o.totalAmount),
                status: o.status,
                createdAt: o.createdAt.toISOString(),
              }))}
              slug={slug}
            />
          </div>

          {/* Right Column: Top Products and Heatmap */}
         <div className="lg:col-span-2 space-y-8">
            {/* Best Sellers / Popular Packages Ranked List */}
             <div className="admin-card p-6 rounded-2xl border admin-border">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-black italic admin-text tracking-tight">
                     {isWebsite ? t('popularPackages') : t('bestSellers')}
                  </h3>
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">🏆</div>
               </div>
               <div className="space-y-5">
                  {topProducts.map((p, idx) => (
                     <div key={p.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <span className="text-xl font-black italic text-slate-800 group-hover:text-cyan-500/50 transition-colors">#{idx + 1}</span>
                           <div className="w-12 h-12 admin-subcard rounded-xl overflow-hidden border admin-border group-hover:border-cyan-500/30 transition-all shadow-xl">
                              {p.image && <img src={p.image} className="w-full h-full object-cover" alt={p.name} />}
                           </div>
                           <div>
                               <h4 className="text-sm font-black admin-text group-hover:text-cyan-400 transition-colors line-clamp-1">{p.name}</h4>
                              <p className="text-[9px] font-black admin-text-muted tracking-[0.08em]">
                                {p.salesCount} {isWebsite ? t('inquiriesReceived') : t('unitsSold')}
                              </p>
                           </div>
                        </div>
                        <div className="text-right">
                            <h5 className="text-sm font-black admin-text">
                              {isWebsite ? t('live') : `$${(p.salesCount * p.price).toFixed(0)}`}
                            </h5>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Activity Heatmap */}
            <div className="admin-card p-6 rounded-2xl border admin-border overflow-x-auto">
               <h3 className="text-lg font-black italic admin-text mb-6 tracking-tight">
                 {isWebsite ? t('inquiryActivity') : t('activityHeatmap')}
               </h3>
               <div>
                  <div className="flex mb-3">
                     <div className="w-14 shrink-0" />
                     {Array(24).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 text-center text-[8px] font-black admin-text-muted">{i}h</div>
                     ))}
                  </div>
                  {t('daysOfWeek').split(',').map((day: string, dIdx: number) => (
                     <div key={day} className="flex items-center mb-1">
                        <div className="w-14 shrink-0 text-[9px] font-black admin-text-muted tracking-[0.08em]">{day}</div>
                        {heatmap[dIdx].map((val, hIdx) => {
                          const opacity = Math.min(val * 0.3 + 0.05, 1);
                          return (
                            <div 
                              key={hIdx} 
                              className="flex-1 aspect-square rounded-lg transition-all hover:scale-125 cursor-help m-[1px] shadow-sm"
                              style={{ backgroundColor: `rgba(34, 211, 238, ${opacity})`, boxShadow: val > 0 ? '0 0 10px rgba(34, 211, 238, 0.2)' : 'none' }}
                              title={`${val} ${isWebsite ? t('inquiriesReceived') : t('unitsSold')} ${t('at')} ${hIdx}:00 ${t('on')} ${day}`}
                            />
                          );
                        })}
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {!isWebsite && lowStockProducts.length > 0 && (
        <LowStockAlerts products={lowStockProducts.map(p => ({ name: p.name, stock_quantity: p.stock_quantity }))} />
      )}
    </div>
  );
}
