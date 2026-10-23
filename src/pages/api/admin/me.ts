import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const isAuth = await authenticateAdmin(request);
  if (!isAuth) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ authenticated: true, user: process.env.ADMIN_USERNAME || "admin" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
