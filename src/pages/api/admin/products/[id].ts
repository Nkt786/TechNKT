import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../../lib/auth";
import { getProductById, updateProduct, deleteProduct, createAuditLog } from "../../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
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

  const product = await getProductById(id);
  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true, product }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

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
    const updated = await updateProduct(id, body);
    if (!updated) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    await createAuditLog("update_product", "product", id, `Updated product fields for "${updated.name}" (${id})`);

    return new Response(JSON.stringify({ success: true, product: updated }), {
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

  const existing = await getProductById(id);
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: "Product not found or delete failed" }), { status: 404 });
  }

  await createAuditLog("delete_product", "product", id, `Deleted product "${existing?.name || id}"`);

  return new Response(JSON.stringify({ success: true, message: "Product deleted" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
