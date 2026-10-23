import type { APIRoute } from "astro";
import {
  getSessionTokenFromRequest,
  clearAdminSessionCookie,
} from "../../../lib/auth";
import { deleteSessionToken, createAuditLog } from "../../../lib/db/queries";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const token = getSessionTokenFromRequest(request);
  if (token) {
    await deleteSessionToken(token);
    await createAuditLog("logout", "admin_auth", null, "Admin logged out", "admin");
  }

  return new Response(
    JSON.stringify({ success: true, message: "Logged out successfully." }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": clearAdminSessionCookie(),
      },
    }
  );
};
