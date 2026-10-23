import crypto from "node:crypto";
import { validateSessionToken } from "./db/queries";

const COOKIE_NAME = "technkt_admin_session";

// Rate limiting state (in-memory per IP)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

export function recordLoginAttempt(ip: string, success: boolean) {
  const now = Date.now();
  if (success) {
    loginAttempts.delete(ip);
    return;
  }

  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedPass) {
    if (process.env.NODE_ENV === "production") {
      console.error("[SECURITY ALERT] ADMIN_PASSWORD is NOT configured in production environment! Access denied.");
      return false;
    }
  }

  const effectivePass = expectedPass || "TechNKT@DevPass2026!";

  if (!username || !password) return false;

  // Constant-time comparison to prevent timing attacks
  const userMatch = crypto.timingSafeEqual(
    Buffer.from(username.padEnd(64, " ")),
    Buffer.from(expectedUser.padEnd(64, " "))
  );

  const passMatch = crypto.timingSafeEqual(
    Buffer.from(password.padEnd(128, " ")),
    Buffer.from(effectivePass.padEnd(128, " "))
  );

  return userMatch && passMatch;
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function authenticateAdmin(request: Request): Promise<boolean> {
  const token = getSessionTokenFromRequest(request);
  if (!token) return false;
  return await validateSessionToken(token);
}

export function createAdminSessionCookie(token: string): string {
  // Max-Age = 24 hours (86400 seconds)
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

export function clearAdminSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
