import type { APIRoute } from "astro";
import {
  verifyPassword,
  generateSessionToken,
  createCustomerSessionCookie,
  checkCustomerRateLimit,
  recordCustomerAttempt,
  getClientIp,
} from "../../../lib/customerAuth";
import {
  findCustomerByUsername,
  getCustomerProfile,
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
        error: "Too many login attempts. Please try again after 15 minutes.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Username and password are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = await findCustomerByUsername(cleanUsername);

    if (!user || user.status !== "active") {
      recordCustomerAttempt(ip, false);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid username or password." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const valid = verifyPassword(password, user.password_hash);
    if (!valid) {
      recordCustomerAttempt(ip, false);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid username or password." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    recordCustomerAttempt(ip, true);

    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await createCustomerSession(user.id, token, expiresAt);
    const sessionCookie = createCustomerSessionCookie(token);

    const profile = await getCustomerProfile(user.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Logged in successfully.",
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
        },
        profile,
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
    console.error("Customer login error:", err);
    recordCustomerAttempt(ip, false);
    return new Response(
      JSON.stringify({ success: false, error: "Login failed. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
