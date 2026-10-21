const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const inventory = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts', 'asset_inventory.json'), 'utf8'));

// Filter out .vercel or scripts or dist or node_modules from directRefs
inventory.forEach(a => {
  a.activeRefs = a.directRefs.filter(r => 
    !r.file.startsWith('.vercel') && 
    !r.file.startsWith('scripts') && 
    !r.file.startsWith('dist') &&
    !r.file.endsWith('asset_inventory.json')
  );
});

console.log('=== ASSETS WITH ZERO ACTIVE SOURCE-CODE REFERENCES ===');
const trulyUnreferenced = inventory.filter(a => a.activeRefs.length === 0);
console.log(`Total: ${trulyUnreferenced.length} files`);
trulyUnreferenced.forEach(a => {
  console.log(`- [${(a.size / 1024).toFixed(1)} KB] ${a.relPath}`);
});

console.log('\n=== ASSETS REFERENCED ONLY BY 1 SOURCE FILE ===');
const singleRef = inventory.filter(a => a.activeRefs.length === 1);
console.log(`Total: ${singleRef.length} files`);
singleRef.slice(0, 30).forEach(a => {
  console.log(`- [${(a.size / 1024).toFixed(1)} KB] ${a.relPath} -> ${a.activeRefs[0].file}`);
});
