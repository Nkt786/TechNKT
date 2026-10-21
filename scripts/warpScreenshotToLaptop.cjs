const sharp = require('sharp');
const fs = require('fs');

async function warp() {
  // Source screenshot: crop from authentic TechNKT homepage
  // Header + Trending passes
  const sourceBuffer = await sharp('C:/Users/nikhi/.gemini/antigravity-ide/brain/2f9e2cd9-0818-44b0-9552-561f4ba8c504/homepage_full_1792610162645.png')
    .extract({ left: 100, top: 0, width: 1372, height: 950 })
    .resize(800, 550)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const srcData = sourceBuffer.data;
  const srcW = sourceBuffer.info.width;
  const srcH = sourceBuffer.info.height;

  // Read the laptop image (1024x1024)
  const laptop = await sharp('public/images/hero-laptop.webp')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const dstData = laptop.data;
  const dstW = laptop.info.width;
  const dstH = laptop.info.height;

  // The 4 corners of the laptop screen inside hero-laptop.webp:
  // p0: Top-Left (358, 128)
  // p1: Top-Right (942, 214)
  // p2: Bottom-Right (842, 665)
  // p3: Bottom-Left (368, 546)
  const p0 = { x: 358, y: 128 };
  const p1 = { x: 942, y: 214 };
  const p2 = { x: 842, y: 665 };
  const p3 = { x: 368, y: 546 };

  // Perspective projection matrix from unit square to destination quad (p0, p1, p2, p3)
  function getProjectiveTransform(x0, y0, x1, y1, x2, y2, x3, y3) {
    const dx1 = x1 - x2, dy1 = y1 - y2;
    const dx2 = x3 - x2, dy2 = y3 - y2;
    const sx = x0 - x1 + x2 - x3;
    const sy = y0 - y1 + y2 - y3;

    const g = (sx * dy2 - sy * dx2) / (dx1 * dy2 - dy1 * dx2);
    const h = (dx1 * sy - dy1 * sx) / (dx1 * dy2 - dy1 * dx2);

    const a = x1 - x0 + g * x1;
    const b = x3 - x0 + h * x3;
    const c = x0;
    const d = y1 - y0 + g * y1;
    const e = y3 - y0 + h * y3;
    const f = y0;

    return { a, b, c, d, e, f, g, h };
  }

  // Inverse projective matrix: maps from destination (x, y) to source (u, v) in [0, 1]
  function invertMatrix(M) {
    const A = M.e - M.f * M.h;
    const B = M.c * M.h - M.b;
    const C = M.b * M.f - M.c * M.e;
    const D = M.f * M.g - M.d;
    const E = M.a - M.c * M.g;
    const F = M.c * M.d - M.a * M.f;
    const G = M.d * M.h - M.e * M.g;
    const H = M.b * M.g - M.a * M.h;
    const I = M.a * M.e - M.b * M.d;

    return function(x, y) {
      const den = G * x + H * y + I;
      if (Math.abs(den) < 1e-8) return null;
      const u = (A * x + B * y + C) / den;
      const v = (D * x + E * y + F) / den;
      return { u, v };
    };
  }

  const forwardM = getProjectiveTransform(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  const invMap = invertMatrix(forwardM);

  // Scan the bounding box of the screen quad and blend
  const minX = Math.floor(Math.min(p0.x, p1.x, p2.x, p3.x));
  const maxX = Math.ceil(Math.max(p0.x, p1.x, p2.x, p3.x));
  const minY = Math.floor(Math.min(p0.y, p1.y, p2.y, p3.y));
  const maxY = Math.ceil(Math.max(p0.y, p1.y, p2.y, p3.y));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const uv = invMap(x, y);
      if (uv && uv.u >= 0 && uv.u <= 1 && uv.v >= 0 && uv.v <= 1) {
        // Bilinear sample from source image
        const su = uv.u * (srcW - 1);
        const sv = uv.v * (srcH - 1);
        const x0 = Math.floor(su), y0 = Math.floor(sv);
        const x1 = Math.min(x0 + 1, srcW - 1), y1 = Math.min(y0 + 1, srcH - 1);
        const fx = su - x0, fy = sv - y0;

        const idx00 = (y0 * srcW + x0) * 3;
        const idx10 = (y0 * srcW + x1) * 3;
        const idx01 = (y1 * srcW + x0) * 3;
        const idx11 = (y1 * srcW + x1) * 3;

        const r = (1 - fx) * (1 - fy) * srcData[idx00] + fx * (1 - fy) * srcData[idx10] + (1 - fx) * fy * srcData[idx01] + fx * fy * srcData[idx11];
        const g = (1 - fx) * (1 - fy) * srcData[idx00+1] + fx * (1 - fy) * srcData[idx10+1] + (1 - fx) * fy * srcData[idx01+1] + fx * fy * srcData[idx11+1];
        const b = (1 - fx) * (1 - fy) * srcData[idx00+2] + fx * (1 - fy) * srcData[idx10+2] + (1 - fx) * fy * srcData[idx01+2] + fx * fy * srcData[idx11+2];

        const dstIdx = (y * dstW + x) * 4;
        // Subtle glare/screen sheen overlay
        const sheen = 0.92;
        dstData[dstIdx] = Math.round(r * sheen);
        dstData[dstIdx + 1] = Math.round(g * sheen);
        dstData[dstIdx + 2] = Math.round(b * sheen);
        dstData[dstIdx + 3] = 255; // fully opaque on the screen
      }
    }
  }

  await sharp(dstData, { raw: { width: dstW, height: dstH, channels: 4 } })
    .webp({ quality: 95, alphaQuality: 95 })
    .toFile('public/images/hero-laptop-screen.webp');

  console.log('Successfully saved hero-laptop-screen.webp with real TechNKT screenshot!');
}

warp().catch(console.error);
