import type { APIRoute } from "astro";
import {
  verifyAdminCredentials,
  createAdminSessionCookie,
  checkRateLimit,
  recordLoginAttempt,
} from "../../../lib/auth";
import { createSessionToken, createAuditLog } from "../../../lib/db/queries";

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || request.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Too many failed login attempts. Please try again in 15 minutes.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      recordLoginAttempt(ip, false);
      return new Response(
        JSON.stringify({ success: false, error: "Username and password are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      recordLoginAttempt(ip, false);
      await createAuditLog("login_failed", "admin_auth", null, `Failed login attempt for user: ${username} from ${ip}`, username);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid username or password." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Success
    recordLoginAttempt(ip, true);
    const token = await createSessionToken(24);
    const cookie = createAdminSessionCookie(token);

    await createAuditLog("login_success", "admin_auth", null, `Admin logged in successfully from ${ip}`, username);

    return new Response(
      JSON.stringify({ success: true, message: "Authentication successful." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Server error during login." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
