import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import {
  getProducts,
  createProduct,
  createVariant,
  createAuditLog,
  getDistinctSellerNames,
  getProductById,
} from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const category = url.searchParams.get("category") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const search = url.searchParams.get("search") || undefined;

  const products = await getProducts({
    category,
    status,
    search,
    includeDrafts: true,
  });

  const sellers = await getDistinctSellerNames();

  return new Response(JSON.stringify({ success: true, products, sellers }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    // All fields are optional! Provide safe, beginner-friendly defaults
    const rawName = (body.name || "").trim();
    const rawImage = (body.image_url || "").trim();
    const rawCategory = (body.category_id || "subscriptions").trim();
    const rawSeller = (body.seller_name || "").trim();
    const rawDesc = (body.description || body.short_description || "").trim();
    const rawDuration = (body.duration || "").trim();
    const rawPrice = body.price !== undefined && body.price !== ""
      ? Number(body.price)
      : (body.selling_price !== undefined && body.selling_price !== ""
          ? Number(body.selling_price)
          : (body.price_amount !== undefined ? Number(body.price_amount) : null));

    // Name fallback
    const name = rawName || "Untitled Product";

    // Auto slug
    const baseSlug = rawName
      ? rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : `draft-${Date.now()}`;
    const slug = `${baseSlug || "item"}-${Math.random().toString(36).slice(2, 6)}`;

    // Incomplete listings safely kept as drafts
    let status = body.status || "active";
    if (!rawName || !rawImage || body.save_as_draft) {
      status = "draft";
    }

    const newProd = await createProduct({
      slug,
      name,
      category_id: rawCategory,
      image_url: rawImage || "/images/categories/category-all.svg",
      short_description: rawDesc ? rawDesc.slice(0, 160) : undefined,
      description: rawDesc || undefined,
      badge: body.badge || (rawPrice && rawPrice > 0 ? "POPULAR" : undefined),
      instant: body.instant !== false,
      status,
      featured: Boolean(body.featured),
      sort_order: Number(body.sort_order || 0),
      marketing_title: name,
      marketing_category: rawCategory,
      seller_name: rawSeller || undefined,
    });

    // If price or duration provided, create primary variant
    if (rawPrice !== null || rawDuration) {
      await createVariant({
        product_id: newProd.id,
        variant_name: rawDuration || "Standard Plan",
        duration_value: 1,
        duration_unit: rawDuration || "month",
        validity_description: rawDuration || null,
        price_amount: rawPrice !== null && !isNaN(rawPrice) && rawPrice > 0 ? Math.round(rawPrice) : 0,
        availability: "in_stock",
      });
    }

    const fullProduct = await getProductById(newProd.id);

    await createAuditLog(
      "create_product",
      "product",
      newProd.id,
      `Created product "${name}" (Status: ${status}, Seller: ${rawSeller || "None"})`
    );

    return new Response(JSON.stringify({ success: true, product: fullProduct || newProd }), {
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
