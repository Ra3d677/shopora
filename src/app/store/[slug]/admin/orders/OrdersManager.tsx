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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Orders Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage your store sales and customer orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              onClick={() => setSelectedOrder(order)}
              className={`bg-white rounded-[2rem] border-2 p-6 cursor-pointer transition-all duration-300 ${
                selectedOrder?.id === order.id 
                  ? 'border-slate-900 shadow-xl shadow-slate-200/50 scale-[1.01]' 
                  : 'border-transparent hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner ${selectedOrder?.id === order.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 tracking-tight leading-none mb-1.5">{order.customerName}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      Order #{order.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Date</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Items</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    {order.items.length} Product(s)
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Total</span>
                  <div className="font-black text-slate-900 text-base">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Phone</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold truncate">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {order.customerPhone}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-20 text-center text-slate-400 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Package className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">No Orders Yet</h3>
              <p className="text-sm font-medium leading-relaxed max-w-[250px]">When customers place orders in your store, they will automatically appear here.</p>
            </div>
          )}
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden sticky top-8">
              <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h2 className="text-2xl font-black tracking-tight mb-1">Order #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Custom Status Stepper */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Status</label>
                    {isPending && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  </div>
                  
                  {selectedOrder.status === 'cancelled' ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-red-600 font-bold">
                        <XCircle className="w-5 h-5" />
                        Cancelled
                      </div>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'pending')}
                        className="text-xs font-bold bg-white text-slate-600 px-3 py-1.5 rounded-lg border shadow-sm hover:bg-slate-50 transition-colors"
                      >
                        Reactivate
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between relative">
                        <div className="absolute top-4 left-4 right-4 h-[2px] bg-slate-100 -z-10 rounded-full" />
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
                              className="flex flex-col items-center gap-2 group relative"
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-slate-900 text-white shadow-md scale-110' 
                                  : 'bg-white text-slate-300 border-2 border-slate-100 group-hover:border-slate-300'
                              }`}>
                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="font-bold">{idx + 1}</span>}
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                                {step}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                          disabled={isPending}
                          className="text-[10px] font-bold text-red-500 uppercase tracking-wider hover:text-red-700 transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Details */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Customer Details</label>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100/50">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <MapPin className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shipping Address</p>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                        <Phone className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="text-sm font-bold text-slate-900">{selectedOrder.customerPhone}</p>
                      </div>
                    </div>
                    
                    {selectedOrder.customerEmail && selectedOrder.customerEmail !== "no-email@provided.com" && (
                      <>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                            <Mail className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                            <p className="text-sm font-medium text-slate-700">{selectedOrder.customerEmail}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {selectedOrder.notes && (
                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider mb-1">Order Notes</p>
                        <p className="text-sm font-medium text-amber-900 italic leading-relaxed">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="pt-6 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between mb-4">
                    <span>Order Items</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{selectedOrder.items.length}</span>
                  </label>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 scrollbar-hide">
                    {selectedOrder.items.map((item: any) => {
                      const productImages = item.product.images ? (typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images) : [];
                      const imageUrl = productImages.length > 0 ? productImages[0] : '';
                      return (
                      <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-colors group">
                        {imageUrl ? (
                          <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                            <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-20 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                        <div className="flex flex-col flex-grow justify-center py-1">
                          <span className="text-sm font-black text-slate-900 leading-tight mb-1.5 line-clamp-1">{item.product.name}</span>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-auto">
                            {item.size && <span className="bg-white px-2 py-0.5 rounded-md border shadow-sm uppercase">{item.size}</span>}
                            {item.color && (
                              <span className="flex items-center gap-1.5 bg-white px-1.5 py-0.5 rounded-md border shadow-sm">
                                <span className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: item.color }} />
                                <span className="capitalize">{item.color}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                            <span className="text-sm font-black text-slate-900">${(item.quantity * item.price).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                  
                  {/* Receipt Footer */}
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-500">Subtotal</span>
                      <span className="text-sm font-bold text-slate-900">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-slate-500">Shipping</span>
                      <span className="text-sm font-bold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-900/20">
                      <span className="font-black uppercase tracking-wider text-sm">Total Paid</span>
                      <span className="font-black text-xl">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-16 text-center text-slate-400 flex flex-col items-center justify-center min-h-[600px] sticky top-8">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Package className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">No Order Selected</h3>
              <p className="text-sm font-medium leading-relaxed max-w-[200px]">Click on any order from the list to view its complete details and update the status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
