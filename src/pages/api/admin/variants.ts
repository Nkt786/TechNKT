import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import { createVariant, createAuditLog } from "../../../lib/db/queries";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    if (!body.product_id || !body.variant_name || body.price_amount === undefined) {
      return new Response(
        JSON.stringify({ success: false, error: "product_id, variant_name, and price_amount are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newVariant = await createVariant({
      product_id: body.product_id,
      variant_name: body.variant_name,
      duration_value: Number(body.duration_value || 1),
      duration_unit: body.duration_unit || "month",
      validity_description: body.validity_description,
      price_amount: Number(body.price_amount),
      comparison_price_amount: Number(body.comparison_price_amount || 0),
      currency: "INR",
      warranty_description: body.warranty_description,
      delivery_description: body.delivery_description,
      activation_description: body.activation_description,
      availability: body.availability || "in_stock",
    });

    await createAuditLog("create_variant", "product_variant", newVariant.id, `Created variant "${newVariant.variant_name}" (₹${newVariant.price_amount}) for product ${body.product_id}`);

    return new Response(JSON.stringify({ success: true, variant: newVariant }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
