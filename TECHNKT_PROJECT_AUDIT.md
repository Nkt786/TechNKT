# TECHNKT PROJECT TECHNICAL AUDIT
**Comprehensive Architectural, Security, and Codebase Analysis for Backend Implementation**  
*Conducted by Senior Software Architect, Security Engineer & Systems Auditor*  
*Target Audience: Systems Architects, Engineering Leads, Backend Developers & AI Architects (ChatGPT)*

---

## 1. Executive Summary

TechNKT is currently a high-performance, statically generated hybrid web application built with **Astro 7.0.3**, **React 19.2.7**, **TypeScript 6.0.3**, and **Tailwind CSS 4.3.1**, deployed via the **`@astrojs/vercel`** adapter. 

### Key Audit Findings:
1. **Frontend Maturity**: The presentation layer is modern, responsive, and visually refined. It features an interactive hero orbit component, an instant-search product catalogue with category filtering, a shopping cart with quantity adjustments, responsive navigation, and dedicated marketing pages for Ebooks and Website Development services.
2. **Backend & Database Reality**: **There is NO active database, NO user authentication system, NO server-side cart persistence, and NO automated digital fulfillment system.** The application operates predominantly as a static site (SSG) with browser-local client state.
3. **Purchasing & Checkout Flow**: The primary storefront checkout (`/shop` and `/cart`) terminates in a client-side **WhatsApp URL redirect** (`https://wa.me/?text=...`) without recording any order in a database. An independent, isolated Stripe subscription endpoint exists (`/api/checkout.ts`), but it is only wired to the legacy `/pricing` modal and is **completely detached** from the main INR product catalogue.
4. **Critical Security Vulnerabilities**:
   * **Arbitrary Price Tampering**: `/api/checkout.ts` accepts price parameters (`body.price`) directly from the client without server-side validation against a catalogue or database.
   * **Unauthenticated Client State**: Cart items, prices, and quantities live in plaintext inside browser `localStorage` (`technkt_cart`).
   * **Zero Rate Limiting**: Public API endpoints (`/api/contact`, `/api/lead`, `/api/checkout`) lack IP throttling or CAPTCHA, exposing external CRM (GoHighLevel) and Stripe APIs to spam and card-testing abuse.
5. **Architectural Readiness**: The existing frontend components are modular, clean, and highly reusable. Transitioning TechNKT to a fully automated digital commerce platform requires introducing a unified database, authentic user identity, server-validated orders, automated digital key/entitlement fulfillment, and a protected administrative dashboard.

---

## 2. Verified Technology Stack

| Dimension | Verified Technology | Version | Source File / Config | Status |
|---|---|---|---|---|
| **Project Name** | `automark-astro` (Brand: TechNKT) | `1.0.1` | `package.json:2-3` | VERIFIED FROM SOURCE |
| **Framework** | Astro | `7.0.3` | `package.json:26` | VERIFIED FROM SOURCE |
| **UI Library** | React | `19.2.7` | `package.json:31` | VERIFIED FROM SOURCE |
| **Language / Target** | TypeScript / ES6 | `^6.0.3` | `tsconfig.json:5, package.json:55` | VERIFIED FROM SOURCE |
| **Styling Engine** | Tailwind CSS (Vite plugin) | `^4.3.1` | `package.json:44,54`, `astro.config.mjs:6,58` | VERIFIED FROM SOURCE |
| **Bundler / Build** | Vite | `^8.1.0` | `package.json:38` | VERIFIED FROM SOURCE |
| **Rendering Strategy** | Hybrid SSG / Serverless | Astro Static + Vercel Serverless | `astro.config.mjs:52-53` | VERIFIED FROM SOURCE |
| **Deployment Adapter** | `@astrojs/vercel` | `^11.0.0` | `package.json:23`, `astro.config.mjs:5` | VERIFIED FROM SOURCE |
| **Icon Libraries** | `react-icons` (Lu, Fi, Si, Fa) | `^5.6.0` | `package.json:33` | VERIFIED FROM SOURCE |
| **Payment SDK** | `stripe` | `^22.3.0` | `package.json:37`, `src/pages/api/checkout.ts` | VERIFIED FROM SOURCE |
| **CRM Integration** | GoHighLevel (LeadConnector REST API) | API `2021-07-28` | `src/pages/api/contact.ts`, `lead.ts` | VERIFIED FROM SOURCE |
| **Markdown / Content** | Astro Content Collections + Zod | Astro 7 glob loader | `src/content.config.ts:1-634` | VERIFIED FROM SOURCE |
| **Image Pipeline** | Sharp + Astro Assets | `^0.35.2` | `package.json:36`, `astro.config.mjs:11,57` | VERIFIED FROM SOURCE |
| **Font Management** | `@astrojs/font` (Google Fonts loader) | DM Sans & Bricolage | `src/config/theme.json`, `Base.astro:8` | VERIFIED FROM SOURCE |
| **State Management** | LocalStorage + Custom DOM Events | Native browser events | `CartView.tsx`, `StoreCatalog.tsx` | VERIFIED FROM SOURCE |
| **Database** | None | N/A | `package.json` (0 DB dependencies) | NOT FOUND |
| **Auth Provider** | None | N/A | `package.json` (0 Auth dependencies) | NOT FOUND |

---

## 3. Project Directory Structure

```
automark-astro-main/
├── .env.example                     # Environment template (GHL & Stripe keys)
├── astro.config.mjs                 # Astro configuration with Vercel adapter & Tailwind plugin
├── package.json                     # Dependency manifests, build scripts
├── tsconfig.json                    # Strict TypeScript configuration and path aliases
├── public/                          # Static public assets
│   ├── favicon.ico / favicon.svg    # Browser favicons
│   ├── showcase.mp4                 # Standby showcase media
│   ├── images/                      # Optimized image directory
│   │   ├── categories/              # 6 category SVG icons
│   │   ├── ebooks/                  # Ebook cover art
│   │   ├── icons/                   # 10 UI feature icons
│   │   ├── platforms-logo/          # 20 comparison platform SVGs
│   │   ├── products/                # Product catalogue imagery
│   │   ├── shop-categories/         # Category plan visuals
│   │   ├── hero-laptop-screen.webp  # Hero centerpiece artwork
│   │   ├── logo.svg                 # Brand vector logo
│   │   └── technkt-icon.png         # Brand iconmark & web icon
│   └── scripts/                     # Client-side scripts (main.js, particleCanvas.js)
├── src/
│   ├── config/                      # Site-wide settings
│   │   ├── config.json              # Site metadata, brand title, footer copy
│   │   ├── menu.json                # Navigation links
│   │   └── theme.json               # Palette tokens, typography configuration
│   ├── content/                     # Markdown and MDX content collections
│   │   ├── about/                   # About page content
│   │   ├── blog/                    # 7 Markdown blog articles
│   │   ├── careers/                 # 4 Job postings & careers data
│   │   ├── case-study/              # 2 Client case studies
│   │   ├── contact/                 # Contact page copy & scheduler metadata
│   │   ├── features/                # Features copy
│   │   ├── homepage/                # Homepage section copy
│   │   ├── integrations/            # Integrations ecosystem list
│   │   ├── pages/                   # Legal pages (privacy, terms, refund)
│   │   └── sections/                # Reusable section copy (FAQ, our-story)
│   ├── data/                        # Static In-Memory Data Stores
│   │   ├── products.ts              # Canonical TechNKT product catalogue (12 products)
│   │   └── reviews.ts               # Customer review interface & store
│   ├── layouts/                     # Astro layouts, partials & React components
│   │   ├── Base.astro               # HTML document shell, SEO tags, mobile nav
│   │   ├── components/              # Interactive UI components
│   │   │   ├── CartView.tsx         # Shopping cart UI, quantity handlers, summary
│   │   │   ├── CustomerReviewsCarousel.tsx # Reviews carousel
│   │   │   ├── EbooksShowcase.tsx   # Ebook 3D cards & add-to-cart logic
│   │   │   ├── HeaderAccountCart.tsx # Header cart badge & account trigger
│   │   │   ├── HeroVisual.tsx       # Orbiting product visual & drag animation
│   │   │   ├── MobileBottomNav.tsx  # Responsive floating bottom navigation
│   │   │   ├── PricingCheckout.tsx  # Modal Stripe checkout trigger for /pricing
│   │   │   ├── ShopByPlan.tsx       # Category tabs & plan selector
│   │   │   └── StoreCatalog.tsx     # 12-item product grid, category filter, search
│   │   ├── partials/                # Structural layout templates
│   │   │   ├── Header.astro         # Sticky header, logo, navigation drawer
│   │   │   └── Footer.astro         # Site footer, legal links, contact info
│   │   └── helpers/                 # Dynamic icons and shortcodes
│   ├── lib/                         # Content parsers and formatters
│   │   ├── contentParser.astro      # Astro collection querying helpers
│   │   └── utils/                   # Text converters, date formatting, reading time
│   ├── pages/                       # Routing tree (Astro pages & Serverless API routes)
│   │   ├── 404.astro                # Custom 404 error page
│   │   ├── about.astro              # Company story & core values
│   │   ├── account.astro            # Customer sign-in UI
│   │   ├── cart.astro               # Dedicated shopping cart page
│   │   ├── contact.astro            # Contact form & meeting scheduler
│   │   ├── ebook.astro              # Ebooks catalogue showcase
│   │   ├── index.astro              # Primary TechNKT homepage
│   │   ├── shop.astro               # TechNKT digital storefront
│   │   ├── web-development.astro    # Web design packages & capabilities
│   │   ├── [regular].astro          # Dynamic renderer for legal & static pages
│   │   └── api/                     # Server-rendered API routes
│   │       ├── checkout.ts          # Stripe session creation + GHL contact sync
│   │       ├── contact.ts           # Contact form forwarding to GHL
│   │       ├── lead.ts              # Lead capture forwarding to GHL
│   │       └── webhooks/stripe.ts   # Stripe webhook handler
│   └── styles/                      # Stylesheets
│       ├── base.css                 # Base resets & responsive custom properties
│       ├── components.css           # Custom buttons, cards, typography utilities
│       └── main.css                 # Tailwind entrypoint
```

---

## 4. Routes and Pages Inventory

| Exact Path | Source File | Rendering Mode | Access | Data Source | Functional Status | Gaps / Missing Backend |
|---|---|---|---|---|---|---|
| `/` | `src/pages/index.astro` | SSG (Static) | Public | `src/content/`, `products.ts` | **Working** | None (pure UI) |
| `/shop` | `src/pages/shop.astro` | SSG + React Island | Public | `src/data/products.ts` | **Working** | Client-side only; no dynamic stock |
| `/cart` | `src/pages/cart.astro` | SSG + React Island | Public | `localStorage` | **Working** | No server persistence; checkout leads to WhatsApp |
| `/web-development` | `src/pages/web-development.astro` | SSG (Static) | Public | In-page arrays | **Working** | Inquiry leads to static `/contact` |
| `/ebook` | `src/pages/ebook.astro` | SSG + React Island | Public | `EbooksShowcase.tsx` | **Working** | No downloadable files; no paywall validation |
| `/about` | `src/pages/about.astro` | SSG (Static) | Public | `src/content/about/` | **Working** | None |
| `/contact` | `src/pages/contact.astro` | SSG + Client JS | Public | `src/content/contact/` | **Working** | Forwards to GHL API; no local database |
| `/account` | `src/pages/account.astro` | SSG (Static) | Public | None | **UI ONLY** | Form triggers `alert()`; zero auth backend |
| `/pricing` | `src/pages/pricing.astro` | SSG + React Island | Public | `src/content/pricing/` | **Working** | Triggers USD Stripe checkout; detached from store |
| `/features` | `src/pages/features.astro` | SSG (Static) | Public | `src/content/features/`| **Working** | Legacy template showcase |
| `/integrations` | `src/pages/integrations.astro` | SSG (Static) | Public | `src/content/integrations/`| **Working** | Static ecosystem directory |
| `/blog` | `src/pages/blog/index.astro` | SSG (Static) | Public | `src/content/blog/` | **Working** | Static markdown blog |
| `/blog/[single]` | `src/pages/blog/[single].astro` | SSG (`getStaticPaths`)| Public | `src/content/blog/*.md`| **Working** | 7 pre-rendered posts |
| `/careers` | `src/pages/careers/index.astro` | SSG (Static) | Public | `src/content/careers/` | **Working** | Static careers directory |
| `/careers/[single]`| `src/pages/careers/[single].astro`| SSG (`getStaticPaths`)| Public | `src/content/careers/*.md`| **Working** | 4 job posts with contact forms |
| `/case-study` | `src/pages/case-study/index.astro` | SSG (Static) | Public | `src/content/case-study/`| **Working** | 2 static case studies |
| `/privacy-policy` | `src/pages/[regular].astro` | SSG (`getStaticPaths`)| Public | `src/content/pages/` | **Working** | Markdown legal page |
| `/terms-and-conditions`| `src/pages/[regular].astro`| SSG (`getStaticPaths`)| Public | `src/content/pages/` | **Working** | Markdown legal page |
| `/refund-policy` | `src/pages/[regular].astro` | SSG (`getStaticPaths`)| Public | `src/content/pages/` | **Working** | Markdown legal page |
| `/404` | `src/pages/404.astro` | SSG (Static) | Public | In-page | **Working** | Error fallback |
| `/api/checkout` | `src/pages/api/checkout.ts` | Serverless (SSR) | Public | Request Body | **Working** | Insecure price acceptance; no DB order |
| `/api/contact` | `src/pages/api/contact.ts` | Serverless (SSR) | Public | Request Body | **Working** | Depends on GHL API keys |
| `/api/lead` | `src/pages/api/lead.ts` | Serverless (SSR) | Public | Request Body | **Working** | Depends on GHL API keys |
| `/api/webhooks/stripe`| `src/pages/api/webhooks/stripe.ts`| Serverless (SSR)| Stripe Webhook | Request Body + Sig | **Working** | Tags GHL contact; no local order/key dispatch |

---

## 5. Important Components

1. **`StoreCatalog.tsx`** (`src/layouts/components/StoreCatalog.tsx`):
   * Primary ecommerce storefront component loaded on `/shop`.
   * Manages category switching (`PRODUCT_CATEGORIES`), live search query filtering, and sorting (`price-asc`, `price-desc`, `name-asc`, `featured`).
   * Handles "Add to Cart" and "Buy Now" interactions, dispatching `"cart-updated"` events.
2. **`CartView.tsx`** (`src/layouts/components/CartView.tsx`):
   * Client-rendered shopping cart loaded on `/cart`.
   * Synchronizes items from `localStorage.getItem("technkt_cart")`.
   * Calculates subtotal, manages item deletion, quantity increments/decrements.
   * Renders the order summary and checkout CTA.
3. **`HeaderAccountCart.tsx`** (`src/layouts/components/HeaderAccountCart.tsx`):
   * Global navigation island embedded in `Header.astro`.
   * Subscribes to `"cart-updated"` and `"storage"` events to render real-time cart item counts.
   * Houses the desktop `/account` shortcut.
4. **`HeroVisual.tsx`** (`src/layouts/components/HeroVisual.tsx`):
   * Hero centerpiece featuring the warped laptop display (`hero-laptop-screen.webp`) surrounded by an animated, interactive 3D orbit of authentic service icons (Netflix, Prime, Hotstar, SonyLIV, ZEE5, Spotify, ChatGPT, Claude, Canva).
   * Supports mouse drag-to-spin physics, auto-rotation, and responsive mobile adaptations.
5. **`EbooksShowcase.tsx`** (`src/layouts/components/EbooksShowcase.tsx`):
   * Specialized showcase on `/ebook` featuring 3D perspective book mockups with interactive cover flips.
   * Contains embedded "Buy Now" and "Add to Cart" buttons that append ebook items to `technkt_cart`.
6. **`ShopByPlan.tsx`** (`src/layouts/components/ShopByPlan.tsx`):
   * Interactive category tab selector featured on the homepage.
   * Houses independent subscription, combo pack, software, and web dev service cards with feature bullet points and "Select Plan" buttons.
7. **`PricingCheckout.tsx`** (`src/layouts/components/PricingCheckout.tsx`):
   * Modal checkout trigger on `/pricing`. Collects name and email, then executes `fetch("/api/checkout")` to open a Stripe Checkout Session.

---

## 6. Product Catalogue Architecture

The TechNKT product catalogue is **hardcoded as a static in-memory TypeScript array** in `src/data/products.ts`.

### Catalogue Metrics:
* **Total Products**: Exactly **12 products**.
* **Total Categories**: **5 categories** (`subscriptions`, `combo-packs`, `software`, `music`, `ebooks`), plus `"all"` filter.
* **Storage Location**: `src/data/products.ts:56-237`.
* **Dynamic Loading**: None. Products are bundled directly into client-side JavaScript.
* **Database Connection**: None. No database is queried.
* **Pricing Currency**: Indian Rupee (INR / `₹`), hardcoded numeric prices (`price: 215`) alongside pre-formatted strings (`formattedPrice: "₹215"`).
* **Inventory / Stock**: Untracked (`instant: true` is displayed statically for all items).
* **Product Variants**: Not supported by the current schema. Every product has a single price and a fixed duration (`"/mo"` or `"one-time"`).

---

## 7. Product Data Model

### Actual TypeScript Interfaces (`src/data/products.ts:1-21`):
```typescript
export interface Product {
  id: string;
  name: string;
  category: "subscriptions" | "combo-packs" | "software" | "music" | "ebooks";
  image: string;
  price: number;
  originalPrice: number;
  formattedPrice: string;
  formattedOriginalPrice: string;
  period: string;
  instant: boolean;
  badge?: string;
  description: string;
  featured: boolean;
}

export interface ProductCategory {
  id: "all" | "subscriptions" | "combo-packs" | "software" | "music" | "ebooks";
  name: string;
  icon: string;
}
```

### Representative Real Product Record (`src/data/products.ts:57-71`):
```typescript
{
  id: "combo-2in1",
  name: "2-in-1 Combo",
  category: "combo-packs",
  image: "/images/products/2-in-1-combo.jpg",
  price: 215,
  originalPrice: 299,
  formattedPrice: "₹215",
  formattedOriginalPrice: "₹299",
  period: "/mo",
  instant: true,
  badge: "Most Popular",
  description: "Netflix 4K UHD + Prime Video 4K Duo Pack with dedicated PIN.",
  featured: true,
}
```

### Limitations of Current Model for Backend Integration:
1. **No SKU / Barcode / Variant Key**: Cannot represent 1-month vs 3-month vs 12-month variants of the same service.
2. **No Inventory / Credential Pool**: No linkage to digital license keys, login emails, passwords, or profile PIN slots.
3. **No Tax / Currency Code**: Hardcoded symbol `"₹"`; lacks ISO currency identifiers (`"INR"`).
4. **No Slug**: Routing relies on query parameters (`/shop?category=...`); individual products lack dedicated canonical URLs (`/product/[slug]`).
5. **Data Duplication**: `ShopByPlan.tsx` and `EbooksShowcase.tsx` define their own separate in-component product arrays with mismatched IDs and conflicting prices.

---

## 8. Cart Architecture

### Data Flow Diagram:
```
[User clicks "Add to Cart"]
         ↓
StoreCatalog.tsx / EbooksShowcase.tsx
         ↓
Read `localStorage.getItem("technkt_cart")`
         ↓
Append / Increment quantity in memory
         ↓
Write `localStorage.setItem("technkt_cart", JSON.stringify(cart))`
         ↓
Dispatch `window.dispatchEvent(new Event("cart-updated"))`
         ↓
HeaderAccountCart.tsx (updates navbar badge) & CartView.tsx (re-renders items list)
```

### Cart Storage Model (`CartView.tsx:4-10`):
```typescript
interface CartItem {
  id: string;
  name: string;
  price: string;       // e.g. "₹215"
  period?: string;     // e.g. "/mo"
  quantity: number;
}
```

### Architectural Findings:
* **Storage Location**: Browser `localStorage` under key `"technkt_cart"` (with fallback check to `"cart"`).
* **Multi-Tab Synchronization**: Works across open browser tabs via native `window.addEventListener("storage", ...)`.
* **Cross-Device Persistence**: **None**. Carts do not persist across devices or browsers because there is no server-side cart database.
* **Price Tampering Exposure**: The price stored in `localStorage` is trusted directly by `CartView.tsx:75` during subtotal summation. A user can edit `localStorage` to change any item's price.
* **Catalogue Desynchronization**: If an item in `src/data/products.ts` changes price or is removed, items in existing users' `localStorage` retain the old price and stale data indefinitely.

---

## 9. Checkout and Order Flow

### Current Reality: The WhatsApp Pseudo-Checkout
When a customer adds products to their cart and clicks **"Proceed to Checkout"** (`CartView.tsx:198-206`), the application executes:
```html
<a
  href="https://wa.me/?text=Hello%20TechNKT,%20I%20want%20to%20complete%20my%20order"
  target="_blank"
  rel="noopener noreferrer"
  class="btn btn-primary"
>
  Proceed to Checkout
</a>
```
**CRITICAL VERIFICATION**:
* **No server-side order record is created.**
* **No customer details are collected.**
* **The items in the cart are NOT even encoded into the WhatsApp message query.**
* TechNKT operates on a **100% manual, conversational sales model** for storefront products.

### The Detached Stripe Flow (`/pricing` Only):
An isolated automated flow exists exclusively on `/pricing` via `PricingCheckout.tsx`:
1. Customer clicks "Get Access" on a template pricing tier.
2. Modal captures `name` and `email`.
3. Client executes `POST /api/checkout` with `{ name, email, planTitle, price, interval }`.
4. Endpoint creates a Stripe Checkout Session in USD and returns the hosted payment URL.
5. Upon payment, Stripe Webhook (`/api/webhooks/stripe.ts`) receives `checkout.session.completed` and pushes the contact to GoHighLevel with the tag `paid-customer`.
6. **No database order is created; no digital product or license key is delivered.**

---

## 10. User Authentication Status

| Feature | Verified Status | Existing Implementation | Evidence |
|---|---|---|---|
| **Customer Registration** | **NOT IMPLEMENTED** | None | No signup routes or APIs |
| **Customer Login** | **UI ONLY** | Single form in `src/pages/account.astro` | `onsubmit="event.preventDefault(); alert(...)"` |
| **Password Hashing / Security** | **NOT IMPLEMENTED** | None | No bcrypt, argon2, or crypto modules |
| **Session Management** | **NOT IMPLEMENTED** | None | No session cookies, tokens, or JWTs |
| **Protected Routes / Middleware**| **NOT IMPLEMENTED** | None | No Astro middleware file exists |
| **OAuth (Google / Phone / OTP)**| **NOT IMPLEMENTED** | None | No OAuth client libraries |
| **Customer Profile Management** | **NOT IMPLEMENTED** | None | No user settings or profile forms |
| **Customer Order History** | **NOT IMPLEMENTED** | None | Account page is a static placeholder |
| **Role-Based Access Control** | **NOT IMPLEMENTED** | None | No roles (`user`, `admin`, `support`) |

---

## 11. Existing Backend and API Endpoints

All backend endpoints are serverless functions running via Astro's SSR engine (`export const prerender = false`).

### 1. `POST /api/checkout` (`src/pages/api/checkout.ts`)
* **Purpose**: Creates a Stripe subscription checkout session.
* **Payload**: `{ name: string, email: string, planTitle: string, price: string, interval: "month" | "year" }`
* **Integrations**: Stripe API (`stripe.checkout.sessions.create`), GoHighLevel API (`/contacts/upsert`).
* **Vulnerabilities**: Accepts client-supplied `price` without verification. Hardcoded `currency: "usd"`.
* **Persistence**: None.

### 2. `POST /api/contact` (`src/pages/api/contact.ts`)
* **Purpose**: Handles contact inquiries from `/contact`.
* **Payload**: `{ name: string, email: string, phone: string, message: string }` (supports JSON & `multipart/form-data`).
* **Integrations**: GoHighLevel API (Creates contact, appends conversation message, writes contact note).
* **Vulnerabilities**: No rate limiting or CAPTCHA.
* **Persistence**: External CRM only (GoHighLevel).

### 3. `POST /api/lead` (`src/pages/api/lead.ts`)
* **Purpose**: Captures email leads from modal/checklist forms.
* **Payload**: `{ name: string, email: string }`
* **Integrations**: GoHighLevel API (`/contacts/upsert` with tag `website-lead-generation`).
* **Vulnerabilities**: No rate limiting or CAPTCHA.
* **Persistence**: External CRM only (GoHighLevel).

### 4. `POST /api/webhooks/stripe` (`src/pages/api/webhooks/stripe.ts`)
* **Purpose**: Receives Stripe webhook events.
* **Payload**: Raw Stripe event stream with `stripe-signature` header.
* **Verification**: `stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)`.
* **Handled Events**: `checkout.session.completed`.
* **Action**: Tags contact as `paid-customer` in GoHighLevel with custom field `price`.
* **Gaps**: Does not record transaction in a local database; does not dispatch digital credentials.

---

## 12. Database Status

* **Connected Database**: **NONE**.
* **ORM / Query Builder**: **NONE**.
* **Database Migrations / Schemas**: **NONE**.
* **Database Verification Result**: **CONFIRMED NOT CONNECTED**. There are no database configuration files, connection strings, models, or SQL migrations in the repository.

---

## 13. Admin Dashboard Status

* **Admin Portal**: **100% NOT IMPLEMENTED**.
* **Product Management UI**: Does not exist (updating products requires modifying `src/data/products.ts` and rebuilding).
* **Order Tracking UI**: Does not exist.
* **Customer Management UI**: Does not exist.
* **Digital Inventory / Key Vault**: Does not exist.
* **Review Moderation UI**: Does not exist.

---

## 14. Payment Integration Status

### Current Setup:
* **Stripe**: SDK installed (`stripe@22.3.0`). Configured for USD subscription checkouts on `/pricing`.
* **Domestic Indian Gateways (Razorpay / Cashfree / PhonePe / PayU / UPI)**: **NOT IMPLEMENTED**.
* **Cart Integration**: The cart subtotal (in INR) cannot be paid online. It terminates in a WhatsApp link.
* **Idempotency & Replay Protection**: `stripe.ts` verifies signatures, but does not track processed event IDs in a database table to protect against duplicate webhook deliveries.

---

## 15. Digital Product Delivery

* **Delivery Mechanism**: **100% MANUAL**.
* **Credential Vault**: No secure storage for Netflix profiles, Prime credentials, or Hotstar OTP sessions.
* **Download Delivery**: No private storage buckets (S3 / Cloudflare R2 / Supabase Storage).
* **Customer Account Delivery**: The `/account` route has no dashboard to display purchased keys or credentials.
* **Legal / Reseller Risk**: The site advertises "Dedicated Private Profile with 4-digit PIN" and "Direct OTP". Reselling shared streaming profiles must comply with respective platforms' Terms of Service and applicable regional digital distribution regulations.

---

## 16. Ebook System

* **Ebook Catalogue**: 2 ebooks listed in `EbooksShowcase.tsx` and 2 in `src/data/products.ts`.
* **Asset Storage**: Only front cover art is stored (`public/images/ebooks/*.jpg`).
* **PDF Files**: **0 PDF files exist in the repository.**
* **File Access Control**: Not implemented. There are no download URLs, no signed links, and no purchase verification gates.

---

## 17. Website Development Enquiry System

* **Presentation**: 9 service categories and a 4-step process are presented on `src/pages/web-development.astro`.
* **Lead Capture**: Every service CTA directs the user to `/contact`.
* **Form Handling**: The contact form dispatches data to `/api/contact`, which pushes the lead into GoHighLevel.
* **Project Management / Milestones**: No client dashboard, contract signing, quotation generation, or milestone billing features exist.

---

## 18. Reviews, Support and Contact

* **Review Data Store**: `src/data/reviews.ts` contains an empty array (`customerReviews: CustomerReview[] = []`).
* **Review Display**: `CustomerReviewsCarousel.tsx` dynamically renders an invitation card when empty and activates a 3D carousel when populated with genuine reviews.
* **Review Submission / Moderation**: No review submission endpoint or moderation database exists.
* **Customer Support**: Direct links to WhatsApp (`wa.me`) and mailto links (`support@technkt.com`).

---

## 19. Environment and Deployment

### Environment Variable Names (`.env.example`):
* `GHL_API_KEY`: GoHighLevel Private Integration API Token.
* `GHL_LOCATION_ID`: GoHighLevel Sub-Account Location ID.
* `STRIPE_SECRET_KEY`: Stripe API Secret Key (`sk_test_...` / `sk_live_...`).
* `STRIPE_WEBHOOK_SECRET`: Stripe Webhook Signing Secret (`whsec_...`).

### Deployment Infrastructure:
* Configured for **Vercel** serverless functions via `@astrojs/vercel`.
* `astro.config.mjs` sets `adapter: vercel()`. Static assets compile to `dist/client/`, while API functions compile to `.vercel/output/functions/`.
* Cloudflare Workers scripts exist in `package.json` (`deploy:cf-workers`), but current build targets Vercel.

---

## 20. Security Findings

| Severity | Finding | File Location | Impact | Remediation |
|---|---|---|---|---|
| **CRITICAL** | **Arbitrary Client Price Tampering** | `src/pages/api/checkout.ts:44,96` | Malicious actors can set `price: "0.01"` and complete checkouts for pennies. | Server must resolve price exclusively from database/catalogue by `productId`. |
| **CRITICAL** | **Missing Authentication & Access Control** | `src/pages/account.astro` | No identity verification; account UI is unauthenticated. | Implement secure auth (Supabase Auth / Clerk / Lucia) with HTTP-only cookies. |
| **HIGH** | **Insecure Client-Side Cart Storage** | `src/layouts/components/CartView.tsx:75` | Cart data and prices in `localStorage` can be forged. | Cart totals must be recalculated on the server during checkout session creation. |
| **HIGH** | **Zero Rate Limiting on Public APIs** | `src/pages/api/contact.ts`, `checkout.ts`, `lead.ts` | Endpoints vulnerable to automated spam, credential abuse, and card testing. | Implement Upstash Redis rate limiting and Cloudflare Turnstile CAPTCHA. |
| **MEDIUM** | **Missing Server-Side Order Persistence** | `src/layouts/components/CartView.tsx:198` | Purchases on WhatsApp produce zero database records; impossible to audit revenue or automate fulfillment. | Create database `orders` and `order_items` tables before payment redirection. |
| **MEDIUM** | **Missing Webhook Idempotency Handling** | `src/pages/api/webhooks/stripe.ts` | Duplicate webhook deliveries from Stripe could trigger repeated actions. | Log processed `event.id` in a database table with unique constraints. |
| **LOW** | **Price & ID Discrepancies in Frontend** | `products.ts` vs `ShopByPlan.tsx` vs `EbooksShowcase.tsx` | Conflicting prices displayed across pages (e.g. Netflix ₹139 vs ₹199). | Single source of truth in database queried via unified API. |

---

## 21. Current Data Flow Diagrams

### 1. Storefront Browsing & Cart Flow (Working Locally)
```
Customer
   ↓
[Views /shop]
   ↓
StoreCatalog.tsx reads PRODUCTS from `src/data/products.ts`
   ↓
[Clicks "Add to Cart"]
   ↓
Item appended to `localStorage["technkt_cart"]`
   ↓
"cart-updated" event fired
   ↓
HeaderAccountCart.tsx badge updates count
```

### 2. Storefront Checkout Flow (Current Manual Reality)
```
Customer
   ↓
[Views /cart]
   ↓
CartView.tsx reads `localStorage["technkt_cart"]`
   ↓
[Clicks "Proceed to Checkout"]
   ↓
Browser opens `https://wa.me/?text=Hello%20TechNKT...`
   ↓
[NO SERVER INVOLVEMENT — NO DATABASE RECORD CREATED — MANUAL CHAT]
```

### 3. Template Pricing Checkout Flow (Detached USD Stripe Flow)
```
Customer
   ↓
[Views /pricing & clicks "Get Access"]
   ↓
PricingCheckout.tsx modal captures name + email
   ↓
`POST /api/checkout` with client-supplied price
   ↓
Stripe Checkout Session created in USD
   ↓
Customer pays on Stripe hosted page
   ↓
Stripe Webhook fires `POST /api/webhooks/stripe`
   ↓
Stripe Webhook verifies signature & updates contact in GoHighLevel
   ↓
[NO LOCAL ORDER RECORD CREATED — NO PRODUCT FULFILLMENT]
```

### 4. Contact & Lead Inquiry Flow
```
Customer submits form on `/contact`
   ↓
Client `POST /api/contact`
   ↓
Serverless function calls GoHighLevel API:
   ├─ Creates/Updates Contact (`/contacts/upsert`)
   ├─ Adds Message (`/conversations/messages`)
   └─ Appends Audit Note (`/contacts/{id}/notes`)
   ↓
Returns `{ success: true }` to browser
```

---

## 22. Backend Readiness Matrix

| Core Feature Area | Current Status | Existing Frontend Code | Missing Backend Architecture | Priority |
|---|---|---|---|---|
| **Database** | NOT CONNECTED | None | PostgreSQL schema, migrations, connection pool | **P0** |
| **Order Creation** | MISSING | None | `orders` & `order_items` tables, order generation API | **P0** |
| **Payment Gateway** | PARTIAL (USD Stripe) | `PricingCheckout.tsx` | Domestic INR Gateway (Razorpay/Cashfree/PhonePe/UPI) | **P0** |
| **Server Price Integrity** | VULNERABLE | `src/data/products.ts` | Server-side price lookups and validation | **P0** |
| **User Authentication** | UI ONLY | `account.astro` | Auth provider, session cookies, password hashing | **P1** |
| **Customer Order History** | MISSING | `account.astro` | Authenticated order history API & dashboard UI | **P1** |
| **Digital Key Fulfillment** | MISSING | None | Key vault table, allocation logic, automated email dispatch | **P1** |
| **Ebook Download Gate** | MISSING | `EbooksShowcase.tsx` | Cloudflare R2 / S3 storage, signed download URLs | **P1** |
| **Admin Dashboard** | MISSING | None | Authenticated admin portal for products, keys, orders | **P1** |
| **Cart Persistence** | CLIENT-ONLY | `CartView.tsx` | User-linked cart synchronization in DB | **P2** |
| **Rate Limiting & Security** | MISSING | None | Upstash Redis rate limiting, Turnstile bot detection | **P1** |
| **Web Dev Inquiry Pipeline** | PARTIAL (GHL) | `web-development.astro` | Lead routing, quotation generation, milestone invoices | **P2** |
| **Review Submission System** | PLACEHOLDER | `reviews.ts` | Verified purchase review submission & moderation table | **P3** |

---

## 23. Recommended Architecture Options

### Option A: Supabase (PostgreSQL + Auth + Storage) + Astro SSR (RECOMMENDED)
* **Architecture**: Astro continues to host the frontend and serverless API endpoints on Vercel. Supabase provides managed PostgreSQL, Supabase Auth (email, OTP, Google OAuth), and Supabase Storage (private bucket for Ebook PDFs).
* **Payment**: Integrate **Razorpay** or **Cashfree** (or Stripe INR) via Astro serverless endpoints (`/api/orders/create`, `/api/orders/verify`).
* **Digital Fulfillment**: A database trigger or webhook assigns credentials/keys from an encrypted `inventory_keys` table and emails the customer via Resend.
* **Pros**: Fastest time to market, native TypeScript client (`@supabase/supabase-js`), built-in Row-Level Security (RLS), minimal DevOps overhead.
* **Cons**: Vendor lock-in to Supabase-specific extensions.

### Option B: Node.js / Express Backend + Standalone PostgreSQL
* **Architecture**: Separate backend repository (e.g., Express/Fastify + Prisma/Drizzle ORM) deployed on Render/Railway. Astro becomes a pure static frontend communicating via REST/GraphQL.
* **Pros**: Complete separation of concerns, framework independence.
* **Cons**: Doubles repository management, requires handling CORS, dual deployments, higher infrastructure costs.

### Option C: Astro Native + Neon PostgreSQL + Clerk Auth + Cloudflare R2
* **Architecture**: Serverless PostgreSQL (Neon) with Drizzle ORM inside Astro API routes, Clerk for authentication, and Cloudflare R2 for secure digital asset storage.
* **Pros**: Best-of-breed developer ergonomics, zero server management.
* **Cons**: Managing three separate third-party vendor consoles and API keys.

### Recommendation: **OPTION A (Supabase + Astro Server Endpoints)**
Option A provides the cleanest, most cohesive architecture for TechNKT. It leverages Astro's existing Vercel deployment while giving TechNKT instant access to relational tables, user auth, row-level security, and private digital asset storage.

---

## 24. Reusable Frontend Components

| Component | File Path | Current Role | Required Backend Integration |
|---|---|---|---|
| `StoreCatalog.tsx` | `src/layouts/components/StoreCatalog.tsx` | Renders product grid, filters, sorting | Swap `PRODUCTS` array for `useQuery('/api/products')` or SSR props |
| `CartView.tsx` | `src/layouts/components/CartView.tsx` | Cart calculation & items list | Connect checkout button to `/api/checkout/initiate` instead of WhatsApp |
| `HeaderAccountCart.tsx` | `src/layouts/components/HeaderAccountCart.tsx` | Navbar cart badge & account link | Add user avatar / login status badge |
| `EbooksShowcase.tsx` | `src/layouts/components/EbooksShowcase.tsx` | 3D Ebook showcases | Connect buy button to order initiation |
| `CustomerReviewsCarousel.tsx` | `src/layouts/components/CustomerReviewsCarousel.tsx` | Reviews carousel | Fetch approved customer reviews from `/api/reviews` |
| `account.astro` | `src/pages/account.astro` | Sign-in UI | Wire form to auth provider and render order history dashboard |

---

## 25. Candidate Database Entities

To support a production-grade digital marketplace, the database should define the following tables:

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      users       │1     *│      orders      │1     *│   order_items    │
│──────────────────│───────│──────────────────│───────│──────────────────│
│ id (UUID, PK)    │       │ id (UUID, PK)    │       │ id (UUID, PK)    │
│ email (unique)   │       │ user_id (FK)     │       │ order_id (FK)    │
│ full_name        │       │ status           │       │ product_id (FK)  │
│ phone            │       │ total_amount     │       │ unit_price       │
│ role (admin/user)│       │ currency         │       │ quantity         │
│ created_at       │       │ payment_id       │       └────────┬─────────┘
└──────────────────┘       │ created_at       │                │
                           └──────────────────┘                │1
                                                               │
┌──────────────────┐       ┌──────────────────┐                │*
│    categories    │1     *│     products     │1               │
│──────────────────│───────│──────────────────│────────────────┘
│ id (slug, PK)    │       │ id (slug, PK)    │
│ name             │       │ category_id (FK) │
│ icon_path        │       │ name             │
│ display_order    │       │ price_inr        │
└──────────────────┘       │ is_active        │
                           └────────┬─────────┘
                                    │1
                                    │*
                           ┌────────┴─────────┐
                           │  digital_assets  │
                           │──────────────────│
                           │ id (UUID, PK)    │
                           │ product_id (FK)  │
                           │ asset_type       │ (credential / license_key / file_path)
                           │ secret_data      │ (encrypted login or key)
                           │ is_allocated     │
                           │ allocated_to (FK)│
                           └──────────────────┘
```

1. **`users`**: Customer accounts, profile data, roles (`customer`, `admin`).
2. **`products`**: Dynamic catalogue replacing hardcoded arrays.
3. **`categories`**: Dynamic product classifications.
4. **`orders`**: Real transactions with statuses: `pending`, `paid`, `fulfilled`, `refunded`, `failed`.
5. **`order_items`**: Line items linked to orders and products with captured purchase-time prices.
6. **`payments`**: Transaction records with gateway payment IDs, signature hashes, and raw webhook payloads.
7. **`digital_assets` / `inventory_keys`**: Encrypted credentials, license keys, or R2 file paths for automated fulfillment.
8. **`reviews`**: Verified buyer reviews linked to `user_id` and `product_id`.
9. **`web_dev_inquiries`**: Lead records from the website development studio.

---

## 26. Missing Requirements and Open Questions

Before engineering the backend, the following business decisions must be established:

1. **Payment Gateway Provider**: Will TechNKT adopt **Razorpay**, **Cashfree**, **PhonePe**, or **Stripe India** for domestic INR payments (UPI, Cards, NetBanking)?
2. **Guest Checkout vs. Mandatory Accounts**: Can users checkout anonymously via email/WhatsApp, or is an account mandatory to view digital credentials?
3. **Credential Fulfillment Method**:
   * Are streaming subscriptions fulfilled by generating custom accounts, allocating pre-created profile PINs, or manual human dispatch?
   * How are replacement warranties handled when a streaming account profile gets wiped?
4. **Ebook Asset Security**: Should ebook PDFs be delivered as single-use signed download links, watermarked with customer emails, or accessible forever from an account dashboard?
5. **WhatsApp Workflow Integration**: Should WhatsApp remain as an automated post-purchase notification channel (via WhatsApp Business API / Twilio), or completely replace online checkouts?
6. **Pricing Model Consolidation**: Which prices are canonical? (e.g. Netflix: ₹139 in `products.ts` vs ₹199 in `ShopByPlan.tsx`).

---

## 27. Recommended Backend Implementation Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Database & Catalogue Unification (P0)                         │
│ • Provision PostgreSQL (Supabase/Neon)                                 │
│ • Migrate static `products.ts` into `products` and `categories` tables │
│ • Create server-side product API with caching                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ↓
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Order Engine & Domestic Payment Integration (P0)              │
│ • Implement `/api/checkout/create-order` with server-side price check  │
│ • Integrate Razorpay/Cashfree/PhonePe UPI & Card checkout              │
│ • Implement verified webhook handler with idempotency logging          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ↓
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: User Authentication & Customer Portal (P1)                    │
│ • Implement Supabase Auth / Clerk with HTTP-only session cookies       │
│ • Transform `account.astro` into an active customer order dashboard   │
│ • Protect account routes via Astro middleware                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ↓
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Automated Digital Fulfillment & Secure Downloads (P1)         │
│ • Encrypted digital key inventory vault                                │
│ • Automated transactional emails via Resend with credentials/keys      │
│ • Private Cloudflare R2 / Supabase Storage bucket for Ebook downloads  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ↓
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: Admin Management Dashboard (P1/P2)                            │
│ • Protected `/admin` routes with role-based access                     │
│ • Live order inspection, credential restocking, revenue reports        │
│ • Product CRUD and price updates without redeploying code              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 28. Verified Source File References

* **`package.json`**: Framework versions, dependencies, build commands (`package.json:1-63`).
* **`astro.config.mjs`**: Adapter configuration, font loaders, image pipeline (`astro.config.mjs:1-82`).
* **`tsconfig.json`**: Path aliases and strict TypeScript rules (`tsconfig.json:1-25`).
* **`src/data/products.ts`**: Static product catalogue and category definitions (`src/data/products.ts:1-238`).
* **`src/layouts/components/StoreCatalog.tsx`**: Product filtering, search, cart dispatcher (`src/layouts/components/StoreCatalog.tsx:1-306`).
* **`src/layouts/components/CartView.tsx`**: LocalStorage cart manager and WhatsApp link (`src/layouts/components/CartView.tsx:1-223`).
* **`src/layouts/components/HeaderAccountCart.tsx`**: Navigation cart count synchronization (`src/layouts/components/HeaderAccountCart.tsx:1-72`).
* **`src/layouts/components/PricingCheckout.tsx`**: Stripe checkout modal trigger (`src/layouts/components/PricingCheckout.tsx:1-149`).
* **`src/layouts/components/ShopByPlan.tsx`**: Duplicated product plan arrays and cart dispatchers (`src/layouts/components/ShopByPlan.tsx:1-588`).
* **`src/layouts/components/EbooksShowcase.tsx`**: 3D book components and separate ebook pricing (`src/layouts/components/EbooksShowcase.tsx:1-490`).
* **`src/pages/api/checkout.ts`**: Stripe session generation and price parameter security flaw (`src/pages/api/checkout.ts:1-133`).
* **`src/pages/api/contact.ts`**: GoHighLevel contact and message forwarding (`src/pages/api/contact.ts:1-188`).
* **`src/pages/api/lead.ts`**: GoHighLevel lead capture endpoint (`src/pages/api/lead.ts:1-117`).
* **`src/pages/api/webhooks/stripe.ts`**: Webhook signature verification and GHL tagging (`src/pages/api/webhooks/stripe.ts:1-79`).
* **`src/pages/account.astro`**: Placeholder sign-in UI with client-side alert (`src/pages/account.astro:1-77`).
* **`src/pages/web-development.astro`**: Studio capabilities and contact CTA routes (`src/pages/web-development.astro:1-206`).
* **`src/content.config.ts`**: Zod schemas for all markdown content collections (`src/content.config.ts:1-634`).

---

## 29. Final Technical Assessment

TechNKT possesses a **world-class, high-converting frontend**. The visual styling, typography, component composition, responsive layouts, and interactive micro-animations are exceptional.

However, from an infrastructure perspective, **the website is currently an ecommerce facade**:
1. It does not have an active database.
2. It does not have customer accounts or authentication.
3. It does not possess a secure, server-validated checkout for its digital catalogue.
4. It does not automate digital deliveries or license distribution.

The frontend is completely ready to receive a backend. By following the phased roadmap outlined in Section 27 and pairing the existing Astro application with a managed relational platform like **Supabase** and a domestic payment processor like **Razorpay**, TechNKT can rapidly transform into an enterprise-grade, fully automated digital commerce business.

---
*Report generated strictly in read-only audit mode. Zero project code or configurations were modified.*
