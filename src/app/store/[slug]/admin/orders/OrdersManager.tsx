'use client';

import { useState, useTransition } from "react";
import { Order } from "@/lib/types";
import { updateOrderStatus } from "./actions";
import { ShoppingBag, User, MapPin, Phone, Calendar, ChevronDown, Loader2, Package, CheckCircle2, Clock, Truck, XCircle, Mail, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OrdersManager({ initialOrders, slug }: { initialOrders: any[], slug: string }) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    });
  };

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
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase">
            Order <span className="text-pink-400">Stream</span>
          </h1>
          <p className="text-slate-500 mt-3 font-medium tracking-widest text-[10px] uppercase">Monitor the pulse of your store transactions.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/[0.02] px-6 py-3 rounded-2xl border border-white/[0.05]">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Feed Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Orders List */}
        <div className="lg:col-span-7 space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              onClick={() => setSelectedOrder(order)}
              className={`group relative bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden ${
                selectedOrder?.id === order.id 
                  ? 'border-pink-500/50 bg-pink-500/[0.03] shadow-[0_20px_50px_rgba(236,72,153,0.1)] scale-[1.02]' 
                  : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]'
              }`}
            >
              {selectedOrder?.id === order.id && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>}
              
              <div className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-all duration-500 ${selectedOrder?.id === order.id ? 'bg-pink-500 text-white rotate-3' : 'bg-white/[0.05] text-slate-500 group-hover:text-white group-hover:bg-white/[0.08]'}`}>
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-white tracking-tighter uppercase leading-none mb-2 italic">{order.customerName}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedOrder?.id === order.id ? 'bg-pink-400 animate-pulse' : 'bg-slate-700'}`}></span>
                        Node #{order.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-3 backdrop-blur-md ${getStatusColor(order.status).replace('bg-', 'bg-opacity-10 bg-').replace('text-', 'text-opacity-90 text-')}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                    {order.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-black/20 rounded-[2rem] p-6 border border-white/[0.03]">
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-600 text-[8px] uppercase font-black tracking-[0.3em]">Temporal Stamp</span>
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-600 text-[8px] uppercase font-black tracking-[0.3em]">Cargo Load</span>
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
                      <Package className="w-3.5 h-3.5 text-pink-400" />
                      {order.items.length} Units
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-600 text-[8px] uppercase font-black tracking-[0.3em]">Total Value</span>
                    <div className="font-black text-white text-lg tracking-tighter">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-600 text-[8px] uppercase font-black tracking-[0.3em]">Comm Channel</span>
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-xs truncate">
                      <Phone className="w-3.5 h-3.5 text-pink-400" />
                      {order.customerPhone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5 p-32 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center mb-8 shadow-2xl animate-pulse">
                <ShoppingBag className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-3">Void Detected</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[300px]">Your store stream is currently empty. Assets will materialize here upon customer deployment.</p>
            </div>
          )}
        </div>

        {/* Order Details Sidebar - High End Receipt Style */}
        <div className="lg:col-span-5">
          {selectedOrder ? (
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/[0.05] shadow-2xl overflow-hidden sticky top-32 group/details">
              <div className="absolute top-0 left-0 w-full h-[300px] bg-pink-500/5 blur-[100px] -z-10 group-hover/details:bg-pink-500/10 transition-all"></div>
              
              <div className="p-10 border-b border-white/[0.05]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none mb-2">Manifest</h2>
                    <div className="flex items-center gap-3">
                       <span className="text-pink-400 font-black text-sm uppercase tracking-widest">#{selectedOrder.id.slice(-6).toUpperCase()}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                       <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-pink-400">
                     <FileText className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Status</label>
                    {isPending && <Loader2 className="w-4 h-4 animate-spin text-pink-400" />}
                  </div>
                  
                  {selectedOrder.status === 'cancelled' ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-rose-500 font-black uppercase text-[10px] tracking-widest">
                        <XCircle className="w-5 h-5" />
                        Operation Aborted
                      </div>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'pending')}
                        className="text-[9px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-xl hover:bg-pink-400 transition-all shadow-xl"
                      >
                        Resume
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between relative px-2">
                        <div className="absolute top-4 left-4 right-4 h-[1px] bg-white/5 -z-10" />
                        {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                          const steps = ['pending', 'processing', 'shipped', 'delivered'];
                          const currentIndex = steps.indexOf(selectedOrder.status);
                          const isCompleted = idx <= currentIndex;
                          const isCurrent = idx === currentIndex;
                          
                          return (
                            <button
                              key={step}
                              onClick={() => handleStatusChange(selectedOrder.id, step)}
                              disabled={isPending}
                              className="flex flex-col items-center gap-3 group relative"
                            >
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                                isCompleted 
                                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110' 
                                  : 'bg-white/[0.02] text-slate-700 border border-white/5 hover:border-white/20'
                              }`}>
                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                              </div>
                              <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isCurrent ? 'text-white' : 'text-slate-600'}`}>
                                {step}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                        disabled={isPending}
                        className="w-full py-3 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500/50 hover:text-rose-500 text-[9px] font-black uppercase tracking-[0.3em] rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                      >
                        Abort Operation
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-10 space-y-10">
                {/* Logistics */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Logistics Terminal</label>
                  <div className="bg-black/20 rounded-3xl p-6 space-y-6 border border-white/[0.03]">
                    <div className="flex gap-5 items-start">
                      <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-pink-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Destination Node</p>
                        <p className="text-sm font-bold text-white leading-relaxed italic">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                    
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-pink-400" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Signal</p>
                          <p className="text-xs font-black text-white">{selectedOrder.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-pink-400" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Email</p>
                          <p className="text-xs font-black text-white truncate">{selectedOrder.customerEmail || 'NONE'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manifest Items */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center justify-between">
                    <span>Cargo Composition</span>
                    <span className="text-pink-400 font-black italic">{selectedOrder.items.length} NODES</span>
                  </label>
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                    {selectedOrder.items.map((item: any) => {
                      const productImages = item.product.images ? (typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images) : [];
                      const imageUrl = productImages.length > 0 ? productImages[0] : '';
                      return (
                      <div key={item.id} className="flex gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group/item hover:bg-white/[0.05] transition-all">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                          {imageUrl && <Image src={imageUrl} alt={item.product.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />}
                        </div>
                        <div className="flex flex-col flex-grow justify-center">
                          <span className="text-xs font-black text-white uppercase tracking-tighter italic mb-2 line-clamp-1">{item.product.name}</span>
                          <div className="flex items-center gap-2 mb-3">
                            {item.size && <span className="text-[8px] font-black text-slate-400 bg-white/5 px-2 py-1 rounded uppercase border border-white/5">{item.size}</span>}
                            {item.color && (
                              <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded border border-white/5">
                                <div className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                                <span className="text-[8px] font-black text-slate-400 uppercase">{item.color}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black text-pink-400/60 uppercase">Qty x {item.quantity}</span>
                            <span className="text-sm font-black text-white italic tracking-tighter">${(item.quantity * item.price).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>

                {/* Final Computation */}
                <div className="pt-10 border-t-2 border-dashed border-white/[0.05]">
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Base Amount</span>
                      <span className="text-sm font-bold text-slate-300">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Transit Protocol</span>
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Comped</span>
                    </div>
                  </div>
                  <div className="relative group/total">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur-[15px] opacity-20 group-hover/total:opacity-40 transition-opacity"></div>
                    <div className="relative flex justify-between items-center p-8 bg-gradient-to-br from-pink-500 to-purple-700 rounded-3xl text-white shadow-2xl">
                      <div className="flex flex-col">
                        <span className="font-black uppercase tracking-[0.3em] text-[10px] text-white/70 leading-none mb-2">Total Settlement</span>
                        <span className="font-black text-xs text-white/50 italic tracking-widest leading-none">Manifest Confirmed</span>
                      </div>
                      <span className="font-black text-4xl tracking-tighter italic leading-none">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5 p-32 text-center flex flex-col items-center justify-center min-h-[700px] sticky top-32">
              <div className="w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center mb-8 shadow-2xl opacity-20">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-700 uppercase tracking-tighter italic mb-3">Null Selection</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-[250px]">Intercept an order signal from the manifest to analyze its metadata.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
