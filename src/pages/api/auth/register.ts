import type { APIRoute } from "astro";
import {
  hashPassword,
  generateRecoveryCodes,
  hashRecoveryCode,
  generateSessionToken,
  createCustomerSessionCookie,
  checkCustomerRateLimit,
  recordCustomerAttempt,
  getClientIp,
} from "../../../lib/customerAuth";
import {
  findCustomerByUsername,
  createCustomerUser,
  createCustomerSession,
  saveCustomerRecoveryCodes,
} from "../../../lib/db/queries";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const rateLimit = checkCustomerRateLimit(ip);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Too many attempts. Please try again after 15 minutes.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const {
      username,
      password,
      confirmPassword,
      displayName,
      optionalWhatsapp,
      optionalEmail,
      optionalTelegram,
      preferredContact,
    } = body;

    // 1. Validate username
    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Username must be at least 3 characters long.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9_.-]+$/.test(cleanUsername)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Username can only contain letters, numbers, underscores, dashes, and periods.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check uniqueness
    const existing = await findCustomerByUsername(cleanUsername);
    if (existing) {
      recordCustomerAttempt(ip, false);
      return new Response(
        JSON.stringify({
          success: false,
          error: "This username is already taken. Please choose another.",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Validate password
    if (!password || typeof password !== "string" || password.length < 6) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Password must be at least 6 characters long.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Passwords do not match.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Hash password with slow scrypt
    const passwordHash = hashPassword(password);

    // 4. Create user record
    const { user, profile } = await createCustomerUser({
      username: cleanUsername,
      passwordHash,
      displayName: displayName || cleanUsername,
      optionalWhatsapp,
      optionalEmail,
      optionalTelegram,
      preferredContact: preferredContact || "dashboard",
    });

    // 5. Generate secure one-time recovery codes
    const rawRecoveryCodes = generateRecoveryCodes(6);
    const hashedRecoveryCodes = rawRecoveryCodes.map(hashRecoveryCode);
    await saveCustomerRecoveryCodes(user.id, hashedRecoveryCodes);

    // 6. Create session token and cookie
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await createCustomerSession(user.id, token, expiresAt);
    const sessionCookie = createCustomerSessionCookie(token);

    recordCustomerAttempt(ip, true);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account created successfully. No OTP needed!",
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
        },
        profile,
        recoveryCodes: rawRecoveryCodes, // Showed once at registration for safe storage
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": sessionCookie,
        },
      }
    );
  } catch (err: any) {
    console.error("Customer register error:", err);
    recordCustomerAttempt(ip, false);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to create account. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
