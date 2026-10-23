const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('data/technkt.db');
const crypto = require('crypto');

function seedSuppliers() {
  const existing = db.prepare('SELECT COUNT(*) as c FROM suppliers').get().c;
  if (existing > 0) {
    console.log('Suppliers already exist, count:', existing);
    return;
  }

  const now = new Date().toISOString();

  // 1. Insert 3 suppliers
  const s1 = { id: 'sup_gdh_digital', name: 'Global Digital Hub', business_name: 'GDH Wholesale India', contact_person: 'Rajesh Sharma', whatsapp: '919811223344', email: 'rajesh@gdhwholesale.in', telegram: '@gdh_rajesh', notes: 'Top tier wholesale seller for OTT passes & 4K Netflix. Instant slot assignment.', preferred_payment_method: 'UPI / IMPS' };
  const s2 = { id: 'sup_substream', name: 'SubStream Wholesale', business_name: 'SubStream Distribution', contact_person: 'Vikram Mehta', whatsapp: '919877665544', email: 'vikram@substream.in', telegram: '@substream_vikram', notes: 'High reliability on Hotstar and Sony LIV phone OTP activations.', preferred_payment_method: 'UPI QR' };
  const s3 = { id: 'sup_apex_ai', name: 'Apex AI Licenses', business_name: 'Apex AI Software Ltd', contact_person: 'Sarah Jenkins', whatsapp: null, email: 'sales@apexai-license.com', telegram: '@apexai_support', notes: 'Direct developer licenses for ChatGPT, Claude and Canva teams.', preferred_payment_method: 'USDT / Bank' };

  for (const s of [s1, s2, s3]) {
    db.prepare(`
      INSERT INTO suppliers (id, name, business_name, contact_person, whatsapp, email, telegram, notes, status, preferred_payment_method, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
    `).run(s.id, s.name, s.business_name, s.contact_person, s.whatsapp, s.email, s.telegram, s.notes, s.preferred_payment_method, now, now);
  }
  console.log('Inserted 3 suppliers');

  // 2. Link variants to suppliers
  const variants = db.prepare('SELECT id, product_id, variant_name, price_amount FROM product_variants').all();
  let offerCount = 0;

  for (const v of variants) {
    let supId = s1.id;
    let cost = Math.round(v.price_amount * 0.65); // approx 35% gross margin

    if (v.product_id.includes('chatgpt') || v.product_id.includes('canva') || v.product_id.includes('claude')) {
      supId = s3.id;
      cost = Math.round(v.price_amount * 0.70);
    } else if (v.product_id.includes('hotstar') || v.product_id.includes('sony') || v.product_id.includes('zee')) {
      supId = s2.id;
      cost = Math.round(v.price_amount * 0.60);
    }

    const offId = `off_${crypto.randomBytes(6).toString('hex')}`;
    db.prepare(`
      INSERT INTO supplier_product_offers (id, supplier_id, product_id, variant_id, purchase_price_amount, currency, preferred, availability, notes, effective_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'INR', 1, 'in_stock', 'Standard wholesale bulk rate', ?, ?)
    `).run(offId, supId, v.product_id, v.id, cost, now, now);
    offerCount++;

    // Add alternate supplier for Netflix & Hotstar
    if (v.product_id.includes('netflix') || v.product_id.includes('hotstar')) {
      const altSup = supId === s1.id ? s2.id : s1.id;
      const altOffId = `off_${crypto.randomBytes(6).toString('hex')}`;
      db.prepare(`
        INSERT INTO supplier_product_offers (id, supplier_id, product_id, variant_id, purchase_price_amount, currency, preferred, availability, notes, effective_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'INR', 0, 'in_stock', 'Alternate backup source (+₹10)', ?, ?)
      `).run(altOffId, altSup, v.product_id, v.id, cost + 10, now, now);
      offerCount++;
    }
  }

  console.log(`Created ${offerCount} supplier product offers with purchase costs.`);

  // 3. Ensure procurements exist for all existing order items
  const orders = db.prepare('SELECT id FROM orders').all();
  let procCount = 0;
  for (const o of orders) {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
    for (const itm of items) {
      const offer = db.prepare('SELECT supplier_id, purchase_price_amount FROM supplier_product_offers WHERE variant_id = ? AND preferred = 1').get(itm.product_variant_id);
      const prcId = `prc_${crypto.randomBytes(6).toString('hex')}`;
      db.prepare(`
        INSERT INTO procurements (id, order_id, order_item_id, supplier_id, expected_cost_amount, actual_cost_amount, quantity, procurement_status, supplier_payment_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'supplier_assigned', 'unpaid', ?, ?)
      `).run(
        prcId,
        o.id,
        itm.id,
        offer ? offer.supplier_id : s1.id,
        offer ? offer.purchase_price_amount * itm.quantity : Math.round(itm.line_total * 0.65),
        offer ? offer.purchase_price_amount * itm.quantity : Math.round(itm.line_total * 0.65),
        itm.quantity,
        now,
        now
      );
      procCount++;
    }
  }
  console.log(`Created ${procCount} procurements for existing orders.`);
}

seedSuppliers();
