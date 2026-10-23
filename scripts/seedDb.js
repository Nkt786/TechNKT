import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "technkt.db");
const db = new DatabaseSync(dbPath);

// Enable WAL & Foreign Keys
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    marketing_heading TEXT,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES categories(id),
    image_url TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    badge TEXT,
    instant INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    marketing_title TEXT,
    marketing_category TEXT,
    marketing_description TEXT,
    include_in_marketing INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL,
    duration_value INTEGER NOT NULL DEFAULT 1,
    duration_unit TEXT NOT NULL DEFAULT 'month',
    validity_description TEXT,
    price_amount INTEGER NOT NULL,
    comparison_price_amount INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    warranty_description TEXT,
    delivery_description TEXT,
    activation_description TEXT,
    availability TEXT DEFAULT 'in_stock',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS guest_contacts (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    whatsapp_number TEXT,
    email TEXT,
    telegram_contact TEXT,
    preferred_channel TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    public_order_reference TEXT UNIQUE NOT NULL,
    guest_contact_id TEXT NOT NULL REFERENCES guest_contacts(id),
    delivery_preference TEXT NOT NULL,
    order_source TEXT DEFAULT 'web_store',
    order_status TEXT DEFAULT 'new',
    payment_status TEXT DEFAULT 'unpaid',
    total_amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    admin_notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_variant_id TEXT NOT NULL,
    product_name_snapshot TEXT NOT NULL,
    variant_name_snapshot TEXT NOT NULL,
    unit_price_snapshot INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    line_total INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS marketing_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    header_text TEXT,
    footer_text TEXT,
    formatting_settings TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS import_batches (
    id TEXT PRIMARY KEY,
    submitted_by TEXT,
    original_text TEXT,
    parse_status TEXT,
    review_status TEXT,
    changes_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    committed_at TEXT,
    rolled_back_at TEXT
  );

  CREATE TABLE IF NOT EXISTS import_changes (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    proposed_value TEXT,
    approval_status TEXT DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id TEXT PRIMARY KEY,
    admin_user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    change_summary TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
  CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
  CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(public_order_reference);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`);

// Check if already seeded
const existingCount = db.prepare("SELECT COUNT(*) as count FROM products").get();
if (existingCount && existingCount.count > 0) {
  console.log(`[DB] Database already initialized with ${existingCount.count} products.`);
  process.exit(0);
}

// Categories list
const CATEGORIES = [
  { id: "subscriptions", name: "Subscriptions", icon: "/images/categories/category-subscriptions.svg", heading: "🎬 OTT & Entertainment" },
  { id: "combo-packs", name: "Combo Packs", icon: "/images/categories/category-combo-packs.svg", heading: "🔥 Combo Plans" },
  { id: "software", name: "Software & AI", icon: "/images/categories/category-software.svg", heading: "🤖 AI & Software Tools" },
  { id: "music", name: "Music", icon: "/images/categories/category-music.svg", heading: "🎵 Music & Audio" },
  { id: "ebooks", name: "Ebooks", icon: "/images/categories/category-ebooks.svg", heading: "📚 Ebooks & Digital Blueprints" },
];

const PRODUCTS = [
  {
    id: "combo-2in1",
    name: "2-in-1 Combo",
    category: "combo-packs",
    image: "/images/products/2-in-1-combo.jpg",
    price: 215,
    originalPrice: 299,
    badge: "Most Popular",
    description: "Netflix 4K UHD + Prime Video 4K Duo Pack with dedicated PIN.",
    featured: true,
  },
  {
    id: "prime-4k",
    name: "Prime Video 4K",
    category: "subscriptions",
    image: "/images/products/prime-video.jpg",
    price: 99,
    originalPrice: 199,
    badge: "4K HDR",
    description: "Full Prime Video catalog with 4K UHD ad-free streaming.",
    featured: true,
  },
  {
    id: "hotstar-number",
    name: "Hotstar (On Number)",
    category: "subscriptions",
    image: "/images/products/hotstar.jpg",
    price: 99,
    originalPrice: 199,
    badge: "Direct OTP",
    description: "Direct mobile number activation with live sports & HBO specials.",
    featured: true,
  },
  {
    id: "netflix-4k",
    name: "Netflix Premium 4K",
    category: "subscriptions",
    image: "/images/products/netflix.jpg",
    price: 139,
    originalPrice: 199,
    badge: "Private PIN",
    description: "Dedicated private profile with 4-digit PIN for Netflix 4K UHD.",
    featured: true,
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    category: "subscriptions",
    image: "/images/shop-categories/subscriptions.jpg",
    price: 149,
    originalPrice: 199,
    badge: "Ad-Free",
    description: "Zero ads on all devices, background play, and YouTube Music.",
    featured: false,
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium",
    category: "music",
    image: "/images/shop-categories/music.jpg",
    price: 89,
    originalPrice: 149,
    badge: "Lossless Audio",
    description: "Unlimited skips, offline playlist downloads, and zero audio ads.",
    featured: false,
  },
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    category: "software",
    image: "/images/shop-categories/software.jpg",
    price: 499,
    originalPrice: 1999,
    badge: "GPT-4o Access",
    description: "Priority access to GPT-4o, DALL-E image generation & Code Interpreter.",
    featured: false,
  },
  {
    id: "canva-pro",
    name: "Canva Pro",
    category: "software",
    image: "/images/shop-categories/software.jpg",
    price: 199,
    originalPrice: 499,
    badge: "Full Pro Tools",
    description: "Brand kits, background remover, premium templates & 100M+ assets.",
    featured: false,
  },
  {
    id: "ott-trio",
    name: "Ultimate OTT Trio",
    category: "combo-packs",
    image: "/images/shop-categories/combo-packs.jpg",
    price: 349,
    originalPrice: 599,
    badge: "Mega Saver",
    description: "Netflix 4K UHD Profile + Prime Video 4K + Hotstar Super Pass.",
    featured: false,
  },
  {
    id: "creator-suite",
    name: "Creator Suite Combo",
    category: "combo-packs",
    image: "/images/shop-categories/combo-packs.jpg",
    price: 299,
    originalPrice: 499,
    badge: "Creator Pack",
    description: "Canva Pro + ChatGPT Plus combined for modern designers & creators.",
    featured: false,
  },
  {
    id: "ebook-digital-business",
    name: "Digital Business Blueprint",
    category: "ebooks",
    image: "/images/ebooks/digital-business-blueprint.jpg",
    price: 299,
    originalPrice: 599,
    badge: "Action Guide",
    description: "A complete step-by-step roadmap to building profitable digital storefronts.",
    featured: false,
    period: "one-time",
  },
  {
    id: "ebook-ai-mastery",
    name: "AI & Automation Mastery",
    category: "ebooks",
    image: "/images/ebooks/ai-automation-mastery.jpg",
    price: 349,
    originalPrice: 699,
    badge: "Playbook",
    description: "Production frameworks for automating operations, sales funnels, and workflows.",
    featured: false,
    period: "one-time",
  },
];

console.log("[DB] Seeding categories and products...");
const now = new Date().toISOString();

db.exec("BEGIN IMMEDIATE;");
try {
  const catStmt = db.prepare(`
    INSERT OR IGNORE INTO categories (id, slug, name, icon, marketing_heading, sort_order, status)
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `);

  let cIdx = 0;
  for (const cat of CATEGORIES) {
    catStmt.run(cat.id, cat.id, cat.name, cat.icon, cat.heading, cIdx++);
  }

  const prodStmt = db.prepare(`
    INSERT INTO products (
      id, slug, name, category_id, image_url, short_description, description,
      badge, instant, status, featured, sort_order,
      marketing_title, marketing_category, marketing_description, include_in_marketing,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const varStmt = db.prepare(`
    INSERT INTO product_variants (
      id, product_id, variant_name, duration_value, duration_unit,
      validity_description, price_amount, comparison_price_amount, currency,
      warranty_description, delivery_description, activation_description,
      availability, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let pIdx = 0;
  for (const p of PRODUCTS) {
    let mCat = "General";
    if (p.category === "subscriptions") mCat = "🎬 OTT & Entertainment";
    else if (p.category === "combo-packs") mCat = "🔥 Combo Plans";
    else if (p.category === "software") mCat = "🤖 AI Tools";
    else if (p.category === "music") mCat = "🎵 Music";
    else if (p.category === "ebooks") mCat = "📚 Ebooks";

    prodStmt.run(
      p.id,
      p.id,
      p.name,
      p.category,
      p.image,
      p.description,
      p.description,
      p.badge || null,
      1,
      "active",
      p.featured ? 1 : 0,
      pIdx++,
      p.name,
      mCat,
      p.description,
      1,
      now,
      now
    );

    let vName = "1 Month";
    let dVal = 1;
    let dUnit = "month";
    let validity = "30 Days";
    let warranty = "Replacement Warranty for full validity";
    let delivery = "WhatsApp / Email Delivery";
    let activation = "Instant Auto-Delivery with Private Credentials";

    if (p.period === "one-time") {
      vName = "Lifetime Access";
      dVal = 99;
      dUnit = "year";
      validity = "Lifetime Access & Updates";
      warranty = "Guaranteed Download Links";
      delivery = "Instant PDF Download via Email / WhatsApp";
      activation = "Direct Cloud Link Access";
    } else if (p.id === "netflix-4k") {
      vName = "1 Month (1 Screen)";
      validity = "30 Days Streaming";
      warranty = "30 Days Replacement Warranty";
      activation = "Private Profile with 4-Digit PIN";
    } else if (p.id === "hotstar-number") {
      vName = "1 Month Super";
      activation = "Direct Mobile Number OTP Activation";
    } else if (p.id === "canva-pro") {
      vName = "1 Year Pro";
      dVal = 1;
      dUnit = "year";
      validity = "365 Days";
      activation = "Direct Invite to your registered email";
    }

    varStmt.run(
      `var_${p.id}_1`,
      p.id,
      vName,
      dVal,
      dUnit,
      validity,
      p.price,
      p.originalPrice,
      "INR",
      warranty,
      delivery,
      activation,
      "in_stock",
      now,
      now
    );

    // Additional duration variants for popular subscriptions
    if (p.id === "prime-4k") {
      varStmt.run(
        `var_${p.id}_6m`,
        p.id,
        "6 Months",
        6,
        "month",
        "180 Days Streaming",
        249,
        499,
        "INR",
        "6 Months Replacement Warranty",
        delivery,
        activation,
        "in_stock",
        now,
        now
      );
    } else if (p.id === "netflix-4k") {
      varStmt.run(
        `var_${p.id}_3m`,
        p.id,
        "3 Months (1 Screen)",
        3,
        "month",
        "90 Days Streaming",
        399,
        599,
        "INR",
        "90 Days Replacement Warranty",
        delivery,
        activation,
        "in_stock",
        now,
        now
      );
    }
  }

  db.exec("COMMIT;");
  console.log(`[DB] Successfully seeded ${PRODUCTS.length} products and categories.`);
} catch (err) {
  db.exec("ROLLBACK;");
  console.error("[DB] Seeding failed:", err);
  process.exit(1);
}
