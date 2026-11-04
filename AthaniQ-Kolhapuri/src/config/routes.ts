/**
 * Centralized route path constants.
 * Use these everywhere instead of hardcoding strings.
 */
export const routes = {
  // Storefront
  home: '/',
  shop: '/shop',
  category: '/category/:slug',
  product: '/product/:slug',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  shippingPolicy: '/policies/shipping',
  returnsPolicy: '/policies/returns',
  privacyPolicy: '/policies/privacy',
  termsPolicy: '/policies/terms',
  notFound: '*',

  // Auth
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',

  // Cart & Checkout
  cart: '/cart',
  checkout: '/checkout',
  orderConfirmation: '/order-confirmation/:orderId',

  // Account
  account: '/account',
  accountProfile: '/account/profile',
  accountAddresses: '/account/addresses',
  accountOrders: '/account/orders',
  accountOrderDetail: '/account/orders/:orderId',
  accountWishlist: '/account/wishlist',
  accountNotifications: '/account/notifications',
  accountReturns: '/account/returns',

  // Wholesale
  wholesale: '/wholesale',
  wholesaleRegister: '/wholesale/register',
  wholesaleStatus: '/wholesale/status',
  wholesaleDashboard: '/wholesale/dashboard',
  wholesaleCatalog: '/wholesale/catalog',
  wholesaleProduct: '/wholesale/product/:slug',
  wholesaleOrders: '/wholesale/orders',
  wholesaleOrderDetail: '/wholesale/orders/:orderId',
  wholesaleQuotes: '/wholesale/quotes',
  wholesaleProfile: '/wholesale/profile',

  // Admin
  adminLogin: '/admin/login',
  admin: '/admin',
  adminProducts: '/admin/products',
  adminProductNew: '/admin/products/new',
  adminProductEdit: '/admin/products/:id',
  adminCategories: '/admin/categories',
  adminInventory: '/admin/inventory',
  adminOrders: '/admin/orders',
  adminOrdersNew: '/admin/orders/new',
  adminOrdersOngoing: '/admin/orders/ongoing',
  adminOrdersDispatched: '/admin/orders/dispatched',
  adminOrdersDelivered: '/admin/orders/delivered',
  adminOrdersCancelled: '/admin/orders/cancelled',
  adminOrderDetail: '/admin/orders/:id',
  adminReviews: '/admin/reviews',
  adminWholesaleOrders: '/admin/wholesale-orders',
  adminWholesaleApplications: '/admin/wholesale-applications',
  adminWholesalePricing: '/admin/wholesale-pricing',
  adminCustomers: '/admin/customers',
  adminPayments: '/admin/payments',
  adminReturns: '/admin/returns',
  adminCoupons: '/admin/coupons',
  adminReports: '/admin/reports',
  adminContent: '/admin/content',
  adminSettings: '/admin/settings',
} as const
