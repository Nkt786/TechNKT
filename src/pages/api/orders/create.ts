import type { APIRoute } from "astro";
import { authenticateCustomer } from "../../../lib/customerAuth";
import { createOrderWithGuestContact } from "../../../lib/db/queries";

export const prerender = false;

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  // MANDATORY REQUIREMENT: Customer must have an authenticated TechNKT account (No OTP required)
  const auth = await authenticateCustomer(request);
  if (!auth) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "You must have a TechNKT account to submit an order request. Please sign in or create an account with just a username and password (no OTP required).",
        requiresAuth: true,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const {
      customer_name,
      whatsapp_number,
      email,
      telegram_contact,
      delivery_preference,
      order_notes,
      order_source,
      items,
    } = body;

    // Delivery preference options: dashboard (default), whatsapp, email, telegram
    const pref = delivery_preference || auth.profile?.preferred_contact_method || "dashboard";

    if (!["dashboard", "whatsapp", "email", "telegram"].includes(pref)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Delivery preference must be one of: TechNKT Dashboard, WhatsApp, Email, or Telegram.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Contact field validations ONLY if external channel chosen
    const finalWa = whatsapp_number || auth.profile?.optional_whatsapp || null;
    const finalEmail = email || auth.profile?.optional_email || null;
    const finalTg = telegram_contact || auth.profile?.optional_telegram || null;

    if (pref === "whatsapp" && finalWa && !isValidPhone(finalWa)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "A valid WhatsApp number with country code is required for WhatsApp delivery.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (pref === "email" && finalEmail && !isValidEmail(finalEmail)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "A valid email address is required for Email delivery.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Your cart or order contains no items." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { order, items: orderItems } = await createOrderWithGuestContact({
      customer_name: customer_name?.trim() || auth.user.display_name || auth.user.username,
      whatsapp_number: finalWa,
      email: finalEmail,
      telegram_contact: finalTg,
      delivery_preference: pref,
      customer_user_id: auth.user.id,
      customer_notes: order_notes?.trim() || undefined,
      order_source: order_source || "web_store",
      order_status: "new",
      items,
    });

    // Optional WhatsApp link for convenience if customer wishes to chat
    const waItemsList = orderItems
      .map(
        (i: any) =>
          `• *${i.product_name_snapshot}* (${i.variant_name_snapshot}) × ${i.quantity} = ₹${i.line_total}`
      )
      .join("\n");

    const waMessageText = `*TechNKT Order Enquiry*
Reference: *${order.public_order_reference}*
Account: *${auth.user.username}*

Hello TechNKT Team,
I have placed an order request:

${waItemsList}

*Total Amount:* ₹${order.total_amount}/-
*Delivery Channel:* ${pref.toUpperCase()}

Please confirm availability and next steps. Thank you!`;

    const encodedWhatsAppUrl = `https://wa.me/919822587641?text=${encodeURIComponent(waMessageText)}`;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order request received successfully! You can track progress and chat with our team in your TechNKT Dashboard.",
        orderId: order.id,
        orderReference: order.public_order_reference,
        totalAmount: order.total_amount,
        currency: order.currency,
        deliveryPreference: order.delivery_preference,
        orderStatus: order.order_status,
        paymentStatus: order.payment_status,
        createdAt: order.created_at,
        items: orderItems,
        encodedWhatsAppUrl,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Order creation error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to process order request." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};
