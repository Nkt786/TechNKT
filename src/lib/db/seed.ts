import { db } from "./index";
import { PRODUCT_CATEGORIES, PRODUCTS } from "../../data/products";

export function seedInitialData() {
  const existingCountRow = db.prepare(`SELECT COUNT(*) as count FROM products`).get() as { count: number };
  if (existingCountRow && existingCountRow.count > 0) {
    console.log(`[DB SEED] Database already seeded with ${existingCountRow.count} products.`);
    return;
  }

  console.log("[DB SEED] Seeding initial categories and products...");
  const now = new Date().toISOString();

  db.exec("BEGIN IMMEDIATE;");
  try {
    // 1. Seed categories
    const catStmt = db.prepare(`
      INSERT OR IGNORE INTO categories (id, slug, name, icon, marketing_heading, sort_order, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `);

    let order = 0;
    for (const cat of PRODUCT_CATEGORIES) {
      if (cat.id === "all") continue;
      let marketingHeading = cat.name;
      if (cat.id === "subscriptions") marketingHeading = "🎬 OTT & Entertainment";
      if (cat.id === "combo-packs") marketingHeading = "🔥 Combo Plans";
      if (cat.id === "software") marketingHeading = "🤖 AI & Software Tools";
      if (cat.id === "music") marketingHeading = "🎵 Music & Audio";
      if (cat.id === "ebooks") marketingHeading = "📚 Ebooks & Digital Blueprints";

      catStmt.run(cat.id, cat.id, cat.name, cat.icon, marketingHeading, order++);
    }

    // 2. Seed products
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
      const pId = p.id;
      let mCategory = "General";
      if (p.category === "subscriptions") mCategory = "🎬 OTT & Entertainment";
      else if (p.category === "combo-packs") mCategory = "🔥 Combo Plans";
      else if (p.category === "software") mCategory = "🤖 AI Tools";
      else if (p.category === "music") mCategory = "🎵 Music";
      else if (p.category === "ebooks") mCategory = "📚 Ebooks";

      prodStmt.run(
        pId,
        p.id,
        p.name,
        p.category,
        p.image,
        p.description,
        p.description,
        p.badge || null,
        p.instant ? 1 : 0,
        "active",
        p.featured ? 1 : 0,
        pIdx++,
        p.name,
        mCategory,
        p.description,
        1,
        now,
        now
      );

      // Default Variant 1
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
        `var_${pId}_1`,
        pId,
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

      // Add a second duration variant for popular subscriptions
      if (p.id === "prime-4k") {
        varStmt.run(
          `var_${pId}_6m`,
          pId,
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
          `var_${pId}_3m`,
          pId,
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
    console.log("[DB SEED] Successfully seeded 12 products with variants!");
  } catch (err) {
    db.exec("ROLLBACK;");
    console.error("[DB SEED] Failed to seed database:", err);
    throw err;
  }
}

// Self-run when executed directly via Node
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  seedInitialData();
}
