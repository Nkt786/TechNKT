'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HolographicStack() {
  // order array: index represents card index [0=Canva, 1=Claude, 2=Netflix]
  // value represents position: 0=Left, 1=Center, 2=Right
  const [positions, setPositions] = useState([0, 1, 2]);
  const [isCenterFlipped, setIsCenterFlipped] = useState(false);

  // Automatically cycle the cards and flip the center one
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. First flip center card back to front
      setIsCenterFlipped(false);

      // 2. Wait for flip transition to finish, then shuffle
      setTimeout(() => {
        setPositions(prev => {
          const next = [...prev];
          return [
            next[2], // Canva gets Netflix's position
            next[0], // Claude gets Canva's position
            next[1], // Netflix gets Claude's position
          ];
        });
      }, 600);

      // 3. After new card reaches center, flip it to show benefits
      setTimeout(() => {
        setIsCenterFlipped(true);
      }, 2000);

    }, 5000);

    // Initial flip for the default center card
    const initialFlipTimeout = setTimeout(() => {
      setIsCenterFlipped(true);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialFlipTimeout);
    };
  }, []);

  // Card Positions styles mappings
  const getCardStyle = (posIdx: number) => {
    switch (posIdx) {
      case 0: // Left
        return {
          x: -110,
          rotateY: 0,
          rotateX: 4,
          scale: 0.85,
          zIndex: 10,
          opacity: 0.6,
        };
      case 1: // Center
        return {
          x: 0,
          rotateY: isCenterFlipped ? 180 : 0,
          rotateX: 0,
          scale: 1.05,
          zIndex: 40, // High z-index to ensure it renders on top
          opacity: 1,
        };
      case 2: // Right
      default:
        return {
          x: 110,
          rotateY: 0,
          rotateX: -4,
          scale: 0.85,
          zIndex: 20,
          opacity: 0.7,
        };
    }
  };

  const faceStyle: React.CSSProperties = {
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    position: 'absolute',
    inset: 0,
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] flex items-center justify-center pt-8 lg:pt-0 overflow-hidden sm:overflow-visible [perspective:1000px]">
      
      {/* Background Decorative Glow (Restrained) */}
      <div className="absolute w-[280px] h-[280px] rounded-full bg-blue-500/10 blur-[80px] -z-10" />

      {/* ==================== CARD 1: CANVA PRO ==================== */}
      <motion.div
        className="absolute w-[200px] sm:w-[220px] h-[250px] cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={getCardStyle(positions[0])}
        whileHover={{ y: -8, scale: positions[0] === 1 ? 1.08 : 0.9 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        onClick={() => {
          if (positions[0] === 1) setIsCenterFlipped(!isCenterFlipped);
        }}
      >
        {/* Front Face */}
        <div 
          style={faceStyle}
          className="bg-gradient-to-tr from-purple-600/95 via-pink-600/95 to-rose-500/95 border border-white/20 rounded-2xl p-4.5 text-white shadow-2xl flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div className="h-8 w-8 rounded-lg bg-white/90 flex items-center justify-center">
              <span className="text-[10px] font-black italic tracking-tighter text-[#7D2AE8]">Canva</span>
            </div>
            <span className="text-[8px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">Design</span>
          </div>
          <div className="relative z-10">
            <h4 className="text-sm font-black tracking-tight">Canva Pro</h4>
            <p className="text-[10px] text-purple-100 mt-0.5">1 Year Premium Slot</p>
          </div>
          <div className="pt-2 border-t border-white/20 flex justify-between items-center relative z-10">
            <span className="text-sm font-black">₹699</span>
            <span className="text-[10px] text-white/60 line-through">₹1,999</span>
          </div>
        </div>

        {/* Back Face */}
        <div 
          style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
          className="bg-[#220B38] border border-purple-500/20 rounded-2xl p-4.5 text-white shadow-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-pink-300 text-xs font-bold">Slot Benefits</span>
            <span className="text-[7px] font-mono text-purple-300 uppercase">Verified Key</span>
          </div>
          <div className="space-y-1.5 my-auto text-left">
            <div className="flex items-center gap-1.5 text-[9px] text-purple-100">
              <span className="text-pink-400">✓</span> <span>Full Brand Kit Access</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-purple-100">
              <span className="text-pink-400">✓</span> <span>100M+ Stock Media Assets</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-purple-100">
              <span className="text-pink-400">✓</span> <span>1 Year Slot Replacement</span>
            </div>
          </div>
          <span className="text-[8px] font-black uppercase text-center text-pink-300 tracking-wider bg-purple-500/10 py-1 rounded border border-purple-500/20">Click to flip</span>
        </div>
      </motion.div>

      {/* ==================== CARD 2: CLAUDE PRO ==================== */}
      <motion.div
        className="absolute w-[200px] sm:w-[220px] h-[250px] cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={getCardStyle(positions[1])}
        whileHover={{ y: -8, scale: positions[1] === 1 ? 1.08 : 0.9 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        onClick={() => {
          if (positions[1] === 1) setIsCenterFlipped(!isCenterFlipped);
        }}
      >
        {/* Front Face */}
        <div 
          style={faceStyle}
          className="bg-gradient-to-b from-[#1C1917]/85 to-[#0C0A09]/90 border border-white/10 rounded-2xl p-4 text-white shadow-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-amber-400 text-lg">✦</span>
            <span className="text-[8px] font-bold uppercase bg-amber-500/15 border border-amber-500/25 text-amber-300 px-2 py-0.5 rounded-full">AI Tool</span>
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight text-[#FAF5EA]">Claude Pro</h4>
            <p className="text-[10px] text-zinc-400">3 Months Access Slot</p>
          </div>
          <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-sm font-black text-amber-300">₹8,999</span>
            <span className="text-[9px] text-zinc-550 line-through">₹18,000</span>
          </div>
        </div>

        {/* Back Face */}
        <div 
          style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
          className="bg-[#161412] border border-amber-500/20 rounded-2xl p-4 text-white shadow-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-amber-400 text-xs font-bold">Slot Benefits</span>
            <span className="text-[7px] font-mono text-zinc-500 uppercase">TechNKT SLA</span>
          </div>
          <div className="space-y-1.5 my-auto text-left">
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-300">
              <span className="text-amber-400">✓</span> <span>5x Usage vs Free Tier</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-300">
              <span className="text-amber-400">✓</span> <span>Custom Claude Projects</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-300">
              <span className="text-amber-400">✓</span> <span>90 Days Repl. Warranty</span>
            </div>
          </div>
          <span className="text-[8px] font-black uppercase text-center text-amber-300 tracking-wider bg-amber-500/5 py-1 rounded border border-amber-500/10">Click to flip</span>
        </div>
      </motion.div>

      {/* ==================== CARD 3: NETFLIX PREMIUM ==================== */}
      <motion.div
        className="absolute w-[200px] sm:w-[220px] h-[250px] cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={getCardStyle(positions[2])}
        whileHover={{ y: -8, scale: positions[2] === 1 ? 1.08 : 0.9 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        onClick={() => {
          if (positions[2] === 1) setIsCenterFlipped(!isCenterFlipped);
        }}
      >
        {/* Front Face */}
        <div 
          style={faceStyle}
          className="bg-gradient-to-b from-[#1E080A]/85 to-[#0A0304]/90 border border-white/10 rounded-2xl p-4 text-white shadow-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-rose-600 font-black text-lg">N</span>
            <span className="text-[8px] font-bold uppercase bg-rose-500/15 border border-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">OTT</span>
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight">Netflix Premium</h4>
            <p className="text-[10px] text-zinc-450 mt-0.5">1 Month 4K Shared Slot</p>
          </div>
          <div className="pt-2 border-t border-zinc-900 flex justify-between items-center">
            <span className="text-sm font-black text-rose-450">₹80</span>
            <span className="text-[9px] text-zinc-555 line-through">₹199</span>
          </div>
        </div>

        {/* Back Face */}
        <div 
          style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
          className="bg-[#1D080A] border border-rose-500/25 rounded-2xl p-4 text-white shadow-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-rose-400 text-xs font-bold">Slot Benefits</span>
            <span className="text-[7px] font-mono text-rose-400 uppercase">Shared Account</span>
          </div>
          <div className="space-y-1.5 my-auto text-left">
            <div className="flex items-center gap-1.5 text-[9px] text-rose-100">
              <span className="text-rose-500">✓</span> <span>Ultra HD 4K Playback</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-rose-100">
              <span className="text-rose-500">✓</span> <span>Private Profile with PIN</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-rose-100">
              <span className="text-rose-500">✓</span> <span>Instant Access Credentials</span>
            </div>
          </div>
          <span className="text-[8px] font-black uppercase text-center text-rose-300 tracking-wider bg-rose-500/10 py-1 rounded border border-rose-500/20">Click to flip</span>
        </div>
      </motion.div>

    </div>
  );
}
