/**
 * TechNKT — Database Restoration Tool
 * Restores a JSON backup created by backup_database.cjs into a target database.
 *
 * Usage:
 *   node scripts/restore_database.cjs <path_to_backup.json> [TARGET_DB_URL]
 */

const { DatabaseSync } = require('node:sqlite');
const { Pool } = require('@neondatabase/serverless');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const backupFilePath = process.argv[2];
const targetUrl = process.argv[3] || process.env.DATABASE_URL;

if (!backupFilePath || !fs.existsSync(backupFilePath)) {
  console.error('\n[ERROR] Valid backup file path required.');
  console.error('Usage: node scripts/restore_database.cjs <path_to_backup.json> [TARGET_DB_URL]\n');
  process.exit(1);
}

const rawContent = fs.readFileSync(backupFilePath, 'utf8');
const dump = JSON.parse(rawContent);

// Check integrity
const expectedHash = dump.metadata?.sha256;
if (expectedHash) {
  const calcHash = crypto.createHash('sha256').update(rawContent).digest('hex');
  if (calcHash !== expectedHash) {
    console.warn('[WARNING] SHA256 checksum does not match metadata header!');
  } else {
    console.log('[VERIFIED] Backup file checksum verified.');
  }
}

console.log('==========================================================');
console.log(' TechNKT — Database Restoration');
console.log(' Backup Date:', dump.metadata?.timestamp);
console.log(' Source Type:', dump.metadata?.source);
console.log('==========================================================\n');

async function restore() {
  if (targetUrl) {
    console.log('[Target] Neon PostgreSQL');
    const pool = new Pool({ connectionString: targetUrl });
    const client = await pool.connect();
    try {
      const schemaPath = path.resolve(__dirname, '../src/lib/db/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);

      for (const [table, rows] of Object.entries(dump.data)) {
        if (!rows || rows.length === 0) continue;
        const columns = Object.keys(rows[0]);
        const colList = columns.map(c => `"${c}"`).join(', ');

        for (const row of rows) {
          const values = columns.map(c => row[c]);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const pk = columns[0]; // first col is usually id / user_id
          const updateSets = columns.filter(c => c !== pk).map(c => `"${c}" = EXCLUDED."${c}"`).join(', ');
          const conflictClause = updateSets ? `ON CONFLICT ("${pk}") DO UPDATE SET ${updateSets}` : `ON CONFLICT DO NOTHING`;

          await client.query(`
            INSERT INTO "${table}" (${colList})
            VALUES (${placeholders})
            ${conflictClause};
          `, values);
        }
      }
      console.log('[SUCCESS] Restoration into Neon PostgreSQL completed successfully!');
    } finally {
      client.release();
      await pool.end();
    }
  } else {
    console.log('[Target] Local SQLite Test Database (data/technkt_restored_test.db)');
    const testDbPath = path.resolve(__dirname, '../data/technkt_restored_test.db');
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);

    const testDb = new DatabaseSync(testDbPath);
    testDb.exec("PRAGMA journal_mode = WAL;");
    testDb.exec("PRAGMA foreign_keys = OFF;"); // Disabled during initial bulk restore

    // Create schema by reading from src/lib/db/index.ts schema logic or direct tables
    for (const [table, rows] of Object.entries(dump.data)) {
      if (!rows || rows.length === 0) continue;
      const columns = Object.keys(rows[0]);
      const createCols = columns.map(c => `"${c}" TEXT`).join(', ');
      testDb.exec(`CREATE TABLE IF NOT EXISTS "${table}" (${createCols});`);

      const colList = columns.map(c => `"${c}"`).join(', ');
      const placeholders = columns.map(() => '?').join(', ');
      const stmt = testDb.prepare(`INSERT OR REPLACE INTO "${table}" (${colList}) VALUES (${placeholders})`);

      for (const row of rows) {
        stmt.run(...columns.map(c => row[c]));
      }
    }

    testDb.exec("PRAGMA foreign_keys = ON;");
    const integrity = testDb.prepare('PRAGMA integrity_check;').get();
    console.log('Restoration Integrity:', integrity);

    const countCheck = testDb.prepare('SELECT COUNT(*) as count FROM products;').get();
    console.log(`[SUCCESS] Restored ${countCheck.count} products into test database!`);
    console.log('File:', testDbPath);
  }
}

restore().catch(err => {
  console.error('Restoration failed:', err);
  process.exit(1);
});
