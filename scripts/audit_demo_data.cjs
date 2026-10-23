const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const dbPath = path.resolve(process.cwd(), "data/technkt.db");
const db = new DatabaseSync(dbPath);

console.log("==================================================");
console.log("   SQLITE DETAILED DATA AUDIT (DEMO & TEST SCOPE) ");
console.log("==================================================");

// 1. Customer Users
const users = db.prepare("SELECT u.id, u.username, u.status, u.created_at, p.optional_whatsapp, p.optional_email, p.preferred_contact_method FROM customer_users u LEFT JOIN customer_profiles p ON u.id = p.user_id").all();
console.log("\n--- CUSTOMER USERS (Total: " + users.length + ") ---");
console.table(users);

// 2. Orders
const orders = db.prepare(`
  SELECT o.id, o.public_order_reference, o.customer_user_id, o.delivery_preference, o.total_amount, o.order_status, o.payment_status, o.created_at, gc.customer_name, gc.whatsapp_number
  FROM orders o
  LEFT JOIN guest_contacts gc ON o.guest_contact_id = gc.id
`).all();
console.log("\n--- ORDERS (Total: " + orders.length + ") ---");
console.table(orders);

// 3. Suppliers
const suppliers = db.prepare("SELECT id, name, business_name, contact_person, whatsapp, email, telegram, status, created_at FROM suppliers").all();
console.log("\n--- SUPPLIERS (Total: " + suppliers.length + ") ---");
console.table(suppliers);

// 4. Procurements
const procurements = db.prepare(`
  SELECT pr.id, pr.order_id, pr.supplier_id, s.name as supplier_name, pr.expected_cost_amount, pr.actual_cost_amount, pr.procurement_status, pr.supplier_payment_status
  FROM procurements pr
  LEFT JOIN suppliers s ON pr.supplier_id = s.id
`).all();
console.log("\n--- PROCUREMENTS (Total: " + procurements.length + ") ---");
console.table(procurements);

// 5. Customer Payments
const custPayments = db.prepare("SELECT id, order_id, amount, payment_status, payment_method, reference, recorded_by, created_at FROM customer_payments").all();
console.log("\n--- CUSTOMER PAYMENTS (Total: " + custPayments.length + ") ---");
console.table(custPayments);

// 6. Business Expenses
const expenses = db.prepare("SELECT id, category, amount, expense_date, notes, created_by, created_at FROM business_expenses").all();
console.log("\n--- BUSINESS EXPENSES (Total: " + expenses.length + ") ---");
console.table(expenses);

// 7. Import Batches
const batches = db.prepare("SELECT id, submitted_by, changes_count, review_status, created_at FROM import_batches").all();
console.log("\n--- IMPORT BATCHES (Total: " + batches.length + ") ---");
console.table(batches);

// 8. Messages
const messages = db.prepare("SELECT id, conversation_id, sender_role, sender_id, message, created_at FROM order_messages").all();
console.log("\n--- ORDER MESSAGES (Total: " + messages.length + ") ---");
console.table(messages);
