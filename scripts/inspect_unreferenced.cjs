const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const inventory = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts', 'asset_inventory.json'), 'utf8'));

console.log('=== UNREFERENCED ASSETS (Candidates for Deletion / Review) ===');
const unreferenced = inventory.filter(a => a.directRefs.length === 0);
unreferenced.forEach(a => {
  console.log(`- [${(a.size / 1024).toFixed(1)} KB] ${a.relPath}`);
});

console.log('\n=== DUPLICATE HASHES (Identical Files) ===');
const seenHashes = new Set();
inventory.forEach(a => {
  if (a.duplicateCopies.length > 0 && !seenHashes.has(a.hash)) {
    seenHashes.add(a.hash);
    console.log(`Hash: ${a.hash} (${(a.size / 1024).toFixed(1)} KB)`);
    console.log(`  Original: ${a.relPath} (Refs: ${a.directRefs.length})`);
    a.duplicateCopies.forEach(copy => {
      const match = inventory.find(x => x.relPath === copy);
      console.log(`  Duplicate: ${copy} (Refs: ${match ? match.directRefs.length : 0})`);
    });
  }
});
