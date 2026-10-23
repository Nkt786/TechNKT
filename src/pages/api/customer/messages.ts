import type { APIRoute } from "astro";
import { authenticateCustomer } from "../../../lib/customerAuth";
import {
  getCustomerOrderById,
  getOrderMessages,
  postOrderMessage,
  markMessagesRead,
} from "../../../lib/db/queries";

export const prerender = false;

// GET: Fetch messages for customer order
export const GET: APIRoute = async ({ request, url }) => {
  const auth = await authenticateCustomer(request);
  if (!auth) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized. Please sign in." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const orderId = url.searchParams.get("orderId");
  if (!orderId) {
    return new Response(
      JSON.stringify({ success: false, error: "Order ID is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Security: Customer can ONLY access messages for an order they own
  const order = await getCustomerOrderById(orderId, auth.user.id);
  if (!order) {
    return new Response(
      JSON.stringify({ success: false, error: "Order not found or access denied." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const messages = await getOrderMessages(orderId);
    await markMessagesRead(orderId, "customer");
    return new Response(
      JSON.stringify({ success: true, messages }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Get order messages error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to load messages." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// POST: Customer replies or sends an update on their order
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
    const { orderId, message } = body;

    if (!orderId || !message || !message.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Order ID and message content are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Security check: Customer can only post messages to their own order
    const order = await getCustomerOrderById(orderId, auth.user.id);
    if (!order) {
      return new Response(
        JSON.stringify({ success: false, error: "Order not found or access denied." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const newMsg = await postOrderMessage(orderId, auth.user.id, "customer", message.trim());
    return new Response(
      JSON.stringify({ success: true, message: newMsg }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Post order message error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send message." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
