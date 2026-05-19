import { translations as storeTranslations } from '@/store/language';

export const translations = storeTranslations;

export type TranslationKey = keyof typeof translations.en;

