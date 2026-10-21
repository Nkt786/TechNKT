const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Let's inspect markdown files in src/content
function scanDir(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(scanDir(full));
    } else {
      files.push(full);
    }
  });
  return files;
}

const contentFiles = scanDir(path.join(ROOT_DIR, 'src', 'content'));
console.log(`Found ${contentFiles.length} markdown/content files.`);

const suspects = [
  'integrations',
  'peoples',
  'brands-group',
  'hubspot',
  'livechat',
  'scapic',
  'badge-stars',
  'cross-icon',
  'ebook.png',
  'featured-video-thumbnail',
  'feedback-icon',
  'green-tick',
  'starred-folder',
  'intercom',
  'pricing-tick',
  'pricing-untick',
  'adult.jpg',
  'star-vector',
  'values-icon',
  'favicon.png'
];

suspects.forEach(term => {
  let foundIn = [];
  contentFiles.forEach(cf => {
    const text = fs.readFileSync(cf, 'utf8');
    if (text.toLowerCase().includes(term.toLowerCase())) {
      foundIn.push(path.relative(ROOT_DIR, cf));
    }
  });
  if (foundIn.length > 0) {
    console.log(`[MATCH] ${term} found in:`, foundIn);
  } else {
    console.log(`[NO CONTENT MATCH] ${term}`);
  }
});
