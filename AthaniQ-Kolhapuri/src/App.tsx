import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StorefrontLayout } from '@/layouts/StorefrontLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { useAuthStore } from '@/stores/authStore'

import { HomePage } from '@/features/storefront/HomePage'
import { ShopPage } from '@/features/catalog/ShopPage'
import { CategoryPage } from '@/features/catalog/CategoryPage'
import { ProductDetailPage } from '@/features/catalog/ProductDetailPage'
import { AboutPage } from '@/features/storefront/AboutPage'
import { ContactPage } from '@/features/storefront/ContactPage'
import { FaqPage } from '@/features/storefront/FaqPage'
import { PolicyPage } from '@/features/storefront/PolicyPage'
import { NotFoundPage } from '@/features/storefront/NotFoundPage'

import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'

import { CartPage } from '@/features/cart/CartPage'
import { CheckoutPage } from '@/features/checkout/CheckoutPage'
import { OrderConfirmationPage } from '@/features/checkout/OrderConfirmationPage'

import { AccountLayout } from '@/features/account/AccountLayout'
import { AccountOverview } from '@/features/account/AccountOverview'
import { AccountProfile } from '@/features/account/AccountProfile'
import { AccountAddresses } from '@/features/account/AccountAddresses'
import { AccountOrders } from '@/features/account/AccountOrders'
import { AccountOrderDetail } from '@/features/account/AccountOrderDetail'
import { AccountWishlist } from '@/features/account/AccountWishlist'
import { AccountNotifications } from '@/features/account/AccountNotifications'
import { AccountReturns } from '@/features/account/AccountReturns'

import { WholesaleLandingPage } from '@/features/wholesale/WholesaleLandingPage'
import { WholesaleRegisterPage } from '@/features/wholesale/WholesaleRegisterPage'
import { WholesaleStatusPage } from '@/features/wholesale/WholesaleStatusPage'
import { WholesaleLayout } from '@/features/wholesale/WholesaleLayout'
import { WholesaleDashboard } from '@/features/wholesale/WholesaleDashboard'
import { WholesaleCatalog } from '@/features/wholesale/WholesaleCatalog'
import { WholesaleProductPage } from '@/features/wholesale/WholesaleProductPage'
import { WholesaleOrders } from '@/features/wholesale/WholesaleOrders'
import { WholesaleOrderDetail } from '@/features/wholesale/WholesaleOrderDetail'
import { WholesaleQuotes } from '@/features/wholesale/WholesaleQuotes'
import { WholesaleProfile } from '@/features/wholesale/WholesaleProfile'

import { AdminLogin } from '@/features/admin/AdminLogin'
import { AdminDashboard } from '@/features/admin/AdminDashboard'
import { AdminProducts } from '@/features/admin/AdminProducts'
import { AdminProductEdit } from '@/features/admin/AdminProductEdit'
import { AdminCategories } from '@/features/admin/AdminCategories'
import { AdminInventory } from '@/features/admin/AdminInventory'
import { AdminOrders } from '@/features/admin/AdminOrders'
import { AdminOrderDetail } from '@/features/admin/AdminOrderDetail'
import { AdminReviews } from '@/features/admin/AdminReviews'
import { AdminWholesaleOrders } from '@/features/admin/AdminWholesaleOrders'
import { AdminWholesaleApplications } from '@/features/admin/AdminWholesaleApplications'
import { AdminWholesalePricing } from '@/features/admin/AdminWholesalePricing'
import { AdminCustomers } from '@/features/admin/AdminCustomers'
import { AdminPayments } from '@/features/admin/AdminPayments'
import { AdminReturns } from '@/features/admin/AdminReturns'
import { AdminCoupons } from '@/features/admin/AdminCoupons'
import { AdminReports } from '@/features/admin/AdminReports'
import { AdminContent } from '@/features/admin/AdminContent'
import { AdminSettings } from '@/features/admin/AdminSettings'

function ProtectedAccount() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return <AccountLayout />
}

function ProtectedWholesale() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/wholesale" replace />
  return <WholesaleLayout />
}

function ProtectedAdmin() {
  const { user, isAdmin } = useAuthStore()
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />
  return <AdminLayout />
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        {/* Storefront */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/policies/shipping" element={<PolicyPage policy="shipping" />} />
          <Route path="/policies/returns" element={<PolicyPage policy="returns" />} />
          <Route path="/policies/privacy" element={<PolicyPage policy="privacy" />} />
          <Route path="/policies/terms" element={<PolicyPage policy="terms" />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

          {/* Wholesale public */}
          <Route path="/wholesale" element={<WholesaleLandingPage />} />
          <Route path="/wholesale/register" element={<WholesaleRegisterPage />} />
          <Route path="/wholesale/status" element={<WholesaleStatusPage />} />

          {/* Account (protected) */}
          <Route element={<ProtectedAccount />}>
            <Route path="/account" element={<AccountOverview />} />
            <Route path="/account/profile" element={<AccountProfile />} />
            <Route path="/account/addresses" element={<AccountAddresses />} />
            <Route path="/account/orders" element={<AccountOrders />} />
            <Route path="/account/orders/:orderId" element={<AccountOrderDetail />} />
            <Route path="/account/wishlist" element={<AccountWishlist />} />
            <Route path="/account/notifications" element={<AccountNotifications />} />
            <Route path="/account/returns" element={<AccountReturns />} />
          </Route>

          {/* Wholesale portal (protected) */}
          <Route element={<ProtectedWholesale />}>
            <Route path="/wholesale/dashboard" element={<WholesaleDashboard />} />
            <Route path="/wholesale/catalog" element={<WholesaleCatalog />} />
            <Route path="/wholesale/product/:slug" element={<WholesaleProductPage />} />
            <Route path="/wholesale/orders" element={<WholesaleOrders />} />
            <Route path="/wholesale/orders/:orderId" element={<WholesaleOrderDetail />} />
            <Route path="/wholesale/quotes" element={<WholesaleQuotes />} />
            <Route path="/wholesale/profile" element={<WholesaleProfile />} />
          </Route>
        </Route>

        {/* Admin (protected) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductEdit />} />
          <Route path="/admin/products/:id" element={<AdminProductEdit />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/orders" element={<AdminOrders mode="all" />} />
          <Route path="/admin/orders/new" element={<AdminOrders mode="new" />} />
          <Route path="/admin/orders/ongoing" element={<AdminOrders mode="ongoing" />} />
          <Route path="/admin/orders/dispatched" element={<AdminOrders mode="dispatched" />} />
          <Route path="/admin/orders/delivered" element={<AdminOrders mode="delivered" />} />
          <Route path="/admin/orders/cancelled" element={<AdminOrders mode="cancelled" />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/wholesale-orders" element={<AdminWholesaleOrders />} />
          <Route path="/admin/wholesale-applications" element={<AdminWholesaleApplications />} />
          <Route path="/admin/wholesale-pricing" element={<AdminWholesalePricing />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/returns" element={<AdminReturns />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
