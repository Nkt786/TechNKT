import type { APIRoute } from "astro";
import { getOrderByReference } from "../../../lib/db/queries";

export const prerender = false;

// Mask sensitive contact details
function maskContact(str: string | null | undefined): string {
  if (!str) return "—";
  if (str.includes("@")) {
    const [user, domain] = str.split("@");
    return `${user.slice(0, 2)}***@${domain}`;
  }
  const digits = str.replace(/\D/g, "");
  if (digits.length >= 10) {
    return `${digits.slice(0, 2)}******${digits.slice(-4)}`;
  }
  return "***";
}

export const GET: APIRoute = async ({ url }) => {
  const ref = url.searchParams.get("ref");
  if (!ref || !ref.trim()) {
    return new Response(
      JSON.stringify({ success: false, error: "Order reference is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const order = await getOrderByReference(ref.trim().toUpperCase());
  if (!order) {
    return new Response(
      JSON.stringify({ success: false, error: "No order found matching this reference." }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Return non-sensitive status info
  return new Response(
    JSON.stringify({
      success: true,
      reference: order.public_order_reference,
      status: order.order_status,
      deliveryChannel: order.delivery_preference,
      contactMasked: maskContact(order.whatsapp_number || order.email || order.telegram_contact),
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      items: order.items?.map((i: any) => ({
        name: i.product_name_snapshot,
        plan: i.variant_name_snapshot,
        quantity: i.quantity,
        total: i.line_total,
      })),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
