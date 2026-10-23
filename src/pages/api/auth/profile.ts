import type { APIRoute } from "astro";
import { authenticateCustomer } from "../../../lib/customerAuth";
import { updateCustomerProfile, getCustomerProfile, findCustomerById } from "../../../lib/db/queries";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const auth = await authenticateCustomer(request);
  if (!auth) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized. Please sign in." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const {
      displayName,
      optionalWhatsapp,
      optionalEmail,
      optionalTelegram,
      preferredContact,
    } = body;

    await updateCustomerProfile(auth.user.id, {
      displayName,
      optionalWhatsapp,
      optionalEmail,
      optionalTelegram,
      preferredContact: preferredContact || "dashboard",
    });

    const updatedProfile = await getCustomerProfile(auth.user.id);
    const updatedUser = await findCustomerById(auth.user.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: updatedUser?.id,
          username: updatedUser?.username,
          displayName: updatedUser?.display_name,
        },
        profile: updatedProfile,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Profile update error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to update profile." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
