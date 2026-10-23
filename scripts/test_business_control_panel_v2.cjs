const http = require("http");

const BASE_URL = "http://localhost:4321";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = options.headers || {};
  if (options.body && typeof options.body === "object") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = { raw: text };
  }

  return {
    status: res.status,
    headers: res.headers,
    data: json,
    cookies: res.headers.get("set-cookie") || "",
  };
}

async function runTests() {
  console.log("==========================================================");
  console.log("   TECHNKT BUSINESS CONTROL PANEL V2 — E2E TEST SUITE     ");
  console.log("==========================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------------------
  // 1. ADMIN AUTHENTICATION
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 1: Admin Authentication ---");
  const adminPass = process.env.ADMIN_PASSWORD || "TechNKT@DevPass2026!";
  const adminLogin = await request("/api/admin/login", {
    method: "POST",
    body: { username: "admin", password: adminPass },
  });
  assert(adminLogin.status === 200 && adminLogin.data.success, "Admin login with valid credentials");
  const adminCookie = adminLogin.cookies.split(";")[0];
  assert(adminCookie.includes("technkt_admin_session"), "Admin session cookie received");

  // -------------------------------------------------------------------------
  // 2. SUPPLIERS CRUD & PRIVACY
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 2: Supplier Management ---");
  const supplierPayload = {
    name: "Apex Prime OTT Global",
    businessName: "Apex Digital Solutions Ltd",
    contactPerson: "Vikram Malhotra",
    whatsapp: "+919876543210",
    email: "vikram@apexprime.io",
    telegram: "@vikram_apex",
    preferredPaymentMethod: "USDT / Bank Transfer",
    notes: "Instant 4K profiles with dedicated screens",
    status: "active",
  };

  const createSup = await request("/api/admin/suppliers", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: supplierPayload,
  });
  assert((createSup.status === 200 || createSup.status === 201) && createSup.data.success, "Create new supplier via admin API");
  const createdSupplierId = createSup.data.supplier?.id;
  assert(Boolean(createdSupplierId), `Supplier created with ID: ${createdSupplierId}`);

  const getSuppliers = await request("/api/admin/suppliers", {
    headers: { Cookie: adminCookie },
  });
  assert(getSuppliers.status === 200 && Array.isArray(getSuppliers.data.suppliers), "List all suppliers for admin");
  const foundSup = getSuppliers.data.suppliers.find((s) => s.id === createdSupplierId);
  assert(foundSup && foundSup.name === "Apex Prime OTT Global", "Created supplier verified in supplier list");

  // Verify Supplier Privacy (Unauthenticated user cannot access supplier data)
  const unauthSuppliers = await request("/api/admin/suppliers");
  assert(unauthSuppliers.status === 401, "Unauthenticated request to suppliers API rejected with 401");

  // -------------------------------------------------------------------------
  // 3. PRODUCT SUPPLIER OFFERS & COST PRIVACY
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 3: Supplier Cost Offer & Privacy ---");
  // Get existing products to find Netflix
  const getProds = await request("/api/admin/products", {
    headers: { Cookie: adminCookie },
  });
  const netflix = getProds.data.products?.find((p) => p.slug === "netflix" || p.name.includes("Netflix"));
  assert(Boolean(netflix), `Found existing product: ${netflix?.name}`);
  const netflixVariant = netflix?.variants?.[0];
  assert(Boolean(netflixVariant), `Found product variant: ${netflixVariant?.variant_name} (Selling: ₹${netflixVariant?.price_amount})`);

  // Record supplier acquisition offer
  const offerRes = await request("/api/admin/offers", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: {
      productId: netflix.id,
      variantId: netflixVariant.id,
      supplierId: createdSupplierId,
      purchasePriceAmount: 115,
      preferred: true,
      availability: "in_stock",
      notes: "Immediate private screen delivery",
    },
  });
  assert(offerRes.status === 200 && offerRes.data.success, `Saved supplier cost offer ₹115 for ${netflixVariant.variant_name}`);

  // Fetch offers as admin
  const adminOffers = await request(`/api/admin/offers?productId=${netflix.id}`, {
    headers: { Cookie: adminCookie },
  });
  assert(adminOffers.status === 200 && adminOffers.data.offers.length > 0, "Admin can retrieve supplier cost offers");

  // Verify public Store API never leaks supplier cost or supplier name
  const publicProds = await request("/api/products");
  const publicNetflix = publicProds.data?.products?.find((p) => p.id === netflix.id);
  assert(publicNetflix !== undefined, "Storefront product found");
  assert(publicNetflix.purchase_price_amount === undefined, "CONFIDENTIAL: purchase_price_amount is NOT exposed in public API");
  assert(publicNetflix.supplier_id === undefined, "CONFIDENTIAL: supplier_id is NOT exposed in public API");

  // -------------------------------------------------------------------------
  // 4. CUSTOMER SIGNUP & AUTHENTICATION (NO OTP)
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 4: Customer Account Creation (Zero OTP) ---");
  const testUsername = `client_${Date.now().toString(36)}`;
  const registerRes = await request("/api/auth/register", {
    method: "POST",
    body: {
      username: testUsername,
      password: "StrongPass2026!",
      confirmPassword: "StrongPass2026!",
      displayName: "Digital Consumer",
      // Notice: NO phone, NO email, NO telegram! Completely optional!
    },
  });

  assert((registerRes.status === 200 || registerRes.status === 201) && registerRes.data.success, "Customer account created with ONLY username & password (Zero OTP)");
  assert(Array.isArray(registerRes.data.recoveryCodes) && registerRes.data.recoveryCodes.length === 6, "6 One-Time Emergency Recovery Codes generated");
  const customerCookie = registerRes.cookies.split(";")[0];
  assert(customerCookie.includes("technkt_customer_session"), "Customer session cookie set automatically on signup");

  // Validate customer session via /api/auth/me
  const customerMe = await request("/api/auth/me", {
    headers: { Cookie: customerCookie },
  });
  assert(customerMe.status === 200 && customerMe.data.authenticated, `Customer session verified for: ${customerMe.data.user?.username}`);
  const customerUserId = customerMe.data.user?.id;

  // -------------------------------------------------------------------------
  // 5. IN-SITE ORDER CREATION WITHOUT PHONE / EMAIL
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 5: Place Order via TechNKT Dashboard (No Phone / Email) ---");
  const orderRes = await request("/api/orders/create", {
    method: "POST",
    headers: { Cookie: customerCookie },
    body: {
      customer_name: "TechNKT Dashboard User",
      delivery_preference: "dashboard",
      items: [
        {
          product_id: netflix.id,
          variant_id: netflixVariant.id,
          quantity: 1,
        },
      ],
      order_notes: "Please deliver access credentials directly via my TechNKT Dashboard Messages.",
    },
  });

  assert((orderRes.status === 200 || orderRes.status === 201) && orderRes.data.success, "Order successfully submitted by logged-in customer");
  const createdOrderId = orderRes.data.orderId;
  const createdOrderRef = orderRes.data.orderReference;
  assert(Boolean(createdOrderId), `Order created with ID: ${createdOrderId} (Ref: ${createdOrderRef})`);

  // Customer checks /api/customer/orders
  const myOrders = await request("/api/customer/orders", {
    headers: { Cookie: customerCookie },
  });
  assert(myOrders.status === 200 && myOrders.data.orders.length > 0, "Customer retrieves their own order list");
  const customerFoundOrder = myOrders.data.orders.find((o) => o.id === createdOrderId);
  assert(Boolean(customerFoundOrder), "Created order appears in customer's My Orders");

  // -------------------------------------------------------------------------
  // 6. IN-SITE ORDER MESSAGING (TWO-WAY SECURE CHAT)
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 6: In-Site Order Messages ---");
  // 1. Customer sends message
  const custMsg = await request("/api/customer/messages", {
    method: "POST",
    headers: { Cookie: customerCookie },
    body: {
      orderId: createdOrderId,
      message: "Hello TechNKT team! I just placed this order via my dashboard. Looking forward to delivery.",
    },
  });
  assert((custMsg.status === 200 || custMsg.status === 201) && custMsg.data.success, "Customer posted in-site order message");

  // 2. Admin receives and views message in Admin Order Desk
  const adminGetMsgs = await request(`/api/admin/orders/messages?orderId=${createdOrderId}`, {
    headers: { Cookie: adminCookie },
  });
  assert(adminGetMsgs.status === 200 && adminGetMsgs.data.messages.length >= 1, "Admin reads customer message");
  assert(adminGetMsgs.data.messages.some((m) => m.sender_role === "customer"), "Customer sender role verified");

  // 3. Admin replies to customer
  const adminReply = await request("/api/admin/orders/messages", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: {
      orderId: createdOrderId,
      message: "Hi! Your order request is received. We are sourcing your private 4K screen now. Will update here shortly.",
    },
  });
  assert((adminReply.status === 200 || adminReply.status === 201) && adminReply.data.success, "Admin replied to customer in-site");

  // 4. Customer reads admin reply
  const custGetMsgs = await request(`/api/customer/messages?orderId=${createdOrderId}`, {
    headers: { Cookie: customerCookie },
  });
  assert(custGetMsgs.status === 200 && custGetMsgs.data.messages.some((m) => m.sender_role === "admin"), "Customer successfully received Admin reply");

  // 5. SECURITY CHECK: Unauthorized customer cannot access another customer's order messages
  const rogueCustReg = await request("/api/auth/register", {
    method: "POST",
    body: { username: `rogue_${Date.now().toString(36)}`, password: "Password123!", confirmPassword: "Password123!" },
  });
  const rogueCookie = rogueCustReg.cookies.split(";")[0];
  const rogueAttempt = await request(`/api/customer/messages?orderId=${createdOrderId}`, {
    headers: { Cookie: rogueCookie },
  });
  assert(rogueAttempt.status === 404 || rogueAttempt.status === 403, "SECURITY: Another user blocked from accessing this customer's messages");

  // -------------------------------------------------------------------------
  // 7. PROCUREMENT / SOURCING WORKFLOW
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 7: Procurement & Sourcing Workflow ---");
  const procurementsRes = await request("/api/admin/procurement", {
    headers: { Cookie: adminCookie },
  });
  assert(procurementsRes.status === 200 && Array.isArray(procurementsRes.data.procurements), "Admin retrieved procurements list");
  const linkedProc = procurementsRes.data.procurements.find((pr) => pr.order_id === createdOrderId);
  assert(Boolean(linkedProc), `Found auto-created procurement record for order: ${linkedProc?.id}`);

  // Assign supplier
  const assignProc = await request("/api/admin/procurement", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: {
      action: "assign",
      procurementId: linkedProc.id,
      supplierId: createdSupplierId,
      expectedCost: 110,
    },
  });
  assert(assignProc.status === 200 && assignProc.data.success, "Assigned supplier to procurement");

  // Record actual purchase cost
  const recordPurchase = await request("/api/admin/procurement", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: {
      action: "record_purchase",
      procurementId: linkedProc.id,
      actualCost: 110,
      notes: "Acquired via wholesale portal",
    },
  });
  assert(recordPurchase.status === 200 && recordPurchase.data.success, "Recorded actual purchase cost of ₹110");

  // Mark procurement fulfilled
  const fulfillProc = await request("/api/admin/procurement", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: {
      action: "update_status",
      procurementId: linkedProc.id,
      status: "fulfilled",
      notes: "Delivered 4K UHD private PIN via internal dashboard message",
    },
  });
  assert(fulfillProc.status === 200 && fulfillProc.data.success, "Marked procurement item as Fulfilled");

  // Record payment made to supplier
  const paySupplier = await request("/api/admin/procurement", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: {
      action: "record_supplier_payment",
      procurementId: linkedProc.id,
      supplierId: createdSupplierId,
      amount: 110,
      paymentMethod: "UPI Transfer",
    },
  });
  assert(paySupplier.status === 200 && paySupplier.data.success, "Recorded ₹110 payment made to supplier");

  // -------------------------------------------------------------------------
  // 8. RECORD CUSTOMER PAYMENT & VERIFY P&L
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 8: Customer Payment Recording & Real P&L ---");
  const recordPayRes = await request("/api/admin/orders/payment", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: {
      orderId: createdOrderId,
      amount: netflixVariant.price_amount,
      paymentMethod: "UPI Direct",
      reference: "UPI/2026/89342719",
      notes: "Payment confirmed on GPay",
    },
  });
  assert(recordPayRes.status === 200 && recordPayRes.data.success, `Customer payment ₹${netflixVariant.price_amount} recorded by Admin`);

  // Add an operating business expense
  const expRes = await request("/api/admin/finance", {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: {
      category: "Software / Server Hosting",
      amount: 450,
      expenseDate: new Date().toISOString().split("T")[0],
      notes: "Monthly server runtime charges",
    },
  });
  assert((expRes.status === 200 || expRes.status === 201) && expRes.data.success, "Added business expense of ₹450");

  // Get real Financial Summary
  const finSummary = await request("/api/admin/finance", {
    headers: { Cookie: adminCookie },
  });
  assert(finSummary.status === 200 && finSummary.data.summary, "Admin financial summary loaded");
  const s = finSummary.data.summary;
  console.log("--- Real P&L Metrics Output ---");
  console.log(`Confirmed Sales: ₹${s.confirmedSales}`);
  console.log(`Payments Collected: ₹${s.paymentsCollected}`);
  console.log(`COGS (Fulfilled): ₹${s.cogsFulfilled}`);
  console.log(`Gross Profit: ₹${s.grossProfit}`);
  console.log(`Business Expenses: ₹${s.expensesTotal}`);
  console.log(`Net Profit: ₹${s.netProfit} (Margin: ${s.netProfitMargin}%)`);
  assert(s.confirmedSales > 0, "Confirmed sales reflects actual paid/fulfilled orders");
  assert(s.grossProfit === s.confirmedSales - s.cogsFulfilled, "Gross profit formula (Sales - COGS) matches exactly");

  // Test CSV Export
  const csvRes = await request("/api/admin/finance/export?type=pnl", {
    headers: { Cookie: adminCookie },
  });
  assert(csvRes.status === 200 && csvRes.headers.get("content-type")?.includes("text/csv"), "CSV Export for Profit & Loss generates valid text/csv");

  // -------------------------------------------------------------------------
  // 9. WHATSAPP MARKETING GENERATOR INTEGRITY
  // -------------------------------------------------------------------------
  console.log("\n--- TEST 9: WhatsApp Marketing Generator Selling Prices Only ---");
  // Check marketing products
  const mktProds = await request("/api/admin/products", {
    headers: { Cookie: adminCookie },
  });
  const mktList = mktProds.data?.products?.filter((p) => p.include_in_marketing === 1) || [];
  assert(mktList.length > 0, `Found ${mktList.length} products enabled for WhatsApp marketing post`);
  // Verify that neither supplier names nor supplier costs are exposed
  const leakedCost = mktList.some((p) => p.purchase_price_amount !== undefined || p.supplier_name !== undefined);
  assert(!leakedCost, "WhatsApp marketing data contains ONLY customer selling prices (ZERO supplier leaks)");

  console.log("\n==========================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("FATAL ERROR in test suite:", err);
  process.exit(1);
});
