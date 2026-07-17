import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
  color?: string | null;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            // Adjust quantity delta, make sure it doesn't fall below 1
            const updatedItems = state.items.map((i) => {
              if (i.id === item.id) {
                const newQty = i.quantity + item.quantity;
                return { ...i, quantity: newQty < 1 ? 1 : newQty };
              }
              return i;
            });
            return { items: updatedItems };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'fashionhub-cart-storage',
    }
  )
);
