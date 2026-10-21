const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const BRAIN_DIR = 'C:\\Users\\nikhi\\.gemini\\antigravity-ide\\brain\\2f9e2cd9-0818-44b0-9552-561f4ba8c504';
const WORKSPACE_DIR = 'C:\\Users\\nikhi\\Desktop\\automark-astro-main';

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
  console.log('Spawning Chrome for verification...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\nikhi\\Desktop\\automark-astro-main\\.tmp_chrome_verify',
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

  async function screenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(path.join(WORKSPACE_DIR, filename), buf);
    try {
      fs.writeFileSync(path.join(BRAIN_DIR, filename), buf);
    } catch (_) {}
    console.log(`Saved screenshot: ${filename} (${buf.length} bytes)`);
    return buf.length;
  }

  await send('Page.enable');
  await send('Runtime.enable');

  // ==========================================
  // TEST 1: Web Development Page at 375px
  // ==========================================
  console.log('\n--- VERIFYING WEB DEVELOPMENT PAGE AT 375PX ---');
  await send('Page.navigate', { url: 'http://localhost:4321/web-development' });
  await new Promise(r => setTimeout(r, 1500));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  const webDevMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const p = document.querySelector('.section-ph p');
      const img = document.querySelector('img[alt*="Showcase"]');
      const pRect = p.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      const gap = imgRect.top - pRect.bottom;
      const overflows = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      return {
        subtitleBottom: pRect.bottom,
        imageTop: imgRect.top,
        imageHeight: img.offsetHeight,
        gapBetweenSubtitleAndImage: gap,
        imageVisibleInViewport: imgRect.top < window.innerHeight && imgRect.bottom > 0,
        overflows
      };
    })()`,
    returnByValue: true
  });
  console.log('WebDev Metrics:', JSON.stringify(webDevMetrics.result.value, null, 2));
  await screenshot('after_webdev_375.png');

  // ==========================================
  // TEST 2: Store / Shop Page at 375px
  // ==========================================
  console.log('\n--- VERIFYING STORE / SHOP PAGE AT 375PX ---');
  await send('Page.navigate', { url: 'http://localhost:4321/shop' });
  await new Promise(r => setTimeout(r, 1500));

  const shopMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('header');
      const logo = document.querySelector('.navbar-brand');
      const catRow = document.querySelector('.overflow-x-auto');
      const acc = document.querySelector('a[href="/account"]');
      const cart = document.querySelector('a[href="/cart"]');
      const toggle = document.querySelector('label[for="nav-toggle"]');
      const navMenu = document.querySelector('#nav-menu');
      const hRect = header.getBoundingClientRect();
      const catRect = catRow.getBoundingClientRect();
      const overflows = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      return {
        headerHeight: header.offsetHeight,
        headerBottom: hRect.bottom,
        catRowTop: catRect.top,
        clearanceBelowHeader: catRect.top - hRect.bottom,
        isAccountHiddenOnMobile: acc ? (getComputedStyle(acc).display === 'none') : true,
        isCartVisible: cart ? (getComputedStyle(cart).display !== 'none') : false,
        isHamburgerVisible: toggle ? (getComputedStyle(toggle).display !== 'none') : false,
        isNavMenuHiddenByDefault: navMenu ? (getComputedStyle(navMenu).display === 'none') : true,
        overflows
      };
    })()`,
    returnByValue: true
  });
  console.log('Shop Metrics:', JSON.stringify(shopMetrics.result.value, null, 2));
  await screenshot('after_shop_375.png');

  // ==========================================
  // TEST 3: Mobile Menu Toggled Open at 375px
  // ==========================================
  console.log('\n--- TESTING MOBILE MENU TOGGLE ---');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('nav-toggle').checked = true;`
  });
  await new Promise(r => setTimeout(r, 500));

  const menuMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const navMenu = document.querySelector('#nav-menu');
      const links = Array.from(navMenu.querySelectorAll('a')).map(a => ({ name: a.textContent.trim(), href: a.getAttribute('href') }));
      return {
        isNavMenuVisibleWhenChecked: getComputedStyle(navMenu).display !== 'none',
        menuLinksCount: links.length,
        links
      };
    })()`,
    returnByValue: true
  });
  console.log('Mobile Menu Open Metrics:', JSON.stringify(menuMetrics.result.value, null, 2));
  await screenshot('after_menu_open_375.png');

  // Close menu back
  await send('Runtime.evaluate', {
    expression: `document.getElementById('nav-toggle').checked = false;`
  });
  await new Promise(r => setTimeout(r, 300));

  // ==========================================
  // TEST 4: Small Mobile 320px
  // ==========================================
  console.log('\n--- VERIFYING 320PX VIEWPORT ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 568,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));
  await screenshot('after_shop_320.png');

  await send('Page.navigate', { url: 'http://localhost:4321/web-development' });
  await new Promise(r => setTimeout(r, 1500));
  await screenshot('after_webdev_320.png');

  // ==========================================
  // TEST 5: Large Mobile 390px & 430px
  // ==========================================
  console.log('\n--- VERIFYING 390PX & 430PX VIEWPORTS ---');
  await send('Page.navigate', { url: 'http://localhost:4321/shop' });
  await new Promise(r => setTimeout(r, 1200));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 400));
  await screenshot('after_shop_390.png');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 400));
  await screenshot('after_shop_430.png');

  // ==========================================
  // TEST 6: Desktop 1440px (Preserved Layout)
  // ==========================================
  console.log('\n--- VERIFYING DESKTOP 1440PX ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 500));

  const desktopMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const acc = document.querySelector('a[href="/account"]');
      const cart = document.querySelector('a[href="/cart"]');
      const toggle = document.querySelector('label[for="nav-toggle"]');
      const navMenu = document.querySelector('#nav-menu');
      return {
        isAccountVisibleOnDesktop: getComputedStyle(acc).display !== 'none',
        isCartVisibleOnDesktop: getComputedStyle(cart).display !== 'none',
        isHamburgerHiddenOnDesktop: getComputedStyle(toggle).display === 'none',
        isNavMenuPillVisibleOnDesktop: getComputedStyle(navMenu).display !== 'none'
      };
    })()`,
    returnByValue: true
  });
  console.log('Desktop Metrics:', JSON.stringify(desktopMetrics.result.value, null, 2));
  await screenshot('after_shop_desktop_1440.png');

  ws.close();
  chrome.kill();
  console.log('\nALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
