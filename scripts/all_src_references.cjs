const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const srcDir = path.join(ROOT_DIR, 'src');

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walk(p));
    } else {
      files.push(p);
    }
  });
  return files;
}

const allSrcFiles = walk(srcDir);
const referencedAssets = new Map();

allSrcFiles.forEach(sf => {
  const content = fs.readFileSync(sf, 'utf8');
  // Match both /images/... and images/... and /showcase.mp4
  const matches = content.match(/["'](\/?(?:images|assets|scripts)[\w\-\.\/]+|showcase\.mp4)["']/g) || [];
  matches.forEach(m => {
    const raw = m.slice(1, -1);
    const norm = raw.startsWith('/') ? raw : '/' + raw;
    if (!referencedAssets.has(norm)) {
      referencedAssets.set(norm, new Set());
    }
    referencedAssets.get(norm).add(path.relative(ROOT_DIR, sf));
  });
});

console.log(`Found ${referencedAssets.size} unique asset references in src/`);
const sorted = Array.from(referencedAssets.keys()).sort();
sorted.forEach(a => {
  const pubPath = path.join(ROOT_DIR, 'public', a.replace(/^\//, ''));
  const exists = fs.existsSync(pubPath);
  console.log(`${exists ? '[OK]' : '[MISSING]'} ${a} (referenced in ${referencedAssets.get(a).size} files)`);
});
