import type { APIRoute } from "astro";
import {
  getCustomerTokenFromRequest,
  clearCustomerSessionCookie,
} from "../../../lib/customerAuth";
import { deleteCustomerSession } from "../../../lib/db/queries";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const token = getCustomerTokenFromRequest(request);
  if (token) {
    try {
      await deleteCustomerSession(token);
    } catch (e) {
      // Ignored
    }
  }

  return new Response(
    JSON.stringify({ success: true, message: "Logged out." }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": clearCustomerSessionCookie(),
      },
    }
  );
};
