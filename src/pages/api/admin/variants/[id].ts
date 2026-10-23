import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../../lib/auth";
import { updateVariant, deleteVariant, createAuditLog } from "../../../../lib/db/queries";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await updateVariant(id, body);
    if (!updated) {
      return new Response(JSON.stringify({ error: "Variant not found" }), { status: 404 });
    }

    await createAuditLog("update_variant", "product_variant", id, `Updated variant "${updated.variant_name}" (₹${updated.price_amount})`);

    return new Response(JSON.stringify({ success: true, variant: updated }), {
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

export const DELETE: APIRoute = async ({ params, request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
  }

  const deleted = await deleteVariant(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: "Variant not found" }), { status: 404 });
  }

  await createAuditLog("delete_variant", "product_variant", id, `Deleted variant ${id}`);

  return new Response(JSON.stringify({ success: true, message: "Variant deleted" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
