const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const DB_PATH = path.resolve(__dirname, '../data/technkt.db');
const BACKUP_DIR = path.resolve(__dirname, '../data/backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_PATH = path.join(BACKUP_DIR, `technkt_pre_migration_${timestamp}.db`);

console.log('=== STEP 1: CHECKPOINTING WAL DATA ===');
const db = new DatabaseSync(DB_PATH);
const checkpointResult = db.prepare('PRAGMA wal_checkpoint(TRUNCATE);').get();
console.log('WAL Checkpoint Result:', checkpointResult);

console.log('\n=== STEP 2: CREATING CONSISTENT RESTORE BACKUP ===');
fs.copyFileSync(DB_PATH, BACKUP_PATH);
console.log('Backup saved to:', BACKUP_PATH);
const backupDb = new DatabaseSync(BACKUP_PATH);
const integrity = backupDb.prepare('PRAGMA integrity_check;').get();
console.log('Backup Integrity Check:', integrity);

console.log('\n=== STEP 3: AUDITING TABLES AND ROW COUNTS ===');
const tables = backupDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;").all();

const auditReport = [];

for (const t of tables) {
  const countRow = backupDb.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get();
  const cols = backupDb.prepare(`PRAGMA table_info("${t.name}")`).all();
  const fks = backupDb.prepare(`PRAGMA foreign_key_list("${t.name}")`).all();
  auditReport.push({
    table: t.name,
    rowCount: countRow.count,
    columns: cols.map(c => `${c.name} (${c.type}${c.notnull ? ' NOT NULL' : ''}${c.pk ? ' PK' : ''})`),
    foreignKeys: fks.map(f => `${f.from} -> ${f.table}(${f.to})`)
  });
}

console.log(JSON.stringify(auditReport, null, 2));

console.log('\n=== STEP 4: MONETARY VALUE AUDIT (PAISE VS RUPEES) ===');
const products = backupDb.prepare("SELECT id, name FROM products LIMIT 5").all();
console.log('Sample Products:', products);

const variants = backupDb.prepare("SELECT id, product_id, variant_name, price_amount, comparison_price_amount, currency FROM product_variants LIMIT 5").all();
console.log('Sample Variants:', variants);

const offers = backupDb.prepare("SELECT id, supplier_id, product_id, purchase_price_amount, currency FROM supplier_product_offers LIMIT 5").all();
console.log('Sample Supplier Offers:', offers);

const orders = backupDb.prepare("SELECT id, public_order_reference, total_amount, currency, order_status, payment_status FROM orders LIMIT 5").all();
console.log('Sample Orders:', orders);

const procurements = backupDb.prepare("SELECT id, order_id, supplier_id, expected_cost_amount, actual_cost_amount, quantity FROM procurements LIMIT 5").all();
console.log('Sample Procurements:', procurements);

const payments = backupDb.prepare("SELECT id, order_id, amount, payment_status FROM customer_payments LIMIT 5").all();
console.log('Sample Customer Payments:', payments);

console.log('\nAudit complete.');
