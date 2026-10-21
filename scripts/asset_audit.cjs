const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const MEDIA_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico',
  '.mp4', '.webm', '.mov', '.lottie', '.woff', '.woff2', '.ttf', '.otf'
]);

// Code files to search references in
const CODE_EXTS = new Set([
  '.astro', '.tsx', '.jsx', '.ts', '.js', '.cjs', '.mjs', '.css', '.scss', '.json', '.md', '.mdx', '.html'
]);

function getHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function walkDir(dir, filterFn, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.astro' || file === 'scripts') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, filterFn, fileList);
    } else if (filterFn(fullPath)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// 1. Gather all assets
const assetFiles = walkDir(ROOT_DIR, (fp) => {
  const ext = path.extname(fp).toLowerCase();
  return MEDIA_EXTS.has(ext);
});

// 2. Gather all code files
const codeFiles = walkDir(ROOT_DIR, (fp) => {
  const ext = path.extname(fp).toLowerCase();
  return CODE_EXTS.has(ext);
});

console.log(`Found ${assetFiles.length} asset files.`);
console.log(`Found ${codeFiles.length} code/markup files to scan for references.`);

// Read all code file contents into memory with file paths
const codeContents = codeFiles.map(fp => {
  return {
    path: path.relative(ROOT_DIR, fp).replace(/\\/g, '/'),
    content: fs.readFileSync(fp, 'utf8')
  };
});

// Detect duplicates by hash
const hashMap = new Map();
const assetDetails = assetFiles.map(fp => {
  const stat = fs.statSync(fp);
  const hash = getHash(fp);
  const relPath = path.relative(ROOT_DIR, fp).replace(/\\/g, '/');
  const filename = path.basename(fp);
  const ext = path.extname(fp).toLowerCase();

  if (!hashMap.has(hash)) {
    hashMap.set(hash, []);
  }
  hashMap.get(hash).push(relPath);

  return {
    fullPath: fp,
    relPath,
    filename,
    nameWithoutExt: path.parse(filename).name,
    ext,
    size: stat.size,
    hash
  };
});

// Search references
const results = assetDetails.map(asset => {
  const directRefs = [];
  const filename = asset.filename;
  // Patterns to search:
  // 1. Exact relative path from public or src (e.g., "/images/..." or "images/...")
  const publicRel = asset.relPath.startsWith('public/') ? asset.relPath.replace(/^public\//, '/') : null;
  const publicRelNoSlash = publicRel ? publicRel.replace(/^\//, '') : null;

  codeContents.forEach(code => {
    // Skip if the code file is itself or metadata/scratch
    let matched = false;
    let matchType = '';

    if (publicRel && code.content.includes(publicRel)) {
      matched = true;
      matchType = `url("${publicRel}")`;
    } else if (publicRelNoSlash && code.content.includes(publicRelNoSlash)) {
      matched = true;
      matchType = `path("${publicRelNoSlash}")`;
    } else if (code.content.includes(filename)) {
      matched = true;
      matchType = `filename("${filename}")`;
    }

    if (matched) {
      directRefs.push({
        file: code.path,
        matchType
      });
    }
  });

  return {
    ...asset,
    directRefs,
    duplicateCopies: hashMap.get(asset.hash).filter(p => p !== asset.relPath)
  };
});

fs.writeFileSync(
  path.join(ROOT_DIR, 'scripts', 'asset_inventory.json'),
  JSON.stringify(results, null, 2),
  'utf8'
);

console.log('Asset inventory written to scripts/asset_inventory.json');

// Print Summary
let usedCount = 0;
let unusedCount = 0;
let usedBytes = 0;
let unusedBytes = 0;

results.forEach(a => {
  if (a.directRefs.length > 0) {
    usedCount++;
    usedBytes += a.size;
  } else {
    unusedCount++;
    unusedBytes += a.size;
  }
});

console.log('--- SCAN SUMMARY ---');
console.log(`Total Assets: ${results.length}`);
console.log(`Total Asset Size: ${(usedBytes + unusedBytes) / (1024 * 1024)} MB`);
console.log(`Directly Referenced Assets: ${usedCount} (${(usedBytes / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`Unreferenced Assets: ${unusedCount} (${(unusedBytes / (1024 * 1024)).toFixed(2)} MB)`);
