import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../../lib/auth";
import { recordCustomerPayment, getCustomerPayments } from "../../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const orderId = url.searchParams.get("orderId");
  if (!orderId) {
    return new Response(
      JSON.stringify({ success: false, error: "Order ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const payments = await getCustomerPayments(orderId);
  return new Response(
    JSON.stringify({ success: true, payments }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { orderId, amount, paymentMethod, reference, notes } = body;

    if (!orderId || !amount || Number(amount) <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Valid order ID and positive payment amount are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await recordCustomerPayment({
      orderId,
      amount: Number(amount),
      paymentMethod: paymentMethod || "upi_qr",
      reference,
      notes,
      recordedBy: "admin",
    });

    return new Response(
      JSON.stringify({ success: true, message: "Customer payment recorded successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Record customer payment error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to record payment" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
