import type { APIRoute } from "astro";
import { getProductById, getProductBySlug } from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing product identifier" }), { status: 400 });
  }

  // Check by ID or Slug
  let product = await getProductById(id);
  if (!product) {
    product = await getProductBySlug(id);
  }

  if (!product || product.status !== "active") {
    return new Response(JSON.stringify({ error: "Product not found or unavailable" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true, product }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
