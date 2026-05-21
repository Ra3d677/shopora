import { ShoppingBag, Mail, Phone, DollarSign, Calendar, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma";
import { getTranslation, getLang } from "@/lib/i18n";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function CustomersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslation();
  const lang = await getLang();
  const isRTL = lang === 'ar';

  const store = await prisma.store.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (!store) {
    return <div className="p-20 text-center">
      <h1 className="text-2xl font-black text-white uppercase italic">Store Not Found</h1>
    </div>;
  }

  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      totalAmount: true,
      status: true,
      createdAt: true
    }
  });

  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    orders: number;
    totalSpent: number;
    lastOrder: Date;
    firstOrder: Date;
  }>();

  orders.forEach(order => {
    const email = order.customerEmail || 'anonymous';
    const existing = customerMap.get(email);
    if (existing) {
      existing.orders += 1;
      existing.totalSpent += Number(order.totalAmount || 0);
      if (order.createdAt > existing.lastOrder) existing.lastOrder = order.createdAt;
    } else {
      customerMap.set(email, {
        name: order.customerName || 'Unknown',
        email: email,
        phone: order.customerPhone || '—',
        orders: 1,
        totalSpent: Number(order.totalAmount || 0),
        lastOrder: order.createdAt,
        firstOrder: order.createdAt,
      });
    }
  });

  const customers = Array.from(customerMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent);

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue = totalCustomers > 0 ? (totalRevenue / totalCustomers) : 0;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen p-8 font-sans selection:bg-cyan-500/30 admin-bg admin-text">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] uppercase">
            {t('customers')}
          </h1>
          <p className="text-slate-500 font-medium tracking-wide">
            {totalCustomers} {isRTL ? 'عميل مسجل' : 'registered customers'} · ${totalRevenue.toFixed(0)} {isRTL ? 'إجمالي الإنفاق' : 'total spend'}
          </p>
        </div>
      </div>

      {/* KPI Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1a1d2d] p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400"><ShoppingBag size={18} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isRTL ? 'إجمالي العملاء' : 'Total Customers'}</p>
          </div>
          <h3 className="text-4xl font-black text-white">{totalCustomers}</h3>
        </div>
        <div className="bg-[#1a1d2d] p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400"><DollarSign size={18} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isRTL ? 'إجمالي الإنفاق' : 'Total Spend'}</p>
          </div>
          <h3 className="text-4xl font-black text-white">${totalRevenue.toFixed(0)}</h3>
        </div>
        <div className="bg-[#1a1d2d] p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400"><TrendingUp size={18} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isRTL ? 'متوسط الإنفاق' : 'Avg. Spend'}</p>
          </div>
          <h3 className="text-4xl font-black text-white">${avgOrderValue.toFixed(0)}</h3>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#1a1d2d] rounded-[2.5rem] border border-white/5 overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={40} className="mx-auto mb-4 opacity-20 text-slate-500" />
            <h3 className="text-lg font-black text-slate-400 uppercase italic">{isRTL ? 'لا يوجد عملاء بعد' : 'No Customers Yet'}</h3>
            <p className="text-sm text-slate-600 mt-2">{isRTL ? 'بمجرد تقديم الطلبات، سيظهر العملاء هنا' : 'Once orders are placed, customers will appear here.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">{isRTL ? 'العميل' : 'Customer'}</th>
                  <th className="text-left p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 hidden md:table-cell">{isRTL ? 'البريد' : 'Email'}</th>
                  <th className="text-left p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 hidden lg:table-cell">{isRTL ? 'الهاتف' : 'Phone'}</th>
                  <th className="text-center p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">{isRTL ? 'الطلبات' : 'Orders'}</th>
                  <th className="text-right p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">{isRTL ? 'الإجمالي' : 'Total'}</th>
                  <th className="text-right p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 hidden md:table-cell">{isRTL ? 'آخر طلب' : 'Last Order'}</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.email} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-white text-xs font-black border border-white/5">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-5 hidden md:table-cell">
                      <span className="text-xs font-medium text-slate-400">{c.email}</span>
                    </td>
                    <td className="p-5 hidden lg:table-cell">
                      <span className="text-xs font-medium text-slate-400">{c.phone}</span>
                    </td>
                    <td className="p-5 text-center">
                      <span className="text-sm font-black text-white">{c.orders}</span>
                    </td>
                    <td className="p-5 text-right">
                      <span className="text-sm font-black text-emerald-400">${c.totalSpent.toFixed(0)}</span>
                    </td>
                    <td className="p-5 text-right hidden md:table-cell">
                      <span className="text-[10px] font-medium text-slate-500">
                        {new Date(c.lastOrder).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
