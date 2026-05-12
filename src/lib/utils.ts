import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildCategoryTree(categories: any[]) {
  const map: Record<string, any> = {};
  const tree: any[] = [];

  categories.forEach(cat => {
    map[cat.id] = { ...cat, children: [] };
  });

  categories.forEach(cat => {
    if (cat.parentId && map[cat.parentId]) {
      map[cat.parentId].children.push(map[cat.id]);
    } else {
      tree.push(map[cat.id]);
    }
  });

  return tree;
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
