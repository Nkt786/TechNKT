import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import { getOrders, getOrderById, updateOrderStatus, createAuditLog } from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = url.searchParams.get("id");
  if (id) {
    const order = await getOrderById(id);
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, order }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const status = url.searchParams.get("status") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const limit = Number(url.searchParams.get("limit") || 50);
  const offset = Number(url.searchParams.get("offset") || 0);

  const { orders, total } = await getOrders({ status, search, limit, offset });

  return new Response(JSON.stringify({ success: true, orders, total }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { orderId, status, paymentStatus, adminNotes } = body;

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: "orderId is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updated = await updateOrderStatus(orderId, status, paymentStatus, adminNotes);
    if (!updated) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    await createAuditLog("update_order_status", "order", orderId, `Updated status to "${status}" / payment: "${paymentStatus}" for order ${updated.public_order_reference}`);

    return new Response(JSON.stringify({ success: true, order: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
