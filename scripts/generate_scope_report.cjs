const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const DB_PATH = path.resolve(__dirname, '../data/technkt.db');
const db = new DatabaseSync(DB_PATH);

console.log('================================================================');
console.log('   TECHNKT PRODUCTION MIGRATION SCOPE: DEMO/TEST DATA AUDIT     ');
console.log('================================================================\n');

// 1. Categories
const categories = db.prepare('SELECT id, slug, name FROM categories ORDER BY sort_order').all();
console.log(`[GENUINE BASELINE] Categories (${categories.length}):`);
categories.forEach(c => console.log(`  - [${c.id}] ${c.name} (${c.slug})`));

// 2. Products
const products = db.prepare('SELECT id, slug, name, category_id, status FROM products ORDER BY sort_order').all();
console.log(`\n[GENUINE BASELINE] Products (${products.length}):`);
products.forEach(p => console.log(`  - [${p.id}] ${p.name} (cat: ${p.category_id}, status: ${p.status})`));

// 3. Product Variants
const variants = db.prepare('SELECT id, product_id, variant_name, price_amount, comparison_price_amount FROM product_variants ORDER BY product_id').all();
console.log(`\n[GENUINE BASELINE] Product Variants (${variants.length}):`);
variants.forEach(v => console.log(`  - [${v.id}] prod: ${v.product_id} | ${v.variant_name} | ₹${v.price_amount} (was ₹${v.comparison_price_amount})`));

// 4. Marketing Templates
const templates = db.prepare('SELECT id, template_name, channel, is_active FROM marketing_templates').all();
console.log(`\n[GENUINE BASELINE] Marketing Templates (${templates.length}):`);
templates.forEach(t => console.log(`  - [${t.id}] ${t.template_name} (${t.channel}) active: ${t.is_active}`));

// 5. TEST/DEMO CUSTOMERS
const testCustomers = db.prepare('SELECT u.id, u.username, u.display_name, u.status, u.created_at FROM customer_users u').all();
console.log(`\n[DEMO/TEST DATA - EXCLUDE FROM PRODUCTION] Customer Users (${testCustomers.length}):`);
testCustomers.forEach(u => console.log(`  - [${u.id}] username: ${u.username} | display: ${u.display_name} | status: ${u.status} | created: ${u.created_at}`));

// 6. TEST/DEMO ORDERS
const testOrders = db.prepare('SELECT id, public_order_reference, customer_user_id, total_amount, order_status, payment_status, created_at FROM orders').all();
console.log(`\n[DEMO/TEST DATA - EXCLUDE FROM PRODUCTION] Orders (${testOrders.length}):`);
testOrders.forEach(o => console.log(`  - [${o.id}] ref: ${o.public_order_reference} | user: ${o.customer_user_id} | ₹${o.total_amount} | order_status: ${o.order_status} | pay_status: ${o.payment_status}`));

// 7. TEST/DEMO CUSTOMER PAYMENTS
const testPayments = db.prepare('SELECT id, order_id, amount, payment_status, payment_method, payment_reference FROM customer_payments').all();
console.log(`\n[DEMO/TEST DATA - EXCLUDE FROM PRODUCTION] Customer Payments (${testPayments.length}):`);
testPayments.forEach(p => console.log(`  - [${p.id}] order: ${p.order_id} | ₹${p.amount} | status: ${p.payment_status} | ref: ${p.payment_reference}`));

// 8. TEST/DEMO SUPPLIERS
const suppliers = db.prepare('SELECT id, name, contact_person, status FROM suppliers').all();
console.log(`\n[SUPPLIERS REVIEW] Registered Suppliers (${suppliers.length}):`);
suppliers.forEach(s => console.log(`  - [${s.id}] ${s.name} (contact: ${s.contact_person}, status: ${s.status})`));

// 9. TEST/DEMO EXPENSES
const expenses = db.prepare('SELECT id, title, amount, category, expense_date FROM business_expenses').all();
console.log(`\n[DEMO/TEST DATA - EXCLUDE FROM PRODUCTION] Business Expenses (${expenses.length}):`);
expenses.forEach(e => console.log(`  - [${e.id}] ${e.title}: ₹${e.amount} (${e.category}) on ${e.expense_date}`));

// 10. TEST/DEMO COMMUNICATIONS
const comms = db.prepare('SELECT id, order_id, sender_role, message_body FROM order_communications').all();
console.log(`\n[DEMO/TEST DATA - EXCLUDE FROM PRODUCTION] Order Communications (${comms.length}):`);
comms.forEach(c => console.log(`  - [${c.id}] order: ${c.order_id} | ${c.sender_role}: ${c.message_body.slice(0, 40)}...`));

console.log('\n================================================================');
