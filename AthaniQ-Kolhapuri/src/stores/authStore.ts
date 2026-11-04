import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { findDemoCustomer, getCustomerById } from '@/data/demoCustomers'
import { siteConfig } from '@/config/site'

/**
 * Demo authentication store.
 * NOTE: This is NOT real authentication. It simulates login/logout
 * for the frontend demo only. Production authentication must be
 * handled by a secure backend with proper password hashing,
 * session management, and role-based authorization.
 */

interface AuthState {
  user: Omit<User, 'id'> & { id: string } | null
  isAdmin: boolean
  login: (email: string, password: string) => { success: boolean; message: string }
  loginAdmin: (email: string, password: string) => { success: boolean; message: string }
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => { success: boolean; message: string }
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,

      login: (email, password) => {
        const customer = findDemoCustomer(email, password)
        if (!customer) {
          return { success: false, message: 'Invalid email or password.' }
        }
        set({
          user: {
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            role: customer.role,
            phone: customer.phone,
          },
          isAdmin: false,
        })
        return { success: true, message: 'Welcome back!' }
      },

      loginAdmin: (email, password) => {
        if (
          email.toLowerCase() === siteConfig.demo.admin.email.toLowerCase() &&
          password === siteConfig.demo.admin.password
        ) {
          set({
            user: {
              id: 'admin-001',
              email: siteConfig.demo.admin.email,
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin' as UserRole,
            },
            isAdmin: true,
          })
          return { success: true, message: 'Welcome, Admin.' }
        }
        return { success: false, message: 'Invalid admin credentials.' }
      },

      register: (data) => {
        // In demo mode, registration just creates a temporary session
        set({
          user: {
            id: `cust-${Date.now()}`,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: 'customer',
          },
          isAdmin: false,
        })
        return { success: true, message: 'Account created successfully!' }
      },

      logout: () => set({ user: null, isAdmin: false }),

      updateProfile: (updates) => {
        const current = get().user
        if (current) {
          set({ user: { ...current, ...updates } })
        }
      },
    }),
    {
      name: 'athaniq-auth',
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        try {
          if (!persisted || typeof persisted !== 'object') return current
          const obj = persisted as Partial<AuthState>
          return {
            ...current,
            user: obj.user ?? null,
            isAdmin: obj.isAdmin ?? false,
          }
        } catch {
          return current
        }
      },
    },
  ),
)

/** Helper: get the current customer's full record (with addresses). */
export function getCurrentCustomer() {
  const user = useAuthStore.getState().user
  if (!user) return null
  return getCustomerById(user.id) ?? null
}
