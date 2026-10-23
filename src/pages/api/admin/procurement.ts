import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import {
  getAllProcurements,
  assignSupplierToProcurement,
  recordProcurementPurchase,
  updateProcurementStatus,
  recordSupplierPayment,
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
  const procurements = await getAllProcurements(status === "all" ? undefined : status);

  return new Response(
    JSON.stringify({ success: true, procurements }),
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
    const { action, procurementId } = body;

    if (!procurementId) {
      return new Response(
        JSON.stringify({ success: false, error: "Procurement ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "assign") {
      const { supplierId, expectedCost } = body;
      if (!supplierId) {
        return new Response(
          JSON.stringify({ success: false, error: "Supplier ID is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      await assignSupplierToProcurement(procurementId, supplierId, expectedCost);
      return new Response(
        JSON.stringify({ success: true, message: "Supplier assigned successfully" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "record_purchase") {
      const { actualCost, supplierReference, notes } = body;
      if (actualCost === undefined || actualCost === null) {
        return new Response(
          JSON.stringify({ success: false, error: "Actual purchase cost is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      await recordProcurementPurchase(procurementId, Number(actualCost), supplierReference, notes);
      return new Response(
        JSON.stringify({ success: true, message: "Purchase cost recorded successfully" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "update_status") {
      const { status, notes } = body;
      if (!status) {
        return new Response(
          JSON.stringify({ success: false, error: "Status is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      await updateProcurementStatus(procurementId, status, notes);
      return new Response(
        JSON.stringify({ success: true, message: "Procurement status updated" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "record_supplier_payment") {
      const { supplierId, amount, paymentMethod, reference, notes } = body;
      if (!supplierId || !amount) {
        return new Response(
          JSON.stringify({ success: false, error: "Supplier and amount are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      await recordSupplierPayment({
        supplierId,
        procurementId,
        amount: Number(amount),
        paymentMethod,
        reference,
        notes,
      });
      return new Response(
        JSON.stringify({ success: true, message: "Supplier payment recorded" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Unknown action" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Procurement mutation error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to update procurement" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
