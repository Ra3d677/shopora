"use client";

import { MessageCircle } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { useLanguageStore } from "@/store/language";

export default function WhatsAppButton() {
  const { t } = useLanguageStore();
  const { store } = useStore();
  const whatsapp = store.settings?.contactInfo?.whatsapp;

  if (!whatsapp) return null;

  // Remove any non-numeric characters for the link
  const cleanNumber = whatsapp.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group flex items-center gap-2 overflow-hidden max-w-[60px] hover:max-w-[200px]"
      aria-label={t('whatsappSupport')}
    >
      <MessageCircle className="h-7 w-7" />
      <span className="font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {t('whatsappSupport')}
      </span>
    </a>
  );
}
