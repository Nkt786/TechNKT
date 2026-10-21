const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Spawning Chrome...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\nikhi\\Desktop\\automark-astro-main\\.tmp_chrome_inspect',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let targets;
  for (let i = 0; i < 30; i++) {
    try {
      targets = await getJSON('http://127.0.0.1:9222/json');
      if (targets && targets.length > 0) break;
    } catch (_) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!targets) {
    console.error('Failed to connect to Chrome on port 9222');
    chrome.kill();
    process.exit(1);
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

  await send('Page.enable');
  await send('Runtime.enable');

  // 1. Inspect Web Development page at 375px
  console.log('Navigating to /web-development...');
  await send('Page.navigate', { url: 'http://localhost:4321/web-development' });
  await new Promise(r => setTimeout(r, 1500));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));

  const webDevInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const ph = document.querySelector('.section-ph');
      const p = ph ? ph.querySelector('p') : null;
      const imgSec = document.querySelector('section.py-10');
      const img = document.querySelector('img[alt*="Showcase"]');
      const bNav = document.querySelector('nav[aria-label="Mobile Navigation"]');
      return {
        ph: ph ? { class: ph.className, height: ph.offsetHeight, rect: ph.getBoundingClientRect() } : null,
        pSubtitle: p ? { text: p.textContent.slice(0, 30), rect: p.getBoundingClientRect() } : null,
        imgSec: imgSec ? { class: imgSec.className, height: imgSec.offsetHeight, rect: imgSec.getBoundingClientRect() } : null,
        img: img ? { height: img.offsetHeight, rect: img.getBoundingClientRect() } : null,
        bNav: bNav ? { rect: bNav.getBoundingClientRect() } : null,
        gapBetweenSubtitleAndImg: (img && p) ? (img.getBoundingClientRect().top - p.getBoundingClientRect().bottom) : null
      };
    })()`,
    returnByValue: true
  });
  console.log('WebDev metrics at 375x667:\n', JSON.stringify(webDevInfo.result.value, null, 2));

  const res1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('before_webdev_375.png', Buffer.from(res1.data, 'base64'));
  console.log('Saved before_webdev_375.png');

  // 2. Inspect Shop page at 375px
  console.log('Navigating to /shop...');
  await send('Page.navigate', { url: 'http://localhost:4321/shop' });
  await new Promise(r => setTimeout(r, 1500));

  const shopInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('header');
      const logo = document.querySelector('.navbar-brand');
      const catRow = document.querySelector('.overflow-x-auto');
      const acc = document.querySelector('a[href="/account"]');
      const cart = document.querySelector('a[href="/cart"]');
      const toggle = document.querySelector('label[for="nav-toggle"]');
      const navMenu = document.querySelector('#nav-menu');
      return {
        header: header ? { class: header.className, rect: header.getBoundingClientRect() } : null,
        logo: logo ? { rect: logo.getBoundingClientRect() } : null,
        catRow: catRow ? { rect: catRow.getBoundingClientRect() } : null,
        acc: acc ? { visible: acc.offsetParent !== null, rect: acc.getBoundingClientRect() } : null,
        cart: cart ? { rect: cart.getBoundingClientRect() } : null,
        toggle: toggle ? { visible: toggle.offsetParent !== null, rect: toggle.getBoundingClientRect() } : null,
        navMenu: navMenu ? { isHidden: getComputedStyle(navMenu).display === 'none', display: getComputedStyle(navMenu).display } : null,
        headerBottomVsCatRowTop: (header && catRow) ? { headerBottom: header.getBoundingClientRect().bottom, catRowTop: catRow.getBoundingClientRect().top } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Shop metrics at 375x667:\n', JSON.stringify(shopInfo.result.value, null, 2));

  const res2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('before_shop_375.png', Buffer.from(res2.data, 'base64'));
  console.log('Saved before_shop_375.png');

  ws.close();
  chrome.kill();
  console.log('Done!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
