import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, WishlistItem } from '@/types'

/**
 * Cart and wishlist state with localStorage persistence.
 * The persistence layer can be swapped for a backend cart API later.
 * NOTE: Prices stored here are for display only. The backend must
 * recalculate totals in production.
 */

interface CartState {
  items: CartItem[]
  wishlist: WishlistItem[]

  // Cart actions
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void

  // Wishlist actions
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.max(1, quantity) }
              : i,
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleWishlist: (productId) =>
        set((state) => {
          const exists = state.wishlist.some((w) => w.productId === productId)
          if (exists) {
            return { wishlist: state.wishlist.filter((w) => w.productId !== productId) }
          }
          return {
            wishlist: [
              ...state.wishlist,
              { productId, addedAt: new Date().toISOString() },
            ],
          }
        }),

      isInWishlist: (productId) => get().wishlist.some((w) => w.productId === productId),

      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((w) => w.productId !== productId),
        })),

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'athaniq-cart',
      storage: createJSONStorage(() => localStorage),
      // Handle corrupted/outdated localStorage data gracefully
      merge: (persisted, current) => {
        try {
          if (!persisted || typeof persisted !== 'object') return current
          const obj = persisted as Partial<CartState>
          return {
            ...current,
            items: Array.isArray(obj.items) ? obj.items : [],
            wishlist: Array.isArray(obj.wishlist) ? obj.wishlist : [],
          }
        } catch {
          return current
        }
      },
    },
  ),
)
