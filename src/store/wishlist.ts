import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  productId: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearStore: (storeId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: state.items.some(i => i.productId === item.productId)
            ? state.items
            : [...state.items, item],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(i => i.productId !== productId),
        })),
      isWishlisted: (productId) => get().items.some(i => i.productId === productId),
      clearStore: (storeId) =>
        set((state) => ({
          items: state.items.filter(i => i.storeId !== storeId),
        })),
    }),
    { name: 'wishlist-storage' }
  )
);
