import React, { useRef, useEffect, useState, useCallback } from "react";

// ============================================================================
// 1. DATA: 11 AUTHENTIC PRODUCT & SERVICE MOBILE APP ICONS
// Clean, official, rounded-square mobile app appearance (no cluttered text)
// ============================================================================
interface ProductApp {
  id: string;
  name: string;
  category: string;
  renderIcon: () => React.ReactNode;
}

const PRODUCT_APPS: ProductApp[] = [
  // 1. Netflix
  {
    id: "netflix",
    name: "Netflix 4K UHD",
    category: "Streaming",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-[#141414] border border-white/15 flex items-center justify-center p-3 shadow-[0_12px_28px_rgba(0,0,0,0.65)] group-hover:border-red-500/60 transition-colors">
        <svg viewBox="0 0 111 200" fill="none" className="h-10 sm:h-12 w-auto drop-shadow-[0_4px_12px_rgba(229,9,20,0.6)]">
          <path d="M0 0H35V200H0V0Z" fill="#B81D24" />
          <path d="M76 0H111V200H76V0Z" fill="#B81D24" />
          <path d="M0 0H35L111 200H76L0 0Z" fill="#E50914" />
        </svg>
      </div>
    ),
  },

  // 2. Prime Video
  {
    id: "prime",
    name: "Prime Video 4K",
    category: "Streaming",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-[#00A8E1] border border-white/20 flex flex-col items-center justify-center p-2.5 shadow-[0_12px_28px_rgba(0,168,225,0.4)] group-hover:border-white/50 transition-colors">
        <span className="text-xs sm:text-sm font-black tracking-tight text-white leading-none">prime</span>
        <span className="text-[11px] sm:text-xs font-bold tracking-tight text-white leading-none -mt-0.5">video</span>
        <svg viewBox="0 0 50 14" fill="none" className="w-9 sm:w-11 h-3 mt-1">
          <path d="M2 3 Q25 15 48 3" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M42 2 L48 3 L44 9" fill="#FF9900" />
        </svg>
      </div>
    ),
  },

  // 3. JioHotstar
  {
    id: "hotstar",
    name: "JioHotstar Pass",
    category: "Streaming",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0C111B] via-[#1A0A26] to-[#E5007E]/30 border border-white/15 flex items-center justify-center p-2.5 shadow-[0_12px_28px_rgba(229,0,126,0.4)] group-hover:border-[#E5007E]/60 transition-colors">
        <svg viewBox="0 0 100 100" fill="none" className="w-10 sm:w-12 h-10 sm:h-12 drop-shadow-[0_4px_14px_rgba(229,0,126,0.7)]">
          <path
            d="M50 4 L57 33 L85 20 L68 45 L96 58 L68 68 L82 94 L56 78 L50 106 L44 78 L18 94 L32 68 L4 58 L32 45 L15 20 L43 33 Z"
            fill="url(#hotstarRays)"
          />
          <defs>
            <linearGradient id="hotstarRays" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#E5007E" />
              <stop offset="100%" stopColor="#FF4B00" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
  },

  // 4. Sony LIV
  {
    id: "sonyliv",
    name: "Sony LIV Premium",
    category: "Streaming",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-[#111111] border border-white/15 flex flex-col items-center justify-center p-2 shadow-[0_12px_28px_rgba(0,0,0,0.65)] group-hover:border-white/40 transition-colors">
        <span className="text-[8.5px] sm:text-[9.5px] font-black text-white tracking-widest leading-none mb-1">SONY</span>
        <div className="flex items-center gap-1 h-4 sm:h-5">
          <div className="w-1.5 sm:w-2 h-full rounded-xs bg-[#FF4500]" />
          <div className="w-1.5 sm:w-2 h-full rounded-xs bg-[#0080FF]" />
          <div className="w-1.5 sm:w-2 h-full rounded-xs bg-[#00D084]" />
        </div>
        <span className="text-[9.5px] sm:text-[10.5px] font-black text-white tracking-wider mt-1 leading-none">LIV</span>
      </div>
    ),
  },

  // 5. ZEE5
  {
    id: "zee5",
    name: "ZEE5 All Access",
    category: "Streaming",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-black border border-white/15 flex items-center justify-center p-2 shadow-[0_12px_28px_rgba(244,63,94,0.35)] group-hover:border-pink-500/50 transition-colors">
        <div className="size-11 sm:size-13 rounded-full p-[2.5px] bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-400 flex items-center justify-center shadow-md">
          <div className="size-full rounded-full bg-black flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-black tracking-tight text-white">ZEE5</span>
          </div>
        </div>
      </div>
    ),
  },

  // 6. Canva Pro
  {
    id: "canva",
    name: "Canva Pro",
    category: "Design",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] border border-white/20 flex items-center justify-center p-2 shadow-[0_12px_28px_rgba(0,196,204,0.4)] group-hover:border-white/50 transition-colors">
        <span className="text-base sm:text-lg font-serif italic font-bold text-white tracking-tight drop-shadow-sm">Canva</span>
      </div>
    ),
  },

  // 7. ChatGPT Plus
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    category: "AI Tools",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-[#10A37F] border border-white/20 flex items-center justify-center p-2 shadow-[0_12px_28px_rgba(16,163,127,0.45)] group-hover:border-emerald-300 transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 sm:w-10 h-8 sm:h-10 drop-shadow-md">
          <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2" strokeOpacity="0.25" />
          <path d="M9.5 9.5a3.5 3.5 0 0 1 5 0M9.5 14.5a3.5 3.5 0 0 0 5 0" />
          <path d="M12 6.5v11M7.5 8.5l9 7M7.5 15.5l9-7" />
        </svg>
      </div>
    ),
  },

  // 8. Claude AI
  {
    id: "claude",
    name: "Claude Pro",
    category: "AI Tools",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-[#D97757] border border-white/20 flex items-center justify-center p-2.5 shadow-[0_12px_28px_rgba(217,119,87,0.45)] group-hover:border-amber-200 transition-colors">
        <svg viewBox="0 0 24 24" fill="white" className="w-8 sm:w-10 h-8 sm:h-10 drop-shadow-md">
          <path d="M12 2.5 L13.8 8.8 L20 7.5 L15.5 12 L20 16.5 L13.8 15.2 L12 21.5 L10.2 15.2 L4 16.5 L8.5 12 L4 7.5 L10.2 8.8 Z" />
        </svg>
      </div>
    ),
  },

  // 9. Gemini
  {
    id: "gemini",
    name: "Google Gemini",
    category: "AI Tools",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-[#1C1D1F] border border-white/15 flex items-center justify-center p-2.5 shadow-[0_12px_28px_rgba(78,140,255,0.4)] group-hover:border-blue-400/60 transition-colors">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 sm:w-10 h-8 sm:h-10 drop-shadow-md">
          <path d="M12 2 C12 7.5 7.5 12 2 12 C7.5 12 12 16.5 12 22 C12 16.5 16.5 12 22 12 C16.5 12 12 7.5 12 2 Z" fill="url(#geminiStarGrad)" />
          <defs>
            <linearGradient id="geminiStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4E8CFF" />
              <stop offset="50%" stopColor="#9B72CF" />
              <stop offset="100%" stopColor="#FF68A8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
  },

  // 10. Ebooks
  {
    id: "ebooks",
    name: "TechNKT Ebooks",
    category: "Learning",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E3A8A] to-[#2965E8] border border-white/20 flex flex-col items-center justify-center p-2.5 shadow-[0_12px_28px_rgba(41,101,232,0.45)] group-hover:border-blue-300 transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-7 sm:w-9 h-7 sm:h-9 drop-shadow-md">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>
    ),
  },

  // 11. Website Development
  {
    id: "webdev",
    name: "Web Studio",
    category: "Services",
    renderIcon: () => (
      <div className="size-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#2E0854] to-[#7C3AED] border border-white/20 flex items-center justify-center p-2 shadow-[0_12px_28px_rgba(124,58,237,0.5)] group-hover:border-purple-300 transition-colors">
        <span className="text-xl sm:text-2xl font-mono font-black text-cyan-300 drop-shadow-[0_2px_8px_rgba(103,232,249,0.85)] leading-none">&lt;/&gt;</span>
      </div>
    ),
  },
];

// ============================================================================
// 2. CANONICAL ORBIT GEOMETRY
// Shared between SVG rings and React icon positioning (identical math)
// ============================================================================
// SVG ViewBox: (0 0 700 620), Center: (350, 316), Rx = 285, Ry = 226, Tilt = -11 deg
const SVG_VIEW_W = 700;
const SVG_VIEW_H = 620;
const SVG_CENTER_X = 350;
const SVG_CENTER_Y = 316;
const SVG_RX = 285;
const SVG_RY = 226;
const TILT_DEG = -11;

// Back Orbit: Curves high above and behind the laptop screen (Z: 10)
function OrbitBackRing() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
      <svg
        viewBox={`0 0 ${SVG_VIEW_W} ${SVG_VIEW_H}`}
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="backOrbitGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="backOrbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2965E8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="backTravelingStreak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`rotate(${TILT_DEG} ${SVG_CENTER_X} ${SVG_CENTER_Y})`}>
          {/* Faint Inner Guidance Track */}
          <path
            d={`M ${SVG_CENTER_X - SVG_RX + 30} ${SVG_CENTER_Y} A ${SVG_RX - 30} ${SVG_RY - 24} 0 0 1 ${SVG_CENTER_X + SVG_RX - 30} ${SVG_CENTER_Y}`}
            stroke="rgba(56, 189, 248, 0.18)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />

          {/* Ambient Outer Blue Glow */}
          <path
            d={`M ${SVG_CENTER_X - SVG_RX} ${SVG_CENTER_Y} A ${SVG_RX} ${SVG_RY} 0 0 1 ${SVG_CENTER_X + SVG_RX} ${SVG_CENTER_Y}`}
            stroke="rgba(41, 101, 232, 0.35)"
            strokeWidth="9"
            filter="url(#backOrbitGlowFilter)"
          />

          {/* Main Solid Track */}
          <path
            d={`M ${SVG_CENTER_X - SVG_RX} ${SVG_CENTER_Y} A ${SVG_RX} ${SVG_RY} 0 0 1 ${SVG_CENTER_X + SVG_RX} ${SVG_CENTER_Y}`}
            stroke="url(#backOrbitGradient)"
            strokeWidth="2.2"
          />

          {/* Core White Highlight */}
          <path
            d={`M ${SVG_CENTER_X - SVG_RX} ${SVG_CENTER_Y} A ${SVG_RX} ${SVG_RY} 0 0 1 ${SVG_CENTER_X + SVG_RX} ${SVG_CENTER_Y}`}
            stroke="#E0F2FE"
            strokeWidth="0.8"
            strokeOpacity="0.75"
          />

          {/* Traveling Light Streak (Back Phase) */}
          <path
            d={`M ${SVG_CENTER_X - SVG_RX} ${SVG_CENTER_Y} A ${SVG_RX} ${SVG_RY} 0 0 1 ${SVG_CENTER_X + SVG_RX} ${SVG_CENTER_Y}`}
            stroke="url(#backTravelingStreak)"
            strokeWidth="3.6"
            className="anim-orbit-streak"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

// Front Orbit: Sweeps in front of the laptop base and trackpad (Z: 25)
function OrbitFrontRing() {
  return (
    <div className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center">
      <svg
        viewBox={`0 0 ${SVG_VIEW_W} ${SVG_VIEW_H}`}
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="frontOrbitGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="frontOrbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
            <stop offset="100%" stopColor="#2965E8" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="frontTravelingStreak" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`rotate(${TILT_DEG} ${SVG_CENTER_X} ${SVG_CENTER_Y})`}>
          {/* Faint Inner Guidance Track */}
          <path
            d={`M ${SVG_CENTER_X + SVG_RX - 30} ${SVG_CENTER_Y} A ${SVG_RX - 30} ${SVG_RY - 24} 0 0 1 ${SVG_CENTER_X - SVG_RX + 30} ${SVG_CENTER_Y}`}
            stroke="rgba(56, 189, 248, 0.28)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />

          {/* Ambient Outer Blue Glow */}
          <path
            d={`M ${SVG_CENTER_X + SVG_RX} ${SVG_CENTER_Y} A ${SVG_RX} ${SVG_RY} 0 0 1 ${SVG_CENTER_X - SVG_RX} ${SVG_CENTER_Y}`}
            stroke="rgba(56, 189, 248, 0.45)"
            strokeWidth="11"
            filter="url(#frontOrbitGlowFilter)"
          />

          {/* Main Solid Track */}
          <path
            d={`M ${SVG_CENTER_X + SVG_RX} ${SVG_CENTER_Y} A ${SVG_RX} ${SVG_RY} 0 0 1 ${SVG_CENTER_X - SVG_RX} ${SVG_CENTER_Y}`}
            stroke="url(#frontOrbitGradient)"
            strokeWidth="2.8"
          />

          {/* Core White Crisp Line */}
          <path
            d={`M ${SVG_CENTER_X + SVG_RX} ${SVG_CENTER_Y} A ${SVG_RX} ${SVG_RY} 0 0 1 ${SVG_CENTER_X - SVG_RX} ${SVG_CENTER_Y}`}
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.9"
          />

          {/* Traveling Light Streak (Front Phase) */}
          <path
            d={`M ${SVG_CENTER_X + SVG_RX} ${SVG_CENTER_Y} A ${SVG_RX} ${SVG_RY} 0 0 1 ${SVG_CENTER_X - SVG_RX} ${SVG_CENTER_Y}`}
            stroke="url(#frontTravelingStreak)"
            strokeWidth="4.2"
            className="anim-orbit-streak-front"
            strokeLinecap="round"
          />

          {/* Transition Vertices Flare Points */}
          <circle cx={SVG_CENTER_X - SVG_RX} cy={SVG_CENTER_Y} r="3" fill="#FFFFFF" />
          <circle cx={SVG_CENTER_X + SVG_RX} cy={SVG_CENTER_Y} r="3" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 3. MAIN COMPONENT: LARGE, BALANCED, INTERACTIVE HERO ORBIT
// ============================================================================
export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation Angle (in radians)
  const [rotationAngle, setRotationAngle] = useState(0);
  const angleRef = useRef(0);

  // Drag physics state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const isHoveredRef = useRef(false);
  const [activeProductName, setActiveProductName] = useState<string>("JioHotstar Pass");

  // Keep ref synchronized with state
  useEffect(() => {
    angleRef.current = rotationAngle;
  }, [rotationAngle]);

  // Framerate-Independent Physics Loop: Auto-Rotation + Inertia Momentum
  // Target: One complete rotation every 32 seconds (speed ≈ 0.196 rad/s)
  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
      lastFrameTime = currentTime;

      if (!isDraggingRef.current) {
        // Apply inertia release velocity if present
        if (Math.abs(velocityRef.current) > 0.0002) {
          angleRef.current += velocityRef.current * (dt * 60);
          velocityRef.current *= Math.pow(0.945, dt * 60); // frame-rate independent friction
        } else {
          velocityRef.current = 0;
          // Continuous, noticeable, elegant auto-rotation (slows down when user hovers an icon)
          const baseSpeed = isHoveredRef.current ? 0.05 : 0.196; // rad/sec (~32s full rotation)
          angleRef.current += baseSpeed * dt;
        }

        // Keep angle bounded in [0, 2PI)
        if (angleRef.current > Math.PI * 2) {
          angleRef.current -= Math.PI * 2;
        } else if (angleRef.current < 0) {
          angleRef.current += Math.PI * 2;
        }

        setRotationAngle(angleRef.current);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    if (typeof window !== "undefined") {
      (window as any).__setHeroOrbitAngle = (rad: number) => {
        angleRef.current = rad;
        setRotationAngle(rad);
      };
      (window as any).__getHeroOrbitAngle = () => angleRef.current;
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (typeof window !== "undefined") {
        delete (window as any).__setHeroOrbitAngle;
        delete (window as any).__getHeroOrbitAngle;
      }
    };
  }, []);

  // Pointer Drag Event Handlers (Desktop Mouse + Mobile Touch unified)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const now = performance.now();
    const dx = currentX - lastXRef.current;
    const dt = Math.max((now - lastTimeRef.current) / 1000, 0.001);

    // 1:1 direct tracking sensitivity
    const containerW = containerRef.current?.clientWidth || 600;
    const angularDelta = (dx / (containerW * 0.45)) * 1.1;
    angleRef.current += angularDelta;

    // Instantaneous angular velocity in rad/frame
    velocityRef.current = (angularDelta / (dt * 60));

    lastXRef.current = currentX;
    lastTimeRef.current = now;
    setRotationAngle(angleRef.current);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      // Clamp release velocity to prevent chaotic spinning
      const maxVel = 0.045;
      velocityRef.current = Math.max(-maxVel, Math.min(maxVel, velocityRef.current));

      if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    }
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // Shared Canonical Mathematical Coordinates
  // Rx = 40.7%, Ry = 36.5%, Center = (50%, 51%), Tilt = -11 deg
  // ──────────────────────────────────────────────────────────────────────────
  const tiltRad = (TILT_DEG * Math.PI) / 180;
  const cosTilt = Math.cos(tiltRad);
  const sinTilt = Math.sin(tiltRad);

  const N = PRODUCT_APPS.length; // 11 items
  const angleStep = (Math.PI * 2) / N;

  const Rx = (SVG_RX / SVG_VIEW_W) * 100; // 40.71%
  const Ry = (SVG_RY / SVG_VIEW_H) * 100; // 36.45%
  const centerX = (SVG_CENTER_X / SVG_VIEW_W) * 100; // 50.0%
  const centerY = (SVG_CENTER_Y / SVG_VIEW_H) * 100; // 50.96%

  let highestZ = -999;
  let frontMostName = activeProductName;

  const renderedIcons = PRODUCT_APPS.map((app, index) => {
    const theta = angleStep * index + rotationAngle;

    // Point on unit ellipse
    const u = Rx * Math.cos(theta);
    const v = Ry * Math.sin(theta);

    // Rotate by tilt angle
    const xPct = centerX + (u * cosTilt - v * sinTilt);
    const yPct = centerY + (u * sinTilt + v * cosTilt);

    // Depth: sin(theta) determines front/back positioning
    // sin(theta) > 0: foreground in front of laptop
    // sin(theta) <= 0: background behind laptop screen
    const sinTheta = Math.sin(theta);
    const isFront = sinTheta > 0.05;

    // Depth-based scaling: 0.82 (far back) to 1.10 (front)
    const depthFactor = (sinTheta + 1) / 2; // [0, 1]
    const scale = 0.84 + depthFactor * 0.26;
    const opacity = 0.78 + depthFactor * 0.22;

    if (sinTheta > highestZ) {
      highestZ = sinTheta;
      frontMostName = app.name;
    }

    // Depth Z-Index:
    // Back orbit ring: z-10
    // Back icons (behind laptop screen): z-15
    // Laptop: z-20
    // Front orbit ring: z-25
    // Front icons (in front of laptop base & front ring): z-35
    const zIndex = isFront ? 35 : 15;

    return {
      app,
      xPct,
      yPct,
      scale,
      opacity,
      zIndex,
      isFront,
    };
  });

  useEffect(() => {
    if (frontMostName && frontMostName !== activeProductName) {
      setActiveProductName(frontMostName);
    }
  }, [frontMostName]);

  return (
    <div className="relative w-full max-w-[640px] lg:max-w-[700px] xl:max-w-[760px] mx-auto select-none">
      {/* ── DRAG INTERACTION WRAPPER ── */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        className="relative w-full aspect-[700/620] touch-pan-y cursor-grab active:cursor-grabbing flex items-center justify-center overflow-visible"
        aria-label="Interactive 3D rotating product orbit. Drag horizontally to spin."
      >
        {/* ── AMBIENT BACKDROP LIGHTING ── */}
        <div
          className="pointer-events-none absolute -inset-12 -z-10 rounded-full anim-backdrop-pulse"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(41, 101, 232, 0.24) 0%, rgba(14, 165, 233, 0.10) 40%, rgba(11, 16, 26, 0.4) 70%, transparent 85%)",
          }}
        />

        {/* ── LAYER: BACK ORBIT RING (Z: 10, Curves BEHIND Laptop Screen) ── */}
        <OrbitBackRing />

        {/* ── LAYER: CENTERPIECE LAPTOP WITH REAL TECHNKT SCREENSHOT (Z: 20) ── */}
        <div className="relative z-20 w-full flex items-center justify-center anim-hero-laptop select-none pointer-events-none">
          <img
            src="/images/hero-laptop-screen.webp"
            alt="TechNKT Live Digital Products & Web Studio Storefront"
            width={1024}
            height={1024}
            className="w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[430px] h-auto object-contain filter drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)]"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* ── LAYER: FRONT ORBIT RING (Z: 25, Sweeps IN FRONT OF Laptop Chassis) ── */}
        <OrbitFrontRing />

        {/* ── LAYER: 11 BALANCED ORBITING PRODUCT APP TILES (84-104px Prominent Scale) ── */}
        {renderedIcons.map(({ app, xPct, yPct, scale, opacity, zIndex, isFront }) => {
          const IconRenderer = app.renderIcon;
          return (
            <div
              key={app.id}
              className="absolute pointer-events-auto transition-transform duration-75"
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                zIndex,
                opacity,
              }}
              title={`${app.name} (${app.category})`}
            >
              <div
                className="group relative size-17 sm:size-21 lg:size-24 rounded-2xl sm:rounded-3xl transition-all duration-200 hover:scale-115 hover:border-white/50 cursor-pointer"
                style={{
                  filter: isFront
                    ? "drop-shadow(0 14px 28px rgba(0,0,0,0.75))"
                    : "drop-shadow(0 6px 14px rgba(0,0,0,0.5))",
                }}
              >
                <IconRenderer />

                {/* Subtle Tooltip on Hover */}
                <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-black/95 border border-white/15 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg backdrop-blur-md">
                  {app.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── HELPER CUE: DRAG TO SPIN INTERACTION (Like Reference Video) ── */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs select-none">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#151D2B]/90 border border-[#1E2837] shadow-sm backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-[#2965E8] animate-ping" />
          <span className="text-xs font-semibold text-[#F4F6FA] tracking-wide">
            {activeProductName}
          </span>
          <span className="text-[#1E2837]">•</span>
          <span className="text-xs font-normal text-[#A6B1C2] flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-[#38BDF8]">
              <path d="m9 18-6-6 6-6" />
              <path d="m15 6 6 6-6 6" />
            </svg>
            drag to spin
          </span>
        </div>
      </div>
    </div>
  );
}
