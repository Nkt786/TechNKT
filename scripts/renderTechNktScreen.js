const sharp = require('sharp');
const fs = require('fs');

async function main() {
  // Screen dimensions matching the laptop screen area
  const screenSvg = `
<svg width="640" height="420" viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg">
  <!-- Dark Store Background -->
  <rect width="100%" height="100%" fill="#0D131F" />
  
  <!-- Subtle Ambient Glow -->
  <circle cx="320" cy="160" r="280" fill="#2965E8" opacity="0.15" />

  <!-- Navigation Bar -->
  <rect width="100%" height="46" fill="#090D15" />
  <g transform="translate(24, 13)">
    <!-- TechNKT Icon -->
    <rect width="20" height="20" rx="5" fill="#2965E8" />
    <path d="M5 6H15M10 6V15" stroke="white" stroke-width="2" stroke-linecap="round" />
    <text x="28" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="14" fill="#F4F6FA">TechNKT</text>
    <text x="96" y="15" font-family="sans-serif" font-size="10" fill="#38BDF8" font-weight="600">• STORE</text>
  </g>
  <g transform="translate(260, 26)" font-family="sans-serif" font-size="11" fill="#A6B1C2">
    <text x="0" y="0" fill="#2965E8" font-weight="bold">Subscriptions</text>
    <text x="80" y="0">AI Tools</text>
    <text x="140" y="0">Ebooks</text>
    <text x="200" y="0">Web Dev</text>
    <text x="260" y="0">Account</text>
  </g>
  
  <!-- Store Hero Area -->
  <text x="28" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="17" fill="#F4F6FA">Curated Digital Passes</text>
  <text x="28" y="96" font-family="sans-serif" font-size="10" fill="#A6B1C2">Direct digital delivery with replacement support</text>

  <!-- 3 Authentic Product Cards -->
  <!-- Card 1: Netflix 4K -->
  <g transform="translate(28, 115)">
    <rect width="180" height="185" rx="10" fill="#151D2B" stroke="#1E2837" stroke-width="1.5" />
    <rect x="12" y="12" width="156" height="95" rx="6" fill="#000000" />
    <!-- Netflix Ribbon -->
    <g transform="translate(76, 26) scale(0.45)">
      <path d="M0 0H35V200H0V0Z" fill="#B81D24" />
      <path d="M76 0H111V200H76V0Z" fill="#B81D24" />
      <path d="M0 0H35L111 200H76L0 0Z" fill="#E50914" />
    </g>
    <text x="14" y="128" font-family="sans-serif" font-weight="bold" font-size="13" fill="#F4F6FA">Netflix Premium 4K</text>
    <text x="14" y="148" font-family="sans-serif" font-weight="800" font-size="14" fill="#F4F6FA">₹139 <tspan font-size="10" font-weight="normal" fill="#A6B1C2">/mo</tspan></text>
    <rect x="14" y="158" width="152" height="18" rx="5" fill="#2965E8" />
    <text x="90" y="171" font-family="sans-serif" font-weight="bold" font-size="9.5" fill="white" text-anchor="middle">Buy Now</text>
  </g>

  <!-- Card 2: Prime Video -->
  <g transform="translate(230, 115)">
    <rect width="180" height="185" rx="10" fill="#151D2B" stroke="#1E2837" stroke-width="1.5" />
    <rect x="12" y="12" width="156" height="95" rx="6" fill="#00A8E1" />
    <text x="90" y="60" font-family="sans-serif" font-weight="bold" font-size="18" fill="white" text-anchor="middle">prime video</text>
    <path d="M50 70 Q90 85 130 70" stroke="#FF9900" stroke-width="3" fill="none" stroke-linecap="round" />
    <text x="14" y="128" font-family="sans-serif" font-weight="bold" font-size="13" fill="#F4F6FA">Prime Video 4K</text>
    <text x="14" y="148" font-family="sans-serif" font-weight="800" font-size="14" fill="#F4F6FA">₹99 <tspan font-size="10" font-weight="normal" fill="#A6B1C2">/mo</tspan></text>
    <rect x="14" y="158" width="152" height="18" rx="5" fill="#2965E8" />
    <text x="90" y="171" font-family="sans-serif" font-weight="bold" font-size="9.5" fill="white" text-anchor="middle">Buy Now</text>
  </g>

  <!-- Card 3: JioHotstar -->
  <g transform="translate(432, 115)">
    <rect width="180" height="185" rx="10" fill="#151D2B" stroke="#1E2837" stroke-width="1.5" />
    <rect x="12" y="12" width="156" height="95" rx="6" fill="#0C111B" />
    <path d="M90 35 L94 52 L110 46 L98 60 L112 70 L96 66 L90 82 L84 66 L68 70 L82 60 L70 46 L86 52 Z" fill="#E5007E" />
    <text x="90" y="98" font-family="sans-serif" font-weight="bold" font-size="10" fill="white" text-anchor="middle">HOTSTAR</text>
    <text x="14" y="128" font-family="sans-serif" font-weight="bold" font-size="13" fill="#F4F6FA">JioHotstar Pass</text>
    <text x="14" y="148" font-family="sans-serif" font-weight="800" font-size="14" fill="#F4F6FA">₹99 <tspan font-size="10" font-weight="normal" fill="#A6B1C2">/mo</tspan></text>
    <rect x="14" y="158" width="152" height="18" rx="5" fill="#2965E8" />
    <text x="90" y="171" font-family="sans-serif" font-weight="bold" font-size="9.5" fill="white" text-anchor="middle">Buy Now</text>
  </g>

  <!-- Bottom Strip -->
  <g transform="translate(28, 320)">
    <rect width="584" height="60" rx="8" fill="#151D2B" stroke="#1E2837" />
    <g transform="translate(24, 35)">
      <text x="0" y="0" font-family="sans-serif" font-weight="bold" font-size="13" fill="#38BDF8">⚡ Fast Access</text>
      <text x="0" y="15" font-family="sans-serif" font-size="9.5" fill="#A6B1C2">Instant digital delivery on order</text>
    </g>
    <g transform="translate(220, 35)">
      <text x="0" y="0" font-family="sans-serif" font-weight="bold" font-size="13" fill="#10B981">🛡️ Replacement Support</text>
      <text x="0" y="15" font-family="sans-serif" font-size="9.5" fill="#A6B1C2">Guaranteed coverage for full term</text>
    </g>
    <g transform="translate(430, 35)">
      <text x="0" y="0" font-family="sans-serif" font-weight="bold" font-size="13" fill="#818CF8">🎧 WhatsApp Support</text>
      <text x="0" y="15" font-family="sans-serif" font-size="9.5" fill="#A6B1C2">Direct human assistance anytime</text>
    </g>
  </g>
</svg>
`;

  const screenPngBuffer = await sharp(Buffer.from(screenSvg)).png().toBuffer();
  console.log('Generated TechNKT screen buffer successfully');
}

main().catch(console.error);
