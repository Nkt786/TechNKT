import { neon, Pool } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";

// Sanitize connection string for safe diagnostic logging (masks password)
export function sanitizeDatabaseUrl(url?: string): string {
  if (!url) return "NOT_SET";
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = "********";
    }
    return parsed.toString();
  } catch {
    return "INVALID_URL_FORMAT";
  }
}

export function getDatabaseUrl(): string | undefined {
  if (!process.env.DATABASE_URL && typeof process.loadEnvFile === "function") {
    try {
      if (fs.existsSync(".env")) process.loadEnvFile(".env");
    } catch {}
  }
  let url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
  if (url) {
    url = url.trim().replace(/^["']|["']$/g, "");
  }
  return url || undefined;
}

export const isNeonConfigured = Boolean(getDatabaseUrl());

let _neonSql: NeonQueryFunction<false, false> | null = null;
let _neonPool: Pool | null = null;

export function getNeonSql(): NeonQueryFunction<false, false> {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not configured. Please set DATABASE_URL in your .env or Vercel environment variables."
    );
  }
  if (!_neonSql) {
    _neonSql = neon(url);
  }
  return _neonSql;
}

export function getNeonPool(): Pool {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }
  if (!_neonPool) {
    _neonPool = new Pool({ connectionString: url });
  }
  return _neonPool;
}

/**
 * Universal query helper for Neon PostgreSQL.
 * Automatically translates parameter placeholders ($1, $2) and returns rows array.
 */
export async function neonQuery<T = any>(sqlText: string, params: any[] = []): Promise<T[]> {
  const pool = getNeonPool();
  // If params are passed with ? (SQLite style), convert ? to $1, $2, $3 for Postgres
  let pgSql = sqlText;
  if (params.length > 0 && pgSql.includes("?") && !pgSql.includes("$1")) {
    let index = 1;
    pgSql = pgSql.replace(/\?/g, () => `$${index++}`);
  }
  const result = await pool.query(pgSql, params);
  return result.rows as unknown as T[];
}

/**
 * Executes schema initialization on Neon PostgreSQL using schema.sql
 */
export async function initNeonSchema(): Promise<{ success: boolean; error?: string }> {
  const url = getDatabaseUrl();
  if (!url) {
    return { success: false, error: "DATABASE_URL not set" };
  }
  try {
    const schemaPath = path.resolve(process.cwd(), "src/lib/db/schema.sql");
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    const pool = getNeonPool();
    const client = await pool.connect();
    try {
      await client.query(schemaSql);
      return { success: true };
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[Neon] Schema initialization error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Health check for Neon connection
 */
export async function verifyNeonConnection(): Promise<{
  connected: boolean;
  sanitizedUrl: string;
  version?: string;
  error?: string;
}> {
  const url = getDatabaseUrl();
  const sanitized = sanitizeDatabaseUrl(url);

  if (!url) {
    return {
      connected: false,
      sanitizedUrl: sanitized,
      error: "DATABASE_URL environment variable is missing",
    };
  }

  try {
    const sql = getNeonSql();
    const result = await sql`SELECT version(), current_database(), current_user`;
    const versionStr = result[0]?.version || "Connected";
    return {
      connected: true,
      sanitizedUrl: sanitized,
      version: versionStr,
    };
  } catch (err: any) {
    return {
      connected: false,
      sanitizedUrl: sanitized,
      error: err.message,
    };
  }
}
