import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.menuItem._id === item._id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.menuItem._id === item._id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return { items: [...state.items, { menuItem: item, quantity: 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.menuItem._id !== id),
      })),

      updateQuantity: (id, qty) => set((state) => {
        if (qty <= 0) return { items: state.items.filter(i => i.menuItem._id !== id) };
        return {
          items: state.items.map(i =>
            i.menuItem._id === id ? { ...i, quantity: qty } : i
          ),
        };
      }),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

      getTotal: () => get().getSubtotal(),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'komal-cart' }
  )
);
