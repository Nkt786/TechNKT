import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import {
  getProductSupplierOffers,
  upsertSupplierOffer,
} from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const productId = url.searchParams.get("productId");
  if (!productId) {
    return new Response(
      JSON.stringify({ success: false, error: "Product ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const offers = await getProductSupplierOffers(productId);
  return new Response(
    JSON.stringify({ success: true, offers }),
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
    const {
      supplierId,
      productId,
      variantId,
      purchasePriceAmount,
      preferred,
      availability,
      notes,
    } = body;

    if (!supplierId || !productId || !variantId || purchasePriceAmount === undefined) {
      return new Response(
        JSON.stringify({ success: false, error: "Supplier, product, variant, and purchase cost are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const offer = await upsertSupplierOffer({
      supplierId,
      productId,
      variantId,
      purchasePriceAmount: Number(purchasePriceAmount),
      preferred: Boolean(preferred),
      availability,
      notes,
    });

    return new Response(
      JSON.stringify({ success: true, offer, message: "Supplier offer saved successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Save offer error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to save supplier offer" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
