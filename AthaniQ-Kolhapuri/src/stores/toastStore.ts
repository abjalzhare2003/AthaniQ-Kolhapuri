import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  variant: ToastVariant
  message: string
}

interface ToastState {
  toasts: Toast[]
  addToast: (variant: ToastVariant, message: string) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (variant, message) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    set((state) => ({ toasts: [...state.toasts, { id, variant, message }] }))
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

/** Convenience function to show a toast from outside React components. */
export function toast(variant: ToastVariant, message: string): void {
  useToastStore.getState().addToast(variant, message)
}
