import type { APIRoute } from "astro";
import { authenticateCustomer } from "../../../lib/customerAuth";
import { getCustomerOrders } from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const auth = await authenticateCustomer(request);
  if (!auth) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized. Please sign in." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const orders = await getCustomerOrders(auth.user.id);
    return new Response(
      JSON.stringify({ success: true, orders }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Get customer orders error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to load orders." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
