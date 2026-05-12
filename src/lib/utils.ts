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
  const theme = pageThemes.find(t => t.links.some((link: string) => {
    // Normalize both for comparison
    const cleanLink = link.split('?')[0].split('#')[0].replace(/\/$/, "");
    const cleanPath = pathname.split('?')[0].split('#')[0].replace(/\/$/, "");
    return cleanPath === cleanLink || cleanPath.endsWith(cleanLink);
  }));
  return theme?.themeId || 'default';
}

export function getPremiumBackgroundStyle(bgId?: string): React.CSSProperties {
  switch (bgId) {
    case 'abyss':
      return { background: 'radial-gradient(ellipse at top, #0f172a, #0a0c14, #000000)', color: 'white' };
    case 'nebula':
      return { background: 'radial-gradient(circle at bottom left, rgba(88, 28, 135, 0.4), #0a0c14, #0a0c14)', color: 'white' };
    case 'cyber':
      return { background: 'linear-gradient(to bottom right, rgba(22, 78, 99, 0.4), #0a0c14, rgba(30, 58, 138, 0.4))', color: 'white' };
    case 'luxury':
      return { background: 'radial-gradient(ellipse at center, rgba(120, 53, 15, 0.2), #0a0c14, #000000)', color: 'white' };
    case 'default':
    default:
      return {}; // Empty object indicates no premium style
  }
}
