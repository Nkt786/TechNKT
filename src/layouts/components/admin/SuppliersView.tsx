import React, { useState, useEffect } from "react";
import {
  LuPlus,
  LuSearch,
  LuRefreshCw,
  LuPencil,
  LuArchive,
  LuPhone,
  LuMail,
  LuSend,
  LuCircleCheck,
  LuTriangleAlert,
  LuX,
  LuBuilding,
  LuDollarSign,
  LuPackage,
  LuClock,
} from "react-icons/lu";

interface Supplier {
  id: string;
  name: string;
  business_name: string | null;
  contact_person: string | null;
  whatsapp: string | null;
  email: string | null;
  telegram: string | null;
  notes: string | null;
  status: string;
  preferred_payment_method: string | null;
  created_at: string;
  supplied_products_count?: number;
  total_purchases_amount?: number;
  outstanding_balance?: number;
}

interface SupplierOffer {
  id: string;
  supplier_id: string;
  product_id: string;
  variant_id: string;
  product_name?: string;
  variant_name?: string;
  purchase_price_amount: number;
  selling_price_amount?: number;
  currency: string;
  preferred: number;
  availability: string;
  notes: string | null;
}

export default function SuppliersView({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    business_name: "",
    contact_person: "",
    whatsapp: "",
    email: "",
    telegram: "",
    notes: "",
    preferred_payment_method: "UPI QR",
  });
  const [saving, setSaving] = useState(false);

  // Supplier Details Drawer
  const [drawerSupplier, setDrawerSupplier] = useState<Supplier | null>(null);
  const [drawerOffers, setDrawerOffers] = useState<SupplierOffer[]>([]);
  const [loadingDrawer, setLoadingDrawer] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/suppliers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.suppliers);
        setStats(data.stats);
      }
    } catch {
      showToast("Failed to load suppliers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuppliers();
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setSupplierForm({
      name: "",
      business_name: "",
      contact_person: "",
      whatsapp: "",
      email: "",
      telegram: "",
      notes: "",
      preferred_payment_method: "UPI QR",
    });
    setShowAddModal(true);
  };

  const openEditModal = (sup: Supplier) => {
    setEditingSupplier(sup);
    setSupplierForm({
      name: sup.name,
      business_name: sup.business_name || "",
      contact_person: sup.contact_person || "",
      whatsapp: sup.whatsapp || "",
      email: sup.email || "",
      telegram: sup.telegram || "",
      notes: sup.notes || "",
      preferred_payment_method: sup.preferred_payment_method || "UPI QR",
    });
    setShowAddModal(true);
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.name.trim()) {
      showToast("Supplier name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const payload: any = { ...supplierForm };
      if (editingSupplier) {
        payload.id = editingSupplier.id;
      }
      const res = await fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingSupplier ? "Supplier updated" : "Supplier created");
        setShowAddModal(false);
        fetchSuppliers();
      } else {
        showToast(data.error || "Failed to save supplier", "error");
      }
    } catch {
      showToast("Network error saving supplier", "error");
    } finally {
      setSaving(false);
    }
  };

  const openSupplierDrawer = async (sup: Supplier) => {
    setDrawerSupplier(sup);
    setLoadingDrawer(true);
    try {
      const res = await fetch(`/api/admin/suppliers?id=${encodeURIComponent(sup.id)}`);
      // Or load offers from offers API
      const offRes = await fetch(`/api/admin/offers?supplierId=${encodeURIComponent(sup.id)}`);
      const offData = await offRes.json();
      if (offData.success && Array.isArray(offData.offers)) {
        setDrawerOffers(offData.offers);
      }
    } catch {
      // drawer fallback
    } finally {
      setLoadingDrawer(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Supplier Management</h1>
          <p className="text-xs text-[#A6B1C2]">Manage digital sellers, wholesale purchase prices, and procurement rates</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSuppliers}
            className="px-3 py-2 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs font-medium text-[#A6B1C2] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LuRefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openAddModal}
            className="px-3.5 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <LuPlus className="size-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Total Suppliers</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {stats ? stats.totalSuppliers : "—"}
          </div>
          <span className="text-[11px] text-[#A6B1C2] mt-1 block">Registered sourcing channels</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Active Suppliers</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2965E8] mt-1">
            {stats ? stats.activeSuppliers : "—"}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Ready for fulfillment</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Total Purchases</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
            ₹{stats ? stats.totalPurchases.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-[#A6B1C2] mt-1 block">Historical procurement spend</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Outstanding Payables</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 font-mono">
            ₹{stats ? stats.outstandingPayables.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Pending payment to suppliers</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A6B1C2]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers by name, business, or contact person..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs text-white placeholder-[#A6B1C2]/40 focus:outline-none focus:border-[#2965E8]"
          />
        </form>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B101A] text-[#A6B1C2] border-b border-[#1E2837]">
              <tr>
                <th className="py-3 px-4 font-semibold">Supplier Name</th>
                <th className="py-3 px-4 font-semibold">Contact & Channel</th>
                <th className="py-3 px-4 font-semibold">Supplied Items</th>
                <th className="py-3 px-4 font-semibold">Total Purchases</th>
                <th className="py-3 px-4 font-semibold">Payable Due</th>
                <th className="py-3 px-4 font-semibold">Payment Method</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2837] text-white">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#A6B1C2]">
                    No suppliers found matching your query.
                  </td>
                </tr>
              ) : (
                suppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{sup.name}</div>
                      {sup.business_name && (
                        <div className="text-[11px] text-[#A6B1C2]">{sup.business_name}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {sup.contact_person && (
                        <div className="font-medium text-white">{sup.contact_person}</div>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-[#A6B1C2] mt-0.5">
                        {sup.whatsapp && (
                          <span className="flex items-center gap-1 text-[#25D366]">
                            <LuPhone className="size-3" />
                            {sup.whatsapp}
                          </span>
                        )}
                        {sup.telegram && (
                          <span className="flex items-center gap-1 text-sky-400">
                            <LuSend className="size-3" />
                            {sup.telegram}
                          </span>
                        )}
                        {sup.email && (
                          <span className="flex items-center gap-1 text-[#A6B1C2]">
                            <LuMail className="size-3" />
                            {sup.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#2965E8]/20 text-[#2965E8] font-bold">
                        {sup.supplied_products_count || 0} Products
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ₹{(sup.total_purchases_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {(sup.outstanding_balance || 0) > 0 ? (
                        <span className="text-amber-400">₹{sup.outstanding_balance?.toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-400">₹0 (Clear)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#A6B1C2]">
                      {sup.preferred_payment_method || "UPI / Bank"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          sup.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/5 text-[#A6B1C2] border border-[#1E2837]"
                        }`}
                      >
                        {sup.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(sup)}
                          className="p-1.5 rounded-lg bg-[#0B101A] hover:bg-[#1E2837] text-[#A6B1C2] hover:text-white transition-colors cursor-pointer"
                          title="Edit Supplier"
                        >
                          <LuPencil className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT SUPPLIER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-[#151D2B] border border-[#1E2837] shadow-2xl p-6">
            <div className="flex justify-between items-center pb-3 border-b border-[#1E2837] mb-4">
              <h3 className="text-base font-bold text-white">
                {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#A6B1C2] hover:text-white cursor-pointer"
              >
                <LuX className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                    placeholder="e.g. Global Digital Hub"
                    className="w-full h-9 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                    Business / Entity Name
                  </label>
                  <input
                    type="text"
                    value={supplierForm.business_name}
                    onChange={(e) => setSupplierForm({ ...supplierForm, business_name: e.target.value })}
                    placeholder="e.g. GDH Wholesale Ltd"
                    className="w-full h-9 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={supplierForm.contact_person}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full h-9 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#A6B1C2] mb-1">
                    WhatsApp (Private)
                  </label>
                  <input
                    type="text"
                    value={supplierForm.whatsapp}
                    onChange={(e) => setSupplierForm({ ...supplierForm, whatsapp: e.target.value })}
                    placeholder="919811223344"
                    className="w-full h-9 px-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A6B1C2] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    placeholder="seller@domain.com"
                    className="w-full h-9 px-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A6B1C2] mb-1">
                    Telegram
                  </label>
                  <input
                    type="text"
                    value={supplierForm.telegram}
                    onChange={(e) => setSupplierForm({ ...supplierForm, telegram: e.target.value })}
                    placeholder="@seller_handle"
                    className="w-full h-9 px-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Preferred Payment Method
                </label>
                <select
                  value={supplierForm.preferred_payment_method}
                  onChange={(e) => setSupplierForm({ ...supplierForm, preferred_payment_method: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                >
                  <option value="UPI QR">UPI QR / PhonePe / GPay</option>
                  <option value="IMPS / Bank Transfer">IMPS / NEFT Bank Transfer</option>
                  <option value="USDT (TRC20)">USDT (TRC-20)</option>
                  <option value="Cash / Manual">Cash / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Internal Notes (Never Public)
                </label>
                <textarea
                  rows={2}
                  value={supplierForm.notes}
                  onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })}
                  placeholder="Reliability, fast response hours, warranty policy notes..."
                  className="w-full p-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E2837] text-[#A6B1C2] hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingSupplier ? "Update Supplier" : "Create Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
