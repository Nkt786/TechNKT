import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { Pool } from "@neondatabase/serverless";
import { getDatabaseUrl, isNeonConfigured, sanitizeDatabaseUrl } from "./neon";

export interface DatabaseExecutor {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  get<T = any>(sql: string, params?: any[]): Promise<T | null>;
  run(sql: string, params?: any[]): Promise<{ changes: number }>;
}

export class UniversalDatabase implements DatabaseExecutor {
  public isNeon: boolean;
  private sqliteDb: DatabaseSync | null = null;
  private neonPool: Pool | null = null;

  constructor() {
    this.isNeon = isNeonConfigured;
    if (this.isNeon) {
      const url = getDatabaseUrl()!;
      console.log(`[TechNKT Database] Active Driver: NEON POSTGRESQL (${sanitizeDatabaseUrl(url)})`);
      try {
        this.neonPool = new Pool({ connectionString: url });
        this.neonPool.query(`
          ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_name VARCHAR(255);
          ALTER TABLE order_items ADD COLUMN IF NOT EXISTS seller_name_snapshot VARCHAR(255);
        `).catch(() => {});
      } catch (err: any) {
        console.error("[TechNKT Database] Failed to initialize Neon Pool:", err.message);
      }
    } else {
      if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
        throw new Error(
          "[TechNKT Database] FATAL: Production requires Neon PostgreSQL. DATABASE_URL is missing. Local SQLite fallback is disabled in production."
        );
      }
      console.log("[TechNKT Database] Active Driver: LOCAL SQLITE (DATABASE_URL not configured)");
      this.initSqlite();
    }
  }

  public initSqlite() {
    if (this.sqliteDb) return;
    const DATA_DIR = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const DB_PATH = path.join(DATA_DIR, "technkt.db");
    this.sqliteDb = new DatabaseSync(DB_PATH);
    this.sqliteDb.exec("PRAGMA journal_mode = WAL;");
    this.sqliteDb.exec("PRAGMA foreign_keys = ON;");

    try {
      const prodCols = this.sqliteDb.prepare("PRAGMA table_info(products);").all() as any[];
      if (prodCols && prodCols.length > 0 && !prodCols.some((c: any) => c.name === "seller_name")) {
        this.sqliteDb.exec("ALTER TABLE products ADD COLUMN seller_name TEXT;");
      }
      const itemCols = this.sqliteDb.prepare("PRAGMA table_info(order_items);").all() as any[];
      if (itemCols && itemCols.length > 0 && !itemCols.some((c: any) => c.name === "seller_name_snapshot")) {
        this.sqliteDb.exec("ALTER TABLE order_items ADD COLUMN seller_name_snapshot TEXT;");
      }
    } catch {}
  }

  /**
   * Universal parameterized query helper.
   * Works on Neon PostgreSQL (translating ? to $1, $2, ...) and on local SQLite in development.
   */
  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.isNeon) {
      if (!this.neonPool) {
        throw new Error("[TechNKT Database] Neon PostgreSQL pool is not connected.");
      }
      let index = 1;
      const pgSql = sql.replace(/\?/g, () => `$${index++}`);
      const res = await this.neonPool.query(pgSql, params);
      return res.rows as unknown as T[];
    }

    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      throw new Error("[TechNKT Database] Production requires Neon PostgreSQL. SQLite fallback disabled.");
    }

    if (!this.sqliteDb) this.initSqlite();
    const stmt = this.sqliteDb!.prepare(sql);
    return stmt.all(...params) as unknown as T[];
  }

  /**
   * Single row fetcher
   */
  public async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Universal mutation helper (INSERT, UPDATE, DELETE)
   */
  public async run(sql: string, params: any[] = []): Promise<{ changes: number }> {
    if (this.isNeon) {
      if (!this.neonPool) {
        throw new Error("[TechNKT Database] Neon PostgreSQL pool is not connected.");
      }
      let index = 1;
      const pgSql = sql.replace(/\?/g, () => `$${index++}`);
      const res = await this.neonPool.query(pgSql, params);
      return { changes: res.rowCount ?? 0 };
    }

    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      throw new Error("[TechNKT Database] Production requires Neon PostgreSQL. SQLite fallback disabled.");
    }

    if (!this.sqliteDb) this.initSqlite();
    const stmt = this.sqliteDb!.prepare(sql);
    const res = stmt.run(...params);
    return { changes: Number(res.changes) };
  }

  /**
   * Atomic database transaction helper across Neon PostgreSQL & SQLite
   */
  public async transaction<T>(fn: (tx: DatabaseExecutor) => Promise<T>): Promise<T> {
    if (this.isNeon) {
      if (!this.neonPool) {
        throw new Error("[TechNKT Database] Neon PostgreSQL pool is not connected.");
      }
      const client = await this.neonPool.connect();
      try {
        await client.query("BEGIN;");
        const tx: DatabaseExecutor = {
          query: async <R = any>(sql: string, params: any[] = []): Promise<R[]> => {
            let index = 1;
            const pgSql = sql.replace(/\?/g, () => `$${index++}`);
            const res = await client.query(pgSql, params);
            return res.rows as unknown as R[];
          },
          get: async <R = any>(sql: string, params: any[] = []): Promise<R | null> => {
            const rows = await tx.query<R>(sql, params);
            return rows.length > 0 ? rows[0] : null;
          },
          run: async (sql: string, params: any[] = []): Promise<{ changes: number }> => {
            let index = 1;
            const pgSql = sql.replace(/\?/g, () => `$${index++}`);
            const res = await client.query(pgSql, params);
            return { changes: res.rowCount ?? 0 };
          },
        };
        const result = await fn(tx);
        await client.query("COMMIT;");
        return result;
      } catch (err) {
        try {
          await client.query("ROLLBACK;");
        } catch {}
        throw err;
      } finally {
        client.release();
      }
    }

    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      throw new Error("[TechNKT Database] Production requires Neon PostgreSQL. SQLite fallback disabled.");
    }

    if (!this.sqliteDb) this.initSqlite();
    this.sqliteDb!.exec("BEGIN IMMEDIATE;");
    try {
      const tx: DatabaseExecutor = {
        query: async <R = any>(sql: string, params: any[] = []): Promise<R[]> => {
          return this.sqliteDb!.prepare(sql).all(...params) as unknown as R[];
        },
        get: async <R = any>(sql: string, params: any[] = []): Promise<R | null> => {
          return (this.sqliteDb!.prepare(sql).get(...params) as unknown as R) || null;
        },
        run: async (sql: string, params: any[] = []): Promise<{ changes: number }> => {
          const res = this.sqliteDb!.prepare(sql).run(...params);
          return { changes: Number(res.changes) };
        },
      };
      const result = await fn(tx);
      this.sqliteDb!.exec("COMMIT;");
      return result;
    } catch (err) {
      try {
        this.sqliteDb!.exec("ROLLBACK;");
      } catch {}
      throw err;
    }
  }

  /**
   * Deprecated sync prepare() - throws when Neon is active
   */
  public prepare(sql: string) {
    if (this.isNeon) {
      throw new Error(
        `[TechNKT Database] Synchronous prepare() is unsupported on Neon PostgreSQL. Use async db.query(), db.get(), db.run(), or db.transaction(). Query: "${sql.substring(0, 60)}..."`
      );
    }
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      throw new Error("[TechNKT Database] Production requires Neon PostgreSQL. SQLite fallback disabled.");
    }
    if (!this.sqliteDb) this.initSqlite();
    return this.sqliteDb!.prepare(sql);
  }

  public exec(sql: string) {
    if (this.isNeon) {
      throw new Error(
        `[TechNKT Database] Synchronous exec() is unsupported on Neon PostgreSQL. Use async db.run() or db.transaction(). Query: "${sql.substring(0, 60)}..."`
      );
    }
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      throw new Error("[TechNKT Database] Production requires Neon PostgreSQL. SQLite fallback disabled.");
    }
    if (!this.sqliteDb) this.initSqlite();
    this.sqliteDb!.exec(sql);
  }
}

export const db = new UniversalDatabase();
