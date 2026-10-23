const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ARTIFACTS_DIR = "C:/Users/nikhi/.gemini/antigravity-ide/brain/2f9e2cd9-0818-44b0-9552-561f4ba8c504";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9336;
const TEMP_PROFILE = path.join(__dirname, "../scratch/chrome_profile_sticky_" + Date.now());

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

async function main() {
  const adminToken = await getAdminToken();
  console.log("Admin token obtained:", adminToken.substring(0, 10) + "...");

  fs.mkdirSync(TEMP_PROFILE, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--user-data-dir=${TEMP_PROFILE}`,
    "about:blank",
  ]);

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
  await sendPageCommand("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Navigate to login first to bind origin
  await sendPageCommand("Page.navigate", { url: "http://localhost:4321/admin/login" });
  await sleep(1500);

  // Set admin cookie on exact origin
  await sendPageCommand("Network.setCookie", {
    url: "http://localhost:4321",
    name: "technkt_admin_session",
    value: adminToken,
    httpOnly: true,
    sameSite: "Lax",
  });

  // Now navigate to /admin
  await sendPageCommand("Page.navigate", { url: "http://localhost:4321/admin" });
  await sleep(3500);

  // Get initial sidebar position
  const initialSidebarPos = await sendPageCommand("Runtime.evaluate", {
    expression: `
      (() => {
        const aside = document.querySelector('aside');
        if (!aside) return null;
        const rect = aside.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
      })()
    `,
    returnByValue: true,
  });
  console.log("Initial Sidebar Position:", initialSidebarPos.result.value);

  // Scroll the main content area down by 600px
  const scrollResult = await sendPageCommand("Runtime.evaluate", {
    expression: `
      (() => {
        const main = document.querySelector('main');
        if (!main) return null;
        main.scrollTop = 600;
        return { scrollTop: main.scrollTop, scrollHeight: main.scrollHeight };
      })()
    `,
    returnByValue: true,
  });
  console.log("Main Scroll State:", scrollResult.result.value);
  await sleep(1000);

  // Get scrolled sidebar position
  const scrolledSidebarPos = await sendPageCommand("Runtime.evaluate", {
    expression: `
      (() => {
        const aside = document.querySelector('aside');
        if (!aside) return null;
        const rect = aside.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
      })()
    `,
    returnByValue: true,
  });
  console.log("Scrolled Sidebar Position:", scrolledSidebarPos.result.value);

  // Capture screenshot of scrolled dashboard
  const screenshotData = await sendPageCommand("Page.captureScreenshot", {
    format: "png",
  });

  const savePath = path.join(ARTIFACTS_DIR, "admin_v2_sidebar_fixed_scrolled.png");
  fs.writeFileSync(savePath, Buffer.from(screenshotData.data, "base64"));
  console.log("Saved verification screenshot to:", savePath);

  pageWs.close();
  ws.close();
  chromeProc.kill();

  if (!initialSidebarPos.result.value || !scrolledSidebarPos.result.value) {
    console.error("Could not find <aside> element on page.");
    process.exit(1);
  }

  const isStationary =
    initialSidebarPos.result.value.top === scrolledSidebarPos.result.value.top &&
    initialSidebarPos.result.value.left === scrolledSidebarPos.result.value.left;

  console.log("\nInitial Top:", initialSidebarPos.result.value.top, "-> Scrolled Top:", scrolledSidebarPos.result.value.top);
  console.log("Main content scrolled by:", scrollResult.result.value?.scrollTop, "px");

  if (isStationary && scrollResult.result.value?.scrollTop > 0) {
    console.log("\n[VERIFIED] Sidebar is 100% FIXED & STICKY! It does NOT move or scroll with content.");
  } else {
    console.error("\n[FAILED] Sidebar moved during scroll!");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
