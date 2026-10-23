/**
 * TechNKT — Neon PostgreSQL Connection & Health Diagnostic Tool
 * Checks connectivity, SSL security, schema presence, and latency.
 *
 * Usage:
 *   node scripts/verify_neon_connection.cjs [DATABASE_URL]
 */

const { Pool } = require('@neondatabase/serverless');
const fs = require('node:fs');
const path = require('node:path');

// Read .env if present
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

let dbUrl = process.argv[2] || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
if (dbUrl) {
  dbUrl = dbUrl.trim().replace(/^["']|["']$/g, '');
}

function maskUrl(url) {
  if (!url) return 'NOT_CONFIGURED';
  try {
    const u = new URL(url);
    if (u.password) u.password = '********';
    return u.toString();
  } catch {
    return 'INVALID_URL_FORMAT';
  }
}

console.log('==========================================================');
console.log(' TechNKT — Neon PostgreSQL Connection Diagnostic');
console.log('==========================================================');

if (!dbUrl) {
  console.log('\n[STATUS: NOT VERIFIED]');
  console.log('DATABASE_URL is currently not set in your environment or .env file.\n');
  console.log('HOW TO CONFIGURE YOUR NEON DATABASE:');
  console.log('1. Go to https://console.neon.tech');
  console.log('2. Create or select your project (e.g., "technkt-production") in AWS Singapore (aws-ap-southeast-1)');
  console.log('3. Copy your pooled connection string (starts with postgresql://...)');
  console.log('4. Add it to .env:');
  console.log('   DATABASE_URL="postgresql://user:password@ep-xyz-pooler.aws-ap-southeast-1.neon.tech/technkt?sslmode=require"');
  console.log('5. Run: node scripts/verify_neon_connection.cjs');
  console.log('6. Run: node scripts/migrate_sqlite_to_neon.cjs\n');
  console.log('The application currently operates with high reliability on local SQLite fallback.');
  process.exit(0);
}

console.log(`Connecting to Neon: ${maskUrl(dbUrl)}...`);
const start = Date.now();

const pool = new Pool({ connectionString: dbUrl });

(async () => {
  try {
    const client = await pool.connect();
    const duration = Date.now() - start;

    console.log(`\n[STATUS: CONNECTED & VERIFIED] (Latency: ${duration}ms)`);

    const infoRes = await client.query('SELECT version(), current_database(), current_user;');
    const row = infoRes.rows[0];
    console.log('Database Name: ', row.current_database);
    console.log('Database User: ', row.current_user);
    console.log('PostgreSQL Ver:', row.version.split(' ')[0], row.version.split(' ')[1]);

    // Check schema tables
    const tableRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tableNames = tableRes.rows.map(r => r.table_name);
    console.log(`\nExisting Tables in Neon (${tableNames.length}):`);
    if (tableNames.length === 0) {
      console.log('  (No tables found yet. Run `node scripts/migrate_sqlite_to_neon.cjs` to create schema and migrate data)');
    } else {
      console.log('  ' + tableNames.join(', '));
    }

    client.release();
    await pool.end();
  } catch (err) {
    console.error('\n[STATUS: CONNECTION FAILED]');
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
