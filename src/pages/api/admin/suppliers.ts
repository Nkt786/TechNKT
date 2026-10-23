import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  getSupplierStats,
} from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const status = url.searchParams.get("status") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const suppliers = await getAllSuppliers({ status, search });
  const stats = await getSupplierStats();

  return new Response(
    JSON.stringify({ success: true, suppliers, stats }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const {
      id,
      name,
      business_name,
      contact_person,
      whatsapp,
      email,
      telegram,
      notes,
      preferred_payment_method,
      status,
    } = body;

    if (!name || !name.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Supplier name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (id) {
      await updateSupplier(id, {
        name,
        business_name,
        contact_person,
        whatsapp,
        email,
        telegram,
        notes,
        preferred_payment_method,
        status,
      });
      return new Response(
        JSON.stringify({ success: true, message: "Supplier updated successfully" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const created = await createSupplier({
        name,
        businessName: business_name,
        contactPerson: contact_person,
        whatsapp,
        email,
        telegram,
        notes,
        preferredPaymentMethod: preferred_payment_method,
      });
      return new Response(
        JSON.stringify({ success: true, supplier: created, message: "Supplier created successfully" }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    console.error("Supplier mutation error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to save supplier" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
