import React, { useState, useEffect } from "react";
import {
  LuRefreshCw,
  LuSearch,
  LuPencil,
  LuCheck,
  LuExternalLink,
  LuDollarSign,
  LuPackage,
  LuX,
  LuCircleCheck,
  LuTriangleAlert,
  LuClock,
} from "react-icons/lu";

interface Procurement {
  id: string;
  order_id: string;
  order_item_id: string;
  supplier_id: string | null;
  expected_cost_amount: number | null;
  actual_cost_amount: number | null;
  quantity: number;
  procurement_status: string;
  supplier_payment_status: string;
  supplier_reference: string | null;
  purchase_date: string | null;
  fulfillment_notes: string | null;
  created_at: string;
  order_reference?: string;
  customer_name?: string;
  customer_username?: string;
  product_name?: string;
  variant_name?: string;
  selling_price_snapshot?: number;
  supplier_name?: string;
}

interface Supplier {
  id: string;
  name: string;
}

export default function ProcurementView({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Action Modals
  const [activeProcurement, setActiveProcurement] = useState<Procurement | null>(null);
  const [modalType, setModalType] = useState<"assign" | "purchase" | "status" | "payment" | null>(null);

  // Form states
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [expectedCostInput, setExpectedCostInput] = useState("");
  const [actualCostInput, setActualCostInput] = useState("");
  const [supplierRefInput, setSupplierRefInput] = useState("");
  const [fulfillmentNotesInput, setFulfillmentNotesInput] = useState("");
  const [statusInput, setStatusInput] = useState("purchased");
  const [paymentAmountInput, setPaymentAmountInput] = useState("");
  const [paymentMethodInput, setPaymentMethodInput] = useState("UPI QR");
  const [paymentRefInput, setPaymentRefInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchProcurements = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "all" ? "/api/admin/procurement" : `/api/admin/procurement?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProcurements(data.procurements);
      }
    } catch {
      showToast("Failed to load procurements", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/admin/suppliers?status=active");
      const data = await res.json();
      if (data.success && Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers);
      }
    } catch {
      // suppliers fallback
    }
  };

  useEffect(() => {
    fetchProcurements();
    fetchSuppliers();
  }, [statusFilter]);

  const openAssignModal = (p: Procurement) => {
    setActiveProcurement(p);
    setSelectedSupplierId(p.supplier_id || (suppliers[0]?.id || ""));
    setExpectedCostInput(p.expected_cost_amount ? String(p.expected_cost_amount) : "");
    setModalType("assign");
  };

  const openPurchaseModal = (p: Procurement) => {
    setActiveProcurement(p);
    setActualCostInput(p.actual_cost_amount ? String(p.actual_cost_amount) : p.expected_cost_amount ? String(p.expected_cost_amount) : "");
    setSupplierRefInput(p.supplier_reference || "");
    setFulfillmentNotesInput(p.fulfillment_notes || "");
    setModalType("purchase");
  };

  const openStatusModal = (p: Procurement) => {
    setActiveProcurement(p);
    setStatusInput(p.procurement_status);
    setFulfillmentNotesInput(p.fulfillment_notes || "");
    setModalType("status");
  };

  const openPaymentModal = (p: Procurement) => {
    setActiveProcurement(p);
    const cost = p.actual_cost_amount || p.expected_cost_amount || 0;
    setPaymentAmountInput(String(cost));
    setPaymentMethodInput("UPI QR");
    setPaymentRefInput("");
    setModalType("payment");
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProcurement || !modalType) return;
    setSubmitting(true);
    try {
      let payload: any = { procurementId: activeProcurement.id };
      if (modalType === "assign") {
        payload.action = "assign";
        payload.supplierId = selectedSupplierId;
        payload.expectedCost = Number(expectedCostInput);
      } else if (modalType === "purchase") {
        payload.action = "record_purchase";
        payload.actualCost = Number(actualCostInput);
        payload.supplierReference = supplierRefInput;
        payload.notes = fulfillmentNotesInput;
      } else if (modalType === "status") {
        payload.action = "update_status";
        payload.status = statusInput;
        payload.notes = fulfillmentNotesInput;
      } else if (modalType === "payment") {
        payload.action = "record_supplier_payment";
        payload.supplierId = activeProcurement.supplier_id;
        payload.amount = Number(paymentAmountInput);
        payload.paymentMethod = paymentMethodInput;
        payload.reference = paymentRefInput;
      }

      const res = await fetch("/api/admin/procurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Updated procurement");
        setModalType(null);
        fetchProcurements();
      } else {
        showToast(data.error || "Action failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProcurements = procurements.filter((p) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      p.order_reference?.toLowerCase().includes(s) ||
      p.product_name?.toLowerCase().includes(s) ||
      p.variant_name?.toLowerCase().includes(s) ||
      p.customer_name?.toLowerCase().includes(s) ||
      p.supplier_name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Procurement & Sourcing Desk</h1>
          <p className="text-xs text-[#A6B1C2]">
            Match ordered items to suppliers, record acquisition costs, and track fulfillment status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProcurements}
            className="px-3 py-2 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs font-medium text-[#A6B1C2] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LuRefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A6B1C2]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ref, product, customer, or supplier..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs text-white placeholder-[#A6B1C2]/40 focus:outline-none focus:border-[#2965E8]"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
          >
            <option value="all">All Sourcing Statuses</option>
            <option value="not_assigned">Not Assigned</option>
            <option value="supplier_assigned">Supplier Assigned</option>
            <option value="purchased">Purchased</option>
            <option value="received_ready">Received / Ready</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B101A] text-[#A6B1C2] border-b border-[#1E2837]">
              <tr>
                <th className="py-3 px-4 font-semibold">Order Ref</th>
                <th className="py-3 px-4 font-semibold">Product & Variant</th>
                <th className="py-3 px-4 font-semibold">Assigned Supplier</th>
                <th className="py-3 px-4 font-semibold">Selling Price</th>
                <th className="py-3 px-4 font-semibold">Purchase Cost</th>
                <th className="py-3 px-4 font-semibold">Estimated Margin</th>
                <th className="py-3 px-4 font-semibold">Sourcing Status</th>
                <th className="py-3 px-4 font-semibold">Supplier Payment</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2837] text-white">
              {filteredProcurements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-[#A6B1C2]">
                    No procurement records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredProcurements.map((p) => {
                  const selling = p.selling_price_snapshot || 0;
                  const cost = p.actual_cost_amount ?? p.expected_cost_amount;
                  const profit = cost !== null && cost !== undefined ? selling - cost : null;
                  const marginPct = profit !== null && selling > 0 ? Math.round((profit / selling) * 100) : null;

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#2965E8]">
                          {p.order_reference}
                        </span>
                        <div className="text-[10px] text-[#A6B1C2] mt-0.5">
                          {p.customer_username ? `@${p.customer_username}` : p.customer_name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{p.product_name}</div>
                        <div className="text-[11px] text-[#A6B1C2]">
                          {p.variant_name} × {p.quantity}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {p.supplier_name ? (
                          <span className="font-medium text-white">{p.supplier_name}</span>
                        ) : (
                          <button
                            onClick={() => openAssignModal(p)}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
                          >
                            + Assign Supplier
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ₹{selling.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {p.actual_cost_amount !== null && p.actual_cost_amount !== undefined ? (
                          <span className="font-bold text-white">₹{p.actual_cost_amount.toLocaleString()} (Actual)</span>
                        ) : p.expected_cost_amount !== null && p.expected_cost_amount !== undefined ? (
                          <span className="text-[#A6B1C2]">~₹{p.expected_cost_amount.toLocaleString()} (Est)</span>
                        ) : (
                          <span className="text-rose-400 text-[11px]">Cost not recorded</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {profit !== null ? (
                          <div>
                            <span className={profit >= 0 ? "font-bold text-emerald-400" : "font-bold text-rose-400"}>
                              ₹{profit.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-[#A6B1C2] ml-1">({marginPct}%)</span>
                          </div>
                        ) : (
                          <span className="text-[#A6B1C2] text-[11px]">Unavailable</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            p.procurement_status === "fulfilled"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : p.procurement_status === "purchased"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {p.procurement_status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            p.supplier_payment_status === "paid"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {p.supplier_payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openPurchaseModal(p)}
                            className="px-2 py-1 rounded bg-[#0B101A] hover:bg-[#1E2837] text-[#2965E8] hover:text-[#3D75F0] text-[11px] font-semibold border border-[#1E2837] cursor-pointer"
                            title="Record Cost"
                          >
                            Cost
                          </button>
                          <button
                            onClick={() => openStatusModal(p)}
                            className="px-2 py-1 rounded bg-[#0B101A] hover:bg-[#1E2837] text-white text-[11px] font-semibold border border-[#1E2837] cursor-pointer"
                            title="Update Status"
                          >
                            Status
                          </button>
                          {p.supplier_payment_status !== "paid" && (
                            <button
                              onClick={() => openPaymentModal(p)}
                              className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30 cursor-pointer"
                              title="Pay Supplier"
                            >
                              Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOURCING ACTION MODALS */}
      {modalType && activeProcurement && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#151D2B] border border-[#1E2837] shadow-2xl p-6">
            <div className="flex justify-between items-center pb-3 border-b border-[#1E2837] mb-4">
              <h3 className="text-base font-bold text-white">
                {modalType === "assign"
                  ? "Assign Supplier"
                  : modalType === "purchase"
                  ? "Record Actual Purchase Cost"
                  : modalType === "status"
                  ? "Update Sourcing Status"
                  : "Record Supplier Payment"}
              </h3>
              <button onClick={() => setModalType(null)} className="text-[#A6B1C2] hover:text-white cursor-pointer">
                <LuX className="size-5" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs">
              <span className="font-mono text-[#2965E8] font-bold block mb-0.5">
                {activeProcurement.order_reference}
              </span>
              <span className="text-white font-medium block">
                {activeProcurement.product_name} ({activeProcurement.variant_name})
              </span>
              <span className="text-[#A6B1C2] text-[11px]">
                Selling Price: ₹{activeProcurement.selling_price_snapshot}
              </span>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-3">
              {modalType === "assign" && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Select Supplier
                    </label>
                    <select
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    >
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Expected Purchase Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={expectedCostInput}
                      onChange={(e) => setExpectedCostInput(e.target.value)}
                      placeholder="e.g. 120"
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    />
                  </div>
                </>
              )}

              {modalType === "purchase" && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Actual Cost Charged by Supplier (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={actualCostInput}
                      onChange={(e) => setActualCostInput(e.target.value)}
                      placeholder="e.g. 120"
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Supplier Reference / Batch Ref
                    </label>
                    <input
                      type="text"
                      value={supplierRefInput}
                      onChange={(e) => setSupplierRefInput(e.target.value)}
                      placeholder="e.g. GDH-TXN-9021"
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Internal Fulfillment Notes
                    </label>
                    <input
                      type="text"
                      value={fulfillmentNotesInput}
                      onChange={(e) => setFulfillmentNotesInput(e.target.value)}
                      placeholder="Slot credentials, activation date..."
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    />
                  </div>
                </>
              )}

              {modalType === "status" && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      New Status
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    >
                      <option value="supplier_assigned">Supplier Assigned</option>
                      <option value="awaiting_supplier">Awaiting Supplier Response</option>
                      <option value="purchased">Purchased</option>
                      <option value="received_ready">Received / Ready for Customer</option>
                      <option value="fulfilled">Fulfilled / Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={fulfillmentNotesInput}
                      onChange={(e) => setFulfillmentNotesInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    />
                  </div>
                </>
              )}

              {modalType === "payment" && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Payment Amount to Supplier (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={paymentAmountInput}
                      onChange={(e) => setPaymentAmountInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethodInput}
                      onChange={(e) => setPaymentMethodInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    >
                      <option value="UPI QR">UPI QR / PhonePe</option>
                      <option value="IMPS / Bank Transfer">IMPS Bank Transfer</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                      Transaction UTR / Reference
                    </label>
                    <input
                      type="text"
                      value={paymentRefInput}
                      onChange={(e) => setPaymentRefInput(e.target.value)}
                      placeholder="e.g. UTR 42091823901"
                      className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl bg-[#1E2837] text-[#A6B1C2] hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
