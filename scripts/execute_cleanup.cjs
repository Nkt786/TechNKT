const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const classificationPath = path.join(ROOT_DIR, 'scripts', 'classification_results.json');
const { deleteList } = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));

console.log(`Starting deletion of ${deleteList.length} verified unused assets...`);

let deletedCount = 0;
let deletedBytes = 0;
const deletedRecords = [];

deleteList.forEach(item => {
  const fullPath = path.join(ROOT_DIR, item.relPath);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    fs.unlinkSync(fullPath);
    deletedCount++;
    deletedBytes += stat.size;
    deletedRecords.push({
      path: item.relPath,
      size: stat.size,
      reason: item.reason
    });
  } else {
    console.warn(`File already missing: ${item.relPath}`);
  }
});

// Remove empty directories in public/images
const candidateDirs = [
  path.join(ROOT_DIR, 'public', 'images', 'blog-single'),
  path.join(ROOT_DIR, 'public', 'images', 'peoples'),
  path.join(ROOT_DIR, 'public', 'images', 'integrations'),
  path.join(ROOT_DIR, 'public', 'images', 'value-proposition')
];

const removedDirs = [];
candidateDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      fs.rmdirSync(dir);
      removedDirs.push(path.relative(ROOT_DIR, dir).replace(/\\/g, '/'));
    }
  }
});

console.log(`\n=== CLEANUP COMPLETED ===`);
console.log(`Deleted files: ${deletedCount}`);
console.log(`Reclaimed storage: ${(deletedBytes / (1024 * 1024)).toFixed(2)} MB (${deletedBytes} bytes)`);
console.log(`Removed empty directories: ${removedDirs.join(', ') || 'None'}`);

fs.writeFileSync(
  path.join(ROOT_DIR, 'scripts', 'deleted_records.json'),
  JSON.stringify({ deletedCount, deletedBytes, deletedRecords, removedDirs }, null, 2),
  'utf8'
);
