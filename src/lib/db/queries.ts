import { db, type DatabaseExecutor } from "./index";
import crypto from "node:crypto";

export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  marketing_heading: string | null;
  sort_order: number;
  status: string;
}

export interface VariantRecord {
  id: string;
  product_id: string;
  variant_name: string;
  duration_value: number;
  duration_unit: string;
  validity_description: string | null;
  price_amount: number;
  comparison_price_amount: number;
  currency: string;
  warranty_description: string | null;
  delivery_description: string | null;
  activation_description: string | null;
  availability: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  image_url: string;
  short_description: string | null;
  description: string | null;
  badge: string | null;
  instant: number;
  status: string;
  featured: number;
  sort_order: number;
  marketing_title: string | null;
  marketing_category: string | null;
  marketing_description: string | null;
  include_in_marketing: number;
  created_at: string;
  updated_at: string;
  variants?: VariantRecord[];
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  product_variant_id: string;
  product_name_snapshot: string;
  variant_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
}

export interface OrderRecord {
  id: string;
  public_order_reference: string;
  guest_contact_id: string;
  customer_user_id?: string | null;
  customer_username?: string | null;
  delivery_preference: string;
  order_source: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  currency: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  customer_name?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  telegram_contact?: string | null;
  items?: OrderItemRecord[];
}

// ──────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────
export async function getCategories(): Promise<CategoryRecord[]> {
  return await db.query<CategoryRecord>(
    `SELECT * FROM categories WHERE status = 'active' ORDER BY sort_order ASC, name ASC`
  );
}

// ──────────────────────────────────────────
// PRODUCTS & VARIANTS
// ──────────────────────────────────────────
export async function getProducts(options?: {
  category?: string;
  status?: string;
  search?: string;
  includeDrafts?: boolean;
}): Promise<ProductRecord[]> {
  let query = `SELECT * FROM products WHERE 1=1`;
  const params: any[] = [];

  if (options?.status) {
    query += ` AND status = ?`;
    params.push(options.status);
  } else if (!options?.includeDrafts) {
    query += ` AND status = 'active'`;
  }

  if (options?.category && options.category !== "all") {
    query += ` AND category_id = ?`;
    params.push(options.category);
  }

  if (options?.search && options.search.trim()) {
    query += ` AND (name LIKE ? OR description LIKE ? OR short_description LIKE ?)`;
    const s = `%${options.search.trim()}%`;
    params.push(s, s, s);
  }

  query += ` ORDER BY sort_order ASC, featured DESC, created_at DESC`;

  const products = (await db.query<ProductRecord>(query, params)) || [];

  for (const prod of products) {
    prod.variants = await db.query<VariantRecord>(
      `SELECT * FROM product_variants WHERE product_id = ? ORDER BY price_amount ASC`,
      [prod.id]
    );
  }

  return products;
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const product = await db.get<ProductRecord>(`SELECT * FROM products WHERE id = ?`, [id]);
  if (!product) return null;

  product.variants = await db.query<VariantRecord>(
    `SELECT * FROM product_variants WHERE product_id = ? ORDER BY price_amount ASC`,
    [product.id]
  );
  return product;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const product = await db.get<ProductRecord>(`SELECT * FROM products WHERE slug = ?`, [slug]);
  if (!product) return null;

  product.variants = await db.query<VariantRecord>(
    `SELECT * FROM product_variants WHERE product_id = ? ORDER BY price_amount ASC`,
    [product.id]
  );
  return product;
}

export async function createProduct(data: {
  id?: string;
  slug: string;
  name: string;
  category_id: string;
  image_url: string;
  short_description?: string;
  description?: string;
  badge?: string;
  instant?: boolean;
  status?: string;
  featured?: boolean;
  sort_order?: number;
  marketing_title?: string;
  marketing_category?: string;
  marketing_description?: string;
  include_in_marketing?: boolean;
}): Promise<ProductRecord> {
  const id = data.id || `prod_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO products (
      id, slug, name, category_id, image_url, short_description, description,
      badge, instant, status, featured, sort_order,
      marketing_title, marketing_category, marketing_description, include_in_marketing,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.slug,
      data.name,
      data.category_id,
      data.image_url,
      data.short_description || null,
      data.description || null,
      data.badge || null,
      data.instant !== false ? 1 : 0,
      data.status || "active",
      data.featured ? 1 : 0,
      data.sort_order || 0,
      data.marketing_title || data.name,
      data.marketing_category || null,
      data.marketing_description || null,
      data.include_in_marketing !== false ? 1 : 0,
      now,
      now,
    ]
  );

  return (await getProductById(id))!;
}

export async function updateProduct(
  id: string,
  data: Partial<{
    slug: string;
    name: string;
    category_id: string;
    image_url: string;
    short_description: string;
    description: string;
    badge: string;
    instant: boolean;
    status: string;
    featured: boolean;
    sort_order: number;
    marketing_title: string;
    marketing_category: string;
    marketing_description: string;
    include_in_marketing: boolean;
  }>
): Promise<ProductRecord | null> {
  const existing = await getProductById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  await db.run(
    `UPDATE products SET
      slug = COALESCE(?, slug),
      name = COALESCE(?, name),
      category_id = COALESCE(?, category_id),
      image_url = COALESCE(?, image_url),
      short_description = COALESCE(?, short_description),
      description = COALESCE(?, description),
      badge = COALESCE(?, badge),
      instant = COALESCE(?, instant),
      status = COALESCE(?, status),
      featured = COALESCE(?, featured),
      sort_order = COALESCE(?, sort_order),
      marketing_title = COALESCE(?, marketing_title),
      marketing_category = COALESCE(?, marketing_category),
      marketing_description = COALESCE(?, marketing_description),
      include_in_marketing = COALESCE(?, include_in_marketing),
      updated_at = ?
    WHERE id = ?`,
    [
      data.slug ?? null,
      data.name ?? null,
      data.category_id ?? null,
      data.image_url ?? null,
      data.short_description ?? null,
      data.description ?? null,
      data.badge ?? null,
      data.instant !== undefined ? (data.instant ? 1 : 0) : null,
      data.status ?? null,
      data.featured !== undefined ? (data.featured ? 1 : 0) : null,
      data.sort_order ?? null,
      data.marketing_title ?? null,
      data.marketing_category ?? null,
      data.marketing_description ?? null,
      data.include_in_marketing !== undefined ? (data.include_in_marketing ? 1 : 0) : null,
      now,
      id,
    ]
  );

  return await getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await db.run(`DELETE FROM products WHERE id = ?`, [id]);
  return Number(res.changes) > 0;
}

// ──────────────────────────────────────────
// VARIANTS
// ──────────────────────────────────────────
export async function createVariant(data: {
  id?: string;
  product_id: string;
  variant_name: string;
  duration_value?: number;
  duration_unit?: string;
  validity_description?: string;
  price_amount: number;
  comparison_price_amount?: number;
  currency?: string;
  warranty_description?: string;
  delivery_description?: string;
  activation_description?: string;
  availability?: string;
}): Promise<VariantRecord> {
  const id = data.id || `var_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO product_variants (
      id, product_id, variant_name, duration_value, duration_unit,
      validity_description, price_amount, comparison_price_amount, currency,
      warranty_description, delivery_description, activation_description,
      availability, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.product_id,
      data.variant_name,
      data.duration_value ?? 1,
      data.duration_unit || "month",
      data.validity_description || null,
      Math.round(data.price_amount),
      Math.round(data.comparison_price_amount || 0),
      data.currency || "INR",
      data.warranty_description || null,
      data.delivery_description || "Instant delivery via selected contact channel",
      data.activation_description || null,
      data.availability || "in_stock",
      now,
      now,
    ]
  );

  return (await db.get<VariantRecord>(`SELECT * FROM product_variants WHERE id = ?`, [id]))!;
}

export async function updateVariant(
  id: string,
  data: Partial<{
    variant_name: string;
    duration_value: number;
    duration_unit: string;
    validity_description: string;
    price_amount: number;
    comparison_price_amount: number;
    currency: string;
    warranty_description: string;
    delivery_description: string;
    activation_description: string;
    availability: string;
  }>
): Promise<VariantRecord | null> {
  const now = new Date().toISOString();
  await db.run(
    `UPDATE product_variants SET
      variant_name = COALESCE(?, variant_name),
      duration_value = COALESCE(?, duration_value),
      duration_unit = COALESCE(?, duration_unit),
      validity_description = COALESCE(?, validity_description),
      price_amount = COALESCE(?, price_amount),
      comparison_price_amount = COALESCE(?, comparison_price_amount),
      currency = COALESCE(?, currency),
      warranty_description = COALESCE(?, warranty_description),
      delivery_description = COALESCE(?, delivery_description),
      activation_description = COALESCE(?, activation_description),
      availability = COALESCE(?, availability),
      updated_at = ?
    WHERE id = ?`,
    [
      data.variant_name ?? null,
      data.duration_value ?? null,
      data.duration_unit ?? null,
      data.validity_description ?? null,
      data.price_amount !== undefined ? Math.round(data.price_amount) : null,
      data.comparison_price_amount !== undefined ? Math.round(data.comparison_price_amount) : null,
      data.currency ?? null,
      data.warranty_description ?? null,
      data.delivery_description ?? null,
      data.activation_description ?? null,
      data.availability ?? null,
      now,
      id,
    ]
  );

  return await db.get<VariantRecord>(`SELECT * FROM product_variants WHERE id = ?`, [id]);
}

export async function deleteVariant(id: string): Promise<boolean> {
  const res = await db.run(`DELETE FROM product_variants WHERE id = ?`, [id]);
  return Number(res.changes) > 0;
}

// ──────────────────────────────────────────
// ORDERS & GUEST CONTACTS
// ──────────────────────────────────────────
export function generateOrderReference(): string {
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `NKT-${randomPart}`;
}

export async function createOrderWithGuestContact(params: {
  customer_name?: string;
  whatsapp_number?: string;
  email?: string;
  telegram_contact?: string;
  delivery_preference: "whatsapp" | "email" | "telegram" | "dashboard" | string;
  customer_user_id?: string;
  customer_notes?: string;
  order_source?: string;
  order_status?: string;
  items: Array<{
    product_id: string;
    variant_id?: string;
    quantity: number;
  }>;
}): Promise<{ order: OrderRecord; items: OrderItemRecord[] }> {
  if (!params.items || params.items.length === 0) {
    throw new Error("Cannot place an order with zero items.");
  }

  // Pre-fetch products and variants to guarantee price integrity
  let computedTotal = 0;
  const validatedLines: Array<{
    product: ProductRecord;
    variant: VariantRecord;
    quantity: number;
    line_total: number;
  }> = [];

  for (const item of params.items) {
    const prod = await getProductById(item.product_id);
    if (!prod) {
      throw new Error(`Product not found: ${item.product_id}`);
    }

    let variant: VariantRecord | undefined;
    if (item.variant_id) {
      variant = prod.variants?.find((v) => v.id === item.variant_id);
    }
    if (!variant && prod.variants && prod.variants.length > 0) {
      variant = prod.variants[0];
    }

    if (!variant) {
      throw new Error(`No available plan found for product: ${prod.name}`);
    }

    const qty = Math.max(1, Math.floor(item.quantity || 1));
    const lineTotal = variant.price_amount * qty;
    computedTotal += lineTotal;

    validatedLines.push({
      product: prod,
      variant,
      quantity: qty,
      line_total: lineTotal,
    });
  }

  const now = new Date().toISOString();
  const guestContactId = `gst_${crypto.randomBytes(6).toString("hex")}`;
  const orderId = `ord_${crypto.randomBytes(6).toString("hex")}`;
  const orderRef = generateOrderReference();

  // ATOMIC DATABASE TRANSACTION
  const insertedItems = await db.transaction(async (tx: DatabaseExecutor) => {
    // 1. Insert contact
    await tx.run(
      `INSERT INTO guest_contacts (
        id, customer_name, whatsapp_number, email, telegram_contact, preferred_channel, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        guestContactId,
        params.customer_name?.trim() || null,
        params.whatsapp_number?.trim() || null,
        params.email?.trim() || null,
        params.telegram_contact?.trim() || null,
        params.delivery_preference,
        now,
      ]
    );

    // 2. Insert order with customer_user_id
    await tx.run(
      `INSERT INTO orders (
        id, public_order_reference, guest_contact_id, customer_user_id, delivery_preference,
        order_source, order_status, payment_status, total_amount, currency,
        admin_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        orderRef,
        guestContactId,
        params.customer_user_id || null,
        params.delivery_preference,
        params.order_source || "web_store",
        params.order_status || "new",
        "unpaid",
        computedTotal,
        "INR",
        null,
        now,
        now,
      ]
    );

    // 3. Insert order items
    const lines: OrderItemRecord[] = [];
    for (const line of validatedLines) {
      const lineId = `itm_${crypto.randomBytes(6).toString("hex")}`;
      await tx.run(
        `INSERT INTO order_items (
          id, order_id, product_id, product_variant_id,
          product_name_snapshot, variant_name_snapshot,
          unit_price_snapshot, quantity, line_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lineId,
          orderId,
          line.product.id,
          line.variant.id,
          line.product.name,
          line.variant.variant_name,
          line.variant.price_amount,
          line.quantity,
          line.line_total,
        ]
      );

      lines.push({
        id: lineId,
        order_id: orderId,
        product_id: line.product.id,
        product_variant_id: line.variant.id,
        product_name_snapshot: line.product.name,
        variant_name_snapshot: line.variant.variant_name,
        unit_price_snapshot: line.variant.price_amount,
        quantity: line.quantity,
        line_total: line.line_total,
      });

      // Auto-assign preferred supplier offer if available
      try {
        const offer = await tx.get<any>(
          `SELECT * FROM supplier_product_offers
          WHERE product_id = ? AND variant_id = ?
          ORDER BY preferred DESC, updated_at DESC
          LIMIT 1`,
          [line.product.id, line.variant.id]
        );

        const procId = `prc_${crypto.randomBytes(6).toString("hex")}`;
        await tx.run(
          `INSERT INTO procurements (
            id, order_id, order_item_id, supplier_id, expected_cost_amount, actual_cost_amount,
            quantity, procurement_status, supplier_payment_status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 'unpaid', ?, ?)`,
          [
            procId,
            orderId,
            lineId,
            offer?.supplier_id || null,
            offer?.purchase_price_amount ? offer.purchase_price_amount * line.quantity : null,
            line.quantity,
            offer?.supplier_id ? "supplier_assigned" : "not_assigned",
            now,
            now,
          ]
        );
      } catch {}
    }

    // 4. Initialize order conversation
    const convId = `conv_${crypto.randomBytes(6).toString("hex")}`;
    await tx.run(
      `INSERT INTO order_conversations (id, order_id, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      [convId, orderId, now, now]
    );

    if (params.customer_notes && params.customer_notes.trim()) {
      const msgId = `msg_${crypto.randomBytes(6).toString("hex")}`;
      await tx.run(
        `INSERT INTO order_messages (id, conversation_id, sender_id, sender_role, message, created_at, read_at)
        VALUES (?, ?, ?, 'customer', ?, ?, NULL)`,
        [msgId, convId, params.customer_user_id || "guest", params.customer_notes.trim(), now]
      );
    }

    return lines;
  });

  const fullOrder = await getOrderByReference(orderRef);
  return { order: fullOrder!, items: insertedItems };
}

export async function getOrderByReference(reference: string): Promise<OrderRecord | null> {
  const order = await db.get<OrderRecord>(
    `SELECT o.*, g.customer_name, g.whatsapp_number, g.email, g.telegram_contact, cu.username as customer_username
    FROM orders o
    JOIN guest_contacts g ON o.guest_contact_id = g.id
    LEFT JOIN customer_users cu ON o.customer_user_id = cu.id
    WHERE o.public_order_reference = ?`,
    [reference]
  );
  if (!order) return null;

  order.items = await db.query<OrderItemRecord>(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
  return order;
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const order = await db.get<OrderRecord>(
    `SELECT o.*, g.customer_name, g.whatsapp_number, g.email, g.telegram_contact, cu.username as customer_username
    FROM orders o
    JOIN guest_contacts g ON o.guest_contact_id = g.id
    LEFT JOIN customer_users cu ON o.customer_user_id = cu.id
    WHERE o.id = ?`,
    [id]
  );
  if (!order) return null;

  order.items = await db.query<OrderItemRecord>(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
  return order;
}

export async function getOrders(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<{ orders: OrderRecord[]; total: number }> {
  let countQuery = `
    SELECT COUNT(*) as cnt
    FROM orders o
    JOIN guest_contacts g ON o.guest_contact_id = g.id
    LEFT JOIN customer_users cu ON o.customer_user_id = cu.id
    WHERE 1=1
  `;
  let dataQuery = `
    SELECT o.*, g.customer_name, g.whatsapp_number, g.email, g.telegram_contact, cu.username as customer_username
    FROM orders o
    JOIN guest_contacts g ON o.guest_contact_id = g.id
    LEFT JOIN customer_users cu ON o.customer_user_id = cu.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.status && filters.status !== "all") {
    countQuery += ` AND o.order_status = ?`;
    dataQuery += ` AND o.order_status = ?`;
    params.push(filters.status);
  }

  if (filters?.search && filters.search.trim()) {
    const s = `%${filters.search.trim()}%`;
    const searchFilter = ` AND (o.public_order_reference LIKE ? OR g.customer_name LIKE ? OR g.whatsapp_number LIKE ? OR g.email LIKE ? OR cu.username LIKE ?)`;
    countQuery += searchFilter;
    dataQuery += searchFilter;
    params.push(s, s, s, s, s);
  }

  const totalRow = await db.get<{ cnt: any }>(countQuery, params);
  const total = Number(totalRow?.cnt || 0);

  dataQuery += ` ORDER BY o.created_at DESC`;
  const dataParams = [...params];
  if (filters?.limit) {
    dataQuery += ` LIMIT ? OFFSET ?`;
    dataParams.push(filters.limit, filters.offset || 0);
  }

  const orders = (await db.query<OrderRecord>(dataQuery, dataParams)) || [];

  for (const o of orders) {
    o.items = await db.query<OrderItemRecord>(`SELECT * FROM order_items WHERE order_id = ?`, [o.id]);
  }

  return { orders, total };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string,
  adminNotes?: string
): Promise<OrderRecord | null> {
  const now = new Date().toISOString();
  await db.run(
    `UPDATE orders SET
      order_status = COALESCE(?, order_status),
      payment_status = COALESCE(?, payment_status),
      admin_notes = COALESCE(?, admin_notes),
      updated_at = ?
    WHERE id = ?`,
    [status || null, paymentStatus || null, adminNotes ?? null, now, orderId]
  );
  return await getOrderById(orderId);
}

// ──────────────────────────────────────────
// DASHBOARD METRICS
// ──────────────────────────────────────────
export async function getDashboardMetrics(): Promise<{
  totalActiveProducts: number;
  totalOrders: number;
  newOrders: number;
  ordersPendingFulfillment: number;
  completedOrders: number;
  unavailableProducts: number;
  recentOrders: OrderRecord[];
}> {
  const activeProdRow = await db.get<{ cnt: any }>(`SELECT COUNT(*) as cnt FROM products WHERE status = 'active'`);
  const totalOrdersRow = await db.get<{ cnt: any }>(`SELECT COUNT(*) as cnt FROM orders`);
  const newOrdersRow = await db.get<{ cnt: any }>(`SELECT COUNT(*) as cnt FROM orders WHERE order_status = 'new'`);
  const pendingRow = await db.get<{ cnt: any }>(
    `SELECT COUNT(*) as cnt FROM orders WHERE order_status IN ('confirmed', 'processing', 'awaiting_payment')`
  );
  const completedRow = await db.get<{ cnt: any }>(`SELECT COUNT(*) as cnt FROM orders WHERE order_status = 'delivered'`);
  const unavailProdRow = await db.get<{ cnt: any }>(`SELECT COUNT(*) as cnt FROM products WHERE status != 'active'`);

  const recentOrdersData = await getOrders({ limit: 5 });

  return {
    totalActiveProducts: Number(activeProdRow?.cnt || 0),
    totalOrders: Number(totalOrdersRow?.cnt || 0),
    newOrders: Number(newOrdersRow?.cnt || 0),
    ordersPendingFulfillment: Number(pendingRow?.cnt || 0),
    completedOrders: Number(completedRow?.cnt || 0),
    unavailableProducts: Number(unavailProdRow?.cnt || 0),
    recentOrders: recentOrdersData.orders,
  };
}

// ──────────────────────────────────────────
// AUDIT LOGS
// ──────────────────────────────────────────
export async function createAuditLog(
  action: string,
  entityType: string,
  entityId: string | null,
  changeSummary: string,
  adminUserId: string = "admin"
): Promise<void> {
  const id = `aud_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO admin_audit_logs (id, admin_user_id, action, entity_type, entity_id, change_summary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, adminUserId, action, entityType, entityId, changeSummary, now]
  );
}

export async function getAuditLogs(limit = 50): Promise<any[]> {
  return await db.query(`SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT ?`, [limit]);
}

// ──────────────────────────────────────────
// SESSIONS (ADMIN)
// ──────────────────────────────────────────
export async function createSessionToken(ttlHours = 24): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const id = `ses_${crypto.randomBytes(6).toString("hex")}`;
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  await db.run(`INSERT INTO admin_sessions (id, token, expires_at, created_at) VALUES (?, ?, ?, ?)`, [
    id,
    token,
    expiresAt,
    now,
  ]);
  return token;
}

export async function validateSessionToken(token: string): Promise<boolean> {
  if (!token) return false;
  const row = await db.get<{ expires_at: string }>(`SELECT * FROM admin_sessions WHERE token = ?`, [token]);
  if (!row) return false;

  const isExpired = new Date(row.expires_at).getTime() < Date.now();
  if (isExpired) {
    await db.run(`DELETE FROM admin_sessions WHERE token = ?`, [token]);
    return false;
  }
  return true;
}

export async function deleteSessionToken(token: string): Promise<void> {
  await db.run(`DELETE FROM admin_sessions WHERE token = ?`, [token]);
}

// ──────────────────────────────────────────
// BULK IMPORT BATCHES & ROLLBACK
// ──────────────────────────────────────────
export async function createImportBatch(data: {
  submittedBy: string;
  originalText: string;
  changes: Array<{
    productId: string;
    variantId: string;
    fieldName: string;
    oldValue: string;
    proposedValue: string;
  }>;
}): Promise<{ batchId: string }> {
  const batchId = `imp_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  await db.transaction(async (tx: DatabaseExecutor) => {
    await tx.run(
      `INSERT INTO import_batches (
        id, submitted_by, original_text, parse_status, review_status, changes_count, created_at
      ) VALUES (?, ?, ?, 'parsed', 'pending_approval', ?, ?)`,
      [batchId, data.submittedBy, data.originalText, data.changes.length, now]
    );

    for (const ch of data.changes) {
      await tx.run(
        `INSERT INTO import_changes (
          id, batch_id, product_id, variant_id, field_name, old_value, proposed_value, approval_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          `chg_${crypto.randomBytes(6).toString("hex")}`,
          batchId,
          ch.productId,
          ch.variantId,
          ch.fieldName,
          ch.oldValue,
          ch.proposedValue,
        ]
      );
    }
  });

  return { batchId };
}

export async function applyApprovedBatch(
  batchId: string,
  approvedChangeIds: string[],
  adminUserId: string = "admin"
): Promise<{ updatedCount: number }> {
  const now = new Date().toISOString();

  return await db.transaction(async (tx: DatabaseExecutor) => {
    let updatedCount = 0;
    const allChanges = await tx.query<any>(`SELECT * FROM import_changes WHERE batch_id = ?`, [batchId]);

    for (const ch of allChanges) {
      if (approvedChangeIds.includes(ch.id)) {
        if (ch.field_name === "price_amount") {
          const newPrice = Math.round(Number(ch.proposed_value));
          await tx.run(`UPDATE product_variants SET price_amount = ?, updated_at = ? WHERE id = ?`, [
            newPrice,
            now,
            ch.variant_id,
          ]);
          await tx.run(`UPDATE import_changes SET approval_status = 'applied' WHERE id = ?`, [ch.id]);
          updatedCount++;
        }
      } else {
        await tx.run(`UPDATE import_changes SET approval_status = 'rejected' WHERE id = ?`, [ch.id]);
      }
    }

    await tx.run(`UPDATE import_batches SET review_status = 'committed', committed_at = ? WHERE id = ?`, [now, batchId]);
    return { updatedCount };
  }).then(async (res) => {
    await createAuditLog(
      "bulk_update",
      "product_variants",
      batchId,
      `Applied ${res.updatedCount} approved price changes from rate list batch ${batchId}`,
      adminUserId
    );
    return res;
  });
}

export async function rollbackBatch(
  batchId: string,
  adminUserId: string = "admin"
): Promise<{ revertedCount: number }> {
  const batch = await db.get<any>(`SELECT * FROM import_batches WHERE id = ?`, [batchId]);
  if (!batch || batch.review_status !== "committed") {
    throw new Error("Batch cannot be rolled back: either not found or not in committed state.");
  }

  const now = new Date().toISOString();
  return await db.transaction(async (tx: DatabaseExecutor) => {
    let revertedCount = 0;
    const appliedChanges = await tx.query<any>(
      `SELECT * FROM import_changes WHERE batch_id = ? AND approval_status = 'applied'`,
      [batchId]
    );

    for (const ch of appliedChanges) {
      if (ch.field_name === "price_amount") {
        const oldPrice = Math.round(Number(ch.old_value));
        await tx.run(`UPDATE product_variants SET price_amount = ?, updated_at = ? WHERE id = ?`, [
          oldPrice,
          now,
          ch.variant_id,
        ]);
        await tx.run(`UPDATE import_changes SET approval_status = 'reverted' WHERE id = ?`, [ch.id]);
        revertedCount++;
      }
    }

    await tx.run(`UPDATE import_batches SET review_status = 'rolled_back', rolled_back_at = ? WHERE id = ?`, [now, batchId]);
    return { revertedCount };
  }).then(async (res) => {
    await createAuditLog(
      "batch_rollback",
      "product_variants",
      batchId,
      `Reverted ${res.revertedCount} price updates for batch ${batchId}`,
      adminUserId
    );
    return res;
  });
}

// ============================================================================
// SUPPLIERS & OFFERS
// ============================================================================
export interface SupplierRecord {
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
  updated_at: string;
  supplied_products_count?: number;
  total_purchases_amount?: number;
  outstanding_balance?: number;
}

export interface SupplierOfferRecord {
  id: string;
  supplier_id: string;
  product_id: string;
  variant_id: string;
  purchase_price_amount: number;
  currency: string;
  preferred: number;
  availability: string;
  notes: string | null;
  effective_at: string;
  updated_at: string;
  product_name?: string;
  variant_name?: string;
  selling_price_amount?: number;
  supplier_name?: string;
}

export async function getAllSuppliers(filter?: string | { status?: string; search?: string }): Promise<SupplierRecord[]> {
  let status: string | undefined;
  let search: string | undefined;
  if (typeof filter === "string") {
    status = filter;
  } else if (filter) {
    status = filter.status;
    search = filter.search;
  }

  let query = `
    SELECT 
      s.*,
      COALESCE((SELECT COUNT(DISTINCT product_id) FROM supplier_product_offers WHERE supplier_id = s.id), 0) as supplied_products_count,
      COALESCE((SELECT SUM(COALESCE(actual_cost_amount, expected_cost_amount, 0)) FROM procurements WHERE supplier_id = s.id), 0) as total_purchases_amount,
      COALESCE((SELECT SUM(COALESCE(actual_cost_amount, expected_cost_amount, 0)) FROM procurements WHERE supplier_id = s.id AND supplier_payment_status != 'paid'), 0) as outstanding_balance
    FROM suppliers s
    WHERE 1=1
  `;
  const params: any[] = [];
  if (status && status !== "all") {
    query += ` AND s.status = ?`;
    params.push(status);
  }
  if (search && search.trim()) {
    query += ` AND (s.name LIKE ? OR s.business_name LIKE ? OR s.contact_person LIKE ?)`;
    const s = `%${search.trim()}%`;
    params.push(s, s, s);
  }
  query += ` ORDER BY s.name ASC`;

  return await db.query<SupplierRecord>(query, params);
}

export async function getSupplierStats(): Promise<{
  totalSuppliers: number;
  activeSuppliers: number;
  totalPurchases: number;
  outstandingPayables: number;
}> {
  const row = await db.get<any>(`
    SELECT 
      COUNT(*) as total_suppliers,
      COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) as active_suppliers,
      COALESCE((SELECT SUM(COALESCE(actual_cost_amount, expected_cost_amount, 0)) FROM procurements), 0) as total_purchases,
      COALESCE((SELECT SUM(COALESCE(actual_cost_amount, expected_cost_amount, 0)) FROM procurements WHERE supplier_payment_status != 'paid'), 0) as outstanding_payables
    FROM suppliers
  `);
  return {
    totalSuppliers: Number(row?.total_suppliers || 0),
    activeSuppliers: Number(row?.active_suppliers || 0),
    totalPurchases: Number(row?.total_purchases || 0),
    outstandingPayables: Number(row?.outstanding_payables || 0),
  };
}

export async function getSupplierById(
  id: string
): Promise<(SupplierRecord & { offers: SupplierOfferRecord[]; recentProcurements: any[] }) | null> {
  const supplier = await db.get<SupplierRecord>(`SELECT * FROM suppliers WHERE id = ?`, [id]);
  if (!supplier) return null;

  const offers = await db.query<SupplierOfferRecord>(
    `SELECT o.*, p.name as product_name, v.variant_name, v.price_amount as selling_price_amount
    FROM supplier_product_offers o
    JOIN products p ON o.product_id = p.id
    JOIN product_variants v ON o.variant_id = v.id
    WHERE o.supplier_id = ?
    ORDER BY p.name ASC, v.variant_name ASC`,
    [id]
  );

  const recentProcurements = await db.query<any>(
    `SELECT pr.*, ord.public_order_reference, p.name as product_name, v.variant_name
    FROM procurements pr
    JOIN orders ord ON pr.order_id = ord.id
    JOIN order_items oi ON pr.order_item_id = oi.id
    JOIN products p ON oi.product_id = p.id
    JOIN product_variants v ON oi.product_variant_id = v.id
    WHERE pr.supplier_id = ?
    ORDER BY pr.created_at DESC
    LIMIT 20`,
    [id]
  );

  return { ...supplier, offers, recentProcurements };
}

export async function createSupplier(data: {
  name: string;
  businessName?: string;
  contactPerson?: string;
  whatsapp?: string;
  email?: string;
  telegram?: string;
  notes?: string;
  preferredPaymentMethod?: string;
}): Promise<SupplierRecord> {
  const id = `sup_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO suppliers (id, name, business_name, contact_person, whatsapp, email, telegram, notes, status, preferred_payment_method, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
    [
      id,
      data.name.trim(),
      data.businessName?.trim() || null,
      data.contactPerson?.trim() || null,
      data.whatsapp?.trim() || null,
      data.email?.trim() || null,
      data.telegram?.trim() || null,
      data.notes?.trim() || null,
      data.preferredPaymentMethod || null,
      now,
      now,
    ]
  );

  return (await db.get<SupplierRecord>(`SELECT * FROM suppliers WHERE id = ?`, [id]))!;
}

export async function updateSupplier(id: string, data: Partial<SupplierRecord>): Promise<SupplierRecord> {
  const current = await db.get<SupplierRecord>(`SELECT * FROM suppliers WHERE id = ?`, [id]);
  if (!current) throw new Error("Supplier not found");
  const now = new Date().toISOString();

  await db.run(
    `UPDATE suppliers
    SET name = ?, business_name = ?, contact_person = ?, whatsapp = ?, email = ?, telegram = ?, notes = ?, status = ?, preferred_payment_method = ?, updated_at = ?
    WHERE id = ?`,
    [
      data.name !== undefined ? data.name.trim() : current.name,
      data.business_name !== undefined ? data.business_name?.trim() || null : current.business_name,
      data.contact_person !== undefined ? data.contact_person?.trim() || null : current.contact_person,
      data.whatsapp !== undefined ? data.whatsapp?.trim() || null : current.whatsapp,
      data.email !== undefined ? data.email?.trim() || null : current.email,
      data.telegram !== undefined ? data.telegram?.trim() || null : current.telegram,
      data.notes !== undefined ? data.notes?.trim() || null : current.notes,
      data.status !== undefined ? data.status : current.status,
      data.preferred_payment_method !== undefined ? data.preferred_payment_method : current.preferred_payment_method,
      now,
      id,
    ]
  );

  return (await db.get<SupplierRecord>(`SELECT * FROM suppliers WHERE id = ?`, [id]))!;
}

export async function archiveSupplier(id: string): Promise<void> {
  const now = new Date().toISOString();
  await db.run(`UPDATE suppliers SET status = 'archived', updated_at = ? WHERE id = ?`, [now, id]);
}

export async function upsertSupplierOffer(data: {
  supplierId: string;
  productId: string;
  variantId: string;
  purchasePriceAmount: number;
  preferred?: boolean;
  availability?: string;
  notes?: string;
}): Promise<SupplierOfferRecord> {
  const now = new Date().toISOString();
  const existing = await db.get<{ id: string }>(
    `SELECT id FROM supplier_product_offers WHERE supplier_id = ? AND variant_id = ?`,
    [data.supplierId, data.variantId]
  );

  return await db.transaction(async (tx: DatabaseExecutor) => {
    if (data.preferred) {
      await tx.run(`UPDATE supplier_product_offers SET preferred = 0, updated_at = ? WHERE variant_id = ?`, [
        now,
        data.variantId,
      ]);
    }

    let offerId: string;
    if (existing) {
      offerId = existing.id;
      await tx.run(
        `UPDATE supplier_product_offers
        SET purchase_price_amount = ?, preferred = ?, availability = ?, notes = ?, updated_at = ?
        WHERE id = ?`,
        [
          Math.round(data.purchasePriceAmount),
          data.preferred ? 1 : 0,
          data.availability || "in_stock",
          data.notes || null,
          now,
          offerId,
        ]
      );
    } else {
      offerId = `off_${crypto.randomBytes(6).toString("hex")}`;
      await tx.run(
        `INSERT INTO supplier_product_offers (id, supplier_id, product_id, variant_id, purchase_price_amount, currency, preferred, availability, notes, effective_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'INR', ?, ?, ?, ?, ?)`,
        [
          offerId,
          data.supplierId,
          data.productId,
          data.variantId,
          Math.round(data.purchasePriceAmount),
          data.preferred ? 1 : 0,
          data.availability || "in_stock",
          data.notes || null,
          now,
          now,
        ]
      );
    }

    return (await tx.get<SupplierOfferRecord>(`SELECT * FROM supplier_product_offers WHERE id = ?`, [offerId]))!;
  });
}

export async function getProductSupplierOffers(productId: string): Promise<SupplierOfferRecord[]> {
  return await db.query<SupplierOfferRecord>(
    `SELECT o.*, s.name as supplier_name, v.variant_name, v.price_amount as selling_price_amount
    FROM supplier_product_offers o
    JOIN suppliers s ON o.supplier_id = s.id
    JOIN product_variants v ON o.variant_id = v.id
    WHERE o.product_id = ? AND s.status = 'active'
    ORDER BY v.price_amount ASC, o.preferred DESC, o.purchase_price_amount ASC`,
    [productId]
  );
}

// ============================================================================
// PROCUREMENT
// ============================================================================
export interface ProcurementRecord {
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
  updated_at: string;
  order_reference?: string;
  customer_name?: string;
  customer_username?: string;
  product_name?: string;
  variant_name?: string;
  selling_price_snapshot?: number;
  supplier_name?: string;
}

export async function ensureProcurementsForOrder(orderId: string): Promise<void> {
  const items = await db.query<OrderItemRecord>(`SELECT * FROM order_items WHERE order_id = ?`, [orderId]);
  const now = new Date().toISOString();

  for (const item of items) {
    const existing = await db.get<{ id: string }>(`SELECT id FROM procurements WHERE order_item_id = ?`, [item.id]);
    if (!existing) {
      const offer = await db.get<{ supplier_id: string; purchase_price_amount: number }>(
        `SELECT supplier_id, purchase_price_amount 
        FROM supplier_product_offers 
        WHERE variant_id = ? AND preferred = 1
        LIMIT 1`,
        [item.product_variant_id]
      );

      const procId = `prc_${crypto.randomBytes(6).toString("hex")}`;
      await db.run(
        `INSERT INTO procurements (id, order_id, order_item_id, supplier_id, expected_cost_amount, actual_cost_amount, quantity, procurement_status, supplier_payment_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 'unpaid', ?, ?)`,
        [
          procId,
          orderId,
          item.id,
          offer ? offer.supplier_id : null,
          offer ? offer.purchase_price_amount * item.quantity : null,
          item.quantity,
          offer ? "supplier_assigned" : "not_assigned",
          now,
          now,
        ]
      );
    }
  }
}

export async function getAllProcurements(statusFilter?: string): Promise<ProcurementRecord[]> {
  const query = `
    SELECT 
      pr.*,
      ord.public_order_reference as order_reference,
      COALESCE(u.display_name, u.username, gc.customer_name, 'Guest') as customer_name,
      u.username as customer_username,
      oi.product_name_snapshot as product_name,
      oi.variant_name_snapshot as variant_name,
      oi.line_total as selling_price_snapshot,
      s.name as supplier_name
    FROM procurements pr
    JOIN orders ord ON pr.order_id = ord.id
    JOIN order_items oi ON pr.order_item_id = oi.id
    LEFT JOIN suppliers s ON pr.supplier_id = s.id
    LEFT JOIN customer_users u ON ord.customer_user_id = u.id
    LEFT JOIN guest_contacts gc ON ord.guest_contact_id = gc.id
    ${statusFilter ? "WHERE pr.procurement_status = ?" : ""}
    ORDER BY pr.created_at DESC
  `;
  const params = statusFilter ? [statusFilter] : [];
  return await db.query<ProcurementRecord>(query, params);
}

export async function assignSupplierToProcurement(
  procurementId: string,
  supplierId: string,
  expectedCost?: number
): Promise<void> {
  const now = new Date().toISOString();
  await db.run(
    `UPDATE procurements
    SET supplier_id = ?, expected_cost_amount = COALESCE(?, expected_cost_amount), procurement_status = 'supplier_assigned', updated_at = ?
    WHERE id = ?`,
    [supplierId, expectedCost !== undefined ? expectedCost : null, now, procurementId]
  );
}

export async function recordProcurementPurchase(
  procurementId: string,
  actualCost: number,
  supplierReference?: string,
  notes?: string
): Promise<void> {
  const now = new Date().toISOString();
  await db.run(
    `UPDATE procurements
    SET actual_cost_amount = ?, supplier_reference = COALESCE(?, supplier_reference), fulfillment_notes = COALESCE(?, fulfillment_notes), procurement_status = 'purchased', purchase_date = ?, updated_at = ?
    WHERE id = ?`,
    [Math.round(actualCost), supplierReference || null, notes || null, now, now, procurementId]
  );
}

export async function updateProcurementStatus(procurementId: string, status: string, notes?: string): Promise<void> {
  const now = new Date().toISOString();
  await db.run(
    `UPDATE procurements
    SET procurement_status = ?, fulfillment_notes = COALESCE(?, fulfillment_notes), updated_at = ?
    WHERE id = ?`,
    [status, notes || null, now, procurementId]
  );
}

export async function recordSupplierPayment(data: {
  supplierId: string;
  procurementId?: string;
  amount: number;
  paymentMethod?: string;
  reference?: string;
  notes?: string;
}): Promise<void> {
  const id = `spay_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  await db.transaction(async (tx: DatabaseExecutor) => {
    await tx.run(
      `INSERT INTO supplier_payments (id, supplier_id, procurement_id, amount, payment_date, payment_method, reference, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.supplierId,
        data.procurementId || null,
        Math.round(data.amount),
        now,
        data.paymentMethod || "bank_transfer",
        data.reference || null,
        data.notes || null,
        now,
      ]
    );

    if (data.procurementId) {
      await tx.run(
        `UPDATE procurements SET supplier_payment_status = 'paid', updated_at = ? WHERE id = ?`,
        [now, data.procurementId]
      );
    }
  });
}

// ============================================================================
// CUSTOMER PAYMENTS
// ============================================================================
export interface CustomerPaymentRecord {
  id: string;
  order_id: string;
  amount: number;
  payment_status: string;
  payment_method: string | null;
  reference: string | null;
  recorded_by: string | null;
  notes: string | null;
  created_at: string;
}

export async function recordCustomerPayment(data: {
  orderId: string;
  amount: number;
  paymentMethod?: string;
  reference?: string;
  notes?: string;
  recordedBy?: string;
}): Promise<void> {
  const id = `cpay_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  await db.transaction(async (tx: DatabaseExecutor) => {
    await tx.run(
      `INSERT INTO customer_payments (id, order_id, amount, payment_status, payment_method, reference, recorded_by, notes, created_at)
      VALUES (?, ?, ?, 'confirmed', ?, ?, ?, ?, ?)`,
      [
        id,
        data.orderId,
        Math.round(data.amount),
        data.paymentMethod || "upi_qr",
        data.reference || null,
        data.recordedBy || "admin",
        data.notes || null,
        now,
      ]
    );

    const totalPaid = await tx.get<{ s: any }>(
      `SELECT SUM(amount) as s FROM customer_payments WHERE order_id = ? AND payment_status = 'confirmed'`,
      [data.orderId]
    );
    const order = await tx.get<{ total_amount: number }>(`SELECT total_amount FROM orders WHERE id = ?`, [data.orderId]);

    const paidAmt = Number(totalPaid?.s || 0);
    let newStatus = "unpaid";
    if (order && paidAmt >= order.total_amount) {
      newStatus = "paid";
    } else if (paidAmt > 0) {
      newStatus = "partially_paid";
    }

    await tx.run(`UPDATE orders SET payment_status = ?, updated_at = ? WHERE id = ?`, [newStatus, now, data.orderId]);
  });

  await createAuditLog(
    "record_payment",
    "orders",
    data.orderId,
    `Recorded payment of ₹${data.amount} via ${data.paymentMethod || "upi"}`,
    data.recordedBy || "admin"
  );
}

export async function getCustomerPayments(orderId: string): Promise<CustomerPaymentRecord[]> {
  return await db.query<CustomerPaymentRecord>(
    `SELECT * FROM customer_payments WHERE order_id = ? ORDER BY created_at ASC`,
    [orderId]
  );
}

// ============================================================================
// ORDER MESSAGES
// ============================================================================
export interface OrderMessageRecord {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: "customer" | "admin";
  message: string;
  created_at: string;
  read_at: string | null;
}

export async function getOrCreateOrderConversation(orderId: string): Promise<string> {
  const existing = await db.get<{ id: string }>(`SELECT id FROM order_conversations WHERE order_id = ?`, [orderId]);
  if (existing) return existing.id;
  const id = `conv_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();
  await db.run(`INSERT INTO order_conversations (id, order_id, created_at, updated_at) VALUES (?, ?, ?, ?)`, [
    id,
    orderId,
    now,
    now,
  ]);
  return id;
}

export async function getOrderMessages(orderId: string): Promise<OrderMessageRecord[]> {
  const convId = await getOrCreateOrderConversation(orderId);
  return await db.query<OrderMessageRecord>(
    `SELECT * FROM order_messages WHERE conversation_id = ? ORDER BY created_at ASC`,
    [convId]
  );
}

export async function postOrderMessage(
  orderId: string,
  senderId: string,
  senderRole: "customer" | "admin",
  message: string
): Promise<OrderMessageRecord> {
  const convId = await getOrCreateOrderConversation(orderId);
  const msgId = `msg_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO order_messages (id, conversation_id, sender_id, sender_role, message, created_at, read_at)
    VALUES (?, ?, ?, ?, ?, ?, NULL)`,
    [msgId, convId, senderId, senderRole, message.trim(), now]
  );
  await db.run(`UPDATE order_conversations SET updated_at = ? WHERE id = ?`, [now, convId]);

  return (await db.get<OrderMessageRecord>(`SELECT * FROM order_messages WHERE id = ?`, [msgId]))!;
}

export async function markMessagesRead(orderId: string, readerRole: "customer" | "admin"): Promise<void> {
  const convId = await getOrCreateOrderConversation(orderId);
  const now = new Date().toISOString();
  const opposingRole = readerRole === "admin" ? "customer" : "admin";
  await db.run(
    `UPDATE order_messages SET read_at = ? WHERE conversation_id = ? AND sender_role = ? AND read_at IS NULL`,
    [now, convId, opposingRole]
  );
}

// ============================================================================
// BUSINESS EXPENSES
// ============================================================================
export interface BusinessExpenseRecord {
  id: string;
  category: string;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export async function createBusinessExpense(
  category: string,
  amount: number,
  expenseDate: string,
  notes?: string,
  createdBy: string = "admin"
): Promise<BusinessExpenseRecord> {
  const id = `exp_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO business_expenses (id, category, amount, expense_date, notes, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, category, Math.round(amount), expenseDate || now.split("T")[0], notes?.trim() || null, createdBy, now]
  );
  return (await db.get<BusinessExpenseRecord>(`SELECT * FROM business_expenses WHERE id = ?`, [id]))!;
}

export async function getAllBusinessExpenses(from?: string, to?: string): Promise<BusinessExpenseRecord[]> {
  let query = `SELECT * FROM business_expenses`;
  const params: string[] = [];
  if (from && to) {
    query += ` WHERE expense_date >= ? AND expense_date <= ?`;
    params.push(from, to);
  } else if (from) {
    query += ` WHERE expense_date >= ?`;
    params.push(from);
  }
  query += ` ORDER BY expense_date DESC, created_at DESC`;
  return await db.query<BusinessExpenseRecord>(query, params);
}

export async function deleteBusinessExpense(id: string): Promise<void> {
  await db.run(`DELETE FROM business_expenses WHERE id = ?`, [id]);
}

// ============================================================================
// FINANCIAL ANALYTICS & PROFIT & LOSS
// ============================================================================
export interface FinancialSummary {
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

export async function getFinancialSummary(startDate?: string, endDate?: string): Promise<FinancialSummary> {
  let orderDateClause = "";
  const orderParams: any[] = [];
  if (startDate && endDate) {
    orderDateClause = `WHERE created_at >= ? AND created_at <= ?`;
    orderParams.push(startDate, endDate);
  } else if (startDate) {
    orderDateClause = `WHERE created_at >= ?`;
    orderParams.push(startDate);
  }

  // 1. Orders totals
  const orderStats = await db.get<any>(
    `SELECT 
      COUNT(*) as total_orders,
      COALESCE(SUM(total_amount), 0) as requested_val,
      COALESCE(SUM(CASE WHEN payment_status = 'paid' OR order_status IN ('paid', 'sourcing', 'ready', 'delivered') THEN total_amount ELSE 0 END), 0) as confirmed_sales,
      COALESCE(SUM(CASE WHEN order_status IN ('new', 'awaiting_customer_message', 'awaiting_payment') THEN 1 ELSE 0 END), 0) as awaiting_action
    FROM orders
    ${orderDateClause}`,
    orderParams
  );

  // 2. Payments collected
  let payQuery = `SELECT COALESCE(SUM(amount), 0) as collected FROM customer_payments WHERE payment_status = 'confirmed'`;
  const payParams: any[] = [];
  if (startDate && endDate) {
    payQuery += ` AND created_at >= ? AND created_at <= ?`;
    payParams.push(startDate, endDate);
  }
  const paymentsCollectedRow = await db.get<any>(payQuery, payParams);

  // 3. Procurements COGS
  let cogsQuery = `
    SELECT 
      COALESCE(SUM(CASE WHEN pr.procurement_status IN ('purchased', 'received_ready', 'fulfilled') THEN COALESCE(pr.actual_cost_amount, pr.expected_cost_amount, 0) ELSE 0 END), 0) as cogs_fulfilled,
      COALESCE(SUM(COALESCE(pr.actual_cost_amount, pr.expected_cost_amount, 0)), 0) as cogs_estimated,
      COALESCE(SUM(CASE WHEN pr.procurement_status IN ('purchased', 'received_ready', 'fulfilled') AND pr.supplier_payment_status != 'paid' THEN COALESCE(pr.actual_cost_amount, pr.expected_cost_amount, 0) ELSE 0 END), 0) as supplier_payables,
      COALESCE(SUM(CASE WHEN pr.procurement_status IN ('purchased', 'received_ready', 'fulfilled') AND pr.actual_cost_amount IS NULL AND pr.expected_cost_amount IS NULL THEN 1 ELSE 0 END), 0) as missing_costs
    FROM procurements pr
    JOIN orders ord ON pr.order_id = ord.id
  `;
  const cogsParams: any[] = [];
  if (startDate && endDate) {
    cogsQuery += ` WHERE ord.created_at >= ? AND ord.created_at <= ?`;
    cogsParams.push(startDate, endDate);
  }
  const cogsStats = await db.get<any>(cogsQuery, cogsParams);

  // 4. Expenses Total
  let expQuery = `SELECT COALESCE(SUM(amount), 0) as expenses FROM business_expenses`;
  const expParams: any[] = [];
  if (startDate && endDate) {
    expQuery += ` WHERE expense_date >= ? AND expense_date <= ?`;
    expParams.push(startDate.split("T")[0], endDate.split("T")[0]);
  }
  const expenseStats = await db.get<any>(expQuery, expParams);

  const requestedOrderValue = Number(orderStats?.requested_val || 0);
  const confirmedSales = Number(orderStats?.confirmed_sales || 0);
  const paymentsCollected = Number(paymentsCollectedRow?.collected || 0);
  const cogsFulfilled = Number(cogsStats?.cogs_fulfilled || 0);
  const cogsEstimated = Number(cogsStats?.cogs_estimated || 0);
  const grossProfit = confirmedSales - cogsFulfilled;
  const expensesTotal = Number(expenseStats?.expenses || 0);
  const netProfit = grossProfit - expensesTotal;
  const netProfitMargin = confirmedSales > 0 ? Math.round((netProfit / confirmedSales) * 1000) / 10 : 0;
  const outstandingReceivables = Math.max(0, confirmedSales - paymentsCollected);
  const outstandingSupplierPayables = Number(cogsStats?.supplier_payables || 0);
  const missingCostCount = Number(cogsStats?.missing_costs || 0);

  // 5. Orders by Status
  const statusRows = await db.query<{ order_status: string; c: any }>(
    `SELECT order_status, COUNT(*) as c FROM orders ${orderDateClause} GROUP BY order_status`,
    orderParams
  );
  const ordersByStatus: Record<string, number> = {};
  statusRows.forEach((r) => {
    ordersByStatus[r.order_status] = Number(r.c);
  });

  // 6. Best-Selling Products
  let bestQuery = `
    SELECT oi.product_name_snapshot as name, SUM(oi.quantity) as quantity, SUM(oi.line_total) as revenue
    FROM order_items oi
    JOIN orders ord ON oi.order_id = ord.id
  `;
  const bestParams: any[] = [];
  if (startDate && endDate) {
    bestQuery += ` WHERE ord.created_at >= ? AND ord.created_at <= ?`;
    bestParams.push(startDate, endDate);
  }
  bestQuery += ` GROUP BY oi.product_id, oi.product_name_snapshot ORDER BY revenue DESC LIMIT 6`;
  const bestSellersRaw = await db.query<any>(bestQuery, bestParams);
  const bestSellers = bestSellersRaw.map((b) => ({
    name: b.name,
    quantity: Number(b.quantity || 0),
    revenue: Number(b.revenue || 0),
  }));

  // 7. Supplier Spending
  const supplierSpendRaw = await db.query<any>(
    `SELECT s.name as supplierName, SUM(COALESCE(pr.actual_cost_amount, pr.expected_cost_amount, 0)) as totalAmount, COUNT(pr.id) as count
    FROM procurements pr
    JOIN suppliers s ON pr.supplier_id = s.id
    GROUP BY s.id, s.name
    ORDER BY totalAmount DESC
    LIMIT 6`
  );
  const supplierSpend = supplierSpendRaw.map((s) => ({
    supplierName: s.suppliername || s.supplierName,
    totalAmount: Number(s.totalamount || s.totalAmount || 0),
    count: Number(s.count || 0),
  }));

  // 8. Recent Activity
  const auditRows = await db.query<any>(`SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT 10`);
  const recentActivity = auditRows.map((a) => ({
    id: a.id,
    type: a.action,
    title: a.action.replace(/_/g, " ").toUpperCase(),
    subtitle: a.change_summary,
    timestamp: a.created_at,
  }));

  return {
    period: startDate && endDate ? `${startDate} to ${endDate}` : "All Time",
    requestedOrderValue,
    confirmedSales,
    paymentsCollected,
    cogsFulfilled,
    cogsEstimated,
    grossProfit,
    expensesTotal,
    netProfit,
    netProfitMargin,
    outstandingReceivables,
    outstandingSupplierPayables,
    missingCostCount,
    totalOrdersCount: Number(orderStats?.total_orders || 0),
    ordersAwaitingActionCount: Number(orderStats?.awaiting_action || 0),
    ordersByStatus,
    bestSellingProducts: bestSellers,
    supplierSpending: supplierSpend,
    recentActivity,
  };
}

// ============================================================================
// CUSTOMER AUTHENTICATION & PROFILES (NO OTP)
// ============================================================================
export interface CustomerUserRecord {
  id: string;
  username: string;
  password_hash: string;
  display_name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfileRecord {
  user_id: string;
  optional_whatsapp: string | null;
  optional_email: string | null;
  optional_telegram: string | null;
  preferred_contact_method: string;
  created_at: string;
  updated_at: string;
}

export async function findCustomerByUsername(username: string): Promise<CustomerUserRecord | null> {
  const normalized = username.trim().toLowerCase();
  return await db.get<CustomerUserRecord>(`SELECT * FROM customer_users WHERE LOWER(username) = ?`, [normalized]);
}

export async function findCustomerById(id: string): Promise<CustomerUserRecord | null> {
  return await db.get<CustomerUserRecord>(`SELECT * FROM customer_users WHERE id = ?`, [id]);
}

export async function createCustomerUser(data: {
  username: string;
  passwordHash: string;
  displayName?: string;
  optionalWhatsapp?: string;
  optionalEmail?: string;
  optionalTelegram?: string;
  preferredContact?: string;
}): Promise<{ user: CustomerUserRecord; profile: CustomerProfileRecord }> {
  const userId = `cust_${crypto.randomBytes(8).toString("hex")}`;
  const now = new Date().toISOString();
  const normalizedUsername = data.username.trim().toLowerCase();

  await db.transaction(async (tx: DatabaseExecutor) => {
    await tx.run(
      `INSERT INTO customer_users (id, username, password_hash, display_name, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'active', ?, ?)`,
      [userId, normalizedUsername, data.passwordHash, data.displayName?.trim() || null, now, now]
    );

    await tx.run(
      `INSERT INTO customer_profiles (user_id, optional_whatsapp, optional_email, optional_telegram, preferred_contact_method, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.optionalWhatsapp?.trim() || null,
        data.optionalEmail?.trim() || null,
        data.optionalTelegram?.trim() || null,
        data.preferredContact || "dashboard",
        now,
        now,
      ]
    );
  });

  const user = (await findCustomerById(userId))!;
  const profile = (await getCustomerProfile(userId))!;
  return { user, profile };
}

export async function getCustomerProfile(userId: string): Promise<CustomerProfileRecord | null> {
  return await db.get<CustomerProfileRecord>(`SELECT * FROM customer_profiles WHERE user_id = ?`, [userId]);
}

export async function updateCustomerProfile(
  userId: string,
  data: {
    displayName?: string;
    optionalWhatsapp?: string;
    optionalEmail?: string;
    optionalTelegram?: string;
    preferredContact?: string;
  }
): Promise<void> {
  const now = new Date().toISOString();
  await db.transaction(async (tx: DatabaseExecutor) => {
    if (data.displayName !== undefined) {
      await tx.run(`UPDATE customer_users SET display_name = ?, updated_at = ? WHERE id = ?`, [
        data.displayName.trim() || null,
        now,
        userId,
      ]);
    }

    await tx.run(
      `UPDATE customer_profiles
      SET optional_whatsapp = ?, optional_email = ?, optional_telegram = ?, preferred_contact_method = ?, updated_at = ?
      WHERE user_id = ?`,
      [
        data.optionalWhatsapp !== undefined ? data.optionalWhatsapp.trim() || null : null,
        data.optionalEmail !== undefined ? data.optionalEmail.trim() || null : null,
        data.optionalTelegram !== undefined ? data.optionalTelegram.trim() || null : null,
        data.preferredContact || "dashboard",
        now,
        userId,
      ]
    );
  });
}

export async function updateCustomerPassword(userId: string, newPasswordHash: string): Promise<void> {
  const now = new Date().toISOString();
  await db.run(`UPDATE customer_users SET password_hash = ?, updated_at = ? WHERE id = ?`, [
    newPasswordHash,
    now,
    userId,
  ]);
  // Invalidate all active sessions for security on password change
  await db.run(`DELETE FROM customer_sessions WHERE user_id = ?`, [userId]);
}

export async function createCustomerSession(userId: string, token: string, expiresAt: string): Promise<void> {
  const id = `csess_${crypto.randomBytes(8).toString("hex")}`;
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO customer_sessions (id, token, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)`,
    [id, token, userId, expiresAt, now]
  );
}

export async function validateCustomerSession(
  token: string
): Promise<{ user: CustomerUserRecord; profile: CustomerProfileRecord } | null> {
  const now = new Date().toISOString();
  const session = await db.get<{ user_id: string }>(
    `SELECT * FROM customer_sessions WHERE token = ? AND expires_at > ?`,
    [token, now]
  );

  if (!session) return null;

  const user = await findCustomerById(session.user_id);
  if (!user || user.status !== "active") return null;

  const profile = (await getCustomerProfile(session.user_id)) || {
    user_id: user.id,
    optional_whatsapp: null,
    optional_email: null,
    optional_telegram: null,
    preferred_contact_method: "dashboard",
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return { user, profile };
}

export async function deleteCustomerSession(token: string): Promise<void> {
  await db.run(`DELETE FROM customer_sessions WHERE token = ?`, [token]);
}

export async function saveCustomerRecoveryCodes(userId: string, codeHashes: string[]): Promise<void> {
  const now = new Date().toISOString();
  await db.transaction(async (tx: DatabaseExecutor) => {
    await tx.run(`DELETE FROM customer_recovery_codes WHERE user_id = ?`, [userId]);
    for (const hash of codeHashes) {
      await tx.run(
        `INSERT INTO customer_recovery_codes (id, user_id, code_hash, used, created_at)
        VALUES (?, ?, ?, 0, ?)`,
        [`rcov_${crypto.randomBytes(6).toString("hex")}`, userId, hash, now]
      );
    }
  });
}

export async function verifyAndConsumeRecoveryCode(
  userId: string,
  candidateCode: string,
  verifyHashFn: (code: string, hash: string) => boolean
): Promise<boolean> {
  const rows = await db.query<{ id: string; code_hash: string }>(
    `SELECT id, code_hash FROM customer_recovery_codes WHERE user_id = ? AND used = 0`,
    [userId]
  );

  for (const row of rows) {
    if (verifyHashFn(candidateCode, row.code_hash)) {
      await db.run(`UPDATE customer_recovery_codes SET used = 1 WHERE id = ?`, [row.id]);
      return true;
    }
  }
  return false;
}

export async function getCustomerOrders(userId: string): Promise<OrderRecord[]> {
  const orders = await db.query<OrderRecord>(
    `SELECT * FROM orders WHERE customer_user_id = ? ORDER BY created_at DESC`,
    [userId]
  );

  for (const ord of orders) {
    ord.items = await db.query<OrderItemRecord>(`SELECT * FROM order_items WHERE order_id = ?`, [ord.id]);
  }
  return orders;
}

export async function getCustomerOrderById(orderId: string, userId: string): Promise<OrderRecord | null> {
  const order = await db.get<OrderRecord>(`SELECT * FROM orders WHERE id = ? AND customer_user_id = ?`, [
    orderId,
    userId,
  ]);
  if (!order) return null;
  order.items = await db.query<OrderItemRecord>(`SELECT * FROM order_items WHERE order_id = ?`, [order.id]);
  return order;
}

export async function getAllCustomers(): Promise<
  Array<
    CustomerUserRecord & {
      optional_whatsapp: string | null;
      optional_email: string | null;
      optional_telegram: string | null;
      preferred_contact_method: string;
      order_count: number;
      total_spent: number;
    }
  >
> {
  const rows = await db.query<any>(
    `SELECT 
      u.id, u.username, u.display_name, u.status, u.created_at, u.updated_at,
      p.optional_whatsapp, p.optional_email, p.optional_telegram, p.preferred_contact_method,
      COALESCE(COUNT(o.id), 0) as order_count,
      COALESCE(SUM(CASE WHEN o.payment_status = 'confirmed' OR o.order_status = 'delivered' THEN o.total_amount ELSE 0 END), 0) as total_spent
    FROM customer_users u
    LEFT JOIN customer_profiles p ON u.id = p.user_id
    LEFT JOIN orders o ON u.id = o.customer_user_id
    GROUP BY u.id, u.username, u.display_name, u.status, u.created_at, u.updated_at, p.optional_whatsapp, p.optional_email, p.optional_telegram, p.preferred_contact_method
    ORDER BY u.created_at DESC`
  );

  return rows.map((r) => ({
    ...r,
    order_count: Number(r.order_count || 0),
    total_spent: Number(r.total_spent || 0),
  }));
}
