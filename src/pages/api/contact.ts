import type { APIRoute } from "astro";
import { createAuditLog } from "../../lib/db/queries";

export const prerender = false;

interface GHLContactPayload {
  locationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  customFields?: Array<{ key: string; field_value: string }>;
}

export const POST: APIRoute = async ({ request }) => {
  const GHL_API_KEY = import.meta.env.GHL_API_KEY;
  const GHL_LOCATION_ID = import.meta.env.GHL_LOCATION_ID;

  // Parse incoming form data
  let name = "";
  let email = "";
  let phone = "";
  let message = "";

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    name = body.name ?? "";
    email = body.email ?? "";
    phone = body.phone ?? "";
    message = body.message ?? "";
  } else {
    const formData = await request.formData();
    name = (formData.get("name") as string) ?? "";
    email = (formData.get("email") as string) ?? "";
    phone = (formData.get("phone") as string) ?? "";
    message = (formData.get("message") as string) ?? "";
  }

  // Basic validation
  if (!name || !email) {
    return new Response(
      JSON.stringify({ success: false, error: "Name and email are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  try {
    // Record contact inquiry in TechNKT database
    await createAuditLog(
      "contact_submission",
      "contact_form",
      null,
      `Contact message received from ${name.trim()} (${email.trim()} / ${phone.trim()}): ${message.trim().slice(0, 500)}`,
      name.trim(),
    );

    // Optional GoHighLevel forward if credentials are provided
    if (GHL_API_KEY && GHL_LOCATION_ID) {
      const payload: GHLContactPayload = {
        locationId: GHL_LOCATION_ID,
        firstName,
        lastName,
        email: email.trim(),
        phone: phone.trim(),
        tags: ["website-contact-form"],
      };

      try {
        const ghlRes = await fetch(
          "https://services.leadconnectorhq.com/contacts/upsert",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GHL_API_KEY}`,
              "Content-Type": "application/json",
              Version: "2021-07-28",
            },
            body: JSON.stringify(payload),
          },
        );

        if (ghlRes.ok) {
          const result = await ghlRes.json();
          const contactId = result?.contact?.id;

          if (contactId && message.trim()) {
            await fetch(
              `https://services.leadconnectorhq.com/contacts/${contactId}/notes`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${GHL_API_KEY}`,
                  "Content-Type": "application/json",
                  Version: "2021-07-28",
                },
                body: JSON.stringify({
                  body: `Message from web form:\n\n${message.trim()}`,
                }),
              },
            );
          }
        }
      } catch (ghlErr) {
        console.warn("[TechNKT] Optional GHL forward skipped:", ghlErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[TechNKT] Contact form submission error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
