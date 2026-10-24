# TechNKT — Digital Products Marketplace & Web Development Studio

[![TechNKT](https://img.shields.io/badge/Brand-TechNKT-2965E8?style=for-the-badge&logo=rocket&logoColor=white)](https://technkt.in)
[![Astro](https://img.shields.io/badge/Astro-7.0-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech)
[![Netlify](https://img.shields.io/badge/Hosted_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com)

**TechNKT** ([https://technkt.in](https://technkt.in/)) is a full-featured digital marketplace and web development platform. Built for speed, dependability, and transparent human-guided transactions, TechNKT combines curated digital product delivery with a specialized modern web studio.

---

## 🚀 Key Brand Offerings

### 1. Digital Marketplace
- **Entertainment & Streaming Passes:** Verified 4K UHD profiles with dedicated PIN access for Netflix, Prime Video, Hotstar, and YouTube Premium.
- **AI Software & Tool Passes:** Developer and creator access passes with guaranteed replacement warranty coverage.
- **Value Combo Packs:** Multi-service bundles with streamlined order management.
- **Guaranteed Warranty:** Full replacement coverage across all active subscription durations with 2–4 hour turnaround.

### 2. Curated Digital Ebooks & Blueprints
- Actionable, practical blueprints covering digital commerce, AI workflows, and online business automation.
- Companion Notion workspaces, cheat sheets, and instant digital downloads.

### 3. Custom Website Development Studio
- **High-Converting Landing Pages:** Sub-second load times optimized for advertising conversion.
- **E-Commerce & Storefronts:** Clean product catalogues, instant search, responsive cart mechanics, and direct checkout.
- **Business Portfolios:** Credible online presence with direct WhatsApp lead capture and schema markup.
- **Custom Web Applications:** Relational database integration, customer portals, and internal administrative tooling.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Astro 7.0.3** | High-performance islands architecture with hybrid static and SSR rendering |
| **UI Components** | **React 19** & **Tailwind CSS 4** | Interactive client islands (`client:load`) styled with Tailwind tokens |
| **Serverless Backend**| **Netlify Functions (v2)** | `@astrojs/netlify` adapter powering serverless dynamic API routes (`/api/*`) |
| **Relational Database**| **Neon Serverless PostgreSQL** | Cloud-native pooled Postgres database (`@neondatabase/serverless`) |
| **Object Storage** | **Neon S3 Object Storage** | High-speed storage (`@aws-sdk/client-s3`) for product catalog imagery |
| **Admin Control Panel**| **Admin Dashboard V2** | Real-time financials, supplier procurement, orders, and customer messaging |
| **Customer Auth** | **Zero-OTP Customer Accounts** | Streamlined authentication using credentials and secure session tokens |
| **Payment Flow** | **Direct Manual Processing** | Transparent order tracking, manual payment verification, and instant status updates |

---

## 📁 Repository Structure

```text
├── src/
│   ├── config/              # Site configuration, theme tokens, menus, and social links
│   ├── content/             # Markdown content collections (about, blog, careers, pricing, etc.)
│   ├── helpers/             # Icon renderers and utility helpers
│   ├── layouts/
│   │   ├── components/      # Reusable Astro & React components (cart, reviews, navbar)
│   │   ├── partials/        # Page partials (Header, Footer, CTA)
│   │   └── Base.astro       # Root HTML document with dynamic SEO and fonts
│   ├── lib/
│   │   ├── db/              # Database schema migrations, queries, and Neon pooled client
│   │   ├── auth.ts          # Admin session verification and rate-limiting
│   │   ├── customerAuth.ts  # Customer session token validation
│   │   └── storage.ts       # S3-compatible asset upload client
│   └── pages/
│       ├── api/             # Dynamic serverless API endpoints (admin, auth, orders, products)
│       ├── index.astro      # Homepage
│       ├── shop.astro       # Product store catalog
│       ├── ebook.astro      # Ebook showcase
│       ├── web-development.astro # Web studio services
│       ├── account.astro    # Customer dashboard and order tracking
│       ├── cart.astro       # Shopping cart
│       └── contact.astro    # Direct contact and consultation inquiries
├── public/                  # Static brand assets, fonts, icons, and product images
├── scripts/                 # Theme generators and Windows build loaders
├── astro.config.mjs         # Astro project configuration with Netlify adapter
└── netlify.toml             # Netlify deployment and build instructions
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js:** v22.x LTS or higher
- **Package Manager:** `pnpm` (recommended), `npm`, or `yarn`

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nkt786/TechNKT.git
   cd TechNKT
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Neon PostgreSQL Connection
   DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require

   # Admin Authentication
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=YOUR_SECURE_ADMIN_PASSWORD

   # Neon S3 Object Storage (Optional for product image uploads)
   NEON_STORAGE_ENDPOINT=https://YOUR_STORAGE_ENDPOINT
   NEON_STORAGE_ACCESS_KEY_ID=YOUR_KEY_ID
   NEON_STORAGE_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
   NEON_STORAGE_BUCKET=technkt-products
   NEON_STORAGE_REGION=ap-southeast-1
   ```

4. **Run the local development server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) to view the site.

5. **Type checking and building:**
   ```bash
   pnpm run check
   pnpm run build
   ```

---

## 🌐 Netlify Deployment

The project is pre-configured for **Netlify Free Hosting** using the official `@astrojs/netlify` adapter.

1. **Build Configuration (`netlify.toml`):**
   - **Build Command:** `pnpm run build`
   - **Publish Directory:** `dist`
   - **Functions:** Bundled into `.netlify/v1/functions/ssr`
2. **Environment Variables:**
   Set `DATABASE_URL`, `ADMIN_PASSWORD`, and storage credentials in your Netlify Site Settings (**Site Configuration** > **Environment Variables**).
3. **Deploy Previews:**
   Pushes to Git branches generate isolated Deploy Previews without altering the live production domain (`technkt.in`).

---

## 📄 License & Attribution

This project is built and maintained by **TechNKT** ([https://technkt.in](https://technkt.in/)).

- The underlying website layout and template scaffolding was originally licensed under the [MIT License](LICENSE) by [Themefisher](https://themefisher.com).
- Original MIT copyright notices and third-party software attribution are preserved in accordance with open-source licensing requirements.
