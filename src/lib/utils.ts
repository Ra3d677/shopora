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

export function getThemeByPath(pageThemes: any[], pathname: string) {
  if (!pageThemes || !Array.isArray(pageThemes)) return 'default';
  
  // Find a theme that contains the current link
  const theme = pageThemes.find(t => t.links.some((link: string) => pathname.endsWith(link) || pathname === link));
  return theme?.themeId || 'default';
}

export function getPremiumBackgroundClass(bgId?: string) {
  switch (bgId) {
    case 'abyss':
      return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0c14] to-black text-white';
    case 'nebula':
      return 'bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0c14] to-[#0a0c14] text-white';
    case 'cyber':
      return 'bg-[linear-gradient(to_right_bottom,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a0c14] to-blue-900/20 text-white';
    case 'luxury':
      return 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-[#0a0c14] to-black text-white';
    case 'default':
    default:
      return 'bg-white dark:bg-[#0a0c14] text-slate-900 dark:text-white'; // Fallback to store default
  }
}
