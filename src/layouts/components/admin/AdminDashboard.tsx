import React, { useState, useEffect } from "react";
import {
  LuLayoutDashboard,
  LuPackage,
  LuShoppingBag,
  LuMessageSquare,
  LuFileSpreadsheet,
  LuHistory,
  LuLogOut,
  LuPlus,
  LuSearch,
  LuCheck,
  LuCopy,
  LuExternalLink,
  LuRefreshCw,
  LuTrash2,
  LuPencil,
  LuCloudUpload,
  LuTriangleAlert,
  LuCircleCheck,
  LuX,
  LuDownload,
  LuScissors,
  LuPhone,
  LuMail,
  LuSend,
  LuZap,
  LuBuilding,
  LuTrendingUp,
  LuBoxes,
  LuCreditCard,
  LuDollarSign,
  LuShieldCheck,
} from "react-icons/lu";
import SuppliersView from "./SuppliersView";
import ProcurementView from "./ProcurementView";
import FinanceView from "./FinanceView";
import OrderDeskDrawer from "./OrderDeskDrawer";
import SimpleProductModal from "./SimpleProductModal";

type AdminTab = "dashboard" | "finance" | "orders" | "products" | "suppliers" | "procurement" | "marketing" | "bulk" | "audit";

export default function AdminDashboard({ initialTab = "dashboard" }: { initialTab?: AdminTab }) {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#0B101A] text-[#F4F6FA] flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/90 border-rose-500/40 text-rose-300"
          }`}
        >
          {toast.type === "success" ? <LuCircleCheck className="size-4 shrink-0 text-emerald-400" /> : <LuTriangleAlert className="size-4 shrink-0 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation - Fixed & Sticky on Desktop */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-[#111724] border-b md:border-b-0 md:border-r border-[#1E2837] p-4 flex md:flex-col justify-between shrink-0 overflow-y-auto z-30">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between mb-6 px-2">
            <a href="/admin" className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-[#2965E8] to-[#937AFF] flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
                N
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">TechNKT</span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#2965E8]">
                  Control Panel V2
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Sections */}
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none space-y-3">
            {/* OVERVIEW */}
            <div>
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-[#A6B1C2]/60 px-3 mb-1.5">
                Overview
              </span>
              <div className="flex md:flex-col gap-1">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuLayoutDashboard className="size-4 shrink-0" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab("finance")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "finance"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuTrendingUp className="size-4 shrink-0" />
                  <span>Profit & Loss</span>
                </button>
              </div>
            </div>

            {/* COMMERCE */}
            <div>
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-[#A6B1C2]/60 px-3 mb-1.5">
                Commerce
              </span>
              <div className="flex md:flex-col gap-1">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuShoppingBag className="size-4 shrink-0" />
                  <span>Orders Desk</span>
                </button>

                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "products"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuPackage className="size-4 shrink-0" />
                  <span>Products</span>
                </button>

                <button
                  onClick={() => setActiveTab("suppliers")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "suppliers"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuBuilding className="size-4 shrink-0" />
                  <span>Suppliers</span>
                </button>

                <button
                  onClick={() => setActiveTab("procurement")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "procurement"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuBoxes className="size-4 shrink-0" />
                  <span>Procurement</span>
                </button>
              </div>
            </div>

            {/* MARKETING */}
            <div>
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-[#A6B1C2]/60 px-3 mb-1.5">
                Marketing
              </span>
              <div className="flex md:flex-col gap-1">
                <button
                  onClick={() => setActiveTab("marketing")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "marketing"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuMessageSquare className="size-4 shrink-0" />
                  <span>WhatsApp Post</span>
                </button>

                <button
                  onClick={() => setActiveTab("bulk")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "bulk"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuFileSpreadsheet className="size-4 shrink-0" />
                  <span>Bulk Rate Update</span>
                </button>
              </div>
            </div>

            {/* MANAGEMENT */}
            <div>
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-[#A6B1C2]/60 px-3 mb-1.5">
                Management
              </span>
              <div className="flex md:flex-col gap-1">
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                    activeTab === "audit"
                      ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
                      : "text-[#A6B1C2] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LuHistory className="size-4 shrink-0" />
                  <span>Audit Logs</span>
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* User & Actions */}
        <div className="pt-4 md:border-t md:border-[#1E2837] flex items-center justify-between">
          <a
            href="/store"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#A6B1C2] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <LuExternalLink className="size-3.5" />
            <span className="hidden md:inline">Public Store</span>
          </a>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LuLogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area - Independent Scrolling */}
      <main className="flex-1 md:h-screen md:overflow-y-auto p-4 sm:p-6 md:p-8">
        {activeTab === "dashboard" && <DashboardView onNavigate={setActiveTab} showToast={showToast} />}
        {activeTab === "finance" && <FinanceView showToast={showToast} />}
        {activeTab === "products" && <ProductsView showToast={showToast} />}
        {activeTab === "orders" && <OrdersView showToast={showToast} />}
        {activeTab === "suppliers" && <SuppliersView showToast={showToast} />}
        {activeTab === "procurement" && <ProcurementView showToast={showToast} />}
        {activeTab === "marketing" && <MarketingView showToast={showToast} />}
        {activeTab === "bulk" && <BulkUpdateView showToast={showToast} />}
        {activeTab === "audit" && <AuditLogsView />}
      </main>
    </div>
  );
}

// ──────────────────────────────────────────
// 1. DASHBOARD VIEW (Real Database Business Metrics)
// ──────────────────────────────────────────
function DashboardView({ onNavigate, showToast }: { onNavigate: (tab: AdminTab) => void; showToast: any }) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/finance");
      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      }
    } catch {
      showToast("Failed to load business metrics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Business Overview</h1>
          <p className="text-xs text-[#A6B1C2]">Store performance, live financial results, and fulfillment queues</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSummary}
            className="px-3 py-2 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs font-medium text-[#A6B1C2] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LuRefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => onNavigate("orders")}
            className="px-3.5 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <LuShoppingBag className="size-3.5" />
            <span>Open Orders Desk</span>
          </button>
        </div>
      </div>

      {/* TOP 8 KPI CARDS AS SPECIFIED IN REQUIREMENT 3 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Orders */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">1. Total Orders</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {summary ? summary.totalOrdersCount : "—"}
          </div>
          <span className="text-[11px] text-[#A6B1C2] mt-1 block">Lifetime order requests</span>
        </div>

        {/* 2. Orders Awaiting Action */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">2. Awaiting Action</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
            {summary ? summary.ordersAwaitingActionCount : "—"}
          </div>
          <span className="text-[11px] text-amber-300/80 mt-1 block">New or awaiting customer reply</span>
        </div>

        {/* 3. Gross Sales / Order Value */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">3. Confirmed Sales</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
            ₹{summary ? summary.confirmedSales.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-[#A6B1C2] mt-1 block">
            Requested: ₹{summary ? summary.requestedOrderValue.toLocaleString() : "0"}
          </span>
        </div>

        {/* 4. Payments Collected */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">4. Payments Collected</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
            ₹{summary ? summary.paymentsCollected.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Actual cash received in UPI/Bank</span>
        </div>

        {/* 5. Product Purchase Cost */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">5. Product COGS</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
            ₹{summary ? summary.cogsFulfilled.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-[#A6B1C2] mt-1 block">Supplier acquisition expense</span>
        </div>

        {/* 6. Gross Profit */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">6. Gross Profit</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
            ₹{summary ? summary.grossProfit.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Revenue minus COGS</span>
        </div>

        {/* 7. Net Profit */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">7. Net Profit</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2965E8] mt-1 font-mono">
            ₹{summary ? summary.netProfit.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-white font-semibold mt-1 block">
            Net Margin: {summary ? summary.netProfitMargin : 0}%
          </span>
        </div>

        {/* 8. Pending Supplier Payments */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">8. Supplier Payables</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 font-mono">
            ₹{summary ? summary.outstandingSupplierPayables.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Owed to sourcing suppliers</span>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate("orders")}
          className="p-5 rounded-2xl bg-[#151D2B] border border-[#1E2837] hover:border-[#2965E8]/60 transition-all text-left group cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-[#2965E8]/10 border border-[#2965E8]/30 text-[#2965E8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <LuShoppingBag className="size-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Orders Desk & Live Chat</h3>
          <p className="text-xs text-[#A6B1C2]">
            Process customer order requests, record manual payments, and chat with customers in-site.
          </p>
        </button>

        <button
          onClick={() => onNavigate("procurement")}
          className="p-5 rounded-2xl bg-[#151D2B] border border-[#1E2837] hover:border-emerald-500/60 transition-all text-left group cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <LuBoxes className="size-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Procurement / Sourcing</h3>
          <p className="text-xs text-[#A6B1C2]">
            Assign suppliers, record wholesale buying prices, and track fulfillment readiness.
          </p>
        </button>

        <button
          onClick={() => onNavigate("finance")}
          className="p-5 rounded-2xl bg-[#151D2B] border border-[#1E2837] hover:border-purple-500/60 transition-all text-left group cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <LuTrendingUp className="size-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Profit & Loss Dashboard</h3>
          <p className="text-xs text-[#A6B1C2]">
            View comprehensive P&L reports, record operating expenses, and export financial CSVs.
          </p>
        </button>
      </div>

      {/* Best Sellers & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-white">Best-Selling Products</h3>
            <button
              onClick={() => onNavigate("products")}
              className="text-xs text-[#2965E8] hover:underline"
            >
              All products &rarr;
            </button>
          </div>
          {summary && summary.bestSellingProducts?.length > 0 ? (
            <div className="space-y-2">
              {summary.bestSellingProducts.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837]">
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[11px] text-[#A6B1C2]">{p.quantity} orders</span>
                  </div>
                  <span className="font-mono font-bold text-white">₹{p.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A6B1C2] py-6 text-center">No sales recorded yet.</p>
          )}
        </div>

        {/* Recent Audit / Store Events */}
        <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-white">Recent System Activity</h3>
            <button
              onClick={() => onNavigate("audit")}
              className="text-xs text-[#2965E8] hover:underline"
            >
              Full log &rarr;
            </button>
          </div>
          {summary && summary.recentActivity?.length > 0 ? (
            <div className="space-y-2">
              {summary.recentActivity.slice(0, 5).map((act: any) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-white text-[11px]">{act.title}</span>
                    <span className="text-[10px] text-[#A6B1C2]">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A6B1C2]">{act.subtitle}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A6B1C2] py-6 text-center">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 2. PRODUCTS VIEW (CRUD, Variants & Image Manager)
// ──────────────────────────────────────────
function ProductsView({ showToast }: { showToast: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [sellerSuggestions, setSellerSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        if (Array.isArray(data.sellers)) {
          setSellerSuggestions(data.sellers);
        }
      }
    } catch {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Product deleted successfully");
        fetchProducts();
      } else {
        showToast(data.error || "Delete failed", "error");
      }
    } catch {
      showToast("Delete request failed", "error");
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.category_id || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.seller_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Product Catalogue</h1>
          <p className="text-xs text-[#A6B1C2]">Simple, beginner-friendly product management with seller tracking and live card preview</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsNew(true);
              setEditingProduct({
                name: "",
                category_id: "subscriptions",
                image_url: "",
                description: "",
                duration: "",
                seller_name: "",
                status: "active",
                variants: [],
              });
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
          >
            <LuPlus className="size-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A6B1C2]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name, category, or seller..."
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs sm:text-sm text-white placeholder-[#A6B1C2]/60 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Product Table */}
      <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111724] text-[#A6B1C2] border-b border-[#1E2837]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Seller (Internal)</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2837]">
              {filteredProducts.map((p) => {
                const minPrice = p.variants?.length
                  ? Math.min(...p.variants.map((v: any) => v.price_amount))
                  : p.price_amount || 0;
                const maxPrice = p.variants?.length
                  ? Math.max(...p.variants.map((v: any) => v.price_amount))
                  : p.price_amount || 0;
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="size-10 rounded-lg object-cover bg-black/40 border border-white/5 shrink-0"
                          />
                        ) : (
                          <div className="size-10 rounded-lg bg-white/5 border border-white/5 shrink-0 flex items-center justify-center text-xs text-[#A6B1C2]">
                            —
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">
                            {p.name || <span className="italic text-[#A6B1C2]/60">Untitled Draft</span>}
                          </div>
                          <div className="text-[11px] text-[#A6B1C2] line-clamp-1">{p.short_description || p.description || p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-[#A6B1C2] border border-[#1E2837]">
                        {p.category_id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.seller_name ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {p.seller_name}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#A6B1C2]/60 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {minPrice > 0 ? (minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} – ₹${maxPrice}`) : <span className="text-emerald-400 text-xs font-semibold">Ask for Price</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          p.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setIsNew(false);
                            setEditingProduct({ ...p });
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-white hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <LuPencil className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <LuTrash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Product Form Modal with Real-Time Live Preview */}
      {editingProduct && (
        <SimpleProductModal
          product={editingProduct}
          isNew={isNew}
          sellerSuggestions={sellerSuggestions}
          onClose={() => setEditingProduct(null)}
          onSaved={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}


// ──────────────────────────────────────────
// 3. ORDERS VIEW (Statuses, Contacts, Fulfillment)
// ──────────────────────────────────────────
function OrdersView({ showToast }: { showToast: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "all" ? "/api/admin/orders" : `/api/admin/orders?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string, paymentStatus?: string, adminNotes?: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus, paymentStatus, adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch {
      showToast("Status update failed", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Customer Orders</h1>
          <p className="text-xs text-[#A6B1C2]">Guest orders, direct customer contact actions, and fulfillment</p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-3 py-2 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs font-medium text-[#A6B1C2] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LuRefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {["all", "new", "awaiting_customer_message", "contacted", "awaiting_payment", "confirmed", "delivered", "cancelled"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 cursor-pointer border ${
              statusFilter === st
                ? "bg-[#2965E8] text-white border-[#2965E8]"
                : "bg-[#151D2B] text-[#A6B1C2] hover:text-white border-[#1E2837]"
            }`}
          >
            {st.replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111724] text-[#A6B1C2] border-b border-[#1E2837]">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer Contact</th>
                <th className="py-3 px-4">Product(s) &amp; Seller (Internal)</th>
                <th className="py-3 px-4">Delivery Channel</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2837]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#2965E8]">
                    {ord.public_order_reference}
                    <div className="text-[10px] text-[#A6B1C2] font-normal font-sans">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{ord.customer_name || "Guest Customer"}</div>
                    <div className="text-[11px] text-[#A6B1C2]">{ord.whatsapp_number || ord.email || ord.telegram_contact || "No contact"}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1.5 min-w-[200px]">
                      {ord.items && ord.items.length > 0 ? (
                        ord.items.map((it: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] pb-1 border-b border-white/[0.04] last:border-b-0 last:pb-0"
                          >
                            <span className="font-semibold text-white truncate max-w-[140px]" title={it.product_name_snapshot}>
                              {it.product_name_snapshot}
                            </span>
                            <span className="inline-flex items-center gap-1 shrink-0">
                              <span className="text-[10px] text-[#A6B1C2]">Seller:</span>
                              {it.seller_name ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  {it.seller_name}
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#A6B1C2]/60 italic">Not assigned</span>
                              )}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-[#A6B1C2]">1 item</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase">
                      {ord.delivery_preference}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400 font-mono">₹{ord.total_amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-white">
                      {ord.order_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-2.5 py-1 rounded-lg bg-[#2965E8]/20 hover:bg-[#2965E8] text-[#2965E8] hover:text-white transition-colors font-medium text-xs cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#A6B1C2]">
                    No orders match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Desk Drawer with Live Messaging and Payment Recording */}
      {selectedOrder && (
        <OrderDeskDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={fetchOrders}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// 3B. ORDER DETAIL MODAL
// ──────────────────────────────────────────
function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  showToast,
}: {
  order: any;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string, paymentStatus?: string, notes?: string) => Promise<void>;
  showToast: any;
}) {
  const [status, setStatus] = useState(order.order_status);
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [notes, setNotes] = useState(order.admin_notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateStatus(order.id, status, paymentStatus, notes);
    setSaving(false);
  };

  const cleanPhone = order.whatsapp_number ? order.whatsapp_number.replace(/\D/g, "") : "";
  const waLink = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${order.customer_name || "there"}, this is TechNKT regarding your order #${order.public_order_reference}.`)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#151D2B] border border-[#1E2837] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1E2837] flex items-center justify-between bg-[#111724]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Order #{order.public_order_reference}
            </h2>
            <span className="text-xs text-[#A6B1C2]">{new Date(order.created_at).toLocaleString()}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#A6B1C2] hover:text-white cursor-pointer">
            <LuX className="size-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Customer & Delivery Channel */}
          <div className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[#A6B1C2] block mb-1">Customer Name</span>
              <span className="font-semibold text-white text-sm">{order.customer_name || "Guest Customer"}</span>
            </div>
            <div>
              <span className="text-[#A6B1C2] block mb-1">Preferred Channel</span>
              <span className="font-bold uppercase text-blue-400">{order.delivery_preference}</span>
            </div>
            <div>
              <span className="text-[#A6B1C2] block mb-1">WhatsApp Number</span>
              <span className="font-mono text-white">{order.whatsapp_number || "None"}</span>
            </div>
            <div>
              <span className="text-[#A6B1C2] block mb-1">Email / Telegram</span>
              <span className="font-mono text-white">{order.email || order.telegram_contact || "None"}</span>
            </div>
          </div>

          {/* Quick Direct Contact Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LuPhone className="size-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
            {order.email && (
              <a
                href={`mailto:${order.email}?subject=TechNKT Order #${order.public_order_reference}`}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LuMail className="size-3.5" />
                <span>Send Email</span>
              </a>
            )}
            {order.telegram_contact && (
              <a
                href={`https://t.me/${order.telegram_contact.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LuSend className="size-3.5" />
                <span>Open Telegram</span>
              </a>
            )}
          </div>

          {/* Items Breakdown */}
          <div>
            <h4 className="font-bold text-white mb-2">Purchased Items & Snapshot</h4>
            <div className="border border-[#1E2837] rounded-xl overflow-hidden bg-[#0B101A]">
              <table className="w-full text-left">
                <thead className="bg-[#111724] text-[#A6B1C2] border-b border-[#1E2837]">
                  <tr>
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-3">Plan</th>
                    <th className="py-2 px-3">Qty</th>
                    <th className="py-2 px-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2837]">
                  {order.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-2 px-3 font-semibold text-white">{item.product_name_snapshot}</td>
                      <td className="py-2 px-3 text-[#A6B1C2]">{item.variant_name_snapshot}</td>
                      <td className="py-2 px-3 font-mono">{item.quantity}</td>
                      <td className="py-2 px-3 text-right font-bold text-white">₹{item.line_total}</td>
                    </tr>
                  ))}
                  <tr className="bg-white/[0.02] font-bold">
                    <td colSpan={3} className="py-2.5 px-3 text-white">Order Total</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 text-sm">₹{order.total_amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6B1C2] mb-1 font-semibold">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white"
              >
                <option value="new">New</option>
                <option value="awaiting_customer_message">Awaiting Customer Message</option>
                <option value="contacted">Contacted</option>
                <option value="awaiting_payment">Awaiting Payment</option>
                <option value="payment_pending_verification">Payment Pending Verification</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[#A6B1C2] mb-1 font-semibold">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white"
              >
                <option value="unpaid">Unpaid</option>
                <option value="manual_pending">Manual Verification Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#A6B1C2] mb-1 font-semibold">Internal Fulfillment Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Credentials sent, customer remarks, tracking reference..."
                className="w-full p-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#1E2837] flex items-center justify-end gap-3 bg-[#111724]">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-[#A6B1C2] hover:text-white cursor-pointer">
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
          >
            <span>{saving ? "Saving..." : "Save Order Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 4. WHATSAPP MARKETING VIEW (One-Click Generator)
// ──────────────────────────────────────────
function MarketingView({ showToast }: { showToast: any }) {
  const [postText, setPostText] = useState("");
  const [splitPosts, setSplitPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [encodedUrl, setEncodedUrl] = useState("");

  const generatePost = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/marketing");
      const data = await res.json();
      if (data.success) {
        setPostText(data.post);
        setSplitPosts(data.splitPosts || []);
        setProductCount(data.productCount);
        setCategoryCount(data.categoryCount);
        setEncodedUrl(data.encodedWhatsAppUrl);
        showToast("WhatsApp promotional post generated with current database prices!");
      }
    } catch {
      showToast("Failed to generate WhatsApp post", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePost();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard with WhatsApp formatting intact!");
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([postText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TechNKT_WhatsApp_RateList_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded rate list as .txt");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">WhatsApp Marketing Generator</h1>
          <p className="text-xs text-[#A6B1C2]">One-click promotional messages generated from real database prices</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generatePost}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
          >
            <LuRefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Generate Latest Store Post</span>
          </button>
        </div>
      </div>

      {/* Overview Status Bar */}
      <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-[#A6B1C2]">Active Catalogue: <strong className="text-white">{productCount} Products</strong></span>
          <span className="text-[#A6B1C2]">Categories: <strong className="text-white">{categoryCount} Groups</strong></span>
          <span className="text-[#A6B1C2]">Length: <strong className="text-white">{postText.length} Characters</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(postText)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-[#1E2837]"
          >
            <LuCopy className="size-3.5" />
            <span>Copy Complete Post</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-[#1E2837]"
          >
            <LuDownload className="size-3.5" />
            <span>Download .TXT</span>
          </button>

          <a
            href={encodedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LuPhone className="size-3.5" />
            <span>Open WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Editable Live Preview Textarea */}
      <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] p-5">
        <label className="block text-xs font-semibold text-white mb-2 flex items-center justify-between">
          <span>Live Formatted Preview (Editable Before Copy)</span>
          <span className="text-[11px] text-[#A6B1C2] font-normal">Edits made here do not overwrite the database.</span>
        </label>
        <textarea
          rows={16}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs sm:text-sm font-mono text-[#F4F6FA] leading-relaxed focus:outline-none focus:border-[#2965E8]"
        />
      </div>

      {/* Split Posts Section (if post is long) */}
      {splitPosts.length > 0 && (
        <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <LuScissors className="size-4" />
            <span>Split Long Post Mode ({splitPosts.length} Consecutive Parts at Category Boundaries)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {splitPosts.map((part, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Part {idx + 1} of {splitPosts.length}</span>
                    <button
                      onClick={() => handleCopy(part)}
                      className="text-xs text-[#2965E8] hover:text-[#3D75F0] flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <LuCopy className="size-3" />
                      <span>Copy Part {idx + 1}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-[#A6B1C2] whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {part}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// 5. BULK RATE LIST UPDATE VIEW (WhatsApp Text to DB)
// ──────────────────────────────────────────
function BulkUpdateView({ showToast }: { showToast: any }) {
  const [rawText, setRawText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [diffs, setDiffs] = useState<any[]>([]);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [applying, setApplying] = useState(false);
  const [recentBatches, setRecentBatches] = useState<any[]>([]);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/admin/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_batches" }),
      });
      const data = await res.json();
      if (data.success) {
        setRecentBatches(data.batches);
      }
    } catch {}
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleAnalyze = async () => {
    if (!rawText.trim()) {
      showToast("Please paste rate list text first", "error");
      return;
    }

    try {
      setAnalyzing(true);
      const res = await fetch("/api/admin/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "parse", rawText }),
      });
      const data = await res.json();

      if (data.success) {
        setDiffs(data.diffs || []);
        setBatchId(data.batchId || null);

        // Auto-select safe price changes
        const safeIds = data.diffs
          .filter((d: any) => d.status === "PRICE_CHANGE" && d.confidence === "HIGH")
          .map((d: any) => d.id);
        setSelectedIds(safeIds);

        showToast(`Parsed ${data.totalParsed} lines. Found ${data.priceChangesCount} price modifications.`);
      } else {
        showToast(data.error || "Parsing failed", "error");
      }
    } catch {
      showToast("Analysis failed", "error");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = async () => {
    if (!batchId) {
      showToast("No active batch to apply", "error");
      return;
    }

    try {
      setApplying(true);
      const res = await fetch("/api/admin/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "apply", batchId, approvedChangeIds: [] }),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message);
        setDiffs([]);
        setBatchId(null);
        setRawText("");
        fetchBatches();
      } else {
        showToast(data.error || "Apply failed", "error");
      }
    } catch {
      showToast("Apply request failed", "error");
    } finally {
      setApplying(false);
    }
  };

  const handleRollback = async (bId: string) => {
    if (!confirm(`Are you sure you want to rollback batch ${bId}? This will restore the previous prices.`)) return;

    try {
      const res = await fetch("/api/admin/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback", batchId: bId }),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message);
        fetchBatches();
      } else {
        showToast(data.error || "Rollback failed", "error");
      }
    } catch {
      showToast("Rollback error", "error");
    }
  };

  const sampleRateList = `*🔥 NKT TECH SHOP 🔥*
*🎬 OTT & Entertainment*
✅ Netflix 4K – 1M (1 Screen) @ ₹80/-
✅ Amazon Prime Video – 1M @ ₹49/- | 6M @ ₹169/-
✅ Hotstar – 1M @ ₹89/-

*🤖 AI Tools*
✅ ChatGPT Plus – 1M @ ₹449/-
✅ Canva Pro – 1YR @ ₹179/-`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Bulk Product Update</h1>
          <p className="text-xs text-[#A6B1C2]">Paste WhatsApp promotional text to auto-detect and update store prices</p>
        </div>
      </div>

      {/* Editor Card */}
      <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white">Paste Your Updated Rate List</label>
          <button
            type="button"
            onClick={() => setRawText(sampleRateList)}
            className="text-[11px] text-[#2965E8] hover:text-[#3D75F0] font-semibold cursor-pointer"
          >
            Insert Sample Rate List
          </button>
        </div>

        <textarea
          rows={8}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste your WhatsApp message here (e.g. ✅ Netflix 4K – 1M @ ₹80/- | Prime Video – 1M @ ₹49/-)..."
          className="w-full p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs sm:text-sm font-mono text-[#F4F6FA] focus:outline-none focus:border-[#2965E8]"
        />

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-[#A6B1C2]">
            Zero destructive edits on paste. The system parses, detects product variants and prices, and awaits your approval.
          </p>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-5 py-2.5 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
          >
            <LuRefreshCw className={`size-3.5 ${analyzing ? "animate-spin" : ""}`} />
            <span>{analyzing ? "Analyzing Rate List..." : "Analyze Rate List"}</span>
          </button>
        </div>
      </div>

      {/* Parsed Diffs Table */}
      {diffs.length > 0 && (
        <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2837]">
            <div>
              <h3 className="text-sm font-bold text-white">Proposed Price & Plan Modifications</h3>
              <p className="text-xs text-[#A6B1C2]">Review detected matches before committing to database</p>
            </div>

            {batchId && (
              <button
                onClick={handleApply}
                disabled={applying}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <LuCheck className="size-4" />
                <span>{applying ? "Committing..." : "Apply Approved Changes to DB"}</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111724] text-[#A6B1C2] border-b border-[#1E2837]">
                <tr>
                  <th className="py-2.5 px-3">Detected Line</th>
                  <th className="py-2.5 px-3">Matched Product</th>
                  <th className="py-2.5 px-3">Variant</th>
                  <th className="py-2.5 px-3">Current Price</th>
                  <th className="py-2.5 px-3">Proposed Price</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2837]">
                {diffs.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#A6B1C2] max-w-xs truncate">{d.sourceLine}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{d.matchedProductName || d.detectedProduct}</td>
                    <td className="py-2.5 px-3 text-[#A6B1C2]">{d.matchedVariantName || d.proposedDuration || "—"}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{d.currentPrice ? `₹${d.currentPrice}` : "—"}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      {d.proposedPrice ? `₹${d.proposedPrice}` : "None"}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          d.status === "PRICE_CHANGE"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : d.status === "NEW_PRODUCT"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : d.status === "UNCHANGED"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-bold text-[#A6B1C2]">{d.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rollback & Batch History */}
      <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] p-5 space-y-3">
        <h3 className="text-sm font-bold text-white">Recent Bulk Update Batches & Safe Rollback</h3>
        <p className="text-xs text-[#A6B1C2]">Every bulk rate update is logged with original values for instant one-click restoration.</p>

        <div className="border border-[#1E2837] rounded-xl overflow-hidden bg-[#0B101A]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111724] text-[#A6B1C2] border-b border-[#1E2837]">
              <tr>
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Changes Count</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2837]">
              {recentBatches.map((b) => (
                <tr key={b.id}>
                  <td className="py-2.5 px-3 font-mono text-[#2965E8]">{b.id}</td>
                  <td className="py-2.5 px-3 text-[#A6B1C2]">{new Date(b.created_at).toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{b.changes_count} modifications</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-white uppercase">
                      {b.review_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {b.review_status === "committed" && (
                      <button
                        onClick={() => handleRollback(b.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
                      >
                        Restore Original Prices
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {recentBatches.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-[#A6B1C2]">
                    No previous bulk updates recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 6. AUDIT LOGS VIEW
// ──────────────────────────────────────────
function AuditLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">System Audit Log</h1>
          <p className="text-xs text-[#A6B1C2]">Immutable record of admin logins, product edits, bulk updates, and order changes</p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3 py-2 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs font-medium text-[#A6B1C2] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LuRefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111724] text-[#A6B1C2] border-b border-[#1E2837]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2837]">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 text-[#A6B1C2] font-mono text-[11px]">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{l.admin_user_id}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#A6B1C2] uppercase text-[10px]">{l.entity_type}</td>
                  <td className="py-3 px-4 text-white font-medium">{l.change_summary}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#A6B1C2]">
                    No audit records logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
