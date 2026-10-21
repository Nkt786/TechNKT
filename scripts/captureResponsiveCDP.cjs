const fs = require('fs');
const path = require('path');
const http = require('http');

const BRAIN_DIR = 'C:\\Users\\nikhi\\.gemini\\antigravity-ide\\brain\\2f9e2cd9-0818-44b0-9552-561f4ba8c504';
const WORKSPACE_DIR = 'C:\\Users\\nikhi\\Desktop\\automark-astro-main';

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(path.join(WORKSPACE_DIR, filename), buf);
    try {
      fs.writeFileSync(path.join(BRAIN_DIR, filename), buf);
    } catch (_) {}
    console.log(`Saved screenshot: ${filename} (${buf.length} bytes)`);
    return buf.length;
  }

  async close() {
    this.ws.close();
  }
}

async function run() {
  const targets = await getJSON('http://127.0.0.1:9222/json');
  const page = targets.find(t => t.type === 'page' && t.url.includes('localhost:4321')) || targets.find(t => t.type === 'page');
  const client = new CDPClient(page.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  // 1. Tablet 820x1000
  console.log('Capturing tablet 820x1000...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 820,
    height: 1000,
    deviceScaleFactor: 2,
    mobile: false
  });
  await client.evaluate('window.__setHeroOrbitAngle && window.__setHeroOrbitAngle(0.4)');
  await new Promise(r => setTimeout(r, 600));
  await client.screenshot('test_g_tablet_820.png');

  // 2. Mobile 430x932
  console.log('Capturing mobile 430x932...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));
  await client.screenshot('test_g_mobile_430.png');

  // 3. Small Mobile 375x667
  console.log('Capturing small mobile 375x667...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));
  await client.screenshot('test_g_mobile_375.png');

  // 4. Drag interaction screenshot
  console.log('Capturing drag simulation on desktop...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });
  // Simulate rotation to drag angle
  await client.evaluate('window.__setHeroOrbitAngle && window.__setHeroOrbitAngle(1.15)');
  await new Promise(r => setTimeout(r, 600));
  await client.screenshot('test_f_drag_interaction.png');

  console.log('Done responsive captures!');
  await client.close();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
