'use client';

import { useState, useTransition, useEffect } from "react";
import { Order } from "@/lib/types";
import { useOrdersStore } from "@/store/orders";
import { ShoppingBag, User, MapPin, Phone, Calendar, ChevronDown, Loader2, Package, CheckCircle2, Clock, Truck, XCircle, Mail, FileText, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguageStore } from "@/store/language";

export default function OrdersManager({ 
  initialOrders, 
  slug, 
  storeId, 
  initialHasMore 
}: { 
  initialOrders: any[], 
  slug: string, 
  storeId: string, 
  initialHasMore: boolean 
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const { t, language } = useLanguageStore();
  const isRTL = language === 'ar';

  // Zustand Store States and Actions
  const {
    orders,
    page,
    search,
    status,
    hasMore,
    loading,
    loadingMore,
    filtering,
    setFilters,
    fetchOrders,
    updateOrderStatusOptimistic,
    clearCache
  } = useOrdersStore();

  // Local states for text inputs to prevent typing lag
  const [localSearch, setLocalSearch] = useState("");
  const [localStatus, setLocalStatus] = useState("all");
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Seed initial data in Zustand store on mount to prevent double initial loading
  useEffect(() => {
    useOrdersStore.setState({
      orders: initialOrders,
      hasMore: initialHasMore,
      page: 1,
      search: "",
      status: "all",
      cache: {
        [`${storeId}_all_`]: {
          orders: initialOrders,
          hasMore: initialHasMore,
          page: 1
        }
      }
    });

    return () => {
      // Clear store cache when component unmounts to save client memory
      clearCache();
    };
  }, [initialOrders, initialHasMore, storeId]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    startTransition(async () => {
      const success = await updateOrderStatusOptimistic(orderId, newStatus);
      if (success) {
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        router.refresh();
      }
    });
  };

  // Debounced search and filtering effect
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const timer = setTimeout(() => {
      setFilters(localSearch, localStatus, storeId);
    }, 350); // Robust 350ms debouncing to protect the free tier Supabase server

    return () => clearTimeout(timer);
  }, [localSearch, localStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`space-y-8 animate-in fade-in duration-500 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex justify-between items-end ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
            {t('orderStream')}
          </h1>
          <p className="text-slate-500 mt-1 font-medium tracking-widest text-[10px] uppercase">{t('realtimeTransactionMatrix')}</p>
        </div>
      </div>

      {/* Search & Server-side Filters */}
      <div className={`flex flex-col sm:flex-row gap-4 admin-card backdrop-blur-3xl p-5 rounded-2xl border admin-border shadow-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search orders (Name, Email, Phone, ID)..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[#0a0c14] border border-white/5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
          />
        </div>
        <div className="relative shrink-0 sm:w-48 group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <select
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
            className="w-full pl-12 pr-8 py-3.5 bg-[#0a0c14] border border-white/5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">ALL STATUSES</option>
            <option value="pending">PENDING</option>
            <option value="processing">PROCESSING</option>
            <option value="shipped">SHIPPED</option>
            <option value="delivered">DELIVERED</option>
            <option value="cancelled">CANCELLED</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`flex items-center justify-between px-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              {filtering ? t('scanningMatrix') : `${t('activeRecords')} (${orders.length})`}
            </h3>
          </div>
          
          {orders.length === 0 ? (
            <div className="admin-card backdrop-blur-3xl rounded-2xl p-16 border admin-border text-center space-y-6">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 shadow-2xl">
                  <ShoppingBag className="w-10 h-10 text-slate-700" />
               </div>
               <p className="text-slate-500 font-black uppercase tracking-widest text-xs">{t('noActiveTransactions')}</p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`group relative admin-subcard backdrop-blur-3xl rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                  selectedOrder?.id === order.id
                    ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                    : 'border admin-border hover:border-white/10'
                }`}
              >
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${selectedOrder?.id === order.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/5 text-slate-500 group-hover:text-cyan-400 group-hover:bg-white/10'}`}>
                        <User className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-black text-white text-lg leading-none mb-2 tracking-tight uppercase italic">{order.customerName}</h3>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          {t('node')} <span className="text-cyan-500">#{order.id.slice(-8).toUpperCase()}</span>
                        </p>
                      </div>
                    </div>
                    <div className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 transition-colors ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                         order.status === 'delivered' ? 'bg-green-400' : 
                         order.status === 'cancelled' ? 'bg-rose-400' :
                         order.status === 'pending' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}></div>
                      {order.status}
                    </div>
                  </div>

                  <div className={`mt-8 pt-8 border-t border-white/[0.03] grid grid-cols-2 sm:grid-cols-4 gap-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t('revenue')}</p>
                      <p className="text-xl font-black text-white italic">${order.totalAmount?.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t('matrixUnits')}</p>
                      <p className="text-xl font-black text-white italic">{order.items?.length || 0}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t('timeStamp')}</p>
                      <p className="text-[11px] font-black text-slate-400 uppercase">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t('statusLabel')}</p>
                      <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">{t('verified')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination Load More Button */}
          {hasMore && (
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={() => fetchOrders(storeId, false)}
                disabled={loadingMore}
                className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 transition-all duration-300 flex items-center justify-center gap-3 mx-auto disabled:opacity-50 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>{t('syncingNextNode')}</span>
                  </>
                ) : (
                  <span>{t('loadMoreOrders')}</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order Details Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 admin-card backdrop-blur-3xl rounded-2xl border admin-border shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col min-h-[700px]">
            {!selectedOrder ? (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-center text-slate-600">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                  <FileText className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-3">{t('awaitingSelection')}</h3>
                <p className="text-xs font-medium leading-relaxed max-w-[200px] mx-auto">{t('clickTransactionNode')}</p>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                <div className={`p-10 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                  <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{t('orderAnalysis')}</h2>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">{t('uplink')}: {selectedOrder.id.toUpperCase()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                    selectedOrder.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    selectedOrder.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  }`}>
                    {selectedOrder.status}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                  {/* Customer Info Card */}
                  <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className={`text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ${isRTL ? 'mr-2' : 'ml-2'}`}>{t('identityLogistics')}</h4>
                    <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.05] space-y-8 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -z-10 group-hover:bg-cyan-500/10 transition-all"></div>
                       
                       <div className={`flex items-start gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                             <User className="w-6 h-6 text-slate-500" />
                          </div>
                          <div>
                             <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1.5">{t('subject')}</p>
                             <p className="text-base font-black text-white italic">{selectedOrder.customerName}</p>
                          </div>
                       </div>
                       
                       <div className={`flex items-start gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                             <MapPin className="w-6 h-6 text-slate-500" />
                          </div>
                          <div className="flex-1">
                             <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1.5">{t('deliveryCoordinates')}</p>
                             <p className="text-sm font-bold text-slate-300 leading-relaxed italic">{selectedOrder.shippingAddress || t('noCoordinatesProvided')}</p>
                          </div>
                       </div>

                       <div className={`flex items-start gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                             <Phone className="w-6 h-6 text-slate-500" />
                          </div>
                          <div>
                             <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1.5">{t('commChannel')}</p>
                             <p className="text-sm font-black text-cyan-400 tracking-widest">{selectedOrder.customerPhone || 'N/A'}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className={`text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ${isRTL ? 'mr-2' : 'ml-2'}`}>{t('productMatrix')}</h4>
                    <div className="space-y-4">
                      {(selectedOrder.items || []).map((item: any, idx: number) => {
                        const productImages = item.product.images ? (typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images) : [];
                        const imageUrl = item.image || (productImages.length > 0 ? productImages[0] : '');
                        return (
                        <div key={idx} className={`bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] flex items-center gap-5 group/item transition-all hover:bg-white/[0.04] ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-20 h-20 bg-black/40 rounded-2xl overflow-hidden relative shrink-0 border border-white/5 shadow-2xl">
                             {imageUrl ? (
                               <Image src={imageUrl} alt={item.product.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-700" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-8 h-8 text-slate-800" />
                                </div>
                             )}
                          </div>
                          <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="text-base font-black text-white italic truncate uppercase tracking-tight">{item.product.name}</p>
                            <div className={`flex items-center gap-3 mt-1.5 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                               {item.size && (
                                 <span className="text-[8px] font-black px-2 py-1 bg-white/5 border border-white/10 rounded-md text-slate-400 uppercase tracking-widest">
                                   {item.size}
                                 </span>
                               )}
                               {item.color && (
                                 <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                   <div className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: item.color }} />
                                 </div>
                               )}
                            </div>
                            <p className="text-[10px] font-black text-cyan-500 mt-2 uppercase tracking-widest">
                               {item.quantity} × ${item.price?.toFixed(2)}
                            </p>
                          </div>
                          <div className={isRTL ? 'text-left' : 'text-right'}>
                            <p className="text-lg font-black text-white italic">${(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      )})}
                    </div>

                    {selectedOrder.notes && (
                      <div className={`bg-amber-500/5 border border-amber-500/10 p-6 rounded-2xl space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                         <h4 className={`text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                           <FileText className="w-3 h-3" /> {t('customerIntelligence')}
                         </h4>
                         <p className="text-xs font-bold text-amber-200/60 leading-relaxed italic">
                           "{selectedOrder.notes}"
                         </p>
                      </div>
                    )}
                    
                    <div className={`bg-gradient-to-r from-cyan-600 to-blue-700 p-8 rounded-3xl text-white flex justify-between items-center shadow-2xl shadow-cyan-500/20 relative overflow-hidden group/total ${isRTL ? 'flex-row-reverse' : ''}`}>
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none"></div>
                       <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-70">{t('accumulatedTotal')}</span>
                       <span className="text-3xl font-black italic tracking-tighter">${selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Fulfillment */}
                  <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className={`text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ${isRTL ? 'mr-2' : 'ml-2'}`}>{t('protocolExecution')}</h4>
                    <div className="grid grid-cols-2 gap-3 pb-10">
                       {[
                         { id: 'pending', label: 'Pending', icon: Clock },
                         { id: 'processing', label: 'Processing', icon: Package },
                         { id: 'shipped', label: 'Shipped', icon: Truck },
                         { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
                         { id: 'cancelled', label: 'Cancelled', icon: XCircle }
                       ].map((status) => (
                         <button
                           key={status.id}
                           disabled={isPending}
                           onClick={() => handleStatusChange(selectedOrder.id, status.id)}
                           className={`p-5 rounded-2xl border text-[9px] font-black uppercase tracking-[0.2em] flex flex-col items-center justify-center gap-3 transition-all duration-500 ${
                             selectedOrder.status === status.id 
                               ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105 z-10' 
                               : 'bg-white/5 border-white/5 text-slate-600 hover:text-white hover:border-white/10 hover:bg-white/10'
                           }`}
                         >
                           <status.icon className={`w-6 h-6 transition-transform duration-500 ${selectedOrder.status === status.id ? 'scale-110' : 'opacity-40'}`} />
                           {status.label}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
