const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const inventory = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts', 'asset_inventory.json'), 'utf8'));

// Group by directory
const dirGroups = {};
inventory.forEach(a => {
  const dir = path.dirname(a.relPath);
  if (!dirGroups[dir]) {
    dirGroups[dir] = [];
  }
  dirGroups[dir].push(a);
});

console.log('=== ASSET GROUPS BY DIRECTORY ===');
for (const [dir, files] of Object.entries(dirGroups)) {
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const unref = files.filter(f => f.directRefs.length === 0).length;
  console.log(`Directory: ${dir} (${files.length} files, ${(totalSize / 1024).toFixed(1)} KB) - [Unreferenced: ${unref}]`);
}
