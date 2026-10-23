const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ARTIFACTS_DIR = "C:/Users/nikhi/.gemini/antigravity-ide/brain/2f9e2cd9-0818-44b0-9552-561f4ba8c504";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333;
const TEMP_PROFILE = path.join(__dirname, "../scratch/chrome_profile_" + Date.now());

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAdminToken() {
  const adminPass = process.env.ADMIN_PASSWORD || "TechNKT@DevPass2026!";
  const res = await fetch("http://localhost:4321/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: adminPass }),
  });
  const cookieHeader = res.headers.get("set-cookie") || "";
  const match = cookieHeader.match(/technkt_admin_session=([^;]+)/);
  return match ? match[1] : "";
}

async function getCustomerToken() {
  const username = "screenshot_user";
  // Try register first
  await fetch("http://localhost:4321/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: "Password123!", confirmPassword: "Password123!" }),
  });

  const res = await fetch("http://localhost:4321/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: "Password123!" }),
  });
  const cookieHeader = res.headers.get("set-cookie") || "";
  const match = cookieHeader.match(/technkt_customer_session=([^;]+)/);
  return match ? match[1] : "";
}

async function run() {
  console.log("Obtaining authentication tokens...");
  const adminToken = await getAdminToken();
  const customerToken = await getCustomerToken();
  console.log("Admin token present:", Boolean(adminToken));
  console.log("Customer token present:", Boolean(customerToken));

  fs.mkdirSync(TEMP_PROFILE, { recursive: true });

  console.log("Launching headless Chrome on port", PORT);
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    `--user-data-dir=${TEMP_PROFILE}`,
    "about:blank",
  ]);

  // Wait for Chrome to listen
  let wsUrl = "";
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const vRes = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const vData = await vRes.json();
      if (vData.webSocketDebuggerUrl) {
        wsUrl = vData.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error("Failed to connect to Chrome CDP");
    chromeProc.kill();
    process.exit(1);
  }

  console.log("Connected to Chrome CDP WebSocket:", wsUrl);
  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  if (ws.readyState !== 1) {
    await new Promise((res) => (ws.onopen = res));
  }

  // Create a target page
  const { targetId } = await sendCommand("Target.createTarget", { url: "about:blank" });
  const pageRes = await fetch(`http://127.0.0.1:${PORT}/json`);
  const pages = await pageRes.json();
  const pageTarget = pages.find((p) => p.id === targetId);

  const pageWs = new WebSocket(pageTarget.webSocketDebuggerUrl);
  if (pageWs.readyState !== 1) {
    await new Promise((res) => (pageWs.onopen = res));
  }

  const pageCallbacks = new Map();
  pageWs.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.exceptionThrown") {
      console.error("PAGE EXCEPTION:", msg.params.exceptionDetails?.text, msg.params.exceptionDetails?.exception?.description);
    }
    if (msg.id && pageCallbacks.has(msg.id)) {
      const cb = pageCallbacks.get(msg.id);
      pageCallbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    }
  };

  function sendPageCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pageCallbacks.set(id, { resolve, reject });
      pageWs.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendPageCommand("Page.enable");
  await sendPageCommand("Network.enable");
  await sendPageCommand("Runtime.enable");

  // Navigate to localhost first so cookies attach to the origin
  await sendPageCommand("Page.navigate", { url: "http://localhost:4321/admin/login" });
  await sleep(1500);

  // Set cookies with exact url origin
  if (adminToken) {
    await sendPageCommand("Network.setCookie", {
      url: "http://localhost:4321",
      name: "technkt_admin_session",
      value: adminToken,
      httpOnly: true,
      sameSite: "Lax",
    });
  }
  if (customerToken) {
    await sendPageCommand("Network.setCookie", {
      url: "http://localhost:4321",
      name: "technkt_customer_session",
      value: customerToken,
      httpOnly: true,
      sameSite: "Lax",
    });
  }

  const tasks = [
    {
      name: "admin_v2_dashboard_overview",
      url: "http://localhost:4321/admin",
      width: 1440,
      height: 900,
      delay: 5000,
    },
    {
      name: "admin_v2_finance_pnl",
      url: "http://localhost:4321/admin/finance",
      width: 1440,
      height: 900,
      delay: 5000,
    },
    {
      name: "admin_v2_suppliers_directory",
      url: "http://localhost:4321/admin/suppliers",
      width: 1440,
      height: 900,
      delay: 5000,
    },
    {
      name: "admin_v2_procurement_sourcing",
      url: "http://localhost:4321/admin/procurement",
      width: 1440,
      height: 900,
      delay: 3500,
    },
    {
      name: "admin_v2_orders_desk",
      url: "http://localhost:4321/admin/orders",
      width: 1440,
      height: 900,
      delay: 3500,
    },
    {
      name: "customer_v2_account_dashboard",
      url: "http://localhost:4321/account",
      width: 1440,
      height: 900,
      delay: 3500,
    },
    {
      name: "customer_v2_checkout_page",
      url: "http://localhost:4321/cart",
      width: 1440,
      height: 900,
      delay: 2000,
    },
    {
      name: "admin_v2_mobile_dashboard",
      url: "http://localhost:4321/admin",
      width: 375,
      height: 812,
      delay: 3500,
    },
    {
      name: "customer_v2_mobile_account",
      url: "http://localhost:4321/account",
      width: 375,
      height: 812,
      delay: 3500,
    },
  ];

  for (const t of tasks) {
    console.log(`Navigating to ${t.url} (${t.width}x${t.height})...`);
    await sendPageCommand("Emulation.setDeviceMetricsOverride", {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 2,
      mobile: t.width < 768,
    });

    await sendPageCommand("Page.navigate", { url: t.url });
    await sleep(t.delay);

    const { data } = await sendPageCommand("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    const outPath = path.join(ARTIFACTS_DIR, `${t.name}.png`);
    fs.writeFileSync(outPath, Buffer.from(data, "base64"));
    console.log(`Saved screenshot: ${t.name}.png (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
  }

  console.log("All screenshots captured successfully!");
  pageWs.close();
  ws.close();
  chromeProc.kill();

  try {
    fs.rmSync(TEMP_PROFILE, { recursive: true, force: true });
  } catch (e) {}
}

run().catch((e) => {
  console.error("Screenshot error:", e);
  process.exit(1);
});
