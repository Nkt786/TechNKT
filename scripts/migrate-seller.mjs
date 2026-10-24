import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { Pool } from "@neondatabase/serverless";

// 1. Migrate local SQLite
try {
  const dbPath = path.resolve("./data/technkt.db");
  if (fs.existsSync(dbPath)) {
    const sqlite = new DatabaseSync(dbPath);
    const prodCols = sqlite.prepare("PRAGMA table_info(products);").all();
    if (!prodCols.some((c) => c.name === "seller_name")) {
      sqlite.exec("ALTER TABLE products ADD COLUMN seller_name TEXT;");
      console.log("Added seller_name to SQLite products table.");
    } else {
      console.log("SQLite products already has seller_name.");
    }

    const itemCols = sqlite.prepare("PRAGMA table_info(order_items);").all();
    if (!itemCols.some((c) => c.name === "seller_name_snapshot")) {
      sqlite.exec("ALTER TABLE order_items ADD COLUMN seller_name_snapshot TEXT;");
      console.log("Added seller_name_snapshot to SQLite order_items table.");
    } else {
      console.log("SQLite order_items already has seller_name_snapshot.");
    }
  }
} catch (err) {
  console.error("SQLite migration error:", err.message);
}

// 2. Migrate Neon PostgreSQL if DATABASE_URL is set
if (typeof process.loadEnvFile === "function" && fs.existsSync(".env")) {
  try { process.loadEnvFile(".env"); } catch {}
}
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const pool = new Pool({ connectionString: dbUrl });
    await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_name VARCHAR(255);");
    await pool.query("ALTER TABLE order_items ADD COLUMN IF NOT EXISTS seller_name_snapshot VARCHAR(255);");
    console.log("Neon PostgreSQL columns verified/added successfully.");
    await pool.end();
  } catch (err) {
    console.error("Neon migration note:", err.message);
  }
}
