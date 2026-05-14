import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: (storeId?: string) => void;
  getCartTotal: (storeId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          // Scoped find: check both ID and storeId
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.storeId === newItem.storeId
          );
          
          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }
          return { items: [...state.items, newItem] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: (storeId) => 
        set((state) => ({ 
          items: storeId 
            ? state.items.filter(item => item.storeId !== storeId) 
            : [] 
        })),
      getCartTotal: (storeId) => {
        return get().items
          .filter(item => item.storeId === storeId)
          .reduce((total, item) => {
            const price = item.product.discount_price || item.product.price;
            return total + price * item.quantity;
          }, 0);
      },
    }),
    {
      name: 'premium-store-cart',
    }
  )
);
