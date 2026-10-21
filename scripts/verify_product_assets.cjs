const fs = require('fs');
const content = fs.readFileSync('src/data/products.ts', 'utf8');
const paths = new Set();
for (const m of content.matchAll(/\/images\/[a-zA-Z0-9_\-\.\/]+/g)) {
  paths.add(m[0]);
}
console.log('Unique image paths in products.ts:', paths.size);
for (const p of Array.from(paths).sort()) {
  const exists = fs.existsSync('public' + p);
  console.log(exists ? '[EXISTS]' : '[MISSING]', p);
}
