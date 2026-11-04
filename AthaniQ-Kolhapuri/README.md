# AthaniQ Kolhapuri — Complete E-Commerce Platform & Admin Operations Panel

**Client:** ATHANIQ KOLHAPUR  
**Development Team:** GrowForge  
*Tagline: Engineering Digital Experiences That Drive Business Growth.*

---

## Overview

AthaniQ Kolhapuri is a premium retail and wholesale e-commerce platform for handcrafted Kolhapuri footwear and leather accessories. The platform supports:
1. **Retail Buyers** — Storefront catalog, dynamic size-based pricing, color swatching, cart & checkout, customer reviews, order tracking.
2. **Wholesale Partners** — B2B registration, tiered volume pricing, MOQ controls, wholesale portal.
3. **Admin Operations** — Complete management panel for products, size-based variants, multiple photos, inventory adjustments, orders & fulfilment pipeline, customer reviews moderation, wholesale applications, and analytics.

---

## Technology Stack

- **Frontend Framework:** React 18 with TypeScript 5.7
- **Routing:** React Router DOM v6
- **Styling & Design System:** Tailwind CSS v3 with AthaniQ Traditional Heritage brand palette (Ivory `#FBF6EE`, Leather Brown `#5C2A12`, Charcoal `#2B1A10`, Antique Gold Accent `#E39A3B`)
- **State & Persistence:** Zustand + `localStorage` backed reactive demo data store (`dataStore.ts`)
- **Charts & Visualizations:** Recharts
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form + Zod
- **Build & Dev Tool:** Vite 6
- **Testing:** Vitest + Testing Library (14 automated unit/integration tests)
- **Target Backend Architecture (Future Phase):** Java Spring Boot + Spring Data JPA + MySQL + REST APIs

---

## Admin Credentials (Demo Mode)

- **Admin Login Route:** `/admin/login`
- **Email:** `admin@athaniq.com`
- **Password:** `admin123`
*(A 1-click "Fill Credentials" button is provided on `/admin/login` for rapid testing).*

---

## Admin Navigation & Route Map

| Section | Route | Description |
|---|---|---|
| **Overview** | `/admin` | Real-time operations dashboard with KPI stats, fulfilment pipeline, sales trend charts, low-stock alerts, and recent reviews. |
| **Products** | `/admin/products` | Master catalogue list with search, category/stock/status filters, quick publish toggle, and deletion dialogs. |
| **New Product** | `/admin/products/new` | Full creation flow with tabbed navigation: Basic Details, Multiple Photo Manager, Size-Based Pricing Matrix, and Wholesale. |
| **Edit Product** | `/admin/products/:id` | Edit product, reorder/set primary photos, adjust size-based pricing per variant, and update stock. |
| **Categories** | `/admin/categories` | Manage footwear and accessories categories (Men, Women, Kids, Leather Accessories). |
| **Inventory** | `/admin/inventory` | Variant-level stock monitoring, low-stock alerts (≤ 5 units), stock adjustment modal with audit history. |
| **All Orders** | `/admin/orders` | Unified orders list with search, date filters, payment/channel filters, and direct dispatch actions. |
| **New Orders** | `/admin/orders/new` | **Dedicated view:** Recently received orders awaiting confirmation (Pending). |
| **Ongoing Orders** | `/admin/orders/ongoing` | **Dedicated view:** Confirmed, packed, or processing orders awaiting courier handover. |
| **Dispatched Orders** | `/admin/orders/dispatched` | **Dedicated view:** In-transit orders with courier partner name, AWB tracking number, and dispatch date. |
| **Delivered Orders** | `/admin/orders/delivered` | **Dedicated view:** Completed deliveries fulfilled to customers. |
| **Cancelled Orders** | `/admin/orders/cancelled` | **Dedicated view:** Cancelled orders with inventory restored. |
| **Order Details** | `/admin/orders/:id` | Purchase-time price snapshots, delivery addresses, dispatch workflow, and status audit timeline. |
| **Customer Reviews** | `/admin/reviews` | **Dedicated moderation view:** Approve/publish, hide spam, flag reviews, rating breakdowns, and live sync with storefront PDP. |
| **Wholesale Apps** | `/admin/wholesale-applications` | Review B2B applications, approve wholesale accounts, or reject with formal rejection reasons. |
| **Wholesale Orders** | `/admin/wholesale-orders` | Filtered orders list for B2B commercial accounts. |
| **Wholesale Pricing** | `/admin/wholesale-pricing` | Configure base wholesale price, MOQ, and volume tiers per product. |
| **Customers** | `/admin/customers` | Customer directory, retail vs wholesale identification, and order history. |
| **Payments** | `/admin/payments` | Payment ledger with transaction IDs and status indicators (simulated demo). |
| **Returns** | `/admin/returns` | Return merchandise authorizations (RMA) and approval workflow. |
| **Coupons** | `/admin/coupons` | Promo codes, discount rules (% vs flat), validity dates, and usage counters. |
| **Reports** | `/admin/reports` | Sales trends, order status distribution pie chart, and product revenue ranking. |
| **Website Content** | `/admin/content` | Homepage banner text, announcement bar toggle, and brand story editor. |
| **Settings** | `/admin/settings` | Shipping thresholds, brand config, and 1-click **Reset All Demo Data** button. |

---

## Critical Requirements Implemented

### 1. Size-Based Pricing & Product Variants
- **Core Requirement:** Do not assume every size has the same price.
- **Implementation:** Product variants model combinations of Size + Color + SKU + Specific Retail Price + Specific Stock. For example:
  - Size 6 Tan: ₹899 (Stock: 12)
  - Size 7 Tan: ₹949 (Stock: 8)
  - Size 8 Tan: ₹999 (Stock: 5)
  - Size 7 Black: ₹949 (Stock: 10)
- **Storefront PDP Sync:** When a buyer selects Size 6, the price updates dynamically to ₹899 with size-specific badges. Selecting Size 8 updates the price to ₹999 and checks Size 8 stock.
- **Matrix Generator:** Admin product editor includes an automated combination generator and bulk price/stock setters.

### 2. Multiple Product Images
- **Core Requirement:** Multiple photos per product with reordering, primary selection, and preview.
- **Implementation:**
  - Multi-image upload from local machine via `FileReader` (Base64 data URIs work immediately in browser).
  - High-resolution authentic footwear photo preset gallery (1-click to attach curated Kolhapuri photos).
  - Drag / Up / Down reordering.
  - "Primary Image" badge with 1-click promotion to main photo.
  - Full-screen high-resolution image preview dialog.

### 3. Separate Dedicated Order Views
- **Core Requirement:** Separate pages for Ongoing and Dispatched orders.
- **Implementation:** Dedicated routes and tabs for:
  - `/admin/orders` (All Orders)
  - `/admin/orders/new` (Pending confirmation)
  - `/admin/orders/ongoing` (Processing & Packing)
  - `/admin/orders/dispatched` (Handed to courier with courier partner & tracking AWB)
  - `/admin/orders/delivered` (Delivered)
  - `/admin/orders/cancelled` (Cancelled)
- **Dispatch Workflow:** Handover modal capturing Courier Partner (Blue Dart, Delhivery, DTDC, India Post, Shiprocket), Tracking AWB, Dispatch Date, and Delivery Notes.

### 4. Customer Reviews Moderation
- **Core Requirement:** Dedicated customer reviews management page and storefront display.
- **Implementation:**
  - Dedicated `/admin/reviews` moderation panel with rating filters (1-5 stars), moderation status filters (Pending, Approved, Hidden, Flagged), search, and full inspect modal.
  - Actions: Approve & Publish, Hide / Spam filter, Flag for customer support.
  - Storefront PDP Integration: Displays approved reviews, average score, rating breakdown, verified buyer badges, and an interactive "Write a Review" submission form.

### 5. Historical Order Snapshot Preservation
- **Core Requirement:** Editing current product prices must never alter historical order prices.
- **Implementation:** Orders store purchase-time unit prices and line totals directly on `OrderItem`. Updating product prices in admin leaves all previous orders intact (verified by automated tests).

---

## Local Development & Setup

### Prerequisites
- Node.js 18+ (tested on Node v24.11.0)
- npm 9+ (tested on npm 11.6.1)

### Installation
```bash
# Extract the project ZIP
cd AthaniQ-Kolhapuri

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests
```bash
# Run Vitest automated test suite
npm run test
```

### Production Build
```bash
# Typecheck and build production bundle
npm run build
```

---

## Future Backend Roadmap

For the upcoming production phase, the platform is prepared to transition from `dataStore.ts` to:
- **Backend:** Java 21 + Spring Boot 3.x
- **ORM:** Spring Data JPA / Hibernate
- **Database:** MySQL 8.x with Flyway migrations
- **Storage:** AWS S3 / Cloudflare R2 for multi-photo uploads
- **Logistics:** Shiprocket / Delhivery REST API webhooks for automated tracking
