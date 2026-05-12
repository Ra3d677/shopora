import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Activity, CheckCircle2, XCircle, Clock, Eye, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import prisma from "@/lib/prisma";
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
      products: true,
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
  const totalRevenue = store.orders.reduce((sum, order) => sum + order.totalAmount, 0);

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

  const prevRevenue = prevOrders.reduce((sum, order) => sum + order.totalAmount, 0);
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

  // Heatmap Data (Orders by Hour and Day)
  const heatmap = Array(7).fill(0).map(() => Array(24).fill(0));
  store.orders.forEach(order => {
    const d = new Date(order.createdAt);
    heatmap[d.getDay()][d.getHours()]++;
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

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-center mb-10 print:mb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium print:hidden">Comprehensive overview of your store's performance and order statistics.</p>
        </div>
        <div className="flex items-center gap-4">
          <CustomerPreviewButton slug={slug} />
          <DateFilter />
          <ExportButton />
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Total Revenue</h4>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-slate-900 mb-1">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <span className={`text-xs font-bold ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm font-bold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4" /> Average ${averageOrderValue.toFixed(2)}/order
          </div>
        </div>

        {/* Visitors */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Total Visitors</h4>
            <h3 className="text-4xl font-black text-slate-900 mb-1">{totalVisits}</h3>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm font-bold text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-lg">
            <Eye className="w-4 h-4" /> {conversionRate}% Conversion
          </div>
        </div>

        {/* Retention */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Customer Retention</h4>
            <h3 className="text-4xl font-black text-slate-900 mb-1">{retentionRate}%</h3>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm font-bold text-indigo-600 bg-indigo-50 w-fit px-3 py-1 rounded-lg">
            <Users className="w-4 h-4" /> {returningCustomers} Returning
          </div>
        </div>

        {/* Abandonment */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Cart Abandonment</h4>
            <h3 className="text-4xl font-black text-slate-900 mb-1">{abandonmentRate}%</h3>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm font-bold text-red-600 bg-red-50 w-fit px-3 py-1 rounded-lg">
            <ShoppingBag className="w-4 h-4" /> Lost opportunities
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="mb-8 bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                 <Package className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="font-black text-amber-900">Low Stock Alert</h4>
                 <p className="text-sm text-amber-700 font-medium">{lowStockProducts.length} products are running low on stock.</p>
              </div>
           </div>
           <div className="flex gap-2">
              {lowStockProducts.slice(0, 3).map(p => (
                <div key={p.id} className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-800">
                  {p.name} ({p.stock_quantity})
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Best & Least Sellers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Best Seller Card */}
        <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <ArrowUpCircle className="w-32 h-32 text-white" />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                   <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm">Best Seller</h3>
              </div>
              {bestSeller ? (
                <div className="flex items-center gap-6">
                   <div className="w-24 h-24 bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                      {bestSeller.image && <img src={bestSeller.image} className="w-full h-full object-cover" alt={bestSeller.name} />}
                   </div>
                   <div>
                      <h4 className="text-2xl font-black text-white mb-1 line-clamp-1">{bestSeller.name}</h4>
                      <p className="text-green-400 font-black text-3xl">{bestSeller.salesCount} <span className="text-sm uppercase tracking-widest text-white/40 ml-1">Units Sold</span></p>
                   </div>
                </div>
              ) : (
                <p className="text-slate-400 font-bold">No sales data for this period.</p>
              )}
           </div>
        </div>

        {/* Least Seller Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <ArrowDownCircle className="w-32 h-32 text-slate-900" />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                   <Package className="w-6 h-6" />
                </div>
                <h3 className="text-slate-500 font-black uppercase tracking-widest text-sm">Least Seller</h3>
              </div>
              {leastSeller ? (
                <div className="flex items-center gap-6">
                   <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-md">
                      {leastSeller.image && <img src={leastSeller.image} className="w-full h-full object-cover" alt={leastSeller.name} />}
                   </div>
                   <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-1 line-clamp-1">{leastSeller.name}</h4>
                      <p className="text-amber-600 font-black text-3xl">{leastSeller.salesCount} <span className="text-sm uppercase tracking-widest text-slate-400 ml-1">Units Sold</span></p>
                   </div>
                </div>
              ) : (
                <p className="text-slate-400 font-bold">No product data available.</p>
              )}
           </div>
        </div>
      </div>

      {/* Sales Heatmap */}
      <div className="mb-12 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
        <h2 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" /> Sales Peak Times
        </h2>
        <div className="min-w-[800px]">
          <div className="flex mb-4">
             <div className="w-20 shrink-0" />
             {Array(24).fill(0).map((_, i) => (
               <div key={i} className="flex-1 text-center text-[10px] font-black text-slate-400 uppercase">{i}h</div>
             ))}
          </div>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dIdx) => (
            <div key={day} className="flex items-center mb-1">
               <div className="w-20 shrink-0 text-xs font-black text-slate-500 uppercase tracking-widest">{day}</div>
               {heatmap[dIdx].map((val, hIdx) => {
                 const opacity = Math.min(val * 0.2 + 0.05, 1);
                 return (
                   <div 
                     key={hIdx} 
                     className="flex-1 aspect-square rounded-sm transition-all hover:ring-2 ring-blue-400 cursor-help"
                     style={{ backgroundColor: `rgba(37, 99, 235, ${opacity})` }}
                     title={`${val} orders at ${hIdx}:00 on ${day}`}
                   />
                 );
               })}
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-black text-slate-900 mb-4 mt-12">Order Status Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Confirmed */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-4">
             <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Confirmed</h4>
             <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex items-end gap-4">
            <h3 className="text-5xl font-black">{confirmedPercentage}%</h3>
            <span className="text-slate-400 font-bold mb-1">{confirmedOrdersCount} orders</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full mt-6 overflow-hidden">
             <div className="bg-green-400 h-full rounded-full" style={{ width: `${confirmedPercentage}%` }}></div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
             <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Pending</h4>
             <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex items-end gap-4">
            <h3 className="text-5xl font-black text-slate-900">{pendingPercentage}%</h3>
            <span className="text-slate-500 font-bold mb-1">{pendingOrdersCount} orders</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
             <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pendingPercentage}%` }}></div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
             <h4 className="text-sm font-black uppercase tracking-widest text-red-400">Cancelled</h4>
             <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex items-end gap-4">
            <h3 className="text-5xl font-black text-red-600">{cancelledPercentage}%</h3>
            <span className="text-red-400 font-bold mb-1">{cancelledOrdersCount} orders</span>
          </div>
          <div className="w-full bg-white h-2 rounded-full mt-6 overflow-hidden">
             <div className="bg-red-500 h-full rounded-full" style={{ width: `${cancelledPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black mb-6 text-slate-900">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-100 text-xs uppercase tracking-widest text-slate-400 font-black">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-5 font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="py-5 font-medium">{order.customerName}</td>
                    <td className="py-5 text-slate-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-5 font-black text-slate-900">${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold bg-slate-50 rounded-xl mt-4 block w-full">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black mb-6 text-slate-900 flex items-center justify-between">
            Top Performers
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </h2>
          <div className="space-y-6">
            {topProducts.length > 0 ? topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 group">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-all relative">
                  {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{product.salesCount} sold</p>
                </div>
                <div className="font-black text-lg text-slate-900 bg-slate-50 px-3 py-1 rounded-xl group-hover:bg-blue-50 transition-colors">
                  ${product.price}
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-slate-400 font-bold bg-slate-50 rounded-2xl">
                No sales data yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
