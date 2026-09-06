import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  metal?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => boolean; // returns true if added, false if removed
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "1",
          name: "Eternal Solitaire Ring",
          slug: "eternal-solitaire-ring",
          price: 125000,
          originalPrice: 145000,
          image: "/images/hero-ring.jpg",
          category: "rings",
          metal: "18K Yellow Gold",
        },
      ],

      addItem: (newItem) => {
        const currentItems = get().items;
        if (!currentItems.some((item) => item.id === newItem.id)) {
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) {
          get().removeItem(item.id);
          return false;
        } else {
          get().addItem(item);
          return true;
        }
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "jewels-wishlist-storage",
    }
  )
);
