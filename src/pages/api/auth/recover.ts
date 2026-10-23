import type { APIRoute } from "astro";
import {
  hashPassword,
  verifyRecoveryCodeHash,
  generateSessionToken,
  createCustomerSessionCookie,
  checkCustomerRateLimit,
  recordCustomerAttempt,
  getClientIp,
} from "../../../lib/customerAuth";
import {
  findCustomerByUsername,
  verifyAndConsumeRecoveryCode,
  updateCustomerPassword,
  createCustomerSession,
} from "../../../lib/db/queries";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const rateLimit = checkCustomerRateLimit(ip);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Too many recovery attempts. Please try again after 15 minutes.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { username, recoveryCode, newPassword, confirmPassword } = body;

    if (!username || !recoveryCode || !newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Username, one-time recovery code, and new password are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: "New password must be at least 6 characters." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (newPassword !== confirmPassword) {
      return new Response(
        JSON.stringify({ success: false, error: "New passwords do not match." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = await findCustomerByUsername(cleanUsername);

    if (!user) {
      recordCustomerAttempt(ip, false);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid username or recovery code." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const matched = await verifyAndConsumeRecoveryCode(user.id, recoveryCode, verifyRecoveryCodeHash);
    if (!matched) {
      recordCustomerAttempt(ip, false);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid or already used recovery code. Each code can only be used once.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    recordCustomerAttempt(ip, true);

    const newHash = hashPassword(newPassword);
    await updateCustomerPassword(user.id, newHash);

    // Issue new session
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await createCustomerSession(user.id, token, expiresAt);
    const sessionCookie = createCustomerSessionCookie(token);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account recovered and password successfully reset.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": sessionCookie,
        },
      }
    );
  } catch (err: any) {
    console.error("Account recovery error:", err);
    recordCustomerAttempt(ip, false);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to process recovery request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
