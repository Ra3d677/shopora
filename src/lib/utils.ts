import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStoreLink(link: string, slug: string) {
  if (!link) return `/store/${slug}`;
  if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:')) return link;
  if (link === '#') return '#';
  
  // If link starts with /store/slug, it's already correct
  if (link.startsWith(`/store/${slug}`)) return link;
  
  // If it's a relative link like /products, prepend /store/slug
  if (link.startsWith('/')) {
    return `/store/${slug}${link}`;
  }
  
  // Default fallback
  return link;
}
