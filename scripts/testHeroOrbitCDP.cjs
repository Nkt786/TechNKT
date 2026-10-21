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

  async screenshot(filename, clip = null) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const res = await this.send('Page.captureScreenshot', params);
    const buf = Buffer.from(res.data, 'base64');
    
    // Save to workspace and brain dir
    const workspacePath = path.join(WORKSPACE_DIR, filename);
    const brainPath = path.join(BRAIN_DIR, filename);
    fs.writeFileSync(workspacePath, buf);
    try {
      fs.writeFileSync(brainPath, buf);
    } catch (_) {}
    console.log(`Saved screenshot: ${filename} (${buf.length} bytes)`);
    return { workspacePath, brainPath, bytes: buf.length };
  }

  async close() {
    this.ws.close();
  }
}

async function run() {
  console.log('Fetching targets from Chrome CDP...');
  let targets;
  for (let i = 0; i < 20; i++) {
    try {
      targets = await getJSON('http://127.0.0.1:9222/json');
      break;
    } catch (_) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!targets) {
    console.error('Could not connect to Chrome on port 9222');
    process.exit(1);
  }

  const page = targets.find(t => t.type === 'page' && t.url.includes('localhost:4321')) || targets.find(t => t.type === 'page');
  console.log(`Using target: ${page.title} (${page.url})`);

  const client = new CDPClient(page.webSocketDebuggerUrl);
  await client.connect();
  console.log('Connected to CDP WebSocket');

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  // Wait for React hydration
  console.log('Waiting for hero orbit hydration...');
  for (let i = 0; i < 30; i++) {
    const ready = await client.evaluate('typeof window.__setHeroOrbitAngle === "function"');
    if (ready) break;
    await new Promise(r => setTimeout(r, 300));
  }

  // 1. Desktop Initial (Angle 0)
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });
  await client.evaluate('window.__setHeroOrbitAngle(0)');
  await new Promise(r => setTimeout(r, 600));
  await client.screenshot('test_a_desktop_initial.png');

  // 2. 90-degree Rotation
  await client.evaluate('window.__setHeroOrbitAngle(Math.PI / 2)');
  await new Promise(r => setTimeout(r, 600));
  await client.screenshot('test_b_desktop_rot90.png');

  // 3. 180-degree Rotation
  await client.evaluate('window.__setHeroOrbitAngle(Math.PI)');
  await new Promise(r => setTimeout(r, 600));
  await client.screenshot('test_c_desktop_rot180.png');

  // 4. 270-degree Rotation
  await client.evaluate('window.__setHeroOrbitAngle(Math.PI * 1.5)');
  await new Promise(r => setTimeout(r, 600));
  await client.screenshot('test_d_desktop_rot270.png');

  // 5. Drag-to-spin Simulation
  console.log('Simulating drag-to-spin...');
  await client.evaluate('window.__setHeroOrbitAngle(0)');
  await new Promise(r => setTimeout(r, 300));

  // Find container bounds
  const bounds = await client.evaluate(`
    const el = document.querySelector('[aria-label*="Interactive 3D rotating product orbit"]');
    if (!el) null;
    else {
      const r = el.getBoundingClientRect();
      ({ x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 })
    }
  `);

  if (bounds) {
    console.log('Found orbit visual bounds:', bounds);
    const startX = bounds.cx;
    const startY = bounds.cy;
    const targetX = bounds.cx - 220; // Drag left 220px

    await client.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: startX,
      y: startY,
      button: 'left',
      buttons: 1,
      clickCount: 1
    });

    // Move in increments
    for (let step = 1; step <= 10; step++) {
      const curX = startX + (targetX - startX) * (step / 10);
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: curX,
        y: startY,
        buttons: 1
      });
      await new Promise(r => setTimeout(r, 20));
    }

    const angleDuringDrag = await client.evaluate('window.__getHeroOrbitAngle()');
    console.log(`Angle during drag: ${angleDuringDrag.toFixed(4)} rad`);

    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: targetX,
      y: startY,
      button: 'left',
      buttons: 0
    });

    await new Promise(r => setTimeout(r, 300));
    const angleAfterRelease = await client.evaluate('window.__getHeroOrbitAngle()');
    console.log(`Angle after release: ${angleAfterRelease.toFixed(4)} rad`);

    await client.screenshot('test_f_drag_spun.png');
  }

  // 6. Responsive: Tablet (820x1180)
  console.log('Capturing tablet viewport (820x1180)...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 820,
    height: 1180,
    deviceScaleFactor: 2,
    mobile: false
  });
  await client.evaluate('window.__setHeroOrbitAngle(0)');
  await new Promise(r => setTimeout(r, 500));
  await client.screenshot('test_g_tablet_820.png');

  // 7. Responsive: Mobile (430x932)
  console.log('Capturing mobile viewport (430x932)...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));
  await client.screenshot('test_g_mobile_430.png');

  // 8. Responsive: Small Mobile (375x667)
  console.log('Capturing small mobile viewport (375x667)...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));
  await client.screenshot('test_g_mobile_375.png');

  console.log('ALL TESTS CAPTURED SUCCESSFULLY!');
  await client.close();
}

run().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
