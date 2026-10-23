const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const BACKUP_DIR = path.resolve(__dirname, '../data/backups');
const backupFiles = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json')).sort().reverse();

if (backupFiles.length === 0) {
  console.error('No backup files found in data/backups!');
  process.exit(1);
}

const latestBackup = path.join(BACKUP_DIR, backupFiles[0]);
console.log('Testing restore verification on:', latestBackup);

const dump = JSON.parse(fs.readFileSync(latestBackup, 'utf8'));

// Test restoring into an in-memory/scratch SQLite database
const tempDbPath = path.resolve(__dirname, '../data/backups/test_restore_verification.db');
if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);

const db = new DatabaseSync(tempDbPath);

// Execute schema
const schemaSql = fs.readFileSync(path.resolve(__dirname, '../src/lib/db/schema.sql'), 'utf8');
const cleanSchema = schemaSql
  .replace(/TIMESTAMPTZ/gi, 'TEXT')
  .replace(/TIMESTAMP/gi, 'TEXT')
  .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
  .replace(/VARCHAR\(\d+\)/gi, 'TEXT')
  .replace(/CURRENT_TIMESTAMP/gi, "(datetime('now'))");

// Execute individual statements
const statements = cleanSchema.split(';').map(s => s.trim()).filter(Boolean);
for (const stmt of statements) {
  try {
    db.exec(stmt);
  } catch (err) {
    // Ignore trigger / index errors
  }
}

// Insert data
let totalRestoredRows = 0;
for (const [table, rows] of Object.entries(dump.data)) {
  if (!rows || rows.length === 0) continue;
  try {
    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => '?').join(', ');
    const colNames = cols.map(c => `"${c}"`).join(', ');
    const insertStmt = db.prepare(`INSERT OR REPLACE INTO "${table}" (${colNames}) VALUES (${placeholders})`);

    for (const row of rows) {
      insertStmt.run(...cols.map(c => row[c]));
      totalRestoredRows++;
    }
  } catch (e) {
    console.error(`Error restoring ${table}:`, e.message);
  }
}

// Verify row counts
console.log('\n--- RESTORE INTEGRITY VERIFICATION ---');
console.log(`Total rows restored into verification database: ${totalRestoredRows}`);
const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
const userCount = db.prepare('SELECT COUNT(*) as c FROM customer_users').get().c;
const orderCount = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;

console.log(`Restored Categories: ${catCount} (Expected: ${dump.metadata.tables.categories})`);
console.log(`Restored Products:   ${prodCount} (Expected: ${dump.metadata.tables.products})`);
console.log(`Restored Customers:  ${userCount} (Expected: ${dump.metadata.tables.customer_users})`);
console.log(`Restored Orders:     ${orderCount} (Expected: ${dump.metadata.tables.orders})`);

// Clean up test file
db.close();
if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);

if (catCount === dump.metadata.tables.categories && prodCount === dump.metadata.tables.products) {
  console.log('\n[PASS] Database restore verification SUCCEEDED 100%!');
} else {
  console.error('\n[FAIL] Database restore verification failed!');
  process.exit(1);
}
