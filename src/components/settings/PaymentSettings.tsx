"use client";

import { Plus, X } from "lucide-react";
import { useLanguageStore } from "@/store/language";
import { StoreSettings } from "@/lib/types";

export default function PaymentSettings({
  settings,
  updateSettings
}: {
  settings: StoreSettings;
  updateSettings: (s: StoreSettings) => void;
}) {
  const { t, language } = useLanguageStore();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="admin-card backdrop-blur-3xl rounded-2xl p-6 border admin-border shadow-2xl relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
          <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">{language === 'ar' ? "وسائل الدفع" : "Payment Methods"}</h2>
        </div>

        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-black text-white uppercase italic tracking-tight">{language === 'ar' ? "بوابات الدفع الإلكتروني" : "Online Payment Gateways"}</h3>
          </div>

          <div className="space-y-4">
            {/* Stripe */}
            <GatewayToggle
              name="Stripe"
              desc="Credit cards, Apple Pay, Google Pay"
              enabled={!!settings.businessSettings?.paymentKeys?.stripe}
              onToggle={(on) => {
                const current = settings.businessSettings?.paymentKeys || {};
                updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...current, stripe: on ? {publishableKey: '', secretKey: '', webhookSecret: ''} : undefined}}});
              }}
            />
            {settings.businessSettings?.paymentKeys?.stripe && (
              <div className="p-4 bg-black/40 rounded-xl border border-white/[0.05] space-y-3">
                <KeyField value={settings.businessSettings.paymentKeys.stripe.publishableKey} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, stripe: {...settings.businessSettings!.paymentKeys!.stripe!, publishableKey: v}}}})} placeholder="pk_test_..." />
                <KeyField value={settings.businessSettings.paymentKeys.stripe.secretKey} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, stripe: {...settings.businessSettings!.paymentKeys!.stripe!, secretKey: v}}}})} placeholder="sk_test_..." password />
                <KeyField value={settings.businessSettings.paymentKeys.stripe.webhookSecret} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, stripe: {...settings.businessSettings!.paymentKeys!.stripe!, webhookSecret: v}}}})} placeholder="whsec_..." password />
              </div>
            )}

            {/* PayPal */}
            <GatewayToggle
              name="PayPal"
              desc="PayPal accounts & cards"
              enabled={!!settings.businessSettings?.paymentKeys?.paypal}
              onToggle={(on) => {
                const current = settings.businessSettings?.paymentKeys || {};
                updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...current, paypal: on ? {clientId: '', clientSecret: ''} : undefined}}});
              }}
            />
            {settings.businessSettings?.paymentKeys?.paypal && (
              <div className="p-4 bg-black/40 rounded-xl border border-white/[0.05] space-y-3">
                <KeyField value={settings.businessSettings.paymentKeys.paypal.clientId} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, paypal: {...settings.businessSettings!.paymentKeys!.paypal!, clientId: v}}}})} placeholder="Client ID" />
                <KeyField value={settings.businessSettings.paymentKeys.paypal.clientSecret} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, paypal: {...settings.businessSettings!.paymentKeys!.paypal!, clientSecret: v}}}})} placeholder="Client Secret" password />
              </div>
            )}

            {/* Paymob */}
            <GatewayToggle
              name="Paymob"
              desc="Cards, Vodafone Cash, InstaPay, Fawry"
              enabled={!!settings.businessSettings?.paymentKeys?.paymob}
              onToggle={(on) => {
                const current = settings.businessSettings?.paymentKeys || {};
                updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...current, paymob: on ? {apiKey: '', hmacSecret: '', merchantId: '', integrationIdCard: '', integrationIdWallet: ''} : undefined}}});
              }}
            />
            {settings.businessSettings?.paymentKeys?.paymob && (
              <div className="p-4 bg-black/40 rounded-xl border border-white/[0.05] space-y-3">
                <KeyField value={settings.businessSettings.paymentKeys.paymob.apiKey} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, paymob: {...settings.businessSettings!.paymentKeys!.paymob!, apiKey: v}}}})} placeholder="API Key" />
                <KeyField value={settings.businessSettings.paymentKeys.paymob.hmacSecret} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, paymob: {...settings.businessSettings!.paymentKeys!.paymob!, hmacSecret: v}}}})} placeholder="HMAC Secret" password />
                <KeyField value={settings.businessSettings.paymentKeys.paymob.merchantId} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, paymob: {...settings.businessSettings!.paymentKeys!.paymob!, merchantId: v}}}})} placeholder="Merchant ID" />
                <KeyField value={settings.businessSettings.paymentKeys.paymob.integrationIdCard} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, paymob: {...settings.businessSettings!.paymentKeys!.paymob!, integrationIdCard: v}}}})} placeholder="Integration ID (Card)" />
                <KeyField value={settings.businessSettings.paymentKeys.paymob.integrationIdWallet} onChange={v => updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentKeys: {...settings.businessSettings?.paymentKeys, paymob: {...settings.businessSettings!.paymentKeys!.paymob!, integrationIdWallet: v}}}})} placeholder="Integration ID (Mobile Wallet)" />
              </div>
            )}

            <div className="border-t border-white/[0.05] my-4"></div>

            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{language === 'ar' ? "وسائل دفع يدوية" : "Manual Payment Methods"}</h4>
              <button type="button" onClick={() => {
                const list = settings.businessSettings?.paymentMethods || [];
                updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentMethods: [...list, {id: Math.random().toString(36).substr(2,9), name: '', type: 'bank_transfer', details: '', enabled: true}]}});
              }} className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all">
                <Plus size={10} /> {t('add')}
              </button>
            </div>
            {(settings.businessSettings?.paymentMethods || []).map((pm: any, idx: number) => (
              <div key={pm.id} className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] space-y-3">
                <div className="flex justify-between items-center">
                  <select value={pm.type} onChange={e => {
                    const list = [...(settings.businessSettings?.paymentMethods || [])];
                    list[idx].type = e.target.value as any;
                    updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentMethods: list}});
                  }} className="bg-black/40 border border-white/[0.05] rounded-xl px-3 py-2 text-white text-[11px] font-black uppercase outline-none">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash on Delivery</option>
                    <option value="wallet">Mobile Wallet</option>
                    <option value="other">Other</option>
                  </select>
                  <button type="button" onClick={() => {
                    const list = [...(settings.businessSettings?.paymentMethods || [])];
                    list.splice(idx, 1);
                    updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentMethods: list}});
                  }} className="text-rose-500 hover:text-rose-400 transition-all">
                    <X size={16} />
                  </button>
                </div>
                <input value={pm.name} onChange={e => {
                  const list = [...(settings.businessSettings?.paymentMethods || [])];
                  list[idx].name = e.target.value;
                  updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentMethods: list}});
                }} placeholder={language === 'ar' ? "اسم الوسيلة (مثال: تحويل بنكي)" : "Method name (e.g. Bank Transfer)"} className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all text-[11px]" />
                <textarea value={pm.details} onChange={e => {
                  const list = [...(settings.businessSettings?.paymentMethods || [])];
                  list[idx].details = e.target.value;
                  updateSettings({...settings, businessSettings: {...settings.businessSettings, paymentMethods: list}});
                }} placeholder={language === 'ar' ? "تفاصيل الدفع (رقم الحساب، المحفظة، إلخ)" : "Payment details (account number, wallet, etc.)"} rows={2} className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all text-[11px] resize-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GatewayToggle({ name, desc, enabled, onToggle }: { name: string; desc: string; enabled: boolean; onToggle: (on: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
      <div>
        <p className="text-white font-black text-sm uppercase">{name}</p>
        <p className="text-slate-500 text-[9px] font-medium mt-0.5">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={enabled} onChange={e => onToggle(e.target.checked)} />
        <div className="w-11 h-6 bg-white/5 rounded-full peer peer-checked:bg-cyan-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
      </label>
    </div>
  );
}

function KeyField({ value, onChange, placeholder, password }: { value: string; onChange: (v: string) => void; placeholder: string; password?: boolean }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type={password ? "password" : "text"}
      className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all text-[11px] font-mono"
    />
  );
}
