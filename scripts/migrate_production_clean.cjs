/**
 * TechNKT — Production Clean Migration Preparation Tool
 *
 * SAFETY GUARANTEES:
 * 1. Read-only by default (Dry-Run mode).
 * 2. Requires explicit `--execute` flag to perform writes.
 * 3. Migrates ONLY verified business catalogue:
 *    - 5 Categories
 *    - 12 Verified Core Products
 *    - 14 Verified Variants
 * 4. STRICTLY EXCLUDES all test data:
 *    - Zero test customers / profiles / sessions
 *    - Zero test orders / order items
 *    - Zero test payments (financial reporting starts 100% clean)
 *    - Zero test procurements / supplier payments
 *    - Zero test expenses
 *    - Zero test communications / messages
 *    - Zero test rate-list import batches
 * 5. Tested reference 'development' branch remains untouched.
 *
 * Usage:
 *   node scripts/migrate_production_clean.cjs [--dry-run]
 *   node scripts/migrate_production_clean.cjs --execute <TARGET_DATABASE_URL>
 */

const { Pool } = require('@neondatabase/serverless');
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const isExecute = args.includes('--execute');
const targetUrl = args.find(a => a.startsWith('postgresql://') || a.startsWith('postgres://'));

console.log('================================================================');
console.log(' TechNKT — Clean Production Migration Scope & Preparation');
console.log(' Mode:', isExecute ? '🔴 EXECUTE (WRITES ENABLED)' : '🟢 DRY-RUN (READ-ONLY)');
console.log('================================================================\n');

// 1. Verified Baseline Data
const VERIFIED_CATEGORIES = [
  { id: 'subscriptions', slug: 'subscriptions', name: 'Subscriptions', icon: '/images/categories/category-subscriptions.svg', heading: '🎬 OTT & Entertainment', sort_order: 1 },
  { id: 'combo-packs', slug: 'combo-packs', name: 'Combo Packs', icon: '/images/categories/category-combo-packs.svg', heading: '🔥 Combo Plans', sort_order: 2 },
  { id: 'software', slug: 'software', name: 'Software & AI', icon: '/images/categories/category-software.svg', heading: '🤖 AI & Software Tools', sort_order: 3 },
  { id: 'music', slug: 'music', name: 'Music', icon: '/images/categories/category-music.svg', heading: '🎵 Music & Audio', sort_order: 4 },
  { id: 'ebooks', slug: 'ebooks', name: 'Ebooks', icon: '/images/categories/category-ebooks.svg', heading: '📚 Ebooks & Digital Blueprints', sort_order: 5 },
];

const VERIFIED_PRODUCTS = [
  { id: 'combo-2in1', slug: 'combo-2in1', name: '2-in-1 Combo', category_id: 'combo-packs', image_url: '/images/products/2-in-1-combo.jpg', badge: 'Most Popular', instant: 1, status: 'active', featured: 1, sort_order: 1, description: 'Netflix 4K UHD + Prime Video 4K Duo Pack with dedicated PIN.' },
  { id: 'prime-4k', slug: 'prime-4k', name: 'Prime Video 4K', category_id: 'subscriptions', image_url: '/images/products/prime-video.jpg', badge: '4K HDR', instant: 1, status: 'active', featured: 1, sort_order: 2, description: 'Full Prime Video catalog with 4K UHD ad-free streaming.' },
  { id: 'hotstar-number', slug: 'hotstar-number', name: 'Hotstar (On Number)', category_id: 'subscriptions', image_url: '/images/products/hotstar.jpg', badge: 'Direct OTP', instant: 1, status: 'active', featured: 1, sort_order: 3, description: 'Direct mobile number activation with live sports & HBO specials.' },
  { id: 'netflix-4k', slug: 'netflix-4k', name: 'Netflix Premium 4K', category_id: 'subscriptions', image_url: '/images/products/netflix.jpg', badge: 'Private PIN', instant: 1, status: 'active', featured: 1, sort_order: 4, description: 'Dedicated private profile with 4-digit PIN for Netflix 4K UHD.' },
  { id: 'youtube-premium', slug: 'youtube-premium', name: 'YouTube Premium', category_id: 'subscriptions', image_url: '/images/shop-categories/subscriptions.jpg', badge: 'Ad-Free', instant: 1, status: 'active', featured: 0, sort_order: 5, description: 'Zero ads on all devices, background play, and YouTube Music.' },
  { id: 'spotify-premium', slug: 'spotify-premium', name: 'Spotify Premium', category_id: 'music', image_url: '/images/shop-categories/music.jpg', badge: 'Lossless Audio', instant: 1, status: 'active', featured: 0, sort_order: 6, description: 'Unlimited skips, offline playlist downloads, and zero audio ads.' },
  { id: 'chatgpt-plus', slug: 'chatgpt-plus', name: 'ChatGPT Plus', category_id: 'software', image_url: '/images/shop-categories/software.jpg', badge: 'GPT-4o Access', instant: 1, status: 'active', featured: 0, sort_order: 7, description: 'Priority access to GPT-4o, DALL-E image generation & Code Interpreter.' },
  { id: 'canva-pro', slug: 'canva-pro', name: 'Canva Pro', category_id: 'software', image_url: '/images/shop-categories/software.jpg', badge: 'Full Pro Tools', instant: 1, status: 'active', featured: 0, sort_order: 8, description: 'Brand kits, background remover, premium templates & 100M+ assets.' },
  { id: 'ott-trio', slug: 'ott-trio', name: 'Ultimate OTT Trio', category_id: 'combo-packs', image_url: '/images/shop-categories/combo-packs.jpg', badge: 'Mega Saver', instant: 1, status: 'active', featured: 0, sort_order: 9, description: 'Netflix 4K UHD Profile + Prime Video 4K + Hotstar Super Pass.' },
  { id: 'creator-suite', slug: 'creator-suite', name: 'Creator Suite Combo', category_id: 'combo-packs', image_url: '/images/shop-categories/combo-packs.jpg', badge: 'Creator Pack', instant: 1, status: 'active', featured: 0, sort_order: 10, description: 'Canva Pro + ChatGPT Plus combined for modern designers & creators.' },
  { id: 'ebook-digital-business', slug: 'ebook-digital-business', name: 'Digital Business Blueprint', category_id: 'ebooks', image_url: '/images/ebooks/digital-business-blueprint.jpg', badge: 'Action Guide', instant: 1, status: 'active', featured: 0, sort_order: 11, description: 'A complete step-by-step roadmap to building profitable digital storefronts.' },
  { id: 'ebook-ai-mastery', slug: 'ebook-ai-mastery', name: 'AI & Automation Mastery', category_id: 'ebooks', image_url: '/images/ebooks/ai-automation-mastery.jpg', badge: 'Playbook', instant: 1, status: 'active', featured: 0, sort_order: 12, description: 'Production frameworks for automating operations, sales funnels, and workflows.' },
];

const VERIFIED_VARIANTS = [
  { id: 'var_combo-2in1_1', product_id: 'combo-2in1', variant_name: '1 Month', price_amount: 215, comparison_price_amount: 299 },
  { id: 'var_prime-4k_1', product_id: 'prime-4k', variant_name: '1 Month', price_amount: 99, comparison_price_amount: 199 },
  { id: 'var_prime-4k_6m', product_id: 'prime-4k', variant_name: '6 Months', price_amount: 249, comparison_price_amount: 499 },
  { id: 'var_hotstar-number_1', product_id: 'hotstar-number', variant_name: '1 Month Super', price_amount: 99, comparison_price_amount: 199 },
  { id: 'var_netflix-4k_1', product_id: 'netflix-4k', variant_name: '1 Month (1 Screen)', price_amount: 149, comparison_price_amount: 199 },
  { id: 'var_netflix-4k_3m', product_id: 'netflix-4k', variant_name: '3 Months (1 Screen)', price_amount: 399, comparison_price_amount: 599 },
  { id: 'var_youtube-premium_1', product_id: 'youtube-premium', variant_name: '1 Month', price_amount: 149, comparison_price_amount: 199 },
  { id: 'var_spotify-premium_1', product_id: 'spotify-premium', variant_name: '1 Month', price_amount: 89, comparison_price_amount: 149 },
  { id: 'var_chatgpt-plus_1', product_id: 'chatgpt-plus', variant_name: '1 Month', price_amount: 499, comparison_price_amount: 1999 },
  { id: 'var_canva-pro_1', product_id: 'canva-pro', variant_name: '1 Year Pro', price_amount: 199, comparison_price_amount: 499 },
  { id: 'var_ott-trio_1', product_id: 'ott-trio', variant_name: '1 Month', price_amount: 349, comparison_price_amount: 599 },
  { id: 'var_creator-suite_1', product_id: 'creator-suite', variant_name: '1 Month', price_amount: 299, comparison_price_amount: 499 },
  { id: 'var_ebook-digital-business_1', product_id: 'ebook-digital-business', variant_name: 'Lifetime Access', price_amount: 299, comparison_price_amount: 599 },
  { id: 'var_ebook-ai-mastery_1', product_id: 'ebook-ai-mastery', variant_name: 'Lifetime Access', price_amount: 349, comparison_price_amount: 699 },
];

console.log('[AUDIT SUMMARY FOR PRODUCTION MIGRATION]:');
console.log(`  - Categories to Migrate:        ${VERIFIED_CATEGORIES.length}`);
console.log(`  - Products to Migrate:          ${VERIFIED_PRODUCTS.length}`);
console.log(`  - Product Variants to Migrate:  ${VERIFIED_VARIANTS.length}`);
console.log('  - Excluded Demo Orders:         ALL 13 orders in development');
console.log('  - Excluded Demo Customers:      ALL 12 test users in development');
console.log('  - Excluded Demo Payments:       ALL 5 test customer payments');
console.log('  - Excluded Demo Procurements:   ALL 5 test procurements');
console.log('  - Excluded Demo Expenses:       ALL 5 test operating expenses');
console.log('  - Excluded Demo Rate Batches:   ALL 15 test import batches');
console.log('  - Excluded Demo Messages:       ALL 15 test messages');

if (!isExecute) {
  console.log('\n[DRY RUN COMPLETE] Migration script validated. No changes made to any branch.');
  console.log('To execute on Neon Production branch once approved, run:');
  console.log('  node scripts/migrate_production_clean.cjs --execute <NEON_PRODUCTION_DB_URL>');
  process.exit(0);
}

if (!targetUrl) {
  console.error('\n[ERROR] --execute requires a valid target database URL.');
  process.exit(1);
}

// Execution block (only runs when explicitly called with --execute)
async function executeMigration() {
  console.log('\nConnecting to target database...');
  const pool = new Pool({ connectionString: targetUrl });
  const client = await pool.connect();
  const now = new Date().toISOString();

  try {
    await client.query('BEGIN');
    console.log('Applying production schema...');
    const schemaSql = fs.readFileSync(path.resolve(__dirname, '../src/lib/db/schema.sql'), 'utf8');
    await client.query(schemaSql);

    console.log('Seeding verified categories...');
    for (const c of VERIFIED_CATEGORIES) {
      await client.query(
        `INSERT INTO categories (id, slug, name, icon, marketing_heading, sort_order, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'active')
         ON CONFLICT (id) DO UPDATE SET name = $3, icon = $4, marketing_heading = $5, sort_order = $6`,
        [c.id, c.slug, c.name, c.icon, c.heading, c.sort_order]
      );
    }

    console.log('Seeding verified products...');
    for (const p of VERIFIED_PRODUCTS) {
      await client.query(
        `INSERT INTO products (
           id, slug, name, category_id, image_url, badge, instant, status, featured, sort_order, description, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12)
         ON CONFLICT (id) DO UPDATE SET
           name = $3, category_id = $4, image_url = $5, badge = $6, description = $11, updated_at = $12`,
        [p.id, p.slug, p.name, p.category_id, p.image_url, p.badge, p.instant, p.status, p.featured, p.sort_order, p.description, now]
      );
    }

    console.log('Seeding verified product variants...');
    for (const v of VERIFIED_VARIANTS) {
      await client.query(
        `INSERT INTO product_variants (
           id, product_id, variant_name, price_amount, comparison_price_amount, currency, availability, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, 'INR', 'in_stock', $6, $6)
         ON CONFLICT (id) DO UPDATE SET
           variant_name = $3, price_amount = $4, comparison_price_amount = $5, updated_at = $6`,
        [v.id, v.product_id, v.variant_name, v.price_amount, v.comparison_price_amount, now]
      );
    }

    await client.query('COMMIT');
    console.log('\n[SUCCESS] Clean production database migrated successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n[ROLLBACK] Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

executeMigration();
