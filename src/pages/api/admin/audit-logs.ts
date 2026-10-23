import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import { getAuditLogs } from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const limit = Number(url.searchParams.get("limit") || 50);
  const logs = await getAuditLogs(limit);

  return new Response(JSON.stringify({ success: true, logs }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
