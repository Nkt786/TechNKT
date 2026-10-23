-- ============================================================================
-- TechNKT — Neon PostgreSQL Production Schema V2
-- Compatible with Neon Free Plan (aws-ap-southeast-1 / Singapore preferred)
-- Normalized integer rupee monetary amounts (price_amount, total_amount, etc.)
-- ============================================================================

-- 1. STORE & CATALOGUE
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  marketing_heading VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(32) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
  image_url TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  badge VARCHAR(64),
  instant INTEGER DEFAULT 1,
  status VARCHAR(32) DEFAULT 'active',
  featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  marketing_title VARCHAR(255),
  marketing_category VARCHAR(255),
  marketing_description TEXT,
  include_in_marketing INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name VARCHAR(255) NOT NULL,
  duration_value INTEGER NOT NULL DEFAULT 1,
  duration_unit VARCHAR(32) NOT NULL DEFAULT 'month',
  validity_description VARCHAR(255),
  price_amount INTEGER NOT NULL, -- Integer Rupees (INR)
  comparison_price_amount INTEGER DEFAULT 0,
  currency VARCHAR(8) DEFAULT 'INR',
  warranty_description VARCHAR(255),
  delivery_description VARCHAR(255),
  activation_description VARCHAR(255),
  availability VARCHAR(32) DEFAULT 'in_stock',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_media (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_provider VARCHAR(32) DEFAULT 'neon_s3',
  bucket_name VARCHAR(128) DEFAULT 'technkt-products',
  object_key TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size_bytes INTEGER,
  mime_type VARCHAR(64),
  aspect_ratio VARCHAR(32),
  is_primary INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMER AUTHENTICATION (ZERO OTP, USERNAME + PASSWORD ONLY)
CREATE TABLE IF NOT EXISTS customer_users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(128),
  status VARCHAR(32) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_profiles (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES customer_users(id) ON DELETE CASCADE,
  optional_whatsapp VARCHAR(32),
  optional_email VARCHAR(128),
  optional_telegram VARCHAR(64),
  preferred_contact_method VARCHAR(32) DEFAULT 'dashboard',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_sessions (
  id VARCHAR(64) PRIMARY KEY,
  token VARCHAR(128) UNIQUE NOT NULL,
  user_id VARCHAR(64) NOT NULL REFERENCES customer_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_recovery_codes (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES customer_users(id) ON DELETE CASCADE,
  code_hash VARCHAR(128) NOT NULL,
  used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. ORDERS & COMMERCE
CREATE TABLE IF NOT EXISTS guest_contacts (
  id VARCHAR(64) PRIMARY KEY,
  customer_name VARCHAR(128),
  whatsapp_number VARCHAR(32),
  email VARCHAR(128),
  telegram_contact VARCHAR(64),
  preferred_channel VARCHAR(32),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  public_order_reference VARCHAR(64) UNIQUE NOT NULL,
  guest_contact_id VARCHAR(64) NOT NULL REFERENCES guest_contacts(id),
  customer_user_id VARCHAR(64) REFERENCES customer_users(id),
  delivery_preference VARCHAR(64) NOT NULL,
  order_source VARCHAR(64) DEFAULT 'web_store',
  order_status VARCHAR(64) DEFAULT 'new',
  payment_status VARCHAR(64) DEFAULT 'unpaid',
  total_amount INTEGER NOT NULL, -- Integer Rupees (INR)
  currency VARCHAR(8) DEFAULT 'INR',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(64) NOT NULL,
  product_variant_id VARCHAR(64) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  variant_name_snapshot VARCHAR(255) NOT NULL,
  unit_price_snapshot INTEGER NOT NULL, -- Integer Rupees (INR)
  quantity INTEGER NOT NULL,
  line_total INTEGER NOT NULL -- Integer Rupees (INR)
);

CREATE TABLE IF NOT EXISTS customer_payments (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Integer Rupees (INR)
  payment_status VARCHAR(32) DEFAULT 'confirmed',
  payment_method VARCHAR(64),
  reference VARCHAR(128),
  recorded_by VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. SUPPLIER MANAGEMENT & PROCUREMENT
CREATE TABLE IF NOT EXISTS suppliers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  contact_person VARCHAR(128),
  whatsapp VARCHAR(32),
  email VARCHAR(128),
  telegram VARCHAR(64),
  notes TEXT,
  status VARCHAR(32) DEFAULT 'active',
  preferred_payment_method VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supplier_product_offers (
  id VARCHAR(64) PRIMARY KEY,
  supplier_id VARCHAR(64) NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id VARCHAR(64) NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  purchase_price_amount INTEGER NOT NULL, -- Integer Rupees (INR)
  currency VARCHAR(8) DEFAULT 'INR',
  preferred INTEGER DEFAULT 0,
  availability VARCHAR(32) DEFAULT 'in_stock',
  notes TEXT,
  effective_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS procurements (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id VARCHAR(64) NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  supplier_id VARCHAR(64) REFERENCES suppliers(id) ON DELETE SET NULL,
  expected_cost_amount INTEGER, -- Integer Rupees (INR)
  actual_cost_amount INTEGER, -- Immutable Snapshot in Integer Rupees (INR)
  quantity INTEGER DEFAULT 1,
  procurement_status VARCHAR(64) DEFAULT 'not_assigned',
  supplier_payment_status VARCHAR(64) DEFAULT 'unpaid',
  supplier_reference VARCHAR(128),
  purchase_date TIMESTAMPTZ,
  fulfillment_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supplier_payments (
  id VARCHAR(64) PRIMARY KEY,
  supplier_id VARCHAR(64) NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  procurement_id VARCHAR(64) REFERENCES procurements(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Integer Rupees (INR)
  payment_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(64),
  reference VARCHAR(128),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. FINANCIAL TRANSACTIONS & EXPENSES
CREATE TABLE IF NOT EXISTS business_expenses (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(64) NOT NULL,
  amount INTEGER NOT NULL, -- Integer Rupees (INR)
  expense_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_by VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_adjustments (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
  type VARCHAR(64) NOT NULL,
  amount INTEGER NOT NULL, -- Integer Rupees (INR)
  reason TEXT,
  created_by VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. IN-SITE ORDER MESSAGING SYSTEM
CREATE TABLE IF NOT EXISTS order_conversations (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_messages (
  id VARCHAR(64) PRIMARY KEY,
  conversation_id VARCHAR(64) NOT NULL REFERENCES order_conversations(id) ON DELETE CASCADE,
  sender_id VARCHAR(64) NOT NULL,
  sender_role VARCHAR(32) NOT NULL, -- 'customer' | 'admin'
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMPTZ
);

-- 7. WHATSAPP MARKETING & BULK PRICE MANAGEMENT
CREATE TABLE IF NOT EXISTS marketing_templates (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  header_text TEXT,
  footer_text TEXT,
  formatting_settings TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS import_batches (
  id VARCHAR(64) PRIMARY KEY,
  submitted_by VARCHAR(64),
  original_text TEXT,
  parse_status VARCHAR(32),
  review_status VARCHAR(32),
  changes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  committed_at TIMESTAMPTZ,
  rolled_back_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS import_changes (
  id VARCHAR(64) PRIMARY KEY,
  batch_id VARCHAR(64) NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  product_id VARCHAR(64) NOT NULL,
  variant_id VARCHAR(64) NOT NULL,
  field_name VARCHAR(64) NOT NULL,
  old_value TEXT,
  proposed_value TEXT,
  approval_status VARCHAR(32) DEFAULT 'pending'
);

-- 8. ADMIN SESSIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  admin_user_id VARCHAR(64),
  action VARCHAR(64) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64),
  change_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id VARCHAR(64) PRIMARY KEY,
  token VARCHAR(128) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. PERFORMANCE INDEXES (Optimized for Neon Free Plan)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(public_order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customer_users_user ON customer_users(username);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_offers_product ON supplier_product_offers(product_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_procurements_order ON procurements(order_id);
CREATE INDEX IF NOT EXISTS idx_procurements_supplier ON procurements(supplier_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_conv ON order_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_token ON customer_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
