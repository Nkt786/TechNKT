const http = require('http');
const fs = require('fs');

async function testAdmin() {
  const raw = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
    }).on('error', rej);
  });

  const targets = JSON.parse(raw);
  const page = targets.find(t => t.type === 'page' && t.url.includes('localhost:4321'));
  if (!page) throw new Error("No localhost:4321 page found");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(res => ws.addEventListener('open', res));

  let id = 1;
  const send = (m, p = {}) => new Promise((res) => {
    const cid = id++;
    const h = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === cid) {
        ws.removeEventListener('message', h);
        res(msg.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cid, method: m, params: p }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  console.log("Navigating to login...");
  await send('Page.navigate', { url: 'http://localhost:4321/admin/login' });
  await new Promise(res => setTimeout(res, 1200));

  const adminPass = process.env.ADMIN_PASSWORD || "TechNKT@DevPass2026!";
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('username').value = 'admin';
      document.getElementById('password').value = ${JSON.stringify(adminPass)};
      document.getElementById('submit-btn').click();
    `
  });
  console.log("Submitted login, waiting for redirect...");
  await new Promise(res => setTimeout(res, 2500));

  const scr = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/nikhi/.gemini/antigravity-ide/brain/2f9e2cd9-0818-44b0-9552-561f4ba8c504/.tempmediaStorage/admin_dashboard_current.png', Buffer.from(scr.data, 'base64'));
  console.log("Dashboard screenshot saved to admin_dashboard_current.png!");
  ws.close();
}

testAdmin().catch(console.error);
