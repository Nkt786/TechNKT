const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9225;
const USER_DATA = path.join(process.cwd(), '.chrome-audit-profile');

const ROUTES = [
  '/',
  '/shop',
  '/web-development',
  '/ebook',
  '/about',
  '/contact',
  '/account',
  '/cart',
  '/terms-and-conditions'
];

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function runAudit() {
  console.log("Launching headless Chrome for network & visual audit...");
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900'
  ]);

  try {
    let targets;
    for (let i = 0; i < 30; i++) {
      try {
        targets = await getJSON(`http://127.0.0.1:${PORT}/json`);
        if (targets && targets.length > 0) break;
      } catch (_) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    const page = targets.find(t => t.type === 'page');
    console.log("Connected to Chrome via CDP page:", page.webSocketDebuggerUrl);
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const id = msgId++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send("Network.enable");
    await send("Page.enable");
    await send("Console.enable");

    const failedRequests = [];
    const allAssetRequests = [];

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.method === "Network.responseReceived") {
        const { url, status, mimeType } = data.params.response;
        if (url.startsWith('http://localhost:4321')) {
          allAssetRequests.push({ url, status, mimeType });
          if (status >= 400) {
            failedRequests.push({ url, status, mimeType });
          }
        }
      }
      if (data.method === "Network.loadingFailed") {
        failedRequests.push({ url: data.params.requestId, error: data.params.errorText });
      }
    });

    console.log("\n--- AUDITING ALL ROUTES FOR 404S AND BROKEN ASSETS ---");

    for (const route of ROUTES) {
      const targetUrl = `http://localhost:4321${route}`;
      process.stdout.write(`Testing route: ${route.padEnd(25)} ... `);
      await send("Page.navigate", { url: targetUrl });
      await new Promise(r => setTimeout(r, 2000));

      // Check DOM image errors
      const imgCheck = await send("Runtime.evaluate", {
        expression: `(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          const broken = imgs.filter(img => img.naturalWidth === 0 && img.src);
          return {
            totalImgs: imgs.length,
            brokenCount: broken.length,
            brokenSrcs: broken.map(i => i.src)
          };
        })()`,
        returnByValue: true
      });

      const res = imgCheck.result.value;
      if (res.brokenCount === 0) {
        console.log(`[PASS] (${res.totalImgs} images verified, 0 broken)`);
      } else {
        console.log(`[FAIL] (${res.brokenCount} broken images: ${res.brokenSrcs.join(', ')})`);
        failedRequests.push(...res.brokenSrcs.map(src => ({ url: src, status: 'DOM naturalWidth === 0' })));
      }
    }

    // Check Interactive category filtering on /shop
    console.log("\nTesting /shop interactive category switching...");
    await send("Page.navigate", { url: "http://localhost:4321/shop" });
    await new Promise(r => setTimeout(r, 1500));

    const categoryClick = await send("Runtime.evaluate", {
      expression: `(() => {
        const catButtons = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Software') || b.textContent.includes('Combo'));
        if (catButtons.length > 0) {
          catButtons[0].click();
          return { clicked: true, text: catButtons[0].textContent.trim() };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log("Category interaction:", categoryClick.result.value);
    await new Promise(r => setTimeout(r, 1000));

    // Capture screenshot of homepage
    console.log("\nCapturing visual screenshot of Homepage...");
    await send("Page.navigate", { url: "http://localhost:4321/" });
    await new Promise(r => setTimeout(r, 2500));
    const ssResult = await send("Page.captureScreenshot", { format: "png" });
    const ssPath = path.join(process.cwd(), 'audit_homepage_verified.png');
    fs.writeFileSync(ssPath, Buffer.from(ssResult.data, 'base64'));
    console.log(`Homepage screenshot saved to: ${ssPath}`);

    // Capture screenshot of Store
    console.log("Capturing visual screenshot of Store (/shop)...");
    await send("Page.navigate", { url: "http://localhost:4321/shop" });
    await new Promise(r => setTimeout(r, 2000));
    const shopResult = await send("Page.captureScreenshot", { format: "png" });
    const shopPath = path.join(process.cwd(), 'audit_shop_verified.png');
    fs.writeFileSync(shopPath, Buffer.from(shopResult.data, 'base64'));
    console.log(`Shop screenshot saved to: ${shopPath}`);

    // Summary of network requests
    console.log("\n=== NETWORK AUDIT SUMMARY ===");
    console.log(`Total Local HTTP Requests: ${allAssetRequests.length}`);
    console.log(`Failed / 404 Requests: ${failedRequests.length}`);

    if (failedRequests.length > 0) {
      console.error("\nFAILED REQUESTS FOUND:");
      failedRequests.forEach(f => console.error(f));
    } else {
      console.log("SUCCESS: 0 failed requests, 0 404 errors, 0 broken images across all tested pages!");
    }

    fs.writeFileSync(
      path.join(process.cwd(), 'scripts', 'browser_audit_results.json'),
      JSON.stringify({ allAssetRequestsCount: allAssetRequests.length, failedRequests }, null, 2),
      'utf8'
    );

    ws.close();
  } finally {
    chromeProcess.kill();
    try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (_) {}
  }
}

runAudit().catch(err => {
  console.error("Audit failed:", err);
  process.exit(1);
});
