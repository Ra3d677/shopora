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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Orders Management
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Monitor and manage your store transactions in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Orders ({orders.length})</h3>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-slate-500 font-bold">No orders found yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`group relative bg-white rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-sm ${
                  selectedOrder?.id === order.id 
                    ? 'border-blue-500 ring-4 ring-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${selectedOrder?.id === order.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-none mb-1">{order.customerName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-sm font-black text-slate-900">${order.totalAmount?.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Items</p>
                      <p className="text-sm font-black text-slate-900">{order.items?.length || 0} Units</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-bold text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Payment</p>
                      <p className="text-[10px] font-black text-green-600 uppercase">Paid</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
            {!selectedOrder ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">Select an Order</h3>
                <p className="text-sm">Click on any order from the list to view full details and manage fulfillment.</p>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Order Details</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {selectedOrder.id}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  {/* Customer Info Card */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer & Delivery</h4>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                             <User className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Customer Name</p>
                             <p className="text-sm font-bold text-slate-900">{selectedOrder.customerName}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                             <MapPin className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Shipping Address</p>
                             <p className="text-sm font-bold text-slate-900 leading-relaxed italic">{selectedOrder.shippingAddress || 'No address provided'}</p>
                          </div>
                       </div>

                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                             <Phone className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Contact Phone</p>
                             <p className="text-sm font-bold text-slate-900">{selectedOrder.customerPhone || 'No phone provided'}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Items</h4>
                    <div className="space-y-3">
                      {(selectedOrder.items || []).map((item: any, idx: number) => {
                        const productImages = item.product.images ? (typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images) : [];
                        const imageUrl = productImages.length > 0 ? productImages[0] : '';
                        return (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 group">
                          <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden relative shrink-0 border border-slate-100">
                             {imageUrl ? (
                               <Image src={imageUrl} alt={item.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-6 h-6 text-slate-200" />
                               </div>
                             )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{item.product.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">
                              Quantity: {item.quantity} x ${item.price?.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-slate-900">${(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      )})}
                    </div>
                    
                    <div className="bg-blue-600 p-6 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-blue-600/20">
                       <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Total Revenue</span>
                       <span className="text-2xl font-black">${selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Fulfillment */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Fulfillment</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {[
                         { id: 'pending', label: 'Pending', icon: Clock, color: 'hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200' },
                         { id: 'processing', label: 'Processing', icon: Package, color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200' },
                         { id: 'shipped', label: 'Shipped', icon: Truck, color: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200' },
                         { id: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-200' },
                         { id: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' }
                       ].map((status) => (
                         <button
                           key={status.id}
                           disabled={isPending}
                           onClick={() => handleStatusChange(selectedOrder.id, status.id)}
                           className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-2 transition-all ${
                             selectedOrder.status === status.id 
                               ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                               : `bg-white border-slate-200 text-slate-400 ${status.color}`
                           }`}
                         >
                           <status.icon className="w-5 h-5" />
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
