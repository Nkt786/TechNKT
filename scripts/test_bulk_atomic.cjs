const http = require("http");

const ADMIN_PASS = process.env.ADMIN_PASSWORD || "TechNKT@DevPass2026!";

async function testBulkAtomic() {
  const loginRes = await fetch("http://localhost:4321/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: ADMIN_PASS }),
  });
  const cookie = loginRes.headers.get("set-cookie")?.split(";")[0];

  // 1. Parse a change for Hotstar from ₹99 to ₹89
  const parseRes = await fetch("http://localhost:4321/api/admin/bulk-update", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      action: "parse",
      rawText: "✅ Hotstar (On Number) – 1M @ ₹89/-",
    }),
  });
  const parseData = await parseRes.json();
  console.log("Parse response:", parseData);

  const batchId = parseData.batchId;
  if (!batchId) {
    console.error("No batchId returned!");
    return;
  }

  // 2. Apply batch
  const applyRes = await fetch("http://localhost:4321/api/admin/bulk-update", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ action: "apply", batchId }),
  });
  const applyData = await applyRes.json();
  console.log("Apply response:", applyData);

  // 3. Check price
  const prodRes = await fetch("http://localhost:4321/api/products/hotstar-number");
  const prodData = await prodRes.json();
  console.log("Hotstar price after apply:", prodData.product?.variants?.[0]?.price_amount);

  // 4. Rollback batch
  const rollbackRes = await fetch("http://localhost:4321/api/admin/bulk-update", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ action: "rollback", batchId }),
  });
  const rollbackData = await rollbackRes.json();
  console.log("Rollback response:", rollbackData);

  // 5. Check price after rollback
  const prodRes2 = await fetch("http://localhost:4321/api/products/hotstar-number");
  const prodData2 = await prodRes2.json();
  console.log("Hotstar price after rollback:", prodData2.product?.variants?.[0]?.price_amount);
}

testBulkAtomic().catch(console.error);
