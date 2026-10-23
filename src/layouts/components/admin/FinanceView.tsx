import React, { useState, useEffect } from "react";
import {
  LuRefreshCw,
  LuDownload,
  LuPlus,
  LuTrash2,
  LuDollarSign,
  LuTrendingUp,
  LuTrendingDown,
  LuCalendar,
  LuChartPie as LuPieChart,
  LuCreditCard,
  LuTriangleAlert as LuAlertTriangle,
  LuCircleCheck as LuCheckCircle,
  LuX,
} from "react-icons/lu";

interface FinancialSummary {
  period: string;
  requestedOrderValue: number;
  confirmedSales: number;
  paymentsCollected: number;
  cogsFulfilled: number;
  cogsEstimated: number;
  grossProfit: number;
  expensesTotal: number;
  netProfit: number;
  netProfitMargin: number;
  outstandingReceivables: number;
  outstandingSupplierPayables: number;
  missingCostCount: number;
  totalOrdersCount: number;
  ordersAwaitingActionCount: number;
  ordersByStatus: Record<string, number>;
  bestSellingProducts: Array<{ name: string; quantity: number; revenue: number }>;
  supplierSpending: Array<{ supplierName: string; totalAmount: number; count: number }>;
  recentActivity: Array<{ id: string; type: string; title: string; subtitle: string; timestamp: string }>;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export default function FinanceView({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"all" | "today" | "7d" | "30d">("all");

  // Expense Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState("Software & Tool Subscriptions");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenseNotes, setExpenseNotes] = useState("");
  const [savingExpense, setSavingExpense] = useState(false);

  const fetchFinance = async () => {
    try {
      setLoading(true);
      let startDate: string | undefined;
      let endDate: string | undefined;
      const now = new Date();

      if (dateRange === "today") {
        startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        endDate = new Date().toISOString();
      } else if (dateRange === "7d") {
        const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        startDate = past.toISOString();
        endDate = new Date().toISOString();
      } else if (dateRange === "30d") {
        const past = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        startDate = past.toISOString();
        endDate = new Date().toISOString();
      }

      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/admin/finance?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setExpenses(data.expenses);
      }
    } catch {
      showToast("Failed to load financial records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, [dateRange]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      showToast("Enter a valid expense amount", "error");
      return;
    }
    setSavingExpense(true);
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: expenseCategory,
          amount: Number(expenseAmount),
          expenseDate,
          notes: expenseNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Expense recorded successfully");
        setShowExpenseModal(false);
        setExpenseAmount("");
        setExpenseNotes("");
        fetchFinance();
      } else {
        showToast(data.error || "Failed to record expense", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recorded expense?")) return;
    try {
      const res = await fetch(`/api/admin/finance?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Expense deleted");
        fetchFinance();
      }
    } catch {
      showToast("Failed to delete expense", "error");
    }
  };

  const handleExport = (type: string) => {
    window.open(`/api/admin/finance/export?type=${type}`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Profit & Loss / Finance Desk</h1>
          <p className="text-xs text-[#A6B1C2]">
            Realized commercial revenue, actual procurement costs, and operating expenses
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="p-1 bg-[#151D2B] rounded-xl border border-[#1E2837] flex gap-1">
            <button
              onClick={() => setDateRange("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                dateRange === "today" ? "bg-[#2965E8] text-white" : "text-[#A6B1C2] hover:text-white"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange("7d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                dateRange === "7d" ? "bg-[#2965E8] text-white" : "text-[#A6B1C2] hover:text-white"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange("30d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                dateRange === "30d" ? "bg-[#2965E8] text-white" : "text-[#A6B1C2] hover:text-white"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateRange("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                dateRange === "all" ? "bg-[#2965E8] text-white" : "text-[#A6B1C2] hover:text-white"
              }`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={fetchFinance}
            className="p-2 rounded-xl bg-[#151D2B] border border-[#1E2837] text-[#A6B1C2] hover:text-white cursor-pointer"
            title="Refresh Financials"
          >
            <LuRefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="px-3.5 py-2 rounded-xl bg-[#151D2B] hover:bg-[#1E2837] border border-[#1E2837] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer">
              <LuDownload className="size-3.5" />
              <span>Export CSV</span>
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#151D2B] border border-[#1E2837] shadow-2xl py-1 z-30">
              <button
                onClick={() => handleExport("pnl")}
                className="w-full text-left px-3 py-2 text-xs text-[#A6B1C2] hover:text-white hover:bg-[#1E2837] cursor-pointer"
              >
                P&L Summary Report
              </button>
              <button
                onClick={() => handleExport("orders")}
                className="w-full text-left px-3 py-2 text-xs text-[#A6B1C2] hover:text-white hover:bg-[#1E2837] cursor-pointer"
              >
                Orders Breakdown
              </button>
              <button
                onClick={() => handleExport("procurements")}
                className="w-full text-left px-3 py-2 text-xs text-[#A6B1C2] hover:text-white hover:bg-[#1E2837] cursor-pointer"
              >
                Procurements / Costs
              </button>
              <button
                onClick={() => handleExport("expenses")}
                className="w-full text-left px-3 py-2 text-xs text-[#A6B1C2] hover:text-white hover:bg-[#1E2837] cursor-pointer"
              >
                Operating Expenses
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <LuPlus className="size-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Row 1: Primary Revenue & Profit KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Confirmed Realized Sales */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Confirmed Sales</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
            ₹{summary ? summary.confirmedSales.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-[#A6B1C2] mt-1 block">
            Requested: ₹{summary ? summary.requestedOrderValue.toLocaleString() : "0"}
          </span>
        </div>

        {/* Cost of Goods Sold (Fulfilled) */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Procurement Cost (COGS)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
            ₹{summary ? summary.cogsFulfilled.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-[#A6B1C2] mt-1 block">
            Supplier acquisition cost
          </span>
        </div>

        {/* Gross Profit */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Gross Profit</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-mono flex items-center gap-1.5">
            <LuTrendingUp className="size-5 shrink-0" />
            <span>₹{summary ? summary.grossProfit.toLocaleString() : "0"}</span>
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Revenue minus Supplier COGS
          </span>
        </div>

        {/* Net Profit */}
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Net Profit</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2965E8] mt-1 font-mono flex items-center gap-1.5">
            <LuDollarSign className="size-5 shrink-0" />
            <span>₹{summary ? summary.netProfit.toLocaleString() : "0"}</span>
          </div>
          <span className="text-[11px] text-white font-semibold mt-1 block">
            Margin: {summary ? summary.netProfitMargin : 0}%
          </span>
        </div>
      </div>

      {/* Row 2: Secondary Cash Flow & Payables */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Payments Collected (Cash)</span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono">
            ₹{summary ? summary.paymentsCollected.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-emerald-400 mt-0.5 block">Recorded in bank/UPI</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Operating Expenses</span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1 font-mono">
            ₹{summary ? summary.expensesTotal.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-[#A6B1C2] mt-0.5 block">Gateway, tools & ads</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Customer Receivables</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 font-mono">
            ₹{summary ? summary.outstandingReceivables.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-amber-400/80 mt-0.5 block">Pending customer collection</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#151D2B] border border-[#1E2837]">
          <span className="text-xs font-medium text-[#A6B1C2]">Supplier Payables</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 font-mono">
            ₹{summary ? summary.outstandingSupplierPayables.toLocaleString() : "0"}
          </div>
          <span className="text-[11px] text-amber-400/80 mt-0.5 block">Owed to sourcing suppliers</span>
        </div>
      </div>

      {/* Row 3: Best Sellers & Supplier Spend breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837]">
          <h3 className="text-sm font-bold text-white mb-3">Best-Selling Products by Revenue</h3>
          {summary && summary.bestSellingProducts.length > 0 ? (
            <div className="space-y-2">
              {summary.bestSellingProducts.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837]">
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[11px] text-[#A6B1C2]">{p.quantity} units ordered</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    ₹{p.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A6B1C2] py-6 text-center">No sales data recorded for this period.</p>
          )}
        </div>

        {/* Supplier Spending Breakdown */}
        <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837]">
          <h3 className="text-sm font-bold text-white mb-3">Supplier Sourcing Spend</h3>
          {summary && summary.supplierSpending.length > 0 ? (
            <div className="space-y-2">
              {summary.supplierSpending.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837]">
                  <div>
                    <span className="font-bold text-white block">{s.supplierName}</span>
                    <span className="text-[11px] text-[#A6B1C2]">{s.count} procurements</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    ₹{s.totalAmount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A6B1C2] py-6 text-center">No supplier spending records found.</p>
          )}
        </div>
      </div>

      {/* Row 4: Expense Manager */}
      <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837] space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#1E2837]">
          <div>
            <h3 className="text-sm font-bold text-white">Business Expenses Manager</h3>
            <p className="text-xs text-[#A6B1C2]">Recorded operating expenses subtracted in Net Profit</p>
          </div>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
          >
            <LuPlus className="size-3.5" />
            <span>Add Expense</span>
          </button>
        </div>

        {expenses.length === 0 ? (
          <p className="text-xs text-[#A6B1C2] py-6 text-center">No operating expenses recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B101A] text-[#A6B1C2] border-b border-[#1E2837]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Notes / Description</th>
                  <th className="py-2.5 px-3 font-semibold">Amount</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2837] text-white">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-mono text-[#A6B1C2]">{exp.expense_date}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{exp.category}</td>
                    <td className="py-2.5 px-3 text-[#A6B1C2]">{exp.notes || "—"}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-400">
                      -₹{exp.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1 rounded text-[#A6B1C2] hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Expense"
                      >
                        <LuTrash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#151D2B] border border-[#1E2837] shadow-2xl p-6">
            <div className="flex justify-between items-center pb-3 border-b border-[#1E2837] mb-4">
              <h3 className="text-base font-bold text-white">Record Business Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-[#A6B1C2] hover:text-white cursor-pointer">
                <LuX className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Expense Category *
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                >
                  <option value="Software & Tool Subscriptions">Software & Tool Subscriptions</option>
                  <option value="Payment Gateway Fees">Payment Gateway Fees</option>
                  <option value="Marketing & Advertisements">Marketing & Advertisements</option>
                  <option value="Server & Infrastructure">Server & Infrastructure</option>
                  <option value="Other Operating Expense">Other Operating Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Description / Receipt Notes
                </label>
                <textarea
                  rows={2}
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="Monthly server invoice, Meta ads billing..."
                  className="w-full p-2.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E2837] text-[#A6B1C2] hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="px-5 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {savingExpense ? "Recording..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
