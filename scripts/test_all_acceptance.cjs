const fs = require('fs');

async function runAcceptanceTests() {
  console.log("=================================================");
  console.log("   TECHNKT BACKEND ACCEPTANCE TESTS (TESTS 1-12) ");
  console.log("=================================================");

  const baseUrl = "http://localhost:4321";
  let adminCookie = "";

  // ──────────────────────────────────────────
  // TEST 12 (Run first to verify unauthorized security): Unauthorized User Access
  // ──────────────────────────────────────────
  console.log("\n[TEST 12: Security - Unauthorized Access Check]");
  try {
    const res = await fetch(`${baseUrl}/api/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacked Item", category_id: "software", image_url: "/hack.png" })
    });
    console.log("Unauthorized POST /api/admin/products status:", res.status);
    if (res.status === 401) {
      console.log("✅ TEST 12 PASSED: Unauthorized visitor blocked with 401 Unauthorized.");
    } else {
      console.error("❌ TEST 12 FAILED: Expected 401 but got", res.status);
    }
  } catch (err) {
    console.error("❌ TEST 12 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // ADMIN LOGIN: Authenticate to get session cookie
  // ──────────────────────────────────────────
  console.log("\n[ADMIN AUTHENTICATION: Logging in as admin]");
  const adminPass = process.env.ADMIN_PASSWORD || "TechNKT@DevPass2026!";
  try {
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: adminPass })
    });
    const data = await res.json();
    console.log("Login response:", data);
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      adminCookie = setCookie.split(";")[0];
      console.log("✅ Admin session cookie obtained:", adminCookie);
    } else {
      console.error("❌ Failed to obtain admin cookie");
    }
  } catch (err) {
    console.error("❌ Admin login error:", err);
  }

  // ──────────────────────────────────────────
  // TEST 1: New Product Creation & Store Display
  // ──────────────────────────────────────────
  console.log("\n[TEST 1: Admin Adds New Product]");
  let createdProductId = "";
  const testSlug = `claude-pro-test-${Date.now()}`;
  try {
    const res = await fetch(`${baseUrl}/api/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": adminCookie
      },
      body: JSON.stringify({
        name: "Claude Pro (Test Product)",
        slug: testSlug,
        category_id: "software",
        image_url: "/images/products/claude-test.jpg",
        description: "Official Anthropic Claude Pro subscription with unlimited Claude 3.5 Sonnet queries.",
        short_description: "Unlimited Claude 3.5 Sonnet access.",
        badge: "AI PRO",
        status: "active",
        featured: true,
        sort_order: 1
      })
    });
    const data = await res.json();
    if (data.success && data.product) {
      createdProductId = data.product.id;
      console.log(`Product created: ID=${createdProductId}, Name="${data.product.name}"`);

      // Add a variant for it
      const varRes = await fetch(`${baseUrl}/api/admin/variants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": adminCookie
        },
        body: JSON.stringify({
          product_id: createdProductId,
          variant_name: "1 Month Pro",
          duration_value: 1,
          duration_unit: "month",
          price_amount: 1499,
          comparison_price_amount: 1999,
          validity_description: "30 Days Active",
          warranty_description: "30 Days Replacement Warranty",
          delivery_description: "Instant Auto-Delivery via WhatsApp / Email",
          activation_description: "Private Login Credentials",
          availability: "in_stock"
        })
      });
      const varData = await varRes.json();
      console.log("Variant created:", varData.variant?.variant_name, "Price:", varData.variant?.price_amount);

      // Verify product appears on public store API
      const storeRes = await fetch(`${baseUrl}/api/products`);
      const storeData = await storeRes.json();
      const foundInStore = storeData.products.find(p => p.id === createdProductId);
      if (foundInStore) {
        console.log("✅ TEST 1 PASSED: Product appeared on public Store API with variants!");
      } else {
        console.error("❌ TEST 1 FAILED: Product not found on public Store API.");
      }
    } else {
      console.error("❌ TEST 1 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 1 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 2: Image Upload Simulation
  // ──────────────────────────────────────────
  console.log("\n[TEST 2: Product Image Upload]");
  try {
    const boundary = "----WebKitFormBoundaryTest123";
    const fakeImage = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]); // JPEG header
    const bodyBuffer = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test-product.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
      fakeImage,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const res = await fetch(`${baseUrl}/api/admin/upload`, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Cookie": adminCookie,
        "Origin": baseUrl,
        "Referer": `${baseUrl}/admin`
      },
      body: bodyBuffer
    });
    const data = await res.json();
    console.log("Upload result:", data);
    if (data.success && data.url) {
      console.log("✅ TEST 2 PASSED: High-res product image uploaded successfully to:", data.url);
    } else {
      console.error("❌ TEST 2 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 2 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 3: Product Price Update (Admin -> Store & WhatsApp sync)
  // ──────────────────────────────────────────
  console.log("\n[TEST 3: Product Price Update & Catalogue Sync]");
  try {
    // Update Netflix 4K variant price from 139 to 149
    const prodRes = await fetch(`${baseUrl}/api/products/netflix-4k`);
    const prodData = await prodRes.json();
    const netflix1m = prodData.product.variants.find(v => v.variant_name.includes("1 Month"));

    if (netflix1m) {
      const originalPrice = netflix1m.price_amount;
      const newPrice = 149;

      const updateRes = await fetch(`${baseUrl}/api/admin/variants/${netflix1m.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": adminCookie
        },
        body: JSON.stringify({ price_amount: newPrice })
      });
      const updateData = await updateRes.json();
      console.log(`Updated Netflix price from ₹${originalPrice} to ₹${updateData.variant.price_amount}`);

      // Verify Store API reflects new price
      const checkRes = await fetch(`${baseUrl}/api/products/netflix-4k`);
      const checkData = await checkRes.json();
      const updatedVariant = checkData.product.variants.find(v => v.id === netflix1m.id);

      // Verify WhatsApp marketing generator reflects new price
      const mktRes = await fetch(`${baseUrl}/api/admin/marketing`, {
        headers: { "Cookie": adminCookie }
      });
      const mktData = await mktRes.json();
      const hasNewPriceInMarketing = mktData.post.includes(`₹${newPrice}/-`);

      if (updatedVariant.price_amount === newPrice && hasNewPriceInMarketing) {
        console.log("✅ TEST 3 PASSED: Price update immediately propagated to Store API and WhatsApp Generator!");
      } else {
        console.error("❌ TEST 3 FAILED: Store price =", updatedVariant.price_amount, "Marketing has new price =", hasNewPriceInMarketing);
      }
    }
  } catch (err) {
    console.error("❌ TEST 3 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 4: Guest Order Placement (No Login / OTP)
  // ──────────────────────────────────────────
  console.log("\n[TEST 4: Guest Order Placement]");
  let createdOrderRef = "";
  try {
    const res = await fetch(`${baseUrl}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: "Amit Patel",
        whatsapp_number: "+91 9876543210",
        delivery_preference: "whatsapp",
        items: [
          { product_id: "netflix-4k", quantity: 1 }
        ]
      })
    });
    const data = await res.json();
    console.log("Order placement response:", data);
    if (data.success && data.orderReference) {
      createdOrderRef = data.orderReference;
      console.log(`Order Reference: ${createdOrderRef}, Total: ₹${data.totalAmount}, Status: ${data.orderStatus}`);

      // Verify in Admin Orders
      const adminOrderRes = await fetch(`${baseUrl}/api/admin/orders?search=${createdOrderRef}`, {
        headers: { "Cookie": adminCookie }
      });
      const adminOrderData = await adminOrderRes.json();
      const foundOrder = adminOrderData.orders.find(o => o.public_order_reference === createdOrderRef);

      if (foundOrder && foundOrder.total_amount === data.totalAmount) {
        console.log("✅ TEST 4 PASSED: Guest order placed with no login/OTP, correct database price snapshot & viewable in Admin!");
      } else {
        console.error("❌ TEST 4 FAILED: Order not found in admin list.");
      }
    } else {
      console.error("❌ TEST 4 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 4 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 5: Direct WhatsApp Order Link
  // ──────────────────────────────────────────
  console.log("\n[TEST 5: Direct WhatsApp Order Link]");
  try {
    const res = await fetch(`${baseUrl}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: "Sneha Rao",
        whatsapp_number: "+91 9988776655",
        delivery_preference: "whatsapp",
        order_source: "whatsapp_direct",
        items: [
          { product_id: "prime-4k", quantity: 2 }
        ]
      })
    });
    const data = await res.json();
    console.log("Direct WhatsApp order response:", data);
    if (data.success && data.encodedWhatsAppUrl) {
      const url = data.encodedWhatsAppUrl;
      const targetPhoneValid = url.includes("wa.me/919822587641");
      const statusValid = data.orderStatus === "awaiting_customer_message";
      console.log("Target business number correct:", targetPhoneValid);
      console.log("Preliminary status is 'awaiting_customer_message':", statusValid);
      if (targetPhoneValid && statusValid) {
        console.log("✅ TEST 5 PASSED: Direct WhatsApp order deep-links to +91 9822587641 with unconfirmed status!");
      } else {
        console.error("❌ TEST 5 FAILED: Invalid WhatsApp target or premature confirmation status.");
      }
    }
  } catch (err) {
    console.error("❌ TEST 5 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 6: WhatsApp Promotional Post Generator
  // ──────────────────────────────────────────
  console.log("\n[TEST 6: WhatsApp Promotional Post Generator]");
  try {
    const res = await fetch(`${baseUrl}/api/admin/marketing`, {
      headers: { "Cookie": adminCookie }
    });
    const data = await res.json();
    console.log("Post preview (first 250 chars):\n" + data.post.slice(0, 250) + "...\n");
    const containsBold = data.post.includes("*🔥 NKT TECH SHOP 🔥*");
    const containsCheckmarks = data.post.includes("✅");
    const containsPrices = data.post.includes("₹");
    const containsPlaceholders = data.post.includes("[CURRENT PRICE]");

    if (containsBold && containsCheckmarks && containsPrices && !containsPlaceholders) {
      console.log("✅ TEST 6 PASSED: Formatted promotional post generated with zero placeholders and live prices!");
    } else {
      console.error("❌ TEST 6 FAILED: Missing formatting or contains literal placeholders.");
    }
  } catch (err) {
    console.error("❌ TEST 6 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 7: Bulk Price Import (Single Variant)
  // ──────────────────────────────────────────
  console.log("\n[TEST 7: Bulk Rate-List Parser - Single Variant]");
  try {
    const rawPost = `*🎬 OTT & Entertainment*\n✅ Netflix 4K – 1M (1 Screen) @ ₹80/-`;
    const res = await fetch(`${baseUrl}/api/admin/bulk-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": adminCookie
      },
      body: JSON.stringify({ action: "parse", rawText: rawPost })
    });
    const data = await res.json();
    console.log("Parsed diffs count:", data.diffs?.length);
    const diff = data.diffs?.[0];
    console.log("Matched product:", diff?.matchedProductName, "Proposed price:", diff?.proposedPrice, "Status:", diff?.status);

    if (diff && diff.matchedProductName && diff.proposedPrice === 80 && diff.status === "PRICE_CHANGE") {
      console.log("✅ TEST 7 PASSED: Identified Netflix 4K, parsed ₹80, marked PRICE_CHANGE awaiting approval!");
    } else {
      console.error("❌ TEST 7 FAILED:", diff);
    }
  } catch (err) {
    console.error("❌ TEST 7 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 8: Multiple Variants on One Line
  // ──────────────────────────────────────────
  console.log("\n[TEST 8: Multiple Variants on One Line]");
  try {
    const rawPost = `✅ Amazon Prime Video – 1M @ ₹49/- | 6M @ ₹169/-`;
    const res = await fetch(`${baseUrl}/api/admin/bulk-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": adminCookie
      },
      body: JSON.stringify({ action: "parse", rawText: rawPost })
    });
    const data = await res.json();
    console.log("Diffs detected from multi-variant line:", data.diffs?.length);
    const prices = data.diffs?.map(d => d.proposedPrice);
    console.log("Detected prices:", prices);

    if (data.diffs?.length === 2 && prices.includes(49) && prices.includes(169)) {
      console.log("✅ TEST 8 PASSED: Successfully parsed 2 independent proposed variant prices from one line!");
    } else {
      console.error("❌ TEST 8 FAILED: Expected 2 separate variant diffs, got:", data.diffs);
    }
  } catch (err) {
    console.error("❌ TEST 8 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 9: Missing Price Handling (Never reset to zero)
  // ──────────────────────────────────────────
  console.log("\n[TEST 9: Missing Price Line Handling]");
  try {
    const rawPost = `✅ Spotify Premium – 3M / 12M (Fresh ID)`;
    const res = await fetch(`${baseUrl}/api/admin/bulk-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": adminCookie
      },
      body: JSON.stringify({ action: "parse", rawText: rawPost })
    });
    const data = await res.json();
    const diff = data.diffs?.[0];
    console.log("Missing price line status:", diff?.status, "Proposed price:", diff?.proposedPrice);

    if (diff && diff.status === "NO_PRICE_PROVIDED" && diff.proposedPrice === null) {
      console.log("✅ TEST 9 PASSED: Missing price flagged as NO_PRICE_PROVIDED and NOT set to zero!");
    } else {
      console.error("❌ TEST 9 FAILED:", diff);
    }
  } catch (err) {
    console.error("❌ TEST 9 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 10: Unmatched Product Flagging
  // ──────────────────────────────────────────
  console.log("\n[TEST 10: Unmatched Product Handling]");
  try {
    const rawPost = `✅ Some Unregistered Service 2026 – 1M @ ₹999/-`;
    const res = await fetch(`${baseUrl}/api/admin/bulk-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": adminCookie
      },
      body: JSON.stringify({ action: "parse", rawText: rawPost })
    });
    const data = await res.json();
    const diff = data.diffs?.[0];
    console.log("Unmatched line status:", diff?.status, "Approvable:", diff?.approvable);

    if (diff && diff.status === "NEW_PRODUCT" && diff.approvable === false) {
      console.log("✅ TEST 10 PASSED: Unmatched product marked NEW_PRODUCT and auto-approval blocked!");
    } else {
      console.error("❌ TEST 10 FAILED:", diff);
    }
  } catch (err) {
    console.error("❌ TEST 10 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // TEST 11: Atomic Bulk Update & One-Click Rollback
  // ──────────────────────────────────────────
  console.log("\n[TEST 11: Atomic Bulk Update and Rollback]");
  try {
    // 1. Parse a change for Hotstar from ₹99 to ₹89
    const parseRes = await fetch(`${baseUrl}/api/admin/bulk-update`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": adminCookie },
      body: JSON.stringify({
        action: "parse",
        rawText: `✅ Hotstar (On Number) – 1M @ ₹89/-`
      })
    });
    const parseData = await parseRes.json();
    const batchId = parseData.batchId;
    console.log("Batch created for atomic update:", batchId);

    if (batchId) {
      // 2. Apply batch
      const applyRes = await fetch(`${baseUrl}/api/admin/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Cookie": adminCookie },
        body: JSON.stringify({ action: "apply", batchId, approvedChangeIds: [] })
      });
      const applyData = await applyRes.json();
      console.log("Apply response:", applyData);

      // Verify DB Hotstar price is now 89
      const hotstarCheck1 = await fetch(`${baseUrl}/api/products/hotstar-number`);
      const hotstarData1 = await hotstarCheck1.json();
      const currentPrice = hotstarData1.product.variants[0].price_amount;
      console.log("Hotstar price after atomic update:", currentPrice);

      // 3. Rollback batch
      const rollbackRes = await fetch(`${baseUrl}/api/admin/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Cookie": adminCookie },
        body: JSON.stringify({ action: "rollback", batchId })
      });
      const rollbackData = await rollbackRes.json();
      console.log("Rollback response:", rollbackData);

      // Verify DB Hotstar price restored to original 99
      const hotstarCheck2 = await fetch(`${baseUrl}/api/products/hotstar-number`);
      const hotstarData2 = await hotstarCheck2.json();
      const restoredPrice = hotstarData2.product.variants[0].price_amount;
      console.log("Hotstar price after rollback:", restoredPrice);

      if (currentPrice === 89 && restoredPrice === 99) {
        console.log("✅ TEST 11 PASSED: Atomic bulk price update and safe rollback restored original prices!");
      } else {
        console.error("❌ TEST 11 FAILED: Expected 89 then 99, got:", currentPrice, restoredPrice);
      }
    }
  } catch (err) {
    console.error("❌ TEST 11 ERROR:", err);
  }

  // ──────────────────────────────────────────
  // CLEANUP TEST PRODUCT
  // ──────────────────────────────────────────
  if (createdProductId) {
    await fetch(`${baseUrl}/api/admin/products/${createdProductId}`, {
      method: "DELETE",
      headers: { "Cookie": adminCookie }
    });
    console.log("\n[CLEANUP] Deleted temporary test product:", createdProductId);
  }

  console.log("\n=================================================");
  console.log("          ALL ACCEPTANCE TESTS COMPLETE          ");
  console.log("=================================================");
}

runAcceptanceTests().catch(console.error);
