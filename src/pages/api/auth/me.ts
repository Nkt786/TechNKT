import type { APIRoute } from "astro";
import { authenticateCustomer } from "../../../lib/customerAuth";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const auth = await authenticateCustomer(request);
  if (!auth) {
    return new Response(
      JSON.stringify({ authenticated: false, user: null, profile: null }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: {
        id: auth.user.id,
        username: auth.user.username,
        displayName: auth.user.display_name,
        createdAt: auth.user.created_at,
      },
      profile: auth.profile,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
