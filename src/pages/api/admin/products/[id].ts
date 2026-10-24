import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../../lib/auth";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  createAuditLog,
  updateVariant,
  createVariant,
} from "../../../../lib/db/queries";

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

    const existing = await getProductById(id);
    if (!existing) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    // Determine status: if title or image missing, keep draft
    let status = body.status !== undefined ? body.status : existing.status;
    const finalName = body.name !== undefined ? body.name.trim() : existing.name;
    const finalImage = body.image_url !== undefined ? body.image_url.trim() : existing.image_url;
    if (!finalName || !finalImage || body.save_as_draft) {
      status = "draft";
    }

    const updated = await updateProduct(id, {
      name: body.name !== undefined ? finalName : undefined,
      category_id: body.category_id,
      image_url: body.image_url !== undefined ? finalImage : undefined,
      short_description: body.short_description ?? body.description,
      description: body.description,
      badge: body.badge,
      instant: body.instant !== undefined ? Boolean(body.instant) : undefined,
      status,
      featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
      sort_order: body.sort_order !== undefined ? Number(body.sort_order) : undefined,
      seller_name: body.seller_name !== undefined ? body.seller_name.trim() : undefined,
    });

    // Check if price or duration is passed from simplified form
    const hasPrice = body.price !== undefined || body.selling_price !== undefined || body.price_amount !== undefined;
    const priceVal = body.price ?? body.selling_price ?? body.price_amount;
    const hasDuration = body.duration !== undefined;

    if (hasPrice || hasDuration) {
      const priceNum = priceVal !== undefined && priceVal !== "" ? Math.max(0, Number(priceVal)) : 0;
      const durationVal = (body.duration || "").trim();

      if (existing.variants && existing.variants.length > 0) {
        // Update primary variant
        const primary = existing.variants[0];
        await updateVariant(primary.id, {
          price_amount: hasPrice ? (isNaN(priceNum) ? 0 : Math.round(priceNum)) : undefined,
          variant_name: durationVal || undefined,
          duration_unit: durationVal || undefined,
          validity_description: durationVal || undefined,
        });
      } else {
        // Create new primary variant
        await createVariant({
          product_id: id,
          variant_name: durationVal || "Standard Plan",
          duration_value: 1,
          duration_unit: durationVal || "month",
          validity_description: durationVal || null,
          price_amount: isNaN(priceNum) ? 0 : Math.round(priceNum),
        });
      }
    }

    const fullProduct = await getProductById(id);

    await createAuditLog(
      "update_product",
      "product",
      id,
      `Updated product "${fullProduct?.name || id}" (Seller: ${fullProduct?.seller_name || "None"})`
    );

    return new Response(JSON.stringify({ success: true, product: fullProduct || updated }), {
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
