import type { APIRoute } from "astro";
import Stripe from "stripe";

// This route is server-rendered (Vercel Serverless Function)
export const prerender = false;

interface GHLContactPayload {
  locationId: string;
  firstName: string;
  lastName: string;
  email: string;
  tags: string[];
}

export const POST: APIRoute = async ({ request, url }) => {
  const GHL_API_KEY = import.meta.env.GHL_API_KEY;
  const GHL_LOCATION_ID = import.meta.env.GHL_LOCATION_ID;
  const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY env var");
    return new Response(
      JSON.stringify({ success: false, error: "Stripe configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2026-06-24.dahlia", // Matching latest SDK typings
  });

  // Parse incoming request
  let name = "";
  let email = "";
  let planTitle = "Plan";
  let productId = "";
  let variantId = "";
  let interval = "month";

  try {
    const body = await request.json();
    name = body.name ?? "";
    email = body.email ?? "";
    planTitle = body.planTitle ?? "Plan";
    productId = body.productId ?? "";
    variantId = body.variantId ?? "";
    interval = body.interval ?? "month"; // "month" or "year"
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!name || !email) {
    return new Response(
      JSON.stringify({ success: false, error: "Name and email are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // SECURITY FIX: Resolve price strictly from trusted database records
  let trustedPriceInr = 0;
  try {
    const { getProductById } = await import("../../lib/db/queries");
    if (productId) {
      const prod = await getProductById(productId);
      if (prod && prod.variants && prod.variants.length > 0) {
        const variant = variantId
          ? prod.variants.find((v) => v.id === variantId)
          : prod.variants[0];
        if (variant) {
          trustedPriceInr = variant.price_amount;
          planTitle = `${prod.name} (${variant.variant_name})`;
        }
      }
    }
  } catch (dbErr) {
    console.warn("DB lookup in checkout fallback:", dbErr);
  }

  // Fallback to static pricing tiers for web-dev plans if not in DB
  if (trustedPriceInr <= 0) {
    const normalizedPlan = planTitle.toLowerCase();
    if (normalizedPlan.includes("starter") || normalizedPlan.includes("basic")) {
      trustedPriceInr = interval === "year" ? 2999 : 299;
    } else if (normalizedPlan.includes("pro") || normalizedPlan.includes("growth")) {
      trustedPriceInr = interval === "year" ? 5999 : 599;
    } else if (normalizedPlan.includes("enterprise") || normalizedPlan.includes("business")) {
      trustedPriceInr = interval === "year" ? 11999 : 1199;
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid or unrecognized plan selection. Price cannot be determined.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  // 1. Create/Upsert GoHighLevel Contact
  if (GHL_API_KEY && GHL_LOCATION_ID) {
    const payload: GHLContactPayload = {
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName,
      email: email.trim(),
      tags: ["checkout-initiated", planTitle],
    };

    try {
      await fetch(
        "https://services.leadconnectorhq.com/contacts/upsert",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GHL_API_KEY}`,
            "Content-Type": "application/json",
            Version: "2021-07-28",
          },
          body: JSON.stringify(payload),
        }
      );
      console.log("GHL contact initiated for checkout");
    } catch (err) {
      console.error("GHL integration error during checkout:", err);
    }
  }

  // 2. Create Stripe Checkout Session with TRUSTED price
  try {
    const unitAmount = Math.round(trustedPriceInr * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email.trim(),
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: planTitle,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: interval === "year" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${url.origin}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${url.origin}/pricing?canceled=true`,
    });

    return new Response(
      JSON.stringify({ success: true, url: session.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Stripe Checkout error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
