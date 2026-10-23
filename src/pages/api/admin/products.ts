import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import { getProducts, createProduct, createAuditLog } from "../../../lib/db/queries";

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

  return new Response(JSON.stringify({ success: true, products }), {
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
    if (!body.name || !body.category_id || !body.image_url) {
      return new Response(
        JSON.stringify({ success: false, error: "Name, category, and image URL are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProd = await createProduct({
      slug,
      name: body.name,
      category_id: body.category_id,
      image_url: body.image_url,
      short_description: body.short_description,
      description: body.description,
      badge: body.badge,
      instant: body.instant !== false,
      status: body.status || "active",
      featured: Boolean(body.featured),
      sort_order: Number(body.sort_order || 0),
      marketing_title: body.marketing_title,
      marketing_category: body.marketing_category,
      marketing_description: body.marketing_description,
      include_in_marketing: body.include_in_marketing !== false,
    });

    await createAuditLog("create_product", "product", newProd.id, `Created product "${newProd.name}" (${newProd.id})`);

    return new Response(JSON.stringify({ success: true, product: newProd }), {
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
