import React from 'react';
import { Truck, RefreshCcw, ShieldCheck, Clock } from 'lucide-react';

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4">Shipping & Returns</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about getting your order and sending it back if it's not quite right.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Shipping Section */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Truck className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Shipping Policy</h2>
            
            <div className="space-y-6 text-slate-600">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Domestic Shipping (US)</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b border-slate-100 pb-2">
                    <span>Standard (3-5 business days)</span>
                    <span className="font-medium">$8.00</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-2">
                    <span>Express (1-2 business days)</span>
                    <span className="font-medium">$25.00</span>
                  </li>
                  <li className="flex justify-between text-success font-medium">
                    <span>Orders over $200</span>
                    <span>FREE</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">International Shipping</h3>
                <p className="text-sm">We ship globally. Delivery times range from 7-14 business days. Costs are calculated at checkout based on location and package weight. Customers are responsible for any customs duties or taxes.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" /> Processing Times
                </h3>
                <p className="text-sm">Orders placed before 1:00 PM EST Monday-Friday are processed the same day. Orders placed on weekends or holidays will be processed the next business day.</p>
              </div>
            </div>
          </div>

          {/* Returns Section */}
          <div className="bg-slate-950 p-10 rounded-3xl shadow-xl text-white">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
              <RefreshCcw className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Return Policy</h2>
            
            <div className="space-y-6 text-slate-300">
              <p>We want you to be completely satisfied with your purchase. If you're not, we accept returns within 30 days of the delivery date.</p>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Return Conditions</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Items must be unworn, unwashed, and undamaged.</li>
                  <li>Original tags must remain attached.</li>
                  <li>Shoes must be returned in their original shoe box without damage or postal labels.</li>
                  <li>Intimates, swimwear, and sale items are Final Sale and cannot be returned.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-slate-400" /> How to Return
                </h3>
                <p className="text-sm mb-2">1. Visit our Returns Portal and enter your order number.</p>
                <p className="text-sm mb-2">2. Print the prepaid return shipping label.</p>
                <p className="text-sm">3. Package the items securely and drop them off at any authorized carrier location. A $7.00 return shipping fee will be deducted from your refund.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
