import type { APIRoute } from "astro";
import { getProducts, getCategories } from "../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const category = url.searchParams.get("category") || undefined;
  const search = url.searchParams.get("search") || undefined;

  const rawProducts = await getProducts({
    category,
    search,
    status: "active",
    includeDrafts: false,
  });

  // STRICT PRIVACY & SANITIZATION:
  // 1. Omit internal seller_name completely from public website visitors
  // 2. Ensure only properly named items appear
  const products = rawProducts
    .filter((p) => p.name && p.name.trim() && p.name !== "Untitled Product")
    .map(({ seller_name, ...publicFields }) => publicFields);

  const categories = await getCategories();

  return new Response(
    JSON.stringify({
      success: true,
      products,
      categories,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=10, stale-while-revalidate=60",
      },
    }
  );
};
