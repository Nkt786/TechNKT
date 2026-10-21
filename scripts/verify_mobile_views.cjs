const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9226;
const USER_DATA = path.join(process.cwd(), '.chrome-mobile-profile');

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

async function runMobileAudit() {
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=375,812'
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

    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });

    // Mobile homepage
    await send("Page.navigate", { url: "http://localhost:4321/" });
    await new Promise(r => setTimeout(r, 2000));
    let ssResult = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(process.cwd(), 'audit_mobile_home.png'), Buffer.from(ssResult.data, 'base64'));
    console.log("Mobile homepage screenshot captured.");

    // Mobile shop
    await send("Page.navigate", { url: "http://localhost:4321/shop" });
    await new Promise(r => setTimeout(r, 2000));
    ssResult = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(process.cwd(), 'audit_mobile_shop.png'), Buffer.from(ssResult.data, 'base64'));
    console.log("Mobile shop screenshot captured.");

    // Tablet homepage (768px)
    await send("Emulation.setDeviceMetricsOverride", {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send("Page.navigate", { url: "http://localhost:4321/" });
    await new Promise(r => setTimeout(r, 2000));
    ssResult = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(process.cwd(), 'audit_tablet_home.png'), Buffer.from(ssResult.data, 'base64'));
    console.log("Tablet homepage screenshot captured.");

    ws.close();
  } finally {
    chromeProcess.kill();
    try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (_) {}
  }
}

runMobileAudit().catch(console.error);
