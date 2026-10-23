import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import { getDashboardMetrics } from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const metrics = await getDashboardMetrics();

  return new Response(JSON.stringify({ success: true, metrics }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
