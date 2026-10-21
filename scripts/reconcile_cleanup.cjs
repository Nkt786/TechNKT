const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const MEDIA_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico',
  '.mp4', '.webm', '.mov', '.woff', '.woff2', '.ttf', '.otf'
]);

function getHash(filePath) {
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

function walkDir(dir, filterFn, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (['node_modules', '.git', 'dist', '.astro', 'scripts', '.vercel'].includes(file)) continue;
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

// 1. Gather all asset files
const allAssetFiles = walkDir(ROOT_DIR, (fp) => {
  const ext = path.extname(fp).toLowerCase();
  return MEDIA_EXTS.has(ext);
});

// 2. Gather all code/markup/config files
const codeFiles = walkDir(ROOT_DIR, (fp) => {
  const ext = path.extname(fp).toLowerCase();
  return ['.astro', '.tsx', '.jsx', '.ts', '.js', '.cjs', '.mjs', '.css', '.scss', '.json', '.md', '.mdx', '.html'].includes(ext);
});

const codeContents = codeFiles.map(fp => ({
  path: path.relative(ROOT_DIR, fp).replace(/\\/g, '/'),
  content: fs.readFileSync(fp, 'utf8')
}));

// Build inventory
const classified = allAssetFiles.map(fp => {
  const relPath = path.relative(ROOT_DIR, fp).replace(/\\/g, '/');
  const filename = path.basename(fp);
  const ext = path.extname(fp).toLowerCase();
  const size = fs.statSync(fp).size;
  const hash = getHash(fp);

  // Check active references
  const refs = [];
  codeContents.forEach(c => {
    // Check if relative path or filename appears in code
    const pubRel = relPath.startsWith('public/') ? relPath.replace(/^public/, '') : null;
    if (pubRel && c.content.includes(pubRel)) {
      refs.push({ file: c.path, type: 'public_url' });
    } else if (c.content.includes(relPath)) {
      refs.push({ file: c.path, type: 'rel_path' });
    } else if (c.content.includes(filename)) {
      refs.push({ file: c.path, type: 'filename' });
    }
  });

  return {
    fullPath: fp,
    relPath,
    filename,
    ext,
    size,
    hash,
    refs
  };
});

// Group duplicates
const hashMap = new Map();
classified.forEach(a => {
  if (!hashMap.has(a.hash)) hashMap.set(a.hash, []);
  hashMap.get(a.hash).push(a);
});

const keepList = [];
const deleteList = [];
const reviewList = [];

classified.forEach(a => {
  // Classification logic
  if (a.refs.length > 0) {
    // If referenced by an active page/component/product/config -> KEEP
    keepList.push({ ...a, reason: `Directly referenced in ${a.refs.length} file(s) [e.g. ${a.refs[0].file}]` });
  } else {
    // Unreferenced files
    if (a.relPath.startsWith('test_') && a.relPath.endsWith('.png')) {
      deleteList.push({ ...a, reason: 'Temporary visual testing screenshot saved in project root' });
    } else if (a.relPath.startsWith('public/images/blog-single/')) {
      deleteList.push({ ...a, reason: 'Abandoned template blog-single mockup images; active blog posts use public/images/blog/' });
    } else if (a.relPath.startsWith('public/images/peoples/')) {
      deleteList.push({ ...a, reason: 'Abandoned template stock avatars from Automark template; unreferenced' });
    } else if (a.relPath.startsWith('public/images/integrations/')) {
      deleteList.push({ ...a, reason: 'Abandoned template integrations PNG icons; active integrations use React icons' });
    } else if (a.relPath.startsWith('public/images/value-proposition/')) {
      deleteList.push({ ...a, reason: 'Abandoned template value proposition SVGs; TechNKT uses /images/icons/' });
    } else if (a.relPath.startsWith('public/images/brands-group-')) {
      deleteList.push({ ...a, reason: 'Abandoned template partner brand cluster PNGs; unreferenced' });
    } else if (['hero-laptop-floodfilled.webp', 'hero-laptop-isolated.webp', 'hero-laptop-warped.webp', 'hero-laptop.webp'].includes(a.filename)) {
      deleteList.push({ ...a, reason: 'Intermediate hero laptop warp generation files; active site uses hero-laptop-screen.webp' });
    } else if (['technkt-real-products.webp', 'technkt-real-store.webp'].includes(a.filename)) {
      deleteList.push({ ...a, reason: 'Temporary screenshot capture files used during screen warping; unreferenced' });
    } else if (['media_1792180877156.png', 'media_1792180907823.png', 'untitled-14.png', 'nkt-example.webp'].includes(a.filename)) {
      deleteList.push({ ...a, reason: 'Old test screenshots and untitled design exports; unreferenced' });
    } else if (['about_hero.png', 'automark_dashboard.png', 'avatar-lg.png', 'avatar-sm.png', 'featured-video-thumbnail.png'].includes(a.filename)) {
      deleteList.push({ ...a, reason: 'Abandoned original Automark template mockup images; unreferenced' });
    } else if (['badge-stars.svg', 'cross-icon.svg', 'features-menu-icon.svg', 'feedback-icon.svg', 'pricing-tick.svg', 'pricing-untick.png'].includes(a.filename)) {
      deleteList.push({ ...a, reason: 'Obsolete Automark template UI icons; unreferenced' });
    } else if (a.relPath === 'public/images/shop-categories/adult.jpg') {
      deleteList.push({ ...a, reason: 'Unused shop category image; not in product catalogue or shop plans' });
    } else if (['green-tick.svg', 'star-vector.svg'].includes(a.filename)) {
      deleteList.push({ ...a, reason: 'Source SVG already embedded as inline base64 in components.css' });
    } else if (a.relPath === 'public/images/ebook.png') {
      deleteList.push({ ...a, reason: 'Old template ebook graphic; active ebooks are in public/images/ebooks/' });
    } else if (a.relPath === 'public/images/technkt-logo.png') {
      deleteList.push({ ...a, reason: 'Obsolete raster logo export; site uses SVG logo and technkt-icon.png' });
    } else if (a.relPath === 'public/images/favicon.png') {
      deleteList.push({ ...a, reason: 'Old template favicon PNG; site uses technkt-icon.png' });
    } else if (a.relPath.startsWith('public/images/brands/') && ['hubspot-logo-svg-150.svg', 'livechat-logo-svg-150px.svg', 'scapic-logo-svg-150px.svg'].includes(a.filename)) {
      deleteList.push({ ...a, reason: 'Unused template brand logos; case studies use dropbox and pingdom' });
    } else if (a.relPath.startsWith('public/images/platforms-logo/') && ['intercom.svg', 'mailchimp.svg'].includes(a.filename)) {
      deleteList.push({ ...a, reason: 'Unused comparison row SVGs; comparison-row.md uses other 20 logos' });
    } else if (a.relPath === 'public/images/icons/starred-folder.svg') {
      deleteList.push({ ...a, reason: 'Unused icon in icons folder; not referenced in any markdown or component' });
    } else if (a.relPath === 'public/images/features/dashboard-mockup.png') {
      deleteList.push({ ...a, reason: 'Unused feature dashboard mockup PNG' });
    } else {
      reviewList.push({ ...a, reason: 'Unreferenced but flagged for manual review' });
    }
  }
});

console.log('=== CLASSIFICATION SUMMARY ===');
console.log(`KEEP — VERIFIED USED: ${keepList.length} files (${(keepList.reduce((s, a) => s + a.size, 0) / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`DELETE — VERIFIED UNUSED: ${deleteList.length} files (${(deleteList.reduce((s, a) => s + a.size, 0) / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`REVIEW — UNCERTAIN: ${reviewList.length} files (${(reviewList.reduce((s, a) => s + a.size, 0) / (1024 * 1024)).toFixed(2)} MB)`);

if (reviewList.length > 0) {
  console.log('\nREVIEW FILES:');
  reviewList.forEach(r => console.log(`- ${r.relPath}: ${r.reason}`));
}

fs.writeFileSync(
  path.join(ROOT_DIR, 'scripts', 'classification_results.json'),
  JSON.stringify({ keepList, deleteList, reviewList }, null, 2),
  'utf8'
);
console.log('Saved to scripts/classification_results.json');
