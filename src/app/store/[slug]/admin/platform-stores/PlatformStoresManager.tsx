"use client";

import { useState, useTransition } from "react";
import { toggleStoreStatus, deleteStorePlatformAction, changeTemplatePlatformAction } from "../actions";
import { Store as StoreIcon, ShieldCheck, ShieldAlert, Trash2, ExternalLink, User, Calendar, Power, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLanguageStore } from "@/store/language";

export default function PlatformStoresManager({ stores }: { stores: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { t, language } = useLanguageStore();
  const isRTL = language === 'ar';

  const templates = [
    { id: 'signature', name: 'Signature Brand' },
    { id: 'minimal', name: 'Pure Minimal' },
    { id: 'apple', name: 'Premium Tech' },
    { id: 'hybrid', name: 'Hybrid Dark' },
    { id: 'zenith', name: 'Zenith Luxury' },
    { id: 'obsidian', name: 'Obsidian Brutalist' },
    { id: 'modern', name: 'Modern Commerce' },
    { id: 'modern1', name: 'Modern 1' },
    { id: 'amazon', name: 'Amazon Marketplace' },
    { id: 'dddyou', name: 'DDDYOU Parfumerie' },
    { id: 'senno', name: 'Senno Multipurpose' },
    { id: 'momo', name: 'MOMO' },
    { id: '1m', name: '1M' },
    { id: '2m', name: '2M' },
    { id: '3m', name: '3M Netro' },
    { id: 'fitness', name: 'برعي - Sama Fit' },
    { id: 'tourism', name: 'Tourism & Travel Showcase' },
    { id: 'ironpeak', name: 'Iron Peak Fitness' },
    { id: 'itsolution', name: 'ITSolution Agency' },
    { id: 'gym', name: 'FitGym' },
  ];

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.owner?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (storeId: string, currentStatus: boolean) => {
    if (!confirm(isRTL ? `هل أنت متأكد أنك تريد ${currentStatus ? 'إيقاف' : 'تفعيل'} هذا المتجر؟` : `Are you sure you want to ${currentStatus ? 'DEACTIVATE' : 'ACTIVATE'} this store?`)) return;
    
    startTransition(async () => {
      const result = await toggleStoreStatus(storeId, currentStatus);
      if (result.success) {
        router.refresh();
      }
    });
  };

  const handleTemplateChange = (storeId: string, template: string) => {
    startTransition(async () => {
      const result = await changeTemplatePlatformAction(storeId, template);
      if (result.success) {
        router.refresh();
      }
    });
  };

  const handleDelete = (storeId: string, storeName: string) => {
    if (!confirm(isRTL ? `تحذير هام: هل أنت متأكد من حذف "${storeName}" نهائياً؟ هذا الإجراء لا يمكن التراجع عنه وسيحذف كافة المنتجات والأقسام والإعدادات.` : `CRITICAL WARNING: Are you sure you want to PERMANENTLY DELETE "${storeName}"? This action cannot be undone and will delete all products, categories, and settings.`)) return;
    
    startTransition(async () => {
      const result = await deleteStorePlatformAction(storeId);
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`p-8 pb-32 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className={`text-4xl font-black tracking-tighter text-slate-900 flex items-center gap-3 italic ${isRTL ? 'flex-row-reverse' : ''}`}>
            <StoreIcon className="w-10 h-10 text-blue-600" /> {t('platformStores')}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">{isRTL ? 'إدارة كل متجر يعمل على نظامك البيئي.' : 'Manage every store operating on your ecosystem.'}</p>
        </div>
        
        <div className="w-full md:w-96 relative">
           <SearchIcon className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5`} />
           <input 
            type="text" 
            placeholder={isRTL ? 'البحث بالمتجر، أو الرابط، أو المالك...' : 'Search by store, slug, or owner...'}
            className={`w-full py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium shadow-sm ${isRTL ? 'pr-12 pl-6' : 'pl-12 pr-6'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredStores.map((store) => (
          <div key={store.id} className={`bg-white rounded-[2rem] border ${store.isActive ? 'border-slate-100' : 'border-red-100 bg-red-50/10'} p-4 md:p-8 transition-all hover:shadow-2xl group relative overflow-hidden`}>
            {!store.isActive && (
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
            )}
            
            <div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-6 xl:gap-8 ${isRTL ? 'xl:flex-row-reverse text-right' : 'text-left'}`}>
              
              {/* Store Info */}
              <div className={`flex items-center gap-4 md:gap-6 flex-1 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-inner shrink-0 ${store.isActive ? 'bg-slate-900 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-200'}`}>
                  <StoreIcon size={32} className="md:w-10 md:h-10" />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <div className={`flex items-center gap-2 md:gap-3 mb-1 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h3 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 truncate">{store.name}</h3>
                    {store.isActive ? (
                      <span className={`shrink-0 flex items-center gap-1 px-2 md:px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <ShieldCheck size={12} /> {isRTL ? 'نشط' : 'Active'}
                      </span>
                    ) : (
                      <span className={`shrink-0 flex items-center gap-1 px-2 md:px-3 py-1 bg-red-50 text-red-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-red-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <ShieldAlert size={12} /> {isRTL ? 'موقوف' : 'Suspended'}
                      </span>
                    )}
                  </div>
                  <div className={`flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-1.5 text-xs md:text-sm font-semibold text-slate-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`inline-flex items-center gap-1.2 md:gap-2 hover:text-blue-500 transition-colors truncate max-w-[150px] md:max-w-none ${isRTL ? 'flex-row-reverse' : ''}`}><ExternalLink size={12} className="md:w-[14px] md:h-[14px] shrink-0" /> <span className="truncate">/{store.slug}</span></span>
                    <span className={`inline-flex items-center gap-1.2 md:gap-2 truncate max-w-[200px] md:max-w-[300px] ${isRTL ? 'flex-row-reverse' : ''}`}><User size={12} className="md:w-[14px] md:h-[14px] shrink-0" /> <span className="truncate">{store.owner?.email}</span></span>
                    <span className={`inline-flex items-center gap-1.2 md:gap-2 shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}><Calendar size={12} className="md:w-[14px] md:h-[14px]" /> {new Date(store.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Template Switcher & Actions */}
              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                
                {/* Template Switcher */}
                <div className="flex flex-col gap-1 min-w-0 sm:min-w-[220px]">
                  <label className={`text-[10px] font-black text-slate-400 uppercase tracking-widest ${isRTL ? 'mr-1 text-right' : 'ml-1 text-left'}`}>{isRTL ? 'تصميم المتجر' : 'Store Design'}</label>
                  <div className="relative group/select">
                    <LayoutTemplate className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-blue-600 transition-colors shrink-0`} />
                    <select 
                      value={store.template}
                      disabled={isPending}
                      onChange={(e) => handleTemplateChange(store.id, e.target.value)}
                      className={`w-full py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer outline-none ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                    >
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name} {isRTL ? 'قالب' : 'Template'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="h-px sm:h-10 bg-slate-100 sm:w-px" />

                {/* Actions */}
                <div className={`flex items-center gap-2 md:gap-3 justify-stretch sm:justify-normal ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Link 
                    href={`/store/${store.slug}`} 
                    target="_blank"
                    className="p-2.5 md:p-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                    title={isRTL ? 'مشاهدة المتجر الحي' : "View Live Store"}
                  >
                    <ExternalLink size={18} className="md:w-[20px] md:h-[20px]" />
                  </Link>
                  <button 
                    onClick={() => handleToggleStatus(store.id, store.isActive)}
                    disabled={isPending}
                    className={`flex-1 sm:flex-none px-3 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all active:scale-95 flex items-center gap-1.5 md:gap-2 shadow-sm border whitespace-nowrap justify-center ${store.isActive ? 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'} ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Power size={14} className="md:w-[16px] md:h-[16px]" /> <span className="hidden sm:inline">{store.isActive ? (isRTL ? 'إلغاء التفعيل' : 'Deactivate') : (isRTL ? 'إعادة التفعيل' : 'Reactivate')}</span><span className="sm:hidden">{store.isActive ? (isRTL ? 'إيقاف' : 'Off') : (isRTL ? 'تشغيل' : 'On')}</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(store.id, store.name)}
                    disabled={isPending}
                    className="p-2.5 md:p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                    title={isRTL ? 'حذف المتجر نهائياً' : "Permanently Delete Store"}
                  >
                    <Trash2 size={18} className="md:w-[20px] md:h-[20px]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}

        {filteredStores.length === 0 && (
          <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <StoreIcon className="mx-auto mb-6 text-slate-200" size={64} />
             <h3 className="text-xl font-bold text-slate-400">{isRTL ? 'لم يتم العثور على متاجر تطابق بحثك.' : 'No stores found matching your search.'}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
