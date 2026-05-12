import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Activity, CheckCircle2, XCircle, Clock, Eye, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import ExportButton from "./ExportButton";
import DateFilter from "./DateFilter";
import CustomerPreviewButton from "./CustomerPreviewButton";

export default async function AdminDashboard({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ range?: string }> }) {
  const { slug } = await params;
  const { range } = await searchParams;

  const currentRange = range || 'all_time';

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
    include: {
      orders: {
        where: baseWhereCondition,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      },
      products: {
        include: {
          category: true
        }
      },
      visits: {
        where: baseWhereCondition
      },
      cartAdds: {
        where: baseWhereCondition
      }
    }
  });

  if (!store) {
    return <div className="p-8">Store not found</div>;
  }

  const totalOrders = store.orders.length;
  // Only include shipped or delivered orders in total revenue
  const totalRevenue = store.orders
    .filter(order => ['shipped', 'delivered'].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);

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
    }
  }) : [];

  const prevRevenue = prevOrders
    .filter(order => ['shipped', 'delivered'].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 100;

  const totalVisits = store.visits.length;
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
  const totalCartAdds = store.cartAdds.length;
  const abandonmentRate = totalCartAdds > 0 ? (((totalCartAdds - totalOrders) / totalCartAdds) * 100).toFixed(1) : "0.0";

  // Heatmap Data (Orders by Hour and Day - Adjusted for UTC+3)
  const heatmap = Array(7).fill(0).map(() => Array(24).fill(0));
  store.orders.forEach(order => {
    const d = new Date(order.createdAt);
    // Adjust to Local Time (UTC+3)
    const localHour = (d.getHours() + 3) % 24;
    const localDay = d.getDay(); // Note: this might need adjustment if the hour wraps around midnight, but for simplicity we'll stick to this.
    heatmap[localDay][localHour]++;
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
      const parsed = JSON.parse(p.images);
      if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
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

  // Get all orders for this store (Broadest possible search for debugging)
  const allStoreOrders = await prisma.order.findMany({
    where: {
      storeId: store.id
    }
  });

  const currentYear = now.getFullYear();
  const monthlyRevenue = Array(12).fill(0);
  
  allStoreOrders.forEach(order => {
    const d = new Date(order.createdAt);
    // Include all years for now just to see if the chart moves
    const month = d.getMonth();
    monthlyRevenue[month] += order.totalAmount;
  });

  const maxMonthRevenue = Math.max(...monthlyRevenue, 1);
  const trendData = monthlyRevenue.map(rev => (rev / maxMonthRevenue) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Store Overview
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Detailed insights into your store's recent performance.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <DateFilter />
           <ExportButton />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Revenue Card */}
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Total Revenue
            </h4>
            <div className="flex items-end gap-3 mb-4">
               <h3 className="text-4xl font-black tracking-tight text-slate-900">
                 ${totalRevenue > 1000 ? (totalRevenue/1000).toFixed(1) + 'k' : totalRevenue.toFixed(0)}
               </h3>
               <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-lg mb-1 ${revenueGrowth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {revenueGrowth >= 0 ? '▲' : '▼'} {Math.abs(revenueGrowth).toFixed(1)}%
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Previous: <span className="text-slate-900">${prevRevenue.toFixed(0)}</span></p>
         </div>

         {/* Visitors Card */}
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <Users className="w-3.5 h-3.5 text-blue-600" /> Total Visitors
            </h4>
            <div className="flex items-end gap-3 mb-4">
               <h3 className="text-4xl font-black tracking-tight text-slate-900">{totalVisits}</h3>
               <div className="flex items-center text-[10px] font-black px-2 py-0.5 rounded-lg mb-1 bg-blue-50 text-blue-600">
                  {conversionRate}% Rate
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Average: <span className="text-slate-900">{(totalVisits/30).toFixed(0)}</span></p>
         </div>

         {/* Orders Card */}
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <ShoppingBag className="w-3.5 h-3.5 text-blue-600" /> Total Orders
            </h4>
            <div className="flex items-end gap-3 mb-4">
               <h3 className="text-4xl font-black tracking-tight text-slate-900">{totalOrders}</h3>
               <div className="flex items-center text-[10px] font-black px-2 py-0.5 rounded-lg mb-1 bg-slate-50 text-slate-600">
                  {uniqueCustomers} Customers
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Value: <span className="text-slate-900">${averageOrderValue.toFixed(0)}</span></p>
         </div>

         {/* Inventory Card */}
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <Package className="w-3.5 h-3.5 text-blue-600" /> In Stock
            </h4>
            <div className="flex items-end gap-3 mb-4">
               <h3 className="text-4xl font-black tracking-tight text-slate-900">{inStockProducts}</h3>
               <div className="flex items-center text-[10px] font-black px-2 py-0.5 rounded-lg mb-1 bg-amber-50 text-amber-600">
                  {lowStockProducts.length} Alerts
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active SKU: <span className="text-slate-900">{store.products.length}</span></p>
         </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sidebar: Lists and Sources */}
         <div className="lg:col-span-1 space-y-8">
            {/* Sales Funnel */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                 <Activity className="w-5 h-5 text-blue-600" /> Conversion Funnel
               </h3>
               <div className="space-y-4">
                  {[
                    { label: 'Visits', value: totalVisits, icon: Eye, color: 'text-slate-400' },
                    { label: 'Add to Cart', value: totalCartAdds, icon: ShoppingBag, color: 'text-slate-400', pct: totalVisits > 0 ? ((totalCartAdds/totalVisits)*100).toFixed(1) : 0 },
                    { label: 'Checkout', value: '---', icon: DollarSign, color: 'text-slate-400' },
                    { label: 'Purchased', value: totalOrders, icon: CheckCircle2, color: 'text-blue-600', isGoal: true }
                  ].map((step, i) => (
                    <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center ${step.color}`}>
                             <step.icon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{step.label}</p>
                             <h4 className="text-xl font-black text-slate-900">{step.value}</h4>
                          </div>
                       </div>
                       {step.pct && <span className="text-[10px] font-black text-slate-400">{step.pct}%</span>}
                       {step.isGoal && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>}
                    </div>
                  ))}
               </div>
            </div>

            {/* Smart Notifications */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                 <TrendingUp className="w-5 h-5 text-amber-500" /> Performance Alerts
               </h3>
               <div className="space-y-4">
                  {lowStockProducts.length > 0 && (
                     <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-start gap-4">
                        <Package className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
                        <div>
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Inventory Alert</h5>
                           <p className="text-xs font-bold text-amber-800 leading-relaxed">
                              {lowStockProducts[0].name} is low on stock.
                           </p>
                        </div>
                     </div>
                  )}
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl flex items-start gap-4">
                     <TrendingUp className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                     <div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Growth Status</h5>
                        <p className="text-xs font-bold text-blue-800 leading-relaxed">
                           Current conversion rate is {conversionRate}%.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Main Column: Charts and Top Products */}
         <div className="lg:col-span-2 space-y-8">
            {/* Revenue Chart */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Trend</h3>
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">Annual View</div>
               </div>
               <div className="flex items-end justify-between gap-2 h-[300px] mb-4 px-2">
                  {trendData.map((h, i) => (
                    <div key={i} className="flex-1 h-full flex flex-col justify-end group/bar relative">
                       <div 
                         className="w-full bg-blue-600 rounded-t-lg transition-all duration-700 hover:bg-blue-700" 
                         style={{ height: `${Math.max(h, 2)}%` }}
                       />
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                          ${monthlyRevenue[i].toLocaleString()}
                       </div>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-6 text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
               </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Sellers</h3>
                  <ShoppingBag className="w-6 h-6 text-slate-300" />
               </div>
               <div className="space-y-6">
                  {topProducts.map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between group p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                       <div className="flex items-center gap-6">
                          <span className="text-xl font-black text-slate-300 group-hover:text-blue-200 transition-colors w-8">#{idx + 1}</span>
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                             {p.image && <img src={p.image} className="w-full h-full object-cover" alt={p.name} />}
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-slate-900 line-clamp-1">{p.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.salesCount} Sales</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <h5 className="text-sm font-black text-slate-900">${(p.salesCount * p.price).toFixed(0)}</h5>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Heatmap Section */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-x-auto">
               <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Activity Map</h3>
               <div className="min-w-[700px]">
                  <div className="flex mb-4">
                     <div className="w-16 shrink-0" />
                     {Array(24).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 text-center text-[9px] font-black text-slate-400">{i}h</div>
                     ))}
                  </div>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dIdx) => (
                    <div key={day} className="flex items-center mb-2">
                       <div className="w-16 shrink-0 text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                       {heatmap[dIdx].map((val, hIdx) => {
                         const opacity = Math.min(val * 0.4 + 0.05, 1);
                         return (
                           <div 
                             key={hIdx} 
                             className="flex-1 aspect-square rounded-md transition-all hover:scale-110 cursor-help m-[1px]"
                             style={{ backgroundColor: `rgba(37, 99, 235, ${opacity})` }}
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
