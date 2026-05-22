import { cookies } from 'next/headers';
import { translations, TranslationKey } from './translations';

export async function getLang() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  return lang as 'en' | 'ar';
}

export async function getMarketingLang() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('SHOPORA_MARKETING_LOCALE')?.value || 'en';
  return lang as 'en' | 'ar';
}

export async function getTranslation() {
  const lang = await getLang();
  return (key: TranslationKey) => {
    return (translations[lang] as Record<string, string>)[key] || key;
  };
}
