import { create } from 'zustand';
import { getStoreOrdersPaginated, updateOrderStatus } from "@/app/store/[slug]/admin/orders/actions";

interface QueryCache {
  orders: any[];
  hasMore: boolean;
  page: number;
}

interface OrdersState {
  orders: any[];
  page: number;
  search: string;
  status: string;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  filtering: boolean;
  
  // Cache storage
  cache: Record<string, QueryCache | undefined>;
  activeRequests: Record<string, Promise<any> | undefined>;

  // Actions
  setFilters: (search: string, status: string, storeId: string) => void;
  fetchOrders: (storeId: string, reset?: boolean) => Promise<void>;
  prefetchNextPage: (storeId: string, nextPage: number) => Promise<void>;
  updateOrderStatusOptimistic: (orderId: string, newStatus: string) => Promise<boolean>;
  clearCache: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  page: 1,
  search: "",
  status: "all",
  hasMore: false,
  loading: false,
  loadingMore: false,
  filtering: false,
  cache: {},
  activeRequests: {},

  clearCache: () => set({ cache: {}, activeRequests: {} }),

  setFilters: (search, status, storeId) => {
    const currentSearch = get().search;
    const currentStatus = get().status;

    if (currentSearch === search && currentStatus === status) return;

    set({ search, status, filtering: true });
    
    // Trigger reset fetch
    get().fetchOrders(storeId, true);
  },

  fetchOrders: async (storeId, reset = false) => {
    const { search, status, page, orders, cache, activeRequests } = get();
    const targetPage = reset ? 1 : page + 1;
    const cacheKey = `${storeId}_${status}_${search}_page_${targetPage}`;
    const filterKey = `${storeId}_${status}_${search}`;

    if (reset) {
      // Check cache first to prevent redundant requests
      const cachedData = cache[filterKey];
      if (cachedData && targetPage === 1) {
        set({
          orders: cachedData.orders,
          page: cachedData.page,
          hasMore: cachedData.hasMore,
          filtering: false,
          loading: false
        });
        return;
      }
      set({ loading: true, filtering: true });
    } else {
      set({ loadingMore: true });
    }

    // Request Deduplication: If a request for this exact query and page is already pending, reuse it
    if (activeRequests[cacheKey]) {
      try {
        const result = await activeRequests[cacheKey];
        handleFetchSuccess(result, reset, targetPage, filterKey);
        return;
      } catch (err) {
        handleFetchError(err, reset);
        return;
      }
    }

    // Create the fetch promise
    const fetchPromise = getStoreOrdersPaginated({
      storeId,
      page: targetPage,
      limit: 10,
      search,
      status: status === 'all' ? '' : status
    });

    // Save in active requests map
    set((state) => ({
      activeRequests: {
        ...state.activeRequests,
        [cacheKey]: fetchPromise
      }
    }));

    try {
      const result = await fetchPromise;
      
      // Remove from active requests
      set((state) => {
        const updatedRequests = { ...state.activeRequests };
        delete updatedRequests[cacheKey];
        return { activeRequests: updatedRequests };
      });

      handleFetchSuccess(result, reset, targetPage, filterKey);

      // Background Prefetching: If we got results and there are more, prefetch the NEXT page!
      if (result.success && result.hasMore) {
        get().prefetchNextPage(storeId, targetPage + 1);
      }
    } catch (error) {
      // Remove from active requests
      set((state) => {
        const updatedRequests = { ...state.activeRequests };
        delete updatedRequests[cacheKey];
        return { activeRequests: updatedRequests };
      });
      handleFetchError(error, reset);
    }

    function handleFetchSuccess(result: any, isReset: boolean, pageNum: number, fKey: string) {
      if (result.success) {
        const currentOrders = get().orders;
        const newOrders = isReset ? result.orders : [...currentOrders, ...result.orders];
        
        set({
          orders: newOrders,
          page: pageNum,
          hasMore: result.hasMore,
          loading: false,
          loadingMore: false,
          filtering: false
        });

        // Store this in the filter level query cache
        set((state) => ({
          cache: {
            ...state.cache,
            [fKey]: {
              orders: newOrders,
              hasMore: result.hasMore,
              page: pageNum
            }
          }
        }));
      } else {
        handleFetchError(result.error, isReset);
      }
    }

    function handleFetchError(err: any, isReset: boolean) {
      console.error("Error fetching orders in store:", err);
      set({
        loading: false,
        loadingMore: false,
        filtering: false
      });
    }
  },

  // Background Prefetcher: Fetches next page silently and inserts into cache
  prefetchNextPage: async (storeId, nextPage) => {
    const { search, status, cache, activeRequests } = get();
    const cacheKey = `${storeId}_${status}_${search}_page_${nextPage}`;
    const nextFilterKey = `${storeId}_${status}_${search}_prefetch_${nextPage}`;

    // Skip if already in cache or request is active
    if (cache[nextFilterKey] || activeRequests[cacheKey]) return;

    const fetchPromise = getStoreOrdersPaginated({
      storeId,
      page: nextPage,
      limit: 10,
      search,
      status: status === 'all' ? '' : status
    });

    set((state) => ({
      activeRequests: {
        ...state.activeRequests,
        [cacheKey]: fetchPromise
      }
    }));

    try {
      const result = await fetchPromise;
      
      set((state) => {
        const updatedRequests = { ...state.activeRequests };
        delete updatedRequests[cacheKey];
        
        // If prefetch is successful, store next page items in the cache record!
        const filterKey = `${storeId}_${status}_${search}`;
        const currentCached = state.cache[filterKey];
        
        if (result.success && currentCached) {
          // Merge prefetch items only if the current page hasn't changed
          const updatedCache = { ...state.cache };
          updatedCache[nextFilterKey] = {
            orders: result.orders,
            hasMore: result.hasMore,
            page: nextPage
          };
          return {
            activeRequests: updatedRequests,
            cache: updatedCache
          };
        }
        
        return { activeRequests: updatedRequests };
      });
    } catch (e) {
      set((state) => {
        const updatedRequests = { ...state.activeRequests };
        delete updatedRequests[cacheKey];
        return { activeRequests: updatedRequests };
      });
    }
  },

  // Optimistic UI updates: updates state instantly, rolls back on server failure
  updateOrderStatusOptimistic: async (orderId, newStatus) => {
    const previousOrders = get().orders;
    
    // Update local state instantly (Optimistic Update)
    set({
      orders: previousOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    });

    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        // Clear caches so the fresh database states are queried if filters change
        set({ cache: {} });
        return true;
      } else {
        // Revert local state to previous state (Rollback)
        set({ orders: previousOrders });
        alert(`Failed to update order status: ${result.error || 'Server error'}`);
        return false;
      }
    } catch (error) {
      // Revert local state to previous state (Rollback)
      set({ orders: previousOrders });
      alert("Failed to update order status due to a connection error.");
      return false;
    }
  }
}));
