import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  size?: string;
  metal?: string;
}

interface CartStore {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, delta: number, size?: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
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
          quantity: 1,
          size: "12",
          metal: "18K Yellow Gold",
        },
      ],
      couponCode: "",
      couponDiscount: 0,

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.id === newItem.id && item.size === newItem.size
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += newItem.quantity || 1;
          set({ items: updated });
        } else {
          set({
            items: [
              ...currentItems,
              { ...newItem, quantity: newItem.quantity || 1 },
            ],
          });
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && (size ? item.size === size : true))
          ),
        });
      },

      updateQuantity: (id, delta, size) => {
        set({
          items: get()
            .items.map((item) => {
              if (item.id === id && (size ? item.size === size : true)) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
        });
      },

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === "WELCOME10" || clean === "LUXURY10") {
          set({ couponCode: clean, couponDiscount: 0.1 });
          return true;
        } else if (clean === "ROYAL20") {
          set({ couponCode: clean, couponDiscount: 0.2 });
          return true;
        }
        return false;
      },

      removeCoupon: () => {
        set({ couponCode: "", couponDiscount: 0 });
      },

      clearCart: () => {
        set({ items: [], couponCode: "", couponDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        return subtotal * get().couponDiscount;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 5000 ? 0 : 250;
      },

      getTax: () => {
        const subtotalAfterDiscount = get().getSubtotal() - get().getDiscount();
        return Math.round(subtotalAfterDiscount * 0.03); // 3% GST on fine jewellery in India
      },

      getTotal: () => {
        const subtotalAfterDiscount = get().getSubtotal() - get().getDiscount();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return Math.max(0, subtotalAfterDiscount + shipping + tax);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "jewels-cart-storage",
    }
  )
);
