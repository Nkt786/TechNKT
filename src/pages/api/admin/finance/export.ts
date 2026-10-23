import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../../lib/auth";
import {
  getOrders,
  getAllProcurements,
  getAllBusinessExpenses,
  getFinancialSummary,
} from "../../../../lib/db/queries";

export const prerender = false;

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const exportType = url.searchParams.get("type") || "orders";
  let csvContent = "";
  let filename = `technkt_${exportType}_export_${new Date().toISOString().split("T")[0]}.csv`;

  if (exportType === "orders") {
    const { orders } = await getOrders({ limit: 1000 });
    const headers = [
      "Order Reference",
      "Customer",
      "Username",
      "Delivery Channel",
      "Total (INR)",
      "Order Status",
      "Payment Status",
      "Items Count",
      "Date",
    ];
    const rows = orders.map((o) => [
      escapeCsv(o.public_order_reference),
      escapeCsv(o.customer_name),
      escapeCsv(o.customer_username || "Guest"),
      escapeCsv(o.delivery_preference),
      escapeCsv(o.total_amount),
      escapeCsv(o.order_status),
      escapeCsv(o.payment_status),
      escapeCsv(o.items?.length || 0),
      escapeCsv(o.created_at),
    ]);
    csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  } else if (exportType === "procurements") {
    const procurements = await getAllProcurements();
    const headers = [
      "Procurement ID",
      "Order Reference",
      "Product",
      "Variant",
      "Supplier",
      "Expected Cost",
      "Actual Cost",
      "Selling Price",
      "Procurement Status",
      "Supplier Payment",
      "Date",
    ];
    const rows = procurements.map((p) => [
      escapeCsv(p.id),
      escapeCsv(p.order_reference),
      escapeCsv(p.product_name),
      escapeCsv(p.variant_name),
      escapeCsv(p.supplier_name || "Unassigned"),
      escapeCsv(p.expected_cost_amount ?? ""),
      escapeCsv(p.actual_cost_amount ?? ""),
      escapeCsv(p.selling_price_snapshot ?? ""),
      escapeCsv(p.procurement_status),
      escapeCsv(p.supplier_payment_status),
      escapeCsv(p.created_at),
    ]);
    csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  } else if (exportType === "expenses") {
    const expenses = await getAllBusinessExpenses();
    const headers = ["ID", "Category", "Amount (INR)", "Expense Date", "Notes", "Created By"];
    const rows = expenses.map((e) => [
      escapeCsv(e.id),
      escapeCsv(e.category),
      escapeCsv(e.amount),
      escapeCsv(e.expense_date),
      escapeCsv(e.notes || ""),
      escapeCsv(e.created_by || ""),
    ]);
    csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  } else {
    // PnL Summary Report
    const summary = await getFinancialSummary();
    const rows = [
      ["Metric", "Value (INR)"],
      ["Requested Order Value", summary.requestedOrderValue],
      ["Confirmed Realized Sales", summary.confirmedSales],
      ["Payments Collected", summary.paymentsCollected],
      ["Cost of Goods Sold (Fulfilled)", summary.cogsFulfilled],
      ["Gross Profit", summary.grossProfit],
      ["Operating Expenses", summary.expensesTotal],
      ["Net Profit", summary.netProfit],
      ["Net Profit Margin %", `${summary.netProfitMargin}%`],
      ["Outstanding Receivables", summary.outstandingReceivables],
      ["Outstanding Supplier Payables", summary.outstandingSupplierPayables],
    ];
    csvContent = rows.map((r) => r.map(escapeCsv).join(",")).join("\n");
    filename = `technkt_pnl_summary_${new Date().toISOString().split("T")[0]}.csv`;
  }

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
};
