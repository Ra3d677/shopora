import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Activity, CheckCircle2, XCircle, Clock, Eye, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import ExportButton from "./ExportButton";
import DateFilter from "./DateFilter";
import CustomerPreviewButton from "./CustomerPreviewButton";

export default async function AdminDashboard({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ range?: string }> }) {
  const { slug } = await params;
  const sp = (await searchParams) || {};
  const currentRange = sp.range || 'all_time';

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
      <div className="p-20 text-center bg-[#0a0c14] min-h-screen">
         <h1 className="text-2xl font-black text-white uppercase italic">Sector Not Found</h1>
         <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest text-xs">The requested store instance does not exist in the matrix.</p>
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

  // Customer Retention
  const customerOrderCounts = new Map<string, number>();
  store.orders.forEach(o => {
    customerOrderCounts.set(o.customerEmail, (customerOrderCounts.get(o.customerEmail) || 0) + 1);
  });
  const returningCustomers = Array.from(customerOrderCounts.values()).filter(count => count > 1).length;
  const retentionRate = uniqueCustomers > 0 ? ((returningCustomers / uniqueCustomers) * 100).toFixed(1) : "0.0";

  // Abandonment Rate
  const abandonmentRate = totalCartAdds > 0 ? (((totalCartAdds - totalOrders) / totalCartAdds) * 100).toFixed(1) : "0.0";

  // Heatmap Data (Orders by Hour and Day - Adjusted for UTC+3)
  const heatmap = Array(7).fill(0).map(() => Array(24).fill(0));
  store.orders.forEach(order => {
    try {
      const d = new Date(order.createdAt);
      if (!isNaN(d.getTime())) {
        // Adjust to Local Time (UTC+3)
        const localHour = (d.getHours() + 3) % 24;
        const localDay = d.getDay(); 
        heatmap[localDay][localHour]++;
      }
    } catch(e) {}
  });

  // Low Stock Alerts
  const lowStockProducts = store.products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 5);

  // Analytical Data
  const cancelledOrdersCount = store.orders.filter(o => o.status === 'cancelled').length;
  const confirmedOrdersCount = store.orders.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status)).length;
  const pendingOrdersCount = store.orders.filter(o => o.status === 'pending').length;

  const cancelledPercentage = totalOrders > 0 ? ((cancelledOrdersCount / totalOrders) * 100).toFixed(1) : "0.0";
  const confirmedPercentage = totalOrders > 0 ? ((confirmedOrdersCount / totalOrders) * 100).toFixed(1) : "0.0";
  const pendingPercentage = totalOrders > 0 ? ((pendingOrdersCount / totalOrders) * 100).toFixed(1) : "0.0";

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

  const bottomProducts = [...allProductsWithSales]
    .sort((a, b) => a.salesCount - b.salesCount)
    .slice(0, 5);

  const bestSeller = topProducts[0]?.salesCount > 0 ? topProducts[0] : null;
  const leastSeller = allProductsWithSales.length > 0 ? bottomProducts[0] : null;

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

  return (
    <div className="min-h-screen bg-[#0a0c14] text-slate-100 p-8 pb-24 font-sans selection:bg-cyan-500/30">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
           <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] uppercase">
             Analytics <span className="text-cyan-400">Dashboard</span>
           </h1>
           <p className="text-slate-500 font-medium tracking-wide">Comprehensive overview of your store's digital performance.</p>
        </div>
        <div className="flex items-center gap-4 bg-[#1a1d2d] p-2 rounded-2xl border border-white/5 shadow-2xl">
           <DateFilter />
           <ExportButton />
        </div>
      </div>

      {/* KPI Blocks - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         {/* Revenue Card */}
         <div className="bg-[#1a1d2d] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-500">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
               <DollarSign className="w-3 h-3 text-cyan-400" /> Total Revenue
            </h4>
            <div className="flex items-end gap-3 mb-4">
               <h3 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                 ${totalRevenue > 1000 ? (totalRevenue/1000).toFixed(1) + 'k' : totalRevenue.toFixed(0)}
               </h3>
               <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full mb-1 ${revenueGrowth >= 0 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
                  {revenueGrowth >= 0 ? '▲' : '▼'} {Math.abs(revenueGrowth).toFixed(1)}%
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vs Last Month: <span className="text-white">${prevRevenue.toFixed(0)}</span></p>
         </div>

         {/* Orders Card */}
         <div className="bg-[#1a1d2d] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-pink-500/50 transition-all duration-500">
            <div className="absolute -right-8 -top-top w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all"></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
               <ShoppingBag className="w-3 h-3 text-pink-400" /> Total Orders
            </h4>
            <div className="flex items-end gap-3 mb-4">
               <h3 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{totalOrders}</h3>
               <div className="flex items-center text-[10px] font-black px-2 py-0.5 rounded-full mb-1 bg-pink-500/10 text-pink-400">
                  {uniqueCustomers} Customers
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Value: <span className="text-white">${averageOrderValue.toFixed(0)}</span></p>
         </div>

         {/* Inventory Card */}
         <div className="bg-[#1a1d2d] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-500">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
               <Package className="w-3 h-3 text-amber-400" /> In Stock
            </h4>
            <div className="flex items-end gap-3 mb-4">
               <h3 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{inStockProducts}</h3>
               <div className="flex items-center text-[10px] font-black px-2 py-0.5 rounded-full mb-1 bg-amber-500/10 text-amber-400">
                  {lowStockProducts.length} Needs Attention
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Products: <span className="text-white">{store.products.length}</span></p>
         </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Funnel */}
         <div className="lg:col-span-1 space-y-8">
            {/* Sales Funnel */}
            <div className="bg-[#1a1d2d] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
               <h3 className="text-2xl font-black italic text-white mb-10 tracking-tight">Sales <span className="text-cyan-400">Funnel</span></h3>
               <div className="space-y-6">
                  {/* Step 1: Add to Cart */}
                  <div className="bg-[#0f111a] p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/5">
                           <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Add to Cart</p>
                           <h4 className="text-2xl font-black text-white">{totalCartAdds}</h4>
                        </div>
                     </div>
                  </div>
                  {/* Step 2: Checkout */}
                  <div className="bg-[#0f111a] p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-amber-500/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/5">
                           <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Checkout</p>
                           <h4 className="text-2xl font-black text-white">---</h4>
                        </div>
                     </div>
                  </div>
                  {/* Step 3: Purchased */}
                  <div className="bg-[#0f111a] p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-green-500/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 shadow-lg shadow-green-500/5">
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Purchased</p>
                           <h4 className="text-2xl font-black text-white">{totalOrders}</h4>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-green-400 shadow-green-400/50 drop-shadow-md">Goal</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column: Top Products and Heatmap */}
         <div className="lg:col-span-2 space-y-8">
            {/* Best Sellers Ranked List */}
            <div className="bg-[#1a1d2d] p-10 rounded-[2.5rem] border border-white/5">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black italic text-white tracking-tight">Best <span className="text-cyan-400">Sellers</span></h3>
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">🏆</div>
               </div>
               <div className="space-y-8">
                  {topProducts.map((p, idx) => (
                     <div key={p.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                           <span className="text-2xl font-black italic text-slate-800 group-hover:text-cyan-500/50 transition-colors">#{idx + 1}</span>
                           <div className="w-16 h-16 bg-[#0f111a] rounded-2xl overflow-hidden border border-white/5 group-hover:border-cyan-500/30 transition-all shadow-xl">
                              {p.image && <img src={p.image} className="w-full h-full object-cover" alt={p.name} />}
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{p.name}</h4>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.salesCount} Units Sold</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <h5 className="text-xl font-black text-white">${(p.salesCount * p.price).toFixed(0)}</h5>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-[#1a1d2d] p-10 rounded-[2.5rem] border border-white/5 overflow-x-auto">
               <h3 className="text-2xl font-black italic text-white mb-10 tracking-tight">Activity <span className="text-amber-400">Heatmap</span></h3>
               <div className="min-w-[700px]">
                  <div className="flex mb-4">
                     <div className="w-16 shrink-0" />
                     {Array(24).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 text-center text-[9px] font-black text-slate-500">{i}h</div>
                     ))}
                  </div>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dIdx) => (
                     <div key={day} className="flex items-center mb-1.5">
                        <div className="w-16 shrink-0 text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                        {heatmap[dIdx].map((val, hIdx) => {
                          const opacity = Math.min(val * 0.3 + 0.05, 1);
                          return (
                            <div 
                              key={hIdx} 
                              className="flex-1 aspect-square rounded-lg transition-all hover:scale-125 cursor-help m-[2px] shadow-sm"
                              style={{ backgroundColor: `rgba(34, 211, 238, ${opacity})`, boxShadow: val > 0 ? '0 0 10px rgba(34, 211, 238, 0.2)' : 'none' }}
                              title={`${val} orders at ${hIdx}:00 on ${day}`}
                            />
                          );
                        })}
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
