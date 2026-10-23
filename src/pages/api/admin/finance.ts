import type { APIRoute } from "astro";
import { authenticateAdmin } from "../../../lib/auth";
import {
  getFinancialSummary,
  getAllBusinessExpenses,
  createBusinessExpense,
  deleteBusinessExpense,
} from "../../../lib/db/queries";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const startDate = url.searchParams.get("startDate") || undefined;
  const endDate = url.searchParams.get("endDate") || undefined;

  const summary = await getFinancialSummary(startDate, endDate);
  const expenses = await getAllBusinessExpenses(startDate, endDate);

  return new Response(
    JSON.stringify({ success: true, summary, expenses }),
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
    const { category, amount, expenseDate, notes } = body;

    if (!category || !amount || Number(amount) <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Valid category and expense amount are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const expense = await createBusinessExpense(category, Number(amount), expenseDate, notes, "admin");

    return new Response(
      JSON.stringify({ success: true, expense, message: "Expense recorded successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Expense creation error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to record expense" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  if (!(await authenticateAdmin(request))) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(
      JSON.stringify({ success: false, error: "Expense ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  await deleteBusinessExpense(id);
  return new Response(
    JSON.stringify({ success: true, message: "Expense deleted" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
