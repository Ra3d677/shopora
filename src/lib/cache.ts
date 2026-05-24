/**
 * Caching utilities for Shopora
 * Uses Next.js unstable_cache for server-side caching with revalidation
 */

type CacheOptions = {
  revalidate?: number; // Revalidation time in seconds
  tags?: string[];     // Cache tags for on-demand revalidation
};

const DEFAULT_REVALIDATE = 60; // 1 minute default

/**
 * Wraps a data fetching function with Next.js ISR-compatible caching
 * Falls back to in-memory cache if Next.js cache is unavailable
 */

// In-memory cache fallback for non-Next.js environments
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const MEMORY_CACHE_TTL = 60 * 1000; // 1 minute

function getMemoryCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > MEMORY_CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setMemoryCache<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Cached data fetcher - use this for all Prisma/database queries in public pages
 * @example
 * const products = await cachedFetch(
 *   'products-homepage',
 *   () => prisma.product.findMany({ where: { storeId } }),
 *   { revalidate: 60 }
 * );
 */
export async function cachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { revalidate = DEFAULT_REVALIDATE, tags = [] } = options;

  try {
    // Try Next.js cache first (when using Next.js server components)
    const { unstable_cache } = await import('next/cache');
    const cachedFn = unstable_cache(
      fetcher,
      [cacheKey, ...tags],
      { revalidate, tags } as any
    );
    return await cachedFn();
  } catch {
    // Fallback to in-memory cache
    const cached = getMemoryCache<T>(cacheKey);
    if (cached !== null) return cached;

    const data = await fetcher();
    setMemoryCache(cacheKey, data);
    return data;
  }
}

/**
 * Revalidate cache tags on-demand (call after mutations)
 * @example
 * await revalidateTags(['store-123-products', 'store-123-categories']);
 */
export async function revalidateTags(tags: string[]): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache');
    tags.forEach(tag => revalidateTag(tag));
  } catch {
    // In-memory cache doesn't support tag-based invalidation
    // Clear all cache as fallback
    memoryCache.clear();
  }
}

/**
 * Build cache tags for a store
 */
export function buildStoreTags(storeId: string, ...resources: string[]): string[] {
  return resources.map(resource => `store-${storeId}-${resource}`);
}

// Common cache keys
export const CACHE_KEYS = {
  STORE_SETTINGS: (slug: string) => `store-settings-${slug}`,
  STORE_PRODUCTS: (storeId: string) => `store-products-${storeId}`,
  STORE_CATEGORIES: (storeId: string) => `store-categories-${storeId}`,
  STORE_BANNERS: (storeId: string) => `store-banners-${storeId}`,
  STORE_BLOG: (storeId: string) => `store-blog-${storeId}`,
  HOMEPAGE: 'homepage-data',
  PRICING: 'pricing-data',
} as const;

// Common revalidation times
export const REVALIDATION = {
  HOMEPAGE: 300,       // 5 minutes
  STOREFRONT: 60,      // 1 minute
  PRODUCT: 30,         // 30 seconds
  BLOG: 120,           // 2 minutes
  ANALYTICS: 600,      // 10 minutes
  SETTINGS: 60,        // 1 minute
} as const;