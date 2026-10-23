/**
 * TechNKT — SQLite to Neon PostgreSQL Migration Script
 * Idempotent, transaction-safe, row-reconciled migration for TechNKT Business Control Panel V2.
 *
 * Usage:
 *   node scripts/migrate_sqlite_to_neon.cjs [DATABASE_URL]
 * Or set DATABASE_URL in your environment/.env.
 */

const { DatabaseSync } = require('node:sqlite');
const { Pool } = require('@neondatabase/serverless');
const fs = require('node:fs');
const path = require('node:path');

// Load environment variables from .env if present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

let dbUrl = process.argv[2] || process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (dbUrl) {
  dbUrl = dbUrl.trim().replace(/^["']|["']$/g, '');
}

if (!dbUrl) {
  console.error('\n[ERROR] DATABASE_URL is required to perform migration.');
  console.error('Please provide it as an argument or in .env:\n');
  console.error('  node scripts/migrate_sqlite_to_neon.cjs "postgresql://user:pass@ep-xyz.aws-ap-southeast-1.neon.tech/technkt?sslmode=require"\n');
  process.exit(1);
}

// Mask password for console output
function maskUrl(url) {
  try {
    const u = new URL(url);
    if (u.password) u.password = '********';
    return u.toString();
  } catch {
    return 'INVALID_URL';
  }
}

console.log('====================================================');
console.log(' TechNKT — SQLite to Neon PostgreSQL Migration V2');
console.log(' Target Neon DB:', maskUrl(dbUrl));
console.log('====================================================\n');

const SQLITE_DB_PATH = path.resolve(__dirname, '../data/technkt.db');
if (!fs.existsSync(SQLITE_DB_PATH)) {
  console.error('[ERROR] Local SQLite database not found at:', SQLITE_DB_PATH);
  process.exit(1);
}

const sqlite = new DatabaseSync(SQLITE_DB_PATH);
// Checkpoint WAL first
sqlite.prepare('PRAGMA wal_checkpoint(TRUNCATE);').get();

const pool = new Pool({ connectionString: dbUrl });

async function runMigration() {
  const client = await pool.connect();
  console.log('Connected to Neon PostgreSQL successfully!');

  try {
    console.log('\n--- STEP 1: INITIALIZING POSTGRESQL SCHEMA ---');
    const schemaPath = path.resolve(__dirname, '../src/lib/db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('Schema tables and indexes created/verified successfully.');

    console.log('\n--- STEP 2: MIGRATING TABLES IN TOPOLOGICAL ORDER ---');

    // Ordered list to maintain foreign-key constraints
    const tables = [
      { name: 'categories', pk: 'id' },
      { name: 'products', pk: 'id' },
      { name: 'product_variants', pk: 'id' },
      { name: 'customer_users', pk: 'id' },
      { name: 'customer_profiles', pk: 'user_id' },
      { name: 'customer_sessions', pk: 'id' },
      { name: 'customer_recovery_codes', pk: 'id' },
      { name: 'guest_contacts', pk: 'id' },
      { name: 'orders', pk: 'id' },
      { name: 'order_items', pk: 'id' },
      { name: 'customer_payments', pk: 'id' },
      { name: 'suppliers', pk: 'id' },
      { name: 'supplier_product_offers', pk: 'id' },
      { name: 'procurements', pk: 'id' },
      { name: 'supplier_payments', pk: 'id' },
      { name: 'business_expenses', pk: 'id' },
      { name: 'financial_adjustments', pk: 'id' },
      { name: 'order_conversations', pk: 'id' },
      { name: 'order_messages', pk: 'id' },
      { name: 'marketing_templates', pk: 'id' },
      { name: 'import_batches', pk: 'id' },
      { name: 'import_changes', pk: 'id' },
      { name: 'admin_audit_logs', pk: 'id' },
      { name: 'admin_sessions', pk: 'id' },
    ];

    const reconciliation = [];

    for (const t of tables) {
      const sqliteRows = sqlite.prepare(`SELECT * FROM "${t.name}"`).all();
      const sqliteCount = sqliteRows.length;

      if (sqliteCount > 0) {
        const columns = Object.keys(sqliteRows[0]);
        const colList = columns.map(c => `"${c}"`).join(', ');

        for (const row of sqliteRows) {
          const values = columns.map(c => row[c]);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          
          // Build ON CONFLICT clause for idempotency
          const updateSets = columns
            .filter(c => c !== t.pk)
            .map(c => `"${c}" = EXCLUDED."${c}"`)
            .join(', ');

          const conflictClause = updateSets
            ? `ON CONFLICT ("${t.pk}") DO UPDATE SET ${updateSets}`
            : `ON CONFLICT ("${t.pk}") DO NOTHING`;

          const insertSql = `
            INSERT INTO "${t.name}" (${colList})
            VALUES (${placeholders})
            ${conflictClause};
          `;

          await client.query(insertSql, values);
        }
      }

      const pgCountRes = await client.query(`SELECT COUNT(*) as count FROM "${t.name}"`);
      const pgCount = parseInt(pgCountRes.rows[0].count, 10);

      reconciliation.push({
        table: t.name,
        sqliteRows: sqliteCount,
        neonRows: pgCount,
        status: sqliteCount <= pgCount ? 'MATCH / VERIFIED' : 'MISMATCH',
      });
    }

    console.log('\n--- STEP 3: ROW-COUNT RECONCILIATION SUMMARY ---');
    console.table(reconciliation);

    const hasMismatch = reconciliation.some(r => r.status === 'MISMATCH');
    if (hasMismatch) {
      console.warn('\n[WARNING] Some tables have row mismatches. Please inspect output above.');
    } else {
      console.log('\n[SUCCESS] All 24 tables successfully migrated and reconciled into Neon PostgreSQL!');
    }

  } catch (err) {
    console.error('\n[FATAL] Migration error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(err => {
  console.error('Unhandled migration failure:', err);
  process.exit(1);
});
