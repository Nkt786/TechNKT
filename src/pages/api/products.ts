import type { APIRoute } from "astro";
import { getProducts, getCategories } from "../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const category = url.searchParams.get("category") || undefined;
  const search = url.searchParams.get("search") || undefined;

  const products = await getProducts({
    category,
    search,
    status: "active",
    includeDrafts: false,
  });

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
