import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../../lib/auth";
import {
  getOrderMessages,
  postOrderMessage,
  markMessagesRead,
} from "../../../../lib/db/queries";

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

  const messages = await getOrderMessages(orderId);
  await markMessagesRead(orderId, "admin");

  return new Response(
    JSON.stringify({ success: true, messages }),
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
    const { orderId, message } = body;

    if (!orderId || !message || !message.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Order ID and message content are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newMsg = await postOrderMessage(orderId, "admin", "admin", message.trim());
    return new Response(
      JSON.stringify({ success: true, message: newMsg }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Admin post message error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
