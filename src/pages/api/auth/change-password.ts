import type { APIRoute } from "astro";
import {
  authenticateCustomer,
  verifyPassword,
  hashPassword,
  generateSessionToken,
  createCustomerSessionCookie,
} from "../../../lib/customerAuth";
import {
  updateCustomerPassword,
  createCustomerSession,
} from "../../../lib/db/queries";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const auth = await authenticateCustomer(request);
  if (!auth) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized. Please sign in." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ success: false, error: "Current and new password are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: "New password must be at least 6 characters long." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (newPassword !== confirmPassword) {
      return new Response(
        JSON.stringify({ success: false, error: "New passwords do not match." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validCurrent = verifyPassword(currentPassword, auth.user.password_hash);
    if (!validCurrent) {
      return new Response(
        JSON.stringify({ success: false, error: "Incorrect current password." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newHash = hashPassword(newPassword);
    await updateCustomerPassword(auth.user.id, newHash);

    // Issue a fresh new session
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await createCustomerSession(auth.user.id, token, expiresAt);
    const sessionCookie = createCustomerSessionCookie(token);

    return new Response(
      JSON.stringify({ success: true, message: "Password updated successfully." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": sessionCookie,
        },
      }
    );
  } catch (err: any) {
    console.error("Change password error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to update password." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
