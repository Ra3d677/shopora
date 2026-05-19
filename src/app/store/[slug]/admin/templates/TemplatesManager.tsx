"use client";

import { useState, useTransition } from "react";
import { updateActiveTemplateAction, deleteTemplateAction, toggleTemplateStatusAction } from "../actions";
import { Check, LayoutTemplate, Loader2, Trash2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguageStore } from "@/store/language";

export default function TemplatesManager({ 
  slug, 
  initialTemplate, 
  templates: initialTemplates,
  isSuperAdmin 
}: { 
  slug: string, 
  initialTemplate: string,
  templates: any[],
  isSuperAdmin: boolean
}) {
  const [activeTemplate, setActiveTemplateState] = useState(initialTemplate);
  const [templates, setTemplates] = useState(initialTemplates);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  
  const { t, language } = useLanguageStore();
  const isRTL = language === 'ar';

  const handleSelectTemplate = (templateId: string) => {
    if (templateId === activeTemplate) return;
    setError("");
    
    startTransition(async () => {
      await updateActiveTemplateAction(slug, templateId);
      setActiveTemplateState(templateId);
      router.refresh();
    });
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm(isRTL ? "هل أنت متأكد أنك تريد حذف هذا القالب نهائياً؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete this template forever? This action cannot be undone.")) return;
    setError("");

    startTransition(async () => {
      const result = await deleteTemplateAction(templateId);
      if (result.success) {
        setTemplates(templates.filter(t => t.id !== templateId));
        router.refresh();
      } else {
        setError(result.error || (isRTL ? "فشل حذف القالب" : "Failed to delete template"));
      }
    });
  };

  const handleToggleStatus = async (templateId: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleTemplateStatusAction(templateId, currentStatus);
      if (result.success) {
        setTemplates(templates.map(t => t.id === templateId ? { ...t, isActive: !currentStatus } : t));
        router.refresh();
      }
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`mb-8 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className={`text-3xl font-bold tracking-tight text-primary flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LayoutTemplate className="w-8 h-8" /> {t('storeTemplates')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('selectLookFeel')}</p>
        </div>
        
        {isSuperAdmin && (
           <div className={`bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {isRTL ? 'وضع المدير المتميز' : 'Super Admin Mode'}
           </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {templates.map((template) => {
          const isActive = activeTemplate === template.id;
          return (
            <div 
              key={template.id} 
              className={`relative bg-card rounded-2xl border-2 overflow-hidden transition-all duration-300 ${isActive ? 'border-primary shadow-xl ring-4 ring-primary/10' : 'border-border/50 shadow-sm hover:border-slate-300'} ${!template.isActive ? 'opacity-70 grayscale-[0.5]' : ''}`}
            >
              {isActive && (
                <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10 bg-primary text-white p-1.5 rounded-full shadow-lg`}>
                  <Check className="w-5 h-5" />
                </div>
              )}

              {isSuperAdmin && (
                <div className={`absolute top-4 ${isRTL ? 'right-4 flex-row-reverse' : 'left-4'} z-20 flex gap-2`}>
                  <button 
                    onClick={() => handleToggleStatus(template.id, template.isActive)}
                    className={`p-2 rounded-full shadow-lg transition-all ${template.isActive ? 'bg-white text-slate-600 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-black'}`}
                    title={template.isActive ? (isRTL ? 'إخفاء عن المستخدمين' : "Hide from users") : (isRTL ? 'إظهار للمستخدمين' : "Show to users")}
                  >
                    {template.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
                    title={isRTL ? 'حذف نهائي' : "Delete forever"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="relative aspect-video w-full bg-slate-100">
                <Image 
                  src={template.preview} 
                  alt={template.name} 
                  fill 
                  className="object-cover"
                />
                {!template.isActive && (
                   <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">{isRTL ? 'مخفي عن المستخدمين' : 'Hidden from Users'}</span>
                   </div>
                )}
              </div>
              
              <div className="p-6">
                <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-primary">{template.name}</h3>
                  {isActive ? (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{isRTL ? 'نشط' : 'ACTIVE'}</span>
                  ) : (
                    <button 
                      onClick={() => handleSelectTemplate(template.id)}
                      disabled={isPending || !template.isActive}
                      className={`bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRTL ? 'تطبيق القالب' : 'Apply Template')}
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground">{template.description}</p>
                <div className={`mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'معرف القالب:' : 'Template ID:'}</span>
                   <code className="text-[10px] bg-slate-50 px-2 py-1 rounded font-mono text-slate-600">{template.id}</code>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
