import crypto from "node:crypto";
import {
  findCustomerByUsername,
  findCustomerById,
  createCustomerUser,
  createCustomerSession,
  validateCustomerSession,
  deleteCustomerSession,
  saveCustomerRecoveryCodes,
  verifyAndConsumeRecoveryCode,
  updateCustomerPassword,
  type CustomerUserRecord,
  type CustomerProfileRecord,
} from "./db/queries";

export const CUSTOMER_COOKIE_NAME = "technkt_customer_session";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

// In-memory rate limiting per IP for customer auth endpoints
const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 mins

export function checkCustomerRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) return { allowed: true, remaining: MAX_ATTEMPTS };

  if (now - entry.firstAttempt > WINDOW_MS) {
    rateLimitMap.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

export function recordCustomerAttempt(ip: string, success: boolean) {
  const now = Date.now();
  if (success) {
    rateLimitMap.delete(ip);
    return;
  }
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

// ──────────────────────────────────────────
// PASSWORD HASHING (scrypt - Slow & Memory-Hard)
// ──────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
  });
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64, {
      N: 16384,
      r: 8,
      p: 1,
    });
    const keyBuffer = Buffer.from(key, "hex");
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────
// RECOVERY CODES GENERATION & VERIFICATION
// ──────────────────────────────────────────

export function generateRecoveryCodes(count: number = 6): string[] {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude easily confused chars
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    let code = "";
    const bytes = crypto.randomBytes(8);
    for (let b = 0; b < 8; b++) {
      code += chars[bytes[b] % chars.length];
      if (b === 3) code += "-";
    }
    codes.push(code);
  }
  return codes;
}

export function hashRecoveryCode(code: string): string {
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export function verifyRecoveryCodeHash(candidate: string, storedHash: string): boolean {
  const candidateHash = hashRecoveryCode(candidate);
  return candidateHash === storedHash;
}

// ──────────────────────────────────────────
// SESSION COOKIE HELPERS
// ──────────────────────────────────────────

export function getCustomerTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CUSTOMER_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function createCustomerSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${CUSTOMER_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS};${secure}`;
}

export function clearCustomerSessionCookie(): string {
  return `${CUSTOMER_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

// ──────────────────────────────────────────
// HIGH-LEVEL AUTHENTICATION
// ──────────────────────────────────────────

export async function authenticateCustomer(request: Request): Promise<{ user: CustomerUserRecord; profile: CustomerProfileRecord } | null> {
  const token = getCustomerTokenFromRequest(request);
  if (!token) return null;
  return await validateCustomerSession(token);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
